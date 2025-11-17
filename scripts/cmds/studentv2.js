const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas, registerFont } = require("canvas");

module.exports = {
    config: {
        name: "studentv2",
        aliases: [],
        version: "3.1.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "🎓 𝐵𝑜𝑎𝑟𝑑 𝑎𝑛𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑚𝑒𝑚𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑠𝑡𝑢𝑑𝑒𝑛𝑡 𝑏𝑜𝑎𝑟𝑑 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        guide: {
            en: "{p}studentv2 [𝑡𝑒𝑥𝑡]"
        },
        countDown: 5,
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    wrapText: async function(ctx, text, maxWidth) {
        return new Promise((resolve) => {
            try {
                if (!text || typeof text !== 'string') return resolve([]);
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
                        if (split) {
                            words[1] = `${temp.slice(-1)}${words[1]}`;
                        } else {
                            split = true;
                            words.splice(1, 0, temp.slice(-1));
                        }
                    }
                    
                    const testLine = line + words[0] + ' ';
                    const metrics = ctx.measureText(testLine);
                    
                    if (metrics.width < maxWidth || line === '') {
                        line = testLine;
                        words.shift();
                    } else {
                        lines.push(line.trim());
                        line = words.shift() + ' ';
                    }
                    
                    if (words.length === 0) {
                        lines.push(line.trim());
                    }
                }
                resolve(lines.filter(line => line && line.trim() !== ''));
            } catch (error) {
                console.error("Text wrapping error:", error);
                resolve([text]); // Fallback to single line
            }
        });
    },

    onStart: async function({ message, event, args }) {
        let pathImg = null;
        
        try {
            // 🛡️ Dependency check
            try {
                require("canvas");
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const text = args.join(" ").trim();

            if (!text) {
                return message.reply("🎓 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑝𝑢𝑡 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑!\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: .𝑠𝑡𝑢𝑑𝑒𝑛𝑡𝑣2 𝐻𝑒𝑙𝑙𝑜 𝑊𝑜𝑟𝑙𝑑");
            }

            if (text.length > 500) {
                return message.reply("❌ 𝑇𝑒𝑥𝑡 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑘𝑒𝑒𝑝 𝑖𝑡 𝑢𝑛𝑑𝑒𝑟 500 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠.");
            }

            pathImg = __dirname + '/cache/studentv2_' + event.senderID + '_' + Date.now() + '.png';

            // 🛡️ Ensure cache directory exists
            await fs.ensureDir(__dirname + '/cache');

            // 🛡️ Download image with timeout
            const imageResponse = await axios.get('https://i.ibb.co/FK8DTp1/Picsart-22-08-14-02-13-31-581.jpg', {
                responseType: 'arraybuffer',
                timeout: 15000,
                validateStatus: function (status) {
                    return status >= 200 && status < 300;
                }
            });

            if (!imageResponse.data || imageResponse.data.length === 0) {
                throw new Error("𝐸𝑚𝑝𝑡𝑦 𝑖𝑚𝑎𝑔𝑒 𝑑𝑎𝑡𝑎 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑");
            }

            await fs.writeFile(pathImg, Buffer.from(imageResponse.data, 'binary'));

            // 🛡️ Load and process image
            const baseImage = await loadImage(pathImg);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");

            // Draw base image
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // 🛡️ Text settings with fallback fonts
            let fontSize = 45;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            // Apply rotation
            ctx.save();
            ctx.translate(0, 0);
            ctx.rotate(-3 * Math.PI / 180);

            // 🛡️ Font selection with fallbacks
            const fontFamilies = [
                'Arial',
                'Helvetica',
                'sans-serif',
                'DejaVu Sans',
                'Liberation Sans'
            ];
            
            let currentFont = `bold ${fontSize}px ${fontFamilies.join(', ')}`;
            ctx.font = currentFont;

            // 🛡️ Adjust font size to fit
            while (ctx.measureText(text).width > 2200 && fontSize > 12) {
                fontSize--;
                currentFont = `bold ${fontSize}px ${fontFamilies.join(', ')}`;
                ctx.font = currentFont;
            }

            // 🛡️ Wrap text
            const lines = await this.wrapText(ctx, text, 440);
            const lineHeight = fontSize * 1.3;
            const startY = 500;

            // 🛡️ Draw text lines
            if (lines && lines.length > 0) {
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] && lines[i].trim() !== '') {
                        ctx.fillText(lines[i], 90, startY + (i * lineHeight));
                    }
                }
            } else {
                ctx.fillText(text, 90, startY);
            }

            ctx.restore();

            // 🛡️ Save image
            const imageBuffer = canvas.toBuffer('image/png', { compressionLevel: 6 });
            await fs.writeFile(pathImg, imageBuffer);

            // 🛡️ Send result
            await message.reply({
                body: "🎓 𝑆𝑡𝑢𝑑𝑒𝑛𝑡 𝐵𝑜𝑎𝑟𝑑 𝑀𝑒𝑚𝑒 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! ✨",
                attachment: fs.createReadStream(pathImg)
            });

        } catch (error) {
            console.error("🎓 StudentV2 Error:", error);
            
            let errorMessage = "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            
            if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
                errorMessage = "❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
            } else if (error.message.includes('canvas')) {
                errorMessage = "❌ 𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑠𝑢𝑟𝑒 𝑐𝑎𝑛𝑣𝑎𝑠 𝑖𝑠 𝑝𝑟𝑜𝑝𝑒𝑟𝑙𝑦 𝑖𝑛𝑠𝑡𝑎𝑙𝑙𝑒𝑑.";
            }
            
            await message.reply(errorMessage);
        } finally {
            // 🛡️ Always clean up files
            if (pathImg && fs.existsSync(pathImg)) {
                try {
                    await fs.unlink(pathImg);
                } catch (cleanupError) {
                    console.error("🧹 Cleanup error:", cleanupError);
                }
            }
        }
    }
};
