const axios = require('axios');

module.exports = {
    config: {
        name: "art2",
        aliases: [],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "image",
        shortDescription: {
            en: '𝖯𝗋𝗈𝗆𝗉𝗍 𝗍𝗈 𝖨𝗆𝖺𝗀𝖾'
        },
        longDescription: {
            en: '𝖢𝗈𝗇𝗏𝖾𝗋𝗍 𝖺 𝗉𝗋𝗈𝗆𝗉𝗍 𝖺𝗇𝖽 𝗂𝗆𝖺𝗀𝖾 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾'
        },
        guide: {
            en: '{p}art2 𝗉𝗋𝗈𝗆𝗉𝗍 | 𝗆𝗈𝖽𝖾𝗅'
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
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

            // Check if user replied to an image
            const imageLink = event.messageReply?.attachments[0]?.url;
            if (!imageLink) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
            }

            // Check if image is valid type
            const attachment = event.messageReply.attachments[0];
            if (attachment.type !== 'photo' && !attachment.type?.includes('image')) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 (𝖩𝖯𝖦, 𝖯𝖭𝖦, 𝖾𝗍𝖼).");
            }

            const text = args.join(" ");
            if (!text || text.trim() === "") {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗉𝗋𝗈𝗆𝗉𝗍 𝗂𝗇 𝗍𝗁𝖾 𝖿𝗈𝗋𝗆𝖺𝗍: 𝗉𝗋𝗈𝗆𝗉𝗍 | 𝗆𝗈𝖽𝖾𝗅");
            }

            // Parse prompt and model
            const parts = text.split("|").map(str => str.trim());
            const prompt = parts[0];
            const model = parts[1] || '3'; // Default model is 3

            if (!prompt || prompt === "") {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗉𝗋𝗈𝗆𝗉𝗍.");
            }

            // Validate model number
            const validModels = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            if (!validModels.includes(model)) {
                return message.reply(`❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗆𝗈𝖽𝖾𝗅. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝖺 𝗆𝗈𝖽𝖾𝗅 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 1-9.\n\n𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗆𝗈𝖽𝖾𝗅𝗌: ${validModels.join(', ')}`);
            }

            // Validate prompt length
            if (prompt.length > 500) {
                return message.reply("❌ 𝖯𝗋𝗈𝗆𝗉𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 500 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            console.log(`🎨 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝖺𝗋𝗍 𝖿𝗈𝗋 𝗉𝗋𝗈𝗆𝗉𝗍: "${prompt}" 𝗐𝗂𝗍𝗁 𝗆𝗈𝖽𝖾𝗅: ${model}`);

            const API = `https://sandipapi.onrender.com/art?imgurl=${encodeURIComponent(imageLink)}&prompt=${encodeURIComponent(prompt)}&model=${model}`;

            // Send processing message
            const processingMsg = await message.reply("⏳ 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖺𝗋𝗍...");

            try {
                // Test if API is accessible first
                try {
                    await axios.head(API, { timeout: 10000 });
                } catch (apiTestError) {
                    console.error("❌ 𝖠𝖯𝖨 𝗍𝖾𝗌𝗍 𝖿𝖺𝗂𝗅𝖾𝖽:", apiTestError.message);
                    await message.unsendMessage(processingMsg.messageID);
                    return message.reply("❌ 𝖠𝗋𝗍 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝗌𝖾𝗋𝗏𝗂𝖼𝖾 𝗂𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                }

                // Get the image stream with timeout
                const imageStream = await global.utils.getStreamFromURL(API);
                
                if (!imageStream) {
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆");
                }

                // Unsend processing message
                try {
                    await message.unsendMessage(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                // Send the generated image
                await message.reply({
                    body: `✅ 𝖠𝗋𝗍 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!\n\n🎨 𝖯𝗋𝗈𝗆𝗉𝗍: ${prompt}\n🔧 𝖬𝗈𝖽𝖾𝗅: ${model}\n✨ 𝖤𝗇𝗃𝗈𝗒 𝗒𝗈𝗎𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇!`,
                    attachment: imageStream
                });

                console.log("✅ 𝖠𝗋𝗍 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");

            } catch (streamError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError);
                
                // Unsend processing message
                try {
                    await message.unsendMessage(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗍𝗁𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                
                if (streamError.message.includes('timeout')) {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝖺 𝗌𝗁𝗈𝗋𝗍𝖾𝗋 𝗉𝗋𝗈𝗆𝗉𝗍.";
                } else if (streamError.message.includes('ECONNREFUSED')) {
                    errorMessage = "❌ 𝖠𝗋𝗍 𝗌𝖾𝗋𝗏𝗂𝖼𝖾 𝗂𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                } else if (streamError.message.includes('getStreamFromURL')) {
                    errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝗌𝗂𝗆𝗉𝗅𝖾𝗋 𝗉𝗋𝗈𝗆𝗉𝗍.";
                }
                
                return message.reply(errorMessage);
            }
            
        } catch (error) {
            console.error("💥 𝖠𝗋𝗍2 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('messageReply')) {
                errorMessage = "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.";
            } else if (error.message.includes('split')) {
                errorMessage = "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗈𝗋𝗆𝖺𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾: 𝗉𝗋𝗈𝗆𝗉𝗍 | 𝗆𝗈𝖽𝖾𝗅";
            }
            
            return message.reply(errorMessage);
        }
    }
};
