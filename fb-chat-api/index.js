"use strict";

var utils = require("./utils");
var cheerio = require("cheerio");
var log = require("npmlog");
var defaultLogRecordSize = 100;

log.maxRecordSize = defaultLogRecordSize;
var checkVerified = null;

// FIX: Added 'autoReconnect', 'emitReady', 'userAgent' to Boolean_Option for better handling
const Boolean_Option = ['online', 'selfListen', 'listenEvents', 'updatePresence', 'forceLogin', 'autoMarkDelivery', 'autoMarkRead', 'listenTyping', 'autoReconnect', 'emitReady', 'userAgent'];

function setOptions(globalOptions, options) {
    Object.keys(options).map(function (key) {
        switch (Boolean_Option.includes(key)) {
            case true: {
                globalOptions[key] = Boolean(options[key]);
                break;
            }
            case false: {
                switch (key) {
                    case 'pauseLog': {
                        if (options.pauseLog) log.pause();
                        else log.resume();
                        break;
                    }
                    case 'logLevel': {
                        log.level = options.logLevel;
                        globalOptions.logLevel = options.logLevel;
                        break;
                    }
                    case 'logRecordSize': {
                        log.maxRecordSize = options.logRecordSize;
                        globalOptions.logRecordSize = options.logRecordSize;
                        break;
                    }
                    case 'pageID': {
                        globalOptions.pageID = options.pageID.toString();
                        break;
                    }
                    case 'userAgent': {
                        // FIX: Auto-update UserAgent if not provided to prevent detection
                        globalOptions.userAgent = (options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
                        break;
                    }
                    case 'proxy': {
                        if (typeof options.proxy != "string") {
                            delete globalOptions.proxy;
                            utils.setProxy();
                        } else {
                            globalOptions.proxy = options.proxy;
                            utils.setProxy(globalOptions.proxy);
                        }
                        break;
                    }
                    default: {
                        log.warn("setOptions", "Unrecognized option given to setOptions: " + key);
                        break;
                    }
                }
                break;
            }
        }
    });
}

function buildAPI(globalOptions, html, jar) {
    let fb_dtsg = null;
    let irisSeqID = null;
    let accountDetectedError = false;

    // FIX: Massive Regex Update for finding 'fb_dtsg' (Token)
    // Facebook frequently changes where this token is hidden. This ensures we find it.
    function extractFromHTML() {
        try {
            const $ = cheerio.load(html);
            $('script').each((i, script) => {
                if (!fb_dtsg) {
                    const scriptText = $(script).html() || '';
                    const patterns = [
                        /\["DTSGInitialData",\[\],{"token":"([^"]+)"}]/,
                        /\["DTSGInitData",\[\],{"token":"([^"]+)"/,
                        /"token":"([^"]+)"/,
                        /{\\"token\\":\\"([^\\]+)\\"/,
                        /,\{"token":"([^"]+)"\},\d+\]/,
                        /"async_get_token":"([^"]+)"/,
                        /"dtsg":\{"token":"([^"]+)"/,
                        /DTSGInitialData[^>]+>([^<]+)/,
                        /name="fb_dtsg" value="([^"]+)"/,
                        /"fb_dtsg":"([^"]+)"/
                    ];
                    for (const pattern of patterns) {
                        const match = scriptText.match(pattern);
                        if (match && match[1]) {
                            try {
                                const possibleJson = match[1].replace(/\\"/g, '"');
                                const parsed = JSON.parse(possibleJson);
                                fb_dtsg = parsed.token || parsed;
                            } catch {
                                fb_dtsg = match[1];
                            }
                            if (fb_dtsg) break;
                        }
                    }
                }
            });
            
            // Fallback: finding input tag directly
            if (!fb_dtsg) {
                const dtsgInput = $('input[name="fb_dtsg"]').val();
                if (dtsgInput) fb_dtsg = dtsgInput;
            }
            
            const seqMatches = html.match(/irisSeqID":"([^"]+)"/);
            if (seqMatches && seqMatches[1]) {
                irisSeqID = seqMatches[1];
            }
            try {
                const jsonMatches = html.match(/\{"dtsg":({[^}]+})/);
                if (jsonMatches && jsonMatches[1]) {
                    const dtsgData = JSON.parse(jsonMatches[1]);
                    if (dtsgData.token) fb_dtsg = dtsgData.token;
                }
            } catch { }
        } catch (e) {
            log.verbose("extractFromHTML", "Error extracting DTSG", e);
        }
    }
    extractFromHTML();

    var userID;
    var cookies = jar.getCookies("https://www.facebook.com");
    var userCookie = cookies.find(cookie => cookie.cookieString().startsWith("c_user="));
    var tiktikCookie = cookies.find(cookie => cookie.cookieString().startsWith("i_user="));
    
    if (!userCookie && !tiktikCookie) {
        // If we can't find the user ID, it usually means the cookie is dead or IP banned
        return log.error('login', "Error retrieving userID. This can be caused by a lot of things, including being blocked by Facebook for logging in from an unknown location. Try logging in with a browser (and handle the login approval).");
    }

    if (html.includes("/checkpoint/block/?next")) {
        return log.error('login', "Appstate dead (Checkpoint detected). Please replace appstate.", 'error');
    }

    userID = (tiktikCookie || userCookie).cookieString().split("=")[1];

    try { clearInterval(checkVerified); } catch (_) { }
    
    const clientID = (Math.random() * 2147483648 | 0).toString(16);
    let mqttEndpoint = `wss://edge-chat.facebook.com/chat?region=prn&sid=${userID}`;
    let region = "PRN";

    // FIX: Detection for "Automated Behavior" error (601051028565049)
    try {
        const endpointMatch = html.match(/"endpoint":"([^"]+)"/);
        
        if (html.includes("601051028565049") || (endpointMatch && endpointMatch.input.includes("601051028565049"))) {
            // This is the specific error code for "Account temporarily unavailable" due to bot detection
            log.error("login", "Account flagged by automated systems (Error 601051028565049). Please wait a few hours or change IP.");
            accountDetectedError = true;
        }

        if (endpointMatch) {
            mqttEndpoint = endpointMatch[1].replace(/\\\//g, '/');
            const url = new URL(mqttEndpoint);
            region = url.searchParams.get('region')?.toUpperCase() || "PRN";
        }
    } catch (e) {
        log.verbose('login', 'Using default MQTT endpoint');
    }

    // Critical check: If no DTSG found, the session is practically useless for sending messages
    if (!fb_dtsg && !accountDetectedError) {
        log.warn("login", "Could not retrieve fb_dtsg. This often means the session is invalid or the structure changed. Retrying might work.");
    }

    var ctx = {
        userID: userID,
        jar: jar,
        clientID: clientID,
        globalOptions: globalOptions,
        loggedIn: true,
        access_token: 'NONE',
        clientMutationId: 0,
        mqttClient: undefined,
        lastSeqId: irisSeqID,
        syncToken: undefined,
        mqttEndpoint: mqttEndpoint,
        region: region,
        firstListen: true,
        fb_dtsg: fb_dtsg,
        req_ID: 0,
        callback_Task: {},
        wsReqNumber: 0,
        wsTaskNumber: 0,
        reqCallbacks: {}
    };

    var api = {
        setOptions: setOptions.bind(null, globalOptions),
        getAppState: () => utils.getAppState(jar),
        postFormData: (url, body) => utils.makeDefaults(html, userID, ctx).postFormData(url, ctx.jar, body)
    };

    var defaultFuncs = utils.makeDefaults(html, userID, ctx);
    api.postFormData = function (url, body) {
        return defaultFuncs.postFormData(url, ctx.jar, body);
    };

    // FIX: Robust getFreshDtsg to prevent logout loop
    api.getFreshDtsg = async function () {
        try {
            const res = await defaultFuncs.get('https://www.facebook.com/', jar, null, globalOptions);
            const $ = cheerio.load(res.body);
            let newDtsg;
            const patterns = [
                /\["DTSGInitialData",\[\],{"token":"([^"]+)"}]/,
                /\["DTSGInitData",\[\],{"token":"([^"]+)"/,
                /"token":"([^"]+)"/,
                /name="fb_dtsg" value="([^"]+)"/,
                /DTSGInitialData[^>]+>([^<]+)/
            ];

            $('script').each((i, script) => {
                if (!newDtsg) {
                    const scriptText = $(script).html() || '';
                    for (const pattern of patterns) {
                        const match = scriptText.match(pattern);
                        if (match && match[1]) {
                            newDtsg = match[1];
                            break;
                        }
                    }
                }
            });

            if (!newDtsg) {
                newDtsg = $('input[name="fb_dtsg"]').val();
            }

            return newDtsg;
        } catch (e) {
            log.error("getFreshDtsg", "Error getting fresh dtsg:", e);
            return null;
        }
    };

    // Load all modules from src folder
    require('fs').readdirSync(__dirname + '/src/').filter(v => v.endsWith('.js')).forEach(v => { 
        api[v.replace('.js', '')] = require(`./src/${v}`)(utils.makeDefaults(html, userID, ctx), api, ctx); 
    });
    
    api.listen = api.listenMqtt;
    
    return {
        ctx,
        defaultFuncs,
        api
    };
}

