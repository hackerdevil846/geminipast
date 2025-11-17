const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "bam",
        aliases: [],
        version: "2.2.2",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖲𝗅𝖺𝗉 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝖿𝗎𝗇"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖿𝗎𝗇𝗇𝗒 𝗌𝗅𝖺𝗉 𝗉𝗂𝖼 𝗐𝗂𝗍𝗁 𝗍𝖺𝗀𝗀𝖾𝖽 𝗎𝗌𝖾𝗋"
        },
        guide: {
            en: "{p}bam @𝗍𝖺𝗀"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "jimp": "",
            "path": ""
        }
    },

    onStart: async function ({ event, message, usersData, api }) {
        try {
            // 𝖣𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒 𝖼𝗁𝖾𝖼𝗄
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

            const { senderID, mentions } = event;
            const mention = Object.keys(mentions);
            
            if (!mention[0]) {
                return message.reply("𝖳𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 👊");
            }

            const one = senderID;
            const two = mention[0];
            
            // 𝖴𝗌𝖾 𝗍𝗁𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖾𝖽 𝗅𝗈𝖼𝖺𝗅 𝗉𝖺𝗍𝗁
            const imagePath = path.resolve(__dirname, '../scripts/cmds/cache/canvas/slap.png');
            
            // 𝖢𝗁𝖾𝖼𝗄 𝗂𝖿 𝗅𝗈𝖼𝖺𝗅 𝗌𝗅𝖺𝗉 𝗂𝗆𝖺𝗀𝖾 𝖾𝗑𝗂𝗌𝗍𝗌
            if (!fs.existsSync(imagePath)) {
                return message.reply("❌ 𝖲𝗅𝖺𝗉 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗆𝗂𝗌𝗌𝗂𝗇𝗀!");
            }

            // 𝖢𝗋𝖾𝖺𝗍𝖾 𝗈𝗎𝗍𝗉𝗎𝗍 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝗂𝖿 𝗂𝗍 𝖽𝗈𝖾𝗌𝗇'𝗍 𝖾𝗑𝗂𝗌𝗍
            const outputDir = path.resolve(__dirname, '../scripts/cmds/cache/canvas');
            try {
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖣𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗈𝗎𝗍𝗉𝗎𝗍 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const pathImg = path.resolve(outputDir, `slap_${one}_${two}_${Date.now()}.png`);
            
            // 𝖧𝖾𝗅𝗉𝖾𝗋 𝖿𝗎𝗇𝖼𝗍𝗂𝗈𝗇 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌
            async function circleAvatar(userId) {
                try {
                    const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                    const response = await axios.get(avatarUrl, { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    });
                    const avatar = await jimp.read(Buffer.from(response.data));
                    avatar.circle();
                    return avatar;
                } catch (error) {
                    console.error(`❌ 𝖠𝗏𝖺𝗍𝖺𝗋 𝖾𝗋𝗋𝗈𝗋 𝖿𝗈𝗋 ${userId}:`, error.message);
                    // 𝖢𝗋𝖾𝖺𝗍𝖾 𝖽𝖾𝖿𝖺𝗎𝗅𝗍 𝖺𝗏𝖺𝗍𝖺𝗋
                    try {
                        const defaultAvatar = await jimp.create(150, 150, 0x808080ff);
                        defaultAvatar.circle();
                        return defaultAvatar;
                    } catch (jimpError) {
                        console.error("❌ 𝖣𝖾𝖿𝖺𝗎𝗅𝗍 𝖺𝗏𝖺𝗍𝖺𝗋 𝖾𝗋𝗋𝗈𝗋:", jimpError);
                        throw jimpError;
                    }
                }
            }

            try {
                // 𝖢𝗋𝖾𝖺𝗍𝖾 𝗍𝗁𝖾 𝗌𝗅𝖺𝗉 𝗂𝗆𝖺𝗀𝖾
                const slap_image = await jimp.read(imagePath);
                const [circleOne, circleTwo] = await Promise.all([
                    circleAvatar(one),
                    circleAvatar(two)
                ]);
                
                slap_image.composite(circleOne.resize(150, 150), 745, 25)
                         .composite(circleTwo.resize(140, 140), 180, 40);
                
                await slap_image.writeAsync(pathImg);
                
                // 𝖲𝗁𝗈𝗋𝗍 𝖤𝗇𝗀𝗅𝗂𝗌𝗁 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌 𝖺𝗋𝗋𝖺𝗒
                const shortMessages = [
                    "𝖡𝖺𝗆! 𝖲𝗅𝖺𝗉𝗉𝖾𝖽! 👊",
                    "𝖯𝗈𝗐! 𝖱𝗂𝗀𝗁𝗍 𝗂𝗇 𝗍𝗁𝖾 𝖿𝖺𝖼𝖾! 😂",
                    "𝖲𝗅𝖺𝗉 𝗍𝗂𝗆𝖾! 👋",
                    "𝖮𝗈𝖿! 𝖳𝗁𝖺𝗍 𝗁𝖺𝖽 𝗍𝗈 𝗁𝗎𝗋𝗍! 💥",
                    "𝖶𝗁𝖺𝖼𝗄! 𝖲𝗅𝖺𝗉𝗉𝖾𝖽 𝖺𝗐𝖺𝗒! 🖐️",
                    "𝖲𝗅𝖺𝗉 𝗉𝖺𝗋𝗍𝗒! 🤚",
                    "𝖤𝗉𝗂𝖼 𝗌𝗅𝖺𝗉 𝗆𝗈𝗆𝖾𝗇𝗍! 🇺🇸"
                ];
                
                const randomMessage = shortMessages[Math.floor(Math.random() * shortMessages.length)];
                
                await message.reply({
                    body: randomMessage,
                    attachment: fs.createReadStream(pathImg)
                });
                
                // 𝖢𝗅𝖾𝖺𝗇 𝗎𝗉 𝖺𝖿𝗍𝖾𝗋 5 𝗌𝖾𝖼𝗈𝗇𝖽𝗌
                setTimeout(() => {
                    try {
                        if (fs.existsSync(pathImg)) {
                            fs.unlinkSync(pathImg);
                            console.log(`🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉: ${pathImg}`);
                        }
                    } catch (cleanupError) {
                        console.warn("❌ 𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
                    }
                }, 5000);
                
            } catch (processingError) {
                console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", processingError);
                await message.reply("❌ 𝖲𝗅𝖺𝗉 𝖿𝖺𝗂𝗅𝖾𝖽! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }
            
        } catch (error) {
            console.error("💥 𝖲𝗅𝖺𝗉 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖲𝗅𝖺𝗉 𝖿𝖺𝗂𝗅𝖾𝖽! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    }
};
