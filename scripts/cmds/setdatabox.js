module.exports = {
    config: {
        name: "setdatabox",
        aliases: ["updatedata", "refreshdata"],
        version: "1.1",
        role: 2,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑠𝑦𝑠𝑡𝑒𝑚",
        shortDescription: {
            en: "𝑆𝑒𝑡 𝑛𝑒𝑤 𝑑𝑎𝑡𝑎 𝑜𝑓 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑏𝑜𝑥𝑒𝑠 𝑖𝑛𝑡𝑜 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒"
        },
        longDescription: {
            en: "𝑈𝑝𝑑𝑎𝑡𝑒 𝑎𝑛𝑑 𝑟𝑒𝑓𝑟𝑒𝑠ℎ 𝑑𝑎𝑡𝑎 𝑓𝑜𝑟 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑏𝑜𝑥𝑒𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒"
        },
        guide: {
            en: "{p}setdatabox"
        },
        countDown: 5,
        dependencies: {}
    },

    onStart: async function({ message, event, threadsData, api }) {
        try {
            // Get inbox threads
            const inbox = await api.getThreadList(100, null, ['INBOX']);
            const groups = inbox.filter(g => g.isSubscribed && g.isGroup);
            const totalGroups = groups.length;

            if (totalGroups === 0) {
                return message.reply("❌ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝 𝑏𝑜𝑥𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑦𝑜𝑢𝑟 𝐼𝑁𝐵𝑂𝑋");
            }

            let successCount = 0;
            let failedCount = 0;
            const failedBoxes = [];

            for (const group of groups) {
                try {
                    const threadInfo = await api.getThreadInfo(group.threadID);
                    await threadsData.set(group.threadID, { threadInfo });
                    successCount++;
                } catch (err) {
                    failedCount++;
                    failedBoxes.push(group.threadID);
                    console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑢𝑝𝑑𝑎𝑡𝑒 𝑏𝑜𝑥 𝐼𝐷: ${group.threadID}`, err);
                }
            }

            const successMsg = `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑢𝑝𝑑𝑎𝑡𝑒𝑑 ${successCount}/${totalGroups} 𝑔𝑟𝑜𝑢𝑝 𝑏𝑜𝑥𝑒𝑠`;

            if (failedCount > 0) {
                const failedMsg = `❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑢𝑝𝑑𝑎𝑡𝑒 ${failedCount} 𝑏𝑜𝑥𝑒𝑠:\n${failedBoxes.join('\n')}`;
                return message.reply(`${successMsg}\n${failedMsg}`);
            } else {
                return message.reply(successMsg);
            }

        } catch (error) {
            console.error("❌ 𝐶𝑟𝑖𝑡𝑖𝑐𝑎𝑙 𝐸𝑅𝑅𝑂𝑅:", error);
            return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑏𝑜𝑥𝑒𝑠");
        }
    }
};
