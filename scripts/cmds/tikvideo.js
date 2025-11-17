const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "tikvideo",
    aliases: ["ttdl"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "📥 𝙏𝙞𝙠𝙏𝙤𝙠 𝙫𝙞𝙙𝙚𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙚𝙧"
    },
    longDescription: {
      en: "𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙏𝙞𝙠𝙏𝙤𝙠 𝙫𝙞𝙙𝙚𝙤𝙨 𝙬𝙞𝙩𝙝𝙤𝙪𝙩 𝙬𝙖𝙩𝙚𝙧𝙢𝙖𝙧𝙠"
    },
    guide: {
      en: "{p}tikvideo [𝙩𝙞𝙠𝙩𝙤𝙠_𝙡𝙞𝙣𝙠]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "request": ""
    }
  },

  onLoad: function () {
    console.log("=== 𝙏𝙞𝙠𝙏𝙤𝙠 𝘿𝙖𝙪𝙣𝙡𝙤𝙖𝙙 𝙉𝙤 𝙒𝙖𝙩𝙚𝙧𝙢𝙖𝙧𝙠 ===");
  },

  onStart: async function ({ args, event, message }) {
    try {
      const img = [];

      if (!args[0]) {
        return message.reply("❌ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧𝙤𝙫𝙞𝙙𝙚 𝙖 𝙏𝙞𝙠𝙏𝙤𝙠 𝙡𝙞𝙣𝙠!");
      }

      const url = `http://api.leanhtruong.net/api-no-key/tiktok?url=${encodeURI(args[0])}`;
      const res = (await axios.get(url, { timeout: 20000 })).data;

      // Thumbnail fallback handling
      const thumbUrl = res.thumbail || res.thumbnail || res.cover || (res.data_thumb ? res.data_thumb : null);

      if (thumbUrl) {
        const imga = (await axios.get(thumbUrl, { responseType: "arraybuffer", timeout: 20000 })).data;
        fs.writeFileSync(__dirname + "/cache/tiktok.png", Buffer.from(imga));
        img.push(fs.createReadStream(__dirname + "/cache/tiktok.png"));
      }

      const title = res.title || "Unknown";
      const author_video = res.author_video || "Unknown";
      const musicTitle = res?.data_music?.title || "Unknown";
      const videoUrl = res?.data_nowatermark?.[0]?.url;
      const mp3Url = res?.data_music?.url;

      if (!videoUrl || !mp3Url) {
        if (thumbUrl) {
          try { fs.unlinkSync(__dirname + "/cache/tiktok.png"); } catch {}
        }
        return message.reply("❌ 𝙄𝙣𝙫𝙖𝙡𝙞𝙙 𝙧𝙚𝙨𝙥𝙤𝙣𝙨𝙚 𝙛𝙧𝙤𝙢 𝙖𝙥𝙞, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣");
      }

      const msg = {
        body:
          `📝 𝙏𝙞𝙩𝙡𝙚: ${title}\n` +
          `👤 𝘼𝙪𝙩𝙝𝙤𝙧: ${author_video}\n` +
          `🎵 𝙈𝙪𝙨𝙞𝙘: ${musicTitle}\n\n` +
          `1. 📥 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙑𝙞𝙙𝙚𝙤\n` +
          `2. 🎶 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙈𝙪𝙨𝙞𝙘\n\n` +
          `📩 𝙍𝙚𝙥𝙡𝙮 𝙬𝙞𝙩𝙝 1 𝙤𝙧 2!`,
        attachment: img
      };

      return message.reply(msg, (error, info) => {
        if (thumbUrl) {
          try { fs.unlinkSync(__dirname + "/cache/tiktok.png"); } catch {}
        }
        if (error) return;

        global.client.handleReply.push({
          type: "reply",
          name: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          video: videoUrl,
          mp3: mp3Url,
          title: title,
          authorvd: author_video,
          text: musicTitle
        });
      });

    } catch (error) {
      console.error("[tikvideo] Error:", error);
      return message.reply("❌ 𝙀𝙧𝙧𝙤𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣");
    }
  },

  handleReply: async function ({ event, message, Reply }) {
    try {
      const { author, video, mp3, title, authorvd, text } = Reply;

      if (event.senderID != author) {
        return message.reply("🚫 𝙐𝙣𝙖𝙪𝙩𝙝𝙤𝙧𝙞𝙯𝙚𝙙 𝙖𝙘𝙘𝙚𝙨𝙨!");
      }

      if (Reply.type !== "reply") return;

      const choice = String(event.body || "").trim();

      switch (choice) {
        case "1": {
          const filePath = __dirname + "/cache/toptop.mp4";
          const callback = () =>
            message.reply({
              body: `🎥 𝙑𝙞𝙙𝙚𝙤: ${authorvd}\n📝 𝙏𝙞𝙩𝙡𝙚: ${title}\n`,
              attachment: fs.createReadStream(filePath)
            }, () => {
              try { fs.unlinkSync(filePath); } catch {}
            });

          return request(encodeURI(`${video}`))
            .pipe(fs.createWriteStream(filePath))
            .on("close", callback)
            .on("error", () => {
              try { fs.unlinkSync(filePath); } catch {}
              return message.reply("❌ 𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙫𝙞𝙙𝙚𝙤, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣");
            });
        }

        case "2": {
          const filePath = __dirname + "/cache/toptop.m4a";
          const callback = () =>
            message.reply({
              body: `🎵 𝙈𝙪𝙨𝙞𝙘: ${text}`,
              attachment: fs.createReadStream(filePath)
            }, () => {
              try { fs.unlinkSync(filePath); } catch {}
            });

          return request(encodeURI(`${mp3}`))
            .pipe(fs.createWriteStream(filePath))
            .on("close", callback)
            .on("error", () => {
              try { fs.unlinkSync(filePath); } catch {}
              return message.reply("❌ 𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙢𝙪𝙨𝙞𝙘, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣");
            });
        }

        default: {
          return message.reply("ℹ️ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙬𝙞𝙩𝙝 1 𝙤𝙧 2");
        }
      }
    } catch (error) {
      console.error("Reply handler error:", error);
      return message.reply("❌ 𝙀𝙧𝙧𝙤𝙧 𝙥𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜 𝙮𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩");
    }
  }
};
