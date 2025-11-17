const { createCanvas, loadImage } = require("canvas");
const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "nhentai",
    aliases: ["nh"],
    version: "1.1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "𝑵𝑯𝒆𝒏𝒕𝒂𝒊 𝒆 𝒈𝒂𝒍𝒑𝒐 𝒆𝒓 𝒊𝒏𝒇𝒐 𝒌𝒉𝒖𝒏𝒋𝒖𝒏"
    },
    longDescription: {
      en: "𝑭𝒆𝒕𝒄𝒉 𝒏𝑯𝒆𝒏𝒕𝒂𝒊 𝒎𝒂𝒏𝒈𝒂 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒃𝒚 𝑰𝑫"
    },
    category: "𝒏𝒔𝒇𝒘",
    guide: {
      en: "{pn} [𝑰𝑫]"
    }
  },

  langs: {
    en: {
      genarateCode: "🔞 | 𝑨𝒑𝒏𝒂𝒓 𝒋𝒐𝒏𝒚𝒐 𝒊𝒅𝒆𝒂𝒍 𝒌𝒐𝒅: %1",
      notFound: "❌ | 𝑨𝒑𝒏𝒂𝒓 𝒉𝒆𝒏𝒕𝒂𝒊 𝒎𝒂𝒏𝒈𝒂 𝒌𝒉𝒖𝒋𝒆 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!",
      returnResult: "🎬 | 𝑵𝒂𝒎: %1\n👨‍🎨 | 𝑳𝒆𝒌𝒉𝒐𝒌: %2\n👥 | 𝑪𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓: %3\n🏷️ | 𝑻𝒂𝒈: %4\n🔗 | 𝑳𝒊𝒏𝒌: https://nhentai.net/g/%5"
    }
  },

  onStart: async function ({ api, event, args, getLang }) {
    const { threadID, messageID } = event;
    
    if (!args[0]) {
      const randomCode = Math.floor(Math.random() * 99999);
      return api.sendMessage(getLang("genarateCode", randomCode), threadID, messageID);
    }

    try {
      const id = parseInt(args[0]);
      if (isNaN(id)) return api.sendMessage(getLang("notFound"), threadID, messageID);
      
      const response = await fetch(`https://nhentai.net/api/gallery/${id}`);
      if (!response.ok) throw new Error();
      
      const codeData = await response.json();
      const { title, tags, media_id } = codeData;
      const prettyTitle = title.pretty;
      
      // Process tags
      const tagList = [];
      const artistList = [];
      const characterList = [];
      
      tags.forEach(item => {
        if (item.type === "tag") tagList.push(item.name);
        else if (item.type === "artist") artistList.push(item.name);
        else if (item.type === "character") characterList.push(item.name);
      });
      
      const tagsText = tagList.join(', ') || '𝑵/𝑨';
      const artists = artistList.join(', ') || '𝑶𝒓𝒊𝒈𝒊𝒏𝒂𝒍';
      const characters = characterList.join(', ') || '𝑶𝒓𝒊𝒈𝒊𝒏𝒂𝒍';
      
      // Get cover image
      const t = codeData.images.cover.t;
      const ext = t === 'j' ? 'jpg' : t === 'p' ? 'png' : 'gif';
      const coverUrl = `https://t.nhentai.net/galleries/${media_id}/cover.${ext}`;
      
      // Create canvas
      const canvasWidth = 600;
      const canvasHeight = 800;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = '#2c2f33';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Add header
      ctx.fillStyle = '#7289da';
      ctx.fillRect(0, 0, canvasWidth, 80);
      
      // Title
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('𝑵𝑯𝒆𝒏𝒕𝒂𝒊 𝑰𝒏𝒇𝒐', canvasWidth / 2, 50);
      
      // Load cover image
      try {
        const image = await loadImage(coverUrl);
        const imgHeight = 300;
        const imgWidth = (image.width / image.height) * imgHeight;
        const x = (canvasWidth - imgWidth) / 2;
        
        // Draw cover with border
        ctx.strokeStyle = '#7289da';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 5, 95, imgWidth + 10, imgHeight + 10);
        ctx.drawImage(image, x, 100, imgWidth, imgHeight);
      } catch (e) {
        console.error("Cover image error:", e);
        // If image fails to load, add a placeholder message
        ctx.font = '20px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('𝑰𝒎𝒂𝒈𝒆 𝒏𝒐𝒕 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆', canvasWidth / 2, 250);
      }
      
      // Info section
      ctx.textAlign = 'left';
      const startY = 450;
      let yOffset = 0;
      
      const addSection = (label, text) => {
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#7289da';
        ctx.fillText(`◉ ${label}:`, 40, startY + yOffset);
        
        ctx.font = '18px Arial';
        ctx.fillStyle = '#ffffff';
        const lines = wrapText(ctx, text, 40, startY + yOffset + 30, canvasWidth - 80, 28);
        yOffset += 40 + (lines * 28);
      };
      
      addSection('𝑵𝒂𝒎', prettyTitle);
      addSection('𝑳𝒆𝒌𝒉𝒐𝒌', artists);
      addSection('𝑪𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓', characters);
      addSection('𝑻𝒂𝒈', tagsText);
      
      // Footer
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#7289da';
      ctx.textAlign = 'center';
      ctx.fillText(`𝑰𝑫: ${id}`, canvasWidth / 2, startY + yOffset + 40);
      ctx.fillText('https://nhentai.net', canvasWidth / 2, startY + yOffset + 80);
      
      // Convert to buffer and send
      const buffer = canvas.toBuffer('image/png');
      
      return api.sendMessage({
        body: getLang("returnResult", prettyTitle, artists, characters, tagsText, id),
        attachment: buffer
      }, threadID, messageID);

    } catch (error) {
      console.error(error);
      return api.sendMessage(getLang("notFound"), threadID, messageID);
    }
  }
};

// Helper function to wrap text
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  if (!text) return 1;
  
  const words = text.split(' ');
  let line = '';
  let lines = 1;

  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
      lines++;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return lines;
}
