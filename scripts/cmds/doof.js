const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "doof",
        aliases: ["doofboard", "doofcomment"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "edit-image",
        shortDescription: {
            en: "Board and comment generator"
        },
        longDescription: {
            en: "Creates a board comment image with your text"
        },
        guide: {
            en: "{p}doof [text]"
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

            const { threadID } = event;
            const text = args.join(" ");

            if (!text) {
                return message.reply("❌ Please enter text for the board comment");
            }

            const pathImg = __dirname + '/cache/doof.png';
            
            // Use API to generate the image with text
            const apiUrl = `https://api.popcat.xyz/comment?comment=${encodeURIComponent(text)}&background=https://i.imgur.com/bMxrqTL.png`;
            
            try {
                const imageResponse = await axios.get(apiUrl, { 
                    responseType: 'arraybuffer' 
                });
                
                await fs.writeFile(pathImg, Buffer.from(imageResponse.data, 'binary'));
                
                // Send the result
                await message.reply({ 
                    body: "✅ Done! Your board comment is ready",
                    attachment: fs.createReadStream(pathImg) 
                });
                
                // Clean up
                await fs.unlink(pathImg);
                
            } catch (apiError) {
                console.error("API Error:", apiError);
                // Fallback: send the original image with text in caption
                const originalImage = await axios.get('https://i.imgur.com/bMxrqTL.png', { 
                    responseType: 'arraybuffer' 
                });
                
                await fs.writeFile(pathImg, Buffer.from(originalImage.data, 'binary'));
                
                await message.reply({ 
                    body: `✅ Board Comment:\n${text}`,
                    attachment: fs.createReadStream(pathImg) 
                });
                
                await fs.unlink(pathImg);
            }
            
        } catch (error) {
            console.error("Doof Error:", error);
            await message.reply("❌ An error occurred while processing the image");
        }
    }
};
