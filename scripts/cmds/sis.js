const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "sis",
    aliases: ["bhaibon"],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "image",
    shortDescription: {
      en: "🎨 𝐶𝑟𝑒𝑎𝑡𝑒 𝑏𝑟𝑜𝑡ℎ𝑒𝑟-𝑠𝑖𝑠𝑡𝑒𝑟 𝑝𝑎𝑖𝑟 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑐𝑢𝑠𝑡𝑜𝑚 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑎𝑛𝑑 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑎𝑠 𝑏𝑟𝑜𝑡ℎ𝑒𝑟-𝑠𝑖𝑠𝑡𝑒𝑟 𝑝𝑎𝑖𝑟"
    },
    guide: {
      en: "{p}sis [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    const dirMaterial = __dirname + `/cache/canvas/`;
    const pathFile = path.resolve(__dirname, 'cache', 'canvas', 'sis.png');

    if (!fs.existsSync(dirMaterial)) {
      fs.mkdirSync(dirMaterial, { recursive: true });
    }

    if (!fs.existsSync(pathFile)) {
      try {
        const response = await axios({
          method: 'GET',
          url: "https://i.imgur.com/n2FGJFe.jpg",
          responseType: 'stream'
        });
        const writer = fs.createWriteStream(pathFile);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      } catch (err) {
        console.error("Failed to download sis.png:", err);
      }
    }
  },

  onStart: async function ({ event, api, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      const mentions = Object.keys(event.mentions || {});

      if (!mentions[0]) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑝𝑎𝑖𝑟!");
      }

      const one = senderID;
      const two = mentions[0];

      async function circle(imageBuffer) {
        const image = await jimp.read(imageBuffer);
        image.circle();
        return await image.getBufferAsync("image/png");
      }

      async function makeImage({ one, two }) {
        const __root = path.resolve(__dirname, "cache", "canvas");
        const templatePath = __root + "/sis.png";
        
        if (!fs.existsSync(templatePath)) {
          throw new Error("𝑇𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }

        const baseImg = await jimp.read(templatePath);
        const pathImg = __root + `/batman${one}_${two}.png`;
        const avatarOne = __root + `/avt_${one}.png`;
        const avatarTwo = __root + `/avt_${two}.png`;

        try {
          const [resOne, resTwo] = await Promise.all([
            axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
              responseType: 'arraybuffer' 
            }),
            axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
              responseType: 'arraybuffer' 
            })
          ]);

          fs.writeFileSync(avatarOne, Buffer.from(resOne.data));
          fs.writeFileSync(avatarTwo, Buffer.from(resTwo.data));

          const [circleOne, circleTwo] = await Promise.all([
            jimp.read(await circle(fs.readFileSync(avatarOne))),
            jimp.read(await circle(fs.readFileSync(avatarTwo)))
          ]);

          baseImg.composite(circleOne.resize(191, 191), 93, 111)
                 .composite(circleTwo.resize(190, 190), 434, 107);

          const raw = await baseImg.getBufferAsync("image/png");
          fs.writeFileSync(pathImg, raw);

        } finally {
          if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
          if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
        }

        return pathImg;
      }

      const imagePath = await makeImage({ one, two });
      const messageBody = "✧•❁𝐵𝑟𝑜𝑡ℎ𝑒𝑟-𝑆𝑖𝑠𝑡𝑒𝑟❁•✧\n\n╔═══❖••° °••❖═══╗\n\n   𝑆𝑎𝑓𝑎𝑙 𝑃𝑒𝑦𝑎𝑟\n\n╚═══❖••° °••❖═══╝\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶\n\n       👑 𝑀𝑖𝑙𝑙 𝐺𝑎𝑦𝑖 ❤\n\n𝑇𝑢𝑚𝑎𝑟 𝐵𝑜𝑛 🩷\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶";

      await message.reply({
        body: messageBody,
        attachment: fs.createReadStream(imagePath)
      });

      fs.unlinkSync(imagePath);

    } catch (error) {
      console.error(error);
      message.reply("❌ 𝑆𝑜𝑟𝑟𝑦, 𝑡ℎ𝑒𝑟𝑒 𝑤𝑎𝑠 𝑎 𝑝𝑟𝑜𝑏𝑙𝑒𝑚 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒: " + error.message);
    }
  }
};
