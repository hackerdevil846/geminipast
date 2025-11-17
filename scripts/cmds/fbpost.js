const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "fbpost",
    aliases: ["fakepost", "facebookfake"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-image",
    shortDescription: {
      en: "✨ 𝐶𝑟𝑒𝑎𝑡𝑒 𝑓𝑎𝑘𝑒 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑝𝑜𝑠𝑡𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑟𝑒𝑎𝑙𝑖𝑠𝑡𝑖𝑐 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑝𝑜𝑠𝑡𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 𝑎𝑛𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}fbpost [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      const text = args.join(" ");

      if (!text) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑜𝑠𝑡!\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑓𝑏𝑝𝑜𝑠𝑡 𝐻𝑒𝑙𝑙𝑜 𝑤𝑜𝑟𝑙𝑑");
      }

      // Get user info
      const userInfo = await api.getUserInfo(senderID);
      const userName = userInfo[senderID].name;
      const avatarUrl = userInfo[senderID].thumbSrc;

      // Paths for cache files
      const avatarPath = __dirname + '/cache/avt.png';
      const outputPath = __dirname + '/cache/fbpost.png';
      const templateUrl = "https://i.imgur.com/VrcriZF.jpg";

      // Download avatar and template
      const [avatarResponse, templateResponse] = await Promise.all([
        axios.get(avatarUrl, { responseType: 'arraybuffer' }),
        axios.get(templateUrl, { responseType: 'arraybuffer' })
      ]);

      // Save files to cache
      await Promise.all([
        fs.writeFile(avatarPath, Buffer.from(avatarResponse.data, 'utf-8')),
        fs.writeFile(outputPath, Buffer.from(templateResponse.data, 'utf-8'))
      ]);

      // Process avatar to circle
      const roundedAvatar = await circle(await fs.readFile(avatarPath));
      await fs.writeFile(avatarPath, roundedAvatar);

      // Load images
      const [avatarImage, templateImage] = await Promise.all([
        loadImage(roundedAvatar),
        loadImage(await fs.readFile(outputPath))
      ]);

      // Create canvas
      const canvas = createCanvas(templateImage.width, templateImage.height);
      const ctx = canvas.getContext("2d");

      // Draw template background
      ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);

      // Draw circular avatar
      ctx.drawImage(avatarImage, 17, 17, 104, 104);

      // Draw username
      ctx.font = "600 32px Sans-Serif";
      ctx.fillStyle = "#000000";
      ctx.fillText(userName, 130, 55);

      // Draw post text with wrapping
      ctx.font = "500 45px Arial";
      let fontSize = 250;
      
      // Adjust font size if text is too long
      while (ctx.measureText(text).width > 2600 && fontSize > 20) {
        fontSize--;
        ctx.font = `500 ${fontSize}px Arial`;
      }

      const lines = await wrapText(ctx, text, 650);
      ctx.fillText(lines.join('\n'), 17, 180);

      // Save the result
      const resultBuffer = canvas.toBuffer();
      await fs.writeFile(outputPath, resultBuffer);

      // Send the result
      await message.reply({
        body: "✅ 𝑌𝑜𝑢𝑟 𝑓𝑎𝑘𝑒 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑝𝑜𝑠𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑐𝑟𝑒𝑎𝑡𝑒𝑑!",
        attachment: fs.createReadStream(outputPath)
      });

      // Clean up cache files
      await Promise.all([
        fs.unlink(avatarPath).catch(() => {}),
        fs.unlink(outputPath).catch(() => {})
      ]);

    } catch (error) {
      console.error("𝐹𝐵𝑃𝑜𝑠𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑝𝑜𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};

// Helper function to create circular avatar
async function circle(imageBuffer) {
  const image = await jimp.read(imageBuffer);
  image.circle();
  return await image.getBufferAsync("image/png");
}

// Helper function to wrap text
async function wrapText(ctx, text, maxWidth) {
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
}
