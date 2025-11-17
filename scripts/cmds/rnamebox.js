module.exports = {
    config: {
        name: "rnamebox",
        aliases: ["renameall", "setallname"],
        version: "1.0.0",
        role: 2,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "🛠️ 𝑆𝑦𝑠𝑡𝑒𝑚",
        shortDescription: {
            en: "🔄 𝐺𝑟𝑢𝑝 𝑒𝑟 𝑠𝑜𝑏 𝑚𝑒𝑚𝑏𝑒𝑟𝑑𝑒𝑟 𝑒𝑟 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑝𝑎𝑟𝑖𝑏𝑎𝑟𝑡𝑎𝑛 𝑘𝑜𝑟𝑒𝑛"
        },
        longDescription: {
            en: "𝐴𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑐ℎ𝑎𝑛𝑔𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
        },
        guide: {
            en: "{p}rnamebox [𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒]"
        },
        countDown: 20,
        dependencies: {}
    },

    onStart: async function({ message, event, args, threadsData }) {
        try {
            const customName = args.join(" ");
            
            if (!customName) {
                return message.reply("❌ | 𝐴𝑝𝑛𝑖 𝑒𝑘𝑡𝑖 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑑𝑖𝑡𝑒 ℎ𝑜𝑏𝑒!");
            }

            const allThreads = await threadsData.getAll(["threadID"]);
            const failedThreads = [];
            let successCount = 0;

            for (const thread of allThreads) {
                try {
                    await message.unsend(`setTitle_${thread.threadID}`);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    await message.setTitle(customName, thread.threadID);
                    successCount++;
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    failedThreads.push(thread.threadID);
                }
            }

            let msg = `✅ | 𝑆𝑎𝑝ℎ𝑎𝑙𝑏ℎ𝑎𝑏𝑒 ${successCount} 𝑡𝑖 𝑔𝑟𝑢𝑝𝑒𝑟 𝑛𝑎𝑚 𝑝𝑎𝑟𝑖𝑏𝑎𝑟𝑡𝑎𝑛 𝑘𝑜𝑟𝑎 ℎ𝑜𝑙𝑜!`;
            
            if (failedThreads.length > 0) {
                msg += `\n⚠️ | 𝐾𝑖𝑐ℎ𝑢 𝑔𝑟𝑢𝑝𝑒𝑟 𝑛𝑎𝑚 𝑝𝑎𝑟𝑖𝑏𝑎𝑟𝑡𝑎𝑛 𝑘𝑜𝑟𝑡𝑒 𝑝𝑎𝑟𝑐ℎ𝑖 𝑛𝑎: ${failedThreads.length} 𝑡𝑖`;
            }

            return message.reply(msg);
            
        } catch (error) {
            console.error("🚫 | 𝐸𝑟𝑟𝑜𝑟:", error);
            return message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
        }
    }
};
