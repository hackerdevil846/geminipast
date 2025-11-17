const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "cosplay2",
        aliases: [],
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "🎭 𝑅𝑎𝑛𝑑𝑜𝑚 𝑐𝑜𝑠𝑝𝑙𝑎𝑦 𝑖𝑚𝑎𝑔𝑒𝑠 𝑣2"
        },
        longDescription: {
            en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑐𝑜𝑠𝑝𝑙𝑎𝑦 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑐𝑢𝑟𝑎𝑡𝑒𝑑 𝑐𝑜𝑙𝑙𝑒𝑐𝑡𝑖𝑜𝑛"
        },
        guide: {
            en: "{p}cosplay2"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            const jsonPath = path.join(__dirname, 'datajson', 'cosplay.json');
            
            if (!fs.existsSync(jsonPath)) {
                return message.reply("❌ 𝐶𝑜𝑠𝑝𝑙𝑎𝑦 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛.");
            }

            const cosplayData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            const images = cosplayData.api;

            if (!images || images.length === 0) {
                return message.reply("❌ 𝑁𝑜 𝑐𝑜𝑠𝑝𝑙𝑎𝑦 𝑖𝑚𝑎𝑔𝑒𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒.");
            }

            const randomImage = images[Math.floor(Math.random() * images.length)];
            const imageStream = await global.utils.getStreamFromURL(randomImage);

            await message.reply({
                body: `🎭 𝐶𝑜𝑠𝑝𝑙𝑎𝑦 𝐼𝑚𝑎𝑔𝑒 #${Math.floor(Math.random() * 1000) + 1}\n✨ 𝐸𝑛𝑗𝑜𝑦 𝑦𝑜𝑢𝑟 𝑐𝑜𝑠𝑝𝑙𝑎𝑦!`,
                attachment: imageStream
            });

        } catch (error) {
            console.error("𝐶𝑜𝑠𝑝𝑙𝑎𝑦 𝑣2 𝐸𝑟𝑟𝑜𝑟:", error);
            // Don't send error message to avoid spam
        }
    }
};
