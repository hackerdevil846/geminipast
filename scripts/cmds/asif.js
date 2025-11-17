const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "asif",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "no prefix",
        shortDescription: {
            en: "𝖠𝗎𝗍𝗈-𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝖾𝗋 𝖿𝗈𝗋 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝗌"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗐𝗁𝖾𝗇 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 𝗂𝗌 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽"
        },
        guide: {
            en: "𝖬𝖾𝗇𝗍𝗂𝗈𝗇 @𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 𝗈𝗋 𝗍𝗒𝗉𝖾 '𝖺𝗌𝗂𝖿'"
        }
    },

    onStart: async function({ message, event, api }) {
        try {
            // FIXED: Both files are in same folder
            const imagePath = path.join(__dirname, "Asif.png");
            
            console.log("🔍 Looking for image at:", imagePath);
            
            if (!fs.existsSync(imagePath)) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝖺𝗍:", imagePath);
                return message.reply("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽!");
            }

            console.log("✅ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗈𝗎𝗇𝖽!");

            const msg = {
                body: "『 @𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈﮩﮩــﮩــــ𓆩  𓆪〘̶𑁍 〘̶𑁍𓆩⃝A̶S̶I̶F̶𓆪 † 』𓆩๏̬̬̬̬̬̬𓆪†『٭𝐱͜͡⃝ᴆ』†٭❯ 』",
                attachment: fs.createReadStream(imagePath)
            };
            
            await message.reply(msg);
            
            try {
                await api.setMessageReaction("💔", event.messageID, () => {}, true);
            } catch (reactionError) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
            }
            
        } catch (error) {
            console.error("💥 𝖠𝗌𝗂𝖿 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onChat: async function({ event, api, message }) {
        try {
            const { body } = event;
            if (!body) return;

            const triggerWords = ["@Asif Mahmud", "@Asif", "Asif", "asif", "𝐴𝑠𝑖𝑓", "𝑨𝒔𝒊𝒇"];

            const messageText = body.toLowerCase().trim();
            const shouldTrigger = triggerWords.some(word => 
                messageText.includes(word.toLowerCase())
            );

            if (shouldTrigger) {
                // FIXED: Same folder
                const imagePath = path.join(__dirname, "Asif.png");
                
                if (!fs.existsSync(imagePath)) {
                    console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝖺𝗍:", imagePath);
                    return;
                }

                const msg = {
                    body: "『 @𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈﮩﮩــﮩــــ𓆩  𓆪〘̶𑁍 〘̶𑁍𓆩⃝A̶S̶I̶F̶𓆪 † 』𓆩๏̬̬̬̬̬̬𓆪†『٭𝐱͜͡⃝ᴆ』†٭❯ 』",
                    attachment: fs.createReadStream(imagePath)
                };
                
                await message.reply(msg);
                
                try {
                    await api.setMessageReaction("💔", event.messageID, () => {}, true);
                } catch (reactionError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }
        } catch (error) {
            console.error("💥 𝖠𝗌𝗂𝖿 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
