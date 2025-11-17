const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "ramos",
    aliases: ["don", "sergio"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "football",
    shortDescription: {
      en: "🏆 Send picture of football legend Sergio Ramos"
    },
    longDescription: {
      en: "🏆 Send picture of football legend Sergio Ramos with stylish canvas effects"
    },
    guide: {
      en: "{p}ramos"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!axios || !fs || !path || !createCanvas || !loadImage) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install axios, fs-extra, and canvas.", event.threadID, event.messageID);
      }

      const links = [
        "https://i.imgur.com/BRuM5hi.jpg",
        "https://i.imgur.com/zB45Tjq.jpg",
        "https://i.imgur.com/23CvexD.jpg",
        "https://i.imgur.com/xyL8y6V.jpg",
        "https://i.imgur.com/3a5ZdSx.jpg",
        "https://i.imgur.com/KqOXCkN.jpg",
        "https://i.imgur.com/Ti0wDXc.jpg",
        "https://i.imgur.com/tbX8CxB.jpg",
        "https://i.imgur.com/KxAcDXQ.jpg",
        "https://i.imgur.com/zj4l1YD.jpg",
        "https://i.imgur.com/mj92wlj.jpg",
        "https://i.imgur.com/Cpb9LTe.jpg",
        "https://i.imgur.com/EmCCFDI.jpg",
        "https://i.imgur.com/ov6R5zE.jpg",
        "https://i.imgur.com/0yjhfIM.jpg",
        "https://i.imgur.com/JMhwt57.jpg",
        "https://i.imgur.com/WFKnSrZ.jpg",
        "https://i.imgur.com/ATiXOrS.jpg",
        "https://i.imgur.com/jZuG1I9.jpg",
        "https://i.imgur.com/YV3QQIi.jpg",
        "https://i.imgur.com/8bnxdc2.jpg",
        "https://i.imgur.com/jahexN4.jpg",
        "https://i.imgur.com/fjNkjZT.jpg"
      ];

      const selectedImg = links[Math.floor(Math.random() * links.length)];
      
      // Download image
      const { data } = await axios.get(selectedImg, { responseType: 'arraybuffer' });
      const imgBuffer = Buffer.from(data, 'binary');
      
      // Create canvas
      const image = await loadImage(imgBuffer);
      const canvas = createCanvas(image.width, image.height + 100);
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = "#0C2D57";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add image
      ctx.drawImage(image, 0, 0, image.width, image.height);
      
      // Add border
      ctx.strokeStyle = "#FC6736";
      ctx.lineWidth = 5;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      // Add text
      ctx.fillStyle = "#FFB0B0";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.shadowColor = "#000000";
      ctx.shadowBlur = 5;
      ctx.fillText("⚔️ THE IMMORTAL WALL ⚔️", canvas.width/2, image.height + 60);
      
      // Add watermark
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "20px Arial";
      ctx.fillText("𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", canvas.width - 120, canvas.height - 20);
      
      // Finalize image
      const finalBuffer = canvas.toBuffer('image/jpeg');
      const tempPath = path.join(__dirname, 'cache', `ramos_${Date.now()}.jpg`);
      await fs.outputFile(tempPath, finalBuffer);
      
      // Send message
      await api.sendMessage({
        body: "🏆 | 𝗛𝗘𝗥𝗘 𝗖𝗢𝗠𝗘𝗦 𝗧𝗛𝗘 𝗟𝗘𝗚𝗘𝗡𝗗!\n\n⚡️ | 𝗦𝗲𝗿𝗴𝗶𝗼 𝗥𝗮𝗺𝗼𝘀 - 𝗧𝗵𝗲 𝗜𝗺𝗺𝗼𝗿𝘁𝗮𝗹 𝗪𝗮𝗹𝗹 𝗼𝗳 𝗙𝗼𝗼𝘁𝗯𝗮𝗹𝘇\n\n🐐 | 𝗧𝗵𝗲 𝗚𝗿𝗲𝗮𝘁𝗲𝘀𝘁 𝗗𝗲𝗳𝗲𝗻𝗱𝗲𝗿 𝗶𝗻 𝗵𝗶𝘀𝘁𝗼𝗿𝘆",
        attachment: fs.createReadStream(tempPath)
      }, event.threadID, event.messageID);

      // Clean up
      fs.unlinkSync(tempPath);
      
    } catch (error) {
      console.error("Ramos command error:", error);
      api.sendMessage("❌ | 𝗘𝗿𝗿𝗼𝗿 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗥𝗮𝗺𝗼𝘀 𝗶𝗺𝗮𝗴𝗲. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.", event.threadID, event.messageID);
    }
  }
};
