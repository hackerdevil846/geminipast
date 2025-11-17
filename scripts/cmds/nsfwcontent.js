const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "nsfwcontent",
    aliases: ["premium", "exclusive"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "nsfw",
    shortDescription: {
      en: "🔞 NSFW photo command (authorized users only)"
    },
    longDescription: {
      en: "🔞 Exclusive NSFW content for authorized users only"
    },
    guide: {
      en: "{p}nsfwcontent"
    },
    dependencies: {
      "canvas": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  onStart: async function({ api, event }) {
    try {
      // Check dependencies
      try {
        if (!axios || !fs || !path) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install axios, fs-extra, and canvas.", event.threadID, event.messageID);
      }

      const { createCanvas, loadImage } = require("canvas");
      
      // Stylish image links array (unchanged)
      const links = [
        "https://i.ibb.co/jfqMF07/image.jpg",
        "https://i.ibb.co/tBBCS4y/image.jpg",
        "https://i.ibb.co/3zpyMVY/image.jpg",
        "https://i.ibb.co/gWbWT8k/image.jpg",
        "https://i.ibb.co/mHtyD1P/image.jpg",
        "https://i.ibb.co/vPHNhdY/image.jpg",
        "https://i.ibb.co/rm6rPjb/image.jpg",
        "https://i.ibb.co/7GpN2GW/image.jpg",
        "https://i.ibb.co/CnfMVpg/image.jpg"
      ];

      // Select random image
      const selected = links[Math.floor(Math.random() * links.length)];
      const { data } = await axios.get(selected, { responseType: 'arraybuffer' });
      
      // Create canvas
      const canvas = createCanvas(700, 350);
      const ctx = canvas.getContext("2d");
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#8a2387");
      gradient.addColorStop(0.5, "#e94057");
      gradient.addColorStop(1, "#f27121");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add stylish text
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 10;
      ctx.fillText("🔞 EXCLUSIVE CONTENT 🔞", canvas.width/2, 100);
      
      ctx.font = "30px Arial";
      ctx.fillText("PREMIUM CONTENT BELOW", canvas.width/2, 160);
      
      ctx.font = "italic 25px Arial";
      ctx.fillText("»»——⧁ CREDITS: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 ⧁——««", canvas.width/2, 220);
      
      ctx.font = "20px Arial";
      ctx.fillText("⚠️ Strictly for 18+ authorized users ⚠️", canvas.width/2, 280);
      
      // Save canvas as image
      const canvasPath = __dirname + "/cache/nsfw_canvas.png";
      const buffer = canvas.toBuffer();
      fs.writeFileSync(canvasPath, buffer);
      
      // Prepare image stream
      const imagePath = __dirname + "/cache/nsfw_image.jpg";
      fs.writeFileSync(imagePath, Buffer.from(data, 'binary'));
      
      // Send both images
      const canvasAttachment = fs.createReadStream(canvasPath);
      const imageAttachment = fs.createReadStream(imagePath);
      
      api.sendMessage({
        body: "✨ 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐞𝐱𝐜𝐥𝐮𝐬𝐢𝐯𝐞 𝐜𝐨𝐧𝐭𝐞𝐧𝐭! 💦",
        attachment: [canvasAttachment, imageAttachment]
      }, event.threadID, event.messageID);
      
    } catch (err) {
      console.error("NSFW command error:", err);
      api.sendMessage("❌ An error occurred while processing your request", event.threadID, event.messageID);
    }
  }
};
