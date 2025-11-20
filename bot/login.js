// bot/login.js
const fs = require('fs');
const path = require('path');
const fca = require('fca-unofficial'); // Using a common FCA variant placeholder

function getAppState() {
    const appstatePath = path.join(__dirname, '..', 'appstate.json');
    if (!fs.existsSync(appstatePath)) {
        throw new Error("appstate.json is missing. Please generate it for secure login.");
    }
    try {
        return JSON.parse(fs.readFileSync(appstatePath, 'utf8'));
    } catch (e) {
        throw new Error(`Error parsing appstate.json: ${e.message}`);
    }
}

function login() {
    return new Promise((resolve, reject) => {
        let appState;
        try {
            appState = getAppState();
        } catch (error) {
            console.error(error.message);
            return reject(error);
        }

        const config = global.GoatBot.config;
        const fcaOptions = config.optionsFca || {};
        
        // Use credentials object containing appState
        const credentials = { appState };

        console.log('🔑 Attempting FCA login using appstate.json...');

        fca(credentials, fcaOptions, (err, api) => {
            if (err) {
                console.error("❌ FCA Login Failed:", err);
                if (err.error === 'Not logged in.') {
                    console.error('Hint: Your appstate.json may be expired or malformed.');
                }
                return reject(err);
            }
            // Save new appstate periodically (for cookie refresh/persistence)
            if (config.autoRefreshFbstate) {
                const newAppstate = api.getAppState();
                fs.writeFileSync(path.join(__dirname, '..', 'appstate.json'), JSON.stringify(newAppstate, null, 2));
                console.log('🔒 Refreshed and saved new appstate.json.');
            }
            resolve({ api });
        });
    });
}

module.exports = { login };
