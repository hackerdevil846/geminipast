const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "dogfact",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖱𝖺𝗇𝖽𝗈𝗆 𝖽𝗈𝗀 𝗂𝗆𝖺𝗀𝖾𝗌 𝗐𝗂𝗍𝗁 𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍𝗂𝗇𝗀 𝖿𝖺𝖼𝗍𝗌"
        },
        longDescription: {
            en: "𝖦𝖾𝗍 𝗋𝖺𝗇𝖽𝗈𝗆 𝖽𝗈𝗀 𝗂𝗆𝖺𝗀𝖾𝗌 𝗐𝗂𝗍𝗁 𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍𝗂𝗇𝗀 𝖿𝖺𝖼𝗍𝗌 𝖺𝖻𝗈𝗎𝗍 𝖽𝗈𝗀𝗌"
        },
        guide: {
            en: "{p}dogfact"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const { threadID, messageID } = event;

            const loadingMsg = await message.reply("⏳ 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖽𝗈𝗀 𝖿𝖺𝖼𝗍...");

            try {
                const res = await axios.get(`https://some-random-api.com/animal/dog`, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!res.data || !res.data.image || !res.data.fact) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨");
                }

                const data = res.data;

                const imageResponse = await axios.get(data.image, { 
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                // Check content type
                const contentType = imageResponse.headers['content-type'];
                if (!contentType || !contentType.startsWith('image/')) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗍𝗒𝗉𝖾");
                }

                const imagePath = __dirname + `/cache/dog_${Date.now()}.png`;
                await fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));

                // Verify file was written
                const stats = await fs.stat(imagePath);
                if (stats.size < 1000) {
                    throw new Error("𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗌𝗆𝖺𝗅𝗅");
                }

                // Delete loading message
                try {
                    await message.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                await message.reply({
                    body: `🐶 | 𝖣𝗈𝗀 𝖥𝖺𝖼𝗍:\n${data.fact}`,
                    attachment: fs.createReadStream(imagePath)
                });

                // Clean up file
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (cleanupError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖽𝖾𝗅𝖾𝗍𝖾 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }
                
            } catch (apiError) {
                // Delete loading message
                try {
                    await message.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                console.error("❌ 𝖣𝗈𝗀𝖥𝖺𝖼𝗍 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError.message);
                
                let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖽𝗈𝗀 𝖿𝖺𝖼𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                } else if (apiError.message.includes('maxContentLength')) {
                    errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                } else if (apiError.message.includes('content type')) {
                    errorMessage = "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗋𝗆𝖺𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                }
                
                await message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝖣𝗈𝗀𝖥𝖺𝖼𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('threadsData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
