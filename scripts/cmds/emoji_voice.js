const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const emojiVoiceDB = {
    "🥺": {
        url: "https://files.catbox.moe/pdmh1n.mp3",
        caption: "✨ 𝖬𝗂𝗌 𝖸𝗈𝗎 𝖡𝖾𝗉𝗂... 🥺"
    },
    "😍": {
        url: "https://files.catbox.moe/l8ui0e.mp3",
        caption: "💖 𝖳𝗈𝗆𝖺𝗋 𝗉𝗋𝗈𝗍𝗂 𝖻𝗁𝖺𝗅𝗈𝖻𝖺𝗌𝖺 𝖽𝗂𝗇𝗄𝖾 𝖽𝗂𝗇 𝖻𝖺𝗋𝖼𝗁𝖾... 😍"
    },
    "😡": {
        url: "https://files.catbox.moe/tqjas3.mp3",
        caption: "⚡ 𝖱𝖺𝗀 𝗄𝗈𝗆𝖺𝗈, 𝗆𝖺𝖿 𝗄𝗈𝗋𝖺𝗂 𝖻𝗈𝗋𝗈𝗍to... 😡"
    },
    "🙄": {
        url: "https://files.catbox.moe/lus763.mp3",
        caption: "🎭 𝖤𝖻𝗁𝖺𝖻𝖾 𝗍𝖺𝗄𝗂𝗈 𝗇𝖺 𝗍𝗎𝗆𝗂 𝖻𝗁𝖾𝖻𝖾 𝗅𝗈𝗃𝗃𝖺 𝗅𝖺𝗀𝖾 ... 🙄"
    },
    "😑": {
        url: "https://files.catbox.moe/5rdtc6.mp3",
        caption: "🍋 𝖫𝖾𝖻𝗎 𝗄𝗁𝖺𝗈 𝗃𝖺𝗇 𝗌𝗈𝖻 𝗍𝗁𝗂𝗄 𝗁𝗈𝗒𝖾 𝗃𝖺𝖻𝖾 😑"
    },
    "😒": {
        url: "https://files.catbox.moe/6l2e1p.mp3",
        caption: "❌ 𝖡𝗂𝗋𝗈𝗄𝗍 𝗄𝗈𝗋𝗈 𝗇𝖺 𝗃𝖺𝗇... ❤"
    },
    "🤣": {
        url: "https://files.catbox.moe/4kbbqj.mp3",
        caption: "😂 𝖧𝖺𝗌𝗅𝖾 𝗍𝗈𝗆𝖺𝗄𝖾 𝗉𝖺𝗀𝗈𝗅 𝖤𝗋 𝗆𝗈𝗍𝗈 𝗅𝖺𝗀𝖾... 🤣"
    },
    "💔": {
        url: "https://files.catbox.moe/lgkxn5.mp3",
        caption: "🎵 𝖿𝖾𝖾𝗅 𝗍𝗁𝗂𝗌 𝗌𝗈𝗇𝗀... 💔"
    },
    "🙂": {
        url: "https://files.catbox.moe/i6xvbh.mp3",
        caption: "💫 𝖳𝗎𝗆𝗂 𝗄𝗂 𝖺𝖽𝗁𝗈 𝖺𝗆𝖺𝗄𝖾 𝖻𝗁𝖺𝗅𝗈𝖻𝖺𝗌𝗈 ... 🙂"
    }
};

