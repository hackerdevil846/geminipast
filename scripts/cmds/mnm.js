const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "mnm",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Apply M&M effect to profile picture"
    },
    description: {
      en: "Adds the M&M effect to your or mentioned user's profile picture"
    },
    category: "image",
    guide: {
      en: "{p}mnm [@mention or reply]\nIf no mention or reply, uses your profile picture."
    }
  },

  onStart: async function ({ api, event, message }) {
    const { senderID, mentions, type, messageReply } = event;

    // Determine user ID for avatar
    let uid;
    if (Object.keys(mentions).length > 0) {
      uid = Object.keys(mentions)[0];
    } else if (type === "message_reply") {
      uid = messageReply.senderID;
    } else {
      uid = senderID;
    }

    const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/mnm?image=${encodeURIComponent(avatarURL)}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `mnm_${uid}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: "🍬 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑀&𝑀 𝑒𝑓𝑓𝑒𝑐𝑡 𝑖𝑚𝑎𝑔𝑒!",
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));

    } catch (err) {
      console.error(err);
      message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑀&𝑀 𝑖𝑚𝑎𝑔𝑒.");
    }
  }
};
