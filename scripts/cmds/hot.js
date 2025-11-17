const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Video library configuration
const videoLibrary = {
  cacheDir: path.join(__dirname, 'cache', 'hotvideos'),
  maxCacheSize: 10,
  videoLinks: [
    "https://drive.google.com/uc?export=download&id=15Jr-J_idxDeC93oSrz0GsFkWLeutwVu-",
    "https://drive.google.com/uc?export=download&id=15NxnRbMAcxDu5Yn5MM4PmFgftWww55mr",
    "https://drive.google.com/uc?export=download&id=15Fil5wzen-4f34mwSHCzCh6pZKJF7i--",
    "https://drive.google.com/uc?export=download&id=158txfPsgwK1a4Ds0tZrczNJNPpNjACpU",
    "https://drive.google.com/uc?export=download&id=15Lx0NCAozdaV0QR3OQLGoGOB2TKLf_jg",
    "https://drive.google.com/uc?export=download&id=158UG3kV3JEQPbb4zG5KDVJ59G-gIokbm",
    "https://drive.google.com/uc?export=download&id=15ExhciaMohg4UsCsJBr0FdNZXy3OAtkZ",
    "https://drive.google.com/uc?export=download&id=15QBo9GKUvUqWfH5jTcai35FFiS3Duge_"
  ]
};

module.exports = {
  config: {
    name: "hot",
    aliases: ["sexyvid", "spicy"],
    version: "1.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "🔥 Get a random hot video"
    },
    longDescription: {
      en: "Sends a random hot video from the curated library"
    },
    guide: {
      en: "{p}hot"
    },
    countDown: 5
  },

  onLoad: async function() {
    try {
      // Ensure cache directory exists
      await fs.ensureDir(videoLibrary.cacheDir);
      console.log("✅ Hot video cache initialized successfully");
    } catch (error) {
      console.error("❌ Hot command initialization error:", error);
    }
  },

  onStart: async function({ message, event }) {
    try {
      await message.reply("⏳ Fetching a hot video for you...");

      // Get available cached videos
      const availableVideos = await this.getAvailableVideos();
      let videoPath;

      if (availableVideos.length > 0) {
        // Use cached video
        const randomIndex = Math.floor(Math.random() * availableVideos.length);
        videoPath = path.join(videoLibrary.cacheDir, availableVideos[randomIndex]);
        console.log(`✅ Using cached video: ${availableVideos[randomIndex]}`);
      } else {
        // Download new video
        videoPath = await this.downloadNewVideo();
      }

      // Check if video file exists and has content
      if (!fs.existsSync(videoPath)) {
        throw new Error("Video file not found");
      }

      const stats = fs.statSync(videoPath);
      if (stats.size === 0) {
        throw new Error("Video file is empty");
      }

      // Send the video
      await message.reply({
        body: "🔥 Here's a hot video for you!",
        attachment: fs.createReadStream(videoPath)
      });

    } catch (error) {
      console.error("❌ Hot command error:", error);
      
      let errorMessage = "❌ Failed to get a hot video. Please try again later.";
      
      if (error.message.includes("timeout")) {
        errorMessage = "⏰ Download timeout. Please try again.";
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = "🌐 Network error. Please check your connection.";
      } else if (error.message.includes("404")) {
        errorMessage = "❌ Video not found. Please try another video.";
      }
      
      await message.reply(errorMessage);
    }
  },

  getAvailableVideos: async function() {
    try {
      if (!fs.existsSync(videoLibrary.cacheDir)) {
        return [];
      }
      
      const files = await fs.readdir(videoLibrary.cacheDir);
      return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp4', '.avi', '.mov', '.mkv'].includes(ext);
      });
    } catch (error) {
      console.error("❌ Error reading video cache:", error);
      return [];
    }
  },

  downloadNewVideo: async function() {
    const randomLink = videoLibrary.videoLinks[
      Math.floor(Math.random() * videoLibrary.videoLinks.length)
    ];

    const fileName = `hot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`;
    const filePath = path.join(videoLibrary.cacheDir, fileName);

    try {
      console.log(`📥 Downloading video from: ${randomLink}`);

      const response = await axios({
        method: 'GET',
        url: randomLink,
        responseType: 'stream',
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*'
        }
      });

      // Check response status
      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: Failed to download video`);
      }

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', (error) => {
          reject(new Error(`File write error: ${error.message}`));
        });
      });

      // Verify the downloaded file
      if (!fs.existsSync(filePath)) {
        throw new Error("Downloaded file not found");
      }

      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      console.log(`✅ Video downloaded successfully: ${fileName} (${stats.size} bytes)`);

      // Cleanup old cache files
      await this.cleanupCache();

      return filePath;

    } catch (error) {
      console.error("❌ Video download failed:", error);

      // Cleanup failed download
      try {
        if (fs.existsSync(filePath)) {
          await fs.unlink(filePath);
        }
      } catch (cleanupErr) {
        console.error("❌ Cleanup error:", cleanupErr);
      }

      throw new Error(`Failed to download video: ${error.message}`);
    }
  },

  cleanupCache: async function() {
    try {
      const files = await this.getAvailableVideos();
      if (files.length <= videoLibrary.maxCacheSize) return;

      // Get file stats for all files
      const fileStats = [];
      for (const file of files) {
        const filePath = path.join(videoLibrary.cacheDir, file);
        const stats = await fs.stat(filePath);
        fileStats.push({ file, mtime: stats.mtimeMs });
      }

      // Sort by modification time (oldest first)
      fileStats.sort((a, b) => a.mtime - b.mtime);

      const deleteCount = fileStats.length - videoLibrary.maxCacheSize;
      const filesToDelete = fileStats.slice(0, deleteCount);

      // Delete oldest files
      for (const item of filesToDelete) {
        const filePath = path.join(videoLibrary.cacheDir, item.file);
        await fs.unlink(filePath);
        console.log(`🗑️ Deleted old video: ${item.file}`);
      }

      console.log(`✅ Cleaned up ${deleteCount} old video(s) from cache`);

    } catch (error) {
      console.error("❌ Cache cleanup error:", error);
    }
  }
};
