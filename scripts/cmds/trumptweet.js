const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "trumptweet",
    aliases: ["trumptw", "donaldtweet"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "image",
    shortDescription: {
      en: "🇺🇸 𝐶𝑟𝑒𝑎𝑡𝑒 𝑟𝑒𝑎𝑙𝑖𝑠𝑡𝑖𝑐 𝑇𝑟𝑢𝑚𝑝-𝑠𝑡𝑦𝑙𝑒 𝑡𝑤𝑒𝑒𝑡𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑟𝑒𝑎𝑙𝑖𝑠𝑡𝑖𝑐-𝑙𝑜𝑜𝑘𝑖𝑛𝑔 𝑇𝑟𝑢𝑚𝑝 𝑡𝑤𝑒𝑒𝑡𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}trumptweet [𝑡𝑤𝑒𝑒𝑡 𝑡𝑒𝑥𝑡]"
    },
    countDown: 15,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      await message.reply("🇺🇸 𝑇𝑟𝑢𝑚𝑝 𝑇𝑤𝑒𝑒𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑟𝑒𝑎𝑑𝑦! 𝑈𝑠𝑒 '𝑡𝑟𝑢𝑚𝑝𝑡𝑤𝑒𝑒𝑡 [𝑡𝑒𝑥𝑡]' 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑟𝑒𝑠𝑖𝑑𝑒𝑛𝑡𝑖𝑎𝑙 𝑡𝑤𝑒𝑒𝑡𝑠");
    } catch (error) {
      console.error("Error in onStart:", error);
    }
  },

  wrapText: async function (ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width <= maxWidth) return resolve([text]);
      
      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + " " + word;
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      
      lines.push(currentLine);
      resolve(lines);
    });
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID } = event;
      const text = args.join(" ");

      if (!text) {
        return message.reply("✍️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑇𝑟𝑢𝑚𝑝'𝑠 𝑡𝑤𝑒𝑒𝑡\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑡𝑟𝑢𝑚𝑝𝑡𝑤𝑒𝑒𝑡 𝑀𝑎𝑘𝑒 𝐴𝑚𝑒𝑟𝑖𝑐𝑎 𝐺𝑟𝑒𝑎𝑡 𝐴𝑔𝑎𝑖𝑛!");
      }

      const cacheDir = path.join(__dirname, "cache", "trump_tweets");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const processingMsg = await message.reply("🔄 𝑃𝑟𝑒𝑠𝑖𝑑𝑒𝑛𝑡 𝑇𝑟𝑢𝑚𝑝 𝑖𝑠 𝑡𝑦𝑝𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑡𝑤𝑒𝑒𝑡...");

      const templateUrl = "https://i.imgur.com/ZtWfHHx.png";
      const templatePath = path.join(cacheDir, "template.png");
      
      try {
        const templateResponse = await axios.get(templateUrl, { 
          responseType: "arraybuffer",
          timeout: 30000
        });
        fs.writeFileSync(templatePath, Buffer.from(templateResponse.data));
      } catch (error) {
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        return;
      }

      try {
        const baseImage = await loadImage(templatePath);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Tweet text styling
        let fontSize = 45;
        ctx.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
        ctx.fillStyle = "#14171a";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";

        const maxWidth = 1160;
        while (ctx.measureText(text).width > maxWidth && fontSize > 24) {
          fontSize -= 1;
          ctx.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
        }

        const lines = await this.wrapText(ctx, text, maxWidth);
        const lineHeight = fontSize * 1.4;
        const startY = 165;

        lines.forEach((line, idx) => {
          ctx.fillText(line, 60, startY + idx * lineHeight);
        });

        // Header
        ctx.fillStyle = "#1da1f2";
        ctx.font = "bold 32px Arial";
        ctx.fillText("Donald J. Trump", 60, 100);
        ctx.fillStyle = "#657786";
        ctx.font = "28px Arial";
        ctx.fillText("@realDonaldTrump · 1h", 250, 105);

        // Engagement metrics
        const metricsY = startY + lines.length * lineHeight + 50;
        ctx.fillStyle = "#657786";
        ctx.font = "28px Arial";
        ctx.fillText("12.3K", 60, metricsY);
        ctx.fillText("Retweets", 120, metricsY);
        ctx.fillText("1.2K", 260, metricsY);
        ctx.fillText("Quote Tweets", 320, metricsY);
        ctx.fillText("5.6K", 480, metricsY);
        ctx.fillText("Likes", 540, metricsY);

        // Save and send
        const outputPath = path.join(cacheDir, `trump_tweet_${Date.now()}.png`);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(outputPath, buffer);

        await message.reply({
          body: "🇺🇸 𝑃𝑟𝑒𝑠𝑖𝑑𝑒𝑛𝑡𝑖𝑎𝑙 𝑇𝑤𝑒𝑒𝑡:",
          attachment: fs.createReadStream(outputPath)
        });

        // Cleanup
        fs.unlinkSync(templatePath);
        fs.unlinkSync(outputPath);
        api.unsendMessage(processingMsg.messageID);

      } catch (error) {
        console.error("Canvas Error:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡𝑤𝑒𝑒𝑡. 𝐸𝑟𝑟𝑜𝑟: " + error.message);
        
        // Cleanup on error
        if (fs.existsSync(templatePath)) fs.unlinkSync(templatePath);
      }

    } catch (error) {
      console.error("Trump Command Error:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡𝑤𝑒𝑒𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
