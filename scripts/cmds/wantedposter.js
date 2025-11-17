const axios = require('axios');
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "wantedposter",
    aliases: ["wantedcmd", "posterwanted"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🎭 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑤𝑎𝑛𝑡𝑒𝑑 𝑝𝑜𝑠𝑡𝑒𝑟"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑤𝑎𝑛𝑡𝑒𝑑 𝑝𝑜𝑠𝑡𝑒𝑟 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    guide: {
      en: "{p}wantedposter [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛|𝑟𝑒𝑝𝑙𝑦]"
    },
    countDown: 10,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    try {
      const { senderID, threadID, messageID } = event;
      let targetID = senderID;

      // Determine target user
      if (event.type === "message_reply") {
        targetID = event.messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      }

      const pathImg = __dirname + "/cache/wanted_poster.png";
      const pathAva = __dirname + "/cache/avatar.png";

      // Download user avatar
      const Avatar = (
        await axios.get(
          `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )
      ).data;
      
      fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));

      // Download wanted template
      const getWanted = (
        await axios.get(`https://api.popcat.xyz/wanted?image=https://1.bp.blogspot.com/-nj8ADXnM8Ec/X0Ht4-TFU9I/AAAAAAAAw8k/lcoTu5I8alQra8zvzHIaRpA5pQ3La3i7ACLcBGAsYHQ/s1600/Hinh-Nen-Den%2B%252818%2529.jpg`, {
          responseType: "arraybuffer",
        })
      ).data;
      
      fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

      // Process images
      const baseImage = await loadImage(pathImg);
      const baseAva = await loadImage(pathAva);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // Draw images
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAva, 144, 281, 448, 448);

      // Save final image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      
      // Clean up temporary files
      fs.removeSync(pathAva);

      // Get target user name for message
      const userName = await usersData.getName(targetID);

      // Send result
      await message.reply({ 
        body: `⚠️ 𝑊𝐴𝑁𝑇𝐸𝐷: ${userName} ⚠️\n𝑇ℎ𝑖𝑠 𝑝𝑒𝑟𝑠𝑜𝑛 𝑖𝑠 𝑤𝑎𝑛𝑡𝑒𝑑 𝑓𝑜𝑟 𝑏𝑒𝑖𝑛𝑔 𝑡𝑜𝑜 𝑎𝑤𝑒𝑠𝑜𝑚𝑒!`,
        attachment: fs.createReadStream(pathImg) 
      });

      // Clean up final image
      fs.unlinkSync(pathImg);

    } catch (error) {
      console.error("Wanted poster command error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑤𝑎𝑛𝑡𝑒𝑑 𝑝𝑜𝑠𝑡𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
