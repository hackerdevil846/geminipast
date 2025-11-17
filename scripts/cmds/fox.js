const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "fox",
        aliases: ["randomfox", "foxpic"],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "Random fox images"
        },
        longDescription: {
            en: "Get random fox images from randomfox.ca API"
        },
        guide: {
            en: "{p}fox"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ Missing dependencies: axios and fs-extra");
            }

            const res = await axios.get("https://randomfox.ca/floof/");
            const img = res.data.image;
            const file = path.join(__dirname, "cache/fox.jpg");
            
            const response = await axios({
                method: 'GET',
                url: img,
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(file);
            response.data.pipe(writer);

            writer.on('finish', () => {
                message.reply({
                    body: "🦊 Random Fox:",
                    attachment: fs.createReadStream(file)
                });
                // Clean up file after sending
                fs.unlinkSync(file);
            });

            writer.on('error', (error) => {
                console.error("Fox Error:", error);
                message.reply("❌ Failed to download fox image.");
            });

        } catch (error) {
            console.error("Fox API Error:", error);
            message.reply("❌ Failed to get fox image.");
        }
    }
};
