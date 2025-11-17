const axios = require("axios");

module.exports = {
  config: {
    name: "humor",
    aliases: ["joke", "funnypost"], // Changed from ["meme", "funny"]
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝐺𝑒𝑡 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑚𝑒𝑚𝑒 𝑓𝑟𝑜𝑚 𝑅𝑒𝑑𝑑𝑖𝑡"
    },
    longDescription: {
      en: "𝐹𝑒𝑡𝑐ℎ𝑒𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑚𝑒𝑚𝑒 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑚𝑒𝑚𝑒𝑠 𝑠𝑢𝑏𝑟𝑒𝑑𝑑𝑖𝑡"
    },
    guide: {
      en: "{p}humor"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get("https://meme-api.com/gimme/memes");
      const data = res.data;

      if (!data || !data.url) {
        return message.reply("❌ 𝐶𝑜𝑢𝑙𝑑𝑛'𝑡 𝑓𝑒𝑡𝑐ℎ 𝑎 𝑚𝑒𝑚𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
      }

      const caption = `😂 ${data.title}\n👤 𝑢/${data.author} | 🔺 ${data.ups} 𝑢𝑝𝑠\n📎 ${data.postLink}`;

      return message.reply({
        body: caption,
        attachment: await global.utils.getStreamFromURL(data.url)
      });

    } catch (error) {
      console.error("𝑀𝑒𝑚𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
      return message.reply("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑚𝑒𝑚𝑒:\n" + error.message);
    }
  }
};
