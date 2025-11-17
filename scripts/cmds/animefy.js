const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "animefy",
        aliases: [],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 2,
        role: 0,
        category: "anime",
        shortDescription: {
            en: "Convert image into anime style"
        },
        longDescription: {
            en: "Transform your images into anime-style art"
        },
        guide: {
            en: "{p}animefy [reply to image]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ Missing dependencies. Please install axios and fs-extra.");
            }

            // Check if message is a reply with image
            if (!event.messageReply || 
                !event.messageReply.attachments || 
                !event.messageReply.attachments[0] || 
                !event.messageReply.attachments[0].url) {
                return message.reply("🖼️ Please reply to an image to convert it to anime style");
            }

            const imageUrl = event.messageReply.attachments[0].url;
            
            // Validate image URL
            if (!imageUrl.startsWith('http')) {
                return message.reply("❌ Invalid image URL. Please reply to a valid image.");
            }

            const cacheDir = path.join(__dirname, 'cache');
            const outputPath = path.join(cacheDir, `animefy_${Date.now()}.jpg`);
            
            // Ensure cache directory exists
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("Cache directory error:", dirError);
                return message.reply("❌ Failed to create cache directory.");
            }

            const processingMsg = await message.reply("🔄 Processing your image...");

            try {
                // DeepAI API configuration
                const deepAIKey = "cd38ec31-8f59-4435-953c-ad63fc1cd16b";
                
                console.log(`📤 Uploading image to DeepAI: ${imageUrl}`);
                
                const resp = await axios.post(
                    "https://api.deepai.org/api/anime-portrait-generator",
                    {
                        image: imageUrl
                    },
                    {
                        headers: { 
                            'Api-Key': deepAIKey,
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        timeout: 60000 // 60 seconds timeout
                    }
                );

                if (!resp.data || !resp.data.output_url) {
                    throw new Error("Invalid response from DeepAI API");
                }

                const animeImageUrl = resp.data.output_url;
                console.log(`📥 Downloading animefied image: ${animeImageUrl}`);

                // Download the processed image
                const imageResponse = await axios.get(animeImageUrl, {
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                // Validate image data
                if (!imageResponse.data || imageResponse.data.length === 0) {
                    throw new Error("Empty image data received");
                }

                // Write file to cache
                await fs.writeFile(outputPath, Buffer.from(imageResponse.data));

                // Check file size and validity
                const stats = await fs.stat(outputPath);
                const fileSize = (stats.size / (1024 * 1024)).toFixed(2);

                if (parseFloat(fileSize) > 8) {
                    await fs.unlink(outputPath);
                    throw new Error(`Image too large: ${fileSize}MB`);
                }

                if (stats.size === 0) {
                    await fs.unlink(outputPath);
                    throw new Error("Empty image file");
                }

                console.log(`✅ Image processed successfully (${fileSize}MB)`);

                // Unsend processing message
                try {
                    await message.unsend(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("Could not unsend processing message:", unsendError.message);
                }

                // Send the result
                await message.reply({
                    body: "🎨 𝗔𝗡𝗜𝗠𝗘𝗙𝗜𝗘𝗗 𝗜𝗠𝗔𝗚𝗘\n━━━━━━━━━━━━━━\n✨ Your image has been transformed into anime style!\n🎭 Powered by DeepAI\n━━━━━━━━━━━━━━",
                    attachment: fs.createReadStream(outputPath)
                });

                // Clean up
                await fs.unlink(outputPath);
                console.log("🧹 Cleaned up temporary file");

            } catch (apiError) {
                console.error("DeepAI API Error:", apiError);
                
                // Clean up file if it exists
                try {
                    if (await fs.pathExists(outputPath)) {
                        await fs.unlink(outputPath);
                    }
                } catch (cleanupError) {
                    console.warn("Cleanup error:", cleanupError);
                }

                // Unsend processing message
                try {
                    await message.unsend(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("Could not unsend processing message:", unsendError.message);
                }

                let errorMessage = "❌ 𝗘𝗥𝗥𝗢𝗥\n━━━━━━━━━━━━━━\nFailed to process image.\nPlease try again later.\n━━━━━━━━━━━━━━";
                
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 𝗘𝗥𝗥𝗢𝗥\n━━━━━━━━━━━━━━\nCannot connect to AI service.\nCheck your internet connection.\n━━━━━━━━━━━━━━";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝗧𝗜𝗠𝗘𝗢𝗨𝗧 𝗘𝗥𝗥𝗢𝗥\n━━━━━━━━━━━━━━\nProcessing took too long.\nPlease try a smaller image.\n━━━━━━━━━━━━━━";
                } else if (apiError.response) {
                    if (apiError.response.status === 429) {
                        errorMessage = "❌ 𝗥𝗔𝗧𝗘 𝗟𝗜𝗠𝗜𝗧\n━━━━━━━━━━━━━━\nAPI rate limit exceeded.\nPlease try again in a few minutes.\n━━━━━━━━━━━━━━";
                    } else if (apiError.response.status === 403) {
                        errorMessage = "❌ 𝗔𝗣𝗜 𝗘𝗥𝗥𝗢𝗥\n━━━━━━━━━━━━━━\nAPI key invalid or expired.\nContact bot administrator.\n━━━━━━━━━━━━━━";
                    } else {
                        errorMessage = `❌ 𝗔𝗣𝗜 𝗘𝗥𝗥𝗢𝗥\n━━━━━━━━━━━━━━\nServer returned: ${apiError.response.status}\nPlease try again.\n━━━━━━━━━━━━━━`;
                    }
                } else if (apiError.message.includes('maxContentLength')) {
                    errorMessage = "❌ 𝗜𝗠𝗔𝗚𝗘 𝗧𝗢𝗢 𝗟𝗔𝗥𝗚𝗘\n━━━━━━━━━━━━━━\nImage exceeds size limit.\nTry a smaller image.\n━━━━━━━━━━━━━━";
                }

                await message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 Animefy Command Error:", error);
            
            const errorMessage = "❌ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗘𝗥𝗥𝗢𝗥\n━━━━━━━━━━━━━━\nAn unexpected error occurred.\nPlease try again later.\n━━━━━━━━━━━━━━";
            
            await message.reply(errorMessage);
        }
    }
};
