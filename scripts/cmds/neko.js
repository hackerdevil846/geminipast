const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "neko",
        aliases: ["catgirl", "nekogirl"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑎𝑛𝑖𝑚𝑒",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑛𝑒𝑘𝑜 𝑔𝑖𝑟𝑙 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑛𝑒𝑘𝑜 𝑔𝑖𝑟𝑙 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒"
        },
        guide: {
            en: "{p}neko"
        },
        countDown: 5,
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            // Load neko data from JSON file
            const nekoPath = path.join(__dirname, 'data', 'anime', 'neko.json');
            
            if (!fs.existsSync(nekoPath)) {
                return message.reply("❌ 𝑁𝑒𝑘𝑜 𝑑𝑎𝑡𝑎 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑝𝑎𝑡ℎ: data/anime/neko.json");
            }

            const nekoData = fs.readJsonSync(nekoPath);
            
            if (!nekoData || !Array.isArray(nekoData) || nekoData.length === 0) {
                return message.reply("❌ 𝑁𝑜 𝑛𝑒𝑘𝑜 𝑑𝑎𝑡𝑎 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑖𝑛 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒.");
            }

            // Get random neko URL
            const randomUrl = nekoData[Math.floor(Math.random() * nekoData.length)];
            
            if (!randomUrl) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑛𝑒𝑘𝑜 𝑑𝑎𝑡𝑎: 𝑚𝑖𝑠𝑠𝑖𝑛𝑔 𝑢𝑟𝑙");
            }

            const stream = await global.utils.getStreamFromURL(randomUrl);
            
            await message.reply({
                body: "🐾 𝑅𝑎𝑛𝑑𝑜𝑚 𝐴𝑛𝑖𝑚𝑒 𝑁𝑒𝑘𝑜 𝐺𝑖𝑟𝑙 🐾\n\n© 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
                attachment: stream
            });

        } catch (error) {
            console.error("𝑁𝑒𝑘𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑛𝑒𝑘𝑜 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
