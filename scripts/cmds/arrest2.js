const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "arrest2",
        aliases: [],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "👮‍♂️ Arrests a user with a funny image"
        },
        longDescription: {
            en: "👮‍♂️ Puts a user's avatar on a 'most wanted' or 'arrested' template, along with the sender's avatar."
        },
        guide: {
            en: "{p}arrest2 [@mention]"
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
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created canvas directory for arrest2");
            }
            
            // Check if template exists in cache/canvas
            const bgPath = path.join(canvasDir, 'arrestv2_bg.png');
            const templatePath = path.join(canvasDir, 'arrestv2.png');
            
            // If the template already exists in cache/canvas, we're good
            if (fs.existsSync(templatePath)) {
                console.log("✅ arrest2 template found in cache/canvas");
                // Copy it to the working filename if needed
                if (!fs.existsSync(bgPath)) {
                    fs.copyFileSync(templatePath, bgPath);
                    console.log("✅ Copied arrest2 template to working file");
                }
                return;
            }
            
            // If template doesn't exist anywhere, log the error but don't crash
            console.error("❌ arrestv2.png not found in cache/canvas directory!");
            console.log("📁 Expected path:", templatePath);
            
        } catch (error) {
            console.error("❌ onLoad Error for arrest2:", error.message);
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
                return;
            }

            const jimp = require("jimp");
            const { senderID, mentions } = event;

            // Check if someone is mentioned
            const mentionedUsers = Object.keys(mentions);
            if (mentionedUsers.length === 0) {
                await message.reply("👮‍♂️ Please tag someone to arrest! Example: /arrest2 @username");
                return;
            }

            const targetID = mentionedUsers[0];
            
            // Check if template exists - look in cache/canvas first
            const canvasDir = path.join(__dirname, 'cache', 'canvas');
            const bgPath = path.join(canvasDir, 'arrestv2_bg.png');
            const templatePath = path.join(canvasDir, 'arrestv2.png');
            
            let finalTemplatePath = null;
            
            // Check multiple possible locations for the template
            if (fs.existsSync(bgPath)) {
                finalTemplatePath = bgPath;
                console.log("✅ Using cached template:", finalTemplatePath);
            } else if (fs.existsSync(templatePath)) {
                finalTemplatePath = templatePath;
                console.log("✅ Using template from cache/canvas:", finalTemplatePath);
            } else {
                console.error("❌ No arrest template found in any location");
                await message.reply("👮‍♂️ The arrest template is missing. Please make sure 'arrestv2.png' is in the cache/canvas folder.");
                return;
            }

            const timestamp = Date.now();
            outputPath = path.join(canvasDir, `arrest2_${senderID}_${targetID}_${timestamp}.png`);
            avatarSenderPath = path.join(canvasDir, `avt_sender_${senderID}_${timestamp}.png`);
            avatarTargetPath = path.join(canvasDir, `avt_target_${targetID}_${timestamp}.png`);

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
            let avatarSenderBuffer, avatarTargetBuffer;
            
            try {
                // Download sender avatar
                const avatarSenderUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatarSenderBuffer = await downloadImageWithRetry(avatarSenderUrl);
                
                // Add delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Download target avatar
                const avatarTargetUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatarTargetBuffer = await downloadImageWithRetry(avatarTargetUrl);
                
            } catch (downloadError) {
                console.error("❌ Avatar download failed:", downloadError.message);
                await message.reply("👮‍♂️ Your arrest warrant has been issued! The suspect is now in custody! 🚔");
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
                circularAvatarSenderBuffer = await createCircularAvatar(avatarSenderBuffer);
                await new Promise(resolve => setTimeout(resolve, 300));
                circularAvatarTargetBuffer = await createCircularAvatar(avatarTargetBuffer);
                console.log("✅ Circular avatars created successfully");
            } catch (circleError) {
                throw new Error(`Failed to create circular avatars: ${circleError.message}`);
            }

            // Load background image
            const bgImage = await jimp.read(finalTemplatePath);
            
            // Load circular avatars
            const circularAvatarSender = await jimp.read(circularAvatarSenderBuffer);
            const circularAvatarTarget = await jimp.read(circularAvatarTargetBuffer);

            // Resize avatars to fit the template - adjust these values based on your template
            circularAvatarSender.resize(110, 110); // Police officer
            circularAvatarTarget.resize(100, 100); // Arrested person

            console.log("🖼️ Compositing images...");
            // Composite avatars onto background - adjust positions based on your template
            bgImage.composite(circularAvatarTarget, 105, 12);  // Arrested person (left)
            bgImage.composite(circularAvatarSender, 520, 12);  // Police officer (right)

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

            console.log("✅ Successfully created arrest2 image");
            
            // Send the image
            await message.reply({
                body: `👮‍♂️ ${senderName} arrested ${targetName}! 🚔`,
                attachment: fs.createReadStream(outputPath)
            });

            console.log("✅ Successfully sent arrest2 image");

        } catch (error) {
            console.error('💥 Arrest2 command error:', error.message);
            
            try {
                await message.reply("👮‍♂️ Your arrest warrant has been issued! The suspect is now in custody! 🚔");
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
            console.log("🧹 Cleaned up temporary files for arrest2");
        }
    }
};
