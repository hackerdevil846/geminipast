// index.js (Standard FCA Bot Entry Point)
const login = require("facebook-chat-api");
const fs = require("fs-extra");
const path = require("path");
const config = require("./config.json");
const moment = require("moment-timezone");
const chalk = require("chalk");

// --- Configuration Setup ---
const adminBot = config.adminBot || [];
const prefix = config.prefix || "/";
const language = config.language || "en";
const optionsFca = config.optionsFca || {};
const timeZone = config.timeZone || "Asia/Dhaka";
global.client = {}; // Global object for API and data
global.config = config;

// Function to log the bot's status
function logStatus(status) {
    const time = moment().tz(timeZone).format("HH:mm:ss DD/MM/YYYY");
    console.log(chalk.yellow(`[${time}]`), status);
}

// --- FCA Login Function ---
function startBot() {
    let appstate;
    try {
        // PRODUCTION-READY: Read appstate.json for secure login
        appstate = JSON.parse(fs.readFileSync(path.join(__dirname, "appstate.json"), "utf8"));
        logStatus(chalk.green("Appstate found. Attempting session-based login..."));
    } catch (e) {
        logStatus(chalk.red("FATAL ERROR: appstate.json not found or invalid. Please generate it."));
        return; // Stop if appstate.json is not present/valid
    }

    login({ appState: appstate }, optionsFca, (err, api) => {
        if (err) {
            logStatus(chalk.red("FCA Login Error. Checking for password attempt..."));
            if (err.error == 'login-approval') {
                logStatus(chalk.yellow('Login approval required. Check the console/log for further instructions.'));
                // In a real production setup, you would need a mechanism to handle this.
            } else {
                logStatus(chalk.red(`FATAL LOGIN ERROR: ${err}`));
            }
            return;
        }

        // Save the API and Admin IDs globally
        global.client.api = api;
        global.client.adminBot = adminBot;

        // --- Event Listener ---
        api.listenMqtt(async (err, event) => {
            if (err) return console.error(chalk.red("MQTT Listener Error:"), err);

            // 1. Core Event Handling (Example: message event)
            if (event.type === "message" || event.type === "message_reply") {
                const message = event.body ? event.body.trim() : "";

                if (message.startsWith(prefix)) {
                    // Extract command and arguments
                    const command = message.split(" ")[0].slice(prefix.length).toLowerCase();
                    const args = message.split(" ").slice(1);
                    
                    // TODO: Implement command loading and execution logic here
                    // This is where scripts/cmds/ are loaded and run.
                    
                    logStatus(chalk.cyan(`[CMD] User ${event.senderID} ran: ${command}`));

                } else if (config.logEvents.message) {
                    // Log non-command messages
                    logStatus(chalk.white(`[MSG] ${event.senderID}: ${event.body}`));
                }
            }
            
            // 2. Event Handling for scripts/events/
            // TODO: Implement event file loading and execution logic (e.g., message_reaction, event)

        });

        logStatus(chalk.green("Bot is RUNNING successfully!"));
        logStatus(chalk.blue(`Prefix: ${prefix} | Timezone: ${timeZone}`));
        api.setOptions({ listenEvents: true });
    });
}

// Start the bot application
startBot();
