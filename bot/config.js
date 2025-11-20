// bot/config.js
const fs = require('fs');

function loadConfig(configPath) {
    if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found at: ${configPath}`);
    }
    
    let config;
    try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
        throw new Error(`Error parsing config.json: File is not valid JSON. ${e.message}`);
    }

    // Basic Validation (you can add more detailed checks here)
    if (!config.prefix) {
        throw new Error("Config validation failed: 'prefix' is required.");
    }
    if (!config.timeZone) {
        throw new Error("Config validation failed: 'timeZone' is required.");
    }

    // Ensure credentials are null if using appstate for production security
    if (config.facebookAccount.email || config.facebookAccount.password) {
        console.warn("⚠️ WARNING: Facebook credentials found in config.json. In production, these should be set to null if using appstate.json.");
    }
    
    // Set default FCA log level if not specified
    if (!config.optionsFca.logLevel) {
        config.optionsFca.logLevel = "silent";
    }

    return config;
}

module.exports = { loadConfig };
