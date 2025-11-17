const https = require('https');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "ytplaylist",
    aliases: [],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "media",
    shortDescription: {
      en: "🎶 𝐺𝑒𝑡 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑣𝑖𝑠𝑢𝑎𝑙 𝑑𝑖𝑠𝑝𝑙𝑎𝑦"
    },
    longDescription: {
      en: "🎶 𝐺𝑒𝑡 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑣𝑖𝑠𝑢𝑎𝑙 𝑑𝑖𝑠𝑝𝑙𝑎𝑦"
    },
    guide: {
      en: "{𝑝}𝑦𝑡𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 [𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝐼𝐷]"
    },
    dependencies: {
      "canvas": "",
      "fs": "",
      "path": "",
      "https": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!https || !createCanvas || !fs || !path) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑓𝑠, 𝑝𝑎𝑡ℎ, 𝑎𝑛𝑑 ℎ𝑡𝑡𝑝𝑠.", event.threadID, event.messageID);
      }

      const { threadID, messageID } = event;
      const playlistId = args[0] || 'PLL8jFEKG82Z79hz1lbhWtUioO9fhVKUAr';
      
      // 𝑉𝑎𝑙𝑖𝑑𝑎𝑡𝑒 𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝐼𝐷
      if (!/^[a-zA-Z0-9_-]{34}$/.test(playlistId)) {
        return api.sendMessage(
          "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝐼𝐷 𝑓𝑜𝑟𝑚𝑎𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝐼𝐷.",
          threadID,
          messageID
        );
      }

      // 𝐴𝑃𝐼 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑂𝑝𝑡𝑖𝑜𝑛𝑠
      const options = {
        method: 'GET',
        hostname: 'youtube-music-api-yt.p.rapidapi.com',
        path: `/get-playlist-videos?playlistId=${encodeURIComponent(playlistId)}`,
        headers: {
          'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
          'x-rapidapi-host': 'youtube-music-api-yt.p.rapidapi.com'
        },
        timeout: 15000
      };

      // 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑀𝑒𝑠𝑠𝑎𝑔𝑒
      const processingMsg = await api.sendMessage(
        `⌛ 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑑𝑎𝑡𝑎 𝑓𝑜𝑟 𝐼𝐷: ${playlistId}...`,
        threadID
      );

      // 𝐹𝑒𝑡𝑐ℎ 𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝐷𝑎𝑡𝑎
      const playlistData = await new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
          let data = '';
          response.on('data', (chunk) => data += chunk);
          response.on('end', () => {
            try { resolve(JSON.parse(data)); } 
            catch (e) { reject(new Error('𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑎𝑟𝑠𝑒 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒')); }
          });
        });
        request.on('error', reject);
        request.on('timeout', () => {
          request.destroy();
          reject(new Error('𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡'));
        });
        request.end();
      });

      if (playlistData.status === false || !playlistData.data) {
        return api.sendMessage(
          `❌ 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟: ${playlistData.message || '𝑁𝑜 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑑𝑎𝑡𝑎 𝑓𝑜𝑢𝑛𝑑'}`,
          threadID,
          messageID
        );
      }

      const playlist = playlistData.data;
      const videos = playlist.videos.slice(0, 10);
      
      // 𝐶𝑟𝑒𝑎𝑡𝑒 𝐶𝑎𝑛𝑣𝑎𝑠
      const canvasWidth = 1000;
      const canvasHeight = 600;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');
      
      // 𝐴𝑑𝑑 𝑟𝑜𝑢𝑛𝑑𝑅𝑒𝑐𝑡 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛 𝑡𝑜 𝑐𝑡𝑥
      ctx.roundRect = function (x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
      };

      // 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑔𝑟𝑎𝑑𝑖𝑒𝑛𝑡
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, '#8A2BE2');
      gradient.addColorStop(1, '#1E90FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // 𝐷𝑒𝑐𝑜𝑟𝑎𝑡𝑖𝑣𝑒 𝑐𝑖𝑟𝑐𝑙𝑒𝑠
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 20; i++) {
        const radius = Math.random() * 50 + 10;
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑇𝑖𝑡𝑙𝑒
      ctx.font = 'bold 42px "Segoe UI"';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText('🎵 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝐼𝑛𝑓𝑜', canvasWidth / 2, 60);
      
      // 𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑑𝑒𝑡𝑎𝑖𝑙𝑠 𝑏𝑜𝑥
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.roundRect(100, 100, 800, 150, 20);
      ctx.fill();
      
      // 𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝐼𝑛𝑓𝑜
      ctx.font = 'bold 30px "Segoe UI"';
      ctx.fillStyle = '#FFD700';
      ctx.textAlign = 'left';
      ctx.fillText(`📛 ${truncate(playlist.title, 30)}`, 130, 150);
      
      ctx.font = '24px "Segoe UI"';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`👤 𝐴𝑢𝑡ℎ𝑜𝑟: ${playlist.author}`, 130, 190);
      ctx.fillText(`🎬 𝑉𝑖𝑑𝑒𝑜𝑠: ${playlist.videoCount}`, 130, 230);
      
      // 𝑉𝑖𝑑𝑒𝑜𝑠 ℎ𝑒𝑎𝑑𝑒𝑟
      ctx.font = 'bold 30px "Segoe UI"';
      ctx.fillStyle = '#FFD700';
      ctx.textAlign = 'center';
      ctx.fillText('🎧 𝑇𝑜𝑝 𝑉𝑖𝑑𝑒𝑜𝑠', canvasWidth / 2, 300);
      
      // 𝑉𝑖𝑑𝑒𝑜 𝑙𝑖𝑠𝑡
      ctx.font = '20px "Segoe UI"';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      
      const startY = 350;
      const lineHeight = 30;
      const maxVideos = Math.min(videos.length, 8);
      
      for (let i = 0; i < maxVideos; i++) {
        const video = videos[i];
        ctx.fillText(`▶️ ${i + 1}. ${truncate(video.title, 40)}`, 150, startY + i * lineHeight);
        ctx.fillText(`⏱️ ${video.duration}`, 750, startY + i * lineHeight);
      }
      
      // 𝐹𝑜𝑜𝑡𝑒𝑟
      ctx.font = '20px "Segoe UI"';
      ctx.fillStyle = '#7CFC00';
      ctx.textAlign = 'center';
      ctx.fillText(`🔗 𝐹𝑢𝑙𝑙 𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡: 𝑦𝑜𝑢𝑡𝑢𝑏𝑒.𝑐𝑜𝑚/𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡?𝑙𝑖𝑠𝑡=${playlistId}`, canvasWidth / 2, 570);
      
      // 𝐶𝑟𝑒𝑑𝑖𝑡 𝑊𝑎𝑡𝑒𝑟𝑚𝑎𝑟𝑘 (𝑂𝑛𝑙𝑦 𝑦𝑜𝑢𝑟 𝑛𝑎𝑚𝑒)
      ctx.font = '16px "Segoe UI"';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('𝐶𝑟𝑒𝑑𝑖𝑡: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑', canvasWidth / 2, 595);
      
      // 𝑆𝑎𝑣𝑒 𝑖𝑚𝑎𝑔𝑒
      const imgPath = path.join(__dirname, `cache/playlist_${threadID}.png`);
      fs.writeFileSync(imgPath, canvas.toBuffer('image/png'));
      
      // 𝑆𝑒𝑛𝑑 𝑟𝑒𝑠𝑢𝑙𝑡
      const msgBody = `✅ 𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑅𝑒𝑡𝑟𝑖𝑒𝑣𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n` +
                     `📛 𝑇𝑖𝑡𝑙𝑒: ${playlist.title}\n` +
                     `👤 𝐴𝑢𝑡ℎ𝑜𝑟: ${playlist.author}\n` +
                     `🎬 𝑇𝑜𝑡𝑎𝑙 𝑉𝑖𝑑𝑒𝑜𝑠: ${playlist.videoCount}`;
      
      api.sendMessage({
        body: msgBody,
        attachment: fs.createReadStream(imgPath)
      }, threadID, () => fs.unlinkSync(imgPath));
      
      // 𝑅𝑒𝑚𝑜𝑣𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error('𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝐸𝑟𝑟𝑜𝑟:', error);
      let errorMessage = "❌ ";
      if (error.message.includes('𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡')) {
        errorMessage += "𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      } else if (error.message.includes('𝑝𝑎𝑟𝑠𝑒')) {
        errorMessage += "𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑.";
      } else {
        errorMessage += `𝐸𝑟𝑟𝑜𝑟: ${error.message || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟'}`;
      }
      api.sendMessage(errorMessage, threadID, messageID);
    }
  }
};

// 𝐻𝑒𝑙𝑝𝑒𝑟 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛
function truncate(str, maxLength) {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}
