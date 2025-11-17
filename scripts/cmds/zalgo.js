module.exports = {
    config: {
        name: "zalgo",
        aliases: ["zalgotext", "cursedtext"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑔𝑎𝑚𝑒",
        shortDescription: {
            en: "𝐴𝑝𝑛𝑎𝑟 𝑡𝑒𝑥𝑡 𝑘𝑒 𝑍𝑎𝑙𝑔𝑜 𝑡𝑒 𝑐𝑜𝑛𝑣𝑒𝑟𝑡 𝑘𝑜𝑟𝑒"
        },
        longDescription: {
            en: "𝐶𝑜𝑛𝑣𝑒𝑟𝑡 𝑛𝑜𝑟𝑚𝑎𝑙 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑍𝑎𝑙𝑔𝑜 𝑐𝑜𝑟𝑟𝑢𝑝𝑡𝑒𝑑 𝑡𝑒𝑥𝑡"
        },
        guide: {
            en: "{p}zalgo [𝑎𝑝𝑛𝑎𝑟 𝑡𝑒𝑥𝑡]"
        },
        countDown: 5,
        dependencies: {
            "to-zalgo": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("to-zalgo");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑡𝑜-𝑧𝑎𝑙𝑔𝑜");
            }

            const Zalgo = require("to-zalgo");

            if (args.length === 0) {
                return message.reply("❔ | 𝐷𝑜𝑦𝑎 𝑘𝑜𝑟𝑒 𝑍𝑎𝑙𝑔𝑜-𝑡𝑒 𝑝𝑜𝑟𝑖𝑛𝑜𝑡𝑜 𝑘𝑜𝑟𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑘𝑖𝑐ℎ𝑢 𝑡𝑒𝑥𝑡 𝑑𝑖𝑛.");
            }

            const zalgoText = Zalgo(args.join(" "));
            return message.reply(zalgoText);

        } catch (error) {
            console.error("𝑍𝑎𝑙𝑔𝑜 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
