const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "fingering2",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "nsfw",
        shortDescription: {
            en: "🔞 Create intimate image with tagged person"
        },
        longDescription: {
            en: "Generates an intimate image showing a moment between two users using their Facebook profile pictures"
        },
        guide: {
            en: "{p}fingering2 @mention"
        }
    },

    onLoad: async function() {
        try {
            const cacheDir = path.join(__dirname, 'cache', 'fingering2');
            await fs.ensureDir(cacheDir);
            console.log("✅ Fingering2 cache directory ensured");
        } catch (error) {
            console.error("❌ Fingering2 onLoad error:", error);
        }
    },

    onStart: async function({ message, event, args, api }) {
        let generatedImagePath = null;
        let processingMessage = null;
        
        try {
            const { senderID, mentions, messageID } = event;
            const mentionedUsers = Object.keys(mentions || {});

            // Input validation
            if (mentionedUsers.length === 0) {
                return message.reply("💌 Please tag someone! Example: /fingering2 @username");
            }

            const targetUser = mentionedUsers[0];
            
            if (targetUser === senderID) {
                return message.reply("🤔 Please tag someone else!");
            }

            if (targetUser === api.getCurrentUserID()) {
                return message.reply("😳 I'm just a bot, I can't participate!");
            }

            // Send processing message
            processingMessage = await message.reply("⏳ Creating your special moment... Please wait.");

            // Generate image
            generatedImagePath = await this.makeImage({ 
                one: senderID, 
                two: targetUser 
            });

            if (!generatedImagePath) {
                throw new Error("Image generation failed");
            }

            // Verify the image exists and has content
            const imageExists = await fs.pathExists(generatedImagePath);
            if (!imageExists) {
                throw new Error("Generated image file not found");
            }

            const stats = await fs.stat(generatedImagePath);
            if (stats.size === 0) {
                throw new Error("Generated image is empty");
            }

            // Delete processing message
            if (processingMessage && processingMessage.messageID) {
                try {
                    await api.unsendMessage(processingMessage.messageID);
                } catch (e) {
                    console.warn("Could not delete processing message:", e.message);
                }
            }

            // Send final result
            const mentionedName = mentions[targetUser].replace("@", "").split(" ")[0];
            
            await message.reply({
                body: `💞 Special moment for you and ${mentionedName}!`,
                attachment: fs.createReadStream(generatedImagePath),
                mentions: [{
                    tag: `@${mentionedName}`,
                    id: targetUser
                }]
            });

            console.log("✅ Fingering2 image sent successfully");

        } catch (error) {
            console.error("💥 Fingering2 command error:", error);
            
            // Clean up processing message on error
            if (processingMessage && processingMessage.messageID) {
                try {
                    await api.unsendMessage(processingMessage.messageID);
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
            
            // User-friendly error messages
            if (error.message.includes("Facebook") || error.message.includes("avatar")) {
                await message.reply("❌ Failed to get user profile pictures. This might be a temporary issue with Facebook.");
            } else if (error.message.includes("template")) {
                await message.reply("❌ The image template is missing. Please contact bot admin.");
            } else if (error.message.includes("generation failed")) {
                await message.reply("❌ Failed to create image. Please try again later.");
            } else {
                await message.reply("❌ An unexpected error occurred. Please try again.");
            }
        } finally {
            // Cleanup generated image
            if (generatedImagePath) {
                try {
                    if (await fs.pathExists(generatedImagePath)) {
                        await fs.unlink(generatedImagePath);
                        console.log("🧹 Cleaned up generated image");
                    }
                } catch (cleanupError) {
                    console.warn("⚠️ Could not cleanup image:", cleanupError.message);
                }
            }
        }
    },

    makeImage: async function({ one, two }) {
        const cacheDir = path.join(__dirname, 'cache', 'fingering2');
        const outputPath = path.join(cacheDir, `result_${one}_${two}_${Date.now()}.png`);
        const avatarOnePath = path.join(cacheDir, `avatar_${one}_${Date.now()}.png`);
        const avatarTwoPath = path.join(cacheDir, `avatar_${two}_${Date.now()}.png`);
        
        let avatarOne = null;
        let avatarTwo = null;

        try {
            // Ensure cache directory exists
            await fs.ensureDir(cacheDir);

            // Check template
            const templatePath = path.join(__dirname, 'assets', 'fingeringv2.png');
            const templateExists = await fs.pathExists(templatePath);
            
            if (!templateExists) {
                console.error("❌ Template not found at:", templatePath);
                throw new Error("Template file missing");
            }

            console.log("📖 Loading template...");
            const template = await jimp.read(templatePath);

            // Facebook access token (valid as per user requirement)
            const fbToken = `6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            // Download avatar function
            const downloadAvatar = async (userId, savePath) => {
                try {
                    console.log(`📥 Downloading avatar for ${userId}...`);
                    
                    const response = await axios({
                        method: 'GET',
                        url: `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=${fbToken}`,
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        validateStatus: status => status === 200
                    });

                    if (!response.data || response.data.length === 0) {
                        throw new Error("Empty avatar data received");
                    }

                    await fs.writeFile(savePath, response.data);
                    
                    // Verify the downloaded file
                    const stats = await fs.stat(savePath);
                    if (stats.size === 0) {
                        throw new Error("Downloaded avatar is empty");
                    }

                    const image = await jimp.read(savePath);
                    console.log(`✅ Avatar downloaded for ${userId}`);
                    return image;
                    
                } catch (error) {
                    console.error(`❌ Failed to download avatar for ${userId}:`, error.message);
                    throw new Error(`Avatar download failed for ${userId}`);
                }
            };

            // Download both avatars
            console.log("🔄 Downloading avatars...");
            avatarOne = await downloadAvatar(one, avatarOnePath);
            avatarTwo = await downloadAvatar(two, avatarTwoPath);

            // Process avatars
            console.log("⭕ Processing avatars...");
            
            // Create circular masks
            avatarOne.circle();
            avatarTwo.circle();

            // Resize avatars
            const avatarSize = 100;
            avatarOne.resize(avatarSize, avatarSize);
            avatarTwo.resize(avatarSize, avatarSize);

            // Position avatars on template
            // Female position (left)
            const femaleX = 145;
            const femaleY = 125;
            
            // Male position (right)  
            const maleX = 350;
            const maleY = 105;

            console.log("🎨 Compositing image...");
            
            // Composite avatars onto template
            template.composite(avatarTwo, femaleX, femaleY); // Female avatar
            template.composite(avatarOne, maleX, maleY);     // Male avatar

            // Save final image
            console.log("💾 Saving final image...");
            await template.writeAsync(outputPath);

            // Verify output
            const outputExists = await fs.pathExists(outputPath);
            if (!outputExists) {
                throw new Error("Output file was not created");
            }

            const outputStats = await fs.stat(outputPath);
            if (outputStats.size === 0) {
                throw new Error("Output file is empty");
            }

            console.log("✅ Image created successfully:", outputPath);
            return outputPath;

        } catch (error) {
            console.error("💥 makeImage error:", error);
            
            // Cleanup partial output file if it exists
            if (await fs.pathExists(outputPath)) {
                try {
                    await fs.unlink(outputPath);
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
            
            return null;
        } finally {
            // Cleanup temporary avatar files
            const cleanupFiles = [avatarOnePath, avatarTwoPath];
            
            for (const filePath of cleanupFiles) {
                try {
                    if (await fs.pathExists(filePath)) {
                        await fs.unlink(filePath);
                    }
                } catch (cleanupError) {
                    console.warn(`⚠️ Could not cleanup ${filePath}:`, cleanupError.message);
                }
            }
            console.log("🧹 Temporary files cleaned up");
        }
    }
};
