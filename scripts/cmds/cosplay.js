const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "cosplay",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "anime",
        shortDescription: {
            en: "📸 𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑐𝑜𝑠𝑝𝑙𝑎𝑦 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑟𝑎𝑛𝑑𝑜𝑚 𝑐𝑜𝑠𝑝𝑙𝑎𝑦 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝐹𝑎𝑛𝑡𝑜𝑥 𝐴𝑃𝐼"
        },
        guide: {
            en: "{p}cosplay"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            for (let i = 0; i < 5; i++) {
                const url = 'https://fantox-cosplay-api.onrender.com/';
                
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                const image = response.data;

                const cacheDir = path.join(__dirname, 'cache');
                await fs.ensureDir(cacheDir);
                const imagePath = path.join(cacheDir, `cosplay_${Date.now()}_${i}.jpg`);
                
                await fs.writeFile(imagePath, image);
                
                await message.reply({
                    attachment: fs.createReadStream(imagePath)
                });

                await fs.unlink(imagePath);
            }
        } catch (error) {
            console.error("𝐶𝑜𝑠𝑝𝑙𝑎𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
            // Don't send error message to avoid spam
        }
    }
};
