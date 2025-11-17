const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "markcmt",
        aliases: ["markcomment", "fakecomment"],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "𝑒𝑑𝑖𝑡-𝑖𝑚𝑎𝑔𝑒",
        shortDescription: {
            en: "𝐹𝑎𝑘𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑏𝑦 𝑀𝑎𝑟𝑘 𝑍𝑢𝑐𝑘𝑒𝑟𝑏𝑒𝑟𝑔"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑓𝑎𝑘𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑏𝑦 𝑀𝑎𝑟𝑘 𝑍𝑢𝑐𝑘𝑒𝑟𝑏𝑒𝑟𝑔"
        },
        guide: {
            en: "{p}markcmt [𝑡𝑒𝑥𝑡]"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    onLoad: function() {
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
    },

    wrapText: function(ctx, text, maxWidth) {
        return new Promise(resolve => {
            if (!text) return resolve([]);
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
                if (words.length === 0 && line.length > 0) lines.push(line.trim());
            }
            return resolve(lines);
        });
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("canvas");
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const text = args.join(" ").trim();

            if (!text) {
                return message.reply("✏️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑡𝑒𝑥𝑡.");
            }

            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

            const pathImg = path.join(cacheDir, "markcmt.png");

            const res = await axios.get("https://i.postimg.cc/m2BW6tLy/test1.png", { 
                responseType: "arraybuffer" 
            });
            const imageBuffer = Buffer.from(res.data, "binary");
            fs.writeFileSync(pathImg, imageBuffer);

            const baseImage = await loadImage(pathImg);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            let fontSize = 20;
            ctx.textBaseline = "top";
            ctx.textAlign = "start";
            ctx.fillStyle = "#000000";
            ctx.font = `${fontSize}px Arial`;

            const maxTextWidth = 350;
            while (ctx.measureText(text).width > maxTextWidth && fontSize > 8) {
                fontSize--;
                ctx.font = `${fontSize}px Arial`;
            }

            const lines = await this.wrapText(ctx, text, maxTextWidth);

            const startX = 55;
            let startY = 60;
            const lineHeight = Math.round(fontSize * 1.25);

            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], startX, startY + i * lineHeight);
            }

            const finalBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, finalBuffer);

            await message.reply({
                body: "𝑀𝑎𝑟𝑘 𝑍𝑢𝑐𝑘𝑒𝑟𝑏𝑒𝑟𝑔-এর কমেন্ট 📝 ✨\n\n© 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
                attachment: fs.createReadStream(pathImg)
            });

            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }

        } catch (error) {
            console.error("𝑚𝑎𝑟𝑘𝑐𝑚𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 — 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
    }
};
