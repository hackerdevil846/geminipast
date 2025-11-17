const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "bestu",
        aliases: [],
        version: "7.3.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "𝖡𝖾𝗌𝗍𝗎 𝗉𝖺𝗂𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝗐𝗂𝗍𝗁 𝗆𝖾𝗇𝗍𝗂𝗈𝗇"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝖼𝗈𝗎𝗉𝗅𝖾 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽 𝗎𝗌𝖾𝗋"
        },
        guide: {
            en: "{p}bestu [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌");
                return;
            }

            const dirMaterial = __dirname + `/cache/canvas/`;
            const pathFile = path.resolve(__dirname, 'cache/canvas', 'bestu.png');
            
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }
            
            if (!fs.existsSync(pathFile)) {
                try {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾...");
                    const imageData = await axios.get("https://i.imgur.com/RloX16v.jpg", { 
                        responseType: 'arraybuffer',
                        timeout: 30000
                    });
                    fs.writeFileSync(pathFile, Buffer.from(imageData.data));
                    console.log("✅ 𝖡𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } catch (error) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾:", error.message);
                }
            }
        } catch (error) {
            console.error("💥 𝖡𝖾𝗌𝗍𝗎 𝗈𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function ({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
            }

            const { senderID } = event;
            const mention = Object.keys(event.mentions);

            if (!mention[0]) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗉𝖺𝗂𝗋 😅");
            }

            const one = senderID, two = mention[0];
            
            // Check if user is trying to pair with themselves
            if (one === two) {
                return message.reply("❌ 𝖸𝗈𝗎 𝖼𝖺𝗇𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗉𝖺𝗂𝗋 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿! 😅");
            }

            const processingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾...");
            
            const imagePath = await this.makeImage({ one, two });
            
            if (!imagePath) {
                await message.unsendMessage(processingMsg.messageID);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            const bodyMsg = `✧•❁𝖡𝖺𝗇𝖽𝗁𝗎𝗍𝗍𝗈❁•✧

╔═══❖••° °••❖═══╗

   𝖲𝗈𝖿𝗈𝗅 𝖯𝖺𝗂𝗋𝗂𝗇𝗀

╚═══❖••° °••❖═══╝

   ✶⊶⊷⊷❍⊶⊷⊷✶

       👑𝖭𝗂𝗒𝖾 𝖭𝖺𝗈 𝖡𝖺𝗇𝖽𝗁𝗎 ❤

𝖳𝗈𝗆𝖺𝗋 𝖡𝖾𝗌𝗍𝗎 🩷

   ✶⊶⊷⊷❍⊶⊷⊷✶`;

            await message.unsendMessage(processingMsg.messageID);
            await message.reply({
                body: bodyMsg,
                attachment: fs.createReadStream(imagePath)
            });

            // Cleanup
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (cleanupError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗂𝗆𝖺𝗀𝖾:", cleanupError.message);
            }

        } catch (error) {
            console.error("💥 𝖡𝖾𝗌𝗍𝗎 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    makeImage: async function({ one, two }) {
        const __root = path.resolve(__dirname, "cache", "canvas");

        try {
            // Check if base image exists
            const baseImagePath = __root + "/bestu.png";
            if (!fs.existsSync(baseImagePath)) {
                console.error("❌ 𝖡𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
                return null;
            }

            const baseImage = await jimp.read(baseImagePath);
            const pathImg = __root + `/bestu_${one}_${two}_${Date.now()}.png`;
            const avatarOnePath = __root + `/avt_${one}_${Date.now()}.png`;
            const avatarTwoPath = __root + `/avt_${two}_${Date.now()}.png`;

            try {
                // Download avatars with timeout
                console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋𝗌...`);
                const [getAvatarOne, getAvatarTwo] = await Promise.all([
                    axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
                        responseType: 'arraybuffer',
                        timeout: 30000
                    }),
                    axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
                        responseType: 'arraybuffer',
                        timeout: 30000
                    })
                ]);

                fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne.data, 'utf-8'));
                fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo.data, 'utf-8'));

                // Create circular avatars
                console.log(`🎨 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌...`);
                const circleOne = await jimp.read(await this.circle(avatarOnePath));
                const circleTwo = await jimp.read(await this.circle(avatarTwoPath));

                // Composite avatars on base image
                console.log(`🖼️ 𝖢𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾...`);
                baseImage.composite(circleOne.resize(191, 191), 93, 111)
                         .composite(circleTwo.resize(190, 190), 434, 107);

                // Save final image
                console.log(`💾 𝖲𝖺𝗏𝗂𝗇𝗀 𝖿𝗂𝗇𝖺𝗅 𝗂𝗆𝖺𝗀𝖾...`);
                const buffer = await baseImage.getBufferAsync("image/png");
                fs.writeFileSync(pathImg, buffer);

                console.log(`✅ 𝖯𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒`);
                return pathImg;

            } catch (avatarError) {
                console.error("❌ 𝖠𝗏𝖺𝗍𝖺𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", avatarError.message);
                return null;
            } finally {
                // Cleanup temporary files
                try {
                    if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
                    if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋𝗌:", cleanupError.message);
                }
            }
        } catch (error) {
            console.error("💥 𝖬𝖺𝗄𝖾𝖨𝗆𝖺𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
            return null;
        }
    },

    circle: async function(imagePath) {
        try {
            const image = await jimp.read(imagePath);
            image.circle();
            return await image.getBufferAsync("image/png");
        } catch (error) {
            console.error("❌ 𝖢𝗂𝗋𝖼𝗅𝖾 𝖾𝗋𝗋𝗈𝗋:", error.message);
            throw error;
        }
    }
};
