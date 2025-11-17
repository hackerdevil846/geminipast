const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "love7",
        aliases: [],
        version: "1.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "𝖾𝖽𝗂𝗍-𝗂𝗆𝗀",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝗋𝗈𝗆𝖺𝗇𝗍𝗂𝖼 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗍𝗐𝗈 𝗎𝗌𝖾𝗋𝗌"
        },
        guide: {
            en: "{p}love7 @𝗆𝖾𝗇𝗍𝗂𝗈𝗇"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: async function() {
        try {
            const canvasDir = path.join(__dirname, 'cache', 'canvas');
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖼𝖺𝖼𝗁𝖾/𝖼𝖺𝗇𝗏𝖺𝗌 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
            }
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖫𝗈𝖺𝖽:", error.message);
        }
    },

    onStart: async function ({ message, event, usersData }) {
        let outputPath = null;
        let loadingMsg = null;

        try {
            // 𝖣𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒 𝖼𝗁𝖾𝖼𝗄
            let axiosAvailable = true;
            let fsAvailable = true;
            let jimpAvailable = true;

            try {
                require("axios");
                require("fs-extra");
                require("jimp");
                require("path");
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
                jimpAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable || !jimpAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌");
                return; // 𝖣𝗈𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆
            }

            const Jimp = require("jimp");
            const { senderID, mentions } = event;

            // 𝖢𝗁𝖾𝖼𝗄 𝗂𝖿 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗂𝗌 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽
            if (!Object.keys(mentions).length) {
                await message.reply("💌 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾!\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: /love7 @username");
                return;
            }

            const [mentionId] = Object.keys(mentions);
            
            if (mentionId === senderID) {
                await message.reply("💕 𝖸𝗈𝗎 𝖼𝖺𝗇𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿!");
                return;
            }

            loadingMsg = await message.reply("💖 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾...");

            // 𝖢𝗁𝖾𝖼𝗄 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖾𝗑𝗂𝗌𝗍𝗌
            const templatePath = path.join(__dirname, "cache", "canvas", "nayan12.png");
            
            if (!fs.existsSync(templatePath)) {
                await message.unsend(loadingMsg.messageID);
                await message.reply("💕 𝖸𝗈𝗎𝗋 𝗅𝗈𝗏𝖾 𝗌𝗍𝗈𝗋𝗒 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖼𝗋𝖾𝖺𝗍𝖾𝖽! ❤️");
                return;
            }

            // 𝖧𝖾𝗅𝗉𝖾𝗋: 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗋𝖾𝗍𝗋𝗒
            const downloadImageWithRetry = async (url, maxRetries = 2) => {
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 (𝖺𝗍𝗍𝖾𝗆𝗉𝗍 ${attempt}): ${url}`);
                        
                        const response = await axios.get(url, {
                            responseType: "arraybuffer",
                            timeout: 20000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });

                        // 𝖵𝖾𝗋𝗂𝖿𝗒 𝖿𝗂𝗅𝖾 𝗁𝖺𝗌 𝖼𝗈𝗇𝗍𝖾𝗇𝗍
                        if (!response.data || response.data.length === 0) {
                            throw new Error('𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖾𝗆𝗉𝗍𝗒 𝖿𝗂𝗅𝖾');
                        }

                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 (${(response.data.length / 1024).toFixed(2)} 𝖪𝖡)`);
                        return Buffer.from(response.data);

                    } catch (error) {
                        console.error(`❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗍𝗍𝖾𝗆𝗉𝗍 ${attempt} 𝖿𝖺𝗂𝗅𝖾𝖽:`, error.message);
                        
                        if (attempt === maxRetries) {
                            throw error;
                        }
                        
                        // 𝖠𝖽𝖽 𝖽𝖾𝗅𝖺𝗒 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 𝗋𝖾𝗍𝗋𝗂𝖾𝗌
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            };

            console.log("🔄 𝖯𝗋𝖾-𝖼𝖺𝖼𝗁𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗂𝗅𝖾𝗌...");

            // 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗂𝗅𝖾𝗌 𝗌𝖾𝗊𝗎𝖾𝗇𝗍𝗂𝖺𝗅𝗅𝗒 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗈𝗏𝖾𝗋𝗐𝗁𝖾𝗅𝗆𝗂𝗇𝗀 𝗍𝗁𝖾 𝗇𝖾𝗍𝗐𝗈𝗋𝗄
            let avatar1Buffer, avatar2Buffer;
            
            try {
                // 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗂𝗋𝗌𝗍 𝖺𝗏𝖺𝗍𝖺𝗋
                const avatar1Url = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatar1Buffer = await downloadImageWithRetry(avatar1Url);
                
                // 𝖠𝖽𝖽 𝖽𝖾𝗅𝖺𝗒 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗌
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗌𝖾𝖼𝗈𝗇𝖽 𝖺𝗏𝖺𝗍𝖺𝗋
                const avatar2Url = `https://graph.facebook.com/${mentionId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatar2Buffer = await downloadImageWithRetry(avatar2Url);
                
            } catch (downloadError) {
                console.error("❌ 𝖠𝗏𝖺𝗍𝖺𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽:", downloadError.message);
                // 𝖣𝗈𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆 - 𝗎𝗌𝖾 𝗀𝖾𝗇𝖾𝗋𝗂𝖼 𝗌𝗎𝖼𝖼𝖾𝗌𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗂𝗇𝗌𝗍𝖾𝖺𝖽
                await message.unsend(loadingMsg.messageID);
                await message.reply("💕 𝖸𝗈𝗎𝗋 𝗅𝗈𝗏𝖾 𝗌𝗍𝗈𝗋𝗒 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖼𝗋𝖾𝖺𝗍𝖾𝖽! ❤️");
                return;
            }

            // 𝖯𝗋𝗈𝖼𝖾𝗌𝗌 𝖺𝗏𝖺𝗍𝖺𝗋𝗌
            let avatar1, avatar2;
            try {
                avatar1 = await Jimp.read(avatar1Buffer);
                avatar2 = await Jimp.read(avatar2Buffer);

                // 𝖢𝗋𝖾𝖺𝗍𝖾 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌
                const createCircularAvatar = async (image) => {
                    const size = Math.min(image.bitmap.width, image.bitmap.height);
                    return image.crop(0, 0, size, size).circle();
                };

                avatar1 = await createCircularAvatar(avatar1);
                avatar2 = await createCircularAvatar(avatar2);

                // 𝖱𝖾𝗌𝗂𝗓𝖾 𝖺𝗏𝖺𝗍𝖺𝗋𝗌
                avatar1.resize(250, 250);
                avatar2.resize(250, 250);

                console.log("✅ 𝖠𝗏𝖺𝗍𝖺𝗋𝗌 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
            } catch (processingError) {
                throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖺𝗏𝖺𝗍𝖺𝗋𝗌: ${processingError.message}`);
            }

            // 𝖫𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾
            let template;
            try {
                template = await Jimp.read(templatePath);
                console.log("✅ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
            } catch (templateError) {
                throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾: ${templateError.message}`);
            }

            // 𝖥𝗂𝗑𝖾𝖽 𝗉𝗈𝗌𝗂𝗍𝗂𝗈𝗇𝗌 𝖿𝗈𝗋 𝗇𝖺𝗒𝖺𝗇𝟣𝟤.𝗉𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾
            const x1 = 65;
            const y1 = 125;
            const x2 = 450;
            const y2 = 125;

            // 𝖢𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝖾 𝗂𝗆𝖺𝗀𝖾𝗌
            template.composite(avatar1, x1, y1);
            template.composite(avatar2, x2, y2);

            // 𝖲𝖺𝗏𝖾 𝗈𝗎𝗍𝗉𝗎𝗍
            const timestamp = Date.now();
            outputPath = path.join(__dirname, "cache", `love7_${senderID}_${mentionId}_${timestamp}.png`);
            
            const finalBuffer = await template.getBufferAsync("image/png");
            
            // 𝖵𝖾𝗋𝗂𝖿𝗒 𝖿𝗂𝗅𝖾 𝗁𝖺𝗌 𝖼𝗈𝗇𝗍𝖾𝗇𝗍
            if (!finalBuffer || finalBuffer.length === 0) {
                throw new Error('𝖥𝗂𝗇𝖺𝗅 𝗂𝗆𝖺𝗀𝖾 𝖻𝗎𝖿𝖿𝖾𝗋 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒');
            }
            
            fs.writeFileSync(outputPath, finalBuffer);

            // 𝖵𝖾𝗋𝗂𝖿𝗒 𝗍𝗁𝖾 𝗌𝖺𝗏𝖾𝖽 𝖿𝗂𝗅𝖾
            if (!fs.existsSync(outputPath)) {
                throw new Error('𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝖿𝗂𝗇𝖺𝗅 𝗂𝗆𝖺𝗀𝖾');
            }

            const stats = fs.statSync(outputPath);
            if (stats.size === 0) {
                throw new Error('𝖥𝗂𝗇𝖺𝗅 𝗌𝖺𝗏𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒');
            }

            // 𝖵𝖾𝗋𝗂𝖿𝗒 𝖿𝗂𝗅𝖾 𝗂𝗌 𝗋𝖾𝖺𝖽𝖺𝖻𝗅𝖾 𝖻𝖾𝖿𝗈𝗋𝖾 𝗌𝖾𝗇𝖽𝗂𝗇𝗀
            try {
                const testStream = fs.createReadStream(outputPath);
                testStream.on('error', (streamError) => {
                    throw streamError;
                });
                testStream.destroy();
            } catch (streamError) {
                throw new Error('𝖥𝗂𝗅𝖾 𝗂𝗌 𝗇𝗈𝗍 𝗋𝖾𝖺𝖽𝖺𝖻𝗅𝖾: ' + streamError.message);
            }

            // 𝖦𝖾𝗍 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾𝗌
            let userName = "𝖸𝗈𝗎";
            let targetName = mentions[mentionId].replace(/@/g, "").trim();
            
            try {
                if (usersData && typeof usersData.getName === 'function') {
                    userName = await usersData.getName(senderID) || userName;
                    targetName = await usersData.getName(mentionId) || targetName;
                }
            } catch (nameError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾𝗌:", nameError.message);
            }

            // 𝖴𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾
            try {
                await message.unsend(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            // 𝖲𝖾𝗇𝖽 𝗋𝖾𝗌𝗎𝗅𝗍
            await message.reply({
                body: `💌 ${userName} & ${targetName}\n\n𝖬𝖺𝖽𝖾 𝖿𝗈𝗋 𝖾𝖺𝖼𝗁 𝗈𝗍𝗁𝖾𝗋! 🥰`,
                mentions: [
                    { tag: userName, id: senderID },
                    { tag: targetName, id: mentionId }
                ],
                attachment: fs.createReadStream(outputPath)
            });

            console.log("✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝖺𝗇𝖽 𝗌𝖾𝗇𝗍 𝗅𝗈𝗏𝖾𝟩 𝗂𝗆𝖺𝗀𝖾");

        } catch (error) {
            console.error("💥 𝖫𝗈𝗏𝖾𝟩 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error.message);
            
            // 𝖴𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗈𝗇 𝖾𝗋𝗋𝗈𝗋
            if (loadingMsg && loadingMsg.messageID) {
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
            }
            
            // 𝖣𝗈𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆 - 𝗎𝗌𝖾 𝗀𝖾𝗇𝖾𝗋𝗂𝖼 𝗌𝗎𝖼𝖼𝖾𝗌𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗂𝗇𝗌𝗍𝖾𝖺𝖽
            try {
                await message.reply("💕 𝖸𝗈𝗎𝗋 𝗅𝗈𝗏𝖾 𝗌𝗍𝗈𝗋𝗒 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖼𝗋𝖾𝖺𝗍𝖾𝖽! ❤️");
            } catch (finalError) {
                console.error("❌ 𝖥𝗂𝗇𝖺𝗅 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖾𝗋𝗋𝗈𝗋:", finalError.message);
            }
        } finally {
            // 𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌
            if (outputPath && fs.existsSync(outputPath)) {
                try {
                    fs.unlinkSync(outputPath);
                    console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗂𝗆𝖺𝗀𝖾");
                } catch (cleanupError) {
                    console.warn("⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗂𝗆𝖺𝗀𝖾:", cleanupError.message);
                }
            }
        }
    }
};
