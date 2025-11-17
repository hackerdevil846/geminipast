const axios = require("axios");

module.exports = {
    config: {
        name: "binarydecode",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 0,
        shortDescription: {
            en: "𝖣𝖾𝖼𝗈𝖽𝖾 𝖻𝗂𝗇𝖺𝗋𝗒 𝗍𝖾𝗑𝗍 𝗎𝗌𝗂𝗇𝗀 𝖯𝗈𝗉𝖢𝖺𝗍 𝖠𝖯𝖨"
        },
        longDescription: {
            en: "𝖣𝖾𝖼𝗈𝖽𝖾𝗌 𝖻𝗂𝗇𝖺𝗋𝗒 𝗌𝗍𝗋𝗂𝗇𝗀𝗌 𝗍𝗈 𝗍𝖾𝗑𝗍"
        },
        category: "utility",
        guide: {
            en: "{p}binarydecode <𝖻𝗂𝗇𝖺𝗋𝗒>\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}binarydecode 0110100001100101"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, args, event }) {
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

            if (!args.length) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝖻𝗂𝗇𝖺𝗋𝗒 𝗌𝗍𝗋𝗂𝗇𝗀 𝗍𝗈 𝖽𝖾𝖼𝗈𝖽𝖾.\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾:\n{p}binarydecode 0110100001100101");
            }

            const binary = args.join(" ").trim();

            // Validate binary input length
            if (binary.length < 8) {
                return message.reply("❌ 𝖡𝗂𝗇𝖺𝗋𝗒 𝗌𝗍𝗋𝗂𝗇𝗀 𝗆𝗎𝗌𝗍 𝖻𝖾 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 8 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 𝗅𝗈𝗇𝗀.");
            }

            if (binary.length > 1000) {
                return message.reply("❌ 𝖡𝗂𝗇𝖺𝗋𝗒 𝗌𝗍𝗋𝗂𝗇𝗀 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 1000 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 𝖺𝗅𝗅𝗈𝗐𝖾𝖽.");
            }

            // Validate binary input contains only 0s and 1s
            if (!/^[01\s]+$/.test(binary)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖻𝗂𝗇𝖺𝗋𝗒 𝗌𝗍𝗋𝗂𝗇𝗀. 𝖮𝗇𝗅𝗒 0, 1, 𝖺𝗇𝖽 𝗌𝗉𝖺𝖼𝖾𝗌 𝖺𝗋𝖾 𝖺𝗅𝗅𝗈𝗐𝖾𝖽.");
            }

            // Remove spaces for API call
            const cleanBinary = binary.replace(/\s/g, "");

            // Validate binary length is multiple of 8
            if (cleanBinary.length % 8 !== 0) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖻𝗂𝗇𝖺𝗋𝗒 𝗅𝖾𝗇𝗀𝗍𝗁. 𝖡𝗂𝗇𝖺𝗋𝗒 𝗌𝗍𝗋𝗂𝗇𝗀 𝗆𝗎𝗌𝗍 𝖻𝖾 𝖺 𝗆𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝗈𝖿 8.");
            }

            console.log(`🔡 𝖣𝖾𝖼𝗈𝖽𝗂𝗇𝗀 𝖻𝗂𝗇𝖺𝗋𝗒: ${cleanBinary.substring(0, 50)}...`);

            try {
                const res = await axios.get(`https://api.popcat.xyz/v2/decode?binary=${encodeURIComponent(cleanBinary)}`, {
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!res.data || !res.data.result) {
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝖼𝗈𝖽𝖾 𝖻𝗂𝗇𝖺𝗋𝗒. 𝖠𝖯𝖨 𝗋𝖾𝗍𝗎𝗋𝗇𝖾𝖽 𝗂𝗇𝗏𝖺𝗅𝗂𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾.");
                }

                const decodedText = res.data.result;

                // Validate decoded text
                if (typeof decodedText !== 'string' || decodedText.trim() === '') {
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝖼𝗈𝖽𝖾 𝖻𝗂𝗇𝖺𝗋𝗒. 𝖱𝖾𝗌𝗎𝗅𝗍 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒 𝗈𝗋 𝗂𝗇𝗏𝖺𝗅𝗂𝖽.");
                }

                // Truncate long results
                const displayText = decodedText.length > 500 
                    ? decodedText.substring(0, 500) + "... [𝗍𝗋𝗎𝗇𝖼𝖺𝗍𝖾𝖽]" 
                    : decodedText;

                await message.reply(`🔡 𝖡𝗂𝗇𝖺𝗋𝗒 𝖣𝖾𝖼𝗈𝖽𝖾𝖽 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!\n\n📥 𝖨𝗇𝗉𝗎𝗍: ${binary.substring(0, 50)}${binary.length > 50 ? "..." : ""}\n📤 𝖮𝗎𝗍𝗉𝗎𝗍: ${displayText}`);

            } catch (apiError) {
                console.error("❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError.message);

                let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝖼𝗈𝖽𝖾 𝖻𝗂𝗇𝖺𝗋𝗒.";

                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍 𝗍𝗈 𝖯𝗈𝗉𝖢𝖺𝗍 𝖠𝖯𝖨. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                } else if (apiError.response) {
                    errorMessage = `❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋: ${apiError.response.status} - ${apiError.response.statusText}`;
                }

                await message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝖡𝗂𝗇𝖺𝗋𝗒 𝖣𝖾𝖼𝗈𝖽𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖽𝖾𝖼𝗈𝖽𝗂𝗇𝗀 𝖻𝗂𝗇𝖺𝗋𝗒. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";

            if (error.message.includes('memory') || error.message.includes('heap')) {
                errorMessage = "❌ 𝖬𝖾𝗆𝗈𝗋𝗒 𝖾𝗋𝗋𝗈𝗋. 𝖡𝗂𝗇𝖺𝗋𝗒 𝗌𝗍𝗋𝗂𝗇𝗀 𝗂𝗌 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾.";
            }

            await message.reply(errorMessage);
        }
    }
};
