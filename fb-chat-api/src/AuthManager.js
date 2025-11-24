"use strict";

const { chromium } = require("playwright");
const fs = require("fs-extra");
const readline = require("readline-sync");
const log = require("npmlog");
const path = require("path");

class AuthManager {
    constructor(email, password, appStatePath) {
        this.email = email;
        this.password = password;
        this.appStatePath = appStatePath;
        this.browser = null;
        this.page = null;
    }

    async getAppState(forceRefresh = false) {
        if (!forceRefresh && fs.existsSync(this.appStatePath)) {
            try {
                const appState = JSON.parse(fs.readFileSync(this.appStatePath, 'utf8'));
                // Basic validation to check if cookies are not empty
                if (Array.isArray(appState) && appState.length > 0) {
                    log.info("AuthManager", "Loading session from appstate.json...");
                    return appState;
                }
            } catch (e) {
                log.warn("AuthManager", "Corrupt appstate, refreshing...");
            }
        }

        log.info("AuthManager", "No valid cookie found. Starting automated login via Playwright...");
        return await this.performLogin();
    }

    async performLogin() {
        log.info("AuthManager", "Launching Headless Browser...");
        
        // Launch standard chromium. 
        // We use a specific user agent to look like a standard PC.
        this.browser = await chromium.launch({ 
            headless: true, // Set to false if you want to see the browser popup
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });

        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        this.page = await context.newPage();

        try {
            log.info("AuthManager", "Navigating to Facebook...");
            await this.page.goto("https://www.facebook.com/");

            // Check if we are already logged in (unlikely in incognito, but good practice)
            if (await this.page.$('[aria-label="Facebook"]')) {
                log.info("AuthManager", "Already logged in.");
            } else {
                // Reject cookies banner if present
                try {
                    await this.page.click('text="Decline optional cookies"', { timeout: 2000 });
                } catch (e) { /* Ignore */ }

                log.info("AuthManager", "Typing credentials...");
                await this.page.fill('input[name="email"]', this.email);
                await this.page.fill('input[name="pass"]', this.password);
                
                // Click login
                await this.page.click('button[name="login"]');
                await this.page.waitForLoadState('networkidle');
            }

            // 2FA / Checkpoint Handling
            if (this.page.url().includes("checkpoint")) {
                log.warn("AuthManager", "2FA / Checkpoint detected!");
                
                // Try to find the 2FA input field
                const codeInput = await this.page.$('input[name="approvals_code"]');
                
                if (codeInput) {
                    log.pause();
                    const code = readline.question("INPUT 2FA CODE FROM AUTHENTICATOR APP: ");
                    log.resume();
                    
                    await this.page.fill('input[name="approvals_code"]', code);
                    await this.page.click('#checkpointSubmitButton');
                    await this.page.waitForLoadState('networkidle');

                    // Handle "Save Browser" step
                    try {
                        await this.page.click('input[value="dont_save"]', { timeout: 5000 });
                        await this.page.click('#checkpointSubmitButton');
                        await this.page.waitForLoadState('networkidle');
                    } catch (e) { 
                        // Sometimes this step is skipped
                    }
                } else {
                    log.error("AuthManager", "Checkpoint detected but could not find code input. You might need to approve from another device.");
                    // Wait a bit to see if user approves on phone
                    await this.page.waitForTimeout(10000);
                }
            }

            // Verify Login Success
            await this.page.waitForTimeout(3000); // Wait for redirects
            const cookies = await context.cookies();
            
            // Check for c_user cookie which proves login
            const c_user = cookies.find(c => c.name === "c_user");
            if (!c_user) {
                throw new Error("Login failed. Check your email/password or account status.");
            }

            log.info("AuthManager", `Logged in successfully as ID: ${c_user.value}`);

            // Format cookies for fb-chat-api
            const appState = cookies.map(c => ({
                key: c.name,
                value: c.value,
                domain: c.domain,
                path: c.path,
                hostOnly: c.hostOnly,
                creation: new Date().toISOString(),
                lastAccessed: new Date().toISOString()
            }));

            // Save to file
            fs.writeFileSync(this.appStatePath, JSON.stringify(appState, null, 2));
            log.info("AuthManager", "New appstate.json saved.");

            await this.browser.close();
            return appState;

        } catch (error) {
            log.error("AuthManager", "Login Error:", error);
            if (this.browser) await this.browser.close();
            throw error;
        }
    }
}

module.exports = AuthManager;
