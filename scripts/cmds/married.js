const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "married",
        aliases: [],
        version: "3.1.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "edit-image",
        shortDescription: {
            en: "💍 Create marriage images"
        },
        longDescription: {
            en: "Create a marriage announcement image with mentioned user"
        },
        guide: {
            en: "{p}married [@mention]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: function() {
        try {
            const canvasDir = path.join(__dirname, "cache", "canvas");
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created canvas directory:", canvasDir);
            }
        } catch (error) {
            console.error("❌ Error creating canvas directory:", error);
        }
    },

    onStart: async function({ message, event }) {
        let tempFiles = [];
        
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
                return message.reply("💍 Please mention someone to marry! Example: /married @username");
            }

            const userOne = senderID;
            const userTwo = mentionedUsers[0];

            // Validate user IDs
            if (!userOne || !userTwo) {
                return message.reply("❌ Invalid user IDs detected.");
            }

            const canvasDir = path.join(__dirname, "cache", "canvas");
            const bgPath = path.join(canvasDir, "married.png");

            // Check if background image exists
            if (!fs.existsSync(bgPath)) {
                console.error("❌ Background image not found at:", bgPath);
                return message.reply("❌ Background image not found. Please ensure 'married.png' exists in the cache/canvas folder.");
            }

            // Create unique file paths
            const timestamp = Date.now();
            const outputPath = path.join(canvasDir, `married_${userOne}_${userTwo}_${timestamp}.png`);
            const avatarOnePath = path.join(canvasDir, `avt1_${userOne}_${timestamp}.png`);
            const avatarTwoPath = path.join(canvasDir, `avt2_${userTwo}_${timestamp}.png`);
            
            tempFiles.push(outputPath, avatarOnePath, avatarTwoPath);

            console.log("📥 Downloading avatars...");
            
            // Download avatars with error handling
            let avatar1Buffer, avatar2Buffer;
            
            try {
                const avatar1Response = await axios.get(
                    `https://graph.facebook.com/${userOne}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: "arraybuffer",
                        timeout: 15000
                    }
                );
                avatar1Buffer = Buffer.from(avatar1Response.data);
                fs.writeFileSync(avatarOnePath, avatar1Buffer);
                console.log("✅ Downloaded first avatar");
            } catch (error) {
                console.error("❌ Failed to download first avatar:", error.message);
                return message.reply("❌ Failed to download your avatar. Please try again.");
            }

            try {
                const avatar2Response = await axios.get(
                    `https://graph.facebook.com/${userTwo}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: "arraybuffer",
                        timeout: 15000
                    }
                );
                avatar2Buffer = Buffer.from(avatar2Response.data);
                fs.writeFileSync(avatarTwoPath, avatar2Buffer);
                console.log("✅ Downloaded second avatar");
            } catch (error) {
                console.error("❌ Failed to download second avatar:", error.message);
                return message.reply("❌ Failed to download mentioned user's avatar. Please try again.");
            }

            // Process images
            console.log("🎨 Processing images...");
            
            let bg, circleOne, circleTwo;
            
            try {
                // Load background image
                bg = await jimp.read(bgPath);
                console.log("✅ Loaded background image");

                // Create circular avatars
                const avatar1 = await jimp.read(avatarOnePath);
                avatar1.circle();
                circleOne = avatar1;
                
                const avatar2 = await jimp.read(avatarTwoPath);
                avatar2.circle();
                circleTwo = avatar2;
                
                console.log("✅ Created circular avatars");
            } catch (error) {
                console.error("❌ Error processing images:", error);
                return message.reply("❌ Error processing images. Please try again.");
            }

            // Define avatar size and positions
            const avatarSize = 70;
            
            // Coordinates for avatar placement
            const groomX = 700; 
            const groomY = 16;   
            const brideX = 278;  
            const brideY = 28;   

            console.log("🖼️ Compositing images...");
            
            try {
                // Composite avatars onto background
                bg.composite(circleOne.resize(avatarSize, avatarSize), groomX, groomY)
                  .composite(circleTwo.resize(avatarSize, avatarSize), brideX, brideY);

                // Save final image
                await bg.writeAsync(outputPath);
                console.log("✅ Saved final image:", outputPath);

                // Verify the image was created
                if (!fs.existsSync(outputPath)) {
                    throw new Error("Final image was not created");
                }

                const stats = fs.statSync(outputPath);
                if (stats.size === 0) {
                    throw new Error("Final image is empty");
                }

            } catch (error) {
                console.error("❌ Error compositing images:", error);
                return message.reply("❌ Error creating final image. Please try again.");
            }

            // Send the final image
            await message.reply({
                body: `💖 Congratulations for your marriage! 💑\n━━━━━━━━━━━━━━━━\n💐 Powered by: Asif Mahmud`,
                attachment: fs.createReadStream(outputPath)
            });

            console.log("✅ Successfully sent marriage image");

        } catch (error) {
            console.error("💥 Married Command Error:", error);
            await message.reply("❌ An unexpected error occurred. Please try again later.");
        } finally {
            // Cleanup temporary files
            console.log("🧹 Cleaning up temporary files...");
            tempFiles.forEach(filePath => {
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log("✅ Cleaned:", filePath);
                    }
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean:", filePath, cleanupError.message);
                }
            });
        }
    }
};
