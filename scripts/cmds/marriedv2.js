const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "marriedv2",
        aliases: [],
        version: "3.2.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "💍 Create marriage image"
        },
        longDescription: {
            en: "Create a marriage certificate with another user with proper avatar positioning"
        },
        guide: {
            en: "{p}marriedv2 [@mention]"
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
            const cacheDir = path.join(__dirname, "cache", "canvas");
            const templatePath = path.join(cacheDir, "marriedv02.png");

            // Create cache directory if it doesn't exist
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ Created cache directory");
            }

            // Download template if it doesn't exist
            if (!fs.existsSync(templatePath)) {
                console.log("📥 Downloading marriage template...");
                try {
                    const response = await axios.get("https://i.ibb.co/mc9KNm1/1619885987-21-pibig-info-p-anime-romantika-svadba-anime-krasivo-24.jpg", {
                        responseType: "arraybuffer",
                        timeout: 30000
                    });
                    
                    fs.writeFileSync(templatePath, Buffer.from(response.data));
                    console.log("✅ Template downloaded successfully");
                } catch (downloadError) {
                    console.error("❌ Failed to download template:", downloadError.message);
                }
            } else {
                console.log("✅ Template already exists");
            }
        } catch (error) {
            console.error("💥 OnLoad Error:", error);
        }
    },

    onStart: async function({ message, event }) {
        let tempFiles = [];
        
        try {
            // Check dependencies
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
                return message.reply("💍 Please mention another user to marry!\nExample: /marriedv2 @username");
            }

            const userID1 = senderID;
            const userID2 = mentionedUsers[0];

            // Check if user is trying to marry themselves
            if (userID1 === userID2) {
                return message.reply("❌ You cannot marry yourself! Please mention another user.");
            }

            const cacheDir = path.join(__dirname, "cache", "canvas");
            const templatePath = path.join(cacheDir, "marriedv02.png");

            // Verify template exists
            if (!fs.existsSync(templatePath)) {
                return message.reply("❌ Marriage template not found. Please try again after the bot restarts.");
            }

            // Create circular avatar function
            async function createCircularAvatar(imageBuffer) {
                try {
                    const image = await jimp.read(imageBuffer);
                    image.circle();
                    return await image.getBufferAsync("image/png");
                } catch (error) {
                    console.error("❌ Error creating circular avatar:", error);
                    throw error;
                }
            }

            // Create unique file paths
            const avatar1Path = path.join(cacheDir, `avt1_${userID1}_${Date.now()}.png`);
            const avatar2Path = path.join(cacheDir, `avt2_${userID2}_${Date.now()}.png`);
            const outputPath = path.join(cacheDir, `married_${userID1}_${userID2}_${Date.now()}.png`);
            
            tempFiles.push(avatar1Path, avatar2Path, outputPath);

            console.log("📥 Downloading user avatars...");

            // Download avatars with better error handling
            let avatar1Buffer, avatar2Buffer;
            try {
                const [avatar1Response, avatar2Response] = await Promise.all([
                    axios.get(`https://graph.facebook.com/${userID1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                        responseType: "arraybuffer",
                        timeout: 15000
                    }),
                    axios.get(`https://graph.facebook.com/${userID2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                        responseType: "arraybuffer",
                        timeout: 15000
                    })
                ]);

                avatar1Buffer = Buffer.from(avatar1Response.data, "binary");
                avatar2Buffer = Buffer.from(avatar2Response.data, "binary");
                
                console.log("✅ Avatars downloaded successfully");

            } catch (avatarError) {
                console.error("❌ Error downloading avatars:", avatarError.message);
                return message.reply("❌ Could not fetch user avatars. Please make sure both users exist and try again.");
            }

            // Process avatars and create circular images
            console.log("⭕ Creating circular avatars...");
            let circularAvatar1, circularAvatar2;
            try {
                circularAvatar1 = await jimp.read(await createCircularAvatar(avatar1Buffer));
                circularAvatar2 = await jimp.read(await createCircularAvatar(avatar2Buffer));
                console.log("✅ Circular avatars created");
            } catch (circleError) {
                console.error("❌ Error processing avatars:", circleError);
                return message.reply("❌ Error processing user avatars. Please try again.");
            }

            // Load template and composite avatars
            console.log("🎨 Creating marriage certificate...");
            try {
                const template = await jimp.read(templatePath);

                // Resize avatars to fit the template
                const avatarSize = 90;
                circularAvatar1.resize(avatarSize, avatarSize);
                circularAvatar2.resize(avatarSize, avatarSize);

                // Position avatars on template (exact positions from your code)
                const position1 = { x: 60, y: 53 };  // Left avatar position
                const position2 = { x: 195, y: 45 }; // Right avatar position

                // Composite avatars onto template
                template.composite(circularAvatar1, position1.x, position1.y);
                template.composite(circularAvatar2, position2.x, position2.y);

                // Save final image
                await template.writeAsync(outputPath);
                console.log("✅ Marriage certificate created successfully");

                // Verify the image was created
                if (!fs.existsSync(outputPath)) {
                    throw new Error("Output image was not created");
                }

                const stats = fs.statSync(outputPath);
                if (stats.size === 0) {
                    throw new Error("Output image is empty");
                }

            } catch (compositeError) {
                console.error("❌ Error creating final image:", compositeError);
                return message.reply("❌ Error creating marriage certificate. Please try again.");
            }

            // Send the final image
            await message.reply({
                body: "💕 Congratulations! Marriage certificate created!\n━━━━━━━━━━━━━━\nPowered by Asif Mahmud",
                attachment: fs.createReadStream(outputPath)
            });

            console.log("✅ Marriage certificate sent successfully");

        } catch (error) {
            console.error("💥 MarriedV2 Error:", error);
            await message.reply("❌ An unexpected error occurred. Please try again later.");
        } finally {
            // Cleanup temporary files
            console.log("🧹 Cleaning up temporary files...");
            for (const filePath of tempFiles) {
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`✅ Cleaned: ${path.basename(filePath)}`);
                    }
                } catch (cleanupError) {
                    console.warn(`⚠️ Could not clean ${filePath}:`, cleanupError.message);
                }
            }
        }
    }
};
