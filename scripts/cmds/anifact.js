const axios = require('axios');
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "anifact",
        aliases: [],
        version: "1.0.2",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑎𝑛𝑖𝑚𝑒",
        shortDescription: {
            en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑓𝑎𝑐𝑡𝑠 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑓𝑎𝑐𝑡𝑠 𝑎𝑐𝑐𝑜𝑚𝑝𝑎𝑛𝑖𝑒𝑑 𝑏𝑦 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        guide: {
            en: "{p}anifact"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, event }) {
        try {
            // Dependency check with better validation
            let axiosAvailable = false;
            let fsAvailable = false;
            
            try {
                axiosAvailable = !!require("axios");
                fsAvailable = !!require("fs-extra");
            } catch (e) {
                console.error("𝐷𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦 𝑒𝑟𝑟𝑜𝑟:", e);
            }

            if (!axiosAvailable || !fsAvailable) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                    console.log("✅ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦");
                }
            } catch (dirError) {
                console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦:", dirError);
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦.");
            }

            // Hardcoded fallback anime images
            const fallbackImages = [
                "https://i.imgur.com/uXWLBeC.jpeg",
                "https://i.imgur.com/7Dc9GrN.jpeg",
                "https://i.imgur.com/IaAVMFK.jpeg",
                "https://i.imgur.com/WceNH2z.jpeg",
                "https://i.imgur.com/1XosaEA.jpeg",
                "https://i.imgur.com/M58fVe6.jpeg",
                "https://i.imgur.com/czaXZ3a.jpeg",
                "https://i.imgur.com/xsu6v2I.jpeg",
                "https://i.imgur.com/f17dCCM.jpeg",
                "https://i.imgur.com/opquSuU.jpeg"
            ];

            let imageUrl = null;
            let artistName = "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝐴𝑟𝑡𝑖𝑠𝑡";
            let artistHref = "#";
            let apiSuccess = false;

            // Try to get image from primary API first
            try {
                console.log("🔗 𝑇𝑟𝑦𝑖𝑛𝑔 𝑝𝑟𝑖𝑚𝑎𝑟𝑦 𝐴𝑃𝐼...");
                const response = await axios.get('https://nekos.best/api/v2/neko', {
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                if (response.data && response.data.results && response.data.results[0]) {
                    imageUrl = response.data.results[0].url;
                    artistName = response.data.results[0].artist_name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝐴𝑟𝑡𝑖𝑠𝑡";
                    artistHref = response.data.results[0].artist_href || "#";
                    apiSuccess = true;
                    console.log("✅ 𝑃𝑟𝑖𝑚𝑎𝑟𝑦 𝐴𝑃𝐼 𝑠𝑢𝑐𝑐𝑒𝑠𝑠");
                } else {
                    throw new Error("𝑁𝑜 𝑑𝑎𝑡𝑎 𝑖𝑛 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
                }
                
            } catch (apiError) {
                console.error("❌ 𝑃𝑟𝑖𝑚𝑎𝑟𝑦 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑:", apiError.message);
                // Use fallback image
                const randomIndex = Math.floor(Math.random() * fallbackImages.length);
                imageUrl = fallbackImages[randomIndex];
                artistName = "𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝐼𝑚𝑎𝑔𝑒";
                artistHref = "https://imgur.com";
                console.log("🔄 𝑈𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑖𝑚𝑎𝑔𝑒");
            }

            // Validate image URL
            if (!imageUrl || typeof imageUrl !== 'string') {
                console.error("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿, 𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘");
                imageUrl = fallbackImages[0];
            }

            const imagePath = path.join(cacheDir, `anime_fact_${event.senderID}_${Date.now()}.png`);
            
            // Download the image with multiple attempts
            let downloadSuccess = false;
            let downloadAttempts = 0;
            const maxDownloadAttempts = 3;

            while (!downloadSuccess && downloadAttempts < maxDownloadAttempts) {
                try {
                    console.log(`📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${downloadAttempts + 1}...`);
                    
                    const imageResponse = await axios.get(imageUrl, { 
                        responseType: 'arraybuffer',
                        timeout: 15000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'image/*'
                        },
                        maxContentLength: 10 * 1024 * 1024 // 10MB limit
                    });
                    
                    // Validate image data
                    if (!imageResponse.data || imageResponse.data.length === 0) {
                        throw new Error("𝐸𝑚𝑝𝑡𝑦 𝑖𝑚𝑎𝑔𝑒 𝑑𝑎𝑡𝑎");
                    }
                    
                    await fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));
                    
                    // Verify file was written
                    if (!fs.existsSync(imagePath)) {
                        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑤𝑟𝑖𝑡𝑒 𝑓𝑖𝑙𝑒");
                    }
                    
                    const stats = fs.statSync(imagePath);
                    if (stats.size === 0) {
                        throw new Error("𝐹𝑖𝑙𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦");
                    }
                    
                    downloadSuccess = true;
                    console.log("✅ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
                    
                } catch (downloadError) {
                    downloadAttempts++;
                    console.error(`❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${downloadAttempts} 𝑓𝑎𝑖𝑙𝑒𝑑:`, downloadError.message);
                    
                    // Clean up failed file
                    try {
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    } catch (cleanupError) {
                        console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
                    }
                    
                    // Try different fallback image if all attempts fail
                    if (downloadAttempts >= maxDownloadAttempts) {
                        const fallbackIndex = Math.floor(Math.random() * fallbackImages.length);
                        imageUrl = fallbackImages[fallbackIndex];
                        downloadAttempts = 0; // Reset counter for new URL
                        
                        if (downloadAttempts >= maxDownloadAttempts * 2) {
                            console.error("💥 𝐴𝑙𝑙 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑡𝑡𝑒𝑚𝑝𝑡𝑠 𝑓𝑎𝑖𝑙𝑒𝑑");
                            break;
                        }
                    }
                }
            }

            if (!downloadSuccess) {
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }

            // Get random anime fact
            const animeFacts = [
                "𝐼𝑛 𝐽𝑎𝑝𝑎𝑛, 𝑎𝑛𝑖𝑚𝑒 𝑎𝑐𝑐𝑜𝑢𝑛𝑡𝑠 𝑓𝑜𝑟 60% 𝑜𝑓 𝑎𝑙𝑙 𝑡𝑒𝑙𝑒𝑣𝑖𝑠𝑖𝑜𝑛 𝑠ℎ𝑜𝑤𝑠! 📺",
                "𝑇ℎ𝑒 𝑤𝑜𝑟𝑙𝑑'𝑠 𝑙𝑜𝑛𝑔𝑒𝑠𝑡-𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑠𝑒𝑟𝑖𝑒𝑠 𝑖𝑠 '𝑆𝑎𝑧𝑎𝑒-𝑠𝑎𝑛', 𝑎𝑖𝑟𝑖𝑛𝑔 𝑠𝑖𝑛𝑐𝑒 1969! 🎬",
                "𝑆𝑡𝑢𝑑𝑖𝑜 𝐺ℎ𝑖𝑏𝑙𝑖'𝑠 𝑓𝑜𝑢𝑛𝑑𝑒𝑟, 𝐻𝑎𝑦𝑎𝑜 𝑀𝑖𝑦𝑎𝑧𝑎𝑘𝑖, 𝑢𝑠𝑒𝑠 𝑡𝑟𝑎𝑑𝑖𝑡𝑖𝑜𝑛𝑎𝑙 ℎ𝑎𝑛𝑑-𝑑𝑟𝑎𝑤𝑛 𝑎𝑛𝑖𝑚𝑎𝑡𝑖𝑜𝑛 𝑡𝑒𝑐ℎ𝑛𝑖𝑞𝑢𝑒𝑠! ✏️",
                "𝐴𝑛𝑖𝑚𝑒 𝑖𝑠 𝑎 𝑚𝑢𝑙𝑡𝑖-𝑏𝑖𝑙𝑙𝑖𝑜𝑛 𝑑𝑜𝑙𝑙𝑎𝑟 𝑖𝑛𝑑𝑢𝑠𝑡𝑟𝑦 𝑤𝑜𝑟𝑙𝑑𝑤𝑖𝑑𝑒! 💰",
                "𝑇ℎ𝑒 𝑓𝑖𝑟𝑠𝑡 𝑎𝑛𝑖𝑚𝑒 𝑓𝑖𝑙𝑚 𝑤𝑎𝑠 𝑟𝑒𝑙𝑒𝑎𝑠𝑒𝑑 𝑖𝑛 1917 𝑐𝑎𝑙𝑙𝑒𝑑 '𝑁𝑎𝑚𝑎𝑘𝑢𝑟𝑎 𝐺𝑎𝑡𝑎𝑛𝑎'! 🎞️",
                "𝑂𝑛𝑒 𝑃𝑖𝑒𝑐𝑒' ℎ𝑜𝑙𝑑𝑠 𝑡ℎ𝑒 𝐺𝑢𝑖𝑛𝑛𝑒𝑠𝑠 𝑊𝑜𝑟𝑙𝑑 𝑅𝑒𝑐𝑜𝑟𝑑 𝑓𝑜𝑟 𝑚𝑜𝑠𝑡 𝑐𝑜𝑝𝑖𝑒𝑠 𝑝𝑢𝑏𝑙𝑖𝑠ℎ𝑒𝑑 𝑓𝑜𝑟 𝑎 𝑠𝑖𝑛𝑔𝑙𝑒 𝑐𝑜𝑚𝑖𝑐 𝑠𝑒𝑟𝑖𝑒𝑠! 📚",
                "𝐼𝑛 𝐽𝑎𝑝𝑎𝑛, 𝑎𝑛𝑖𝑚𝑒 𝑖𝑠 𝑛𝑜𝑡 𝑗𝑢𝑠𝑡 𝑓𝑜𝑟 𝑘𝑖𝑑𝑠 - 𝑖𝑡'𝑠 𝑒𝑛𝑗𝑜𝑦𝑒𝑑 𝑏𝑦 𝑝𝑒𝑜𝑝𝑙𝑒 𝑜𝑓 𝑎𝑙𝑙 𝑎𝑔𝑒𝑠! 👨‍👩‍👧‍👦",
                "𝑇ℎ𝑒 𝑡𝑒𝑟𝑚 '𝑎𝑛𝑖𝑚𝑒' 𝑐𝑜𝑚𝑒𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝐸𝑛𝑔𝑙𝑖𝑠ℎ 𝑤𝑜𝑟𝑑 '𝑎𝑛𝑖𝑚𝑎𝑡𝑖𝑜𝑛' 𝑏𝑢𝑡 𝑖𝑠 𝑢𝑠𝑒𝑑 𝑡𝑜 𝑟𝑒𝑓𝑒𝑟 𝑡𝑜 𝑎𝑙𝑙 𝑎𝑛𝑖𝑚𝑎𝑡𝑖𝑜𝑛 𝑖𝑛 𝐽𝑎𝑝𝑎𝑛! 🇯🇵",
                "𝑀𝑎𝑛𝑦 𝑎𝑛𝑖𝑚𝑒 𝑠𝑒𝑟𝑖𝑒𝑠 𝑎𝑟𝑒 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑚𝑎𝑛𝑔𝑎 𝑐𝑜𝑚𝑖𝑐𝑠, 𝑤ℎ𝑖𝑐ℎ 𝑎𝑟𝑒 𝑟𝑒𝑎𝑑 𝑏𝑦 𝑚𝑖𝑙𝑙𝑖𝑜𝑛𝑠 𝑤𝑜𝑟𝑙𝑑𝑤𝑖𝑑𝑒! 📖",
                "𝑇ℎ𝑒 𝑎𝑛𝑖𝑚𝑒 𝑖𝑛𝑑𝑢𝑠𝑡𝑟𝑦 𝑒𝑚𝑝𝑙𝑜𝑦𝑠 𝑜𝑣𝑒𝑟 50,000 𝑝𝑒𝑜𝑝𝑙𝑒 𝑖𝑛 𝐽𝑎𝑝𝑎𝑛 𝑎𝑙𝑜𝑛𝑒! 👥"
            ];
            
            const randomFact = animeFacts[Math.floor(Math.random() * animeFacts.length)];
            
            // Prepare message body
            const sourceIndicator = apiSuccess ? "🎌 𝑁𝑒𝑘𝑜𝑠.𝑏𝑒𝑠𝑡 𝐴𝑃𝐼" : "🔄 𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝐼𝑚𝑎𝑔𝑒";
            const messageBody = `✨ 𝐴𝑛𝑖𝑚𝑒 𝐹𝑎𝑐𝑡 ✨\n\n📜 ${randomFact}\n\n🎨 𝐴𝑟𝑡𝑖𝑠𝑡: ${artistName}\n🔗 𝑆𝑜𝑢𝑟𝑐𝑒: ${artistHref}\n${sourceIndicator}`;

            // Send the message with image and fact
            await message.reply({
                body: messageBody,
                attachment: fs.createReadStream(imagePath)
            });

            console.log("✅ 𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝑠𝑒𝑛𝑡 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");

            // Clean up the image file after sending
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log("🧹 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒");
                }
            } catch (cleanupError) {
                console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
            }
            
        } catch (error) {
            console.error("💥 𝐴𝑛𝑖𝐹𝑎𝑐𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
            
            let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑎𝑛𝑖𝑚𝑒 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟: 𝐶𝑎𝑛𝑛𝑜𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡 𝑡𝑜 𝑠𝑒𝑟𝑣𝑒𝑟.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝑇𝑖𝑚𝑒𝑜𝑢𝑡 𝑒𝑟𝑟𝑜𝑟: 𝑆𝑒𝑟𝑣𝑒𝑟 𝑖𝑠 𝑡𝑎𝑘𝑖𝑛𝑔 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔 𝑡𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑑.";
            } else if (error.message.includes('ENOTFOUND')) {
                errorMessage = "❌ 𝐷𝑁𝑆 𝑒𝑟𝑟𝑜𝑟: 𝐶𝑎𝑛𝑛𝑜𝑡 𝑓𝑖𝑛𝑑 𝑡ℎ𝑒 𝑠𝑒𝑟𝑣𝑒𝑟.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
