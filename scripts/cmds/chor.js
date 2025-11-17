const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "chor",
        aliases: [],
        version: "1.2.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 15,
        role: 0,
        category: "image",
        shortDescription: {
            en: "🖼️ 𝖢𝗋𝖾𝖺𝗍𝖾 𝖲𝖼𝗈𝗈𝖻𝗒-𝖣𝗈𝗈 '𝗀𝗈𝗍 𝖼𝖺𝗎𝗀𝗁𝗍' 𝗆𝖾𝗆𝖾𝗌"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖿𝗎𝗇𝗇𝗒 𝖲𝖼𝗈𝗈𝖻𝗒-𝖣𝗈𝗈 𝗌𝗍𝗒𝗅𝖾 '𝖼𝖺𝗎𝗀𝗁𝗍' 𝗆𝖾𝗆𝖾𝗌 𝗐𝗂𝗍𝗁 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌"
        },
        guide: {
            en: "{p}chor [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "jimp": ""
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
            }

            // Determine target user
            let targetID, targetName;
            
            if (Object.keys(event.mentions).length > 0) {
                targetID = Object.keys(event.mentions)[0];
                targetName = event.mentions[targetID];
            } else {
                targetID = event.senderID;
                const userInfo = await usersData.get(targetID);
                targetName = userInfo?.name || "𝖴𝗌𝖾𝗋";
            }

            // Create cache directory
            const cacheDir = path.join(__dirname, "chor-cache");
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }
            
            const outputPath = path.join(cacheDir, `chor_${targetID}_${Date.now()}.jpg`);
            
            // Show processing message
            const processingMsg = await message.reply(`🖌️ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 ${targetName} 𝖼𝖺𝗎𝗀𝗁𝗍 𝗆𝖾𝗆𝖾... 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍!`);

            try {
                // Create the meme
                await createMeme(targetID, outputPath);
                
                // Send result
                await message.reply({
                    body: `🚨 ${targetName} 𝗀𝗈𝗍 𝖼𝖺𝗎𝗀𝗁𝗍 𝗋𝖾𝖽-𝗁𝖺𝗇𝖽𝖾𝖽!`,
                    attachment: fs.createReadStream(outputPath)
                });
                
                // Delete processing message
                try {
                    await message.unsend(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
            } catch (memeError) {
                console.error("❌ 𝖬𝖾𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽:", memeError);
                
                // Delete processing message
                try {
                    await message.unsend(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
                const errorMessages = [
                    `❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝗎𝗀𝗁𝗍 𝗆𝖾𝗆𝖾 𝖿𝗈𝗋 ${targetName}. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.`,
                    `❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗆𝖾𝗆𝖾 𝖿𝗈𝗋 ${targetName}. 𝖲𝖾𝗋𝗏𝖾𝗋 𝗆𝖺𝗒 𝖻𝖾 𝖻𝗎𝗌𝗒.`,
                    `❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗆𝖾𝗆𝖾 𝖿𝗈𝗋 ${targetName}. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝗅𝖺𝗍𝖾𝗋.`
                ];
                
                const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                await message.reply(randomError);
            }

            // Clean up generated image
            try {
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                }
            } catch (cleanupError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗈𝗎𝗍𝗉𝗎𝗍 𝖿𝗂𝗅𝖾:", cleanupError.message);
            }

        } catch (error) {
            console.error("💥 𝖢𝗁𝗈𝗋 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('usersData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};

async function createMeme(userID, outputPath) {
    try {
        // Background template URL
        const templateURL = "https://i.imgur.com/ES28alv.png";
        
        console.log(`🎨 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾...`);
        
        // Load background with timeout
        const bgResponse = await axios.get(templateURL, { 
            responseType: 'arraybuffer',
            timeout: 30000 
        });
        const background = await jimp.read(Buffer.from(bgResponse.data));
        
        console.log(`👤 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${userID}...`);
        
        // Process and load avatar
        const avatarPath = await processAvatar(userID);
        const avatar = await jimp.read(avatarPath);
        
        // Resize avatar to fit the circular area
        await avatar.resize(110, 110);
        
        console.log(`🎭 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝗆𝖺𝗌𝗄...`);
        
        // Create circular mask for avatar
        const mask = new jimp(110, 110, 0x00000000);
        for (let x = 0; x < 110; x++) {
            for (let y = 0; y < 110; y++) {
                const distance = Math.sqrt(Math.pow(x - 55, 2) + Math.pow(y - 55, 2));
                if (distance <= 55) {
                    mask.setPixelColor(0xFFFFFFFF, x, y);
                }
            }
        }
        
        // Apply circular mask to avatar
        avatar.mask(mask, 0, 0);
        
        console.log(`🖼️ 𝖢𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝗈𝗇𝗍𝗈 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽...`);
        
        // Composite avatar onto background at correct position
        background.composite(avatar, 48, 410);
        
        // Add watermark
        try {
            const font = await jimp.loadFont(jimp.FONT_SANS_14_WHITE);
            background.print(font, 10, background.getHeight() - 25, "✨ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗒 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽");
        } catch (fontError) {
            console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗅𝗈𝖺𝖽 𝖿𝗈𝗇𝗍, 𝗌𝗄𝗂𝗉𝗉𝗂𝗇𝗀 𝗐𝖺𝗍𝖾𝗋𝗆𝖺𝗋𝗄:", fontError.message);
        }
        
        // Save image
        console.log(`💾 𝖲𝖺𝗏𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾...`);
        await background.writeAsync(outputPath);
        
        // Clean up avatar
        try {
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        } catch (avatarCleanupError) {
            console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗂𝗅𝖾:", avatarCleanupError.message);
        }
        
        console.log(`✅ 𝖬𝖾𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒: ${outputPath}`);
        
        return outputPath;
        
    } catch (error) {
        console.error("💥 𝖬𝖾𝗆𝖾 𝖢𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖤𝗋𝗋𝗈𝗋:", error);
        throw error;
    }
}

async function processAvatar(userID) {
    const cacheDir = path.join(__dirname, "chor-cache");
    const avatarPath = path.join(cacheDir, `avt_${userID}_${Date.now()}.png`);
    
    try {
        console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${userID}...`);
        
        // Download avatar with timeout
        const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const { data } = await axios.get(avatarURL, { 
            responseType: "arraybuffer",
            timeout: 30000 
        });
        
        await fs.writeFile(avatarPath, Buffer.from(data));
        
        console.log(`✅ 𝖠𝗏𝖺𝗍𝖺𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒: ${avatarPath}`);
        
        return avatarPath;
        
    } catch (error) {
        console.error("❌ 𝖠𝗏𝖺𝗍𝖺𝗋 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖤𝗋𝗋𝗈𝗋:", error);
        
        // Clean up failed avatar file
        try {
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        } catch (cleanupError) {
            console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝖺𝗂𝗅𝖾𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗂𝗅𝖾:", cleanupError.message);
        }
        
        throw error;
    }
}
