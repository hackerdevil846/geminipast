// index.js
const fs = require('fs-extra');
const path = require('path');
const { login } = require('./bot/login');
const { handler } = require('./bot/handler');
const { loadConfig } = require('./bot/config');
const { loadLanguages } = require('./bot/utils/language'); // Assuming you have a language utility

// --- Global Setup ---
global.GoatBot = global.GoatBot || {}; // Global object for shared resources (API, config, commands)
global.GoatBot.startTime = Date.now();

// --- Main Bot Start Function ---
async function startBot() {
    console.log('--- 🐐 Goat-Bot-V2 Initializing ---');
    
    // 1. Load Configuration (config.json)
    try {
        global.GoatBot.config = loadConfig(path.join(__dirname, 'config.json'));
        console.log(`✅ Config loaded. Prefix: ${global.GoatBot.config.prefix}, Timezone: ${global.GoatBot.config.timeZone}`);
    } catch (error) {
        console.error('❌ FATAL: Could not load configuration.', error.message);
        process.exit(1);
    }
    
    // 2. Load Language Files
    try {
        // Assuming a languages/ folder structure and a loadLanguages function
        global.GoatBot.languages = loadLanguages(global.GoatBot.config.language);
        console.log(`✅ Language loaded: ${global.GoatBot.config.language}`);
    } catch (error) {
        console.warn(`⚠️ Warning: Could not load language files for ${global.GoatBot.config.language}. Falling back to default.`);
    }

    // 3. FCA Login (using appstate.json)
    const loginData = await login();
    global.GoatBot.api = loginData.api;
    global.GoatBot.botID = loginData.api.getCurrentUserID();

    // 4. Load Scripts (Commands/Events)
    // NOTE: In a full production system, you'd load the scripts/ directory here.
    // For brevity, we'll assume the handler imports/requires them when needed.
    // A fully loaded system would involve checking script names, aliases, and metadata.
    console.log('... Scripts and Database connection logic will load commands/events in a real production build.');

    // 5. Start Listener
    global.GoatBot.api.listenMqtt((err, event) => {
        if (err) {
            console.error('❌ ListenMqtt Error:', err);
            // Implement restart logic based on config.restartListenMqtt
            return;
        }
        handler(event); // Process the incoming event
    });
    
    console.log(`🚀 Goat-Bot-V2 is Online! Logged in as: ${global.GoatBot.botID}`);
}

startBot();
