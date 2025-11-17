const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "billboard",
    aliases: [],
    version: "1.0.1",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "🌟 Billboard Text Creator"
    },
    longDescription: {
      en: "Creates a billboard image with your text and profile picture"
    },
    guide: {
      en: "{p}billboard [text]"
    },
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  wrapText: function (ctx, text, maxWidth) {
    try {
      if (ctx.measureText(text).width < maxWidth) return [text];
      if (ctx.measureText('W').width > maxWidth) return null;
      
      const words = text.split(' ');
      const lines = [];
      let line = '';
      
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) {
            words[1] = `${temp.slice(-1)}${words[1]}`;
          } else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
          line += `${words.shift()} `;
        } else {
          lines.push(line.trim());
          line = '';
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return lines;
    } catch (error) {
      console.error("Wrap text error:", error);
      return [text];
    }
  },

  onStart: async function ({ api, event, args, message }) {
    let avatarPath = null;
    let outputPath = null;
    
    try {
      // Check dependencies
      try {
        require("canvas");
        require("axios");
        require("fs-extra");
        require("path");
      } catch (e) {
        return message.reply("❌ Missing dependencies. Please install: canvas, axios, fs-extra, and path.");
      }

      const text = args.join(" ");
      if (!text) {
        return message.reply("✨ Please enter your text!");
      }

      // Create cache directory
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      avatarPath = path.join(cacheDir, `avt_${event.senderID}_${Date.now()}.png`);
      outputPath = path.join(cacheDir, `billboard_${event.senderID}_${Date.now()}.png`);
      
      // Get user info with error handling
      let userName = "User";
      let avatarUrl = null;
      
      try {
        const userInfo = await api.getUserInfo(event.senderID);
        if (userInfo && userInfo[event.senderID]) {
          userName = userInfo[event.senderID].name || "User";
          avatarUrl = userInfo[event.senderID].thumbSrc;
        }
      } catch (userError) {
        console.warn("User info error:", userError);
        userName = "User";
      }

      // Download avatar with fallback
      let avatarBuffer;
      try {
        if (avatarUrl) {
          const avatarResponse = await axios.get(avatarUrl, { 
            responseType: 'arraybuffer',
            timeout: 15000
          });
          avatarBuffer = Buffer.from(avatarResponse.data);
        } else {
          throw new Error("No avatar URL");
        }
      } catch (avatarError) {
        console.warn("Avatar download failed, using default:", avatarError.message);
        // Use default avatar
        const defaultAvatarResponse = await axios.get(
          "https://graph.facebook.com/" + event.senderID + "/picture?width=512&height=512",
          { responseType: 'arraybuffer', timeout: 15000 }
        );
        avatarBuffer = Buffer.from(defaultAvatarResponse.data);
      }

      // Download billboard template with retry logic
      let billboardBuffer;
      let templateDownloaded = false;
      const templateUrls = [
        "https://i.imgur.com/uN7Sllp.png", // Primary
        "https://imgur.com/uN7Sllp.png"    // Alternative format
      ];

      for (const templateUrl of templateUrls) {
        try {
          console.log(`Trying template URL: ${templateUrl}`);
          const templateResponse = await axios.get(templateUrl, { 
            responseType: 'arraybuffer',
            timeout: 20000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (templateResponse.data && templateResponse.data.byteLength > 0) {
            billboardBuffer = Buffer.from(templateResponse.data);
            templateDownloaded = true;
            console.log("✅ Template downloaded successfully");
            break;
          }
        } catch (templateError) {
          console.warn(`Template download failed (${templateUrl}):`, templateError.message);
          continue;
        }
      }

      if (!templateDownloaded) {
        return message.reply("❌ Failed to download billboard template. Please try again later.");
      }

      // Save files
      await Promise.all([
        fs.writeFile(avatarPath, avatarBuffer),
        fs.writeFile(outputPath, billboardBuffer)
      ]);

      // Process images
      const canvas = createCanvas(700, 350);
      const ctx = canvas.getContext("2d");

      // Load images
      let baseImage, avatarImage;
      try {
        [baseImage, avatarImage] = await Promise.all([
          loadImage(outputPath),
          loadImage(avatarPath)
        ]);
      } catch (imageError) {
        console.error("Image loading error:", imageError);
        return message.reply("❌ Error processing images. Please try again.");
      }
      
      // Draw base image
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Draw avatar (circular)
      ctx.save();
      ctx.beginPath();
      ctx.arc(203, 130, 55, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImage, 148, 75, 110, 110);
      ctx.restore();

      // Add user name with bold sans-serif font
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "left";
      ctx.fillText(userName, 280, 110);

      // Add text with proper formatting
      ctx.font = "600 22px Arial, sans-serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";
      
      const lines = this.wrapText(ctx, text, 250);
      if (lines && lines.length > 0) {
        lines.forEach((line, i) => {
          ctx.fillText(line, 280, 145 + (i * 28));
        });
      } else {
        ctx.fillText(text.substring(0, 20) + "...", 280, 145);
      }

      // Save final image
      const resultBuffer = canvas.toBuffer();
      await fs.writeFile(outputPath, resultBuffer);

      // Send result
      await message.reply({
        body: "🎊 Billboard Created Successfully!",
        attachment: fs.createReadStream(outputPath)
      });

    } catch (error) {
      console.error("Billboard Error:", error);
      await message.reply("❌ Error in billboard creation. Please try again later.");
    } finally {
      // Cleanup temporary files
      try {
        if (avatarPath && fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
        }
        if (outputPath && fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      } catch (cleanupError) {
        console.warn("Cleanup error:", cleanupError.message);
      }
    }
  }
};
