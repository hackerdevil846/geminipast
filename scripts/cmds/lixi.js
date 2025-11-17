const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "lixi",
        aliases: [],
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝗅𝗎𝖼𝗄𝗒 𝗆𝗈𝗇𝖾𝗒 𝗂𝗆𝖺𝗀𝖾"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖺 𝖼𝗎𝗌𝗍𝗈𝗆 𝗅𝗎𝖼𝗄𝗒 𝗆𝗈𝗇𝖾𝗒 (𝗅ì 𝗑ì) 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝖰𝖱 𝖼𝗈𝖽𝖾"
        },
        guide: {
            en: "{p}lixi"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "jimp": "",
            "path": ""
        }
    },

    onStart: async function({ event, message, usersData, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("jimp");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝗃𝗂𝗆𝗉, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const { senderID } = event;
            
            // Create cache directory with error handling
            const dirMaterial = path.resolve(__dirname, '../scripts/cmds/cache/canvas');
            try {
                if (!fs.existsSync(dirMaterial)) {
                    fs.mkdirSync(dirMaterial, { recursive: true });
                    console.log(`✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒: ${dirMaterial}`);
                }
            } catch (dirError) {
                console.error("𝖣𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const templatePath = path.resolve(dirMaterial, "lixi.png");
            
            // Download template if it doesn't exist
            if (!fs.existsSync(templatePath)) {
                try {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾...");
                    const { data } = await axios.get("https://i.imgur.com/VUWRn9N.jpg", {
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    fs.writeFileSync(templatePath, Buffer.from(data, 'binary'));
                    console.log("✅ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } catch (templateError) {
                    console.error("❌ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", templateError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾!");
                }
            }

            const pathImg = path.resolve(dirMaterial, `lixi_${senderID}_${Date.now()}.png`);
            const avatarPath = path.resolve(dirMaterial, `avt_${senderID}_${Date.now()}.png`);
            const qrPath = path.resolve(dirMaterial, `qr_${senderID}_${Date.now()}.png`);
            
            const loadingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗅𝗎𝖼𝗄𝗒 𝗆𝗈𝗇𝖾𝗒... 🧧");
            
            // Download user avatar
            try {
                console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${senderID}...`);
                const avatarData = await axios.get(`https://graph.facebook.com/${senderID}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                fs.writeFileSync(avatarPath, Buffer.from(avatarData.data, 'binary'));
                console.log("✅ 𝖠𝗏𝖺𝗍𝖺𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
            } catch (avatarError) {
                console.error("❌ 𝖠𝗏𝖺𝗍𝖺𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", avatarError);
                await message.unsend(loadingMsg.messageID);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋!");
            }
            
            // Download QR code
            try {
                console.log("📥 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝖰𝖱 𝖼𝗈𝖽𝖾...");
                const qrData = await axios.get(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ThankYouForTheLuckyMoney&format=png&margin=0`, {
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                fs.writeFileSync(qrPath, Buffer.from(qrData.data, 'binary'));
                console.log("✅ 𝖰𝖱 𝖼𝗈𝖽𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
            } catch (qrError) {
                console.error("❌ 𝖰𝖱 𝖼𝗈𝖽𝖾 𝖾𝗋𝗋𝗈𝗋:", qrError);
                await message.unsend(loadingMsg.messageID);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖰𝖱 𝖼𝗈𝖽𝖾!");
            }

            // Process images
            try {
                console.log("🎨 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾𝗌...");
                
                // Helper function to create circular images with fallback
                async function circleImage(imagePath) {
                    try {
                        const image = await jimp.read(imagePath);
                        image.circle();
                        return image;
                    } catch (error) {
                        console.error("𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗅𝖾 𝗂𝗆𝖺𝗀𝖾:", error);
                        // Create a fallback gray circle
                        const defaultImage = await jimp.create(150, 150, 0x808080ff);
                        defaultImage.circle();
                        return defaultImage;
                    }
                }

                const lixiImage = await jimp.read(templatePath);
                const circleAvatar = await circleImage(avatarPath);
                const circleQR = await circleImage(qrPath);
                
                // Rotate QR code slightly for better appearance
                circleQR.rotate(-10);
                
                // Composite images onto template
                lixiImage.composite(circleAvatar.resize(150, 150), 226, 79)
                         .composite(circleQR.resize(75, 75), 218, 260);
                
                // Save final image
                await lixiImage.writeAsync(pathImg);
                console.log("✅ 𝖥𝗂𝗇𝖺𝗅 𝗂𝗆𝖺𝗀𝖾 𝗌𝖺𝗏𝖾𝖽");
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
                // Send the final image
                await message.reply({
                    body: "🧧 𝖫𝗎𝖼𝗄𝗒 𝗆𝗈𝗇𝖾𝗒 𝖿𝗈𝗋 𝗒𝗈𝗎! 💖",
                    attachment: fs.createReadStream(pathImg)
                });
                
                console.log("✅ 𝖫𝗎𝖼𝗄𝗒 𝗆𝗈𝗇𝖾𝗒 𝗂𝗆𝖺𝗀𝖾 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                
            } catch (processingError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", processingError);
                await message.unsend(loadingMsg.messageID);
                await message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾𝗌!");
            } finally {
                // Clean up temporary files with error handling
                setTimeout(async () => {
                    const filesToClean = [avatarPath, qrPath, pathImg];
                    for (const file of filesToClean) {
                        try {
                            if (fs.existsSync(file)) {
                                await fs.unlink(file);
                                console.log(`🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉: ${path.basename(file)}`);
                            }
                        } catch (cleanupError) {
                            console.warn(`𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 ${file}:`, cleanupError.message);
                        }
                    }
                }, 5000);
            }
            
        } catch (error) {
            console.error("💥 𝖫𝗂𝗑𝗂 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗅𝗎𝖼𝗄𝗒 𝗆𝗈𝗇𝖾𝗒 𝗂𝗆𝖺𝗀𝖾!";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('jimp')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
