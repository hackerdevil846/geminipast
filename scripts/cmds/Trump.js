const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "trump",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "Generate a Trump tweet image"
        },
        longDescription: {
            en: "Creates an image of a Trump tweet with your custom text"
        },
        guide: {
            en: "{p}trump [text]"
        },
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        let imagePath = null;
        
        try {
            const text = args.join(" ");
            
            if (!text) {
                return message.reply("❌ Please enter your message for Trump's tweet 📝");
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            imagePath = path.join(cacheDir, `trump_${Date.now()}.png`);
            
            // Download the Trump tweet template with better error handling
            console.log("📥 Downloading Trump template...");
            try {
                const response = await axios.get("https://i.imgur.com/ZtWfHHx.png", {
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!response.data || response.data.length === 0) {
                    throw new Error("Empty response data");
                }

                fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
                console.log("✅ Template downloaded successfully");
                
            } catch (downloadError) {
                console.error("❌ Template download failed:", downloadError.message);
                return message.reply("❌ Failed to download template image. Please try again later.");
            }

            // Load the image with jimp
            console.log("🖼️ Loading image with Jimp...");
            const image = await jimp.read(imagePath);
            
            // Use bold font - Jimp's built-in bold font
            const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
            console.log("✅ Font loaded successfully");

            // Enhanced text wrapping function for jimp
            function wrapText(text, maxWidth) {
                const words = text.split(' ');
                const lines = [];
                let currentLine = '';

                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    const testLine = currentLine ? currentLine + ' ' + word : word;
                    const testWidth = jimp.measureText(font, testLine);
                    
                    if (testWidth > maxWidth && currentLine !== '') {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                }
                
                if (currentLine) {
                    lines.push(currentLine);
                }
                return lines;
            }

            // Wrap text and draw on image
            const maxWidth = 500;
            const lines = wrapText(text, maxWidth);
            const x = 60;
            const y = 165;
            const lineHeight = 35;

            console.log(`📝 Drawing ${lines.length} lines of text...`);

            // Draw each line of text
            lines.forEach((line, index) => {
                const currentY = y + (index * lineHeight);
                // Ensure text stays within image bounds
                if (currentY < image.bitmap.height - 50) {
                    image.print(font, x, currentY, line);
                }
            });

            // Save the modified image
            console.log("💾 Saving modified image...");
            await image.writeAsync(imagePath);

            // Verify the image was saved
            if (fs.existsSync(imagePath)) {
                const stats = fs.statSync(imagePath);
                if (stats.size > 0) {
                    // Send the image
                    await message.reply({
                        body: "✅ Here's your Trump message! 🇺🇸",
                        attachment: fs.createReadStream(imagePath)
                    });
                    console.log("✅ Trump tweet sent successfully");
                } else {
                    throw new Error("Generated image file is empty");
                }
            } else {
                throw new Error("Failed to save generated image");
            }
            
        } catch (error) {
            console.error("💥 Error in trump command:", error);
            
            let errorMessage = "❌ Failed to generate Trump tweet. Please try again.";
            
            if (error.message.includes('ENOENT')) {
                errorMessage = "❌ File system error. Please check permissions.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ Request timeout. Please try again later.";
            } else if (error.message.includes('font')) {
                errorMessage = "❌ Font loading error. Using default font.";
            }
            
            await message.reply(errorMessage);
            
        } finally {
            // Clean up generated image
            if (imagePath && fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                    console.log("🧹 Cleaned up temporary image");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up:", cleanupError.message);
                }
            }
        }
    }
};
