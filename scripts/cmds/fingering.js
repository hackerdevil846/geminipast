const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "fingering",
        aliases: [],
        version: "2.2.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "nsfw",
        shortDescription: {
            en: "🔞 Create intimate image with tagged person"
        },
        longDescription: {
            en: "Generates an intimate image showing a moment between two users by placing their avatars on a template"
        },
        guide: {
            en: "{p}fingering @mention"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        const cacheDir = path.join(__dirname, 'cache');
        const canvasDir = path.join(cacheDir, 'canvas');
        const templatePath = path.join(canvasDir, 'fingering.png');

        try {
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ Created cache directory");
            }
            
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created canvas directory");
            }
            
            if (!fs.existsSync(templatePath)) {
                console.warn("⚠️ Template 'fingering.png' not found in canvas folder!");
                console.log("📁 Expected path:", templatePath);
                console.log("💡 Please make sure the template image is placed at:", templatePath);
            } else {
                console.log("✅ Template found:", templatePath);
            }
        } catch (error) {
            console.error("❌ OnLoad error:", error);
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        let generatedImagePath = null;
        
        try {
            const { senderID, mentions } = event;
            const mentionedUsers = Object.keys(mentions);

            if (mentionedUsers.length === 0) {
                return message.reply("💌 Please tag someone! Example: /fingering @username");
            }

            if (mentionedUsers[0] === senderID) {
                return message.reply("Please tag someone else, not yourself!");
            }

            const userOne = senderID;
            const userTwo = mentionedUsers[0];

            const processingMessage = await message.reply("⏳ Creating your image, please wait...");

            generatedImagePath = await this.makeImage({ one: userOne, two: userTwo });
            
            if (generatedImagePath && fs.existsSync(generatedImagePath)) {
                try {
                    await message.unsend(processingMessage.messageID);
                } catch (e) {
                    console.warn("⚠️ Failed to unsend processing message");
                }

                const mentionedName = mentions[userTwo].replace("@", "");
                
                await message.reply({
                    body: `💞 Special moment for you and @${mentionedName}!`,
                    mentions: [{ tag: `@${mentionedName}`, id: userTwo }],
                    attachment: fs.createReadStream(generatedImagePath)
                });
                
                console.log("✅ Successfully sent image");
            } else {
                await message.reply("❌ Failed to create image. Please make sure the template image 'fingering.png' is placed in scripts/cmds/cache/canvas/ folder.");
            }
            
        } catch (error) {
            console.error("💥 Command Error:", error);
            await message.reply("❌ An error occurred. Please try again later.");
        } finally {
            if (generatedImagePath && fs.existsSync(generatedImagePath)) {
                try {
                    setTimeout(() => {
                        fs.unlinkSync(generatedImagePath);
                        console.log("🧹 Cleaned up generated image");
                    }, 5000);
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up:", cleanupError.message);
                }
            }
        }
    },

    makeImage: async function({ one, two }) {
        const cacheDir = path.resolve(__dirname, "cache");
        const canvasDir = path.join(cacheDir, "canvas");
        const outputPath = path.join(cacheDir, `fingering_${one}_${two}_${Date.now()}.png`);
        const avatarOnePath = path.join(cacheDir, `avt1_${one}_${Date.now()}.png`);
        const avatarTwoPath = path.join(cacheDir, `avt2_${two}_${Date.now()}.png`);

        try {
            // Check template in canvas directory first
            const templatePath = path.join(canvasDir, "fingering.png");
            
            if (!fs.existsSync(templatePath)) {
                console.error("❌ Template not found at:", templatePath);
                return null;
            }

            console.log("📖 Reading template image from:", templatePath);
            const template = await jimp.read(templatePath);

            // Download first avatar with better error handling
            console.log(`📥 Downloading avatar for user ${one}...`);
            let avatarOne;
            try {
                const avatarOneResponse = await axios.get(
                    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 10000
                    }
                );
                if (avatarOneResponse.data) {
                    fs.writeFileSync(avatarOnePath, avatarOneResponse.data);
                    avatarOne = await jimp.read(avatarOnePath);
                    console.log("✅ Downloaded first avatar");
                } else {
                    throw new Error("Empty avatar data");
                }
            } catch (error) {
                console.error(`❌ Failed to download avatar for ${one}:`, error.message);
                return null;
            }

            // Download second avatar
            console.log(`📥 Downloading avatar for user ${two}...`);
            let avatarTwo;
            try {
                const avatarTwoResponse = await axios.get(
                    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 10000
                    }
                );
                if (avatarTwoResponse.data) {
                    fs.writeFileSync(avatarTwoPath, avatarTwoResponse.data);
                    avatarTwo = await jimp.read(avatarTwoPath);
                    console.log("✅ Downloaded second avatar");
                } else {
                    throw new Error("Empty avatar data");
                }
            } catch (error) {
                console.error(`❌ Failed to download avatar for ${two}:`, error.message);
                return null;
            }

            // Create circular avatars
            console.log("⭕ Creating circular avatars...");
            avatarOne.circle();
            avatarTwo.circle();

            // Resize avatars
            const avatarSize1 = 120;
            const avatarSize2 = 120;

            avatarOne.resize(avatarSize1, avatarSize1);
            avatarTwo.resize(avatarSize2, avatarSize2);

            // Position avatars on template
            const position1 = { x: 350, y: 95 };   // Right position
            const position2 = { x: 70, y: 105 };   // Left position

            console.log("🎨 Compositing avatars on template...");
            template.composite(avatarOne, position1.x, position1.y);
            template.composite(avatarTwo, position2.x, position2.y);

            // Save final image
            console.log("💾 Saving final image...");
            await template.writeAsync(outputPath);

            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                if (stats.size > 0) {
                    console.log(`✅ Successfully created image: ${outputPath}`);
                    return outputPath;
                } else {
                    console.error("❌ Created image file is empty");
                    return null;
                }
            } else {
                console.error("❌ Failed to create output image");
                return null;
            }

        } catch (error) {
            console.error("💥 makeImage Error:", error);
            return null;
        } finally {
            // Cleanup temporary avatar files with delay
            setTimeout(() => {
                try {
                    if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
                    if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);
                    console.log("🧹 Cleaned up temporary avatar files");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up temp files:", cleanupError.message);
                }
            }, 3000);
        }
    }
};
