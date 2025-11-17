const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "minionlanguage",
        aliases: ["minion", "banana"],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑓𝑢𝑛",
        shortDescription: {
            en: "🍌 𝑚𝑖𝑛𝑖𝑜𝑛𝑒𝑟 𝑏ℎ𝑎𝑠ℎ𝑎𝑦 𝑘𝑜𝑡ℎ𝑎 𝑏𝑜𝑙𝑜!"
        },
        longDescription: {
            en: "𝑀𝑖𝑛𝑖𝑜𝑛 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑓𝑢𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
        },
        guide: {
            en: "{p}minionlanguage"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const minionImages = [
                "https://i.imgur.com/IIv809H.jpeg"
            ];
            
            const randomImage = minionImages[Math.floor(Math.random() * minionImages.length)];
            
            const cacheDir = __dirname + "/cache/";
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const imagePath = __dirname + "/cache/minion.jpg";
            
            const response = await axios.get(randomImage, { responseType: "arraybuffer" });
            await fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));
            
            await message.reply({
                body: "🍌 𝒎𝒖𝒂𝒌 𝒎𝒖𝒂𝒌 𝒎𝒖𝒂𝒌... 😘\n\n\"𝑴𝒊𝒏𝒊𝒐𝒏 𝑳𝒂𝒏𝒈𝒖𝒂𝒈𝒆 𝑨𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅!\"",
                attachment: fs.createReadStream(imagePath)
            });
            
            // Clean up
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            
        } catch (error) {
            console.error("𝑀𝑖𝑛𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑀𝑖𝑛𝑖𝑜𝑛 𝐿𝑎𝑛𝑔𝑢𝑎𝑔𝑒:\n${error.message}`);
        }
    }
};
