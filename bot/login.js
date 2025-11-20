// bot/login.js
const fs = require('fs');
const path = require('path');
const fca = require('fca-unofficial');

function getAppState() {
    const appstatePath = path.join(__dirname, '..', 'appstate.json');
    if (!fs.existsSync(appstatePath)) {
        // Since we are running in CI with a dummy appstate, this should not throw in CI
        // but in production, it's critical.
        console.warn("⚠️ appstate.json is missing or dummy for CI. Login will fail.");
        return [];
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
            return reject(error);
        }

        const config = global.GoatBot.config;
        const fcaOptions = config.optionsFca || {};
        
        const credentials = { appState };

        fca(credentials, fcaOptions, (err, api) => {
            if (err) {
                // Return a specific message that the login failed but the module loaded
                return reject(new Error(`FCA Login Failed (Expected in CI): ${err.error || 'Unknown Error'}`));
            }
            if (config.autoRefreshFbstate) {
                const newAppstate = api.getAppState();
                fs.writeFileSync(path.join(__dirname, '..', 'appstate.json'), JSON.stringify(newAppstate, null, 2));
            }
            resolve({ api });
        });
    });
}

module.exports = { login };
