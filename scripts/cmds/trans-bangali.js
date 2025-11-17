const axios = require('axios');

module.exports = {
  config: {
    name: "trans-bangali",
    aliases: ["translate-bn", "bn-translate"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🔄 𝑇𝑒𝑥𝑡 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛 𝑡𝑜 𝐵𝑎𝑛𝑔𝑙𝑎"
    },
    longDescription: {
      en: "𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝐵𝑎𝑛𝑔𝑙𝑎 𝑜𝑟 𝑜𝑡ℎ𝑒𝑟 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝐺𝑜𝑜𝑔𝑙𝑒 𝑇𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑒"
    },
    guide: {
      en: "{p}trans-bangali [𝑡𝑒𝑥𝑡] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒\n{p}trans-bangali [𝑡𝑒𝑥𝑡] -> [𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒_𝑐𝑜𝑑𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let content = args.join(" ").trim();

      if ((!content || content.length === 0) && event.type !== "message_reply") {
        return message.reply("❌ 𝑇𝑒𝑥𝑡 𝑑𝑖𝑛 𝑏𝑎 𝑘𝑜𝑛𝑜 𝑚𝑒𝑠𝑠𝑒𝑗𝑒 𝑟𝑒𝑝𝑙𝑎𝑖 𝑘𝑜𝑟𝑢𝑛");
      }

      let translateThis = "";
      let lang = "bn"; // default target Bangla

      if (event.type === "message_reply" && event.messageReply && event.messageReply.body) {
        translateThis = event.messageReply.body;
        if (content.includes("->")) {
          lang = content.split("->").pop().trim() || "bn";
        }
      } else {
        if (content.includes("->")) {
          const parts = content.split("->");
          translateThis = (parts[0] || "").trim();
          lang = (parts[1] || "").trim() || "bn";
        } else {
          translateThis = content;
        }
      }

      if (!translateThis) {
        return message.reply("❌ 𝑇𝑒𝑥𝑡 𝑑𝑖𝑛 𝑏𝑎 𝑘𝑜𝑛𝑜 𝑚𝑒𝑠𝑠𝑒𝑗𝑒 𝑟𝑒𝑝𝑙𝑎𝑖 𝑘𝑜𝑟𝑢𝑛");
      }

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(translateThis)}`;

      const response = await axios.get(url);
      const retrieve = response.data;

      let text = "";
      if (Array.isArray(retrieve[0])) {
        retrieve[0].forEach(item => {
          if (item && item[0]) text += item[0];
        });
      }

      const fromLang = retrieve[2] || "auto";

      await message.reply(
        `✅ 𝑨𝒏𝒖𝒃𝒂𝒅:\n\n${text}\n\n➤ ${fromLang} → ${lang}`
      );

    } catch (error) {
      console.error("Translation error:", error);
      await message.reply("❌ 𝑨𝒏𝒖𝒃𝒂𝒅 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒔𝒆. 𝒑𝒖𝒏𝒐𝒓𝒊 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏...");
    }
  }
};
