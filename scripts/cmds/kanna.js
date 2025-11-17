const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "kanna",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "random-images",
        shortDescription: {
            en: "𝖪𝖺𝗇𝗇𝖺 𝖼𝗁𝖺𝗇'𝗌 𝗂𝗆𝖺𝗀𝖾𝗌"
        },
        longDescription: {
            en: "𝖦𝖾𝗍 𝗋𝖺𝗇𝖽𝗈𝗆 𝖪𝖺𝗇𝗇𝖺 𝖼𝗁𝖺𝗇 𝗂𝗆𝖺𝗀𝖾𝗌"
        },
        guide: {
            en: "{p}kanna"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onLoad: function() {
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
    },

    onStart: async function({ message }) {
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

            const loadingMsg = await message.reply("🌸 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖪𝖺𝗇𝗇𝖺 𝖼𝗁𝖺𝗇 𝗂𝗆𝖺𝗀𝖾...");

            // List of Kanna APIs in priority order
            const kannaApis = [
                {
                    name: "𝖿𝖺𝗇𝗍𝗈𝗑-𝖼𝗈𝗌𝗉𝗅𝖺𝗒",
                    url: 'https://fantox-cosplay-api.onrender.com/kanna',
                    handler: (data) => ({
                        imageUrl: data.image,
                        count: data.count || "𝗎𝗇𝗄𝗇𝗈𝗐𝗇"
                    })
                },
                {
                    name: "𝖿𝖺𝗇𝗍𝗈𝗑-𝖼𝗈𝗌𝗉𝗅𝖺𝗒-𝗌𝗍𝖺𝗍𝗂𝖼",
                    url: 'https://fantox-cosplay-api.onrender.com/',
                    handler: (data) => ({
                        imageUrl: data.image,
                        count: data.count || "𝗎𝗇𝗄𝗇𝗈𝗐𝗇"
                    })
                },
                {
        name: "pic-re-anime",
        url: 'https://pic.re/api/v1/images/random', // This is an example - check actual endpoint
        handler: (data) => ({
            imageUrl: data.url, // Adjust based on actual response
            count: "70,000+"
        })
                }
            ];

            let imageData = null;
            let lastError = null;

            // Try each API until we get a valid image
            for (const api of kannaApis) {
                try {
                    console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 ${api.name} 𝖠𝖯𝖨: ${api.url}`);
                    
                    const response = await axios.get(api.url, {
                        timeout: 15000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json'
                        }
                    });

                    if (response.data) {
                        imageData = api.handler(response.data);
                        if (imageData.imageUrl) {
                            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝗐𝗂𝗍𝗁 ${api.name} 𝖠𝖯𝖨`);
                            break;
                        }
                    }
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`❌ ${api.name} 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽:`, apiError.message);
                    continue;
                }
            }

            if (!imageData || !imageData.imageUrl) {
                await message.unsendMessage(loadingMsg.messageID);
                throw new Error(`𝖠𝗅𝗅 𝖪𝖺𝗇𝗇𝖺 𝖠𝖯𝖨𝗌 𝖿𝖺𝗂𝗅𝖾𝖽: ${lastError?.message || "𝗎𝗇𝗄𝗇𝗈𝗐𝗇 𝖾𝗋𝗋𝗈𝗋"}`);
            }

            const ext = path.extname(imageData.imageUrl) || ".jpg";
            const cachePath = path.join(__dirname, "cache", `kanna_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`);

            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 𝖿𝗋𝗈𝗆: ${imageData.imageUrl}`);

            // Download image with timeout and error handling
            try {
                const imageResponse = await axios({
                    url: imageData.imageUrl,
                    method: "GET",
                    responseType: "stream",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://fantox-cosplay-api.onrender.com/'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                const writer = fs.createWriteStream(cachePath);
                imageResponse.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });

                // Verify file was written successfully
                const stats = await fs.stat(cachePath);
                if (stats.size === 0) {
                    throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }

                console.log(`✅ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(stats.size / 1024 / 1024).toFixed(2)}𝖬𝖡)`);

                // Unsend loading message
                try {
                    await message.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                // Send image to thread
                await message.reply({
                    body: `🌸 𝖪𝖺𝗇𝗇𝖺 𝖼𝗁𝖺𝗇'𝗌 𝗂𝗆𝖺𝗀𝖾! <3\n🌸 𝖳𝗈𝗍𝖺𝗅 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾: ${imageData.count} 𝗂𝗆𝖺𝗀𝖾𝗌`,
                    attachment: fs.createReadStream(cachePath)
                });

                // Clean up
                try {
                    await fs.unlink(cachePath);
                    console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

            } catch (downloadError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", downloadError.message);
                
                // Clean up loading message
                try {
                    await message.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾: ${downloadError.message}`);
            }

        } catch (error) {
            console.error("💥 𝖪𝖺𝗇𝗇𝖺 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖪𝖺𝗇𝗇𝖺 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
