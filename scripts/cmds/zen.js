const axios = require("axios");

module.exports = {
  config: {
    name: "zen",
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Zen quote" },
    longDescription: { en: "Get an inspirational Zen quote" },
    category: "𝗙𝗨𝗡",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get("https://zenquotes.io/api/random");
      const quote = res.data[0]?.q || "Stay mindful.";
      const author = res.data[0]?.a || "Unknown";

      message.reply(
        `🧘 𝗭𝗲𝗻 𝗾𝘂𝗼𝘁𝗲:\n\n“${quote}”\n\n— ${author}`
      );
    } catch (err) {
      console.error("Zen command error:", err.message);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑎 𝑞𝑢𝑜𝑡𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!");
    }
  }
};
