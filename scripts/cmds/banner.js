const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Define the toStylishFont function
const toStylishFont = (text) => {
  const map = {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ',
    'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
    'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ',
    'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ',
    'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
    'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ',
    'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ', 'J': 'ᴊ',
    'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ',
    'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ', 'S': 's', 'T': 'ᴛ',
    'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
  };
  return text.replace(/[a-zA-Z]/g, char => map[char] || char);
};

module.exports = {
  config: {
    name: "banner",
    aliases: [],
    version: "1.0.2",
    author: "Asif Mahmud",
    countDown: 10,
    role: 0,
    category: "media",
    shortDescription: {
      en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖼𝗎𝗌𝗍𝗈𝗆 𝖻𝖺𝗇𝗇𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌"
    },
    longDescription: {
      en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖼𝗎𝗌𝗍𝗈𝗆𝗂𝗓𝖾𝖽 𝖻𝖺𝗇𝗇𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝖺𝗇𝗂𝗆𝖾 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 𝖺𝗇𝖽 𝗍𝖾𝗑𝗍"
    },
    guide: {
      en: "{𝗉}𝖻𝖺𝗇𝗇𝖾𝗋 [𝗇𝗎𝗆𝖻𝖾𝗋]|[𝗇𝖺𝗆𝖾𝟣]|[𝗇𝖺𝗆𝖾𝟤]|[𝗇𝖺𝗆𝖾𝟥]|[𝖼𝗈𝗅𝗈𝗋]"
    },
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": "",
      "path": ""
    }
  },

  onStart: async function ({ event, message, args }) {
    try {
      // Check dependencies
      let dependenciesAvailable = true;
      try {
        require("fs-extra");
        require("axios");
        require("canvas");
        require("path");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
      }

      if (!args[0]) {
        const helpMessage = toStylishFont("𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾: 𝖻𝖺𝗇𝗇𝖾𝗋 [𝗇𝗎𝗆𝖻𝖾𝗋]|[𝗇𝖺𝗆𝖾𝟣]|[𝗇𝖺𝗆𝖾𝟤]|[𝗇𝖺𝗆𝖾𝟥]|[𝖼𝗈𝗅𝗈𝗋]\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖻𝖺𝗇𝗇𝖾𝗋 𝟣|𝖠𝗌𝗂𝖿|𝖡𝗈𝗍|𝖣𝖾𝗏|#𝖿𝖿𝟢𝟢𝟢𝟢");
        return message.reply(helpMessage);
      }

      const inputs = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
      const text1 = inputs[0] || "21";
      const text2 = inputs[1] || "";
      const text3 = inputs[2] || "";
      const text4 = inputs[3] || "";
      const color = inputs[4] || "";
      
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache', 'banner');
      try {
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
      } catch (dirError) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
      }
      
      // Get character data with fallback
      let lengthchar;
      try {
        const response = await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864', { timeout: 30000 });
        lengthchar = response.data;
        console.log("✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗅𝗈𝖺𝖽𝖾𝖽 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝖽𝖺𝗍𝖺");
      } catch (error) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝖽𝖺𝗍𝖺, 𝗎𝗌𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄:", error.message);
        // Fallback data if API fails
        lengthchar = [
          { imgAnime: "https://i.imgur.com/Ch778s2.png", colorBg: "#ff0000" },
          { imgAnime: "https://i.imgur.com/Ch778s2.png", colorBg: "#00ff00" },
          { imgAnime: "https://i.imgur.com/Ch778s2.png", colorBg: "#0000ff" }
        ];
      }
      
      const charNum = parseInt(text1);
      if (isNaN(charNum) || charNum < 1 || charNum > lengthchar.length) {
        const errorMsg = `❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝗈𝗈𝗌𝖾 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 𝟣 𝖺𝗇𝖽 ${lengthchar.length}`;
        return message.reply(errorMsg);
      }
      
      const timestamp = Date.now();
      const pathImg = path.join(cacheDir, `banner_${timestamp}_1.png`);
      const pathAva = path.join(cacheDir, `banner_${timestamp}_2.png`);
      
      // Download anime avatar with error handling
      try {
        console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗇𝗂𝗆𝖾 𝖺𝗏𝖺𝗍𝖺𝗋: ${lengthchar[charNum - 1].imgAnime}`);
        const avtAnime = await axios.get(encodeURI(lengthchar[charNum - 1].imgAnime), { 
          responseType: "arraybuffer",
          timeout: 30000 
        });
        fs.writeFileSync(pathAva, Buffer.from(avtAnime.data, "utf-8"));
        console.log("✅ 𝖠𝗇𝗂𝗆𝖾 𝖺𝗏𝖺𝗍𝖺𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
      } catch (error) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗇𝗂𝗆𝖾 𝖺𝗏𝖺𝗍𝖺𝗋:", error.message);
        // Use fallback image if download fails
        try {
          const fallbackImage = await axios.get("https://i.imgur.com/Ch778s2.png", { 
            responseType: "arraybuffer",
            timeout: 30000 
          });
          fs.writeFileSync(pathAva, Buffer.from(fallbackImage.data, "utf-8"));
          console.log("✅ 𝖴𝗌𝖾𝖽 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖺𝗇𝗂𝗆𝖾 𝖺𝗏𝖺𝗍𝖺𝗋");
        } catch (fallbackError) {
          console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖺𝗏𝖺𝗍𝖺𝗋:", fallbackError.message);
          return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗇𝗂𝗆𝖾 𝖺𝗏𝖺𝗍𝖺𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
      }
      
      // Download background with error handling
      try {
        console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾");
        const background = await axios.get(encodeURI("https://imgur.com/Ch778s2.png"), { 
          responseType: "arraybuffer",
          timeout: 30000 
        });
        fs.writeFileSync(pathImg, Buffer.from(background.data, "utf-8"));
        console.log("✅ 𝖡𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
      } catch (error) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽:", error.message);
        // Create a simple background if download fails
        try {
          const canvas = createCanvas(2000, 1000);
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#e6b030";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const buffer = canvas.toBuffer('image/png');
          fs.writeFileSync(pathImg, buffer);
          console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽");
        } catch (canvasError) {
          console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽:", canvasError.message);
          return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
      }
      
      // Download fonts with error handling
      const fontFiles = {
        'PastiOblique-7B0wK.otf': 'https://github.com/hanakuUwU/font/raw/main/PastiOblique-7B0wK.otf',
        'gantellinesignature-bw11b.ttf': 'https://github.com/hanakuUwU/font/raw/main/gantellinesignature-bw11b.ttf',
        'UTM Bebas.ttf': 'https://github.com/hanakuUwU/font/raw/main/UTM%20Bebas.ttf'
      };
      
      const fontDir = path.join(__dirname, 'cache', 'fonts');
      try {
        if (!fs.existsSync(fontDir)) {
          fs.mkdirSync(fontDir, { recursive: true });
        }
      } catch (fontDirError) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖿𝗈𝗇𝗍 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", fontDirError);
      }
      
      let fontsDownloaded = 0;
      for (const [fontName, fontUrl] of Object.entries(fontFiles)) {
        const fontPath = path.join(fontDir, fontName);
        if (!fs.existsSync(fontPath)) {
          try {
            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗈𝗇𝗍: ${fontName}`);
            const fontData = await axios.get(fontUrl, { 
              responseType: "arraybuffer",
              timeout: 30000 
            });
            fs.writeFileSync(fontPath, Buffer.from(fontData.data, "utf-8"));
            fontsDownloaded++;
            console.log(`✅ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗈𝗇𝗍: ${fontName}`);
          } catch (error) {
            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗈𝗇𝗍 ${fontName}:`, error.message);
          }
        }
      }
      
      if (fontsDownloaded > 0) {
        console.log(`✅ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 ${fontsDownloaded} 𝖿𝗈𝗇𝗍𝗌`);
      }
      
      const color_ = (color === "no" || color === "No" || color === "") 
          ? lengthchar[charNum - 1].colorBg 
          : color;
      
      // Load images and create canvas
      let a, ab;
      try {
        a = await loadImage(pathImg);
        ab = await loadImage(pathAva);
      } catch (loadError) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌:", loadError.message);
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
      }
      
      let canvas = createCanvas(a.width, a.height);
      let ctx = canvas.getContext("2d");
      
      ctx.fillStyle = "#e6b030";
      ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(ab, 1500, -400, 1980, 1980);
      
      // Register fonts if they exist
      try {
        registerFont(path.join(fontDir, 'PastiOblique-7B0wK.otf'), { family: "Pasti" });
        registerFont(path.join(fontDir, 'gantellinesignature-bw11b.ttf'), { family: "Gantelline" });
        registerFont(path.join(fontDir, 'UTM Bebas.ttf'), { family: "Bebas" });
        console.log("✅ 𝖥𝗈𝗇𝗍𝗌 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
      } catch (error) {
        console.warn("⚠️ 𝖲𝗈𝗆𝖾 𝖿𝗈𝗇𝗍𝗌 𝖼𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖻𝖾 𝗅𝗈𝖺𝖽𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖿𝗈𝗇𝗍𝗌");
      }
      
      // Draw text with fallback fonts
      ctx.textAlign = "start";
      ctx.fillStyle = color_;
      ctx.font = "370px Pasti, Arial, sans-serif";
      ctx.fillText(text2, 500, 750);
      
      ctx.textAlign = "start";
      ctx.fillStyle = "#fff";
      ctx.font = "350px Gantelline, Arial, sans-serif";
      ctx.fillText(text3, 500, 680);
      
      ctx.save();
      ctx.textAlign = "end";
      ctx.fillStyle = "#f56236";
      ctx.font = "145px Pasti, Arial, sans-serif";
      ctx.fillText(text4, 2100, 870);
      
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      
      // Send the banner
      await message.reply({
        body: "✅ 𝖸𝗈𝗎𝗋 𝖻𝖺𝗇𝗇𝖾𝗋 𝗂𝗌 𝗋𝖾𝖺𝖽𝗒! 𝖢𝗁𝖾𝖼𝗄 𝗂𝗍 𝗈𝗎𝗍 𝖻𝖾𝗅𝗈𝗐:",
        attachment: fs.createReadStream(pathImg)
      });
      
      console.log("✅ 𝖡𝖺𝗇𝗇𝖾𝗋 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝖺𝗇𝖽 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
      
      // Clean up
      try {
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
        if (fs.existsSync(pathAva)) fs.unlinkSync(pathAva);
        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌");
      } catch (cleanupError) {
        console.warn("⚠️ 𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
      }
      
    } catch (error) {
      console.error("💥 𝖡𝖺𝗇𝗇𝖾𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
      const errorMsg = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖻𝖺𝗇𝗇𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
      return message.reply(errorMsg);
    }
  }
};
