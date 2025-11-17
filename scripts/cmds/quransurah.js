const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "quransurah",
        aliases: [],
        version: "1.0.1",
        role: 0,
        author: "Asif Mahmud",
        category: "islamic",
        shortDescription: {
            en: "Get Quran surah information and recitation"
        },
        longDescription: {
            en: "Fetch Quran surah details, verses and audio recitations"
        },
        guide: {
            en: "{p}quransurah [surah_number]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, args, global }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ Missing dependencies: axios and fs-extra");
            }

            const surahNumber = parseInt(args[0]);
            
            if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
                return message.reply("⚠️ Please enter a valid surah number (1-114)\n💡 Guide: {p}quransurah [surah_number]");
            }

            let surahData = null;
            let apiUsed = false;

            await message.react("⏳");

            try {
                // Try to fetch from API first
                console.log(`📡 Attempting to fetch surah ${surahNumber} from API...`);
                const response = await axios.get(`https://quranapi.pages.dev/api/${surahNumber}.json`, {
                    timeout: 15000
                });
                surahData = response.data;
                apiUsed = true;
                console.log(`✅ Successfully fetched surah ${surahNumber} from API`);
            } catch (apiError) {
                console.log(`❌ API failed for surah ${surahNumber}, using backup data...`);
                
                // Use backup data from local file
                try {
                    const backupPath = path.join(__dirname, 'data', 'islamic', 'surah', 'allsura.json');
                    
                    if (fs.existsSync(backupPath)) {
                        console.log(`📁 Loading backup data from: ${backupPath}`);
                        const backupData = fs.readJsonSync(backupPath);
                        
                        if (Array.isArray(backupData)) {
                            surahData = backupData.find(surah => surah.number_of_surah === surahNumber);
                        } else if (backupData[surahNumber]) {
                            surahData = backupData[surahNumber];
                        }
                    } else {
                        console.log(`❌ Backup file not found: ${backupPath}`);
                    }
                    
                    if (!surahData) {
                        throw new Error("Surah not found in backup data");
                    }
                    
                    console.log(`✅ Successfully loaded surah ${surahNumber} from backup data`);
                } catch (backupError) {
                    console.error("💥 Backup data error:", backupError);
                    await message.react("❌");
                    return message.reply("❌ Both API and backup data failed. Please try again later.");
                }
            }

            if (!surahData) {
                await message.react("❌");
                return message.reply("❌ Failed to fetch surah data. Please try again later.");
            }

            // Build message body
            let messageBody = `📖 *${surahData.name || 'Unknown Surah'}*`;
            
            if (surahData.name_translations?.en) {
                messageBody += ` (${surahData.name_translations.en})`;
            }
            messageBody += `\n\n`;
            
            messageBody += `🔢 Surah Number: ${surahData.number_of_surah || surahData.number || 'N/A'}\n`;
            messageBody += `📋 Total Verses: ${surahData.number_of_ayah || surahData.verses_count || 'N/A'}\n`;
            messageBody += `📍 Revelation Place: ${surahData.place || 'N/A'}\n`;
            messageBody += `📚 Type: ${surahData.type || 'N/A'}\n\n`;

            // Add first 3 verses if available
            if (surahData.verses && Array.isArray(surahData.verses) && surahData.verses.length > 0) {
                messageBody += "📜 Sample Verses:\n";
                for (let i = 0; i < Math.min(3, surahData.verses.length); i++) {
                    const verse = surahData.verses[i];
                    if (verse.text) {
                        messageBody += `${verse.number || i + 1}. ${verse.text}\n`;
                        if (verse.translation_en) {
                            messageBody += `   ➡️ ${verse.translation_en}\n`;
                        }
                        messageBody += `\n`;
                    }
                }
            } else if (surahData.arabic_text) {
                messageBody += `📜 Arabic Text: ${surahData.arabic_text.substring(0, 100)}...\n\n`;
            }

            // Add recitations info if available
            if (surahData.recitations && Array.isArray(surahData.recitations) && surahData.recitations.length > 0) {
                messageBody += "🎧 Available Recitations:\n";
                surahData.recitations.forEach((recitation, index) => {
                    messageBody += `${index + 1}. ${recitation.name || recitation.reciter || 'Unknown Reciter'}\n`;
                });
                messageBody += `\n💡 Guide: {p}surahaudio ${surahNumber} [reciter_number]`;

                // Store recitations globally for reply handler
                global.quranSurahAudioOptions = {
                    reciters: surahData.recitations,
                    surahInfo: `${surahData.name} (${surahData.number_of_surah || surahNumber})`,
                    eventID: message.messageID
                };
            } else {
                messageBody += `\n💡 Guide: {p}surahaudio ${surahNumber} to listen to recitations`;
            }

            // Add source info
            messageBody += `\n\n📡 Source: ${apiUsed ? 'Quran API' : 'Local Backup'}`;

            await message.react("✅");
            await message.reply(messageBody);

        } catch (error) {
            console.error("💥 QuranSurah command error:", error);
            await message.react("❌");
            
            let errorMessage = "❌ Failed to fetch surah information. Please try again later.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ Network error: Cannot connect to server.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ Timeout error: Server is taking too long to respond.";
            } else if (error.message.includes('ENOENT')) {
                errorMessage = "❌ Backup data file not found. Please check the data folder.";
            }
            
            await message.reply(errorMessage);
        }
    },

    onReply: async function({ message, event, global }) {
        try {
            // Check if this reply is for our surah audio request
            if (!global.quranSurahAudioOptions || global.quranSurahAudioOptions.eventID !== event.messageReply.messageID) {
                return;
            }

            const selectedNumber = parseInt(event.body);
            const { reciters, surahInfo } = global.quranSurahAudioOptions;

            if (isNaN(selectedNumber)) {
                return message.reply("❌ Please reply with a valid number (e.g., 1, 2, etc.) for the reciter.");
            }
            
            if (selectedNumber < 1 || selectedNumber > reciters.length) {
                return message.reply(`❌ Invalid selection. Please reply with a number between 1-${reciters.length}.`);
            }

            const selectedReciter = reciters[selectedNumber - 1];
            const audioUrl = selectedReciter.url || selectedReciter.link;
            
            if (!audioUrl) {
                return message.reply("❌ Audio URL not available for the selected reciter. Please try another one.");
            }

            await message.react("🎧");

            console.log(`🎧 Attempting to stream audio from: ${audioUrl}`);
            
            if (!global.utils || typeof global.utils.getStreamFromURL !== 'function') {
                throw new Error("Global utilities for streaming audio are not available.");
            }

            const stream = await global.utils.getStreamFromURL(audioUrl);

            if (!stream) {
                throw new Error("Failed to create audio stream.");
            }

            await message.reply({
                body: `🎧 Playing ${surahInfo} by *${selectedReciter.reciter || selectedReciter.name || 'Unknown Reciter'}*`,
                attachment: stream
            });

            await message.react("✅");

            // Clean up global audio options
            delete global.quranSurahAudioOptions;

        } catch (error) {
            console.error('💥 QuranSurah reply handler error:', error);
            await message.react("❌");
            
            let errorMessage = "❌ An error occurred while trying to play the recitation. Please try again later.";
            
            if (error.message.includes('getStreamFromURL')) {
                errorMessage = "❌ Failed to load audio stream. Please check the audio URL.";
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ Network error: Cannot connect to audio server.";
            }
            
            await message.reply(errorMessage);
            
            // Clean up on error
            if (global.quranSurahAudioOptions) {
                delete global.quranSurahAudioOptions;
            }
        }
    }
};
