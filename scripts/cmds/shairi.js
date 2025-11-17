const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "shairi2",
        aliases: ["shayari", "shairivideo"],
        version: "3.0.3",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑒𝑛𝑡𝑒𝑟𝑡𝑎𝑖𝑛𝑚𝑒𝑛𝑡",
        shortDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑎 𝑠ℎ𝑎𝑖𝑟𝑖 𝑣𝑖𝑑𝑒𝑜 𝑠𝑡𝑟𝑒𝑎𝑚 𝑢𝑠𝑖𝑛𝑔 𝐴𝑠𝑖𝑓 𝑆ℎ𝑎𝑖𝑟𝑖 𝐴𝑃𝐼"
        },
        longDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑠ℎ𝑎𝑦𝑎𝑟𝑖 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝐴𝑠𝑖𝑓'𝑠 𝑐𝑜𝑙𝑙𝑒𝑐𝑡𝑖𝑜𝑛"
        },
        guide: {
            en: "{p}shairi2"
        },
        countDown: 10,
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
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            // Notify user
            await message.reply("📥 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑠ℎ𝑎𝑖𝑟𝑖 𝑣𝑖𝑑𝑒𝑜... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡!");

            const tempPath = path.join(__dirname, "cache", "shairi_temp.mp4");
            
            // Ensure cache directory exists
            const cacheDir = path.dirname(tempPath);
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // Fetch video from API
            const response = await axios.get("https://asif-shairi-video-api.onrender.com", {
                responseType: "stream",
                timeout: 30000
            });

            if (response.status !== 200) {
                throw new Error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑣𝑖𝑑𝑒𝑜 𝑓𝑟𝑜𝑚 𝐴𝑃𝐼");
            }

            // Save video to temp path
            const writer = fs.createWriteStream(tempPath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            // Send video
            await message.reply({
                body: "🎬《 𝑆𝐻𝐴𝐼𝑅𝐼 𝑉𝐼𝐷𝐸𝑂 》\n𝐸𝑛𝑗𝑜𝑦 𝑡ℎ𝑒 𝑣𝑖𝑑𝑒𝑜!",
                attachment: fs.createReadStream(tempPath)
            });

            // Cleanup
            try {
                fs.unlinkSync(tempPath);
            } catch (cleanupError) {
                console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
            }

        } catch (error) {
            console.error("𝑆ℎ𝑎𝑖𝑟𝑖2 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${error.message || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"}\n\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!`);
        }
    }
};
