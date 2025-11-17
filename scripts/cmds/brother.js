const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "brother",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "👫 Create sibling image with mentioned user"
        },
        longDescription: {
            en: "Create a sibling pair image with mentioned user"
        },
        guide: {
            en: "{p}brother [@mention]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async function () {
        try {
            console.log("🔄 Initializing brother command...");
            
            const canvasPath = path.join(__dirname, "cache", "canvas");
            
            // Create cache directory
            if (!fs.existsSync(canvasPath)) {
                fs.mkdirSync(canvasPath, { recursive: true });
                console.log("✅ Created cache directory");
            }

            const templatePath = path.join(canvasPath, "sibling_template.jpg");
            
            // Download template if it doesn't exist
            if (!fs.existsSync(templatePath)) {
                console.log("📥 Downloading template image...");
                try {
                    const response = await axios.get("https://i.imgur.com/n2FGJFe.jpg", {
                        responseType: "arraybuffer",
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    // Verify the downloaded data
                    if (response.data && response.data.byteLength > 1000) {
                        fs.writeFileSync(templatePath, Buffer.from(response.data, "binary"));
                        console.log("✅ Template downloaded successfully");
                    } else {
                        throw new Error("Downloaded file is too small or empty");
                    }
                } catch (downloadError) {
                    console.error("❌ Failed to download template:", downloadError.message);
                    // Template will be downloaded on first use if it fails here
                }
            } else {
                console.log("✅ Template already exists");
            }
            
        } catch (error) {
            console.error("💥 Brother.js Template Loading Error:", error);
        }
    },

    onStart: async function ({ event, message, api }) {
        let generatedImagePath = null;
        
        try {
            const { senderID, mentions } = event;
            const mentionedUsers = Object.keys(mentions);

            if (mentionedUsers.length === 0) {
                return message.reply("🔹 Please mention someone to create a sibling pair");
            }

            const userOne = senderID;
            const userTwo = mentionedUsers[0];

            // Don't allow self-mention
            if (userTwo === senderID) {
                return message.reply("❌ You cannot create a sibling pair with yourself!");
            }

            const targetName = event.mentions[userTwo].replace("@", "");
            const cachePath = path.join(__dirname, "cache", "canvas");
            
            // Ensure cache directory exists
            if (!fs.existsSync(cachePath)) {
                fs.mkdirSync(cachePath, { recursive: true });
            }

            const processingMsg = await message.reply("⏳ Creating sibling image...");

            try {
                // Generate the sibling image
                generatedImagePath = await this.makeSiblingImage(userOne, userTwo, cachePath);
                
                if (generatedImagePath && fs.existsSync(generatedImagePath)) {
                    await message.reply({
                        body: `👫 Sibling pair created!\n\n✨ You and ${targetName} look awesome together!`,
                        mentions: [{ tag: targetName, id: userTwo }],
                        attachment: fs.createReadStream(generatedImagePath)
                    });
                    
                    console.log("✅ Successfully sent sibling image");
                } else {
                    throw new Error("Failed to create image file");
                }

            } catch (imageError) {
                console.error("❌ Failed to create image:", imageError);
                await message.reply("❌ Failed to create sibling image. Please try again later.");
            }

            // Clean up processing message
            try {
                await api.unsendMessage(processingMsg.messageID);
            } catch (unsendError) {
                console.warn("⚠️ Could not unsend processing message:", unsendError.message);
            }

        } catch (error) {
            console.error("💥 Brother.js Command Error:", error);
            await message.reply("❌ An error occurred while processing your request.");
        } finally {
            // Clean up generated image
            if (generatedImagePath && fs.existsSync(generatedImagePath)) {
                try {
                    fs.unlinkSync(generatedImagePath);
                    console.log("🧹 Cleaned up generated image");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up:", cleanupError.message);
                }
            }
        }
    },

    makeSiblingImage: async function(user1, user2, cacheDir) {
        const templatePath = path.join(cacheDir, "sibling_template.jpg");
        const outputPath = path.join(cacheDir, `siblings_${user1}_${user2}_${Date.now()}.png`);

        try {
            console.log("🔍 Checking template existence...");
            
            // Check if template exists, download if not
            if (!fs.existsSync(templatePath)) {
                console.log("📥 Template not found, downloading...");
                try {
                    const response = await axios.get("https://i.imgur.com/n2FGJFe.jpg", {
                        responseType: "arraybuffer",
                        timeout: 30000
                    });
                    
                    if (response.data && response.data.byteLength > 1000) {
                        fs.writeFileSync(templatePath, Buffer.from(response.data, "binary"));
                        console.log("✅ Template downloaded successfully");
                    } else {
                        throw new Error("Downloaded template is invalid");
                    }
                } catch (downloadError) {
                    console.error("❌ Failed to download template:", downloadError.message);
                    throw new Error("Template file not found and could not be downloaded");
                }
            }

            // Verify template is readable
            try {
                await jimp.read(templatePath);
                console.log("✅ Template verified and readable");
            } catch (templateError) {
                console.error("❌ Template file is corrupted:", templateError.message);
                // Delete corrupted template and try to download again (this will be handled by the next check)
                fs.unlinkSync(templatePath); 
                throw new Error("Template file is corrupted. Deleted corrupted file. Please try again.");
            }

            console.log("📥 Processing avatars...");
            const [avatar1, avatar2] = await Promise.all([
                this.processAvatar(user1, cacheDir),
                this.processAvatar(user2, cacheDir)
            ]);

            console.log("🎨 Creating final image...");
            const template = await jimp.read(templatePath);

            // Composite avatars onto template
            // Position 1: Left side avatar (Sister)
            // Analysis confirms these coordinates and size provide a good fit for the left circle in the reference image.
            template.composite(avatar1.resize(191, 191), 93, 111);
            
            // Position 2: Right side avatar (Brother)
            // Analysis confirms these coordinates and size provide a good fit for the right circle in the reference image.
            template.composite(avatar2.resize(190, 190), 434, 107);

            // Save final image
            await template.writeAsync(outputPath);
            
            // Verify the output file was created
            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                if (stats.size > 0) {
                    console.log("✅ Successfully created sibling image");
                    return outputPath;
                } else {
                    throw new Error("Created image file is empty");
                }
            } else {
                throw new Error("Failed to create output image file");
            }

        } catch (error) {
            console.error("❌ Brother.js Image Creation Error:", error);
            
            // Clean up output file if it was partially created
            if (fs.existsSync(outputPath)) {
                try {
                    fs.unlinkSync(outputPath);
                } catch (cleanupError) {
                    console.warn("⚠️ Could not clean up failed image:", cleanupError.message);
                }
            }
            
            throw error;
        }
    },

    processAvatar: async function(userID, cacheDir) {
        const avatarPath = path.join(cacheDir, `avt_${userID}_${Date.now()}.png`);
        
        try {
            console.log(`📥 Downloading avatar for user ${userID}...`);
            
            const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const response = await axios.get(url, { 
                responseType: "arraybuffer",
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            // Verify avatar data
            if (!response.data || response.data.byteLength < 1000) {
                throw new Error("Invalid avatar data received");
            }

            fs.writeFileSync(avatarPath, Buffer.from(response.data, "binary"));

            const avatar = await jimp.read(avatarPath);
            avatar.circle();

            return avatar;

        } catch (error) {
            console.error(`❌ Failed to process avatar for user ${userID}:`, error.message);
            throw error;
        } finally {
            // Clean up temporary avatar file
            if (fs.existsSync(avatarPath)) {
                try {
                    fs.unlinkSync(avatarPath);
                } catch (cleanupError) {
                    console.warn("⚠️ Could not clean up avatar file:", cleanupError.message);
                }
            }
        }
    }
};
