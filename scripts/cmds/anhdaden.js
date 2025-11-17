const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "anhdaden",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "White brother meme creator"
        },
        longDescription: {
            en: "Creates a white brother meme with custom text"
        },
        guide: {
            en: "{p}anhdaden [text 1] | [text 2]"
        },
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        let pathImg = null;
        
        try {
            // Validate input
            if (!args.length) {
                return message.reply("Please enter two texts separated by \"|\" symbol\nExample: /anhdaden Text 1 | Text 2");
            }

            const fullText = args.join(" ");
            const textParts = fullText.split("|").map(part => part.trim());
            
            if (textParts.length < 2 || !textParts[0] || !textParts[1]) {
                return message.reply("Please enter two texts separated by \"|\" symbol\nExample: /anhdaden Text 1 | Text 2");
            }

            const text1 = textParts[0];
            const text2 = textParts[1];

            // Create cache directory
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            pathImg = path.join(cacheDir, `anhdaden_${Date.now()}.png`);

            console.log("📥 Downloading base image...");
            
            // Download the base image with better error handling
            const imageResponse = await axios.get("https://i.imgur.com/2ggq8wM.png", {
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/png,image/*;q=0.8,*/*;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br'
                }
            });

            if (!imageResponse.data) {
                throw new Error("Failed to download image: Empty response");
            }

            fs.writeFileSync(pathImg, Buffer.from(imageResponse.data));
            console.log("✅ Base image downloaded");

            // Load and process the image
            console.log("🎨 Processing image...");
            const image = await jimp.read(pathImg);
            
            // Use bold font (jimp doesn't have built-in bold sans-serif, but we can use larger size)
            const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);

            // Text wrapping function
            function wrapText(text, maxWidth) {
                const words = text.split(' ');
                const lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    const testLine = currentLine + " " + word;
                    const width = jimp.measureText(font, testLine);
                    
                    if (width < maxWidth) {
                        currentLine = testLine;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine);
                return lines;
            }

            // Calculate text positions
            const maxWidth = 464;
            const lines1 = wrapText(text1, maxWidth);
            const lines2 = wrapText(text2, maxWidth);

            // Draw first text (top position)
            const startY1 = 100;
            lines1.forEach((line, index) => {
                const textWidth = jimp.measureText(font, line);
                const x = 170 - (textWidth / 2);
                const y = startY1 + (index * 40);
                image.print(font, x, y, line);
            });

            // Draw second text (bottom position)
            const startY2 = 410;
            lines2.forEach((line, index) => {
                const textWidth = jimp.measureText(font, line);
                const x = 170 - (textWidth / 2);
                const y = startY2 + (index * 40);
                image.print(font, x, y, line);
            });

            // Save the modified image
            await image.writeAsync(pathImg);
            console.log("✅ Image processed successfully");

            // Verify the file was created
            if (!fs.existsSync(pathImg)) {
                throw new Error("Failed to create output image");
            }

            const stats = fs.statSync(pathImg);
            if (stats.size === 0) {
                throw new Error("Output image is empty");
            }

            // Send the result
            await message.reply({
                body: "Meme created successfully! 🎨",
                attachment: fs.createReadStream(pathImg)
            });

            console.log("✅ Meme sent successfully");

        } catch (error) {
            console.error("❌ Error in anhdaden command:", error);
            
            // Provide specific error messages
            if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
                await message.reply("❌ Network error: Could not download the image. Please try again later.");
            } else if (error.response && error.response.status === 429) {
                await message.reply("❌ Rate limit exceeded: Please wait a few minutes before trying again.");
            } else if (error.message.includes('download image')) {
                await message.reply("❌ Failed to download the base image. Please try again later.");
            } else if (error.message.includes('wrapText')) {
                await message.reply("❌ Text processing error. Please try with shorter text.");
            } else {
                await message.reply("❌ Failed to create meme. Please check your text format and try again.");
            }
        } finally {
            // Clean up the temporary file
            if (pathImg && fs.existsSync(pathImg)) {
                try {
                    fs.unlinkSync(pathImg);
                    console.log("🧹 Cleaned up temporary file");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up:", cleanupError.message);
                }
            }
        }
    }
};
