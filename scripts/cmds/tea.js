const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "teatime",
    aliases: ["tea"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "☕ 𝑆𝑒𝑛𝑑𝑠 𝑎 𝑡𝑒𝑎 𝑣𝑖𝑑𝑒𝑜 𝑤ℎ𝑒𝑛 𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑠𝑒𝑛𝑑𝑠 𝑎 𝑡𝑒𝑎 𝑣𝑖𝑑𝑒𝑜 𝑤ℎ𝑒𝑛 𝑡ℎ𝑒 𝑤𝑜𝑟𝑑 '𝑡𝑒𝑎' 𝑖𝑠 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑"
    },
    guide: {
      en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑡𝑒𝑎' 𝑎𝑛𝑑 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑤𝑖𝑙𝑙 𝑟𝑒𝑠𝑝𝑜𝑛𝑑"
    },
    countDown: 5,
    dependencies: {
      "fs": "",
      "path": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const { threadID, messageID } = event;
      const videoPath = path.join(__dirname, "noprefix", "tea.mp4");
      
      if (!fs.existsSync(videoPath)) {
        return message.reply("❌ 𝑇𝑒𝑎 𝑣𝑖𝑑𝑒𝑜 𝑓𝑖𝑙𝑒 𝑖𝑠 𝑚𝑖𝑠𝑠𝑖𝑛𝑔.");
      }

      await message.reply({
        body: "🥤 𝐴𝑖 𝐿𝑜 𝐵𝑏𝑦 ☕",
        attachment: fs.createReadStream(videoPath)
      });

    } catch (err) {
      console.error(err);
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑡𝑒𝑎 𝑣𝑖𝑑𝑒𝑜.");
    }
  },

  onChat: async function ({ event, api, message }) {
    try {
      const { threadID, messageID, body } = event;
      if (!body) return;

      const triggers = ["tea", "Tea", "Cha", "চা"];
      const trimmedBody = body.trim().toLowerCase();
      const shouldTrigger = triggers.some(trigger => 
        trimmedBody.startsWith(trigger.toLowerCase())
      );

      if (!shouldTrigger) return;

      const videoPath = path.join(__dirname, "noprefix", "tea.mp4");
      if (!fs.existsSync(videoPath)) {
        return message.reply("❌ 𝑇𝑒𝑎 𝑣𝑖𝑑𝑒𝑜 𝑓𝑖𝑙𝑒 𝑖𝑠 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑡ℎ𝑒 𝑎𝑑𝑚𝑖𝑛.");
      }

      api.setMessageReaction("🫖", messageID, (err) => {
        if (err) console.error("𝑅𝑒𝑎𝑐𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", err);
      }, true);

      await message.reply({
        body: "🥤 𝐴𝑖 𝐿𝑜 𝐵𝑏𝑦 ☕",
        attachment: fs.createReadStream(videoPath)
      });

    } catch (error) {
      console.error("𝑇𝑒𝑎 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑡ℎ𝑒 𝑡𝑒𝑎 𝑣𝑖𝑑𝑒𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
