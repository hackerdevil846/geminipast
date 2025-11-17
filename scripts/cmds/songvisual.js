const axios = require("axios");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

async function fetchTikTokVideos(query) {
  try {
    const response = await axios.get(`https://lyric-search-neon.vercel.app/kshitiz?keyword=${query}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  config: {
    name: "songvisual",
    aliases: [],
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    version: "1.0",
    shortDescription: {
      en: "𝑃𝑙𝑎𝑦 𝑎 𝑙𝑦𝑟𝑖𝑐 𝑣𝑖𝑑𝑒𝑜",
    },
    longDescription: {
      en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝑎 𝑙𝑦𝑟𝑖𝑐𝑎𝑙 𝑣𝑖𝑑𝑒𝑜 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑡ℎ𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑 𝑞𝑢𝑒𝑟𝑦",
    },
    category: "𝑓𝑢𝑛",
    guide: {
      en: "{p}{n} [𝑞𝑢𝑒𝑟𝑦]",
    },
  },
  onStart: async function ({ api, event, args, message }) {
    api.setMessageReaction("✨", event.messageID, (err) => {}, true);

    try {
      let query = '';

      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const attachment = event.messageReply.attachments[0];
        if (attachment.type === "video" || attachment.type === "audio") {
          const shortUrl = attachment.url;
          
          query = await shortenURL(shortUrl);

          
          const musicRecognitionResponse = await axios.get(`https://audio-reco.onrender.com/kshitiz?url=${encodeURIComponent(shortUrl)}`);
          query = musicRecognitionResponse.data.title;
        } else {
          throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡 𝑡𝑦𝑝𝑒.");
        }
      } else if (args.length > 0) {
        
        query = args.join(" ");
      } else {
        api.sendMessage({ body: "𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑎𝑢𝑑𝑖𝑜 𝑜𝑟 𝑣𝑖𝑑𝑒𝑜." }, event.threadID, event.messageID);
        return;
      }

      
      query += "𝑙𝑦𝑟𝑖𝑐𝑠𝑣𝑖𝑑𝑒𝑜𝑒𝑑𝑖𝑡";

      
      const videos = await fetchTikTokVideos(query);

      if (!videos || videos.length === 0) {
        api.sendMessage({ body: `${query} 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.` }, event.threadID, event.messageID);
        return;
      }

      
      const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
      const videoUrl = selectedVideo.videoUrl;

      if (!videoUrl) {
        api.sendMessage({ body: '𝐸𝑟𝑟𝑜𝑟: 𝑉𝑖𝑑𝑒𝑜 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.' }, event.threadID, event.messageID);
        return;
      }

      
      const videoStream = await getStreamFromURL(videoUrl);
      await api.sendMessage({
        body: ``,
        attachment: videoStream,
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage({ body: '𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑣𝑖𝑑𝑒𝑜.\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.' }, event.threadID, event.messageID);
    }
  },
};
