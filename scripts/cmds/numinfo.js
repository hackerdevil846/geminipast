const axios = require("axios");
const { createCanvas } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "numinfo",
    aliases: ["phoneinfo", "numberinfo"],
    version: "3.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 15,
    role: 0,
    category: "𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏",
    shortDescription: {
      en: "📱 𝑮𝒆𝒕 𝒅𝒆𝒕𝒂𝒊𝒍𝒆𝒅 𝒑𝒉𝒐𝒏𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏"
    },
    longDescription: {
      en: "📱 𝑮𝒆𝒕 𝒅𝒆𝒕𝒂𝒊𝒍𝒆𝒅 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒂𝒃𝒐𝒖𝒕 𝒂𝒏𝒚 𝒊𝒏𝒕𝒆𝒓𝒏𝒂𝒕𝒊𝒐𝒏𝒂𝒍 𝒑𝒉𝒐𝒏𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒘𝒊𝒕𝒉 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝒗𝒊𝒔𝒖𝒂𝒍 𝒑𝒓𝒆𝒔𝒆𝒏𝒕𝒂𝒕𝒊𝒐𝒏"
    },
    guide: {
      en: "{𝑝}numinfo [𝑖𝑛𝑡𝑒𝑟𝑛𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑝ℎ𝑜𝑛𝑒 𝑛𝑢𝑚𝑏𝑒𝑟]"
    },
    dependencies: {
      "axios": "",
      "canvas": "",
      "fs-extra": ""
    },
    envConfig: {
      API_KEY: "78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;

      // Dependency check
      if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
      if (!createCanvas) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑐𝑎𝑛𝑣𝑎𝑠");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");

      if (!args[0]) {
        return api.sendMessage(
          "📱 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂𝒏 𝒊𝒏𝒕𝒆𝒓𝒏𝒂𝒕𝒊𝒐𝒏𝒂𝒍 𝒑𝒉𝒐𝒏𝒆 𝒏𝒖𝒎𝒃𝒆𝒓!\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: numinfo +12124567890",
          threadID,
          messageID
        );
      }

      api.setMessageReaction("⌛", messageID, () => {}, true);

      let number = args[0].trim().replace(/[^\d+]/g, "");

      if (!number.startsWith("+") || number.length < 8) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage(
          "❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒇𝒐𝒓𝒎𝒂𝒕! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒖𝒔𝒆 𝒊𝒏𝒕𝒆𝒓𝒏𝒂𝒕𝒊𝒐𝒏𝒂𝒍 𝒇𝒐𝒓𝒎𝒂𝒕:\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: numinfo +12124567890",
          threadID,
          messageID
        );
      }

      const apiUrl = `https://telephone-number-info.p.rapidapi.com/rapidapi/telephone-number-info/index.php?phoneNumber=${encodeURIComponent(
        number
      )}`;
      const response = await axios.get(apiUrl, {
        headers: {
          "x-rapidapi-key": this.config.envConfig.API_KEY,
          "x-rapidapi-host": "telephone-number-info.p.rapidapi.com",
        },
        timeout: 20000,
      });

      const data = response.data;

      // Create styled image
      const imgPath = await createNumberInfoImage(data, number);

      api.setMessageReaction("✅", messageID, () => {}, true);

      const message = {
        body: `📱 𝑷𝒉𝒐𝒏𝒆 𝑵𝒖𝒎𝒃𝒆𝒓 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒇𝒐𝒓 ${number}\n━━━━━━━━━━━━━━━━━━`,
        attachment: fs.createReadStream(imgPath),
      };

      return api.sendMessage(message, threadID, messageID);
    } catch (error) {
      console.error("𝑵𝒖𝒎𝒊𝒏𝒇𝒐 𝑬𝒓𝒓𝒐𝒓:", error);
      api.setMessageReaction("❌", messageID, () => {}, true);

      let errorMsg = "❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒇𝒆𝒕𝒄𝒉 𝒏𝒖𝒎𝒃𝒆𝒓 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏\n\n";

      if (error.response) {
        errorMsg += `🔧 𝑺𝒆𝒓𝒗𝒆𝒓 𝑬𝒓𝒓𝒐𝒓: ${error.response.status}\n`;
        errorMsg += `📄 𝑹𝒆𝒔𝒑𝒐𝒏𝒔𝒆: ${
          error.response.data
            ? JSON.stringify(error.response.data).substring(0, 100)
            : "𝑵𝒐 𝒅𝒂𝒕𝒂"
        }`;
      } else if (error.request) {
        errorMsg += "⏱️ 𝑹𝒆𝒒𝒖𝒆𝒔𝒕 𝒕𝒊𝒎𝒆𝒅 𝒐𝒖𝒕. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.";
      } else {
        errorMsg += `⚠️ 𝑬𝒓𝒓𝒐𝒓: ${error.message}`;
      }

      return api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};

