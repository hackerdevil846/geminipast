const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "aotpic",
    aliases: [],
    version: "2.0", // Version up for the new feature
    author: "Asif",
    role: 0,
    countDown: 5,
    description: "Sends AOT video (Downloads & Uses Backup if API fails)",
    category: "anime",
  },

  // 1. PRE-DOWNLOAD LOGIC (Runs when bot restarts)
  onLoad: async function () {
    const dir = path.join(__dirname, "cache", "aot");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(">> Created AOT cache directory.");
    }

    // Attempt to pre-download 3 videos on startup to ensure we have backups
    console.log(">> Checking AOT backup cache...");
    const files = fs.readdirSync(dir);
    if (files.length < 3) {
      console.log(">> Cache low. Attempting to pre-download content...");
      // We run this inside a non-blocking function
      (async () => {
        try {
            const GITHUB_RAW = "https://raw.githubusercontent.com/rynxzyy/blue-archive-r-img/refs/heads/main/links.json";
            const rawRes = await axios.get(GITHUB_RAW);
            const apiBase = rawRes.data.apiv1;
            
            for (let i = 0; i < 3; i++) {
                const res = await axios.get(`${apiBase}/api/aotvideo`);
                if (res.data && res.data.url) {
                    const fileName = path.basename(res.data.url);
                    const filePath = path.join(dir, fileName);
                    if (!fs.existsSync(filePath)) {
                        const stream = await axios.get(res.data.url, { responseType: 'arraybuffer' });
                        fs.writeFileSync(filePath, Buffer.from(stream.data));
                    }
                }
            }
            console.log(">> Pre-download complete.");
        } catch (e) {
            // Silent fail on pre-download to not disturb console
        }
      })();
    }
  },

  onStart: async function ({ api, event }) {
    const dir = path.join(__dirname, "cache", "aot");
    let processingMessage = null;

    // Helper function to send a file from local storage
    const sendLocalFile = async (fallbackMsg) => {
        try {
            const files = fs.readdirSync(dir);
            if (files.length === 0) {
                if (processingMessage) await api.unsendMessage(processingMessage.messageID);
                return api.sendMessage("❌ API is down and no local backups found.", event.threadID);
            }
            
            // Pick random file
            const randomFile = files[Math.floor(Math.random() * files.length)];
            const filePath = path.join(dir, randomFile);

            const msg = {
                body: `${fallbackMsg}\n(Loaded from local backup)`,
                attachment: fs.createReadStream(filePath)
            };
            
            if (processingMessage) await api.unsendMessage(processingMessage.messageID);
            return api.sendMessage(msg, event.threadID, event.messageID);
        } catch (err) {
            console.error(err);
        }
    };

    try {
      processingMessage = await api.sendMessage(
        "⏳ Fetching content...",
        event.threadID,
        event.messageID
      );

      // 1. Get API Base
      const GITHUB_RAW = "https://raw.githubusercontent.com/rynxzyy/blue-archive-r-img/refs/heads/main/links.json";
      const rawRes = await axios.get(GITHUB_RAW);
      if (!rawRes.data || !rawRes.data.apiv1) throw new Error("No API Base");
      const apiBase = rawRes.data.apiv1;

      // 2. Get Video URL
      const res = await axios.get(`${apiBase}/api/aotvideo`);
      if (!res.data || !res.data.url) throw new Error("No Video URL");

      const videoUrl = res.data.url;
      
      // 3. Determine Local Path
      // We assume the URL ends in a filename like 'video1.mp4'. 
      // If not, we generate a timestamp name.
      let fileName = path.basename(videoUrl);
      if (!fileName.endsWith(".mp4")) fileName = `${Date.now()}.mp4`;
      const filePath = path.join(dir, fileName);

      // 4. Download Logic
      // If we don't have it, download it. If we do, use the local version.
      if (!fs.existsSync(filePath)) {
          const videoStream = await axios.get(videoUrl, { responseType: 'arraybuffer' });
          fs.writeFileSync(filePath, Buffer.from(videoStream.data));
      }

      // 5. Send the File (From the newly saved local path to ensure stability)
      const msg = {
        body: "Here is your Attack on Titan video:",
        attachment: fs.createReadStream(filePath),
      };

      await api.sendMessage(msg, event.threadID, event.messageID);
      if (processingMessage) await api.unsendMessage(processingMessage.messageID);

    } catch (error) {
      console.error("API Error, switching to backup:", error.message);
      // TRIGGER BACKUP SYSTEM
      await sendLocalFile("⚠️ API is unstable. Sending from backup archive...");
    }
  },
};
