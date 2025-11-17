const u = ["https://imgur.com/WoD5OoQ.png","https://imgur.com/x0QrTlQ.png","https://i.imgur.com/PPzdY41.png"];
const f = ["https://imgur.com/28aiYVA.png","https://imgur.com/vCO8LPL.png","https://imgur.com/OGxx1I4.png","https://imgur.com/S9igFa6.png"];
const g = ["https://imgur.com/R1Nc9Lz.png","https://imgur.com/yd0svOU.png","https://imgur.com/0MXw7eG.png","https://imgur.com/HYeoGia.png","https://imgur.com/KlLrw0y.png","https://imgur.com/B42txfi.png","https://imgur.com/JkunRCG.png","https://imgur.com/yHueKan.png","https://imgur.com/z2RpozR.png"];
const h = ["https://imgur.com/WspyTeK.png","https://imgur.com/2sGb8UV.png","https://imgur.com/YvuMkJ0.png","https://imgur.com/NF8nB3U.png","https://imgur.com/388n5TF.png","https://imgur.com/WcWC8z8.png","https://imgur.com/2sCe8GO.png","https://imgur.com/eDYbG9F.png","https://imgur.com/4n8FlLJ.png","https://imgur.com/rGV8aYs.png"];
const s = ["https://imgur.com/Dkco1Xz.png","https://imgur.com/Tmpw6me.png","https://imgur.com/C2HKEHu.png","https://imgur.com/BAEKMdK.png","https://imgur.com/LIH4YYl.png","https://imgur.com/vWE3V9T.png","https://imgur.com/nJ2qpiY.png","https://imgur.com/duis8N4.png","https://imgur.com/i3QC0eV.png","https://imgur.com/V7ji4IG.png","https://imgur.com/lAXMleJ.png","https://imgur.com/jYBBTuf.png","https://imgur.com/s0oBwea.png","https://imgur.com/nwJbpwR.png","https://imgur.com/jwVRzrk.png","https://imgur.com/tr5JHav.png","https://imgur.com/pSxLPtt.png","https://imgur.com/hsZ8GHY.png","https://imgur.com/Jb8lxQn.png","https://imgur.com/SLr5fGm.png","https://imgur.com/RqjgA57.png"];
const w = ["https://imgur.com/ky7Iu2t.png","https://imgur.com/1zZcchN.png","https://imgur.com/EidGfcr.png","https://imgur.com/Kmt9Hiz.png","https://imgur.com/wYimMMU.png","https://imgur.com/kKBLKIg.png","https://imgur.com/BSoFwWi.png","https://imgur.com/0eOJSp7.png","https://imgur.com/UlUnVdU.png","https://imgur.com/PQRrAOt.png","https://imgur.com/GhUBZnz.png"];

