/**
 * GOAT BOT MESSENGER BOT (V2)
 * Core Listener and Routing Logic: handler/listen.js
 *
 * This script is attached to the FCA listener and handles:
 * 1. Command detection (using the prefix).
 * 2. Event routing (message, reaction, user join, etc.)
 * 3. Command execution with proper context and error handling.
 */
const fs = require('fs');
const path = require('path');
const npmlog = require('npmlog');
const moment = require('moment-timezone');
const { api, prefix, commands, eventCommands, onReply, onReaction, config, languages } = global.GoatBot;

// --- UTILITY: Get Command/Event Arguments ---
function getArgs(event) {
    // Splits the message content based on the prefix for command execution
    const content = event.body.slice(prefix.length).trim();
    return content.split(/\s+/);
}

// --- MAIN HANDLER FUNCTION ---
function handleMessage(event) {
    if (event.type !== 'message' && event.type !== 'message_reply' && event.type !== 'message_unsend' && event.type !== 'message_reaction') {
        return handleEvent(event); // Route to event handler
    }

    const { senderID, body, threadID, messageID } = event;

    // --- 1. HANDLE REPLY/REACTION COMMANDS ---
    if (onReply.has(messageID)) {
        const command = onReply.get(messageID);
        // Execute onReply logic
        // ... (simplified for structure)
        return;
    }
    if (onReaction.has(messageID)) {
        const command = onReaction.get(messageID);
        // Execute onReaction logic
        // ... (simplified for structure)
        return;
    }

    // --- 2. COMMAND DETECTION & EXECUTION ---
    if (body && body.toLowerCase().startsWith(prefix.toLowerCase())) {
        const args = getArgs(event);
        const commandName = args.shift().toLowerCase();

        const command = commands.get(commandName) || Array.from(commands.values()).find(cmd => cmd.config.aliases && cmd.config.aliases.includes(commandName));

        if (!command) {
            if (!config.hideNotiMessage.commandNotFound) {
                api.sendMessage(languages.main.commandNotFound.replace('{prefix}', prefix), threadID);
            }
            return;
        }

        try {
            // Context object passed to every command function
            const context = {
                api,
                event,
                args,
                threadID,
                senderID,
                prefix,
                GoatBot: global.GoatBot,
                languages: languages // Access to language strings
            };
            
            // Execute the command's main function (onStart or onChat)
            if (command.onStart) {
                command.onStart(context);
            } else if (command.onChat) {
                command.onChat(context);
            }

        } catch (error) {
            npmlog.error('COMMAND_EXECUTION', `Error in command ${commandName}: ${error.message}`);
            api.sendMessage(`An error occurred while running command: ${commandName}. Error: ${error.message}`, threadID);
        }
    }
}

// --- EVENT HANDLER (Non-message events) ---
function handleEvent(event) {
    // Executes modular event scripts (e.g., welcome/farewell)
    for (const eventCmd of eventCommands.values()) {
        if (eventCmd.onStart) {
            eventCmd.onStart({ api, event, GoatBot: global.GoatBot });
        }
    }
}

// --- START THE LISTENER ---
npmlog.info('LISTENER', 'Starting Messenger MQTT Listener...');
const listen = api.listenMqtt(handleMessage);

// Export the listener handle for potential cleanup/restarts
module.exports = listen;
