const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "kittymeme",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖺 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗍𝖾𝗑𝗍"
        },
        longDescription: {
            en: "𝖦𝖾𝗍 𝖺 𝖼𝗎𝗍𝖾 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝖼𝗎𝗌𝗍𝗈𝗆 𝗍𝖾𝗑𝗍 𝗈𝗇 𝗂𝗍"
        },
        category: "fun",
        guide: {
            en: "{p}kittymeme [𝗒𝗈𝗎𝗋 𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, args, event }) {
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
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            if (args.length === 0) {
                return message.reply("❗ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗍𝖾𝗑𝗍. 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}kittymeme 𝖨 𝗅𝗈𝗏𝖾 𝖼𝖺𝗍𝗌");
            }

            const userText = args.join(" ");
            
            // Validate text length
            if (userText.length > 100) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 100 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            if (userText.length < 1) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗏𝖺𝗅𝗂𝖽 𝗍𝖾𝗑𝗍.");
            }

            const loadingMsg = await message.reply("⏳ 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝖼𝖺𝗍 𝗆𝖾𝗆𝖾... 🐱");

            const text = encodeURIComponent(userText);
            const imageUrl = `https://cataas.com/cat/says/${text}`;
            
            console.log(`🐱 𝖱𝖾𝗊𝗎𝖾𝗌𝗍𝗂𝗇𝗀 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾: ${imageUrl}`);

            try {
                // Get image stream with timeout and error handling
                const imageStream = await global.utils.getStreamFromURL(imageUrl);
                
                if (!imageStream) {
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆");
                }

                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                await message.reply({
                    body: `🐱 𝖢𝖺𝗍 𝗆𝖾𝗆𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽!\n\n📝 ${userText}`,
                    attachment: imageStream
                });

                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖼𝖺𝗍 𝗆𝖾𝗆𝖾 𝖿𝗈𝗋: "${userText}"`);

            } catch (streamError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError);
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                // Try fallback API
                try {
                    console.log("🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨...");
                    
                    const fallbackUrl = `https://cataas.com/cat/cute/says/${text}`;
                    const fallbackStream = await global.utils.getStreamFromURL(fallbackUrl);
                    
                    if (fallbackStream) {
                        await message.reply({
                            body: `🐱 𝖢𝖺𝗍 𝗆𝖾𝗆𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 (𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄)!\n\n📝 ${userText}`,
                            attachment: fallbackStream
                        });
                        return;
                    }
                } catch (fallbackError) {
                    console.error("❌ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽:", fallbackError);
                }

                const errorMessages = [
                    `❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖼𝖺𝗍 𝗆𝖾𝗆𝖾 𝖿𝗈𝗋 "${userText}". 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.`,
                    `❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗋 "${userText}". 𝖳𝗋𝗒 𝖺 𝗌𝗁𝗈𝗋𝗍𝖾𝗋 𝗍𝖾𝗑𝗍.`,
                    `❌ 𝖲𝖾𝗋𝗏𝖾𝗋 𝖾𝗋𝗋𝗈𝗋. 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖼𝖺𝗍 𝗆𝖾𝗆𝖾 𝖿𝗈𝗋 "${userText}".`
                ];
                
                const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                await message.reply(randomError);
            }

        } catch (error) {
            console.error("💥 𝖪𝗂𝗍𝗍𝗒𝖬𝖾𝗆𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('getStreamFromURL')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
