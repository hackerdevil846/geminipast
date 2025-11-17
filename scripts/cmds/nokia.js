const axios = require("axios");

module.exports = {
    config: {
        name: "nokia",
        aliases: ["nokiameme"],
        version: "2.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "📱 𝐶𝑟𝑒𝑎𝑡𝑒 𝑁𝑜𝑘𝑖𝑎 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑁𝑜𝑘𝑖𝑎-𝑠𝑡𝑦𝑙𝑒 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
        },
        category: "𝑓𝑢𝑛",
        guide: {
            en: "{p}nokia [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛/𝑟𝑒𝑝𝑙𝑦]"
        },
        countDown: 10,
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠.");
            }

            const { threadID, messageID, messageReply, mentions } = event;
            let targetID;

            // Determine target user
            if (Object.keys(mentions).length > 0) {
                targetID = Object.keys(mentions)[0];
            } else if (messageReply) {
                targetID = messageReply.senderID;
            } else if (args[0]) {
                targetID = args[0];
            } else {
                targetID = event.senderID;
            }

            // Get user data
            const userData = await usersData.get(targetID);
            if (!userData || !userData.avatarUrl) {
                return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑁𝑜𝑘𝑖𝑎 𝑚𝑒𝑚𝑒!");
            }

            // Get avatar URL
            const avatarUrl = userData.avatarUrl;
            
            // Generate meme
            const memeUrl = `https://api.popcat.xyz/nokia?image=${encodeURIComponent(avatarUrl)}`;
            const response = await axios.get(memeUrl, { responseType: 'stream' });
            
            if (!response || !response.data) {
                throw new Error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑚𝑒𝑚𝑒. 𝐴𝑃𝐼 𝑚𝑖𝑔ℎ𝑡 𝑏𝑒 𝑑𝑜𝑤𝑛 𝑜𝑟 𝑖𝑛𝑣𝑎𝑙𝑖𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒.");
            }

            await message.reply({
                body: "📱 𝑁𝑜𝑘𝑖𝑎 𝐹𝑖𝑙𝑡𝑒𝑟 𝐴𝑐𝑡𝑖𝑣𝑎𝑡𝑒𝑑! 𝐵𝑖𝑡𝑐ℎ 𝐼'𝑚 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 😂",
                attachment: response.data
            });

        } catch (error) {
            console.error("𝑁𝑜𝑘𝑖𝑎 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
