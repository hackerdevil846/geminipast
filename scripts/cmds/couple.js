const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
    config: {
        name: "couple",
        aliases: [],
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "love",
        shortDescription: {
            en: "💑 𝖲𝗁𝗈𝗐 𝗅𝗈𝗏𝖾 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒"
        },
        longDescription: {
            en: "💕 𝖣𝗂𝗌𝗉𝗅𝖺𝗒𝗌 𝗅𝗈𝗏𝖾 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 𝗍𝗐𝗈 𝗎𝗌𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝗂𝗆𝖺𝗀𝖾"
        },
        guide: {
            en: "{p}couple [@𝗍𝖺𝗀]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": "",
            "canvas": ""
        }
    },

    onLoad: async function() {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("jimp");
                require("canvas");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌");
                return;
            }

            const dirMaterial = path.join(__dirname, 'cache', 'canvas');
            const filePath = path.join(dirMaterial, 'seophi.png');
            
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }
            
            if (!fs.existsSync(filePath)) {
                try {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾...");
                    const imageData = await axios.get("https://i.imgur.com/hmKmmam.jpg", { 
                        responseType: 'arraybuffer',
                        timeout: 30000
                    });
                    fs.writeFileSync(filePath, Buffer.from(imageData.data));
                    console.log("✅ 𝖡𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } catch (error) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾:", error.message);
                }
            }
        } catch (error) {
            console.error("💥 𝖮𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("jimp");
                require("canvas");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗃𝗂𝗆𝗉, 𝖺𝗇𝖽 𝖼𝖺𝗇𝗏𝖺𝗌.");
            }

            const { senderID } = event;
            
            if (!args[0]) {
                return message.reply("💝 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝖺 𝗎𝗌𝖾𝗋 𝗍𝗈 𝗌𝖾𝖾 𝗅𝗈𝗏𝖾 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒!");
            }
            
            const mention = Object.keys(event.mentions)[0];
            if (!mention) {
                return message.reply("💝 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋!");
            }

            // Don't allow self-mention
            if (mention === senderID) {
                return message.reply("💝 𝖸𝗈𝗎 𝖼𝖺𝗇'𝗍 𝖼𝗁𝖾𝖼𝗄 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿! 𝖳𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝖾𝗅𝗌𝖾.");
            }

            const tag = event.mentions[mention].replace("@", "");
            const one = senderID;
            const two = mention;

            const loadingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗅𝗈𝗏𝖾 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒 𝗂𝗆𝖺𝗀𝖾...");
            
            try {
                const imagePath = await this.makeImage({ one, two });
                
                // Get user names for better message
                let userName1, userName2;
                try {
                    const user1Data = await usersData.get(senderID);
                    const user2Data = await usersData.get(mention);
                    userName1 = user1Data?.name || "𝖸𝗈𝗎";
                    userName2 = user2Data?.name || tag;
                } catch (nameError) {
                    userName1 = "𝖸𝗈𝗎";
                    userName2 = tag;
                }

                // Calculate random compatibility percentage
                const compatibility = Math.floor(Math.random() * 41) + 60; // 60-100%

                await message.reply({ 
                    body: `💑 𝖫𝗈𝗏𝖾 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒\n\n✨ ${userName1} + ${userName2}\n💖 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒: ${compatibility}%\n❣️ 𝖬𝖺𝗒 𝗒𝗈𝗎𝗋 𝗅𝗈𝗏𝖾 𝗌𝗍𝗈𝗋𝗒 𝖻𝖾 𝖿𝗈𝗋𝖾𝗏𝖾𝗋 ❣️`,
                    mentions: [{
                        tag: tag,
                        id: mention
                    }],
                    attachment: fs.createReadStream(imagePath)
                });

                // Cleanup
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝗂𝗆𝖺𝗀𝖾:", cleanupError.message);
                }

                // Unsend loading message
                try {
                    await message.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
            } catch (imageError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", imageError);
                await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗅𝗈𝗏𝖾 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                
                try {
                    await message.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
            }
            
        } catch (error) {
            console.error("💥 𝖢𝗈𝗎𝗉𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    makeImage: async function({ one, two }) {
        const __root = path.join(__dirname, "cache", "canvas");
        const pathImg = path.join(__root, `couple_${one}_${two}_${Date.now()}.png`);
        const avatarOne = path.join(__root, `avt_${one}_${Date.now()}.png`);
        const avatarTwo = path.join(__root, `avt_${two}_${Date.now()}.png`);
        
        try {
            // Ensure directory exists
            if (!fs.existsSync(__root)) {
                fs.mkdirSync(__root, { recursive: true });
            }

            // Download first avatar with error handling
            try {
                console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 1: ${one}`);
                const getAvatarOne = await axios.get(
                    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                    { 
                        responseType: 'arraybuffer',
                        timeout: 30000
                    }
                );
                fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data));
            } catch (avatar1Error) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 1:", avatar1Error.message);
                throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗎𝗌𝖾𝗋 1 𝖺𝗏𝖺𝗍𝖺𝗋");
            }
            
            // Download second avatar with error handling
            try {
                console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 2: ${two}`);
                const getAvatarTwo = await axios.get(
                    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                    { 
                        responseType: 'arraybuffer',
                        timeout: 30000
                    }
                );
                fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data));
            } catch (avatar2Error) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 2:", avatar2Error.message);
                throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗎𝗌𝖾𝗋 2 𝖺𝗏𝖺𝗍𝖺𝗋");
            }
            
            // Process images
            const backgroundPath = path.join(__root, "seophi.png");
            if (!fs.existsSync(backgroundPath)) {
                throw new Error("𝖡𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
            }

            const background = await jimp.read(backgroundPath);
            const circleOne = await jimp.read(await this.circle(avatarOne));
            const circleTwo = await jimp.read(await this.circle(avatarTwo));
            
            background.resize(1024, 712)
                     .composite(circleOne.resize(200, 200), 527, 141)
                     .composite(circleTwo.resize(200, 200), 389, 407);
            
            const buffer = await background.getBufferAsync("image/png");
            fs.writeFileSync(pathImg, buffer);
            
            // Cleanup temporary files
            try {
                if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
                if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
            } catch (cleanupError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌:", cleanupError.message);
            }
            
            return pathImg;
            
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾:", error);
            
            // Cleanup on error
            try {
                if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
                if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
                if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
            } catch (cleanupError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝖿𝗂𝗅𝖾𝗌 𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
            }
            
            throw error;
        }
    },

    circle: async function(imagePath) {
        try {
            const image = await jimp.read(imagePath);
            image.circle();
            return await image.getBufferAsync("image/png");
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝗂𝗆𝖺𝗀𝖾:", error);
            throw error;
        }
    }
};
