const axios = require("axios");

module.exports = {
    config: {
        name: "npmlook",
        aliases: ["npminfo", "packinfo"],
        version: "2.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "📦 𝐶ℎ𝑒𝑐𝑘 𝑛𝑝𝑚 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑑𝑎𝑡𝑎"
        },
        longDescription: {
            en: "𝐹𝑒𝑡𝑐ℎ 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑎𝑛𝑦 𝑛𝑝𝑚 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑢𝑠𝑖𝑛𝑔 𝑃𝑜𝑝𝐶𝑎𝑡 𝐴𝑃𝐼"
        },
        category: "𝑖𝑛𝑓𝑜",
        guide: {
            en: "{p}npmlook <𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑛𝑎𝑚𝑒>\n📦 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}npmlook axios"
        },
        countDown: 5,
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠.");
            }

            if (!args[0]) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑝𝑚 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑛𝑎𝑚𝑒.\n📦 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: .npmlook axios");
            }

            const pkg = encodeURIComponent(args.join(" "));

            const res = await axios.get(`https://api.popcat.xyz/v2/npm?q=${pkg}`);
            const data = res.data;

            if (!data || !data.name) {
                return message.reply("⚠️ 𝑁𝑜 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑓𝑜𝑢𝑛𝑑 𝑤𝑖𝑡ℎ 𝑡ℎ𝑎𝑡 𝑛𝑎𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑠𝑝𝑒𝑙𝑙𝑖𝑛𝑔.");
            }

            const reply =
`📦 𝑃𝑎𝑐𝑘𝑎𝑔𝑒: ${data.name}
📌 𝑉𝑒𝑟𝑠𝑖𝑜𝑛: ${data.version || "𝑁/𝐴"}
📝 𝐷𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛: ${data.description || "𝑁/𝐴"}
👤 𝐴𝑢𝑡ℎ𝑜𝑟: ${(data.author && data.author.name) || "𝑁/𝐴"}
📃 𝐿𝑖𝑐𝑒𝑛𝑠𝑒: ${data.license || "𝑁/𝐴"}
🔗 𝐻𝑜𝑚𝑒𝑝𝑎𝑔𝑒: ${data.homepage || "𝑁/𝐴"}
🌐 𝑁𝑃𝑀 𝐿𝑖𝑛𝑘: https://www.npmjs.com/package/${data.name}`;

            await message.reply(reply);

        } catch (err) {
            console.error("𝑁𝑃𝑀 𝐿𝑜𝑜𝑘 𝐸𝑟𝑟𝑜𝑟:", err);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑝𝑎𝑐𝑘𝑎𝑔𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
