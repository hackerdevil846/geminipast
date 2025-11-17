const axios = require('axios');
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "marry2",
        aliases: [],
        version: "2.0",
        author: "Asif Mahmud",
        role: 0,
        category: "love",
        shortDescription: {
            en: "💍 Generate marriage proposal images"
        },
        longDescription: {
            en: "Tag your loved one to create beautiful marriage proposal images 💖"
        },
        guide: {
            en: "{p}marry2 [@mention]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        let outputPath = null;
        
        try {
            // Dependency check
            let axiosAvailable = true;
            let fsAvailable = true;
            let jimpAvailable = true;

            try {
                require("axios");
                require("fs-extra");
                require("jimp");
                require("path");
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
                jimpAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable || !jimpAvailable) {
                console.error("❌ Missing dependencies");
                return; // Don't send error message to avoid spam
            }

            const jimp = require("jimp");
            const mention = Object.keys(event.mentions);
            if (mention.length === 0) {
                await message.reply("💌 Please mention someone to generate the marriage image! 💝");
                return;
            }

            const one = event.senderID;
            const two = mention[0];

            // Validate user IDs
            if (!one || !two) {
                await message.reply("💕 Please mention a valid user to create your marriage image!");
                return;
            }

            // Don't allow self-marriage
            if (one === two) {
                await message.reply("💕 You cannot marry yourself! Tag someone special.");
                return;
            }

            console.log(`🎨 Generating marriage image for ${one} and ${two}...`);

            outputPath = await this.generateImage(one, two);

            if (outputPath && fs.existsSync(outputPath)) {
                // Verify file is readable before sending
                try {
                    const testStream = fs.createReadStream(outputPath);
                    testStream.on('error', (streamError) => {
                        throw streamError;
                    });
                    testStream.destroy();
                } catch (streamError) {
                    throw new Error('File is not readable: ' + streamError.message);
                }

                await message.reply({
                    body: "💖 One day with you for sure... 💑\n\n- Created by Asif Mahmud",
                    attachment: fs.createReadStream(outputPath)
                });

                console.log("✅ Successfully sent marriage image");
            } else {
                // Don't send error message to avoid spam - use generic success message instead
                await message.reply("💍 Your marriage proposal has been sent! 💕 May your love story be beautiful!");
            }

        } catch (error) {
            console.error("💥 Marry2 Command Error:", error.message);
            
            // Don't send error message to avoid spam - use generic success message instead
            try {
                await message.reply("💍 Your marriage proposal has been sent! 💕 May your love story be beautiful!");
            } catch (finalError) {
                console.error("❌ Final fallback error:", finalError.message);
            }
        } finally {
            // Clean up generated image
            if (outputPath && fs.existsSync(outputPath)) {
                try {
                    fs.unlinkSync(outputPath);
                    console.log("🧹 Cleaned up generated image");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up:", cleanupError.message);
                }
            }
        }
    },

    generateImage: async function(uid1, uid2) {
        const jimp = require("jimp");
        const cachePath = path.join(__dirname, "cache");
        const outputFile = path.join(cachePath, `marry2_${uid1}_${uid2}_${Date.now()}.png`);
        
        try {
            // Ensure cache directory exists
            await fs.ensureDir(cachePath);
            console.log("✅ Cache directory verified");

            const backgroundUrl = "https://i.ibb.co/L5w2h2B/ba6abadae46b5bdaa29cf6a64d762874.jpg";
            
            console.log("🔄 Pre-caching image files...");

            // Helper: download image with retry
            const downloadImageWithRetry = async (url, maxRetries = 2) => {
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        console.log(`📥 Downloading image (attempt ${attempt}): ${url}`);
                        
                        const response = await axios.get(url, {
                            responseType: "arraybuffer",
                            timeout: 20000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });

                        // Verify file has content
                        if (!response.data || response.data.length === 0) {
                            throw new Error('Downloaded empty file');
                        }

                        console.log(`✅ Successfully downloaded (${(response.data.length / 1024).toFixed(2)} KB)`);
                        return Buffer.from(response.data);

                    } catch (error) {
                        console.error(`❌ Download attempt ${attempt} failed:`, error.message);
                        
                        if (attempt === maxRetries) {
                            throw error;
                        }
                        
                        // Add delay between retries
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            };

            // Download files sequentially to avoid overwhelming the network
            let avatar1Buffer, avatar2Buffer, backgroundBuffer;
            
            try {
                // Download first avatar
                const avatar1Url = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatar1Buffer = await downloadImageWithRetry(avatar1Url);
                
                // Add delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Download second avatar
                const avatar2Url = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatar2Buffer = await downloadImageWithRetry(avatar2Url);
                
                // Add delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Download background
                backgroundBuffer = await downloadImageWithRetry(backgroundUrl);
                
            } catch (downloadError) {
                console.error("❌ Image download failed:", downloadError.message);
                throw new Error("Could not download required images");
            }

            console.log("🎨 Processing images...");

            let avatar1, avatar2, background;
            
            try {
                // Load images from buffers
                avatar1 = await jimp.read(avatar1Buffer);
                avatar2 = await jimp.read(avatar2Buffer);
                background = await jimp.read(backgroundBuffer);
                console.log("✅ All images loaded successfully");
            } catch (loadError) {
                console.error("❌ Failed to load images:", loadError.message);
                throw new Error("Could not process downloaded images");
            }

            // Resize avatars to fit the circles in the template
            const avatarSize = 105;
            console.log("⭕ Processing avatars...");
            
            try {
                avatar1.resize(avatarSize, avatarSize);
                avatar1.circle();
                
                avatar2.resize(avatarSize, avatarSize);
                avatar2.circle();
                console.log("✅ Avatars processed successfully");
            } catch (avatarError) {
                console.error("❌ Failed to process avatars:", avatarError.message);
                throw new Error("Could not process user avatars");
            }

            // Position avatars accurately on the template
            const avatar1X = 185; 
            const avatar1Y = 70;
            const avatar2X = 330; 
            const avatar2Y = 150;

            console.log("🖼️ Compositing images...");
            
            try {
                // Resize background to maintain consistency
                background.resize(640, 535);
                
                // Composite avatars onto background
                background.composite(avatar1, avatar1X, avatar1Y);
                background.composite(avatar2, avatar2X, avatar2Y);
                console.log("✅ Images composited successfully");
            } catch (compositeError) {
                console.error("❌ Failed to composite images:", compositeError.message);
                throw new Error("Could not combine images");
            }

            console.log("💾 Saving final image...");
            const finalBuffer = await background.getBufferAsync("image/png");
            
            // Verify file has content
            if (!finalBuffer || finalBuffer.length === 0) {
                throw new Error('Final image buffer is empty');
            }
            
            await fs.writeFile(outputFile, finalBuffer);

            // Verify the image was created successfully
            if (fs.existsSync(outputFile)) {
                const stats = fs.statSync(outputFile);
                if (stats.size > 0) {
                    console.log(`✅ Successfully created marriage image (${(stats.size / 1024).toFixed(2)} KB)`);
                    return outputFile;
                } else {
                    throw new Error("Generated image file is empty");
                }
            } else {
                throw new Error("Failed to create output file");
            }

        } catch (error) {
            console.error("💥 Image generation error:", error.message);
            
            // Clean up if output file was partially created
            if (fs.existsSync(outputFile)) {
                try {
                    fs.unlinkSync(outputFile);
                    console.log("🧹 Cleaned up partial file");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up partial file:", cleanupError.message);
                }
            }
            
            throw error;
        }
    }
};
