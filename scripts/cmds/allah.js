const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "allah",
        aliases: [],
        version: "1.0.3",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑖𝑠𝑙𝑎𝑚𝑖𝑐",
        shortDescription: {
            en: "𝑆𝑒𝑛𝑑 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑡𝑒𝑥𝑡 𝐺𝐼𝐹𝑠 𝑤𝑖𝑡ℎ 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝑆ℎ𝑎𝑟𝑒𝑠 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐺𝐼𝐹𝑠 𝑤𝑖𝑡ℎ 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑎𝑛𝑑 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟𝑠"
        },
        guide: {
            en: "{p}allah"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "path": ""
        }
    },

    onStart: async function({ message }) {
        let cachePath = null;
        
        try {
            // Dependency check with better error handling
            let fsExtraAvailable, axiosAvailable, pathAvailable;
            try {
                fsExtraAvailable = true;
                axiosAvailable = true;
                pathAvailable = true;
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            // Create cache directory if needed
            const cacheDir = path.join(__dirname, "cache");
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                    console.log("✅ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦");
                }
            } catch (dirError) {
                console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦:", dirError);
                // Continue without cache directory
            }
            
            cachePath = path.join(cacheDir, `allah_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.gif`);
            
            // GIF URLs collection - verified working Islamic GIFs
            const gifUrls = [
                "https://i.imgur.com/oV4VMvm.gif",
                "https://i.imgur.com/LvUF38x.gif",
                "https://i.imgur.com/r0ZE7lx.gif",
                "https://i.imgur.com/98PjVxg.gif",
                "https://i.imgur.com/7zLmJch.gif",
                "https://i.imgur.com/C2a3Cj3.gif",
                "https://i.imgur.com/DHoZ9A1.gif",
                "https://i.imgur.com/2eewmJm.gif",
                "https://i.imgur.com/ScGCmKE.gif",
                "https://i.imgur.com/U07Yd3U.gif"
            ];

            // Select random GIF
            const randomUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];
            
            console.log(`📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝐺𝐼𝐹: ${randomUrl}`);
            
            let downloadSuccess = false;
            let gifBuffer = null;
            
            // Try to download the GIF
            try {
                const response = await axios.get(randomUrl, {
                    responseType: "arraybuffer",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'image/gif,image/*,*/*'
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 300;
                    }
                });
                
                // Verify it's actually a GIF
                const contentType = response.headers['content-type'];
                if (contentType && contentType.includes('gif')) {
                    gifBuffer = Buffer.from(response.data, "binary");
                    downloadSuccess = true;
                    console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝐺𝐼𝐹 (${(gifBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
                } else {
                    throw new Error(`𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑡𝑦𝑝𝑒: ${contentType}`);
                }
                
            } catch (downloadError) {
                console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐺𝐼𝐹:`, downloadError.message);
                downloadSuccess = false;
            }

            // If download failed, try alternative URLs
            if (!downloadSuccess) {
                console.log(`🔄 𝑇𝑟𝑦𝑖𝑛𝑔 𝑎𝑙𝑡𝑒𝑟𝑛𝑎𝑡𝑖𝑣𝑒 𝐺𝐼𝐹 𝑈𝑅𝐿𝑠`);
                for (let i = 0; i < Math.min(3, gifUrls.length); i++) {
                    const altUrl = gifUrls[i];
                    if (altUrl === randomUrl) continue;
                    
                    try {
                        console.log(`📥 𝑇𝑟𝑦𝑖𝑛𝑔 𝑎𝑙𝑡𝑒𝑟𝑛𝑎𝑡𝑖𝑣𝑒: ${altUrl}`);
                        const altResponse = await axios.get(altUrl, {
                            responseType: "arraybuffer",
                            timeout: 15000
                        });
                        
                        const altContentType = altResponse.headers['content-type'];
                        if (altContentType && altContentType.includes('gif')) {
                            gifBuffer = Buffer.from(altResponse.data, "binary");
                            downloadSuccess = true;
                            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠 𝑤𝑖𝑡ℎ 𝑎𝑙𝑡𝑒𝑟𝑛𝑎𝑡𝑖𝑣𝑒 𝐺𝐼𝐹`);
                            break;
                        }
                    } catch (altError) {
                        console.error(`❌ 𝐴𝑙𝑡𝑒𝑟𝑛𝑎𝑡𝑖𝑣𝑒 ${i + 1} 𝑓𝑎𝑖𝑙𝑒𝑑:`, altError.message);
                    }
                }
            }

            // Islamic messages collection
            const islamicMessages = [
                "🕌 𝑎𝑙𝑙𝑎ℎ 𝑎𝑘𝑏𝑎𝑟 - 𝐴𝑙𝑙𝑎ℎ𝑢 𝐴𝑘𝑏𝑎𝑟 🕌\n\n𝐺𝑜𝑑 𝑖𝑠 𝑡ℎ𝑒 𝐺𝑟𝑒𝑎𝑡𝑒𝑠𝑡\n\n𝑀𝑎𝑦 𝑡ℎ𝑖𝑠 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟 𝑠𝑡𝑟𝑒𝑛𝑔𝑡ℎ𝑒𝑛 𝑦𝑜𝑢𝑟 𝑓𝑎𝑖𝑡ℎ 𝑎𝑛𝑑 𝑏𝑟𝑖𝑛𝑔 𝑦𝑜𝑢 𝑝𝑒𝑎𝑐𝑒. ✨",
                "🕋 𝑆𝑢𝑏ℎ𝑎𝑛𝐴𝑙𝑙𝑎ℎ - 𝐺𝑙𝑜𝑟𝑦 𝑡𝑜 𝐺𝑜𝑑 🕋\n\n𝑅𝑒𝑚𝑒𝑚𝑏𝑒𝑟 𝐴𝑙𝑙𝑎ℎ 𝑖𝑛 𝑒𝑣𝑒𝑟𝑦 𝑚𝑜𝑚𝑒𝑛𝑡 𝑜𝑓 𝑦𝑜𝑢𝑟 𝑙𝑖𝑓𝑒. 📿",
                "🌙 𝐴𝑙ℎ𝑎𝑚𝑑𝑢𝑙𝑖𝑙𝑙𝑎ℎ - 𝐴𝑙𝑙 𝑝𝑟𝑎𝑖𝑠𝑒 𝑖𝑠 𝑓𝑜𝑟 𝐴𝑙𝑙𝑎ℎ 🌙\n\n𝐵𝑒 𝑡ℎ𝑎𝑛𝑘𝑓𝑢𝑙 𝑓𝑜𝑟 𝑒𝑣𝑒𝑟𝑦 𝑏𝑙𝑒𝑠𝑠𝑖𝑛𝑔. 🌟",
                "📖 𝐼𝑛𝑠ℎ𝑎𝐴𝑙𝑙𝑎ℎ - 𝐼𝑓 𝐴𝑙𝑙𝑎ℎ 𝑤𝑖𝑙𝑙𝑠 📖\n\n𝑇𝑟𝑢𝑠𝑡 𝑖𝑛 𝐴𝑙𝑙𝑎ℎ'𝑠 𝑝𝑙𝑎𝑛 𝑓𝑜𝑟 𝑦𝑜𝑢. 💫",
                "🕌 𝑀𝑎𝑠ℎ𝑎𝐴𝑙𝑙𝑎ℎ - 𝐴𝑠 𝐴𝑙𝑙𝑎ℎ ℎ𝑎𝑠 𝑤𝑖𝑙𝑙𝑒𝑑 🕌\n\n𝐴𝑝𝑝𝑟𝑒𝑐𝑖𝑎𝑡𝑒 𝑡ℎ𝑒 𝑏𝑒𝑎𝑢𝑡𝑦 𝑜𝑓 𝐺𝑜𝑑'𝑠 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛. 🌺"
            ];

            // Select random message
            const randomMessage = islamicMessages[Math.floor(Math.random() * islamicMessages.length)];

            // Send message with or without GIF
            if (downloadSuccess && gifBuffer) {
                try {
                    // Save to cache
                    fs.writeFileSync(cachePath, gifBuffer);
                    
                    // Verify the file was written
                    if (fs.existsSync(cachePath)) {
                        const stats = fs.statSync(cachePath);
                        if (stats.size > 0) {
                            await message.reply({
                                body: randomMessage,
                                attachment: fs.createReadStream(cachePath)
                            });
                            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐺𝐼𝐹`);
                        } else {
                            throw new Error("𝐸𝑚𝑝𝑡𝑦 𝑓𝑖𝑙𝑒 𝑤𝑟𝑖𝑡𝑡𝑒𝑛");
                        }
                    } else {
                        throw new Error("𝐹𝑖𝑙𝑒 𝑛𝑜𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑");
                    }
                } catch (sendError) {
                    console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝐺𝐼𝐹:", sendError.message);
                    // Fall back to text-only message
                    await message.reply(randomMessage + "\n\n✨ (𝐺𝐼𝐹 𝑐𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑏𝑒 𝑠𝑒𝑛𝑡, 𝑏𝑢𝑡 𝑡ℎ𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑓 𝑓𝑎𝑖𝑡ℎ 𝑟𝑒𝑚𝑎𝑖𝑛𝑠)");
                }
            } else {
                // Send text-only message if GIF download failed
                await message.reply(randomMessage + "\n\n📿 (𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑓 𝑓𝑎𝑖𝑡ℎ - 𝐺𝐼𝐹 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒)");
            }
            
        } catch (error) {
            console.error("💥 𝐴𝑙𝑙𝑎ℎ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
            
            // Final fallback messages
            const fallbackMessages = [
                "🕌 𝑎𝑙𝑙𝑎ℎ 𝑎𝑘𝑏𝑎𝑟 - 𝐴𝑙𝑙𝑎ℎ𝑢 𝐴𝑘𝑏𝑎𝑟 🕌\n\n𝐺𝑜𝑑 𝑖𝑠 𝑡ℎ𝑒 𝐺𝑟𝑒𝑎𝑡𝑒𝑠𝑡\n\n𝑀𝑎𝑦 𝑡ℎ𝑖𝑠 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟 𝑠𝑡𝑟𝑒𝑛𝑔𝑡ℎ𝑒𝑛 𝑦𝑜𝑢𝑟 𝑓𝑎𝑖𝑡ℎ.\n\n✨ 𝑇ℎ𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑓 𝑓𝑎𝑖𝑡ℎ 𝑖𝑠 𝑤ℎ𝑎𝑡 𝑡𝑟𝑢𝑙𝑦 𝑚𝑎𝑡𝑡𝑒𝑟𝑠. 📿",
                "🕋 𝑆𝑢𝑏ℎ𝑎𝑛𝐴𝑙𝑙𝑎ℎ 🕋\n\n𝑅𝑒𝑚𝑒𝑚𝑏𝑒𝑟 𝐴𝑙𝑙𝑎ℎ 𝑖𝑛 𝑒𝑣𝑒𝑟𝑦 𝑚𝑜𝑚𝑒𝑛𝑡.\n\n🌟 𝐹𝑎𝑖𝑡ℎ 𝑖𝑠 𝑚𝑜𝑟𝑒 𝑖𝑚𝑝𝑜𝑟𝑡𝑎𝑛𝑡 𝑡ℎ𝑎𝑛 𝑎𝑛𝑦 𝑚𝑒𝑑𝑖𝑢𝑚.",
                "🌙 𝐴𝑙ℎ𝑎𝑚𝑑𝑢𝑙𝑖𝑙𝑙𝑎ℎ 𝑓𝑜𝑟 𝑒𝑣𝑒𝑟𝑦𝑡ℎ𝑖𝑛𝑔 🌙\n\n𝐸𝑣𝑒𝑛 𝑤ℎ𝑒𝑛 𝑡ℎ𝑖𝑛𝑔𝑠 𝑑𝑜𝑛'𝑡 𝑔𝑜 𝑎𝑠 𝑝𝑙𝑎𝑛𝑛𝑒𝑑, 𝑡𝑟𝑢𝑠𝑡 𝑖𝑛 𝐴𝑙𝑙𝑎ℎ'𝑠 𝑤𝑖𝑠𝑑𝑜𝑚. 📖"
            ];

            const randomFallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
            await message.reply(randomFallback);
            
        } finally {
            // Clean up cache file if it exists
            if (cachePath && fs.existsSync(cachePath)) {
                try {
                    fs.unlinkSync(cachePath);
                    console.log("🧹 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝 𝑐𝑎𝑐ℎ𝑒 𝑓𝑖𝑙𝑒");
                } catch (cleanupError) {
                    console.warn("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑙𝑒𝑎𝑛 𝑢𝑝 𝑐𝑎𝑐ℎ𝑒:", cleanupError.message);
                }
            }
        }
    }
};
