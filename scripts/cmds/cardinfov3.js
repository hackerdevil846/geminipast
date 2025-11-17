const sendWaiting = true;
const textWaiting = "⏳ 𝐼𝑚𝑎𝑔𝑒 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;

module.exports = {
  config: {
    name: "cardinfov3",
    aliases: [],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "info",
    shortDescription: {
      en: "📇 𝐶𝑟𝑒𝑎𝑡𝑒 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑"
    },
    longDescription: {
      en: "📇 𝐶𝑟𝑒𝑎𝑡𝑒 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑"
    },
    guide: {
      en: "{p}cardinfov3 [𝑟𝑒𝑝𝑙𝑦/@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    countDown: 5,
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

  onStart: async function ({ api, event, args, message }) {
    try {
      const { loadImage, createCanvas, registerFont } = require("canvas");
      const fs = require("fs-extra");
      const axios = require("axios");
      const moment = require("moment-timezone");

      let pathImg = __dirname + `/cache/1.png`;
      let pathAvata = __dirname + `/cache/2.png`;

      let uid;
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else {
        uid = event.senderID;
      }

      if (sendWaiting) {
        await message.reply(textWaiting);
      }

      const userInfo = await api.getUserInfoV2(uid);

      let getAvatarOne = (await axios.get(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
      let bg = (await axios.get(`https://i.imgur.com/ufsPjwE.png`, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
      let avataruser = await this.circle(pathAvata);
      fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

      if (!fs.existsSync(__dirname + fonts)) {
        let getfont = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + fonts, Buffer.from(getfont, "utf-8"));
      }

      let baseImage = await loadImage(pathImg);
      let baseAvata = await loadImage(avataruser);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAvata, 855, 70, 350, 350);

      if (!userInfo.location) userInfo.location = "Not Found";
      if (!userInfo.birthday) userInfo.birthday = "Not Found";
      if (!userInfo.relationship_status) userInfo.relationship_status = "Not Found";
      if (!userInfo.follow) userInfo.follow = "Not Found";

      let gender = userInfo.gender === 'male' ? "Male" :
                  userInfo.gender === 'female' ? "Female" : "Not Found";

      registerFont(__dirname + fonts, { family: "Play-Bold" });

      ctx.font = `${fontsInfo}px Play-Bold`;
      ctx.fillStyle = "#FFCC33";
      ctx.textAlign = "start";
      ctx.fillText(userInfo.name, 130, 130);

      ctx.font = `${fontsInfo}px Play-Bold`;
      ctx.fillStyle = "#FFCC33";
      ctx.fillText(`💠 Sex:   ${gender}`, 70, 180);
      ctx.fillText(`👥 Follow:   ${userInfo.follow}`, 70, 230);
      ctx.fillText(`💞 Relationship:   ${userInfo.relationship_status}`, 70, 280);
      ctx.fillText(`🎂 DOB:   ${userInfo.birthday}`, 70, 330);
      ctx.fillText(`🆔 UID:   ${uid}`, 70, 380);

      ctx.font = `${fontsLink}px Play-Bold`;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`🌐 Profile:  ${userInfo.link}`, 50, 450);

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      fs.removeSync(pathAvata);

      return message.reply({
        body: `✨ 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑡ℎ𝑒 𝑐𝑎𝑟𝑑 𝑜𝑓 ${userInfo.name}`,
        attachment: fs.createReadStream(pathImg)
      }).then(() => fs.unlinkSync(pathImg));

    } catch (error) {
      console.error("𝐶𝑎𝑟𝑑𝐼𝑛𝑓𝑜 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑖𝑛𝑓𝑜 𝑐𝑎𝑟𝑑: " + error.message);
    }
  }
};

