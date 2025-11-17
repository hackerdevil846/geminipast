module.exports = {
  config: {
    name: "editmoney",
    aliases: ["moneyset", "setcash"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "💵 𝐸𝑑𝑖𝑡 𝑚𝑜𝑛𝑒𝑦 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝑀𝑜𝑑𝑖𝑓𝑦 𝑢𝑠𝑒𝑟 𝑏𝑎𝑙𝑎𝑛𝑐𝑒𝑠 𝑤𝑖𝑡ℎ 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑜𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    guide: {
      en: "{p}editmoney [𝑚𝑒/𝑑𝑒𝑙/𝑢𝑖𝑑/@𝑢𝑠𝑒𝑟] [𝑎𝑚𝑜𝑢𝑛𝑡/𝑢𝑠𝑒𝑟𝐼𝐷]"
    },
    countDown: 5
  },

  onStart: async function({ api, event, args, message, usersData, currenciesData }) {
    try {
      const { threadID, messageID, senderID, mentions } = event;
      const action = args[0]?.toLowerCase();
      const amount = parseInt(args[1]);
      const uid = args[1];
      const setAmount = parseInt(args[2]);

      // Set money for yourself
      if (action === "me") {
        if (isNaN(amount)) 
          return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑚𝑜𝑢𝑛𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟.");
        
        await currenciesData.set(senderID, { money: amount });
        return message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑡 𝑦𝑜𝑢𝑟 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 ${amount} 💸`);
      }

      // Delete money
      else if (action === "del") {
        const target = args[1]?.toLowerCase();

        // Delete your own money
        if (target === "me") {
          const userData = await currenciesData.get(senderID);
          const currentMoney = userData.money || 0;
          await currenciesData.set(senderID, { money: 0 });
          return message.reply(`✅ 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 𝑎𝑙𝑙 𝑦𝑜𝑢𝑟 𝑚𝑜𝑛𝑒𝑦!\n💸 𝐴𝑚𝑜𝑢𝑛𝑡 𝑟𝑒𝑚𝑜𝑣𝑒𝑑: ${currentMoney}`);
        }
        // Delete money for mentioned user
        else if (Object.keys(mentions).length === 1) {
          const mentionID = Object.keys(mentions)[0];
          const name = mentions[mentionID].replace("@", "");
          const userData = await currenciesData.get(mentionID);
          const currentMoney = userData.money || 0;

          await currenciesData.set(mentionID, { money: 0 });
          return message.reply(`✅ 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 𝑎𝑙𝑙 𝑚𝑜𝑛𝑒𝑦 𝑓𝑜𝑟 ${name}!\n💸 𝐴𝑚𝑜𝑢𝑛𝑡 𝑟𝑒𝑚𝑜𝑣𝑒𝑑: ${currentMoney}`);
        }
      }

      // Set money by UID
      else if (action === "uid") {
        if (isNaN(uid)) 
          return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑈𝑠𝑒𝑟 𝐼𝐷");
        if (isNaN(setAmount)) 
          return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑚𝑜𝑢𝑛𝑡");

        const userData = await usersData.get(uid);
        const userName = userData.name || "Unknown User";
        await currenciesData.set(uid, { money: setAmount });
        return message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑡 𝑚𝑜𝑛𝑒𝑦 𝑓𝑜𝑟 ${userName} (${uid}) 𝑡𝑜 ${setAmount} 💸`);
      }

      // Set money for mentioned user
      else if (Object.keys(mentions).length === 1) {
        if (isNaN(amount)) 
          return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑚𝑜𝑢𝑛𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟.");

        const mentionID = Object.keys(mentions)[0];
        const name = mentions[mentionID].replace("@", "");

        await currenciesData.set(mentionID, { money: amount });
        return message.reply({
          body: `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑡 𝑚𝑜𝑛𝑒𝑦 𝑓𝑜𝑟 ${name} 𝑡𝑜 ${amount} 💸`,
          mentions: [{ tag: name, id: mentionID }]
        });
      }

      // Invalid command usage
      else {
        return message.reply("ℹ️ 𝑈𝑠𝑎𝑔𝑒:\n𝑒𝑑𝑖𝑡𝑚𝑜𝑛𝑒𝑦 𝑚𝑒 [𝑎𝑚𝑜𝑢𝑛𝑡]\n𝑒𝑑𝑖𝑡𝑚𝑜𝑛𝑒𝑦 𝑑𝑒𝑙 𝑚𝑒\n𝑒𝑑𝑖𝑡𝑚𝑜𝑛𝑒𝑦 @𝑢𝑠𝑒𝑟 [𝑎𝑚𝑜𝑢𝑛𝑡]\n𝑒𝑑𝑖𝑡𝑚𝑜𝑛𝑒𝑦 𝑢𝑖𝑑 [𝑢𝑠𝑒𝑟𝐼𝐷] [𝑎𝑚𝑜𝑢𝑛𝑡]");
      }

    } catch (error) {
      console.error(error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
  }
};
