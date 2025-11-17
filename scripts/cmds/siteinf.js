const axios = require('axios');
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "siteinf",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "info",
        shortDescription: {
            en: "Website information checker"
        },
        longDescription: {
            en: "Get detailed information about a website"
        },
        guide: {
            en: "{p}siteinf [website url]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Check if URL is provided
            if (!args[0]) {
                return message.reply("❌ Please enter a website URL\nExample: /siteinf https://facebook.com");
            }

            let websiteUrl = args[0].trim();
            
            // Add http:// if missing
            if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
                websiteUrl = 'https://' + websiteUrl;
            }

            // Basic URL validation
            try {
                new URL(websiteUrl);
            } catch (urlError) {
                return message.reply("❌ Invalid URL format. Please enter a valid website URL\nExample: /siteinf facebook.com");
            }

            await message.reply("🔍 Searching website information...");

            const response = await axios.get(`https://list.ly/api/v4/meta?url=${encodeURIComponent(websiteUrl)}`, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const data = response.data;

            if (!data || (data.name === undefined && data.description === undefined)) {
                return message.reply("⚠️ No information found for the given URL. The website might be blocking requests or the API might be unavailable.");
            }
            
            const imagePath = __dirname + `/cache/siteinf_${event.senderID}.png`;
            let hasImage = false;
            
            // Download website image if available
            if (data.image && typeof data.image === 'string' && data.image.startsWith('http')) {
                try {
                    const imageResponse = await axios.get(data.image, { 
                        responseType: 'arraybuffer',
                        timeout: 10000
                    });
                    
                    if (imageResponse.data && imageResponse.data.length > 0) {
                        await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));
                        hasImage = true;
                        console.log("Website image downloaded successfully");
                    }
                } catch (imageError) {
                    console.error("Image download error:", imageError.message);
                    // Continue without image if download fails
                }
            }
            
            // Prepare response message
            const messageText = `🌐 Website Information
━━━━━━━━━━━━━━━━━
📛 Name: ${data.name || 'Not available'}
📝 Description: ${data.description || 'Not available'}
🔗 URL: ${data.url || websiteUrl}
${data.keywords ? `🏷️ Keywords: ${data.keywords}` : ''}
${data.provider ? `🏢 Provider: ${data.provider}` : ''}
━━━━━━━━━━━━━━━━━
✨ Powered by: Asif Mahmud`;

            // Send response with or without image
            if (hasImage && fs.existsSync(imagePath)) {
                try {
                    await message.reply({
                        body: messageText,
                        attachment: fs.createReadStream(imagePath)
                    });
                } catch (sendError) {
                    console.error("Error sending with attachment:", sendError);
                    await message.reply(messageText);
                } finally {
                    // Clean up image file
                    try {
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    } catch (cleanupError) {
                        console.error("Cleanup error:", cleanupError);
                    }
                }
            } else {
                await message.reply(messageText);
            }
            
        } catch (error) {
            console.error("SiteInf Error:", error);
            
            let errorMessage = "⚠️ Error fetching website information! Please try again";
            
            if (error.code === 'ECONNREFUSED' || error.code === 'ENETUNREACH') {
                errorMessage = "🌐 Network error: Cannot connect to the information service.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "⏰ Request timeout: The service is taking too long to respond.";
            } else if (error.response) {
                if (error.response.status === 404) {
                    errorMessage = "❌ Website not found or inaccessible.";
                } else {
                    errorMessage = `❌ API Error: ${error.response.status} - ${error.response.statusText}`;
                }
            } else if (error.request) {
                errorMessage = "🌐 No response received from the information service.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
