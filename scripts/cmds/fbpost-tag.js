const sendWaiting = true;
const textWaiting = "𝖨𝗆𝖺𝗀𝖾 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖺𝗍𝗂𝗈𝗇, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports = {
    config: {
        name: "fbpost-tag",
        aliases: [],
        version: "7.3.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑒𝑑𝑖𝑡-𝑖𝑚𝑎𝑔𝑒",
        shortDescription: {
            en: "𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖯𝗈𝗌𝗍 𝖢𝗋𝖾𝖺𝗍𝗈𝗋"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄-𝗌𝗍𝗒𝗅𝖾 𝗉𝗈𝗌𝗍𝗌 𝗐𝗂𝗍𝗁 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝗌"
        },
        guide: {
            en: "{p}fbpost-tag @𝗆𝖾𝗇𝗍𝗂𝗈𝗇 = 𝗍𝖾𝗑𝗍"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": "",
            "jimp": "",
            "moment-timezone": ""
        }
    },

    wrapText: function(ctx, text, maxWidth) {
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

    circle: async function(image) {
        try {
            const jimp = require("jimp");
            image = await jimp.read(image);
            image.circle();
            return await image.getBufferAsync("image/png");
        } catch (error) {
            console.error("❌ 𝖢𝗂𝗋𝖼𝗅𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
            throw error;
        }
    },

    onStart: async function({ api, event, args, message, Users }) {
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
            const path = require("path");

            const cacheDir = path.join(__dirname, "cache");
            await fs.ensureDir(cacheDir);

            const pathImg = path.join(cacheDir, `fbpost_${Date.now()}_1.png`);
            const pathAvata = path.join(cacheDir, `fbpost_${Date.now()}_2.png`);
            
            let uid;
            if (event.type == "message_reply") {
                uid = event.messageReply.senderID;
            } else if (Object.keys(event.mentions).length > 0) {
                uid = Object.keys(event.mentions)[0];
            } else {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗈𝗋 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺 𝗎𝗌𝖾𝗋!");
            }

            if (!uid || isNaN(uid)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖨𝖣!");
            }

            let userInfo;
            try {
                userInfo = await api.getUserInfoV2(uid);
                if (!userInfo || !userInfo.name) {
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈");
                }
            } catch (userError) {
                console.error("❌ 𝖴𝗌𝖾𝗋 𝗂𝗇𝖿𝗈 𝖾𝗋𝗋𝗈𝗋:", userError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.");
            }

            const work = args.join(" ");
            const fw = work.indexOf(" = ");
            
            if (fw === -1) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗈𝗋𝗆𝖺𝗍! 𝖴𝗌𝖾: @𝗆𝖾𝗇𝗍𝗂𝗈𝗇 = 𝗍𝖾𝗑𝗍");
            }

            const text = work.slice(fw + 3, work.length);
            
            if (!text || text.trim().length === 0) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗌𝗈𝗆𝖾 𝗍𝖾𝗑𝗍!");
            }

            if (sendWaiting) {
                await message.reply(textWaiting);
            }

            // Download font if not exists
            const fontPath = __dirname + fonts;
            if (!fs.existsSync(fontPath)) {
                try {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗈𝗇𝗍...");
                    const getfont = await axios.get(downfonts, { 
                        responseType: "arraybuffer",
                        timeout: 30000 
                    });
                    fs.writeFileSync(fontPath, Buffer.from(getfont.data, "utf-8"));
                    console.log("✅ 𝖥𝗈𝗇𝗍 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } catch (fontError) {
                    console.error("❌ 𝖥𝗈𝗇𝗍 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", fontError.message);
                }
            }

            try {
                const [getAvatarOne, bg] = await Promise.all([
                    axios.get(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
                        responseType: 'arraybuffer',
                        timeout: 30000 
                    }),
                    axios.get(encodeURI(`https://i.ibb.co/xq3jLQm/Picsart-22-08-15-23-51-29-721.jpg`), { 
                        responseType: "arraybuffer",
                        timeout: 30000 
                    })
                ]);

                fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne.data, 'utf-8'));
                
                // Create circular avatar with fallback
                let avataruser;
                try {
                    avataruser = await this.circle(pathAvata);
                } catch (circleError) {
                    console.error("❌ 𝖢𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅:", circleError.message);
                    avataruser = fs.readFileSync(pathAvata);
                }

                fs.writeFileSync(pathImg, Buffer.from(bg.data, "utf-8"));

                const baseImage = await loadImage(pathImg);
                const baseAvata = await loadImage(avataruser);
                const canvas = createCanvas(baseImage.width, baseImage.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(baseAvata, 11, 8, 42, 42);

                // Register font with fallback
                try {
                    registerFont(fontPath, { family: "Play-Bold" });
                    ctx.font = `bold 400 14px Play-Bold, Arial, sans-serif`;
                } catch (fontError) {
                    console.warn("❌ 𝖥𝗈𝗇𝗍 𝗋𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍:", fontError.message);
                    ctx.font = `bold 400 14px Arial, sans-serif`;
                }

                ctx.fillStyle = "#3A3B3C";
                ctx.textAlign = "start";
                ctx.fillText(`${userInfo.name}`, 58, 20);

                ctx.font = "400 18px Arial, sans-serif";
                ctx.fillStyle = "#0000FF";
                ctx.textAlign = "start";
                
                const lines = await this.wrapText(ctx, text, 470);
                if (lines) {
                    ctx.fillText(lines.join('\n'), 15, 75);
                } else {
                    ctx.fillText(text.substring(0, 50) + "...", 15, 75);
                }

                const imageBuffer = canvas.toBuffer();
                fs.writeFileSync(pathImg, imageBuffer);
                
                await message.reply({
                    body: "✅ 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖯𝗈𝗌𝗍 𝖢𝗋𝖾𝖺𝗍𝖾𝖽! 💬",
                    attachment: fs.createReadStream(pathImg)
                });

                // Cleanup files
                try {
                    if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
                    if (fs.existsSync(pathAvata)) fs.unlinkSync(pathAvata);
                    console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌");
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
                }

            } catch (downloadError) {
                console.error("❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", downloadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖥𝖡𝖯𝗈𝗌𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾";
            
            if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
