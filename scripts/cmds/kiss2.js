const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "kiss2",
        aliases: [],
        version: "2.1.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "love",
        shortDescription: {
            en: "💖 Sweetest Kiss! Express your love with a beautiful kiss image 💌"
        },
        longDescription: {
            en: "Creates a beautiful kiss image with your tagged loved one and heartwarming romantic messages"
        },
        guide: {
            en: "{p}kiss2 @mention"
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
            const templatePath = path.join(cacheDir, 'hon.png');

            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ Created cache directory for kiss2");
            }
            
            if (!fs.existsSync(templatePath)) {
                console.warn("⚠️ Please put 'hon.png' in the cache folder for kiss2!");
                console.log("📁 Template path:", templatePath);
            } else {
                console.log("✅ Kiss2 template found:", templatePath);
            }
        } catch (error) {
            console.error("❌ OnLoad error for kiss2:", error);
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
                return message.reply("💌 Who do you want to kiss? Please tag someone! Example: /kiss2 @username");
            }

            const userOne = senderID;
            const userTwo = mentionedUsers[0];
            const tagName = mentions[userTwo].replace("@", "");

            // Array of beautiful romantic messages
            const romanticMessages = [
                `💖 My love for ${tagName} grows with every kiss... 💋`,
                `💫 In your arms, ${tagName}, I've found my forever... ✨`,
                `🌹 This kiss for ${tagName} holds all my love and dreams... 💕`,
                `💌 Every kiss with ${tagName} feels like the first time... 💝`,
                `✨ ${tagName}, your lips taste like sweet forever... 💋`,
                `💖 With this kiss, ${tagName}, I give you my heart... 🫀`,
                `🌟 ${tagName}, you're the stars in my midnight sky... ✨`,
                `💕 This kiss carries all the love I feel for ${tagName}... 💫`,
                `🌙 ${tagName}, your love is my favorite fairytale... 📖`,
                `💋 Every moment with ${tagName} is pure magic... ✨`
            ];

            // Select a random romantic message
            const randomRomanticMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];

            // Generate the kiss image
            generatedImagePath = await this.makeImage({ one: userOne, two: userTwo });
            
            if (generatedImagePath && fs.existsSync(generatedImagePath)) {
                await message.reply({
                    body: randomRomanticMessage,
                    mentions: [
                        {
                            tag: `@${tagName}`,
                            id: userTwo
                        }
                    ],
                    attachment: fs.createReadStream(generatedImagePath)
                });
                
                console.log("✅ Successfully sent kiss2 image with romantic message");
            } else {
                await message.reply("❌ Failed to create kiss image. Please make sure 'hon.png' template exists in cache folder.");
            }
            
        } catch (error) {
            console.error("💥 Kiss2 Command Error:", error);
            await message.reply("❌ An error occurred while processing your request. Please try again later.");
        } finally {
            // Cleanup generated image
            if (generatedImagePath && fs.existsSync(generatedImagePath)) {
                try {
                    fs.unlinkSync(generatedImagePath);
                    console.log("🧹 Cleaned up generated image for kiss2");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up kiss2 generated image:", cleanupError.message);
                }
            }
        }
    },

    makeImage: async function({ one, two }) {
        const cacheDir = path.resolve(__dirname, "cache");
        const outputPath = path.join(cacheDir, `kiss2_${one}_${two}_${Date.now()}.png`);
        const avatarOnePath = path.join(cacheDir, `avt1_${one}_${Date.now()}.png`);
        const avatarTwoPath = path.join(cacheDir, `avt2_${two}_${Date.now()}.png`);

        try {
            // Check if template exists
            const templatePath = path.join(cacheDir, "hon.png");
            if (!fs.existsSync(templatePath)) {
                console.error("❌ Template image 'hon.png' not found:", templatePath);
                return null;
            }

            console.log("📖 Reading template image 'hon.png'...");
            const template = await jimp.read(templatePath);

            // Download and process first avatar (sender)
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
                fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneResponse.data));
                avatarOne = await jimp.read(avatarOnePath);
                console.log("✅ Downloaded first avatar");
            } catch (error) {
                console.error(`❌ Failed to download avatar for ${one}:`, error.message);
                return null;
            }

            // Download and process second avatar (mentioned)
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
                fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoResponse.data));
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

            // Avatar sizes and positions for hon.png template
            const avatarSize1 = 135;
            const avatarSize2 = 135;
            
            // Positions adjusted for hon.png template
            const position1 = { x: 405, y: 15 };   // Right side position
            const position2 = { x: 135, y: 135 };  // Left side position

            // Resize avatars
            avatarOne.resize(avatarSize1, avatarSize1);
            avatarTwo.resize(avatarSize2, avatarSize2);

            console.log("🎨 Compositing avatars on template...");
            template.composite(avatarOne, position1.x, position1.y);
            template.composite(avatarTwo, position2.x, position2.y);

            // Save final image
            console.log("💾 Saving final image...");
            await template.writeAsync(outputPath);

            // Verify the image was created successfully
            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                if (stats.size > 1000) { // Check if file has reasonable size
                    console.log(`✅ Successfully created kiss2 image: ${outputPath} (${(stats.size / 1024).toFixed(2)} KB)`);
                    return outputPath;
                } else {
                    console.error("❌ Created image file is too small or corrupted");
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
