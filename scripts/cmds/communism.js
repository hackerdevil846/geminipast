const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "communism",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        shortDescription: {
            en: "𝖠𝗉𝗉𝗅𝗒 𝖼𝗈𝗆𝗆𝗎𝗇𝗂𝗌𝗆 𝖾𝖿𝖿𝖾𝖼𝗍 𝗍𝗈 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗁𝗈𝗍𝗈"
        },
        longDescription: {
            en: "𝖠𝖽𝖽𝗌 𝖺 𝖼𝗈𝗆𝗆𝗎𝗇𝗂𝗌𝗍-𝗌𝗍𝗒𝗅𝖾 𝗋𝖾𝖽 𝖿𝗂𝗅𝗍𝖾𝗋 𝗍𝗈 𝗒𝗈𝗎𝗋 𝗈𝗋 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝖾𝗅𝗌𝖾'𝗌 𝖺𝗏𝖺𝗍𝖺𝗋"
        },
        category: "fun",
        guide: {
            en: "{p}communism [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗈𝗋 𝗋𝖾𝗉𝗅𝗒]\n\n𝖣𝖾𝖿𝖺𝗎𝗅𝗍: 𝖸𝗈𝗎𝗋 𝗈𝗐𝗇 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾"
        },
        dependencies: {
            "axios": "",
            "fs": "",
            "path": ""
        }
    },

    onStart: async function({ api, event, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const { senderID, mentions, type, messageReply } = event;

            let uid;
            if (Object.keys(mentions).length > 0) {
                uid = Object.keys(mentions)[0];
            } else if (type === "message_reply") {
                uid = messageReply.senderID;
            } else {
                uid = senderID;
            }

            // Validate user ID
            if (!uid || isNaN(uid)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖨𝖣. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

            console.log(`🔗 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${uid}`);

            // Create cache directory
            const cacheDir = path.join(__dirname, "cache");
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const filePath = path.join(cacheDir, `communism_${uid}_${Date.now()}.jpg`);

            try {
                const res = await axios.get(`https://api.popcat.xyz/v2/communism?image=${encodeURIComponent(avatarURL)}`, {
                    responseType: "arraybuffer",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                // Check if response is valid image data
                if (!res.data || res.data.length === 0) {
                    throw new Error("𝖤𝗆𝗉𝗍𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨");
                }

                // Write file to cache
                fs.writeFileSync(filePath, res.data);

                // Verify file was written successfully
                const stats = fs.statSync(filePath);
                if (stats.size === 0) {
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾");
                }

                console.log(`✅ 𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(stats.size / 1024 / 1024).toFixed(2)}𝖬𝖡)`);

                await message.reply({
                    body: "☭ | 𝖳𝗁𝖾 𝗋𝖾𝗏𝗈𝗅𝗎𝗍𝗂𝗈𝗇 𝗁𝖺𝗌 𝖻𝖾𝗀𝗎𝗇!",
                    attachment: fs.createReadStream(filePath)
                });

                // Clean up file
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

            } catch (apiError) {
                console.error("❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError.message);
                
                // Clean up file if it exists
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

                let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖢𝗈𝗆𝗆𝗎𝗇𝗂𝗌𝗍 𝗆𝖾𝗆𝖾.";
                
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                } else if (apiError.response?.status === 404) {
                    errorMessage = "❌ 𝖴𝗌𝖾𝗋 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽.";
                }
                
                await message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝖢𝗈𝗆𝗆𝗎𝗇𝗂𝗌𝗆 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖿𝗂𝗅𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            } else if (error.message.includes('ENOENT')) {
                errorMessage = "❌ 𝖥𝗂𝗅𝖾 𝗈𝗋 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
