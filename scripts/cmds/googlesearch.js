const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "googlesearch",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "Create Google search bar images with custom text"
        },
        longDescription: {
            en: "Generate custom Google search bar images with your text"
        },
        guide: {
            en: "{p}googlesearch [text]"
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            const text = args.join(" ");

            if (!text) {
                return message.reply("❌ Please enter text for the Google search bar\n\n💡 Example: googlesearch how to code");
            }

            if (text.length > 100) {
                return message.reply("❌ Text is too long! Maximum 100 characters allowed.");
            }

            await message.reply("🔄 Generating your custom Google search bar...");

            const templateUrl = "https://i.imgur.com/GXPQYtT.png";
            const templatePath = __dirname + "/cache/google_template_" + Date.now() + ".png";
            const outputPath = __dirname + "/cache/google_result_" + Date.now() + ".png";

            // Ensure cache directory exists
            const cacheDir = __dirname + "/cache";
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            try {
                // Download template
                const response = await axios({
                    method: "GET",
                    url: templateUrl,
                    responseType: "arraybuffer",
                    timeout: 30000
                });

                if (response.status !== 200) {
                    throw new Error("Failed to download template");
                }

                fs.writeFileSync(templatePath, Buffer.from(response.data));

                // Load template image
                const image = await jimp.read(templatePath);

                // Load font
                const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);

                // Text positioning and wrapping
                const maxWidth = 470;
                const xPosition = 580;
                const yPosition = 620;

                // Simple text wrapping
                let displayText = text;
                if (text.length > 25) {
                    const words = text.split(' ');
                    let lines = [];
                    let currentLine = '';
                    
                    for (const word of words) {
                        const testLine = currentLine ? `${currentLine} ${word}` : word;
                        const testWidth = jimp.measureText(font, testLine);
                        
                        if (testWidth <= maxWidth) {
                            currentLine = testLine;
                        } else {
                            if (currentLine) lines.push(currentLine);
                            currentLine = word;
                        }
                    }
                    if (currentLine) lines.push(currentLine);
                    
                    displayText = lines.join('\n');
                }

                // Add text to image
                image.print(
                    font,
                    xPosition,
                    yPosition,
                    {
                        text: displayText,
                        alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
                        alignmentY: jimp.VERTICAL_ALIGN_TOP
                    },
                    maxWidth,
                    150
                );

                // Save the image
                await image.writeAsync(outputPath);

                // Verify the file was created
                if (!fs.existsSync(outputPath)) {
                    throw new Error("Failed to create output image");
                }

                // Send the result
                await message.reply({
                    body: "🔍 Here's your Google Search Result!",
                    attachment: fs.createReadStream(outputPath)
                });

            } finally {
                // Clean up temporary files
                try {
                    if (fs.existsSync(templatePath)) {
                        fs.unlinkSync(templatePath);
                    }
                } catch (e) {
                    console.error("Template cleanup error:", e);
                }
                
                try {
                    if (fs.existsSync(outputPath)) {
                        fs.unlinkSync(outputPath);
                    }
                } catch (e) {
                    console.error("Output cleanup error:", e);
                }
            }

        } catch (error) {
            console.error("GoogleSearch Error:", error);
            
            let errorMessage = "❌ Failed to create Google search image. Please try again later.";
            
            if (error.message.includes("timeout")) {
                errorMessage = "⏰ Request timeout. Please try again.";
            } else if (error.message.includes("ENOTFOUND")) {
                errorMessage = "🌐 Network error. Please check your internet connection.";
            } else if (error.message.includes("template")) {
                errorMessage = "🖼️ Failed to download template image.";
            }

            await message.reply(errorMessage);
        }
    }
};
