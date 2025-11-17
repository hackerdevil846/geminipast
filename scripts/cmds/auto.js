const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "auto",
    version: "1.0.3",
    author: "Chitron Bhattacharjee",
    countDown: 0,
    role: 0,
    description: {
      en: "Auto download video from tiktok, facebook, Instagram, YouTube, and more",
    },
    category: "MEDIA",
    guide: {
      en: "[video_link]",
    },
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      let dipto = event.body ? event.body.trim() : "";
      
      if (!dipto) return;

      // URL detection with better pattern matching
      const urlPatterns = [
        /https?:\/\/vt\.tiktok\.com\/[^\s]+/i,
        /https?:\/\/www\.tiktok\.com\/[^\s]+/i,
        /https?:\/\/vm\.tiktok\.com\/[^\s]+/i,
        /https?:\/\/www\.facebook\.com\/[^\s]+/i,
        /https?:\/\/fb\.watch\/[^\s]+/i,
        /https?:\/\/www\.instagram\.com\/[^\s]+/i,
        /https?:\/\/youtu\.be\/[^\s]+/i,
        /https?:\/\/youtube\.com\/[^\s]+/i,
        /https?:\/\/x\.com\/[^\s]+/i,
        /https?:\/\/twitter\.com\/[^\s]+/i
      ];

      let videoUrl = null;
      for (const pattern of urlPatterns) {
        const match = dipto.match(pattern);
        if (match) {
          videoUrl = match[0];
          break;
        }
      }

      if (!videoUrl) return;

      console.log(`🎬 Processing video URL: ${videoUrl}`);

      // Set reaction to indicate processing
      try {
        api.setMessageReaction("🐤", event.messageID, () => {}, true);
      } catch (reactionError) {
        console.warn("Could not set reaction:", reactionError.message);
      }

      // Create cache directory if not exists
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, `auto_${Date.now()}.mp4`);

      try {
        // Get download link from API
        const apiUrl = `https://www.noobs-api.rf.gd/dipto/alldl?url=${encodeURIComponent(videoUrl)}`;
        console.log(`📡 Fetching from API: ${apiUrl}`);

        const { data } = await axios.get(apiUrl, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!data || !data.result) {
          throw new Error("No video URL found in API response");
        }

        console.log(`📥 Downloading video from: ${data.result}`);

        // Download the video
        const videoResponse = await axios.get(data.result, {
          responseType: "arraybuffer",
          timeout: 60000,
          maxContentLength: 100 * 1024 * 1024, // 100MB limit
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*'
          }
        });

        // Save video to file
        await fs.writeFile(filePath, Buffer.from(videoResponse.data));
        
        // Check file size
        const stats = await fs.stat(filePath);
        if (stats.size === 0) {
          throw new Error("Downloaded file is empty");
        }

        console.log(`✅ Video downloaded: ${stats.size} bytes`);

        // Set success reaction
        try {
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        } catch (reactionError) {
          console.warn("Could not set success reaction:", reactionError.message);
        }

        // Generate shortened URL if available
        let shortenedUrl = data.result;
        try {
          if (global.utils && global.utils.shortenURL) {
            shortenedUrl = await global.utils.shortenURL(data.result);
          }
        } catch (urlError) {
          console.warn("URL shortening failed:", urlError.message);
        }

        // Send the video
        await api.sendMessage(
          {
            body: `🎬 Auto Video Downloader\n${data.cp ? `📝 ${data.cp}\n` : ''}🔗 Download Link: ${shortenedUrl}\n\n✅ Video downloaded successfully!`,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          (err) => {
            // Cleanup file after sending
            try {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log("🧹 Temporary file cleaned up");
              }
            } catch (cleanupError) {
              console.warn("Cleanup error:", cleanupError.message);
            }
            
            if (err) {
              console.error("Send message error:", err.message);
            }
          },
          event.messageID
        );

        console.log("✅ Video sent successfully");

      } catch (downloadError) {
        console.error("Download error:", downloadError.message);
        throw downloadError;
      }

    } catch (error) {
      console.error("❌ Auto command error:", error.message);
      
      // Set error reaction
      try {
        api.setMessageReaction("❎", event.messageID, () => {}, true);
      } catch (reactionError) {
        console.warn("Could not set error reaction:", reactionError.message);
      }

      // Send error message
      try {
        await api.sendMessage(
          `❌ Auto Download Failed\n\nError: ${error.message}\n\nPlease try again with a different video link.`,
          event.threadID,
          event.messageID
        );
      } catch (sendError) {
        console.error("Could not send error message:", sendError.message);
      }
    }
  },
};
