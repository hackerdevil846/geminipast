// scripts/cmds/video.js (fixed, defensive)
// Avoids top-level require of yt-search to prevent cheerio/ESM MODULE_NOT_FOUND
// Adds timeouts, safer fallbacks, and robust error handling.

const axios = require("axios");

// load base API once (still safe)
async function baseApiUrl() {
  try {
    const base = await axios.get('https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json', { timeout: 10000 });
    return base.data && base.data.api ? base.data.api : null;
  } catch (e) {
    console.warn("baseApiUrl fetch failed:", e && e.message);
    return null;
  }
}

(async () => {
  try {
    const apiUrl = await baseApiUrl();
    if (apiUrl) global.apis = { ...(global.apis || {}), diptoApi: apiUrl };
    else global.apis = { ...(global.apis || {}), diptoApi: "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json" };
  } catch (e) {
    global.apis = { ...(global.apis || {}), diptoApi: "" };
  }
})();

// getStreamFromURL helper (keeps your original)
async function getStreamFromURL(url, pathName) {
  try {
    const response = await axios.get(url, { responseType: "stream", timeout: 30000 });
    response.data.path = pathName;
    return response.data;
  } catch (err) {
    throw new Error("Failed to get stream from URL.");
  }
}
global.utils = { ...(global.utils || {}), getStreamFromURL: global.utils?.getStreamFromURL || getStreamFromURL };

// safe runtime loader for yt-search (avoids load-time crash if it pulls cheerio)
async function safeLoadYtSearch() {
  try {
    return require("yt-search");
  } catch (reqErr) {
    try {
      const mod = await import("yt-search");
      return mod && (mod.default || mod);
    } catch (impErr) {
      return null;
    }
  }
}

// utility: extract YouTube ID (keeps original regex)
function getVideoID(url) {
  const regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

module.exports = {
  config: {
    name: "video",
    aliases: [],
    version: "1.1.1",
    author: "fixed-by-assistant",
    role: 0,
    category: "media",
    shortDescription: { en: "YouTube video download via URL or search (defensive)" },
    longDescription: { en: "Download YouTube videos by URL or search query. If yt-search isn't available, require a direct YouTube URL." },
    guide: { en: "{p}video [URL or search query]" },
    countDown: 5,
    dependencies: { axios: "", "yt-search": "" }
  },

  onStart: async function ({ api, event, args, message }) {
    // runtime load of yt-search
    const yts = await safeLoadYtSearch();

    // helper to unsend processing message (framework differences)
    async function safeUnsend(msg) {
      if (!msg) return;
      try {
        if (typeof api.unsendMessage === "function") await api.unsendMessage(msg.messageID || msg.messageId || msg.id);
        else if (typeof message.unsend === "function") await message.unsend(msg.messageID || msg.messageId || msg.id);
      } catch (_) { /* ignore */ }
    }

    try {
      let videoID = null;
      const urlArg = args[0];

      // if user provided a YouTube URL, extract ID
      if (urlArg && (urlArg.includes("youtube.com") || urlArg.includes("youtu.be"))) {
        videoID = getVideoID(urlArg);
        if (!videoID) {
          return message.reply("❌ Invalid YouTube URL provided!");
        }
      } else {
        // no URL: need search support
        const query = args.join(" ").trim();
        if (!query) return message.reply("❌ Please provide a YouTube URL or search query!");

        // If yt-search unavailable, inform user to provide URL
        if (!yts) {
          return message.reply("❌ Search functionality requires the 'yt-search' package. Provide a YouTube URL instead or install yt-search.");
        }

        const processingMsg = await message.reply(`🔍 Searching: "${query}"`);
        try {
          const r = await yts(query);
          const videos = (r && r.videos) ? r.videos.slice(0, 30) : [];
          if (!videos || videos.length === 0) {
            await safeUnsend(processingMsg);
            return message.reply("❌ No videos found for your search query!");
          }
          const selected = videos[Math.floor(Math.random() * videos.length)];
          videoID = selected.videoId;
          await safeUnsend(processingMsg);
        } catch (searchErr) {
          await safeUnsend(processingMsg);
          console.error("yt-search error:", searchErr && (searchErr.stack || searchErr.message || searchErr));
          return message.reply("❌ Search failed (yt-search error). Provide a YouTube URL or install yt-search.");
        }
      }

      // Ensure we have diptoApi configured
      const diptoApi = global.apis?.diptoApi || process.env.DIPTO_API || null;
      if (!diptoApi) {
        // best-effort: inform user
        return message.reply("❌ Video API not configured (diptoApi missing). Please set global.apis.diptoApi or env DIPTO_API.");
      }

      // call remote API to get download link
      let apiResp;
      try {
        const url = `${diptoApi.replace(/\/$/, "")}/ytDl3?link=${encodeURIComponent(videoID)}&format=mp4`;
        apiResp = await axios.get(url, { timeout: 20000 });
      } catch (err) {
        console.error("API request failed:", err && (err.stack || err.message || err));
        return message.reply("⚠️ Error: Failed to fetch download link from API.");
      }

      const data = apiResp && apiResp.data ? apiResp.data : null;
      if (!data || !data.downloadLink) {
        console.error("Invalid API response:", data);
        return message.reply("⚠️ Error: API did not return a download link.");
      }

      const { title = "video", quality = "unknown", downloadLink } = data;

      // shorten download link (best-effort)
      let shortenedLink = downloadLink;
      try {
        const tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`, { timeout: 8000 });
        if (tiny && tiny.data) shortenedLink = tiny.data;
      } catch (_) {
        // ignore shorten failure, use original
      }

      // prepare stream (use your global utils helper)
      let stream;
      try {
        stream = await global.utils.getStreamFromURL(downloadLink, `${title}.mp4`);
      } catch (err) {
        console.error("getStreamFromURL failed:", err && err.message);
        // fallback: reply with text link
        return message.reply({
          body: `🎬 Title: ${title}\n📺 Quality: ${quality}\n📥 Download: ${shortenedLink}`
        });
      }

      // send file with caption
      try {
        await message.reply({
          body: `🎬 Title: ${title}\n📺 Quality: ${quality}\n📥 Download: ${shortenedLink}`,
          attachment: stream
        });
      } catch (sendErr) {
        console.error("Sending stream failed:", sendErr && sendErr.message);
        // fallback: give link
        return message.reply(`🎬 Title: ${title}\n📥 Download: ${shortenedLink}`);
      }

    } catch (err) {
      console.error("Video command error:", err && (err.stack || err.message || err));
      try { return message.reply("⚠️ Error: " + (err.message || "An unexpected error occurred.")); } catch (_) {}
    }
  }
};
