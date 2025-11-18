const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const emojiVoiceDB = {
    "🐸": {
        url: "https://files.catbox.moe/utl83s.mp3",
        caption: ""
    },
    "🫣": {
        url: "https://files.catbox.moe/ttb6hi.mp3", 
        caption: ""
    },
    "🤬": {
        url: "https://files.catbox.moe/b4m5aj.mp3",
        caption: ""
    },
    "😩": {
        url: "https://files.catbox.moe/jf85xe.mp3",
        caption: ""
    },
    "😂": {
        url: "https://files.catbox.moe/2sweut.mp3",
        caption: ""
    },
    "😓": {
        url: "https://files.catbox.moe/6yanv3.mp3",
        caption: ""
    },
    "👺": {
        url: "https://files.catbox.moe/tqxemm.mp3",
        caption: ""
    },
    "😿": {
        url: "https://files.catbox.moe/y8ul2j.mp3",
        caption: ""
    },
    "😉": {
        url: "https://files.catbox.moe/mu0kka.mp3",
        caption: ""
    },
    "🥲": {
        url: "https://files.catbox.moe/itm4g0.mp3",
        caption: ""
    },
    "😻": {
        url: "https://files.catbox.moe/qjfk1b.mp3",
        caption: ""
    },
    "🙈": {
        url: "https://files.catbox.moe/3qc90y.mp3",
        caption: ""
    },
    "🥵": {
        url: "https://files.catbox.moe/4aci0r.mp3",
        caption: ""
    },
    "😢": {
        url: "https://files.catbox.moe/shxwj1.mp3",
        caption: ""
    },
    "🤗": {
        url: "https://files.catbox.moe/p78xfw.mp3",
        caption: ""
    },
    "💋": {
        url: "https://files.catbox.moe/sbws0w.mp3",
        caption: ""
    },
    "🤦": {
        url: "https://files.catbox.moe/ivlvoq.mp3",
        caption: ""
    },
    "🥰": {
        url: "https://files.catbox.moe/dv9why.mp3",
        caption: ""
    },
    "🤔": {
        url: "https://files.catbox.moe/hy6m6w.mp3",
        caption: ""
    },
    "🍼": {
        url: "https://files.catbox.moe/p6ht91.mp3",
        caption: ""
    },
    "🤫": {
        url: "https://files.catbox.moe/0uii99.mp3",
        caption: ""
    },
    "😞": {
        url: "https://files.catbox.moe/tdimtx.mp3",
        caption: ""
    },
    "😏": {
        url: "https://files.catbox.moe/z9e52r.mp3",
        caption: ""
    },
    "😅": {
        url: "https://files.catbox.moe/jl3pzb.mp3",
        caption: ""
    },
    "🤭": {
        url: "https://files.catbox.moe/cu0mpy.mp3",
        caption: ""
    },
    "😖": {
        url: "https://files.catbox.moe/wc17iq.mp3",
        caption: ""
    },
    "😌": {
        url: "https://files.catbox.moe/epqwbx.mp3",
        caption: ""
    },
    "😁": {
        url: "https://files.catbox.moe/60cwcg.mp3",
        caption: ""
    },
    "🥱": {
        url: "https://files.catbox.moe/9pou40.mp3",
        caption: ""
    }
};

