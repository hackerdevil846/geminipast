const fs = require("fs-extra");

module.exports = {
  config: {
    name: "women",
    aliases: ["womentrigger", "femaletrigger"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "☕ 𝑊𝑜𝑚𝑒𝑛 𝑡𝑟𝑖𝑔𝑔𝑒𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑑 𝑡𝑜 𝑤𝑜𝑚𝑒𝑛-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑣𝑖𝑑𝑒𝑜"
    },
    guide: {
      en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑤𝑜𝑚𝑒𝑛' 𝑜𝑟 '☕' 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ message }) {
    // Basic onStart function to prevent the error
    await message.reply("✅ 𝑊𝑜𝑚𝑒𝑛 𝑡𝑟𝑖𝑔𝑔𝑒𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑠 𝑟𝑒𝑎𝑑𝑦! 𝑇𝑦𝑝𝑒 '𝑤𝑜𝑚𝑒𝑛' 𝑜𝑟 '☕' 𝑡𝑜 𝑡𝑟𝑖𝑔𝑔𝑒𝑟.");
  },

  onChat: async function({ event, message }) {
    try {
      const { body } = event;
      if (!body) return;

      if (
        body.indexOf("Women") === 0 ||
        body.indexOf("women") === 0 ||
        body.indexOf("WOMEN") === 0 ||
        body.indexOf("☕") === 0
      ) {
        const msg = {
          body: "𝐻𝑎ℎ𝑎ℎ𝑎 𝑀𝑜ℎ𝑖𝑙𝑎 🤣☕",
          attachment: fs.createReadStream(__dirname + "/noprefix/wn.mp4")
        };
        await message.reply(msg);
        message.react("☕");
      }
    } catch (error) {
      console.error("Women command error:", error);
    }
  }
};
