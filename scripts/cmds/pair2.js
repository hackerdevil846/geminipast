const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "pair2",
        aliases: [],
        version: "1.0.2",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "𝗣𝗶𝗰𝘁𝘂𝗿𝗲",
        shortDescription: {
            en: "💖 𝗖𝗼𝘂𝗽𝗹𝗲 𝗽𝗮𝗶𝗿𝗶𝗻𝗴 𝗴𝗮𝗺𝗲"
        },
        longDescription: {
            en: "💖 𝗖𝗿𝗲𝗮𝘁𝗲𝘀 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹 𝗰𝗼𝘂𝗽𝗹𝗲 𝗽𝗮𝗶𝗿𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲𝘀"
        },
        guide: {
            en: "{p}pair2"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            console.log("🔄 𝖯𝗋𝖾-𝖼𝖺𝖼𝗁𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖿𝗂𝗅𝖾...");
            
            const dirMaterial = path.join(__dirname, 'cache', 'canvas');
            const filePath = path.join(dirMaterial, 'pairing.png');
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }
            
            // Download pairing template if it doesn't exist
            if (!fs.existsSync(filePath)) {
                console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗉𝖺𝗂𝗋𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾...");
                const response = await axios.get(
                    "https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png",
                    { 
                        responseType: "arraybuffer",
                        timeout: 30000
                    }
                );
                
                // Verify file has content
                if (response.data && response.data.length > 0) {
                    fs.writeFileSync(filePath, Buffer.from(response.data));
                    console.log("✅ 𝖯𝖺𝗂𝗋𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } else {
                    console.error("❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖾𝗆𝗉𝗍𝗒 𝖿𝗂𝗅𝖾");
                }
            } else {
                console.log("✅ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖾𝗑𝗂𝗌𝗍𝗌");
            }
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖫𝗈𝖺𝖽:", error.message);
        }
    },

    onStart: async function({ api, event, usersData }) {
        try {
            // Enhanced dependency check
            let axiosAvailable, fsAvailable, jimpAvailable;
            try {
                axiosAvailable = true;
                fsAvailable = true;
                jimpAvailable = true;
            } catch (e) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌");
                return; // Don't send error message to avoid spam
            }

            const { threadID, senderID, messageID } = event;
            const cacheRoot = path.join(__dirname, "cache", "canvas");

            // Ensure cache directory exists
            try {
                if (!fs.existsSync(cacheRoot)) {
                    fs.mkdirSync(cacheRoot, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return; // Don't send error message to avoid spam
            }

            // Helper function to create circular images
            async function createCircularImage(imagePath) {
                try {
                    const image = await jimp.read(imagePath);
                    const size = Math.min(image.getWidth(), image.getHeight());
                    
                    // Create a circular mask
                    const circle = await new jimp(size, size, 0x00000000);
                    for (let x = 0; x < size; x++) {
                        for (let y = 0; y < size; y++) {
                            const distance = Math.sqrt(Math.pow(x - size/2, 2) + Math.pow(y - size/2, 2));
                            if (distance <= size/2) {
                                circle.setPixelColor(jimp.rgbaToInt(255, 255, 255, 255), x, y);
                            }
                        }
                    }
                    
                    image.resize(size, size);
                    image.mask(circle);
                    return await image.getBufferAsync("image/png");
                } catch (error) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝗂𝗆𝖺𝗀𝖾:", error);
                    throw error;
                }
            }

            // Download avatar with retry logic
            async function downloadAvatar(userID, retryCount = 3) {
                for (let attempt = 1; attempt <= retryCount; attempt++) {
                    try {
                        console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 ${userID} (𝖺𝗍𝗍𝖾𝗆𝗉𝗍 ${attempt})`);
                        
                        const url = `https://graph.facebook.com/${userID}/picture?width=400&height=400&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                        const response = await axios.get(url, { 
                            responseType: 'arraybuffer',
                            timeout: 15000
                        });
                        
                        // Verify file has content
                        if (!response.data || response.data.length === 0) {
                            throw new Error("Empty response data");
                        }
                        
                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 ${userID}`);
                        return Buffer.from(response.data);
                        
                    } catch (error) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 ${userID} (𝖺𝗍𝗍𝖾𝗆𝗉𝗍 ${attempt}):`, error.message);
                        
                        if (attempt === retryCount) {
                            throw error;
                        }
                        
                        // Add delay between retries to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            // Main function to create pairing image
            async function createPairingImage(user1, user2) {
                const imagePath = path.join(cacheRoot, `pairing_${user1}_${user2}_${Date.now()}.png`);
                const avatar1Path = path.join(cacheRoot, `avt_${user1}_${Date.now()}.png`);
                const avatar2Path = path.join(cacheRoot, `avt_${user2}_${Date.now()}.png`);
                const templatePath = path.join(cacheRoot, "pairing.png");

                // Check if template exists and has content
                if (!fs.existsSync(templatePath)) {
                    throw new Error("𝖯𝖺𝗂𝗋𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
                }

                const templateStats = fs.statSync(templatePath);
                if (templateStats.size === 0) {
                    throw new Error("𝖯𝖺𝗂𝗋𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }

                try {
                    // Download files sequentially to avoid overwhelming the network
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋𝗌 𝗌𝖾𝗊𝗎𝖾𝗇𝗍𝗂𝖺𝗅𝗅𝗒...");
                    
                    const avatar1Buffer = await downloadAvatar(user1);
                    // Add delay between downloads to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    const avatar2Buffer = await downloadAvatar(user2);
                    
                    // Verify files have content before writing
                    if (avatar1Buffer.length === 0 || avatar2Buffer.length === 0) {
                        throw new Error("Downloaded avatar is empty");
                    }

                    // Save avatars
                    fs.writeFileSync(avatar1Path, avatar1Buffer);
                    fs.writeFileSync(avatar2Path, avatar2Buffer);

                    // Verify file is readable before processing
                    if (!fs.existsSync(avatar1Path) || !fs.existsSync(avatar2Path)) {
                        throw new Error("Failed to save avatar files");
                    }

                    // Load template and create circular avatars
                    console.log("🎨 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗉𝖺𝗂𝗋𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾...");
                    const templateImage = await jimp.read(templatePath);
                    const circularAvatar1 = await jimp.read(await createCircularImage(avatar1Path));
                    const circularAvatar2 = await jimp.read(await createCircularImage(avatar2Path));

                    // CORRECTED POSITIONS - Adjusted to fit the circles in the template
                    // Left avatar position (user2)
                    templateImage.composite(circularAvatar1.resize(180, 180), 180, 160);
                    // Right avatar position (user1)  
                    templateImage.composite(circularAvatar2.resize(180, 180), 630, 160);

                    // Save final image
                    const finalBuffer = await templateImage.getBufferAsync("image/png");
                    
                    // Verify final image has content
                    if (!finalBuffer || finalBuffer.length === 0) {
                        throw new Error("Final image buffer is empty");
                    }
                    
                    fs.writeFileSync(imagePath, finalBuffer);

                    // Verify final image file
                    if (!fs.existsSync(imagePath)) {
                        throw new Error("Failed to save final image");
                    }

                    const finalStats = fs.statSync(imagePath);
                    if (finalStats.size === 0) {
                        throw new Error("Final image file is empty");
                    }

                    console.log(`✅ 𝖯𝖺𝗂𝗋𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒: ${(finalStats.size / 1024).toFixed(2)} KB`);
                    return imagePath;

                } finally {
                    // Clean up temporary avatar files
                    try {
                        if (fs.existsSync(avatar1Path)) fs.unlinkSync(avatar1Path);
                        if (fs.existsSync(avatar2Path)) fs.unlinkSync(avatar2Path);
                    } catch (cleanupError) {
                        console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝗐𝖺𝗋𝗇𝗂𝗇𝗀:", cleanupError.message);
                    }
                }
            }

            // Compatibility scores
            const scores = ['𝟮𝟭%', '𝟲𝟳%', '𝟭𝟵%', '𝟯𝟳%', '𝟭𝟳%', '𝟵𝟲%', '𝟱𝟮%', '𝟲𝟮%', '𝟳𝟲%', '𝟴𝟯%', '𝟭𝟬𝟬%', '𝟵𝟵%', "𝟬%", "𝟰𝟴%"];
            const randomScore = scores[Math.floor(Math.random() * scores.length)];
            
            // Get sender's name with error handling
            let senderName;
            try {
                senderName = await usersData.getName(senderID);
            } catch (nameError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗌𝖾𝗇𝖽𝖾𝗋 𝗇𝖺𝗆𝖾:", nameError);
                senderName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
            }

            // Get thread participants
            let participants;
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const botID = api.getCurrentUserID();
                
                participants = threadInfo.participantIDs.filter(id => 
                    id !== senderID && id !== botID
                );
            } catch (threadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return; // Don't send error message to avoid spam
            }

            if (participants.length === 0) {
                return api.sendMessage("😢 𝖭𝗈 𝗈𝗍𝗁𝖾𝗋 𝗎𝗌𝖾𝗋𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉!", threadID, messageID);
            }

            // Select random participant
            const randomParticipantID = participants[Math.floor(Math.random() * participants.length)];
            
            // Get participant's name with error handling
            let participantName;
            try {
                participantName = await usersData.getName(randomParticipantID);
            } catch (nameError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗉𝖺𝗋𝗍𝗂𝖼𝗂𝗉𝖺𝗇𝗍 𝗇𝖺𝗆𝖾:", nameError);
                participantName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
            }

            // Create pairing image
            let pairingImagePath;
            try {
                pairingImagePath = await createPairingImage(senderID, randomParticipantID);
            } catch (imageError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗉𝖺𝗂𝗋𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾:", imageError);
                return; // Don't send error message to avoid spam
            }

            // Create message
            const message = `🎉 𝖢𝗈𝗇𝗀𝗋𝖺𝗍𝗎𝗅𝖺𝗍𝗂𝗈𝗇𝗌 ${senderName}, 𝗒𝗈𝗎 𝗃𝗎𝗌𝗍 𝗀𝗈𝗍 𝗉𝖺𝗂𝗋𝖾𝖽 𝗐𝗂𝗍𝗁 ${participantName}! 💖\n💌 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒 𝗌𝖼𝗈𝗋𝖾: 〘${randomScore}〙`;
            
            const mentions = [
                { id: senderID, tag: senderName },
                { id: randomParticipantID, tag: participantName }
            ];

            // Verify file is readable before sending
            if (!fs.existsSync(pairingImagePath)) {
                console.error("❌ 𝖥𝗂𝗇𝖺𝗅 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
                return;
            }

            const finalImageStats = fs.statSync(pairingImagePath);
            if (finalImageStats.size === 0) {
                console.error("❌ 𝖥𝗂𝗇𝖺𝗅 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                return;
            }

            // Send message with image
            await api.sendMessage({
                body: message,
                mentions: mentions,
                attachment: fs.createReadStream(pairingImagePath)
            }, threadID, async (err) => {
                // Clean up image file after sending
                try {
                    if (fs.existsSync(pairingImagePath)) {
                        fs.unlinkSync(pairingImagePath);
                        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌");
                    }
                } catch (cleanupError) {
                    console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝗐𝖺𝗋𝗇𝗂𝗇𝗀:", cleanupError.message);
                }
                
                if (err) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                }
            }, messageID);

        } catch (error) {
            console.error("💥 𝖯𝖺𝗂𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
