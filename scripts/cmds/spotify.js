const fs = require("fs-extra");
const https = require("https");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "spotify",
    aliases: ["spotifydl", "spotidownload"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "🎵 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ℎ𝑖𝑔ℎ-𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑆𝑝𝑜𝑡𝑖𝑓𝑦 𝑡𝑟𝑎𝑐𝑘𝑠 𝑤𝑖𝑡ℎ 𝑓𝑢𝑙𝑙 𝑚𝑒𝑡𝑎𝑑𝑎𝑡𝑎"
    },
    longDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑆𝑝𝑜𝑡𝑖𝑓𝑦 𝑡𝑟𝑎𝑐𝑘𝑠 𝑤𝑖𝑡ℎ 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒 𝑚𝑒𝑡𝑎𝑑𝑎𝑡𝑎 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 ℎ𝑖𝑔ℎ 𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑎𝑢𝑑𝑖𝑜"
    },
    guide: {
      en: "{p}spotify [𝑆𝑝𝑜𝑡𝑖𝑓𝑦 𝑈𝑅𝐿 𝑜𝑟 𝑇𝑟𝑎𝑐𝑘 𝐼𝐷]"
    },
    countDown: 15,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, senderID } = event;
      const tempPath = path.join(__dirname, `cache/spotify_${Date.now()}_${senderID}.mp3`);

      // Check user input
      if (!args[0]) {
        return message.reply(
          `❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑆𝑝𝑜𝑡𝑖𝑓𝑦 𝑡𝑟𝑎𝑐𝑘 𝑈𝑅𝐿 𝑜𝑟 𝐼𝐷\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config.PREFIX}spotify https://open.spotify.com/track/7jT3LcNj4XPYOlbNkPWNhU`
        );
      }

      // Extract track ID
      let trackId = args[0];
      if (trackId.includes("open.spotify.com/track/")) {
        const parts = trackId.split("/");
        trackId = parts[parts.length - 1].split("?")[0];
      }

      // Validate track ID
      if (!/^[a-zA-Z0-9]{22}$/.test(trackId)) {
        return message.reply(
          "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑆𝑝𝑜𝑡𝑖𝑓𝑦 𝑡𝑟𝑎𝑐𝑘 𝐼𝐷. 𝑃𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑈𝑅𝐿 𝑜𝑟 𝐼𝐷.\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 7jT3LcNj4XPYOlbNkPWNhU"
        );
      }

      // Notify user
      const processingMsg = await message.reply(`⏳ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑡𝑟𝑎𝑐𝑘... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡`);

      // Spotify API request options
      const apiOptions = {
        method: 'GET',
        hostname: 'spotify-downloader9.p.rapidapi.com',
        path: `/downloadSong?songId=${encodeURIComponent(trackId)}`,
        headers: {
          'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
          'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com'
        },
        timeout: 45000
      };

      // Fetch track info
      const apiResponse = await new Promise((resolve, reject) => {
        const req = https.request(apiOptions, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        });
        req.on('error', err => reject(err));
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('API request timed out'));
        });
        req.end();
      });

      const result = JSON.parse(apiResponse);
      if (!result || !result.audio || !result.title) throw new Error("API returned invalid data");

      // Download audio
      const audioResponse = await axios.get(result.audio, { responseType: 'arraybuffer', timeout: 120000 });
      fs.writeFileSync(tempPath, Buffer.from(audioResponse.data, 'binary'));

      // Rich metadata
      const metadata = `🎧 𝗦𝗽𝗼𝘁𝗶𝗳𝘆 𝗧𝗿𝗮𝗰𝗸\n\n` +
        `🎼 𝗧𝗶𝘁𝗹𝗲: ${result.title || "Unknown"}\n` +
        `🎤 𝗔𝗿𝘁𝗶𝘀𝘁: ${result.artists || "Unknown"}\n` +
        `💿 𝗔𝗹𝗯𝘂𝗺: ${result.album || "Unknown"}\n` +
        `📅 𝗥𝗲𝗹𝗲𝗮𝘀𝗲: ${result.release || "N/A"}\n` +
        `⏱ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${result.duration || "N/A"}\n` +
        `🔥 𝗣𝗼𝗽𝘂𝗹𝗮𝗿𝗶𝘁𝘆: ${result.popularity || "N/A"}\n` +
        `🔞 𝗘𝘅𝗽𝗹𝗶𝗰𝗶𝘁: ${result.explicit ? "Yes" : "No"}\n` +
        `💾 𝗤𝘂𝗮𝗹𝗶𝘁𝘆: 128kbps\n\n` +
        `🔗 Spotify Link: ${result.external_url || "N/A"}`;

      // Send track with metadata
      await message.reply({
        body: metadata,
        attachment: fs.createReadStream(tempPath)
      });

      // Cleanup
      api.unsendMessage(processingMsg.messageID);
      fs.unlinkSync(tempPath);

    } catch (error) {
      console.error("Spotify Download Error:", error);

      let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑟𝑎𝑐𝑘. ";
      if (error.message.includes('timed out')) {
        errorMessage += "𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑇𝑟𝑦 𝑎 𝑠𝑚𝑎𝑙𝑙𝑒𝑟 𝑡𝑟𝑎𝑐𝑘.";
      } else if (error.message.includes('API returned')) {
        errorMessage += "𝑆𝑝𝑜𝑡𝑖𝑓𝑦 𝐴𝑃𝐼 𝑟𝑒𝑡𝑢𝑟𝑛𝑒𝑑 𝑖𝑛𝑣𝑎𝑙𝑖𝑑 𝑑𝑎𝑡𝑎.";
      } else if (error.response?.status === 404) {
        errorMessage += "𝑇𝑟𝑎𝑐𝑘 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑜𝑟 𝑟𝑒𝑔𝑖𝑜𝑛-𝑟𝑒𝑠𝑡𝑟𝑖𝑐𝑡𝑒𝑑.";
      } else {
        errorMessage += `𝐸𝑟𝑟𝑜𝑟: ${error.message || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟"}`;
      }

      message.reply(errorMessage);

      // Cleanup temp file if exists
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
};
