const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const fs = require('fs-extra');
const request = require('request');

module.exports = {
  config: {
    name: "punch",
    aliases: [], // Unique names not used elsewhere
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝐸𝑖 𝑗𝑜𝑛𝑛𝑒𝑟 𝑛𝑎𝑚𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑒 𝑡𝑎𝑘𝑒 𝑚𝑎𝑟𝑎"
    },
    longDescription: {
      en: "𝐸𝑖 𝑗𝑜𝑛𝑛𝑒𝑟 𝑛𝑎𝑚𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑒 𝑡𝑎𝑘𝑒 𝑝𝑢𝑛𝑐ℎ 𝑘𝑜𝑟𝑢𝑛 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑒𝑓𝑓𝑒𝑐𝑡 𝑠𝑜ℎ𝑜"
    },
    guide: {
      en: "{𝑝}𝑝𝑢𝑛𝑐ℎ [@𝑡𝑎𝑔]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "request": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args, usersData }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!createCanvas || !loadImage || !axios || !request || !fs) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑥𝑖𝑜𝑠, 𝑟𝑒𝑞𝑢𝑒𝑠𝑡, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.", event.threadID, event.messageID);
      }

      const { threadID, messageID, mentions } = event;
      
      if (!mentions || !Object.keys(mentions).length) {
        return api.sendMessage("❌ 𝐷𝑎𝑦𝑎 𝑘𝑜𝑟𝑒 𝑘𝑎𝑢𝑘𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑢𝑛!", threadID, messageID);
      }

      const targetID = Object.keys(mentions)[0];
      const targetName = mentions[targetID].replace(/@/g, '');
      const attackerName = await usersData.getName(event.senderID);
      
      // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑐𝑎𝑛𝑣𝑎𝑠 𝑏𝑎𝑛𝑛𝑒𝑟
      const canvas = createCanvas(700, 250);
      const ctx = canvas.getContext('2d');
      
      // 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑔𝑟𝑎𝑑𝑖𝑒𝑛𝑡
      const gradient = ctx.createLinearGradient(0, 0, 700, 0);
      gradient.addColorStop(0, '#𝑓𝑓9966');
      gradient.addColorStop(1, '#𝑓𝑓5𝑒62');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 700, 250);
      
      // 𝑃𝑢𝑛𝑐ℎ 𝑡𝑒𝑥𝑡 𝑠𝑡𝑦𝑙𝑖𝑛𝑔
      ctx.font = '𝑏𝑜𝑙𝑑 60𝑝𝑥 "𝐴𝑟𝑖𝑎𝑙"';
      ctx.fillStyle = '#𝑓𝑓𝑓𝑓𝑓𝑓';
      ctx.textAlign = '𝑐𝑒𝑛𝑡𝑒𝑟';
      ctx.fillText('🥊 𝑃𝑈𝑁𝐶𝐻 𝐼𝑀𝑃𝐴𝐶𝑇 🥊', 350, 80);
      
      // 𝑈𝑠𝑒𝑟 𝑡𝑒𝑥𝑡 𝑠𝑡𝑦𝑙𝑖𝑛𝑔
      ctx.font = '30𝑝𝑥 "𝑆𝑒𝑔𝑜𝑒 𝑈𝐼"';
      ctx.fillText(`${attackerName} 𝑝𝑢𝑛𝑐ℎ𝑒𝑑 ${targetName}!`, 350, 150);
      
      // 𝐴𝑑𝑑 𝑑𝑒𝑐𝑜𝑟𝑎𝑡𝑖𝑣𝑒 𝑒𝑙𝑒𝑚𝑒𝑛𝑡𝑠
      ctx.beginPath();
      ctx.arc(100, 125, 40, 0, Math.PI * 2);
      ctx.strokeStyle = '#𝑓𝑓𝑓𝑓𝑓𝑓';
      ctx.lineWidth = 5;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(600, 125, 40, 0, Math.PI * 2);
      ctx.strokeStyle = '#𝑓𝑓𝑓𝑓𝑓𝑓';
      ctx.lineWidth = 5;
      ctx.stroke();
      
      // 𝑆𝑎𝑣𝑒 𝑐𝑎𝑛𝑣𝑎𝑠
      const bannerPath = __dirname + '/cache/punch_banner.png';
      const out = fs.createWriteStream(bannerPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      
      await new Promise((resolve) => out.on('finish', resolve));

      // 𝐺𝑒𝑡 𝑝𝑢𝑛𝑐ℎ 𝐺𝐼𝐹
      api.sendMessage("🔄 𝑃𝑢𝑛𝑐ℎ 𝑖𝑚𝑝𝑎𝑐𝑡 𝑙𝑜𝑎𝑑𝑖𝑛𝑔...", threadID, messageID);
      const gifRes = await axios.get('https://api.satou-chan.xyz/api/endpoint/punch');
      const gifUrl = gifRes.data.url;
      const ext = gifUrl.split('.').pop();
      const gifPath = __dirname + `/cache/punch.${ext}`;
      
      await new Promise((resolve, reject) => {
        request(gifUrl)
          .pipe(fs.createWriteStream(gifPath))
          .on('close', resolve)
          .on('error', reject);
      });

      // 𝑆𝑒𝑛𝑑 𝑐𝑜𝑚𝑏𝑖𝑛𝑒𝑑 𝑟𝑒𝑠𝑢𝑙𝑡
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      api.sendMessage({
        body: `🥊 𝑂𝑅𝐴 𝑂𝑅𝐴 𝑂𝑅𝐴! ${targetName}, 𝑌𝑂𝑈 𝐺𝑂𝑇 𝑃𝑈𝑁𝐶𝐻𝐸𝐷! 💥\n𝐵𝑦: ${attackerName}`,
        mentions: [{
          tag: targetName,
          id: targetID
        }],
        attachment: [
          fs.createReadStream(bannerPath),
          fs.createReadStream(gifPath)
        ]
      }, threadID, () => {
        fs.unlinkSync(bannerPath);
        fs.unlinkSync(gifPath);
      }, messageID);

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("😢 𝐺𝐼𝐹 𝑏𝑎𝑛𝑎𝑛𝑜𝑟 𝑘ℎ𝑎𝑚𝑎𝑟 ℎ𝑜𝑙𝑒𝑛𝑖! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", event.threadID, event.messageID);
    }
  }
};
