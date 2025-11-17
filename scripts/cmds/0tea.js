const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "tea",
        aliases: [],
        version: "1.0.1",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "☕ | 𝖳𝖾𝖺 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗏𝖾𝗇𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗍𝗈 𝗍𝖾𝖺-𝗋𝖾𝗅𝖺𝗍𝖾𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌 𝗐𝗂𝗍𝗁 𝖺 𝗏𝗂𝖽𝖾𝗈"
        },
        category: "fun",
        guide: {
            en: "𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾 '𝗍𝖾𝖺' 𝗈𝗋 'চা' 𝗂𝗇 𝖼𝗁𝖺𝗍"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            let fsAvailable = true;
            let pathAvailable = true;
            try {
                require("fs");
                require("path");
            } catch (e) {
                fsAvailable = false;
                pathAvailable = false;
            }

            if (!fsAvailable || !pathAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            return message.reply("☕ | 𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗐𝗁𝖾𝗇 𝗒𝗈𝗎 𝗍𝗒𝗉𝖾 '𝗍𝖾𝖺' 𝗈𝗋 'চা' 𝗂𝗇 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍!");
        } catch (error) {
            console.error("💥 𝖳𝖾𝖺 𝖮𝗇𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onChat: async function({ api, event, message }) {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                return;
            }

            const { threadID, messageID, body, senderID } = event;
            const botID = api.getCurrentUserID();
            
            // Don't respond to bot's own messages
            if (senderID === botID) return;
            
            // Check if message body exists and is valid
            if (!body || typeof body !== 'string' || body.trim().length === 0) {
                return;
            }

            const messageText = body.toLowerCase().trim();
            
            // Check for EXACT matches only - no partial matching
            const isTeaTrigger = messageText === "tea";
            const isChaTrigger = messageText === "চা";
            
            if (!isTeaTrigger && !isChaTrigger) {
                return;
            }

            console.log(`☕ 𝖳𝖾𝖺 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖻𝗒: ${messageText}`);
            
            const teaVideoPath = path.join(__dirname, "noprefix", "tea.mp4");
            
            // Check if video file exists and is accessible
            try {
                if (!fs.existsSync(teaVideoPath)) {
                    console.error(`❌ 𝖵𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽: ${teaVideoPath}`);
                    
                    // Send text response if file doesn't exist
                    await message.reply({
                        body: "𝖺𝗂𝗂 𝗅𝗈 𝖻𝖺𝖻𝗒 tea ☕\nচল এক কাপ চা খাই✨"
                    });
                    return;
                }

                // Verify file is readable and has content
                const stats = fs.statSync(teaVideoPath);
                if (stats.size === 0) {
                    throw new Error("𝖵𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }

                // Check file extension to ensure it's a video
                const fileExtension = path.extname(teaVideoPath).toLowerCase();
                const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
                
                if (!videoExtensions.includes(fileExtension)) {
                    console.warn(`⚠️ 𝖥𝗂𝗅𝖾 𝗂𝗌 𝗇𝗈𝗍 𝖺 𝗏𝗂𝖽𝖾𝗈: ${fileExtension}`);
                }

                const msg = {
                    body: "𝖺𝗂𝗂 𝗅𝗈 𝖻𝖺𝖻𝗒 tea ☕\nচল এক কাপ চা খাই✨",
                    attachment: fs.createReadStream(teaVideoPath)
                };
                
                // Send the video response
                await message.reply(msg);
                console.log(`✅ 𝖳𝖾𝖺 𝗏𝗂𝖽𝖾𝗈 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒`);
                
                // Add reaction with error handling
                try {
                    await api.setMessageReaction("☕", messageID, (err) => {
                        if (err) {
                            console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", err.message);
                        }
                    }, true);
                } catch (reactionError) {
                    console.warn("𝖱𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", reactionError.message);
                }
                
            } catch (fileError) {
                console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾:`, fileError.message);
                
                // Fallback: send text-only response
                try {
                    await message.reply({
                        body: "𝖺𝗂𝗂 𝗅𝗈 𝖻𝖺𝖻𝗒 tea ☕\nচল এক কাপ চা খাই\n\n✨"
                    });
                } catch (fallbackError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", fallbackError.message);
                }
            }
        } catch (error) {
            console.error("💥 𝖳𝖾𝖺 𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            // Silent fail to avoid spam
        }
    }
};
