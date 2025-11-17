const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

// Global storage for badwordblock settings
const badwordSettings = new Map();

module.exports = {
  config: {
    name: "badwordblock",
    aliases: [],
    version: "2.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 1,
    category: "protection",
    shortDescription: {
      en: "🛡️ Auto-blocks bad words"
    },
    longDescription: {
      en: "Automatically detects bad words and sends warnings with ON/OFF system"
    },
    guide: {
      en: "{p}badwordblock [on/off/status]"
    }
  },

  // 🟢 Auto-enable when bot starts
  onLoad: async function({ threadsData }) {
    try {
      console.log("🔄 Auto-enabling BadWordBlock in all groups...");
      
      const allThreads = await threadsData.getAll();
      let enabledCount = 0;

      for (const thread of allThreads) {
        try {
          if (thread && thread.id) {
            await threadsData.set(thread.id, true, "settings.badwordblock");
            badwordSettings.set(thread.id, true);
            console.log(`✅ Auto-enabled badwordblock for group: ${thread.id}`);
            enabledCount++;
          }
        } catch (error) {
          console.error(`❌ Failed to auto-enable for thread ${thread?.id}:`, error.message);
        }
      }
      console.log(`✅ BadWordBlock auto-enabled in ${enabledCount} groups`);
    } catch (error) {
      console.error("❌ Error initializing badwordblock:", error);
    }
  },

  onStart: async function({ message, event, args, threadsData }) {
    try {
      const { threadID } = event;

      if (args[0]) {
        const action = args[0].toLowerCase().trim();
        
        if (action === 'off') {
          await threadsData.set(threadID, false, "settings.badwordblock");
          badwordSettings.set(threadID, false);
          return message.reply("❌ Bad Word Blocking has been disabled for this group.");
        }
        else if (action === 'on') {
          await threadsData.set(threadID, true, "settings.badwordblock");
          badwordSettings.set(threadID, true);
          return message.reply("✅ Bad Word Blocking has been enabled for this group.");
        }
        else if (action === 'status') {
          const isEnabled = badwordSettings.get(threadID) !== undefined ? badwordSettings.get(threadID) : true;
          const status = isEnabled ? "✅ Enabled" : "❌ Disabled";
          return message.reply(`🛡️ Bad Word Blocking Status: ${status}`);
        }
      }

      const isEnabled = badwordSettings.get(threadID) !== undefined ? badwordSettings.get(threadID) : true;
      const status = isEnabled ? "✅ Enabled" : "❌ Disabled";
      
      return message.reply(
        `🛡️ Bad Word Blocker\n` +
        `Status: ${status}\n\n` +
        "Commands:\n" +
        "• {p}badwordblock on - Enable protection\n" +
        "• {p}badwordblock off - Disable protection\n" +
        "• {p}badwordblock status - Check status\n\n" +
        "Note: Auto-enabled in all groups by default."
      );

    } catch (error) {
      console.error("Block OnStart Error:", error);
      await message.reply("❌ An error occurred. Please try again.");
    }
  },

  onChat: async function({ event, message, threadsData, api }) {
    try {
      // Check if message has body
      if (!event.body) return;

      const { threadID, senderID } = event;

      // Skip if message is from bot
      if (senderID === global.GoatBot.config.uid) return;

      // Check if badwordblock is enabled for this thread
      let isEnabled = badwordSettings.get(threadID);
      if (isEnabled === undefined) {
        try {
          isEnabled = await threadsData.get(threadID, "settings.badwordblock");
          if (isEnabled === undefined || isEnabled === null) {
            isEnabled = true; // Default to enabled
          }
          badwordSettings.set(threadID, isEnabled);
        } catch (error) {
          console.error("Error getting badwordblock setting:", error);
          isEnabled = true; // Default to enabled on error
        }
      }
      
      // If disabled, return immediately
      if (!isEnabled) return;

      // Image links for warnings (ALL LINKS PRESERVED - NO CHANGES)
      const imageLinks = [
        "https://i.imgur.com/B6G3NlF.jpeg",
        "https://i.imgur.com/T7RtKlp.gif",
        "https://i.imgur.com/BmGxEFs.gif",
        "https://i.imgur.com/MEdpECT.jpeg",
        "https://i.imgur.com/KU8N4Ca.jpeg",
        "https://i.imgur.com/roBS6oX.gif",
        "https://i.imgur.com/SkfGapy.jpeg",
        "https://i.imgur.com/GGQv16z.jpeg",
        "https://i.imgur.com/VAf5Eue.gif",
        "https://i.imgur.com/ZZpapGi.jpeg",
        "https://i.imgur.com/4LvXywY.jpeg",
        "https://i.imgur.com/NZ5iyCh.jpeg",
        "https://i.imgur.com/BkrKZ8b.jpeg",
        "https://i.imgur.com/Yf1LRak.jpeg",
        "https://i.imgur.com/1fsJf6B.jpeg",
        "https://i.imgur.com/MR2h7jw.jpeg",
        "https://i.imgur.com/K9fFzgm.jpeg",
        "https://i.imgur.com/Se05IOn.jpeg",
        "https://i.imgur.com/h1Yhryc.jpeg",
        "https://i.imgur.com/sUgF4oQ.jpeg",
        "https://i.imgur.com/8oHuIf8.jpeg",
        "https://i.imgur.com/fiH5dUv.jpeg",
        "https://i.imgur.com/FSKnHZt.jpeg",
        "https://i.imgur.com/80YYI12.jpeg",
        "https://i.imgur.com/ibd1j8n.jpeg",
        "https://i.imgur.com/J8vbW7x.jpeg",
        "https://i.imgur.com/fOmuOKl.jpeg",
        "https://i.imgur.com/qDwypw6.jpeg",
        "https://i.imgur.com/9dVyEEe.gif",
        "https://i.imgur.com/d3yM7FX.jpeg",
        "https://i.imgur.com/JToFUJo.jpeg",
        "https://i.imgur.com/aJ5sbvo.jpeg",
        "https://i.imgur.com/09qesDj.gif",
        "https://i.imgur.com/HES8mee.jpeg",
        "https://i.imgur.com/ovETysm.jpeg",
        "https://i.imgur.com/mpCMAYQ.jpeg",
        "https://i.imgur.com/iQV82Jq.jpeg",
        "https://i.imgur.com/qkM2t0l.jpeg"
      ];

      // Warning messages in Bengali with MENTION
      const warningMessages = [
        "বন্ধু😭 ভালো হয়ে যা!😞 @{name}",
        "বোসে যা ভাই🥲 লজ্জা কর!🫣 @{name}",
        "ভাই এটা কি বললি!😓 একটু শান্ত হও🙏 @{name}",
        "তোকেই কি এসব শিখায় কেউ?😠 দয়া করে থামো🙏 @{name}",
        "ভালো কথা বল 🙃 নইলে ব্লক করবো🚫 @{name}",
        "ভাই প্লিজ এসব বাদ দাও😭 শান্তি রাখো😞 @{name}",
        "তোকেই নিয়ে মায়া লাগে রে ভাই🥺 ভদ্র হও🥲 @{name}",
        "দোস্ত, এসব বলা লাগে?😐 একটু ভদ্রতা শিখো🧠 @{name}",
        "তুই কি রিয়েল লাইফেও এমন?😑 @{name}",
        "বাহ! ভোকাবুলারি ১৮+ ছাড়া খালি?🤦 @{name}",
        "দয়া করে একটু ভদ্র হও🙏 আমি কষ্ট পাই😢 @{name}",
        "ওরে বাবা! এত রাগ কেন?😮‍💨 @{name}",
        "ভাই, কথাগুলো ফিল্টার করে বলো না!😒 @{name}",
        "আহা! এত সুন্দর চ্যাট, খারাপ ভাষা কেন?🥺 @{name}",
        "একটু সভ্য ভাবে কথা বললে হয় না?🙄 @{name}"
      ];

      // 🔥 REDUCED Bad words list - শুধু মেইন ওয়ার্ডস
      const badWords = [
        // English bad words
        "fuck", "sex", "dick", "pussy", "boobs", "vagina", "penis", 
        "cum", "masturbate", "horny", "boner", "blowjob",
        
        // Bengali bad words  
        "চোদ", "চুদ", "চুদা", "গুদ", "ভোদা", "খানকি", "মাগি",
        "বেশ্যা", "হারামি", "ধন", "বাঁড়া", "যোনি"
      ];

      // IMPROVED text normalization
      const normalize = (str) => {
        if (!str || typeof str !== 'string') return '';
        return str.toLowerCase()
          .replace(/[^\w\s\u0980-\u09FF]/g, '') // Keep only letters, numbers, spaces, and Bengali characters
          .replace(/\s+/g, ' ')
          .trim();
      };

      const text = normalize(event.body);
      if (!text) return;

      // IMPROVED bad word detection
      const foundBadWord = badWords.some(word => {
        const normalizedWord = normalize(word);
        if (!normalizedWord) return false;
        
        // Multiple detection methods for better accuracy
        const exactMatch = text.includes(normalizedWord);
        const wordBoundaryMatch = new RegExp(`\\b${normalizedWord}\\b`, 'i').test(event.body);
        const spaceMatch = text.includes(` ${normalizedWord} `) || 
                          text.startsWith(normalizedWord + ' ') || 
                          text.endsWith(' ' + normalizedWord);
        
        return exactMatch || wordBoundaryMatch || spaceMatch;
      });

      if (!foundBadWord) return;

      console.log(`🚫 Bad word detected in group ${threadID} from user ${senderID}`);

      // Get user name for mention
      let userName = "ভাই";
      try {
        const userInfo = await api.getUserInfo(senderID);
        if (userInfo && userInfo[senderID]) {
          userName = userInfo[senderID].name || "ভাই";
        }
      } catch (nameError) {
        console.warn("Could not get user name:", nameError.message);
      }

      // Create cache directory
      const cacheFolder = path.join(__dirname, "cache", "badwordblock");
      await fs.ensureDir(cacheFolder);

      // Select random image URL
      const randomImageUrl = imageLinks[Math.floor(Math.random() * imageLinks.length)];
      const fileName = `badword_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
      const imagePath = path.join(cacheFolder, fileName);

      let imageStream = null;

      // Try to use cached image first
      if (fs.existsSync(imagePath)) {
        try {
          const stats = fs.statSync(imagePath);
          if (stats.size > 0) {
            imageStream = fs.createReadStream(imagePath);
            console.log("✅ Using cached image");
          }
        } catch (fileError) {
          console.error("Error reading cached image:", fileError.message);
        }
      }

      // If cached image not available, download it
      if (!imageStream) {
        try {
          console.log(`📥 Downloading warning image: ${randomImageUrl}`);
          
          const response = await axios({
            method: 'GET',
            url: randomImageUrl,
            responseType: 'stream',
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });

          if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          // Save to cache
          const writer = fs.createWriteStream(imagePath);
          response.data.pipe(writer);
          
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
            response.data.on('error', reject);
          });

          imageStream = fs.createReadStream(imagePath);
          console.log("✅ Image downloaded and cached");

        } catch (downloadError) {
          console.error("❌ Failed to download image:", downloadError.message);
          
          // Use any cached image as fallback
          try {
            const cachedFiles = fs.readdirSync(cacheFolder).filter(file => 
              file.match(/\.(jpeg|jpg|gif|png)$/i)
            );
            
            if (cachedFiles.length > 0) {
              const randomCachedFile = cachedFiles[Math.floor(Math.random() * cachedFiles.length)];
              imageStream = fs.createReadStream(path.join(cacheFolder, randomCachedFile));
              console.log("🔄 Using fallback cached image");
            } else {
              console.error("❌ No cached images available");
              // Send text-only message with mention if no images
              const randomWarning = warningMessages[Math.floor(Math.random() * warningMessages.length)];
              const finalMessage = randomWarning.replace(/{name}/g, userName);
              await message.reply({
                body: `⚠️ ${finalMessage}`,
                mentions: [{
                  tag: `@${userName}`,
                  id: senderID,
                  fromIndex: finalMessage.indexOf('@')
                }]
              });
              return;
            }
          } catch (fallbackError) {
            console.error("❌ Fallback image error:", fallbackError.message);
            // Send text-only message with mention as last resort
            const randomWarning = warningMessages[Math.floor(Math.random() * warningMessages.length)];
            const finalMessage = randomWarning.replace(/{name}/g, userName);
            await message.reply({
              body: `⚠️ ${finalMessage}`,
              mentions: [{
                tag: `@${userName}`,
                id: senderID,
                fromIndex: finalMessage.indexOf('@')
              }]
            });
            return;
          }
        }
      }

      // Select random warning message
      const randomWarning = warningMessages[Math.floor(Math.random() * warningMessages.length)];
      const finalMessage = randomWarning.replace(/{name}/g, userName);

      // Send warning message with image and mention
      await message.reply({
        body: `⚠️ ${finalMessage}`,
        attachment: imageStream,
        mentions: [{
          tag: `@${userName}`,
          id: senderID,
          fromIndex: finalMessage.indexOf('@')
        }]
      });

      console.log(`✅ Bad word warning sent to ${userName} successfully`);

      // Clean up downloaded file after sending
      try {
        if (fs.existsSync(imagePath)) {
          await fs.remove(imagePath);
          console.log("🧹 Temporary image cleaned up");
        }
      } catch (cleanupError) {
        console.warn("Could not clean up temp image:", cleanupError.message);
      }

    } catch (error) {
      console.error("💥 BadWordBlock Error:", error.message);
    }
  },

  // 🔄 Auto-enable when bot joins new group
  handleBotJoin: async function({ threadID, threadsData }) {
    try {
      await threadsData.set(threadID, true, "settings.badwordblock");
      badwordSettings.set(threadID, true);
      console.log(`✅ BadWordBlock auto-enabled for new group: ${threadID}`);
    } catch (error) {
      console.error("❌ Error auto-enabling badwordblock for new group:", error);
    }
  }
};
