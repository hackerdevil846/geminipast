const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "anigen",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑚𝑒𝑑𝑖𝑎",
        shortDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡"
        },
        guide: {
            en: "{p}anigen [𝑝𝑟𝑜𝑚𝑝𝑡]"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "path": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check with better validation
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            if (!args[0]) {
                const helpMessage = `🎨 𝐴𝑛𝑖𝑚𝑒 𝐼𝑚𝑎𝑔𝑒 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟

📝 𝑈𝑠𝑎𝑔𝑒:
• ${global.config.PREFIX}anigen [𝑝𝑟𝑜𝑚𝑝𝑡]

✨ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:
• ${global.config.PREFIX}anigen 𝑐𝑢𝑡𝑒 𝑎𝑛𝑖𝑚𝑒 𝑔𝑖𝑟𝑙 𝑤𝑖𝑡ℎ 𝑝𝑖𝑛𝑘 ℎ𝑎𝑖𝑟
• ${global.config.PREFIX}anigen 𝑐𝑜𝑜𝑙 𝑎𝑛𝑖𝑚𝑒 𝑏𝑜𝑦 𝑤𝑖𝑡ℎ 𝑠𝑤𝑜𝑟𝑑
• ${global.config.PREFIX}anigen 𝑓𝑎𝑛𝑡𝑎𝑠𝑦 𝑙𝑎𝑛𝑑𝑠𝑐𝑎𝑝𝑒 𝑤𝑖𝑡ℎ 𝑐𝑎𝑠𝑡𝑙𝑒

💡 𝑇𝑖𝑝𝑠:
• 𝐵𝑒 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛
• 𝑈𝑠𝑒 𝑐𝑜𝑙𝑜𝑟𝑠 𝑎𝑛𝑑 𝑠𝑡𝑦𝑙𝑒𝑠
• 𝐴𝑑𝑑 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑑𝑒𝑡𝑎𝑖𝑙𝑠`;
                return message.reply(helpMessage);
            }

            const userPrompt = args.join(" ").trim();
            
            // Validate prompt length
            if (userPrompt.length < 3) {
                return message.reply("❌ 𝑃𝑟𝑜𝑚𝑝𝑡 𝑖𝑠 𝑡𝑜𝑜 𝑠ℎ𝑜𝑟𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑚𝑜𝑟𝑒 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛.");
            }

            if (userPrompt.length > 500) {
                return message.reply("❌ 𝑃𝑟𝑜𝑚𝑝𝑡 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑘𝑒𝑒𝑝 𝑖𝑡 𝑢𝑛𝑑𝑒𝑟 500 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠.");
            }

            const processingMsg = await message.reply("⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒... 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡, 𝑖𝑡 𝑚𝑎𝑦 𝑡𝑎𝑘𝑒 𝑎 𝑚𝑜𝑚𝑒𝑛𝑡. ✨");

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦");
            }

            const imagePath = path.join(cacheDir, `anime_${Date.now()}.png`);
            const encodedPrompt = encodeURIComponent(userPrompt);
            const apiUrl = `https://t2i.onrender.com/kshitiz?prompt=${encodedPrompt}`;

            console.log(`🔗 𝑈𝑠𝑖𝑛𝑔 𝐴𝑃𝐼: ${apiUrl}`);
            console.log(`📝 𝑃𝑟𝑜𝑚𝑝𝑡: ${userPrompt}`);

            let imageUrl = null;
            let imageResponse = null;

            try {
                // Fetch the image from the API with timeout
                console.log(`📡 𝑀𝑎𝑘𝑖𝑛𝑔 𝐴𝑃𝐼 𝑟𝑒𝑞𝑢𝑒𝑠𝑡...`);
                const response = await axios.get(apiUrl, { 
                    timeout: 60000, // 60 seconds timeout
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json'
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 600; // Accept all status codes for custom handling
                    }
                });

                console.log(`📊 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑠𝑡𝑎𝑡𝑢𝑠: ${response.status}`);

                if (response.status === 200 && response.data && response.data.imageUrl) {
                    imageUrl = response.data.imageUrl;
                    console.log(`📸 𝐼𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑: ${imageUrl}`);
                } else if (response.status === 429) {
                    throw new Error('𝑅𝐴𝑇𝐸_𝐿𝐼𝑀𝐼𝑇');
                } else if (response.status === 404) {
                    throw new Error('𝐴𝑃𝐼_𝑁𝑂𝑇_𝐹𝑂𝑈𝑁𝐷');
                } else if (response.status >= 500) {
                    throw new Error('𝑆𝐸𝑅𝑉𝐸𝑅_𝐸𝑅𝑅𝑂𝑅');
                } else {
                    throw new Error(`𝐼𝑁𝑉𝐴𝐿𝐼𝐷_𝑅𝐸𝑆𝑃𝑂𝑁𝑆𝐸: ${response.status}`);
                }

            } catch (apiError) {
                console.error(`❌ 𝐴𝑃𝐼 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑓𝑎𝑖𝑙𝑒𝑑:`, apiError.message);
                
                // Try to unsend processing message
                try {
                    if (processingMsg && processingMsg.messageID) {
                        await message.unsend(processingMsg.messageID);
                    }
                } catch (e) {}
                
                if (apiError.message === '𝑅𝐴𝑇𝐸_𝐿𝐼𝑀𝐼𝑇') {
                    return message.reply("❌ 𝐴𝑃𝐼 𝑟𝑎𝑡𝑒 𝑙𝑖𝑚𝑖𝑡 𝑟𝑒𝑎𝑐ℎ𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑖𝑛 𝑎 𝑓𝑒𝑤 𝑚𝑖𝑛𝑢𝑡𝑒𝑠.");
                } else if (apiError.message === '𝐴𝑃𝐼_𝑁𝑂𝑇_𝐹𝑂𝑈𝑁𝐷') {
                    return message.reply("❌ 𝐴𝑃𝐼 𝑒𝑛𝑑𝑝𝑜𝑖𝑛𝑡 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                } else if (apiError.message === '𝑆𝐸𝑅𝑉𝐸𝑅_𝐸𝑅𝑅𝑂𝑅') {
                    return message.reply("❌ 𝑆𝑒𝑟𝑣𝑒𝑟 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                } else if (apiError.code === 'ECONNABORTED') {
                    return message.reply("❌ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑖𝑚𝑝𝑙𝑒𝑟 𝑝𝑟𝑜𝑚𝑝𝑡.");
                } else if (apiError.code === 'ENOTFOUND' || apiError.code === 'ECONNREFUSED') {
                    return message.reply("❌ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡 𝑡𝑜 𝐴𝑃𝐼 𝑠𝑒𝑟𝑣𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                } else {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡.");
                }
            }

            try {
                // Download the image with timeout and size limit
                console.log(`📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 𝑓𝑟𝑜𝑚: ${imageUrl}`);
                imageResponse = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                    timeout: 45000, // 45 seconds timeout
                    maxContentLength: 10 * 1024 * 1024, // 10MB limit
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'image/*'
                    },
                    validateStatus: function (status) {
                        return status === 200; // Only accept 200 status for images
                    }
                });

                // Verify it's actually an image
                const contentType = imageResponse.headers['content-type'];
                if (!contentType || !contentType.startsWith('image/')) {
                    throw new Error('𝐼𝑁𝑉𝐴𝐿𝐼𝐷_𝐼𝑀𝐴𝐺𝐸_𝑇𝑌𝑃𝐸');
                }

            } catch (downloadError) {
                console.error(`❌ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑:`, downloadError.message);
                
                try {
                    if (processingMsg && processingMsg.messageID) {
                        await message.unsend(processingMsg.messageID);
                    }
                } catch (e) {}
                
                if (downloadError.message === '𝐼𝑁𝑉𝐴𝐿𝐼𝐷_𝐼𝑀𝐴𝐺𝐸_𝑇𝑌𝑃𝐸') {
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝐴𝑃𝐼. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
                } else if (downloadError.code === 'ECONNABORTED') {
                    return message.reply("❌ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
                } else if (downloadError.response?.status === 404) {
                    return message.reply("❌ 𝐼𝑚𝑎𝑔𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡.");
                } else {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
                }
            }

            try {
                // Save the image to cache
                await fs.writeFile(imagePath, Buffer.from(imageResponse.data));

                // Get file size and verify
                const stats = await fs.stat(imagePath);
                const fileSize = (stats.size / (1024 * 1024)).toFixed(2);
                
                if (parseFloat(fileSize) < 0.01) { // Less than 10KB - probably invalid
                    throw new Error('𝐼𝑁𝑉𝐴𝐿𝐼𝐷_𝐼𝑀𝐴𝐺𝐸_𝑆𝐼𝑍𝐸');
                }

                console.log(`✅ 𝐼𝑚𝑎𝑔𝑒 𝑠𝑎𝑣𝑒𝑑: ${fileSize}𝑀𝐵`);

                // Unsend processing message
                try {
                    if (processingMsg && processingMsg.messageID) {
                        await message.unsend(processingMsg.messageID);
                    }
                } catch (e) {}

                // Send the generated image
                await message.reply({
                    body: `✅ 𝐴𝑛𝑖𝑚𝑒 𝐼𝑚𝑎𝑔𝑒 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n📝 𝑃𝑟𝑜𝑚𝑝𝑡: ${userPrompt}\n📊 𝑆𝑖𝑧𝑒: ${fileSize}𝑀𝐵`,
                    attachment: fs.createReadStream(imagePath)
                });

                // Clean up the temporary file
                await fs.unlink(imagePath);
                console.log(`🧹 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒`);

            } catch (fileError) {
                console.error(`❌ 𝐹𝑖𝑙𝑒 𝑜𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑:`, fileError.message);
                
                try {
                    if (processingMsg && processingMsg.messageID) {
                        await message.unsend(processingMsg.messageID);
                    }
                } catch (e) {}
                
                if (fileError.message === '𝐼𝑁𝑉𝐴𝐿𝐼𝐷_𝐼𝑀𝐴𝐺𝐸_𝑆𝐼𝑍𝐸') {
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡.");
                } else {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑜𝑟 𝑠𝑒𝑛𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
                }
            }

        } catch (error) {
            console.error("💥 𝐴𝑛𝑖𝑔𝑒𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
