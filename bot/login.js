const fs = require('fs');
const path = require('path');
const fca = require('fca-unofficial');

function getAppState() {
    // 1. Check for Environment Variable (Used in production hosting like Render)
    if (process.env.FCA_APPSTATE_JSON) {
        try {
            console.log("Using appstate from FCA_APPSTATE_JSON environment variable.");
            return JSON.parse(process.env.FCA_APPSTATE_JSON);
        } catch (e) {
            throw new Error(`Error parsing FCA_APPSTATE_JSON environment variable: ${e.message}`);
        }
    }

    // 2. Fallback to Local appstate.json file (Used locally or in CI's dummy step)
    const appstatePath = path.join(__dirname, '..', 'appstate.json');
    if (!fs.existsSync(appstatePath)) {
        console.warn("⚠️ appstate.json is missing. Attempting login without stored state (May require credentials).");
        return []; // Return empty array if file is missing
    }
    try {
        const appState = JSON.parse(fs.readFileSync(appstatePath, 'utf8'));
        // If appState is just `[]` (like in CI), log a warning
        if (appState.length === 0) {
            console.warn("⚠️ appstate.json file is empty. Login will likely fail without credentials.");
        }
        return appState;
    } catch (e) {
        throw new Error(`Error parsing local appstate.json: ${e.message}`);
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
        
        // FCA expects appState to be an object/array in the credentials
        const credentials = appState.length > 0 ? { appState } : config.facebookAccount;

        fca(credentials, fcaOptions, (err, api) => {
            if (err) {
                // Keep the error message clear for CI vs. production
                const isCiRun = appState.length === 0 && !process.env.FCA_APPSTATE_JSON;
                const errorMessage = err.error || 'Unknown Error';
                
                if (isCiRun) {
                    return reject(new Error(`FCA Login Failed (Expected in CI): ${errorMessage}`));
                } else {
                    return reject(new Error(`FCA Production Login Failed: ${errorMessage}. Check appstate or credentials.`));
                }
            }
            
            // Auto-refresh state only if not in CI (i.e., we are in production and logged in successfully)
            if (config.autoRefreshFbstate && process.env.FCA_APPSTATE_JSON) {
                const newAppstate = api.getAppState();
                // In production, we don't write to disk, we update the hosting environment if possible, 
                // but FCA often handles cookie updates internally until the session expires.
                console.log("Successfully logged in. Session will be maintained by FCA.");
            }
            resolve({ api });
        });
    });
}

module.exports = { login };
