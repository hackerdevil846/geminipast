const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "nudegirl",
        aliases: ["animenude", "nsfwanime"],
        version: "1.0.1",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🎨 𝐴𝑛𝑖𝑚𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑛𝑢𝑑𝑒 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝐺𝑒𝑡 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑛𝑢𝑑𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑜𝑓 𝑓𝑒𝑚𝑎𝑙𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠"
        },
        category: "𝑛𝑠𝑓𝑤",
        guide: {
            en: "{p}nudegirl"
        },
        countDown: 3,
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

            const imagePath = path.join(__dirname, "cache", "nudegirl.jpg");

            await message.reply("🔄 𝐴𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒 𝑖𝑠 𝑏𝑒𝑖𝑛𝑔 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑...");

            // Alternative API since nekosapi might not work
            const response = await axios.get("https://api.waifu.pics/nsfw/waifu", {
                headers: { "Cache-Control": "no-cache" }
            });
            
            const imageUrl = response.data.url;
            
            const imageResponse = await axios.get(imageUrl, { 
                responseType: "arraybuffer"
            });
            
            fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));
            
            await message.reply({
                body: `🎨 𝐸𝑥𝑐𝑙𝑢𝑠𝑖𝑣𝑒 𝐴𝑛𝑖𝑚𝑒 𝑆𝑡𝑦𝑙𝑒 𝐼𝑚𝑎𝑔𝑒! ✨\n⚠️ 𝑁𝑆𝐹𝑊 𝐶𝑜𝑛𝑡𝑒𝑛𝑡 - 𝑉𝑖𝑒𝑤 𝑤𝑖𝑠𝑒𝑙𝑦`,
                attachment: fs.createReadStream(imagePath)
            });

            // Clean up
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            
        } catch (error) {
            console.error("❌ 𝑁𝑢𝑑𝑒𝑔𝑖𝑟𝑙 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟: 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
