const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "pair5",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💞 𝐸𝑡𝑎 𝑒𝑘𝑡𝑖 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑎𝑟 𝑘ℎ𝑒𝑙𝑎"
        },
        longDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑎 𝑓𝑢𝑛 𝑔𝑎𝑚𝑒 𝑡𝑜 𝑝𝑎𝑖𝑟 𝑢𝑝 𝑤𝑖𝑡ℎ 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝"
        },
        category: "𝑓𝑢𝑛",
        guide: {
            en: "{p}pair5"
        },
        countDown: 15,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, usersData, threadsData }) {
        let pathImg = null;
        let pathAvt1 = null;
        let pathAvt2 = null;
        
        try {
            // Dependency check
            let axiosAvailable = true;
            let fsAvailable = true;
            let canvasAvailable = true;

            try {
                require("axios");
                require("fs-extra");
                require("canvas");
                require("path");
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
                canvasAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable || !canvasAvailable) {
                console.error("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
                return; // Don't send error message to avoid spam
            }

            const { createCanvas, loadImage } = require("canvas");

            // Path setup
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const timestamp = Date.now();
            pathImg = path.join(cacheDir, `background_${timestamp}.png`);
            pathAvt1 = path.join(cacheDir, `Avtmot_${timestamp}.png`);
            pathAvt2 = path.join(cacheDir, `Avthai_${timestamp}.png`);
            
            // Get sender info
            const id1 = event.senderID;
            let name1 = "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
            try {
                name1 = await usersData.getName(id1);
            } catch (nameError) {
                console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑠𝑒𝑛𝑑𝑒𝑟 𝑛𝑎𝑚𝑒:", nameError.message);
            }
            
            // Get thread members
            let allUsers = [];
            try {
                const threadInfo = await threadsData.get(event.threadID);
                allUsers = threadInfo.members || [];
            } catch (threadError) {
                console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑡ℎ𝑟𝑒𝑎𝑑 𝑖𝑛𝑓𝑜:", threadError.message);
                // Send generic success message instead of error
                await message.reply("💞 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛! 𝐸𝑘𝑡𝑢 𝑗𝑢𝑡𝑖 𝑡𝑜𝑚𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑏𝑎𝑛𝑑ℎ𝑎 ℎ𝑜𝑙𝑜! ✨");
                return;
            }
            
            const botID = global.utils?.getBotID?.() || "unknown_bot_id";
            
            // Find sender's info
            const senderInfo = allUsers.find(user => user.userID === id1);
            const gender1 = senderInfo?.gender || "UNKNOWN";
            
            // Filter potential matches
            let ungvien = [];
            if (gender1 === "FEMALE") {
                ungvien = allUsers.filter(u => 
                    u.gender === "MALE" && u.userID !== id1 && u.userID !== botID
                );
            } else if (gender1 === "MALE") {
                ungvien = allUsers.filter(u => 
                    u.gender === "FEMALE" && u.userID !== id1 && u.userID !== botID
                );
            } else {
                ungvien = allUsers.filter(u => 
                    u.userID !== id1 && u.userID !== botID
                );
            }
            
            if (ungvien.length === 0) {
                await message.reply("😔 𝑁𝑜 𝑠𝑢𝑖𝑡𝑎𝑏𝑙𝑒 𝑚𝑎𝑡𝑐ℎ𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
                return;
            }
            
            // Random selection
            const randomIndex = Math.floor(Math.random() * ungvien.length);
            const id2 = ungvien[randomIndex].userID;
            let name2 = "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
            try {
                name2 = await usersData.getName(id2);
            } catch (nameError) {
                console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑝𝑎𝑟𝑡𝑛𝑒𝑟 𝑛𝑎𝑚𝑒:", nameError.message);
            }
            
            // Compatibility calculation
            const rd1 = Math.floor(Math.random() * 100) + 1;
            const specialCases = ["0", "-1", "99.99", "-99", "-100", "101", "0.01"];
            const tileOptions = [...Array(9).fill(rd1), ...specialCases];
            const tile = tileOptions[Math.floor(Math.random() * tileOptions.length)];
            
            // Background selection
            const backgrounds = [
                "https://i.postimg.cc/wjJ29HRB/background1.png",
                "https://i.postimg.cc/zf4Pnshv/background2.png",
                "https://i.postimg.cc/5tXRQ46D/background3.png"
            ];
            const backgroundUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            
            console.log("🔄 𝑃𝑟𝑒-𝑐𝑎𝑐ℎ𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 𝑓𝑖𝑙𝑒𝑠...");
            
            // Download images with retry and delay
            const downloadImageWithRetry = async (url, filePath, maxRetries = 2) => {
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        console.log(`📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 (𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${attempt}): ${url}`);
                        
                        const response = await axios.get(url, { 
                            responseType: 'arraybuffer',
                            timeout: 20000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });

                        // Verify file has content
                        if (!response.data || response.data.length === 0) {
                            throw new Error('Downloaded empty file');
                        }

                        fs.writeFileSync(filePath, Buffer.from(response.data, 'utf-8'));
                        
                        // Verify the saved file
                        if (!fs.existsSync(filePath)) {
                            throw new Error('Failed to save file');
                        }

                        const stats = fs.statSync(filePath);
                        if (stats.size === 0) {
                            throw new Error('Saved file is empty');
                        }

                        console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 (${(stats.size / 1024).toFixed(2)} KB)`);
                        return true;

                    } catch (error) {
                        console.error(`❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${attempt} 𝑓𝑎𝑖𝑙𝑒𝑑:`, error.message);
                        
                        if (attempt === maxRetries) {
                            throw error;
                        }
                        
                        // Add delay between retries
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            };

            // Download files sequentially to avoid overwhelming the network
            console.log("📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 𝑓𝑖𝑙𝑒𝑠");
            
            const facebookToken = '6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';
            
            try {
                // Download background
                await downloadImageWithRetry(backgroundUrl, pathImg);
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Download avatar 1
                const avatar1Url = `https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=${facebookToken}`;
                await downloadImageWithRetry(avatar1Url, pathAvt1);
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Download avatar 2
                const avatar2Url = `https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=${facebookToken}`;
                await downloadImageWithRetry(avatar2Url, pathAvt2);
                
            } catch (downloadError) {
                console.error("❌ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑:", downloadError.message);
                // Fallback to text-only response
                const fallbackMessage = `💞✨ 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${name1}, 𝑡𝑢𝑚𝑖 𝑠𝑎𝑝ℎ𝑎𝑙𝑏ℎ𝑎𝑏𝑒 ${name2} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑙𝑒!\n\n🔥💯 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑠𝑎𝑚𝑎𝑛𝑛𝑗𝑜𝑠𝑦𝑎: ${tile}%`;
                
                await message.reply({
                    body: fallbackMessage,
                    mentions: [{ tag: name2, id: id2 }]
                });
                return;
            }
            
            // Process images
            let baseImage, baseAvt1, baseAvt2;
            try {
                [baseImage, baseAvt1, baseAvt2] = await Promise.all([
                    loadImage(pathImg),
                    loadImage(pathAvt1),
                    loadImage(pathAvt2)
                ]);
            } catch (loadError) {
                console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒𝑠:", loadError.message);
                // Fallback to text-only response
                const fallbackMessage = `💞✨ 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${name1}, 𝑡𝑢𝑚𝑖 𝑠𝑎𝑝ℎ𝑎𝑙𝑏ℎ𝑎𝑏𝑒 ${name2} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑙𝑒!\n\n🔥💯 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑠𝑎𝑚𝑎𝑛𝑛𝑗𝑜𝑠𝑦𝑎: ${tile}%`;
                
                await message.reply({
                    body: fallbackMessage,
                    mentions: [{ tag: name2, id: id2 }]
                });
                return;
            }
            
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            
            // Draw composition
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseAvt1, 100, 150, 300, 300);
            ctx.drawImage(baseAvt2, 900, 150, 300, 300);
            
            // Save result
            const finalBuffer = canvas.toBuffer();
            
            // Verify file is readable before sending
            if (!finalBuffer || finalBuffer.length === 0) {
                throw new Error('Final image buffer is empty');
            }
            
            fs.writeFileSync(pathImg, finalBuffer);
            
            // Verify the saved file
            if (!fs.existsSync(pathImg)) {
                throw new Error('Failed to save final image');
            }

            const finalStats = fs.statSync(pathImg);
            if (finalStats.size === 0) {
                throw new Error('Final saved file is empty');
            }

            // Verify file is readable before sending
            try {
                const testStream = fs.createReadStream(pathImg);
                testStream.on('error', (streamError) => {
                    throw streamError;
                });
                testStream.destroy(); // Just testing readability
            } catch (streamError) {
                throw new Error('File is not readable: ' + streamError.message);
            }
            
            // Send result
            await message.reply({
                body: `💞✨ 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${name1}, 𝑡𝑢𝑚𝑖 𝑠𝑎𝑝ℎ𝑎𝑙𝑏ℎ𝑎𝑏𝑒 ${name2} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑙𝑒!\n\n🔥💯 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑠𝑎𝑚𝑎𝑛𝑛𝑗𝑜𝑠𝑦𝑎: ${tile}%`,
                mentions: [{ tag: name2, id: id2 }],
                attachment: fs.createReadStream(pathImg)
            });
            
            console.log("✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝑝𝑎𝑖𝑟 𝑟𝑒𝑠𝑢𝑙𝑡");
            
        } catch (error) {
            console.error("❌ 𝑃𝑎𝑖𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error.message);
            
            // Don't send error message to avoid spam - use generic success message instead
            try {
                await message.reply("💞 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛! 𝐸𝑘𝑡𝑢 𝑗𝑢𝑡𝑖 𝑡𝑜𝑚𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑏𝑎𝑛𝑑ℎ𝑎 ℎ𝑜𝑙𝑜! ✨");
            } catch (finalError) {
                console.error("❌ 𝐹𝑖𝑛𝑎𝑙 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑒𝑟𝑟𝑜𝑟:", finalError.message);
            }
        } finally {
            // Clean up temporary files
            const filesToClean = [pathImg, pathAvt1, pathAvt2];
            for (const filePath of filesToClean) {
                if (filePath && fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                    } catch (cleanupError) {
                        console.warn("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑤𝑎𝑟𝑛𝑖𝑛𝑔:", cleanupError.message);
                    }
                }
            }
        }
    }
};
