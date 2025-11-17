const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "quranverse",
        aliases: [],
        version: "2.1",
        role: 0,
        author: "Asif Mahmud",
        category: "islam",
        shortDescription: {
            en: "🌙 Get Quran verses with translations and audio"
        },
        longDescription: {
            en: "🌙 Fetch Quran verses with multilingual translations and audio recitation"
        },
        guide: {
            en: "{p}quranverse [random | audio | [surah]:[verse] | lang [code]]"
        },
        countDown: 10,
        dependencies: {
            "axios": "",
            "canvas": "",
            "fs-extra": ""
        }
    },

    // Language labels for headers
    LANGS: {
        en: 'English',
        ur: 'Urdu',
        ar: 'Arabic',
        bn: 'Bengali'
    },

    onLoad: function() {
        // Create temporary directory for images
        const tmpDir = path.join(__dirname, 'tmp');
        if (!fs.existsSync(tmpDir)) {
            try {
                fs.mkdirSync(tmpDir, { recursive: true });
                console.log("✅ Created temporary directory");
            } catch (err) {
                console.error("❌ Failed to create temporary directory:", err);
            }
        }

        // Initialize global language setting
        if (typeof global.quranLanguage === 'undefined') {
            global.quranLanguage = 'en';
        }
        console.log(`🌙 Current default language: ${global.quranLanguage}`);
    },

    // Utility: wrap text for canvas
    wrapText: function(ctx, text, x, y, maxWidth, lineHeight) {
        if (!text) return y;
        const words = String(text).split(' ');
        let line = '';
        let currentY = y;

        ctx.textBaseline = 'top';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, currentY);
        return currentY + lineHeight;
    },

    // Create the verse image
    createVerseImage: async function(verseData, language) {
        try {
            const width = 800;
            const height = 900;
            const padding = 50;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#0c1e25');
            gradient.addColorStop(1, '#1d4a5d');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Decorative elements
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            for (let i = 0; i < 20; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * width,
                    Math.random() * height,
                    Math.random() * 10 + 5,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }

            let currentY = 60;

            // Title
            ctx.font = 'bold 38px Arial, sans-serif';
            ctx.fillStyle = '#f1c40f';
            ctx.textAlign = 'center';
            ctx.fillText('🌙 Quran Verse 🌙', width / 2, currentY);
            currentY += 60;

            // Surah info
            ctx.font = '26px Arial, sans-serif';
            ctx.fillStyle = '#e67e22';
            ctx.fillText(`${verseData.surahName} (${verseData.surahNameTranslation || 'Unknown'})`, width / 2, currentY);
            currentY += 35;

            ctx.font = '20px Arial, sans-serif';
            ctx.fillStyle = '#ecf0f1';
            ctx.fillText(`Surah ${verseData.surahNumber}:${verseData.verseNumber} | ${verseData.revelationPlace || 'Unknown'}`, width / 2, currentY);
            currentY += 60;

            // Arabic text
            ctx.font = 'bold 30px Arial, sans-serif';
            ctx.fillStyle = '#2ecc71';
            ctx.textAlign = 'right';
            const arabicText = verseData.arabic1 || verseData.arabic || verseData.text || '';
            const arabicLines = String(arabicText).split('\n');
            
            for (const line of arabicLines) {
                if (line.trim()) {
                    ctx.fillText(line.trim(), width - padding, currentY);
                    currentY += 40;
                }
            }
            currentY += 30;

            // Translation header
            ctx.font = 'italic 24px Arial, sans-serif';
            ctx.fillStyle = '#3498db';
            ctx.textAlign = 'left';
            ctx.fillText(`${this.LANGS[language] || this.LANGS.en} Translation:`, padding, currentY);
            currentY += 40;

            // Translation text
            const translation = verseData[language] || verseData.english || verseData.translation || 'Translation not available.';
            ctx.font = '22px Arial, sans-serif';
            ctx.fillStyle = '#ecf0f1';
            ctx.textAlign = 'left';
            const finalY = this.wrapText(ctx, translation, padding, currentY, width - 2 * padding, 30);
            currentY = finalY;

            // Footer
            ctx.font = '16px Arial, sans-serif';
            ctx.fillStyle = '#bdc3c7';
            ctx.textAlign = 'center';
            ctx.fillText('Generated by GoatBot • Credits: Asif Mahmud', width / 2, height - 30);

            // Save image
            const imagePath = path.join(__dirname, 'tmp', `quran_verse_${Date.now()}.png`);
            const buffer = canvas.toBuffer('image/png');
            await fs.writeFile(imagePath, buffer);

            return imagePath;
        } catch (error) {
            console.error("❌ Error creating image:", error);
            throw new Error(`Failed to generate verse image: ${error.message}`);
        }
    },

    onStart: async function({ message, event, args }) {
        let imagePath = null;
        
        try {
            // Check dependencies
            if (!axios || !createCanvas || !fs || !global.utils || typeof global.utils.getStreamFromURL !== 'function') {
                return message.reply("❌ Missing dependencies or utilities. Please check bot setup.");
            }

            const actionRaw = args[0] ? String(args[0]).toLowerCase() : '';
            const wantsAudio = actionRaw === 'audio';
            const wantsLanguage = actionRaw === 'lang' && args[1];
            const wantsSpecific = /^\d+:\d+$/.test(actionRaw);
            const wantsRandom = actionRaw === 'random' || (!actionRaw && !wantsAudio && !wantsLanguage && !wantsSpecific);

            // Handle language change
            if (wantsLanguage) {
                const langCode = String(args[1]).toLowerCase();
                if (this.LANGS[langCode]) {
                    global.quranLanguage = langCode;
                    return message.reply(`✅ Translation language set to ${this.LANGS[langCode]}.`);
                }
                return message.reply(`❌ Invalid language code. Available: ${Object.keys(this.LANGS).join(', ')}`);
            }

            const language = global.quranLanguage || 'en';

            await message.react("⏳");

            // Fetch surah list
            let surahs;
            try {
                const surahsResponse = await axios.get('https://quranapi.pages.dev/api/surah.json', {
                    timeout: 15000
                });
                
                if (!surahsResponse.data || surahsResponse.data.length === 0) {
                    throw new Error("Empty surah list response");
                }
                surahs = surahsResponse.data;
            } catch (error) {
                console.error("❌ Error fetching surah list:", error);
                await message.react("❌");
                return message.reply("❌ Failed to fetch Quran surah list. Please try again later.");
            }

            let surahNumber, verseNumber;

            if (wantsSpecific) {
                [surahNumber, verseNumber] = actionRaw.split(':').map(Number);
                
                if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
                    await message.react("❌");
                    return message.reply("❌ Invalid surah number. Please use 1-114.");
                }

                if (isNaN(verseNumber) || verseNumber < 1) {
                    await message.react("❌");
                    return message.reply("❌ Invalid verse number. Please use positive number.");
                }
            } else {
                // Random selection
                const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
                surahNumber = randomSurah.number;
                
                try {
                    const surahDetailResponse = await axios.get(`https://quranapi.pages.dev/api/${surahNumber}.json`, {
                        timeout: 15000
                    });
                    
                    if (!surahDetailResponse.data || !surahDetailResponse.data.verses) {
                        throw new Error("Empty surah details");
                    }
                    
                    const totalVerses = surahDetailResponse.data.verses.length;
                    if (totalVerses === 0) {
                        throw new Error(`No verses in surah ${surahNumber}`);
                    }
                    verseNumber = Math.floor(Math.random() * totalVerses) + 1;
                    
                } catch (error) {
                    console.error(`❌ Error fetching surah ${surahNumber} details:`, error);
                    await message.react("❌");
                    return message.reply("❌ Failed to select random verse. Please try again.");
                }
            }

            // Fetch verse data
            let verseData;
            try {
                const verseResponse = await axios.get(`https://quranapi.pages.dev/api/${surahNumber}/${verseNumber}.json`, {
                    timeout: 15000
                });
                
                if (!verseResponse.data) {
                    throw new Error("Empty verse response");
                }
                
                verseData = verseResponse.data;
                verseData.surahNumber = surahNumber;
                verseData.verseNumber = verseNumber;
                
                // Add surah metadata
                const surahInfo = surahs.find(s => s.number === surahNumber);
                if (surahInfo) {
                    verseData.surahName = verseData.surahName || surahInfo.name;
                    verseData.surahNameTranslation = verseData.surahNameTranslation || surahInfo.englishName;
                    verseData.revelationPlace = verseData.revelationPlace || surahInfo.revelationType;
                } else {
                    verseData.surahName = `Surah ${surahNumber}`;
                    verseData.surahNameTranslation = 'Unknown';
                    verseData.revelationPlace = 'Unknown';
                }
                
                // Validate verse number for specific requests
                if (wantsSpecific) {
                    const surahDetailCheckResponse = await axios.get(`https://quranapi.pages.dev/api/${surahNumber}.json`, { timeout: 15000 });
                    const totalVersesInSurah = surahDetailCheckResponse.data.verses.length;
                    if (verseNumber > totalVersesInSurah) {
                        await message.react("❌");
                        return message.reply(`❌ Surah ${surahNumber} has only ${totalVersesInSurah} verses.`);
                    }
                }

            } catch (error) {
                console.error(`❌ Error fetching verse ${surahNumber}:${verseNumber}:`, error);
                await message.react("❌");
                return message.reply("❌ Failed to fetch verse details. Please check surah:verse combination.");
            }

            // Create image
            try {
                imagePath = await this.createVerseImage(verseData, language);
            } catch (imageError) {
                console.error("❌ Error creating image:", imageError);
                await message.react("❌");
                return message.reply(`❌ Failed to generate image: ${imageError.message}`);
            }

            // Compose message
            let messageBody = `📖 *${verseData.surahName}* (${verseData.surahNameTranslation || 'Unknown'})\n` +
                              `Surah ${surahNumber}:${verseNumber} | ${verseData.revelationPlace || 'Unknown'}\n\n` +
                              `*"${verseData.arabic1 || verseData.arabic || verseData.text || 'Arabic text not available.'}"*\n\n` +
                              `*${this.LANGS[language] || this.LANGS.en} Translation:*\n${verseData[language] || verseData.english || verseData.translation || 'Translation not available.'}`;

            // Handle audio requests
            if (wantsAudio && verseData.audio) {
                const reciters = Object.values(verseData.audio);
                if (reciters.length > 0) {
                    messageBody += `\n\n🎧 Available Reciters:\n`;
                    reciters.forEach((reciter, i) => {
                        messageBody += `${i + 1}. ${reciter.reciter || reciter.name || `Reciter ${i + 1}`}\n`;
                    });
                    messageBody += `\n*Reply with reciter number to hear recitation.*`;

                    // Store options for reply handler
                    global.quranAudioOptions = {
                        reciters: reciters,
                        verseInfo: `${verseData.surahName} ${surahNumber}:${verseNumber}`,
                        eventID: event.messageID
                    };
                } else {
                    messageBody += `\n\n🎧 Audio not available for this verse.`;
                }
            }
            
            await message.react("✅");

            // Send message with image
            await message.reply({
                body: messageBody,
                attachment: fs.createReadStream(imagePath)
            });

        } catch (error) {
            console.error("💥 Main command error:", error);
            await message.react("❌");
            await message.reply("❌ Unexpected error occurred. Please try again later.");
        } finally {
            // Clean up image file
            if (imagePath && fs.existsSync(imagePath)) {
                try {
                    await fs.unlink(imagePath);
                } catch (cleanupError) {
                    console.warn("⚠️ Could not delete temporary image:", cleanupError);
                }
            }
        }
    },

    onReply: async function({ message, event }) {
        try {
            if (!global.quranAudioOptions || global.quranAudioOptions.eventID !== event.messageReply.messageID) {
                return;
            }

            const selectedNumber = parseInt(event.body);
            const { reciters, verseInfo } = global.quranAudioOptions;

            if (isNaN(selectedNumber)) {
                return message.reply("❌ Please reply with a valid number (1, 2, etc.).");
            }
            
            if (selectedNumber < 1 || selectedNumber > reciters.length) {
                return message.reply(`❌ Invalid selection. Use 1-${reciters.length}.`);
            }

            const selectedReciter = reciters[selectedNumber - 1];
            const audioUrl = selectedReciter.url || selectedReciter.link;
            
            if (!audioUrl) {
                return message.reply("❌ Audio URL not available for selected reciter.");
            }

            await message.react("🎧");

            const stream = await global.utils.getStreamFromURL(audioUrl);

            await message.reply({
                body: `🎧 Playing ${verseInfo} by *${selectedReciter.reciter || selectedReciter.name || 'Unknown Reciter'}*`,
                attachment: stream
            });

            await message.react("✅");

            // Clean up
            delete global.quranAudioOptions;

        } catch (error) {
            console.error("❌ Reply handler error:", error);
            await message.react("❌");
            await message.reply("❌ Error playing recitation. Please try again.");
            if (global.quranAudioOptions) {
                delete global.quranAudioOptions;
            }
        }
    }
};
