const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "obama",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "Obama's tweet creator"
        },
        longDescription: {
            en: "Creates a tweet image with Obama's picture"
        },
        guide: {
            en: "{p}obama [text]"
        },
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        let imagePath = null;
        
        try {
            const text = args.join(" ");
            
            if (!text) {
                return message.reply("❌ Please enter your message for Obama's tweet!");
            }

            // Validate text length
            if (text.length > 280) {
                return message.reply("❌ Text too long! Please keep it under 280 characters.");
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            imagePath = path.join(cacheDir, `obama_tweet_${Date.now()}.png`);
            
            console.log("📥 Downloading Obama template...");
            
            // Download the Obama tweet template with better error handling
            const response = await axios.get("https://i.imgur.com/6fOxdex.png", {
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/png,image/*;q=0.8,*/*;q=0.5'
                }
            });

            if (!response.data) {
                throw new Error("Failed to download template image");
            }

            fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

            console.log("🎨 Processing image...");
            
            // Load the image with jimp
            const image = await jimp.read(imagePath);
            
            // Use built-in Jimp fonts (more reliable)
            const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);

            // Text wrapping function for jimp
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

            // Wrap text to fit the tweet
            const maxWidth = 500;
            const lines = wrapText(text, maxWidth);
            
            // Text positioning (adjusted for Obama template)
            const startX = 80;
            const startY = 180;
            const lineHeight = 40;

            console.log(`📝 Writing ${lines.length} lines of text...`);

            // Draw each line of text
            lines.forEach((line, index) => {
                const yPosition = startY + (index * lineHeight);
                image.print(font, startX, yPosition, line);
            });

            // Save the modified image
            await image.writeAsync(imagePath);

            console.log("✅ Image created successfully");

            // Send the image
            await message.reply({
                body: "✅ Obama's tweet generated successfully!",
                attachment: fs.createReadStream(imagePath)
            });

        } catch (error) {
            console.error("💥 Error generating Obama tweet:", error);
            
            let errorMessage = "❌ Failed to generate Obama tweet. Please try again later.";
            
            if (error.response && error.response.status === 429) {
                errorMessage = "❌ Rate limited by image service. Please wait a moment and try again.";
            } else if (error.code === 'ENOENT') {
                errorMessage = "❌ File system error. Please check permissions.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ Request timeout. Please try again.";
            }
            
            await message.reply(errorMessage);
            
        } finally {
            // Clean up the generated image file
            if (imagePath && fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                    console.log("🧹 Cleaned up temporary file");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up:", cleanupError.message);
                }
            }
        }
    }
};
