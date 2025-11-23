const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "neko",
        aliases: ["catgirl", "nekogirl"],
        version: "1.2.0",
        role: 0,
        author: "Asif Mahmud",
        category: "anime",
        shortDescription: {
            en: "Get random anime neko girl images"
        },
        longDescription: {
            en: "Sends random anime neko girl images from the local database."
        },
        guide: {
            en: "{p}neko"
        },
        countDown: 5,
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // --- 1. Dependency Check ---
            try {
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ Missing dependencies: fs-extra. Please install it first.");
            }

            // --- 2. Smart Path Finding System ---
            // Scans multiple locations to find 'neko.json' automatically
            const candidates = [
                path.join(process.cwd(), 'data', 'anime', 'neko.json'),          // Priority 1: Project Root/data/anime/neko.json
                path.join(__dirname, 'data', 'anime', 'neko.json'),              // Priority 2: Current Dir/data/anime/neko.json
                path.join(process.cwd(), 'src', 'data', 'anime', 'neko.json'),   // Priority 3: Src folder
                path.join(__dirname, '..', 'data', 'anime', 'neko.json'),        // Priority 4: One level up
                path.join(__dirname, '..', '..', 'data', 'anime', 'neko.json')   // Priority 5: Two levels up
            ];

            let dataPath = null;
            for (const candidate of candidates) {
                if (fs.existsSync(candidate)) {
                    dataPath = candidate;
                    break;
                }
            }

            // If no path is found after scanning all candidates:
            if (!dataPath) {
                console.error("❌ Debug: Could not find neko.json in any candidate path.");
                return message.reply("❌ Data file not found. Please ensure 'neko.json' exists inside the 'data/anime/' folder.");
            }

            // --- 3. Load and Validate Data ---
            let nekoData;
            try {
                nekoData = fs.readJsonSync(dataPath);
            } catch (err) {
                console.error("JSON Read Error:", err);
                return message.reply("❌ Error reading JSON file. The file might be malformed.");
            }

            if (!nekoData || !Array.isArray(nekoData) || nekoData.length === 0) {
                return message.reply("❌ The neko database is empty or invalid.");
            }

            // --- 4. Get Random URL ---
            const randomUrl = nekoData[Math.floor(Math.random() * nekoData.length)];

            if (!randomUrl || typeof randomUrl !== 'string') {
                return message.reply("❌ Fetched invalid data from database (missing URL).");
            }

            // --- 5. Send the Image ---
            const stream = await global.utils.getStreamFromURL(randomUrl);

            await message.reply({
                body: "🐾 Random Anime Neko Girl 🐾\n\n© Asif Mahmud",
                attachment: stream
            });

        } catch (error) {
            console.error("Neko Command Error:", error);
            await message.reply("❌ Failed to send neko image. Check console for details.");
        }
    }
};
