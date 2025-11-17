const axios = require("axios");
const fs = require("fs-extra");
const Canvas = require("canvas");
const jimp = require("jimp");
const superfetch = require("node-superfetch");

module.exports = {
    config: {
        name: "memberscollage",
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        category: "group",
        shortDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑜𝑓 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠' 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
        },
        guide: {
            en: "{p}memberscollage [𝑠𝑖𝑧𝑒] [#𝑐𝑜𝑙𝑜𝑟] [𝑡𝑖𝑡𝑙𝑒]"
        },
        dependencies: {
            "fs-extra": "", 
            "axios": "", 
            "canvas": "", 
            "jimp": "", 
            "node-superfetch": ""
        }
    },

    circle: async function (image) {
        image = await jimp.read(image);
        image.circle();
        return await image.getBufferAsync("image/png");
    },

    onStart: async function ({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("axios");
                require("canvas");
                require("jimp");
                require("node-superfetch");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑥𝑖𝑜𝑠, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑗𝑖𝑚𝑝, 𝑎𝑛𝑑 𝑛𝑜𝑑𝑒-𝑠𝑢𝑝𝑒𝑟𝑓𝑒𝑡𝑐ℎ.");
            }

            const { threadID } = event;

            function delay(ms) { 
                return new Promise(resolve => setTimeout(resolve, ms)); 
            }

            // Help command
            if (args[0] === 'help' || args[0] === '0' || args[0] === '-h') {
                return message.reply('𝑈𝑠𝑎𝑔𝑒: ' + this.config.name + ' [𝑎𝑣𝑡 𝑠𝑖𝑧𝑒]' + ' [𝑐𝑜𝑙𝑜𝑟 𝑐𝑜𝑑𝑒]' + ' [𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 (𝑡𝑖𝑡𝑙𝑒)]');
            }

            /*============DOWNLOAD FONTS=============*/
            if (!fs.existsSync(__dirname + '/cache/TUVBenchmark.ttf')) { 
                try {
                    let downFonts = (await axios.get(
                        'https://drive.google.com/u/0/uc?id=1NIoSu00tStE8bIpVgFjWt2in9hkiIzYz&export=download', 
                        { responseType: "arraybuffer" }
                    )).data;
                    fs.writeFileSync(__dirname + '/cache/TUVBenchmark.ttf', Buffer.from(downFonts, "utf-8"));
                } catch (error) {
                    console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑜𝑛𝑡:", error);
                }
            }

            /*===========BACKGROUND & AVATAR FRAMES==========*/
            var bg = [
                'https://i.imgur.com/P3QrAgh.jpg', 
                'https://i.imgur.com/RueGAGI.jpg', 
                'https://i.imgur.com/bwMjOdp.jpg', 
                'https://i.imgur.com/trR9fNf.jpg'
            ];
            
            var background = await Canvas.loadImage(bg[Math.floor(Math.random() * bg.length)]);
            var bgX = background.width;
            var bgY = background.height;
            var khungAvt = await Canvas.loadImage("https://i.imgur.com/gYxZFzx.png");
            
            const imgCanvas = Canvas.createCanvas(bgX, bgY);
            const ctx = imgCanvas.getContext('2d');
            ctx.drawImage(background, 0, 0, imgCanvas.width, imgCanvas.height);

            /*===============GET INFO GROUP CHAT==============*/
            const threadInfo = await message.api.getThreadInfo(threadID);
            var { participantIDs, adminIDs, name, userInfo } = threadInfo;
            var live = [], admin = [];
            
            for (let idAD of adminIDs) { 
                admin.push(idAD.id); 
            }

            /*=====================REMOVE ID DIE===================*/
            for (let idUser of userInfo) {
                if (idUser.gender != undefined) { 
                    live.push(idUser); 
                }
            }

            /*======================CUSTOM====================*/
            let size, color, title;
            var imageArea = bgX * (bgY - 200);
            var sizeParti = Math.floor(imageArea / live.length);
            var sizeAuto = Math.floor(Math.sqrt(sizeParti));
            
            if (!args[0]) { 
                size = sizeAuto; 
                color = '#FFFFFF'; 
                title = encodeURIComponent(name); 
            } else { 
                size = parseInt(args[0]); 
                color = args[1] || '#FFFFFF'; 
                title = args.slice(2).join(" ") || name; 
            }

            /*===========DISTANCE============*/
            var l = parseInt(size / 15), x = parseInt(l), y = parseInt(200), 
                xcrop = parseInt(live.length * size), ycrop = parseInt(200 + size);
            size = size - l * 2;

            /*================CREATE PATH AVATAR===============*/
            await message.reply(`🍗 𝐸𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑖𝑚𝑎𝑔𝑒: ${participantIDs.length}\n🍠 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑠𝑖𝑧𝑒: ${bgX} 𝑥 ${bgY}\n🥑 𝐴𝑣𝑎𝑡𝑎𝑟 𝑠𝑖𝑧𝑒: ${size}\n🥪 𝐶𝑜𝑙𝑜𝑟: ${color}`);

            var pathAVT = (__dirname + `/cache/${Date.now() + 10000}.png`);

            /*=================DRAW AVATAR MEMBERS==============*/
            let i = 0;
            for (let idUser of live) {
                console.log("𝐷𝑟𝑎𝑤𝑖𝑛𝑔: " + idUser.id);
                
                if (x + size > bgX) { 
                    xcrop = x; 
                    x = l; 
                    y += size + l; 
                    ycrop += size + l; 
                }
                
                if (ycrop > bgY) { 
                    ycrop -= size; 
                    break; 
                }

                try {
                    var avtUser = await superfetch.get(
                        `https://graph.facebook.com/${idUser.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
                    );
                    var avatar = await this.circle(avtUser.body);
                    var avatarload = await Canvas.loadImage(avatar);
                    
                    ctx.drawImage(avatarload, x, y, size, size);
                    
                    if (admin.includes(idUser.id)) { 
                        ctx.drawImage(khungAvt, x, y, size, size); 
                    }
                    
                    i++;
                    console.log("𝐷𝑜𝑛𝑒: " + idUser.id);
                    x += parseInt(size + l);
                } catch (e) {
                    console.log("𝑆𝑘𝑖𝑝𝑝𝑒𝑑: " + idUser.id);
                    continue;
                }
            }

            /*==================DRAW TITLE==================*/
            try {
                Canvas.registerFont(__dirname + '/cache/TUVBenchmark.ttf', { family: "TUVBenchmark" });
                ctx.font = "100px TUVBenchmark";
                ctx.fillStyle = color;
                ctx.textAlign = "center";
                ctx.fillText(decodeURIComponent(title), xcrop / 2, 133);
            } catch (error) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑟𝑎𝑤 𝑡𝑒𝑥𝑡:", error);
            }

            /*===================CUT IMAGE===================*/
            console.log(`𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑟𝑒𝑤 ${i} 𝑎𝑣𝑎𝑡𝑎𝑟𝑠`);
            console.log(`𝐹𝑖𝑙𝑡𝑒𝑟𝑒𝑑 ${participantIDs.length - i} 𝑓𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠`);
            
            try {
                const cutImage = await jimp.read(imgCanvas.toBuffer());
                cutImage.crop(0, 0, xcrop, ycrop + l - 30).writeAsync(pathAVT);
                await delay(300);
            } catch (error) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑜𝑝 𝑖𝑚𝑎𝑔𝑒:", error);
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑖𝑚𝑎𝑔𝑒");
            }

            /*====================SEND IMAGE==================*/ 
            return message.reply({
                body: `🍗 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${i}\n🥪 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑠𝑖𝑧𝑒: ${bgX} 𝑥 ${bgY}\n🍠 𝐹𝑖𝑙𝑡𝑒𝑟𝑒𝑑 ${participantIDs.length - i} 𝑓𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠`,
                attachment: fs.createReadStream(pathAVT)
            }, () => {
                if (fs.existsSync(pathAVT)) fs.unlinkSync(pathAVT);
            });

        } catch (error) {
            console.error("𝑀𝑎𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
            message.reply("❌ 𝐸𝑟𝑟𝑜𝑟: " + error.message);
        }
    }
};
