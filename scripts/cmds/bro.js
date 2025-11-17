const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "bro",
        aliases: [],
        version: "7.3.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "image-edit",
        shortDescription: {
            en: "𝖬𝖾𝗇𝗍𝗂𝗈𝗇 𝗍𝗁𝖾𝗄𝖾 𝖩𝗎𝗍𝗂 𝖯𝖺𝗐𝖺 👬"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝖻𝗋𝗈𝗍𝗁𝖾𝗋-𝗍𝗁𝖾𝗆𝖾𝖽 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽 𝗎𝗌𝖾𝗋"
        },
        guide: {
            en: "{p}bro [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
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

            const dirMaterial = path.join(__dirname, 'cache', 'canvas');
            const filePath = path.join(dirMaterial, 'sis.png');
            
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }
            
            if (!fs.existsSync(filePath)) {
                try {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾...");
                    const imageData = await axios.get("https://i.imgur.com/n2FGJFe.jpg", { 
                        responseType: 'arraybuffer',
                        timeout: 30000
                    });
                    await fs.writeFile(filePath, imageData.data);
                    console.log("✅ 𝖡𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } catch (error) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾:", error.message);
                }
            }
        } catch (error) {
            console.error("💥 𝖮𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ message, event, args }) {
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
                return message.reply("❌ | 𝖤𝗄𝗃𝗈𝗇𝗄𝖾 𝖬𝖾𝗇𝗍𝗂𝗈𝗇 𝖪𝖺𝗋𝗈, 𝖱𝖾 𝖡𝗈𝗄𝖺 😅");
            }
            
            const one = senderID;
            const two = mention[0];

            // Check if base image exists
            const baseImagePath = path.join(__dirname, 'cache', 'canvas', 'sis.png');
            if (!fs.existsSync(baseImagePath)) {
                return message.reply("❌ 𝖡𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖿𝗈𝗋 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗍𝗈 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾.");
            }

            const loadingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖻𝗋𝗈𝗍𝗁𝖾𝗋 𝗂𝗆𝖺𝗀𝖾...");
            
            const imagePath = await this.makeImage({ one, two });
            
            const body = `✧•❁𝖡𝗁𝖺𝗂-𝖡𝗈𝗇❁•✧

╔═══❖••° °••❖═══╗
   𝖲𝖺𝗉𝗁𝖺𝗅𝖺𝖻𝖺𝗌𝖺 𝖩𝗎𝗍𝗂
╚═══❖••° °••❖═══╝

   ✶⊶⊷⊷❍⊶⊷⊷✶
       👑𝖭𝗂𝗒𝖾 𝖯𝖾𝗅𝖾𝗇 𝖡𝗋𝗈❤
𝖳𝗈𝗆𝖺𝗋 𝖩𝖾𝗇𝗈 𝖡𝗁𝖺𝗂 🩷
   ✶⊶⊷⊷❍⊶⊷⊷✶`;
            
            await message.reply({
                body: body,
                attachment: fs.createReadStream(imagePath)
            });

            // Unsend loading message
            try {
                await message.unsendMessage(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            // Clean up the generated image
            setTimeout(() => {
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗂𝗆𝖺𝗀𝖾");
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗂𝗆𝖺𝗀𝖾:", cleanupError.message);
                }
            }, 5000);

        } catch (error) {
            console.error("💥 𝖬𝖺𝗂𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('avatar') || error.message.includes('profile')) {
                errorMessage = "❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖺𝖼𝖼𝖾𝗌𝗌 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('jimp') || error.message.includes('image processing')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    },

    makeImage: async function({ one, two }) {
        const __root = path.join(__dirname, "cache", "canvas");
        const batgiamPath = path.join(__root, "sis.png");
        const outputPath = path.join(__root, `batman_${one}_${two}_${Date.now()}.png`);
        const avatarOnePath = path.join(__root, `avt_${one}_${Date.now()}.png`);
        const avatarTwoPath = path.join(__root, `avt_${two}_${Date.now()}.png`);

        try {
            // Download and process first avatar
            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${one}...`);
            const avatarOneData = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                responseType: 'arraybuffer',
                timeout: 30000
            });
            await fs.writeFile(avatarOnePath, avatarOneData.data);

            // Download and process second avatar
            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${two}...`);
            const avatarTwoData = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                responseType: 'arraybuffer',
                timeout: 30000
            });
            await fs.writeFile(avatarTwoPath, avatarTwoData.data);

            // Load base image
            console.log("🎨 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾...");
            const batgiamImg = await jimp.read(batgiamPath);
            
            // Create circular avatars
            console.log("⭕ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌...");
            const circleOne = await jimp.read(await this.createCircleImage(avatarOnePath));
            const circleTwo = await jimp.read(await this.createCircleImage(avatarTwoPath));
            
            // Composite avatars onto base image
            console.log("🖼️ 𝖢𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾𝗌...");
            batgiamImg.composite(circleOne.resize(191, 191), 93, 111)
                     .composite(circleTwo.resize(190, 190), 434, 107);

            // Save the final image
            console.log("💾 𝖲𝖺𝗏𝗂𝗇𝗀 𝖿𝗂𝗇𝖺𝗅 𝗂𝗆𝖺𝗀𝖾...");
            const imageBuffer = await batgiamImg.getBufferAsync("image/png");
            await fs.writeFile(outputPath, imageBuffer);

            // Clean up temporary files
            console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝗂𝗇𝗀 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌...");
            await fs.remove(avatarOnePath).catch(() => {});
            await fs.remove(avatarTwoPath).catch(() => {});

            console.log("✅ 𝖨𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
            return outputPath;

        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗆𝖺𝗄𝖾𝖨𝗆𝖺𝗀𝖾:", error);
            
            // Clean up temporary files on error
            try {
                await fs.remove(avatarOnePath).catch(() => {});
                await fs.remove(avatarTwoPath).catch(() => {});
                await fs.remove(outputPath).catch(() => {});
            } catch (cleanupError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌:", cleanupError.message);
            }
            
            throw error;
        }
    },

    createCircleImage: async function(imagePath) {
        try {
            const image = await jimp.read(imagePath);
            image.circle();
            return await image.getBufferAsync("image/png");
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝗂𝗆𝖺𝗀𝖾:", error);
            throw error;
        }
    }
};
