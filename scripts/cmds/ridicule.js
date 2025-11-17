const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "ridicule",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑚𝑜𝑐𝑘𝑖𝑛𝑔 𝑡𝑒𝑥𝑡 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑚𝑜𝑐𝑘𝑖𝑛𝑔 𝑡𝑒𝑥𝑡 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑡𝑒𝑥𝑡 𝑦𝑜𝑢 𝑝𝑟𝑜𝑣𝑖𝑑𝑒"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{𝑝}𝑟𝑖𝑑𝑖𝑐𝑢𝑙𝑒 <𝑡𝑒𝑥𝑡>\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {𝑝}𝑟𝑖𝑑𝑖𝑐𝑢𝑙𝑒 ℎ𝑒𝑙𝑙𝑜"
    }
  },

  langs: {
    en: {
      missing: "❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑚𝑜𝑐𝑘.",
      error: "❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑚𝑜𝑐𝑘𝑖𝑛𝑔 𝑚𝑒𝑚𝑒."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args.length) return message.reply(getLang("missing"));

    const text = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/mock?text=${text}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `ridicule_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: `🤡 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑚𝑜𝑐𝑘𝑖𝑛𝑔 𝑚𝑒𝑚𝑒!`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
