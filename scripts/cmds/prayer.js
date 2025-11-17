const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');

module.exports = {
  config: {
    name: "prayertime",
    aliases: [],
    version: "1.3.0",
    author: "Asif Mahmud",
    countDown: 0,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "Automated prayer time notifications with audio reminders"
    },
    longDescription: {
      en: "Automated prayer time notifications with messages and audio reminders"
    },
    guide: {
      en: "N/A (auto-timed)"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "node-cron": ""
    }
  },

  // Prayer configuration with messages and audio URLs
  PRAYER_CONFIG: {
    "Fajr": {
      message: "🕌 Fajr Azan Time\n\nPrepare for prayer\nFajr prayer will start soon\n\nMay Allah accept your prayers",
      audio: "https://drive.google.com/uc?id=1m5jiP4q9"
    },
    "Dhuhr": {
      message: "🕌 Dhuhr Azan Time\n\nPrepare for prayer\nDhuhr prayer will start soon\n\nMay Allah accept your prayers",
      audio: "https://drive.google.com/uc?id=1mB8EpEEb"
    },
    "Asr": {
      message: "🕌 Asr Azan Time\n\nPrepare for prayer\nAsr prayer will start soon\n\nMay Allah accept your prayers",
      audio: "https://drive.google.com/uc?id=1mkNnhFFv"
    },
    "Maghrib": {
      message: "🕌 Maghrib Azan Time\n\nPrepare for prayer\nMaghrib prayer will start soon\n\nMay Allah accept your prayers",
      audio: "https://drive.google.com/uc?id=1mNVwfsTE"
    },
    "Isha": {
      message: "🕌 Isha Azan Time\n\nPrepare for prayer\nIsha prayer will start soon\n\nMay Allah accept your prayers",
      audio: "https://drive.google.com/uc?id=1mP2HJlKR"
    }
  },

  // Fallback prayer times for Dhaka, Bangladesh
  FALLBACK_TIMES: {
    Fajr: "05:35",
    Dhuhr: "13:00",
    Asr: "16:30",
    Maghrib: "19:05",
    Isha: "20:15"
  },

  // Store scheduled tasks
  scheduledTasks: [],

  onStart: async function({ api }) {
    try {
      console.log("🕌 Initializing prayer time reminders...");
      
      // Check dependencies
      try {
        require("axios");
        require("fs-extra");
        require("path");
        require("node-cron");
      } catch (err) {
        console.error("❌ Missing dependencies. Please install: axios, fs-extra, path, node-cron");
        return;
      }

      // Create cache directory
      const cacheDir = path.join(__dirname, 'prayer_cache');
      try {
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
          console.log("✅ Created prayer cache directory");
        }
      } catch (dirError) {
        console.error("❌ Failed to create cache directory:", dirError.message);
      }
      
      // Pre-download audio files
      console.log("📥 Pre-downloading audio files...");
      for (const [prayerName, config] of Object.entries(this.PRAYER_CONFIG)) {
        const audioPath = path.join(cacheDir, `${prayerName}.mp3`);
        if (!fs.existsSync(audioPath)) {
          try {
            console.log(`📥 Downloading ${prayerName} audio...`);
            const response = await axios({
              method: 'GET',
              url: config.audio,
              responseType: 'stream',
              timeout: 30000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });

            const writer = fs.createWriteStream(audioPath);
            response.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });
            console.log(`✅ Downloaded ${prayerName} audio`);
          } catch (error) {
            console.error(`❌ Failed to download ${prayerName} audio:`, error.message);
          }
        } else {
          console.log(`✅ ${prayerName} audio already exists`);
        }
      }
      
      // Schedule prayer notifications
      await this.schedulePrayerNotifications(api);
      
      // Schedule daily reset at midnight (Asia/Dhaka time)
      const resetTask = cron.schedule('0 0 * * *', async () => {
        console.log("🔄 Rescheduling prayer notifications for the new day...");
        await this.schedulePrayerNotifications(api);
      }, {
        scheduled: true,
        timezone: "Asia/Dhaka"
      });

      this.scheduledTasks.push(resetTask);

      console.log("✅ Prayer reminders initialized successfully");
      
    } catch (error) {
      console.error("💥 Error in prayer command initialization:", error);
    }
  },

  schedulePrayerNotifications: async function(api) {
    try {
      console.log("📅 Scheduling prayer notifications...");
      
      // Clear existing schedules
      this.scheduledTasks.forEach(task => {
        try {
          if (task && typeof task.stop === 'function') {
            task.stop();
          }
        } catch (error) {
          console.error("❌ Error stopping task:", error.message);
        }
      });
      this.scheduledTasks = [];
      
      // Get prayer times
      const timings = await this.getPrayerTimes();
      
      // Schedule each prayer
      for (const [prayerName, config] of Object.entries(this.PRAYER_CONFIG)) {
        const time = timings[prayerName];
        if (!time) {
          console.log(`❌ No time found for ${prayerName}`);
          continue;
        }
        
        try {
          // Convert to cron format (HH:mm -> mm HH * * *)
          const [hours, minutes] = time.split(':');
          const cronTime = `${minutes} ${hours} * * *`;
          
          const task = cron.schedule(cronTime, async () => {
            console.log(`🕌 Sending ${prayerName} notification at ${time}`);
            await this.sendPrayerNotification(api, prayerName);
          }, {
            scheduled: true,
            timezone: "Asia/Dhaka"
          });
          
          this.scheduledTasks.push(task);
          console.log(`✅ Scheduled ${prayerName} at ${time}`);
          
        } catch (scheduleError) {
          console.error(`❌ Failed to schedule ${prayerName}:`, scheduleError.message);
        }
      }
      
      console.log("✅ All prayer notifications scheduled");
    } catch (error) {
      console.error("💥 Error scheduling prayer notifications:", error);
    }
  },

  getPrayerTimes: async function() {
    try {
      console.log("🕐 Fetching prayer times...");
      
      // Fetch prayer times for Dhaka, Bangladesh
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1`,
        { 
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );
      
      if (response.data && response.data.data && response.data.data.timings) {
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = response.data.data.timings;
        console.log(`✅ Got prayer times: Fajr(${Fajr}), Dhuhr(${Dhuhr}), Asr(${Asr}), Maghrib(${Maghrib}), Isha(${Isha})`);
        return { Fajr, Dhuhr, Asr, Maghrib, Isha };
      } else {
        throw new Error("Invalid response format");
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch prayer times, using fallback:', error.message);
      return this.FALLBACK_TIMES;
    }
  },

  sendPrayerNotification: async function(api, prayerName) {
    const config = this.PRAYER_CONFIG[prayerName];
    if (!config) {
      console.error(`❌ No config found for ${prayerName}`);
      return;
    }
    
    try {
      const cacheDir = path.join(__dirname, 'prayer_cache');
      const audioPath = path.join(cacheDir, `${prayerName}.mp3`);
      
      console.log(`📢 Sending ${prayerName} notification...`);
      
      // Check if audio file exists
      let attachment = null;
      if (fs.existsSync(audioPath)) {
        try {
          attachment = fs.createReadStream(audioPath);
          console.log(`✅ Audio file found for ${prayerName}`);
        } catch (audioError) {
          console.error(`❌ Failed to read audio file:`, audioError.message);
        }
      } else {
        console.log(`⚠️ No audio file found for ${prayerName}`);
      }

      // Create message data
      const messageData = {
        body: config.message
      };
      
      if (attachment) {
        messageData.attachment = attachment;
      }

      // Send to all active threads
      if (global.data && global.data.allThreadID && Array.isArray(global.data.allThreadID)) {
        const threads = global.data.allThreadID;
        console.log(`📤 Sending to ${threads.length} threads...`);
        
        for (const threadID of threads) {
          try {
            await api.sendMessage(messageData, threadID);
            console.log(`✅ Sent ${prayerName} notification to thread: ${threadID}`);
            
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (threadError) {
            console.error(`❌ Failed to send to thread ${threadID}:`, threadError.message);
          }
        }
      } else {
        console.log("⚠️ No threads found to send notifications");
      }

    } catch (error) {
      console.error(`💥 Error sending ${prayerName} notification:`, error);
      
      // Fallback to text-only message
      try {
        if (global.data && global.data.allThreadID && Array.isArray(global.data.allThreadID)) {
          for (const threadID of global.data.allThreadID) {
            try {
              await api.sendMessage(config.message, threadID);
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (fallbackError) {
              console.error(`❌ Fallback failed for thread ${threadID}:`, fallbackError.message);
            }
          }
        }
      } catch (finalError) {
        console.error("💥 Final fallback failed:", finalError);
      }
    }
  },

  onExit: function() {
    try {
      // Clean up scheduled tasks when bot stops
      this.scheduledTasks.forEach(task => {
        try {
          if (task && typeof task.stop === 'function') {
            task.stop();
          }
        } catch (error) {
          console.error("❌ Error stopping task on exit:", error.message);
        }
      });
      this.scheduledTasks = [];
      console.log("🧹 Cleaned up prayer reminder tasks");
    } catch (error) {
      console.error("💥 Error during cleanup:", error);
    }
  }
};
