const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "modi",
        aliases: ["modimeme"],
        version: "1.1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "edit-image",
        shortDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑀𝑜𝑑𝑖-𝑡ℎ𝑒𝑚𝑒𝑑 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑀𝑜𝑑𝑖-𝑠𝑡𝑦𝑙𝑒 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑐𝑎𝑝𝑡𝑖𝑜𝑛"
        },
        guide: {
            en: "{p}modi [𝑡𝑒𝑥𝑡]"
        },
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            if (!args[0]) {
                return message.reply("🌟 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑦𝑜𝑢𝑟 𝑐𝑎𝑝𝑡𝑖𝑜𝑛 𝑡𝑒𝑥𝑡!\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}modi 𝐼𝑛𝑑𝑖𝑎 𝑤𝑖𝑙𝑙 𝑏𝑒𝑐𝑜𝑚𝑒 𝑉𝑖𝑠ℎ𝑤𝑎𝑔𝑢𝑟𝑢");
            }
            
            const text = args.join(" ");
            const imgURL = "https://i.ibb.co/98GsJJM/image.jpg";
            
            // Download base image
            const { data } = await axios.get(imgURL, { responseType: "arraybuffer" });
            const image = await jimp.read(data);
            const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);

            // Simple text wrapping function
            function wrapText(text, maxWidth) {
                const words = text.split(" ");
                const lines = [];
                let currentLine = words[0];
                
                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    const width = jimp.measureText(font, currentLine + " " + word);
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine);
                return lines;
            }

            // Apply text to image
            const lines = wrapText(text, 600);
            const startY = 120;
            const lineHeight = 40;
            
            lines.forEach((line, index) => {
                image.print(font, 48, startY + (index * lineHeight), line);
            });

            // Get image buffer
            const imageBuffer = await image.getBufferAsync(jimp.MIME_PNG);

            // Send result
            await message.reply({
                body: "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑!\n🗳️ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑀𝑜𝑑𝑖 𝑚𝑒𝑚𝑒:",
                attachment: imageBuffer
            });
            
        } catch (err) {
            console.error("𝑀𝑜𝑑𝑖 𝑚𝑒𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", err);
            // Don't send error message to avoid spam
        }
    }
};
