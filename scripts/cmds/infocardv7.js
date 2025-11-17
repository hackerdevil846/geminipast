const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";

module.exports = {
  config: {
    name: "cardinfo7",
    aliases: [],
    version: "2.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    category: "info",
    shortDescription: {
      en: "🪪 𝐼𝑛𝑓𝑜 𝑐𝑎𝑟𝑑 𝑐𝑟𝑒𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙𝑖𝑧𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑"
    },
    guide: {
      en: "{p}cardinfo7 [𝑟𝑒𝑝𝑙𝑦|𝑛𝑜𝑛𝑒]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": "",
      "moment-timezone": ""
    }
  },

  circle: async function (image) {
    try {
      const jimp = require("jimp");
      image = await jimp.read(image);
      image.circle();
      return await image.getBufferAsync("image/png");
    } catch (error) {
      console.error("𝐶𝑖𝑟𝑐𝑙𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
      throw error;
    }
  },

  makeImage: async function ({ uid, userInfo, pathImg, pathAvata }) {
    const fs = require("fs-extra");
    const axios = require("axios");
    const jimp = require("jimp");

    try {
      // Download avatar
      const avatarUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarResp = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      const avatarBuffer = Buffer.from(avatarResp.data, "binary");
      await fs.writeFileSync(pathAvata, avatarBuffer);

      // Download background image
      const bgResp = await axios.get("https://i.imgur.com/rqbC4ES.jpg", { 
        responseType: "arraybuffer",
        timeout: 30000
      });
      const bgBuffer = Buffer.from(bgResp.data, "binary");
      await fs.writeFileSync(pathImg, bgBuffer);

      // Download font if not exists
      const fontPath = __dirname + fonts;
      if (!fs.existsSync(fontPath)) {
        try {
          console.log("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑜𝑛𝑡...");
          const fontResp = await axios.get(downfonts, { 
            responseType: "arraybuffer",
            timeout: 30000
          });
          await fs.writeFileSync(fontPath, Buffer.from(fontResp.data, "binary"));
          console.log("𝐹𝑜𝑛𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
        } catch (fontErr) {
          console.warn("𝐹𝑜𝑛𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑:", fontErr.message);
        }
      }

      // Create circular avatar
      const avatarCircleBuffer = await this.circle(pathAvata);

      // Load images
      const baseImage = await jimp.read(pathImg);
      const avatarImage = await jimp.read(avatarCircleBuffer);

      // Resize and position avatar
      avatarImage.resize(229, 229);
      baseImage.composite(avatarImage, 910, 465);

      // Load font
      let customFont;
      try {
        if (fs.existsSync(fontPath)) {
          customFont = await jimp.loadFont(fontPath);
        } else {
          console.warn("𝐹𝑜𝑛𝑡 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 𝑓𝑜𝑛𝑡");
          customFont = jimp.FONT_SANS_32_BLACK;
        }
      } catch (fontError) {
        console.warn("𝐹𝑜𝑛𝑡 𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟, 𝑢𝑠𝑖𝑛𝑔 𝑑𝑒𝑓𝑎𝑢𝑙𝑡:", fontError.message);
        customFont = jimp.FONT_SANS_32_BLACK;
      }

      // Helper function to normalize data
      const norm = (val) => {
        if (!val || val === "undefined" || val === "null") return "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
        if (typeof val === "string" && val.trim() === "") return "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
        return String(val);
      };

      // Get user data with fallbacks
      const gender = userInfo.gender === "MALE" ? "𝑀𝑎𝑙𝑒" : 
                    userInfo.gender === "FEMALE" ? "𝐹𝑒𝑚𝑎𝑙𝑒" : "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
      
      const birthday = norm(userInfo.birthday);
      const love = norm(userInfo.relationship_status);
      const location = norm(userInfo.location || userInfo.locationName);
      const hometown = norm(userInfo.hometown || userInfo.homeTown);
      const displayName = norm(userInfo.name || userInfo.firstName || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛");
      const profileLink = `https://facebook.com/${uid}`;

      // Add text to image
      const textOptions = {
        text: customFont,
        x: 340,
        y: 560,
        maxWidth: 500,
        maxHeight: 50
      };

      // Draw all text elements
      baseImage.print(customFont, 340, 560, `𝑁𝑎𝑚𝑒: ${displayName}`);
      baseImage.print(customFont, 1245, 448, `𝐺𝑒𝑛𝑑𝑒𝑟: ${gender}`);
      baseImage.print(customFont, 1245, 559, `𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝: ${love}`);
      baseImage.print(customFont, 1245, 616, `𝐵𝑖𝑟𝑡ℎ𝑑𝑎𝑦: ${birthday}`);
      baseImage.print(customFont, 1245, 668, `𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛: ${location}`);
      baseImage.print(customFont, 1245, 723, `𝐻𝑜𝑚𝑒𝑡𝑜𝑤𝑛: ${hometown}`);
      baseImage.print(customFont, 814, 728, `𝑈𝐼𝐷: ${uid}`);
      baseImage.print(customFont, 32, 727, `𝑃𝑟𝑜𝑓𝑖𝑙𝑒: ${profileLink}`);

      // Save final image
      await baseImage.writeAsync(pathImg);
      return true;

    } catch (error) {
      console.error("𝐼𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
      throw error;
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const fs = require("fs-extra");
      const axios = require("axios");

      const { senderID, threadID, messageID } = event;
      
      // Create cache directory if not exists
      const tmpDir = __dirname + "/cache";
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }

      const pathImg = __dirname + `/cache/${senderID}${threadID}_info.png`;
      const pathAvata = __dirname + `/cache/avtuser_${senderID}${threadID}.png`;

      let uid;
      if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID) {
        uid = event.messageReply.senderID;
      } else {
        uid = senderID;
      }

      // Get user info
      let userInfo = {};
      try {
        const userInfoMap = await api.getUserInfo(uid);
        userInfo = userInfoMap[uid] || {};
      } catch (userError) {
        console.warn("𝑈𝑠𝑒𝑟 𝑖𝑛𝑓𝑜 𝑓𝑒𝑡𝑐ℎ 𝑒𝑟𝑟𝑜𝑟:", userError);
        userInfo = { name: "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟", gender: null };
      }

      // Create the image
      await this.makeImage({
        uid,
        userInfo,
        pathImg,
        pathAvata
      });

      const displayName = userInfo.name || userInfo.firstName || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
      const profileLink = `https://facebook.com/${uid}`;
      
      const messageBody = `✅ *𝐼𝑛𝑓𝑜 𝐶𝑎𝑟𝑑 𝑅𝑒𝑎𝑑𝑦!* 🪪\n\n✨ 𝑁𝑎𝑚𝑒: ${displayName}\n🆔 𝑈𝐼𝐷: ${uid}\n🔗 𝑃𝑟𝑜𝑓𝑖𝑙𝑒: ${profileLink}`;

      // Send the result
      await message.reply({
        body: messageBody,
        attachment: fs.createReadStream(pathImg)
      });

      // Cleanup temporary files
      try {
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
        if (fs.existsSync(pathAvata)) fs.unlinkSync(pathAvata);
      } catch (cleanupError) {
        console.warn("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError.message);
      }

    } catch (error) {
      console.error("𝐶𝑎𝑟𝑑𝑖𝑛𝑓𝑜7 𝑒𝑟𝑟𝑜𝑟:", error);
      
      let errorMessage = `⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑖𝑛𝑓𝑜 𝑐𝑎𝑟𝑑: ${error.message || error}`;
      if (error.message.includes("timeout")) {
        errorMessage = "⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      } else if (error.message.includes("network") || error.message.includes("ECONNREFUSED")) {
        errorMessage = "🌐 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
      }
      
      return message.reply(errorMessage);
    }
  }
};
