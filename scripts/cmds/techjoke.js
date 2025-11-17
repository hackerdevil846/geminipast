const axios = require("axios");

module.exports = {
  config: {
    name: "techjoke",
    aliases: ["programmingjoke", "devjoke"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐺𝑒𝑡 𝑝𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑖𝑛𝑔-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑗𝑜𝑘𝑒𝑠"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑝𝑟𝑜𝑔𝑟𝑎𝑚𝑚𝑖𝑛𝑔/𝑡𝑒𝑐ℎ-𝑡ℎ𝑒𝑚𝑒𝑑 𝑗𝑜𝑘𝑒"
    },
    category: "fun",
    guide: {
      en: "{p}techjoke"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://geek-jokes.sameerkumar.website/api");
      const formattedText = `𝘈𝘴𝘪𝘧 𝘔𝘢𝘩𝘮𝘶𝘥 𝘱𝘳𝘦𝘴𝘦𝘯𝘵𝘴:\n\n👨‍💻 𝗧𝗲𝗰𝗵 𝗝𝗼𝗸𝗲:\n"${res.data}"`;
      await message.reply(formattedText);
    } catch (error) {
      console.error("Tech Joke Error:", error);
      await message.reply("❌ 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝘁𝗲𝗰𝗵 𝗷𝗼𝗸𝗲.");
    }
  }
};
