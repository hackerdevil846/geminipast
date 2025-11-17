const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "drake",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "Create Drake meme with custom text"
        },
        longDescription: {
            en: "Generate Drake memes with customizable text"
        },
        guide: {
            en: "{p}drake [text 1] | [text 2]"
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
                return message.reply("❌ Missing dependencies: axios and fs-extra");
            }

            const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
            
            if (!text[0] || !text[1]) {
                return message.reply("❌ Invalid format!\n💡 Use: drake [text 1] | [text 2]");
            }

            // Use API to generate Drake meme
            const apiUrl = `https://api.popcat.xyz/drake?text1=${encodeURIComponent(text[0])}&text2=${encodeURIComponent(text[1])}`;
            
            const imageResponse = await axios.get(apiUrl, {
                responseType: "arraybuffer"
            });

            const pathImg = __dirname + `/cache/drake_${event.senderID}.png`;
            fs.writeFileSync(pathImg, Buffer.from(imageResponse.data, "utf-8"));

            await message.reply({
                body: "🖼️ Here's your Drake meme!",
                attachment: fs.createReadStream(pathImg)
            });

            // Clean up
            fs.unlinkSync(pathImg);

        } catch (error) {
            console.error("Drake error:", error);
            await message.reply("❌ Error generating image. Please try again later.");
        }
    }
};
