const axios = require("axios");

module.exports = {
  config: {
    name: "ye",
    aliases: ["kanye", "kanyequote"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "🎤 𝑅𝑎𝑛𝑑𝑜𝑚 𝐾𝑎𝑛𝑦𝑒 𝑊𝑒𝑠𝑡 𝑞𝑢𝑜𝑡𝑒"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑞𝑢𝑜𝑡𝑒 𝑓𝑟𝑜𝑚 𝐾𝑎𝑛𝑦𝑒 𝑊𝑒𝑠𝑡"
    },
    category: "fun",
    guide: {
      en: "{p}ye"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://api.kanye.rest");
      const quote = res.data.quote;
      message.reply(`𝑲𝒂𝒏𝒚𝒆 𝒔𝒂𝒚𝒔:\n"${quote}"`);
    } catch {
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝐾𝑎𝑛𝑦𝑒 𝑞𝑢𝑜𝑡𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
