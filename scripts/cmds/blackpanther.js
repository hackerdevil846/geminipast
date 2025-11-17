const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "blackpanther",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖡𝗅𝖺𝖼𝗄 𝖯𝖺𝗇𝗍𝗁𝖾𝗋 𝗆𝖾𝗆𝖾 𝗍𝖾𝗑𝗍"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖼𝗎𝗌𝗍𝗈𝗆 𝖡𝗅𝖺𝖼𝗄 𝖯𝖺𝗇𝗍𝗁𝖾𝗋 𝗌𝗍𝗒𝗅𝖾 𝗍𝖾𝗑𝗍 𝗂𝗆𝖺𝗀𝖾𝗌 𝗐𝗂𝗍𝗁 𝗍𝗐𝗈 𝗍𝖾𝗑𝗍 𝗅𝗂𝗇𝖾𝗌"
        },
        category: "fun",
        guide: {
            en: "{p}blackpanther 𝗍𝖾𝗑𝗍1 | 𝗍𝖾𝗑𝗍2"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, event, args }) {
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

            const text = args.join(" ");
            if (!text.includes(' | ')) {
                return message.reply("✨ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗍𝗁𝖾 𝖼𝗈𝗋𝗋𝖾𝖼𝗍 𝖿𝗈𝗋𝗆𝖺𝗍: {p}blackpanther 𝗍𝖾𝗑𝗍1 | 𝗍𝖾𝗑𝗍2");
            }

            const [text1, text2] = text.split(' | ').map(t => t.trim());
            
            if (!text1 || !text2) {
                return message.reply("🌸 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖻𝗈𝗍𝗁 𝗍𝖾𝗑𝗍1 𝖺𝗇𝖽 𝗍𝖾𝗑𝗍2 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽 𝖻𝗒 ' | '");
            }

            // Validate text length
            if (text1.length > 50 || text2.length > 50) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗍𝖾𝗑𝗍 𝗎𝗇𝖽𝖾𝗋 50 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, "cache");
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const imagePath = path.join(cacheDir, `blackpanther_${Date.now()}.png`);
            const encodedText1 = encodeURIComponent(text1);
            const encodedText2 = encodeURIComponent(text2);
            
            const imageUrl = `https://api.memegen.link/images/wddth/${encodedText1}/${encodedText2}.png`;

            console.log(`🖤 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝖡𝗅𝖺𝖼𝗄 𝖯𝖺𝗇𝗍𝗁𝖾𝗋 𝗂𝗆𝖺𝗀𝖾: ${text1} | ${text2}`);

            // Download the image with timeout and error handling
            try {
                const response = await axios({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'stream',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                const writer = fs.createWriteStream(imagePath);

                // Handle stream events
                writer.on('finish', async () => {
                    try {
                        // Verify file was written successfully
                        const stats = await fs.stat(imagePath);
                        if (stats.size === 0) {
                            throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                        }

                        console.log(`✅ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${stats.size} 𝖻𝗒𝗍𝖾𝗌)`);

                        await message.reply({
                            body: `🖤 𝖡𝗅𝖺𝖼𝗄 𝖯𝖺𝗇𝗍𝗁𝖾𝗋 𝖳𝖾𝗑𝗍 𝖢𝗋𝖾𝖺𝗍𝖾𝖽! 🐾\n\n» 𝖳𝖾𝗑𝗍 1: ${text1}\n» 𝖳𝖾𝗑𝗍 2: ${text2}`,
                            attachment: fs.createReadStream(imagePath)
                        });

                        // Clean up the file after sending
                        try {
                            await fs.unlink(imagePath);
                            console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                        } catch (cleanupError) {
                            console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                        }

                    } catch (sendError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", sendError);
                        
                        // Clean up file on error
                        try {
                            if (await fs.pathExists(imagePath)) {
                                await fs.unlink(imagePath);
                            }
                        } catch (cleanupError) {
                            console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                        }
                    }
                });

                writer.on('error', async (error) => {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗐𝗋𝗂𝗍𝗂𝗇𝗀 𝖿𝗂𝗅𝖾:", error);
                    
                    // Clean up file on error
                    try {
                        if (await fs.pathExists(imagePath)) {
                            await fs.unlink(imagePath);
                        }
                    } catch (cleanupError) {
                        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                    }
                });

                response.data.pipe(writer);

            } catch (downloadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾:", downloadError.message);
                
                let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖡𝗅𝖺𝖼𝗄 𝖯𝖺𝗇𝗍𝗁𝖾𝗋 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                
                if (downloadError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
                } else if (downloadError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                }
                
                await message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝖡𝗅𝖺𝖼𝗄 𝖯𝖺𝗇𝗍𝗁𝖾𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            
            if (error.message.includes('ENOENT')) {
                errorMessage = "❌ 𝖥𝗂𝗅𝖾 𝗌𝗒𝗌𝗍𝖾𝗆 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('network')) {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
