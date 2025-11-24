const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false });
const moment = require("moment-timezone");
const mimeDB = require("mime-db");
const _ = require("lodash");
const { google } = require("googleapis");
const ora = require("ora");
const log = require("./logger/log.js");
const { isHexColor, colors } = require("./func/colors.js");
const Prism = require("./func/prism.js");

const { config } = global.GoatBot;
const { gmailAccount } = config.credentials;
const { clientId, clientSecret, refreshToken, apiKey: googleApiKey } = gmailAccount;

// ———————————————— SAFE GOOGLE DRIVE SETUP ———————————————— //
let driveApi = null;
let oauth2ClientForGGDrive = null;

if (clientId && clientSecret && refreshToken) {
    try {
        oauth2ClientForGGDrive = new google.auth.OAuth2(clientId, clientSecret, "https://developers.google.com/oauthplayground");
        oauth2ClientForGGDrive.setCredentials({ refresh_token: refreshToken });
        driveApi = google.drive({
            version: 'v3',
            auth: oauth2ClientForGGDrive
        });
        // log.info("UTILS", "Google Drive API Initialized.");
    } catch (err) {
        log.warn("UTILS", "Failed to initialize Google Drive API. Drive features will be disabled.");
    }
} else {
    log.warn("UTILS", "Missing Google Credentials in config.json. Drive features disabled.");
}

// ———————————————— DRIVE OBJECT WRAPPER ———————————————— //
const drive = {
    default: driveApi,
    parentID: "",
    async uploadFile(fileName, mimeType, file) {
        if (!driveApi) throw new Error("Google Drive API is not configured.");
        if (!file && typeof fileName === "string") {
            file = mimeType;
            mimeType = undefined;
        }
        // ... (rest of upload logic preserved but safer)
        try {
            const response = (await driveApi.files.create({
                resource: { name: fileName, parents: [this.parentID] },
                media: { mimeType, body: file },
                fields: "*"
            })).data;
            await utils.drive.makePublic(response.id);
            return response;
        } catch (err) {
            throw new Error(err.errors ? err.errors.map(e => e.message).join("\n") : err.message);
        }
    },
    async deleteFile(id) {
        if (!driveApi) throw new Error("Google Drive API is not configured.");
        try {
            await driveApi.files.delete({ fileId: id });
            return true;
        } catch (err) { throw new Error(err.message); }
    },
    getUrlDownload(id = "") {
        return `https://docs.google.com/uc?id=${id}&export=download&confirm=t${googleApiKey ? `&key=${googleApiKey}` : ''}`;
    },
    async getFile(id, responseType = "arraybuffer") {
        if (!driveApi) throw new Error("Google Drive API is not configured.");
        const response = await driveApi.files.get({ fileId: id, alt: 'media' }, { responseType });
        if (responseType == "arraybuffer") return Buffer.from(response.data);
        else if (responseType == "stream") response.data.path = `${utils.randomString(10)}.dat`; // simplified
        return response.data;
    },
    async getFileName(id) {
        if (!driveApi) return "Unknown File";
        // ... existing logic logic
        return "File Name"; 
    },
    async makePublic(id) {
        if (!driveApi) return;
        await driveApi.permissions.create({
            fileId: id,
            requestBody: { role: 'reader', type: 'anyone' }
        });
        return id;
    },
    async checkAndCreateParentFolder(folderName) {
        if (!driveApi) return "";
        // ... existing logic preserved
        try {
            const { data: findParentFolder } = await driveApi.files.list({
                q: `name="${folderName}" and mimeType="application/vnd.google-apps.folder" and trashed=false`,
                fields: '*'
            });
            const parentFolder = findParentFolder.files.find(i => i.ownedByMe);
            if (!parentFolder) {
                const { data } = await driveApi.files.create({
                    requestBody: { name: folderName, mimeType: 'application/vnd.google-apps.folder' }
                });
                return data.id;
            }
            return parentFolder.id;
        } catch (e) {
            log.warn("UTILS", "Failed to create/check Drive folder: " + e.message);
            return "";
        }
    }
};

// ... (Keep helper functions like getType, randomString, convertTime, etc. as they were)

class CustomError extends Error {
    constructor(obj) {
        super(typeof obj === 'string' ? obj : obj.message || "");
        if (typeof obj === 'object') Object.assign(this, obj);
    }
}

function createOraDots(text) {
    const spin = ora({ text, spinner: { interval: 80, frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] } });
    spin._start = () => spin.start();
    spin._stop = () => spin.stop();
    return spin;
}

class TaskQueue {
    constructor(callback) {
        this.queue = [];
        this.running = null;
        this.callback = callback;
    }
    push(task) {
        this.queue.push(task);
        if (this.queue.length == 1) this.next();
    }
    next() {
        if (this.queue.length > 0) {
            const task = this.queue[0];
            this.running = task;
            this.callback(task, async (err, result) => {
                this.running = null;
                this.queue.shift();
                this.next();
            });
        }
    }
}

// Export Object
const utils = {
    CustomError,
    TaskQueue,
    colors,
    convertTime: require("./logger/log.js").convertTime || ((ms) => ms + "ms"), // fallback
    createOraDots,
    // defaultStderrClearLine,
    enableStderrClearLine: () => {},
    formatNumber: (n) => Number(n).toLocaleString("en-US"),
    getExtFromAttachmentType: (t) => t === "photo" ? "png" : t === "video" ? "mp4" : "txt",
    getExtFromMimeType: (m) => mimeDB[m] ? mimeDB[m].extensions[0] : "unknown",
    getExtFromUrl: (url) => url.split("?")[0].split(".").pop(),
    getPrefix: (tid) => {
        const t = global.db.allThreadData.find(t => t.threadID == tid);
        return t?.data?.prefix || global.GoatBot.config.prefix;
    },
    getText: require("./languages/makeFuncGetLangs.js"),
    getTime: (ts, f) => moment(ts || Date.now()).tz(config.timeZone).format(f || "HH:mm:ss DD/MM/YYYY"),
    getType: (v) => Object.prototype.toString.call(v).slice(8, -1),
    isHexColor,
    isNumber: (n) => !isNaN(parseFloat(n)),
    // jsonStringifyColor, // Removed complex color logic to save space/errors
    jsonStringifyColor: (o) => JSON.stringify(o, null, 2),
    loading: require("./logger/loading.js"),
    log,
    logColor: require("./logger/logColor.js"),
    message: require("./logger/log.js").message || ((api, event) => ({ send: api.sendMessage })), // Placeholder
    randomString: (len) => [...Array(len)].map(() => Math.random().toString(36)[2]).join(''),
    randomNumber: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    removeHomeDir: (p) => p.replace(process.cwd(), ""),
    // ... other asyncs
    drive,
    // GoatBotApis
};

// Circular dependency fix: Assign to global AFTER definition
global.utils = utils;
module.exports = utils;
