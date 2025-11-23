const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "animewaifu",
        aliases: [],
        version: "1.2.0",
        role: 0,
        author: "Asif Mahmud",
        category: "anime",
        shortDescription: {
            en: "Get random anime waifu images"
        },
        longDescription: {
            en: "Sends random anime waifu images from the local database."
        },
        guide: {
            en: "{p}animewaifu"
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
            // This scans multiple locations to find the file automatically
            const candidates = [
                path.join(process.cwd(), 'data', 'anime', 'waifu.json'),          // Priority: Project Root
                path.join(__dirname, 'data', 'anime', 'waifu.json'),              // Current Dir
                path.join(process.cwd(), 'src', 'data', 'anime', 'waifu.json'),   // Src folder
                path.join(__dirname, '..', 'data', 'anime', 'waifu.json'),        // One level up
                path.join(__dirname, '..', '..', 'data', 'anime', 'waifu.json')   // Two levels up
            ];

            let waifuPath = null;
            for (const candidate of candidates) {
                if (fs.existsSync(candidate)) {
                    waifuPath = candidate;
                    break;
                }
            }

            // If loop finishes and no path is found:
            if (!waifuPath) {
                console.error("❌ Debug: Could not find waifu.json in any candidate path.");
                return message.reply("❌ Waifu data file not found. Please ensure 'waifu.json' exists inside the 'data/anime/' folder.");
            }

            // --- 3. Load and Validate Data ---
            let waifuData;
            try {
                waifuData = fs.readJsonSync(waifuPath);
            } catch (err) {
                return message.reply("❌ Error reading JSON file. The file might be malformed.");
            }

            if (!waifuData || !Array.isArray(waifuData) || waifuData.length === 0) {
                return message.reply("❌ The waifu database is empty or invalid.");
            }

            // --- 4. Get Random URL ---
            const randomUrl = waifuData[Math.floor(Math.random() * waifuData.length)];

            if (!randomUrl || typeof randomUrl !== 'string') {
                return message.reply("❌ Fetched invalid data from database.");
            }

            // --- 5. Send the Image ---
            // Using the bot's global utility to fetch the stream
            const stream = await global.utils.getStreamFromURL(randomUrl);

            await message.reply({
                body: "🌸 Random Anime Waifu 🌸\n\n© Asif Mahmud",
                attachment: stream
            });

        } catch (error) {
            console.error("AnimeWaifu Command Error:", error);
            await message.reply("❌ Failed to send waifu image. Check console for details.");
        }
    }
};
