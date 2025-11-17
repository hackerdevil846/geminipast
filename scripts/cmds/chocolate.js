const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "chocolate",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "🍫 𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝖾𝖽 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝗌𝗒𝗌𝗍𝖾𝗆"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗍𝗈 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝖺𝗇𝖽 𝗍𝗈𝖿𝖿𝖾𝖾 𝗄𝖾𝗒𝗐𝗈𝗋𝖽𝗌 𝗐𝗂𝗍𝗁 𝖺 𝗌𝗐𝖾𝖾𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾"
        },
        guide: {
            en: "𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾 '𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾' 𝗈𝗋 '𝗍𝗈𝖿𝖿𝖾𝖾' 𝗂𝗇 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        try {
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            return message.reply("🍫 𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗐𝗁𝖾𝗇 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗒𝗉𝖾𝗌 '𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾' 𝗈𝗋 '𝗍𝗈𝖿𝖿𝖾𝖾' 𝗂𝗇 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍!");
        } catch (error) {
            console.error("💥 𝖢𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝖮𝗇𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onChat: async function({ event, message, api }) {
        try {
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            const { threadID, messageID, body } = event;
            
            if (!body) return;

            const triggers = [
                "chocolate", 
                "toffee", 
                "sweet",
                "𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾",
                "𝗍𝗈𝖿𝖿𝖾𝖾",
                "𝗌𝗐𝖾𝖾𝗍",
                "𝑐ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒",
                "𝑡𝑜𝑓𝑓𝑒𝑒",
                "𝑠𝑤𝑒𝑒𝑡"
            ];
            
            const messageText = body.toLowerCase().trim();
            const shouldTrigger = triggers.some(trigger => 
                messageText.includes(trigger.toLowerCase())
            );

            if (shouldTrigger) {
                const chocolateImagePath = path.join(__dirname, "cache", "chocolate.jpg");
                
                console.log(`🍫 𝖳𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖻𝗒: "${body}"`);

                try {
                    // Check if the local image file exists
                    if (fs.existsSync(chocolateImagePath)) {
                        // Use local file
                        await message.reply({
                            body: "🍫 𝗅𝗈 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝖽𝖺𝗋𝗅𝗂𝗇𝗀! 💝",
                            attachment: fs.createReadStream(chocolateImagePath)
                        });
                    } else {
                        console.log("❌ 𝖫𝗈𝖼𝖺𝗅 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾.𝗃𝗉𝗀 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
                        return;
                    }
                    
                    console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾`);

                    // Add reaction with error handling
                    try {
                        await api.setMessageReaction("🍫", messageID, () => {}, true);
                    } catch (reactionError) {
                        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                    }
                    
                } catch (streamError) {
                    console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError);
                }
            }
        } catch (error) {
            console.error("💥 𝖢𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝖮𝗇𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    }
};
