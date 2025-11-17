const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "condom",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖬𝖺𝗄𝖾 𝖿𝗎𝗇 𝗈𝖿 𝗒𝗈𝗎𝗋 𝖿𝗋𝗂𝖾𝗇𝖽𝗌 𝗎𝗌𝗂𝗇𝗀 𝖼𝗋𝖺𝗓𝗒 𝖼𝗈𝗇𝖽𝗈𝗆 𝖿𝖺𝗂𝗅𝗌 😆"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝖿𝗎𝗇𝗇𝗒 𝖼𝗈𝗇𝖽𝗈𝗆 𝖿𝖺𝗂𝗅 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗍𝖺𝗀𝗀𝖾𝖽 𝗎𝗌𝖾𝗋'𝗌 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾"
        },
        guide: {
            en: "{p}condom @𝗍𝖺𝗀"
        },
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("jimp");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝗃𝗂𝗆𝗉, 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const mentions = Object.keys(event.mentions || {});
            if (!mentions.length) {
                return message.reply("❗ 𝖸𝗈𝗎 𝗆𝗎𝗌𝗍 𝗍𝖺𝗀 𝖺 𝗉𝖾𝗋𝗌𝗈𝗇 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
            }
            
            const targetId = mentions[0];
            const targetName = event.mentions[targetId];
            
            const loadingMsg = await message.reply("🔧 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗋𝖺𝗓𝗒 𝖼𝗈𝗇𝖽𝗈𝗆 𝖿𝖺𝗂𝗅... 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍!");
            
            try {
                const imagePath = await generateImageFor(targetId);
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                await message.reply({
                    body: `𝖮𝗉𝗌 𝖢𝗋𝖺𝗓𝗒 𝖢𝗈𝗇𝖽𝗈𝗆 𝖥𝖺𝗂𝗅𝗌 😆\n𝖬𝖺𝖽𝖾 𝖿𝗈𝗋: ${targetName}\n\n𝖢𝗋𝖾𝖽𝗂𝗍𝗌: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`,
                    attachment: fs.createReadStream(imagePath)
                });

                // Clean up
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                    }
                } catch (cleanupError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

            } catch (imageError) {
                console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", imageError);
                
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
                await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖢𝗈𝗇𝖽𝗈𝗆 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};

async function generateImageFor(userId) {
    const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const templateUrl = "https://i.imgur.com/cLEixM0.jpg";
    const outputPath = path.join(__dirname, `cache/condom_${Date.now()}.png`);
    
    // Ensure cache directory exists
    try {
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
    } catch (dirError) {
        console.error("𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
        throw dirError;
    }

    try {
        console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${userId}...`);
        
        // Download avatar with timeout
        const avatarResponse = await axios.get(avatarUrl, { 
            responseType: 'arraybuffer',
            timeout: 30000 
        });
        
        console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾...`);
        
        // Download template with timeout
        const templateResponse = await axios.get(templateUrl, { 
            responseType: 'arraybuffer',
            timeout: 30000 
        });

        // Save images temporarily
        const avatarBuffer = Buffer.from(avatarResponse.data);
        const templateBuffer = Buffer.from(templateResponse.data);
        
        console.log(`🎨 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾𝗌...`);
        
        // Load images with jimp
        const avatar = await jimp.read(avatarBuffer);
        const image = await jimp.read(templateBuffer);
        
        console.log(`🔧 𝖱𝖾𝗌𝗂𝗓𝗂𝗇𝗀 𝖺𝗇𝖽 𝖼𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝗂𝗇𝗀...`);
        
        // Resize images
        image.resize(512, 512);
        avatar.resize(263, 263);
        
        // Composite avatar onto template
        image.composite(avatar, 256, 258);
        
        console.log(`💾 𝖲𝖺𝗏𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾...`);
        
        // Save final image
        await image.writeAsync(outputPath);
        
        console.log(`✅ 𝖨𝗆𝖺𝗀𝖾 𝗌𝖺𝗏𝖾𝖽 𝗍𝗈: ${outputPath}`);
        
        return outputPath;
        
    } catch (error) {
        console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
        
        // Clean up if file was partially created
        try {
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
        } catch (cleanupError) {
            console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝖺𝗂𝗅𝖾𝖽 𝗂𝗆𝖺𝗀𝖾:", cleanupError.message);
        }
        
        throw error;
    }
}
