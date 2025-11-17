const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "yes",
    aliases: [],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "📝 𝐵𝑜𝑎𝑟𝑑 𝑡𝑒𝑥𝑡 𝑐𝑟𝑒𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑡𝑒𝑥𝑡 𝑜𝑛 𝑎 𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒"
    },
    category: "memes",
    guide: {
      en: "{p}yes [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  wrapText: async function(ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText("W").width > maxWidth) return resolve(null);
      
      const words = text.split(" ");
      const lines = [];
      let line = "";
      
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
          line = "";
        }
        
        if (words.length === 0) {
          lines.push(line.trim());
        }
      }
      return resolve(lines);
    });
  },

  onStart: async function ({ message, args }) {
    try {
      const pathImg = __dirname + "/cache/yes.png";
      const text = args.join(" ");
      
      if (!text) {
        return message.reply("❔ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑤𝑟𝑖𝑡𝑒 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑.");
      }

      const getImage = (await axios.get(
        "https://i.ibb.co/GQbRhkY/Picsart-22-08-14-17-32-11-488.jpg",
        { responseType: "arraybuffer" }
      )).data;
      
      fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));

      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.font = "bold 400 35px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "start";

      let fontSize = 45;
      while (ctx.measureText(text).width > 2250) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
      }

      const lines = await this.wrapText(ctx, text, 350);
      ctx.fillText(lines.join("\n"), 280, 50);

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      await message.reply({ 
        attachment: fs.createReadStream(pathImg) 
      });

      fs.unlinkSync(pathImg);

    } catch (error) {
      console.error("𝑌𝑒𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ | 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
