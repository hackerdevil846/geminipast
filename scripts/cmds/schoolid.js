const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "fakeid",
    aliases: ["idgen", "schoolidcard"], // 𝐀𝐝𝐝𝐞𝐝 𝐚𝐥𝐢𝐚𝐬𝐞𝐬 𝐚𝐬 𝐫𝐞𝐪𝐮𝐞𝐬𝐭𝐞𝐝
    version: "1.0.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝", // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    role: 0, // 𝐄𝐪𝐮𝐢𝐯𝐚𝐥𝐞𝐧𝐭 𝐭𝐨 𝐡𝐚𝐬𝐏𝐞𝐫𝐦𝐬𝐬𝐢𝐨𝐧: 0
    category: "𝐢𝐦𝐚𝐠𝐞",
    countDown: 3, // 𝐄𝐪𝐮𝐢𝐯𝐚𝐥𝐞𝐧𝐭 𝐭𝐨 𝐜𝐨𝐨𝐥𝐝𝐨𝐰𝐧𝐬: 3
    shortDescription: {
      en: "𝐅𝐚𝐤𝐞 𝐒𝐜𝐡𝐨𝐨𝐥 𝐈𝐃 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐨𝐫 🏫" // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    },
    longDescription: {
      en: "𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐬 𝐚 𝐟𝐚𝐤𝐞 𝐬𝐜𝐡𝐨𝐨𝐥 𝐈𝐃 𝐜𝐚𝐫𝐝 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐮𝐬𝐞𝐫'𝐬 𝐚𝐯𝐚𝐭𝐚𝐫 𝐚𝐧𝐝 𝐧𝐚𝐦𝐞." // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    },
    guide: {
      en: "{p}fakeid @mention" // 𝐂𝐡𝐚𝐧𝐠𝐞𝐝 𝐮𝐬𝐚𝐠𝐞𝐬 𝐭𝐨 𝐠𝐮𝐢𝐝𝐞
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  // 𝐇𝐞𝐥𝐩𝐞𝐫 𝐟𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐭𝐨 𝐰𝐫𝐚𝐩 𝐭𝐞𝐱𝐭 𝐟𝐨𝐫 𝐜𝐚𝐧𝐯𝐚𝐬
  wrapText: async function (ctx, name, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(name).width < maxWidth) return resolve([name]);
      if (ctx.measureText('𝐖').width > maxWidth) return resolve(null); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
      const words = name.split(' ');
      const lines = [];
      let line = '';
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
        else {
          lines.push(line.trim());
          line = '';
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },

  onStart: async function ({ api, event, Users }) { // 𝐏𝐚𝐫𝐚𝐦𝐞𝐭𝐞𝐫𝐬 𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐞𝐝 𝐚𝐬 𝐩𝐞𝐫 𝐲𝐨𝐮𝐫 𝐞𝐱𝐚𝐦𝐩𝐥𝐞
    try {
      // 𝐂𝐡𝐞𝐜𝐤 𝐟𝐨𝐫 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐢𝐞𝐬
      const { dependencies } = this.config;
      for (const dep in dependencies) {
        try {
          require.resolve(dep);
        } catch (e) {
          console.error(`𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲: ${dep}. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐢𝐧𝐬𝐭𝐚𝐥𝐥 𝐢𝐭.`);
          return api.sendMessage(`❌ 𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲: ${dep}. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐢𝐧𝐬𝐭𝐚𝐥𝐥 𝐢𝐭 𝐭𝐨 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.`, event.threadID, event.messageID); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
        }
      }

      let pathImg = __dirname + "/cache/background.png"; // 𝐃𝐎 𝐍𝐎𝐓 𝐂𝐇𝐀𝐍𝐆𝐄 𝐏𝐀𝐓𝐇
      let pathAvt1 = __dirname + "/cache/Avtmot.png";   // 𝐃𝐎 𝐍𝐎𝐓 𝐂𝐇𝐀𝐍𝐆𝐄 𝐏𝐀𝐓𝐇

      // 𝐓𝐚𝐫𝐠𝐞𝐭 𝐮𝐬𝐞𝐫: 𝐟𝐢𝐫𝐬𝐭 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐨𝐫 𝐬𝐞𝐧𝐝𝐞𝐫 𝐈𝐃
      var id = Object.keys(event.mentions)[0] || event.senderID;
      var name = await Users.getNameUser(id);

      // 𝐁𝐚𝐜𝐤𝐠𝐫𝐨𝐮𝐧𝐝 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 - 𝐃𝐎 𝐍𝐎𝐓 𝐂𝐇𝐀𝐍𝐆𝐄 𝐓𝐇𝐈𝐒 𝐋𝐈𝐍𝐊 𝐀𝐒 𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐄𝐃
      var background = [
        "https://i.imgur.com/xJRXL3l.png"
      ];
      var rd = background[Math.floor(Math.random() * background.length)];

      // 𝐅𝐞𝐭𝐜𝐡 𝐚𝐯𝐚𝐭𝐚𝐫 - 𝐃𝐎 𝐍𝐎𝐓 𝐂𝐇𝐀𝐍𝐆𝐄 𝐓𝐇𝐈𝐒 𝐋𝐈𝐍𝐊 𝐀𝐒 𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐄𝐃
      let getAvtmot = (
        await axios.get(
          `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )
      ).data;
      fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

      // 𝐅𝐞𝐭𝐜𝐡 𝐛𝐚𝐜𝐤𝐠𝐫𝐨𝐮𝐧𝐝 - 𝐃𝐎 𝐍𝐎𝐓 𝐂𝐇𝐀𝐍𝐆𝐄 𝐓𝐇𝐈𝐒 𝐋𝐈𝐍𝐊 𝐀𝐒 𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐄𝐃
      let getbackground = (
        await axios.get(`${rd}`, { responseType: "arraybuffer" })
      ).data;
      fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

      // 𝐂𝐚𝐧𝐯𝐚𝐬 𝐝𝐫𝐚𝐰𝐢𝐧𝐠 𝐨𝐩𝐞𝐫𝐚𝐭𝐢𝐨𝐧𝐬
      let baseImage = await loadImage(pathImg);
      let baseAvt1 = await loadImage(pathAvt1);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // 𝐃𝐫𝐚𝐰 𝐮𝐬𝐞𝐫'𝐬 𝐧𝐚𝐦𝐞
      ctx.font = "400 23px Arial"; // 𝐅𝐨𝐧𝐭 𝐬𝐭𝐲𝐥𝐞 𝐟𝐨𝐫 𝐧𝐚𝐦𝐞 𝐨𝐧 𝐈𝐃
      ctx.fillStyle = "#1878F3"; // 𝐂𝐨𝐥𝐨𝐫 𝐨𝐟 𝐭𝐡𝐞 𝐧𝐚𝐦𝐞 𝐭𝐞𝐱𝐭
      ctx.textAlign = "start";

      const lines = await this.wrapText(ctx, name, 2000); // 𝐖𝐫𝐚𝐩 𝐧𝐚𝐦𝐞 𝐢𝐟 𝐭𝐨𝐨 𝐥𝐨𝐧𝐠
      ctx.fillText(lines.join('\n'), 270, 790); // 𝐏𝐨𝐬𝐢𝐭𝐢𝐨𝐧 𝐟𝐨𝐫 𝐭𝐡𝐞 𝐧𝐚𝐦𝐞

      // 𝐃𝐫𝐚𝐰 𝐮𝐬𝐞𝐫'𝐬 𝐚𝐯𝐚𝐭𝐚𝐫
      ctx.drawImage(baseAvt1, 168, 225, 360, 360); // 𝐏𝐨𝐬𝐢𝐭𝐢𝐨𝐧 𝐚𝐧𝐝 𝐬𝐢𝐳𝐞 𝐟𝐨𝐫 𝐭𝐡𝐞 𝐚𝐯𝐚𝐭𝐚𝐫

      // 𝐒𝐚𝐯𝐞 𝐭𝐡𝐞 𝐟𝐢𝐧𝐚𝐥 𝐢𝐦𝐚𝐠𝐞 𝐭𝐨 𝐛𝐮𝐟𝐟𝐞𝐫 𝐚𝐧𝐝 𝐭𝐡𝐞𝐧 𝐭𝐨 𝐟𝐢𝐥𝐞
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer); // 𝐎𝐯𝐞𝐫𝐰𝐫𝐢𝐭𝐞 𝐭𝐡𝐞 𝐛𝐚𝐜𝐤𝐠𝐫𝐨𝐮𝐧𝐝 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐟𝐢𝐧𝐚𝐥 𝐈𝐃
      fs.removeSync(pathAvt1); // 𝐑𝐞𝐦𝐨𝐯𝐞 𝐭𝐡𝐞 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐲 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐢𝐥𝐞

      // 𝐒𝐞𝐧𝐝 𝐭𝐡𝐞 𝐫𝐞𝐬𝐮𝐥𝐭 𝐭𝐨 𝐭𝐡𝐞 𝐜𝐡𝐚𝐭
      return api.sendMessage({
        body: "✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐅𝐚𝐤𝐞 𝐒𝐜𝐡𝐨𝐨𝐥 𝐈𝐃! 🎓", // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
        attachment: fs.createReadStream(pathImg)
      }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID); // 𝐔𝐧𝐥𝐢𝐧𝐤 𝐭𝐡𝐞 𝐟𝐢𝐧𝐚𝐥 𝐈𝐃 𝐚𝐟𝐭𝐞𝐫 𝐬𝐞𝐧𝐝𝐢𝐧𝐠

    } catch (e) {
      console.error(e); // 𝐋𝐨𝐠 𝐚𝐧𝐲 𝐞𝐫𝐫𝐨𝐫𝐬 𝐭𝐨 𝐭𝐡𝐞 𝐜𝐨𝐧𝐬𝐨𝐥𝐞
      return api.sendMessage("❌ 𝐄𝐫𝐫𝐨𝐫: 𝐒𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐰𝐞𝐧𝐭 𝐰𝐫𝐨𝐧𝐠!", event.threadID, event.messageID); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    }
  }
};
