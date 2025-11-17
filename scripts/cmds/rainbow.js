const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "rainbow",
    aliases: ["colorchange", "threadcolor"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "group",
    shortDescription: {
      en: "🌈 Change thread color randomly multiple times"
    },
    longDescription: {
      en: "🌈 Change thread color randomly multiple times with beautiful canvas animations"
    },
    guide: {
      en: "{p}rainbow [number]"
    },
    dependencies: {
      "canvas": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!createCanvas || !loadImage || !fs || !path) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install canvas.", event.threadID, event.messageID);
      }

      const { threadID, messageID } = event;
      const value = parseInt(args[0]);
      
      if (isNaN(value)) {
        return api.sendMessage("🌸 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒏𝒖𝒎𝒃𝒆𝒓! 🌸", threadID, messageID);
      }
      
      if (value > 100) {
        return api.sendMessage("🚫 𝑴𝒂𝒙𝒊𝒎𝒖𝒎 𝒂𝒍𝒍𝒐𝒘𝒆𝒅 𝒊𝒔 100 𝒕𝒊𝒎𝒆𝒔! 🚫", threadID, messageID);
      }

      // Send initial canvas image
      const startImage = await createStartImage(value);
      await api.sendMessage({
        body: `🌈 𝑹𝒂𝒊𝒏𝒃𝒐𝒘 𝑺𝒕𝒂𝒓𝒕𝒆𝒅! 𝑪𝒉𝒂𝒏𝒈𝒊𝒏𝒈 𝒄𝒐𝒍𝒐𝒓 ${value} 𝒕𝒊𝒎𝒆𝒔...`,
        attachment: startImage
      }, threadID, messageID);

      // Color changing logic
      const colors = [
        '196241301102133', '169463077092846', '2442142322678320', 
        '234137870477637', '980963458735625', '175615189761153', 
        '2136751179887052', '2058653964378557', '2129984390566328', 
        '174636906462322', '1928399724138152', '417639218648241', 
        '930060997172551', '164535220883264', '370940413392601', 
        '205488546921017', '809305022860427'
      ];

      for (let i = 0; i < value; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        await api.changeThreadColor(randomColor, threadID);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Create and send completion image
      const endImage = await createCompletionImage(value);
      await api.sendMessage({
        body: `🎉 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 𝒄𝒐𝒍𝒐𝒓 ${value} 𝒕𝒊𝒎𝒆𝒔!`,
        attachment: endImage
      }, threadID, messageID);

    } catch (error) {
      console.error("Rainbow Command Error:", error);
      api.sendMessage("❌ | Error in rainbow command. Please try again later.", event.threadID, event.messageID);
    }
  }
};

async function createStartImage(count) {
  const width = 700;
  const height = 350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#FF9AA2');
  gradient.addColorStop(0.2, '#FFB7B2');
  gradient.addColorStop(0.4, '#FFDAC1');
  gradient.addColorStop(0.6, '#E2F0CB');
  gradient.addColorStop(0.8, '#B5EAD7');
  gradient.addColorStop(1, '#C7CEEA');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add title
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#5A189A';
  ctx.textAlign = 'center';
  ctx.fillText('🌈 𝑹𝑨𝑰𝑵𝑩𝑶𝑾 𝑪𝑶𝑳𝑶𝑹 𝑺𝑻𝑨𝑹𝑻𝑬𝑫 🌈', width/2, 80);

  // Add count display
  ctx.font = 'bold 60px Arial';
  ctx.fillStyle = '#FF6B6B';
  ctx.fillText(`${count} 𝑻𝑰𝑴𝑬𝑺`, width/2, 180);

  // Add animation indicator
  ctx.font = '30px Arial';
  ctx.fillStyle = '#6A4C93';
  ctx.fillText('𝑪𝑯𝑨𝑵𝑮𝑰𝑵𝑮 𝑪𝑶𝑳𝑶𝑹𝑺...', width/2, 250);

  return canvas.toBuffer();
}

async function createCompletionImage(count) {
  const width = 700;
  const height = 350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create celebratory background
  ctx.fillStyle = '#1A1A2E';
  ctx.fillRect(0, 0, width, height);
  
  // Draw fireworks
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height/2;
    const radius = Math.random() * 3 + 1;
    const hue = Math.floor(Math.random() * 360);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fill();
  }

  // Add completion text
  ctx.font = 'bold 38px Arial';
  ctx.fillStyle = '#F8F9FA';
  ctx.textAlign = 'center';
  ctx.fillText('🎉 𝑺𝑼𝑪𝑪𝑬𝑺𝑺𝑭𝑼𝑳𝑳𝒀 𝑪𝑶𝑴𝑷𝑳𝑬𝑻𝑬𝑫! 🎉', width/2, 120);

  // Add count display
  ctx.font = 'bold 50px Arial';
  const gradient = ctx.createLinearGradient(150, 150, 550, 250);
  gradient.addColorStop(0, '#FF9AA2');
  gradient.addColorStop(0.5, '#B5EAD7');
  gradient.addColorStop(1, '#C7CEEA');
  ctx.fillStyle = gradient;
  ctx.fillText(`${count} 𝑪𝑶𝑳𝑶𝑹 𝑪𝑯𝑨𝑵𝑮𝑬𝑺`, width/2, 200);

  // Add final message
  ctx.font = '30px Arial';
  ctx.fillStyle = '#E9C46A';
  ctx.fillText('𝑮𝑹𝑶𝑼𝑷 𝑪𝑯𝑨𝑻 𝑹𝑨𝑰𝑵𝑩𝑶𝑾 𝑪𝑶𝑴𝑷𝑳𝑬𝑻𝑬𝑫!', width/2, 270);

  return canvas.toBuffer();
}
