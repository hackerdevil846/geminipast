const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports = {
    config: {
        name: "fbautodownload",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗋𝗈𝗆 𝗌𝗁𝖺𝗋𝖾𝖽 𝗅𝗂𝗇𝗄𝗌"
        },
        longDescription: {
            en: "✨ 𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗋𝗈𝗆 𝗌𝗁𝖺𝗋𝖾𝖽 𝗅𝗂𝗇𝗄𝗌"
        },
        guide: {
            en: "𝖩𝗎𝗌𝗍 𝗌𝖾𝗇𝖽 𝖺 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗏𝗂𝖽𝖾𝗈 𝗅𝗂𝗇𝗄"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        return message.reply(
            `🎭 | 𝖤𝗂 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖽𝗂𝗋𝖾𝖼𝗍𝗅𝗒 𝗎𝗌𝖾 𝖼𝗈𝗋𝗍𝖾 𝗁𝗈𝖻𝖾 𝗇𝖺!\n✦ 𝖩𝗎𝗌𝗍 𝖾𝗄𝗍𝖺 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗏𝗂𝖽𝖾𝗈 𝗅𝗂𝗇𝗄 𝗉𝖺𝗍𝗁𝖺𝗈, 𝖺𝗋 𝖺𝗆𝗂 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖼𝗈𝗋𝖾 𝗉𝖺𝗍𝗁𝖺𝗂 𝖽𝗂𝖻𝗈 ✨`
        );
    },

    onChat: async function({ message, event }) {
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
                return;
            }

            if (event.type !== "message" || !event.body) return;
            
            const fbRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/(share|reel|watch)\/.+/i;
            const fbRegex2 = /^(https?:\/\/)?(www\.)?fb\.watch\/.+/i;
            
            if (!fbRegex.test(event.body) && !fbRegex2.test(event.body)) return;
            
            const loadingMsg = await message.reply("🔄 | 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗌𝗎𝗋𝗎 𝗁𝗈𝖼𝖼𝗁𝖾, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...");
            
            // Try multiple download methods
            let videoUrl = null;
            let lastError = null;
            
            // List of download APIs to try
            const downloadApis = [
                {
                    name: "𝖥𝖡 𝖠𝖯𝖨 1",
                    url: `https://fb-api.0x87.repl.co/fb?url=${encodeURIComponent(event.body)}`,
                    handler: (response) => response.data?.hd || response.data?.sd
                },
                {
                    name: "𝖥𝖡 𝖠𝖯𝖨 2", 
                    url: `https://apis-samir.onrender.com/fbdl?url=${encodeURIComponent(event.body)}`,
                    handler: (response) => response.data?.videoUrl
                },
                {
                    name: "𝖥𝖡 𝖠𝖯𝖨 3",
                    url: `https://api.samirzyx.repl.co/api/facebook?url=${encodeURIComponent(event.body)}`,
                    handler: (response) => response.data?.url
                }
            ];
            
            // Try each API
            for (const api of downloadApis) {
                try {
                    console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 ${api.name}: ${api.url}`);
                    
                    const response = await axios.get(api.url, {
                        timeout: 30000,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                        }
                    });
                    
                    videoUrl = api.handler(response);
                    
                    if (videoUrl) {
                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝖿𝗋𝗈𝗆 ${api.name}: ${videoUrl}`);
                        break;
                    } else {
                        throw new Error("𝖭𝗈 𝗏𝗂𝖽𝖾𝗈 𝖴𝖱𝖫 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
                    }
                    
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`❌ ${api.name} 𝖿𝖺𝗂𝗅𝖾𝖽:`, apiError.message);
                    continue;
                }
            }
            
            if (!videoUrl) {
                await message.unsendMessage(loadingMsg.messageID);
                return message.reply(
                    "❌ | 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖺𝖻𝗅𝖾 𝗄𝗈𝗇𝗈 𝗏𝗂𝖽𝖾𝗈 𝗊𝗎𝖺𝗅𝗂𝗍𝗒 𝗉𝖺𝗈𝗐𝖺 𝗃𝖺𝗂𝗇𝗂!"
                );
            }
            
            // Download the video
            const tempPath = path.join(os.tmpdir(), `fb_video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`);
            
            try {
                console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈 𝖿𝗋𝗈𝗆: ${videoUrl}`);
                
                const response = await axios({
                    method: 'GET',
                    url: videoUrl,
                    responseType: 'stream',
                    timeout: 60000,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Referer": "https://facebook.com/",
                        "Accept": "video/mp4,video/*"
                    },
                    maxContentLength: 50 * 1024 * 1024 // 50MB limit
                });

                const writer = fs.createWriteStream(tempPath);
                response.data.pipe(writer);
                
                await new Promise((resolve, reject) => {
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });
                
                // Check file size and validity
                const stats = await fs.stat(tempPath);
                const fileSize = stats.size;
                
                if (fileSize === 0) {
                    throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }
                
                if (fileSize > 25000000) { // 25MB limit
                    await fs.unlink(tempPath);
                    await message.unsendMessage(loadingMsg.messageID);
                    return message.reply(
                        "❌ | 𝖵𝗂𝖽𝖾𝗈 𝗌𝗂𝗓𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾 (𝗆𝗈𝗋𝖾 𝗍𝗁𝖺𝗇 25𝖬𝖡)!"
                    );
                }
                
                console.log(`✅ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(fileSize / 1024 / 1024).toFixed(2)}𝖬𝖡)`);
                
                await message.unsendMessage(loadingMsg.messageID);
                
                await message.reply(
                    {
                        body: `✅ | 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗒𝗈𝗎𝗋 𝗏𝗂𝖽𝖾𝗈!\n🎥 𝖰𝗎𝖺𝗅𝗂𝗍𝗒: 𝖧𝖣`,
                        attachment: fs.createReadStream(tempPath)
                    }
                );
                
                // Clean up file
                await fs.unlink(tempPath);
                console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                
            } catch (downloadError) {
                console.error("❌ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", downloadError.message);
                
                // Clean up file if it exists
                try {
                    if (await fs.pathExists(tempPath)) {
                        await fs.unlink(tempPath);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉 𝗂𝗅𝖾:", cleanupError.message);
                }
                
                await message.unsendMessage(loadingMsg.messageID);
                await message.reply(
                    "❌ | 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋!"
                );
            }
            
        } catch (error) {
            console.error("💥 𝖥𝖡 𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