module.exports = {
  config: {
    name: "lq",
    aliases: ["aovcustom", "customavatar"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🎮 𝐶𝑟𝑒𝑎𝑡𝑒 𝐴𝑜𝑉 𝑐𝑢𝑠𝑡𝑜𝑚 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒𝑑 𝐴𝑟𝑒𝑛𝑎 𝑜𝑓 𝑉𝑎𝑙𝑜𝑟 𝑎𝑣𝑎𝑡𝑎𝑟 𝑤𝑖𝑡ℎ 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑜𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    guide: {
      en: "{p}lq + 𝑟𝑒𝑝𝑙𝑦 𝑖𝑚𝑎𝑔𝑒"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": "",
      "moment-timezone": ""
    }
  },

  onStart: async function ({ event, message, args }) {
    try {
      const axios = require('axios');
      var i = args.join(" ");

      if (!i && event.type == 'message_reply') {
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0)
          return message.reply('🌸 𝑌𝑜𝑢 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 🌸');
        if (event.messageReply.attachments.length > 1) return message.reply('𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑜𝑛𝑙𝑦 𝑜𝑛𝑒 𝑖𝑚𝑎𝑔𝑒!');
        if (event.messageReply.attachments[0].type != 'photo')
          return message.reply('🌸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑜𝑛𝑙𝑦 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 🌸');

        i = event.messageReply.attachments[0].url;
      } else if (!i) {
        i = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      } else {
        if (i.indexOf('http') == -1) {
          i = 'https://' + i;
        }
      }
      
      return message.reply('🌸 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑛𝑎𝑚𝑒 🌸', (err, info) => {
        global.client.handleReply.push({
          step: 1,
          name: this.config.name,
          messageID: info.messageID,
          anh: i,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("𝐿𝑄 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑!");
    }
  },

  onReply: async function ({ event, message, handleReply }) {
    try {
      const fs = require('fs-extra');
      const { loadImage, createCanvas } = require("canvas");
      const axios = require('axios');
      const Canvas = require('canvas');
      const path = require('path');

      let pathImg = __dirname + `/cache/avatar_1111231.png`;
      let pathAva = __dirname + `/cache/avatar_3dsc11.png`;
      let pathBS = __dirname + `/cache/avatar_3ssssc11.png`;
      let pathtop = __dirname + `/cache/avatar_3sscxssc11.png`;
      let paththaku = __dirname + `/cache/avatar_3oxsscxssc11.png`;
      let pathtph = __dirname + `/cache/avatar_xv3oxsscxssc11.png`;
      let pathx = __dirname + `/cache/avas_123456`;

      const { threadID, messageID, senderID } = event;

      if (!fs.existsSync(__dirname + `/cache/ArialUnicodeMS.ttf`)) {
        let getfont = (await axios.get(`https://github.com/kenyrm2250/font/blob/main/ArialUnicodeMS.ttf?raw=true`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `/cache/ArialUnicodeMS.ttf`, Buffer.from(getfont, "utf-8"));
      }

      if (event.senderID != handleReply.author) return message.reply("🌸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑙𝑒𝑡 𝑜𝑡ℎ𝑒𝑟𝑠 𝑐𝑟𝑒𝑎𝑡𝑒 𝑡ℎ𝑒𝑖𝑟 𝑜𝑤𝑛 𝑖𝑚𝑎𝑔𝑒𝑠 🌸");

      // Step 1: Character name
      if (handleReply.step == 1) {
        message.unsendMessage(handleReply.messageID);
        var x = [];
        for (let e = 0; e < u.length; e++) {
          const t = (await axios.get(`${u[e]}`, { responseType: "stream" })).data;
          x.push(t);
        }
        var msg = ({
          body: `🌸 𝑌𝑜𝑢 𝑗𝑢𝑠𝑡 𝑐ℎ𝑜𝑠𝑒 𝑡ℎ𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑛𝑎𝑚𝑒 ${event.body}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑐ℎ𝑜𝑜𝑠𝑒 𝑡ℎ𝑒 𝑟𝑎𝑛𝑘 𝑓𝑟𝑎𝑚𝑒 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 🌸\n🔥 𝐼𝑚𝑎𝑔𝑒 1 𝑖𝑠 "𝑀𝑎𝑠𝑡𝑒𝑟"\n🌈 𝐼𝑚𝑎𝑔𝑒 2 𝑖𝑠 "𝐶ℎ𝑎𝑚𝑝𝑖𝑜𝑛"\n⚜️ 𝐼𝑚𝑎𝑔𝑒 3 𝑖𝑠 "𝐶ℎ𝑎𝑙𝑙𝑒𝑛𝑔𝑒𝑟"`,
          attachment: x
        });
        return message.reply(msg, (err, info) => {
          global.client.handleReply.push({
            step: 2,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: event.body,
            author: event.senderID
          });
        });
      }
      // Step 2: Rank frame
      else if (handleReply.step == 2) {
        if (isNaN(event.body)) return;
        message.unsendMessage(handleReply.messageID);
        var l = [];
        for (let e = 0; e < f.length; e++) {
          const t = (await axios.get(`${f[e]}`, { responseType: "stream" })).data;
          l.push(t);
        }
        var msg = ({
          body: `🌸 𝑌𝑜𝑢 𝑗𝑢𝑠𝑡 𝑐ℎ𝑜𝑠𝑒 𝑓𝑟𝑎𝑚𝑒 ${event.body == 1 ? "𝑀𝑎𝑠𝑡𝑒𝑟" : event.body == "2" ? "𝐶ℎ𝑎𝑚𝑝𝑖𝑜𝑛" : "𝐶ℎ𝑎𝑙𝑙𝑒𝑛𝑔𝑒𝑟"}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒 𝑐𝑜𝑚𝑝𝑎𝑛𝑖𝑜𝑛 🌸`,
          attachment: l
        });
        return message.reply(msg, (err, info) => {
          global.client.handleReply.push({
            step: 3,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: event.body,
            author: event.senderID
          });
        });
      }
      // Step 3: Companion
      else if (handleReply.step == 3) {
        if (isNaN(event.body)) return;
        message.unsendMessage(handleReply.messageID);
        var l = [];
        for (let e = 0; e < g.length; e++) {
          const t = (await axios.get(`${g[e]}`, { responseType: "stream" })).data;
          l.push(t);
        }
        var msg = ({
          body: `🌸 𝑌𝑜𝑢 𝑗𝑢𝑠𝑡 𝑐ℎ𝑜𝑠𝑒 𝑦𝑜𝑢𝑟 𝑐𝑜𝑚𝑝𝑎𝑛𝑖𝑜𝑛 𝑎𝑠 ${event.body == 1 ? "𝐵𝑟𝑜𝑡ℎ𝑒𝑟𝑠" : event.body == "2" ? "𝐹𝑟𝑖𝑒𝑛𝑑𝑠" : event.body == "3" ? "𝐶𝑜𝑢𝑝𝑙𝑒" : event.body == "4" ? "𝑆𝑖𝑠𝑡𝑒𝑟𝑠" : "𝑢𝑛𝑘𝑛𝑜𝑤𝑛"}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑐ℎ𝑜𝑜𝑠𝑒 𝑡ℎ𝑒 𝑝𝑟𝑜𝑓𝑖𝑐𝑖𝑒𝑛𝑐𝑦 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 🌸`,
          attachment: l
        });
        return message.reply(msg, (err, info) => {
          global.client.handleReply.push({
            step: 4,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: event.body,
            author: event.senderID
          });
        });
      }
      // Step 4: Proficiency
      else if (handleReply.step == 4) {
        if (isNaN(event.body)) return;
        message.unsendMessage(handleReply.messageID);
        var l = [];
        for (let e = 0; e < h.length; e++) {
          const t = (await axios.get(`${h[e]}`, { responseType: "stream" })).data;
          l.push(t);
        }
        var msg = ({
          body: `🌸 𝑌𝑜𝑢 𝑗𝑢𝑠𝑡 𝑐ℎ𝑜𝑠𝑒 𝑝𝑟𝑜𝑓𝑖𝑐𝑖𝑒𝑛𝑐𝑦 𝑎𝑠 ${event.body == 1 ? "𝐺𝑟𝑎𝑑𝑒 𝐷" : event.body == 2 ? "𝐺𝑟𝑎𝑑𝑒 𝐶" : event.body == 3 ? "𝐺𝑟𝑎𝑑𝑒 𝐵" : event.body == 4 ? "𝐺𝑟𝑎𝑑𝑒 𝐴" : event.body == 5 ? "𝐺𝑟𝑎𝑑𝑒 𝑆" : event.body == 6 ? "𝑇𝑜𝑝 𝑅𝑒𝑔𝑖𝑜𝑛" : event.body == 7 ? "𝑇𝑜𝑝 𝑍𝑜𝑛𝑒" : event.body == 8 ? "𝑇𝑜𝑝 𝑉𝑖𝑒𝑡𝑛𝑎𝑚" : "𝑇𝑜𝑝 1"}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑐ℎ𝑜𝑜𝑠𝑒 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝑠𝑝𝑒𝑙𝑙𝑠 🌸`,
          attachment: l
        });
        return message.reply(msg, (err, info) => {
          global.client.handleReply.push({
            step: 5,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: event.body,
            author: event.senderID
          });
        });
      }
      // Step 5: Support spells
      else if (handleReply.step == 5) {
        if (isNaN(event.body)) return;
        message.unsendMessage(handleReply.messageID);
        var l = [];
        for (let e = 0; e < s.length; e++) {
          const t = (await axios.get(`${s[e]}`, { responseType: "stream" })).data;
          l.push(t);
        }
        var msg = ({
          body: `🌸 𝑌𝑜𝑢 𝑗𝑢𝑠𝑡 𝑐ℎ𝑜𝑠𝑒 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝑠𝑝𝑒𝑙𝑙𝑠 𝑎𝑠 ${event.body == 1 ? "𝐸𝑥𝑝𝑙𝑜𝑠𝑖𝑜𝑛" : event.body == 2 ? "𝑇𝑜𝑤𝑒𝑟 𝐷𝑖𝑠𝑎𝑏𝑙𝑒" : event.body == 3 ? "𝑅𝑒𝑠𝑐𝑢𝑒" : event.body == 4 ? "𝑅𝑜𝑎𝑟" : event.body == 5 ? "𝑆𝑡𝑢𝑛" : event.body == 6 ? "𝑊𝑒𝑎𝑘𝑛𝑒𝑠𝑠" : event.body == 7 ? "𝑃𝑢𝑟𝑖𝑓𝑦" : event.body == 8 ? "𝐹𝑙𝑎𝑠ℎ" : event.body == 9 ? "𝑆𝑝𝑟𝑖𝑛𝑡" : "𝑃𝑢𝑛𝑖𝑠ℎ"}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑐ℎ𝑜𝑜𝑠𝑒 𝑡ℎ𝑒 𝑠𝑘𝑖𝑛 𝑡𝑖𝑒𝑟 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 🌸`,
          attachment: l
        });
        return message.reply(msg, (err, info) => {
          global.client.handleReply.push({
            step: 6,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: handleReply.kynang,
            botro: event.body,
            author: event.senderID
          });
        });
      }
      // Step 6: Skin tier
      else if (handleReply.step == 6) {
        if (isNaN(event.body)) return;
        message.unsendMessage(handleReply.messageID);
        var l = [];
        for (let e = 0; e < w.length; e++) {
          const t = (await axios.get(`${w[e]}`, { responseType: "stream" })).data;
          l.push(t);
        }
        var msg = ({
          body: `🌸 𝑌𝑜𝑢 𝑗𝑢𝑠𝑡 𝑐ℎ𝑜𝑠𝑒 𝑠𝑘𝑖𝑛 𝑡𝑖𝑒𝑟 ${event.body}, 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑐ℎ𝑜𝑜𝑠𝑒 𝑏𝑎𝑑𝑔𝑒 🌸`,
          attachment: l
        });
        return message.reply(msg, (err, info) => {
          global.client.handleReply.push({
            step: 7,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: handleReply.kynang,
            botro: handleReply.botro,
            bacsk: event.body,
            author: event.senderID
          });
        });
      }
      // Step 7: Badge
      else if (handleReply.step == 7) {
        message.unsendMessage(handleReply.messageID);
        return message.reply("🌸 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 ℎ𝑒𝑟𝑜 𝑛𝑎𝑚𝑒 🌸", (err, info) => {
          global.client.handleReply.push({
            step: 8,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: handleReply.kynang,
            botro: handleReply.botro,
            bacsk: handleReply.bacsk,
            phuhieu: event.body,
            author: event.senderID
          });
        });
      }
      // Step 8: Hero name
      else if (handleReply.step == 8) {
        message.unsendMessage(handleReply.messageID);
        return message.reply("🌸 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑎𝑛𝑑 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑠𝑘𝑖𝑛 𝑛𝑎𝑚𝑒 🌸", (err, info) => {
          global.client.handleReply.push({
            step: 9,
            name: "lq",
            messageID: info.messageID,
            anh: handleReply.anh,
            ten: handleReply.ten,
            khung: handleReply.khung,
            triky: handleReply.triky,
            kynang: handleReply.kynang,
            botro: handleReply.botro,
            bacsk: handleReply.bacsk,
            phuhieu: handleReply.phuhieu,
            tentuong: event.body,
            author: event.senderID,
          });
        });
      }
      // Step 9: Final creation
      else if (handleReply.step == 9) {
        const ten = handleReply.ten;
        const khung = handleReply.khung;
        const triky = handleReply.triky;
        const kynang = handleReply.kynang;
        const botro = handleReply.botro;
        message.unsendMessage(handleReply.messageID);

        let background = (await axios.get(encodeURI(`${u[handleReply.khung - 1]}`), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
        let ava = (await axios.get(encodeURI(`${handleReply.anh}`), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathAva, Buffer.from(ava, "utf-8"));
        let bacsk123 = (await axios.get(encodeURI(`${s[handleReply.bacsk - 1]}`), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathx, Buffer.from(bacsk123, "utf-8"));
        let botro123 = (await axios.get(encodeURI(`${h[handleReply.botro - 1]}`), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathBS, Buffer.from(botro123, "utf-8"));
        let bactop123 = (await axios.get(encodeURI(`${g[handleReply.kynang - 1]}`), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathtop, Buffer.from(bactop123, "utf-8"));
        let phu1hieu1232 = (await axios.get(encodeURI(`${w[handleReply.phuhieu - 1]}`), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(paththaku, Buffer.from(phu1hieu1232, "utf-8"));
        let banbe = (await axios.get(encodeURI(`${f[handleReply.triky - 1]}`), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathtph, Buffer.from(banbe, "utf-8"));

        let a = await loadImage(pathImg);
        let az = await loadImage(pathtop);
        let a2 = await loadImage(pathBS);
        let a3 = await loadImage(pathx);
        let a4 = await loadImage(pathtph);
        let a5 = await loadImage(paththaku);
        let a6 = await loadImage(pathAva);

        let canvas = createCanvas(a.width, a.height);
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Canvas.registerFont(__dirname + `/cache/ArialUnicodeMS.ttf`, { family: "Arial" });

        ctx.drawImage(a6, 0, 0, 720, 890);
        ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
        var btw = 128;
        ctx.drawImage(a2, canvas.width / 2 - btw / 2, 905, btw, btw);
        ctx.drawImage(az, 15, 10, az.width, az.height);
        ctx.drawImage(a4, 108, 930, 90 * 27 / 24, 90);
        ctx.drawImage(a5, 473, 897, 143, 143);
        ctx.save();
        var a3scale = 2;
        ctx.drawImage(a3, canvas.width / 2 - a3.width * a3scale / 2, 510, a3.width * a3scale, a3.height * a3scale);
        ctx.restore();

        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "#f7ecb4";
        ctx.font = "50px Arial";
        ctx.fillText(handleReply.ten, canvas.width / 2, 857);
        ctx.restore();

        ctx.save();
        ctx.textAlign = "center";
        ctx.shadowColor = "black";
        ctx.fillStyle = "#5d9af6";
        ctx.font = "50px Arial";
        ctx.lineWidth = 10;
        ctx.lineJoin = "round";
        ctx.strokeText(handleReply.tentuong, canvas.width / 2, 770);
        ctx.fillText(handleReply.tentuong, canvas.width / 2, 770);
        ctx.restore();

        ctx.save();
        ctx.textAlign = "center";
        ctx.shadowColor = "black";
        ctx.fillStyle = "#f7ecb4";
        ctx.font = "50px Arial";
        ctx.lineWidth = 10;
        ctx.lineJoin = "round";
        ctx.strokeText(event.body, canvas.width / 2, 700);
        ctx.fillText(event.body, canvas.width / 2, 700);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        return message.reply({
          body: `🌸 𝐼𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 🌸\n\n⚜️ 𝐼𝑛𝑔𝑎𝑚𝑒: ${ten}\n🛡 𝐹𝑟𝑎𝑚𝑒: ${khung == 1 ? "𝑀𝑎𝑠𝑡𝑒𝑟" : khung == "2" ? "𝐶ℎ𝑎𝑚𝑝𝑖𝑜𝑛" : "𝐶ℎ𝑎𝑙𝑙𝑒𝑛𝑔𝑒𝑟"}\n💕 𝐶𝑜𝑚𝑝𝑎𝑛𝑖𝑜𝑛: ${triky == 1 ? "𝐵𝑟𝑜𝑡ℎ𝑒𝑟𝑠" : triky == "2" ? "𝐹𝑟𝑖𝑒𝑛𝑑𝑠" : triky == "3" ? "𝐶𝑜𝑢𝑝𝑙𝑒" : triky == "4" ? "𝑆𝑖𝑠𝑡𝑒𝑟𝑠" : "𝑢𝑛𝑘𝑛𝑜𝑤𝑛"}\n🔥 𝑃𝑟𝑜𝑓𝑖𝑐𝑖𝑒𝑛𝑐𝑦: ${kynang == 1 ? "𝐺𝑟𝑎𝑑𝑒 𝐷" : kynang == "2" ? "𝐺𝑟𝑎𝑑𝑒 𝐶" : kynang == "3" ? "𝐺𝑟𝑎𝑑𝑒 𝐵" : kynang == "4" ? "𝐺𝑟𝑎𝑑𝑒 𝐴" : kynang == "5" ? "𝐺𝑟𝑎𝑑𝑒 𝑆" : kynang == "6" ? "𝑇𝑜𝑝 𝑅𝑒𝑔𝑖𝑜𝑛" : kynang == "7" ? "𝑇𝑜𝑝 𝑍𝑜𝑛𝑒" : kynang == "8" ? "𝑇𝑜𝑝 𝑉𝑖𝑒𝑡𝑛𝑎𝑚" : "𝑇𝑜𝑝 1"}\n👑 𝑆𝑢𝑝𝑝𝑜𝑟𝑡: ${botro == 1 ? "𝐸𝑥𝑝𝑙𝑜𝑠𝑖𝑜𝑛" : botro == "2" ? "𝑇𝑜𝑤𝑒𝑟 𝐷𝑖𝑠𝑎𝑏𝑙𝑒" : botro == "3" ? "𝑅𝑒𝑠𝑐𝑢𝑒" : botro == "4" ? "𝑅𝑜𝑎𝑟" : botro == "5" ? "𝑆𝑡𝑢𝑛" : botro == "6" ? "𝑊𝑒𝑎𝑘𝑛𝑒𝑠𝑠" : botro == "7" ? "𝑃𝑢𝑟𝑖𝑓𝑦" : botro == "8" ? "𝐹𝑙𝑎𝑠ℎ" : botro == "9" ? "𝑆𝑝𝑟𝑖𝑛𝑡" : "𝑃𝑢𝑛𝑖𝑠ℎ"}`,
          attachment: fs.createReadStream(pathImg)
        }, () => {
          // Clean up files
          [pathImg, pathAva, pathBS, pathtop, paththaku, pathx, pathtph].forEach(file => {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
        });
      }
    } catch (e) {
      console.log(e);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑑𝑢𝑟𝑖𝑛𝑔 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔!");
    }
  }
};
