const sendWaiting = true;
const textWaiting = "🖼️ 𝐼𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑒 ℎ𝑜𝑐𝑐ℎ𝑒, 𝑎𝑝𝑛𝑖 𝑒𝑘𝑡𝑜 𝑤𝑎𝑖𝑡 𝑘𝑜𝑟𝑢𝑛...";

const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports = {
  config: {
    name: "cardinfo-tag",
    aliases: [],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
      en: "🎴 𝐶𝑟𝑒𝑎𝑡𝑒 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙𝑖𝑧𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑 𝑓𝑜𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠"
    },
    guide: {
      en: "{p}cardinfo-tag [𝑡𝑎𝑔/𝑟𝑒𝑝𝑙𝑦/𝑢𝑖𝑑]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "jimp": "",
      "moment-timezone": ""
    }
  },

  circle: async function (image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
  },

  onStart: async function({ api, event, args, message, usersData }) {
    try {
      const { threadID, messageID, senderID } = event;
      const { loadImage, createCanvas } = require("canvas");
      const fs = require("fs-extra");
      const axios = require("axios");
      const Canvas = require("canvas");

      let pathImg = __dirname + `/cache/1.png`;
      let pathAvata = __dirname + `/cache/2.png`;

      let uid;
      const mention = Object.keys(event.mentions)[0];
      
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else {
        uid = mention || event.senderID;
      }

      if (sendWaiting) {
        message.reply(textWaiting);
      }

      const userInfo = await api.getUserInfo(uid);
      const res = userInfo[uid];

      let getAvatarOne = (await axios.get(
        `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )).data;

      let bg = (await axios.get(encodeURI(`https://i.imgur.com/tW6nSDm.png`), {
        responseType: "arraybuffer"
      })).data;

      fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, "utf-8"));
      let avataruser = await this.circle(pathAvata);
      fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

      if (!fs.existsSync(__dirname + `${fonts}`)) {
        let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
      }

      const gender = res.gender === "male" ? "👦 𝐶ℎ𝑒𝑙𝑒" : res.gender === "female" ? "👧 𝑀𝑒𝑦𝑒" : "❓ 𝑃𝑢𝑏𝑙𝑖𝑐 𝑛𝑎";
      const birthday = res.birthday || "𝑃𝑎𝑤𝑎 𝑗𝑎𝑦 𝑛𝑎𝑖";
      const love = res.relationship_status || "𝑃𝑎𝑤𝑎 𝑗𝑎𝑦 𝑛𝑎𝑖";
      const location = res.location || "𝑃𝑎𝑤𝑎 𝑗𝑎𝑦 𝑛𝑎𝑖";
      const follow = res.follow || "𝑃𝑎𝑤𝑎 𝑗𝑎𝑦 𝑛𝑎𝑖";

      let baseImage = await loadImage(pathImg);
      let baseAvata = await loadImage(avataruser);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAvata, 80, 73, 285, 285);

      Canvas.registerFont(__dirname + `${fonts}`, {
        family: "Play-Bold"
      });

      ctx.font = `${fontsInfo}px Play-Bold`;
      ctx.fillStyle = "#000000";
      ctx.textAlign = "start";

      ctx.fillText(`${res.name}`, 480, 172);
      ctx.fillText(`${gender}`, 550, 208);
      ctx.fillText(`${follow}`, 550, 244);
      ctx.fillText(`${love}`, 550, 281);
      ctx.fillText(`${birthday}`, 550, 320);
      ctx.fillText(`${location}`, 550, 357);
      ctx.fillText(`${uid}`, 550, 399);

      ctx.font = `${fontsLink}px Play-Bold`;
      ctx.fillStyle = "#0000FF";
      ctx.fillText(`https://facebook.com/${uid}`, 180, 475);

      ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      fs.removeSync(pathAvata);

      return message.reply(
        {
          body: `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑈𝑠𝑒𝑟 𝐶𝑎𝑟𝑑!\n👤 𝑁𝑎𝑚𝑒: ${res.name}\n🆔 𝑈𝐼𝐷: ${uid}\n🌐 𝐿𝑖𝑛𝑘: https://facebook.com/${uid}`,
          attachment: fs.createReadStream(pathImg)
        },
        () => fs.unlinkSync(pathImg)
      );

    } catch (error) {
      console.error("𝐶𝑎𝑟𝑑𝐼𝑛𝑓𝑜 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑢𝑠𝑒𝑟 𝑐𝑎𝑟𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
