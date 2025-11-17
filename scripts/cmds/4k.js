const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "4k",
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "🖼️ Enhance image to 4K quality"
        },
        longDescription: {
            en: "Enhance any image to high quality 4K resolution"
        },
        guide: {
            en: "{p}4k [reply_to_image | image_url]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function ({ api, event, message, args }) {
        try {
            const { threadID, messageID } = event;
            const xyz = "ArYANAHMEDRUDRO";

            // Get image URL from reply or arguments
            let imageUrl;
            if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
                imageUrl = event.messageReply.attachments[0].url;
            } else if (args[0] && args[0].startsWith('http')) {
                imageUrl = args[0];
            } else {
                return message.reply("📸 Please reply to an image or provide an image URL\n\nExample:\n/4k [reply to image]\n/4k https://example.com/image.jpg");
            }

            // Send processing message - আপনার রিকোয়েস্টেড মেসেজ
            const processingMsg = await message.reply("𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐚𝐢𝐭 𝐁𝐚𝐛𝐲...😘");

            // Create cache directory if not exists
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const tempImagePath = path.join(cacheDir, `enhanced_4k_${Date.now()}.jpg`);

            try {
                // Call enhancement API
                const apiUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${xyz}`;
                
                console.log("🔄 Calling enhancement API...");
                const enhancementResponse = await axios.get(apiUrl, { timeout: 30000 });
                
                if (!enhancementResponse.data || !enhancementResponse.data.resultImageUrl) {
                    throw new Error("API did not return enhanced image URL");
                }

                const enhancedImageUrl = enhancementResponse.data.resultImageUrl;
                console.log("✅ Got enhanced image URL:", enhancedImageUrl);

                // Download the enhanced image
                console.log("📥 Downloading enhanced image...");
                const enhancedImageResponse = await axios.get(enhancedImageUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 30000 
                });

                // Verify image data
                if (!enhancedImageResponse.data || enhancedImageResponse.data.length === 0) {
                    throw new Error("Enhanced image data is empty");
                }

                // Save to temporary file
                fs.writeFileSync(tempImagePath, Buffer.from(enhancedImageResponse.data, 'binary'));

                // Verify file was created
                if (!fs.existsSync(tempImagePath)) {
                    throw new Error("Failed to save enhanced image");
                }

                const stats = fs.statSync(tempImagePath);
                if (stats.size === 0) {
                    throw new Error("Saved image file is empty");
                }

                console.log("✅ Enhanced image saved successfully");

                // Unsend processing message
                try {
                    await message.unsend(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("Could not unsend processing message:", unsendError.message);
                }

                // Send the enhanced image
                await message.reply({
                    body: "✅ 4K Enhanced Image Generated Successfully! 🖼️",
                    attachment: fs.createReadStream(tempImagePath)
                });

                console.log("✅ Enhanced image sent successfully");

            } catch (apiError) {
                console.error("❌ API Error:", apiError.message);
                
                try {
                    await message.unsend(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("Could not unsend processing message:", unsendError.message);
                }
                
                if (apiError.code === 'ECONNREFUSED') {
                    await message.reply("❌ Connection error: Cannot reach enhancement service. Please try again later.");
                } else if (apiError.code === 'ETIMEDOUT') {
                    await message.reply("❌ Request timeout: Enhancement service is taking too long. Please try again.");
                } else if (apiError.response && apiError.response.status === 404) {
                    await message.reply("❌ Enhancement service not found. Please contact admin.");
                } else {
                    await message.reply("❌ Failed to enhance image. Please make sure the image URL is valid and try again.");
                }
            } finally {
                // Clean up temporary file
                if (fs.existsSync(tempImagePath)) {
                    try {
                        fs.unlinkSync(tempImagePath);
                        console.log("🧹 Temporary file cleaned up");
                    } catch (cleanupError) {
                        console.warn("⚠️ Could not clean up temporary file:", cleanupError.message);
                    }
                }
            }

        } catch (error) {
            console.error("💥 4K Command Error:", error);
            await message.reply("❌ An unexpected error occurred. Please try again later.");
        }
    }
};
