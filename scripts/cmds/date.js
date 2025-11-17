const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "date",
    aliases: ["romance", "lovemerge"],
    version: "2.0.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "💑 Merge profiles for romantic image"
    },
    longDescription: {
      en: "Creates a romantic merged image with mentioned user"
    },
    guide: {
      en: "{p}date [@mention]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    const { resolve } = path;
    const { existsSync, mkdirSync } = fs;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const pathToImg = resolve(__dirname, 'cache/canvas', 'josh.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(pathToImg)) {
      try {
        const imageData = await axios.get("https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg", { 
          responseType: 'arraybuffer' 
        });
        await fs.writeFileSync(pathToImg, Buffer.from(imageData.data));
      } catch (error) {
        console.error("Failed to download base image:", error);
      }
    }
  },

  onStart: async function ({ event, api, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      const mention = Object.keys(event.mentions)[0];
      
      if (!mention) {
        return message.reply("❌ Please mention someone to create a romantic image with!");
      }
      
      const one = senderID;
      const two = mention;
      const tag = event.mentions[mention].replace("@", "");
      
      await message.reply("⏳ Creating your romantic image...");
      
      const imagePath = await makeImage({ one, two });
      
      await message.reply({
        body: `💖 Romantic image created! 💑\n\n✨ Mentioned: @${tag}`,
        mentions: [{
          tag: tag,
          id: mention
        }],
        attachment: fs.createReadStream(imagePath)
      });

      // Clean up the generated image after sending
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    } catch (error) {
      console.error("Date command error:", error);
      message.reply("❌ Failed to create romantic image. Please try again later.");
    }
  }
};

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache", "canvas");
  const pathImg = __root + `/ship_${one}_${two}.png`;
  const avatarOne = __root + `/avt_${one}.png`;
  const avatarTwo = __root + `/avt_${two}.png`;

  try {
    const [getAvatarOne, getAvatarTwo] = await Promise.all([
      axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
        responseType: 'arraybuffer' 
      }),
      axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
        responseType: 'arraybuffer' 
      })
    ]);

    await fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'utf-8'));
    await fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'utf-8'));

    const baseImage = await jimp.read(__root + "/josh.png");
    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));

    baseImage.composite(circleOne.resize(85, 85), 355, 100)
             .composite(circleTwo.resize(75, 75), 250, 140);

    const imageBuffer = await baseImage.getBufferAsync("image/png");
    await fs.writeFileSync(pathImg, imageBuffer);
    
    // Clean up temporary avatar files
    if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
    if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
    
    return pathImg;
  } catch (error) {
    console.error("Error creating image:", error);
    throw error;
  }
}

async function circle(imagePath) {
  try {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
  } catch (error) {
    console.error("Error creating circular image:", error);
    throw error;
  }
}
