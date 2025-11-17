const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    config: {
        name: "mia",
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑐𝑢𝑠𝑡𝑜𝑚 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑒𝑥𝑡"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡 𝑜𝑣𝑒𝑟𝑙𝑎𝑖𝑑 𝑜𝑛 𝑎 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑"
        },
        category: "𝑒𝑑𝑖𝑡-𝑖𝑚𝑎𝑔𝑒",
        guide: {
            en: "{p}mia [𝑡𝑒𝑥𝑡]"
        },
        countDown: 5,
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "canvas": ""
        }
    },

    onLoad: function() {
        try {
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        } catch (e) {
            console.error('𝑚𝑖𝑎 𝑜𝑛𝐿𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:', e);
        }
    },

    wrapText: function(ctx, text, maxWidth) {
        return new Promise((resolve) => {
            if (!text) return resolve([]);
            const words = text.split(' ');
            const lines = [];
            let line = '';

            for (let n = 0; n < words.length; n++) {
                const testLine = line ? line + ' ' + words[n] : words[n];
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidth && line) {
                    lines.push(line);
                    line = words[n];
                } else {
                    line = testLine;
                }
            }
            if (line) lines.push(line);
            resolve(lines);
        });
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("axios");
                require("canvas");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑐𝑎𝑛𝑣𝑎𝑠.");
            }

            const text = args.join(' ').trim();

            if (!text) {
                return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 ✍️");
            }

            // Keep same image link and same path pattern as requested
            const BASE_IMAGE_URL = 'https://i.postimg.cc/Jh86TFLn/Pics-Art-08-14-10-45-31.jpg';

            // Ensure cache folder exists
            const cacheDir = path.join(__dirname, 'cache');
            try {
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
            } catch (e) {
                console.error('𝐶𝑎𝑛𝑛𝑜𝑡 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟:', e);
            }

            const outPath = path.join(cacheDir, `mia_${Date.now()}.png`);

            // Download base image (arraybuffer)
            const res = await axios.get(BASE_IMAGE_URL, { responseType: 'arraybuffer' });
            fs.writeFileSync(outPath, Buffer.from(res.data, 'binary'));

            // Load base image
            const baseImage = await loadImage(outPath);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext('2d');

            // Draw base image to canvas
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // Initial font setup (we will dynamically adjust)
            let fontSize = 250;
            const minFont = 45;
            const maxTotalWidth = 2600;
            const wrapMaxWidth = 1160;

            // Set a font for measurement & wrapping; reduce until the text measure fits threshold
            ctx.textBaseline = 'top';
            ctx.textAlign = 'start';

            while (fontSize >= minFont) {
                ctx.font = `${fontSize}px Arial`;
                const measured = ctx.measureText(text).width;
                if (measured <= maxTotalWidth) break;
                fontSize--;
            }
            if (fontSize < minFont) fontSize = minFont;
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = '#000000';

            // Get wrapped lines
            const lines = await this.wrapText(ctx, text, wrapMaxWidth);

            // Draw lines one by one at coordinates same as original (x:60, y start:165)
            const startX = 60;
            let startY = 165;
            const lineHeight = Math.round(fontSize * 1.15);
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], startX, startY + (i * lineHeight));
            }

            // Save canvas to file (overwrite outPath)
            fs.writeFileSync(outPath, canvas.toBuffer());

            // Send message with emoji & cleanup
            await message.reply({
                body: "𝐻𝑒𝑟𝑒 𝑦𝑜𝑢 𝑔𝑜 — 𝑚𝑎𝑑𝑒 𝑤𝑖𝑡ℎ 𝑙𝑜𝑣𝑒 ❤️ ✨",
                attachment: fs.createReadStream(outPath)
            });

            // Clean up
            fs.unlinkSync(outPath);

        } catch (error) {
            console.error('𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑚𝑖𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:', error);
            await message.reply("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟. ❌");
        }
    }
};
