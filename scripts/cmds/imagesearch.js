const axios = require("axios");
const fs = require("fs-extra");
const google = require("googlethis");
const cloudscraper = require("cloudscraper");

module.exports = {
    config: {
        name: "imagesearch",
        aliases: [],
        version: "2.0.1",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "media",
        shortDescription: {
            en: "Advanced Image Search Command"
        },
        longDescription: {
            en: "Search and download images from Google"
        },
        guide: {
            en: "{p}imagesearch [text] -[number of images]"
        }
    },

    onStart: async function({ message, args, event }) {
        try {
            // Parse arguments
            let query = "";
            let imageCount = 6; // Default number of images
            
            if (event.type === "message_reply") {
                query = event.messageReply.body;
            } else {
                const argsList = args.join(" ").split("-");
                query = argsList[0].trim();
                
                if (argsList.length > 1 && !isNaN(argsList[1])) {
                    imageCount = parseInt(argsList[1]);
                    imageCount = Math.min(Math.max(imageCount, 1), 12); // Limit to 1-12 images
                }
            }
            
            if (!query) {
                return message.reply(`🔍 | Please enter a search term\n\nExample:\n• imagesearch cats\n• imagesearch beautiful scenery -8`);
            }

            // Validate query length
            if (query.length > 100) {
                return message.reply("❌ | Search query is too long. Please use a shorter search term.");
            }
            
            // Send searching message
            const processingMsg = await message.reply(`🔍 | Searching for "${query}"...\n⏳ | Please wait...`);

            // Perform search with error handling
            let result;
            try {
                const options = {
                    safe: false,
                    additional_params: {
                        hl: 'en'
                    }
                };
                result = await google.image(query, options);
                
                if (!result || !Array.isArray(result)) {
                    throw new Error("Invalid response from Google");
                }
            } catch (searchError) {
                console.error("Google search error:", searchError);
                return message.reply("❌ | Failed to search Google. Please try again later.");
            }

            if (result.length === 0) {
                return message.reply(`❌ | No images found for "${query}"\n\nTry a different search term`);
            }

            let streams = [];
            let downloadedFiles = [];
            let counter = 0;
            
            // Create cache directory if it doesn't exist
            const cacheDir = __dirname + '/cache';
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // Download images with better error handling
            for (let image of result) {
                if (counter >= imageCount) break;
                
                // Check if URL is valid image
                if (!image.url || !/\.(jpg|jpeg|png|webp|bmp|gif)$/i.test(image.url)) {
                    continue;
                }
                
                const timestamp = Date.now();
                const path = __dirname + `/cache/image-${timestamp}-${counter}.jpg`;
                
                try {
                    const response = await cloudscraper.get({
                        uri: image.url,
                        encoding: null,
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.9'
                        }
                    });
                    
                    // Check if response is valid image data
                    if (!response || response.length < 1000) {
                        continue; // Skip if file is too small (likely error)
                    }
                    
                    fs.writeFileSync(path, response);
                    
                    // Verify file was written correctly
                    const stats = fs.statSync(path);
                    if (stats.size > 1000) { // Minimum 1KB file size
                        streams.push(fs.createReadStream(path));
                        downloadedFiles.push(path);
                        counter++;
                    } else {
                        // Delete invalid file
                        if (fs.existsSync(path)) {
                            fs.unlinkSync(path);
                        }
                    }
                } catch (error) {
                    // Clean up failed download
                    if (fs.existsSync(path)) {
                        fs.unlinkSync(path);
                    }
                    continue;
                }
            }

            // Clean up processing message
            try {
                if (processingMsg && processingMsg.messageID) {
                    await message.unsend(processingMsg.messageID);
                }
            } catch (unsendError) {
                console.error("Failed to unsend processing message:", unsendError);
            }

            if (streams.length === 0) {
                return message.reply("❌ | No images could be downloaded\n\nTry again later or use a different search term");
            }

            // Send results
            const resultMessage = {
                body: `🖼️ | Image Search Result\n━━━━━━━━━━━━━━━━━━\n🔮 Query: "${query}"\n📊 Total Found: ${result.length} image${result.length !== 1 ? 's' : ''}\n📨 Sending: ${streams.length} image${streams.length !== 1 ? 's' : ''}\n\n💡 Tip: Use -number to specify how many images (max 12)\n━━━━━━━━━━━━━━━━━━`,
                attachment: streams
            };

            await message.reply(resultMessage);

            // Clean up files after sending
            setTimeout(() => {
                for (const filePath of downloadedFiles) {
                    try {
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    } catch (cleanupError) {
                        console.error("Error deleting file:", cleanupError);
                    }
                }
            }, 10000);

        } catch (error) {
            console.error("Image search error:", error);
            
            let errorMessage = "❌ | An error occurred while processing your request\n\nPlease try again later";
            
            if (error.message.includes("timeout")) {
                errorMessage = "⏰ | Request timeout. Please try again.";
            } else if (error.message.includes("ENOTFOUND")) {
                errorMessage = "🌐 | Network error. Please check your connection.";
            }
            
            message.reply(errorMessage);
        }
    },

    onReply: async function({ message, event }) {
        // Handle reply functionality
        if (event.type === "message_reply") {
            await this.onStart({ 
                message, 
                args: [event.messageReply.body], 
                event
            });
        }
    },

    onLoad: function() {
        console.log('🖼️ | Image Search Command Loaded Successfully');
    }
};
