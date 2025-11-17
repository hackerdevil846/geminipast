const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "mbbank",
        aliases: ["mbcomment", "mbbankcomment"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 1,
        role: 0,
        category: "𝑒𝑑𝑖𝑡-𝑖𝑚𝑎𝑔𝑒",
        shortDescription: {
            en: "💰 𝑴𝒃𝒃𝒂𝒏𝒌 𝒆-𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑀𝑏𝑏𝑎𝑛𝑘 𝑒-𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        guide: {
            en: "{p}mbbank [𝑡𝑒𝑥𝑡]"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": ""
        }
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

            const text = args.join(" ");
            
            if (!text) {
                return message.reply("💸 | 𝑴𝒃𝒃𝒂𝒏𝒌 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒍𝒊𝒌𝒉𝒂 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏!");
            }

            let pathImg = __dirname + '/cache/mbbank.png';

            try {
                // Download template image
                const imgResponse = await axios.get(`https://i.imgur.com/VhBb8SR.png`, {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(pathImg, Buffer.from(imgResponse.data, 'utf-8'));
            } catch (error) {
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }

            // Text wrapping function
            const wrapText = (ctx, text, maxWidth) => {
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
                        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
                            line += `${words.shift()} `;
                        } else {
                            lines.push(line.trim());
                            line = '';
                        }
                        if (words.length === 0) lines.push(line.trim());
                    }
                    return resolve(lines);
                });
            };

            // Process image
            const baseImage = await loadImage(pathImg);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.font = "400 100px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "start";
            
            // Auto-adjust font size
            let fontSize = 100;
            while (ctx.measureText(text).width > 1200 && fontSize > 20) {
                fontSize--;
                ctx.font = `400 ${fontSize}px Arial`;
            }
            
            // Render wrapped text
            const lines = await wrapText(ctx, text, 470);
            ctx.fillText(lines.join('\n'), 840, 540);
            
            // Save and send
            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(pathImg, imageBuffer);
            
            await message.reply({ 
                body: "✅ | 𝑴𝒃𝒃𝒂𝒏𝒌 𝒆-𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒓𝒆𝒂𝒅𝒚! 💰",
                attachment: fs.createReadStream(pathImg) 
            });

            // Clean up
            fs.unlinkSync(pathImg);
            
        } catch (error) {
            console.error("🚫 | 𝑬𝒓𝒓𝒐𝒓:", error);
            await message.reply("😢 | 𝑪𝒐𝒎𝒎𝒆𝒏𝒕 𝒃𝒂𝒏𝒂𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏!");
        }
    }
};
