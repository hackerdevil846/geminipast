const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "emoji_voice00",
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
            en: "Plays voice messages when specific emojis or text are sent"
        },
        guide: {
            en: "Send 🫶, 🫰 or type 'I love you' to trigger voice messages"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message }) {
        try {
            await message.reply(
                `🎵 Send one of these to get voice response:\n` +
                `🫶 - Plays "I love you" voice\n` +
                `🫰 - Plays "I love you" voice\n` +
                `I love you - Plays "I love you" voice`
            );
        } catch (error) {
            console.error("Start Error:", error);
        }
    },

    onChat: async function({ event, message }) {
        try {
            const { body } = event;
            
            if (!body) return;
            
            const text = body.trim().toLowerCase();
            
            // Check for supported emojis and text
            if (body === "🫶" || body === "🫰" || text === "i love you") {
                await this.playVoice(message, body, "scripts/cmds/noprefix/i love you.mp3", "I love you! 💕");
            }
            else {
                return; // Ignore other messages
            }
            
        } catch (error) {
            console.error('Emoji Voice Error:', error);
        }
    },

    playVoice: async function(message, trigger, filePath, caption) {
        try {
            // Resolve the absolute path
            const absolutePath = path.resolve(process.cwd(), filePath);
            
            console.log(`🎵 Processing trigger: ${trigger}`);
            console.log(`📁 Looking for file: ${absolutePath}`);

            // Check if file exists
            if (!fs.existsSync(absolutePath)) {
                console.error(`❌ File not found: ${absolutePath}`);
                await message.reply(`❌ Voice file not found. Please make sure "i love you.mp3" exists in scripts/cmds/noprefix/ folder.`);
                return;
            }

            // Verify file is readable and has content
            const stats = fs.statSync(absolutePath);
            if (stats.size === 0) {
                console.error(`❌ File is empty: ${absolutePath}`);
                await message.reply(`❌ Voice file is empty.`);
                return;
            }

            // Check if it's an audio file
            if (!absolutePath.toLowerCase().endsWith('.mp3')) {
                console.error(`❌ Not an MP3 file: ${absolutePath}`);
                await message.reply(`❌ File is not an MP3 audio file.`);
                return;
            }

            console.log(`✅ File found: ${absolutePath} (${(stats.size / 1024).toFixed(2)} KB)`);

            // Send the voice message
            await message.reply({
                body: caption,
                attachment: fs.createReadStream(absolutePath)
            });

            console.log(`✅ Successfully sent voice for: ${trigger}`);

        } catch (error) {
            console.error(`💥 Error playing voice for ${trigger}:`, error);
            
            let errorMessage = `❌ Failed to play voice.`;
            
            if (error.code === 'ENOENT') {
                errorMessage = `❌ Voice file not found. Please check if "i love you.mp3" exists in scripts/cmds/noprefix/ folder.`;
            } else if (error.code === 'EACCES') {
                errorMessage = `❌ No permission to read voice file.`;
            } else if (error.message.includes('stream')) {
                errorMessage = `❌ Error reading voice file.`;
            }
            
            try {
                await message.reply(errorMessage);
            } catch (replyError) {
                console.error("Failed to send error message:", replyError);
            }
        }
    }
};
