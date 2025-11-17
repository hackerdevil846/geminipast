const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "matchrate",
        aliases: ["compat", "lovecalc"],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "⚡ 𝐶ℎ𝑒𝑐𝑘 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑡𝑤𝑜 𝑝𝑒𝑜𝑝𝑙𝑒"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦 𝑚𝑎𝑡𝑐ℎ 𝑟𝑎𝑡𝑖𝑛𝑔 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠"
        },
        guide: {
            en: "{p}matchrate [@𝑢𝑠𝑒𝑟]"
        },
        dependencies: {
            "fs-extra": "",
            "axios": ""
        }
    },

    onStart: async function({ message, event, usersData }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const mentionId = Object.keys(event.mentions)[0];
            if (!mentionId) {
                return message.reply("✨ 𝑇𝑎𝑔 𝑜𝑛𝑒 𝑓𝑟𝑖𝑒𝑛𝑑 𝑡𝑜 𝑐ℎ𝑒𝑐𝑘 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦!");
            }

            fs.ensureDirSync(__dirname + "/cache");

            const [mentioned, sender] = await Promise.all([
                usersData.get(mentionId),
                usersData.get(event.senderID)
            ]);
            
            const name = mentioned?.name || mentionId;
            const namee = sender?.name || event.senderID;
            const tle = Math.floor(Math.random() * 101);

            const arraytag = [
                { id: mentionId, tag: name },
                { id: event.senderID, tag: namee }
            ];

            const avatarURL1 = `https://graph.facebook.com/${mentionId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const avatarURL2 = `https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const [Avatar, Avatar2] = await Promise.all([
                axios.get(avatarURL1, { responseType: "arraybuffer" }),
                axios.get(avatarURL2, { responseType: "arraybuffer" })
            ]);

            fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar.data));
            fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2.data));

            const imglove = [
                fs.createReadStream(__dirname + "/cache/avt2.png"),
                fs.createReadStream(__dirname + "/cache/avt.png")
            ];

            const loveMessage = 
                `💌 𝑀𝑎𝑡𝑐ℎ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙!\n\n` +
                `🧑‍💼 ➠ ${namee}\n` +
                `👩‍💼 ➠ ${name}\n\n` +
                `💘 𝑀𝑎𝑡𝑐ℎ 𝑅𝑎𝑡𝑖𝑛𝑔 ➠ ${tle}%\n\n` +
                `${tle >= 80 ? "🌟 𝑃𝑒𝑟𝑓𝑒𝑐𝑡 𝑀𝑎𝑡𝑐ℎ! 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑚𝑎𝑑𝑒 𝑓𝑜𝑟 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟!" : 
                  tle >= 60 ? "💖 𝐺𝑜𝑜𝑑 𝐶𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛! 𝑊𝑜𝑟𝑡ℎ 𝑒𝑥𝑝𝑙𝑜𝑟𝑖𝑛𝑔!" : 
                  tle >= 40 ? "🤔 𝐴𝑣𝑒𝑟𝑎𝑔𝑒 𝑀𝑎𝑡𝑐ℎ! 𝐺𝑖𝑣𝑒 𝑖𝑡 𝑎 𝑠ℎ𝑜𝑡!" : 
                  "😢 𝐿𝑜𝑤 𝐶𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦! 𝐵𝑒𝑡𝑡𝑒𝑟 𝑙𝑢𝑐𝑘 𝑛𝑒𝑥𝑡 𝑡𝑖𝑚𝑒!"}`;

            await message.reply({
                body: loveMessage,
                mentions: arraytag,
                attachment: imglove
            });

            // Clean up cache files
            fs.unlinkSync(__dirname + "/cache/avt.png");
            fs.unlinkSync(__dirname + "/cache/avt2.png");

        } catch (e) {
            console.error("𝑀𝑎𝑡𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", e);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑚𝑎𝑡𝑐ℎ 𝑟𝑒𝑞𝑢𝑒𝑠𝑡!");
        }
    }
};
