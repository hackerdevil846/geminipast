module.exports = {
  config: {
    name: "tweet",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "🐦 𝖳𝗐𝗂𝗍𝗍𝖾𝗋 𝗌𝗍𝗒𝗅𝖾 𝗍𝖾𝗑𝗍 𝖼𝗋𝖾𝖺𝗍𝗈𝗋 𝗐𝗂𝗍𝗁 𝗂𝗆𝖺𝗀𝖾 🖼️"
    },
    longDescription: {
      en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖳𝗐𝗂𝗍𝗍𝖾𝗋-𝗌𝗍𝗒𝗅𝖾 𝗍𝖾𝗑𝗍 𝗂𝗆𝖺𝗀𝖾𝗌 𝗐𝗂𝗍𝗁 𝖼𝗎𝗌𝗍𝗈𝗆 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌"
    },
    guide: {
      en: "{p}tweet [𝗍𝖾𝗑𝗍]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  wrapText: function(ctx, text, maxWidth) {
    return new Promise(resolve => {
      try {
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
          if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
            line += `${words.shift()} `;
          } else {
            lines.push(line.trim());
            line = '';
          }
          if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
      } catch (error) {
        console.error("𝖶𝗋𝖺𝗉 𝗍𝖾𝗑𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
        return resolve([text]); // 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗍𝗈 𝗌𝗂𝗇𝗀𝗅𝖾 𝗅𝗂𝗇𝖾
      }
    });
  },

  onStart: async function({ message, event, args }) {
    try {
      // 𝖣𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒 𝖼𝗁𝖾𝖼𝗄
      let canvasAvailable = true;
      let axiosAvailable = true;
      let fsAvailable = true;
      
      try {
        require("canvas");
      } catch (e) {
        canvasAvailable = false;
      }
      
      try {
        require("axios");
      } catch (e) {
        axiosAvailable = false;
      }
      
      try {
        require("fs-extra");
      } catch (e) {
        fsAvailable = false;
      }

      if (!canvasAvailable || !axiosAvailable || !fsAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
      }

      const { loadImage, createCanvas, registerFont } = require("canvas");
      const fs = require("fs-extra");
      const axios = require("axios");

      const text = args.join(" ");
      if (!text) {
        return message.reply("❓ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗍𝖾𝗑𝗍 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝗐𝖾𝖾𝗍\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}tweet 𝖧𝖾𝗅𝗅𝗈 𝖳𝗐𝗂𝗍𝗍𝖾𝗋!");
      }

      // 𝖵𝖺𝗅𝗂𝖽𝖺𝗍𝖾 𝗍𝖾𝗑𝗍 𝗅𝖾𝗇𝗀𝗍𝗁
      if (text.length > 280) {
        return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 280 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 (𝖳𝗐𝗂𝗍𝗍𝖾𝗋 𝗅𝗂𝗆𝗂𝗍).");
      }

      // 𝖤𝗇𝗌𝗎𝗋𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖾𝗑𝗂𝗌𝗍𝗌
      const cacheDir = `${__dirname}/cache`;
      const pathImg = `${cacheDir}/tweet_${Date.now()}.png`;
      
      try {
        await fs.ensureDir(cacheDir);
      } catch (dirError) {
        console.error("𝖣𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", dirError);
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
      }

      const loadingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗍𝗐𝖾𝖾𝗍... 🐦");

      try {
        // 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾
        console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗍𝗐𝖾𝖾𝗍 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾...");
        const imageResponse = await axios.get("https://imgur.com/FcbMto5.jpeg", {
          responseType: "arraybuffer",
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        await fs.writeFile(pathImg, Buffer.from(imageResponse.data, "utf-8"));
        console.log("✅ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");

        // 𝖯𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾
        console.log("🎨 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾...");
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        
        // 𝖣𝗋𝖺𝗐 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // 𝖢𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖾 𝗍𝖾𝗑𝗍 𝗌𝗍𝗒𝗅𝗂𝗇𝗀
        ctx.font = "600 70px Arial, sans-serif";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";

        // 𝖠𝖽𝗃𝗎𝗌𝗍 𝖿𝗈𝗇𝗍 𝗌𝗂𝗓𝖾 𝗍𝗈 𝖿𝗂𝗍
        let fontSize = 70;
        const maxWidth = 1160;
        
        while (ctx.measureText(text).width > maxWidth && fontSize > 20) {
          fontSize--;
          ctx.font = `600 ${fontSize}px Arial, sans-serif`;
        }

        console.log(`📝 𝖴𝗌𝗂𝗇𝗀 𝖿𝗈𝗇𝗍 𝗌𝗂𝗓𝖾: ${fontSize}px`);

        // 𝖶𝗋𝖺𝗉 𝖺𝗇𝖽 𝖽𝗋𝖺𝗐 𝗍𝖾𝗑𝗍
        const lines = await this.wrapText(ctx, text, maxWidth);
        const lineHeight = fontSize + 15;
        const startY = 400;
        
        if (lines && lines.length) {
          console.log(`📄 𝖱𝖾𝗇𝖽𝖾𝗋𝗂𝗇𝗀 ${lines.length} 𝗅𝗂𝗇𝖾𝗌`);
          lines.forEach((line, index) => {
            ctx.fillText(line, 200, startY + index * lineHeight);
          });
        } else {
          console.log("📄 𝖱𝖾𝗇𝖽𝖾𝗋𝗂𝗇𝗀 𝗌𝗂𝗇𝗀𝗅𝖾 𝗅𝗂𝗇𝖾");
          ctx.fillText(text, 200, startY);
        }

        // 𝖲𝖺𝗏𝖾 𝗋𝖾𝗌𝗎𝗅𝗍
        console.log("💾 𝖲𝖺𝗏𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾...");
        const outputBuffer = canvas.toBuffer();
        await fs.writeFile(pathImg, outputBuffer);

        // 𝖴𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾
        try {
          await message.unsend(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
        }

        await message.reply({
          body: "✅ 𝖳𝗐𝖾𝖾𝗍 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒! 🐦\n\n𝖤𝗇𝗃𝗈𝗒 𝗒𝗈𝗎𝗋 𝖳𝗐𝗂𝗍𝗍𝖾𝗋 𝗌𝗍𝗒𝗅𝖾 𝗉𝗈𝗌𝗍!",
          attachment: fs.createReadStream(pathImg)
        });

        console.log("✅ 𝖳𝗐𝖾𝖾𝗍 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");

      } catch (imageError) {
        console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", imageError);
        
        // 𝖴𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾
        try {
          await message.unsend(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
        }
        
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝗐𝖾𝖾𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
      }

      // 𝖢𝗅𝖾𝖺𝗇 𝗎𝗉
      try {
        if (await fs.pathExists(pathImg)) {
          await fs.unlink(pathImg);
          console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
        }
      } catch (cleanupError) {
        console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
      }

    } catch (error) {
      console.error("💥 𝖳𝗐𝖾𝖾𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
      
      let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗍𝗐𝖾𝖾𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
      } else if (error.message.includes('canvas')) {
        errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
      }
      
      await message.reply(errorMessage);
    }
  }
};
