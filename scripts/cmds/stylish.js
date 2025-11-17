const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');

module.exports = {
  config: {
    name: "stylish",
    aliases: ["banner", "textart"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "image",
    shortDescription: {
      en: "🎨 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑐𝑜𝑜𝑙 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑏𝑎𝑛𝑛𝑒𝑟 𝑓𝑟𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑡𝑒𝑥𝑡 𝑏𝑎𝑛𝑛𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑜𝑝𝑡𝑖𝑜𝑛𝑎𝑙 𝑎𝑣𝑎𝑡𝑎𝑟 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    guide: {
      en: "{p}stylish [𝑡𝑒𝑥𝑡] | 𝑟𝑒𝑝𝑙𝑦_𝑤𝑖𝑡ℎ_𝑖𝑚𝑎𝑔𝑒 𝑂𝑅 [𝑖𝑚𝑎𝑔𝑒_𝑢𝑟𝑙]"
    },
    countDown: 5,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  langs: {
    "en": {
      "no_text": "❗ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑎𝑛𝑛𝑒𝑟. 𝑈𝑠𝑎𝑔𝑒: {p}𝑠𝑡𝑦𝑙𝑖𝑠ℎ <𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡> ✍️",
      "generating": "🎨 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑏𝑎𝑛𝑛𝑒𝑟 — ℎ𝑎𝑛𝑔 𝑡𝑖𝑔ℎ𝑡! 🪄",
      "done": "✅ 𝐷𝑜𝑛𝑒 — ℎ𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑏𝑎𝑛𝑛𝑒𝑟!",
      "error": "⚠️ 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒."
    }
  },

  onLoad: function () {
    const cacheDir = path.join(__dirname, 'cache', 'stylish');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirpSync(cacheDir);
    }
  },

  onStart: async function ({ api, event, args, message, getText }) {
    try {
      const { threadID, messageID, senderID } = event;
      
      const text = args.length ? args.join(' ') : (event.messageReply && event.messageReply.body ? event.messageReply.body : null);
      if (!text) {
        const prefix = global.config?.PREFIX || '';
        return message.reply(getText("no_text").replace("{p}", prefix));
      }

      await message.reply(getText("generating") + " ⏳");

      let avatarBuffer = null;

      try {
        if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length) {
          const att = event.messageReply.attachments.find(a => a.type && a.type.startsWith('image')) || event.messageReply.attachments[0];
          if (att && att.url) {
            const response = await axios.get(att.url, { responseType: 'arraybuffer' });
            avatarBuffer = Buffer.from(response.data);
          }
        }

        if (!avatarBuffer && args.length) {
          const maybeUrl = args[0];
          if (maybeUrl && (maybeUrl.startsWith('http://') || maybeUrl.startsWith('https://')) && 
              (maybeUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) || maybeUrl.includes('googleusercontent') || maybeUrl.includes('fbcdn'))) {
            try {
              const response = await axios.get(maybeUrl, { responseType: 'arraybuffer' });
              avatarBuffer = Buffer.from(response.data);
              if (avatarBuffer) args.shift();
            } catch (e) {
              avatarBuffer = null;
            }
          }
        }

        if (!avatarBuffer) {
          try {
            const userInfo = await api.getUserInfo(senderID);
            const avatarUrl = userInfo[senderID]?.thumbSrc || userInfo[senderID]?.profileUrl;
            if (avatarUrl) {
              const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
              avatarBuffer = Buffer.from(response.data);
            }
          } catch (e) {
            avatarBuffer = null;
          }
        }
      } catch (e) {
        avatarBuffer = null;
      }

      const bannerBuffer = await this.drawBanner(text, avatarBuffer, { width: 1200, height: 480 });

      const cacheDir = path.join(__dirname, 'cache', 'stylish');
      const filePath = path.join(cacheDir, `stylish_${Date.now()}.png`);
      await fs.writeFile(filePath, bannerBuffer);

      const messageBody = `✨ 𝑅𝑒𝑠𝑢𝑙𝑡 𝑟𝑒𝑎𝑑𝑦! • ${text}\n\n${getText("done")}`;

      await message.reply({
        body: messageBody,
        attachment: fs.createReadStream(filePath)
      });

      fs.unlinkSync(filePath);

    } catch (error) {
      console.error("stylish command error:", error);
      message.reply(getText("error"));
    }
  },

  drawBanner: async function(text, avatarBuffer = null, options = {}) {
    const width = options.width || 1200;
    const height = options.height || 480;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.45, '#0ea5e9');
    grad.addColorStop(1, '#7c3aed');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for (let i = -height; i < width; i += 40) {
      ctx.fillRect(i, 0, 20, height);
    }

    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    this.roundRect(ctx, 40, 40, width - 80, height - 80, 24);
    ctx.fill();
    ctx.restore();

    const avatarSize = 320;
    const avatarX = 84;
    const avatarY = (height - avatarSize) / 2;
    
    if (avatarBuffer) {
      try {
        const avatarImg = await loadImage(avatarBuffer);
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 4, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fill();
        ctx.clip();
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 8, 0, Math.PI * 2);
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.stroke();
      } catch (err) {}
    }

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 18;

    let fontSize = 72;
    ctx.font = `bold ${fontSize}px Sans`;
    const maxTextWidth = avatarBuffer ? width - avatarSize - 220 : width - 160;

    while (ctx.measureText(text).width > maxTextWidth && fontSize > 28) {
      fontSize -= 4;
      ctx.font = `bold ${fontSize}px Sans`;
    }

    const tGrad = ctx.createLinearGradient(0, 0, maxTextWidth, 0);
    tGrad.addColorStop(0, '#ffffff');
    tGrad.addColorStop(1, '#ffd700');
    ctx.fillStyle = tGrad;

    const tx = avatarBuffer ? avatarX + avatarSize + 48 : 96;
    const ty = height / 2 + fontSize / 3;
    ctx.fillText(text, tx, ty);
    ctx.restore();

    ctx.save();
    ctx.font = '16px Sans';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    const credit = `𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 • 𝐺𝑜𝑎𝑡𝐵𝑜𝑡`;
    ctx.fillText(credit, width - ctx.measureText(credit).width - 40, height - 28);
    ctx.restore();

    return canvas.toBuffer('image/png');
  },

  roundRect: function(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
};
