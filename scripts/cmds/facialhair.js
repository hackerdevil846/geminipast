const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const axios = require("axios");

module.exports = {
    config: {
        name: "facialhair",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝖱𝖺𝗇𝖽𝗈𝗆 𝖻𝖾𝖺𝗋𝖽 𝗌𝗍𝗒𝗅𝖾 𝖺𝗏𝖺𝗍𝖺𝗋"
        },
        longDescription: {
            en: "𝖲𝖾𝗇𝖽𝗌 𝖺 𝗋𝖺𝗇𝖽𝗈𝗆𝗅𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗆𝖺𝗌𝖼𝗎𝗅𝗂𝗇𝖾 𝖿𝖺𝖼𝗂𝖺𝗅 𝗁𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾"
        },
        category: "𝖿𝗎𝗇",
        guide: {
            en: "{p}facialhair"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "https": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("https");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝗁𝗍𝗍𝗉𝗌.");
            }

            const imgUrl = "https://placebeard.it/400x400";
            const cacheDir = path.join(__dirname, "cache");
            const filePath = path.join(cacheDir, `beard_${Date.now()}.jpg`);
            
            // Create cache directory if it doesn't exist
            try {
                await fs.ensureDir(cacheDir);
                console.log("✅ 𝖢𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖾𝗇𝗌𝗎𝗋𝖾𝖽");
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝖺𝖼𝗂𝖺𝗅 𝗁𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾 𝖿𝗋𝗈𝗆: ${imgUrl}`);

            // Try HTTPS first with better error handling
            let downloadSuccess = false;
            
            try {
                await new Promise((resolve, reject) => {
                    const file = fs.createWriteStream(filePath);
                    
                    const request = https.get(imgUrl, response => {
                        // Check response status
                        if (response.statusCode !== 200) {
                            reject(new Error(`𝖧𝖳𝖳𝖯𝗌 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝗌𝗍𝖺𝗍𝗎𝗌: ${response.statusCode}`));
                            return;
                        }

                        // Check content type
                        const contentType = response.headers['content-type'];
                        if (!contentType || !contentType.startsWith('image/')) {
                            reject(new Error(`𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗍𝗒𝗉𝖾: ${contentType}`));
                            return;
                        }

                        response.pipe(file);
                        
                        file.on("finish", () => {
                            file.close(() => {
                                console.log("✅ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗏𝗂𝖺 𝖧𝖳𝖳𝖯𝗌");
                                resolve();
                            });
                        });
                    });

                    request.on("error", (error) => {
                        reject(new Error(`𝖧𝖳𝖳𝖯𝗌 𝗋𝖾𝗊𝗎𝖾𝗌𝗍 𝖿𝖺𝗂𝗅𝖾𝖽: ${error.message}`));
                    });

                    request.setTimeout(30000, () => {
                        request.destroy();
                        reject(new Error("𝖧𝖳𝖳𝖯𝗌 𝗋𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍"));
                    });
                });

                downloadSuccess = true;

            } catch (httpsError) {
                console.error("❌ 𝖧𝖳𝖳𝖯𝗌 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽:", httpsError.message);
                
                // Try fallback with axios
                try {
                    console.log("🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖺𝗑𝗂𝗈𝗌 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄...");
                    
                    const response = await axios({
                        method: 'GET',
                        url: imgUrl,
                        responseType: 'stream',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    const writer = fs.createWriteStream(filePath);
                    response.data.pipe(writer);

                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });

                    downloadSuccess = true;
                    console.log("✅ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗏𝗂𝖺 𝖺𝗑𝗂𝗈𝗌");

                } catch (axiosError) {
                    console.error("❌ 𝖠𝗑𝗂𝗈𝗌 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽:", axiosError.message);
                }
            }

            if (downloadSuccess) {
                // Verify file was written successfully
                try {
                    const stats = await fs.stat(filePath);
                    if (stats.size === 0) {
                        throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                    }

                    console.log(`✅ 𝖨𝗆𝖺𝗀𝖾 𝗏𝖾𝗋𝗂𝖿𝗂𝖾𝖽 (${(stats.size / 1024).toFixed(2)}𝖪𝖡)`);

                    await message.reply({
                        body: "🧔 𝖱𝖺𝗇𝖽𝗈𝗆 𝖥𝖺𝖼𝗂𝖺𝗅 𝖧𝖺𝗂𝗋 𝖠𝗏𝖺𝗍𝖺𝗋",
                        attachment: fs.createReadStream(filePath)
                    });

                    console.log("✅ 𝖬𝖾𝗌𝗌𝖺𝗀𝖾 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");

                } catch (fileError) {
                    console.error("❌ 𝖥𝗂𝗅𝖾 𝗏𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽:", fileError.message);
                    await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                }
            } else {
                await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝖼𝗂𝖺𝗅 𝗁𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // Clean up file
            try {
                if (await fs.pathExists(filePath)) {
                    await fs.unlink(filePath);
                    console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                }
            } catch (cleanupError) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
            }

        } catch (error) {
            console.error("💥 𝖥𝖺𝖼𝗂𝖺𝗅𝖧𝖺𝗂𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
