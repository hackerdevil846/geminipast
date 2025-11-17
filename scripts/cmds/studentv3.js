const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
    config: {
        name: "studentv3",
        aliases: [],
        version: "3.1.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "📝 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑐ℎ𝑎𝑙𝑘𝑏𝑜𝑎𝑟𝑑 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑐ℎ𝑎𝑙𝑘𝑏𝑜𝑎𝑟𝑑-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        guide: {
            en: "{p}studentv3 [𝑡𝑒𝑥𝑡]"
        },
        countDown: 5,
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    wrapText: async function(ctx, text, maxWidth) {
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
                if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
                    line += `${words.shift()} `;
                } else {
                    lines.push(line.trim());
                    line = '';
                }
                if (words.length === 0 && line) lines.push(line.trim());
            }
            return resolve(lines);
        });
    },

    onStart: async function({ message, event, args }) {
        let pathImg = '';
        
        try {
            // Dependency check
            try {
                require("canvas");
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const text = args.join(" ");

            if (!text) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑠𝑜𝑚𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑.");
            }

            // Create unique filename to avoid conflicts
            pathImg = __dirname + '/cache/studentv3_' + Date.now() + '.png';

            // Ensure cache directory exists
            await fs.ensureDir(__dirname + '/cache');

            try {
                // Download background image with timeout
                const imageResponse = await axios.get(
                    'https://i.ibb.co/64jTRkM/Picsart-22-08-14-10-22-50-196.jpg', 
                    { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    }
                );
                
                await fs.writeFile(pathImg, Buffer.from(imageResponse.data, 'binary'));

                // Load and draw canvas
                const baseImage = await loadImage(pathImg);
                const canvas = createCanvas(baseImage.width, baseImage.height);
                const ctx = canvas.getContext("2d");
                ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

                // Font settings
                let fontSize = 45;
                ctx.fillStyle = "#000000";
                ctx.textAlign = "start";
                ctx.font = `${fontSize}px Arial`;

                // Auto adjust font size with safety limit
                while (ctx.measureText(text).width > 2250 && fontSize > 12) {
                    fontSize--;
                    ctx.font = `${fontSize}px Arial`;
                }

                // Wrap text
                const lines = await this.wrapText(ctx, text, 320);
                let startY = 500;
                const lineHeight = fontSize + 10;
                
                if (lines && lines.length > 0) {
                    for (let i = 0; i < lines.length; i++) {
                        ctx.fillText(lines[i], 150, startY + (i * lineHeight));
                    }
                } else {
                    ctx.fillText(text, 150, startY);
                }

                // Save image
                const imageBuffer = canvas.toBuffer();
                await fs.writeFile(pathImg, imageBuffer);
                
                // Send the image
                await message.reply({
                    body: `✨ 𝐵𝑜𝑎𝑟𝑑 𝑟𝑒𝑎𝑑𝑦!`,
                    attachment: fs.createReadStream(pathImg)
                });

            } catch (imageError) {
                console.error("Image processing error:", imageError);
                await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }

        } catch (error) {
            console.error("StudentV3 Error:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        } finally {
            // Clean up - always run
            if (pathImg && fs.existsSync(pathImg)) {
                try {
                    fs.unlinkSync(pathImg);
                } catch (cleanupError) {
                    console.error("Cleanup error:", cleanupError);
                }
            }
        }
    }
};
