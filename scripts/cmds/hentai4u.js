// scripts/cmds/hentai4u.js
// Defensive version — avoids top-level require for optional packages so module load won't crash
// Make sure to `npm install axios cheerio` in your project root before running.

module.exports = {
  config: {
    name: "hentai4u",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "adult",
    shortDescription: { en: "Get random hentai videos (SFW/NSFW depends on source)" },
    longDescription: { en: "Fetches random hentai videos from a source site" },
    guide: { en: "{p}hentai4u" },
    dependencies: { axios: "", cheerio: "" }
  },

  onStart: async function ({ message, event }) {
    // Load optional deps at runtime — prevents module from crashing at require-time
    let axios, cheerio;
    try {
      axios = require('axios');
    } catch (e) {
      console.error('Missing dependency: axios', e && e.message);
      try { await message.reply('❌ Dependency missing: please run `npm install axios` in the bot project.'); } catch(_) {}
      return;
    }

    try {
      // use dynamic import if require fails (some environments have ESM builds)
      try {
        cheerio = require('cheerio');
      } catch (requireErr) {
        // try dynamic import (works in many Node setups)
        try {
          const mod = await import('cheerio');
          cheerio = mod && (mod.default || mod);
        } catch (importErr) {
          console.error('Missing dependency: cheerio', importErr && importErr.message);
          try { await message.reply('❌ Dependency missing: please run `npm install cheerio` in the bot project.'); } catch(_) {}
          return;
        }
      }
    } catch (e) {
      console.error('Error loading cheerio:', e && e.message);
      try { await message.reply('❌ Error loading parser dependency.'); } catch(_) {}
      return;
    }

    // Utility: sleep
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // Helper: fetch & parse a random page, return array of video objects
    async function getHentaiVideosOnce() {
      const page = Math.floor(Math.random() * 1153) + 1; // 1..1153
      const url = `https://sfmcompile.club/page/${page}`;
      console.log(`Fetching page ${page} → ${url}`);

      const res = await axios.get(url, {
        timeout: 30_000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://sfmcompile.club/'
        }
      });

      if (!res || !res.data) throw new Error('No HTML returned from target site.');

      const $ = cheerio.load(res.data);
      const results = [];

      $('#primary > div > div > ul > li > article').each((i, el) => {
        try {
          const $el = $(el);
          const title = $el.find('header > h2').text().trim();
          const link = $el.find('header > h2 > a').attr('href') || '';
          const category = $el.find('header > div.entry-before-title > span > span').text().replace('in ', '').trim() || '';
          const share_count = $el.find('header > div.entry-after-title > p > span.entry-shares').text().trim() || '0';
          const views_count = $el.find('header > div.entry-after-title > p > span.entry-views').text().trim() || '0';
          // some pages put <source src="..."> or <img data-src="...">
          const sourceTag = $el.find('source');
          const video_1 = (sourceTag && sourceTag.attr && sourceTag.attr('src')) ||
                          $el.find('img').attr('data-src') ||
                          $el.find('img').attr('src') ||
                          '';
          const video_2 = $el.find('video > a').attr('href') || '';

          if (video_1 && (video_1.includes('.mp4') || video_1.includes('.webm') || /video/i.test(video_1))) {
            results.push({
              title: title || 'Untitled',
              link,
              category: category || 'Uncategorized',
              share_count,
              views_count,
              video_1,
              video_2
            });
          }
        } catch (inner) {
          // ignore element parse errors
          console.warn('Parse element error:', inner && inner.message);
        }
      });

      return results;
    }

    // Main flow
    try {
      const processingMsg = (message && typeof message.reply === 'function') ? await message.reply('🔄 Fetching hentai videos...') : null;

      let videos = [];
      const maxAttempts = 3;
      let attempts = 0;
      while ((!videos || videos.length === 0) && attempts < maxAttempts) {
        attempts++;
        try {
          videos = await getHentaiVideosOnce();
          if (!videos || videos.length === 0) {
            console.log(`No videos found on attempt ${attempts}.`);
            await sleep(1000);
          }
        } catch (err) {
          console.error(`Attempt ${attempts} failed:`, err && err.message);
          await sleep(1500);
        }
      }

      if (!videos || videos.length === 0) {
        if (processingMsg && processingMsg.messageID && typeof message.unsendMessage === 'function') {
          try { await message.unsendMessage(processingMsg.messageID); } catch(_) {}
        }
        return message.reply('❌ No videos found. Please try again later.');
      }

      // pick up to 10 candidates then randomize
      const pool = videos.slice(0, Math.min(10, videos.length));
      const idx = Math.floor(Math.random() * pool.length);
      const selected = pool[idx];

      if (!selected || !selected.video_1) {
        if (processingMsg && processingMsg.messageID && typeof message.unsendMessage === 'function') {
          try { await message.unsendMessage(processingMsg.messageID); } catch(_) {}
        }
        return message.reply('❌ No valid video URL found. Try again.');
      }

      console.log('Selected video:', selected.title, selected.video_1);

      // Attempt to get stream using your global helper if present; otherwise try to send URL directly
      try {
        let stream;
        if (global && global.utils && typeof global.utils.getStreamFromURL === 'function') {
          stream = await global.utils.getStreamFromURL(selected.video_1);
        }

        if (stream) {
          await message.reply({
            body: `🎬 Title: ${selected.title}\n📁 Category: ${selected.category}\n👁️ Views: ${selected.views_count}\n🔄 Shares: ${selected.share_count}`,
            attachment: stream
          });
        } else {
          // fall back to sending direct URL (many bot frameworks will auto-embed)
          await message.reply(`🎬 Title: ${selected.title}\n📁 Category: ${selected.category}\n📎 Video: ${selected.video_1}`);
        }

        if (processingMsg && processingMsg.messageID && typeof message.unsendMessage === 'function') {
          try { await message.unsendMessage(processingMsg.messageID); } catch(_) {}
        }

      } catch (sendErr) {
        console.error('Error sending video:', sendErr && sendErr.message);
        if (processingMsg && processingMsg.messageID && typeof message.unsendMessage === 'function') {
          try { await message.unsendMessage(processingMsg.messageID); } catch(_) {}
        }

        // try alternative URL if available
        if (selected.video_2) {
          try {
            let altStream;
            if (global && global.utils && typeof global.utils.getStreamFromURL === 'function') {
              altStream = await global.utils.getStreamFromURL(selected.video_2);
            }
            if (altStream) {
              return await message.reply({
                body: `🎬 Title: ${selected.title}\n📁 Category: ${selected.category}\n(Alternative source)`,
                attachment: altStream
              });
            } else {
              return await message.reply(`🎬 Title: ${selected.title}\n📁 Category: ${selected.category}\n📎 Video: ${selected.video_2}`);
            }
          } catch (altErr) {
            console.error('Alt send failed:', altErr && altErr.message);
          }
        }

        return await message.reply('❌ Failed to load video. Please try again later.');
      }

    } catch (err) {
      console.error('Hentai4u main error:', err && (err.stack || err.message || err));
      try { await message.reply('❌ Error fetching or sending hentai video. Please try again later.'); } catch(_) {}
      return;
    }
  } // end onStart
}; // end module.exports
