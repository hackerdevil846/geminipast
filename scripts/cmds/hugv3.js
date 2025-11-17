const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "hugv3",
    aliases: [],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🥰 | 𝐻𝑢𝑔 𝑎 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑓𝑟𝑖𝑒𝑛𝑑"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑 𝑎 ℎ𝑢𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    guide: {
      en: "{p}hugv3 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
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
    const dirMaterial = __dirname + `/cache/canvas/`;
    const filePath = __dirname + '/cache/canvas/hugv3.png';
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(filePath)) {
      try {
        const imageData = await axios.get("https://i.imgur.com/7lPqHjw.jpg", { responseType: 'arraybuffer' });
        await fs.writeFileSync(filePath, Buffer.from(imageData.data));
      } catch (error) {
        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ℎ𝑢𝑔 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒:", error);
      }
    }
  },

  onStart: async function({ message, event, args, usersData }) {
    try {
      const { threadID, messageID, senderID } = event;
      const mention = Object.keys(event.mentions);
      
      if (!mention[0]) {
        return message.reply("💔 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑎 𝑓𝑟𝑖𝑒𝑛𝑑 𝑡𝑜 ℎ𝑢𝑔 🥺");
      }
      
      async function circle(image) {
        const img = await jimp.read(image);
        img.circle();
        return await img.getBufferAsync("image/png");
      }

      async function makeImage(one, two) {
        const __root = path.resolve(__dirname, "cache", "canvas");
        const batgiam_img = await jimp.read(__root + "/hugv3.png");
        const pathImg = __root + `/hugv3_${one}_${two}.png`;
        const avatarOne = __root + `/avt_${one}.png`;
        const avatarTwo = __root + `/avt_${two}.png`;
        
        const getAvatar = async (uid, path) => {
          try {
            const response = await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
            await fs.writeFileSync(path, Buffer.from(response.data, 'utf-8'));
          } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑎𝑣𝑎𝑡𝑎𝑟:", error);
          }
        };

        await Promise.all([
          getAvatar(one, avatarOne),
          getAvatar(two, avatarTwo)
        ]);

        const circleOne = await jimp.read(await circle(avatarOne));
        const circleTwo = await jimp.read(await circle(avatarTwo));
        
        batgiam_img.composite(circleOne.resize(220, 220), 200, 50)
                  .composite(circleTwo.resize(220, 220), 490, 200);
        
        const raw = await batgiam_img.getBufferAsync("image/png");
        await fs.writeFileSync(pathImg, raw);
        
        // Clean up temporary avatar files
        if (fs.existsSync(avatarOne)) await fs.unlinkSync(avatarOne);
        if (fs.existsSync(avatarTwo)) await fs.unlinkSync(avatarTwo);
        
        return pathImg;
      }

      const pathImg = await makeImage(senderID, mention[0]);
      
      const userName = await usersData.getName(senderID);
      const mentionedName = await usersData.getName(mention[0]);
      
      await message.reply({
        body: `🥰 | ${userName} 𝐠𝐚𝐯𝐞 ${mentionedName} 𝐚 𝐰𝐚𝐫𝐦 𝐡𝐮𝐠! 🤗`,
        attachment: fs.createReadStream(pathImg)
      });
      
      // Clean up generated image
      if (fs.existsSync(pathImg)) await fs.unlinkSync(pathImg);
      
    } catch (error) {
      console.error("𝐻𝑢𝑔𝑣3 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒");
    }
  }
};
