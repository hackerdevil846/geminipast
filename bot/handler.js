// bot/handler.js

// Placeholder for loading commands/events (in a real app, this would be a dynamic import/require)
const commands = new Map(); // Map<commandName, commandModule>
const events = new Map(); // Map<eventName, eventModule>

// A simple example command placeholder for testing the handler
commands.set('help', {
    config: { name: 'help', prefix: true, description: 'Shows commands.' },
    run: ({ api, event, args }) => {
        const commandList = Array.from(commands.keys()).join(', ');
        api.sendMessage(`Available commands: ${commandList}`, event.threadID, event.messageID);
    }
});

function handler(event) {
    // 1. Check for errors or disabled events
    if (event.err) return console.error('Handler received event error:', event.err);
    if (global.GoatBot.config.logEvents.disableAll && event.type !== 'message') return;

    const api = global.GoatBot.api;
    const config = global.GoatBot.config;
    const prefix = config.prefix;

    // 2. Handle Commands (e.g., /help)
    if (event.type === 'message' || event.type === 'message_reply') {
        const body = event.body || "";
        
        if (body.startsWith(prefix)) {
            const parts = body.slice(prefix.length).trim().split(/\s+/);
            const commandName = parts[0].toLowerCase();
            const args = parts.slice(1);
            
            const command = commands.get(commandName);
            
            if (command) {
                // Simplified command execution (add real permission/cooldown checks here)
                try {
                    command.run({ api, event, args });
                } catch (error) {
                    console.error(`Error in command ${commandName}:`, error);
                    api.sendMessage(`An error occurred while running the /${commandName} command.`, event.threadID);
                }
            } else if (!config.hideNotiMessage.commandNotFound) {
                api.sendMessage(`Command '${commandName}' not found.`, event.threadID, event.messageID);
            }
        }
    }

    // 3. Handle Events (e.g., user join, reaction)
    // You would iterate through event modules here based on event.type
    // Example: events.get(event.type)?.run({ api, event });
}

module.exports = { handler };
