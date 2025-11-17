const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

module.exports = {
    config: {
        name: "dogmeme",
        aliases: [],
        version: "4.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 15,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "🐶 𝖢𝗋𝖾𝖺𝗍𝖾 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗅𝗂𝗓𝖾𝖽 𝖽𝗈𝗀 𝗆𝖾𝗆𝖾𝗌 𝗐𝗂𝗍𝗁 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝖿𝗈𝗋𝗆𝖺𝗍𝗍𝗂𝗇𝗀"
        },
        longDescription: {
            en: "🐶 𝖢𝗋𝖾𝖺𝗍𝖾 𝖿𝗎𝗇𝗇𝗒 𝖽𝗈𝗀 𝗆𝖾𝗆𝖾𝗌 𝗐𝗂𝗍𝗁 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾𝗌 𝖺𝗇𝖽 𝖼𝗎𝗌𝗍𝗈𝗆 𝗍𝖾𝗑𝗍"
        },
        guide: {
            en: "{p}dogmeme [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": "",
            "path": ""
        },
        envConfig: {
            dogApi: "https://dog.ceo/api/breeds/image/random"
        }
    },

    onStart: async function ({ message, event, args, api }) {
        try {
            // Store api reference for getUserName function
            this.api = api;
            
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("jimp");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗃𝗂𝗆𝗉, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const { senderID } = event;
            
            // Get target user
            const targetID = Object.keys(event.mentions)[0] || senderID;
            const userName = await this.getUserName(targetID);
            
            // Show processing message
            const processingMsg = await message.reply(
                `🐾 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖺 𝖽𝗈𝗀 𝗆𝖾𝗆𝖾 𝖿𝗈𝗋 ${userName}...\n⏱️ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 10-15 𝗌𝖾𝖼𝗈𝗇𝖽𝗌...`
            );

            // Create meme
            const memePath = await this.createDogMeme(targetID, userName);
            
            // Send result
            await message.reply({
                body: `🐶 ${userName}, 𝗒𝗈𝗎'𝗏𝖾 𝖻𝖾𝖾𝗇 𝖽𝗈𝗀𝗀𝗈-𝖿𝗂𝖾𝖽! 🎉`,
                mentions: [{
                    tag: userName,
                    id: targetID
                }],
                attachment: fs.createReadStream(memePath)
            });
            
            // Clean up
            try {
                if (fs.existsSync(memePath)) {
                    fs.unlinkSync(memePath);
                }
            } catch (cleanupError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗆𝖾𝗆𝖾 𝖿𝗂𝗅𝖾:", cleanupError.message);
            }
            
            try {
                await message.unsendMessage(processingMsg.messageID);
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }
            
        } catch (error) {
            console.error("💥 𝖣𝗈𝗀𝖬𝖾𝗆𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    getUserName: async function(userID) {
        try {
            if (!this.api) {
                return "𝖥𝗋𝗂𝖾𝗇𝖽";
            }
            const userInfo = await this.api.getUserInfo(userID);
            return userInfo[userID]?.name || "𝖥𝗋𝗂𝖾𝗇𝖽";
        } catch {
            return "𝖥𝗋𝗂𝖾𝗇𝖽";
        }
    },

    createDogMeme: async function(userID, userName) {
        const cacheDir = path.join(__dirname, 'cache', 'dogmeme');
        
        // Ensure cache directory exists
        try {
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
        } catch (dirError) {
            console.error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋:", dirError);
            throw new Error("𝖢𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽");
        }
        
        const memePath = path.join(cacheDir, `dogmeme_${userID}_${Date.now()}.jpg`);
        
        try {
            // Get random dog image from API
            const dogResponse = await axios.get(this.config.envConfig.dogApi, {
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const dogImage = dogResponse.data?.message;
            if (!dogImage) {
                throw new Error("𝖭𝗈 𝖽𝗈𝗀 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
            }
            
            // Download dog image
            const dogPath = path.join(cacheDir, `dog_temp_${Date.now()}.jpg`);
            const imageResponse = await axios.get(dogImage, {
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                maxContentLength: 10 * 1024 * 1024 // 10MB limit
            });
            
            await fs.writeFile(dogPath, Buffer.from(imageResponse.data, 'binary'));
            
            // Process image with Jimp
            const image = await jimp.read(dogPath);
            
            // Resize image if too large (max 800px width)
            if (image.bitmap.width > 800) {
                image.resize(800, jimp.AUTO);
            }
            
            // Load fonts
            let titleFont, subtitleFont;
            try {
                titleFont = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
                subtitleFont = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
            } catch (fontError) {
                console.warn("𝖥𝗈𝗇𝗍 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍:", fontError.message);
                titleFont = jimp.FONT_SANS_32_BLACK;
                subtitleFont = jimp.FONT_SANS_16_BLACK;
            }
            
            // Prepare text
            const titleText = `${userName} 𝖺𝗌 𝖺 𝖽𝗈𝗀𝗀𝗈!`;
            const subtitleText = "𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 🐕 𝖣𝗈𝗀𝖬𝖾𝗆𝖾 𝖢𝗈𝗆𝗆𝖺𝗇𝖽";
            
            // Calculate positions
            const titleWidth = jimp.measureText(titleFont, titleText);
            const titleX = Math.max(20, image.bitmap.width / 2 - titleWidth / 2);
            const titleY = image.bitmap.height - 80;
            
            // Add text background for better readability
            const textBgHeight = 60;
            let textBg;
            try {
                textBg = new jimp(image.bitmap.width, textBgHeight, 0xFFFFFFFF);
            } catch (bgError) {
                console.error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝖾𝗑𝗍 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽:", bgError);
                throw bgError;
            }
            
            // Add title text
            try {
                textBg.print(
                    titleFont, 
                    titleX, 
                    10, 
                    {
                        text: titleText,
                        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
                    },
                    image.bitmap.width,
                    textBgHeight
                );
            } catch (textError) {
                console.warn("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖽𝖽 𝗍𝗂𝗍𝗅𝖾 𝗍𝖾𝗑𝗍:", textError.message);
            }
            
            // Add subtitle
            try {
                textBg.print(
                    subtitleFont, 
                    image.bitmap.width - 250, 
                    textBgHeight - 25, 
                    subtitleText
                );
            } catch (subtitleError) {
                console.warn("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖽𝖽 𝗌𝗎𝖻𝗍𝗂𝗍𝗅𝖾:", subtitleError.message);
            }
            
            // Composite text background onto image
            try {
                image.composite(textBg, 0, image.bitmap.height - textBgHeight);
            } catch (compositeError) {
                console.warn("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝖾 𝗍𝖾𝗑𝗍 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽:", compositeError.message);
            }
            
            // Add rounded corners for better aesthetics
            try {
                image.roundCorners(20);
            } catch (roundError) {
                console.warn("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖽𝖽 𝗋𝗈𝗎𝗇𝖽𝖾𝖽 𝖼𝗈𝗋𝗇𝖾𝗋𝗌:", roundError.message);
            }
            
            // Save final meme
            await image.quality(90).writeAsync(memePath);
            
            // Clean up temporary files
            try {
                if (fs.existsSync(dogPath)) {
                    fs.unlinkSync(dogPath);
                }
            } catch (tempCleanupError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉 𝖿𝗂𝗅𝖾:", tempCleanupError.message);
            }
            
            return memePath;
            
        } catch (error) {
            console.error("💥 𝖬𝖾𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
            
            // Clean up any temporary files
            try {
                const tempFiles = fs.readdirSync(cacheDir).filter(file => file.includes('dog_temp_'));
                for (const file of tempFiles) {
                    fs.unlinkSync(path.join(cacheDir, file));
                }
            } catch (cleanupError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌:", cleanupError.message);
            }
            
            throw error;
        }
    }
};
