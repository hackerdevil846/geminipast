const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "marriedv5",
        aliases: [],
        version: "3.1.2",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "Create marriage image with mentioned user"
        },
        longDescription: {
            en: "Creates a marriage certificate image with the mentioned user"
        },
        guide: {
            en: "{p}marriedv5 [@mention]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            const dirMaterial = path.join(__dirname, 'cache', 'canvas');
            const pathFile = path.join(dirMaterial, 'marriedv5.png');
            
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
                console.log("✅ Created canvas directory");
            }
            
            if (!fs.existsSync(pathFile)) {
                console.log("📥 Downloading background image...");
                const response = await axios.get("https://i.ibb.co/mhxtgwm/49be174dafdc259030f70b1c57fa1c13.jpg", {
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                await fs.writeFile(pathFile, Buffer.from(response.data, 'binary'));
                console.log("✅ Downloaded marriedv5.png background image");
            } else {
                console.log("✅ Background image already exists");
            }
        } catch (error) {
            console.error("❌ Failed to download base image:", error.message);
        }
    },

    onStart: async function({ message, event, api }) {
        let finalImagePath = null;
        let avatarOnePath = null;
        let avatarTwoPath = null;

        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("jimp");
            } catch (e) {
                return message.reply("❌ Missing dependencies. Please install: axios, fs-extra, path, and jimp.");
            }

            const { senderID, mentions } = event;
            const mentionedUsers = Object.keys(mentions);
            
            if (mentionedUsers.length === 0) {
                return message.reply("💍 Please mention someone to marry! Example: /marriedv5 @username");
            }

            const userOne = senderID;
            const userTwo = mentionedUsers[0];
            
            const canvasDir = path.join(__dirname, "cache", "canvas");
            const templatePath = path.join(canvasDir, "marriedv5.png");

            // Check if template exists
            if (!fs.existsSync(templatePath)) {
                return message.reply("❌ Marriage template is missing. Please try again later.");
            }

            console.log("📖 Reading template image...");
            const template = await jimp.read(templatePath);
            
            // Generate unique file paths
            const timestamp = Date.now();
            finalImagePath = path.join(canvasDir, `married_${userOne}_${userTwo}_${timestamp}.png`);
            avatarOnePath = path.join(canvasDir, `avt1_${userOne}_${timestamp}.png`);
            avatarTwoPath = path.join(canvasDir, `avt2_${userTwo}_${timestamp}.png`);

            // Helper function to download avatar with retry
            const downloadAvatar = async (userId, outputPath) => {
                const url = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                
                try {
                    const response = await axios.get(url, { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    });
                    await fs.writeFile(outputPath, Buffer.from(response.data, 'binary'));
                    console.log(`✅ Downloaded avatar for user ${userId}`);
                    return true;
                } catch (error) {
                    console.error(`❌ Failed to download avatar for ${userId}:`, error.message);
                    return false;
                }
            };

            // Helper function to create circular image
            const createCircularImage = async (imagePath) => {
                try {
                    const image = await jimp.read(imagePath);
                    image.circle();
                    return await image.getBufferAsync(jimp.MIME_PNG);
                } catch (error) {
                    console.error("❌ Error creating circular image:", error.message);
                    throw error;
                }
            };

            // Download both avatars
            console.log("📥 Downloading avatars...");
            const avatar1Success = await downloadAvatar(userOne, avatarOnePath);
            const avatar2Success = await downloadAvatar(userTwo, avatarTwoPath);

            if (!avatar1Success || !avatar2Success) {
                return message.reply("❌ Failed to download user avatars. Please try again.");
            }

            // Create circular avatars
            console.log("⭕ Creating circular avatars...");
            const circleOneBuffer = await createCircularImage(avatarOnePath);
            const circleTwoBuffer = await createCircularImage(avatarTwoPath);

            const circleOne = await jimp.read(circleOneBuffer);
            const circleTwo = await jimp.read(circleTwoBuffer);

            // Resize avatars to fit the template
            const avatarSize = 100;
            circleOne.resize(avatarSize, avatarSize);
            circleTwo.resize(avatarSize, avatarSize);

            // Position avatars on template (exact positions from your code)
            console.log("🎨 Compositing avatars on template...");
            template.composite(circleOne, 400, 70);  // Male character - right side
            template.composite(circleTwo, 175, 100); // Female character - left side

            // Save final image
            console.log("💾 Saving final image...");
            const finalBuffer = await template.getBufferAsync(jimp.MIME_PNG);
            await fs.writeFile(finalImagePath, finalBuffer);

            // Verify the image was created
            if (!fs.existsSync(finalImagePath)) {
                throw new Error("Final image was not created");
            }

            // Get user names for message
            let userName1 = "Unknown User";
            let userName2 = "Unknown User";
            
            try {
                const userInfo = await api.getUserInfo([userOne, userTwo]);
                userName1 = userInfo[userOne]?.name || "Unknown User";
                userName2 = userInfo[userTwo]?.name || "Unknown User";
            } catch (nameError) {
                console.warn("⚠️ Could not fetch user names:", nameError.message);
            }

            // Create message
            let messageBody;
            if (userOne === userTwo) {
                messageBody = `🤔 ${userName1}, are you marrying yourself? 💍`;
            } else {
                messageBody = `💒 Congratulations! ${userName1} and ${userName2} are now married! 💖\n━━━━━━━━━━━━━━━\n💕 Powered by Asif Mahmud`;
            }

            // Send the result
            await message.reply({
                body: messageBody,
                attachment: fs.createReadStream(finalImagePath)
            });

            console.log("✅ Successfully sent marriage image");

        } catch (error) {
            console.error("💥 Married v5 Error:", error);
            await message.reply("❌ An error occurred while creating the marriage image. Please try again.");
        } finally {
            // Cleanup temporary files
            const filesToClean = [avatarOnePath, avatarTwoPath, finalImagePath];
            for (const filePath of filesToClean) {
                if (filePath && fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                        console.log(`🧹 Cleaned up: ${path.basename(filePath)}`);
                    } catch (cleanError) {
                        console.warn(`⚠️ Failed to clean up ${filePath}:`, cleanError.message);
                    }
                }
            }
        }
    }
};
