const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "hug",
    aliases: [],
    version: "3.1.1",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "Send a hug with profile pictures"
    },
    longDescription: {
      en: "Create a hug image with mentioned users"
    },
    guide: {
      en: "{p}hug [@mention]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    const { resolve } = require("path");
    const { existsSync, mkdirSync } = require("fs-extra");
    const dirMaterial = __dirname + `/cache/canvas/`;
    const canvasPath = resolve(__dirname, 'cache/canvas', 'hugv1.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(canvasPath)) {
      try {
        const { data } = await axios.get("https://i.ibb.co/3YN3T1r/q1y28eqblsr21.jpg", { responseType: "arraybuffer" });
        fs.writeFileSync(canvasPath, Buffer.from(data, 'utf-8'));
      } catch (error) {
        console.error("Failed to download hug image:", error);
      }
    }
  },

  onStart: async function ({ event, args, message }) {
    try {
      const { senderID } = event;
      const mention = Object.keys(event.mentions);
      
      if (!mention[0]) {
        return message.reply("❌ Please mention someone to hug!");
      }
      
      const one = senderID;
      const two = mention[0];
      const __root = path.resolve(__dirname, "cache", "canvas");

      let hug_img = await jimp.read(__root + "/hugv1.png");
      let pathImg = __root + `/hug_${one}_${two}.png`;
      let avatarOne = __root + `/avt_${one}.png`;
      let avatarTwo = __root + `/avt_${two}.png`;
      
      const getAvatar = async (uid, path) => {
        try {
          const { data } = await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
          fs.writeFileSync(path, Buffer.from(data, 'utf-8'));
        } catch (error) {
          console.error("Failed to get avatar:", error);
          throw error;
        }
      };

      await Promise.all([
        getAvatar(one, avatarOne),
        getAvatar(two, avatarTwo)
      ]);

      const circle = async (imagePath) => {
        const image = await jimp.read(imagePath);
        image.circle();
        return await image.getBufferAsync("image/png");
      };

      const [circleOne, circleTwo] = await Promise.all([
        circle(avatarOne),
        circle(avatarTwo)
      ]);

      hug_img.composite(await jimp.read(circleOne), 320, 100)
             .composite(await jimp.read(circleTwo), 280, 280);
      
      await hug_img.writeAsync(pathImg);
      
      await message.reply({
        body: `💖 Sending a hug!\n${event.mentions[two].replace('@', '')} ← ${event.senderID.replace('@', '')}`,
        attachment: fs.createReadStream(pathImg)
      });

      // Clean up temporary files
      fs.unlinkSync(pathImg);
      fs.unlinkSync(avatarOne);
      fs.unlinkSync(avatarTwo);

    } catch (error) {
      console.error("Hug command error:", error);
      return message.reply("❌ An error occurred while creating the hug image!");
    }
  }
};
