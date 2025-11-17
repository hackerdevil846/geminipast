const axios = require("axios");

module.exports = {
    config: {
        name: "joke",
        aliases: [],
        version: "2.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖦𝖾𝗍 𝗋𝖺𝗇𝖽𝗈𝗆 𝗃𝗈𝗄𝖾𝗌 𝖿𝗋𝗈𝗆 𝗈𝖿𝖿𝗂𝖼𝗂𝖺𝗅 𝖠𝖯𝖨"
        },
        longDescription: {
            en: "𝖥𝖾𝗍𝖼𝗁𝖾𝗌 𝗋𝖺𝗇𝖽𝗈𝗆 𝗃𝗈𝗄𝖾𝗌 𝖿𝗋𝗈𝗆 𝗈𝖿𝖿𝗂𝖼𝗂𝖺𝗅 𝗃𝗈𝗄𝖾 𝖠𝖯𝖨"
        },
        guide: {
            en: "{p}joke"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            console.log("🔗 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗃𝗈𝗄𝖾 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨...");

            const response = await axios.get("https://official-joke-api.appspot.com/random_joke", {
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                }
            });

            if (!response.data || !response.data.setup || !response.data.punchline) {
                throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
            }

            const { setup, punchline } = response.data;
            
            const jokeMessage = `🤡 | ${setup}\n\n💥 | ${punchline}\n\n✨ 𝖢𝗋𝖾𝖽𝗂𝗍: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;
            
            console.log("✅ 𝖩𝗈𝗄𝖾 𝖿𝖾𝗍𝖼𝗁𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
            await message.reply(jokeMessage);
        } 
        catch (error) {
            console.error("💥 𝖩𝗈𝗄𝖾 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖲𝗈𝗋𝗋𝗒, 𝖼𝗈𝗎𝗅𝖽𝗇'𝗍 𝖿𝖾𝗍𝖼𝗁 𝗃𝗈𝗄𝖾𝗌 𝖺𝗍 𝗍𝗁𝖾 𝗆𝗈𝗆𝖾𝗇𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.response) {
                errorMessage = `❌ 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋: ${error.response.status} - ${error.response.statusText}`;
            }
            
            await message.reply(errorMessage);
        }
    }
};
