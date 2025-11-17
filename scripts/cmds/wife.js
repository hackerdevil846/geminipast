const fs = require('fs-extra');
const axios = require('axios');

module.exports = {
  config: {
    name: "wife",
    aliases: ["wifey", "mywife"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "💞 𝐴𝑢𝑡𝑜 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑤𝑖𝑓𝑒𝑦 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝑅𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑤ℎ𝑒𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑠𝑎𝑦𝑠 '𝑤𝑖𝑓𝑒𝑦' 𝑤𝑖𝑡ℎ 𝑎 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
    },
    guide: {
      en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑤𝑖𝑓𝑒𝑦' 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      return message.reply("💞 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑤ℎ𝑒𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑦𝑝𝑒𝑠 '𝑤𝑖𝑓𝑒𝑦' 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡!");
    } catch (error) {
      console.error('Error in wife command onStart:', error);
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑖𝑛𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
    }
  },

  onChat: async function ({ event, message }) {
    try {
      if (event.body && event.body.toLowerCase() === "wifey") {
        // Download the video using global.utils.getStreamFromURL
        const videoStream = await global.utils.getStreamFromURL("https://i.imgur.com/tPzzqVl.mp4");
        
        await message.reply({
          body:
            "╭───────────────⊹⊱❖⊰⊹───────────────╮\n" +
            "         💞 𝑊𝑖𝑓𝑒𝑦 💞\n" +
            "╰───────────────⊹⊱❖⊰⊹───────────────╯\n\n" +
            "💫 𝐻𝑒𝑦 ℎ𝑒𝑦! 𝐷𝑒𝑘ℎ𝑜 𝑘𝑒 𝑎𝑖𝑠𝑒 𝑐𝑢𝑡𝑒 𝑐𝑢𝑡𝑒 𝑎𝑠ℎ𝑒 —\n" +
            "🦋 𝑠𝑢𝑛𝑑𝑜𝑟 𝑙𝑖𝑡𝑡𝑙𝑒 𝑝𝑟𝑖𝑛𝑐𝑒𝑠𝑠 ✨\n\n" +
            "───────────────✧───────────────\n" +
            "🤖 𝐵𝑜𝑡: 𝐴𝑠𝑖𝑓 𝐵𝑂𝑇 🔥",
          attachment: videoStream
        });
      }
    } catch (error) {
      console.error('Error in wife command onChat:', error);
      // Don't send error message in chat to avoid spam
    }
  }
};
