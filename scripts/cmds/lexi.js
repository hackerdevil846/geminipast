const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "lexi",
    aliases: ["lexifriedman", "lexiboard"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-image",
    shortDescription: {
      en: "🎤 𝐶𝑜𝑚𝑚𝑒𝑛𝑡 𝑜𝑛 𝐿𝑒𝑥𝑖 𝐹𝑟𝑖𝑒𝑑𝑚𝑎𝑛'𝑠 𝑏𝑜𝑎𝑟𝑑"
    },
    longDescription: {
      en: "𝐴𝑑𝑑 𝑎 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑡𝑜 𝐿𝑒𝑥𝑖 𝐹𝑟𝑖𝑒𝑑𝑚𝑎𝑛'𝑠 𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒"
    },
    guide: {
      en: "{p}lexi [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  wrapText: function(ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText('W').width > maxWidth) return resolve(null);

      const words = text.split(' ');
      const lines = [];
      let line = '';

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
          line = '';
        }
        if (words.length === 0) lines.push(line.trim());
      }

      return resolve(lines);
    });
  },

  onStart: async function ({ message, event, args }) {
    try {
      const { threadID } = event;
      const cacheDir = path.join(__dirname, 'cache');
      const pathImg = path.join(cacheDir, 'lexi_board.png');

      // Create cache directory if it doesn't exist
      await fs.ensureDir(cacheDir);

      let text = args.join(" ");
      if (!text) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 📝");

      // Download base image
      const getImage = await axios.get(`https://i.imgur.com/hTU9zhX.png`, { 
        responseType: 'arraybuffer' 
      });
      await fs.writeFile(pathImg, Buffer.from(getImage.data, 'utf-8'));

      // Load image and create canvas
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // Draw base image
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Setup text styles
      ctx.font = "400 18px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";

      // Auto-adjust font size if text is too long
      let fontSize = 50;
      while (ctx.measureText(text).width > 1200 && fontSize > 10) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial`;
      }

      // Wrap text
      const lines = await this.wrapText(ctx, text, 490);
      ctx.fillText(lines.join('\n'), 18, 85); // Comment position

      // Save final image
      const imageBuffer = canvas.toBuffer();
      await fs.writeFile(pathImg, imageBuffer);

      // Send message with attachment
      await message.reply({
        body: "✨ 𝐿𝑒𝑥𝑖 𝐹𝑟𝑖𝑒𝑑𝑚𝑎𝑛'𝑠 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡! ✏️",
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      await fs.unlink(pathImg);

    } catch (error) {
      console.error("𝐿𝑒𝑥𝑖 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 😢");
    }
  }
};
