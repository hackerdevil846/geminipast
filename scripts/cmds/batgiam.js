/**
* @author 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽
* @warn 𝖣𝗈 𝗇𝗈𝗍 𝖾𝖽𝗂𝗍 𝖼𝗈𝖽𝖾 𝗈𝗋 𝖾𝖽𝗂𝗍 𝖼𝗋𝖾𝖽𝗂𝗍𝗌
*/

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const jimp = require('jimp');

module.exports = {
    config: {
        name: "batgiam",
        aliases: [],
        version: "2.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖻𝖺𝗍 𝗀𝗂𝖺𝗆 𝗆𝖾𝗆𝖾 𝗐𝗂𝗍𝗁 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖺 𝖿𝗎𝗇𝗇𝗒 𝗏𝗂𝖾𝗍𝗇𝖺𝗆𝖾𝗌𝖾 𝗀𝗈𝗏𝖾𝗋𝗇𝗆𝖾𝗇𝗍 𝖾𝗆𝗉𝗅𝗈𝗒𝗆𝖾𝗇𝗍 𝗆𝖾𝗆𝖾 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝖿𝗋𝗂𝖾𝗇𝖽'𝗌 𝖺𝗏𝖺𝗍𝖺𝗋𝗌"
        },
        guide: {
            en: "{p}batgiam [@𝗍𝖺𝗀]"
        },
        dependencies: {
            "fs-extra": "",
            "path": "",
            "axios": "",
            "jimp": ""
        }
    },

    onStart: async function ({ api, event, args, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
                require("axios");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗉𝖺𝗍𝗁, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
            }

            const { threadID, senderID } = event;
            
            // Check if user tagged someone
            if (!args[0] || !Object.keys(event.mentions).length) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
            }
            
            const mention = Object.keys(event.mentions)[0];
            const tag = event.mentions[mention].replace("@", "");
            const one = senderID;
            const two = mention;
            
            // Use the specified custom path
            const __root = path.resolve(__dirname, "..", "cache", "canvas");
            try {
                if (!fs.existsSync(__root)) {
                    fs.mkdirSync(__root, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
            }
            
            // Use the specified custom path for the template
            const templatePath = path.resolve(__dirname, "..", "cache", "canvas", "batgiam.png");
            if (!fs.existsSync(templatePath)) {
                try {
                    const { data } = await axios.get("https://i.imgur.com/ep1gG3r.png", { 
                        responseType: 'arraybuffer',
                        timeout: 30000 
                    });
                    fs.writeFileSync(templatePath, Buffer.from(data, 'binary'));
                    console.log("✅ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } catch (templateError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾:", templateError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾");
                }
            }
            
            const loadingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗀𝗈𝗏𝖾𝗋𝗇𝗆𝖾𝗇𝗍 𝖾𝗆𝗉𝗅𝗈𝗒𝗆𝖾𝗇𝗍 𝗆𝖾𝗆𝖾...");
            
            // Generate the image
            const pathImg = await makeImage({ one, two, __root, templatePath });
            
            // Get user name for personalized message
            const userName = await getUserName(api, two);
            
            // Unsend loading message
            try {
                await message.unsendMessage(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            return message.reply({ 
                body: `🎉 𝖢𝗈𝗇𝗀𝗋𝖺𝗍𝗎𝗅𝖺𝗍𝗂𝗈𝗇𝗌 ${userName}! 𝖸𝗈𝗎'𝗏𝖾 𝖻𝖾𝖾𝗇 𝗋𝖾𝖼𝗋𝗎𝗂𝗍𝖾𝖽 𝖺𝗌 𝖺 𝗀𝗈𝗏𝖾𝗋𝗇𝗆𝖾𝗇𝗍 𝖾𝗆𝗉𝗅𝗈𝗒𝖾𝖾!\n𝖶𝗂𝗌𝗁𝗂𝗇𝗀 𝗒𝗈𝗎 𝗁𝖺𝗉𝗉𝗂𝗇𝖾𝗌𝗌 𝗂𝗇 𝗒𝗈𝗎𝗋 𝗇𝖾𝗐 𝗉𝗈𝗌𝗂𝗍𝗂𝗈𝗇! 😆`,
                mentions: [{
                    tag: userName,
                    id: mention
                }],
                attachment: fs.createReadStream(pathImg) 
            }, () => {
                // Cleanup final image
                try {
                    if (fs.existsSync(pathImg)) {
                        fs.unlinkSync(pathImg);
                    }
                } catch (cleanupError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }
            });

        } catch (error) {
            console.error("💥 𝖡𝖺𝗍𝗀𝗂𝖺𝗆 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗍𝗁𝖾 𝗂𝗆𝖺𝗀𝖾!";
            
            if (error.message.includes('download') || error.message.includes('network')) {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            } else if (error.message.includes('avatar')) {
                errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            message.reply(errorMessage);
        }
    }
};

// Helper function to get user name
async function getUserName(api, userID) {
    try {
        const userInfo = await api.getUserInfo(userID);
        return userInfo[userID]?.name || "𝖿𝗋𝗂𝖾𝗇𝖽";
    } catch {
        return "𝖿𝗋𝗂𝖾𝗇𝖽";
    }
}

// Function to create the batgiam image
async function makeImage({ one, two, __root, templatePath }) {
    const pathImg = __root + `/batgiam_${one}_${two}_${Date.now()}.png`;
    const avatarOne = __root + `/avt_${one}_${Date.now()}.png`;
    const avatarTwo = __root + `/avt_${two}_${Date.now()}.png`;
    
    // Download and save avatars
    try {
        console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋𝗌...");
        const getAvatarOne = await axios.get(`https://4boxvn.com/api/avt?s=${one}`, { 
            responseType: 'arraybuffer',
            timeout: 30000 
        });
        fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'binary'));
        
        const getAvatarTwo = await axios.get(`https://4boxvn.com/api/avt?s=${two}`, { 
            responseType: 'arraybuffer',
            timeout: 30000 
        });
        fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'binary'));
        console.log("✅ 𝖠𝗏𝖺𝗍𝖺𝗋𝗌 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
    } catch (error) {
        // Cleanup on download error
        if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
        if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
        throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋𝗌");
    }
    
    try {
        console.log("🎨 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾𝗌...");
        // Process images
        let batgiam_img = await jimp.read(templatePath);
        let circleOne = await jimp.read(await circle(avatarOne));
        let circleTwo = await jimp.read(await circle(avatarTwo));
        
        // Composite images
        batgiam_img.resize(500, 500)
            .composite(circleOne.resize(100, 100), 375, 9)
            .composite(circleTwo.resize(100, 100), 160, 92);
        
        // Save and clean up
        let raw = await batgiam_img.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, raw);
        
        // Cleanup avatar files
        if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
        if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
        
        console.log("✅ 𝖨𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
        return pathImg;
    } catch (error) {
        console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", error);
        // Clean up on error
        if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
        if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
        throw error;
    }
}

// Function to create circular avatars
async function circle(imagePath) {
    try {
        const image = await jimp.read(imagePath);
        image.circle();
        return await image.getBufferAsync("image/png");
    } catch (error) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋:", error);
        throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖺𝗏𝖺𝗍𝖺𝗋 𝗂𝗆𝖺𝗀𝖾");
    }
}
