const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "bestie",
        aliases: [],
        version: "7.3.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "𝖬𝖾𝗇𝗍𝗂𝗈𝗇 𝗒𝗈𝗎𝗋 𝖻𝖾𝗌𝗍𝖿𝗋𝗂𝖾𝗇𝖽 𝗉𝖺𝗂𝗋"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝖻𝖾𝗌𝗍𝖿𝗋𝗂𝖾𝗇𝖽 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽 𝗎𝗌𝖾𝗋"
        },
        guide: {
            en: "{p}bestie [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
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
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌 𝗂𝗇 𝖻𝖾𝗌𝗍𝗂𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                return;
            }

            const dirMaterial = path.join(__dirname, 'cache', 'canvas');
            const imagePath = path.join(dirMaterial, 'bestu.png');
            
            // Create directory if it doesn't exist
            try {
                if (!fs.existsSync(dirMaterial)) {
                    fs.mkdirSync(dirMaterial, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return;
            }
            
            // Download base image if it doesn't exist
            if (!fs.existsSync(imagePath)) {
                try {
                    const response = await axios({
                        method: 'GET',
                        url: "https://i.imgur.com/RloX16v.jpg",
                        responseType: 'stream',
                        timeout: 30000
                    });
                    
                    const writer = fs.createWriteStream(imagePath);
                    response.data.pipe(writer);
                    
                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });
                    
                    console.log("✅ 𝖡𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } catch (downloadError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾:", downloadError.message);
                }
            }
        } catch (error) {
            console.error("💥 𝖡𝖾𝗌𝗍𝗂𝖾 𝗈𝗇𝖫𝗈𝖺𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ event, message, args, usersData }) {
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

            const { senderID, threadID } = event;
            const mention = Object.keys(event.mentions);
            
            if (!mention[0]) {
                return message.reply("✨ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝖺 𝗎𝗌𝖾𝗋 𝗍𝗈 𝗉𝖺𝗂𝗋 𝗐𝗂𝗍𝗁!");
            }
            
            const one = senderID;
            const two = mention[0];

            // Don't allow pairing with self
            if (one === two) {
                return message.reply("❌ 𝖸𝗈𝗎 𝖼𝖺𝗇𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝖻𝖾𝗌𝗍𝗂𝖾 𝗉𝖺𝗂𝗋 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿!");
            }

            const loadingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖻𝖾𝗌𝗍𝗂𝖾 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾...");

            const makeImage = async ({ one, two }) => {
                const __root = path.join(__dirname, "cache", "canvas");
                
                // Create cache directory if it doesn't exist
                try {
                    if (!fs.existsSync(__root)) {
                        fs.mkdirSync(__root, { recursive: true });
                    }
                } catch (dirError) {
                    throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒: ${dirError.message}`);
                }
                
                const circle = async (image) => {
                    try {
                        const img = await jimp.read(image);
                        img.circle();
                        return await img.getBufferAsync("image/png");
                    } catch (circleError) {
                        throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝗂𝗆𝖺𝗀𝖾: ${circleError.message}`);
                    }
                }
                
                const batgiam_img_path = path.join(__root, "bestu.png");
                if (!fs.existsSync(batgiam_img_path)) {
                    throw new Error("𝖡𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
                }
                
                const batgiam_img = await jimp.read(batgiam_img_path);
                const pathImg = path.join(__root, `bestie_${one}_${two}_${Date.now()}.png`);
                const avatarOne = path.join(__root, `avt_${one}_${Date.now()}.png`);
                const avatarTwo = path.join(__root, `avt_${two}_${Date.now()}.png`);
                
                try {
                    // Download first avatar with timeout
                    const getAvatarOne = await axios.get(
                        `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                        {
                            responseType: 'arraybuffer',
                            timeout: 30000
                        }
                    );
                    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'utf-8'));
                    
                    // Download second avatar with timeout
                    const getAvatarTwo = await axios.get(
                        `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                        {
                            responseType: 'arraybuffer',
                            timeout: 30000
                        }
                    );
                    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'utf-8'));
                    
                    // Create circular avatars and composite onto base image
                    const circleOne = await jimp.read(await circle(avatarOne));
                    const circleTwo = await jimp.read(await circle(avatarTwo));
                    
                    batgiam_img.composite(circleOne.resize(191, 191), 93, 111)
                              .composite(circleTwo.resize(190, 190), 434, 107);
                    
                    const raw = await batgiam_img.getBufferAsync("image/png");
                    fs.writeFileSync(pathImg, raw);
                    
                    return pathImg;
                    
                } finally {
                    // Clean up temporary files
                    try {
                        if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
                        if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
                    } catch (cleanupError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌:", cleanupError.message);
                    }
                }
            }
            
            const imagePath = await makeImage({ one, two });

            // Get user names for personalized message
            let userName1, userName2;
            try {
                const user1Data = await usersData.getName(one);
                const user2Data = await usersData.getName(two);
                userName1 = user1Data || "𝖴𝗌𝖾𝗋 1";
                userName2 = user2Data || "𝖴𝗌𝖾𝗋 2";
            } catch (nameError) {
                userName1 = "𝖴𝗌𝖾𝗋 1";
                userName2 = "𝖴𝗌𝖾𝗋 2";
            }

            // Unsend loading message
            try {
                await message.unsendMessage(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            await message.reply({
                body: `🌸┋ 𝖡 𝖤 𝖲 𝖳 𝖨 𝖤 ┋🌸\n\n❖︎ ${userName1} 𝖺𝗇𝖽 ${userName2} 𝖺𝗋𝖾 𝗆𝖺𝖽𝖾 𝖿𝗈𝗋 𝖾𝖺𝖼𝗁 𝗈𝗍𝗁𝖾𝗋 💖\n\n❖︎ 𝖳𝗁𝗂𝗌 𝗂𝗌 𝗒𝗈𝗎𝗋 𝖻𝖾𝗌𝗍𝖿𝗋𝗂𝖾𝗇𝖽 𝗉𝖺𝗂𝗋𝗂𝗇𝗀 ✨`,
                attachment: fs.createReadStream(imagePath)
            }).then(() => {
                // Clean up final image
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (finalCleanupError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗇𝖺𝗅 𝗂𝗆𝖺𝗀𝖾:", finalCleanupError.message);
                }
            });
            
        } catch (error) {
            console.error("💥 𝖡𝖾𝗌𝗍𝗂𝖾 𝗈𝗇𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Try to unsend loading message
            try {
                if (loadingMsg && loadingMsg.messageID) {
                    await message.unsendMessage(loadingMsg.messageID);
                }
            } catch (unsendError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖻𝖾𝗌𝗍𝗂𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('Base image')) {
                errorMessage = "❌ 𝖡𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
