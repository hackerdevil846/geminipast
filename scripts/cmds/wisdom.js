const axios = require("axios");

module.exports = {
  config: {
    name: "wisdom",
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get wise counsel"
    },
    longDescription: {
      en: "Receive a random piece of guidance"
    },
    category: "fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://api.adviceslip.com/advice");
      const advice = res.data.slip.advice;
      message.reply(`💡 𝗪𝗶𝘀𝗱𝗼𝗺:\n"${advice}"`);
    } catch (error) {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝘄𝗶𝘀𝗱𝗼𝗺.");
    }
  }
};
