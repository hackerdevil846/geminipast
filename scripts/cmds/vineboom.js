const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "vineboom",
        aliases: [],
        version: "1.1.1",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 3,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "🔊 𝖵𝗂𝗇𝖾 𝖡𝗈𝗈𝗆 𝗌𝗈𝗎𝗇𝖽 𝖾𝖿𝖿𝖾𝖼𝗍"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗉𝗅𝖺𝗒𝗌 𝖵𝗂𝗇𝖾 𝖡𝗈𝗈𝗆 𝗌𝗈𝗎𝗇𝖽 𝗐𝗁𝖾𝗇 𝗍𝗋𝗂𝗀𝗀𝖾𝗋 𝗐𝗈𝗋𝖽𝗌 𝖺𝗋𝖾 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽"
        },
        guide: {
            en: "𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾: '𝗏𝗂𝗇𝖾𝖻𝗈𝗈𝗆' 𝗈𝗋 '𝗍𝗁𝖾 𝗋𝗈𝖼𝗄' 𝗂𝗇 𝖼𝗁𝖺𝗍!"
        },
        dependencies: {
            "fs": "",
            "path": ""
        },
        envConfig: {
            audioPath: path.join(__dirname, 'noprefix/vineboom.gif')
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

            await message.reply("✨ 𝖳𝗁𝗂𝗌 𝗂𝗌 𝖺𝗇 𝖺𝗎𝗍𝗈-𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽\n\n𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾: '𝗏𝗂𝗇𝖾𝖻𝗈𝗈𝗆' 𝗈𝗋 '𝗍𝗁𝖾 𝗋𝗈𝖼𝗄' 𝗂𝗇 𝖼𝗁𝖺𝗍!");
        } catch (error) {
            console.error("💥 𝖵𝗂𝗇𝖾𝖡𝗈𝗈𝗆 𝖮𝗇𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
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

            const { threadID, messageID, senderID, body } = event;
            const botID = api.getCurrentUserID();
            
            // Don't respond to bot's own messages
            if (senderID === botID) return;
            
            // Check if message body exists
            if (!body || typeof body !== 'string') {
                return;
            }

            const triggerWords = [
                "vineboom", "vine boom", "therock", 
                "the rock", "darock", "dwaynejohnson",
                "dwayne johnson", "rock", "vine"
            ];
            
            const messageText = body.toLowerCase().trim();
            
            // Check if any trigger word is in the message
            const hasTrigger = triggerWords.some(word => 
                messageText.includes(word.toLowerCase())
            );

            if (hasTrigger) {
                console.log(`🔊 𝖵𝗂𝗇𝖾𝖡𝗈𝗈𝗆 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖻𝗒: ${messageText}`);
                
                // Check if audio file exists
                const audioFilePath = this.config.envConfig.audioPath;
                
                try {
                    if (!fs.existsSync(audioFilePath)) {
                        console.error(`❌ 𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽: ${audioFilePath}`);
                        
                        // Send text response if file doesn't exist
                        await message.reply({
                            body: "🔊 𝖵𝖨𝖭𝖤 𝖡𝖮𝖮𝖬! 🤨"
                        });
                        return;
                    }

                    // Get file stats to verify it's readable
                    const stats = fs.statSync(audioFilePath);
                    if (stats.size === 0) {
                        throw new Error("𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                    }

                    const msg = {
                        body: "🤨",
                        attachment: fs.createReadStream(audioFilePath)
                    };
                    
                    // Send the audio response
                    await message.reply(msg);
                    console.log(`✅ 𝖵𝗂𝗇𝖾𝖡𝗈𝗈𝗆 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒`);
                    
                    // Add reaction with error handling
                    try {
                        await api.setMessageReaction("🤨", messageID, (err) => {
                            if (err) {
                                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", err.message);
                            }
                        }, true);
                    } catch (reactionError) {
                        console.warn("𝖱𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", reactionError.message);
                    }
                    
                } catch (fileError) {
                    console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾:`, fileError.message);
                    
                    // Fallback: send text-only response
                    try {
                        await message.reply({
                            body: "🔊 𝖵𝖨𝖭𝖤 𝖡𝖮𝖮𝖬! 🤨\n\n(𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾)"
                        });
                    } catch (fallbackError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", fallbackError.message);
                    }
                }
            }
        } catch (error) {
            console.error("💥 𝖵𝗂𝗇𝖾𝖡𝗈𝗈𝗆 𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            // Silent fail to avoid spam
        }
    }
};