module.exports = {
    config: {
        name: "emoji_voice2",
        aliases: ["ev2", "evoice2"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 3,
        role: 0,
        category: "entertainment",
        shortDescription: {
            en: "🎵 Emoji-based voice responses"
        },
        longDescription: {
            en: "Plays voice messages based on emojis"
        },
        guide: {
            en: "Send any supported emoji"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: async function() {
        try {
            console.log("🔄 Pre-caching emoji voice files...");
            
            const cacheDir = path.join(__dirname, 'cache', 'emoji_voice2');
            await fs.ensureDir(cacheDir);
            
            // Download files sequentially with better error handling
            for (const emoji of Object.keys(emojiVoiceDB)) {
                const filePath = path.join(cacheDir, `${emoji}.mp3`);
                
                // Skip if file already exists and has content
                try {
                    if (await fs.pathExists(filePath)) {
                        const stats = await fs.stat(filePath);
                        if (stats.size > 1000) {
                            console.log(`✅ Already cached: ${emoji}`);
                            continue;
                        }
                    }
                } catch (e) {
                    // File doesn't exist or is corrupted, continue to download
                }

                try {
                    console.log(`📥 Downloading: ${emoji}`);
                    const response = await axios({
                        method: 'GET',
                        url: emojiVoiceDB[emoji].url,
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    if (response.data && response.data.length > 1000) {
                        await fs.writeFile(filePath, response.data);
                        console.log(`✅ Successfully cached: ${emoji} (${(response.data.length / 1024 / 1024).toFixed(2)}MB)`);
                    } else {
                        console.log(`❌ Small file size for ${emoji}: ${response.data.length} bytes`);
                        continue;
                    }
                } catch (error) {
                    console.log(`❌ Failed to cache ${emoji}: ${error.message}`);
                    // Continue with next emoji instead of stopping
                }
                
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            console.log("✅ Pre-caching completed");
        } catch (error) {
            console.log("💥 OnLoad Error:", error.message);
        }
    },

    onStart: async function({ message, event }) {
        try {
            const emojiList = Object.keys(emojiVoiceDB).join(' ');
            await message.reply(
                `🎵 Send one of these emojis to get voice response:\n\n${emojiList}\n\n` +
                `Example: send "🐸" or "😂" to hear voice messages`
            );
        } catch (error) {
            console.log("💥 OnStart Error:", error.message);
        }
    },

    onChat: async function({ event, message }) {
        try {
            const { body } = event;
            
            if (!body || typeof body !== 'string') return;
            
            const emoji = body.trim();
            
            // Check if it's a single emoji and supported
            if (emoji.length > 2 || !emojiVoiceDB[emoji]) {
                return;
            }

            console.log(`🎵 Processing emoji: ${emoji}`);

            const cacheDir = path.join(__dirname, 'cache', 'emoji_voice2');
            const filePath = path.join(cacheDir, `${emoji}.mp3`);
            
            await fs.ensureDir(cacheDir);

            let shouldDownload = false;
            
            try {
                if (!(await fs.pathExists(filePath))) {
                    shouldDownload = true;
                } else {
                    const stats = await fs.stat(filePath);
                    if (stats.size === 0) {
                        shouldDownload = true;
                    }
                }
            } catch (e) {
                shouldDownload = true;
            }

            if (shouldDownload) {
                try {
                    console.log(`📥 Downloading voice file for: ${emoji}`);
                    const response = await axios({
                        method: 'GET',
                        url: emojiVoiceDB[emoji].url,
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    if (response.data && response.data.length > 1000) {
                        await fs.writeFile(filePath, response.data);
                        console.log(`✅ Successfully downloaded: ${emoji}`);
                    } else {
                        console.log(`❌ Small file for ${emoji}, skipping`);
                        return;
                    }
                } catch (downloadError) {
                    console.log(`❌ Failed to download ${emoji}: ${downloadError.message}`);
                    return;
                }
            }

            // Send the voice file
            try {
                await message.reply({
                    body: emojiVoiceDB[emoji].caption || emoji,
                    attachment: fs.createReadStream(filePath)
                });
                
                console.log(`✅ Successfully sent voice for: ${emoji}`);
                
            } catch (sendError) {
                console.log(`❌ Error sending ${emoji}: ${sendError.message}`);
                
                // Try to delete corrupted file and re-download
                try {
                    if (await fs.pathExists(filePath)) {
                        await fs.unlink(filePath);
                    }
                } catch (deleteError) {
                    console.log(`❌ Failed to delete corrupted file: ${deleteError.message}`);
                }
            }
            
        } catch (error) {
            console.log('💥 Emoji Voice Error:', error.message);
        }
    }
};
