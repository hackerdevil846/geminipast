const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "password",
    aliases: ["passgen", "pwdgen"],
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 10,
    role: 0,
    category: "🖼️ 𝑰𝒎𝒂𝒈𝒆 𝑪𝒓𝒆𝒂𝒕𝒊𝒐𝒏",
    shortDescription: {
      en: "🔑 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒊𝒎𝒂𝒈𝒆𝒔"
    },
    longDescription: {
      en: "🔑 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒊𝒎𝒂𝒈𝒆𝒔 𝒘𝒊𝒕𝒉 𝒄𝒖𝒔𝒕𝒐𝒎 𝒕𝒆𝒙𝒕"
    },
    guide: {
      en: "{𝑝}password [𝒕𝒆𝒙𝒕1] | [𝒕𝒆𝒙𝒕2]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Dependency check
      if (!createCanvas || !loadImage) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑐𝑎𝑛𝑣𝑎𝑠");
      if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");

      // Get user info
      const userInfo = await api.getUserInfo(event.senderID);
      const userName = userInfo[event.senderID].name;
      
      // Parse arguments
      const text = args.join(" ")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/(\s+\|)/g, "|")
        .replace(/\|\s+/g, "|")
        .split("|");
      
      if (!text[0] || !text[1]) {
        return api.sendMessage("✨ 𝑼𝒔𝒂𝒈𝒆: password [𝒕𝒆𝒙𝒕1] | [𝒕𝒆𝒙𝒕2]\n🔑 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: password 𝒇𝒂𝒄𝒆𝒃𝒐𝒐𝒌 | 𝟭𝟮𝟯𝟰𝟱𝟲", event.threadID, event.messageID);
      }

      // Paths and URLs
      const bgUrl = "https://i.imgur.com/QkddlpG.png";
      const fontUrl = "https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download";
      const imgPath = __dirname + `/cache/password_${event.senderID}.png`;
      const fontPath = __dirname + "/cache/SVN-Arial_2.ttf";

      // Create cache directory
      const cacheDir = __dirname + "/cache";
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download resources
      const [bgResponse, fontResponse] = await Promise.all([
        axios.get(bgUrl, { responseType: "arraybuffer" }),
        axios.get(fontUrl, { responseType: "arraybuffer" })
      ]);

      // Save files
      fs.writeFileSync(imgPath, Buffer.from(bgResponse.data));
      fs.writeFileSync(fontPath, Buffer.from(fontResponse.data));

      // Create canvas
      const baseImg = await loadImage(imgPath);
      const canvas = createCanvas(baseImg.width, baseImg.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

      // Register font
      registerFont(fontPath, { family: "PasswordFont" });

      // Text styling functions
      const applyTextStyle = (text, x, y, maxWidth) => {
        ctx.font = "bold 36px PasswordFont";
        ctx.fillStyle = "#2c3e50";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Text wrapping
        const words = text.split(' ');
        let line = '';
        let lines = [];
        let testLine;
        let metrics;
        
        for (let n = 0; n < words.length; n++) {
          testLine = line + words[n] + ' ';
          metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line.trim());
        
        // Draw lines
        const lineHeight = 40;
        const startY = y - (lines.length * lineHeight) / 2;
        
        lines.forEach((l, i) => {
          ctx.fillText(l, x, startY + (i * lineHeight));
        });
      };

      // Add texts with decoration
      ctx.beginPath();
      ctx.arc(320, 115, 90, 0, Math.PI * 2, true);
      ctx.strokeStyle = "#3498db";
      ctx.lineWidth = 3;
      ctx.stroke();
      
      applyTextStyle(text[0], 320, 130, 300);
      applyTextStyle(text[1], 320, 380, 300);
      
      // Add decorative elements
      ctx.beginPath();
      ctx.moveTo(100, 200);
      ctx.lineTo(540, 200);
      ctx.strokeStyle = "#e74c3c";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add user name
      ctx.font = "20px PasswordFont";
      ctx.fillStyle = "#8e44ad";
      ctx.textAlign = "right";
      ctx.fillText(`𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅 𝒇𝒐𝒓: ${userName}`, 600, 450);

      // Save and send
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(imgPath, buffer);
      
      return api.sendMessage({
        body: `🔑 𝒀𝒐𝒖𝒓 𝑷𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!\n✨ 𝑭𝒊𝒓𝒔𝒕 𝑻𝒆𝒙𝒕: ${text[0]}\n🔐 𝑺𝒆𝒄𝒐𝒏𝒅 𝑻𝒆𝒙𝒕: ${text[1]}`,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => {
        try {
          fs.unlinkSync(imgPath);
          fs.unlinkSync(fontPath);
        } catch (e) {}
      });
      
    } catch (error) {
      console.error("𝑷𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑬𝒓𝒓𝒐𝒓:", error);
      return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒊𝒎𝒂𝒈𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", event.threadID, event.messageID);
    }
  }
};
