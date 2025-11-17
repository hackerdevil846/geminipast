const axios = require("axios");

module.exports = {
    config: {
        name: "anicouple",
        aliases: ["animecouple", "couplepic"],
        version: "1.0.6",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "media",
        shortDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑐𝑜𝑢𝑝𝑙𝑒 𝑝ℎ𝑜𝑡𝑜𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑐𝑜𝑢𝑝𝑙𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑛𝑒𝑘𝑜𝑠.𝑙𝑖𝑓𝑒 𝐴𝑃𝐼"
        },
        guide: {
            en: "{p}anicouple"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Send initial processing message
            const processingMsg = await message.reply("⏳ 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑐𝑜𝑢𝑝𝑙𝑒 𝑓𝑜𝑟 𝑦𝑜𝑢...");

            // Use only nekos.life API
            const response = await axios.get("https://nekos.life/api/v2/img/cuddle", {
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const imgUrl = response.data.url;

            if (!imgUrl) {
                throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝐴𝑃𝐼");
            }

            // Download the image using global utils
            const imageStream = await global.utils.getStreamFromURL(imgUrl);

            // Send the image
            await message.reply({
                body: "💑 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑎𝑛𝑖𝑚𝑒 𝑐𝑜𝑢𝑝𝑙𝑒!",
                attachment: imageStream
            });

            // Clean up processing message
            if (processingMsg && processingMsg.messageID) {
                await message.unsendMessage(processingMsg.messageID);
            }
            
        } catch (error) {
            console.error("𝐴𝑛𝑖𝑐𝑜𝑢𝑝𝑙𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
            // Don't send error message to avoid spam
        }
    }
};
