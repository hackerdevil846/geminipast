// scripts/cmds/music.js
// Defensive music command: supports search or direct YouTube link, playlist and single video, audio (mp3) or video (mp4).
// Loads yt-search at runtime to avoid cheerio/ESM MODULE_NOT_FOUND at module load-time.

const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const ytdl = require("ytdl-core");
const axios = require("axios");

const CACHE_DIR = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

module.exports = {
  config: {
    name: "music",
    aliases: [],
    version: "1.2.0",
    role: 0,
    author: "fixed-by-assistant",
    shortDescription: { en: "Download YouTube audio/video or playlist (safe)" },
    longDescription: { en: "Search YouTube by keyword or use a direct link; supports playlists." },
    category: "media",
    guide: { en: "{p}music <keyword|youtube_url|playlist_url> [audio|video]" },
    countDown: 15,
    dependencies: {
      "ytdl-core": "",
      "axios": "",
      "yt-search": "",
      "fs-extra": "",
      "ffmpeg-static": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    // Load yt-search lazily (safe): try require -> dynamic import -> null
    let ytSearch = null;
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

    // Helper to safely unsend processing messages (framework differences)
    async function safeUnsend(procMsg) {
      if (!procMsg) return;
      try {
        if (typeof message.unsend === "function") await message.unsend(procMsg.messageID || procMsg.messageId || procMsg.id);
        else if (typeof message.unsendMessage === "function") await message.unsendMessage(procMsg.messageID || procMsg.messageId || procMsg.id);
      } catch (e) { /* ignore */ }
    }

    // Validate deps that are required for functionality
    if (!ytdl) {
      return message.reply("❌ Required dependency missing: ytdl-core. Run `npm install ytdl-core` and restart.");
    }

    // Parse args and mode
    try {
      if (!Array.isArray(args)) args = [];
      let mode = "audio";
      if (args.length > 0) {
        const last = args[args.length - 1].toLowerCase();
        if (last === "audio" || last === "video") {
          mode = last;
          args.pop();
        }
      }
      const query = args.join(" ").trim();
      if (!query) return message.reply("❔ Provide a search keyword or YouTube/playlist link. Example:\nmusic despacito audio\nmusic https://youtu.be/xxx video");

      // Send processing message
      const procMsg = await message.reply("🔎 Searching / preparing your request — please wait...");

      // Detect playlist
      const playlistMatch = query.match(/[?&]list=([^&]+)/i);
      const isPlaylist = Boolean(playlistMatch);

      if (isPlaylist) {
        // If playlist, we attempt to fetch playlist videos using ytSearch if available, otherwise try external API
        const playlistId = playlistMatch[1];
        let videos = null;

        if (ytSearch && typeof ytSearch === "function") {
          try {
            const res = await ytSearch({ listId: playlistId });
            videos = (res && res.videos) || (res && res.playlist && res.playlist.videos) || null;
          } catch (e) {
            console.warn("yt-search playlist fetch failed:", e && e.message);
            videos = null;
          }
        }

        if (!videos) {
          // Fallback: try a simple RapidAPI endpoint (optional) or bail
          try {
            const resp = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
              params: { part: "snippet", maxResults: 50, playlistId, key: process.env.YT_API_KEY || "" },
              timeout: 15000
            });
            const items = resp.data.items || [];
            videos = items.map(i => ({ videoId: i.snippet.resourceId.videoId, title: i.snippet.title }));
          } catch (e) {
            console.warn("playlist fallback failed:", e && e.message);
          }
        }

        if (!videos || videos.length === 0) {
          await safeUnsend(procMsg);
          return message.reply("❌ Failed to fetch playlist videos (yt-search not available and fallback failed).");
        }

        // limit how many to download to avoid abuse
        const MAX = 5;
        const pick = videos.slice(0, MAX);

        await safeUnsend(procMsg);
        await message.reply(`📼 Found playlist with ${videos.length} items. Downloading first ${pick.length} as ${mode}...`);

        for (let i = 0; i < pick.length; i++) {
          const video = pick[i];
          const vidId = video.videoId || video.id || video.videoId;
          if (!vidId) { await message.reply(`⚠️ Skipping item ${i+1}, missing id.`); continue; }

          try {
            const info = await ytdl.getInfo(vidId);
            const title = (info.videoDetails && info.videoDetails.title) || (video.title || `video_${vidId}`);
            const safe = title.replace(/[/\\?%*:|"<>]/g, "-").substring(0, 80);
            const ext = mode === "audio" ? "mp3" : "mp4";
            const outPath = path.join(CACHE_DIR, `${safe}_${Date.now()}.${ext}`);

            await downloadAndSave(vidId, outPath, mode);
            await message.reply({ body: `🎵 [${i+1}/${pick.length}] ${title}`, attachment: fs.createReadStream(outPath) });
            try { fs.unlinkSync(outPath); } catch (e) {}
          } catch (err) {
            console.error("Playlist item error:", err && (err.stack || err.message || err));
            await message.reply(`❌ Failed to process playlist item #${i+1}: ${err && err.message || "unknown"}`);
          }
        }

        return;
      }

      // Single-video flow (search or direct link)
      let videoId;
      if (ytdl.validateURL(query)) {
        videoId = ytdl.getURLVideoID(query);
      } else {
        if (!ytSearch) {
          await safeUnsend(procMsg);
          return message.reply("❌ Searching requires 'yt-search' package. Install with `npm install yt-search` or provide a direct YouTube link.");
        }
        // do a keyword search
        const r = await ytSearch(query);
        const top = (r && r.videos && r.videos[0]) || null;
        if (!top) {
          await safeUnsend(procMsg);
          return message.reply("❌ No search results found.");
        }
        videoId = top.videoId || top.videoId;
      }

      // fetch info
      let info;
      try {
        info = await ytdl.getInfo(videoId);
      } catch (e) {
        console.error("ytdl.getInfo failed:", e && e.message);
        await safeUnsend(procMsg);
        return message.reply("❌ Failed to get video info from YouTube.");
      }

      const title = (info.videoDetails && info.videoDetails.title) ? info.videoDetails.title : `youtube_${videoId}`;
      const safeTitle = title.replace(/[/\\?%*:|"<>]/g, "-").substring(0, 80);
      const ext = mode === "audio" ? "mp3" : "mp4";
      const outPath = path.join(CACHE_DIR, `${safeTitle}_${Date.now()}.${ext}`);

      await safeUnsend(procMsg);
      await message.reply(`⬇️ Downloading ${mode} — "${title}"`);

      await downloadAndSave(videoId, outPath, mode);

      await message.reply({ body: `🎵 Title: ${title}`, attachment: fs.createReadStream(outPath) });
      try { fs.unlinkSync(outPath); } catch (e) {}

      // helper: download and save (audio or video)
      async function downloadAndSave(videoId, outPath, mode) {
        // audio: use ytdl + ffmpeg if you want mp3 conversion, otherwise save stream as webm/opus
        if (mode === "audio") {
          // Try to convert to mp3 using ffmpeg-static if available, otherwise save highest audio stream
          let ffmpegPath = null;
          try { ffmpegPath = require("ffmpeg-static"); } catch (_) { ffmpegPath = null; }

          if (ffmpegPath) {
            // stream -> ffmpeg -> file
            const ffmpeg = require("child_process").spawn(ffmpegPath, [
              "-y",
              "-i", "pipe:0",
              "-vn",
              "-acodec", "libmp3lame",
              "-ab", "192k",
              "-f", "mp3",
              outPath
            ], { stdio: ["pipe", "ignore", "inherit"] });

            const audioStream = ytdl(videoId, { quality: "highestaudio" });
            audioStream.pipe(ffmpeg.stdin);

            return new Promise((resolve, reject) => {
              ffmpeg.on("error", (err) => { reject(err); });
              ffmpeg.on("close", (code) => {
                if (code !== 0) return reject(new Error("ffmpeg exited with code " + code));
                resolve();
              });
            });
          } else {
            // fallback: save audio stream as webm (no conversion)
            return new Promise((resolve, reject) => {
              const stream = ytdl(videoId, { quality: "highestaudio" });
              const writer = fs.createWriteStream(outPath);
              stream.pipe(writer);
              writer.on("finish", resolve);
              writer.on("error", reject);
              stream.on("error", reject);
            });
          }
        } else {
          // video mode: download highest video+audio
          return new Promise((resolve, reject) => {
            const stream = ytdl(videoId, { quality: "highestvideo" });
            const writer = fs.createWriteStream(outPath);
            stream.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
            stream.on("error", reject);
          });
        }
      }

    } catch (err) {
      console.error("music command error:", err && (err.stack || err.message || err));
      try { await message.reply("❌ An unexpected error occurred: " + (err.message || "unknown")); } catch (_) {}
    }
  }
};
