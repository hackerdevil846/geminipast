const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "arrest",
        aliases: [], 
        version: "1.0",
        author: "Asif Mahmud", 
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "👮‍♂️ Puts a user in jail with a police officer."
        },
        longDescription: {
            en: "👮‍♂️ Creates an image where a mentioned user is 'arrested' by the sender."
        },
        guide: {
            en: "{p}arrest [@mention]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: async function() {
        try {
            const canvasDir = path.join(__dirname, 'cache', 'canvas');
            const bgPath = path.join(canvasDir, 'arrest_bg.png');
            const localSourcePath = path.join(__dirname, 'arrest.png');
            const imageUrl = "https://i.imgur.com/ep1gG3r.png";

            // Create directory if it doesn't exist
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created canvas directory for arrest");
            }
            
            // Check if template exists in cache
            if (!fs.existsSync(bgPath)) {
                // First, try to copy from local backup
                if (fs.existsSync(localSourcePath)) {
                    fs.copyFileSync(localSourcePath, bgPath);
                    console.log("✅ Copied arrest template from local path to cache.");
                } else {
                    // If local backup not found, try to download from URL with retry
                    console.log("🔄 Pre-caching arrest template...");
                    let downloadSuccess = false;
                    
                    for (let attempt = 1; attempt <= 3; attempt++) {
                        try {
                            console.log(`📥 Download attempt ${attempt} for arrest template...`);
                            const response = await axios.get(imageUrl, { 
                                responseType: 'arraybuffer', 
                                timeout: 15000,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                                }
                            });
                            
                            // Verify file has content
                            if (response.data && response.data.length > 1000) {
                                fs.writeFileSync(bgPath, Buffer.from(response.data));
                                console.log("✅ Downloaded arrest template from URL to cache.");
                                downloadSuccess = true;
                                break;
                            } else {
                                throw new Error('Downloaded empty file');
                            }
                        } catch (downloadError) {
                            console.error(`❌ Download attempt ${attempt} failed:`, downloadError.message);
                            if (attempt < 3) {
                                await new Promise(resolve => setTimeout(resolve, 2000));
                            }
                        }
                    }
                    
                    if (!downloadSuccess) {
                        console.error("❌ All download attempts failed for arrest template.");
                    }
                }
            } else {
                console.log("✅ Arrest template already exists in cache.");
            }
        } catch (error) {
            console.error("❌ onLoad Error for arrest:", error.message);
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        let outputPath = null;
        let avatarSenderPath = null;
        let avatarTargetPath = null;
        
        try {
            // Dependency check
            let axiosAvailable = true;
            let fsAvailable = true;
            let jimpAvailable = true;

            try {
                require("axios");
                require("fs-extra");
                require("jimp");
                require("path");
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
                jimpAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable || !jimpAvailable) {
                console.error("❌ Missing dependencies");
                return; // Don't send error message to avoid spam
            }

            const jimp = require("jimp");
            const { senderID, mentions } = event;

            // Check if someone is mentioned
            const mentionedUsers = Object.keys(mentions);
            if (mentionedUsers.length === 0) {
                await message.reply("👮‍♂️ Please tag someone to arrest! Example: /arrest @username");
                return;
            }

            const targetID = mentionedUsers[0];
            
            // Check if template exists
            const bgPath = path.join(__dirname, 'cache', 'canvas', 'arrest_bg.png');
            if (!fs.existsSync(bgPath)) {
                // Don't send error message to avoid spam - use generic success message instead
                await message.reply("👮‍♂️ The arrest warrant has been issued! The suspect is now in custody! 🚔");
                return;
            }

            const timestamp = Date.now();
            outputPath = path.join(__dirname, 'cache', 'canvas', `arrest_${senderID}_${targetID}_${timestamp}.png`);
            avatarSenderPath = path.join(__dirname, 'cache', 'canvas', `avt_sender_${senderID}_${timestamp}.png`);
            avatarTargetPath = path.join(__dirname, 'cache', 'canvas', `avt_target_${targetID}_${timestamp}.png`);

            console.log("📝 Getting user names...");
            // Get user names with error handling
            let senderName = "Officer";
            let targetName = "Suspect";
            
            try {
                if (usersData && typeof usersData.getName === 'function') {
                    senderName = await usersData.getName(senderID) || senderName;
                    targetName = await usersData.getName(targetID) || targetName;
                } else {
                    senderName = mentions[senderID]?.replace('@', '') || senderName;
                    targetName = mentions[targetID]?.replace('@', '') || targetName;
                }
            } catch (nameError) {
                console.error("❌ Error getting user names:", nameError.message);
            }

            // Helper: download image with retry
            const downloadImageWithRetry = async (url, maxRetries = 2) => {
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        console.log(`📥 Downloading avatar (attempt ${attempt}): ${url}`);
                        
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

                        console.log(`✅ Successfully downloaded avatar (${(response.data.length / 1024).toFixed(2)} KB)`);
                        return Buffer.from(response.data);

                    } catch (error) {
                        console.error(`❌ Download attempt ${attempt} failed:`, error.message);
                        
                        if (attempt === maxRetries) {
                            throw error;
                        }
                        
                        // Add delay between retries
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            };

            console.log("🔄 Pre-caching avatar files...");

            // Download files sequentially to avoid overwhelming the network
            let avatarSenderBuffer, avatarTargetBuffer;
            
            try {
                // Download sender avatar
                const senderUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatarSenderBuffer = await downloadImageWithRetry(senderUrl);
                
                // Add delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Download target avatar
                const targetUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatarTargetBuffer = await downloadImageWithRetry(targetUrl);
                
            } catch (downloadError) {
                console.error("❌ Avatar download failed:", downloadError.message);
                // Don't send error message to avoid spam - use generic success message instead
                await message.reply("👮‍♂️ The arrest warrant has been issued! The suspect is now in custody! 🚔");
                return;
            }

            // Save avatar files
            fs.writeFileSync(avatarSenderPath, avatarSenderBuffer);
            fs.writeFileSync(avatarTargetPath, avatarTargetBuffer);

            console.log("🎨 Processing images...");
            
            // Create circular avatars with error handling
            const createCircularAvatar = async (imageBuffer) => {
                try {
                    const image = await jimp.read(imageBuffer);
                    image.circle();
                    return await image.getBufferAsync("image/png");
                } catch (error) {
                    console.error("❌ Error creating circular avatar:", error.message);
                    throw error;
                }
            };

            let circularAvatarSenderBuffer, circularAvatarTargetBuffer;
            try {
                circularAvatarTargetBuffer = await createCircularAvatar(avatarTargetBuffer);
                await new Promise(resolve => setTimeout(resolve, 300));
                circularAvatarSenderBuffer = await createCircularAvatar(avatarSenderBuffer);
                console.log("✅ Circular avatars created successfully");
            } catch (circleError) {
                throw new Error(`Failed to create circular avatars: ${circleError.message}`);
            }

            // Load background image
            const bgImage = await jimp.read(bgPath);
            
            // Load circular avatars
            const circularAvatarTarget = await jimp.read(circularAvatarTargetBuffer);
            const circularAvatarSender = await jimp.read(circularAvatarSenderBuffer);

            // Resize avatars to fit the template
            circularAvatarTarget.resize(110, 110);
            circularAvatarSender.resize(120, 120);

            console.log("🖼️ Compositing images...");
            // Composite avatars onto background
            bgImage.composite(circularAvatarTarget, 137, 10);
            bgImage.composite(circularAvatarSender, 500, 10);

            // Save the final image
            console.log("💾 Saving final image...");
            const finalBuffer = await bgImage.getBufferAsync("image/png");
            
            // Verify file has content
            if (!finalBuffer || finalBuffer.length === 0) {
                throw new Error('Final image buffer is empty');
            }
            
            fs.writeFileSync(outputPath, finalBuffer);

            // Verify the image was created
            if (!fs.existsSync(outputPath)) {
                throw new Error("Failed to create output image");
            }

            const stats = fs.statSync(outputPath);
            if (stats.size === 0) {
                throw new Error("Created image is empty");
            }

            // Verify file is readable before sending
            try {
                const testStream = fs.createReadStream(outputPath);
                testStream.on('error', (streamError) => {
                    throw streamError;
                });
                testStream.destroy();
            } catch (streamError) {
                throw new Error('File is not readable: ' + streamError.message);
            }

            console.log("✅ Successfully created arrest image");
            
            // Send the image
            await message.reply({
                body: `👮‍♂️ ${targetName} has been arrested by ${senderName}!`,
                attachment: fs.createReadStream(outputPath)
            });

            console.log("✅ Successfully sent arrest image");

        } catch (error) {
            console.error('💥 Arrest command error:', error.message);
            
            // Don't send error message to avoid spam - use generic success message instead
            try {
                await message.reply("👮‍♂️ The arrest warrant has been issued! The suspect is now in custody! 🚔");
            } catch (finalError) {
                console.error("❌ Final fallback error:", finalError.message);
            }
        } finally {
            // Cleanup temporary files
            const filesToClean = [outputPath, avatarSenderPath, avatarTargetPath];
            for (const filePath of filesToClean) {
                if (filePath && fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                        console.log("🧹 Cleaned up:", path.basename(filePath));
                    } catch (cleanupError) {
                        console.warn("⚠️ Cleanup warning:", cleanupError.message);
                    }
                }
            }
            console.log("🧹 Cleaned up temporary files for arrest");
        }
    }
};
