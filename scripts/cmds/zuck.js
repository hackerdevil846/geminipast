const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "zuck",
    aliases: ["zuckerberg", "markboard"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "📝 𝑊𝑟𝑖𝑡𝑒 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡 𝑜𝑛 𝑍𝑢𝑐𝑘𝑒𝑟𝑏𝑒𝑟𝑔'𝑠 𝑏𝑜𝑎𝑟𝑑"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡 𝑜𝑛 𝑀𝑎𝑟𝑘 𝑍𝑢𝑐𝑘𝑒𝑟𝑏𝑒𝑟𝑔'𝑠 𝑏𝑜𝑎𝑟𝑑"
    },
    guide: {
      en: "{p}zuck [𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡]"
    },
    countDown: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  wrapText: async function(ctx, text, maxWidth) {
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
          if (split) {
            words[1] = `${temp.slice(-1)}${words[1]}`;
          } else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
          line += `${words.shift()} `;
        } else {
          lines.push(line.trim());
          line = '';
        }
        
        if (words.length === 0) {
          lines.push(line.trim());
        }
      }
      return resolve(lines);
    });
  },

  onStart: async function({ event, args, message }) {
    try {
      const { threadID, messageID } = event;
      const cachePath = path.join(__dirname, "cache");
      const pathImg = path.join(cachePath, "zuck.png");
      const text = args.join(" ");

      if (!text) {
        return message.reply("❔ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑟𝑖𝑡𝑒 𝑠𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑.");
      }

      // Ensure cache directory exists
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath, { recursive: true });
      }
      
      // Download the template image
      const imageResponse = await axios.get(`https://i.postimg.cc/gJCXgKv4/zucc.jpg`, { 
        responseType: 'arraybuffer',
        timeout: 15000
      });
      fs.writeFileSync(pathImg, Buffer.from(imageResponse.data));

      // Process the image
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.font = "400 18px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";

      // Adjust font size to fit the text
      let fontSize = 50;
      while (ctx.measureText(text).width > 1200) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial`;
      }

      // Wrap text and draw on canvas
      const lines = await this.wrapText(ctx, text, 470);
      ctx.fillText(lines.join('\n'), 15, 75);

      // Save and send the final image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      await message.reply({
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      fs.unlinkSync(pathImg);

    } catch (error) {
      console.error("Error in zuck command:", error);
      return message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