module.exports = {
    config: {
        name: "emoji_voice",
        aliases: [],
        version: "1.3.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 0,
        category: "entertainment",
        shortDescription: {
            en: "🎵 𝖤𝗆𝗈𝗃𝗂-𝖻𝖺𝗌𝖾𝖽 𝗏𝗈𝗂𝖼𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾𝗌 𝗐𝗂𝗍𝗁 𝖡𝖾𝗇𝗀𝖺𝗅𝗂 𝖼𝖺𝗉𝗍𝗂𝗈𝗇𝗌"
        },
        longDescription: {
            en: "𝖯𝗅𝖺𝗒𝗌 𝗏𝗈𝗂𝖼𝖾 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌 𝖻𝖺𝗌𝖾𝖽 𝗈𝗇 𝖾𝗆𝗈𝗃𝗂𝗌 𝗐𝗂𝗍𝗁 𝖡𝖾𝗇𝗀𝖺𝗅𝗂 𝖼𝖺𝗉𝗍𝗂𝗈𝗇𝗌"
        },
        guide: {
            en: "𝖲𝖾𝗇𝖽 𝖺𝗇𝗒 𝗌𝗎𝗉𝗉𝗈𝗋𝗍𝖾𝖽 𝖾𝗆𝗈𝗃𝗂: 🥺 😍 😭 😡 🙄 😑 😒 🤣 💔 🙂"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: async function() {
        try {
            console.log("🔄 𝖯𝗋𝖾-𝖼𝖺𝖼𝗁𝗂𝗇𝗀 𝖾𝗆𝗈𝗃𝗂 𝗏𝗈𝗂𝖼𝖾 𝖿𝗂𝗅𝖾𝗌...");
            
            const cacheDir = path.join(__dirname, 'cache', 'emoji_voice');
            await fs.ensureDir(cacheDir);
            
            // Download files with better error handling
            for (const emoji of Object.keys(emojiVoiceDB)) {
                const filePath = path.join(cacheDir, `${emoji}.mp3`);
                
                // Skip if file already exists and is valid
                try {
                    if (await fs.pathExists(filePath)) {
                        const stats = await fs.stat(filePath);
                        if (stats.size > 1000) {
                            console.log(`✅ 𝖠𝗅𝗋𝖾𝖺𝖽𝗒 𝖼𝖺𝖼𝗁𝖾𝖽: ${emoji}`);
                            continue;
                        }
                    }
                } catch (e) {
                    // File doesn't exist or is corrupted, continue to download
                }

                try {
                    console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀: ${emoji}`);
                    const response = await axios({
                        method: 'GET',
                        url: emojiVoiceDB[emoji].url,
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': '*/*'
                        }
                    });
                    
                    if (response.data && response.data.length > 1000) {
                        await fs.writeFile(filePath, response.data);
                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖼𝖺𝖼𝗁𝖾𝖽: ${emoji} (${(response.data.length / 1024 / 1024).toFixed(2)}𝖬𝖡)`);
                    } else {
                        console.log(`❌ 𝖲𝗆𝖺𝗅𝗅 𝖿𝗂𝗅𝖾 𝗌𝗂𝗓𝖾 𝖿𝗈𝗋 ${emoji}: ${response.data ? response.data.length : 0} 𝖻𝗒𝗍𝖾𝗌`);
                        continue;
                    }
                } catch (error) {
                    console.log(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝖺𝖼𝗁𝖾 ${emoji}: ${error.message}`);
                    // Continue with next emoji instead of stopping
                }
                
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            
            console.log("✅ 𝖯𝗋𝖾-𝖼𝖺𝖼𝗁𝗂𝗇𝗀 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝖾𝖽");
        } catch (error) {
            console.log("💥 𝖮𝗇𝖫𝗈𝖺𝖽 𝖤𝗋𝗋𝗈𝗋:", error.message);
        }
    },

    onStart: async function({ message, event }) {
        try {
            const emojiList = Object.keys(emojiVoiceDB).join(' ');
            await message.reply(
                `🎵 𝖲𝖾𝗇𝖽 𝗈𝗇𝖾 𝗈𝖿 𝗍𝗁𝖾𝗌𝖾 𝖾𝗆𝗈𝗃𝗂𝗌 𝗍𝗈 𝗀𝖾𝗍 𝗏𝗈𝗂𝖼𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾:\n\n${emojiList}\n\n` +
                `𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝗌𝖾𝗇𝖽 "🥺" 𝗈𝗋 "😍" 𝗍𝗈 𝗁𝖾𝖺𝗋 𝗏𝗈𝗂𝖼𝖾 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌`
            );
        } catch (error) {
            console.log("💥 𝖮𝗇𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error.message);
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

            console.log(`🎵 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗆𝗈𝗃𝗂: ${emoji}`);

            const cacheDir = path.join(__dirname, 'cache', 'emoji_voice');
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
                    console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗏𝗈𝗂𝖼𝖾 𝖿𝗂𝗅𝖾 𝖿𝗈𝗋: ${emoji}`);
                    const response = await axios({
                        method: 'GET',
                        url: emojiVoiceDB[emoji].url,
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': '*/*'
                        }
                    });
                    
                    if (response.data && response.data.length > 1000) {
                        await fs.writeFile(filePath, response.data);
                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽: ${emoji}`);
                    } else {
                        console.log(`❌ 𝖲𝗆𝖺𝗅𝗅 𝖿𝗂𝗅𝖾 𝖿𝗈𝗋 ${emoji}, 𝗌𝗄𝗂𝗉𝗉𝗂𝗇𝗀`);
                        return;
                    }
                } catch (downloadError) {
                    console.log(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 ${emoji}: ${downloadError.message}`);
                    return;
                }
            }

            // Send the voice file
            try {
                await message.reply({
                    body: emojiVoiceDB[emoji].caption || emoji,
                    attachment: fs.createReadStream(filePath)
                });
                
                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝗏𝗈𝗂𝖼𝖾 𝖿𝗈𝗋: ${emoji}`);
                
            } catch (sendError) {
                console.log(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 ${emoji}: ${sendError.message}`);
                
                // Try to delete corrupted file
                try {
                    if (await fs.pathExists(filePath)) {
                        await fs.unlink(filePath);
                        console.log(`🗑️ 𝖣𝖾𝗅𝖾𝗍𝖾𝖽 𝖼𝗈𝗋𝗋𝗎𝗉𝗍𝖾𝖽 𝖿𝗂𝗅𝖾: ${emoji}`);
                    }
                } catch (deleteError) {
                    console.log(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 𝖼𝗈𝗋𝗋𝗎𝗉𝗍𝖾𝖽 𝖿𝗂𝗅𝖾: ${deleteError.message}`);
                }
            }
            
        } catch (error) {
            console.log('💥 𝖤𝗆𝗈𝗃𝗂 𝖵𝗈𝗂𝖼𝖾 𝖤𝗋𝗋𝗈𝗋:', error.message);
        }
    }
};
