const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "edit",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝖤𝖽𝗂𝗍 𝗂𝗆𝖺𝗀𝖾𝗌 𝗐𝗂𝗍𝗁 𝖠𝖨"
        },
        longDescription: {
            en: "𝖤𝖽𝗂𝗍 𝗂𝗆𝖺𝗀𝖾𝗌 𝗎𝗌𝗂𝗇𝗀 𝖠𝖨 𝖻𝖺𝗌𝖾𝖽 𝗈𝗇 𝗍𝖾𝗑𝗍 𝗉𝗋𝗈𝗆𝗉𝗍𝗌"
        },
        category: "𝖿𝗎𝗇",
        guide: {
            en: "{p}edit <𝗉𝗋𝗈𝗆𝗉𝗍> (𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾)"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            // Check if user replied to a message with image
            if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
                return message.reply("📸 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾 𝗍𝗈 𝖾𝖽𝗂𝗍 𝗂𝗍.");
            }

            const attachment = event.messageReply.attachments[0];
            
            // Validate attachment type
            if (attachment.type !== "photo") {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾.");
            }

            // Check if prompt is provided
            if (!args[0]) {
                return message.reply("📝 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗉𝗋𝗈𝗆𝗉𝗍 𝖿𝗈𝗋 𝗍𝗁𝖾 𝖾𝖽𝗂𝗍.");
            }

            const prompt = args.join(" ").trim();
            
            // Validate prompt length
            if (prompt.length < 2) {
                return message.reply("❌ 𝖯𝗋𝗈𝗆𝗉𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗌𝗁𝗈𝗋𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗆𝖾𝖺𝗇𝗂𝗇𝗀𝖿𝗎𝗅 𝖽𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇.");
            }

            if (prompt.length > 500) {
                return message.reply("❌ 𝖯𝗋𝗈𝗆𝗉𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 500 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            const encodedPrompt = encodeURIComponent(prompt);
            const imgurl = encodeURIComponent(attachment.url);
            const geditUrl = `https://smfahim.xyz/gedit?prompt=${encodedPrompt}&url=${imgurl}`;

            console.log(`🎨 𝖤𝖽𝗂𝗍𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗉𝗋𝗈𝗆𝗉𝗍: ${prompt}`);
            console.log(`🔗 𝖴𝗋𝗅: ${geditUrl}`);

            const processingMsg = await message.reply("🦆 𝖤𝖽𝗂𝗍𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...");

            try {
                // Test if API is accessible first
                try {
                    const testResponse = await axios.head(geditUrl, { timeout: 10000 });
                    console.log(`✅ 𝖠𝖯𝖨 𝗂𝗌 𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝖻𝗅𝖾: ${testResponse.status}`);
                } catch (testError) {
                    console.error(`❌ 𝖠𝖯𝖨 𝗍𝖾𝗌𝗍 𝖿𝖺𝗂𝗅𝖾𝖽:`, testError.message);
                    await message.unsendMessage(processingMsg.messageID);
                    return message.reply("❌ 𝖨𝗆𝖺𝗀𝖾 𝖾𝖽𝗂𝗍𝗂𝗇𝗀 𝗌𝖾𝗋𝗏𝗂𝖼𝖾 𝗂𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                }

                // Get the edited image stream
                const attachment = await global.utils.getStreamFromURL(geditUrl);
                
                if (!attachment) {
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆");
                }

                await message.reply({ 
                    body: `🔥 𝖧𝖾𝗋𝖾 𝗂𝗌 𝗒𝗈𝗎𝗋 𝖾𝖽𝗂𝗍𝖾𝖽 𝗂𝗆𝖺𝗀𝖾!\n\n📝 𝖯𝗋𝗈𝗆𝗉𝗍: ${prompt}`, 
                    attachment: attachment 
                });

                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖾𝖽𝗂𝗍𝖾𝖽 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗉𝗋𝗈𝗆𝗉𝗍: ${prompt}`);
                
                // Unsend processing message
                try {
                    await message.unsendMessage(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
            } catch (error) {
                console.error("💥 𝖤𝖽𝗂𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
                
                // Unsend processing message first
                try {
                    await message.unsendMessage(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                let errorMessage = "❌ 𝖳𝗁𝖾𝗋𝖾 𝗐𝖺𝗌 𝖺𝗇 𝖾𝗋𝗋𝗈𝗋 𝖾𝖽𝗂𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗂𝗆𝖺𝗀𝖾.";
                
                if (error.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖲𝖾𝗋𝗏𝗂𝖼𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                } else if (error.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                } else if (error.message.includes('getStreamFromURL')) {
                    errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝗌𝗂𝗆𝗉𝗅𝖾𝗋 𝗉𝗋𝗈𝗆𝗉𝗍.";
                }
                
                await message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝖬𝖺𝗂𝗇 𝖤𝖽𝗂𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
