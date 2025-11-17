const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "groupimage",
        aliases: ["gavatar", "groupavatar"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 1,
        category: "group",
        shortDescription: {
            en: "Change group image by replying to an image"
        },
        longDescription: {
            en: "Changes the group's avatar by replying to an image message"
        },
        guide: {
            en: "{p}groupimage [reply to image]"
        }
    },

    onStart: async function({ message, event, api }) {
        try {
            // Check if it's a group chat
            if (event.isGroup === false) {
                return message.reply("❌ This command can only be used in group chats.");
            }

            // Check if user replied to a message
            if (event.type !== "message_reply") {
                return message.reply("❌ Please reply to an image message to change the group avatar.");
            }
            
            // Check if replied message has attachments
            if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
                return message.reply("❌ No image attachment found in the replied message.");
            }
            
            // Get the first attachment
            const attachment = event.messageReply.attachments[0];
            
            // Check if it's an image
            if (attachment.type !== "photo" && !attachment.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return message.reply("❌ Please reply to an image file (jpg, png, gif, webp).");
            }
            
            const imageUrl = attachment.url;
            
            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const pathImg = path.join(cacheDir, 'group_image_' + Date.now() + '.png');
            
            // Show processing message
            const processingMsg = await message.reply("🔄 Downloading and processing image...");
            
            try {
                // Download the image with timeout
                const response = await axios({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                // Validate response
                if (!response.data || response.data.length === 0) {
                    throw new Error("Empty response from image URL");
                }

                // Check file size (Facebook has limits)
                if (response.data.length > 5 * 1024 * 1024) { // 5MB limit
                    throw new Error("Image is too large (max 5MB)");
                }

                // Save image to cache
                await fs.writeFileSync(pathImg, Buffer.from(response.data, 'binary'));

                // Verify file was saved
                if (!fs.existsSync(pathImg)) {
                    throw new Error("Failed to save image file");
                }

                const stats = fs.statSync(pathImg);
                if (stats.size === 0) {
                    throw new Error("Saved file is empty");
                }

                // Change group image
                await api.changeGroupImage(
                    fs.createReadStream(pathImg), 
                    event.threadID
                );
                
                // Clean up processing message
                try {
                    if (processingMsg && processingMsg.messageID) {
                        await api.unsendMessage(processingMsg.messageID);
                    }
                } catch (unsendError) {
                    // Ignore unsend errors
                }
                
                // Send success message
                await message.reply("✅ Group image changed successfully!");
                
            } catch (apiError) {
                console.error("API Error:", apiError);
                throw new Error("Failed to change group image. The image might be too large or invalid.");
            }
            
        } catch (error) {
            console.error("Group Image Command Error:", error);
            
            let errorMessage = "❌ Failed to change group image. Please try again.";
            
            if (error.message.includes("timeout")) {
                errorMessage = "⏰ Download timeout. Please try again with a smaller image.";
            } else if (error.message.includes("too large")) {
                errorMessage = "📁 Image is too large. Please use an image under 5MB.";
            } else if (error.message.includes("permission")) {
                errorMessage = "🔒 Bot doesn't have permission to change group image.";
            } else if (error.message.includes("ENOTFOUND")) {
                errorMessage = "🌐 Network error. Please check your connection.";
            }
            
            await message.reply(errorMessage);
        } finally {
            // Clean up temporary files
            try {
                const cacheDir = path.join(__dirname, 'cache');
                if (fs.existsSync(cacheDir)) {
                    const files = fs.readdirSync(cacheDir).filter(file => file.startsWith('group_image_'));
                    for (const file of files) {
                        const filePath = path.join(cacheDir, file);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    }
                }
            } catch (cleanupError) {
                console.error("Cleanup Error:", cleanupError);
            }
        }
    }
};
