const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "marriedv4",
        aliases: [],
        version: "3.1.2",
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "💍 Create marriage images for couples"
        },
        longDescription: {
            en: "💑 Create marriage images for couples with their profile pictures"
        },
        guide: {
            en: "{p}marriedv4 [@mention]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onStart: async function({ message, event, args, usersData }) {
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
                return message.reply("💍 Please mention someone to marry!");
            }

            const userOne = senderID;
            const userTwo = mentionedUsers[0];

            // Create cache directory
            const cacheDir = path.join(__dirname, "cache", "canvas");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // Set file paths with unique names
            finalImagePath = path.join(cacheDir, `married_${userOne}_${userTwo}_${Date.now()}.png`);
            avatarOnePath = path.join(cacheDir, `avt1_${userOne}_${Date.now()}.png`);
            avatarTwoPath = path.join(cacheDir, `avt2_${userTwo}_${Date.now()}.png`);

            // Download background image if not exists
            const bgPath = path.join(cacheDir, 'marriedv4.png');
            if (!fs.existsSync(bgPath)) {
                console.log("📥 Downloading background image...");
                try {
                    const bgResponse = await axios.get("https://i.ibb.co/9ZZCSzR/ba6abadae46b5bdaa29cf6a64d762874.jpg", {
                        responseType: 'arraybuffer',
                        timeout: 30000
                    });
                    fs.writeFileSync(bgPath, Buffer.from(bgResponse.data, 'binary'));
                    console.log("✅ Background image downloaded");
                } catch (bgError) {
                    console.error("❌ Failed to download background:", bgError.message);
                    return message.reply("❌ Failed to download background image. Please try again later.");
                }
            }

            // Download avatars with error handling
            console.log("📥 Downloading user avatars...");
            const avatarOneUrl = `https://graph.facebook.com/${userOne}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const avatarTwoUrl = `https://graph.facebook.com/${userTwo}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            let avatarOneBuffer, avatarTwoBuffer;

            try {
                const avatarOneResponse = await axios.get(avatarOneUrl, {
                    responseType: 'arraybuffer',
                    timeout: 15000
                });
                avatarOneBuffer = Buffer.from(avatarOneResponse.data, 'binary');
                fs.writeFileSync(avatarOnePath, avatarOneBuffer);
                console.log("✅ First avatar downloaded");
            } catch (avatarOneError) {
                console.error(`❌ Failed to download avatar for ${userOne}:`, avatarOneError.message);
                return message.reply("❌ Failed to download your profile picture.");
            }

            try {
                const avatarTwoResponse = await axios.get(avatarTwoUrl, {
                    responseType: 'arraybuffer',
                    timeout: 15000
                });
                avatarTwoBuffer = Buffer.from(avatarTwoResponse.data, 'binary');
                fs.writeFileSync(avatarTwoPath, avatarTwoBuffer);
                console.log("✅ Second avatar downloaded");
            } catch (avatarTwoError) {
                console.error(`❌ Failed to download avatar for ${userTwo}:`, avatarTwoError.message);
                return message.reply("❌ Failed to download mentioned user's profile picture.");
            }

            // Create circular avatars
            console.log("⭕ Creating circular avatars...");
            const createCircularAvatar = async (imagePath) => {
                try {
                    const image = await jimp.read(imagePath);
                    image.circle();
                    return await image.getBufferAsync(jimp.MIME_PNG);
                } catch (error) {
                    console.error("Error creating circular image:", error);
                    throw error;
                }
            };

            const circleOneBuffer = await createCircularAvatar(avatarOnePath);
            const circleTwoBuffer = await createCircularAvatar(avatarTwoPath);

            // Composite the final image
            console.log("🎨 Creating final marriage image...");
            const background = await jimp.read(bgPath);
            const avatarOne = await jimp.read(circleOneBuffer);
            const avatarTwo = await jimp.read(circleTwoBuffer);

            // Resize avatars to fit the template
            const avatarSizeMale = 110;   // Male character avatar size
            const avatarSizeFemale = 90;  // Female character avatar size

            avatarOne.resize(avatarSizeMale, avatarSizeMale);
            avatarTwo.resize(avatarSizeFemale, avatarSizeFemale);

            // Position avatars on the template
            // Male character position (left side)
            const malePositionX = 153;
            const malePositionY = 50;

            // Female character position (right side)  
            const femalePositionX = 420;
            const femalePositionY = 100;

            background.composite(avatarOne, malePositionX, malePositionY);
            background.composite(avatarTwo, femalePositionX, femalePositionY);

            // Save final image
            const finalBuffer = await background.getBufferAsync(jimp.MIME_PNG);
            fs.writeFileSync(finalImagePath, finalBuffer);

            // Verify the image was created
            if (!fs.existsSync(finalImagePath)) {
                throw new Error("Failed to create final image file");
            }

            // Get user names for the message
            let userNameOne = "User 1";
            let userNameTwo = "User 2";
            
            try {
                const userOneData = await usersData.get(userOne);
                const userTwoData = await usersData.get(userTwo);
                userNameOne = userOneData?.name || "User 1";
                userNameTwo = userTwoData?.name || "User 2";
            } catch (nameError) {
                console.warn("Could not get user names:", nameError.message);
            }

            // Send the final image
            await message.reply({
                body: `💑 ${userNameOne} and ${userNameTwo}'s Marriage Image!\n━━━━━━━━━━━━━━━━━━━━\n💍 Developer: 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝`,
                attachment: fs.createReadStream(finalImagePath)
            });

            console.log("✅ Marriage image successfully created and sent");

        } catch (error) {
            console.error("💥 Command Error:", error);
            await message.reply("❌ An error occurred while creating the marriage image. Please try again later.");
        } finally {
            // Cleanup temporary files
            const filesToClean = [avatarOnePath, avatarTwoPath, finalImagePath];
            for (const filePath of filesToClean) {
                if (filePath && fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                        console.log("🧹 Cleaned up:", filePath);
                    } catch (cleanupError) {
                        console.warn("⚠️ Failed to clean up file:", cleanupError.message);
                    }
                }
            }
        }
    }
};
