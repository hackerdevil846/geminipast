const sendWaiting = true;
const textWaiting = "𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝖾𝗉𝖺𝗋𝖺𝗍𝗂𝗈𝗇, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖺 𝗆𝗈𝗆𝖾𝗇𝗍 🕐";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports = {
    config: {
        name: "tweet-tag",
        aliases: [],
        version: "7.3.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝖾𝖽𝗂𝗍-𝗂𝗆𝖺𝗀𝖾",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝖳𝗐𝗂𝗍𝗍𝖾𝗋 𝗉𝗈𝗌𝗍 🐦"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝖳𝗐𝗂𝗍𝗍𝖾𝗋 𝗉𝗈𝗌𝗍 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗍𝖾𝗑𝗍"
        },
        guide: {
            en: "{p}tweet-tag [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    languages: {
        "en": {
            "missingInput": "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗍𝗁𝖾 𝗍𝖾𝗑𝗍 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗍𝗐𝖾𝖾𝗍!"
        }
    },

    wrapText: (ctx, text, maxWidth) => {
        return new Promise(resolve => {
            if (ctx.measureText(text).width < maxWidth) return resolve([text]);
            if (ctx.measureText('W').width > maxWidth) return resolve(null);
            const words = text.split(' ');
            const lines = [];
            let line = '';
            while (words.length > 0) {
                let split = false;
                while (ctx.measureText(words[0]).width >= maxWidth) {
                    const temp = words[0];
                    words[0] = temp.slice(0, -1);
                    if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                    else {
                        split = true;
                        words.splice(1, 0, temp.slice(-1));
                    }
                }
                if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
                else {
                    lines.push(line.trim());
                    line = '';
                }
                if (words.length === 0) lines.push(line.trim());
            }
            return resolve(lines);
        });
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

    onStart: async function({ api, event, args, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("canvas");
                require("axios");
                require("fs-extra");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
            }

            const { loadImage, createCanvas } = require("canvas");
            const fs = require("fs-extra");
            const axios = require("axios");
            const Canvas = require("canvas");

            let { senderID, threadID, messageID } = event;

            if (sendWaiting) {
                await message.reply(textWaiting);
            }

            if (!args[0]) {
                return message.reply(this.languages.en.missingInput);
            }

            let pathImg = __dirname + `/cache/tweet_${senderID}_${Date.now()}.png`;
            let pathAvata = __dirname + `/cache/avatar_${senderID}_${Date.now()}.png`;

            let text = args.join(" ");
            let uid = event.type === "message_reply" ? event.messageReply.senderID : senderID;

            // Get user info with error handling
            let res;
            try {
                res = await api.getUserInfoV2(uid);
            } catch (userError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", userError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.");
            }

            try {
                // Download avatar with timeout
                let getAvatar = (await axios.get(`https://graph.facebook.com/${uid}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                    responseType: 'arraybuffer',
                    timeout: 30000
                })).data;

                // Download background with timeout
                let bg = (await axios.get("https://i.ibb.co/xq3jLQm/Picsart-22-08-15-23-51-29-721.jpg", {
                    responseType: "arraybuffer",
                    timeout: 30000
                })).data;

                // Write files to cache
                fs.writeFileSync(pathAvata, Buffer.from(getAvatar, 'utf-8'));
                let avataruser = await this.circle(pathAvata);
                fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

                // Download font if not exists
                if (!fs.existsSync(__dirname + fonts)) {
                    try {
                        let getfont = (await axios.get(downfonts, { 
                            responseType: "arraybuffer",
                            timeout: 30000 
                        })).data;
                        fs.writeFileSync(__dirname + fonts, Buffer.from(getfont, "utf-8"));
                    } catch (fontError) {
                        console.error("❌ 𝖥𝗈𝗇𝗍 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽:", fontError.message);
                    }
                }

                // Load images
                let baseImage = await loadImage(pathImg);
                let baseAvata = await loadImage(avataruser);
                let canvas = createCanvas(baseImage.width, baseImage.height);
                let ctx = canvas.getContext("2d");

                // Draw background and avatar
                ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(baseAvata, 53, 35, 85, 85);

                // Draw tweet text
                ctx.font = "400 18px Arial";
                ctx.fillStyle = "#000000";
                ctx.textAlign = "start";
                let fontSize = 50;
                while (ctx.measureText(text).width > 1600) {
                    fontSize--;
                    ctx.font = `400 ${fontSize}px Arial`;
                }
                const lines = await this.wrapText(ctx, text, 650);
                ctx.fillText(lines.join('\n'), 56, 180);

                // Draw username
                try {
                    Canvas.registerFont(__dirname + fonts, { family: "Play-Bold" });
                } catch (fontError) {
                    console.warn("❌ 𝖥𝗈𝗇𝗍 𝗋𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍 𝖿𝗈𝗇𝗍:", fontError.message);
                }
                
                ctx.font = `bold 400 14px Arial, sans-serif`;
                ctx.fillStyle = "#3A3B3C";
                ctx.textAlign = "start";
                ctx.fillText(`${res.name || "𝖴𝗌𝖾𝗋"}`, 153, 99);

                // Save final image
                const imageBuffer = canvas.toBuffer();
                fs.writeFileSync(pathImg, imageBuffer);

                // Send result
                await message.reply({
                    body: "✅ 𝖳𝗐𝖾𝖾𝗍 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒! 🐦",
                    attachment: fs.createReadStream(pathImg)
                });

            } catch (processingError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", processingError);
                await message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            } finally {
                // Cleanup temporary files
                try {
                    if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
                    if (fs.existsSync(pathAvata)) fs.unlinkSync(pathAvata);
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝖳𝗐𝖾𝖾𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗐𝖾𝖾𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }
    }
};
