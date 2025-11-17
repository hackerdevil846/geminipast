module.exports = {
    config: {
        name: "lizard",
        aliases: ["lizardpic", "reptile"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑙𝑖𝑧𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑙𝑖𝑧𝑎𝑟𝑑 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠 𝑓𝑟𝑜𝑚 𝑎𝑛 𝐴𝑃𝐼"
        },
        guide: {
            en: "{p}lizard"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message }) {
        try {
            const axios = require("axios");
            const fs = require("fs-extra");
            const path = require("path");

            // Get random lizard image from API
            const response = await axios.get('https://nekos.life/api/v2/img/lizard');
            const imageUrl = response.data.url;
            
            // Download the image using global utility
            const imageStream = await global.utils.getStreamFromURL(imageUrl);
            
            // Send the image
            await message.reply({
                body: "🦎 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑟𝑎𝑛𝑑𝑜𝑚 𝑙𝑖𝑧𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒!",
                attachment: imageStream
            });
            
        } catch (error) {
            console.error("𝐿𝑖𝑧𝑎𝑟𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑙𝑖𝑧𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!");
        }
    }
};
