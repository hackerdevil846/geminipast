const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");
const path = require("path");

module.exports = {
  config: {
    name: "toilet",
    aliases: ["wc", "restroom"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🚽 𝑇𝑜𝑖𝑙𝑒𝑡 𝑓𝑢𝑛 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑡𝑜𝑖𝑙𝑒𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
      en: "{p}toilet @𝑡𝑎𝑔"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    const dirMaterial = __dirname + "/cache/";
    const templatePath = path.join(__dirname, "cache", "toilet.png");

    if (!fs.existsSync(dirMaterial)) {
      fs.mkdirSync(dirMaterial, { recursive: true });
    }

    if (!fs.existsSync(templatePath)) {
      try {
        const response = await axios({
          method: 'GET',
          url: 'https://i.imgur.com/BtSlsSS.jpg',
          responseType: 'stream'
        });
        
        const writer = fs.createWriteStream(templatePath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      } catch (error) {
        console.error("Failed to download toilet template:", error);
      }
    }
  },

  onStart: async function ({ event, api, message, args }) {
    try {
      const { threadID, messageID, senderID, mentions } = event;
      const tagged = Object.keys(mentions);

      if (!tagged.length) {
        return message.reply("🚽 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑝𝑢𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑡𝑜𝑖𝑙𝑒𝑡!");
      }

      const one = senderID;
      const two = tagged[0];

      // Show processing message
      const processingMsg = await message.reply("🔄 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡𝑜𝑖𝑙𝑒𝑡 𝑖𝑚𝑎𝑔𝑒, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...");

      const imagePath = await this.makeImage({ one, two });
      
      await message.reply({
        attachment: fs.createReadStream(imagePath),
        body: "🚽 𝑇𝑜𝑖𝑙𝑒𝑡 𝑡𝑖𝑚𝑒! 💩"
      });

      // Clean up
      fs.unlinkSync(imagePath);
      api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error("Toilet command error:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡𝑜𝑖𝑙𝑒𝑡 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  },

  makeImage: async function ({ one, two }) {
    const cacheDir = path.resolve(__dirname, "cache");
    const baseImg = await jimp.read(path.join(cacheDir, "toilet.png"));
    const outPath = path.join(cacheDir, `toilet_${one}_${two}.png`);

    const avatarOnePath = path.join(cacheDir, `avt_${one}.png`);
    const avatarTwoPath = path.join(cacheDir, `avt_${two}.png`);

    try {
      // Download avatars
      const [avatarOneData, avatarTwoData] = await Promise.all([
        axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
          { responseType: "arraybuffer" }),
        axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
          { responseType: "arraybuffer" })
      ]);

      fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneData.data, "utf-8"));
      fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoData.data, "utf-8"));

      // Make circular avatars
      const circleOne = await jimp.read(await this.circle(avatarOnePath));
      const circleTwo = await jimp.read(await this.circle(avatarTwoPath));

      // Composite onto template
      baseImg
        .resize(292, 345)
        .composite(circleOne.resize(70, 70), 100, 200)
        .composite(circleTwo.resize(70, 70), 100, 200);

      // Save image
      const buffer = await baseImg.getBufferAsync("image/png");
      fs.writeFileSync(outPath, buffer);

      // Clean up temp avatar files
      fs.unlinkSync(avatarOnePath);
      fs.unlinkSync(avatarTwoPath);

      return outPath;

    } catch (error) {
      // Clean up on error
      if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
      if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);
      throw error;
    }
  },

  circle: async function (imagePath) {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
  }
};
