const axios = require("axios");

module.exports = {
    config: {
        name: "catsay",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "🐱 𝖢𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗈𝗋 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝖼𝗎𝗌𝗍𝗈𝗆 𝗍𝖾𝗑𝗍"
        },
        longDescription: {
            en: "🐱 𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝖼𝗎𝗍𝖾 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝖼𝗎𝗌𝗍𝗈𝗆 𝗆𝖾𝗌𝗌𝖺𝗀𝖾"
        },
        guide: {
            en: "{p}catsay [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, args, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            if (!args[0]) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗍𝖾𝗑𝗍 𝗍𝗈 𝖽𝗂𝗌𝗉𝗅𝖺𝗒 𝗈𝗇 𝗍𝗁𝖾 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾!");
            }

            const text = args.join(" ");

            // Validate text length
            if (text.length > 100) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 100 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            if (text.length < 1) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗏𝖺𝗅𝗂𝖽 𝗍𝖾𝗑𝗍.");
            }

            const loadingMsg = await message.reply("⏳ 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾... 🐱");

            // Encode text for URL
            const encodedText = encodeURIComponent(text);
            
            // Primary API URL with enhanced parameters
            const imageUrl = `https://cataas.com/cat/cute/says/${encodedText}?fontSize=50&fontColor=white&width=500&height=500`;
            
            console.log(`🐱 𝖱𝖾𝗊𝗎𝖾𝗌𝗍𝗂𝗇𝗀 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾: ${imageUrl}`);

            try {
                // Get image stream with error handling
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
                    body: `🐱 𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝖼𝖺𝗍 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾!\n\n📝 ${text}`,
                    attachment: imageStream
                });

                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗋: "${text}"`);

            } catch (streamError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError);
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                // Try fallback API endpoints
                const fallbackUrls = [
                    `https://cataas.com/cat/says/${encodedText}?fontSize=40&fontColor=white`,
                    `https://cataas.com/cat/gif/says/${encodedText}?fontSize=40&fontColor=white`,
                    `https://cataas.com/cat/says/${encodedText}`
                ];

                let fallbackSuccess = false;
                
                for (let i = 0; i < fallbackUrls.length; i++) {
                    try {
                        console.log(`🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨 ${i + 1}: ${fallbackUrls[i]}`);
                        
                        const fallbackStream = await global.utils.getStreamFromURL(fallbackUrls[i]);
                        
                        if (fallbackStream) {
                            await message.reply({
                                body: `🐱 𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝖼𝖺𝗍 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾! (𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄)\n\n📝 ${text}`,
                                attachment: fallbackStream
                            });
                            fallbackSuccess = true;
                            console.log(`✅ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨 ${i + 1} 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅`);
                            break;
                        }
                    } catch (fallbackError) {
                        console.error(`❌ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨 ${i + 1} 𝖿𝖺𝗂𝗅𝖾𝖽:`, fallbackError.message);
                    }
                }

                if (!fallbackSuccess) {
                    const errorMessages = [
                        `❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗋 "${text}". 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.`,
                        `❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗋 "${text}". 𝖳𝗋𝗒 𝖺 𝗌𝗁𝗈𝗋𝗍𝖾𝗋 𝗍𝖾𝗑𝗍.`,
                        `❌ 𝖲𝖾𝗋𝗏𝖾𝗋 𝖾𝗋𝗋𝗈𝗋. 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖼𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗋 "${text}".`
                    ];
                    
                    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                    await message.reply(randomError);
                }
            }

        } catch (error) {
            console.error("💥 𝖢𝖺𝗍𝗌𝖺𝗒 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('getStreamFromURL')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('URI too long')) {
                errorMessage = "❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗌𝗁𝗈𝗋𝗍𝖾𝗋 𝗍𝖾𝗑𝗍.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
