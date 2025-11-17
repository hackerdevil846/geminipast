const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "wasted",
    aliases: ["wastedbanner", "gtawasted"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🎮 𝑊𝐴𝑆𝑇𝐸𝐷 𝑏𝑎𝑛𝑛𝑒𝑟 𝑐𝑟𝑒𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝐺𝑇𝐴-𝑠𝑡𝑦𝑙𝑒 𝑊𝐴𝑆𝑇𝐸𝐷 𝑏𝑎𝑛𝑛𝑒𝑟 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    guide: {
      en: "{p}wasted [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 | 𝑟𝑒𝑝𝑙𝑦 | 𝑢𝑠𝑒𝑟𝐼𝐷]"
    },
    countDown: 2,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { senderID, threadID, messageID } = event;
      const path = __dirname + "/cache";
      const pathImg = __dirname + "/cache/wasted.png";
      const pathAva = __dirname + "/cache/avt.png";

      // ensure cache dir exists
      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

      // Determine user ID (reply -> mention -> arg -> sender)
      let uid;
      if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID) {
        uid = event.messageReply.senderID;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else if (args && args[0]) {
        uid = args[0];
      } else {
        uid = senderID;
      }

      // Fetch user avatar (keep original FB graph URL & token as requested)
      const avatarRes = await axios.get(
        `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      );
      const avatarBuffer = Buffer.from(avatarRes.data);
      fs.writeFileSync(pathAva, avatarBuffer);

      // Fetch wasted overlay (keep original zenzapis link & apikey)
      const wastedRes = await axios.get(
        `https://zenzapis.xyz/photoeditor/wasted?apikey=7990c7f07144`,
        { responseType: "arraybuffer" }
      );
      const wastedBuffer = Buffer.from(wastedRes.data);
      fs.writeFileSync(pathImg, wastedBuffer);

      // Compose images
      const baseImage = await loadImage(pathImg);
      const baseAva = await loadImage(pathAva);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // draw avatar then overlay
      ctx.drawImage(baseAva, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // save final image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      // cleanup avatar
      try { fs.removeSync(pathAva); } catch (e) {}

      // send result
      await message.reply({
        attachment: fs.createReadStream(pathImg)
      });

      // cleanup final image
      try { fs.unlinkSync(pathImg); } catch (e) {}

    } catch (err) {
      console.error("Wasted command error:", err);
      
      // On error, try to cleanup and notify user
      try { if (fs.existsSync(pathAva)) fs.removeSync(pathAva); } catch (e) {}
      try { if (fs.existsSync(pathImg)) fs.removeSync(pathImg); } catch (e) {}
      
      return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
