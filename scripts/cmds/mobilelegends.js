const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
    config: {
        name: "mobilelegends",
        aliases: ["mlmeme", "mlmemes"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 0,
        category: "𝑒𝑛𝑡𝑒𝑟𝑡𝑎𝑖𝑛𝑚𝑒𝑛𝑡",
        shortDescription: {
            en: "𝑀𝑜𝑏𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑒𝑟 𝑚𝑒𝑚𝑒"
        },
        longDescription: {
            en: "𝐺𝑒𝑡 𝑡𝑟𝑒𝑛𝑑𝑖𝑛𝑔 𝑀𝑜𝑏𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝑒𝑓𝑓𝑒𝑐𝑡𝑠"
        },
        guide: {
            en: "{p}mobilelegends"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑐𝑎𝑛𝑣𝑎𝑠.");
            }

            // Fetch trending memes from r/MobileLegendsGame subreddit
            const redditResponse = await axios.get("https://www.reddit.com/r/MobileLegendsGame/hot.json?limit=50", {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const posts = redditResponse.data.data.children;

            // Filter for image posts and extract image URLs
            const imageUrls = posts.filter(post => post.data.post_hint === 'image' && !post.data.is_video && !post.data.is_self)
                                .map(post => post.data.url);

            if (imageUrls.length === 0) {
                return message.reply("𝑆𝑜𝑟𝑟𝑦, 𝑛𝑜 𝑡𝑟𝑒𝑛𝑑𝑖𝑛𝑔 𝑀𝑜𝑏𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡 𝑡ℎ𝑒 𝑚𝑜𝑚𝑒𝑛𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }

            const randomMemeUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
            
            // Fetch the image
            const imageResponse = await axios.get(randomMemeUrl, { 
                responseType: 'arraybuffer',
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const image = await loadImage(Buffer.from(imageResponse.data));

            // Create canvas with image dimensions
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext('2d');

            // Draw the original image
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Add stylish text overlay
            const fontSize = Math.max(20, Math.min(60, canvas.width / 15));
            ctx.font = `𝑏𝑜𝑙𝑑 ${fontSize}𝑝𝑥 𝐼𝑚𝑝𝑎𝑐𝑡, 𝐴𝑟𝑖𝑎𝑙`;
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            
            // Add shadow for better visibility
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;

            // Add text at the bottom
            const text = '🎮 𝑀𝑂𝐵𝐼𝐿𝐸 𝐿𝐸𝐺𝐸𝑁𝐷𝑆 𝑀𝐸𝑀𝐸! 🎮';
            const textY = canvas.height - (fontSize / 2);
            
            ctx.strokeText(text, canvas.width / 2, textY);
            ctx.fillText(text, canvas.width / 2, textY);

            // Convert to buffer
            const attachment = canvas.toBuffer();

            // Save to cache
            const cachePath = __dirname + "/cache/mobilelegends_meme.jpg";
            fs.writeFileSync(cachePath, attachment);

            // Send the enhanced meme
            await message.reply({
                body: `🤣 𝐸𝑖 𝑛𝑎𝑜 𝑡𝑜𝑚𝑎𝑟 𝑀𝑜𝑏𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑒𝑟 𝑚𝑒𝑚𝑒! 🤣\n\n✨ 𝐵𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙𝑙𝑦 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝑤𝑖𝑡ℎ 𝐶𝑎𝑛𝑣𝑎𝑠! ✨\n🔥 𝐶𝑟𝑒𝑑𝑖𝑡𝑠: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 🔥`,
                attachment: fs.createReadStream(cachePath)
            });

            // Clean up
            fs.unlinkSync(cachePath);

        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑀𝑜𝑏𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑚𝑒𝑚𝑒:", error);
            
            // Fallback message with error handling
            await message.reply(`❌ 𝑆𝑜𝑟𝑟𝑦, 𝑎𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑀𝑜𝑏𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑚𝑒𝑚𝑒.\n\n🔄 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!\n\n🎮 𝐶𝑟𝑒𝑑𝑖𝑡𝑠: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`);
        }
    }
};
