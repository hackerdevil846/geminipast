const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "trash",
    aliases: ["garbage", "rubbish"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🗑️ 𝑀𝑎𝑘𝑒 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑙𝑜𝑜𝑘 𝑙𝑖𝑘𝑒 𝑡𝑟𝑎𝑠ℎ 𝑚𝑒𝑚𝑒"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 '𝑡𝑟𝑎𝑠ℎ' 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟 𝑜𝑟 𝑦𝑜𝑢𝑟 𝑜𝑤𝑛"
    },
    guide: {
      en: "{p}trash [@𝑡𝑎𝑔 | 𝑒𝑚𝑝𝑡𝑦]"
    },
    dependencies: {
      "discord-image-generation": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ event, message, usersData }) {
    try {
      const mentionIDs = event.mentions ? Object.keys(event.mentions) : [];
      const uid = mentionIDs[0] || event.senderID;

      // Get user info
      const userInfo = await usersData.get(uid);
      const displayName = userInfo?.name || "User";

      // Get avatar URL
      let avatarURL;
      try {
        const userData = await usersData.get(uid);
        avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      } catch (error) {
        console.error("Error getting avatar URL:", error);
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }

      // Generate trash image
      let img;
      try {
        img = await new DIG.Delete().getImage(avatarURL);
      } catch (error) {
        console.error("Error generating trash image:", error);
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡𝑟𝑎𝑠ℎ 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑢𝑠𝑒𝑟.");
      }

      // Ensure tmp directory exists
      const tmpDir = path.join(__dirname, "tmp");
      await fs.ensureDir(tmpDir);

      // Save image
      const pathSave = path.join(tmpDir, `${uid}_delete_${Date.now()}.png`);
      await fs.writeFile(pathSave, Buffer.from(img));

      // Send message with attachment
      await message.reply({
        body: `${displayName} 𝑖𝑠 𝑛𝑜𝑤 𝑡𝑟𝑎𝑠ℎ 🗑️`,
        attachment: fs.createReadStream(pathSave)
      });

      // Clean up
      setTimeout(() => {
        if (fs.existsSync(pathSave)) {
          fs.unlinkSync(pathSave);
        }
      }, 5000);

    } catch (err) {
      console.error("Trash command error:", err);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡ℎ𝑒 𝑡𝑟𝑎𝑠ℎ 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
