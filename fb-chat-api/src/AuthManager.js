"use strict";

const { chromium } = require("playwright");
const fs = require("fs-extra");
const readline = require("readline-sync");
const log = require("npmlog");

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
                if (Array.isArray(appState) && appState.length > 0) {
                    log.info("AuthManager", "Loading session from appstate.json...");
                    return appState;
                }
            } catch (e) {
                log.warn("AuthManager", "Corrupt appstate, refreshing...");
            }
        }

        // Safety Check: Do not attempt login without credentials
        if (!this.email || !this.password) {
            throw new Error("Cannot auto-login: Email or Password missing in config.json");
        }

        log.info("AuthManager", "No valid cookie found. Starting automated login via Playwright...");
        return await this.performLogin();
    }

    async performLogin() {
        if (!this.email || !this.password) {
             throw new Error("Login Credentials Missing! Please check config.json");
        }

        log.info("AuthManager", "Launching Headless Browser...");
        
        this.browser = await chromium.launch({ 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });

        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        this.page = await context.newPage();

        try {
            log.info("AuthManager", "Navigating to Facebook...");
            await this.page.goto("https://www.facebook.com/");

            if (await this.page.$('[aria-label="Facebook"]')) {
                log.info("AuthManager", "Already logged in.");
            } else {
                try { await this.page.click('text="Decline optional cookies"', { timeout: 2000 }); } catch (e) {}

                log.info("AuthManager", "Typing credentials...");
                await this.page.fill('input[name="email"]', this.email);
                await this.page.fill('input[name="pass"]', this.password);
                
                await this.page.click('button[name="login"]');
                await this.page.waitForLoadState('networkidle');
            }

            if (this.page.url().includes("checkpoint")) {
                log.warn("AuthManager", "2FA / Checkpoint detected!");
                const codeInput = await this.page.$('input[name="approvals_code"]');
                
                if (codeInput) {
                    log.pause();
                    const code = readline.question("INPUT 2FA CODE FROM AUTHENTICATOR APP: ");
                    log.resume();
                    
                    await this.page.fill('input[name="approvals_code"]', code);
                    await this.page.click('#checkpointSubmitButton');
                    await this.page.waitForLoadState('networkidle');

                    try {
                        await this.page.click('input[value="dont_save"]', { timeout: 5000 });
                        await this.page.click('#checkpointSubmitButton');
                        await this.page.waitForLoadState('networkidle');
                    } catch (e) {}
                } else {
                    log.error("AuthManager", "Checkpoint detected but could not find code input.");
                    await this.page.waitForTimeout(10000);
                }
            }

            await this.page.waitForTimeout(3000); 
            const cookies = await context.cookies();
            const c_user = cookies.find(c => c.name === "c_user");
            if (!c_user) throw new Error("Login failed. Check credentials.");

            log.info("AuthManager", `Logged in successfully as ID: ${c_user.value}`);

            const appState = cookies.map(c => ({
                key: c.name,
                value: c.value,
                domain: c.domain,
                path: c.path,
                hostOnly: c.hostOnly,
                creation: new Date().toISOString(),
                lastAccessed: new Date().toISOString()
            }));

            fs.writeFileSync(this.appStatePath, JSON.stringify(appState, null, 2));
            log.info("AuthManager", "New appstate.json saved.");

            await this.browser.close();
            return appState;

        } catch (error) {
            if (this.browser) await this.browser.close();
            throw error;
        }
    }
}

module.exports = AuthManager;
