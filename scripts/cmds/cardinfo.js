const sendWaiting = true;
const textWaiting = "🖼️ | 𝖨𝗆𝖺𝗀𝖾 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖺𝗍𝗂𝗈𝗇, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖺 𝗆𝗈𝗆𝖾𝗇𝗍...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports = {
    config: {
        name: "cardinfo",
        aliases: [],
        version: "2.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "✨ 𝖢𝗋𝖾𝖺𝗍𝖾 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖼𝖺𝗋𝖽"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝖼𝖺𝗋𝖽 𝗐𝗂𝗍𝗁 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇"
        },
        guide: {
            en: "{p}cardinfo [𝗋𝖾𝗉𝗅𝗒/𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": "",
            "jimp": "",
            "moment-timezone": ""
        }
    },

    circle: async function (image) {
        try {
            const jimp = require("jimp");
            image = await jimp.read(image);
            image.circle();
            return await image.getBufferAsync("image/png");
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝗂𝗆𝖺𝗀𝖾:", error);
            throw error;
        }
    },

    onLoad: function () {
        try {
            const canvas = require("canvas");
            if (!canvas) {
                console.error("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌 𝗆𝗈𝖽𝗎𝗅𝖾");
            }
        } catch (error) {
            console.error("❌ 𝖢𝖺𝗇𝗏𝖺𝗌 𝗆𝗈𝖽𝗎𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗂𝗍");
        }
    },

    onStart: async function ({ api, event, args, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("canvas");
                require("axios");
                require("fs-extra");
                require("jimp");
                require("moment-timezone");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗃𝗂𝗆𝗉, 𝖺𝗇𝖽 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾.");
            }

            const { loadImage, createCanvas, registerFont } = require("canvas");
            const fs = require("fs-extra");
            const axios = require("axios");
            const Canvas = require("canvas");
            const moment = require("moment-timezone");
            
            let { senderID, threadID, messageID } = event;

            if (sendWaiting) {
                await message.reply(textWaiting);
            }

            let uid;
            if (event.type === "message_reply") {
                uid = event.messageReply.senderID;
            } else if (Object.keys(event.mentions).length > 0) {
                uid = Object.keys(event.mentions)[0];
            } else {
                uid = event.senderID;
            }

            // Get user info with error handling
            let userInfo;
            try {
                userInfo = await api.getUserInfo(uid);
            } catch (userError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", userError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            const userData = userInfo[uid];
            
            let pathImg = __dirname + `/cache/cardinfo_${Date.now()}_1.png`;
            let pathAvata = __dirname + `/cache/cardinfo_${Date.now()}_2.png`;

            // Download avatar with error handling
            let getAvatarOne;
            try {
                getAvatarOne = (await axios.get(
                    `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { responseType: 'arraybuffer', timeout: 30000 }
                )).data;
            } catch (avatarError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋:", avatarError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Download background with error handling
            let bg;
            try {
                bg = (await axios.get(encodeURI(`https://i.imgur.com/tW6nSDm.png`), {
                    responseType: "arraybuffer",
                    timeout: 30000
                })).data;
            } catch (bgError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽:", bgError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Create cache directory if it doesn't exist
            try {
                await fs.ensureDir(__dirname + "/cache");
            } catch (dirError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
            }

            fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
            
            // Create circular avatar with error handling
            let avataruser;
            try {
                avataruser = await this.circle(pathAvata);
            } catch (circleError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋:", circleError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖺𝗏𝖺𝗍𝖺𝗋 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

            // Download font if not exists
            if (!fs.existsSync(__dirname + `${fonts}`)) { 
                try {
                    let getfont = (await axios.get(`${downfonts}`, { 
                        responseType: "arraybuffer",
                        timeout: 30000 
                    })).data;
                    fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
                } catch (fontError) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗈𝗇𝗍:", fontError);
                }
            }

            // Load images with error handling
            let baseImage, baseAvata;
            try {
                baseImage = await loadImage(pathImg);
                baseAvata = await loadImage(avataruser);
            } catch (loadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾𝗌:", loadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            let canvas = createCanvas(baseImage.width, baseImage.height);
            let ctx = canvas.getContext("2d");
            
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseAvata, 80, 73, 285, 285);
            
            // Process user data with fallbacks
            const processedData = {
                name: userData?.name || "𝖭𝗈𝗍 𝖥𝗈𝗎𝗇𝖽",
                gender: userData?.gender === 2 ? "♂️ 𝖬𝖺𝗅𝖾" : userData?.gender === 1 ? "♀️ 𝖥𝖾𝗆𝖺𝗅𝖾" : "𝖭𝗈𝗍 𝗉𝗎𝖻𝗅𝗂𝖼",
                vanity: userData?.vanity || "𝖭𝗈𝗍 𝖥𝗈𝗎𝗇𝖽",
                profileUrl: userData?.profileUrl || "𝖭𝗈𝗍 𝖥𝗈𝗎𝗇𝖽",
                isFriend: userData?.isFriend ? "𝖸𝖾𝗌" : "𝖭𝗈"
            };

            // Register font with error handling
            try {
                registerFont(__dirname + `${fonts}`, {
                    family: "Play-Bold"
                });
            } catch (fontError) {
                console.warn("❌ 𝖥𝗈𝗇𝗍 𝗋𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍 𝖿𝗈𝗇𝗍:", fontError);
            }

            // Draw user information
            ctx.font = `${fontsInfo}px Play-Bold, Arial, sans-serif`;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "start";
            
            ctx.fillText(`👤 ${processedData.name}`, 480, 172);
            ctx.fillText(`⚥ ${processedData.gender}`, 550, 208);
            ctx.fillText(`👥 ${processedData.vanity}`, 550, 244);
            ctx.fillText(`💞 ${processedData.isFriend}`, 550, 281);
            ctx.fillText(`🎂 𝖭𝗈𝗍 𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾`, 550, 320);
            ctx.fillText(`📍 𝖭𝗈𝗍 𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾`, 550, 357);
            ctx.fillText(`🆔 ${uid}`, 550, 399);
            
            ctx.font = `${fontsLink}px Play-Bold, Arial, sans-serif`;
            ctx.fillStyle = "#0000FF";
            ctx.fillText(`🔗 ${processedData.profileUrl}`, 180, 475);

            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);

            // Clean up avatar file
            try {
                fs.removeSync(pathAvata);
            } catch (cleanupError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗂𝗅𝖾:", cleanupError);
            }

            await message.reply({
                attachment: fs.createReadStream(pathImg)
            });

            // Clean up main image file
            try {
                fs.unlinkSync(pathImg);
            } catch (cleanupError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗆𝖺𝗂𝗇 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾:", cleanupError);
            }

        } catch (error) {
            console.error("💥 𝖢𝖺𝗋𝖽𝗂𝗇𝖿𝗈 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
        }
    }
};
