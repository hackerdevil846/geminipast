const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 45;
const fontsInfo = 28;
const colorName = "#000000";

module.exports = {
  config: {
    name: "cardinfov4",
    aliases: ["profilev4", "usercardv4"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
      en: "📝 𝐶𝑟𝑒𝑎𝑡𝑒 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑"
    },
    longDescription: {
      en: "📝 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
      en: "{p}cardinfov4 [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑢𝑠𝑒𝑟]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "jimp": "",
      "moment-timezone": ""
    }
  },

  // Circular avatar processing
  circle: async function(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
  },

  // Convert normal text to Mathematical Bold Italic
  toMathBoldItalic: function(text) {
    const map = {
      'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴',
      'N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
      'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎',
      'n': '𝒏','o': '𝒐','p': '𝒑','q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
      '0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗',
      ' ':' ','-':'-','_':'_','/':'/','.':'.',':':':','>':'>','(': '(' ,')':')','[':'[',']':']','{':'{','}':'}'
    };
    return text.split('').map(c => map[c] || c).join('');
  },

  onStart: async function({ api, event, args, message, Users }) {
    try {
      // Check dependencies
      const requiredDeps = ["canvas", "axios", "fs-extra", "jimp"];
      for (const dep of requiredDeps) {
        try {
          require.resolve(dep);
        } catch {
          throw new Error(`𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: ${dep}`);
        }
      }

      const { senderID, threadID, messageID } = event;
      const { loadImage, createCanvas, registerFont } = require("canvas");
      const fs = require("fs-extra");
      const axios = require("axios");

      const pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
      const pathAvata = __dirname + `/cache/avtuserrd.png`;

      let uid = event.type === "message_reply" ? event.messageReply.senderID : senderID;

      const res = await api.getUserInfoV2(uid);

      // Fetch avatar
      const getAvatarOne = (await axios.get(
        `https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: 'arraybuffer' }
      )).data;

      // Fetch background
      const bg = (await axios.get(encodeURI(`https://i.imgur.com/fBgFUr8.png`), { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
      const avataruser = await this.circle(pathAvata);
      fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

      // Download font if not exists
      if (!fs.existsSync(__dirname + fonts)) {
        const getfont = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + fonts, Buffer.from(getfont, "utf-8"));
      }

      // Load canvas
      const baseImage = await loadImage(pathImg);
      const baseAvata = await loadImage(avataruser);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAvata, 100, 97, 255, 255);

      // Default text
      const notFoundText = this.toMathBoldItalic("𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑");
      const notPublicText = this.toMathBoldItalic("𝑁𝑜𝑡 𝑝𝑢𝑏𝑙𝑖𝑐");

      if (!res.location || res.location === "𝐾ℎô𝑛𝑔 𝐶ó 𝐷ữ 𝐿𝑖ệ𝑢") res.location = notFoundText;
      if (!res.birthday || res.birthday === "𝐾ℎô𝑛𝑔 𝐶ó 𝐷ữ 𝐿𝑖ệ𝑢") res.birthday = notFoundText;
      if (!res.relationship_status || res.relationship_status === "𝐾ℎô𝑛𝑔 𝐶ó 𝐷ữ 𝐿𝑖ệ𝑢") res.relationship_status = notFoundText;
      if (!res.follow || res.follow === "𝐾ℎô𝑛𝑔 𝐶ó 𝐷ữ 𝐿𝑖ệ𝑢") res.follow = notFoundText;

      const gender = res.gender === 'male' ? this.toMathBoldItalic("𝑚𝑎𝑙𝑒") : res.gender === 'female' ? this.toMathBoldItalic("𝑓𝑒𝑚𝑎𝑙𝑒") : notPublicText;
      const birthday = res.birthday ? this.toMathBoldItalic(res.birthday) : notPublicText;
      const love = res.relationship_status ? this.toMathBoldItalic(res.relationship_status) : notPublicText;
      const location = res.location ? this.toMathBoldItalic(res.location) : notPublicText;
      const nameText = this.toMathBoldItalic(res.name);
      const uidText = this.toMathBoldItalic(uid.toString());

      // Register font
      registerFont(__dirname + fonts, { family: "𝑃𝑙𝑎𝑦-𝐵𝑜𝑙𝑑" });

      // Labels
      const nameLabel = this.toMathBoldItalic("» 𝑁𝑎𝑚𝑒:");
      const sexLabel = this.toMathBoldItalic("» 𝑆𝑒𝑥:");
      const followLabel = this.toMathBoldItalic("» 𝐹𝑜𝑙𝑙𝑜𝑤:");
      const relationshipLabel = this.toMathBoldItalic("» 𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝:");
      const birthdayLabel = this.toMathBoldItalic("» 𝐵𝑖𝑟𝑡ℎ𝑑𝑎𝑦:");
      const locationLabel = this.toMathBoldItalic("» 𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛:");
      const uidLabel = this.toMathBoldItalic("» 𝑈𝐼𝐷:");
      const profileLabel = this.toMathBoldItalic("» 𝑃𝑟𝑜𝑓𝑖𝑙𝑒:");

      ctx.font = `${fontsInfo}px 𝑃𝑙𝑎𝑦-𝐵𝑜𝑙𝑑`;
      ctx.fillStyle = "#𝑓𝑓𝑓𝑓";
      ctx.textAlign = "𝑠𝑡𝑎𝑟𝑡";

      // Draw user info
      ctx.fillText(`${nameLabel} ${nameText}`, 455, 172);
      ctx.fillText(`${sexLabel} ${gender}`, 455, 208);
      ctx.fillText(`${followLabel} ${res.follow}`, 455, 244);
      ctx.fillText(`${relationshipLabel} ${love}`, 455, 281);
      ctx.fillText(`${birthdayLabel} ${birthday}`, 455, 320);
      ctx.fillText(`${locationLabel} ${location}`, 455, 357);
      ctx.fillText(`${uidLabel} ${uidText}`, 455, 397);

      ctx.font = `${fontsLink}px 𝑃𝑙𝑎𝑦-𝐵𝑜𝑙𝑑`;
      ctx.fillText(`${profileLabel} ${res.link}`, 19, 468);

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      fs.removeSync(pathAvata);

      return message.reply({
        attachment: fs.createReadStream(pathImg)
      }, () => fs.unlinkSync(pathImg));

    } catch (error) {
      console.error("𝐶𝑎𝑟𝑑𝐼𝑛𝑓𝑜 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑: " + error.message);
    }
  }
};
