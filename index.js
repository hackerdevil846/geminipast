/**
 * GOAT BOT MESSENGER BOT (V2)
 * Main Entry Point: index.js
 * Original Author: NTKhang
 * Optimized/Enhanced: Asif Mahmud
 *
 * This production-ready script initializes the FCA, loads configuration from
 * config.json, and sets up the modular command and event handlers.
 * It is configured to use appstate.json for secure session login.
 */

// --- CORE MODULES ---
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const moment = require('moment-timezone');
const npmlog = require('npmlog');
const login = require('facebook-chat-api'); // Use your specific FCA library if different
const GoatBot = {};

// --- Configuration Setup ---
GoatBot.dir = path.join(process.cwd());
GoatBot.config = require(path.join(GoatBot.dir, 'config.json'));
GoatBot.dirConfigs = path.join(GoatBot.dir, 'configs');
GoatBot.dirModules = path.join(GoatBot.dir, 'scripts');
GoatBot.dirCommands = path.join(GoatBot.dirModules, 'cmds');
GoatBot.dirEvents = path.join(GoatBot.dirModules, 'events');
GoatBot.dirLangs = path.join(GoatBot.dir, 'languages');
GoatBot.configCommands = {};
GoatBot.commands = new Map();
GoatBot.eventCommands = new Map();
GoatBot.onReply = new Map();
GoatBot.onReaction = new Map();
GoatBot.languages = {};

global.GoatBot = GoatBot;

// --- UTILITY FUNCTIONS ---

/**
 * Loads the language strings for the bot's configured language.
 */
function loadLanguage() {
    const langCode = GoatBot.config.language.toLowerCase();
    const langPath = path.join(GoatBot.dirLangs, `${langCode}.json`);

    try {
        if (fs.existsSync(langPath)) {
            GoatBot.languages.main = require(langPath);
            npmlog.info('LANGUAGE', `Loaded main language: ${langCode.toUpperCase()}`);
        } else {
            npmlog.error('LANGUAGE', `Language file not found for: ${langCode.toUpperCase()}. Using default (English).`);
            GoatBot.languages.main = require(path.join(GoatBot.dirLangs, 'en.json'));
            GoatBot.config.language = 'en';
        }
    } catch (error) {
        npmlog.error('LANGUAGE_LOAD', error.message);
        process.exit(1);
    }
}

/**
 * Loads all command and event files from their respective directories.
 */
function loadScripts(type, dir) {
    let count = 0;
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    const map = type === 'commands' ? GoatBot.commands : GoatBot.eventCommands;

    for (const file of files) {
        try {
            delete require.cache[require.resolve(path.join(dir, file))];
            const script = require(path.join(dir, file));

            if (!script.config || !script.config.name) {
                npmlog.warn(type.toUpperCase(), `Script '${file}' missing config or name.`);
                continue;
            }

            const commandName = script.config.name.toLowerCase();

            if (map.has(commandName)) {
                npmlog.warn(type.toUpperCase(), `Duplicate ${type} name found: ${commandName}. Skipping '${file}'.`);
                continue;
            }

            map.set(commandName, script);
            count++;

        } catch (error) {
            npmlog.error(type.toUpperCase(), `Failed to load '${file}': ${error.message}`);
        }
    }
    npmlog.info(type.toUpperCase(), `Loaded ${count} ${type}.`);
}

/**
 * Main function to start the bot process.
 */
async function startBot() {
    console.log(chalk.yellow(figlet.textSync('GOAT BOT V2', { horizontalLayout: 'full' })));
    npmlog.info('CORE', `Running on Node ${process.version}`);
    npmlog.info('CONFIG', `Timezone set to ${GoatBot.config.timeZone}`);
    moment.tz.setDefault(GoatBot.config.timeZone);

    loadLanguage();
    loadScripts('commands', GoatBot.dirCommands);
    loadScripts('events', GoatBot.dirEvents);

    const fcaOptions = {
        ...GoatBot.config.optionsFca,
        forceLogin: true // Ensure appstate is used
    };

    // --- SECURE LOGIN VIA APPSTATE.JSON ---
    const appStatePath = path.join(GoatBot.dir, 'appstate.json');

    if (fs.existsSync(appStatePath)) {
        npmlog.info('LOGIN', 'Attempting secure login using appstate.json...');
        fcaOptions.appState = JSON.parse(fs.readFileSync(appStatePath, 'utf8'));
    } else if (GoatBot.config.facebookAccount.email && GoatBot.config.facebookAccount.password) {
        npmlog.warn('LOGIN', 'appstate.json not found. Falling back to username/password login from config.json (INSECURE).');
        fcaOptions.email = GoatBot.config.facebookAccount.email;
        fcaOptions.password = GoatBot.config.facebookAccount.password;
        fcaOptions.secret = GoatBot.config.facebookAccount['2FASecret'];
    } else {
        npmlog.error('LOGIN', 'Critical Error: appstate.json not found and credentials are empty in config.json. Cannot log in.');
        process.exit(1);
    }

    login(fcaOptions, async (err, api) => {
        if (err) {
            if (err.error === 'login_to_fetch_data') {
                npmlog.error('LOGIN_FAIL', 'Failed to log in. Check appstate.json integrity or credentials.');
            } else {
                npmlog.error('LOGIN_FAIL', err.error || err);
            }
            return process.exit(1);
        }

        npmlog.info('LOGIN', `Successfully logged in as: ${api.getCurrentUserID()}`);

        // Save new appstate for session persistence
        try {
            fs.writeFileSync(appStatePath, JSON.stringify(api.getAppState(), null, 2));
            npmlog.info('LOGIN', 'Updated appstate.json for next session.');
        } catch (e) {
            npmlog.error('APPSTATE_SAVE', 'Failed to save appstate.json:', e);
        }

        // --- GLOBAL SETUP ---
        global.GoatBot.api = api;
        global.GoatBot.client = api; // Alias for compatibility
        global.GoatBot.prefix = GoatBot.config.prefix;

        // --- START LISTENER & HANDLERS ---
        require('./handler/listen.js'); // Assuming core logic is separated into a handler folder

        // If dashboard is enabled, start the web server (code not provided here)
        if (GoatBot.config.dashBoard.enable) {
            npmlog.info('DASHBOARD', `Dashboard enabled on port ${GoatBot.config.dashBoard.port}`);
            // require('./server/index.js'); // Hypothetical dashboard file
        }
    });
}

// --- INITIALIZE BOT ---
startBot();
