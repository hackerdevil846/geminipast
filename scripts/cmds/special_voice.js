const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const voiceDB = {
    "call": {
        url: "https://files.catbox.moe/1vmih4.mp3",
        triggers: ["bby call dai", "call kori", "call me", "call dai", "কল দাও", "কল কর", "বেবি কল দেই", "জান কল করি"]
    },
    "pot": {
        url: "https://files.catbox.moe/u1ykfq.mp3", 
        triggers: ["pot kori", "nasa kori", "nasa korbi", "pott kori", "পট করি", "নেশা করব", "নেশা করবি", "পট্ট করব"]
    }
};

module.exports = {
    config: {
        name: "special_voice",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 3,
        role: 0,
        category: "entertainment",
        shortDescription: {
            en: "🎵 Voice responses for specific phrases"
        },
        longDescription: {
            en: "Plays voice messages based on specific Bengali/Banglish/English phrases"
        },
        guide: {
            en: "Send: 'bby call dai', 'xan call kori', 'pot kori', 'nasa kori' etc."
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

            const cacheDir = path.join(__dirname, 'cache', 'special_voice');
            try {
                await fs.ensureDir(cacheDir);
            } catch (dirError) {
                console.error("❌ Failed to create cache directory:", dirError);
                return;
            }
            
            console.log("🔄 Pre-caching special voice files...");
            
            // Download files sequentially
            for (const [key, data] of Object.entries(voiceDB)) {
                const filePath = path.join(cacheDir, `${key}.mp3`);
                if (!await fs.pathExists(filePath)) {
                    try {
                        console.log(`📥 Downloading: ${key}`);
                        const response = await axios({
                            method: 'GET',
                            url: data.url,
                            responseType: 'arraybuffer',
                            timeout: 60000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });
                        
                        // Verify file has content
                        if (response.data && response.data.length > 1000) {
                            await fs.writeFile(filePath, response.data);
                            console.log(`✅ Successfully cached: ${key} (${(response.data.length / 1024 / 1024).toFixed(2)}MB)`);
                        } else {
                            throw new Error("Invalid file size");
                        }
                    } catch (error) {
                        console.error(`❌ Failed to cache ${key}:`, error.message);
                    }
                    
                    // Add delay between downloads
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    console.log(`✅ Already cached: ${key}`);
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

            const triggerList = Object.values(voiceDB).map(data => 
                `• ${data.triggers.slice(0, 3).join(', ')}...`
            ).join('\n');

            await message.reply(
                `🎵 Voice Commands Available:\n\n${triggerList}\n\n📝 Supported languages: Bengali, Banglish, English`
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
            
            if (!body || typeof body !== 'string') return;
            
            const userMessage = body.toLowerCase().trim();
            
            // Check for matching triggers
            let matchedCommand = null;
            let matchedKey = null;

            for (const [key, data] of Object.entries(voiceDB)) {
                for (const trigger of data.triggers) {
                    if (userMessage.includes(trigger.toLowerCase())) {
                        matchedCommand = data;
                        matchedKey = key;
                        break;
                    }
                }
                if (matchedCommand) break;
            }

            if (!matchedCommand) return;
            
            console.log(`🎵 Processing voice command: ${matchedKey}`);

            const cacheDir = path.join(__dirname, 'cache', 'special_voice');
            const filePath = path.join(cacheDir, `${matchedKey}.mp3`);
            
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
                    console.log(`📥 Downloading voice file for: ${matchedKey}`);
                    const response = await axios({
                        method: 'GET',
                        url: matchedCommand.url,
                        responseType: 'arraybuffer',
                        timeout: 45000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    // Verify file has content
                    if (response.data && response.data.length > 1000) {
                        await fs.writeFile(filePath, response.data);
                        console.log(`✅ Successfully downloaded: ${matchedKey}`);
                    } else {
                        throw new Error("Invalid file size");
                    }
                } catch (downloadError) {
                    console.error(`❌ Failed to download ${matchedKey}:`, downloadError.message);
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
                    body: `✅ ${matchedKey.toUpperCase()} voice activated!`,
                    attachment: fs.createReadStream(filePath)
                });
                
                console.log(`✅ Successfully sent voice for: ${matchedKey}`);
                
            } catch (fileError) {
                console.error(`❌ Error reading file ${matchedKey}:`, fileError.message);
                
                // Try to re-download the file
                try {
                    await fs.unlink(filePath);
                    console.log(`🔄 Attempting re-download for: ${matchedKey}`);
                    const response = await axios({
                        method: 'GET',
                        url: matchedCommand.url,
                        responseType: 'arraybuffer',
                        timeout: 45000
                    });
                    
                    await fs.writeFile(filePath, response.data);
                    await message.reply({
                        body: `✅ ${matchedKey.toUpperCase()} voice activated!`,
                        attachment: fs.createReadStream(filePath)
                    });
                } catch (retryError) {
                    console.error(`❌ Failed re-download for ${matchedKey}:`, retryError.message);
                }
            }
            
        } catch (error) {
            console.error('💥 Special Voice Error:', error);
        }
    }
};
