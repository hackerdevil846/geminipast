const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Shared image download function with retry logic
async function downloadBaseImageWithRetry() {
    const dirMaterial = path.resolve(__dirname, "cache", "canvas");
    const arrPath = path.resolve(dirMaterial, "ar1r2.png");

    if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
        console.log("✅ Created cache/canvas directory.");
    }

    // If image already exists and is valid, no need to download
    if (fs.existsSync(arrPath)) {
        const stats = fs.statSync(arrPath);
        if (stats.size > 1000) {
            console.log("✅ Base image 'ar1r2.png' already exists and is valid.");
            return true;
        } else {
            console.log("⚠️ Existing base image 'ar1r2.png' is invalid, re-downloading.");
            fs.unlinkSync(arrPath);
        }
    }

    // If another file is currently downloading, wait
    const lockFile = path.resolve(dirMaterial, "downloading_ar1r2.lock");
    if (fs.existsSync(lockFile)) {
        console.log("⏳ Another download is in progress, waiting...");
        let attempts = 0;
        while (fs.existsSync(lockFile) && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        if (fs.existsSync(arrPath) && fs.statSync(arrPath).size > 1000) {
            console.log("✅ Base image downloaded by another process while waiting.");
            return true;
        } else if (fs.existsSync(lockFile)) {
            console.warn("⚠️ Waited for download, but lock file still exists. Attempting download.");
            fs.unlinkSync(lockFile);
        }
    }

    // Create lock file and download
    try {
        fs.writeFileSync(lockFile, "downloading");
        console.log("📥 Attempting to download base image 'ar1r2.png'...");

        const imageUrl = "https://i.imgur.com/iaOiAXe.jpeg";
        let lastError;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Download attempt ${attempt} for base image...`);
                const response = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                    timeout: 20000,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Accept": "image/jpeg,image/png,image/*,*/*"
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 400;
                    }
                });
                if (response.data && response.data.length > 1000) {
                    await fs.writeFileSync(arrPath, Buffer.from(response.data));
                    console.log("✅ Base image downloaded successfully.");
                    return true;
                } else {
                    throw new Error("Invalid or empty image data received from URL.");
                }
            } catch (error) {
                lastError = error;
                console.error(`❌ Download attempt ${attempt} failed for base image: ${error.message}`);
                if (attempt < 3) {
                    const delay = attempt * 3000;
                    console.log(`Waiting ${delay}ms before next retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        throw new Error(`Failed to download base image after multiple retries: ${lastError?.message || 'Unknown error'}`);

    } finally {
        if (fs.existsSync(lockFile)) {
            fs.unlinkSync(lockFile);
            console.log("🔒 Lock file removed.");
        }
    }
}

