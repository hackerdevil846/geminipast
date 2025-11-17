const request = require("request");

module.exports = {
  config: {
    name: "transkorean",
    aliases: ["kotrans", "koreantrans"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🌍 𝑇𝑒𝑥𝑡 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑡𝑜 𝐾𝑜𝑟𝑒𝑎𝑛"
    },
    longDescription: {
      en: "𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝐾𝑜𝑟𝑒𝑎𝑛 𝑢𝑠𝑖𝑛𝑔 𝐺𝑜𝑜𝑔𝑙𝑒 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒"
    },
    guide: {
      en: "{p}transkorean [𝑡𝑒𝑥𝑡] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡𝑒𝑥𝑡"
    },
    countDown: 5,
    dependencies: {
      "request": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let content = args.join(" ").trim();

      if (content.length === 0 && event.type !== "message_reply") {
        return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑜 𝐾𝑜𝑟𝑒𝑎𝑛.");
      }

      let translateThis;

      if (event.type === "message_reply") {
        translateThis = event.messageReply.body;
      } else {
        translateThis = content;
      }

      const url = encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=${translateThis}`);

      request(url, (err, response, body) => {
        if (err) {
          return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑛𝑔!");
        }

        try {
          const retrieve = JSON.parse(body);
          let text = "";
          
          if (Array.isArray(retrieve[0])) {
            retrieve[0].forEach(item => {
              if (item && item[0]) text += item[0];
            });
          }

          let fromLang = "auto";
          if (retrieve[2]) fromLang = retrieve[2];
          if (retrieve[8] && retrieve[8][0] && retrieve[8][0][0]) {
            fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
          }

          return message.reply(
            `📜 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛:\n\n${text}\n\n━━━━━━━━━━━━━━━━\n🌍 ${fromLang} → 𝐾𝑜𝑟𝑒𝑎𝑛`
          );
        } catch (e) {
          console.error(e);
          return message.reply("❌ 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟: 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑟𝑜𝑚 𝑠𝑒𝑟𝑣𝑒𝑟");
        }
      });

    } catch (error) {
      console.error(error);
      message.reply("⚠️ 𝑈𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑!");
    }
  }
};
