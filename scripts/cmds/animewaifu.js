const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "animewaifu",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑎𝑛𝑖𝑚𝑒",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑤𝑎𝑖𝑓𝑢 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑤𝑎𝑖𝑓𝑢 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒"
        },
        guide: {
            en: "{p}animewaifu"
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

            // Load waifu data from JSON file
            const waifuPath = path.join(__dirname, 'data', 'anime', 'waifu.json');
            
            if (!fs.existsSync(waifuPath)) {
                return message.reply("❌ 𝑊𝑎𝑖𝑓𝑢 𝑑𝑎𝑡𝑎 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑝𝑎𝑡ℎ: data/anime/waifu.json");
            }

            const waifuData = fs.readJsonSync(waifuPath);
            
            if (!waifuData || !Array.isArray(waifuData) || waifuData.length === 0) {
                return message.reply("❌ 𝑁𝑜 𝑤𝑎𝑖𝑓𝑢 𝑑𝑎𝑡𝑎 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑖𝑛 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒.");
            }

            // Get random waifu URL
            const randomUrl = waifuData[Math.floor(Math.random() * waifuData.length)];
            
            if (!randomUrl) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑤𝑎𝑖𝑓𝑢 𝑑𝑎𝑡𝑎: 𝑚𝑖𝑠𝑠𝑖𝑛𝑔 𝑢𝑟𝑙");
            }

            const stream = await global.utils.getStreamFromURL(randomUrl);
            
            await message.reply({
                body: "🌸 𝑅𝑎𝑛𝑑𝑜𝑚 𝐴𝑛𝑖𝑚𝑒 𝑊𝑎𝑖𝑓𝑢 🌸\n\n© 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
                attachment: stream
            });

        } catch (error) {
            console.error("𝐴𝑛𝑖𝑚𝑒𝑊𝑎𝑖𝑓𝑢 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑤𝑎𝑖𝑓𝑢 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
