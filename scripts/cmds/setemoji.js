module.exports = {
  config: {
    name: "setemoji",
    aliases: [],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 1,
    category: "group",
    shortDescription: {
      en: "🔄 𝐶ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑒𝑚𝑜𝑗𝑖"
    },
    longDescription: {
      en: "𝑆𝑒𝑡 𝑜𝑟 𝑐ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒 𝑒𝑚𝑜𝑗𝑖 𝑜𝑓 𝑎 𝑔𝑟𝑜𝑢𝑝 𝑐ℎ𝑎𝑡"
    },
    guide: {
      en: "{p}setemoji [𝑒𝑚𝑜𝑗𝑖]"
    },
    countDown: 3
  },

  langs: {
    "en": {
      "noEmoji": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎𝑛 𝑒𝑚𝑜𝑗𝑖 𝑡𝑜 𝑠𝑒𝑡!",
      "success": "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑡 𝑔𝑟𝑜𝑢𝑝 𝑒𝑚𝑜𝑗𝑖 𝑡𝑜: %1",
      "noPerm": "❌ 𝐼 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑒𝑚𝑜𝑗𝑖. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑎𝑘𝑒 𝑚𝑒 𝑎𝑑𝑚𝑖𝑛!",
      "invalid": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑒𝑚𝑜𝑗𝑖! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑒𝑚𝑜𝑗𝑖.",
      "error": "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐ℎ𝑎𝑛𝑔𝑖𝑛𝑔 𝑒𝑚𝑜𝑗𝑖. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
    }
  },

  onStart: async function ({ api, event, args, message, getText }) {
    try {
      const { threadID, messageID } = event;

      // Check if emoji is provided
      if (!args[0]) {
        return message.reply(getText("noEmoji"));
      }

      const emoji = args.join(" ");

      // Attempt to change group emoji
      await api.changeThreadEmoji(emoji, threadID);

      // Send success message
      return message.reply(getText("success").replace("%1", emoji));

    } catch (error) {
      console.error("❌ Error changing emoji:", error);

      // Send error messages based on common issues
      if (error.message?.includes("permission") || error.errorDescription?.includes("permission")) {
        return message.reply(getText("noPerm"));
      } else if (error.message?.includes("invalid") || error.errorDescription?.includes("invalid")) {
        return message.reply(getText("invalid"));
      } else {
        return message.reply(getText("error"));
      }
    }
  }
};
