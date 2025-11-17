const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "tiki",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🎨 𝑊𝑟𝑖𝑡𝑒 𝑡𝑒𝑥𝑡 𝑜𝑛 𝑎 𝑏𝑙𝑎𝑐𝑘𝑏𝑜𝑎𝑟𝑑"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑏𝑙𝑎𝑐𝑘𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}tiki [𝑡𝑒𝑥𝑡]"
    },
    countDown: 10,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const { threadID, messageID } = event;
      const pathImg = __dirname + '/cache/tiki.png';
      const text = args.join(" ");

      if (!text) {
        return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑠𝑜𝑚𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑤𝑟𝑖𝑡𝑒 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑");
      }

      // Download base image
      const imgData = (await axios.get(`https://imgur.com/nqUIi2S.png`, { 
        responseType: 'arraybuffer' 
      })).data;
      
      fs.writeFileSync(pathImg, Buffer.from(imgData));

      // Load images
      const baseImage = await jimp.read(pathImg);
      const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
      
      // Calculate text position and size
      const maxWidth = 900;
      const x = 625;
      const y = 430;
      const fontSize = 32;
      
      // Simple text wrapping function for jimp
      function wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = jimp.measureText(font, currentLine + " " + word);
          if (width < maxWidth) {
            currentLine += " " + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      }

      const lines = wrapText(text, maxWidth);
      
      // Draw text on image
      lines.forEach((line, index) => {
        baseImage.print(font, x, y + (index * 45), line);
      });

      // Save image
      await baseImage.writeAsync(pathImg);

      await message.reply({
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      fs.unlinkSync(pathImg);

    } catch (error) {
      console.error("Tiki Error:", error);
      try { 
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); 
      } catch (cleanupError) {}
      
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
