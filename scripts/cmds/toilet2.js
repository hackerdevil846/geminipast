const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "toilet2",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🚽 𝑃𝑢𝑡 𝑠𝑜𝑚𝑒𝑜𝑛𝑒'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 𝑜𝑛 𝑎 𝑡𝑜𝑖𝑙𝑒𝑡 𝑠𝑒𝑎𝑡"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑖𝑚𝑎𝑔𝑒 𝑜𝑓 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑠𝑖𝑡𝑡𝑖𝑛𝑔 𝑜𝑛 𝑎 𝑡𝑜𝑖𝑙𝑒𝑡"
    },
    guide: {
      en: "{p}toilet2 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": "",
      "jimp": "",
      "node-superfetch": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const Canvas = global.nodemodule["canvas"];
      const request = global.nodemodule["node-superfetch"];
      const jimp = global.nodemodule["jimp"];

      // Prepare cache directory
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const outputPath = path.join(cacheDir, `toilet_${Date.now()}.png`);
      const targetID = Object.keys(event.mentions)[0] || event.senderID;
      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID].name;

      // Circle image function
      const circleImage = async (imageBuffer) => {
        try {
          const img = await jimp.read(imageBuffer);
          img.circle();
          return await img.getBufferAsync("image/png");
        } catch (err) {
          console.error("Circle processing error:", err);
          throw err;
        }
      };

      // Create canvas and draw base
      const canvas = Canvas.createCanvas(500, 670);
      const ctx = canvas.getContext("2d");
      
      // Load background image
      const background = await Canvas.loadImage("https://i.imgur.com/Kn7KpAr.jpg");
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Fetch and circle avatar
      const avatarRes = await request.get(
        `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );
      const circledBuffer = await circleImage(avatarRes.body);
      const avatar = await Canvas.loadImage(circledBuffer);
      ctx.drawImage(avatar, 135, 350, 205, 205);

      // Add name text
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(name, canvas.width / 2, 320);

      // Write to file and send
      const finalBuffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outputPath, finalBuffer);

      await message.reply({
        body: `🚽 ${name} 𝑖𝑠 𝑠𝑖𝑡𝑡𝑖𝑛𝑔 𝑜𝑛 𝑡ℎ𝑒 𝑡𝑜𝑖𝑙𝑒𝑡! 🐸`,
        attachment: fs.createReadStream(outputPath)
      });

      // Clean up
      fs.unlinkSync(outputPath);

    } catch (error) {
      console.error("Toilet2 command error:", error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑡𝑜𝑖𝑙𝑒𝑡 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