// Function to handle login with Email and Password (for initial generation of AppState)
function makeLogin(jar, email, password, loginOptions, callback, prCallback) {
    return async function (res) {
        try {
            const html = res.body;
            const $ = cheerio.load(html);
            let arr = [];
            $("#login_form input").each((i, v) => arr.push({ val: $(v).val(), name: $(v).attr("name") }));
            arr = arr.filter(v => v.val && v.val.length);
            let form = utils.arrToForm(arr);
            form.lsd = utils.getFrom(html, "[\"LSD\",[],{\"token\":\"", "\"}");
            form.lgndim = Buffer.from(JSON.stringify({ w: 1440, h: 900, aw: 1440, ah: 834, c: 24 })).toString('base64');
            form.email = email;
            form.pass = password;
            form.default_persistent = '0';
            form.lgnrnd = utils.getFrom(html, "name=\"lgnrnd\" value=\"", "\"");
            form.locale = 'en_US';
            form.timezone = '240';
            form.lgnjs = Math.floor(Date.now() / 1000);
            
            const willBeCookies = html.split("\"_js_");
            willBeCookies.slice(1).forEach(val => {
                const cookieData = JSON.parse("[\"" + utils.getFrom(val, "", "]") + "]");
                jar.setCookie(utils.formatCookie(cookieData, "facebook"), "https://www.facebook.com");
            });
            
            log.info("login", "Logging in...");
            const loginRes = await utils.post(
                "https://www.facebook.com/login/device-based/regular/login/?login_attempt=1&lwv=110",
                jar,
                form,
                loginOptions
            );
            
            await utils.saveCookies(jar)(loginRes);
            const headers = loginRes.headers;
            
            if (!headers.location) throw new Error("Wrong username/password.");
            
            // Check for 2FA/Checkpoint
            if (headers.location.includes('https://www.facebook.com/checkpoint/')) {
                log.info("login", "You have login approvals turned on.");
                const checkpointRes = await utils.get(headers.location, jar, null, loginOptions);
                await utils.saveCookies(jar)(checkpointRes);
                const checkpointHtml = checkpointRes.body;
                const $ = cheerio.load(checkpointHtml);
                let checkpointForm = [];
                $("form input").each((i, v) => checkpointForm.push({ val: $(v).val(), name: $(v).attr("name") }));
                checkpointForm = checkpointForm.filter(v => v.val && v.val.length);
                const form = utils.arrToForm(checkpointForm);
                
                if (checkpointHtml.includes("checkpoint/?next")) {
                    return new Promise((resolve, reject) => {
                        const submit2FA = async (code) => {
                            try {
                                form.approvals_code = code;
                                form['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                const approvalRes = await utils.post(
                                    "https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php",
                                    jar,
                                    form,
                                    loginOptions
                                );
                                await utils.saveCookies(jar)(approvalRes);
                                const approvalError = $("#approvals_code").parent().attr("data-xui-error");
                                if (approvalError) throw new Error("Invalid 2FA code.");
                                form.name_action_selected = 'dont_save';
                                const finalRes = await utils.post(
                                    "https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php",
                                    jar,
                                    form,
                                    loginOptions
                                );
                                await utils.saveCookies(jar)(finalRes);
                                const appState = utils.getAppState(jar);
                                resolve(await loginHelper(appState, email, password, loginOptions, callback));
                            } catch (error) {
                                reject(error);
                            }
                        };
                        throw {
                            error: 'login-approval',
                            continue: submit2FA
                        };
                    });
                }
                
                if (!loginOptions.forceLogin) throw new Error("Couldn't login. Facebook might have blocked this account.");
                
                form['submit[This was me]'] = checkpointHtml.includes("Suspicious Login Attempt") ? "This was me" : "This Is Okay";
                await utils.post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", jar, form, loginOptions);
                
                form.name_action_selected = 'save_device';
                const reviewRes = await utils.post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", jar, form, loginOptions);
                const appState = utils.getAppState(jar);
                return await loginHelper(appState, email, password, loginOptions, callback);
            }
            
            await utils.get('https://www.facebook.com/', jar, null, loginOptions);
            return await utils.saveCookies(jar);
        } catch (error) {
            callback(error);
        }
    };
}


