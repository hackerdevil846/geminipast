const axios = require("axios");
const { log } = global.utils;
const fs = require("fs-extra");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");
let config;

try {
    if (fs.existsSync(configPath)) {
        config = require(configPath);
    } else {
        config = { autoUptime: { enable: false } };
    }
} catch (err) {
    config = { autoUptime: { enable: false } };
    log.warn("AUTO UPTIME", "Could not load config.json for uptime settings.");
}

if (config.autoUptime && config.autoUptime.enable) {
    const time = config.autoUptime.time || 300; // Default 5 minutes
    
    // Determine the URL based on the environment (Replit or Glitch or manual)
    let url = config.autoUptime.url;
    if (!url) {
        if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
            url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
        } else if (process.env.PROJECT_DOMAIN) {
            url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
        }
    }

    if (url) {
        log.info("AUTO UPTIME", `Auto uptime enabled. Pinging ${url} every ${time} seconds.`);
        
        setInterval(async () => {
            try {
                const res = await axios.get(url);
                if (res.status === 200) {
                    // log.info("AUTO UPTIME", "Pinged server successfully.");
                } else {
                    log.warn("AUTO UPTIME", `Ping responded with status: ${res.status}`);
                }
            } catch (e) {
                // Log only critical connection errors, ignore simple timeouts to keep console clean
                if (e.response) {
                    log.warn("AUTO UPTIME", `Ping failed with status: ${e.response.status}`);
                } else {
                    // log.verbose("AUTO UPTIME", `Ping failed: ${e.message}`);
                }
            }
        }, time * 1000);
    } else {
        log.warn("AUTO UPTIME", "Auto uptime is enabled but no URL could be determined.");
    }
}
