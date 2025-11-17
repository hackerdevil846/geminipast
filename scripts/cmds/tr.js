const axios = require("axios");

module.exports = {
  config: {
    name: "tr",
    aliases: ["trans"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🌍 𝑇𝑒𝑥𝑡 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    longDescription: {
      en: "𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑒𝑥𝑡 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝐺𝑜𝑜𝑔𝑙𝑒 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒"
    },
    guide: {
      en: "{p}tr [𝑡𝑒𝑥𝑡 -> 𝑙𝑎𝑛𝑔] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡𝑒𝑥𝑡"
    },
    countDown: 5,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let content = args.join(" ");
      
      if (content.length === 0 && event.type !== "message_reply") {
        return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒.\n\n📝 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n.tr 𝐻𝑒𝑙𝑙𝑜 -> 𝑏𝑛");
      }

      let translateThis, lang;

      // If it's a reply
      if (event.type === "message_reply") {
        translateThis = event.messageReply.body;
        if (content.includes("->")) {
          lang = content.split("->")[1].trim();
        } else {
          lang = "en"; // default English
        }
      }
      // Normal input
      else {
        if (content.includes("->")) {
          translateThis = content.split("->")[0].trim();
          lang = content.split("->")[1].trim();
        } else {
          translateThis = content;
          lang = "en";
        }
      }

      // API call using axios instead of request
      const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(translateThis)}`);
      
      const retrieve = response.data;
      let text = '';
      retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
      let fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];

      await message.reply(
        `📜 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛:\n\n${text}\n\n🌍 ${fromLang} ➝ ${lang}`
      );

    } catch (error) {
      console.error("Translation error:", error);
      
      if (error.response?.status === 400) {
        await message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑐𝑜𝑑𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑣𝑎𝑙𝑖𝑑 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑐𝑜𝑑𝑒𝑠 𝑙𝑖𝑘𝑒 '𝑒𝑛', '𝑏𝑛', '𝑒𝑠', 𝑒𝑡𝑐.");
      } else if (error.code === 'ENOTFOUND') {
        await message.reply("❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.");
      } else {
        await message.reply("❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑒𝑥𝑡, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
      }
    }
  }
};
