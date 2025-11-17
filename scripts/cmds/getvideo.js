const axios = require('axios');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { URL } = require('url');

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB
const AXIOS_TIMEOUT = 30_000; // 30 seconds

async function downloadFile(url, filepath) {
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: AXIOS_TIMEOUT,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'identity'
      }
    });

    // If Content-Length present, check early
    const total = parseInt(response.headers['content-length'] || '0', 10);
    if (total && total > MAX_FILE_BYTES) {
      response.data.destroy();
      throw new Error(`File too large (${Math.round(total / (1024*1024))} MB). Limit: ${MAX_FILE_BYTES / (1024*1024)} MB.`);
    }

    const writer = fs.createWriteStream(filepath);
    let received = 0;

    return new Promise((resolve, reject) => {
      let errorOccurred = false;

      response.data.on('data', chunk => {
        received += chunk.length;
        if (received > MAX_FILE_BYTES) {
          errorOccurred = true;
          response.data.destroy();
          writer.destroy();
          reject(new Error(`Downloaded data exceeded limit of ${MAX_FILE_BYTES} bytes.`));
        }
      });

      response.data.pipe(writer);

      writer.on('finish', () => {
        if (!errorOccurred) resolve();
      });

      writer.on('error', err => {
        errorOccurred = true;
        writer.close();
        reject(err);
      });

      response.data.on('error', err => {
        errorOccurred = true;
        writer.close();
        reject(err);
      });
    });
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
}

/**
 * Attempt to dynamically import snapsave-media-downloader and return a callable function.
 * Returns null if unable.
 */
async function loadSnapsaveFn() {
  try {
    const mod = await import('snapsave-media-downloader');
    // Various package export shapes:
    if (typeof mod === 'function') return mod;
    if (mod.default && typeof mod.default === 'function') return mod.default;
    if (mod.snapsave && typeof mod.snapsave === 'function') return mod.snapsave;
    // any function export
    for (const k of Object.keys(mod)) {
      if (typeof mod[k] === 'function') return mod[k];
    }
    return null;
  } catch (err) {
    // Import failed (not installed or incompatible)
    return null;
  }
}

/**
 * Normalize and pick a usable media object from a variety of scraper responses.
 * Expected to return { url, type } for the first usable media, or null.
 */
function pickMedia(result) {
  if (!result) return null;

  // Common normalized shape: { success, data: { media: [ { url, type } ] } }
  if (result.success && result.data && Array.isArray(result.data.media) && result.data.media.length) {
    const m = result.data.media[0];
    if (m && m.url) return { url: m.url, type: m.type || 'video' };
  }

  // Some libs return array directly
  if (Array.isArray(result) && result.length) {
    const m = result[0];
    if (m && (m.url || typeof m === 'string')) {
      return { url: m.url || m, type: m.type || 'video' };
    }
  }

  // aiovideodl-like shapes: { url, download, sources }
  if (result.download && typeof result.download === 'string') {
    return { url: result.download, type: 'video' };
  }
  if (result.url && typeof result.url === 'string') {
    return { url: result.url, type: 'video' };
  }
  if (result.sources && Array.isArray(result.sources) && result.sources.length) {
    const s = result.sources[0];
    return { url: s.url || s, type: s.type || 'video' };
  }

  return null;
}

