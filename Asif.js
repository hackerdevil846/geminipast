/**
 * GOAT BOT V2 - Super Modified (Playwright Integrated)
 */

process.on('unhandledRejection', error => console.log("Unhandled Rejection:", error));
process.on('uncaughtException', error => console.log("Uncaught Exception:", error));

const axios = require("axios");
const fs = require("fs-extra");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const { execSync } = require('child_process');
const log = require('./logger/log.js');
const path = require("path");

process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

// ———————————————— CONFIG LOADER ———————————————— //
const { NODE_ENV } = process.env;
const dirConfig = path.normalize(`${__dirname}/config${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);
const dirConfigCommands = path.normalize(`${__dirname}/configCommands${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);
const dirAccount = path.normalize(`${__dirname}/account${['production', 'development'].includes(NODE_ENV) ? '.dev.txt' : '.txt'}`);

// Ensure configs exist
if (!fs.existsSync(dirConfig)) {
    log.err("CONFIG", "config.json not found! Please rename config.example.json.");
    process.exit(1);
}

const config = require(dirConfig);
const configCommands = require(dirConfigCommands);

// ———————————————— GLOBAL SETUP ———————————————— //
global.GoatBot = {
    startTime: Date.now(),
    commands: new Map(),
    eventCommands: new Map(),
    aliases: new Map(),
    onChat: [],
    onEvent: [],
    onReply: new Map(),
    onReaction: new Map(),
    onAnyEvent: [],
    config,
    configCommands,
    envCommands: configCommands.envCommands,
    envEvents: configCommands.envEvents,
    envGlobal: configCommands.envGlobal,
    reLoginBot: function () { }, 
    Listening: null,
    callbackListenTime: {},
    storage5Message: [],
    fcaApi: null,
    botID: null
};

global.db = {
    allThreadData: [],
    allUserData: [],
    allDashBoardData: [],
    allGlobalData: [],
    receivedTheFirstMessage: {}
};

global.client = {
    dirConfig,
    dirConfigCommands,
    dirAccount,
    countDown: {},
    database: {
        creatingThreadData: [],
        creatingUserData: [],
        creatingDashBoardData: []
    },
    commandBanned: configCommands.commandBanned
};

// Load Utils safely
const utils = require("./utils.js");
global.utils = utils;
const { colors, getText } = utils;

global.temp = {
    createThreadData: [],
    createUserData: [],
    createThreadDataError: [],
    filesOfGoogleDrive: { fileNames: {} },
    contentScripts: { cmds: {}, events: {} }
};

// ———————————————— MAIN STARTUP ———————————————— //
(async () => {
    // —————————— SAFE MAIL SETUP —————————— //
    try {
        const { gmailAccount } = config.credentials;
        if (gmailAccount && gmailAccount.clientId && gmailAccount.refreshToken) {
            const OAuth2 = google.auth.OAuth2;
            const OAuth2_client = new OAuth2(gmailAccount.clientId, gmailAccount.clientSecret);
            OAuth2_client.setCredentials({ refresh_token: gmailAccount.refreshToken });
            
            const accessToken = await OAuth2_client.getAccessToken();
            
            global.utils.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    user: gmailAccount.email,
                    clientId: gmailAccount.clientId,
                    clientSecret: gmailAccount.clientSecret,
                    refreshToken: gmailAccount.refreshToken,
                    accessToken
                }
            });
            // log.info("MAIL", "SMTP Transporter initialized.");
        }
    } catch (err) {
        log.warn("MAIL", "Failed to initialize Mail Service. Email features disabled.");
    }

    // —————————— SAFE GOOGLE DRIVE FOLDER —————————— //
    try {
        if (utils.drive && utils.drive.checkAndCreateParentFolder) {
            const parentIdGoogleDrive = await utils.drive.checkAndCreateParentFolder("GoatBot");
            utils.drive.parentID = parentIdGoogleDrive;
        }
    } catch (e) {
        // Ignore drive errors on startup
    }

    // —————————— LOGIN PROCESS —————————— //
    const loginPath = `./bot/login/login${NODE_ENV === 'development' ? '.dev.js' : '.js'}`;
    try {
        require(loginPath);
    } catch (e) {
        log.err("LOGIN", "Failed to load login script:", e);
    }

})();
