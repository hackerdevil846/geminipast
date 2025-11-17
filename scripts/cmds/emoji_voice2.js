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
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ Missing dependencies");
                return;
            }

            const cacheDir = path.join(__dirname, 'cache', 'emoji_voice2');
            try {
                await fs.ensureDir(cacheDir);
            } catch (dirError) {
                console.error("❌ Failed to create cache directory:", dirError);
                return;
            }
            
            console.log("🔄 Pre-caching emoji voice files...");
            
            // Download files sequentially to avoid overwhelming the network
            for (const emoji of Object.keys(emojiVoiceDB)) {
                const filePath = path.join(cacheDir, `${emoji}.mp3`);
                if (!await fs.pathExists(filePath)) {
                    try {
                        console.log(`📥 Downloading: ${emoji}`);
                        const response = await axios({
                            method: 'GET',
                            url: emojiVoiceDB[emoji].url,
                            responseType: 'arraybuffer',
                            timeout: 60000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });
                        
                        // Verify file has content
                        if (response.data && response.data.length > 1000) {
                            await fs.writeFile(filePath, response.data);
                            console.log(`✅ Successfully cached: ${emoji} (${(response.data.length / 1024 / 1024).toFixed(2)}MB)`);
                        } else {
                            throw new Error("Invalid file size");
                        }
                    } catch (error) {
                        console.error(`❌ Failed to cache ${emoji}:`, error.message);
                    }
                    
                    // Add delay between downloads to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    console.log(`✅ Already cached: ${emoji}`);
                }
            }
            
            console.log("✅ Pre-caching completed");
        } catch (error) {
            console.error("💥 OnLoad Error:", error);
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ Missing dependencies. Please install axios, fs-extra, and path.");
            }

            await message.reply(
                `🎵 Send one of these emojis to get voice response:\n${Object.keys(emojiVoiceDB).join(' ')}`
            );
        } catch (error) {
            console.error("💥 OnStart Error:", error);
        }
    },

    onChat: async function({ event, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            const { body } = event;
            
            if (!body || body.length > 2) return;
            
            const emoji = body.trim();
            if (!emojiVoiceDB[emoji]) return;
            
            console.log(`🎵 Processing emoji: ${emoji}`);

            const cacheDir = path.join(__dirname, 'cache', 'emoji_voice2');
            const filePath = path.join(cacheDir, `${emoji}.mp3`);
            
            try {
                await fs.ensureDir(cacheDir);
            } catch (dirError) {
                console.error("❌ Failed to create cache directory:", dirError);
                return;
            }

            let fileExists = false;
            try {
                fileExists = await fs.pathExists(filePath);
            } catch (pathError) {
                console.error("❌ Error checking file path:", pathError);
            }

            if (!fileExists) {
                try {
                    console.log(`📥 Downloading voice file for: ${emoji}`);
                    const response = await axios({
                        method: 'GET',
                        url: emojiVoiceDB[emoji].url,
                        responseType: 'arraybuffer',
                        timeout: 45000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    // Verify file has content
                    if (response.data && response.data.length > 1000) {
                        await fs.writeFile(filePath, response.data);
                        console.log(`✅ Successfully downloaded: ${emoji}`);
                    } else {
                        throw new Error("Invalid file size");
                    }
                } catch (downloadError) {
                    console.error(`❌ Failed to download ${emoji}:`, downloadError.message);
                    return;
                }
            }

            // Verify file is readable before sending
            try {
                await fs.access(filePath, fs.constants.R_OK);
                const stats = await fs.stat(filePath);
                if (stats.size === 0) {
                    throw new Error("File is empty");
                }
                
                await message.reply({
                    body: emojiVoiceDB[emoji].caption,
                    attachment: fs.createReadStream(filePath)
                });
                
                console.log(`✅ Successfully sent voice for: ${emoji}`);
                
            } catch (fileError) {
                console.error(`❌ Error reading file ${emoji}:`, fileError.message);
                
                // Try to re-download the file
                try {
                    await fs.unlink(filePath);
                    console.log(`🔄 Attempting re-download for: ${emoji}`);
                    const response = await axios({
                        method: 'GET',
                        url: emojiVoiceDB[emoji].url,
                        responseType: 'arraybuffer',
                        timeout: 45000
                    });
                    
                    await fs.writeFile(filePath, response.data);
                    await message.reply({
                        body: emojiVoiceDB[emoji].caption,
                        attachment: fs.createReadStream(filePath)
                    });
                } catch (retryError) {
                    console.error(`❌ Failed re-download for ${emoji}:`, retryError.message);
                }
            }
            
        } catch (error) {
            console.error('💥 Emoji Voice Error:', error);
        }
    }
};
