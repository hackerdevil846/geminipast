const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "binz",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖯𝗅𝖺𝗒𝗌 𝖡𝖨𝖦𝖢𝖨𝖳𝖸𝖡𝖮𝖨 𝖺𝗎𝖽𝗂𝗈 𝗐𝗁𝖾𝗇 𝗎𝗌𝖾𝗋 𝗍𝗒𝗉𝖾𝗌 '𝖻𝗂𝗇𝗓'"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗉𝗅𝖺𝗒𝗌 𝖡𝖨𝖦𝖢𝖨𝖳𝖸𝖡𝖮𝖨 𝖺𝗎𝖽𝗂𝗈 𝗐𝗁𝖾𝗇 𝗍𝗁𝖾 𝗐𝗈𝗋𝖽 '𝖻𝗂𝗇𝗓' 𝗂𝗌 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝗂𝗇 𝖼𝗁𝖺𝗍"
        },
        guide: {
            en: "𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾 '𝖻𝗂𝗇𝗓' 𝗂𝗇 𝖼𝗁𝖺𝗍 𝖺𝗇𝖽 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗐𝗂𝗅𝗅 𝗋𝖾𝗌𝗉𝗈𝗇𝖽 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝖺𝗎𝖽𝗂𝗈"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function ({ message }) {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs-extra");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            return message.reply("🎵 𝖳𝗒𝗉𝖾 '𝖻𝗂𝗇𝗓' 𝗂𝗇 𝖼𝗁𝖺𝗍 𝗍𝗈 𝗉𝗅𝖺𝗒 𝖡𝖨𝖦𝖢𝖨𝖳𝖸𝖡𝖮𝖨 𝖺𝗎𝖽𝗂𝗈!");
        } catch (error) {
            console.error("💥 𝖡𝗂𝗇𝗓 𝗌𝗍𝖺𝗋𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    onChat: async function({ event, message }) {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs-extra");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                return;
            }

            const { body } = event;
            
            if (!body) return;

            // Check if message contains "binz" (case insensitive)
            const messageText = body.toLowerCase().trim();
            const triggerWords = ["binz", "𝖻𝗂𝗇𝗓", "𝖡𝖨𝖭𝖹", "𝖡𝗂𝗇𝗓"];
            
            const shouldTrigger = triggerWords.some(word => 
                messageText.includes(word.toLowerCase())
            );

            if (shouldTrigger) {
                try {
                    // Define path to audio file
                    const audioPath = path.join(__dirname, 'noprefix', 'binz.mp3');
                    
                    // Check if audio file exists
                    if (!fs.existsSync(audioPath)) {
                        console.error("❌ 𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽:", audioPath);
                        return message.reply("❌ 𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇.");
                    }

                    // Check if file is readable and has content
                    try {
                        const stats = fs.statSync(audioPath);
                        if (stats.size === 0) {
                            console.error("❌ 𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒:", audioPath);
                            return message.reply("❌ 𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇.");
                        }
                    } catch (statError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖺𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗌𝗍𝖺𝗍𝗌:", statError.message);
                        return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖺𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾.");
                    }

                    // Send message with audio attachment
                    await message.reply({
                        body: "𝖡𝖨𝖦𝖢𝖨𝖳𝖸𝖡𝖮𝖨 🎵",
                        attachment: fs.createReadStream(audioPath)
                    });

                    console.log("✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗉𝗅𝖺𝗒𝖾𝖽 𝖡𝖨𝖦𝖢𝖨𝖳𝖸𝖡𝖮𝖨 𝖺𝗎𝖽𝗂𝗈");

                } catch (audioError) {
                    console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗉𝗅𝖺𝗒𝗂𝗇𝗀 𝖺𝗎𝖽𝗂𝗈:", audioError);
                    
                    let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗅𝖺𝗒 𝖺𝗎𝖽𝗂𝗈. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                    
                    if (audioError.message.includes('ENOENT')) {
                        errorMessage = "❌ 𝖠𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇.";
                    } else if (audioError.message.includes('EACCES')) {
                        errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖽𝖾𝗇𝗂𝖾𝖽 𝗍𝗈 𝖺𝗎𝖽𝗂𝗈 𝖿𝗂𝗅𝖾.";
                    }
                    
                    await message.reply(errorMessage);
                }
            }
        } catch (error) {
            console.error("💥 𝖡𝗂𝗇𝗓 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
