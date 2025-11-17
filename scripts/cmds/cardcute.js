const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FF00";

module.exports = {
    config: {
        name: "cardcute",
        aliases: [],
        version: "2.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "info",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖼𝖺𝗋𝖽𝗌 𝗂𝗇 𝖼𝗎𝗍𝖾 𝗌𝗍𝗒𝗅𝖾"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖼𝗎𝗍𝖾 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖼𝖺𝗋𝖽𝗌 𝗐𝗂𝗍𝗁 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝖽𝖾𝗍𝖺𝗂𝗅𝗌"
        },
        guide: {
            en: "{p}cardcute [𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗎𝗌𝖾𝗋]"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": "",
            "moment-timezone": "",
            "jimp": ""
        }
    },

    circle: async (image) => {
        try {
            const jimp = require("jimp");
            image = await jimp.read(image);
            image.circle();
            return await image.getBufferAsync("image/png");
        } catch (error) {
            console.error("❌ 𝖢𝗂𝗋𝖼𝗅𝖾 𝗂𝗆𝖺𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
            throw error;
        }
    },

    onStart: async function({ api, event, args, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("canvas");
                require("axios");
                require("fs-extra");
                require("moment-timezone");
                require("jimp");
            } catch (error) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾, 𝗃𝗂𝗆𝗉", event.threadID, event.messageID);
            }

            if (this.config.author !== "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑") {
                return api.sendMessage(`⚠️ 𝖣𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝖼𝗋𝖾𝖽𝗂𝗍𝗌 𝖼𝗁𝖺𝗇𝗀𝖾! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.`, event.threadID, event.messageID);
            }

            const { loadImage, createCanvas, registerFont } = require("canvas");
            const fs = require("fs-extra");
            const axios = require("axios");
            const moment = require("moment-timezone");
            
            let uid = event.senderID;

            if (event.type === "message_reply") {
                uid = event.messageReply.senderID;
            } else if (args[0] && !isNaN(args[0])) {
                uid = args[0];
            }

            // Validate UID
            if (!uid || isNaN(uid)) {
                return api.sendMessage("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖨𝖣", event.threadID, event.messageID);
            }

            const pathImg = __dirname + `/cache/${uid}_${Date.now()}_card.png`;
            const pathAvata = __dirname + `/cache/${uid}_${Date.now()}_avt.png`;

            try {
                // Get user info with error handling
                let res;
                try {
                    res = await api.getUserInfoV2(uid);
                } catch (userError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", userError);
                    return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇", event.threadID, event.messageID);
                }

                if (!res) {
                    return api.sendMessage("❌ 𝖴𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽", event.threadID, event.messageID);
                }

                // Download user avatar with error handling
                let getAvatarOne;
                try {
                    getAvatarOne = (await axios.get(
                        `https://graph.facebook.com/${uid}/picture?height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                        { responseType: 'arraybuffer', timeout: 30000 }
                    )).data;
                } catch (avatarError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋:", avatarError);
                    return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋", event.threadID, event.messageID);
                }
                
                fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
                
                let avataruser;
                try {
                    avataruser = await this.circle(pathAvata);
                } catch (circleError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋:", circleError);
                    // Use original avatar if circle fails
                    avataruser = getAvatarOne;
                }

                // Download template background with error handling
                let bg;
                try {
                    bg = (await axios.get(encodeURI(`https://imgur.com/kSfS1wX.png`), {
                        responseType: "arraybuffer",
                        timeout: 30000
                    })).data;
                } catch (bgError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽:", bgError);
                    return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾", event.threadID, event.messageID);
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
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗈𝗇𝗍:", fontError);
                    }
                }

                // Process image
                let baseImage, baseAvata;
                try {
                    baseImage = await loadImage(pathImg);
                    baseAvata = await loadImage(avataruser);
                } catch (loadError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌:", loadError);
                    return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾𝗌", event.threadID, event.messageID);
                }

                let canvas = createCanvas(baseImage.width, baseImage.height);
                let ctx = canvas.getContext("2d");

                ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(baseAvata, 50, 130, 270, 270);

                // Process user information
                const genderMap = {
                    'male': "👨 𝖬𝖺𝗅𝖾",
                    'female': "👩 𝖥𝖾𝗆𝖺𝗅𝖾",
                    'unknown': "❓ 𝖭𝗈𝗍 𝗉𝗎𝖻𝗅𝗂𝖼"
                };

                const userInfo = {
                    name: res.name || "𝖭𝗈𝗍 𝖿𝗈𝗎𝗇𝖽",
                    gender: genderMap[res.gender] || genderMap['unknown'],
                    follow: res.follow ? `${res.follow} 𝖿𝗈𝗅𝗅𝗈𝗐𝖾𝗋𝗌` : "𝖭𝗈𝗍 𝖿𝗈𝗎𝗇𝖽",
                    relationship: res.relationship_status || "𝖭𝗈𝗍 𝗉𝗎𝖻𝗅𝗂𝖼",
                    birthday: res.birthday || "𝖭𝗈𝗍 𝖿𝗈𝗎𝗇𝖽",
                    location: res.location || "𝖭𝗈𝗍 𝖿𝗈𝗎𝗇𝖽",
                    link: res.link || `https://facebook.com/${uid}`
                };

                // Register and use custom font
                try {
                    registerFont(__dirname + `${fonts}`, { family: "Play-Bold" });
                } catch (fontError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋 𝖿𝗈𝗇𝗍, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍:", fontError);
                }

                // Draw user information
                const infoConfig = [
                    { text: `👤 𝖭𝖺𝗆𝖾: ${userInfo.name}`, y: 172, color: "#D3D3D3" },
                    { text: `⚤ 𝖦𝖾𝗇𝖽𝖾𝗋: ${userInfo.gender}`, y: 208, color: "#99CCFF" },
                    { text: `📊 𝖥𝗈𝗅𝗅𝗈𝗐𝖾𝗋𝗌: ${userInfo.follow}`, y: 244, color: "#FFFFE0" },
                    { text: `💕 𝖱𝖾𝗅𝖺𝗍𝗂𝗈𝗇𝗌𝗁𝗂𝗉: ${userInfo.relationship}`, y: 281, color: "#FFE4E1" },
                    { text: `🎂 𝖡𝗂𝗋𝗍𝗁𝖽𝖺𝗒: ${userInfo.birthday}`, y: 320, color: "#9AFF9A" },
                    { text: `📍 𝖫𝗈𝖼𝖺𝗍𝗂𝗈𝗇: ${userInfo.location}`, y: 357, color: "#FF6A6A" },
                    { text: `🆔 𝖴𝖨𝖣: ${uid}`, y: 397, color: "#EEC591" }
                ];

                infoConfig.forEach(item => {
                    try {
                        ctx.font = `${fontsInfo}px Play-Bold, Arial, sans-serif`;
                        ctx.fillStyle = item.color;
                        ctx.textAlign = "start";
                        ctx.fillText(item.text, 410, item.y);
                    } catch (textError) {
                        console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗋𝖺𝗐𝗂𝗇𝗀 𝗍𝖾𝗑𝗍:`, textError);
                    }
                });

                // Draw Facebook link
                try {
                    ctx.font = `${fontsLink}px Play-Bold, Arial, sans-serif`;
                    ctx.fillStyle = "#FFBBFF";
                    ctx.fillText(`🔗 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄: ${userInfo.link}`, 30, 450);
                } catch (linkError) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗋𝖺𝗐𝗂𝗇𝗀 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗅𝗂𝗇𝗄:", linkError);
                }

                // Save and send image
                const imageBuffer = canvas.toBuffer();
                fs.writeFileSync(pathImg, imageBuffer);

                // Clean up avatar file
                try {
                    if (fs.existsSync(pathAvata)) {
                        fs.removeSync(pathAvata);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗂𝗅𝖾:", cleanupError);
                }

                return api.sendMessage({
                    body: "✅ 𝖴𝗌𝖾𝗋 𝗂𝗇𝖿𝗈 𝖼𝖺𝗋𝖽 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!",
                    attachment: fs.createReadStream(pathImg)
                }, event.threadID, () => {
                    // Clean up card file
                    try {
                        if (fs.existsSync(pathImg)) {
                            fs.unlinkSync(pathImg);
                        }
                    } catch (cleanupError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖼𝖺𝗋𝖽 𝖿𝗂𝗅𝖾:", cleanupError);
                    }
                }, event.messageID);

            } catch (processingError) {
                console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", processingError);
                return api.sendMessage("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾", event.threadID, event.messageID);
            }

        } catch (error) {
            console.error("💥 𝖢𝖺𝗋𝖽𝖼𝗎𝗍𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            return api.sendMessage("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾", event.threadID, event.messageID);
        }
    }
};
