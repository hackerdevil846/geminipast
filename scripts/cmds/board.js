const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
    config: {
        name: "board",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "general",
        shortDescription: {
            en: "📋 𝖡𝗈𝖺𝗋𝖽 𝖺𝗇𝖽 𝖼𝗈𝗆𝗆𝖾𝗇𝗍 𝖼𝗋𝖾𝖺𝗍𝗈𝗋"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝖻𝗈𝖺𝗋𝖽 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗍𝖾𝗑𝗍 𝖼𝗈𝗆𝗆𝖾𝗇𝗍𝗌"
        },
        guide: {
            en: "{p}board [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝖼𝖺𝗇𝗏𝖺𝗌.");
            }

            if (!args.length) {
                return message.reply("📝 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗍𝖾𝗑𝗍 𝖿𝗈𝗋 𝗍𝗁𝖾 𝖻𝗈𝖺𝗋𝖽");
            }

            const text = args.join(" ");
            
            // Validate text length
            if (text.length > 500) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 500 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            if (text.length < 1) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗏𝖺𝗅𝗂𝖽 𝗍𝖾𝗑𝗍.");
            }

            const pathImg = __dirname + `/cache/board_${Date.now()}.png`;

            try {
                // Download background image with timeout
                const getBackground = await axios.get(`https://i.imgur.com/Jl7sYMm.jpeg`, { 
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                // Load background image
                const background = await loadImage(Buffer.from(getBackground.data));
                
                // Create canvas with same dimensions as background
                const canvas = createCanvas(background.width, background.height);
                const ctx = canvas.getContext('2d');

                // Draw background
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                // Canvas text styling
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillStyle = '#000000'; // Black text color

                // Enhanced text wrapping function for canvas
                function wrapText(context, text, x, y, maxWidth, lineHeight) {
                    const words = text.split(' ');
                    const lines = [];
                    let currentLine = words[0];

                    for (let i = 1; i < words.length; i++) {
                        const word = words[i];
                        const testLine = currentLine + ' ' + word;
                        const metrics = context.measureText(testLine);
                        
                        if (metrics.width < maxWidth) {
                            currentLine = testLine;
                        } else {
                            lines.push(currentLine);
                            currentLine = word;
                        }
                    }
                    lines.push(currentLine);

                    // Draw lines
                    for (let i = 0; i < lines.length; i++) {
                        context.fillText(lines[i], x, y + (i * lineHeight));
                    }

                    return lines.length;
                }

                // Try to load custom font, fallback to system fonts
                let fontLoaded = false;
                try {
                    // Try to register a custom font if available
                    const fontPath = path.join(__dirname, 'cache', 'Arial.ttf');
                    if (fs.existsSync(fontPath)) {
                        registerFont(fontPath, { family: 'CustomFont' });
                        ctx.font = '18px CustomFont';
                        fontLoaded = true;
                    }
                } catch (fontError) {
                    console.warn("❌ 𝖢𝗎𝗌𝗍𝗈𝗆 𝖿𝗈𝗇𝗍 𝗇𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍");
                }

                if (!fontLoaded) {
                    // Use system fonts as fallback
                    ctx.font = 'bold 18px Arial, Helvetica, sans-serif';
                }

                // Text positioning and styling
                const maxWidth = 440;
                const lineHeight = 25;
                const startX = 85;
                const startY = 100;

                // Add text shadow for better readability
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;

                // Draw text with wrapping
                const lineCount = wrapText(ctx, text, startX, startY, maxWidth, lineHeight);

                // Remove shadow for other elements
                ctx.shadowColor = 'transparent';

                // Add a subtle border around text area for better visibility
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.lineWidth = 1;
                ctx.strokeRect(startX - 5, startY - 5, maxWidth + 10, (lineCount * lineHeight) + 10);

                // Save the final image
                const buffer = canvas.toBuffer('image/png');
                await fs.writeFileSync(pathImg, buffer);
                
                // Send the result
                await message.reply({ 
                    body: "✨ 𝖡𝗈𝖺𝗋𝖽 𝖼𝗈𝗆𝗆𝖾𝗇𝗍 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!",
                    attachment: fs.createReadStream(pathImg) 
                });
                
                // Cleanup with error handling
                try {
                    if (await fs.pathExists(pathImg)) {
                        await fs.unlink(pathImg);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError);
                }
                
            } catch (error) {
                console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", error);
                
                // Cleanup on error
                try {
                    if (await fs.pathExists(pathImg)) {
                        await fs.unlink(pathImg);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError);
                }
                
                let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝗂𝗆𝖺𝗀𝖾";
                
                if (error.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
                } else if (error.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                } else if (error.message.includes('Canvas')) {
                    errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖿𝖺𝗂𝗅𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                }
                
                await message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝖡𝗈𝖺𝗋𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖾𝗑𝖾𝖼𝗎𝗍𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
