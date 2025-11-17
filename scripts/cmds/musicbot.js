const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const qs = require('qs');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "musicbot",
    version: "1.2.9",
    role: 0,
    author: "Asif Mahmud",
    category: "utility",
    shortDescription: {
      en: "Listen to music from YouTube platform"
    },
    longDescription: {
      en: "Search and play music from YouTube with download functionality"
    },
    guide: {
      en: "musicbot [song name]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "qs": "",
      "moment-timezone": ""
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const send = (msg) => message.reply(msg);
    
    if (args.length === 0) {
      return send("❎ Search term cannot be empty!");
    }

    const keywordSearch = args.join(" ");
    const audioPath = `${__dirname}/cache/${event.senderID}.mp3`;
    
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    try {
      let keyWord = keywordSearch.includes("?feature=share") ? 
        keywordSearch.replace("?feature=share", "") : keywordSearch;
      
      const maxResults = 10;
      let result = await search(keyWord);
      result = result.slice(0, maxResults);
      
      if (result.length === 0) {
        return send(`❎ No search results found for: ${keyWord}`);
      }

      let messageText = "";
      let i = 1;
      const userName = (await usersData.get(event.senderID)).name;
      const arrayID = [];
      
      for (const info of result) {
        arrayID.push(info.id);
        messageText += `${i++} - ${info.title}\n🌐 Channel: ${info.channel.name}\n⏰ Duration: ${info.time}\n\n`;
      }

      send({
        body: `====『 Music Menu 』====\n\n${messageText}➝ Please reply to this message with the number of the song you want to listen to`
      }, (err, info) => {
        if (err) {
          return send(`❎ Error: ${err.message}`);
        }
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          arrayID,
          result,
          audioPath
        });
      });
    } catch (err) {
      send(`❎ Error: ${err.message}`);
    }
  },

  handleReply: async function ({ event, handleReply, message, usersData }) {
    if (event.senderID !== handleReply.author) {
      const userName = (await usersData.get(event.senderID)).name;
      return message.reply(`${userName}, if you want to listen to music, please use the command properly`);
    }

    const send = (msg) => message.reply(msg);
    
    try {
      const startTime = Date.now();
      let data = handleReply.result[event.body - 1];
      
      if (!data) {
        return message.reply("Invalid selection");
      }

      const { title, url } = await getData(data.id);
      const userName = (await usersData.get(event.senderID)).name;
      const savePath = handleReply.audioPath;
      const MAX_SIZE = 27262976;

      const getStream = await getStreamAndSize(url, `${data.id}.mp3`);
      
      if (getStream.size > MAX_SIZE) {
        return send("This song is too long, please choose another one 😠");
      }

      const writeStream = fs.createWriteStream(savePath);
      getStream.stream.pipe(writeStream);
      const contentLength = getStream.size;
      let downloaded = 0;
      let count = 0;

      getStream.stream.on("data", (chunk) => {
        downloaded += chunk.length;
        count++;
      });

      writeStream.on("finish", () => {
        send({
          body: `===『 Music Player 』===\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n→ Song: ${title}\n→ Channel: ${data.channel.name}\n→ Duration: ${data.time}\n→ Processing time: ${Math.floor((Date.now() - startTime) / 1000)} seconds\n→ User: ${userName}\n→ Time: ${moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss")}\n⇆ㅤㅤㅤ◁ㅤ❚❚ㅤ▷ㅤㅤㅤ↻\n▱▱▱▱▱▱▱▱▱▱▱▱▱`,
          attachment: fs.createReadStream(savePath)
        }, async (err) => {
          if (err) {
            return send(`❎ Error: ${err.message}`);
          }
          fs.unlinkSync(savePath);
        });
      });
    } catch (error) {
      send(`❎ Error: ${error.message}`);
    }
  }
};

async function search(keyWord) {
  try {
    const res = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(keyWord)}`);
    const getJson = JSON.parse(res.data.split("ytInitialData = ")[1].split(";</script>")[0]);
    const videos = getJson.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    const results = [];
    
    for (const video of videos) {
      if (video.videoRenderer?.lengthText?.simpleText) {
        results.push({
          id: video.videoRenderer.videoId,
          title: video.videoRenderer.title.runs[0].text,
          thumbnail: video.videoRenderer.thumbnail.thumbnails.pop().url,
          time: video.videoRenderer.lengthText.simpleText,
          channel: {
            id: video.videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
            name: video.videoRenderer.ownerText.runs[0].text,
            thumbnail: video.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails.pop().url.replace(/s[0-9]+\-c/g, '-c')
          }
        });
      }
    }
    return results;
  } catch (e) {
    throw new Error("Cannot search video");
  }
}

async function getData(id) {
  function getRandomUserAgent() {
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    const osList = ['Windows NT 10.0; Win64; x64', 'Macintosh; Intel Mac OS X 10_15_7', 'X11; Linux x86_64'];
    const webKitVersion = `537.${Math.floor(Math.random() * 100)}`;
    const browserVersion = `${Math.floor(Math.random() * 100)}.0.${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 100)}`;
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const os = osList[Math.floor(Math.random() * osList.length)];
    return `Mozilla/5.0 (${os}) AppleWebKit/${webKitVersion} (KHTML, like Gecko) ${browser}/${browserVersion} Safari/${webKitVersion}`;
  }

  function getRandomCookie() {
    const ga = `_ga=GA1.1.${Math.floor(Math.random() * 10000000000)}.${Math.floor(Math.random() * 10000000000)}`;
    const gaPSRPB96YVC = `_ga_PSRPB96YVC=GS1.1.${Math.floor(Math.random() * 10000000000)}.2.1.${Math.floor(Math.random() * 10000000000)}.0.0.0`;
    return `${ga}; ${gaPSRPB96YVC}`;
  }

  const userAgent = getRandomUserAgent();
  const cookies = getRandomCookie();

  async function getDa(url) {
    try {
      const { data } = await axios.post("https://www.y2mate.com/mates/vi862/analyzeV2/ajax",
        qs.stringify({
          k_query: `https://www.youtube.com/watch?v=${id}`,
          k_page: "mp3",
          hl: "vi",
          q_auto: "0",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: cookies,
            "User-Agent": userAgent,
          },
        }
      );
      return {
        id: data.vid,
        title: data.title,
        duration: data.t,
        author: data.a,
        k: data.links["mp3"]["mp3128"]["k"],
      };
    } catch (error) {
      console.error("Error:", error);
    }
  }

  let dataPost = await getDa(id);
  
  try {
    const response = await axios.post("https://www.y2mate.com/mates/convertV2/index",
      qs.stringify({
        vid: dataPost.id,
        k: dataPost.k,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: cookies,
          "User-Agent": userAgent,
        },
      }
    );
    return {
      id: dataPost.id,
      title: dataPost.title,
      duration: dataPost.duration,
      author: dataPost.author,
      url: response.data.dlink,
    };
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to get music data");
  }
}

async function getStreamAndSize(url, path = "") {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    headers: {
      'Range': 'bytes=0-'
    }
  });
  if (path) response.data.path = path;
  const totalLength = response.headers["content-length"];
  return {
    stream: response.data,
    size: totalLength
  };
}
