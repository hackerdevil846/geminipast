const axios = require("axios");

module.exports = {
  config: {
    name: "flirtline",
    aliases: ["flirt", "romanceline"],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑓𝑙𝑖𝑟𝑡𝑦 𝑝𝑖𝑐𝑘𝑢𝑝 𝑙𝑖𝑛𝑒𝑠"
    },
    longDescription: {
      en: "𝐷𝑖𝑠𝑐𝑜𝑣𝑒𝑟 𝑐ℎ𝑎𝑟𝑚𝑖𝑛𝑔 𝑝𝑖𝑐𝑘𝑢𝑝 𝑙𝑖𝑛𝑒𝑠 𝑡𝑜 𝑖𝑚𝑝𝑟𝑒𝑠𝑠 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑠𝑝𝑒𝑐𝑖𝑎𝑙!"
    },
    guide: {
      en: "{𝑝}𝑓𝑙𝑖𝑟𝑡𝑙𝑖𝑛𝑒"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!axios) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠.", event.threadID, event.messageID);
      }

      const response = await axios.get("https://api.popcat.xyz/pickuplines");
      const pickupline = response.data.pickupline || "𝐶𝑜𝑢𝑙𝑑𝑛'𝑡 𝑓𝑒𝑡𝑐ℎ 𝑎 𝑙𝑖𝑛𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟 💔";

      const formattedLine = `💘 | 𝗣𝗜𝗖𝗞-𝗨𝗣 𝗟𝗜𝗡𝗘 𝗙𝗢𝗥 𝗬𝗢𝗨\n\n✨ ❝ ${pickupline} ❞ ✨`;
      
      return api.sendMessage({
        body: formattedLine,
        mentions: [{
          tag: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
          id: event.senderID
        }]
      }, event.threadID, event.messageID);
    } catch (error) {
      console.error("[𝑃𝑖𝑐𝑘𝑢𝑝𝐿𝑖𝑛𝑒 𝐸𝑟𝑟𝑜𝑟]", error.message);
      return api.sendMessage(
        "🌸 | 𝙰𝙿𝙸 𝙴𝚁𝚁𝙾𝚁! 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.",
        event.threadID,
        event.messageID
      );
    }
  }
};
