const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
  config: {
    name: "pinsearchpro",
    aliases: [],
    version: "2.1.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 10,
    role: 0,
    category: "search",
    shortDescription: {
      en: "🔍 𝖲𝖾𝖺𝗋𝖼𝗁 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍"
    },
    longDescription: {
      en: "🔍 𝖲𝖾𝖺𝗋𝖼𝗁 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗁𝗂𝗀𝗁-𝗊𝗎𝖺𝗅𝗂𝗍𝗒 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝗐𝗂𝗍𝗁 𝗆𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝖻𝖺𝖼𝗄𝗎𝗉𝗌"
    },
    guide: {
      en: "{𝗉}𝗉𝗂𝗇𝗌𝖾𝖺𝗋𝖼𝗁𝗉𝗋𝗈 [𝗌𝖾𝖺𝗋𝖼𝗁 𝗍𝖾𝗋𝗆]-[𝗇𝗎𝗆𝖻𝖾𝗋 𝗈𝖿 𝗂𝗆𝖺𝗀𝖾𝗌]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    },
    envConfig: {
      pixabayApiKey: "52739072-3d2518fb37d73bfd80ed5a82f"
    }
  },

  onLoad: function() {
    const tempDir = path.join(__dirname, "pinsearch_cache");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("axios");
        require("fs-extra");
        require("canvas");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝖼𝖺𝗇𝗏𝖺𝗌.", event.threadID, event.messageID);
      }

      const { threadID, messageID, senderID } = event;
      
      const input = args.join(" ");
      
      if (!input || !input.includes("-")) {
        const helpMessage = `🖼️ 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝖨𝗆𝖺𝗀𝖾 𝖲𝖾𝖺𝗋𝖼𝗁\n\n` +
          `📝 𝖴𝗌𝖺𝗀𝖾: ${global.config.PREFIX}𝗉𝗂𝗇𝗌𝖾𝖺𝗋𝖼𝗁𝗉𝗋𝗈 [𝗌𝖾𝖺𝗋𝖼𝗁 𝗍𝖾𝗋𝗆]-[𝗇𝗎𝗆𝖻𝖾𝗋 𝗈𝖿 𝗂𝗆𝖺𝗀𝖾𝗌]\n` +
          `💡 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: ${global.config.PREFIX}𝗉𝗂𝗇𝗌𝖾𝖺𝗋𝖼𝗁𝗉𝗋𝗈 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝗌𝗎𝗇𝗌𝖾𝗍-5\n\n` +
          `⚠️ 𝖭𝗈𝗍𝖾: 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 10 𝗂𝗆𝖺𝗀𝖾𝗌 𝗉𝖾𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍`;
        return api.sendMessage(helpMessage, threadID, messageID);
      }

      const [keyword, countStr] = input.split("-").map(item => item.trim());
      let imageCount = parseInt(countStr) || 5;
      
      if (!keyword) {
        return api.sendMessage("🔍 | 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗌𝖾𝖺𝗋𝖼𝗁 𝖪𝖾𝗒𝗐𝗈𝗋𝖽", threadID, messageID);
      }

      imageCount = Math.max(1, Math.min(imageCount, 10));
      
      const bannerPath = await createSearchBanner(keyword, senderID);
      
      api.sendMessage({
        body: `🔍 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝖿𝗈𝗋: "${keyword}"...`,
        attachment: fs.createReadStream(bannerPath)
      }, threadID, async () => {
        fs.unlinkSync(bannerPath);
        
        try {
          const imageUrls = await fetchImagesWithFallback(keyword, this.config.envConfig);
          
          if (!imageUrls || imageUrls.length === 0) {
            return api.sendMessage(
              `❌ 𝖭𝗈 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 "${keyword}". 𝖳𝗋𝗒 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗌𝖾𝖺𝗋𝖼𝗁 𝗍𝖾𝗋𝗆.`,
              threadID,
              messageID
            );
          }
          
          const selectedUrls = imageUrls.slice(0, imageCount);
          const tempDir = path.join(__dirname, "pinsearch_cache");
          const imgPaths = [];
          
          // Clean up old files
          try {
            const files = fs.readdirSync(tempDir);
            files.filter(file => file.startsWith(`${senderID}_`))
                 .forEach(file => fs.unlinkSync(path.join(tempDir, file)));
          } catch (cleanupError) {
            console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
          }
          
          let downloadedCount = 0;
          for (let i = 0; i < selectedUrls.length; i++) {
            try {
              const imagePath = path.join(tempDir, `${senderID}_${Date.now()}_${i}.jpg`);
              const imageRes = await axios.get(selectedUrls[i], {
                responseType: 'arraybuffer',
                timeout: 25000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                maxContentLength: 10 * 1024 * 1024 // 10MB limit
              });
              
              // Check if response is actually an image
              const contentType = imageRes.headers['content-type'];
              if (!contentType || !contentType.startsWith('image/')) {
                console.warn(`𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗍𝗒𝗉𝖾: ${contentType}`);
                continue;
              }
              
              await fs.writeFile(imagePath, imageRes.data);
              
              // Verify file was written
              const stats = await fs.stat(imagePath);
              if (stats.size > 1000) { // At least 1KB
                imgPaths.push(imagePath);
                downloadedCount++;
              } else {
                await fs.unlink(imagePath);
              }
            } catch (err) {
              console.error(`𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋: ${err.message}`);
            }
          }
          
          if (imgPaths.length > 0) {
            const attachments = imgPaths.map(path => fs.createReadStream(path));
            const resultMessage = `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 ${downloadedCount} 𝗂𝗆𝖺𝗀𝖾(𝗌) 𝖿𝗈𝗋:\n"${keyword}"\n\n✨ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;
            
            api.sendMessage({
              body: resultMessage,
              attachment: attachments
            }, threadID, (err) => {
              if (err) console.error("𝖲𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", err);
              
              // Cleanup files
              imgPaths.forEach(filePath => {
                try {
                  if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                  }
                } catch (fileError) {
                  console.warn("𝖥𝗂𝗅𝖾 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", fileError.message);
                }
              });
            }, messageID);
          } else {
            api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗇𝗒 𝗂𝗆𝖺𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", threadID, messageID);
          }
          
        } catch (error) {
          console.error("💥 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", error);
          api.sendMessage("⚠️ 𝖠𝗅𝗅 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖲𝖾𝗋𝗏𝗂𝖼𝖾𝗌 𝖺𝗋𝖾 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", threadID, messageID);
        }
      });
      
    } catch (error) {
      console.error("💥 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
      api.sendMessage("⚠️ 𝖠𝗇 𝗎𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", event.threadID, event.messageID);
    }
  }
};

async function fetchImagesWithFallback(keyword, envConfig) {
  const apis = [
    { name: "𝖯𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨 (𝖠𝗌𝗂𝖿 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍)", fetch: fetchFromPrimaryAPI },
    { name: "𝖯𝗂𝗑𝖺𝖻𝖺𝗒 𝖥𝗋𝖾𝖾 𝖠𝖯𝖨", fetch: () => fetchFromPixabay(keyword, envConfig) },
    { name: "𝖡𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 (𝖯𝖾𝗑𝖾𝗅𝗌)", fetch: () => fetchFromPexels(keyword) },
    { name: "𝖡𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 (𝖫𝗈𝗋𝖾𝗆 𝖯𝗂𝖼𝗌𝗎𝗆)", fetch: () => fetchFromLoremPicsum(keyword) }
  ];

  for (const api of apis) {
    try {
      console.log(`⏳ 𝖠𝗍𝗍𝖾𝗆𝗉𝗍𝗂𝗇𝗀 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖿𝗋𝗈𝗆: ${api.name}`);
      const images = await api.fetch();
      
      if (images && images.length > 0) {
        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖿𝖾𝗍𝖼𝗁𝖾𝖽 ${images.length} 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 ${api.name}`);
        return images;
      }
    } catch (err) {
      console.warn(`⚠️ ${api.name} 𝖿𝖺𝗂𝗅𝖾𝖽: ${err.message}`);
    }
  }

  console.error("❌ 𝖠𝗅𝗅 𝖠𝖯𝖨𝗌 𝖿𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗂𝗆𝖺𝗀𝖾𝗌");
  return null;
}

