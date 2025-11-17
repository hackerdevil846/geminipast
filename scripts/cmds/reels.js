const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const API_KEY = "ix8FP76ppacB7pQSAp12Fp6UJSprS23TQOVYhUBT9pxu7rjAvmleUZaY";

module.exports = {
  config: {
    name: "reels",
    aliases: ["pexels", "videosearch"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
      en: "🎬 Search Pexels videos"
    },
    longDescription: {
      en: "🎬 Search Pexels videos, view thumbnails, and download by replying video number"
    },
    guide: {
      en: "{p}reels <search keyword>\nThen reply 1-20 to download video."
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    try {
      // Check dependencies
      try {
        if (!axios || !fs || !path || !https) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return message.reply("❌ | Required dependencies are missing. Please install axios and fs-extra.");
      }

      const query = args.join(" ");
      if (!query) return message.reply("❌ Type a keyword.\nExample: reels nature");

      const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=20`;

      try {
        const res = await axios.get(url, {
          headers: { Authorization: API_KEY }
        });

        const videos = res.data.videos;
        if (!videos || !videos.length) return message.reply("😥 No videos found.");

        const attachments = [];
        let text = "🎬 𝙋𝙀𝙓𝙀𝙇𝙎 𝙑𝙄𝘿𝙀𝙊 𝙎𝙀𝘼𝙍𝘾𝙃\n━━━━━━━━━━━━━━━\n";

        for (let i = 0; i < videos.length; i++) {
          const video = videos[i];
          text += `✨ 𝗩𝗶𝗱𝗲𝗼 ${i + 1}:\n`;
          text += `🎞 𝗧𝗶𝘁𝗹𝗲: ${video.user?.name || "Unknown"}\n`;
          text += `⏱ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${video.duration}s\n`;
          text += `───────────────\n`;

          const thumbUrl = video.image;
          const thumbPath = path.join(__dirname, "cache", `thumb_${i}.jpg`);

          if (fs.existsSync(thumbPath)) {
            attachments.push(fs.createReadStream(thumbPath));
          } else {
            const response = await axios.get(thumbUrl, { responseType: 'stream' });
            const writer = fs.createWriteStream(thumbPath);
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });
            attachments.push(fs.createReadStream(thumbPath));
          }
        }

        await message.reply({
          body: text + "\n📩 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝘁𝗵𝗲 𝗩𝗶𝗱𝗲𝗼 𝗡𝗼. (1-20) 𝘁𝗼 𝗴𝗲𝘁 𝗳𝘂𝗹𝗹 𝘃𝗶𝗱𝗲𝗼.\n👑 𝗔𝗣𝗜 𝗢𝘄𝗻𝗲𝗿: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
          attachment: attachments
        });

        // Store video data for reply handling
        global.GoatBot.onReply.set(event.messageID + 1, {
          commandName: "reels",
          messageID: event.messageID + 1,
          author: event.senderID,
          videos: videos
        });

      } catch (err) {
        console.error("API Error:", err);
        return message.reply("❌ Failed to fetch videos from Pexels API.");
      }

    } catch (error) {
      console.error("Reels Command Error:", error);
      message.reply("❌ | An error occurred while processing your request.");
    }
  },

  onReply: async function ({ event, message, Reply }) {
    try {
      if (event.senderID !== Reply.author) return;

      const index = parseInt(event.body);
      if (isNaN(index) || index < 1 || index > 20) {
        return message.reply("❌ Invalid number. Please reply with a number between 1 and 20.");
      }

      const video = Reply.videos[index - 1];
      if (!video) return message.reply("❌ Video not found.");

      const videoUrl = video.video_files.find(v => v.quality === "hd" && v.file_type === "video/mp4")?.link || video.video_files[0]?.link;
      if (!videoUrl) return message.reply("❌ No video URL found.");

      const filePath = path.join(__dirname, "cache", `video_${video.id}.mp4`);

      // Download video
      const response = await axios.get(videoUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const caption = `🎬 *${video.user?.name || "Untitled"}*\n⏱ *Duration:* ${video.duration}s\n📎 *Size:* ${Math.round(fs.statSync(filePath).size / 1024)} KB\n🔗 *URL:* ${video.url}\n\n👑 *Powered by 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑*`;

      await message.reply({
        body: caption,
        attachment: fs.createReadStream(filePath)
      });

      // Clean up
      fs.unlinkSync(filePath);

    } catch (err) {
      console.error("Reply Error:", err);
      message.reply("⚠️ Couldn't download the video. Please try again.");
    }
  }
};
