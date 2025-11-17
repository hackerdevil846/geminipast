const axios = require("axios");

module.exports = {
    config: {
        name: "dictionary",
        aliases: ["dict", "define"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "English dictionary checker"
        },
        longDescription: {
            en: "Checks word definitions and meanings from the dictionary"
        },
        guide: {
            en: "{p}dictionary [word]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return message.reply("❌ Missing dependency: axios");
            }

            if (!args[0]) {
                return message.reply("🔍 | Please provide a word to search!\nUsage: {p}dictionary [word]");
            }

            const word = args.join(" ").trim().toLowerCase();

            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = response.data[0];
            
            let messageText = `📚 DICTIONARY RESULTS 📚\n\n`;
            messageText += `✨ Word: ${data.word}\n\n`;

            if (data.phonetics && data.phonetics.length > 0) {
                data.phonetics.forEach(phonetic => {
                    if (phonetic.text) messageText += `🔊 Pronunciation: /${phonetic.text}/\n`;
                    if (phonetic.audio) messageText += `🎵 Audio: ${phonetic.audio}\n`;
                });
                messageText += `\n`;
            }

            data.meanings.forEach(meaning => {
                messageText += `📌 Part of Speech: ${meaning.partOfSpeech}\n`;
                
                if (meaning.definitions && meaning.definitions.length > 0) {
                    meaning.definitions.slice(0, 3).forEach((def, index) => {
                        messageText += `\n${index + 1}⃣ Definition: ${def.definition}\n`;
                        if (def.example) messageText += `✏️ Example: ${def.example}\n`;
                    });
                }
                messageText += `\n────────────────\n\n`;
            });

            messageText += `💖 Powered by Asif Mahmud`;

            return message.reply(messageText);

        } catch (error) {
            if (error.response?.status === 404) {
                return message.reply(`❌ | Word "${args.join(" ")}" not found in the dictionary!`);
            }
            console.error("Dictionary Error:", error);
            return message.reply("❌ | An error occurred while fetching the dictionary data.");
        }
    }
};
