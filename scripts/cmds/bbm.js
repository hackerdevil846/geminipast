const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "bbm",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 1,
        role: 0,
        category: "memes",
        shortDescription: {
            en: "𝖣𝗋𝖺𝗄𝖾 𝗆𝖾𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝗈𝗋"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖣𝗋𝖺𝗄𝖾 𝗆𝖾𝗆𝖾𝗌 𝗐𝗂𝗍𝗁 𝖼𝗎𝗌𝗍𝗈𝗆 𝗍𝖾𝗑𝗍"
        },
        guide: {
            en: "{p}bbm 𝗍𝖾𝗑𝗍 1 | 𝗍𝖾𝗑𝗍 2"
        },
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("jimp");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝗃𝗂𝗆𝗉, 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const { senderID } = event;
            const pathImg = __dirname + `/cache/drake_${senderID}_${Date.now()}.png`;

            // Validate input
            if (!args[0]) {
                return message.reply(
                    `🎭 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗈𝗋𝗆𝖺𝗍!\n𝖴𝗌𝖾:\n${global.config.PREFIX}${this.config.name} 𝗍𝖾𝗑𝗍 1 | 𝗍𝖾𝗑𝗍 2\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾:\n${global.config.PREFIX}${this.config.name} 𝖨'𝗆 𝖼𝗈𝖽𝗂𝗇𝗀 | 𝖨'𝗆 𝖽𝖾𝖻𝗎𝗀𝗀𝗂𝗇𝗀`
                );
            }

            const inputText = args.join(" ");
            if (!inputText.includes("|")) {
                return message.reply(
                    `❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 "|" 𝗍𝗈 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾 𝗍𝗁𝖾 𝗍𝗐𝗈 𝗍𝖾𝗑𝗍𝗌!\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾:\n${global.config.PREFIX}${this.config.name} 𝗍𝖾𝗑𝗍 1 | 𝗍𝖾𝗑𝗍 2`
                );
            }

            const text = inputText
                .trim()
                .replace(/\s+/g, " ")
                .replace(/(\s+\|)/g, "|")
                .replace(/\|\s+/g, "|")
                .split("|");

            // Validate text length
            if (text.length < 2) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖻𝗈𝗍𝗁 𝗍𝖾𝗑𝗍𝗌 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽 𝖻𝗒 |");
            }

            if (text[0].length > 100 || text[1].length > 100) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 100 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            // Download Drake meme template with error handling
            let getImage;
            try {
                const response = await axios.get("https://i.imgur.com/qmXfxUx.png", { 
                    responseType: "arraybuffer",
                    timeout: 30000 
                });
                getImage = response.data;
            } catch (downloadError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖣𝗋𝖺𝗄𝖾 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾:", downloadError.message);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗆𝖾𝗆𝖾 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // Write image to cache
            try {
                fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));
            } catch (writeError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝗍𝗈 𝖼𝖺𝖼𝗁𝖾:", writeError.message);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Load image and font
            let image, font;
            try {
                image = await jimp.read(pathImg);
                font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
            } catch (loadError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 𝗈𝗋 𝖿𝗈𝗇𝗍:", loadError.message);
                // Cleanup on error
                try { fs.unlinkSync(pathImg); } catch (e) {}
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

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

            // Add text to image with error handling
            try {
                const line1 = wrapText(text[0], 464);
                const line2 = wrapText(text[1], 464);

                // First text position
                line1.forEach((line, index) => {
                    const textWidth = jimp.measureText(font, line);
                    image.print(font, 464 - (textWidth / 2), 100 + (index * 40), line);
                });

                // Second text position
                line2.forEach((line, index) => {
                    const textWidth = jimp.measureText(font, line);
                    image.print(font, 464 - (textWidth / 2), 310 + (index * 40), line);
                });

                // Save final image
                await image.writeAsync(pathImg);

            } catch (textError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖽𝖽 𝗍𝖾𝗑𝗍 𝗍𝗈 𝗂𝗆𝖺𝗀𝖾:", textError.message);
                // Cleanup on error
                try { fs.unlinkSync(pathImg); } catch (e) {}
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖽𝖽 𝗍𝖾𝗑𝗍 𝗍𝗈 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Send result
            try {
                await message.reply({
                    body: `🎭 𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝖣𝗋𝖺𝗄𝖾 𝗆𝖾𝗆𝖾:\n\n"${text[0]}"\n🆚\n"${text[1]}"\n\n✨ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗒 ${global.config.BOTNAME} 𝖻𝗈𝗍`,
                    attachment: fs.createReadStream(pathImg)
                });
            } catch (sendError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", sendError.message);
            }

            // Cleanup
            try {
                if (fs.existsSync(pathImg)) {
                    fs.unlinkSync(pathImg);
                }
            } catch (cleanupError) {
                console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError.message);
            }

        } catch (error) {
            console.error("💥 𝖡𝖡𝖬 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
