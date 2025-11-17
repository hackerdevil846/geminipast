const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "caption",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑓𝑢𝑛",
        shortDescription: {
            en: "𝐴𝑑𝑑 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝐴𝑑𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝑃𝑜𝑝𝐶𝑎𝑡 𝐴𝑃𝐼"
        },
        guide: {
            en: "{p}caption [𝑡𝑒𝑥𝑡]"
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

            if (args.length === 0) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑐𝑎𝑝𝑡𝑖𝑜𝑛.\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}caption 𝐻𝑒𝑙𝑙𝑜 𝑀𝑜𝑡ℎ𝑒𝑟 𝐹𝑢𝑐𝑘𝑒𝑟");
            }

            const text = args.join(" ").trim();

            if (!text) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑣𝑎𝑙𝑖𝑑 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑐𝑎𝑝𝑡𝑖𝑜𝑛.");
            }

            // Create cache directory
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const filePath = path.join(cacheDir, `caption_${Date.now()}.png`);

            try {
                // Fixed parameters as you requested
                const imageUrl = "https://cdn.popcat.xyz/avatar.png";
                const bottom = "false";
                const dark = "true";
                const fontSize = "30";

                // Only encode the text
                const encodedText = encodeURIComponent(text);
                const encodedImage = encodeURIComponent(imageUrl);

                // Build API URL with your exact parameters
                const apiUrl = `https://api.popcat.xyz/v2/caption?image=${encodedImage}&text=${encodedText}&bottom=${bottom}&dark=${dark}&fontsize=${fontSize}`;

                console.log(`🔗 𝐴𝑃𝐼 𝑈𝑅𝐿: ${apiUrl}`);

                // Generate caption image
                const response = await axios.get(apiUrl, {
                    responseType: "arraybuffer",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                // Save the image
                fs.writeFileSync(filePath, Buffer.from(response.data));

                // Send the image
                await message.reply({
                    body: `📝 𝐶𝑎𝑝𝑡𝑖𝑜𝑛 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n💬 "${text}"`,
                    attachment: fs.createReadStream(filePath)
                });

            } catch (apiError) {
                console.error("𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", apiError);
                
                if (apiError.response?.status === 400) {
                    await message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑡𝑒𝑥𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑡𝑒𝑥𝑡.");
                } else if (apiError.code === 'ECONNREFUSED') {
                    await message.reply("❌ 𝐴𝑃𝐼 𝑠𝑒𝑟𝑣𝑒𝑟 𝑖𝑠 𝑑𝑜𝑤𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                } else if (apiError.code === 'ETIMEDOUT') {
                    await message.reply("❌ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
                } else {
                    await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑎𝑝𝑡𝑖𝑜𝑛 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
                }
            }

            // Clean up file
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (cleanupError) {
                console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝐸𝑟𝑟𝑜𝑟:", cleanupError);
            }

        } catch (error) {
            console.error("𝐶𝑎𝑝𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
