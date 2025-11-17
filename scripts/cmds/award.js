const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "award",
        aliases: [],
        version: "3.1.1",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝖼𝗎𝗌𝗍𝗈𝗆 𝖺𝗐𝖺𝗋𝖽 𝖼𝖾𝗋𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝖾"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖺 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗅𝗂𝗓𝖾𝖽 𝖺𝗐𝖺𝗋𝖽 𝖼𝖾𝗋𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝖾 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗇𝖺𝗆𝖾 𝖺𝗇𝖽 𝗍𝖾𝗑𝗍"
        },
        guide: {
            en: "{p}award [𝗇𝖺𝗆𝖾] | [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "canvas": "",
            "fs-extra": "",
            "axios": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check with better validation
            let dependenciesAvailable = true;
            try {
                require("canvas");
                require("fs-extra");
                require("axios");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            // Check if user provided text
            if (!args[0]) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋: 𝗇𝖺𝗆𝖾 | 𝗍𝖾𝗑𝗍\n💡 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖠𝗌𝗂𝖿 | 𝖡𝖾𝗌𝗍 𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋");
            }

            const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
            
            if (text.length < 1) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋: 𝗇𝖺𝗆𝖾 | 𝗍𝖾𝗑𝗍\n💡 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖠𝗌𝗂𝖿 | 𝖡𝖾𝗌𝗍 𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋");
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const pathImg = path.join(cacheDir, `award_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`);
            const fontPath = path.join(cacheDir, 'SVN-Arial 2.ttf');

            // Download award template with error handling
            let getImage;
            try {
                getImage = await axios.get("https://i.ibb.co/QC0hdpJ/Picsart-22-08-15-17-00-15-867.jpg", {
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                fs.writeFileSync(pathImg, Buffer.from(getImage.data));
            } catch (imageError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗐𝖺𝗋𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾:", imageError.message);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗐𝖺𝗋𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // Download font if it doesn't exist
            if (!fs.existsSync(fontPath)) {
                try {
                    const getfont = await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", {
                        responseType: 'arraybuffer',
                        timeout: 30000
                    });
                    fs.writeFileSync(fontPath, Buffer.from(getfont.data));
                } catch (fontError) {
                    console.log("❌ 𝖥𝗈𝗇𝗍 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝗌𝗒𝗌𝗍𝖾𝗆 𝖿𝗈𝗇𝗍:", fontError.message);
                }
            }

            // Load and process the image
            let baseImage;
            try {
                baseImage = await loadImage(pathImg);
            } catch (loadError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖻𝖺𝗌𝖾 𝗂𝗆𝖺𝗀𝖾:", loadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // Register and use the font
            try {
                if (fs.existsSync(fontPath)) {
                    registerFont(fontPath, { family: "SVN-Arial 2" });
                    ctx.font = "bold 30px 'SVN-Arial 2'";
                } else {
                    ctx.font = "bold 30px Arial"; // Fallback font
                }
            } catch (fontError) {
                console.warn("❌ 𝖥𝗈𝗇𝗍 𝗋𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖿𝗈𝗇𝗍:", fontError.message);
                ctx.font = "bold 30px Arial"; // Fallback font
            }

            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";

            // Text wrapping function
            const wrapText = (text, maxWidth) => {
                if (!text || typeof text !== 'string') return [''];
                const words = text.split(' ');
                const lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    const width = ctx.measureText(currentLine + " " + word).width;
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine);
                return lines;
            };

            // Draw the text with validation
            const nameText = text[0]?.trim() || "𝖭𝖺𝗆𝖾";
            const awardText = (text[1] || "𝖠𝗐𝖺𝗋𝖽")?.trim();

            const nameLine = wrapText(nameText, 464);
            const textLine = wrapText(awardText, 464);

            // Draw name text
            try {
                ctx.fillText(nameLine.join("\n"), 325, 250);
            } catch (nameError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗋𝖺𝗐𝗂𝗇𝗀 𝗇𝖺𝗆𝖾 𝗍𝖾𝗑𝗍:", nameError);
            }

            // Draw award text
            try {
                ctx.fillText(textLine.join("\n"), 325, 280);
            } catch (awardError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗋𝖺𝗐𝗂𝗇𝗀 𝖺𝗐𝖺𝗋𝖽 𝗍𝖾𝗑𝗍:", awardError);
            }

            // Save the modified image
            try {
                const imageBuffer = canvas.toBuffer();
                fs.writeFileSync(pathImg, imageBuffer);
            } catch (saveError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾:", saveError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Send the result
            await message.reply({
                body: "✨ 𝖸𝗈𝗎𝗋 𝖺𝗐𝖺𝗋𝖽 𝗂𝗌 𝗋𝖾𝖺𝖽𝗒!",
                attachment: fs.createReadStream(pathImg)
            });

            // Clean up with error handling
            try {
                if (fs.existsSync(pathImg)) {
                    fs.unlinkSync(pathImg);
                }
            } catch (cleanupError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖽𝖾𝗅𝖾𝗍𝖾 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError.message);
            }

        } catch (error) {
            console.error("💥 𝖠𝗐𝖺𝗋𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖺𝗐𝖺𝗋𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('canvas')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝗌𝗁𝗈𝗋𝗍𝖾𝗋 𝗍𝖾𝗑𝗍.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
