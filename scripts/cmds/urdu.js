const axios = require("axios");

module.exports = {
  config: {
    name: "urdu",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🌐 𝑇𝑒𝑥𝑡 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑡𝑜 𝑈𝑟𝑑𝑢 (𝑜𝑟 𝑜𝑡ℎ𝑒𝑟 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒𝑠)"
    },
    longDescription: {
      en: "𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑈𝑟𝑑𝑢 𝑜𝑟 𝑎𝑛𝑦 𝑜𝑡ℎ𝑒𝑟 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑢𝑠𝑖𝑛𝑔 𝐺𝑜𝑜𝑔𝑙𝑒 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒"
    },
    guide: {
      en: "{p}urdu [𝑡𝑒𝑥𝑡] -> [𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑐𝑜𝑑𝑒]\n𝑅𝑒𝑝𝑙𝑦 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ: {p}urdu -> [𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑐𝑜𝑑𝑒]"
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
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒.");
      }

      let translateThis = "";
      let lang = "ur"; // default Urdu

      if (event.type === "message_reply") {
        translateThis = event.messageReply?.body || "";
        if (content.includes("->")) {
          lang = content.substring(content.indexOf("->") + 2).trim();
        }
      } else if (content.includes("->")) {
        translateThis = content.slice(0, content.indexOf("->")).trim();
        lang = content.substring(content.indexOf("->") + 2).trim();
      } else {
        translateThis = content;
      }

      if (!translateThis) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒.");
      }

      const encodedText = encodeURIComponent(translateThis);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodedText}`;

      const response = await axios.get(url);
      const data = response.data;

      let translatedText = "";
      if (Array.isArray(data[0])) {
        data[0].forEach(item => {
          if (item && item[0]) translatedText += item[0];
        });
      }

      let fromLang = "auto";
      try {
        fromLang = (data[2] === data[8][0][0]) ? data[2] : data[8][0][0];
      } catch (e) {}

      await message.reply(
        `🌐 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒𝑑 𝑇𝑒𝑥𝑡:\n\n📖 ${translatedText}\n\n🔄 𝐹𝑟𝑜𝑚: ${fromLang.toUpperCase()} ➝ ${lang.toUpperCase()}`
      );

    } catch (error) {
      console.error("Translation error:", error);
      if (error.response?.status === 429) {
        await message.reply("❌ 𝑅𝑎𝑡𝑒 𝑙𝑖𝑚𝑖𝑡 𝑒𝑥𝑐𝑒𝑒𝑑𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      } else {
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑑𝑢𝑟𝑖𝑛𝑔 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
      }
    }
  }
};
