/** 
const axios = require("axios");

module.exports = {
    config: {
        name: "lina",
        aliases: [],
        version: '1.2',
        author: '𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑',
        countDown: 0,
        role: 0,
        shortDescription: {
            en: '𝖠𝖨 𝖢𝖧𝖠𝖳'
        },
        longDescription: {
            en: '𝖢𝗁𝖺𝗍 𝗐𝗂𝗍𝗁 𝖫𝗂𝗇𝖺 𝖠𝖨'
        },
        category: 'ai chat',
        guide: {
            en: '{p}lina <𝗆𝖾𝗌𝗌𝖺𝗀𝖾>'
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            if (args[0] == 'on' || args[0] == 'off') {
                return message.reply(args[0] == "on" ? 
                    "𝖨𝗍'𝗌 𝗍𝗂𝗆𝖾 𝗍𝗈 𝖼𝗅𝖺𝗌𝗁 𝗍𝗁𝖾 𝖧𝖠𝖨𝖳𝖠𝖭𝖨 𝗐𝖺𝗒😈!" : 
                    "𝖸𝗈𝗎'𝗋𝖾 𝗌𝗈 𝗌𝖼𝖺𝗋𝖾𝖽 𝗈𝖿 𝗆𝖾 𝗒𝗈𝗎 𝗍𝗎𝗋𝗇 𝗆𝖾 𝗈𝖿𝖿 𝗌𝗈𝗇 𝗈𝖿 𝖺 𝖻𝗂𝗍𝖼𝗁🖕!"
                );
            }
            else if (args[0]) {
                const yourMessage = args.join(" ");
                try {
                    const responseMessage = await getMessage(yourMessage);
                    return message.reply(`${responseMessage}`);
                }
                catch (err) {
                    console.error("💥 𝖫𝗂𝗇𝖺 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋:", err);
                    return message.reply("𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗄𝗇𝗈𝗐 𝗁𝗈𝗐 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾?🙂");
                }
            } else {
                return message.reply("💬 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖼𝗁𝖺𝗍 𝗐𝗂𝗍𝗁 𝖫𝗂𝗇𝖺!\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}lina 𝗁𝖾𝗅𝗅𝗈");
            }
        } catch (error) {
            console.error("💥 𝖫𝗂𝗇𝖺 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            return message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    },

    onChat: async ({ message, event, args }) => {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            if (args.length > 1) {
                try {
                    const responseMessage = await getMessage(args.join(" "));
                    return message.reply(`${responseMessage}`);
                }
                catch (err) {
                    console.error("💥 𝖫𝗂𝗇𝖺 𝖼𝗁𝖺𝗍 𝖾𝗋𝗋𝗈𝗋:", err);
                    return message.reply("𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗄𝗇𝗈𝗐 𝗁𝗈𝗐 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾?🙂");
                }
            }
        } catch (error) {
            console.error("💥 𝖫𝗂𝗇𝖺 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};

async function getMessage(yourMessage) {
    try {
        const res = await axios.post(
            'https://api.simsimi.vn/v1/simtalk',
            new URLSearchParams({
                'text': yourMessage,
                'lc': 'en'
            }),
            {
                timeout: 15000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );

        if (res.status !== 200) {
            throw new Error(`𝖠𝖯𝖨 𝗋𝖾𝗍𝗎𝗋𝗇𝖾𝖽 𝗌𝗍𝖺𝗍𝗎𝗌 ${res.status}`);
        }

        if (!res.data || !res.data.message) {
            throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
        }

        return res.data.message;
    } catch (error) {
        console.error("💥 𝖲𝗂𝗆𝖲𝗂𝗆𝗂 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋:", error);
        
        // Fallback responses if API fails
        const fallbackResponses = [
            "𝖨'𝗆 𝗁𝖾𝗋𝖾, 𝗐𝗁𝖺𝗍'𝗌 𝗎𝗉? 💫",
            "𝖧𝖾𝗒 𝗍𝗁𝖾𝗋𝖾! 𝖧𝗈𝗐 𝖼𝖺𝗇 𝖨 𝗁𝖾𝗅𝗉 𝗒𝗈𝗎 𝗍𝗈𝖽𝖺𝗒? ✨",
            "𝖨'𝗆 𝗅𝗂𝗌𝗍𝖾𝗇𝗂𝗇𝗀, 𝗍𝖾𝗅𝗅 𝗆𝖾 𝗆𝗈𝗋𝖾! 🌟",
            "𝖳𝗁𝖺𝗍'𝗌 𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍𝗂𝗇𝗀! 𝖶𝗁𝖺𝗍 𝖾𝗅𝗌𝖾? 💭",
            "𝖨'𝗆 𝖺𝗅𝗅 𝖾𝖺𝗋𝗌, 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾... 👂"
        ];
        
        const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        return randomFallback;
    }
}
*/
