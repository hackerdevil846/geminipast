const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "hugv2",
    aliases: [],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🤗 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑎 𝑓𝑟𝑖𝑒𝑛𝑑 𝑡𝑜 𝑔𝑖𝑣𝑒 𝑡ℎ𝑒𝑚 𝑎 𝑤𝑎𝑟𝑚 ℎ𝑢𝑔! 💖"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑐𝑢𝑠𝑡𝑜𝑚 ℎ𝑢𝑔 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
      en: "{p}hugv2 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  langs: {
    "en": {
      "missingMention": "🌸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 ℎ𝑢𝑔! 🥺"
    }
  },

  onLoad: async function() {
    const { existsSync, mkdirSync } = fs;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const filePath = path.resolve(__dirname, 'cache/canvas', 'hugv2.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(filePath)) {
      try {
        const { data } = await axios.get("https://i.ibb.co/zRdZJzG/1626342271-28-kartinkin-com-p-anime-obnimashki-v-posteli-anime-krasivo-30.jpg", { 
          responseType: 'arraybuffer' 
        });
        await fs.writeFileSync(filePath, Buffer.from(data, 'binary'));
      } catch (error) {
        console.error("Failed to download base image:", error);
      }
    }
  },

  onStart: async function({ message, event, args, usersData, getLang }) {
    try {
      const { threadID, messageID, senderID } = event;
      const { readFileSync, unlinkSync, writeFileSync } = fs;

      const mention = Object.keys(event.mentions);
      if (!mention[0]) return message.reply(getLang("missingMention"));

      const one = senderID, two = mention[0];
      const avatarOne = path.resolve(__dirname, 'cache/canvas', `avt_${one}.png`);
      const avatarTwo = path.resolve(__dirname, 'cache/canvas', `avt_${two}.png`);
      const pathImg = path.resolve(__dirname, 'cache/canvas', `hug_${one}_${two}.png`);

      async function circle(image) {
        const img = await jimp.read(image);
        img.circle();
        return await img.getBufferAsync("image/png");
      }

      const [getAvatarOne, getAvatarTwo] = await Promise.all([
        axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
        axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })
      ]);

      await writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'binary'));
      await writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'binary'));

      const baseImage = await jimp.read(path.resolve(__dirname, 'cache/canvas', 'hugv2.png'));
      const circleOne = await jimp.read(await circle(avatarOne));
      const circleTwo = await jimp.read(await circle(avatarTwo));

      baseImage.composite(circleOne.resize(100, 100), 370, 40)
               .composite(circleTwo.resize(100, 100), 330, 150);

      const raw = await baseImage.getBufferAsync("image/png");
      await writeFileSync(pathImg, raw);

      const userName = await usersData.getName(one);
      const mentionedName = event.mentions[two].replace(/@/g, "");

      await message.reply({
        body: `💕 ${mentionedName} 𝑌𝑜𝑢 𝑔𝑜𝑡 𝑎 𝑤𝑎𝑟𝑚 ℎ𝑢𝑔 𝑓𝑟𝑜𝑚 ${userName}! 🤗`,
        attachment: readFileSync(pathImg)
      });

      unlinkSync(pathImg);
      unlinkSync(avatarOne);
      unlinkSync(avatarTwo);

    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 ℎ𝑢𝑔𝑣2 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
      message.reply("🌸 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 ℎ𝑢𝑔! 🥺");
    }
  }
};
