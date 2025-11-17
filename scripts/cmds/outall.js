module.exports = {
    config: {
        name: "outall",
        aliases: ["leaveall", "botout"],
        version: "1.0.1",
        role: 2,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🔄 𝑆𝑜𝑏 𝑔𝑟𝑢𝑝 𝑡ℎ𝑒𝑘𝑒 𝐵𝑜𝑡 𝑘𝑒 𝑏𝑎ℎ𝑖𝑟 𝑛𝑖𝑦𝑒 𝑗𝑎𝑜𝑎"
        },
        longDescription: {
            en: "𝑀𝑎𝑘𝑒 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑙𝑒𝑎𝑣𝑒 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠 𝑒𝑥𝑐𝑒𝑝𝑡 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑜𝑛𝑒"
        },
        category: "𝑎𝑑𝑚𝑖𝑛",
        guide: {
            en: "{p}outall"
        },
        countDown: 5
    },

    onStart: async function({ message, event, threadsData }) {
        try {
            const botID = global.utils.getBotID();
            const allThreads = await threadsData.getAll();
            
            let successCount = 0;
            let errorCount = 0;
            let results = [];

            for (const thread of allThreads) {
                if (thread.isGroup && thread.threadID !== event.threadID) {
                    try {
                        await threadsData.removeBotFromThread(thread.threadID);
                        successCount++;
                        results.push(`✅ | ${thread.name || "𝑈𝑛𝑛𝑎𝑚𝑒𝑑 𝐺𝑟𝑜𝑢𝑝"} - 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑙𝑒𝑓𝑡!`);
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } catch (error) {
                        errorCount++;
                        results.push(`❌ | ${thread.name || "𝑈𝑛𝑛𝑎𝑚𝑒𝑑 𝐺𝑟𝑜𝑢𝑝"} - 𝐹𝑎𝑖𝑙𝑒𝑑: ${error.message}`);
                    }
                }
            }

            const summary = 
                `╭──『 𝑂𝑈𝑇𝐴𝐿𝐿 𝑅𝐸𝑆𝑈𝐿𝑇 』──⊷\n` +
                `│\n` +
                `│ ✅ 𝑆𝑈𝐶𝐶𝐸𝑆𝑆: ${successCount} 𝑔𝑟𝑜𝑢𝑝𝑠\n` +
                `│ ❌ 𝐹𝐴𝐼𝐿𝑈𝑅𝐸: ${errorCount} 𝑔𝑟𝑜𝑢𝑝𝑠\n` +
                `│\n` +
                `╰──『 𝐵𝑜𝑡 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 』──⊷`;

            await message.reply(summary);
            
            // Send detailed results if any
            if (results.length > 0) {
                const detailedReport = "📋 𝐷𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑅𝑒𝑝𝑜𝑟𝑡:\n\n" + results.join("\n");
                await message.reply(detailedReport);
            }

        } catch (error) {
            console.error("𝑂𝑢𝑡𝑎𝑙𝑙 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply(
                `⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑:\n${error.message}\n` +
                `𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!`
            );
        }
    }
};
