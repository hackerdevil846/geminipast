const axios = require('axios');
const { config } = global.GoatBot;
const { log, getText } = global.utils;

// Clear existing timeout if any (prevent duplicates on reload)
if (global.timeOutUptime != undefined) {
    clearTimeout(global.timeOutUptime);
    clearInterval(global.timeOutUptime);
}

if (!config.autoUptime.enable) return;

const PORT = config.dashBoard?.port || (!isNaN(config.serverUptime.port) && config.serverUptime.port) || 3001;

// Smarter URL detection logic
let myUrl = config.autoUptime.url;
if (!myUrl) {
    if (process.env.REPL_OWNER) {
        myUrl = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
    } else if (process.env.API_SERVER_EXTERNAL === "https://api.glitch.com") {
        myUrl = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
    } else {
        myUrl = `http://localhost:${PORT}`;
    }
}

// Ensure protocol and path are correct
if (!myUrl.startsWith("http")) myUrl = "http://" + myUrl;
if (!myUrl.endsWith("/uptime")) myUrl += "/uptime";

let status = 'ok';
let failureCount = 0;
const MAX_FAILURES = 10; // Max failures before force restart

const autoUptime = async function () {
    try {
        // Set timeout for the request specifically to avoid hanging
        const response = await axios.get(myUrl, { timeout: 10000 });
        
        // Reset failure count on success
        if (failureCount > 0) {
            log.info("UPTIME", "Connection to Uptime Server restored.");
            failureCount = 0;
        }
        
        if (status !== 'ok') status = 'ok';
    }
    catch (e) {
        const errData = e.response?.data || {};
        status = 'failed';
        failureCount++;

        // Log only on status change or every few failures to avoid console spam
        if (failureCount === 1 || failureCount % 5 === 0) {
            log.warn("UPTIME", `Uptime check failed (${failureCount}/${MAX_FAILURES}): ${e.message}`);
        }

        // Handle specific bot statuses returned by the server
        if (errData.statusAccountBot === "can't login") {
            log.err("UPTIME", "Detected 'Can't Login' status from server. Triggering re-login...");
            if (global.GoatBot.reLoginBot) {
                global.GoatBot.reLoginBot();
                failureCount = 0; // Reset counter after triggering login
            } else {
                process.exit(1); // Force restart if reLogin function missing
            }
            return;
        }
        else if (errData.statusAccountBot === "block spam") {
            log.err("UPTIME", "Account is blocked/spam detected. Please check manually.");
        }

        // Self-Healing: Force restart if too many failures
        if (failureCount >= MAX_FAILURES) {
            log.err("UPTIME", "Too many uptime failures. Forcing process restart to recover...");
            process.exit(1);
        }
    }
};

// Initial run setup
const intervalTime = (config.autoUptime.timeInterval || 180) * 1000;

// Run the first check after a short delay, then start interval
setTimeout(() => {
    autoUptime(); // Run once immediately
    global.timeOutUptime = setInterval(autoUptime, intervalTime);
}, 10000); // 10 seconds delay start

log.info("AUTO UPTIME", getText("autoUptime", "autoUptimeTurnedOn", myUrl));
