const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const path = require("path");

// ==================== CONFIGURATION ====================
const CONFIG = {
  MAX_FILE_SIZE: 25, // MB
  TIMEOUT: 30000, // 30 seconds
  CACHE_DIR: path.join(__dirname, 'cache'),
  STATE_FILE: "autolink.json"
};

// ==================== UTILITY FUNCTIONS ====================
function toBoldSans(text) {
  if (!text || typeof text !== 'string') return text || '';
  
  const map = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠',
    'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺',
    'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  };
  
  return text.replace(/[A-Za-z0-9]/g, char => map[char] || char);
}

function safeReadJSON(filePath, defaultData = {}) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return data && data.trim() ? JSON.parse(data) : defaultData;
    }
  } catch (err) {
    console.error("❌ Error reading JSON:", err.message);
  }
  return defaultData;
}

function safeWriteJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error("❌ Error writing JSON:", err.message);
    return false;
  }
}

function ensureCacheDir() {
  try {
    if (!fs.existsSync(CONFIG.CACHE_DIR)) {
      fs.mkdirSync(CONFIG.CACHE_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    console.error("❌ Error creating cache dir:", err.message);
    return false;
  }
}

async function safeAxiosRequest(config) {
  try {
    const response = await axios({
      timeout: CONFIG.TIMEOUT,
      validateStatus: () => true,
      ...config
    });
    return { success: true, data: response.data, response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function safeDeleteFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn("⚠️ Could not delete file:", err.message);
  }
}

// ==================== STATE MANAGEMENT ====================
let autoLinkStates = safeReadJSON(CONFIG.STATE_FILE, {});

function saveAutoLinkStates() {
  return safeWriteJSON(CONFIG.STATE_FILE, autoLinkStates);
}

// ==================== DOWNLOADER FUNCTIONS ====================
async function fbDownloader(url) {
  try {
    if (!url || typeof url !== 'string') {
      return { success: false, error: "Invalid URL" };
    }

    const response = await safeAxiosRequest({
      method: 'POST',
      url: 'https://snapsave.app/action.php?lang=vn',
      headers: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "Referer": "https://snapsave.app/vn"
      },
      data: qs.stringify({ url })
    });

    if (!response.success) {
      return { success: false, error: response.error };
    }

    let html;
    try {
      const evalCode = response.data.replace('return decodeURIComponent', 'html = decodeURIComponent');
      eval(evalCode);
      html = html.split('innerHTML = "')[1]?.split('";\n')[0]?.replace(/\\"/g, '"');
    } catch (parseError) {
      return { success: false, error: "Failed to parse response" };
    }

    if (!html) {
      return { success: false, error: "Empty response" };
    }

    const $ = cheerio.load(html);
    const download = [];

    $('table tbody tr').each(function () {
      const trElement = $(this);
      const tds = trElement.children();
      const quality = $(tds[0]).text().trim();
      const url = $(tds[2]).children('a').attr('href');
      if (url && typeof url === 'string') {
        download.push({ quality, url });
      }
    });

    return {
      success: download.length > 0,
      video_length: $("div.clearfix > p").text().trim(),
      download
    };
  } catch (err) {
    console.error('❌ Facebook download error:', err.message);
    return { success: false, error: err.message };
  }
}

// ==================== MAIN MODULE ====================
module.exports = {
  config: {
    name: "autolink",
    version: "4.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    shortDescription: "Auto downloader for social media",
    longDescription: "Automatically downloads media from Instagram, Facebook, TikTok, Twitter, Pinterest, and YouTube",
    category: "media",
    guide: "{p}autolink [on/off] - Enable/disable auto downloads"
  },

  onStart: async function ({ event, message, args }) {
    try {
      // Validate inputs
      if (!event || !event.threadID || !message || typeof message.reply !== 'function') {
        return;
      }

      const threadID = event.threadID.toString();

      // Initialize state if not exists
      if (autoLinkStates[threadID] === undefined) {
        autoLinkStates[threadID] = 'on';
        saveAutoLinkStates();
      }

      // Process command
      const action = args[0] ? args[0].toString().toLowerCase().trim() : '';
      
      if (action === 'off') {
        autoLinkStates[threadID] = 'off';
        if (saveAutoLinkStates()) {
          await message.reply(toBoldSans("✅ AutoLink disabled for this chat"));
        }
      } else if (action === 'on') {
        autoLinkStates[threadID] = 'on';
        if (saveAutoLinkStates()) {
          await message.reply(toBoldSans("✅ AutoLink enabled for this chat"));
        }
      } else {
        const status = autoLinkStates[threadID] === 'on' ? '🟢 ON' : '🔴 OFF';
        await message.reply(toBoldSans(
          `📱 AutoLink Status: ${status}\n\n` +
          `Usage:\n` +
          `• ${this.config.name} on - Enable auto downloads\n` +
          `• ${this.config.name} off - Disable auto downloads\n\n` +
          `Supported platforms:\n` +
          `Instagram, Facebook, TikTok, Twitter, Pinterest, YouTube`
        ));
      }
    } catch (error) {
      console.error("❌ Error in onStart:", error.message);
      try {
        await message.reply(toBoldSans("❌ Command failed. Please try again."));
      } catch (e) {}
    }
  },
  
  onChat: async function ({ event, message, api }) {
    try {
      // Comprehensive validation
      if (!event || typeof event !== 'object') return;
      if (!event.body || typeof event.body !== 'string') return;
      if (!event.threadID) return;
      if (!message || typeof message.reply !== 'function') return;

      const threadID = event.threadID.toString();
      
      // Check if autolink is enabled
      if (autoLinkStates[threadID] !== 'on') return;

      // Extract and validate URL
      const linkResult = this.checkLink(event.body);
      if (!linkResult || !linkResult.url) return;

      console.log(toBoldSans(`🔗 Detected: ${linkResult.url}`));
        
      // Process download
      await this.downLoad(linkResult.url, message, event);
        
      // Set reaction if possible
      try {
        if (api && event.messageID) {
          await api.setMessageReaction("✅", event.messageID, () => {}, true);
        }
      } catch (reactionError) {
        // Silent fail for reactions
      }
    } catch (error) {
      console.error("❌ Error in onChat:", error.message);
    }
  },
  
  downLoad: async function (url, message, event) {
    let filePath = null;
    
    try {
      // Validate inputs
      if (!url || typeof url !== 'string' || url.trim() === '') {
        return;
      }

      if (!ensureCacheDir()) {
        await message.reply(toBoldSans("❌ System error: Cannot access cache"));
        return;
      }

      const cleanUrl = url.trim();
      filePath = path.join(CONFIG.CACHE_DIR, `autolink_${Date.now()}.mp4`);

      console.log(toBoldSans(`📥 Downloading: ${cleanUrl}`));

      // Route to appropriate downloader
      if (cleanUrl.includes("instagram.com")) {
        await this.downloadInstagram(cleanUrl, message, filePath);
      } else if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.watch")) {
        await this.downloadFacebook(cleanUrl, message, filePath);
      } else if (cleanUrl.includes("tiktok.com")) {
        await this.downloadTikTok(cleanUrl, message, filePath);
      } else if (cleanUrl.includes("x.com") || cleanUrl.includes("twitter.com")) {
        await this.downloadTwitter(cleanUrl, message, filePath);
      } else if (cleanUrl.includes("pin.it") || cleanUrl.includes("pinterest.com")) {
        await this.downloadPinterest(cleanUrl, message, filePath);
      } else if (cleanUrl.includes("youtu.be") || cleanUrl.includes("youtube.com")) {
        await this.downloadYouTube(cleanUrl, message, filePath);
      } else {
        await message.reply(toBoldSans("❌ Unsupported platform"));
      }
    } catch (error) {
      console.error("❌ Download error:", error.message);
      try {
        await message.reply(toBoldSans("❌ Download failed. Please try again."));
      } catch (e) {}
    } finally {
      safeDeleteFile(filePath);
    }
  },
  
  downloadInstagram: async function (url, message, filePath) {
    try {
      const videoUrl = await this.getInstagramLink(url);
      if (!videoUrl) throw new Error('No video URL found');

      await this.downloadAndSend(videoUrl, filePath, message, "Instagram");
    } catch (err) {
      console.error("❌ Instagram error:", err.message);
      await message.reply(toBoldSans("❌ Instagram download failed"));
    }
  },
  
  downloadFacebook: async function (url, message, filePath) {
    try {
      const res = await fbDownloader(url);
      if (!res.success || !res.download || res.download.length === 0) {
        throw new Error(res.error || 'No download links');
      }

      const videoUrl = res.download[0].url;
      await this.downloadAndSend(videoUrl, filePath, message, "Facebook");
    } catch (err) {
      console.error("❌ Facebook error:", err.message);
      await message.reply(toBoldSans("❌ Facebook download failed"));
    }
  },
  
  downloadTikTok: async function (url, message, filePath) {
    try {
      const videoUrl = await this.getTikTokLink(url);
      if (!videoUrl) throw new Error('No video URL found');

      await this.downloadAndSend(videoUrl, filePath, message, "TikTok");
    } catch (err) {
      console.error("❌ TikTok error:", err.message);
      await message.reply(toBoldSans("❌ TikTok download failed"));
    }
  },
  
  downloadTwitter: async function (url, message, filePath) {
    try {
      const response = await safeAxiosRequest({
        method: "GET",
        url: `https://xdl-twitter.vercel.app/kshitiz?url=${encodeURIComponent(url)}`
      });

      if (!response.success || !response.data?.url) {
        throw new Error('Invalid API response');
      }

      await this.downloadAndSend(response.data.url, filePath, message, "Twitter");
    } catch (err) {
      console.error("❌ Twitter error:", err.message);
      await message.reply(toBoldSans("❌ Twitter download failed"));
    }
  },
  
  downloadPinterest: async function (url, message, filePath) {
    try {
      const response = await safeAxiosRequest({
        method: "GET",
        url: `https://pindl-pinterest.vercel.app/kshitiz?url=${encodeURIComponent(url)}`
      });

      if (!response.success || !response.data?.url) {
        throw new Error('Invalid API response');
      }

      await this.downloadAndSend(response.data.url, filePath, message, "Pinterest");
    } catch (err) {
      console.error("❌ Pinterest error:", err.message);
      await message.reply(toBoldSans("❌ Pinterest download failed"));
    }
  },
  
  downloadYouTube: async function (url, message, filePath) {
    try {
      const response = await safeAxiosRequest({
        method: "GET",
        url: `https://yt-downloader-eta.vercel.app/kshitiz?url=${encodeURIComponent(url)}`
      });

      if (!response.success || !response.data?.['480p']) {
        throw new Error('Invalid API response');
      }

      await this.downloadAndSend(response.data['480p'], filePath, message, "YouTube");
    } catch (err) {
      console.error("❌ YouTube error:", err.message);
      await message.reply(toBoldSans("❌ YouTube download failed"));
    }
  },

  // ==================== HELPER FUNCTIONS ====================
  downloadAndSend: async function (videoUrl, filePath, message, platform) {
    try {
      // Download video
      const response = await safeAxiosRequest({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });

      if (!response.success) {
        throw new Error('Failed to download video');
      }

      // Write to file
      const writer = fs.createWriteStream(filePath);
      response.response.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Check file exists and size
      if (!fs.existsSync(filePath)) {
        throw new Error('Downloaded file not found');
      }

      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024 * 1024);
      
      if (fileSizeInMB > CONFIG.MAX_FILE_SIZE) {
        throw new Error(`File too large (${fileSizeInMB.toFixed(1)}MB > ${CONFIG.MAX_FILE_SIZE}MB)`);
      }

      if (stats.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      // Send media
      const messageBody = 
        `╔════ஜ۩۞۩ஜ═══╗\n` +
        `        𝗔𝘂𝘁𝗼𝗟𝗶𝗻𝗸 𝗕𝗼𝘁\n` +
        `╚════ஜ۩۞۩ஜ═══╝\n\n` +
        `📱 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: ${platform}\n` +
        `🔗 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆`;

      await message.reply({
        body: toBoldSans(messageBody),
        attachment: fs.createReadStream(filePath)
      });

      console.log(toBoldSans(`✅ Successfully sent ${platform} video`));

    } catch (error) {
      console.error(`❌ Error in downloadAndSend (${platform}):`, error.message);
      throw error;
    }
  },

  getInstagramLink: async function (url) {
    try {
      const response = await safeAxiosRequest({
        method: "GET",
        url: `https://insta-downloader-ten.vercel.app/insta?url=${encodeURIComponent(url)}`
      });
      
      return response.success && response.data?.url ? response.data.url : null;
    } catch (error) {
      console.error("❌ Instagram link error:", error.message);
      return null;
    }
  },

  getTikTokLink: async function (url) {
    try {
      const response = await safeAxiosRequest({
        method: "GET",
        url: "https://ssstik.io/en"
      });

      if (!response.success) return null;

      const s_tt_match = response.data.split('s_tt = ')[1];
      if (!s_tt_match) return null;

      const s_tt = s_tt_match.split(',')[0];
      
      const resultResponse = await safeAxiosRequest({
        url: "https://ssstik.io/abc?url=dl",
        method: "POST",
        data: qs.stringify({ id: url, locale: 'en', tt: s_tt }),
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33",
          "content-type": "application/x-www-form-urlencoded"
        }
      });

      if (!resultResponse.success) return null;

      const $ = cheerio.load(resultResponse.data);
      
      if (resultResponse.data.includes('<div class="is-icon b-box warning">')) {
        return null;
      }

      const slide = $(".slide");
      if (slide.length > 0) {
        return $(slide[0]).attr('href');
      }

      return $('.result_overlay_buttons > a').first().attr('href');
    } catch (error) {
      console.error("❌ TikTok link error:", error.message);
      return null;
    }
  },

  checkLink: function (text) {
    try {
      if (!text || typeof text !== 'string' || text.trim() === '') {
        return null;
      }

      const urlRegex = /https?:\/\/[^\s]+/g;
      const urls = text.match(urlRegex);
      
      if (!urls) return null;

      const supportedPlatforms = [
        'instagram.com',
        'facebook.com', 
        'fb.watch',
        'tiktok.com',
        'x.com',
        'twitter.com',
        'pin.it',
        'pinterest.com',
        'youtu.be',
        'youtube.com'
      ];

      for (const url of urls) {
        if (supportedPlatforms.some(platform => url.includes(platform))) {
          return { url: url.trim() };
        }
      }

      return null;
    } catch (error) {
      console.error("❌ Error in checkLink:", error.message);
      return null;
    }
  }
};
