// scripts/cmds/music-play.js
// Safe and defensive music downloader: supports search or direct YouTube link, audio/mp3 or video/mp4
// Loads yt-search at runtime to avoid cheerio MODULE_NOT_FOUND at module load time.

const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "music-play",
    aliases: [],
    version: "1.0.6",
    role: 0,
    author: "fixed-by-assistant",
    shortDescription: { en: "Download YouTube audio/video by keyword or link" },
    longDescription: { en: "Search YouTube by keyword or use a YouTube link and download audio (mp3) or video (mp4)." },
    category: "media",
    guide: { en: "{p}music-play <keyword|youtube_url> [audio|video]" },
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
      // load yt-search safely (may pull cheerio)
      try {
        ytSearch = require("yt-search");
      } catch (reqErr) {
        // fallback to dynamic import if the package is ESM-only in this environment
        try {
          const mod = await import("yt-search");
          ytSearch = mod && (mod.default || mod);
        } catch (impErr) {
          ytSearch = null; // we'll detect and show a friendly message when needed
        }
      }
    } catch (err) {
      console.error("Missing runtime dependency:", err && err.message);
      return message.reply("❌ Missing dependencies. Run: `npm install ytdl-core ffmpeg-static axios yt-search` in project root.");
    }

    // helper to unsend/cleanup a processing message (framework differences)
    async function unsendProcessing(procMsg) {
      if (!procMsg) return;
      try {
        if (typeof message.unsend === "function") await message.unsend(procMsg.messageID || procMsg.messageId || procMsg.id);
        else if (typeof message.unsendMessage === "function") await message.unsendMessage(procMsg.messageID || procMsg.messageId || procMsg.id);
      } catch (_) { /* ignore */ }
    }

    try {
      if (!Array.isArray(args)) args = [];
      // parse final arg for mode
      let mode = "audio";
      if (args.length > 0) {
        const last = args[args.length - 1].toLowerCase();
        if (last === "audio" || last === "video") {
          mode = last;
          args.pop();
        }
      }
      const query = args.join(" ").trim();
      if (!query) {
        return message.reply("❔ Provide a search keyword or a YouTube link. Example:\nmusic-play despacito audio\nmusic-play https://youtu.be/XXXX video");
      }

      const processingMessage = await message.reply("🔎 Processing your request — please wait...");

      // determine videoId
      let videoId;
      try {
        if (ytdl.validateURL(query)) {
          videoId = ytdl.getURLVideoID(query);
        } else {
          if (!ytSearch) {
            await unsendProcessing(processingMessage);
            return message.reply("❌ Search requires the 'yt-search' package. Install with `npm install yt-search` and restart the bot.");
          }
          const searchResult = await ytSearch(query);
          if (!searchResult || !searchResult.videos || searchResult.videos.length === 0) {
            await unsendProcessing(processingMessage);
            return message.reply("❌ No results found for your query.");
          }
          videoId = searchResult.videos[0].videoId;
          if (!videoId) {
            await unsendProcessing(processingMessage);
            return message.reply("❌ Could not extract a video ID from search results.");
          }
        }
      } catch (e) {
        console.error("Error resolving video ID:", e && e.message);
        await unsendProcessing(processingMessage);
        return message.reply("❌ Error resolving video. Try a different keyword or link.");
      }

      // get info
      let info;
      try {
        info = await ytdl.getInfo(videoId);
      } catch (e) {
        console.error("ytdl.getInfo error:", e && e.message);
        await unsendProcessing(processingMessage);
        return message.reply("❌ Failed to get video info from YouTube.");
      }

      const safeTitle = (info && info.videoDetails && info.videoDetails.title)
        ? info.videoDetails.title.replace(/[/\\?%*:|"<>]/g, "-").substring(0, 100)
        : `youtube_${videoId}`;
      const ext = mode === "audio" ? "mp3" : "mp4";
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const outPath = path.join(cacheDir, `${safeTitle}.${ext}`);

      // if file exists already, send it
      if (fs.existsSync(outPath)) {
        try {
          await message.reply({
            attachment: fs.createReadStream(outPath),
            body: `✨ Title: ${info.videoDetails.title}\n\nHere is your ${mode}.`
          }, () => unsendProcessing(processingMessage));
          return;
        } catch (e) {
          console.warn("Sending cached file failed, will recreate:", e && e.message);
          // fall through to recreate
        }
      }

      if (mode === "audio") {
        // stream audio and run through ffmpeg to create mp3
        const audioStream = ytdl(videoId, { quality: "highestaudio" });

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
          "-b:a", "192k",
          "-f", "mp3",
          outPath
        ], { stdio: ["pipe", "ignore", "inherit"] });

        // pipe the ytdl audio stream to ffmpeg stdin
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
            try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
            return;
          }
          // send file
          try {
            await message.reply({
              attachment: fs.createReadStream(outPath),
              body: `✨ Title: ${info.videoDetails.title}\n\n🎧 Here is your audio.`
            }, () => {
              // remove file after sending (optional)
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

        // handle ytdl stream errors
        audioStream.on("error", async (err) => {
          console.error("ytdl audio stream error:", err && err.message);
          try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
          await unsendProcessing(processingMessage);
          try { await message.reply("❌ Error while downloading audio stream."); } catch (_) {}
        });

      } else {
        // video mode
        const videoStream = ytdl(videoId, { quality: "highestvideo" });
        const writer = fs.createWriteStream(outPath);
        let finished = false;

        videoStream.pipe(writer);

        writer.on("finish", async () => {
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

        writer.on("error", async (err) => {
          console.error("File write error:", err && err.message);
          try { videoStream.destroy(); } catch (_) {}
          try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
          await unsendProcessing(processingMessage);
          try { await message.reply("❌ Failed to download video."); } catch (_) {}
        });

        videoStream.on("error", async (err) => {
          console.error("ytdl video stream error:", err && err.message);
          if (!finished) {
            try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
            await unsendProcessing(processingMessage);
            try { await message.reply("❌ Error while downloading video stream."); } catch (_) {}
          }
        });
      }

    } catch (err) {
      console.error("music-play error:", err && (err.stack || err.message || err));
      try { await message.reply(`❌ Error: ${err && err.message ? err.message : "Unknown error"}`); } catch (_) {}
    }
  }
};
