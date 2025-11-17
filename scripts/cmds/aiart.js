const axios = require('axios');
const fs = require('fs-extra');
const moment = require('moment-timezone');

module.exports = {
    config: {
        name: "aiart",
        aliases: ["art", "generateart"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 2,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒 𝑓𝑟𝑜𝑚 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎𝑟𝑡𝑤𝑜𝑟𝑘 𝑢𝑠𝑖𝑛𝑔 𝐴𝐼 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡"
        },
        guide: {
            en: "{p}aiart [𝑝𝑟𝑜𝑚𝑝𝑡]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "moment-timezone": ""
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("moment-timezone");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒.");
            }

            const timeStart = Date.now();
            const name = await usersData.getName(event.senderID);
            const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss - DD/MM/YYYY");
            
            let query = args.join(" ");
            
            if (!query) {
                return message.reply("🎨 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡\n\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:\n• 𝑎𝑖𝑎𝑟𝑡 𝑎 𝑐𝑢𝑡𝑒 𝑐𝑎𝑡 𝑖𝑛 𝑠𝑝𝑎𝑐𝑒\n• 𝑎𝑖𝑎𝑟𝑡 𝑓𝑎𝑛𝑡𝑎𝑠𝑦 𝑐𝑎𝑠𝑡𝑙𝑒 𝑠𝑢𝑛𝑠𝑒𝑡\n• 𝑎𝑖𝑎𝑟𝑡 𝑎𝑛𝑖𝑚𝑒 𝑔𝑖𝑟𝑙 𝑤𝑖𝑡ℎ 𝑝𝑖𝑛𝑘 ℎ𝑎𝑖𝑟");
            }
            
            const path = __dirname + `/cache/aiart_${event.senderID}_${Date.now()}.png`;
            
            // Ensure cache directory exists
            await fs.ensureDir(__dirname + '/cache');
            
            try {
                const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
                    responseType: "arraybuffer",
                    timeout: 60000
                });
                
                await fs.writeFileSync(path, Buffer.from(response.data, "binary"));
                
                const processingTime = Math.floor((Date.now() - timeStart) / 1000);
                
                await message.reply({
                    body: `🖼️ 𝐴𝐼 𝐴𝑟𝑡 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑\n━━━━━━━━━━━━━━━━━━━━\n👤 𝑈𝑠𝑒𝑟: ${name}\n📝 𝑃𝑟𝑜𝑚𝑝𝑡: ${query}\n⏰ 𝑇𝑖𝑚𝑒: ${timeNow}\n⏳ 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡𝑖𝑚𝑒: ${processingTime} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠\n\n✨ 𝐼𝑚𝑎𝑔𝑒 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑑𝑒𝑙𝑒𝑡𝑒𝑑`,
                    attachment: fs.createReadStream(path)
                });

                // Clean up after sending
                setTimeout(() => {
                    try {
                        if (fs.existsSync(path)) {
                            fs.unlinkSync(path);
                            console.log(`✅ 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝 𝑖𝑚𝑎𝑔𝑒: ${path}`);
                        }
                    } catch (cleanupError) {
                        console.log("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
                    }
                }, 5000);
                
            } catch (apiError) {
                console.error("𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", apiError);
                
                if (apiError.code === 'ECONNABORTED') {
                    await message.reply("❌ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑠ℎ𝑜𝑟𝑡𝑒𝑟 𝑝𝑟𝑜𝑚𝑝𝑡.");
                } else if (apiError.response?.status === 404) {
                    await message.reply("❌ 𝐼𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡.");
                } else {
                    await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                }
            }
            
        } catch (error) {
            console.error("𝐴𝐼 𝐴𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