module.exports = {
  config: {
    name: "getvideo",
    aliases: ["video", "download", "vd"],
    version: "1.0.1",
    author: "System",
    countDown: 10,
    role: 0,
    category: "media",
    shortDescription: {
      en: "Download video from various platforms"
    },
    longDescription: {
      en: "Download videos from YouTube, TikTok, Facebook, Instagram, Twitter, Reddit and more"
    },
    guide: {
      en: "{p}getvideo [video_url]"
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const url = args[0];
      if (!url) {
        return message.reply('📹 Please provide a video URL\n\nSupported platforms:\n• YouTube\n• TikTok\n• Facebook\n• Instagram\n• Twitter\n• Reddit\n\nExample: getvideo https://www.tiktok.com/...');
      }

      // Basic URL validation
      if (!url.startsWith('http')) {
        return message.reply('❌ Please provide a valid URL starting with http:// or https://');
      }

      const lc = url.toLowerCase();
      if (lc.includes('spotify.com')) {
        return message.reply('❌ Spotify links are not supported.');
      }

      let platform = null;
      if (/youtu\.be|youtube\.com/.test(lc)) platform = 'youtube';
      else if (/tiktok\.com|vt\.tiktok\.com/.test(lc)) platform = 'tiktok';
      else if (/twitter\.com|x\.com/.test(lc)) platform = 'twitter';
      else if (/instagram\.com|instagr\.am/.test(lc)) platform = 'instagram';
      else if (/facebook\.com|fb\.watch/.test(lc)) platform = 'facebook';
      else if (/reddit\.com/.test(lc)) platform = 'reddit';
      else if (/pinterest\.com|pin\.it/.test(lc)) platform = 'pinterest';

      if (!platform) {
        return message.reply('❌ Platform not recognized or not supported.\n\nSupported: YouTube, TikTok, Facebook, Instagram, Twitter, Reddit');
      }
      if (platform === 'pinterest') {
        return message.reply('❌ Downloading from Pinterest is not supported at this time.');
      }

      let downloadUrl;
      let title = 'download';
      let extension = 'mp4';
      const cleanup = [];

      // Show processing reaction
      try {
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
      } catch (e) {
        console.log('Could not set reaction:', e.message);
      }

      try {
        if (platform === 'youtube') {
          // Use Cobalt.tools API
          const res = await axios.post('https://api.cobalt.tools/api/json', {
            url: url,
            filenamePattern: 'basic'
          }, {
            headers: {
              Accept: 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: AXIOS_TIMEOUT
          });

          const data = res.data || {};
          if (data.status !== 'stream' || !data.url) {
            return message.reply('❌ Error: Could not retrieve YouTube video via Cobalt API. The video may be private or unavailable.');
          }

          downloadUrl = data.url;
          title = data.filename || 'youtube_video';
          extension = data.ext || 'mp4';

        } else {
          // Non-YouTube: try snapsave first
          let mediaObj = null;
          const snapsaveFn = await loadSnapsaveFn();

          if (snapsaveFn) {
            try {
              const snapsaveResult = await snapsaveFn(url);
              mediaObj = pickMedia(snapsaveResult);
            } catch (err) {
              console.warn('Snapsave call error:', err.message);
              mediaObj = null;
            }
          }

          // fallback to aiovideodl-like public scraper
          if (!mediaObj) {
            try {
              const fallbackResp = await axios.get(`https://api.aiovideodl.ml/scrape?url=${encodeURIComponent(url)}`, {
                timeout: AXIOS_TIMEOUT,
                headers: { 
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  Accept: 'application/json' 
                }
              });
              const fbData = fallbackResp.data;
              mediaObj = pickMedia(fbData);
            } catch (err) {
              console.warn('Fallback scrape attempt failed:', err.message);
              mediaObj = null;
            }
          }

          if (!mediaObj) {
            return message.reply('❌ Error: Could not retrieve media. Possible reasons:\n• Link is invalid or private\n• Server is temporarily unavailable\n• Platform is not supported');
          }

          downloadUrl = mediaObj.url;
          extension = /\.mp4(?:$|\?)/i.test(downloadUrl) ? 'mp4'
                    : /\.(jpe?g|png|gif)(?:$|\?)/i.test(downloadUrl) ? 'jpg' : 'mp4';
          
          try {
            const urlObj = new URL(url);
            const parsedPath = path.parse(urlObj.pathname);
            title = parsedPath.name || platform;
          } catch (e) {
            title = platform;
          }
        }

        if (!downloadUrl) {
          return message.reply('❌ Error: Could not determine direct download URL.');
        }

        console.log(`📥 Downloading from: ${downloadUrl}`);

        // Build safe temp filename
        const safeBase = (title || 'download').replace(/[^\w\-]+/g, '_').substring(0, 50);
        const suffix = crypto.randomBytes(4).toString('hex');
        const tmpName = `${safeBase}_${suffix}.${extension}`;
        const tmpPath = path.join(os.tmpdir(), tmpName);
        cleanup.push(tmpPath);

        // Show downloading reaction
        try {
          api.setMessageReaction("📥", event.messageID, () => {}, true);
        } catch (e) {}

        // Download to temp path
        await downloadFile(downloadUrl, tmpPath);

        // Check if file was downloaded successfully
        const stats = await fsPromises.stat(tmpPath);
        if (stats.size === 0) {
          throw new Error('Downloaded file is empty');
        }

        console.log(`✅ Video downloaded: ${stats.size} bytes`);

        // Show success reaction
        try {
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        } catch (e) {}

        // Send the video file
        await message.reply({
          body: `🎬 Video Downloaded Successfully!\n📹 ${safeBase}.${extension}\n🔗 Source: ${platform}`,
          attachment: fs.createReadStream(tmpPath)
        });

        console.log('✅ Video sent successfully');

      } catch (err) {
        console.error('Getvideo processing error:', err.message);
        
        // Show error reaction
        try {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
        } catch (e) {}
        
        // Cleanup temp files
        try {
          for (const f of cleanup) {
            if (f && fs.existsSync(f)) {
              await fsPromises.unlink(f);
            }
          }
        } catch (cleanupError) {
          console.warn('Cleanup error:', cleanupError.message);
        }
        
        return message.reply(`❌ Download failed: ${err.message}\n\nPlease try again with a different link.`);
      }

      // Final cleanup
      try {
        for (const f of cleanup) {
          if (f && fs.existsSync(f)) {
            await fsPromises.unlink(f);
          }
        }
      } catch (finalCleanupError) {
        console.warn('Final cleanup error:', finalCleanupError.message);
      }

    } catch (error) {
      console.error('Getvideo command error:', error);
      
      try {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
      } catch (e) {}
      
      await message.reply('❌ An unexpected error occurred while processing your request. Please try again later.');
    }
  }
};