// Main Helper function to set up the API after cookies are set
function loginHelper(appState, email, password, globalOptions, callback, prCallback) {
    let mainPromise = null;
    const jar = utils.getJar();
    
    // FIX: Enhanced AppState parsing to handle various formats (JSON string, Object, Array)
    if (appState) {
        try {
            if (typeof appState === 'string') {
                try {
                    appState = JSON.parse(appState);
                } catch (e) {
                    // if it fails to parse as JSON, it might be the raw Netscape format or something else
                    // but usually it's JSON. If not, we let it slide to the catch block.
                }
            }
        } catch (e) {
            return callback(new Error("Failed to parse appState"));
        }

        try {
            appState.forEach(c => {
                const str = `${c.key}=${c.value}; expires=${c.expires}; domain=${c.domain}; path=${c.path};`;
                jar.setCookie(str, "http://" + c.domain);
            });

            mainPromise = utils.get('https://www.facebook.com/', jar, null, globalOptions, { noRef: true })
                .then(utils.saveCookies(jar));
        } catch (e) {
            // This happens if appState is invalid
            log.warn("login", "AppState parsing failed, proceeding might fail.");
            // process.exit(0); // Removing exit to prevent hard crash, callback error instead
            return callback(new Error("AppState format is invalid. Please check your account.txt or appstate.json"));
        }
    } else {
        mainPromise = utils
            .get("https://www.facebook.com/", null, null, globalOptions, { noRef: true })
            .then(utils.saveCookies(jar))
            .then(makeLogin(jar, email, password, globalOptions, callback, prCallback))
            .then(() => utils.get('https://www.facebook.com/', jar, null, globalOptions).then(utils.saveCookies(jar)));
    }

    // Function to handle redirection (common during login flow)
    function handleRedirect(res) {
        const reg = /<meta http-equiv="refresh" content="0;url=([^"]+)[^>]+>/;
        const redirect = reg.exec(res.body);
        if (redirect && redirect[1]) {
            return utils.get(redirect[1], jar, null, globalOptions).then(utils.saveCookies(jar));
        }
        return res;
    }

    let ctx, api;
    
    // Chain promises to load the page, build API, and finalize
    mainPromise = mainPromise
        .then(handleRedirect)
        .then(res => {
            // Check if we are stuck on a mobile page or checkpoint
            const mobileAgentRegex = /MPageLoadClientMetrics/gs;
            if (!mobileAgentRegex.test(res.body)) {
                // If it looks like we are not on the main page, try reloading with the desktop User Agent explicitly
                globalOptions.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
                return utils.get('https://www.facebook.com/', jar, null, globalOptions, { noRef: true }).then(utils.saveCookies(jar));
            }
            return res;
        })
        .then(handleRedirect)
        .then(res => {
            const html = res.body;
            const Obj = buildAPI(globalOptions, html, jar);
            ctx = Obj.ctx;
            api = Obj.api;
            return res;
        });

    // If PageID is provided, switch context to the page
    if (globalOptions.pageID) {
        mainPromise = mainPromise
            .then(() => utils.get(`https://www.facebook.com/${globalOptions.pageID}/messages/?section=messages&subsection=inbox`, jar, null, globalOptions))
            .then(resData => {
                let url = utils.getFrom(resData.body, 'window.location.replace("https:\\/\\/www.facebook.com\\', '");').split('\\').join('');
                url = url.substring(0, url.length - 1);
                return utils.get('https://www.facebook.com' + url, jar, null, globalOptions);
            });
    }

    // Finalize logic
    mainPromise
        .then(async () => {
            log.info('login', 'Logged in successfully!');
            log.info('login', 'Fix by Asif (FCA Anti-Ban Patch)');
            callback(null, api);
        })
        .catch(e => {
            log.error("login", e.error || e);
            callback(e);
        });
}


