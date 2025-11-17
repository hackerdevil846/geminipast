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
            en: "Auto responder for Asif mentions"
        },
        longDescription: {
            en: "Automatically responds when Asif Mahmud is mentioned"
        },
        guide: {
            en: "Mention @Asif Mahmud or type 'asif'"
        }
    },

    onStart: async function({ message, event, api }) {
        try {

            // FINAL FIXED PATH
            const imagePath = path.join(process.cwd(), "scripts/cmds/noprefix/Asif.png");

            if (!fs.existsSync(imagePath)) {
                return message.reply("❌ Image not found at: " + imagePath);
            }

            const msg = {
                body: "『 @𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈ𓆩𓆪A̶S̶I̶F̶ † 』",
                attachment: fs.createReadStream(imagePath)
            };

            await message.reply(msg);

            await api.setMessageReaction("💔", event.messageID, () => {}, true);

        } catch (error) {
            console.error("Asif onStart error:", error);
        }
    },

    onChat: async function({ event, api, message }) {
        try {

            if (!event.body) return;

            const triggers = ["asif", "@asif", "asif mahmud", "@asif mahmud", "𝐴𝑠𝑖𝑓", "𝑨𝒔𝒊𝒇"];
            const text = event.body.toLowerCase();

            if (triggers.some(t => text.includes(t.toLowerCase()))) {

                // SAME FIXED PATH
                const imagePath = path.join(process.cwd(), "scripts/cmds/noprefix/Asif.png");

                if (!fs.existsSync(imagePath)) return;

                const msg = {
                    body: "『 @𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈ𓆩𓆪A̶S̶I̶F̶ † 』",
                    attachment: fs.createReadStream(imagePath)
                };

                await message.reply(msg);

                await api.setMessageReaction("💔", event.messageID, () => {}, true);
            }

        } catch (error) {
            console.error("Asif onChat error:", error);
        }
    }
};
