const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "alert",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 0,
        role: 0,
        category: "image",
        shortDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑙𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎𝑛 𝑎𝑙𝑒𝑟𝑡 𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        guide: {
            en: "{p}alert [𝑡𝑒𝑥𝑡]"
        },
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

            // Combine arguments and replace commas with double spaces
            let text = args.join(" ").replace(/,/g, "  ");
            
            if (!text) {
                return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑎𝑙𝑒𝑟𝑡\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}alert 𝐻𝑒𝑙𝑙𝑜 𝑊𝑜𝑟𝑙𝑑");
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const imagePath = path.join(cacheDir, `alert_${event.senderID}_${Date.now()}.png`);
            const encodedText = encodeURIComponent(text);
            const url = `https://api.popcat.xyz/alert?text=${encodedText}`;

            console.log(`📝 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑙𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒: ${text}`);
            console.log(`🔗 𝐴𝑃𝐼 𝑈𝑅𝐿: ${url}`);

            // Download the image
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'stream',
                timeout: 30000
            });

            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log(`✅ 𝐼𝑚𝑎𝑔𝑒 𝑠𝑎𝑣𝑒𝑑 𝑡𝑜: ${imagePath}`);

            // Send the generated image
            await message.reply({
                body: `🚨 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑎𝑙𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒!\n\n📋 𝑇𝑒𝑥𝑡: ${text}`,
                attachment: fs.createReadStream(imagePath)
            });

            console.log(`📤 𝐼𝑚𝑎𝑔𝑒 𝑠𝑒𝑛𝑡 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦`);

            // Clean up temporary file
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`🧹 𝑇𝑒𝑚𝑝 𝑓𝑖𝑙𝑒 𝑐𝑙𝑒𝑎𝑛𝑒𝑑: ${imagePath}`);
                }
            } catch (cleanupError) {
                console.warn("⚠️ 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑤𝑎𝑟𝑛𝑖𝑛𝑔:", cleanupError.message);
            }

        } catch (error) {
            console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑙𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒:", error);
            
            let errorMessage = "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑎𝑙𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡 𝑡𝑜 𝑡ℎ𝑒 𝑎𝑙𝑒𝑟𝑡 𝑠𝑒𝑟𝑣𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝑆𝑒𝑟𝑣𝑒𝑟 𝑡𝑖𝑚𝑒𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑖𝑛 𝑎 𝑚𝑜𝑚𝑒𝑛𝑡.";
            } else if (error.response && error.response.status === 404) {
                errorMessage = "❌ 𝐴𝑙𝑒𝑟𝑡 𝑠𝑒𝑟𝑣𝑖𝑐𝑒 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑖𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
