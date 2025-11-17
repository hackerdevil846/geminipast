const fs = require("fs-extra");
const DIG = require("discord-image-generation");
const axios = require("axios");

module.exports = {
  config: {
    name: "spank",
    aliases: ["spanking", "chot"],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "👋🍑 𝑆ℎ𝑜𝑤 𝑜𝑛𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑠𝑝𝑎𝑛𝑘𝑖𝑛𝑔 𝑎𝑛𝑜𝑡ℎ𝑒𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑖𝑚𝑎𝑔𝑒 𝑜𝑓 𝑜𝑛𝑒 𝑢𝑠𝑒𝑟 𝑠𝑝𝑎𝑛𝑘𝑖𝑛𝑔 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟"
    },
    guide: {
      en: "{p}spank [@𝑢𝑠𝑒𝑟1] [@𝑢𝑠𝑒𝑟2]"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": "",
      "discord-image-generation": "",
      "axios": ""
    }
  },

  langs: {
    "en": {
      "error": "⚠️ 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔, 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
      "success": "✅ 𝐼𝑚𝑎𝑔𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑!"
    }
  },

  onStart: async function ({ api, event, args, message, getText }) {
    try {
      const { senderID, threadID, messageID, mentions } = event;

      // Determine target users
      let id1 = Object.keys(mentions)[0] || senderID;
      let id2 = Object.keys(mentions)[1] || senderID;

      // Fetch Facebook avatars
      const avatar1 = (await axios.get(`https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
        responseType: 'arraybuffer'
      })).data;
      
      const avatar2 = (await axios.get(`https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
        responseType: 'arraybuffer'
      })).data;

      // Generate spank image
      let imageBuffer = await new DIG.Spank().getImage(avatar2, avatar1);

      // Temp path
      const path_trash = __dirname + "/cache/spank.png";

      // Save image
      fs.writeFileSync(path_trash, imageBuffer);

      // Get user names for mention
      const userInfo1 = await api.getUserInfo(id1);
      const userInfo2 = await api.getUserInfo(id2);
      const name1 = userInfo1[id1]?.name || "Someone";
      const name2 = userInfo2[id2]?.name || "Someone";

      // Send message with attachment
      await message.reply({
        body: `🍑 ${mentions && Object.keys(mentions).length ? `${name1} 𝑠𝑝𝑎𝑛𝑘𝑒𝑑 ${name2}! 👋` : "𝑆𝑝𝑎𝑛𝑘 𝑎𝑐𝑡𝑖𝑜𝑛! 👋"}`,
        attachment: fs.createReadStream(path_trash)
      });

      // Clean up
      fs.unlinkSync(path_trash);

    } catch (error) {
      console.error(error);
      message.reply(getText("error"));
    }
  }
};
