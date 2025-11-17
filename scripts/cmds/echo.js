const axios = require("axios");

module.exports = {
  config: {
    name: "echo",
    aliases: ["parrot", "mirror"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🔄 𝑅𝑒𝑝𝑒𝑎𝑡 𝑡𝑒𝑥𝑡 𝑏𝑎𝑐𝑘 𝑡𝑜 𝑦𝑜𝑢"
    },
    longDescription: {
      en: "𝑅𝑒𝑝𝑒𝑎𝑡𝑠 𝑡ℎ𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑 𝑡𝑒𝑥𝑡 𝑏𝑎𝑐𝑘 𝑡𝑜 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟"
    },
    guide: {
      en: "{p}echo [𝑡𝑒𝑥𝑡]"
    },
    countDown: 0,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ message, args, event }) {
    try {
      const inputText = args.join(" ");
      
      if (!inputText) {
        return message.reply("✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑒𝑐ℎ𝑜!\n💡 𝑈𝑠𝑎𝑔𝑒: 𝑒𝑐ℎ𝑜 [𝑡𝑒𝑥𝑡]");
      }

      return message.reply(`📢 ${inputText}`);
      
    } catch (error) {
      console.error("🔴 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑒𝑐ℎ𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
  }
};
