const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "amogus",
        aliases: [],
        version: "1.0.1",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "𝖿𝗎𝗇",
        shortDescription: {
            en: "𝖲𝖴𝖲 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖿𝗈𝗋 𝖿𝗎𝗇"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗍𝗈 𝗌𝗎𝗌𝗉𝗂𝖼𝗂𝗈𝗎𝗌 𝗐𝗈𝗋𝖽𝗌 𝗐𝗂𝗍𝗁 𝖺 𝖿𝗎𝗇𝗇𝗒 𝖺𝗎𝖽𝗂𝗈"
        },
        guide: {
            en: "𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾 𝗌𝗎𝗌, 𝖺𝗆𝗈𝗀𝗎𝗌, 𝗈𝗋 𝗌𝗎𝗌𝗌𝗒 𝗂𝗇 𝖼𝗁𝖺𝗍"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onStart: async function ({ message }) {
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

            await message.reply("🔍 𝖳𝗁𝗂𝗌 𝗂𝗌 𝖺𝗇 𝖺𝗎𝗍𝗈-𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽. 𝖳𝗒𝗉𝖾 '𝗌𝗎𝗌', '𝖺𝗆𝗈𝗀𝗎𝗌', 𝗈𝗋 '𝗌𝗎𝗌𝗌𝗒' 𝗂𝗇 𝖼𝗁𝖺𝗍 𝗍𝗈 𝗍𝗋𝗂𝗀𝗀𝖾𝗋 𝗂𝗍!");
        } catch (error) {
            console.error("💥 𝖲𝗎𝗌 𝖮𝗇𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onChat: async function ({ message, event, api }) {
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
                return;
            }

            const { threadID, body, messageID, senderID } = event;
            const botID = api.getCurrentUserID();
            
            // Don't respond to bot's own messages
            if (senderID === botID) return;
            
            // Check if message body exists and is a string
            if (!body || typeof body !== 'string') {
                return;
            }

            // List of trigger words (case-insensitive)
            const triggers = [
                "amogus", "sus", "sussy", "ඞ",
                "among us", "amongus", "suspicious",
                "imposter", "impostor", "vent"
            ];
            
            const messageText = body.toLowerCase().trim();
            
            // Check if message contains any trigger word
            const hasTrigger = triggers.some(trigger => 
                messageText.includes(trigger.toLowerCase())
            );

            if (hasTrigger) {
                console.log(`🔍 𝖲𝗎𝗌 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖻𝗒: ${messageText}`);
                
                // CORRECTED PATH: Use the exact path you specified
                const audioPath = path.join(__dirname, "noprefix", "sus.mp3");
                
                console.log(`📁 𝖫𝗈𝗈𝗄𝗂𝗇𝗀 𝖿𝗈𝗋 𝖺𝗎𝖽𝗂𝗈 𝖺𝗍: ${audioPath}`);
                
                // Check if file exists with proper error handling
                try {
                    if (!fs.existsSync(audioPath)) {
                        console.error(`❌ 𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝖺𝗍: ${audioPath}`);
                        
                        // Create directory if it doesn't exist
                        const audioDir = path.dirname(audioPath);
                        if (!fs.existsSync(audioDir)) {
                            fs.mkdirSync(audioDir, { recursive: true });
                            console.log(`📁 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒: ${audioDir}`);
                        }
                        
                        // Send helpful error message
                        await message.reply({
                            body: "ඞ 𝖲𝖴𝖲𝖲𝖸 𝖡𝖠𝖪𝖠! 😱\n\n⚠️ 𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗆𝗂𝗌𝗌𝗂𝗇𝗀.\n\n📁 𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝖽𝖽: 𝗌𝖼𝗋𝗂𝗉𝗍𝗌/𝖼𝗆𝖽𝗌/𝗇𝗈𝗉𝗋𝖾𝖿𝗂𝗑/𝗌𝗎𝗌.𝗆𝗉𝟥"
                        });
                        return;
                    }

                    // Verify file is readable and has content
                    const stats = fs.statSync(audioPath);
                    if (stats.size === 0) {
                        throw new Error("𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                    }

                    console.log(`✅ 𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝖿𝗈𝗎𝗇𝖽 (${(stats.size / 1024 / 1024).toFixed(2)}𝖬𝖡)`);
                    
                    // Send SUS response with audio
                    await message.reply({
                        body: "ඞ 𝖲𝖴𝖲𝖲𝖸 𝖡𝖠𝖪𝖠! 😱",
                        attachment: fs.createReadStream(audioPath)
                    });
                    
                    console.log("✅ 𝖲𝗎𝗌 𝖺𝗎𝖽𝗂𝗈 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                    
                    // Add reaction with error handling
                    try {
                        await api.setMessageReaction("😱", messageID, (err) => {
                            if (err) {
                                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", err.message);
                            }
                        }, true);
                    } catch (reactionError) {
                        console.warn("❌ 𝖱𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", reactionError.message);
                    }
                    
                } catch (fileError) {
                    console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾:`, fileError.message);
                    
                    // Fallback: send text-only response
                    try {
                        await message.reply({
                            body: "ඞ 𝖲𝖴𝖲𝖲𝖸 𝖡𝖠𝖪𝖠! 😱\n\n📢 (𝖠𝗎𝖽𝗂𝗈 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾)"
                        });
                    } catch (fallbackError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", fallbackError.message);
                    }
                }
            }
        } catch (error) {
            console.error("💥 𝖲𝗎𝗌 𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            // Silent fail to avoid spam
        }
    }
};
