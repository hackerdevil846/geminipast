const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports = {
    config: {
        name: "enrile",
        aliases: [],
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 15,
        role: 0,
        category: "edit-image",
        shortDescription: {
            en: "𝖤𝗇𝗋𝗂𝗅𝖾'𝗌 𝖻𝖺𝗅𝗅𝗈𝗈𝗇 𝖼𝗈𝗆𝗆𝖾𝗇𝗍 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗈𝗋"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝗌 𝖺 𝖻𝖺𝗅𝗅𝗈𝗈𝗇 𝖼𝗈𝗆𝗆𝖾𝗇𝗍 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝖤𝗇𝗋𝗂𝗅𝖾'𝗌 𝗌𝗍𝗒𝗅𝖾"
        },
        guide: {
            en: "{p}enrile [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": ""
        },
        envConfig: {
            fontStyle: "𝖻𝗈𝗅𝖽 60𝗉𝗑 𝖠𝗋𝗂𝖺𝗅",
            textColor: "#𝖥𝖥𝖥𝖥𝖥𝖥",
            textX: 500,
            textY: 450,
            maxWidth: 600
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
                return message.reply("✨ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗒𝗈𝗎𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗈𝗋 𝖤𝗇𝗋𝗂𝗅𝖾'𝗌 𝖻𝖺𝗅𝗅𝗈𝗈𝗇!");
            }

            // Validate text length
            if (text.length > 200) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 200 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            const cacheDir = path.join(__dirname, "cache");
            const pathImg = path.join(cacheDir, `enrile_${Date.now()}.png`);

            // Ensure cache directory exists
            try {
                await fs.ensureDir(cacheDir);
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            try {
                // Download base image with timeout
                console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾...");
                const { data } = await axios.get("https://i.imgur.com/1plDf6o.png", { 
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                await fs.writeFileSync(pathImg, Buffer.from(data, 'utf-8'));

                // Verify image was downloaded
                const stats = await fs.stat(pathImg);
                if (stats.size === 0) {
                    throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗂𝗆𝖺𝗀𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }

                console.log("✅ 𝖡𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");

                // Process image
                const baseImage = await loadImage(pathImg);
                const canvas = createCanvas(baseImage.width, baseImage.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                
                // Register font with fallback
                try {
                    registerFont(path.join(__dirname, "fonts", "Arial.ttf"), { family: "Arial" });
                } catch (fontError) {
                    console.warn("⚠️ 𝖢𝗎𝗌𝗍𝗈𝗆 𝖿𝗈𝗇𝗍 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍 𝖿𝗈𝗇𝗍");
                }

                // Text styling
                ctx.font = "bold 60px Arial, sans-serif";
                ctx.fillStyle = "#FFFFFF";
                ctx.textAlign = "start";
                
                // Text wrapping function with better error handling
                const wrapText = (ctx, text, maxWidth) => {
                    try {
                        const words = text.split(' ');
                        const lines = [];
                        let line = '';

                        for (let i = 0; i < words.length; i++) {
                            const testLine = line + words[i] + ' ';
                            const metrics = ctx.measureText(testLine);
                            const testWidth = metrics.width;
                            
                            if (testWidth > maxWidth && i > 0) {
                                lines.push(line.trim());
                                line = words[i] + ' ';
                            } else {
                                line = testLine;
                            }
                        }
                        lines.push(line.trim());
                        return lines;
                    } catch (wrapError) {
                        console.error("❌ 𝖳𝖾𝗑𝗍 𝗐𝗋𝖺𝗉𝗉𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", wrapError);
                        return [text]; // Return original text as single line
                    }
                };

                const lines = wrapText(ctx, text, 600);
                
                // Draw text lines
                const lineHeight = 70;
                const startY = 450;
                
                for (let i = 0; i < lines.length; i++) {
                    ctx.fillText(lines[i], 500, startY + (i * lineHeight));
                }

                // Save and send
                const buffer = canvas.toBuffer();
                await fs.writeFileSync(pathImg, buffer);
                
                console.log("✅ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝖾");

                await message.reply({
                    body: `🎈 𝖤𝗇𝗋𝗂𝗅𝖾'𝗌 𝖻𝖺𝗅𝗅𝗈𝗈𝗇 𝖼𝗈𝗆𝗆𝖾𝗇𝗍:\n"${text}"`,
                    attachment: fs.createReadStream(pathImg)
                });

            } catch (processingError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", processingError);
                throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾: ${processingError.message}`);
            } finally {
                // Clean up
                try {
                    if (await fs.pathExists(pathImg)) {
                        await fs.unlink(pathImg);
                        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                    }
                } catch (cleanupError) {
                    console.warn("⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝖤𝗇𝗋𝗂𝗅𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖤𝗇𝗋𝗂𝗅𝖾 𝖼𝗈𝗆𝗆𝖾𝗇𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
