const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports = {
    config: {
        name: "dall",
        aliases: ["dalle", "aiimage", "genimage"],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 50,
        role: 0,
        category: "ai",
        shortDescription: {
            en: "Generate AI images with DALL-E"
        },
        longDescription: {
            en: "Generate high-quality images using DALL-E AI"
        },
        guide: {
            en: "{p}dall <prompt>"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ Missing dependencies: axios and fs-extra");
            }

            if (!args[0]) {
                return message.reply("⚠️ Please provide a text prompt to generate an image.");
            }

            const prompt = args.join(' ');
            
            // Show processing message
            await message.reply("🦆 Generating your AI image... Please wait.");

            let imageUrl;
            
            // TRY BACKUP API FIRST (your requested API)
            try {
                console.log("Trying backup API: text-2-image-by-tabbu.vercel.app");
                const response = await axios.get(`https://text-2-image-by-tabbu.vercel.app/dalle?prompt=${encodeURIComponent(prompt)}`, {
                    timeout: 30000
                });
                
                if (response.data && response.data.imageUrl) {
                    imageUrl = response.data.imageUrl;
                    console.log("Backup API success:", imageUrl);
                } else {
                    throw new Error("No image URL in response");
                }
            } catch (backupError) {
                console.log("Backup API failed, trying original API...");
                
                // TRY ORIGINAL API AS BACKUP
                try {
                    const response = await axios.get(`https://dall-e-tau-steel.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}`, {
                        timeout: 30000
                    });
                    
                    if (response.data && response.data.response) {
                        imageUrl = response.data.response;
                        console.log("Original API success:", imageUrl);
                    } else {
                        throw new Error("No image URL in original API response");
                    }
                } catch (originalError) {
                    throw new Error("Both APIs failed: " + originalError.message);
                }
            }

            // Download the image
            const imgResponse = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });
            
            const imgPath = path.join(__dirname, 'cache', 'dalle_image.jpg');
            await fs.outputFile(imgPath, imgResponse.data);

            // Send the image
            await message.reply({ 
                body: `✅ DALL-E Image Generated\n━━━━━━━━━━━━━━\n🖼️ Prompt: "${prompt}"\n━━━━━━━━━━━━━━\n✨ Enjoy your AI-generated image!`, 
                attachment: fs.createReadStream(imgPath)
            });

            // Clean up
            await fs.remove(imgPath);
            
        } catch (error) {
            console.error("DALL-E Error:", error);
            await message.reply("❌ Error generating image. Please try again later.");
        }
    }
};