// MAIN EXPORTED FUNCTION
function login(loginData, options, callback) {
    if (utils.getType(options) === 'Function' || utils.getType(options) === 'AsyncFunction') {
        callback = options;
        options = {};
    }

    // FIX: Updated Default Options to prevent detection
    var globalOptions = {
        selfListen: false,
        listenEvents: true,
        listenTyping: false,
        updatePresence: false,
        forceLogin: false,
        autoMarkDelivery: false,
        autoMarkRead: false,
        autoReconnect: true,
        logRecordSize: defaultLogRecordSize,
        online: false,
        emitReady: false,
        // Using a very modern User Agent (Windows 10, Chrome 128)
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    };

    var prCallback = null;
    if (utils.getType(callback) !== "Function" && utils.getType(callback) !== "AsyncFunction") {
        var rejectFunc = null;
        var resolveFunc = null;
        var returnPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });
        prCallback = function (error, api) {
            if (error) return rejectFunc(error);
            return resolveFunc(api);
        };
        callback = prCallback;
    }

    // Handle Login with Email/Password (Less recommended, better to use AppState)
    if (loginData.email && loginData.password) {
        setOptions(globalOptions, {
            logLevel: "silent",
            forceLogin: true,
            userAgent: globalOptions.userAgent
        });
        loginHelper(loginData.appState, loginData.email, loginData.password, globalOptions, callback, prCallback);
    } 
    // Handle Login with AppState (Recommended)
    else if (loginData.appState) {
        setOptions(globalOptions, options);
        return loginHelper(loginData.appState, loginData.email, loginData.password, globalOptions, callback, prCallback);
    }
    return returnPromise;
}

module.exports = login;
