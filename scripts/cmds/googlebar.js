const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "googlebar",
        aliases: ["googlesearch", "gbar"],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟 𝑖𝑚𝑎𝑔𝑒"
        },
        longDescription: {
            en: "𝑇𝑎𝑘𝑒𝑠 𝑡𝑒𝑥𝑡 𝑎𝑛𝑑 𝑟𝑒𝑛𝑑𝑒𝑟𝑠 𝑖𝑡 𝑜𝑛 𝑎 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟 𝑖𝑚𝑎𝑔𝑒"
        },
        guide: {
            en: "{p}googlebar [𝑡𝑒𝑥𝑡]"
        },
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        try {
            const text = args.join(" ");
            
            if (!text) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑠𝑜𝑚𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑝𝑢𝑡 𝑜𝑛 𝑡ℎ𝑒 𝐺𝑜𝑜𝑔𝑙𝑒 𝑏𝑎𝑟.");
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const pathImg = path.join(cacheDir, 'google.png');
            
            // Download the Google bar template
            const { data } = await axios.get("https://i.imgur.com/GXPQYtT.png", {
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(pathImg, Buffer.from(data, 'binary'));

            // Load the image with jimp
            const image = await jimp.read(pathImg);
            const font = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);

            // Simple text wrapping function for jimp
            function wrapText(text, maxWidth) {
                const words = text.split(' ');
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

            // Wrap text and draw on image
            const lines = wrapText(text, 400);
            const x = 140;
            const y = 70;
            const lineHeight = 20;

            // Draw each line of text
            lines.forEach((line, index) => {
                image.print(font, x, y + (index * lineHeight), line);
            });

            // Save the modified image
            const outputPath = path.join(cacheDir, 'google_result.png');
            await image.writeAsync(outputPath);

            // Send the image
            await message.reply({
                body: "✅ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟!",
                attachment: fs.createReadStream(outputPath)
            });

            // Clean up temporary files
            try {
                if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            } catch (cleanupError) {
                console.log("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
            }
            
        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟:", error);
            // Don't send error message to avoid spam
        }
    }
};
