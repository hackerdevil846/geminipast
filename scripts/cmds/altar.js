const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "altar",
        aliases: [],
        version: "1.1.0",
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "𝐀𝐥𝐭𝐚𝐫 𝐢𝐦𝐚𝐠𝐞 𝐜𝐫𝐞𝐚𝐭𝐢𝐨𝐧"
        },
        longDescription: {
            en: "𝐂𝐫𝐞𝐚𝐭𝐞𝐬 𝐚𝐧 𝐚𝐥𝐭𝐚𝐫 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐮𝐬𝐞𝐫'𝐬 𝐚𝐯𝐚𝐭𝐚𝐫"
        },
        guide: {
            en: "{p}altar [@𝐭𝐚𝐠]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    onStart: async function({ message, event, args }) {
        let outputPath = null;
        
        try {
            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            outputPath = path.join(cacheDir, `altar_${Date.now()}.png`);
            
            // Get user ID from mention or use sender's ID
            const targetID = Object.keys(event.mentions)[0] || event.senderID;
            
            // Show processing message
            const processingMsg = await message.reply("🔄 𝐂𝐫𝐞𝐚𝐭𝐢𝐧𝐠 𝐚𝐥𝐭𝐚𝐫 𝐢𝐦𝐚𝐠𝐞...");

            // Load background image
            const background = await jimp.read('https://i.imgur.com/brK0Hbb.jpg');
            
            // Get user avatar
            const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const avatar = await jimp.read(avatarUrl);
            
            // Resize avatar to fit the altar frame
            avatar.resize(205, 205);
            
            // Create circular avatar using Jimp's built-in circle method
            avatar.circle();
            
            // Composite avatar onto background at correct position
            background.composite(avatar, 353, 158);
            
            // Save the image
            await background.writeAsync(outputPath);

            // Send the result
            await message.reply({
                body: "🕊️ 𝐇𝐞𝐲, 𝐡𝐨𝐰 𝐚𝐫𝐞 𝐲𝐨𝐮? :))",
                attachment: fs.createReadStream(outputPath)
            });

            // Clean up processing message
            if (processingMsg && processingMsg.messageID) {
                await message.unsendMessage(processingMsg.messageID);
            }

        } catch (error) {
            console.error("𝐀𝐥𝐭𝐚𝐫 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", error);
        } finally {
            // Clean up file
            if (outputPath && fs.existsSync(outputPath)) {
                try {
                    fs.unlinkSync(outputPath);
                } catch (cleanupError) {
                    console.warn("𝐂𝐥𝐞𝐚𝐧𝐮𝐩 𝐞𝐫𝐫𝐨𝐫:", cleanupError);
                }
            }
        }
    }
};
