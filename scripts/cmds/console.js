const chalk = require("chalk");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "console",
        aliases: [],
        version: "1.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 0,
        role: 3,
        category: "admin",
        shortDescription: {
            en: "𝖬𝖺𝗄𝖾 𝗍𝗁𝖾 𝖼𝗈𝗇𝗌𝗈𝗅𝖾 𝗆𝗈𝗋𝖾 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅"
        },
        longDescription: {
            en: "𝖡𝖾𝖺𝗎𝗍𝗂𝖿𝗂𝖾𝗌 𝗍𝗁𝖾 𝖼𝗈𝗇𝗌𝗈𝗅𝖾 𝗈𝗎𝗍𝗉𝗎𝗍 𝗐𝗂𝗍𝗁 𝖼𝗈𝗅𝗈𝗋𝗌 𝖺𝗇𝖽 𝖿𝗈𝗋𝗆𝖺𝗍𝗍𝗂𝗇𝗀"
        },
        guide: {
            en: "{p}console"
        },
        dependencies: {
            "chalk": "",
            "moment-timezone": ""
        }
    },

    langs: {
        "en": {
            "on": "𝗈𝗇",
            "off": "𝗈𝖿𝖿",
            "successText": "𝖼𝗈𝗇𝗌𝗈𝗅𝖾 𝗌𝗎𝖼𝖼𝖾𝗌𝗌!"
        }
    },

    onLoad: function () {
        // Dependency check
        let dependenciesAvailable = true;
        try {
            require("chalk");
            require("moment-timezone");
        } catch (e) {
            dependenciesAvailable = false;
        }

        if (dependenciesAvailable) {
            console.log("💖 𝖠𝗌𝗂𝖿 𝖡𝗈𝗍: 𝖢𝗈𝗇𝗌𝗈𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗅𝗈𝖺𝖽𝖾𝖽!");
        } else {
            console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌 𝖿𝗈𝗋 𝖼𝗈𝗇𝗌𝗈𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
        }
    },

    onChat: async function ({ event, api, usersData, threadsData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("chalk");
                require("moment-timezone");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            const { threadID, senderID, body } = event;
            if (senderID == api.getCurrentUserID()) return;
            
            // Get thread data safely
            let thread;
            try {
                thread = global.data.threadData.get(threadID) || {};
            } catch (error) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺:", error);
                return;
            }
            
            if (thread.console) return;
            
            try {
                const threadInfo = await threadsData.get(threadID);
                const nameBox = threadInfo?.threadName || "𝖭𝖺𝗆𝖾 𝖽𝗈𝖾𝗌 𝗇𝗈𝗍 𝖾𝗑𝗂𝗌𝗍";
                const userInfo = await usersData.get(senderID);
                const nameUser = userInfo?.name || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
                const msg = body || "𝖯𝗁𝗈𝗍𝗈𝗌, 𝗏𝗂𝖽𝖾𝗈𝗌 𝗈𝗋 𝗌𝗉𝖾𝖼𝗂𝖺𝗅 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌";
                
                const colors = [
                    "FF9900", "FFFF33", "33FFFF", "FF99FF", "FF3366", "FFFF66", "FF00FF", "66FF99", "00CCFF", "FF0099",
                    "FF0066", "7900FF", "93FFD8", "CFFFDC", "FF5B00", "3B44F6", "A6D1E6", "7F5283", "A66CFF", "F05454",
                    "FCF8E8", "94B49F", "47B5FF", "B8FFF9", "42C2FF", "FF7396"
                ];
                
                const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
                
                console.log(
                    chalk.hex("#" + randomColor())(`[💓]→ 𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾: ${nameBox}`) + "\n" +
                    chalk.hex("#" + randomColor())(`[🔎]→ 𝖦𝗋𝗈𝗎𝗉 𝖨𝖣: ${threadID}`) + "\n" +
                    chalk.hex("#" + randomColor())(`[🔱]→ 𝖴𝗌𝖾𝗋 𝗇𝖺𝗆𝖾: ${nameUser}`) + "\n" +
                    chalk.hex("#" + randomColor())(`[📝]→ 𝖴𝗌𝖾𝗋 𝖨𝖣: ${senderID}`) + "\n" +
                    chalk.hex("#" + randomColor())(`[📩]→ 𝖢𝗈𝗇𝗍𝖾𝗇𝗍: ${msg}`) + "\n" +
                    chalk.hex("#" + randomColor())(`[ ${moment.tz("Asia/Dhaka").format("LLLL")} ]`) + "\n" +
                    chalk.hex("#" + randomColor())("◆━━━━━━━━━◆ 𝖠𝗌𝗂𝖿 𝖡𝗈𝗍 🐧 ◆━━━━━━━━◆\n")
                );
            } catch (processingError) {
                console.error("❌ 𝖢𝗈𝗇𝗌𝗈𝗅𝖾 𝖢𝗁𝖺𝗍 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖤𝗋𝗋𝗈𝗋:", processingError);
            }
        } catch (error) {
            console.error("💥 𝖢𝗈𝗇𝗌𝗈𝗅𝖾 𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function ({ message, event, threadsData, getText }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("chalk");
                require("moment-timezone");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝗁𝖺𝗅𝗄 𝖺𝗇𝖽 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾.");
            }

            const { threadID } = event;
            
            try {
                let threadData = await threadsData.get(threadID);
                let data = threadData?.data || {};
                
                // Toggle console setting
                data.console = typeof data.console === "undefined" || data.console ? false : true;
                
                // Save the updated data
                await threadsData.set(threadID, { data });
                
                // Update global cache safely
                try {
                    if (global.data && global.data.threadData) {
                        global.data.threadData.set(threadID, data);
                    }
                } catch (cacheError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗉𝖽𝖺𝗍𝖾 𝗀𝗅𝗈𝖻𝖺𝗅 𝖼𝖺𝖼𝗁𝖾:", cacheError);
                }

                const status = data.console ? getText("off") : getText("on");
                const messageText = `${status} ${getText("successText")}`;
                
                const boldItalicMap = {
                    'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃',
                    'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍',
                    'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
                    'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩',
                    'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳',
                    'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹'
                };
                
                const formattedMessage = messageText.replace(/[a-zA-Z]/g, char => boldItalicMap[char] || char);
                
                await message.reply(formattedMessage);
                
            } catch (dataError) {
                console.error("❌ 𝖣𝖺𝗍𝖺 𝖤𝗋𝗋𝗈𝗋:", dataError);
                await message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗍𝗈𝗀𝗀𝗅𝗂𝗇𝗀 𝖼𝗈𝗇𝗌𝗈𝗅𝖾 𝖿𝖾𝖺𝗍𝗎𝗋𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }
        } catch (error) {
            console.error("💥 𝖢𝗈𝗇𝗌𝗈𝗅𝖾 𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('threadsData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
