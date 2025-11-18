const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "tikvideo",
    aliases: [],
    version: "3.0.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    role: 0,
    category: "media",
    shortDescription: {
      en: "📥 𝐓𝐢𝐤𝐓𝐨𝐤 𝐯𝐢𝐝𝐞𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫"
    },
    longDescription: {
      en: "𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐓𝐢𝐤𝐓𝐨𝐤 𝐯𝐢𝐝𝐞𝐨𝐬 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐰𝐚𝐭𝐞𝐫𝐦𝐚𝐫𝐤"
    },
    guide: {
      en: "{p}tikvideo [𝐭𝐢𝐤𝐭𝐨𝐤_𝐥𝐢𝐧𝐤]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "request": ""
    }
  },

  onLoad: function () {
    console.log("=== 𝐓𝐢𝐤𝐓𝐨𝐤 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐍𝐨 𝐖𝐚𝐭𝐞𝐫𝐦𝐚𝐫𝐤 ===");
  },

  onStart: async function ({ args, event, message }) {
    try {
      const img = [];

      if (!args[0]) {
        return message.reply("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐓𝐢𝐤𝐓𝐨𝐤 𝐥𝐢𝐧𝐤!");
      }

      // Send processing message
      await message.reply("⏳ 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐓𝐢𝐤𝐓𝐨𝐤 𝐥𝐢𝐧𝐤...");

      const tiktokUrl = args[0];
      let res = null;
      let apiUsed = "";

      // Best and most popular working APIs for 2025
      const apis = [
        {
          name: "TikWM (Most Popular)",
          url: `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}`,
          parseResponse: (data) => {
            if (data.code === 0 && data.data) {
              return {
                video: data.data.play || data.data.wmplay || data.data.hdplay,
                music: data.data.music,
                cover: data.data.cover || data.data.origin_cover,
                title: data.data.title,
                author: data.data.author?.nickname || data.data.author?.unique_id || "Unknown",
                musicTitle: data.data.music_info?.title || "Unknown"
              };
            }
            return null;
          }
        },
        {
          name: "TikWM API v2",
          url: `https://tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}&hd=1`,
          parseResponse: (data) => {
            if (data.code === 0 && data.data) {
              return {
                video: data.data.hdplay || data.data.play || data.data.wmplay,
                music: data.data.music,
                cover: data.data.cover || data.data.origin_cover,
                title: data.data.title,
                author: data.data.author?.nickname || data.data.author?.unique_id || "Unknown",
                musicTitle: data.data.music_info?.title || "Unknown"
              };
            }
            return null;
          }
        },
        {
          name: "Tiklydown API",
          url: `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(tiktokUrl)}`,
          parseResponse: (data) => {
            if (data.video && data.video.noWatermark) {
              return {
                video: data.video.noWatermark,
                music: data.music?.play_url,
                cover: data.video.cover || data.video.originCover,
                title: data.title || "Unknown",
                author: data.author?.nickname || "Unknown",
                musicTitle: data.music?.title || "Unknown"
              };
            }
            return null;
          }
        },
        {
          name: "TikAPI Alternative",
          url: `https://api.tiklydown.eu.org/api/download/v2?url=${encodeURIComponent(tiktokUrl)}`,
          parseResponse: (data) => {
            if (data.video) {
              return {
                video: data.video.noWatermark || data.video.watermark,
                music: data.music?.play_url,
                cover: data.video.cover,
                title: data.title || "Unknown",
                author: data.author?.nickname || "Unknown",
                musicTitle: data.music?.title || "Unknown"
              };
            }
            return null;
          }
        },
        {
          name: "SSSTik Alternative",
          url: `https://api.ssssss.id/tiktok?url=${encodeURIComponent(tiktokUrl)}`,
          parseResponse: (data) => {
            if (data.status === "success" && data.data) {
              return {
                video: data.data.play || data.data.wmplay,
                music: data.data.music,
                cover: data.data.cover || data.data.origin_cover,
                title: data.data.title || "Unknown",
                author: data.data.author?.nickname || "Unknown",
                musicTitle: data.data.music_info?.title || "Unknown"
              };
            }
            return null;
          }
        }
      ];

      // Try each API until one works
      for (const api of apis) {
        try {
          console.log(`Trying ${api.name}...`);
          
          const response = await axios.get(api.url, {
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json',
              'Referer': 'https://www.tiktok.com/'
            }
          });

          const parsedData = api.parseResponse(response.data);
          
          if (parsedData && parsedData.video) {
            res = parsedData;
            apiUsed = api.name;
            console.log(`✅ Success with ${api.name}`);
            break;
          }
        } catch (apiError) {
          console.log(`❌ ${api.name} failed:`, apiError.message);
          continue;
        }
      }

      // If all APIs fail
      if (!res) {
        return message.reply(
          "❌ 𝐀𝐥𝐥 𝐀𝐏𝐈 𝐞𝐧𝐝𝐩𝐨𝐢𝐧𝐭𝐬 𝐟𝐚𝐢𝐥𝐞𝐝.\n\n" +
          "𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤:\n" +
          "• 𝐓𝐡𝐞 𝐥𝐢𝐧𝐤 𝐢𝐬 𝐯𝐚𝐥𝐢𝐝\n" +
          "• 𝐓𝐡𝐞 𝐯𝐢𝐝𝐞𝐨 𝐢𝐬 𝐩𝐮𝐛𝐥𝐢𝐜\n" +
          "• 𝐓𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫"
        );
      }

      // Download thumbnail if available
      if (res.cover) {
        try {
          const imgResponse = await axios.get(res.cover, {
            responseType: "arraybuffer",
            timeout: 20000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          fs.writeFileSync(__dirname + "/cache/tiktok.png", Buffer.from(imgResponse.data));
          img.push(fs.createReadStream(__dirname + "/cache/tiktok.png"));
        } catch (thumbError) {
          console.log("⚠️ Thumbnail download failed, continuing without it");
        }
      }

      const msg = {
        body:
          `✅ 𝐅𝐞𝐭𝐜𝐡𝐞𝐝 𝐰𝐢𝐭𝐡: ${apiUsed}\n\n` +
          `📝 𝐓𝐢𝐭𝐥𝐞: ${res.title}\n` +
          `👤 𝐀𝐮𝐭𝐡𝐨𝐫: ${res.author}\n` +
          `🎵 𝐌𝐮𝐬𝐢𝐜: ${res.musicTitle}\n\n` +
          `𝟏. 📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐕𝐢𝐝𝐞𝐨\n` +
          (res.music ? `𝟐. 🎶 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐌𝐮𝐬𝐢𝐜\n\n` : '\n') +
          `📩 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 ${res.music ? '𝟏 𝐨𝐫 𝟐' : '𝟏'}!`,
        attachment: img
      };

      return message.reply(msg, (error, info) => {
        // Clean up thumbnail
        if (img.length > 0) {
          try {
            fs.unlinkSync(__dirname + "/cache/tiktok.png");
          } catch {}
        }

        if (error) {
          console.error("Error sending reply:", error);
          return;
        }

        // Store data for reply handler
        global.client.handleReply.push({
          type: "reply",
          name: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          video: res.video,
          mp3: res.music,
          title: res.title,
          authorvd: res.author,
          text: res.musicTitle
        });
      });

    } catch (error) {
      console.error("❌ [𝐭𝐢𝐤𝐯𝐢𝐝𝐞𝐨] 𝐄𝐫𝐫𝐨𝐫:", error.message);
      console.error(error.stack);
      return message.reply(
        "❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝!\n\n" +
        `𝐄𝐫𝐫𝐨𝐫: ${error.message}\n\n` +
        "𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐰𝐢𝐭𝐡 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐓𝐢𝐤𝐓𝐨𝐤 𝐥𝐢𝐧𝐤."
      );
    }
  },

  handleReply: async function ({ event, message, Reply }) {
    try {
      const { author, video, mp3, title, authorvd, text } = Reply;

      // Check authorization
      if (event.senderID != author) {
        return message.reply("🚫 𝐔𝐧𝐚𝐮𝐭𝐡𝐨𝐫𝐢𝐳𝐞𝐝 𝐚𝐜𝐜𝐞𝐬𝐬!");
      }

      if (Reply.type !== "reply") return;

      const choice = String(event.body || "").trim();

      switch (choice) {
        case "1": {
          await message.reply("⏳ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐯𝐢𝐝𝐞𝐨... 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭.");

          const videoPath = __dirname + "/cache/tiktok_video.mp4";

          return request({
            url: encodeURI(video),
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Referer': 'https://www.tiktok.com/'
            }
          })
            .pipe(fs.createWriteStream(videoPath))
            .on("close", () => {
              message.reply({
                body: `✅ 𝐕𝐢𝐝𝐞𝐨 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝!\n\n🎥 𝐀𝐮𝐭𝐡𝐨𝐫: ${authorvd}\n📝 𝐓𝐢𝐭𝐥𝐞: ${title}`,
                attachment: fs.createReadStream(videoPath)
              }, () => {
                try {
                  fs.unlinkSync(videoPath);
                } catch {}
              });
            })
            .on("error", (err) => {
              console.error("Video download error:", err);
              try {
                fs.unlinkSync(videoPath);
              } catch {}
              return message.reply(
                "❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐯𝐢𝐝𝐞𝐨.\n\n" +
                "𝐏𝐨𝐬𝐬𝐢𝐛𝐥𝐞 𝐫𝐞𝐚𝐬𝐨𝐧𝐬:\n" +
                "• 𝐕𝐢𝐝𝐞𝐨 𝐥𝐢𝐧𝐤 𝐞𝐱𝐩𝐢𝐫𝐞𝐝\n" +
                "• 𝐍𝐞𝐭𝐰𝐨𝐫𝐤 𝐢𝐬𝐬𝐮𝐞\n" +
                "𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧."
              );
            });
        }

        case "2": {
          if (!mp3) {
            return message.reply("❌ 𝐌𝐮𝐬𝐢𝐜 𝐧𝐨𝐭 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐟𝐨𝐫 𝐭𝐡𝐢𝐬 𝐯𝐢𝐝𝐞𝐨.");
          }

          await message.reply("⏳ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐦𝐮𝐬𝐢𝐜... 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭.");

          const musicPath = __dirname + "/cache/tiktok_music.mp3";

          return request({
            url: encodeURI(mp3),
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Referer': 'https://www.tiktok.com/'
            }
          })
            .pipe(fs.createWriteStream(musicPath))
            .on("close", () => {
              message.reply({
                body: `✅ 𝐌𝐮𝐬𝐢𝐜 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝!\n\n🎵 𝐓𝐢𝐭𝐥𝐞: ${text}`,
                attachment: fs.createReadStream(musicPath)
              }, () => {
                try {
                  fs.unlinkSync(musicPath);
                } catch {}
              });
            })
            .on("error", (err) => {
              console.error("Music download error:", err);
              try {
                fs.unlinkSync(musicPath);
              } catch {}
              return message.reply(
                "❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐦𝐮𝐬𝐢𝐜.\n" +
                "𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧."
              );
            });
        }

        default: {
          return message.reply(
            "ℹ️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐡𝐨𝐢𝐜𝐞!\n\n" +
            `𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 ${mp3 ? '𝟏 𝐨𝐫 𝟐' : '𝟏'}`
          );
        }
      }
    } catch (error) {
      console.error("❌ 𝐑𝐞𝐩𝐥𝐲 𝐡𝐚𝐧𝐝𝐥𝐞𝐫 𝐞𝐫𝐫𝐨𝐫:", error.message);
      return message.reply(
        "❌ 𝐄𝐫𝐫𝐨𝐫 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭.\n" +
        `${error.message}`
      );
    }
  }
};
