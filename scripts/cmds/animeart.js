const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "animeart",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑎𝑛𝑖𝑚𝑒",
        shortDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑠𝑎𝑓𝑒 𝑐𝑢𝑡𝑒 𝑎𝑛𝑖𝑚𝑒 𝑖𝑙𝑙𝑢𝑠𝑡𝑟𝑎𝑡𝑖𝑜𝑛"
        },
        longDescription: {
            en: "𝐹𝑒𝑡𝑐ℎ𝑒𝑠 𝑠𝑎𝑓𝑒 (𝑛𝑜𝑛-𝑅18) 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑙𝑜𝑙𝑖𝑐𝑜𝑛 𝐴𝑃𝐼"
        },
        guide: {
            en: "{p}animeart"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "path": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check with better validation
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            const filePath = path.join(__dirname, "cache", `animeart_${Date.now()}.jpg`);

            // Ensure cache directory exists
            try {
                await fs.ensureDir(path.dirname(filePath));
            } catch (dirError) {
                console.error("𝐷𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", dirError);
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦.");
            }

            const loadingMsg = await message.reply("⏳ 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑎𝑟𝑡...");

            // List of API endpoints to try
            const apiEndpoints = [
                {
                    name: "𝑙𝑜𝑙𝑖𝑐𝑜𝑛",
                    handler: async () => {
                        const res = await axios.post("https://api.lolicon.app/setu/v2", {
                            r18: 0,
                            num: 1,
                            size: ["regular"]
                        }, {
                            timeout: 30000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!res.data || !res.data.data || res.data.data.length === 0) {
                            throw new Error("𝑁𝑜 𝑑𝑎𝑡𝑎 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝐴𝑃𝐼");
                        }

                        const imageData = res.data.data[0];
                        const imageUrl = imageData.urls?.regular || imageData.urls?.original;

                        if (!imageUrl) {
                            throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑓𝑜𝑢𝑛𝑑");
                        }

                        return {
                            url: imageUrl,
                            title: imageData.title || "𝐴𝑛𝑖𝑚𝑒 𝐴𝑟𝑡",
                            artist: imageData.artist || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝐴𝑟𝑡𝑖𝑠𝑡",
                            source: "𝐿𝑜𝑙𝑖𝑐𝑜𝑛 𝐴𝑃𝐼"
                        };
                    }
                },
                {
                    name: "𝑤𝑎𝑖𝑓𝑢.𝑝𝑖𝑐𝑠",
                    handler: async () => {
                        const res = await axios.get("https://api.waifu.pics/sfw/waifu", {
                            timeout: 15000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });

                        if (!res.data || !res.data.url) {
                            throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑓𝑟𝑜𝑚 𝑤𝑎𝑖𝑓𝑢.𝑝𝑖𝑐𝑠");
                        }

                        return {
                            url: res.data.url,
                            title: "𝐴𝑛𝑖𝑚𝑒 𝑊𝑎𝑖𝑓𝑢",
                            artist: "𝑊𝑎𝑖𝑓𝑢.𝑝𝑖𝑐𝑠",
                            source: "𝑊𝑎𝑖𝑓𝑢.𝑝𝑖𝑐𝑠"
                        };
                    }
                },
                {
                    name: "𝑛𝑒𝑘𝑜𝑠.𝑙𝑖𝑓𝑒",
                    handler: async () => {
                        const res = await axios.get("https://nekos.life/api/v2/img/waifu", {
                            timeout: 15000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });

                        if (!res.data || !res.data.url) {
                            throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑓𝑟𝑜𝑚 𝑛𝑒𝑘𝑜𝑠.𝑙𝑖𝑓𝑒");
                        }

                        return {
                            url: res.data.url,
                            title: "𝐴𝑛𝑖𝑚𝑒 𝑊𝑎𝑖𝑓𝑢",
                            artist: "𝑁𝑒𝑘𝑜𝑠.𝑙𝑖𝑓𝑒",
                            source: "𝑁𝑒𝑘𝑜𝑠.𝑙𝑖𝑓𝑒"
                        };
                    }
                }
            ];

            let imageInfo = null;
            let lastError = null;

            // Try each API endpoint
            for (const endpoint of apiEndpoints) {
                try {
                    console.log(`🔗 𝑇𝑟𝑦𝑖𝑛𝑔 ${endpoint.name} 𝐴𝑃𝐼...`);
                    imageInfo = await endpoint.handler();
                    console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠 𝑤𝑖𝑡ℎ ${endpoint.name} 𝐴𝑃𝐼`);
                    break;
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`❌ ${endpoint.name} 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑:`, apiError.message);
                    continue;
                }
            }

            if (!imageInfo) {
                await message.unsend(loadingMsg.messageID);
                throw new Error(`𝐴𝑙𝑙 𝐴𝑃𝐼𝑠 𝑓𝑎𝑖𝑙𝑒𝑑: ${lastError?.message || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟"}`);
            }

            console.log(`📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 𝑓𝑟𝑜𝑚: ${imageInfo.url}`);

            // Download image
            try {
                const imageResponse = await axios.get(imageInfo.url, {
                    responseType: "arraybuffer",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://api.lolicon.app/',
                        'Accept': 'image/jpeg,image/png,image/webp,image/*'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                // Check content type
                const contentType = imageResponse.headers['content-type'];
                if (!contentType || !contentType.startsWith('image/')) {
                    throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑡𝑦𝑝𝑒: " + contentType);
                }

                await fs.writeFile(filePath, Buffer.from(imageResponse.data));

                // Check file size
                const stats = await fs.stat(filePath);
                const fileSize = (stats.size / (1024 * 1024)).toFixed(2);

                if (parseFloat(fileSize) > 10) {
                    await fs.unlink(filePath);
                    throw new Error(`𝐼𝑚𝑎𝑔𝑒 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒: ${fileSize}𝑀𝐵`);
                }

                console.log(`✅ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 (${fileSize}𝑀𝐵)`);

                const caption = `🎨 𝐴𝑛𝑖𝑚𝑒 𝐴𝑟𝑡 𝐺𝑎𝑙𝑙𝑒𝑟𝑦 🎨

🌸 𝑇𝑖𝑡𝑙𝑒: ${imageInfo.title}
🎭 𝐴𝑟𝑡𝑖𝑠𝑡: ${imageInfo.artist}
✨ 𝑆𝑜𝑢𝑟𝑐𝑒: ${imageInfo.source}
💫 𝐶𝑟𝑒𝑑𝑖𝑡𝑠: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;

                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", unsendError.message);
                }

                await message.reply({
                    body: caption,
                    attachment: fs.createReadStream(filePath)
                });

                // Clean up
                await fs.unlink(filePath);
                console.log(`🧹 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒`);

            } catch (downloadError) {
                console.error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", downloadError);
                
                // Clean up file if it exists
                try {
                    if (await fs.pathExists(filePath)) {
                        await fs.unlink(filePath);
                    }
                } catch (cleanupError) {
                    console.warn("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
                }

                await message.unsend(loadingMsg.messageID);
                throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒: ${downloadError.message}`);
            }

        } catch (error) {
            console.error("💥 𝐴𝑛𝑖𝑚𝑒𝐴𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
            
            let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑎𝑛𝑖𝑚𝑒 𝑎𝑟𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            } else if (error.message.includes('maxContentLength')) {
                errorMessage = "❌ 𝐼𝑚𝑎𝑔𝑒 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            } else if (error.message.includes('content type')) {
                errorMessage = "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑟𝑚𝑎𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
