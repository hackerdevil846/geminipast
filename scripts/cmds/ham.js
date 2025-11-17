const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "ham",
        aliases: ["bacon", "meat"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "Random ham image"
        },
        longDescription: {
            en: "Sends a random ham placeholder image"
        },
        guide: {
            en: "{p}ham"
        }
    },

    onStart: async function({ message }) {
        try {
            const imgUrl = "https://baconmockup.com/600/400";
            const cacheDir = path.join(__dirname, "cache");
            const filePath = path.join(cacheDir, `ham_${Date.now()}.jpg`);
            
            // Ensure cache directory exists
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // Download image with proper error handling
            const response = await axios({
                method: 'GET',
                url: imgUrl,
                responseType: 'stream',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            // Create write stream and handle download
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Verify file was created and has content
            if (!fs.existsSync(filePath)) {
                throw new Error('Downloaded file not found');
            }

            const stats = fs.statSync(filePath);
            if (stats.size === 0) {
                throw new Error('Downloaded file is empty');
            }

            // Send the image
            await message.reply({
                body: "🍖 Random Ham Image",
                attachment: fs.createReadStream(filePath)
            });

            // Clean up file after sending
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (cleanupError) {
                console.error('File cleanup error:', cleanupError);
            }

        } catch (error) {
            console.error("Ham Command Error:", error);
            
            let errorMessage = "❌ Failed to get ham image. Please try again later.";
            
            if (error.message.includes('timeout')) {
                errorMessage = "⏰ Download timeout. Please try again.";
            } else if (error.message.includes('ENOTFOUND')) {
                errorMessage = "🌐 Network error. Please check your connection.";
            } else if (error.message.includes('404')) {
                errorMessage = "🔍 Image service unavailable. Try again later.";
            } else if (error.message.includes('Downloaded file')) {
                errorMessage = "❌ Failed to download image properly.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
