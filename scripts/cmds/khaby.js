const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
    config: {
        name: "khaby",
        aliases: ["khaby-lame", "khaby-meme"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑓𝑢𝑛",
        shortDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝐾ℎ𝑎𝑏𝑦 𝐿𝑎𝑚𝑒 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝐾ℎ𝑎𝑏𝑦 𝐿𝑎𝑚𝑒 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        guide: {
            en: "{p}khaby <𝑡𝑒𝑥𝑡1> | <𝑡𝑒𝑥𝑡2>"
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
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            const content = args.join(" ");

            if (!content || !content.includes("|")) {
                return message.reply(`❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑡ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑓𝑜𝑟𝑚𝑎𝑡: ${this.config.name} <𝑡𝑒𝑥𝑡1> | <𝑡𝑒𝑥𝑡2>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${this.config.name} 𝐶𝑎𝑛'𝑡 𝑏𝑒𝑙𝑖𝑒𝑣𝑒 | 𝐼𝑡'𝑠 𝑡ℎ𝑎𝑡 𝑒𝑎𝑠𝑦`);
            }

            const [text1, text2] = content.split("|").map(text => text.trim());
            
            if (!text1 || !text2) {
                return message.reply(`❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑏𝑜𝑡ℎ 𝑡𝑒𝑥𝑡𝑠: ${this.config.name} <𝑡𝑒𝑥𝑡1> | <𝑡𝑒𝑥𝑡2>`);
            }

            const memeUrl = `https://api.memegen.link/images/khaby-lame/${encodeURIComponent(text1)}/${encodeURIComponent(text2)}.png`;
            const cachePath = __dirname + "/cache/khaby_meme.png";

            // Ensure cache directory exists
            await fs.ensureDir(__dirname + "/cache");

            const response = await axios({
                method: 'GET',
                url: memeUrl,
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(cachePath);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', async () => {
                    try {
                        await message.reply({
                            body: "✅ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝐾ℎ𝑎𝑏𝑦 𝑚𝑒𝑚𝑒!",
                            attachment: fs.createReadStream(cachePath)
                        });
                        
                        // Clean up
                        fs.unlinkSync(cachePath);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });

                writer.on('error', (error) => {
                    console.error("𝑀𝑒𝑚𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
                    message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                    reject(error);
                });
            });

        } catch (error) {
            console.error("𝐾ℎ𝑎𝑏𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
