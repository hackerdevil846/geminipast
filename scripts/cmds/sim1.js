const axios = require('axios');

module.exports = {
  config: {
    name: "sim1",
    aliases: [],
    version: "4.3.7",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🤖 𝑆𝑖𝑚𝑠𝑖𝑚𝑖 𝐴𝐼 𝑐ℎ𝑎𝑡𝑏𝑜𝑡"
    },
    longDescription: {
      en: "𝐼𝑛𝑡𝑒𝑟𝑎𝑐𝑡 𝑤𝑖𝑡ℎ 𝑆𝑖𝑚𝑠𝑖𝑚𝑖 𝐴𝐼 𝑐ℎ𝑎𝑡𝑏𝑜𝑡 𝑖𝑛 𝐵𝑒𝑛𝑔𝑎𝑙𝑖"
    },
    guide: {
      en: "{p}sim1 [𝑜𝑛/𝑜𝑓𝑓/𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": ""
    }
  },

  onLoad: async function () {
    if (!global.simsimi) {
      global.simsimi = new Map();
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;

    if (args.length === 0) {
      return message.reply("🤖 𝐾𝑖 𝑏𝑜𝑙𝑏𝑒 𝑎𝑚𝑎𝑟 𝑗𝑎𝑛? (ღ˘⌣˘ღ)");
    }

    switch (args[0]) {
      case "on":
        if (global.simsimi.has(threadID)) {
          return message.reply("✅ 𝐴𝑝𝑛𝑖 𝑡𝑜 𝑠𝑖𝑚 𝑏𝑎𝑛𝑑 𝑘𝑜𝑟𝑒𝑛𝑛𝑖!");
        }
        global.simsimi.set(threadID, messageID);
        return message.reply("🎉 𝑆𝑎𝑝ℎ𝑎𝑙𝑏ℎ𝑎𝑏𝑒 𝑠𝑖𝑚 𝑐𝑎𝑙𝑢 𝑘𝑜𝑟𝑎 ℎ𝑜𝑙𝑜!");

      case "off":
        if (global.simsimi.has(threadID)) {
          global.simsimi.delete(threadID);
          return message.reply("✅ 𝑆𝑎𝑝ℎ𝑎𝑙𝑏ℎ𝑎𝑏𝑒 𝑠𝑖𝑚 𝑏𝑎𝑛𝑑 𝑘𝑜𝑟𝑎 ℎ𝑜𝑙𝑜!");
        }
        return message.reply("❌ 𝐴𝑝𝑛𝑖 𝑡𝑜 𝑠𝑖𝑚 𝑐𝑎𝑙𝑢 𝑘𝑜𝑟𝑒𝑛𝑛𝑖!");

      default:
        const userMessage = args.join(" ");
        const { data, error } = await this.simsimiChat(userMessage);
        
        if (error) {
          return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
        
        if (!data.success) {
          return message.reply(data.error || "❌ 𝑅𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑒𝑟𝑟𝑜𝑟");
        }
        
        return message.reply(data.success);
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (!global.simsimi.has(threadID) || 
        senderID === api.getCurrentUserID() || 
        !body || 
        messageID === global.simsimi.get(threadID)) {
      return;
    }

    const { data, error } = await this.simsimiChat(body);
    
    if (!error && data.success) {
      api.sendMessage(data.success, threadID, messageID);
    }
  },

  simsimiChat: async function (message) {
    try {
      const encodedMessage = encodeURIComponent(message);
      const response = await axios.get(
        `https://api.simsimi.net/v2/?text=${encodedMessage}&lc=bn`,
        { timeout: 10000 }
      );
      
      return { error: false, data: response.data };
    } catch (error) {
      console.error("Simsimi API Error:", error);
      return { error: true, data: {} };
    }
  }
};
