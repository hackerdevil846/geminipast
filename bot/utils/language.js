const fs = require('fs');
const path = require('path');

// Default language code, often hardcoded or read from config.json
const langCode = 'en'; 
let languageData = {};

try {
    const langPath = path.join(process.cwd(), 'languages', `${langCode}.json`);
    if (fs.existsSync(langPath)) {
        languageData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    } else {
        console.error(`ERROR: Language file not found at ${langPath}. Using empty data.`);
    }
} catch (e) {
    console.error(`ERROR: Failed to load or parse language file (${langCode}.json): ${e.message}`);
}

/**
 * Retrieves a localized string or returns a default fallback.
 * @param {string} key The key to look up in the language data.
 * @param {any[]} args Arguments to be inserted into the string (if supported).
 * @returns {string} The localized string.
 */
function getLang(key, ...args) {
    let text = languageData[key] || `[Missing Language Key: ${key}]`;
    
    // Simple argument replacement (e.g., replacing {0}, {1}, etc.)
    if (args && args.length > 0) {
        args.forEach((arg, index) => {
            text = text.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
        });
    }

    return text;
}

module.exports = { getLang, langCode };
