'use strict';

const sendWaiting = true;
const textWaiting = "🖼️ 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑡𝑤𝑒𝑒𝑡 𝑖𝑚𝑎𝑔𝑒, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const colorName = "#3A3B3C";

module.exports = {
  config: {
    name: "tweetmaker",
    aliases: ["twitterpost"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "🐦 𝐶𝑟𝑒𝑎𝑡𝑒 𝑡𝑤𝑒𝑒𝑡-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑇𝑤𝑖𝑡𝑡𝑒𝑟-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 𝑎𝑛𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}tweetmaker [𝑡𝑒𝑥𝑡]"
    },
    countDown: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      const { loadImage, createCanvas, registerFont } = require('canvas');
      const axios = require('axios');
      const fs = require('fs-extra');
      const jimp = require('jimp');

      if (!args[0]) {
        return message.reply(
          `📝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑡𝑤𝑒𝑒𝑡\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config?.PREFIX || ""}tweetmaker 𝐻𝑒𝑙𝑙𝑜 𝑇𝑤𝑖𝑡𝑡𝑒𝑟 𝑤𝑜𝑟𝑙𝑑!`
        );
      }

      const text = args.join(" ");
      const pathImg = __dirname + `/cache/tweet_${Date.now()}.png`;
      const pathAvata = __dirname + `/cache/avatar_${Date.now()}.png`;

      if (sendWaiting) {
        await message.reply(textWaiting);
      }

      const userInfo = await api.getUserInfo(senderID);
      const userName = userInfo[senderID]?.name || "𝑇𝑤𝑖𝑡𝑡𝑒𝑟 𝑈𝑠𝑒𝑟";

      // Download font if not exists
      if (!fs.existsSync(__dirname + fonts)) {
        try {
          const fontData = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + fonts, Buffer.from(fontData));
        } catch (fontError) {
          console.error("𝐹𝑜𝑛𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", fontError);
        }
      }

      // Download avatar
      const avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarData = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathAvata, Buffer.from(avatarData));

      // Download background
      const bgUrl = "https://i.ibb.co/xq3jLQm/Picsart-22-08-15-23-51-29-721.jpg";
      const bgData = (await axios.get(bgUrl, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathImg, Buffer.from(bgData));

      // Make avatar circular using jimp
      async function circle(image) {
        const img = await jimp.read(image);
        img.circle();
        return await img.getBufferAsync("image/png");
      }

      const circularAvatar = await circle(pathAvata);
      fs.writeFileSync(pathAvata, circularAvatar);

      // Function to wrap text for canvas
      async function wrapText(ctx, text, maxWidth) {
        if (ctx.measureText(text).width < maxWidth) return [text];
        if (ctx.measureText("W").width > maxWidth) return null;

        const words = text.split(" ");
        const lines = [];
        let line = "";

        while (words.length > 0) {
          let split = false;
          while (ctx.measureText(words[0]).width >= maxWidth) {
            const temp = words[0];
            words[0] = temp.slice(0, -1);
            if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
            else {
              split = true;
              words.splice(1, 0, temp.slice(-1));
            }
          }
          if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
          else {
            lines.push(line.trim());
            line = "";
          }
          if (words.length === 0) lines.push(line.trim());
        }
        return lines;
      }

      // Draw canvas
      const baseImage = await loadImage(pathImg);
      const baseAvatar = await loadImage(pathAvata);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAvatar, 53, 35, 85, 85);

      try {
        registerFont(__dirname + fonts, { family: "Play-Bold" });
        ctx.font = "bold 14px 'Play-Bold', Arial, sans-serif";
      } catch {
        ctx.font = "bold 14px Arial, sans-serif";
      }

      // Draw user name
      ctx.fillStyle = colorName;
      ctx.fillText(userName, 153, 99);

      // Draw tweet text
      let fontSize = 18;
      ctx.font = `400 ${fontSize}px Arial`;
      ctx.fillStyle = "#000000";

      while (ctx.measureText(text).width > 1600 && fontSize > 10) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial`;
      }

      const maxWidth = 650;
      const lines = await wrapText(ctx, text, maxWidth) || [text];
      const lineHeight = Math.round(fontSize * 1.4);
      const startX = 56;
      const startY = 180;

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], startX, startY + i * lineHeight);
      }

      // Save and send final image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      await message.reply({
        body: `🐦 ${userName}'𝑠 𝑇𝑤𝑒𝑒𝑡:\n\n"${text}"`,
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      fs.unlinkSync(pathImg);
      fs.unlinkSync(pathAvata);

    } catch (error) {
      console.error("𝑇𝑤𝑒𝑒𝑡 𝑀𝑎𝑘𝑒𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡𝑤𝑒𝑒𝑡 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
