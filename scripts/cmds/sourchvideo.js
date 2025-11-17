const axios = require('axios');
const fs = require('fs-extra');
const ytdl = require('ytdl-core');
const YouTubeAPI = require('simple-youtube-api');

module.exports = {
  config: {
    name: "sourchvideo",
    aliases: ["sourchvideo1"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "🔍 𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
      en: "𝐹𝑖𝑛𝑑 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑢𝑠𝑖𝑛𝑔 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑖𝑒𝑠 𝑜𝑟 𝑑𝑖𝑟𝑒𝑐𝑡 𝑙𝑖𝑛𝑘𝑠"
    },
    guide: {
      en: "{p}sourchvideo [𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 𝑜𝑟 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑙𝑖𝑛𝑘]"
    },
    countDown: 5,
    dependencies: {
      "ytdl-core": "",
      "simple-youtube-api": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;

      if (!args[0]) {
        return message.reply("» 𝑇ℎ𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑠𝑒𝑐𝑡𝑖𝑜𝑛 𝑐𝑎𝑛'𝑡 𝑏𝑒 𝑏𝑙𝑎𝑛𝑘!");
      }

      const searchQuery = args.join(' ');

      // Handle direct YouTube URLs
      if (searchQuery.includes('youtube.com/') || searchQuery.includes('youtu.be/')) {
        await this.handleUrlRequest(api, event, searchQuery);
        return;
      }

      // Handle search queries
      await this.handleSearchRequest(api, event, searchQuery);

    } catch (error) {
      console.error("Search video error:", error);
      message.reply("» 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
  },

  onReply: async function ({ api, event, message, Reply }) {
    try {
      const { threadID, messageID, body } = event;

      if (!Reply || !Reply.videoIds || !Array.isArray(Reply.videoIds)) {
        return message.reply("» 𝑁𝑜 𝑣𝑎𝑙𝑖𝑑 𝑣𝑖𝑑𝑒𝑜 𝑙𝑖𝑠𝑡 𝑓𝑜𝑢𝑛𝑑.");
      }

      const choice = parseInt(body);
      if (isNaN(choice) || choice < 1 || choice > Reply.videoIds.length) {
        return message.reply(`» 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑓𝑟𝑜𝑚 1 𝑡𝑜 ${Reply.videoIds.length}`);
      }

      const videoId = Reply.videoIds[choice - 1];
      await this.downloadAndSendVideo(api, event, videoId);

    } catch (error) {
      console.error("Reply handler error:", error);
      message.reply("» 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑠𝑒𝑛𝑑 𝑡ℎ𝑖𝑠 𝑓𝑖𝑙𝑒!");
    }
  },

  handleUrlRequest: async function (api, event, url) {
    try {
      const videoId = ytdl.getVideoID(url);
      await this.downloadAndSendVideo(api, event, videoId);
    } catch (error) {
      console.error("URL request error:", error);
      api.sendMessage("» 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑈𝑅𝐿.", event.threadID, event.messageID);
    }
  },

  handleSearchRequest: async function (api, event, query) {
    try {
      const API_KEYS = [
        'AIzaSyB5A3Lum6u5p2Ki2btkGdzvEqtZ8KNLeXo',
        'AIzaSyAyjwkjc0w61LpOErHY_vFo6Di5LEyfLK0',
        'AIzaSyBY5jfFyaTNtiTSBNCvmyJKpMIGlpCSB4w',
        'AIzaSyCYCg9qpFmJJsEcr61ZLV5KsmgT1RE5aI4'
      ];

      const apiKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
      const youtube = new YouTubeAPI(apiKey);

      const searchResults = await youtube.searchVideos(query, 6);
      
      if (!searchResults || searchResults.length === 0) {
        return api.sendMessage('» 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑.', event.threadID, event.messageID);
      }

      const videoIds = [];
      let messageText = '»🔎 𝑭𝒐𝒖𝒏𝒅 ' + searchResults.length + ' 𝒗𝒊𝒅𝒆𝒐𝒔 𝒎𝒂𝒕𝒄𝒉𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒔𝒆𝒂𝒓𝒄𝒉:\n\n';
      const attachments = [];

      for (let i = 0; i < searchResults.length; i++) {
        const video = searchResults[i];
        videoIds.push(video.id);

        const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
        const thumbnailPath = __dirname + `/cache/thumb_${i}.jpg`;

        try {
          const imageResponse = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
          fs.writeFileSync(thumbnailPath, Buffer.from(imageResponse.data));
          attachments.push(fs.createReadStream(thumbnailPath));
        } catch (error) {
          console.error("Error downloading thumbnail:", error);
        }

        const numberEmoji = ["⓵", "⓶", "⓷", "⓸", "⓹", "⓺"][i] || `${i + 1}.`;
        messageText += `${numberEmoji} ${video.title}\n\n`;
      }

      messageText += "» 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒕𝒉𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒔𝒆𝒍𝒆𝒄𝒕 𝒂 𝒗𝒊𝒅𝒆𝒐";

      const sentMessage = await message.reply({
        attachment: attachments,
        body: messageText
      });

      // Clean up thumbnails
      setTimeout(() => {
        for (let i = 0; i < searchResults.length; i++) {
          const thumbnailPath = __dirname + `/cache/thumb_${i}.jpg`;
          if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
          }
        }
      }, 5000);

      // Store video IDs for reply handling
      global.sourchvideoReplies = global.sourchvideoReplies || {};
      global.sourchvideoReplies[sentMessage.messageID] = {
        videoIds: videoIds
      };

    } catch (error) {
      console.error("Search request error:", error);
      api.sendMessage("» 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑞𝑢𝑒𝑠𝑡", event.threadID, event.messageID);
    }
  },

  downloadAndSendVideo: async function (api, event, videoId) {
    try {
      const message = await api.sendMessage("» 📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...", event.threadID);

      const videoInfo = await ytdl.getInfo(videoId);
      const videoTitle = videoInfo.videoDetails.title;
      
      const videoStream = ytdl(videoId, { 
        quality: 'lowest', 
        filter: 'audioandvideo' 
      });

      const videoPath = __dirname + `/cache/${videoId}.mp4`;
      const writeStream = fs.createWriteStream(videoPath);

      videoStream.pipe(writeStream);

      writeStream.on('finish', async () => {
        const stats = fs.statSync(videoPath);
        if (stats.size > 25 * 1024 * 1024) {
          fs.unlinkSync(videoPath);
          return api.sendMessage(
            "» 𝐶𝑎𝑛'𝑡 𝑠𝑒𝑛𝑑 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒 𝑏𝑒𝑐𝑎𝑢𝑠𝑒 𝑖𝑡𝑠 𝑠𝑖𝑧𝑒 𝑒𝑥𝑐𝑒𝑒𝑑𝑠 25𝑀𝐵.",
            event.threadID
          );
        }

        await api.sendMessage({
          body: `✅ ${videoTitle}`,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID);

        fs.unlinkSync(videoPath);
        api.unsendMessage(message.messageID);
      });

      writeStream.on('error', (error) => {
        console.error("Video download error:", error);
        api.sendMessage("» 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑣𝑖𝑑𝑒𝑜.", event.threadID);
      });

    } catch (error) {
      console.error("Download error:", error);
      api.sendMessage("» 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑣𝑖𝑑𝑒𝑜.", event.threadID, event.messageID);
    }
  }
};
