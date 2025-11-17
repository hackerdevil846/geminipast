const axios = require("axios");

module.exports = {
    config: {
        name: "baybayin",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖢𝗈𝗇𝗏𝖾𝗋𝗍 𝗍𝖾𝗑𝗍 𝗍𝗈 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝗌𝖼𝗋𝗂𝗉𝗍"
        },
        longDescription: {
            en: "𝖢𝗈𝗇𝗏𝖾𝗋𝗍𝗌 𝗍𝖾𝗑𝗍 𝗍𝗈 𝖺𝗇𝖼𝗂𝖾𝗇𝗍 𝖥𝗂𝗅𝗂𝗉𝗂𝗇𝗈 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝗌𝖼𝗋𝗂𝗉𝗍"
        },
        guide: {
            en: "{p}baybayin [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
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

            if (!args[0]) {
                return message.reply("🌺 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗍𝖾𝗑𝗍 𝗍𝗈 𝖼𝗈𝗇𝗏𝖾𝗋𝗍 𝗍𝗈 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝗌𝖼𝗋𝗂𝗉𝗍!\n💡 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖻𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝗄𝖺𝗆𝗎𝗌𝗍𝖺");
            }

            const text = args.join(" ").trim();
            
            // Validate text length
            if (text.length > 500) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 500 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            if (text.length < 1) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗏𝖺𝗅𝗂𝖽 𝗍𝖾𝗑𝗍.");
            }

            const loadingMsg = await message.reply("⏳ 𝖢𝗈𝗇𝗏𝖾𝗋𝗍𝗂𝗇𝗀 𝗍𝖾𝗑𝗍 𝗍𝗈 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝗌𝖼𝗋𝗂𝗉𝗍...");

            try {
                const response = await axios.get(`https://api-baybayin-transliterator.vercel.app/?text=${encodeURIComponent(text)}`, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!response.data || !response.data.baybay) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
                }

                const baybayinText = response.data.baybay;

                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                const formattedMessage = 
                    "🪷 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝖢𝗈𝗇𝗏𝖾𝗋𝗌𝗂𝗈𝗇 🪷\n\n" +
                    "✨ 𝖮𝗋𝗂𝗀𝗂𝗇𝖺𝗅:\n" +
                    `"${text}"\n\n` +
                    "🏮 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝖲𝖼𝗋𝗂𝗉𝗍:\n" +
                    `"${baybayinText}"\n\n` +
                    "📜 𝖠𝖻𝗈𝗎𝗍 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇:\n" +
                    "𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝗂𝗌 𝖺𝗇 𝖺𝗇𝖼𝗂𝖾𝗇𝗍 𝖥𝗂𝗅𝗂𝗉𝗂𝗇𝗈 𝗌𝖼𝗋𝗂𝗉𝗍 𝗎𝗌𝖾𝖽 𝖻𝖾𝖿𝗈𝗋𝖾 𝗍𝗁𝖾 𝖲𝗉𝖺𝗇𝗂𝗌𝗁 𝖾𝗋𝖺.";

                return message.reply(formattedMessage);

            } catch (apiError) {
                console.error("❌ 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError.message);
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                let errorMessage = `❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗈𝗇𝗏𝖾𝗋𝗍𝗂𝗇𝗀 "${text}" 𝗍𝗈 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.`;
                
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                } else if (apiError.response?.status === 404) {
                    errorMessage = "❌ 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝖠𝖯𝖨 𝗂𝗌 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝗅𝖺𝗍𝖾𝗋.";
                }
                
                return message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝖡𝖺𝗒𝖻𝖺𝗒𝗂𝗇 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('dependencies')) {
                errorMessage = "❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
