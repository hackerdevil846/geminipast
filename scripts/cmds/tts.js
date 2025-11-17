const googleTTS = require('google-tts-api');

module.exports = {
    config: {
        name: "tts",
        aliases: [],
        version: "1.0.0",
        author: "𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "🎤 Convert text to speech in different languages"
        },
        longDescription: {
            en: "Converts text to speech audio in various languages using Google TTS"
        },
        guide: {
            en: "{p}tts [lang] [text]\nExamples:\n{p}tts en Hello world\n{p}tts fr Bonjour\n{p}tts ja 今日は"
        },
        dependencies: {
            "google-tts-api": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            if (!args[0]) {
                return message.reply(`🎤 𝗧𝗲𝘅𝘁 𝘁𝗼 𝗦𝗽𝗲𝗲𝗰𝗵 𝗖𝗼𝗺𝗺𝗮𝗻𝗱

𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗹𝗮𝗻𝗴𝘂𝗮𝗴𝗲𝘀:
• en - English
• fr - French  
• ja - Japanese
• es - Spanish
• de - German
• it - Italian
• ar - Arabic
• hi - Hindi
• ru - Russian
• pt - Portuguese
• zh - Chinese

𝗨𝘀𝗮𝗴𝗲:
{p}tts [lang] [text]
𝗘𝘅𝗮𝗺𝗽𝗹𝗲: {p}tts en Hello world`);
            }

            const lang = args[0].toLowerCase();
            const text = args.slice(1).join(" ");

            if (!text) {
                return message.reply("❌ Please provide text to convert to speech.");
            }

            // Validate language
            const supportedLangs = ['en', 'fr', 'ja', 'es', 'de', 'it', 'ar', 'hi', 'ru', 'pt', 'zh'];
            if (!supportedLangs.includes(lang)) {
                return message.reply(`❌ Unsupported language. Available: ${supportedLangs.join(', ')}`);
            }

            // Validate text length
            if (text.length > 200) {
                return message.reply("❌ Text is too long. Maximum 200 characters allowed.");
            }

            const url = googleTTS.getAudioUrl(text, {
                lang: lang,
                slow: false,
                host: 'https://translate.google.com',
            });

            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('TTS generation timeout')), 30000)
            );

            const ttsPromise = global.utils.getStreamFromURL(url);

            const audioStream = await Promise.race([ttsPromise, timeoutPromise]);

            await message.reply({
                body: `🎤 𝗧𝗲𝘅𝘁 𝘁𝗼 𝗦𝗽𝗲𝗲𝗰𝗵\n🌐 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲: ${lang}\n📝 𝗧𝗲𝘅𝘁: ${text}`,
                attachment: audioStream
            });

        } catch (error) {
            console.error("TTS Error:", error);
            
            if (error.message.includes('timeout')) {
                message.reply("❌ TTS generation timed out. Please try again with shorter text.");
            } else if (error.message.includes('getAudioUrl')) {
                message.reply("❌ Failed to generate TTS URL. Please check your text and try again.");
            } else {
                message.reply("❌ Failed to convert text to speech. Please try again.");
            }
        }
    }
};
