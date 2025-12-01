const axios = require("axios");
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
        name: "mdl",
        aliases: [],
        version: "2.0.0", // Major update
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2, // Admin Only
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        shortDescription: {
            en: "𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝/𝐔𝐩𝐥𝐨𝐚𝐝 𝐁𝐨𝐭 𝐂𝐨𝐝𝐞𝐬"
        },
        longDescription: {
            en: "𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐜𝐨𝐝𝐞 𝐟𝐫𝐨𝐦 𝐏𝐚𝐬𝐭𝐞𝐛𝐢𝐧, 𝐁𝐮𝐢𝐥𝐝𝐭𝐨𝐨𝐥, 𝐆𝐨𝐨𝐠𝐥𝐞 𝐃𝐫𝐢𝐯𝐞 𝐨𝐫 𝐮𝐩𝐥𝐨𝐚𝐝 𝐥𝐨𝐜𝐚𝐥 𝐟𝐢𝐥𝐞𝐬 𝐭𝐨 𝐏𝐚𝐬𝐭𝐞𝐛𝐢𝐧."
        },
        guide: {
            en: "{p}mdl [𝐟𝐢𝐥𝐞𝐧𝐚𝐦𝐞] <𝐥𝐢𝐧𝐤/𝐫𝐞𝐩𝐥𝐲>"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "cheerio": "",
            "pastebin-api": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        const { senderID, messageReply } = event;

        // --- 𝟏. 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐂𝐡𝐞𝐜𝐤 (𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜) ---
        const GOD = global.config.GOD || [];
        const ADMINS = global.config.ADMINBOT || [];
        
        if (!GOD.includes(senderID) && !ADMINS.includes(senderID)) {
            return message.reply(toBold("⛔ 𝐘𝐨𝐮 𝐚𝐫𝐞 𝐧𝐨𝐭 𝐚𝐮𝐭𝐡𝐨𝐫𝐢𝐳𝐞𝐝 𝐭𝐨 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝."));
        }

        // --- 𝟐. 𝐃𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 𝐂𝐡𝐞𝐜𝐤 ---
        try {
            require("axios");
            require("fs-extra");
        } catch (e) {
            return message.reply(toBold("❌ 𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐢𝐞𝐬. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐢𝐧𝐬𝐭𝐚𝐥𝐥: axios, fs-extra, cheerio, pastebin-api"));
        }

        const fileName = args[0];
        if (!fileName) {
            return message.reply(toBold("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐟𝐢𝐥𝐞𝐧𝐚𝐦𝐞.\n💡 𝐔𝐬𝐚𝐠𝐞: mdl [filename]"));
        }

        // Determine if there is a link provided (Args or Reply)
        let targetLink = null;
        if (args[1] && (args[1].startsWith("http") || args[1].includes(".com"))) {
            targetLink = args[1];
        } else if (messageReply && messageReply.body) {
            const urlMatch = messageReply.body.match(/(https?:\/\/[^\s]+)/g);
            if (urlMatch) targetLink = urlMatch[0];
        }

        // ====================================================
        //                 𝐌𝐎𝐃𝐄 𝟏: 𝐔𝐏𝐋𝐎𝐀𝐃 (𝐋𝐨𝐜𝐚𝐥 -> 𝐏𝐚𝐬𝐭𝐞𝐛𝐢𝐧)
        // ====================================================
        if (!targetLink) {
            const filePath = path.join(__dirname, `${fileName}.js`);
            
            if (!fs.existsSync(filePath)) {
                return message.reply(toBold(`❌ 𝐅𝐢𝐥𝐞 '${fileName}.js' 𝐝𝐨𝐞𝐬 𝐧𝐨𝐭 𝐞𝐱𝐢𝐬𝐭 𝐢𝐧 𝐜𝐦𝐝𝐬 𝐟𝐨𝐥𝐝𝐞𝐫.`));
            }

            try {
                // Lazy load pastebin-api to prevent crash if not installed
                const { PasteClient } = require("pastebin-api");
                const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb"); // Key Preserved

                const code = fs.readFileSync(filePath, "utf8");
                
                message.reply(toBold("⏳ 𝐔𝐩𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐭𝐨 𝐏𝐚𝐬𝐭𝐞𝐛𝐢𝐧..."));

                const url = await client.createPaste({
                    code: code,
                    expireDate: "N",
                    format: "javascript",
                    name: fileName,
                    publicity: 1
                });

                const rawLink = url.replace("pastebin.com/", "pastebin.com/raw/");
                return message.reply(toBold(`✅ 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!\n\n🔗 𝐔𝐑𝐋: ${rawLink}`));

            } catch (err) {
                console.error("Pastebin Upload Error:", err);
                return message.reply(toBold("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐮𝐩𝐥𝐨𝐚𝐝. (𝐂𝐡𝐞𝐜𝐤 𝐀𝐏𝐈 𝐊𝐞𝐲 𝐨𝐫 𝐋𝐢𝐦𝐢𝐭𝐬)"));
            }
        }

        // ====================================================
        //                 𝐌𝐎𝐃𝐄 𝟐: 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 (𝐔𝐑𝐋 -> 𝐋𝐨𝐜𝐚𝐥)
        // ====================================================
        message.reply(toBold(`⏳ 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐜𝐨𝐝𝐞 𝐟𝐫𝐨𝐦 𝐥𝐢𝐧𝐤...`));

        try {
            let codeData = "";

            // --- A. Pastebin Handling ---
            if (targetLink.includes("pastebin.com")) {
                let rawLink = targetLink;
                if (!targetLink.includes("/raw/")) {
                    const id = targetLink.split("/").pop();
                    rawLink = `https://pastebin.com/raw/${id}`;
                }
                const { data } = await axios.get(rawLink);
                codeData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
            }

            // --- B. Buildtool / Tinyurl Handling ---
            else if (targetLink.includes("buildtool") || targetLink.includes("tinyurl")) {
                const cheerio = require("cheerio");
                const { data } = await axios.get(targetLink);
                const $ = cheerio.load(data);
                
                // Try to find code in common containers
                codeData = $(".language-js").first().text().trim() || $("pre").first().text().trim() || $("code").first().text().trim();
                
                if (!codeData) throw new Error("No code found in HTML");
            }

            // --- C. Google Drive Handling (New) ---
            else if (targetLink.includes("drive.google.com")) {
                const fileIdMatch = targetLink.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
                const fileId = fileIdMatch ? (fileIdMatch[1] || fileIdMatch[2]) : null;

                if (!fileId) return message.reply(toBold("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐆𝐨𝐨𝐠𝐥𝐞 𝐃𝐫𝐢𝐯𝐞 𝐋𝐢𝐧𝐤."));

                const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
                const { data } = await axios.get(driveUrl, { responseType: 'text' });
                codeData = data;
            }

            // --- D. Generic Raw Link (GitHub etc) ---
            else {
                const { data } = await axios.get(targetLink);
                codeData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
            }

            // --- Validation & Saving ---
            if (!codeData || codeData.length < 10) {
                return message.reply(toBold("❌ 𝐅𝐞𝐭𝐜𝐡𝐞𝐝 𝐜𝐨𝐧𝐭𝐞𝐧𝐭 𝐢𝐬 𝐞𝐦𝐩𝐭𝐲 𝐨𝐫 𝐢𝐧𝐯𝐚𝐥𝐢𝐝."));
            }

            const savePath = path.join(__dirname, `${fileName}.js`);
            fs.writeFileSync(savePath, codeData, "utf8");

            return message.reply(toBold(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐒𝐚𝐯𝐞𝐝!\n\n📂 𝐅𝐢𝐥𝐞: ${fileName}.js\n💡 𝐔𝐬𝐞: ${global.config.PREFIX}load ${fileName}`));

        } catch (error) {
            console.error("MDL Download Error:", error);
            return message.reply(toBold("❌ 𝐄𝐫𝐫𝐨𝐫 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐟𝐢𝐥𝐞. 𝐌𝐚𝐤𝐞 𝐬𝐮𝐫𝐞 𝐭𝐡𝐞 𝐥𝐢𝐧𝐤 𝐢𝐬 𝐩𝐮𝐛𝐥𝐢𝐜."));
        }
    }
};
