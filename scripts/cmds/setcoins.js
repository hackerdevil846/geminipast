module.exports = {
    config: {
        name: "setcoins",
        aliases: ["setmoney", "managecoins"],
        version: "1.0.0",
        role: 2,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑠𝑦𝑠𝑡𝑒𝑚",
        shortDescription: {
            en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑢𝑠𝑒𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑐𝑦 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
        },
        longDescription: {
            en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑢𝑠𝑒𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑐𝑦 𝑤𝑖𝑡ℎ 𝑎𝑑𝑑, 𝑠𝑒𝑡, 𝑜𝑟 𝑐𝑙𝑒𝑎𝑛 𝑜𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛𝑠"
        },
        guide: {
            en: "{p}setcoins [𝑎𝑑𝑑/𝑠𝑒𝑡/𝑐𝑙𝑒𝑎𝑛] [𝑎𝑚𝑜𝑢𝑛𝑡] [𝑢𝑠𝑒𝑟 𝑡𝑎𝑔]"
        },
        countDown: 5,
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
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠");
            }

            const { mentions } = event;
            const mentionIDs = Object.keys(mentions);
            const action = args[0]?.toLowerCase();
            const amount = parseInt(args[1]);
            let processedUsers = [];

            // Validate action
            if (!['add', 'set', 'clean'].includes(action)) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑐𝑡𝑖𝑜𝑛! 𝑈𝑠𝑒: 𝑎𝑑𝑑, 𝑠𝑒𝑡, 𝑜𝑟 𝑐𝑙𝑒𝑎𝑛");
            }

            // Validate amount if needed
            if (action !== 'clean' && (isNaN(amount) || amount <= 0)) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑚𝑜𝑢𝑛𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟");
            }

            // Determine target users (mentions or sender)
            const targetUsers = mentionIDs.length > 0 ? mentionIDs : [event.senderID];

            for (const uid of targetUsers) {
                const userData = await usersData.get(uid);
                
                switch(action) {
                    case 'add':
                        await usersData.set(uid, {
                            money: (userData.money || 0) + amount
                        });
                        processedUsers.push(uid);
                        break;
                    case 'set':
                        await usersData.set(uid, {
                            money: amount
                        });
                        processedUsers.push(uid);
                        break;
                    case 'clean':
                        await usersData.set(uid, {
                            money: 0
                        });
                        processedUsers.push(uid);
                        break;
                }
            }

            // Send success message
            const successMsgs = {
                add: `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑎𝑑𝑑𝑒𝑑 ${amount} 𝑐𝑜𝑖𝑛𝑠 𝑡𝑜 ${processedUsers.length} 𝑢𝑠𝑒𝑟𝑠`,
                set: `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑡 ${amount} 𝑐𝑜𝑖𝑛𝑠 𝑓𝑜𝑟 ${processedUsers.length} 𝑢𝑠𝑒𝑟𝑠`,
                clean: `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐𝑙𝑒𝑎𝑛𝑒𝑑 𝑐𝑜𝑖𝑛𝑠 𝑓𝑜𝑟 ${processedUsers.length} 𝑢𝑠𝑒𝑟𝑠`
            };

            await message.reply(successMsgs[action]);

        } catch (err) {
            console.error("𝑆𝑒𝑡𝑐𝑜𝑖𝑛𝑠 𝑒𝑟𝑟𝑜𝑟:", err);
            await message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${err.message}`);
        }
    }
};
