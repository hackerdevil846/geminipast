const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "vidx",
    aliases: [],
    version: "2.2",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    category: "𝗆𝖾𝖽𝗂𝖺",
    shortDescription: {
      en: "🔍 𝖲𝖾𝖺𝗋𝖼𝗁 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈𝗌"
    },
    longDescription: {
      en: "𝖲𝖾𝖺𝗋𝖼𝗁 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈𝗌 𝖽𝗂𝗋𝖾𝖼𝗍𝗅𝗒 𝗍𝗈 𝖼𝗁𝖺𝗍"
    },
    guide: {
      en: "{p}vidx [𝗌𝖾𝖺𝗋𝖼𝗁 𝗍𝖾𝗋𝗆]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ message, args, event }) {
    // Dependency check
    let axiosAvailable = true;
    let fsAvailable = true;
    let pathAvailable = true;

    try {
      require("axios");
      require("fs-extra");
      require("path");
    } catch (e) {
      axiosAvailable = false;
      fsAvailable = false;
      pathAvailable = false;
    }

    if (!axiosAvailable || !fsAvailable || !pathAvailable) {
      console.error("❌ Missing dependencies");
      return;
    }

    const query = args.join(" ");
    if (!query) {
      return message.reply("❌ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗌𝖾𝖺𝗋𝖼𝗁 𝗍𝖾𝗋𝗆.\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: /𝗏𝗂𝖽𝗑 𝗍𝖾𝖾𝗇");
    }

    try {
      // Show searching message
      const searchingMsg = await message.reply(`🔍 | 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗈𝗋: "${query}"...`);

      // Try different API endpoints
      const apiEndpoints = [
        `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(query)}&per_page=10&format=json`,
        `https://api.eporner.com/v2/video/search/?query=${encodeURIComponent(query)}&per_page=10&format=json`
      ];

      let data = null;
      let lastError = null;

      for (const apiUrl of apiEndpoints) {
        try {
          console.log(`🔍 Trying API: ${apiUrl}`);
          const res = await axios.get(apiUrl, {
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json',
              'Referer': 'https://www.eporner.com/'
            }
          });
          
          data = res.data;
          console.log(`✅ API response received`);
          break;
        } catch (apiError) {
          lastError = apiError;
          console.error(`❌ API failed:`, apiError.message);
          continue;
        }
      }

      if (!data) {
        await message.unsend(searchingMsg.messageID);
        return message.reply(`❌ | 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗈𝗇𝗇𝖾𝖼𝗍 𝗍𝗈 𝗏𝗂𝖽𝖾𝗈 𝖽𝖺𝗍𝖺𝖻𝖺𝗌𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.`);
      }

      // Properly handle different API response formats
      let videos = [];
      if (data.videos && Array.isArray(data.videos)) {
        videos = data.videos;
      } else if (data.data && Array.isArray(data.data)) {
        videos = data.data;
      } else if (Array.isArray(data)) {
        videos = data;
      }

      if (!videos.length) {
        await message.unsend(searchingMsg.messageID);
        return message.reply(`❌ | 𝖭𝗈 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋: "${query}"`);
      }

      const topVideos = videos.slice(0, 5);
      let output = `🔍 𝖲𝖾𝖺𝗋𝖼𝗁 𝖱𝖾𝗌𝗎𝗅𝗍𝗌 𝖿𝗈𝗋: "${query}"\n\n`;
      
      // Add video list
      topVideos.forEach((video, index) => {
        const title = video.title || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖳𝗂𝗍𝗅𝖾';
        const duration = video.length_min || video.duration || '?';
        const rating = video.rating || '?';
        const quality = video.quality || video.definition || '?';
        
        output += `${index + 1}. ${title}\n`;
        output += `   ⏰ ${duration} 𝗆𝗂𝗇 | 👍 ${rating}/5\n`;
        output += `   📊 𝖰𝗎𝖺𝗅𝗂𝗍𝗒: ${quality}\n\n`;
      });

      output += `💬 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗇𝗎𝗆𝖻𝖾𝗋 (1-${topVideos.length}) 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝖾 𝗏𝗂𝖽𝖾𝗈.`;

      // Send thumbnail of first video as preview
      let previewThumb = null;
      if (topVideos[0].default_thumb && topVideos[0].default_thumb.src) {
        previewThumb = topVideos[0].default_thumb.src;
      } else if (topVideos[0].thumb) {
        previewThumb = topVideos[0].thumb;
      } else if (topVideos[0].thumbnail) {
        previewThumb = topVideos[0].thumbnail;
      }

      await message.unsend(searchingMsg.messageID);
      
      if (previewThumb) {
        await message.reply({
          body: output,
          attachment: await global.utils.getStreamFromURL(previewThumb)
        });
      } else {
        await message.reply(output);
      }

      // Store video data for reply handling
      global.vidxData = global.vidxData || {};
      global.vidxData[event.messageID] = {
        videos: topVideos,
        query: query,
        timestamp: Date.now()
      };

      // Auto cleanup after 5 minutes
      setTimeout(() => {
        if (global.vidxData && global.vidxData[event.messageID]) {
          delete global.vidxData[event.messageID];
        }
      }, 5 * 60 * 1000);

    } catch (error) {
      console.error("❌ Vidx Search Error:", error);
      return message.reply("❌ | 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝖺𝗋𝖼𝗁 𝗏𝗂𝖽𝖾𝗈𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    let filePath = null;
    
    try {
      if (!global.vidxData || !global.vidxData[event.messageReply?.messageID]) {
        return message.reply("❌ | 𝖲𝖾𝗌𝗌𝗂𝗈𝗇 𝖾𝗑𝗉𝗂𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗍𝖺𝗋𝗍 𝖺 𝗇𝖾𝗐 𝗌𝖾𝖺𝗋𝖼𝗁.");
      }

      const replyMessageID = event.messageReply.messageID;
      const { videos, query } = global.vidxData[replyMessageID];
      const selectedNum = parseInt(event.body.trim());

      if (isNaN(selectedNum) || selectedNum < 1 || selectedNum > videos.length) {
        return message.reply(`❌ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 1 𝖺𝗇𝖽 ${videos.length}.`);
      }

      const videoIndex = selectedNum - 1;
      const selectedVideo = videos[videoIndex];

      // Show processing message
      const processingMsg = await message.reply(`⏳ | 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈...`);

      try {
        // Get video ID and details
        const videoId = selectedVideo.id;
        let downloadUrl = null;

        console.log("🔄 Pre-caching video files...");

        // Try multiple methods to get direct video URL
        const videoUrlAttempts = [
          // Method 1: Try embed URL
          selectedVideo.embed_url,
          // Method 2: Try default video URL
          selectedVideo.url,
          // Method 3: Construct URL from ID
          `https://www.eporner.com/video-${videoId}/`,
          // Method 4: Try API download endpoint
          `https://www.eporner.com/api/v2/video/download/?id=${videoId}&format=json`
        ];

        for (const url of videoUrlAttempts) {
          if (!url) continue;
          
          try {
            console.log(`🔗 Trying URL: ${url}`);
            const response = await axios.get(url, {
              timeout: 10000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            
            const html = response.data;
            
            // Look for MP4 URLs in the content
            const mp4Matches = html.match(/https:\/\/[^"']*\.mp4[^"']*/gi);
            if (mp4Matches && mp4Matches.length > 0) {
              downloadUrl = mp4Matches[0];
              console.log(`✅ Found MP4 URL: ${downloadUrl}`);
              break;
            }
            
            // Look for video sources
            const sourceMatch = html.match(/<source[^>]*src="([^"]*\.mp4[^"]*)"/i);
            if (sourceMatch) {
              downloadUrl = sourceMatch[1];
              console.log(`✅ Found source URL: ${downloadUrl}`);
              break;
            }
            
          } catch (urlError) {
            console.error(`❌ URL attempt failed:`, urlError.message);
            continue;
          }
        }

        if (!downloadUrl) {
          throw new Error("Could not find direct video URL");
        }

        console.log("📥 Downloading video file...");

        // Download video file with retry
        const downloadVideoFile = async (url, maxRetries = 3) => {
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              console.log(`📥 Video download attempt ${attempt}`);
              const response = await axios.get(url, { 
                responseType: 'arraybuffer',
                timeout: 120000, // 2 minutes for large files
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  'Accept': 'video/mp4,video/*,*/*',
                  'Referer': 'https://www.eporner.com/'
                }
              });

              // Verify file has content
              if (!response.data || response.data.length === 0) {
                throw new Error('Downloaded empty file');
              }

              // Check if it's a reasonable video file size
              if (response.data.length < 100000) { // Less than 100KB
                throw new Error('File too small to be a video');
              }

              console.log(`✅ Video file downloaded (${(response.data.length / 1024 / 1024).toFixed(2)} MB)`);
              return Buffer.from(response.data);

            } catch (error) {
              console.error(`❌ Video download attempt ${attempt} failed:`, error.message);
              if (attempt === maxRetries) throw error;
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }
        };

        const videoBuffer = await downloadVideoFile(downloadUrl);
        
        // Save to temporary file
        filePath = path.join(__dirname, `cache/video_${Date.now()}.mp4`);
        const cacheDir = path.dirname(filePath);
        
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, videoBuffer);

        // Verify the saved file
        if (!fs.existsSync(filePath)) {
          throw new Error('Failed to save video file');
        }

        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          throw new Error('Saved video file is empty');
        }

        // Verify file is readable before sending
        try {
          const testStream = fs.createReadStream(filePath);
          testStream.on('error', (streamError) => {
            throw streamError;
          });
          testStream.destroy();
        } catch (streamError) {
          throw new Error('File is not readable: ' + streamError.message);
        }

        await message.unsend(processingMsg.messageID);

        // 🎯 CRITICAL: Send ONLY the video file - no text, no links, no additional content
        await message.reply({
          attachment: fs.createReadStream(filePath)
        });

        console.log("✅ Successfully sent video file directly to chat");

      } catch (videoError) {
        console.error("❌ Video processing error:", videoError);
        await message.unsend(processingMsg.messageID);
        
        // Don't send error message with links - use generic message
        await message.reply("❌ | Could not download the video. Please try another selection.");
      }

      // Clean up stored data
      delete global.vidxData[replyMessageID];

    } catch (error) {
      console.error("❌ Vidx Reply Error:", error);
      
      // Don't send detailed error messages
      try {
        await message.reply("❌ | Failed to process your selection. Please try again.");
      } catch (finalError) {
        console.error("❌ Final fallback error:", finalError.message);
      }
      
      // Clean up on error
      if (global.vidxData && global.vidxData[event.messageReply?.messageID]) {
        delete global.vidxData[event.messageReply.messageID];
      }
    } finally {
      // Cleanup temporary files
      try {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("🧹 Cleaned up video file");
        }
      } catch (cleanupError) {
        console.warn("⚠️ Cleanup warning:", cleanupError.message);
      }
    }
  }
};
