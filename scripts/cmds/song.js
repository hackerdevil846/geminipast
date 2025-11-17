const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json`,
  );
  return base.data.api;
};

async function dipto(url, pathName) {
  try {
    const response = (await axios.get(url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathName, Buffer.from(response));
    return fs.createReadStream(pathName);
  } catch (err) {
    throw err;
  }
}

async function diptoSt(url, pathName) {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    response.data.path = pathName;
    return response.data;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  config: {
    name: "song",
    version: "2.1.0",
    aliases: ["music", "play"],
    author: "dipto",
    role: 0,
    cooldowns: 5,
    shortDescription: "Download audio from YouTube",
    longDescription: "Download audio from YouTube by link or by searching.",
    category: "media",
    guide:
      "{pn} [<song name>|<song link>]\n   Example:\n{pn} chipi chipi chapa chapa",
    envConfig: {
      YOUTUBE_API_KEY: "AIzaSyDdsyDEm_JWnm2dvlKCI1HD_QwEYItBmnI"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;

    try {
      const urlYtb = args[0] && checkurl.test(args[0]);

      if (urlYtb) {
        const match = args[0].match(checkurl);
        const videoID = match ? match[1] : null;

        const {
          data: { title, downloadLink }
        } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`);

        return message.reply(
          {
            body: title,
            attachment: await dipto(downloadLink, "audio.mp3")
          },
          async () => {
            try { fs.unlinkSync("audio.mp3"); } catch { /* ignore */ }
          }
        );
      }

      let keyWord = args.join(" ");
      keyWord = keyWord.includes("?feature=share")
        ? keyWord.replace("?feature=share", "")
        : keyWord;

      const maxResults = 6;
      let result;

      try {
        result = ((await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${keyWord}`)).data).slice(0, maxResults);
      } catch (err) {
        return message.reply("❌ An error occurred: " + err.message);
      }

      if (!result || result.length === 0) {
        return message.reply("⭕ No search results match the keyword: " + keyWord);
      }

      let msg = "";
      let index = 1;
      const thumbnails = [];

      for (const info of result) {
        thumbnails.push(diptoSt(info.thumbnail, "photo.jpg"));
        msg += `${index++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
      }

      message.reply(
        {
          body: msg + "Reply to this message with a number want to listen",
          attachment: await Promise.all(thumbnails)
        },
        (err, info) => {
          if (err || !info) return;
          if (!global.GoatBot) global.GoatBot = {};
          if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            result
          });
        }
      );
    } catch (error) {
      return message.reply("❌ An unexpected error occurred.");
    }
  },

  onReply: async function ({ event, message, Reply, api }) {
    try {
      const { result, author, messageID } = Reply;

      if (event.senderID !== author) {
        return;
      }

      const choice = parseInt(event.body);
      if (isNaN(choice) || choice < 1 || choice > result.length) {
        return message.reply("Invalid choice. Please enter a number between 1 and 6.");
      }

      const infoChoice = result[choice - 1];
      const idvideo = infoChoice.id;

      const {
        data: { title, downloadLink, quality }
      } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${idvideo}&format=mp3`);

      try {
        await api.unsendMessage(messageID);
      } catch { /* ignore */ }

      await message.reply(
        {
          body: `• Title: ${title}\n• Quality: ${quality}`,
          attachment: await dipto(downloadLink, "audio.mp3")
        },
        async () => {
          try { fs.unlinkSync("audio.mp3"); } catch { /* ignore */ }
        }
      );
    } catch (error) {
      console.log(error);
      return message.reply("⭕ Sorry, audio size was less than 26MB");
    }
  }
};
