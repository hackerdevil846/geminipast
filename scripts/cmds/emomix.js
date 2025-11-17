const axios = require('axios');

module.exports = {
    config: {
        name: "emomix",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "conversion",
        shortDescription: {
            en: "𝑀𝑖𝑥 𝑡𝑤𝑜 𝑒𝑚𝑜𝑗𝑖𝑠 𝑡𝑜𝑔𝑒𝑡ℎ𝑒𝑟"
        },
        longDescription: {
            en: "𝐶𝑜𝑚𝑏𝑖𝑛𝑒 𝑡𝑤𝑜 𝑒𝑚𝑜𝑗𝑖𝑠 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑢𝑛𝑖𝑞𝑢𝑒 𝑚𝑖𝑥𝑒𝑑 𝑒𝑚𝑜𝑗𝑖 𝑖𝑚𝑎𝑔𝑒"
        },
        guide: {
            en: "{p}emomix <𝑒𝑚𝑜𝑗𝑖1>;<𝑒𝑚𝑜𝑗𝑖2>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}emomix 😀;🥰"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            if (!args[0] || args.length !== 1) {
                return message.reply("❌ | 𝐼𝑛𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑢𝑠𝑒. 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}emomix 😀;🥰");
            }

            // Split the string into two emojis using semicolon as separator
            const emojis = args.join(' ').split(';');

            if (emojis.length !== 2) {
                return message.reply("❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑡𝑤𝑜 𝑒𝑚𝑜𝑗𝑖𝑠 𝑢𝑠𝑖𝑛𝑔 𝑎 ';' 𝑎𝑠 𝑎 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑜𝑟.");
            }

            const emoji1 = emojis[0].trim();
            const emoji2 = emojis[1].trim();

            const response = await axios.get(`https://levanter.onrender.com/emix?q=${emoji1}${emoji2}`);

            if (response.data.status === true) {
                // If request succeeded, send the resulting image
                const imageStream = await global.utils.getStreamFromURL(response.data.result);
                
                await message.reply({
                    body: `✨ 𝐸𝑚𝑜𝑗𝑖 𝑀𝑖𝑥 𝐶𝑟𝑒𝑎𝑡𝑒𝑑!\n\n${emoji1} + ${emoji2} = 🎉`,
                    attachment: imageStream
                });

            } else {
                return message.reply("❌ | 𝑈𝑛𝑎𝑏𝑙𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑒𝑚𝑜𝑗𝑖 𝑚𝑖𝑥.");
            }
        } catch (error) {
            console.error("𝐸𝑚𝑜𝑗𝑖 𝑀𝑖𝑥 𝐸𝑟𝑟𝑜𝑟:", error);
            return message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑒𝑚𝑜𝑗𝑖 𝑚𝑖𝑥.");
        }
    }
};
