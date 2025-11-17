const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "setrankup",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "system",
        shortDescription: {
            en: "Send random GIF when user levels up"
        },
        longDescription: {
            en: "Automatically sends a random GIF from rankup folder when user levels up"
        },
        guide: {
            en: "This command works automatically when user levels up"
        },
        countDown: 5,
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            const rankupPath = path.join(__dirname, "cache", "rankup");
            
            // Check if folder exists
            if (!fs.existsSync(rankupPath)) {
                return message.reply("❌ Rankup folder not found!");
            }

            // Get all GIF files from the folder
            const files = fs.readdirSync(rankupPath);
            const gifFiles = files.filter(file => 
                file.toLowerCase().endsWith('.gif')
            );

            if (gifFiles.length === 0) {
                return message.reply("❌ No GIF files found in rankup folder!");
            }

            // Select random GIF
            const randomGif = gifFiles[Math.floor(Math.random() * gifFiles.length)];
            const gifPath = path.join(rankupPath, randomGif);

            // Send the GIF
            await message.reply({
                body: "",
                attachment: fs.createReadStream(gifPath)
            });

        } catch (error) {
            console.error("Rankup error:", error);
            await message.reply("❌ Error sending rankup GIF");
        }
    }
};
