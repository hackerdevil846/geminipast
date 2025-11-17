const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "date2",
    aliases: [],
    version: "2.0.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
      en: "Create couple ship images with your partner"
    },
    longDescription: {
      en: "Create romantic couple ship images with your partner"
    },
    guide: {
      en: "{p}date2 [@mention]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    const dirMaterial = __dirname + `/cache/canvas/`;
    const imagePath = path.resolve(__dirname, 'cache/canvas', 'joshua.png');
    
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(imagePath)) {
      try {
        const imageData = await axios.get("https://i.imgur.com/ha8gxu5.jpg", { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, Buffer.from(imageData.data));
      } catch (error) {
        console.error("Failed to download base image:", error);
      }
    }
  },

  onStart: async function ({ event, message, args }) {
    const { threadID, senderID } = event;
    
    if (!args[0]) {
      return message.reply("💢 Please mention a user to ship with!");
    }
    
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      return message.reply("❌ Invalid mention!");
    }
    
    const tag = event.mentions[mention].replace("@", "");
    const one = senderID, two = mention;

    try {
      const path = await makeImage({ one, two });
      return message.reply({
        body: `💕 Shipped with ${tag}!\nLove is in the air! 💞`,
        mentions: [{
          tag: tag,
          id: mention
        }],
        attachment: fs.createReadStream(path)
      }, () => fs.unlinkSync(path));
    } catch (error) {
      console.error("Image processing error:", error);
      return message.reply("❌ Error processing image!");
    }
  }
};

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache", "canvas");
  const batgiam_img = await jimp.read(__root + "/joshua.png");
  const pathImg = __root + `/ship_${one}_${two}.png`;
  const avatarOne = __root + `/avt_${one}.png`;
  const avatarTwo = __root + `/avt_${two}.png`;

  const getAvatar = async (id, path) => {
    try {
      const data = await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
        responseType: 'arraybuffer' 
      });
      fs.writeFileSync(path, Buffer.from(data.data, 'utf-8'));
    } catch (error) {
      console.error(`Failed to get avatar for ${id}:`, error);
      throw error;
    }
  };

  await Promise.all([
    getAvatar(one, avatarOne),
    getAvatar(two, avatarTwo)
  ]);

  const circleOne = await jimp.read(await circle(avatarOne));
  const circleTwo = await jimp.read(await circle(avatarTwo));
  
  batgiam_img.composite(circleOne.resize(110, 110), 150, 76)
             .composite(circleTwo.resize(100, 100), 238, 305);

  const raw = await batgiam_img.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);
  
  // Clean up temporary files
  if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
  if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
  
  return pathImg;
}

async function circle(image) {
  const img = await jimp.read(image);
  img.circle();
  return await img.getBufferAsync("image/png");
}
