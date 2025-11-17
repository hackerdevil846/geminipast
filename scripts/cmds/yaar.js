const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "yaar",
    aliases: ["bondhu", "friendship"],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "👬 𝐶𝑟𝑒𝑎𝑡𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑠ℎ𝑖𝑝-𝑡ℎ𝑒𝑚𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑏𝑜𝑛𝑑ℎ𝑢𝑡𝑡𝑜 𝑡ℎ𝑒𝑚𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    guide: {
      en: "{p}yaar @𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    const dirMaterial = path.join(__dirname, "cache", "canvas");
    const imgPath = path.join(dirMaterial, "Bbro.png");

    if (!fs.existsSync(dirMaterial)) {
      fs.mkdirSync(dirMaterial, { recursive: true });
    }

    if (!fs.existsSync(imgPath)) {
      const { data } = await axios.get("https://i.imgur.com/2bY5bSV.jpg", { 
        responseType: "arraybuffer" 
      });
      fs.writeFileSync(imgPath, Buffer.from(data, "utf-8"));
    }
  },

  onStart: async function ({ api, event, message }) {
    const mention = Object.keys(event.mentions);
    if (!mention[0]) {
      return message.reply("❔ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒...");
    }

    const one = event.senderID;
    const two = mention[0];

    const imgPath = await makeImage({ one, two });
    
    await message.reply({
      body: "✧•❁ 𝐵𝑜𝑛𝑑ℎ𝑢 ❁•✧\n\n╔═══❖••° °••❖═══╗\n\n   👬 𝑆𝑎𝑓𝑎𝑙 𝐽𝑜𝑑𝑖 👬\n\n╚═══❖••° °••❖═══╝\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶\n\n       👑 𝐸𝑖 𝑛𝑎𝑜, 𝑝𝑒𝑦𝑒 𝑔𝑒𝑐ℎ𝑜 ❤\n\n💖 𝑇𝑜𝑚𝑎𝑟 𝐽𝑖𝑔𝑟𝑖 𝐷𝑜𝑠𝑡 🩷\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶",
      attachment: fs.createReadStream(imgPath)
    });

    fs.unlinkSync(imgPath);
  }
};

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache", "canvas");

  let baseImg = await jimp.read(path.join(__root, "Bbro.png"));
  let outputPath = path.join(__root, `batman${one}_${two}.png`);
  let avatarOnePath = path.join(__root, `avt_${one}.png`);
  let avatarTwoPath = path.join(__root, `avt_${two}.png`);

  // Download avatars
  let getAvatarOne = (await axios.get(
    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
    { responseType: 'arraybuffer' }
  )).data;
  fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne, 'utf-8'));

  let getAvatarTwo = (await axios.get(
    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
    { responseType: 'arraybuffer' }
  )).data;
  fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo, 'utf-8'));

  // Circle crop
  let circleOne = await jimp.read(await circle(avatarOnePath));
  let circleTwo = await jimp.read(await circle(avatarTwoPath));

  baseImg.composite(circleOne.resize(191, 191), 93, 111)
         .composite(circleTwo.resize(190, 190), 434, 107);

  let raw = await baseImg.getBufferAsync("image/png");
  fs.writeFileSync(outputPath, raw);

  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return outputPath;
}

async function circle(image) {
  let img = await jimp.read(image);
  img.circle();
  return await img.getBufferAsync("image/png");
}