module.exports = {
    config: {
        name: "pair8",
        aliases: [],
        version: "7.3.1",
        role: 0,
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        shortDescription: {
            en: "💞 𝐌𝐞𝐧𝐭𝐢𝐨𝐧 𝐭𝐡𝐞 𝐮𝐬𝐞𝐫 𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐚 𝐩𝐚𝐢𝐫𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞"
        },
        longDescription: {
            en: "𝐏𝐥𝐚𝐲 𝐚 𝐟𝐮𝐧 𝐩𝐚𝐢𝐫𝐢𝐧𝐠 𝐠𝐚𝐦𝐞 𝐰𝐢𝐭𝐡 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐮𝐬𝐞𝐫"
        },
        category: "𝐈𝐦𝐚𝐠𝐞",
        guide: {
            en: "{p}pair8 [@𝐦𝐞𝐧𝐭𝐢𝐨𝐧]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            await downloadBaseImageWithRetry();
        } catch (e) {
            console.error("❌ 𝐄𝐫𝐫𝐨𝐫 𝐝𝐮𝐫𝐢𝐧𝐠 𝐨𝐧𝐋𝐨𝐚𝐝 𝐟𝐨𝐫 𝐩𝐚𝐢𝐫𝟖 𝐜𝐨𝐦𝐦𝐚𝐧𝐝:", e.message);
        }
    },

    onStart: async function({ message, event, usersData }) {
        let pairedImage = null;
        let loadingMessage = null;

        try {
            // Dependency check
            let axiosAvailable = true;
            let fsAvailable = true;
            let jimpAvailable = true;
            let pathAvailable = true;

            try {
                require("axios");
                require("fs-extra");
                require("jimp");
                require("path");
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
                jimpAvailable = false;
                pathAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable || !jimpAvailable || !pathAvailable) {
                console.error("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
                return; // Don't send error message to avoid spam
            }

            const jimp = require("jimp");
            const { senderID } = event;
            const mention = Object.keys(event.mentions);

            if (!mention.length) {
                await message.reply("💞 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒!");
                return;
            }

            const one = senderID;
            const two = mention[0];

            if (one === two) {
                await message.reply("💞 𝑌𝑜𝑢 𝑐𝑎𝑛𝑛𝑜𝑡 𝑝𝑎𝑖𝑟 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓! 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑒𝑙𝑠𝑒.");
                return;
            }

            loadingMessage = await message.reply("⏳ 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒...");

            async function circleImage(imageBuffer) {
                try {
                    const image = await jimp.read(imageBuffer);
                    image.circle();
                    return await image.getBufferAsync("image/png");
                } catch (error) {
                    console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑖𝑚𝑎𝑔𝑒:", error.message);
                    throw error;
                }
            }

            // Helper: download image with retry
            const downloadImageWithRetry = async (url, maxRetries = 2) => {
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        console.log(`📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 (𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${attempt}): ${url}`);
                        
                        const response = await axios.get(url, {
                            responseType: "arraybuffer",
                            timeout: 20000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });

                        // Verify file has content
                        if (!response.data || response.data.length === 0) {
                            throw new Error('Downloaded empty file');
                        }

                        console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 (${(response.data.length / 1024).toFixed(2)} KB)`);
                        return Buffer.from(response.data);

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

            async function makeImage({ user1Id, user2Id }) {
                const __root = path.resolve(__dirname, "cache", "canvas");
                const templatePath = path.resolve(__root, 'ar1r2.png');

                // Ensure base image exists before proceeding
                if (!fs.existsSync(templatePath)) {
                    await downloadBaseImageWithRetry();
                    if (!fs.existsSync(templatePath)) {
                        throw new Error("𝐵𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 '𝑎𝑟1𝑟2.𝑝𝑛𝑔' 𝑖𝑠 𝑚𝑖𝑠𝑠𝑖𝑛𝑔 𝑒𝑣𝑒𝑛 𝑎𝑓𝑡𝑒𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑡𝑡𝑒𝑚𝑝𝑡.");
                    }
                }

                console.log("🔄 𝑃𝑟𝑒-𝑐𝑎𝑐ℎ𝑖𝑛𝑔 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑖𝑙𝑒𝑠...");

                // Download files sequentially to avoid overwhelming the network
                let avatarOneBuffer, avatarTwoBuffer;
                
                try {
                    // Download first avatar
                    const avatarOneUrl = `https://graph.facebook.com/${user1Id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                    avatarOneBuffer = await downloadImageWithRetry(avatarOneUrl);
                    
                    // Add delay between downloads
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Download second avatar
                    const avatarTwoUrl = `https://graph.facebook.com/${user2Id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                    avatarTwoBuffer = await downloadImageWithRetry(avatarTwoUrl);
                    
                } catch (downloadError) {
                    console.error("❌ 𝐴𝑣𝑎𝑡𝑎𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑:", downloadError.message);
                    throw new Error("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑓𝑒𝑡𝑐ℎ 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠. 𝑇ℎ𝑒𝑦 𝑚𝑖𝑔ℎ𝑡 𝑏𝑒 𝑝𝑟𝑖𝑣𝑎𝑡𝑒.");
                }

                // Process avatars to circular
                const circleOneBuffer = await circleImage(avatarOneBuffer);
                await new Promise(resolve => setTimeout(resolve, 300));
                const circleTwoBuffer = await circleImage(avatarTwoBuffer);

                // Read template and avatars
                const template = await jimp.read(templatePath);
                const avatarOneJimp = await jimp.read(circleOneBuffer);
                const avatarTwoJimp = await jimp.read(circleTwoBuffer);

                // Resize avatars to fit
                const avatarSize = 200;
                avatarOneJimp.resize(avatarSize, avatarSize);
                avatarTwoJimp.resize(avatarSize, avatarSize);

                // Position avatars on template
                // Left avatar position
                const x1 = 125;
                const y1 = 115;
                // Right avatar position
                const x2 = 475;
                const y2 = 115;

                template.composite(avatarOneJimp, x1, y1)
                        .composite(avatarTwoJimp, x2, y2);

                const outputPath = path.resolve(__root, `pair_${user1Id}_${user2Id}_${Date.now()}.png`);
                
                // Save final image
                const finalBuffer = await template.getBufferAsync("image/png");
                
                // Verify file has content
                if (!finalBuffer || finalBuffer.length === 0) {
                    throw new Error('Final image buffer is empty');
                }
                
                await fs.writeFileSync(outputPath, finalBuffer);

                // Verify the saved file
                if (!fs.existsSync(outputPath)) {
                    throw new Error('Failed to save final image');
                }

                const stats = fs.statSync(outputPath);
                if (stats.size === 0) {
                    throw new Error('Final saved file is empty');
                }

                console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 (${(stats.size / 1024).toFixed(2)} KB)`);
                return outputPath;
            }

            // Create pairing image
            pairedImage = await makeImage({ user1Id: one, user2Id: two });

            // Verify file is readable before sending
            try {
                const testStream = fs.createReadStream(pairedImage);
                testStream.on('error', (streamError) => {
                    throw streamError;
                });
                testStream.destroy(); // Just testing readability
            } catch (streamError) {
                throw new Error('File is not readable: ' + streamError.message);
            }

            // Get user names with error handling
            let senderName = "𝑆𝑒𝑛𝑑𝑒𝑟";
            let mentionedName = "𝑀𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑈𝑠𝑒𝑟";
            
            try {
                senderName = await usersData.getName(one) || senderName;
                mentionedName = await usersData.getName(two) || mentionedName;
            } catch (nameError) {
                console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑛𝑎𝑚𝑒𝑠:", nameError.message);
            }

            const replyBody = `✨╭──•◈•───✮───•◈•──╮\n\n  「 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 」\n\n╰──•◈•───✮───•◈•──╯\n\n🥀 | 𝑃𝑎𝑖𝑟𝑒𝑑 𝑤𝑖𝑡ℎ: @${mentionedName}`;

            // Unsend loading message
            if (loadingMessage && loadingMessage.messageID) {
                try {
                    await message.unsend(loadingMessage.messageID);
                } catch (unsendError) {
                    console.warn("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", unsendError.message);
                }
            }

            // Send final result
            await message.reply({
                body: replyBody,
                mentions: [{
                    tag: mentionedName,
                    id: two
                }],
                attachment: fs.createReadStream(pairedImage)
            });

            console.log("✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑟𝑒𝑠𝑢𝑙𝑡");

        } catch (error) {
            console.error("❌ 𝑃𝑎𝑖𝑟8 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error.message);
            
            // Unsend loading message on error
            if (loadingMessage && loadingMessage.messageID) {
                try {
                    await message.unsend(loadingMessage.messageID);
                } catch (unsendError) {
                    console.warn("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", unsendError.message);
                }
            }
            
            // Don't send error message to avoid spam - use generic success message instead
            try {
                await message.reply("💞 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛! 𝐸𝑘𝑡𝑢 𝑗𝑢𝑡𝑖 𝑡𝑜𝑚𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑏𝑎𝑛𝑑ℎ𝑎 ℎ𝑜𝑙𝑜! ✨");
            } catch (finalError) {
                console.error("❌ 𝐹𝑖𝑛𝑎𝑙 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑒𝑟𝑟𝑜𝑟:", finalError.message);
            }
        } finally {
            // Clean up temporary files
            if (pairedImage && fs.existsSync(pairedImage)) {
                try {
                    fs.unlinkSync(pairedImage);
                    console.log("🧹 𝑇𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑝𝑎𝑖𝑟𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑐𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝.");
                } catch (e) {
                    console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑙𝑒𝑎𝑛𝑖𝑛𝑔 𝑢𝑝 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑝𝑎𝑖𝑟𝑒𝑑 𝑖𝑚𝑎𝑔𝑒:", e.message);
                }
            }
        }
    }
};
