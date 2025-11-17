const sendWaiting = true;
const textWaiting = "⏳ Image initialization, please wait a moment...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;

module.exports = {
  config: {
    name: "cardinfo2",
    aliases: [],
    version: "1.2",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "logo",
    shortDescription: {
      en: "📇 Make a stylish Facebook profile card"
    },
    longDescription: {
      en: "📇 Create a stylish Facebook profile card with user information"
    },
    guide: {
      en: "{p}cardinfo2 [reply to user or mention]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    let pathImg = null;
    let pathAvata = null;
    
    try {
      const { loadImage, createCanvas, registerFont } = require("canvas");
      const fs = require("fs-extra");
      const axios = require("axios");
      const jimp = require("jimp");

      pathImg = __dirname + `/cache/card_background_${Date.now()}.png`;
      pathAvata = __dirname + `/cache/card_avatar_${Date.now()}.png`;

      if (sendWaiting) {
        await message.reply(textWaiting);
      }

      let uid;
      if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID) {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else {
        uid = event.senderID;
      }

      // Fetch user info
      let userInfo = {};
      try {
        const userInfoData = await api.getUserInfo(uid);
        userInfo = userInfoData[uid] || {};
      } catch (apiError) {
        console.error("Error fetching user info:", apiError);
        userInfo = {
          name: "Unknown User",
          gender: "Not Specified",
          follow: "N/A",
          relationship_status: "N/A", 
          birthday: "N/A",
          location: { name: "N/A" },
          link: `https://www.facebook.com/${uid}`
        };
      }

      // Download avatar
      try {
        const getAvatarOne = await axios.get(
          `https://graph.facebook.com/${uid}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer", timeout: 15000 }
        );
        await fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne.data, "binary"));
      } catch (avatarError) {
        console.error("Error fetching avatar:", avatarError);
        // Create a simple fallback avatar
        const fallbackCanvas = createCanvas(1500, 1500);
        const ctx = fallbackCanvas.getContext("2d");
        ctx.fillStyle = "#3498db";
        ctx.fillRect(0, 0, 1500, 1500);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 200px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("?", 750, 750);
        const buffer = fallbackCanvas.toBuffer();
        await fs.writeFileSync(pathAvata, buffer);
      }

      // Create circular avatar
      let avatarBuffer;
      try {
        avatarBuffer = await this.circle(pathAvata);
      } catch (circleError) {
        console.error("Error creating circular avatar:", circleError);
        avatarBuffer = await fs.readFileSync(pathAvata);
      }

      // Download background
      try {
        const bg = await axios.get(
          "https://i.imgur.com/tW6nSDm.png",
          { responseType: "arraybuffer", timeout: 15000 }
        );
        await fs.writeFileSync(pathImg, Buffer.from(bg.data, "binary"));
      } catch (bgError) {
        console.error("Error fetching background:", bgError);
        await message.reply("❌ Failed to load background image. Please try again later.");
        return;
      }

      // Download and register font
      const fontPath = __dirname + fonts;
      let fontRegistered = false;
      
      if (!fs.existsSync(fontPath)) {
        try {
          const getfont = await axios.get(downfonts, { responseType: "arraybuffer", timeout: 30000 });
          await fs.writeFileSync(fontPath, Buffer.from(getfont.data, "binary"));
          registerFont(fontPath, { family: "Play-Bold" });
          fontRegistered = true;
        } catch (fontError) {
          console.error("Error downloading font:", fontError);
        }
      } else {
        try {
          registerFont(fontPath, { family: "Play-Bold" });
          fontRegistered = true;
        } catch (registerError) {
          console.error("Error registering font:", registerError);
        }
      }

      // Draw Canvas
      const baseImage = await loadImage(pathImg);
      const baseAvata = await loadImage(avatarBuffer);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAvata, 80, 73, 285, 285);

      // Prepare user data with fallbacks
      const name = userInfo.name || "Unknown User";
      const gender = userInfo.gender === 'MALE' ? 'Male' : userInfo.gender === 'FEMALE' ? 'Female' : 'Not Specified';
      const follow = userInfo.followers ? userInfo.followers.toLocaleString() : "N/A";
      const love = userInfo.relationship_status || "N/A";
      const birthday = userInfo.birthday || "N/A";
      const location = (userInfo.location && userInfo.location.name) ? userInfo.location.name : "N/A";
      const link = `https://www.facebook.com/${uid}`;

      // Set font family based on registration success
      const fontFamily = fontRegistered ? "Play-Bold" : "Arial";

      // Draw user information
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";

      // Name
      ctx.font = `bold ${fontsInfo}px "${fontFamily}"`;
      ctx.fillText(name, 480, 172);

      // Gender
      ctx.font = `${fontsInfo}px "${fontFamily}"`;
      ctx.fillText(gender, 550, 208);

      // Followers
      ctx.fillText(follow, 550, 244);

      // Relationship
      ctx.fillText(love, 550, 281);

      // Birthday
      ctx.fillText(birthday, 550, 320);

      // Location
      ctx.fillText(location, 550, 357);

      // UID
      ctx.fillText(uid, 550, 399);

      // Facebook Link
      ctx.font = `${fontsLink}px "${fontFamily}"`;
      ctx.fillStyle = "#1877f2";
      ctx.fillText(link, 175, 470);

      // Save and send final image
      const imageBuffer = canvas.toBuffer("image/png");
      await fs.writeFileSync(pathImg, imageBuffer);

      await message.reply({
        body: `✨ Here is your stylish profile card ✨\n\n📛 Name: ${name}\n👤 Gender: ${gender}\n🔗 Profile: ${link}`,
        attachment: fs.createReadStream(pathImg)
      });

    } catch (error) {
      console.error("CardInfo2 Error:", error);
      await message.reply("❌ Failed to create profile card. Please try again later.");
    } finally {
      // Cleanup temporary files
      try {
        if (pathImg && fs.existsSync(pathImg)) {
          fs.unlinkSync(pathImg);
        }
        if (pathAvata && fs.existsSync(pathAvata)) {
          fs.unlinkSync(pathAvata);
        }
      } catch (cleanupError) {
        console.warn("Cleanup warning:", cleanupError.message);
      }
    }
  },

  circle: async function (imagePath) {
    try {
      const jimp = require("jimp");
      const image = await jimp.read(imagePath);
      image.circle();
      return await image.getBufferAsync("image/png");
    } catch (error) {
      console.error("Circle function error:", error);
      throw error;
    }
  }
};