async function fetchFromPrimaryAPI() {
  const response = await axios.get("https://asif-pinterest-api.onrender.com/v1/pinterest", {
    params: { search: encodeURIComponent(keyword) },
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });
  
  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    return response.data.data.map(item => {
      if (typeof item === 'string') return item;
      return item.image || item.url || item.images || item.media || item.src;
    }).filter(url => url && (typeof url === 'string'));
  }
  
  return [];
}

async function fetchFromPixabay(keyword, envConfig) {
  const response = await axios.get("https://pixabay.com/api/", {
    params: {
      key: envConfig.pixabayApiKey,
      q: encodeURIComponent(keyword),
      per_page: 20,
      image_type: "photo",
      orientation: "horizontal"
    },
    timeout: 15000
  });
  
  if (response.data && response.data.hits && Array.isArray(response.data.hits)) {
    return response.data.hits.map(item => item.largeImageURL || item.webformatURL).filter(url => url);
  }
  
  return [];
}

async function fetchFromPexels(keyword) {
  try {
    const response = await axios.get("https://api.pexels.com/v1/search", {
      params: {
        query: encodeURIComponent(keyword),
        per_page: 20
      },
      timeout: 15000,
      headers: {
        'Authorization': 'xWam7eao7qJ3owQMp9tDXT2ej8xVJoSM0EtHMiqj7d0HEUN2Jt2GhSEP',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    if (response.data && response.data.photos && Array.isArray(response.data.photos)) {
      return response.data.photos.map(photo => photo.src.large || photo.src.original).filter(url => url);
    }
  } catch (err) {
    throw new Error(`𝖯𝖾𝗑𝖾𝗅𝗌 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋: ${err.message}`);
  }
  
  return [];
}

async function fetchFromLoremPicsum(keyword) {
  try {
    const urls = [];
    
    for (let i = 0; i < 20; i++) {
      const randomWidth = Math.floor(Math.random() * (1200 - 800 + 1)) + 800;
      const randomHeight = Math.floor(Math.random() * (1200 - 800 + 1)) + 800;
      urls.push(`https://picsum.photos/${randomWidth}/${randomHeight}?random=${i}`);
    }
    
    return urls;
  } catch (err) {
    throw new Error(`𝖫𝗈𝗋𝖾𝗆 𝖯𝗂𝖼𝗌𝗎𝗆 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋: ${err.message}`);
  }
}

async function createSearchBanner(keyword, userId) {
  const width = 700;
  const height = 250;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#8a2387');
  gradient.addColorStop(0.5, '#e94057');
  gradient.addColorStop(1, '#f27121');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw Pinterest logo
  const logoSize = 60;
  const logoPadding = 20;
  const logoX = logoPadding + logoSize/2;
  const logoY = height/2;
  
  ctx.beginPath();
  ctx.arc(logoX, logoY, logoSize/2, 0, Math.PI * 2);
  ctx.fillStyle = '#E60023';
  ctx.fill();
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', logoX, logoY);
  
  // Add decorative elements
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const size = Math.random() * 30 + 15;
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.moveTo(x, y);
    ctx.arc(x, y, size, 0, Math.PI * 2);
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fill();
  
  // Main title
  ctx.font = 'bold 38px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  
  ctx.fillText('𝖯𝖨𝖭𝖳𝖤𝖱𝖤𝖲𝖳 𝖨𝖬𝖠𝖦𝖤 𝖲𝖤𝖠𝖱𝖢𝖧', width / 2, 100);
  
  // Search keyword box
  const text = `"${keyword}"`;
  ctx.font = 'italic 32px Arial';
  const textWidth = ctx.measureText(text).width;
  const boxWidth = textWidth + 50;
  const boxHeight = 60;
  const cornerRadius = 15;
  
  const x = width / 2 - boxWidth / 2;
  const y = 130;
  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + boxWidth - cornerRadius, y);
  ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + cornerRadius);
  ctx.lineTo(x + boxWidth, y + boxHeight - cornerRadius);
  ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - cornerRadius, y + boxHeight);
  ctx.lineTo(x + cornerRadius, y + boxHeight);
  ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - cornerRadius);
  ctx.lineTo(x, y + cornerRadius);
  ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
  ctx.closePath();
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, width / 2, 170);
  
  const bannerPath = path.join(__dirname, "pinsearch_cache", `${userId}_banner.png`);
  await fs.writeFile(bannerPath, canvas.toBuffer('image/png'));
  
  return bannerPath;
}
