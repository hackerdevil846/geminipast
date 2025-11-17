const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "jester",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝖠𝖽𝖽 𝖼𝗅𝗈𝗐𝗇 𝖿𝖺𝖼𝖾 𝖾𝖿𝖿𝖾𝖼𝗍 𝗍𝗈 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾"
        },
        longDescription: {
            en: "𝖠𝗉𝗉𝗅𝗂𝖾𝗌 𝖺 𝖼𝗅𝗈𝗐𝗇 𝖿𝖺𝖼𝖾 𝖾𝖿𝖿𝖾𝖼𝗍 𝗍𝗈 𝗒𝗈𝗎𝗋 𝗈𝗋 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽 𝗎𝗌𝖾𝗋'𝗌 𝖺𝗏𝖺𝗍𝖺𝗋"
        },
        category: "𝖿𝗎𝗇",
        guide: {
            en: "{p}jester [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗈𝗋 𝗋𝖾𝗉𝗅𝗒]\n𝖨𝖿 𝗇𝗈 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗈𝗋 𝗋𝖾𝗉𝗅𝗒, 𝗎𝗌𝖾𝗌 𝗒𝗈𝗎𝗋 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾."
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

            const { senderID, mentions, type, messageReply } = event;

            // Get user ID for avatar
            let uid;
            if (Object.keys(mentions).length > 0) {
                uid = Object.keys(mentions)[0];
            } else if (type === "message_reply") {
                uid = messageReply.senderID;
            } else {
                uid = senderID;
            }

            console.log(`🎭 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗃𝖾𝗌𝗍𝖾𝗋 𝖾𝖿𝖿𝖾𝖼𝗍 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${uid}`);

            const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

            try {
                const res = await axios.get(`https://api.popcat.xyz/v2/clown?image=${encodeURIComponent(avatarURL)}`, {
                    responseType: "arraybuffer",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'image/png,image/*'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                // Check if response is valid image
                const contentType = res.headers['content-type'];
                if (!contentType || !contentType.includes('image')) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨");
                }

                const cacheDir = path.join(__dirname, "cache");
                try {
                    await fs.ensureDir(cacheDir);
                } catch (dirError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
                }

                const filePath = path.join(cacheDir, `jester_${uid}_${Date.now()}.png`);
                
                // Write file with error handling
                try {
                    await fs.writeFile(filePath, res.data);
                    
                    // Verify file was written successfully
                    const stats = await fs.stat(filePath);
                    if (stats.size === 0) {
                        throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                    }

                    console.log(`✅ 𝖩𝖾𝗌𝗍𝖾𝗋 𝗂𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(stats.size / 1024).toFixed(2)}𝖪𝖡)`);

                    await message.reply({
                        body: "🤡 𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝗃𝖾𝗌𝗍𝖾𝗋 𝖾𝖿𝖿𝖾𝖼𝗍 𝗂𝗆𝖺𝗀𝖾!",
                        attachment: fs.createReadStream(filePath)
                    });

                    // Clean up file
                    try {
                        await fs.unlink(filePath);
                        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                    } catch (cleanupError) {
                        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                    }

                } catch (writeError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾 𝖿𝗂𝗅𝖾:", writeError);
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾");
                }

            } catch (apiError) {
                console.error("❌ 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋:", apiError.message);
                
                // Fallback to different API or method
                try {
                    console.log("🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨...");
                    
                    // Alternative API endpoint
                    const fallbackRes = await axios.get(`https://api.popcat.xyz/clown?image=${encodeURIComponent(avatarURL)}`, {
                        responseType: "arraybuffer",
                        timeout: 30000
                    });

                    const cacheDir = path.join(__dirname, "cache");
                    await fs.ensureDir(cacheDir);
                    const filePath = path.join(cacheDir, `jester_${uid}_${Date.now()}_fallback.png`);
                    
                    await fs.writeFile(filePath, fallbackRes.data);
                    
                    const stats = await fs.stat(filePath);
                    if (stats.size > 0) {
                        await message.reply({
                            body: "🤡 𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝗃𝖾𝗌𝗍𝖾𝗋 𝖾𝖿𝖿𝖾𝖼𝗍 𝗂𝗆𝖺𝗀𝖾!",
                            attachment: fs.createReadStream(filePath)
                        });
                        
                        await fs.unlink(filePath);
                    } else {
                        throw new Error("𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖿𝖺𝗂𝗅𝖾𝖽");
                    }
                    
                } catch (fallbackError) {
                    console.error("❌ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽:", fallbackError.message);
                    
                    // Final fallback - send error message
                    await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗃𝖾𝗌𝗍𝖾𝗋 𝖾𝖿𝖿𝖾𝖼𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                }
            }

        } catch (error) {
            console.error("💥 𝖩𝖾𝗌𝗍𝖾𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            try {
                await message.reply(errorMessage);
            } catch (finalError) {
                console.error("💥 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", finalError);
            }
        }
    }
};
