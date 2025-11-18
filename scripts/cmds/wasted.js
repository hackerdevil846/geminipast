// Force Node.js built-in path — prevents conflict with npm "path"
const nodePath = require("node:path");

const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "wasted",
    aliases: [],
    version: "1.0.4",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🎮 Create GTA WASTED banner"
    },
    longDescription: {
      en: "Generate a GTA-style WASTED image using a user's Facebook avatar."
    },
    guide: {
      en: "{p}wasted [@mention | reply | userID]"
    },
    countDown: 2,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "path": ""   // allowed as you requested (no removal)
    }
  },

  onStart: async function ({ api, event, args, message }) {

    // cache folder paths (using built-in nodePath)
    const cacheDir = nodePath.join(__dirname, "cache");
    const avatarPath = nodePath.join(cacheDir, "avatar.png");
    const overlayPath = nodePath.join(cacheDir, "overlay.png");
    const finalPath = nodePath.join(cacheDir, "wasted_final.png");

    try {
      // make cache dir if not exists
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // -------------------------------------------------
      // 🔍 FIND USER ID (reply → mention → arg → fallback)
      // -------------------------------------------------
      let uid;
      if (event.type === "message_reply" && event.messageReply?.senderID) {
        uid = event.messageReply.senderID;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else if (args && args[0]) {
        uid = args[0];
      } else {
        uid = event.senderID;
      }

      // -------------------------------------------------
      // 📥 DOWNLOAD AVATAR
      // -------------------------------------------------
      const avatarRes = await axios.get(
        `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      );
      fs.writeFileSync(avatarPath, avatarRes.data);

      // -------------------------------------------------
      // 📥 DOWNLOAD WASTED OVERLAY (API KEY same as your code)
      // -------------------------------------------------
      const overlayRes = await axios.get(
        `https://zenzapis.xyz/photoeditor/wasted?apikey=7990c7f07144`,
        { responseType: "arraybuffer" }
      );
      fs.writeFileSync(overlayPath, overlayRes.data);

      // -------------------------------------------------
      // 🎨 COMBINE IMAGES USING CANVAS
      // -------------------------------------------------
      const avatarImg = await loadImage(avatarPath);
      const wastedOverlay = await loadImage(overlayPath);

      const canvas = createCanvas(wastedOverlay.width, wastedOverlay.height);
      const ctx = canvas.getContext("2d");

      // draw avatar stretched
      ctx.drawImage(avatarImg, 0, 0, canvas.width, canvas.height);

      // draw overlay
      ctx.drawImage(wastedOverlay, 0, 0, canvas.width, canvas.height);

      // save final
      fs.writeFileSync(finalPath, canvas.toBuffer());

      // -------------------------------------------------
      // 📤 SEND OUTPUT
      // -------------------------------------------------
      await message.reply({
        attachment: fs.createReadStream(finalPath)
      });

      // clean files
      fs.removeSync(avatarPath);
      fs.removeSync(overlayPath);
      fs.removeSync(finalPath);

    } catch (err) {
      console.error("❌ Wasted command error →", err);

      // safe cleanup
      try { if (fs.existsSync(avatarPath)) fs.removeSync(avatarPath); } catch {}
      try { if (fs.existsSync(overlayPath)) fs.removeSync(overlayPath); } catch {}
      try { if (fs.existsSync(finalPath)) fs.removeSync(finalPath); } catch {}

      return message.reply("❌ Error creating WASTED image. Please try again later.");
    }
  }
};
