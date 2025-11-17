const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "winw",
    aliases: ["whowouldwin", "vs"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🤼 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑊ℎ𝑜 𝑊𝑜𝑢𝑙𝑑 𝑊𝑖𝑛 𝑚𝑒𝑚𝑒"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑊ℎ𝑜 𝑊𝑜𝑢𝑙𝑑 𝑊𝑖𝑛 𝑚𝑒𝑚𝑒 𝑐𝑜𝑚𝑝𝑎𝑟𝑖𝑛𝑔 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠' 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
      en: "{p}winw @𝑢𝑠𝑒𝑟1 𝑣𝑠 @𝑢𝑠𝑒𝑟2"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const { mentions, senderID, messageReply } = event;
      let mentionIDs = Object.keys(mentions);

      // Support: If fewer than 2 mentions, allow reply chains
      if (mentionIDs.length < 2 && messageReply) {
        mentionIDs.push(messageReply.senderID);
      }

      // Still not enough IDs?
      if (mentionIDs.length < 2) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠.\n👉 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}winw @𝑢𝑠𝑒𝑟1 𝑣𝑠 @𝑢𝑠𝑒𝑟2");
      }

      // Take first 2 IDs only
      const uid1 = mentionIDs[0];
      const uid2 = mentionIDs[1];

      // FB profile picture URLs
      const avatar1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;
      const avatar2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

      // Ensure cache dir
      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);

      // Call PopCat API
      const res = await axios.get(
        `https://api.popcat.xyz/v2/whowouldwin?image1=${encodeURIComponent(avatar1)}&image2=${encodeURIComponent(avatar2)}`,
        { responseType: "arraybuffer" }
      );

      // Save file
      const filePath = path.join(cacheDir, `winw_${uid1}_${uid2}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      await message.reply({
        body: "🤼 | 𝑊ℎ𝑜 𝑊𝑜𝑢𝑙𝑑 𝑊𝑖𝑛?",
        attachment: fs.createReadStream(filePath)
      });

      // Cleanup
      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, 5000);

    } catch (err) {
      console.error("WhoWouldWin error:", err);
      message.reply("⚠️ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
