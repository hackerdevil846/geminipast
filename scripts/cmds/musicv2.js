const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

function deleteAfterTimeout(filePath, timeout = 60000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) console.log(`🧹 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 𝑓𝑖𝑙𝑒: ${filePath}`);
      });
    }
  }, timeout);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}𝑚 ${secs}𝑠`;
}

function parseDuration(durationStr) {
  const hoursMatch = durationStr.match(/(\d+)H/);
  const minutesMatch = durationStr.match(/(\d+)M/);
  const secondsMatch = durationStr.match(/(\d+)S/);
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
  return hours * 3600 + minutes * 60 + seconds;
}

// Backup API keys
const RAPID_API_KEY = "44a0d41bb0msh7963185219ba506p117328jsned41eee4c796";
const YOUTUBE_API_KEY = "AIzaSyAGQrBQYworsR7T2gu0nYhLPSsi2WFVrgQ";

module.exports = {
  config: {
    name: "musicv2",
    aliases: ["ytdlpro", "youtubedlpro"],
    version: "1.0.0",
    role: 0,
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    shortDescription: {
      en: "🎵 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑚𝑢𝑠𝑖𝑐 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑟"
    },
    longDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑚𝑢𝑠𝑖𝑐 𝑜𝑟 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑤𝑖𝑡ℎ 𝑖𝑛𝑓𝑜 𝑎𝑛𝑑 𝑡ℎ𝑢𝑚𝑏𝑛𝑎𝑖𝑙"
    },
    guide: {
      en: "{p}musicv2 <𝑞𝑢𝑒𝑟𝑦> | {p}musicv2 𝑣𝑖𝑑𝑒𝑜 <𝑞𝑢𝑒𝑟𝑦>"
    },
    countDown: 5,
    category: "𝑚𝑒𝑑𝑖𝑎",
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    try {
      // Dependency check
      try {
        require("axios");
        require("fs-extra");
        require("path");
      } catch (e) {
        return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
      }

      if (!args[0]) return message.reply("🎵 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑠𝑜𝑛𝑔 𝑛𝑎𝑚𝑒!");

      const isVideo = args[0].toLowerCase() === "video";
      const query = isVideo ? args.slice(1).join(" ") : args.join(" ");
      const processingMessage = await message.reply(`🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 "${query}"...`);

      // Search YouTube for the video
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video&key=${YOUTUBE_API_KEY}`;
      const searchRes = await axios.get(searchUrl);
      
      if (!searchRes.data.items || searchRes.data.items.length === 0) {
        throw new Error("❌ 𝑆𝑜𝑛𝑔 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.");
      }

      const video = searchRes.data.items[0];
      const videoId = video.id.videoId;
      const videoUrl = `https://youtu.be/${videoId}`;

      // Get video details
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
      const detailsRes = await axios.get(detailsUrl);
      
      if (!detailsRes.data.items || detailsRes.data.items.length === 0) {
        throw new Error("❌ 𝑉𝑖𝑑𝑒𝑜 𝑑𝑒𝑡𝑎𝑖𝑙𝑠 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.");
      }

      const details = detailsRes.data.items[0];
      const snippet = details.snippet;
      const contentDetails = details.contentDetails;
      const statistics = details.statistics;

      const title = snippet.title;
      const thumbnail = snippet.thumbnails.high.url;
      const durationISO = contentDetails.duration;
      const seconds = parseDuration(durationISO);
      const author = snippet.channelTitle;
      const views = statistics.viewCount;

      // Download thumbnail
      const thumbExt = thumbnail.endsWith(".png") ? "png" : "jpg";
      const thumbPath = path.join(__dirname, "cache", `${videoId}.${thumbExt}`);
      const thumbResponse = await axios.get(thumbnail, { responseType: "stream" });
      const thumbWriter = fs.createWriteStream(thumbPath);
      thumbResponse.data.pipe(thumbWriter);
      
      await new Promise((resolve, reject) => {
        thumbWriter.on("finish", resolve);
        thumbWriter.on("error", reject);
      });

      // Send video info with thumbnail
      await message.reply({
        body: `🎵 ${isVideo ? "𝑉𝑖𝑑𝑒𝑜" : "𝐴𝑢𝑑𝑖𝑜"} 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛:\n\n` +
              `📌 𝑇𝑖𝑡𝑙𝑒: ${title}\n` +
              `📺 𝐶ℎ𝑎𝑛𝑛𝑒𝑙: ${author}\n` +
              `👁️ 𝑉𝑖𝑒𝑤𝑠: ${formatNumber(views)}\n` +
              `⏱️ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${formatDuration(seconds)}\n\n` +
              `🔗 ${videoUrl}`,
        attachment: fs.createReadStream(thumbPath)
      });
      deleteAfterTimeout(thumbPath);

      // Prepare download based on media type
      let fileUrl, fileName;
      if (isVideo) {
        // Primary video download API
        try {
          const videoOptions = {
            method: 'GET',
            url: 'https://yt-api.p.rapidapi.com/dl',
            params: { id: videoId },
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
            }
          };
          
          const videoRes = await axios.request(videoOptions);
          if (!videoRes.data || videoRes.data.status !== 'ok') {
            throw new Error("𝑃𝑟𝑖𝑚𝑎𝑟𝑦 𝑣𝑖𝑑𝑒𝑜 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑");
          }
          
          const formats = videoRes.data.formats;
          const videoFormat = formats.find(f => 
            f.qualityLabel === '720p' && f.hasVideo && f.hasAudio
          ) || formats.find(f => 
            f.hasVideo && f.hasAudio
          );
          
          if (!videoFormat) throw new Error("𝑁𝑜 𝑠𝑢𝑖𝑡𝑎𝑏𝑙𝑒 𝑣𝑖𝑑𝑒𝑜 𝑓𝑜𝑟𝑚𝑎𝑡 𝑓𝑜𝑢𝑛𝑑");
          fileUrl = videoFormat.url;
          fileName = `${title.replace(/[^\w\s]/gi, '_').slice(0, 30)}.mp4`;
        } catch (primaryError) {
          console.log("𝑈𝑠𝑖𝑛𝑔 𝑏𝑎𝑐𝑘𝑢𝑝 𝑣𝑖𝑑𝑒𝑜 𝐴𝑃𝐼...");
          // Backup video API
          const backupVideoOptions = {
            method: 'GET',
            url: 'https://youtube-video-download-info.p.rapidapi.com/dl',
            params: { id: videoId },
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
            }
          };
          
          const backupRes = await axios.request(backupVideoOptions);
          const formats = backupRes.data.formats;
          if (!formats || formats.length === 0) {
            throw new Error("𝐵𝑎𝑐𝑘𝑢𝑝 𝑣𝑖𝑑𝑒𝑜 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑 - 𝑛𝑜 𝑓𝑜𝑟𝑚𝑎𝑡𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒");
          }
          
          // Filter and sort by quality
          const videoFormats = formats.filter(f => f.container === 'mp4' && f.quality);
          if (videoFormats.length === 0) {
            throw new Error("𝑁𝑜 𝑀𝑃4 𝑓𝑜𝑟𝑚𝑎𝑡 𝑓𝑜𝑢𝑛𝑑");
          }
          
          const qualityScores = {
            'hd1080': 1080,
            'hd720': 720,
            'large': 480,
            'medium': 360,
            'small': 240,
            'tiny': 144
          };
          
          videoFormats.forEach(f => { 
            f.score = qualityScores[f.quality] || 0; 
          });
          videoFormats.sort((a, b) => b.score - a.score);
          
          fileUrl = videoFormats[0].url;
          fileName = `${title.replace(/[^\w\s]/gi, '_').slice(0, 30)}.mp4`;
        }
      } else {
        // Primary audio download API
        try {
          const audioOptions = {
            method: 'GET',
            url: 'https://youtube-mp36.p.rapidapi.com/dl',
            params: { id: videoId },
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
            }
          };
          
          const audioRes = await axios.request(audioOptions);
          if (audioRes.data.status !== 'ok') {
            throw new Error("𝑃𝑟𝑖𝑚𝑎𝑟𝑦 𝑎𝑢𝑑𝑖𝑜 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑: " + audioRes.data.msg);
          }
          
          fileUrl = audioRes.data.link;
          fileName = `${title.replace(/[^\w\s]/gi, '_').slice(0, 30)}.mp3`;
        } catch (primaryError) {
          console.log("𝑈𝑠𝑖𝑛𝑔 𝑏𝑎𝑐𝑘𝑢𝑝 𝑎𝑢𝑑𝑖𝑜 𝐴𝑃𝐼...");
          // Backup audio API
          const backupAudioOptions = {
            method: 'GET',
            url: 'https://youtube-mp3-download1.p.rapidapi.com/v2/download',
            params: { id: videoId },
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'youtube-mp3-download1.p.rapidapi.com'
            }
          };
          
          const backupRes = await axios.request(backupAudioOptions);
          if (backupRes.data.status !== 'ok') {
            throw new Error("𝐵𝑎𝑐𝑘𝑢𝑝 𝑎𝑢𝑑𝑖𝑜 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑: " + (backupRes.data.msg || ''));
          }
          
          fileUrl = backupRes.data.link;
          fileName = `${title.replace(/[^\w\s]/gi, '_').slice(0, 30)}.mp3`;
        }
      }

      // Download media file
      const filePath = path.join(__dirname, "cache", fileName);
      const mediaRes = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream'
      });
      
      const fileWriter = fs.createWriteStream(filePath);
      mediaRes.data.pipe(fileWriter);
      
      await new Promise((resolve, reject) => {
        fileWriter.on("finish", resolve);
        fileWriter.on("error", reject);
      });

      // Send media file
      await message.reply({
        body: `✅ ${isVideo ? "𝑉𝑖𝑑𝑒𝑜" : "𝑀𝑢𝑠𝑖𝑐"} 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!`,
        attachment: fs.createReadStream(filePath)
      });
      
      deleteAfterTimeout(filePath);

    } catch (err) {
      console.error(err);
      await message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${err.message}`);
    }
  }
};
