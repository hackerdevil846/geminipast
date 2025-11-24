"use strict";

var utils = require("./utils");
var cheerio = require("cheerio");
var log = require("npmlog");
var AuthManager = require("./src/AuthManager");

log.maxRecordSize = 100;
var checkVerified = null;

function setOptions(globalOptions, options) {
    Object.keys(options).map(function (key) {
        switch (key) {
            case 'pauseLog':
                if (options.pauseLog) log.pause();
                else log.resume();
                break;
            case 'logLevel':
                log.level = options.logLevel;
                globalOptions.logLevel = options.logLevel;
                break;
            case 'logRecordSize':
                log.maxRecordSize = options.logRecordSize;
                globalOptions.logRecordSize = options.logRecordSize;
                break;
            case 'pageID':
                globalOptions.pageID = options.pageID.toString();
                break;
            case 'userAgent':
                globalOptions.userAgent = (options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                break;
            case 'proxy':
                if (typeof options.proxy != "string") {
                    delete globalOptions.proxy;
                    utils.setProxy();
                } else {
                    globalOptions.proxy = options.proxy;
                    utils.setProxy(globalOptions.proxy);
                }
                break;
            default:
                globalOptions[key] = options[key];
                break;
        }
    });
}

function buildAPI(globalOptions, html, jar) {
    var maybeCookie = jar.getCookies("https://www.facebook.com").filter(function (val) {
        return val.cookieString().split("=")[0] === "c_user";
    });

    if (maybeCookie.length === 0) {
        throw { error: "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify." };
    }

    if (html.indexOf("/checkpoint/block/?next") > -1) {
        log.warn("login", "Checkpoint detected. Please check your account with a browser.");
    }

    var userID = maybeCookie[0].cookieString().split("=")[1].toString();
    log.info("login", `Logged in as ${userID}`);

    // Attempt to parse fb_dtsg
    let fb_dtsg = null;
    let irisSeqID = null;

    try {
        const $ = cheerio.load(html);
        // Method 1: Input field
        const dtsgInput = $('input[name="fb_dtsg"]').val();
        if(dtsgInput) fb_dtsg = dtsgInput;

        // Method 2: Scripts
        if(!fb_dtsg) {
            $('script').each((i, script) => {
                const content = $(script).html();
                if (content && content.includes('DTSGInitialData')) {
                    const match = content.match(/"token":"([^"]+)"/);
                    if (match) fb_dtsg = match[1];
                }
            });
        }
        
        // IRIS Seq ID
        const seqMatch = html.match(/"irisSeqID":"([^"]+)"/);
        if (seqMatch) irisSeqID = seqMatch[1];

    } catch(e) {
        log.verbose("buildAPI", "Failed to parse main HTML variables");
    }

    var clientID = (Math.random() * 2147483648 | 0).toString(16);

    // Default MQTT endpoint
    let mqttEndpoint = "wss://edge-chat.facebook.com/chat?region=prn"; 
    let region = "prn";

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
        fb_dtsg: fb_dtsg
    };

    var api = {
        setOptions: setOptions.bind(null, globalOptions),
        getAppState: function () {
            return utils.getAppState(jar);
        },
    };

    const defaultFuncs = utils.makeDefaults(html, userID, ctx);

    // Load all src files
    require('fs').readdirSync(__dirname + '/src/').forEach(function (file) {
        if (file.endsWith('.js') && file !== 'AuthManager.js') {
            var fileName = file.replace(/\.js$/, '');
            api[fileName] = require("./src/" + file)(defaultFuncs, api, ctx);
        }
    });

    return { ctx, defaultFuncs, api };
}

// MAIN LOGIN FUNCTION
function login(loginData, options, callback) {
    var globalOptions = {
        selfListen: false,
        listenEvents: true,
        listenTyping: false,
        updatePresence: false,
        forceLogin: false,
        autoMarkDelivery: true,
        autoMarkRead: false,
        autoReconnect: true,
        logRecordSize: 100,
        online: true,
        emitReady: false,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    };

    setOptions(globalOptions, options || {});

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

    // Initialize AuthManager
    // We assume loginData contains { email, password, appStatePath } or just appState
    // If using goatbot style, appStatePath usually 'appstate.json'
    const appStatePath = loginData.appStatePath || "appstate.json";
    const authManager = new AuthManager(loginData.email, loginData.password, appStatePath);

    async function executeLogin() {
        try {
            // 1. Get Valid AppState (either from file or via Playwright)
            const appState = await authManager.getAppState(globalOptions.forceLogin);
            
            // 2. Create Jar
            const jar = utils.getJar();
            appState.map(c => {
                const str = `${c.key}=${c.value}; expires=${c.expires}; domain=${c.domain}; path=${c.path};`;
                jar.setCookie(str, "https://" + c.domain);
            });

            // 3. Main Page Load to verify cookies & get fb_dtsg
            log.info("login", "Connecting to Facebook...");
            const res = await utils.get('https://www.facebook.com/', jar, null, globalOptions, { noRef: true });
            const html = res.body;

            // 4. Check if redirected to login (Cookie invalid)
            if (html.includes('id="login_form"') || html.includes('name="login"')) {
                log.warn("login", "Cookies invalid. Refreshing via Playwright...");
                // Force refresh
                fs.unlinkSync(appStatePath); 
                return executeLogin(); // Recursive call to trigger login
            }

            // 5. Build API
            var apiObj = buildAPI(globalOptions, html, jar);
            
            // 6. Return
            return callback(null, apiObj.api);

        } catch (e) {
            log.error("login", e);
            return callback(e);
        }
    }

    executeLogin();
    return returnPromise;
}

module.exports = login;
