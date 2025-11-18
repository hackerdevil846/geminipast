const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "yaar",
    aliases: [],
    version: "7.5.0",
    author: "Asif Mahmud",
    role: 0,
    category: "edit-img",
    shortDescription: { en: "👬 Create friendship-themed image with mentions" },
    longDescription: { en: "Generate a friendship-themed image with circular avatars" },
    guide: { en: "{p}yaar @mention" },
    countDown: 5,
    dependencies: { "axios": "", "fs-extra": "", "jimp": "" }
  },

  onLoad: async function () {
    const dirMaterial = path.join(__dirname, "cache", "canvas");
    const imgPath = path.join(dirMaterial, "Bbro.png");

    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });

    if (!fs.existsSync(imgPath)) {
      const { data } = await axios.get("https://i.imgur.com/2bY5bSV.jpg", { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(data, "utf-8"));
    }
  },

  onStart: async function ({ api, event, message }) {
    const mention = Object.keys(event.mentions);
    if (!mention[0]) return message.reply("❔ | Please mention someone to create the image.");

    const one = event.senderID;
    const two = mention[0];

    const imgPath = await makeImage({ one, two });

    await message.reply({
      body: "✨ Friendship Image Generated ✨",
      attachment: fs.createReadStream(imgPath)
    });

    fs.unlinkSync(imgPath);
  }
};

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache", "canvas");

  let baseImg = await Jimp.read(path.join(__root, "Bbro.png"));
  let outputPath = path.join(__root, `friendship_${one}_${two}.png`);
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

  // Circle crop avatars
  let circleOne = await Jimp.read(await circle(avatarOnePath));
  let circleTwo = await Jimp.read(await circle(avatarTwoPath));

  // Composite avatars
  baseImg.composite(circleOne.resize(191, 191), 93, 111)
         .composite(circleTwo.resize(190, 190), 434, 107);

  // Load fonts
  const font32 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const font16 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

  // Adaptive text for title
  await printAdaptiveText(baseImg, "Perfect Pair", font32, 0, 10, baseImg.bitmap.width, 50);

  // Adaptive text for subtitle
  await printAdaptiveText(baseImg, "True Friendship Forever", font16, 0, baseImg.bitmap.height - 50, baseImg.bitmap.width, 30);

  // Save final image
  const raw = await baseImg.getBufferAsync("image/png");
  fs.writeFileSync(outputPath, raw);

  // Cleanup avatars
  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return outputPath;
}

async function circle(image) {
  let img = await Jimp.read(image);
  img.circle();
  return await img.getBufferAsync("image/png");
}

// Adaptive text function
async function printAdaptiveText(image, text, font, x, y, maxWidth, maxHeight) {
  let currentFont = font;
  let textWidth = Jimp.measureText(currentFont, text);

  // Shrink font if text is too wide
  while (textWidth > maxWidth) {
    if (currentFont === Jimp.FONT_SANS_8_BLACK) break; // smallest font
    if (currentFont === Jimp.FONT_SANS_32_BLACK) currentFont = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    else if (currentFont === Jimp.FONT_SANS_16_BLACK) currentFont = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);
    textWidth = Jimp.measureText(currentFont, text);
  }

  image.print(
    currentFont,
    x,
    y,
    { text: text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER },
    maxWidth,
    maxHeight
  );
}
