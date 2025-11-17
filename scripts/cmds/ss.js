const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "ss",
        aliases: [],
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑚𝑒𝑑𝑖𝑎",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝑠𝑐𝑟𝑒𝑒𝑛𝑠ℎ𝑜𝑡 𝑜𝑓 𝑤𝑒𝑏𝑠𝑖𝑡𝑒"
        },
        longDescription: {
            en: "𝑇𝑎𝑘𝑒 𝑎 𝑠𝑐𝑟𝑒𝑒𝑛𝑠ℎ𝑜𝑡 𝑜𝑓 𝑎𝑛𝑦 𝑤𝑒𝑏𝑠𝑖𝑡𝑒 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑢𝑚𝑏𝑠ℎ𝑜𝑡 𝑎𝑝𝑖"
        },
        guide: {
            en: "{p}ss <𝑤𝑒𝑏𝑠𝑖𝑡𝑒 𝑙𝑖𝑛𝑘>"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            const url = args.join(" ").trim();
            
            // Check if URL is provided
            if (!url) {
                return message.reply("⚠️ | 𝐷𝑜𝑦𝑎 𝑘𝑜𝑟𝑒 𝑒𝑘𝑡𝑎 𝑣𝑎𝑙𝑖𝑑 𝑈𝑅𝐿 𝑑𝑎𝑜.\n\n📝 𝑈𝑠𝑎𝑔𝑒: {p}ss https://𝑒𝑥𝑎𝑚𝑝𝑙𝑒.𝑐𝑜𝑚");
            }

            // Validate URL format
            if (!/^https?:\/\//i.test(url)) {
                return message.reply("❌ | 𝑈𝑅𝐿 https:// 𝑑𝑖𝑦𝑒 𝑠ℎ𝑢𝑟𝑢 ℎ𝑜𝑡𝑒 ℎ𝑜𝑏𝑒.\n\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}ss https://𝑔𝑜𝑜𝑔𝑙𝑒.𝑐𝑜𝑚");
            }

            // API URL (keeping the same link as requested)
            const API_URL = `https://image.thum.io/get/fullpage/${encodeURIComponent(url)}`;

            // Show processing message
            await message.reply("⏳ | 𝑆𝑐𝑟𝑒𝑒𝑛𝑠ℎ𝑜𝑡 𝑛𝑖𝑜 𝑎𝑠𝑠𝑐ℎ𝑒, 𝑒𝑘𝑡𝑢 𝑤𝑎𝑖𝑡 𝑘𝑜𝑟𝑢𝑛...");

            // Fetch screenshot image as buffer
            const response = await axios.get(API_URL, { 
                responseType: 'arraybuffer',
                timeout: 30000, // 30 seconds timeout
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.data) {
                throw new Error("𝑆𝑐𝑟𝑒𝑒𝑛𝑠ℎ𝑜𝑡 𝑓𝑒𝑡𝑐ℎ 𝑓𝑎𝑖𝑙𝑒𝑑");
            }

            // Save temporarily (same path as original)
            const tempPath = path.join(__dirname, 'temp_screenshot.png');
            await fs.writeFile(tempPath, response.data);

            // Send message with attachment
            await message.reply({
                body: `✅ 𝑆𝑐𝑟𝑒𝑒𝑛𝑠ℎ𝑜𝑡 𝑜𝑓: ${url}\n\n📸 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
                attachment: fs.createReadStream(tempPath)
            });

            // Clean up temp file
            await fs.remove(tempPath);

        } catch (error) {
            console.error("𝑆𝑐𝑟𝑒𝑒𝑛𝑠ℎ𝑜𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
            
            if (error.code === 'ECONNABORTED') {
                return message.reply("⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑊𝑒𝑏𝑠𝑖𝑡𝑒 𝑡𝑜𝑜 𝑠𝑙𝑜𝑤 𝑜𝑟 𝑛𝑜𝑡 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑖𝑛𝑔.");
            }
            
            if (error.response?.status === 404) {
                return message.reply("❌ 𝑊𝑒𝑏𝑠𝑖𝑡𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑜𝑟 𝑖𝑛𝑣𝑎𝑙𝑖𝑑 𝑈𝑅𝐿.");
            }
            
            return message.reply("🚫 𝑆𝑐𝑟𝑒𝑒𝑛𝑠ℎ𝑜𝑡 𝑡𝑜𝑖𝑟𝑖 𝑘𝑜𝑟𝑎 𝑔𝑒𝑙𝑜 𝑛𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.\n\n💡 𝑇𝑖𝑝𝑠:\n• 𝑈𝑠𝑒 𝑣𝑎𝑙𝑖𝑑 ℎ𝑡𝑡𝑝𝑠:// 𝑙𝑖𝑛𝑘𝑠\n• 𝐴𝑣𝑜𝑖𝑑 𝑝𝑟𝑖𝑣𝑎𝑡𝑒 𝑤𝑒𝑏𝑠𝑖𝑡𝑒𝑠\n• 𝐶ℎ𝑒𝑐𝑘 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛");
        }
    }
};
