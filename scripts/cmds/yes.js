const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "yes",
    aliases: [],
    version: "3.2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Board text creator"
    },
    longDescription: {
      en: "Create text on white board template"
    },
    category: "memes",
    guide: {
      en: "{p}yes [text]"
    }
  },

  wrapText: async function (ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    for (let word of words) {
      const testLine = line + word + " ";
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && line !== "") {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = testLine;
      }
    }

    if (line.trim()) lines.push(line.trim());

    return lines;
  },

  onStart: async function ({ message, args }) {
    try {
      const pathImg = __dirname + "/cache/yes.png";
      const text = args.join(" ");

      if (!text) return message.reply("❔ | Please provide text!");

      // Load template image
      const imageBuffer = (await axios.get(
        "https://i.ibb.co/GQbRhkY/Picsart-22-08-14-17-32-11-488.jpg",
        { responseType: "arraybuffer" }
      )).data;

      fs.writeFileSync(pathImg, Buffer.from(imageBuffer));

      const baseImage = await loadImage(pathImg);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Initial font
      let fontSize = 45;
      ctx.font = `${fontSize}px Arial`;

      // Adjust dynamic font size
      while (ctx.measureText(text).width > 350) {
        fontSize--;
        ctx.font = `${fontSize}px Arial`;
      }

      // Wrap text
      const lines = await this.wrapText(ctx, text, 350);

      ctx.fillStyle = "black";
      ctx.textAlign = "start";
      ctx.font = `${fontSize}px Arial`;

      // Draw text on the board
      let y = 90;
      for (let line of lines) {
        ctx.fillText(line, 280, y);
        y += fontSize + 10;
      }

      const finalImg = canvas.toBuffer();
      fs.writeFileSync(pathImg, finalImg);

      await message.reply({
        attachment: fs.createReadStream(pathImg)
      });

      fs.unlinkSync(pathImg);

    } catch (err) {
      console.error("YES command error:", err);
      message.reply("❌ Error creating the board image.");
    }
  }
};
