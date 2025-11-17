const axios = require('axios');

module.exports = {
  config: {
    name: "trans-bhojpuri",
    aliases: ["bhojpuri", "translate-bhojpuri"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🎭 𝑇𝑒𝑥𝑡 𝑡𝑜 𝐵ℎ𝑜𝑗𝑝𝑢𝑟𝑖 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝐵ℎ𝑜𝑗𝑝𝑢𝑟𝑖 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑢𝑠𝑖𝑛𝑔 𝐺𝑜𝑜𝑔𝑙𝑒 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝐴𝑃𝐼"
    },
    guide: {
      en: "{p}trans-bhojpuri [𝑡𝑒𝑥𝑡] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
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
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒!");
      }

      let translateThis = content;
      let lang = "auto";

      if (event.type === "message_reply") {
        translateThis = event.messageReply.body;
        if (content.indexOf("-> ") !== -1) {
          lang = content.substring(content.indexOf("-> ") + 3);
        }
      } else if (content.indexOf(" -> ") !== -1) {
        translateThis = content.slice(0, content.indexOf(" -> "));
        lang = content.substring(content.indexOf(" -> ") + 4);
      }

      if (!translateThis) {
        return message.reply("❌ 𝑁𝑜 𝑡𝑒𝑥𝑡 𝑓𝑜𝑢𝑛𝑑 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒!");
      }

      const encodedText = encodeURIComponent(translateThis);
      const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=bho&dt=t&q=${encodedText}`;

      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data || !data[0]) {
        return message.reply("❌ 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }

      let translatedText = "";
      data[0].forEach(item => {
        if (item[0]) translatedText += item[0];
      });

      const fromLang = (data[2] === data[8][0][0]) ? data[2] : data[8][0][0];

      return message.reply(
        `🎭 ${translatedText}\n\n📝 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒𝑑 𝑓𝑟𝑜𝑚 ${fromLang} 𝑡𝑜 𝐵ℎ𝑜𝑗𝑝𝑢𝑟𝑖`
      );

    } catch (error) {
      console.error("Translation error:", error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
