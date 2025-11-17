// scripts/cmds/soundcloud.js (fixed)
// Avoids top-level cheerio require to prevent MODULE_NOT_FOUND at startup.
// Loads cheerio at runtime with require() -> dynamic import() fallback.

const axios = require('axios');
const fs = require('fs-extra');
const moment = require('moment-timezone');
const path = require('path');

const CACHE_DIR = path.join(__dirname, 'cache');
fs.ensureDirSync(CACHE_DIR);

async function safeLoadCheerio() {
  try {
    return require('cheerio');
  } catch (reqErr) {
    try {
      const mod = await import('cheerio');
      return mod && (mod.default || mod);
    } catch (impErr) {
      throw new Error('cheerio not available. Please run: npm install cheerio');
    }
  }
}

async function soundcloudDownload(url) {
  // load cheerio at runtime
  const cheerio = await safeLoadCheerio();

  // first, fetch the converter page to obtain token (site-specific; may change)
  const res = await axios.get('https://soundcloudmp3.org/id', {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'text/html'
    },
    timeout: 20000
  });

  const $ = cheerio.load(res.data);
  // find hidden token input robustly
  const tokenInput = $('form#conversionForm input[type=hidden]').first();
  const _token = tokenInput.attr('value') || tokenInput.attr('name') || '';

  // post conversion request (site-specific)
  const form = new URLSearchParams();
  form.append('_token', _token);
  form.append('url', url);

  const conver = await axios.post('https://soundcloudmp3.org/converter', form.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: Array.isArray(res.headers['set-cookie']) ? res.headers['set-cookie'].join('; ') : (res.headers['set-cookie'] || ''),
      'User-Agent': 'Mozilla/5.0',
      Accept: 'text/html'
    },
    timeout: 30000
  });

  const $$ = cheerio.load(conver.data);

  // try to extract fields carefully
  const thumb = $$('div.info.clearfix img').attr('src') || $$('div.info.clearfix img').attr('data-src') || '';
  const title = $$('div.info.clearfix p').filter((i, el) => $$(el).text().toLowerCase().includes('title')).text().replace(/Title:/i, '').trim() || $$('title').text().trim() || 'soundcloud';
  const duration = $$('div.info.clearfix p').filter((i, el) => $$(el).text().toLowerCase().includes('length') || $$(el).text().toLowerCase().includes('duration')).text().replace(/Length:|Minutes/gi, '').trim() || '';
  const quality = $$('div.info.clearfix p').filter((i, el) => $$(el).text().toLowerCase().includes('quality')).text().replace(/Quality:/i, '').trim() || '';
  // download link - try few selectors
  let downloadUrl = $$('a#download-btn').attr('href') || $$('a[data-download]').attr('href') || $$('a').filter((i, el) => $$(el).text().toLowerCase().includes('download')).attr('href') || '';

  // if downloadUrl is relative, make absolute based on site
  if (downloadUrl && downloadUrl.startsWith('/')) {
    const base = (new URL('https://soundcloudmp3.org')).origin;
    downloadUrl = base + downloadUrl;
  }

  if (!downloadUrl) {
    // maybe the converter responded with JSON or meta; try to find any link in page
    const linkCandidate = $$('a').map((i, el) => $$(el).attr('href')).get().find(h => h && h.includes('download'));
    downloadUrl = linkCandidate || '';
  }

  return {
    thumb,
    title,
    duration,
    quality,
    url: downloadUrl
  };
}

module.exports = {
  config: {
    name: "soundcloud",
    version: "1.0.1",
    author: "fixed-by-assistant",
    role: 0,
    category: "utility",
    shortDescription: { en: "Search and download music from SoundCloud (best-effort)" },
    longDescription: { en: "Find and download music from SoundCloud using a converter site (site behavior may change)." },
    guide: { en: "{p}soundcloud <search query or full SoundCloud URL>" },
    countDown: 5,
    dependencies: { axios: "", "fs-extra": "", "moment-timezone": "" } // cheerio is loaded at runtime
  },

  onStart: async function({ message, event, args }) {
    const query = args.join(' ').trim();
    if (!query) return message.reply("⚠️ Please enter a search query or paste a SoundCloud track URL.");

    const headers = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    };

    try {
      // If user provided a full SoundCloud URL, skip search and use it directly
      let trackUrl = '';
      if (/^https?:\/\/(www\.)?soundcloud\.com\/.+/i.test(query)) {
        trackUrl = query;
      } else {
        // do a lightweight mobile search and parse top results (cheerio runtime load)
        const cheerio = await safeLoadCheerio();
        const searchResp = await axios.get(`https://m.soundcloud.com/search?q=${encodeURIComponent(query)}`, { headers, timeout: 20000 });
        const $ = cheerio.load(searchResp.data);
        const first = $('div > ul > li > div').first();
        const href = first.find('a').attr('href') || '';
        if (!href) {
          return message.reply(`❎ No results found for: "${query}"`);
        }
        trackUrl = 'https://soundcloud.com' + href;
      }

      // Inform user
      const processing = await message.reply("🔎 Searching and preparing SoundCloud download — please wait...");

      // fetch download info via converter
      let info;
      try {
        info = await soundcloudDownload(trackUrl);
      } catch (err) {
        console.error("soundcloudDownload error:", err && (err.stack || err.message || err));
        await message.unsend?.(processing.messageID).catch(()=>{});
        return message.reply("❎ Failed to retrieve download info. The converter site may be down or blocked. Try again later.");
      }

      if (!info || !info.url) {
        await message.unsend?.(processing.messageID).catch(()=>{});
        return message.reply("❎ Could not find a direct download link for this track.");
      }

      // download audio binary
      let downloadBuf;
      try {
        const dlResp = await axios.get(info.url, { responseType: 'arraybuffer', timeout: 60000 });
        downloadBuf = Buffer.from(dlResp.data);
      } catch (err) {
        console.error("Download fetch error:", err && (err.stack || err.message || err));
        await message.unsend?.(processing.messageID).catch(()=>{});
        return message.reply("❎ Failed to download audio from converter link.");
      }

      // save temporary file
      const safeName = (info.title || 'soundcloud').replace(/[^\w\- ]+/g, '').substring(0, 60).trim() || 'soundcloud';
      const tmpPath = path.join(CACHE_DIR, `${Date.now()}_${safeName}.mp3`);
      try {
        fs.writeFileSync(tmpPath, downloadBuf);
      } catch (err) {
        console.error("File write error:", err && err.message);
        await message.unsend?.(processing.messageID).catch(()=>{});
        return message.reply("❎ Failed to save downloaded file.");
      }

      // send message with attachment and metadata
      const body = `[ SOUND-CLOUD - MP3 ]\nTitle: ${info.title || 'Unknown'}\nArtist/Info: ${info.quality || ''}\nDuration: ${info.duration || ''}\nDownloaded at: ${moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss")}`;

      try {
        await message.reply({ body, attachment: fs.createReadStream(tmpPath) });
      } catch (err) {
        console.error("Send message error:", err && err.message);
        // fallback: send text with direct link
        await message.reply(`${body}\n\nDirect link: ${info.url}`);
      } finally {
        // cleanup temp file after short delay to ensure send completed
        setTimeout(() => {
          try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch (_) {}
        }, 30 * 1000);
        await message.unsend?.(processing.messageID).catch(()=>{});
      }

    } catch (err) {
      console.error("soundcloud command error:", err && (err.stack || err.message || err));
      try { await message.reply("❎ An unexpected error occurred while processing your request."); } catch (_) {}
    }
  },

  // Minimal handleReply support is omitted here; you can add it if you need interactive selection.
};
