const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsName = 45;
const fontsInfo = 33;
const fontsOthers = 27;
const colorName = "#000000";

module.exports = {
    config: {
        name: "cardbox",
        aliases: [],
        version: "2.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 10,
        role: 0,
        category: "info",
        shortDescription: {
            en: "📋 𝖦𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖼𝖺𝗋𝖽 𝗐𝗂𝗍𝗁 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝖽𝖾𝗌𝗂𝗀𝗇"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝗌 𝖺 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖼𝖺𝗋𝖽 𝗐𝗂𝗍𝗁 𝖽𝖾𝗍𝖺𝗂𝗅𝗌"
        },
        guide: {
            en: "{p}cardbox [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": "",
            "jimp": "",
            "moment-timezone": "",
            "path": ""
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

    onStart: async function ({ api, event, args, message }) {
        let pathImg, pathAva, pathAvata, pathAvata2, pathAvata3;
        
        try {
            // Check dependencies
            const requiredModules = ["canvas", "axios", "fs-extra", "jimp", "path"];
            for (const mod of requiredModules) {
                try {
                    require.resolve(mod);
                } catch {
                    throw new Error(`❌ ${mod} 𝗆𝗈𝖽𝗎𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽`);
                }
            }

            const { loadImage, createCanvas, registerFont } = require("canvas");
            const fs = require("fs-extra");
            const axios = require("axios");
            const jimp = require("jimp");
            const path = require("path");
            
            let { senderID, threadID } = event;
            pathImg = __dirname + `/cache/${senderID}_${Date.now()}.png`;
            pathAva = __dirname + `/cache/avtuserthread_${Date.now()}.png`;
            pathAvata = __dirname + `/cache/avtuserrd_${Date.now()}.png`;
            pathAvata2 = __dirname + `/cache/avtuserrd2_${Date.now()}.png`;
            pathAvata3 = __dirname + `/cache/avtuserrd3_${Date.now()}.png`;
            
            // Get thread info with error handling
            let threadInfo;
            try {
                threadInfo = await api.getThreadInfo(threadID);
            } catch (threadError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            let threadName = threadInfo.threadName || "𝖴𝗇𝗇𝖺𝗆𝖾𝖽 𝖦𝗋𝗈𝗎𝗉";
            var nameMen = [];
            var gendernam = [];
            var gendernu = [];
            var nope = [];

            for (let z in threadInfo.userInfo) {
                var gioitinhone = threadInfo.userInfo[z].gender;
                var nName = threadInfo.userInfo[z].name;

                if (gioitinhone == 'MALE') {
                    gendernam.push(z + gioitinhone);
                } else if (gioitinhone == 'FEMALE') {
                    gendernu.push(gioitinhone);
                } else {
                    nope.push(nName);
                }
            }

            var nam = gendernam.length;
            var nu = gendernu.length;
            let qtv = threadInfo.adminIDs?.length || 0;
            let sl = threadInfo.messageCount || 0;
            let threadMem = threadInfo.participantIDs?.length || 0;
            const Canvas = require("canvas");
            const __root = path.resolve(__dirname, "cache");
            var qtv2 = threadInfo.adminIDs || [];
            var idad = qtv2.length > 0 ? qtv2[Math.floor(Math.random() * qtv)] : { id: threadInfo.participantIDs?.[0] };
            let idmem = threadInfo.participantIDs || []
            var idmemrd = idmem.length > 0 ? idmem[Math.floor(Math.random() * threadMem)] : threadID;
            var idmemrd1 = idmem.length > 1 ? idmem[Math.floor(Math.random() * threadMem)] : threadID;
            
            // Download images with error handling
            let getAvatarOne, getAvatarOne2, getAvatarOne3, Avatar, getWanted;
            
            try {
                getAvatarOne = (await axios.get(`https://graph.facebook.com/${idad.id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
                    responseType: 'arraybuffer',
                    timeout: 30000 
                })).data;
            } catch (error) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝖽𝗆𝗂𝗇 𝖺𝗏𝖺𝗍𝖺𝗋:", error);
                getAvatarOne = Buffer.from([]);
            }

            try {
                getAvatarOne2 = (await axios.get(`https://graph.facebook.com/${idmemrd}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
                    responseType: 'arraybuffer',
                    timeout: 30000 
                })).data;
            } catch (error) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗆𝖾𝗆𝖻𝖾𝗋 1 𝖺𝗏𝖺𝗍𝖺𝗋:", error);
                getAvatarOne2 = Buffer.from([]);
            }

            try {
                getAvatarOne3 = (await axios.get(`https://graph.facebook.com/${idmemrd1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
                    responseType: 'arraybuffer',
                    timeout: 30000 
                })).data;
            } catch (error) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗆𝖾𝗆𝖻𝖾𝗋 2 𝖺𝗏𝖺𝗍𝖺𝗋:", error);
                getAvatarOne3 = Buffer.from([]);
            }

            try {
                Avatar = (
                    await axios.get(encodeURI(`${threadInfo.imageSrc || `https://graph.facebook.com/${threadID}/picture?width=512&height=512`}`),
                    { 
                        responseType: "arraybuffer",
                        timeout: 30000 
                    })
                ).data;
            } catch (error) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗀𝗋𝗈𝗎𝗉 𝗂𝗆𝖺𝗀𝖾:", error);
                Avatar = Buffer.from([]);
            }

            try {
                getWanted = (
                    await axios.get(encodeURI(`https://i.imgur.com/zVvx3bq.png`), {
                        responseType: "arraybuffer",
                        timeout: 30000
                    })
                ).data;
            } catch (error) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾:", error);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗋𝖾𝗌𝗈𝗎𝗋𝖼𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }
            
            // Write files with error handling
            try {
                if (Avatar.length > 0) fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
                if (getAvatarOne.length > 0) fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
                if (getAvatarOne2.length > 0) fs.writeFileSync(pathAvata2, Buffer.from(getAvatarOne2, 'utf-8'));
                if (getAvatarOne3.length > 0) fs.writeFileSync(pathAvata3, Buffer.from(getAvatarOne3, 'utf-8'));
                fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
            } catch (fileError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾 𝖿𝗂𝗅𝖾𝗌:", fileError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            /*-----------------download----------------------*/
            if(!fs.existsSync(__dirname+`${fonts}`)) { 
                try {
                    let getfont = (await axios.get(`${downfonts}`, { 
                        responseType: "arraybuffer",
                        timeout: 30000 
                    })).data;
                    fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
                } catch (fontError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗈𝗇𝗍:", fontError);
                }
            };
            /*---------------------------------------------*/

            // Process images with error handling
            let baseImage, baseAva, baseAvata, baseAvata2, baseAvata3;
            
            try {
                baseImage = await loadImage(pathImg);
                if (fs.existsSync(pathAva)) baseAva = await loadImage(await this.circle(pathAva));
                if (fs.existsSync(pathAvata)) baseAvata = await loadImage(await this.circle(pathAvata));
                if (fs.existsSync(pathAvata2)) baseAvata2 = await loadImage(await this.circle(pathAvata2));
                if (fs.existsSync(pathAvata3)) baseAvata3 = await loadImage(await this.circle(pathAvata3));
            } catch (imageError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌:", imageError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            let canvas = createCanvas(baseImage.width, baseImage.height);
            let ctx = canvas.getContext("2d");
            let text = args.join(" ") || threadName;
            let id = threadInfo.threadID;
            
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            if (baseAva) ctx.drawImage(baseAva, 80, 73, 285, 285);
            if (baseAvata) ctx.drawImage(baseAvata, 450, 422, 43, 43);
            if (baseAvata2) ctx.drawImage(baseAvata2, 500, 422, 43, 43);
            if (baseAvata3) ctx.drawImage(baseAvata3, 550, 422, 43, 43);
            
            ctx.font = `700 ${fontsName}px Arial`;
            ctx.fillStyle = `${colorName}`;
            ctx.textAlign = "start";
            ctx.fillText(text, 435, 125);
            
            try {
                registerFont(__dirname+`${fonts}`, {
                    family: "Lobster"
                });
            } catch (fontError) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋 𝖿𝗈𝗇𝗍, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍:", fontError);
            }
            
            ctx.font = `${fontsInfo}px Lobster, Arial`;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "start";
            ctx.fillText(`👥 𝖬𝖾𝗆𝖻𝖾𝗋𝗌: ${threadMem}`, 439, 199);
            ctx.fillText(`👑 𝖠𝖽𝗆𝗂𝗇𝗌: ${qtv}`, 439, 243);
            ctx.fillText(`🚹 𝖬𝖺𝗅𝖾𝗌: ${nam}`, 439, 287);
            ctx.fillText(`🚺 𝖥𝖾𝗆𝖺𝗅𝖾𝗌: ${nu}`, 439, 331);
            ctx.fillText(`💬 𝖬𝖾𝗌𝗌𝖺𝗀𝖾𝗌: ${sl}`, 439, 379);
            
            ctx.font = `${fontsOthers}px Lobster, Arial`;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "start";
            ctx.fillText(`📦 𝖡𝗈𝗑 𝖨𝖣: ${id}`, 18, 470);
            ctx.fillText(`➕ 𝖠𝗇𝖽 ${parseInt(threadMem)-3} 𝗈𝗍𝗁𝖾𝗋 𝗆𝖾𝗆𝖻𝖾𝗋𝗌...`, 607, 453);
            
            ctx.beginPath();
            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);

            return message.reply({
                body: "✅ 𝖦𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖼𝖺𝗋𝖽 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!",
                attachment: fs.createReadStream(pathImg)
            }).then(() => {
                // Cleanup files
                const filesToDelete = [pathImg, pathAva, pathAvata, pathAvata2, pathAvata3];
                filesToDelete.forEach(file => {
                    try {
                        if (fs.existsSync(file)) fs.unlinkSync(file);
                    } catch (cleanupError) {
                        console.warn(`❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖽𝖾𝗅𝖾𝗍𝖾 ${file}:`, cleanupError.message);
                    }
                });
            });
            
        } catch (error) {
            console.error("💥 𝖢𝖺𝗋𝖽𝖻𝗈𝗑 𝖾𝗋𝗋𝗈𝗋:", error);
            
            // Cleanup on error
            const filesToDelete = [pathImg, pathAva, pathAvata, pathAvata2, pathAvata3];
            filesToDelete.forEach(file => {
                try {
                    if (file && fs.existsSync(file)) fs.unlinkSync(file);
                } catch (cleanupError) {
                    console.warn(`❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖽𝖾𝗅𝖾𝗍𝖾 ${file}:`, cleanupError.message);
                }
            });
            
            return message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
        }
    }
};
