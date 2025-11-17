const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "hug2b",
    aliases: [],
    version: "3.1.1",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
      en: "Give someone a hug"
    },
    longDescription: {
      en: "Send a cute hug image to someone"
    },
    guide: {
      en: "{p}hug2b [@mention]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    const { existsSync, mkdirSync } = fs;
    const dirMaterial = path.join(__dirname, 'cache', 'canvas');
    const filePath = path.join(dirMaterial, 'hugv1.png');
    
    if (!existsSync(dirMaterial)) {
      mkdirSync(dirMaterial, { recursive: true });
    }
    
    if (!existsSync(filePath)) {
      try {
        const imageData = await axios.get("https://i.ibb.co/3YN3T1r/q1y28eqblsr21.jpg", { 
          responseType: 'arraybuffer' 
        });
        await fs.writeFile(filePath, Buffer.from(imageData.data));
      } catch (error) {
        console.error("Failed to download hug image:", error);
      }
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const { senderID } = event;
      const mention = Object.keys(event.mentions);
      
      if (!mention[0]) {
        return message.reply("❌ Please mention someone to hug! 🥺");
      }

      async function circle(imageBuffer) {
        const image = await jimp.read(imageBuffer);
        image.circle();
        return await image.getBufferAsync("image/png");
      }

      async function makeImage(one, two) {
        const __root = path.join(__dirname, "cache", "canvas");
        const batgiam_img = await jimp.read(path.join(__root, "hugv1.png"));
        const pathImg = path.join(__root, `hug_${one}_${two}.png`);
        const avatarOne = path.join(__root, `avt_${one}.png`);
        const avatarTwo = path.join(__root, `avt_${two}.png`);
        
        // Get first user avatar
        const getAvatarOne = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
          responseType: 'arraybuffer' 
        });
        await fs.writeFile(avatarOne, Buffer.from(getAvatarOne.data));
        
        // Get second user avatar
        const getAvatarTwo = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
          responseType: 'arraybuffer' 
        });
        await fs.writeFile(avatarTwo, Buffer.from(getAvatarTwo.data));
        
        // Create circular avatars
        const circleOne = await jimp.read(await circle(await fs.readFile(avatarOne)));
        const circleTwo = await jimp.read(await circle(await fs.readFile(avatarTwo)));
        
        // Composite images
        batgiam_img.composite(circleOne.resize(150, 150), 320, 100)
                   .composite(circleTwo.resize(130, 130), 280, 280);
        
        // Save final image
        const raw = await batgiam_img.getBufferAsync("image/png");
        await fs.writeFile(pathImg, raw);
        
        // Clean up temporary files
        await fs.unlink(avatarOne);
        await fs.unlink(avatarTwo);
        
        return pathImg;
      }

      const one = senderID;
      const two = mention[0];
      
      const imagePath = await makeImage(one, two);
      
      await message.reply({ 
        body: `💖 Nice Hug! ${event.mentions[two]} 🥰`,
        mentions: [{
          tag: event.mentions[two],
          id: two
        }],
        attachment: fs.createReadStream(imagePath) 
      });
      
      // Clean up final image
      await fs.unlink(imagePath);
      
    } catch (error) {
      console.error("Hug command error:", error);
      await message.reply("❌ Oops! Something went wrong. Please try again later! 😿");
    }
  }
};
