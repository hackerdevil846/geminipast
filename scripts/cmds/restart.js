const fs = require("fs-extra");
const path = require("path");

/**
 * 𝐇𝐞𝐥𝐩𝐞𝐫 𝐅𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐭𝐨 𝐂𝐨𝐧𝐯𝐞𝐫𝐭 𝐓𝐞𝐱𝐭 𝐭𝐨 𝐁𝐨𝐥𝐝 𝐒𝐚𝐧𝐬-𝐬𝐞𝐫𝐢𝐟
 */
const toBold = (str) => {
    return str.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code + 120211); // A-Z
        if (code >= 97 && code <= 122) return String.fromCodePoint(code + 120205); // a-z
        if (code >= 48 && code <= 57) return String.fromCodePoint(code + 120764); // 0-9
        return char;
    });
};

module.exports = {
    config: {
        name: "restart",
        aliases: [],
        version: "3.0.0", // Hybrid Version
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽", 
        countDown: 5,
        role: 2, // Admin Only
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        shortDescription: {
            en: "𝐑𝐞𝐬𝐭𝐚𝐫𝐭 𝐭𝐡𝐞 𝐁𝐨𝐭 𝐒𝐲𝐬𝐭𝐞𝐦"
        },
        longDescription: {
            en: "𝐅𝐨𝐫𝐜𝐞 𝐫𝐞𝐬𝐭𝐚𝐫𝐭 𝐭𝐡𝐞 𝐛𝐨𝐭 𝐚𝐧𝐝 𝐧𝐨𝐭𝐢𝐟𝐲 𝐰𝐡𝐞𝐧 𝐨𝐧𝐥𝐢𝐧𝐞."
        },
        guide: {
            en: "{p}restart"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    // --- 𝟏. 𝐂𝐡𝐞𝐜𝐤 𝐨𝐧 𝐋𝐨𝐚𝐝 (𝐓𝐡𝐞 𝐖𝐢𝐧𝐧𝐢𝐧𝐠 𝐅𝐞𝐚𝐭𝐮𝐫𝐞) ---
    onLoad: function ({ api }) {
        const pathFile = path.join(__dirname, "restart_log.txt");
        if (fs.existsSync(pathFile)) {
            try {
                const content = fs.readFileSync(pathFile, "utf-8").split(" ");
                const [tid, time] = content;
                
                // Calculate time taken
                const timeTaken = ((Date.now() - parseInt(time)) / 1000).toFixed(1);
                
                api.sendMessage(toBold(`✅ 𝐁𝐨𝐭 𝐑𝐞𝐬𝐭𝐚𝐫𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!\n⏱️ 𝐓𝐢𝐦𝐞: ${timeTaken}𝐬`), tid);
                
                // Delete the file so it doesn't send message again
                fs.unlinkSync(pathFile);
            } catch (e) {
                console.error("Error reading restart log:", e);
            }
        }
    },

    onStart: async function ({ api, event }) {
        const { threadID, senderID } = event;

        // --- 𝟐. 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲 𝐂𝐡𝐞𝐜𝐤 ---
        const GOD = global.config.GOD || [];
        const ADMINS = global.config.ADMINBOT || [];

        if (!GOD.includes(senderID) && !ADMINS.includes(senderID)) {
            return api.sendMessage(toBold("⛔ 𝐀𝐜𝐜𝐞𝐬𝐬 𝐃𝐞𝐧𝐢𝐞𝐝: 𝐎𝐧𝐥𝐲 𝐀𝐝𝐦𝐢𝐧 𝐜𝐚𝐧 𝐫𝐞𝐬𝐭𝐚𝐫𝐭 𝐭𝐡𝐞 𝐛𝐨𝐭!"), threadID);
        }

        // --- 𝟑. 𝐒𝐚𝐯𝐞 𝐒𝐭𝐚𝐭𝐞 & 𝐑𝐞𝐬𝐭𝐚𝐫𝐭 ---
        const pathFile = path.join(__dirname, "restart_log.txt");
        fs.writeFileSync(pathFile, `${threadID} ${Date.now()}`);

        return api.sendMessage(toBold("🔄 𝐒𝐲𝐬𝐭𝐞𝐦 𝐢𝐬 𝐫𝐞𝐛𝐨𝐨𝐭𝐢𝐧𝐠... 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭."), threadID, () => {
            console.log("♻️ Restarting Bot System...");
            process.exit(1); 
        });
    }
};
