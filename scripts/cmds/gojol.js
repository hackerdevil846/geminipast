const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
    config: {
        name: "gojol",
        aliases: ["gazal", "islamicsong"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "islamic",
        shortDescription: {
            en: "Play beautiful Islamic gazals"
        },
        longDescription: {
            en: "Play beautiful Islamic gazals and naats"
        },
        guide: {
            en: "{p}gojol"
        }
    },

    onStart: async function({ message }) {
        try {
            // Ensure cache directory exists
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // Islamic gazal messages
            const messages = [
                "🎵 Islamic Gazal 🎵\n🎧 Use headphones for better experience",
                "🕌 Naat Sharif 🕌\n🎧 Use headphones for best sound quality",
                "📿 Divine Melodies 📿\n🎧 Headphones recommended for immersive experience",
                "🕋 Spiritual Gazals 🕋\n🎧 Use headphones for clear audio",
                "🌟 Islamic Songs 🌟\n🎧 Enjoy with headphones",
                "📖 Quranic Melodies 📖\n🎧 Best experienced with headphones"
            ];

            // Audio file URLs (Islamic gazals - direct MP3 links)
            const audioUrls = [
            "https://drive.google.com/uc?id=1xjyq3BrlW3bGrp8y7eedQSuddCbdvLMN",
            "https://drive.google.com/uc?id=1ySwrEG6xVqPdY5BcBP8I3YFCUOX4jV9e",
            "https://drive.google.com/uc?id=1xnht0PdBt9DnLGzW7GmJUTsTIJnxxByo",
            "https://drive.google.com/uc?id=1yHB48N_wPJnU5uV18KMZOLNqo5NE7L4W",
            "https://drive.google.com/uc?id=1xpwuubDL_ebjKJhujb-Ee-FikUF92oF6",
            "https://drive.google.com/uc?id=1yK0A3lyIJoPRp6g3UjNrC31n0yLfc1Ht",
            "https://drive.google.com/uc?id=1xrwhHLhsdKVAn_9umLfUysCt0S2v5QWe",
            "https://drive.google.com/uc?id=1yKwewV-oYbn57lGnlACykSD-yt8fOsfT",
            "https://drive.google.com/uc?id=1xulSi_qyJA47sF9rC9BUIPyBqh47t9Ls",
            "https://drive.google.com/uc?id=1y-PIYYziv-m8QRwmMBWCTl2wzuH8NpYJ",
            "https://drive.google.com/uc?id=1y0wV96m-notKVHnuNdF8xVCWiockSiME",
            "https://drive.google.com/uc?id=1xxMQnp-9-4BoLrGpReps93JQv4k8WUOP"
        ];

            // Pick random message & audio
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];

            // Unique filename with timestamp
            const timestamp = Date.now();
            const audioPath = path.join(cacheDir, `gazal_${timestamp}.mp3`);

            // Notify user
            await message.reply("📥 Downloading Islamic gazal, please wait...");

            // Download audio with better error handling
            const response = await axios({
                method: 'GET',
                url: randomAudioUrl,
                responseType: 'stream',
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            // Check if response is valid
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: Failed to download audio`);
            }

            // Save file with proper error handling
            const writer = fs.createWriteStream(audioPath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', (error) => {
                    reject(new Error(`File write error: ${error.message}`));
                });
            });

            // Check if file was created and has content
            if (!fs.existsSync(audioPath)) {
                throw new Error('Downloaded file not found');
            }

            const stats = fs.statSync(audioPath);
            if (stats.size === 0) {
                throw new Error('Downloaded file is empty');
            }

            // Send gazal with message
            await message.reply({
                body: randomMessage,
                attachment: fs.createReadStream(audioPath)
            });

            // Clean up with error handling
            try {
                if (fs.existsSync(audioPath)) {
                    fs.unlinkSync(audioPath);
                }
            } catch (cleanupErr) {
                console.error('File cleanup error:', cleanupErr);
            }

        } catch (error) {
            console.error('Gazal command error:', error);
            
            // Clean up on error
            try {
                const audioPath = path.join(__dirname, 'cache', `gazal_*.mp3`);
                // Remove any leftover files
                const files = fs.readdirSync(path.join(__dirname, 'cache')).filter(file => file.startsWith('gazal_'));
                for (const file of files) {
                    fs.unlinkSync(path.join(__dirname, 'cache', file));
                }
            } catch (cleanupErr) {
                console.error('Error cleanup failed:', cleanupErr);
            }

            let errorMessage = "❌ Failed to download Islamic gazal. Please try again later.";
            
            if (error.message.includes('timeout')) {
                errorMessage = "⏰ Download timeout. Please try again.";
            } else if (error.message.includes('ENOTFOUND')) {
                errorMessage = "🌐 Network error. Please check your connection.";
            } else if (error.message.includes('404')) {
                errorMessage = "🔍 Audio file not found. Please try another gazal.";
            }

            await message.reply(errorMessage);
        }
    }
};
