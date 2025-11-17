const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const aspectRatioMap = {
  '1:1': { width: 1024, height: 1024 },
  '9:7': { width: 1152, height: 896 },
  '7:9': { width: 896, height: 1152 },
  '19:13': { width: 1216, height: 832 },
  '13:19': { width: 832, height: 1216 },
  '7:4': { width: 1344, height: 768 },
  '4:7': { width: 768, height: 1344 },
  '12:5': { width: 1500, height: 625 },
  '5:12': { width: 640, height: 1530 },
  '16:9': { width: 1344, height: 756 },
  '9:16': { width: 756, height: 1344 },
  '2:3': { width: 768, height: 1152 },
  '3:2': { width: 1152, height: 768 }
};

module.exports = {
  config: {
    name: "quickgen",
    aliases: ["qgen", "ai4gen"],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝗔𝗜 & 𝗚𝗣𝗧",
    shortDescription: {
      en: "🤖 Generate AI images"
    },
    longDescription: {
      en: "🤖 Generates 4 AI images from a prompt and combines them in a grid with aspect ratio options"
    },
    guide: {
      en: "{p}quickgen <prompt> [--ar <ratio>]\nExample: {p}quickgen beautiful sunset --ar 16:9\nExample: {p}quickgen cute cat --ar 1:1\nExample: {p}quickgen mountain landscape --ar 9:16"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  onStart: async function({ message, args, event }) {
    try {
      // Check dependencies
      try {
        if (!axios || !fs || !path || !createCanvas || !loadImage) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return message.reply("❌ | Required dependencies are missing. Please install axios, fs-extra, and canvas.");
      }

      const startTime = Date.now();
      const userID = event.senderID;
      const waitingMessage = await message.reply("🤖 QuickGen is generating your images...");

      let prompt = "";
      let ratio = "1:1";

      // Parse arguments
      for (let i = 0; i < args.length; i++) {
        if (args[i] === "--ar" && args[i + 1]) {
          ratio = args[i + 1];
          i++;
        } else {
          prompt += args[i] + " ";
        }
      }

      prompt = prompt.trim();
      
      if (!prompt) {
        await message.unsend(waitingMessage.messageID);
        return message.reply("❌ | Please provide a prompt. Usage: {p}quickgen <prompt> [--ar ratio]");
      }

      const urls = new Array(4).fill(`https://www.ai4chat.co/api/image/generate?prompt=${encodeURIComponent(prompt)}&aspect_ratio=${encodeURIComponent(ratio)}`);

      const cacheFolderPath = path.join(__dirname, "/tmp");
      await fs.ensureDir(cacheFolderPath);

      // Download all 4 images
      const images = await Promise.all(
        urls.map(async (url, index) => {
          try {
            const { data } = await axios.get(url);
            const imageUrl = data.image_link;

            const imagePath = path.join(cacheFolderPath, `quickgen_${index + 1}_${userID}.jpg`);
            const writer = fs.createWriteStream(imagePath);

            const imageStream = await axios({
              url: imageUrl,
              method: "GET",
              responseType: "stream",
              timeout: 30000
            });

            imageStream.data.pipe(writer);
            await new Promise((resolve, reject) => {
              writer.on("finish", resolve);
              writer.on("error", reject);
            });

            return imagePath;
          } catch (error) {
            console.error(`Error downloading image ${index + 1}:`, error.message);
            throw error;
          }
        })
      );

      // Load and merge images
      const loadedImages = await Promise.all(images.map(img => loadImage(img)));
      const width = loadedImages[0].width;
      const height = loadedImages[0].height;
      const canvas = createCanvas(width * 2, height * 2);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(loadedImages[0], 0, 0, width, height);
      ctx.drawImage(loadedImages[1], width, 0, width, height);
      ctx.drawImage(loadedImages[2], 0, height, width, height);
      ctx.drawImage(loadedImages[3], width, height, width, height);

      const combinedImagePath = path.join(cacheFolderPath, `quickgen_combined_${userID}.jpg`);
      const out = fs.createWriteStream(combinedImagePath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      await new Promise((resolve, reject) => {
        out.on("finish", resolve);
        out.on("error", reject);
      });

      await message.unsend(waitingMessage.messageID);

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      const reply = await message.reply({
        body: `🤖 QuickGen Results\n📝 Prompt: ${prompt}\n📐 Aspect Ratio: ${ratio}\n⏱️ Time: ${duration}s\n\nReply with:\nU1 - Image 1\nU2 - Image 2\nU3 - Image 3\nU4 - Image 4`,
        attachment: fs.createReadStream(combinedImagePath)
      });

      // Set reply handler
      global.GoatBot.onReply.set(reply.messageID, {
        commandName: this.config.name,
        messageID: reply.messageID,
        images,
        author: event.senderID
      });

      // Clean up combined image after sending
      setTimeout(() => {
        if (fs.existsSync(combinedImagePath)) {
          fs.unlinkSync(combinedImagePath);
        }
      }, 5000);

    } catch (error) {
      console.error("Error generating image:", error.message);
      try {
        await message.unsend(waitingMessage.messageID);
      } catch {}
      message.reply("❌ | Failed to generate image. Please try again later.");
    }
  },

  onReply: async function({ event, Reply, args, message }) {
    try {
      const reply = args[0]?.toLowerCase();
      const { author, images } = Reply;

      if (event.senderID !== author) {
        return message.reply("❌ | You can only select your own generated images.");
      }

      const validIndexes = ["u1", "u2", "u3", "u4"];
      if (validIndexes.includes(reply)) {
        const selectedIndex = parseInt(reply.slice(1)) - 1;
        
        if (images[selectedIndex] && fs.existsSync(images[selectedIndex])) {
          await message.reply({
            body: `🤖 Image ${reply.toUpperCase()}`,
            attachment: fs.createReadStream(images[selectedIndex])
          });
        } else {
          message.reply("❌ | Image not found or has been deleted.");
        }
      } else {
        message.reply("❌ | Invalid selection. Please use U1, U2, U3, or U4.");
      }
    } catch (error) {
      console.error("Reply error:", error.message);
      message.reply("❌ | Failed to send selected image.");
    }
  }
};
