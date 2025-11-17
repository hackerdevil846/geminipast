module.exports = {
    config: {
        name: "rstname",
        aliases: ["resetname"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑔𝑟𝑜𝑢𝑝",
        shortDescription: {
            en: "𝑅𝑒𝑠𝑒𝑡 𝑏𝑜𝑡'𝑠 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 (𝐵𝑂𝑇𝑁𝐴𝑀𝐸 [ 𝑃𝑅𝐸𝐹𝐼𝑋 ])"
        },
        longDescription: {
            en: "𝐺𝑟𝑜𝑢𝑝-𝑒 𝑏𝑜𝑡-𝑒𝑟 𝑛𝑎𝑎𝑚 𝑘𝑒 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 (𝐵𝑂𝑇𝑁𝐴𝑀𝐸 [ 𝑃𝑅𝐸𝐹𝐼𝑋 ]) 𝑎 𝑘𝑜𝑟𝑒 𝑟𝑒𝑠𝑒𝑡 𝑘𝑜𝑟𝑒"
        },
        guide: {
            en: "{p}rstname"
        },
        countDown: 5
    },

    onStart: async function({ message, event, args }) {
        try {
            const { threadID, isGroup } = event;

            // Only allow in groups
            if (!isGroup) {
                return message.reply("❌ 𝐸𝑖 𝑐𝑜𝑚𝑚𝑎𝑛𝑑-𝑡𝑎 𝑠𝑢𝑑ℎ𝑢 𝑔𝑟𝑜𝑢𝑝-𝑒 𝑘𝑎𝑗 𝑘𝑜𝑟𝑒!");
            }

            // Read bot name and prefix from global config (fallbacks included)
            const botName = (global.config && global.config.BOTNAME) ? global.config.BOTNAME : "𝐵𝑜𝑡";
            const prefix = (global.config && global.config.PREFIX) ? global.config.PREFIX : "!";

            // Format new nickname: BOTNAME [ PREFIX ]
            const newNick = `${botName} [ ${prefix} ]`;

            try {
                // Change the bot's nickname in the current thread
                await message.changeNickname(newNick, threadID, message.currentUserID);

                // Success message (Banglish first, also friendly emoji)
                const successMsg = `✅ 𝑁𝑎𝑚 𝑟𝑒𝑠𝑒𝑡 𝑘𝑜𝑟𝑎 ℎ𝑜𝑙𝑜: ${newNick}\n\n• 𝐵𝑜𝑡 𝑛𝑎𝑚𝑒 𝑢𝑝𝑑𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦.`;
                return message.reply(successMsg);
                
            } catch (error) {
                // Log the error for debugging but send a user-friendly message
                console.error("𝑟𝑠𝑡𝑛𝑎𝑚𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
                return message.reply("❌ 𝑁𝑎𝑚 𝑝𝑜𝑟𝑖𝑏𝑜𝑟𝑡𝑜𝑛 𝑘𝑜𝑟𝑎 𝑗𝑎𝑖𝑛𝑖. 𝐸𝑟𝑟𝑜𝑟 ℎ𝑜𝑖𝑠𝑒.");
            }

        } catch (error) {
            console.error("𝑅𝑠𝑡𝑛𝑎𝑚𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
