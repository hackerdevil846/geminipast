const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "kiss",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "love",
        shortDescription: {
            en: "💖 Romantic Kiss Moment! Kiss someone by tagging them 💌"
        },
        longDescription: {
            en: "Creates a romantic kiss image with tagged person"
        },
        guide: {
            en: "{p}kiss @mention"
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
            const cacheDir = path.join(__dirname, 'cache');
            const templatePath = path.join(cacheDir, 'hon0.jpeg');

            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ Created cache directory");
            }
            
            if (!fs.existsSync(templatePath)) {
                console.warn("⚠️ Please put 'hon0.jpeg' in the cache folder!");
                console.log("📁 Template path:", templatePath);
            } else {
                console.log("✅ Kiss template found:", templatePath);
            }
        } catch (error) {
            console.error("❌ OnLoad error:", error);
        }
    },

    onStart: async function({ message, event, args }) {
        let generatedImagePath = null;
        
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
                return message.reply("💌 Please tag someone to kiss! Example: /kiss @username");
            }

            const userOne = senderID;
            const userTwo = mentionedUsers[0];

            // Generate random romance percentage and bonus
            const romancePercent = Math.floor(Math.random() * 101);
            const bonusAmount = romancePercent * 1000;

            // Generate the kiss image
            generatedImagePath = await this.makeImage({ one: userOne, two: userTwo });
            
            if (generatedImagePath && fs.existsSync(generatedImagePath)) {
                await message.reply({
                    body: `💖 Romance Level: ${romancePercent}%\n💝 Bonus Blessing: ${bonusAmount} coins\n✨ May your bond grow stronger!`,
                    attachment: fs.createReadStream(generatedImagePath)
                });
                
                console.log("✅ Successfully sent kiss image");
            } else {
                await message.reply("❌ Failed to create kiss image. Please make sure the template 'hon0.jpeg' exists in cache folder.");
            }
            
        } catch (error) {
            console.error("💥 Kiss Command Error:", error);
            await message.reply("❌ An error occurred while processing your request. Please try again later.");
        } finally {
            // Cleanup generated image
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

    makeImage: async function({ one, two }) {
        const cacheDir = path.resolve(__dirname, "cache");
        const outputPath = path.join(cacheDir, `kiss_${one}_${two}_${Date.now()}.png`);
        const avatarOnePath = path.join(cacheDir, `avt1_${one}_${Date.now()}.png`);
        const avatarTwoPath = path.join(cacheDir, `avt2_${two}_${Date.now()}.png`);

        try {
            // Check if template exists
            const templatePath = path.join(cacheDir, "hon0.jpeg");
            if (!fs.existsSync(templatePath)) {
                console.error("❌ Template image not found:", templatePath);
                return null;
            }

            console.log("📖 Reading template image...");
            const template = await jimp.read(templatePath);

            // Download and process first avatar
            console.log(`📥 Downloading avatar for user ${one}...`);
            let avatarOne;
            try {
                const avatarOneResponse = await axios.get(
                    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    }
                );
                fs.writeFileSync(avatarOnePath, avatarOneResponse.data);
                avatarOne = await jimp.read(avatarOnePath);
                console.log("✅ Downloaded first avatar");
            } catch (error) {
                console.error(`❌ Failed to download avatar for ${one}:`, error.message);
                return null;
            }

            // Download and process second avatar
            console.log(`📥 Downloading avatar for user ${two}...`);
            let avatarTwo;
            try {
                const avatarTwoResponse = await axios.get(
                    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    }
                );
                fs.writeFileSync(avatarTwoPath, avatarTwoResponse.data);
                avatarTwo = await jimp.read(avatarTwoPath);
                console.log("✅ Downloaded second avatar");
            } catch (error) {
                console.error(`❌ Failed to download avatar for ${two}:`, error.message);
                return null;
            }

            // Create circular avatars
            console.log("⭕ Creating circular avatars...");
            avatarOne.circle();
            avatarTwo.circle();

            // Resize avatars to fit the template
            const avatarSize1 = 130; // Size for first avatar
            const avatarSize2 = 120; // Size for second avatar

            avatarOne.resize(avatarSize1, avatarSize1);
            avatarTwo.resize(avatarSize2, avatarSize2);

            // Position avatars on template
            // These positions need to be adjusted based on your template
            const position1 = { x: 405, y: 25 };  // Right side position
            const position2 = { x: 125, y: 135 }; // Left side position

            console.log("🎨 Compositing avatars on template...");
            template.composite(avatarOne, position1.x, position1.y);
            template.composite(avatarTwo, position2.x, position2.y);

            // Save final image
            console.log("💾 Saving final image...");
            await template.writeAsync(outputPath);

            // Verify the image was created
            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                if (stats.size > 0) {
                    console.log(`✅ Successfully created kiss image: ${outputPath}`);
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
            // Cleanup temporary avatar files
            try {
                if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
                if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);
                console.log("🧹 Cleaned up temporary avatar files");
            } catch (cleanupError) {
                console.warn("⚠️ Failed to clean up temp files:", cleanupError.message);
            }
        }
    }
};
