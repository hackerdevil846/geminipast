// scripts/cmds/mu-sing.js
// Fixed: avoids top-level require of modules that can cause load-time crashes (yt-search/cheerio).
// Uses safe runtime requires + dynamic import fallback, robust streaming with ffmpeg spawn.

const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "musing",
    aliases: [],
    version: "1.0.5",
    role: 0,
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 (fixed)",
    shortDescription: {
      en: "Download YouTube audio/video by keyword or link"
    },
    longDescription: {
      en: "Search YouTube by keyword or use a YouTube link and download audio (mp3) or video (mp4)."
    },
    category: "media",
    guide: {
      en: "{p}musing [song_name_or_link] [audio|video]"
    },
    countDown: 5,
    dependencies: {
      "ytdl-core": "",
      "ffmpeg-static": "",
      "axios": "",
      "yt-search": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    // runtime requires so missing deps don't crash bot at startup
    let axios, ytdl, ffmpegPath, cp, ytSearch;
    try {
      axios = require("axios");
      ytdl = require("ytdl-core");
      ffmpegPath = require("ffmpeg-static");
      cp = require("child_process");
      // yt-search may pull cheerio internally -> use try/catch + dynamic import fallback
      try {
        ytSearch = require("yt-search");
      } catch (reqErr) {
        try {
          const mod = await import("yt-search");
          ytSearch = mod && (mod.default || mod);
        } catch (impErr) {
          ytSearch = null;
        }
      }
    } catch (err) {
      console.error("Missing dependencies in mu-sing:", err && err.message);
      return message.reply("❌ Missing dependency. Please run: `npm install ytdl-core ffmpeg-static axios yt-search`");
    }

    try {
      // parse args: last arg optionally 'audio' or 'video'
      if (!Array.isArray(args)) args = [];
      let mode = "audio"; // default
      if (args.length > 0) {
        const last = args[args.length - 1].toLowerCase();
        if (last === "audio" || last === "video") {
          mode = last;
          args.pop();
        }
      }
      const query = args.join(" ").trim();

      if (!query) {
        return message.reply("❔ Please provide a search keyword or a YouTube link. Example:\nmu-sing despacito audio\nmu-sing https://youtu.be/XXXXX video");
      }

      // helper: unsend/cleanup processing message (different frameworks use different names)
      const unsendProcessing = async (procMsg) => {
        if (!procMsg) return;
        try {
          if (typeof message.unsend === "function") await message.unsend(procMsg.messageID || procMsg.messageId || procMsg.id);
          else if (typeof message.unsendMessage === "function") await message.unsendMessage(procMsg.messageID || procMsg.messageId || procMsg.id);
        } catch (_) { /* ignore */ }
      };

      const processingMessage = await message.reply("✅ Processing your request... please wait ⏳");

      // determine videoId
      let videoId;
      if (ytdl.validateURL(query)) {
        videoId = ytdl.getURLVideoID(query);
      } else {
        if (!ytSearch) {
          await unsendProcessing(processingMessage);
          return message.reply("❌ Search functionality requires the 'yt-search' package. Install: `npm install yt-search`");
        }
        // search using yt-search
        const searchResult = await ytSearch(query);
        if (!searchResult || !searchResult.videos || searchResult.videos.length === 0) {
          await unsendProcessing(processingMessage);
          return message.reply("❌ No results found for your query.");
        }
        videoId = searchResult.videos[0].videoId || searchResult.videos[0].videoId;
        if (!videoId) {
          await unsendProcessing(processingMessage);
          return message.reply("❌ Could not resolve a video from search results.");
        }
      }

      // get basic info
      let info;
      try {
        info = await ytdl.getInfo(videoId);
      } catch (e) {
        console.error("ytdl.getInfo error:", e && e.message);
        await unsendProcessing(processingMessage);
        return message.reply("❌ Failed to get video info from YouTube.");
      }

      const safeTitle = (info && info.videoDetails && info.videoDetails.title)
        ? info.videoDetails.title.replace(/[/\\?%*:|"<>]/g, "-").substring(0, 120)
        : `youtube_${videoId}`;
      const ext = mode === "audio" ? "mp3" : "mp4";
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const outPath = path.join(cacheDir, `${safeTitle}.${ext}`);

      // if file exists, just send it
      if (fs.existsSync(outPath)) {
        try {
          await message.reply({
            attachment: fs.createReadStream(outPath),
            body: `✨ Title: ${info.videoDetails.title}\n\nHere is your ${mode}.`
          }, () => { unsendProcessing(processingMessage); });
          return;
        } catch (e) {
          // continue to re-create if sending existing file fails
          console.warn("Sending existing cached file failed, will recreate:", e && e.message);
        }
      }

      if (mode === "audio") {
        // Download audio stream and convert to mp3 with ffmpeg spawn
        const audioStream = ytdl(videoId, { quality: "highestaudio" });

        // ensure ffmpeg is available
        if (!ffmpegPath) {
          await unsendProcessing(processingMessage);
          return message.reply("❌ ffmpeg not available. Install 'ffmpeg-static' or provide ffmpeg in PATH.");
        }

        // spawn ffmpeg
        const ffmpeg = cp.spawn(ffmpegPath, [
          "-y",
          "-i", "pipe:0",
          "-vn",
          "-acodec", "libmp3lame",
          "-ab", "192k",
          "-f", "mp3",
          outPath
        ], { stdio: ["pipe", "ignore", "inherit"] });

        // pipe audio stream into ffmpeg stdin
        audioStream.pipe(ffmpeg.stdin);

        ffmpeg.on("error", async (err) => {
          console.error("ffmpeg spawn error:", err && err.message);
          await unsendProcessing(processingMessage);
          try { await message.reply("❌ ffmpeg error while converting audio."); } catch (_) {}
        });

        ffmpeg.on("close", async (code) => {
          if (code !== 0) {
            console.error("ffmpeg exited with code", code);
            await unsendProcessing(processingMessage);
            try { await message.reply("❌ ffmpeg failed to convert audio."); } catch (_) {}
            // cleanup possibly incomplete file
            try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
            return;
          }
          // send file
          try {
            await message.reply({
              attachment: fs.createReadStream(outPath),
              body: `✨ Title: ${info.videoDetails.title}\n\n🎧 Here is your audio.`
            }, () => {
              // remove file after sending if you prefer ephemeral storage
              try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
              unsendProcessing(processingMessage);
            });
          } catch (e) {
            console.error("Error sending audio file:", e && e.message);
            await unsendProcessing(processingMessage);
            try { await message.reply("❌ Failed to send audio file."); } catch (_) {}
            try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
          }
        });

      } else {
        // mode === "video": download video with ytdl to file
        const videoStream = ytdl(videoId, { quality: "highestvideo" });

        const fileWriter = fs.createWriteStream(outPath);
        videoStream.pipe(fileWriter);

        let finished = false;

        fileWriter.on("finish", async () => {
          finished = true;
          try {
            await message.reply({
              attachment: fs.createReadStream(outPath),
              body: `✨ Title: ${info.videoDetails.title}\n\n🎬 Here is your video.`
            }, () => {
              try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
              unsendProcessing(processingMessage);
            });
          } catch (e) {
            console.error("Error sending video file:", e && e.message);
            await unsendProcessing(processingMessage);
            try { await message.reply("❌ Failed to send video file."); } catch (_) {}
            try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
          }
        });

        fileWriter.on("error", async (err) => {
          console.error("File write error:", err && err.message);
          try { videoStream.destroy(); } catch (_) {}
          try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
          await unsendProcessing(processingMessage);
          try { await message.reply("❌ Failed to download video."); } catch (_) {}
        });

        videoStream.on("error", async (err) => {
          console.error("ytdl stream error:", err && err.message);
          if (!finished) {
            try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
            await unsendProcessing(processingMessage);
            try { await message.reply("❌ Error while downloading video stream."); } catch (_) {}
          }
        });
      }

    } catch (err) {
      console.error("mu-sing error:", err && (err.stack || err.message || err));
      try { await message.reply(`❌ Error: ${err && err.message ? err.message : "Unknown error"}`); } catch (_) {}
    }
  }
};
