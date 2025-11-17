const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "emoji_voice0000",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 0,
        role: 0,
        category: "noprefix",
        shortDescription: {
            en: "🎵 Emoji triggered voice messages"
        },
        longDescription: {
            en: "Plays voice messages when specific emojis are sent"
        },
        guide: {
            en: "Send 💦 or 🖕 to trigger voice messages"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message }) {
        try {
            await message.reply(
                `🎵 Send one of these emojis to get voice response:\n` +
                `💦 - Plays "ara" voice\n` +
                `🖕 - Plays "yamate" voice`
            );
        } catch (error) {
            console.error("Start Error:", error);
        }
    },

    onChat: async function({ event, message }) {
        try {
            const { body } = event;
            
            if (!body) return;
            
            const emoji = body.trim();
            
            // Check for supported emojis
            if (emoji === "💦") {
                await this.playVoice(message, "💦", "scripts/cmds/noprefix/ara.mp3", "Ara~ 💦");
            } 
            else if (emoji === "🖕") {
                await this.playVoice(message, "🖕", "scripts/cmds/noprefix/yamate.mp3", "Yamete kudasai! 🥵");
            }
            else {
                return; // Ignore other messages
            }
            
        } catch (error) {
            console.error('Emoji Voice Error:', error);
        }
    },

    playVoice: async function(message, emoji, filePath, caption) {
        try {
            // Resolve the absolute path
            const absolutePath = path.resolve(process.cwd(), filePath);
            
            console.log(`🎵 Processing emoji: ${emoji}`);
            console.log(`📁 Looking for file: ${absolutePath}`);

            // Check if file exists
            if (!fs.existsSync(absolutePath)) {
                console.error(`❌ File not found: ${absolutePath}`);
                await message.reply(`❌ Voice file for ${emoji} not found. Please check the file path.`);
                return;
            }

            // Verify file is readable and has content
            const stats = fs.statSync(absolutePath);
            if (stats.size === 0) {
                console.error(`❌ File is empty: ${absolutePath}`);
                await message.reply(`❌ Voice file for ${emoji} is empty.`);
                return;
            }

            // Check if it's an audio file
            if (!absolutePath.toLowerCase().endsWith('.mp3')) {
                console.error(`❌ Not an MP3 file: ${absolutePath}`);
                await message.reply(`❌ File for ${emoji} is not an MP3 audio file.`);
                return;
            }

            console.log(`✅ File found: ${absolutePath} (${(stats.size / 1024).toFixed(2)} KB)`);

            // Send the voice message
            await message.reply({
                body: caption,
                attachment: fs.createReadStream(absolutePath)
            });

            console.log(`✅ Successfully sent voice for: ${emoji}`);

        } catch (error) {
            console.error(`💥 Error playing voice for ${emoji}:`, error);
            
            let errorMessage = `❌ Failed to play voice for ${emoji}.`;
            
            if (error.code === 'ENOENT') {
                errorMessage = `❌ Voice file for ${emoji} not found at: ${filePath}`;
            } else if (error.code === 'EACCES') {
                errorMessage = `❌ No permission to read voice file for ${emoji}.`;
            } else if (error.message.includes('stream')) {
                errorMessage = `❌ Error reading voice file for ${emoji}.`;
            }
            
            try {
                await message.reply(errorMessage);
            } catch (replyError) {
                console.error("Failed to send error message:", replyError);
            }
        }
    }
};
