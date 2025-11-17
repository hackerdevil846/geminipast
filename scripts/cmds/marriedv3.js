const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "marriedv3",
        aliases: [],
        version: "3.1.2",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "Create marriage announcement image"
        },
        longDescription: {
            en: "Create beautiful marriage announcement images with avatars"
        },
        guide: {
            en: "{p}marriedv3 @mention"
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
                console.log("✅ Created canvas directory");
            }
        } catch (error) {
            console.error("❌ Marriedv3 onLoad Error:", error);
        }
    },

    onStart: async function({ message, event }) {
        let finalImagePath = null;
        let tempAvatar1 = null;
        let tempAvatar2 = null;
        
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
                return message.reply("⚠️ Please tag someone to create marriage image! Example: /marriedv3 @username");
            }

            const userOne = senderID;
            const userTwo = mentionedUsers[0];

            // Create the marriage image
            finalImagePath = await this.makeMarriageImage({ one: userOne, two: userTwo });
            
            if (finalImagePath && fs.existsSync(finalImagePath)) {
                await message.reply({
                    body: "💍 Marriage announcement image is ready! 💖\n\nCongratulations on your union! 🎉",
                    attachment: fs.createReadStream(finalImagePath)
                });
                console.log("✅ Successfully sent marriage image");
            } else {
                await message.reply("❌ Failed to create marriage image. Please try again later.");
            }
            
        } catch (error) {
            console.error("💥 Marriedv3 Error:", error);
            await message.reply("❌ An error occurred while creating the image. Please try again.");
        } finally {
            // Cleanup temporary files
            try {
                if (finalImagePath && fs.existsSync(finalImagePath)) {
                    fs.unlinkSync(finalImagePath);
                    console.log("🧹 Cleaned up final image");
                }
                if (tempAvatar1 && fs.existsSync(tempAvatar1)) {
                    fs.unlinkSync(tempAvatar1);
                }
                if (tempAvatar2 && fs.existsSync(tempAvatar2)) {
                    fs.unlinkSync(tempAvatar2);
                }
            } catch (cleanupError) {
                console.warn("⚠️ Cleanup warning:", cleanupError.message);
            }
        }
    },

    makeMarriageImage: async function({ one, two }) {
        const canvasDir = path.join(__dirname, "cache", "canvas");
        const backgroundPath = path.join(canvasDir, "marriedv3.png");
        const outputPath = path.join(canvasDir, `married_${one}_${two}_${Date.now()}.png`);
        const avatar1Path = path.join(canvasDir, `avt1_${one}_${Date.now()}.png`);
        const avatar2Path = path.join(canvasDir, `avt2_${two}_${Date.now()}.png`);

        // Store temp paths for cleanup
        this.tempAvatar1 = avatar1Path;
        this.tempAvatar2 = avatar2Path;

        try {
            // Download background image if not exists
            if (!fs.existsSync(backgroundPath)) {
                console.log("📥 Downloading background image...");
                try {
                    const backgroundResponse = await axios.get(
                        "https://i.ibb.co/5TwSHpP/Guardian-Place-full-1484178.jpg",
                        { 
                            responseType: "arraybuffer",
                            timeout: 30000
                        }
                    );
                    fs.writeFileSync(backgroundPath, Buffer.from(backgroundResponse.data, "binary"));
                    console.log("✅ Background image downloaded");
                } catch (bgError) {
                    console.error("❌ Failed to download background:", bgError.message);
                    return null;
                }
            }

            // Load background image
            console.log("📖 Loading background image...");
            let background;
            try {
                background = await jimp.read(backgroundPath);
                console.log("✅ Background image loaded");
            } catch (bgLoadError) {
                console.error("❌ Failed to load background image:", bgLoadError.message);
                return null;
            }

            // Download and process first avatar
            console.log(`📥 Downloading avatar for user ${one}...`);
            let avatar1;
            try {
                const avatar1Response = await axios.get(
                    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    }
                );
                fs.writeFileSync(avatar1Path, Buffer.from(avatar1Response.data, "binary"));
                avatar1 = await jimp.read(avatar1Path);
                console.log("✅ First avatar downloaded");
            } catch (av1Error) {
                console.error(`❌ Failed to download avatar for ${one}:`, av1Error.message);
                return null;
            }

            // Download and process second avatar
            console.log(`📥 Downloading avatar for user ${two}...`);
            let avatar2;
            try {
                const avatar2Response = await axios.get(
                    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    }
                );
                fs.writeFileSync(avatar2Path, Buffer.from(avatar2Response.data, "binary"));
                avatar2 = await jimp.read(avatar2Path);
                console.log("✅ Second avatar downloaded");
            } catch (av2Error) {
                console.error(`❌ Failed to download avatar for ${two}:`, av2Error.message);
                return null;
            }

            // Create circular avatars
            console.log("⭕ Creating circular avatars...");
            avatar1.circle();
            avatar2.circle();

            // Resize avatars to fit the template
            const avatarSize = 85;
            avatar1.resize(avatarSize, avatarSize);
            avatar2.resize(avatarSize, avatarSize);

            // Position avatars on the background
            // These positions are based on your original coordinates
            const position1 = { x: 250, y: 1 };   // First avatar position
            const position2 = { x: 350, y: 70 };  // Second avatar position

            console.log("🎨 Compositing avatars on background...");
            background.composite(avatar1, position1.x, position1.y);
            background.composite(avatar2, position2.x, position2.y);

            // Save final image
            console.log("💾 Saving final image...");
            await background.writeAsync(outputPath);

            // Verify the image was created successfully
            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                if (stats.size > 0) {
                    console.log(`✅ Successfully created marriage image: ${outputPath}`);
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
            console.error("💥 makeMarriageImage Error:", error);
            return null;
        } finally {
            // Cleanup temporary avatar files
            try {
                if (fs.existsSync(avatar1Path)) fs.unlinkSync(avatar1Path);
                if (fs.existsSync(avatar2Path)) fs.unlinkSync(avatar2Path);
                console.log("🧹 Cleaned up temporary avatar files");
            } catch (cleanupError) {
                console.warn("⚠️ Failed to clean up temp avatars:", cleanupError.message);
            }
        }
    }
};
