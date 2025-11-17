const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
    config: {
        name: "student",
        aliases: ["studentboard"],
        version: "3.1.2",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "🎓 𝐵𝑜𝑎𝑟𝑑 𝑒 𝑠𝑡𝑢𝑑𝑒𝑛𝑡𝑒𝑟 𝑚𝑒𝑟𝑎 𝑘𝑜𝑚𝑒𝑛𝑡 𝑘𝑜𝑟𝑎"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑠𝑡𝑢𝑑𝑒𝑛𝑡 𝑏𝑜𝑎𝑟𝑑 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
        },
        guide: {
            en: "{p}student [𝑡𝑒𝑥𝑡]"
        },
        countDown: 5,
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
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const text = args.join(" ");

            if (!text) {
                return message.reply("🎓 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑");
            }

            // URL encode the text for the API
            const encodedText = encodeURIComponent(text);
            
            // Use a simple text-to-image API
            const imageUrl = `https://api.memegen.link/images/custom?top=${encodedText}&background=https://i.ibb.co/yf4yCVh/Picsart-22-08-14-01-57-26-461.jpg`;

            try {
                // Send the generated image directly
                await message.reply({
                    body: "🎓 𝑆𝑡𝑢𝑑𝑒𝑛𝑡 𝐵𝑜𝑎𝑟𝑑 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
                    attachment: await global.utils.getStreamFromURL(imageUrl)
                });

            } catch (imageError) {
                console.error("Image generation error:", imageError);
                
                // Fallback: Send original image with text in caption
                await message.reply({
                    body: `🎓 𝑆𝑡𝑢𝑑𝑒𝑛𝑡 𝐵𝑜𝑎𝑟𝑑:\n"${text}"\n\n📝 𝑇𝑒𝑥𝑡 𝑎𝑑𝑑𝑒𝑑 𝑎𝑠 𝑐𝑎𝑝𝑡𝑖𝑜𝑛 (𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑)`,
                    attachment: await global.utils.getStreamFromURL("https://i.ibb.co/yf4yCVh/Picsart-22-08-14-01-57-26-461.jpg")
                });
            }

        } catch (error) {
            console.error("Student board error:", error);
            await message.reply("⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
