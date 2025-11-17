const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsName = 45;
const fontsInfo = 33;
const fontsOthers = 27;
const colorName = "#00FFFF";

module.exports = {
  config: {
    name: "infobox",
    aliases: ["boxinfo", "groupinfov2"],
    version: "2.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "group",
    shortDescription: {
      en: "📊 𝑉𝑖𝑒𝑤 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝'𝑠 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑔𝑟𝑎𝑝ℎ𝑖𝑐𝑠"
    },
    longDescription: {
      en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑣𝑖𝑠𝑢𝑎𝑙𝑙𝑦 𝑎𝑝𝑝𝑒𝑎𝑙𝑖𝑛𝑔 𝑑𝑒𝑠𝑖𝑔𝑛"
    },
    guide: {
      en: "{p}infobox"
    },
    dependencies: {
      "jimp": "",
      "axios": "",
      "fs-extra": "",
      "moment-timezone": ""
    }
  },

  langs: {
    "en": {
      "missingThreadInfo": "❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
      "errorProcessing": "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.",
      "notGroup": "❌ 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑐𝑎𝑛 𝑜𝑛𝑙𝑦 𝑏𝑒 𝑢𝑠𝑒𝑑 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝 𝑐ℎ𝑎𝑡𝑠.",
      "successResult": "📊 %1 𝐺𝑟𝑜𝑢𝑝 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    }
  },

  circle: async function (image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
  },

  onStart: async function ({ api, event, message, getText }) {
    try {
      const jimp = require("jimp");
      const fs = require("fs-extra");
      const axios = require("axios");
      const path = require("path");
      const moment = require("moment-timezone");

      let { senderID, threadID, messageID, threadType } = event;
      
      // Check if it's a group chat
      if (threadType !== "2") {
        return message.reply(getText("notGroup"));
      }

      // Define file paths
      let pathImg = __dirname + `/cache/${senderID}_${threadID}_infobox.png`;
      let pathAva = __dirname + `/cache/${senderID}_${threadID}_groupavt.png`;
      let pathAvata = __dirname + `/cache/${senderID}_${threadID}_adminavt.png`;
      let pathAvata2 = __dirname + `/cache/${senderID}_${threadID}_memavt1.png`;
      let pathAvata3 = __dirname + `/cache/${senderID}_${threadID}_memavt2.png`;
      let pathBg = __dirname + `/cache/${senderID}_${threadID}_background.png`;

      // Get thread information
      var threadInfo = await api.getThreadInfo(threadID);
      if (!threadInfo) {
        return message.reply(getText("missingThreadInfo"));
      }
      
      let threadName = threadInfo.threadName || "𝑈𝑛𝑛𝑎𝑚𝑒𝑑 𝐺𝑟𝑜𝑢𝑝";

      // Gender counts
      var nam = 0, nu = 0;
      for (let user of threadInfo.userInfo) {
        if (user.gender === 'MALE') nam++;
        else if (user.gender === 'FEMALE') nu++;
      }

      // Group statistics
      let qtv = threadInfo.adminIDs.length;
      let sl = threadInfo.messageCount || 0;
      let threadMem = threadInfo.participantIDs.length;

      // Random admin and members
      var idad = threadInfo.adminIDs[Math.floor(Math.random() * qtv)]?.id;
      var idmemrd = threadInfo.participantIDs[Math.floor(Math.random() * threadMem)];
      var idmemrd1 = threadInfo.participantIDs[Math.floor(Math.random() * threadMem)];

      // Download images
      let avatarData = await Promise.allSettled([
        axios.get(encodeURI(threadInfo.imageSrc || `https://graph.facebook.com/${threadID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), { responseType: "arraybuffer" }),
        idad ? axios.get(`https://graph.facebook.com/${idad}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }) : Promise.resolve(null),
        axios.get(`https://graph.facebook.com/${idmemrd}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
        axios.get(`https://graph.facebook.com/${idmemrd1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
        axios.get("https://i.imgur.com/hHKQMW8.jpg", { responseType: "arraybuffer" })
      ]);

      // Save files
      fs.writeFileSync(pathAva, Buffer.from(avatarData[0].value?.data || avatarData[0].value));
      if (avatarData[1].value) fs.writeFileSync(pathAvata, Buffer.from(avatarData[1].value.data));
      fs.writeFileSync(pathAvata2, Buffer.from(avatarData[2].value.data));
      fs.writeFileSync(pathAvata3, Buffer.from(avatarData[3].value.data));
      fs.writeFileSync(pathBg, Buffer.from(avatarData[4].value.data));

      // Download font if missing
      if (!fs.existsSync(__dirname + fonts)) {
        try {
          let fontData = await axios.get(downfonts, { responseType: "arraybuffer" });
          fs.writeFileSync(__dirname + fonts, Buffer.from(fontData.data));
        } catch (fontError) {
          console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑜𝑛𝑡:", fontError);
        }
      }

      // Process images
      let [avatar, avataruser, avataruser2, avataruser3] = await Promise.all([
        this.circle(pathAva),
        fs.existsSync(pathAvata) ? this.circle(pathAvata) : null,
        this.circle(pathAvata2),
        this.circle(pathAvata3)
      ]);

      // Load background image
      let background = await jimp.read(pathBg);
      
      // Load and composite group avatar
      let groupAvatar = await jimp.read(avatar);
      groupAvatar.resize(285, 285);
      background.composite(groupAvatar, 80, 73);
      
      // Load and composite member avatars
      if (avataruser) {
        let adminAvatar = await jimp.read(avataruser);
        adminAvatar.resize(43, 43);
        background.composite(adminAvatar, 450, 422);
      }
      
      let memAvatar1 = await jimp.read(avataruser2);
      memAvatar1.resize(43, 43);
      background.composite(memAvatar1, avataruser ? 500 : 450, 422);
      
      let memAvatar2 = await jimp.read(avataruser3);
      memAvatar2.resize(43, 43);
      background.composite(memAvatar2, avataruser ? 550 : 500, 422);

      // Load font
      let customFont;
      try {
        if (fs.existsSync(__dirname + fonts)) {
          customFont = await jimp.loadFont(__dirname + fonts);
        }
      } catch (fontError) {
        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 𝑓𝑜𝑛𝑡:", fontError);
      }

      // Draw group name (truncate if too long)
      let displayName = threadName;
      if (displayName.length > 20) {
        displayName = displayName.substring(0, 20) + "...";
      }
      
      if (customFont) {
        background.print(customFont, 435, 80, displayName);
      } else {
        // Use default font if custom font fails
        const defaultFont = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        background.print(defaultFont, 435, 80, displayName);
      }

      // Draw group info
      const infoData = [
        { emoji: "👥", text: `𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${threadMem}` },
        { emoji: "🛡️", text: `𝐴𝑑𝑚𝑖𝑛𝑠: ${qtv}` },
        { emoji: "♂️", text: `𝑀𝑎𝑙𝑒: ${nam}` },
        { emoji: "♀️", text: `𝐹𝑒𝑚𝑎𝑙𝑒: ${nu}` },
        { emoji: "💬", text: `𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠: ${sl}` }
      ];

      let infoFont;
      try {
        if (fs.existsSync(__dirname + fonts)) {
          infoFont = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
        } else {
          infoFont = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
        }
      } catch (e) {
        infoFont = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
      }

      infoData.forEach((item, i) => {
        background.print(infoFont, 439, 155 + i * 44, `${item.emoji} ${item.text}`);
      });

      // Draw footer info
      const footerFont = await jimp.loadFont(jimp.FONT_SANS_12_BLACK);
      background.print(footerFont, 18, 470, `🔖 𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${threadInfo.threadID}`);
      background.print(footerFont, 607, 453, `✨ 𝐴𝑛𝑑 ${threadMem - 3} 𝑜𝑡ℎ𝑒𝑟 𝑚𝑒𝑚𝑏𝑒𝑟𝑠...`);

      // Save final image
      await background.writeAsync(pathImg);

      // Create info text
      const infoText = `📊 ${threadName} 𝐺𝑟𝑜𝑢𝑝 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛!\n` +
        `👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${threadMem} | 🛡️ 𝐴𝑑𝑚𝑖𝑛𝑠: ${qtv}\n` +
        `♂️ 𝑀𝑎𝑙𝑒: ${nam} | ♀️ 𝐹𝑒𝑚𝑎𝑙𝑒: ${nu}\n` +
        `💬 𝑇𝑜𝑡𝑎𝑙 𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠: ${sl}\n` +
        `🔖 𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${threadInfo.threadID}`;

      await message.reply({
        body: infoText,
        attachment: fs.createReadStream(pathImg)
      });

      // Cleanup temporary files
      const filesToDelete = [pathAva, pathAvata, pathAvata2, pathAvata3, pathImg, pathBg];
      filesToDelete.forEach(file => {
        if (fs.existsSync(file)) {
          try {
            fs.unlinkSync(file);
          } catch (e) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑓𝑖𝑙𝑒:", e);
          }
        }
      });

    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑖𝑛𝑓𝑜𝑏𝑜𝑥 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
      message.reply(getText("errorProcessing"));
    }
  }
};
