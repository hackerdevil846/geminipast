const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "xavier",
    aliases: ["xaviermeme", "profxavier"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "🧠 𝑋𝑎𝑣𝑖𝑒𝑟 𝑚𝑒𝑚𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑃𝑟𝑜𝑓𝑒𝑠𝑠𝑜𝑟 𝑋𝑎𝑣𝑖𝑒𝑟 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}xavier [𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡]"
    },
    countDown: 5,
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
      let pathImg = __dirname + '/cache/xavier.png';
      let text = args.join(" ");
      
      if (!text) {
        return message.reply("❔ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡ℎ𝑒 𝑚𝑒𝑚𝑒.");
      }

      // Download the template image
      const getPorn = (await axios.get(`https://i.imgur.com/21xuPR1.jpg`, { 
        responseType: 'arraybuffer' 
      })).data;
      
      fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
      
      // Load and process the image
      let baseImage = await loadImage(pathImg);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");
      
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.font = "400 30px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";
      
      // Adjust font size to fit the text
      let fontSize = 23;
      while (ctx.measureText(text).width > 1200) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
      }
      
      // Wrap text and draw on canvas
      const lines = await this.wrapText(ctx, text, 440);
      ctx.fillText(lines.join('\n'), 50, 225);
      
      // Save and send the final image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      
      await message.reply({
        attachment: fs.createReadStream(pathImg)
      });
      
      // Clean up
      fs.unlinkSync(pathImg);
      
    } catch (error) {
      console.error("Xavier command error:", error);
      return message.reply("❌ | 𝐸𝑟𝑟𝑜𝑟 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
