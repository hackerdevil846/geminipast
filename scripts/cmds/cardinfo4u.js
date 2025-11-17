const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";

module.exports = {
  config: {
    name: "cardinfo4u",
    aliases: [],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "info",
    shortDescription: {
      en: "🎨 𝐶𝑟𝑒𝑎𝑡𝑒 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜 𝑐𝑎𝑟𝑑𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑𝑠 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑑𝑒𝑠𝑖𝑔𝑛"
    },
    guide: {
      en: "{p}cardinfo4u [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑢𝑠𝑒𝑟]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "jimp": "",
      "moment-timezone": ""
    }
  },

  langs: {
    "en": {
      "fail": "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
    }
  },

  onLoad: async function() {
    try {
      const fs = require("fs-extra");
      const cacheDir = __dirname + "/cache";
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    } catch (e) {
      console.error("𝑜𝑛𝐿𝑜𝑎𝑑 𝑤𝑎𝑟𝑛𝑖𝑛𝑔 (𝑐𝑎𝑟𝑑𝑖𝑛𝑓𝑜4𝑢):", e);
    }
  },

  circleImage: async function(imagePath) {
    const jimp = require("jimp");
    const img = await jimp.read(imagePath);
    img.circle();
    return await img.getBufferAsync("image/png");
  },

  onStart: async function({ api, event, args, message, getText }) {
    const { createCanvas, loadImage, registerFont } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    const jimp = require("jimp");
    const moment = require("moment-timezone");

    try {
      let uid;
      if (event.messageReply && event.messageReply.senderID) {
        uid = event.messageReply.senderID;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else if (args[0] && args[0].match(/\d+/)) {
        uid = args[0].match(/\d+/)[0];
      } else {
        uid = event.senderID;
      }

      const pathImg = __dirname + `/cache/${uid}_card.png`;
      const pathAvata = __dirname + `/cache/${uid}_avt.png`;

      const userData = await api.getUserInfo(uid);
      const user = userData[uid] || {};
      const name = user.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
      const gender = user.gender || "𝑁𝑜𝑡 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑒𝑑";
      const birthday = user.birthday || "𝑁𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒";
      const relationship = user.relationship_status || user.relationship || "𝑁𝑜𝑡 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑒𝑑";
      const location = (user.location && user.location.name) || user.location || "𝑁𝑜𝑡 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑒𝑑";
      const hometown = (user.hometown && user.hometown.name) || user.hometown || "𝑁𝑜𝑡 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑒𝑑";
      const link = user.link || `https://facebook.com/${uid}`;
      const follow = user.follow ? `${user.follow} 𝑓𝑜𝑙𝑙𝑜𝑤𝑒𝑟𝑠` : "𝑁𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒";

      const [avatarRes, bgRes] = await Promise.all([
        axios.get(`https://graph.facebook.com/${uid}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
          responseType: 'arraybuffer'
        }),
        axios.get("https://i.imgur.com/rqbC4ES.jpg", {
          responseType: "arraybuffer"
        })
      ]);

      fs.writeFileSync(pathAvata, Buffer.from(avatarRes.data, "binary"));
      fs.writeFileSync(pathImg, Buffer.from(bgRes.data, "binary"));

      const circledAvatar = await this.circleImage(pathAvata);
      fs.writeFileSync(pathAvata, circledAvatar);

      try {
        if (!fs.existsSync(__dirname + fonts)) {
          const fontData = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + fonts, Buffer.from(fontData, "binary"));
        }
      } catch (fontError) {
        console.warn("𝐹𝑜𝑛𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑓𝑜𝑛𝑡.", fontError);
      }

      const baseImage = await loadImage(pathImg);
      const avatar = await loadImage(pathAvata);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0);
      ctx.drawImage(avatar, 910, 465, 229, 229);

      if (fs.existsSync(__dirname + fonts)) {
        try {
          registerFont(__dirname + fonts, { family: "Play-Bold" });
          ctx.font = "35px 'Play-Bold'";
        } catch (e) {
          ctx.font = "35px Arial";
          console.warn("𝑟𝑒𝑔𝑖𝑠𝑡𝑒𝑟𝐹𝑜𝑛𝑡 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑡𝑜 𝐴𝑟𝑖𝑎𝑙.", e);
        }
      } else {
        ctx.font = "35px Arial";
        console.warn("𝐶𝑢𝑠𝑡𝑜𝑚 𝑓𝑜𝑛𝑡 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝐴𝑟𝑖𝑎𝑙.");
      }

      ctx.fillStyle = "#00FFFF";

      const infoLines = [
        { text: `𝑁𝑎𝑚𝑒: ${name}`, x: 340, y: 560 },
        { text: `𝐺𝑒𝑛𝑑𝑒𝑟: ${gender}`, x: 1245, y: 448 },
        { text: `𝐹𝑜𝑙𝑙𝑜𝑤𝑒𝑟𝑠: ${follow}`, x: 1245, y: 505 },
        { text: `𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝: ${relationship}`, x: 1245, y: 559 },
        { text: `𝐵𝑖𝑟𝑡ℎ𝑑𝑎𝑦: ${birthday}`, x: 1245, y: 616 },
        { text: `𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛: ${location}`, x: 1245, y: 668 },
        { text: `𝐻𝑜𝑚𝑒𝑡𝑜𝑤𝑛: ${hometown}`, x: 1245, y: 723 }
      ];

      const truncateToWidth = (context, text, maxWidth) => {
        let displayText = text;
        if (context.measureText(displayText).width > maxWidth) {
          while (context.measureText(displayText + "...").width > maxWidth && displayText.length > 10) {
            displayText = displayText.substring(0, displayText.length - 1);
          }
          displayText += "...";
        }
        return displayText;
      };

      infoLines.forEach(line => {
        const displayText = truncateToWidth(ctx, line.text, 400);
        ctx.fillText(displayText, line.x, line.y);
      });

      if (fs.existsSync(__dirname + fonts)) {
        ctx.font = "28px 'Play-Bold'";
      } else {
        ctx.font = "28px Arial";
      }

      ctx.fillStyle = "#FFCC33";
      ctx.fillText(`𝑈𝐼𝐷: ${uid}`, 814, 728);

      ctx.fillStyle = "#00FF00";
      let profileText = `𝑃𝑟𝑜𝑓𝑖𝑙𝑒: ${link}`;
      if (ctx.measureText(profileText).width > 700) {
        profileText = `𝑃𝑟𝑜𝑓𝑖𝑙𝑒: 𝑓𝑏.𝑐𝑜𝑚/${uid}`;
      }
      ctx.fillText(profileText, 32, 727);

      const out = fs.createWriteStream(pathImg);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      await new Promise(resolve => out.on('finish', resolve));

      const bodyText =
        `🌟  •  *𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝐶𝑎𝑟𝑑*  •  🌟\n\n` +
        `👤 𝑁𝑎𝑚𝑒: ${name}\n` +
        `🔗 𝑃𝑟𝑜𝑓𝑖𝑙𝑒: ${link}\n\n` +
        `✨ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;

      await message.reply({
        body: bodyText,
        attachment: fs.createReadStream(pathImg)
      });

      try { if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); } catch (e) { }
      try { if (fs.existsSync(pathAvata)) fs.unlinkSync(pathAvata); } catch (e) { }

    } catch (error) {
      console.error("𝐶𝑎𝑟𝑑 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
      const failMsg = this.langs.en.fail;
      await message.reply(failMsg);
    }
  }
};
