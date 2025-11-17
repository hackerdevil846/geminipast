const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "hand",
        aliases: [],
        version: "2.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🤝 𝑇𝑤𝑜 𝑝𝑒𝑜𝑝𝑙𝑒 ℎ𝑜𝑙𝑑𝑖𝑛𝑔 ℎ𝑎𝑛𝑑𝑠 𝑐𝑟𝑒𝑎𝑡𝑜𝑟"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑖𝑚𝑎𝑔𝑒 𝑜𝑓 𝑡𝑤𝑜 𝑝𝑒𝑜𝑝𝑙𝑒 ℎ𝑜𝑙𝑑𝑖𝑛𝑔 ℎ𝑎𝑛𝑑𝑠"
        },
        category: "𝑙𝑜𝑣𝑒",
        guide: {
            en: "{p}hand [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            const { resolve } = require("path");
            const dirMaterial = resolve(__dirname, 'cache', 'canvas');
            const bgPath = resolve(dirMaterial, 'hand_bg.png');
            
            if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
            if (!fs.existsSync(bgPath)) {
                const response = await axios({
                    method: 'GET',
                    url: "https://i.imgur.com/vcG4det.jpg",
                    responseType: 'stream'
                });
                response.data.pipe(fs.createWriteStream(bgPath));
            }
        } catch (error) {
            console.log("𝐶𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error.message);
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
                require("jimp");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑛𝑑 𝑗𝑖𝑚𝑝.");
            }

            const { threadID, messageID, senderID } = event;
            
            if (!args[0]) return message.reply("🌸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 ℎ𝑜𝑙𝑑 ℎ𝑎𝑛𝑑𝑠!");
            
            const mention = Object.keys(event.mentions)[0];
            if (!mention) return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑚𝑒𝑛𝑡𝑖𝑜𝑛, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑎 𝑢𝑠𝑒𝑟!");
            
            const tag = event.mentions[mention].replace("@", "");
            
            async function makeImage(one, two) {
                const __root = path.resolve(__dirname, "cache", "canvas");
                const bgPath = path.resolve(__root, 'hand_bg.png');
                const outputPath = path.resolve(__root, `hand_${one}_${two}.png`);
                
                // Download profile pictures
                const [avatarOne, avatarTwo] = await Promise.all([
                    axios.get(`https://graph.facebook.com/${one}/picture?width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
                    axios.get(`https://graph.facebook.com/${two}/picture?width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })
                ]);

                // Process images with Canvas
                const canvas = createCanvas(700, 440);
                const ctx = canvas.getContext('2d');
                
                // Draw background
                const bg = await loadImage(bgPath);
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
                
                // Draw circular profile pictures
                const drawAvatar = async (img, x, y, size) => {
                    const avatar = await loadImage(img);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatar, x, y, size, size);
                    ctx.restore();
                };

                await drawAvatar(Buffer.from(avatarOne.data), 280, 90, 60); // Position 1
                await drawAvatar(Buffer.from(avatarTwo.data), 40, 130, 50); // Position 2
                
                // Save final image
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync(outputPath, buffer);
                
                return outputPath;
            }

            const imagePath = await makeImage(senderID, mention);
            
            await message.reply({ 
                body: `🤝 𝐻𝑜𝑙𝑑𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 ℎ𝑎𝑛𝑑 𝑓𝑜𝑟𝑒𝑣𝑒𝑟 ${tag}!\n💝 𝐷𝑜𝑛'𝑡 𝑙𝑒𝑡 𝑔𝑜 𝑚𝑦 𝑙𝑜𝑣𝑒...`,
                mentions: [{ tag, id: mention }],
                attachment: fs.createReadStream(imagePath)
            });
            
            // Clean up
            fs.unlinkSync(imagePath);
            
        } catch (error) {
            console.error(error);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!");
        }
    }
};
