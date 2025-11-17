const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "trigger",
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: "Trigger image",
    longDescription: "Create a triggered GIF effect from avatar",
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{pn} [@mention | empty]"
    }
  },

  onStart: async function ({ event, message, usersData }) {
    try {
      const uid = Object.keys(event.mentions)[0] || event.senderID;
      const avatarURL = await usersData.getAvatarUrl(uid);

      if (!avatarURL) {
        return message.reply("❌ | 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑓𝑒𝑡𝑐ℎ 𝑡ℎ𝑒 𝑎𝑣𝑎𝑡𝑎𝑟.");
      }

      const img = await new DIG.Triggered().getImage(avatarURL);

      // Ensure tmp folder exists
      const tmpDir = path.join(__dirname, "tmp");
      fs.ensureDirSync(tmpDir);

      const pathSave = path.join(tmpDir, `${uid}_triggered.gif`);
      fs.writeFileSync(pathSave, Buffer.from(img));

      await message.reply({
        body: `😡 | 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑇𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑 𝐺𝐼𝐹!`,
        attachment: fs.createReadStream(pathSave)
      });

      // Clean up after sending
      setTimeout(() => {
        if (fs.existsSync(pathSave)) fs.unlinkSync(pathSave);
      }, 5000);

    } catch (err) {
      console.error("Trigger command error:", err);
      return message.reply("⚠️ | 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑 𝑖𝑚𝑎𝑔𝑒.");
    }
  }
};
