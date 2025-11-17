const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "goibot2",
        aliases: [],
        version: "1.0.2",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 0,
        category: "system",
        shortDescription: {
            en: "🎵 𝖬𝗎𝗌𝗂𝖼 𝖡𝗈𝗍 𝖠𝗎𝗍𝗈-𝖱𝖾𝗌𝗉𝗈𝗇𝖽 𝖲𝗒𝗌𝗍𝖾𝗆"
        },
        longDescription: {
            en: "🎵 𝖬𝗎𝗌𝗂𝖼 𝖡𝗈𝗍 𝖠𝗎𝗍𝗈-𝖱𝖾𝗌𝗉𝗈𝗇𝖽 𝖲𝗒𝗌𝗍𝖾𝗆 𝗐𝗂𝗍𝗁 𝗋𝗈𝗆𝖺𝗇𝗍𝗂𝖼 𝗌𝗈𝗇𝗀 𝗊𝗎𝗈𝗍𝖾𝗌"
        },
        guide: {
            en: "{p}goibot2"
        },
        dependencies: {
            "moment-timezone": "",
            "fs-extra": ""
        },
        envConfig: {
            timezone: "Asia/Dhaka"
        }
    },

    onLoad: function () {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("moment-timezone");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error('\x1b[31m%s\x1b[0m', '❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌 𝖿𝗈𝗋 𝗀𝗈𝗂𝖻𝗈𝗍𝟤');
                return;
            }

            console.log('\x1b[36m%s\x1b[0m', '🎵 𝖬𝗎𝗌𝗂𝖼 𝖡𝗈𝗍 𝖬𝗈𝖽𝗎𝗅𝖾 𝖫𝗈𝖺𝖽𝖾𝖽 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒');
        } catch (error) {
            console.error('\x1b[31m%s\x1b[0m', '💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖫𝗈𝖺𝖽:', error);
        }
    },

    onStart: async function ({ message, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("moment-timezone");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            await message.reply("🎵 𝖬𝗎𝗌𝗂𝖼 𝖡𝗈𝗍 𝖨𝗌 𝖠𝖼𝗍𝗂𝗏𝖾\n\n💬 𝖲𝖾𝗇𝖽 '𝗌𝗈𝗇𝗀' 𝗍𝗈 𝗍𝗋𝗂𝗀𝗀𝖾𝗋 𝖺𝗎𝗍𝗈-𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
        } catch (error) {
            console.error('💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖲𝗍𝖺𝗋𝗍:', error);
            // Don't send error message to avoid spam
        }
    },

    onChat: async function ({ event, message, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("moment-timezone");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            const { threadID, senderID, body } = event;

            if (!body) return;

            // Validate timezone
            let time;
            try {
                time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY ║ HH:mm:ss");
            } catch (timeError) {
                console.error("❌ 𝖳𝗂𝗆𝖾𝗓𝗈𝗇𝖾 𝖾𝗋𝗋𝗈𝗋:", timeError);
                time = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖳𝗂𝗆𝖾";
            }

            const messageText = body.toLowerCase().trim();
            const triggerWords = ["song", "𝗌𝗈𝗇𝗀", "𝗌𝗈𝗇𝗀", "𝖲𝗈𝗇𝗀"];

            const shouldTrigger = triggerWords.some(word => 
                messageText.includes(word.toLowerCase())
            );

            if (shouldTrigger) {
                let userData;
                try {
                    userData = await usersData.get(senderID);
                } catch (userError) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", userError);
                    userData = {};
                }

                const name = userData.name || "𝖴𝗌𝖾𝗋";

                const songQuotes = [
                    "🎶 𝖳𝗎𝗆𝗂 𝖺𝗆𝖺𝗋 𝗁𝗈𝗒𝖾 𝗍𝗁𝖺𝗄𝗈 𝗇𝖺, 𝖺𝗆𝗂 𝗍𝗈𝗆𝖺𝗄 𝖻𝗁𝖺𝗅𝗈𝖻𝖺𝗌𝗁𝗂 𝖻𝗈𝗅𝖻𝗈 𝗇𝖺 🌹",
                    "💔 𝖳𝗎𝗆𝗂 𝗃𝖾 𝖺𝗆𝖺𝗋 𝗁𝗈𝖻𝖾, 𝗍𝖺𝗁𝗈𝗅𝖾 𝗍𝗈𝖻𝗈 𝗌𝗈𝖻 𝗄𝗂𝖼𝗁𝗎 𝖽𝗂𝗇𝖾 𝗉𝖺𝗋𝖻𝗈 𝗇𝖺 🎵",
                    "🌟 𝖠𝗆𝖺𝗋 𝗉𝗋𝖺𝗇𝖾𝗋 𝗆𝖺𝗃𝗁𝖾 𝗍𝗎𝗆𝗂, 𝗍𝗎𝗆𝗂 𝖼𝗁𝖺𝗋𝖺 𝗄𝗈𝗇𝗈 𝗀𝖺𝗇 𝗇𝖾𝗂 🎤",
                    "🌠 𝖳𝗎𝗆𝗂 𝖺𝗆𝖺𝗋 𝗌𝗈𝗇𝖽𝗁𝖺𝗇, 𝖺𝗆𝖺𝗋 𝗌𝗈𝖻 𝗄𝗂𝖼𝗁𝗎, 𝖺𝗆𝖺𝗋 𝗌𝗁𝖾𝗌𝗁 𝗈𝖻𝗂𝖽𝗁𝖺𝗇 🎶",
                    "🌹 𝖳𝗎𝗆𝗂 𝖾𝗄𝖺 𝖻𝖺𝗋 𝖿𝗂𝗋𝖾 𝖺𝗌𝗈, 𝖺𝗆𝗂 𝗍𝗈𝗆𝖺𝗄𝖾 𝗇𝗂𝗃𝖾𝗋 𝗄𝗈𝗋𝖾 𝗇𝖾𝖻𝗈 💫",
                    "🎵 𝖠𝗆𝖺𝗋 𝖽𝗂𝖻𝖺 𝗋𝖺𝗍𝗂 𝗍𝗎𝗆𝗂, 𝖺𝗆𝖺𝗋 𝗌𝗈𝖻 𝗌𝗈𝗄𝗁𝗈 𝗍𝗎𝗆𝗂 🌙",
                    "✨ 𝖳𝗎𝗆𝗂 𝗃𝗈𝗄𝗁𝗈𝗇 𝖺𝗆𝖺𝗋 𝗄𝖺𝖼𝗁𝖾, 𝗍𝗈𝗄𝗁𝗈𝗇 𝗌𝗈𝖻 𝗄𝗂𝖼𝗁𝗎 𝗉𝖺𝗂 🌟",
                    "🎶 𝖠𝗆𝖺𝗋 𝗆𝗈𝗇𝖾𝗋 𝗄𝗈𝗍𝗁𝖺 𝗌𝗁𝗎𝗇𝗈, 𝗍𝗎𝗆𝗂 𝖼𝗁𝖺𝗋𝖺 𝗄𝖾𝗎 𝗇𝖾𝗂 💭",
                    "🌌 𝖳𝗎𝗆𝗂 𝖺𝗆𝖺𝗋 𝗁𝗈𝗒𝖾 𝗍𝗁𝖺𝗄𝗅𝖾, 𝖺𝗆𝗂 𝖻𝖾𝖼𝗁𝖾𝗍𝖾 𝗉𝖺𝗋𝗂 𝗇𝗂 💖",
                    "🎵 𝖠𝗆𝖺𝗋 𝗉𝗋𝗂𝗒𝗈 𝗁𝗈𝖻𝗈 𝗍𝗎𝗆𝗂, 𝖺𝗆𝗂 𝗌𝗈𝖻 𝖼𝗁𝖾𝗒𝖾 𝗉𝗋𝗂𝗒𝗈 🌟"
                ];

                const randomQuote = songQuotes[Math.floor(Math.random() * songQuotes.length)];
                const creditName = "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽";

                const msg = `╔═════ஜ۩۞۩ஜ═════╗
🎵 𝖧𝖾𝗅𝗅𝗈 ${name} 💖
╚═════ஜ۩۞۩ஜ═════╝

『 ${randomQuote} 』

✦⋆⋅☆⋅⋆✦⋆⋅☆⋅⋆✦⋆⋅☆⋅⋆✦

📌 𝖢𝗋𝖾𝖽𝗂𝗍𝗌 » ${creditName}
⏰ 𝖳𝗂𝗆𝖾 » ${time}
✦⋆⋅☆⋅⋆✦⋆⋅☆⋅⋆✦⋆⋅☆⋅⋆✦`;

                try {
                    await message.reply(msg);
                } catch (replyError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗋𝖾𝗉𝗅𝗒:", replyError);
                    // Silent fail to avoid spam
                }
            }
        } catch (error) {
            console.error('💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖢𝗁𝖺𝗍:', error);
            // Don't send error message to avoid spam
        }
    }
};
