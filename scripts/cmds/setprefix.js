module.exports = {
  config: {
    name: "setprefix",
    aliases: [],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "group",
    shortDescription: {
      en: "🔄 𝑅𝑒𝑠𝑒𝑡 𝑜𝑟 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑝𝑟𝑒𝑓𝑖𝑥"
    },
    longDescription: {
      en: "𝑆𝑒𝑡 𝑜𝑟 𝑟𝑒𝑠𝑒𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑝𝑟𝑒𝑓𝑖𝑥 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝"
    },
    guide: {
      en: "{p}setprefix [𝑝𝑟𝑒𝑓𝑖𝑥/𝑟𝑒𝑠𝑒𝑡]"
    },
    countDown: 5
  },

  langs: {
    "en": {
      "successChange": "✅ 𝑃𝑟𝑒𝑓𝑖𝑥 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜: %1",
      "missingInput": "❌ 𝑃𝑟𝑒𝑓𝑖𝑥 𝑐𝑎𝑛𝑛𝑜𝑡 𝑏𝑒 𝑒𝑚𝑝𝑡𝑦!",
      "resetPrefix": "✅ 𝑃𝑟𝑒𝑓𝑖𝑥 𝑟𝑒𝑠𝑒𝑡 𝑡𝑜 𝑑𝑒𝑓𝑎𝑢𝑙𝑡: %1",
      "confirmChange": "❓ 𝐴𝑟𝑒 𝑦𝑜𝑢 𝑠𝑢𝑟𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑝𝑟𝑒𝑓𝑖𝑥 𝑡𝑜: %1?\n\n𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚!"
    }
  },

  onStart: async function ({ api, event, args, threadsData, message, getText }) {
    try {
      const { threadID, messageID, senderID } = event;

      if (!args[0]) {
        return message.reply(getText("missingInput"));
      }

      const prefix = args[0].trim();

      if (!prefix) {
        return message.reply(getText("missingInput"));
      }

      if (prefix.toLowerCase() === "reset") {
        const defaultPrefix = global.config.PREFIX;
        const threadData = await threadsData.get(threadID);
        threadData.data = threadData.data || {};
        threadData.data.PREFIX = defaultPrefix;

        await threadsData.set(threadID, threadData);
        await global.data.threadData.set(threadID.toString(), threadData.data);

        return message.reply(getText("resetPrefix", defaultPrefix));
      }

      const confirmMsg = await message.reply(getText("confirmChange", prefix));

      global.client.handleReaction = global.client.handleReaction || [];
      global.client.handleReaction.push({
        name: this.config.name,
        messageID: confirmMsg.messageID,
        author: senderID,
        PREFIX: prefix
      });

    } catch (error) {
      console.error("SetPrefix Error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
  },

  onReaction: async function ({ api, event, threadsData, Reaction, getText }) {
    try {
      if (event.userID !== Reaction.author) return;

      const { threadID } = event;
      const newPrefix = Reaction.PREFIX;

      const threadData = await threadsData.get(threadID);
      threadData.data = threadData.data || {};
      threadData.data.PREFIX = newPrefix;

      await threadsData.set(threadID, threadData);
      await global.data.threadData.set(threadID.toString(), threadData.data);

      api.unsendMessage(Reaction.messageID);
      return api.sendMessage(getText("successChange", newPrefix), threadID);
      
    } catch (error) {
      console.error("Reaction Handler Error:", error);
    }
  }
};
