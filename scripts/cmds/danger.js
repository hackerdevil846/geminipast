const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "danger",
        aliases: ["caution", "warningsign"],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "Create a danger style image with custom text"
        },
        longDescription: {
            en: "Generates a danger style meme image using your text"
        },
        guide: {
            en: "{p}danger <text>"
        },
        dependencies: {
            "axios": "",
            "fs": "",
            "path": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs");
                require("path");
            } catch (e) {
                return message.reply("❌ Missing dependencies: axios, fs, and path");
            }

            if (!args.length) {
                return message.reply("❌ Please provide text for the danger image.");
            }

            const text = encodeURIComponent(args.join(" "));
            
            // Show processing message
            await message.reply("⚠️ Generating danger image...");

            const res = await axios.get(`https://api.popcat.xyz/v2/caution?text=${text}`, {
                responseType: "arraybuffer"
            });

            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const filePath = path.join(cacheDir, `danger_${Date.now()}.png`);
            fs.writeFileSync(filePath, res.data);

            await message.reply({
                body: "☣️ Here's your danger image!",
                attachment: fs.createReadStream(filePath)
            });

            // Clean up
            fs.unlinkSync(filePath);

        } catch (err) {
            console.error("Danger command error:", err);
            await message.reply("❌ Failed to generate danger image. Please try again later.");
        }
    }
};
