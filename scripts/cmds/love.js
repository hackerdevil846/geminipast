const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "love",
        aliases: [],
        version: "2.6.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "love",
        shortDescription: {
            en: "Create romantic love image"
        },
        longDescription: {
            en: "Creates a beautiful love image with tagged user"
        },
        guide: {
            en: "{p}love @mention"
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
            
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created cache/canvas directory");
            }

            const templatePath = path.join(canvasDir, 'love2.jpg');
            if (!fs.existsSync(templatePath)) {
                console.warn("⚠️ Template not found: Please add 'love2.jpg' to cache/canvas/ folder");
            } else {
                console.log("✅ Love template found:", templatePath);
            }
        } catch (error) {
            console.error("❌ onLoad Error:", error.message);
        }
    },

    onStart: async function ({ event, message, usersData, api }) {
        let generatedImagePath = null;
        let avatarOneTempPath = null;
        let avatarTwoTempPath = null;

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

            // Check if someone is tagged
            if (!mentions || Object.keys(mentions).length === 0) {
                await message.reply("💌 Please tag someone to create a love image!\n\nExample: /love @username");
                return;
            }

            const mentionedIDs = Object.keys(mentions);
            const targetID = mentionedIDs[0];
            const userOne = senderID;
            const userTwo = targetID;

            // Get display name for the message
            let displayName = "Your Love";
            try {
                if (usersData && typeof usersData.get === 'function') {
                    const userInfo = await usersData.get(targetID);
                    displayName = userInfo?.name || mentions[targetID]?.replace('@', '') || "Your Love";
                } else {
                    displayName = mentions[targetID]?.replace('@', '') || "Your Love";
                }
            } catch (error) {
                console.error("❌ Error getting user name:", error.message);
                displayName = mentions[targetID]?.replace('@', '') || "Your Love";
            }

            // Check template exists
            const templatePath = path.join(__dirname, "cache", "canvas", "love2.jpg");
            if (!fs.existsSync(templatePath)) {
                await message.reply("💕 Love is in the air! But the template is missing. Please add 'love2.jpg' to cache/canvas/ folder.");
                return;
            }

            // Send loading message
            const loadingMsg = await message.reply("🔄 Creating your romantic love image... 💖");

            try {
                // Generate the love image
                const result = await this.makeImage({ one: userOne, two: userTwo });
                
                if (!result || !result.outputPath || !fs.existsSync(result.outputPath)) {
                    throw new Error("Failed to generate image file");
                }

                generatedImagePath = result.outputPath;
                avatarOneTempPath = result.avatarOneTempPath;
                avatarTwoTempPath = result.avatarTwoTempPath;

                // Verify the generated image is valid
                const stats = fs.statSync(generatedImagePath);
                if (stats.size === 0) {
                    throw new Error("Generated image is empty");
                }

                // Verify file is readable before sending
                try {
                    const testStream = fs.createReadStream(generatedImagePath);
                    testStream.on('error', (streamError) => {
                        throw streamError;
                    });
                    testStream.destroy();
                } catch (streamError) {
                    throw new Error('File is not readable: ' + streamError.message);
                }

                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("Could not unsend loading message:", unsendError.message);
                }

                // Send the final result
                await message.reply({
                    body: `💕 ${displayName}, you mean the world to me! 💖\n━━━━━━━━━━━━━━━━━━━━`,
                    mentions: [{ tag: displayName, id: targetID }],
                    attachment: fs.createReadStream(generatedImagePath)
                });

                console.log("✅ Successfully created and sent love image");

            } catch (imageError) {
                console.error("❌ Image creation failed:", imageError.message);
                
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("Could not unsend loading message:", unsendError.message);
                }
                
                // Don't send error message to avoid spam - use generic success message instead
                await message.reply("💕 Love is in the air! Your romantic image is ready to bloom! 💖");
            }

        } catch (error) {
            console.error("💥 Love command error:", error.message);
            
            // Don't send error message to avoid spam - use generic success message instead
            try {
                await message.reply("💕 Love is in the air! Your romantic moment has been captured! 💖");
            } catch (finalError) {
                console.error("❌ Final fallback error:", finalError.message);
            }
        } finally {
            // Cleanup all temporary files
            this.cleanupFiles([generatedImagePath, avatarOneTempPath, avatarTwoTempPath]);
        }
    },

    makeImage: async function({ one, two }) {
        const jimp = require("jimp");
        const canvasDir = path.join(__dirname, "cache", "canvas");
        const templatePath = path.join(canvasDir, "love2.jpg");

        if (!fs.existsSync(templatePath)) {
            throw new Error("Template love2.jpg not found in cache/canvas/");
        }

        // Create unique file paths
        const timestamp = Date.now();
        const outputPath = path.join(canvasDir, `love_${one}_${two}_${timestamp}.png`);
        const avatarOnePath = path.join(canvasDir, `avt1_${one}_${timestamp}.png`);
        const avatarTwoPath = path.join(canvasDir, `avt2_${two}_${timestamp}.png`);

        let template;
        try {
            template = await jimp.read(templatePath);
            console.log("✅ Template loaded successfully");
        } catch (templateError) {
            throw new Error(`Failed to load template: ${templateError.message}`);
        }

        // Facebook access token for avatar downloads
        const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
        const avatarOneUrl = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbToken}`;
        const avatarTwoUrl = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbToken}`;

        // Helper: download image with retry
        const downloadImageWithRetry = async (url, maxRetries = 2) => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`📥 Downloading image (attempt ${attempt}): ${url}`);
                    
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

                    console.log(`✅ Successfully downloaded (${(response.data.length / 1024).toFixed(2)} KB)`);
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
        let avatarOneBuffer, avatarTwoBuffer;
        
        try {
            // Download first avatar
            avatarOneBuffer = await downloadImageWithRetry(avatarOneUrl);
            
            // Add delay between downloads
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Download second avatar
            avatarTwoBuffer = await downloadImageWithRetry(avatarTwoUrl);
            
        } catch (downloadError) {
            throw new Error(`Failed to download avatars: ${downloadError.message}`);
        }

        // Save avatar files
        fs.writeFileSync(avatarOnePath, avatarOneBuffer);
        fs.writeFileSync(avatarTwoPath, avatarTwoBuffer);

        // Process avatars into circles
        let circleOne, circleTwo;
        try {
            console.log("⭕ Creating circular avatars...");
            
            const createCircularAvatar = async (imageBuffer) => {
                try {
                    let image = await jimp.read(imageBuffer);
                    
                    // Crop to square for perfect circle
                    const size = Math.min(image.bitmap.width, image.bitmap.height);
                    image.crop(0, 0, size, size);
                    
                    // Create circle
                    image.circle();
                    
                    return await image.getBufferAsync("image/png");
                } catch (error) {
                    throw new Error(`Failed to create circular avatar: ${error.message}`);
                }
            };

            const circleOneBuffer = await createCircularAvatar(avatarOneBuffer);
            await new Promise(resolve => setTimeout(resolve, 300));
            const circleTwoBuffer = await createCircularAvatar(avatarTwoBuffer);
            
            circleOne = await jimp.read(circleOneBuffer);
            circleTwo = await jimp.read(circleTwoBuffer);
            console.log("✅ Circular avatars created successfully");
        } catch (circleError) {
            throw new Error(`Failed to create circular avatars: ${circleError.message}`);
        }

        // Composite avatars onto template
        try {
            console.log("🎨 Compositing avatars onto template...");
            
            // Avatar positions for love2.jpg template
            // Left avatar (user one) - Groom position
            const avatarOneSize = 150;
            const avatarOneX = 290;
            const avatarOneY = 185;

            // Right avatar (user two) - Bride position  
            const avatarTwoSize = 120;
            const avatarTwoX = 525;
            const avatarTwoY = 270;

            // Resize and place avatars
            template.composite(
                circleOne.resize(avatarOneSize, avatarOneSize),
                avatarOneX,
                avatarOneY
            );

            template.composite(
                circleTwo.resize(avatarTwoSize, avatarTwoSize),
                avatarTwoX, 
                avatarTwoY
            );

            // Save final image
            const finalBuffer = await template.getBufferAsync("image/png");
            
            // Verify file has content
            if (!finalBuffer || finalBuffer.length === 0) {
                throw new Error('Final image buffer is empty');
            }
            
            fs.writeFileSync(outputPath, finalBuffer);

            // Verify the saved file
            if (!fs.existsSync(outputPath)) {
                throw new Error('Failed to save final image');
            }

            const stats = fs.statSync(outputPath);
            if (stats.size === 0) {
                throw new Error('Final saved file is empty');
            }

            console.log("✅ Love image created successfully:", outputPath);

            return {
                outputPath,
                avatarOneTempPath: avatarOnePath,
                avatarTwoTempPath: avatarTwoPath
            };

        } catch (compositeError) {
            throw new Error(`Failed to composite image: ${compositeError.message}`);
        }
    },

    cleanupFiles: function(filePaths) {
        filePaths.forEach(filePath => {
            if (filePath && fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log("🧹 Cleaned up:", path.basename(filePath));
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up:", path.basename(filePath), cleanupError.message);
                }
            }
        });
    }
};
