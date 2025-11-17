const axios = require("axios");

module.exports = {
  config: {
    name: "nude2",
    author: "Asif",
    category: "Nude-pic",
    version: "2.0.0",
    role: 2,
    shortDescription: {
      en: "Get random nude videos"
    },
    longDescription: {
      en: "Fetch random nude videos from various APIs"
    },
    guide: {
      en: "{p}nude"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ api, event }) {
    let videoStream = null;
    
    try {
      // Dependency check
      let axiosAvailable = true;
      try {
        require("axios");
      } catch (e) {
        axiosAvailable = false;
      }

      if (!axiosAvailable) {
        console.error("❌ Missing axios dependency");
        return; // Don't send error message to avoid spam
      }

      const { threadID, messageID } = event;

      // List of alternative working APIs for nude videos
      const apiEndpoints = [
        {
          url: "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=1&tags=video+-animated_gif&json=1",
          dataPath: "file_url",
          name: "Rule34Video",
          isArray: true
        },
        {
          url: "https://api.nekosapi.com/v2/images/random?rating=explicit&limit=1",
          dataPath: "data[0].image_url",
          name: "NekosAPI"
        },
        {
          url: "https://api.waifu.pics/nsfw/waifu",
          dataPath: "url", 
          name: "WaifuPics"
        },
        {
          url: "https://api.waifu.pics/nsfw/neko",
          dataPath: "url",
          name: "WaifuPics Neko"
        },
        {
          url: "https://api.lolicon.app/setu/v2?r18=1",
          dataPath: "data[0].urls.original",
          name: "LoliconAPI"
        }
      ];

      console.log("🔄 Pre-caching video files...");

      let videoUrl = null;
      let lastError = null;
      let isActualVideo = false;

      // Try each API endpoint
      for (const endpoint of apiEndpoints) {
        try {
          console.log(`📥 Trying ${endpoint.name} API...`);
          
          const response = await axios.get(endpoint.url, {
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json'
            }
          });

          // Extract video URL using the data path
          let data = response.data;
          
          if (endpoint.isArray && Array.isArray(data) && data.length > 0) {
            data = data[0];
          }

          const pathParts = endpoint.dataPath.split('.');
          
          for (const part of pathParts) {
            if (part.includes('[') && part.includes(']')) {
              const arrayPart = part.split('[')[0];
              const index = parseInt(part.split('[')[1].split(']')[0]);
              data = data[arrayPart][index];
            } else {
              data = data[part];
            }
          }

          if (data && typeof data === 'string' && data.startsWith('http')) {
            // Check if URL points to video format
            const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
            isActualVideo = videoExtensions.some(ext => data.toLowerCase().includes(ext));
            
            videoUrl = data;
            console.log(`✅ Found ${isActualVideo ? 'video' : 'media'} from ${endpoint.name}: ${videoUrl}`);
            
            // Prefer actual videos, but accept images as fallback
            if (isActualVideo) {
              break;
            }
          } else {
            throw new Error('Invalid video URL format');
          }

        } catch (apiError) {
          lastError = apiError;
          console.error(`❌ ${endpoint.name} failed:`, apiError.message);
          // Add delay between downloads to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
      }

      if (!videoUrl) {
        throw new Error('All APIs failed: ' + (lastError?.message || 'No video found'));
      }

      console.log("📥 Downloading video files...");

      // Download video with retry
      let downloadSuccess = false;
      let downloadBuffer = null;

      // Download files sequentially to avoid overwhelming the network
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`📥 Download attempt ${attempt} for video...`);
          
          const videoResponse = await axios.get(videoUrl, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'video/*,image/*,*/*'
            },
            validateStatus: function (status) {
              return status >= 200 && status < 400;
            },
            maxContentLength: 50 * 1024 * 1024, // 50MB limit
            maxBodyLength: 50 * 1024 * 1024
          });

          // Verify file has content
          if (!videoResponse.data || videoResponse.data.length < 1000) {
            throw new Error('Downloaded empty or invalid file');
          }

          downloadBuffer = Buffer.from(videoResponse.data);
          downloadSuccess = true;
          console.log(`✅ Successfully downloaded ${isActualVideo ? 'video' : 'media'} (${(downloadBuffer.length / 1024).toFixed(2)} KB)`);
          break;

        } catch (downloadError) {
          console.error(`❌ Download attempt ${attempt} failed:`, downloadError.message);
          
          if (attempt === 3) {
            // Try to re-download the file
            throw new Error('Failed to download video after multiple attempts');
          }
          
          // Add delay between downloads to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!downloadSuccess || !downloadBuffer) {
        throw new Error('Failed to download video');
      }

      // Verify file is readable before sending
      const fileExt = isActualVideo ? 'mp4' : 'jpg';
      const tempPath = require("path").join(__dirname, `temp_nude_${Date.now()}.${fileExt}`);
      require("fs").writeFileSync(tempPath, downloadBuffer);
      
      try {
        const testStream = require("fs").createReadStream(tempPath);
        testStream.on('error', (streamError) => {
          throw streamError;
        });
        testStream.destroy(); // Just testing readability
        require("fs").unlinkSync(tempPath); // Clean up temp file
      } catch (streamError) {
        throw new Error('File is not readable: ' + streamError.message);
      }

      // Create stream from buffer
      const { Readable } = require('stream');
      videoStream = Readable.from(downloadBuffer);

      // Send the video
      await api.sendMessage({
        body: `🔞 Here's your requested content${isActualVideo ? ' (Video)' : ''}`,
        attachment: videoStream
      }, threadID, messageID);

      console.log(`✅ Successfully sent nude ${isActualVideo ? 'video' : 'media'}`);

    } catch (error) {
      console.error("❌ Nude command error:", error.message);
      
      // Don't send error message to avoid spam - use generic message instead
      try {
        await api.sendMessage(
          "🔞 Content is currently unavailable. Please try again later.",
          event.threadID, 
          event.messageID
        );
      } catch (finalError) {
        console.error("❌ Final fallback error:", finalError.message);
      }
    }
  }
};
