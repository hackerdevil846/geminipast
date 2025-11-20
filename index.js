// index.js (Production-Ready Handler)

const login = require("facebook-chat-api");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment-timezone");
const config = require("./config.json");

// --- Global Setup ---
global.client = {
    api: null,             // To hold the FCA API object
    adminBot: config.adminBot || [],
    commands: new Map(),   // Map to store commands (key: command name, value: command module)
    events: new Map(),     // Map to store event handlers
    prefix: config.prefix || "/"
};
global.config = config;

const timeZone = config.timeZone || "Asia/Dhaka";
const optionsFca = config.optionsFca || {};

// Function to log the bot's status with time
function logStatus(status, level = 'info') {
    const time = moment().tz(timeZone).format("HH:mm:ss DD/MM/YYYY");
    const color = level === 'error' ? chalk.red : level === 'warn' ? chalk.yellow : chalk.green;
    console.log(color(`[${time}] [GOAT-BOT-V2]`), status);
}

// --- Dynamic Module Loading ---
function loadModules(dir, map) {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        logStatus(chalk.red(`Directory not found: ${dir}`), 'error');
        return;
    }

    const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const modulePath = path.join(fullPath, file);
        try {
            // Clear require cache for hot-reloading (useful in development, but safe for production modularity)
            delete require.cache[require.resolve(modulePath)];
            const module = require(modulePath);
            if (module.config && module.onStart) {
                map.set(module.config.name.toLowerCase(), module);
                logStatus(chalk.magenta(`Loaded ${dir.split('/')[1].toUpperCase()} module: ${module.config.name}`), 'info');
            } else {
                logStatus(chalk.yellow(`Skipping invalid module: ${file} (Missing config or onStart)`), 'warn');
            }
        } catch (e) {
            logStatus(chalk.red(`Error loading module ${file}: ${e.message}`), 'error');
        }
    }
}

// --- Command Execution Handler ---
async function handleCommand(event) {
    const message = event.body ? event.body.trim() : "";
    
    if (!message.startsWith(global.client.prefix)) {
        return; // Not a command
    }

    const fullCommand = message.slice(global.client.prefix.length);
    const parts = fullCommand.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = global.client.commands.get(commandName);

    if (!command) {
        if (!global.config.hideNotiMessage.commandNotFound) {
             global.client.api.sendMessage(
                `Command "${commandName}" not found. Type ${global.client.prefix}help for a list of commands.`, 
                event.threadID, 
                event.messageID
            );
        }
        return;
    }
    
    // --- Basic Permission Check (Admin Only Mode) ---
    if (global.config.adminOnly.enable && !global.client.adminBot.includes(event.senderID)) {
        if (!global.config.adminOnly.ignoreCommand.includes(commandName) && !global.config.hideNotiMessage.adminOnly) {
            global.client.api.sendMessage(
                "Bot is currently in Admin-Only mode. Only the admin can use commands.",
                event.threadID,
                event.messageID
            );
        }
        return;
    }
    
    try {
        // Execute the command's main logic
        await command.onStart({
            api: global.client.api,
            message: event,
            args: args,
            config: command.config,
            commandName: commandName
        });
        logStatus(chalk.cyan(`[CMD:OK] Executed: ${commandName} by ${event.senderID} in ${event.threadID}`), 'info');
    } catch (e) {
        logStatus(chalk.red(`Error executing command ${commandName}: ${e.message}`), 'error');
        global.client.api.sendMessage(
            `An error occurred while running the command: \n${e.message}`,
            event.threadID,
            event.messageID
        );
    }
}

// --- FCA Login Function ---
function startBot() {
    // 1. Load Modules
    loadModules("scripts/cmds", global.client.commands);
    loadModules("scripts/events", global.client.events);
    
    let appstate;
    try {
        appstate = JSON.parse(fs.readFileSync(path.join(__dirname, "appstate.json"), "utf8"));
        logStatus(chalk.green("Appstate loaded. Attempting secure session login..."));
    } catch (e) {
        logStatus(chalk.red("FATAL ERROR: appstate.json missing or invalid. Bot cannot start."), 'error');
        return; 
    }

    login({ appState: appstate }, optionsFca, (err, api) => {
        if (err) {
            logStatus(chalk.red(`FCA Login Error: ${err.error || err}`), 'error');
            return;
        }

        global.client.api = api;
        logStatus(chalk.blue("Bot is now listening for events."));

        // 2. Start MQTT Listener
        api.listenMqtt(async (err, event) => {
            if (err) return console.error(chalk.red("MQTT Listener Error:"), err);

            // A. Handle Commands (Messages/Replies starting with prefix)
            if (event.type === "message" || event.type === "message_reply") {
                await handleCommand(event);
            }
            
            // B. Handle General Events (e.g., message_reaction, user_join)
            // The Goat Bot V2 uses a dedicated event file structure.
            // Loop through all loaded event modules and execute their onStart/onEvent logic
            for (const [name, module] of global.client.events) {
                if (module.onStart) {
                    try {
                        // Pass event data to the event handler
                        await module.onStart({ api: global.client.api, event: event });
                    } catch (e) {
                         logStatus(chalk.red(`Error in event module ${name}: ${e.message}`), 'error');
                    }
                }
            }
        });

        logStatus(chalk.green("GOAT BOT V2 is fully operational!"), 'info');
        logStatus(chalk.blue(`Prefix: ${global.client.prefix} | Admin ID: ${global.client.adminBot[0] || 'None'}`), 'info');
    });
}

// Start the bot application
startBot();