// ------------------ Helper Functions ------------------

async function createNumberInfoImage(data, number) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Add roundRect method safely
  if (!ctx.roundRect) {
    ctx.roundRect = function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };
  }

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0f2027");
  gradient.addColorStop(0.5, "#203a43");
  gradient.addColorStop(1, "#2c5364");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Pattern
  drawPattern(ctx, width, height);

  // Header
  ctx.fillStyle = "#ffffff";
  ctx.font = 'bold 40px "Segoe UI"';
  ctx.fillText("📱 𝑷𝑯𝑶𝑵𝑬 𝑵𝑼𝑴𝑩𝑬𝑹 𝑰𝑵𝑭𝑶𝑹𝑴𝑨𝑻𝑰𝑶𝑵", 50, 70);

  // Number
  ctx.fillStyle = "#4ecdc4";
  ctx.font = 'bold 36px "Segoe UI"';
  ctx.fillText(number, 50, 120);

  // Divider
  ctx.beginPath();
  ctx.moveTo(40, 150);
  ctx.lineTo(width - 40, 150);
  ctx.strokeStyle = "#4ecdc4";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Cards
  const cardData = [
    { icon: "🌎", title: "𝑪𝒐𝒖𝒏𝒕𝒓𝒚", key: "country" },
    { icon: "🏙️", title: "𝑳𝒐𝒄𝒂𝒕𝒊𝒐𝒏", key: "location" },
    { icon: "📶", title: "𝑪𝒂𝒓𝒓𝒊𝒆𝒓", key: "carrier" },
    { icon: "🕒", title: "𝑻𝒊𝒎𝒆𝒛𝒐𝒏𝒆", key: "timezone" },
    { icon: "🔍", title: "𝑽𝒂𝒍𝒊𝒅", key: "is_valid" },
    { icon: "📡", title: "𝑳𝒊𝒏𝒆 𝑻𝒚𝒑𝒆", key: "line_type" },
  ];

  let yPos = 190;
  const cardWidth = 700;
  const cardHeight = 60;

  for (const card of cardData) {
    if (data[card.key]) {
      drawInfoCard(
        ctx,
        card.icon,
        card.title,
        String(data[card.key]),
        yPos,
        cardWidth,
        cardHeight
      );
      yPos += cardHeight + 15;
    }
  }

  // Footer
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = 'italic 16px "Segoe UI"';
  ctx.fillText(
    "𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒑𝒓𝒐𝒗𝒊𝒅𝒆𝒅 𝒃𝒚 𝑻𝒆𝒍𝒆𝒑𝒉𝒐𝒏𝒆 𝑵𝒖𝒎𝒃𝒆𝒓 𝑰𝒏𝒇𝒐 𝑨𝑷𝑰 • 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    100,
    height - 20
  );

  // Border
  ctx.strokeStyle = "#4ecdc4";
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Save image
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  const imgPath = path.join(cacheDir, `numinfo_${Date.now()}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(imgPath, buffer);

  return imgPath;
}

function drawPattern(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;

  // Grid
  for (let x = 0; x < width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Circles
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 5 + Math.random() * 30;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawInfoCard(ctx, icon, title, value, y, width, height) {
  const x = 50;

  // Background
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.roundRect(x, y, width, height, 15).fill();

  // Border
  ctx.strokeStyle = "rgba(78, 205, 196, 0.5)";
  ctx.lineWidth = 1;
  ctx.roundRect(x, y, width, height, 15).stroke();

  // Icon
  ctx.fillStyle = "#4ecdc4";
  ctx.font = '28px "Segoe UI"';
  ctx.fillText(icon, x + 20, y + 40);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = 'bold 22px "Segoe UI"';
  ctx.fillText(title, x + 60, y + 40);

  // Value
  ctx.fillStyle = "#ff6b6b";
  ctx.font = '22px "Segoe UI"';
  const valueX = x + width - 30 - ctx.measureText(value).width;
  ctx.fillText(value, valueX, y + 40);
}
