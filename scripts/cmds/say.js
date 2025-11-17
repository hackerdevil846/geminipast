const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "say",
    aliases: ["speak", "tts"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "🎤 𝐵𝑜𝑡 𝑡𝑒𝑥𝑡 𝑡𝑎 𝑏𝑜𝑙𝑏𝑒 𝐺𝑜𝑜𝑔𝑙𝑒 𝑇𝑇𝑆 𝑑𝑖𝑦𝑒 (𝐵𝑎𝑛𝑔𝑙𝑎, 𝐵𝑎𝑛𝑔𝑙𝑖𝑠ℎ, 𝐸𝑛𝑔𝑙𝑖𝑠ℎ)"
    },
    longDescription: {
      en: "𝐶𝑜𝑛𝑣𝑒𝑟𝑡𝑠 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑠𝑝𝑒𝑒𝑐ℎ 𝑢𝑠𝑖𝑛𝑔 𝐺𝑜𝑜𝑔𝑙𝑒'𝑠 𝑇𝑇𝑆 𝑎𝑝𝑖"
    },
    guide: {
      en: "{p}say [𝑏𝑛/𝑒𝑛/𝑎𝑢𝑡𝑜] [𝑡𝑒𝑥𝑡]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  langs: {
    "en": {
      "missingText": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑠𝑜𝑚𝑒 𝑡𝑒𝑥𝑡.\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑠𝑎𝑦 𝑎𝑢𝑡𝑜 𝐼 𝑙𝑜𝑣𝑒 𝑦𝑜𝑢",
      "error": "🚫 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑝𝑒𝑎𝑘𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛."
    },
    "bn": {
      "missingText": "❌ 𝐷𝑜𝑦𝑎 𝑘𝑜𝑟𝑒 𝑡𝑒𝑥𝑡 𝑑𝑒𝑛\n𝑈𝑑𝑎ℎ𝑎𝑟𝑜𝑛: 𝑠𝑎𝑦 𝑎𝑢𝑡𝑜 𝑎𝑚𝑖 𝑡𝑜𝑚𝑎𝑘𝑒 𝑏ℎ𝑎𝑙𝑜𝑏𝑎𝑠ℎ𝑖",
      "error": "🚫 𝐵𝑜𝑙𝑎𝑟 𝑠𝑜𝑚𝑜𝑦 𝑒𝑟𝑟𝑜𝑟 ℎ𝑜𝑦𝑒𝑐ℎ𝑒. 𝐴𝑏𝑎𝑟 𝑐ℎ𝑒𝑠𝑡𝑎 𝑘𝑜𝑟𝑢𝑛"
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const { threadID, messageID, type, messageReply } = event;

      // Check if text is given
      if (args.length === 0 && type !== "message_reply") {
        return message.reply(this.langs.en.missingText);
      }

      // Get content from reply or args
      let content = "";
      let lang = "auto";

      if (type === "message_reply" && messageReply) {
        content = messageReply.body;
      } else {
        content = args.join(" ");
        
        // Check for language parameter
        const firstWord = args[0]?.toLowerCase();
        const supportedLangs = ["bn", "en", "hi", "ja", "ru", "tl"];
        
        if (supportedLangs.includes(firstWord)) {
          lang = firstWord;
          content = args.slice(1).join(" ");
        }
      }

      // Auto detect language
      if (lang === "auto") {
        const banglaPattern = /[অ-হ়-ৄে-ৈো-্০-৯]/;
        lang = banglaPattern.test(content) ? "bn" : "en";
      }

      // File path
      const filePath = path.join(__dirname, "cache", `${threadID}_${messageID}.mp3`);
      const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(content)}&tl=${lang}&client=tw-ob`;

      // Download audio file
      const response = await axios.get(ttsURL, {
        responseType: "arraybuffer",
        timeout: 30000
      });

      await fs.writeFile(filePath, Buffer.from(response.data));

      // Send audio file
      await message.reply({
        body: `🗣️ 𝗦𝗔𝗬 [${lang.toUpperCase()}]\n━━━━━━━━━━━━━━━\n${content}`,
        attachment: fs.createReadStream(filePath)
      });

      // Clean up
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

    } catch (error) {
      console.error("[𝑆𝐴𝑌 𝐸𝑅𝑅𝑂𝑅]", error);
      message.reply(this.langs.en.error);
    }
  }
};
