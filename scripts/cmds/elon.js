const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "elon",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "edit-image",
        shortDescription: {
            en: "𝖤𝗅𝗈𝗇 𝖬𝗎𝗌𝗄 𝗌𝗍𝗒𝗅𝖾 𝖻𝗈𝖺𝗋𝖽 𝖼𝗈𝗆𝗆𝖾𝗇𝗍 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗈𝗋"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺𝗇 𝖤𝗅𝗈𝗇 𝖬𝗎𝗌𝗄 𝗌𝗍𝗒𝗅𝖾 𝖻𝗈𝖺𝗋𝖽 𝖼𝗈𝗆𝗆𝖾𝗇𝗍 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗍𝖾𝗑𝗍"
        },
        guide: {
            en: "{p}elon [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("canvas");
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const text = args.join(" ");

            if (!text) {
                return message.reply("✨ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗒𝗈𝗎𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗈𝗋 𝖤𝗅𝗈𝗇'𝗌 𝖻𝗈𝖺𝗋𝖽!");
            }

            // Validate text length
            if (text.length > 200) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 200 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            const pathImg = __dirname + `/cache/elon_${Date.now()}.png`;
            
            try {
                // Download the Elon board template with timeout
                const response = await axios.get("https://i.imgur.com/GGmRov3.png", { 
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                await fs.writeFile(pathImg, Buffer.from(response.data, 'utf-8'));
                
                // Load and process the image
                const baseImage = await loadImage(pathImg);
                const canvas = createCanvas(baseImage.width, baseImage.height);
                const ctx = canvas.getContext("2d");
                
                ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                
                // Set font properties
                ctx.font = "bold 30px Arial";
                ctx.fillStyle = "#000000";
                ctx.textAlign = "start";
                ctx.textBaseline = "top";
                
                // Adjust font size to fit the text
                let fontSize = 40;
                let fontFits = false;
                
                while (fontSize >= 20 && !fontFits) {
                    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                    const lines = this.wrapText(ctx, text, 1160);
                    const totalHeight = lines.length * fontSize * 1.2;
                    
                    if (totalHeight <= 200 && lines.every(line => ctx.measureText(line).width <= 1160)) {
                        fontFits = true;
                        // Draw the text
                        lines.forEach((line, index) => {
                            ctx.fillText(line, 40, 115 + (index * fontSize * 1.2));
                        });
                    } else {
                        fontSize--;
                    }
                }
                
                if (!fontFits) {
                    await fs.unlink(pathImg);
                    return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀 𝖿𝗈𝗋 𝗍𝗁𝖾 𝖻𝗈𝖺𝗋𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝗌𝗁𝗈𝗋𝗍𝖾𝗋 𝗍𝖾𝗑𝗍.");
                }
                
                // Save the image
                const imageBuffer = canvas.toBuffer();
                await fs.writeFile(pathImg, imageBuffer);

                // Send the result
                await message.reply({ 
                    body: "🚀 𝖤𝗅𝗈𝗇 𝖬𝗎𝗌𝗄'𝗌 𝖻𝗈𝖺𝗋𝖽 𝖼𝗈𝗆𝗆𝖾𝗇𝗍!",
                    attachment: fs.createReadStream(pathImg) 
                });

            } catch (imageError) {
                console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", imageError);
                throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾");
            } finally {
                // Clean up
                try {
                    if (await fs.pathExists(pathImg)) {
                        await fs.unlink(pathImg);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉 𝗂𝗆𝖺𝗀𝖾:", cleanupError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝖤𝗅𝗈𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('canvas')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖿𝖺𝗂𝗅𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    },

    wrapText: function(ctx, text, maxWidth) {
        try {
            if (!text || typeof text !== 'string') {
                return [""];
            }

            // If text fits without wrapping, return as single line
            if (ctx.measureText(text).width <= maxWidth) {
                return [text];
            }

            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const testLine = currentLine + ' ' + word;
                const testWidth = ctx.measureText(testLine).width;

                if (testWidth <= maxWidth) {
                    currentLine = testLine;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            
            return lines;
        } catch (error) {
            console.error("💥 𝖶𝗋𝖺𝗉 𝖳𝖾𝗑𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
            return [text.substring(0, 50) + "..."]; // Fallback with truncated text
        }
    }
};
