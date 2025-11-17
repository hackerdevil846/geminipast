const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "couplephoto",
    aliases: ["coupleframe", "lovetogether"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "📸 𝑇𝑎𝑘𝑒 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑝ℎ𝑜𝑡𝑜 𝑤𝑖𝑡ℎ 𝑠𝑜𝑚𝑒𝑜𝑛𝑒"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑐𝑜𝑢𝑝𝑙𝑒 𝑝ℎ𝑜𝑡𝑜 𝑤𝑖𝑡ℎ 𝑎 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
      en: "{p}couplephoto @𝑡𝑎𝑔"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "jimp": "",
      "path": ""
    }
  },

  onStart: async function({ message, event, usersData }) {
    try {
      const { senderID, mentions } = event;
      const mention = Object.keys(mentions);
      
      if (!mention[0]) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑜𝑛𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑡𝑜 𝑡𝑎𝑘𝑒 𝑎 𝑝ℎ𝑜𝑡𝑜 𝑤𝑖𝑡ℎ. 📸");
      }

      const one = senderID;
      const two = mention[0];
      
      // Create cache directory
      const dirMaterial = path.join(__dirname, 'cache', 'canvas');
      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
      }

      const templatePath = path.join(dirMaterial, "couple_template.png");
      
      // Download template if it doesn't exist
      if (!fs.existsSync(templatePath)) {
        try {
          const { data } = await axios.get("https://i.imgur.com/BJVyOkq.jpg", {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(templatePath, Buffer.from(data, 'binary'));
        } catch (error) {
          return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒!");
        }
      }

      const pathImg = path.join(dirMaterial, `couple_photo_${one}_${two}.png`);
      const avatarOne = path.join(dirMaterial, `avatar_${one}.png`);
      const avatarTwo = path.join(dirMaterial, `avatar_${two}.png`);
      
      // Download avatars
      try {
        const getAvatarOne = await axios.get(`https://graph.facebook.com/${one}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
          responseType: 'arraybuffer'
        });
        fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'binary'));
        
        const getAvatarTwo = await axios.get(`https://graph.facebook.com/${two}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
          responseType: 'arraybuffer'
        });
        fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'binary'));
      } catch (error) {
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠!");
      }

      // Process images
      try {
        const couplePhoto = await jimp.read(templatePath);
        
        // Helper function to create circular avatars
        async function circleAvatar(avatarPath) {
          try {
            const image = await jimp.read(avatarPath);
            image.circle();
            return image;
          } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑖𝑟𝑐𝑙𝑒 𝑎𝑣𝑎𝑡𝑎𝑟:", error);
            const defaultAvatar = await jimp.create(102, 102, 0x808080ff);
            defaultAvatar.circle();
            return defaultAvatar;
          }
        }

        const circleOne = await circleAvatar(avatarOne);
        const circleTwo = await circleAvatar(avatarTwo);
        
        couplePhoto.composite(circleOne.resize(102, 102), 430, 100)
                  .composite(circleTwo.resize(102, 102), 520, 155);
        
        await couplePhoto.writeAsync(pathImg);
        
        await message.reply({
          body: "📸 𝑊𝑒 𝑡𝑜𝑜𝑘 𝑎 𝑝ℎ𝑜𝑡𝑜 𝑡𝑜𝑔𝑒𝑡ℎ𝑒𝑟! ♥",
          attachment: fs.createReadStream(pathImg)
        });
        
        // Clean up temporary files
        setTimeout(() => {
          [avatarOne, avatarTwo, pathImg].forEach(file => {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
        }, 5000);
        
      } catch (error) {
        console.error("𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒𝑠!");
      }
      
    } catch (error) {
      console.error("𝐶𝑜𝑢𝑝𝑙𝑒 𝑝ℎ𝑜𝑡𝑜 𝑒𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑢𝑝𝑙𝑒 𝑝ℎ𝑜𝑡𝑜!");
    }
  }
};
