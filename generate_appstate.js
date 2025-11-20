/**
 * APPSTATE GENERATOR SCRIPT
 * Run this once to create the secure appstate.json file.
 */
const fs = require('fs');
const path = require('path');
const login = require('facebook-chat-api'); 
const config = require('./config.json');

// Get credentials from config.json (INSECURE, do not keep them after this step)
const { email, password, '2FASecret': secret } = config.facebookAccount;

if (!email || !password) {
    console.error("❌ ERROR: Email and password must be set in config.json under 'facebookAccount' to run this generator.");
    process.exit(1);
}

const loginOptions = {
    email: email,
    password: password,
    // Add 2FA secret only if needed and available
    secret: secret, 
    forceLogin: true // Force a full login process
};

console.log("🚀 Starting login to generate appstate. This might take a moment...");
console.log("⚠️ WARNING: Ensure you have your 2FA code ready if you use it.");

login(loginOptions, (err, api) => {
    if (err) {
        console.error("❌ LOGIN FAILED!");
        if (err.error === 'login_approval') {
            console.error("🔐 Login Approval Required. Check your Facebook Notifications or enter the 2FA code if prompted.");
        } else {
            console.error("Error:", err);
        }
        return;
    }

    try {
        const appState = api.getAppState();
        fs.writeFileSync(path.join(process.cwd(), 'appstate.json'), JSON.stringify(appState, null, 2));
        console.log("✅ SUCCESS: appstate.json saved!");
        console.log("🔔 NEXT STEP: Go to config.json and REMOVE your Facebook email and password for security.");
    } catch (e) {
        console.error("❌ FAILED to save appstate.json:", e);
    }
});
