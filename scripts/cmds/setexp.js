module.exports = {
  config: {
    name: "setexp",
    aliases: ["setlevel", "modifyexp"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "🔄 𝑀𝑜𝑑𝑖𝑓𝑦 𝐸𝑋𝑃 𝑙𝑒𝑣𝑒𝑙𝑠 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝑆𝑒𝑡, 𝑚𝑜𝑑𝑖𝑓𝑦, 𝑜𝑟 𝑟𝑒𝑠𝑒𝑡 𝐸𝑋𝑃 𝑝𝑜𝑖𝑛𝑡𝑠 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    guide: {
      en: "{p}setexp [𝑚𝑒/𝑑𝑒𝑙/𝑢𝑖𝑑] [𝑎𝑚𝑜𝑢𝑛𝑡/𝑢𝑠𝑒𝑟𝐼𝐷]"
    },
    countDown: 5
  },

  langs: {
    "en": {
      "setexp_success": "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑡 𝑦𝑜𝑢𝑟 𝐸𝑋𝑃 𝑡𝑜 %1 🥇",
      "setexp_reset": "✅ 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 %1 𝐸𝑋𝑃 𝑝𝑜𝑖𝑛𝑡𝑠",
      "setexp_invalid": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐸𝑋𝑃 𝑣𝑎𝑙𝑢𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟",
      "user_not_found": "❌ 𝑈𝑠𝑒𝑟 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑈𝐼𝐷",
      "invalid_syntax": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑦𝑛𝑡𝑎𝑥: 𝑈𝑠𝑒 '𝑠𝑒𝑡𝑒𝑥𝑝 𝑢𝑖𝑑 [𝑢𝑠𝑒𝑟𝐼𝐷] [𝑎𝑚𝑜𝑢𝑛𝑡]'",
      "invalid_usage": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒: 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑎 𝑢𝑠𝑒𝑟 𝑜𝑟 𝑢𝑠𝑒 '𝑚𝑒'",
      "error": "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡"
    }
  },

  onStart: async function ({ api, event, args, message, usersData, currenciesData, getText }) {
    try {
      const { threadID, senderID } = event;
      const action = args[0]?.toLowerCase();
      const target = args[1];
      const amount = parseInt(args[2]);

      // Set own EXP
      if (action === 'me') {
        const expValue = parseInt(args[1]);
        if (isNaN(expValue)) {
          return message.reply(getText("setexp_invalid"));
        }
        await currenciesData.set(senderID, { exp: expValue });
        return message.reply(getText("setexp_success").replace("%1", expValue));
      }

      // Reset EXP to zero
      if (action === 'del') {
        if (target === 'me') {
          const currentExp = (await currenciesData.get(senderID))?.exp || 0;
          await currenciesData.set(senderID, { exp: 0 });
          return message.reply(getText("setexp_reset").replace("%1", currentExp));
        }
        
        if (event.mentions && Object.keys(event.mentions).length === 1) {
          const mentionID = Object.keys(event.mentions)[0];
          const userName = event.mentions[mentionID].replace("@", "");
          const currentExp = (await currenciesData.get(mentionID))?.exp || 0;
          await currenciesData.set(mentionID, { exp: 0 });
          return message.reply(getText("setexp_reset").replace("%1", currentExp));
        }
        
        return message.reply(getText("invalid_usage"));
      }

      // Set EXP by UID
      if (action === 'uid') {
        if (!target || isNaN(amount)) {
          return message.reply(getText("invalid_syntax"));
        }
        const userData = await usersData.get(target);
        if (!userData || !userData.name) {
          return message.reply(getText("user_not_found"));
        }
        await currenciesData.set(target, { exp: amount });
        return message.reply(`✅ 𝑆𝑒𝑡 ${userData.name}'𝑠 𝐸𝑋𝑃 𝑡𝑜 ${amount} 🥇`);
      }

      // Set EXP for mentioned user
      if (event.mentions && Object.keys(event.mentions).length === 1) {
        const mentionID = Object.keys(event.mentions)[0];
        const expValue = parseInt(args[args.length - 1]);
        if (isNaN(expValue)) {
          return message.reply(getText("setexp_invalid"));
        }
        const userName = event.mentions[mentionID].replace("@", "");
        await currenciesData.set(mentionID, { exp: expValue });
        return message.reply({
          body: `✅ 𝑆𝑒𝑡 ${userName}'𝑠 𝐸𝑋𝑃 𝑡𝑜 ${expValue} 🥇`,
          mentions: [{ tag: userName, id: parseInt(mentionID) }]
        });
      }

      // Default error message
      return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑! 𝑈𝑠𝑎𝑔𝑒 𝑒𝑥𝑎𝑚𝑝𝑙𝑒𝑠:
• 𝑠𝑒𝑡𝑒𝑥𝑝 𝑚𝑒 100
• 𝑠𝑒𝑡𝑒𝑥𝑝 @𝑢𝑠𝑒𝑟 500
• 𝑠𝑒𝑡𝑒𝑥𝑝 𝑑𝑒𝑙 @𝑢𝑠𝑒𝑟
• 𝑠𝑒𝑡𝑒𝑥𝑝 𝑢𝑖𝑑 12345678 1000`);

    } catch (error) {
      console.error("SetEXP Error:", error);
      return message.reply(getText("error"));
    }
  }
};
