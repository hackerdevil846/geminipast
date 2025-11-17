const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "darkjoke",
        aliases: ["dark", "meme", "djoke"],
        version: "1.0.0",
        role: 0,
        author: "Asif Mahmud",
        category: "fun",
        shortDescription: {
            en: "Send random dark jokes and memes"
        },
        longDescription: {
            en: "Fetch and send random dark jokes from json database"
        },
        guide: {
            en: "{p}darkjoke"
        },
        countDown: 5,
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

            // Load dark jokes from JSON file
            const jsonPath = path.join(__dirname, 'data', 'drakjokes.json');
            
            if (!fs.existsSync(jsonPath)) {
                return message.reply("❌ Dark jokes database not found. Please check the file path.");
            }

            // Read and parse JSON file
            const jsonData = fs.readFileSync(jsonPath, 'utf-8');
            const darkJokesData = JSON.parse(jsonData);

            if (!Array.isArray(darkJokesData) || darkJokesData.length === 0) {
                return message.reply("❌ No dark jokes available in the database.");
            }

            // Extract URLs from JSON data
            const darkJokeUrls = darkJokesData.map(item => item.result);

            // Select random joke
            const randomJokeUrl = darkJokeUrls[Math.floor(Math.random() * darkJokeUrls.length)];
            
            if (!randomJokeUrl) {
                return message.reply("❌ Invalid joke data. Please try again.");
            }

            // Get image stream
            const imageStream = await global.utils.getStreamFromURL(randomJokeUrl);

            await message.reply({
                body: "😈 Here's your dark joke/meme! ⚡\n\nDisclaimer: These are just jokes, don't take them seriously!",
                attachment: imageStream
            });

        } catch (error) {
            console.error("Darkjoke command error:", error);
            await message.reply("❌ Failed to fetch dark joke. Please try again later.");
        }
    }
};
