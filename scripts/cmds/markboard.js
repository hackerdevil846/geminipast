const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "markboard",
    aliases: ["writeboard", "textboard"],
    version: "1.0.1",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "Write text on board image"
    },
    longDescription: {
      en: "Create a board image with your text"
    },
    guide: {
      en: "{p}markboard [text]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  langs: {
    "en": {
      "noText": "Please enter text to write on the board",
      "done": "Board created successfully!",
      "error": "Error occurred. Please try again"
    }
  },

  onLoad: function() {
    const dir = __dirname + "/cache";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  },

  wrapText: async (ctx, text, maxWidth) => {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) {
        return resolve([text]);
      }
      if (ctx.measureText('W').width > maxWidth) {
        return resolve(null);
      }
      
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

  onStart: async function({ message, event, args, getText }) {
    try {
      const { threadID, messageID } = event;
      const text = args.join(" ");

      if (!text) {
        return message.reply(getText("noText"));
      }

      // Ensure cache folder exists
      await fs.ensureDir(__dirname + '/cache');
      const pathImg = __dirname + '/cache/markboard.png';

      // Download base image (original link preserved)
      const response = await axios.get('https://i.imgur.com/3j4GPdy.jpg', { 
        responseType: 'arraybuffer' 
      });
      await fs.writeFile(pathImg, Buffer.from(response.data, 'binary'));

      // Load image & prepare canvas
      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Font settings
      let fontSize = 45;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'start';
      ctx.font = `400 ${fontSize}px Arial, sans-serif`;

      // Adjust font size if text is too wide
      while (ctx.measureText(text).width > 2250 && fontSize > 10) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
      }

      // Wrap text into lines
      const lines = await this.wrapText(ctx, text, 440) || [text];

      // Draw each line
      const startX = 95;
      const startY = 420;
      const lineHeight = Math.floor(fontSize * 1.2);
      
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], startX, startY + (i * lineHeight));
      }

      // Save image
      const imageBuffer = canvas.toBuffer();
      await fs.writeFile(pathImg, imageBuffer);

      // Send result
      await message.reply({
        body: getText("done"),
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up
      fs.unlinkSync(pathImg);

    } catch (error) {
      console.error("Mark Error:", error);
      await message.reply(getText("error") + "\n" + error.message);
    }
  }
};
