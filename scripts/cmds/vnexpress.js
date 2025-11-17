// scripts/cmds/vnexpress.js
// Fixed: load cheerio at runtime to avoid MODULE_NOT_FOUND at startup.
// Adds timeouts, defensive parsing, and helpful error messages.

const axios = require('axios');

async function safeLoadCheerio() {
  try {
    return require('cheerio');
  } catch (reqErr) {
    try {
      const mod = await import('cheerio');
      return mod && (mod.default || mod);
    } catch (impErr) {
      // rethrow a clear error so caller can inform admin to install cheerio
      const e = new Error('cheerio not available. Please run: npm install cheerio');
      e.code = 'MISSING_CHEERIO';
      throw e;
    }
  }
}

module.exports = {
  config: {
    name: "vnexpress",
    aliases: ["vnex"],
    version: "1.0.3",
    author: "fixed-by-assistant",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Get latest news from VNExpress" },
    longDescription: { en: "Fetches and displays latest news articles from VNExpress.net (best-effort)" },
    category: "utility",
    guide: { en: "{p}vnexpress" }
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;
    try {
      // Load cheerio at runtime (avoids startup crash)
      const cheerio = await safeLoadCheerio();

      // Fetch page with reasonable timeout
      const resp = await axios.get('https://vnexpress.net/tin-tuc-24h', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        timeout: 15000
      });

      if (!resp || resp.status !== 200 || !resp.data) {
        return api.sendMessage("❌ Failed to fetch VNExpress (empty response). Try again later.", threadID, messageID);
      }

      const $ = cheerio.load(resp.data);

      // Try several selectors to be tolerant to VNExpress layout changes
      const articles = [];

      // Common VNExpress blocks: article-list or .item-news
      // We'll search for several patterns and collect up to 5 unique articles
      const pickCandidates = [];

      // pattern 1: .item-news
      $('.item-news').each((i, el) => {
        pickCandidates.push(el);
      });

      // pattern 2: article h3 / .title-news
      $('article').each((i, el) => {
        pickCandidates.push(el);
      });

      // pattern 3: any .news-item like structures
      $('.news-item, .list-news__item, .box-news__content').each((i, el) => {
        pickCandidates.push(el);
      });

      // Use a Set to avoid duplicate hrefs
      const seen = new Set();

      for (const el of pickCandidates) {
        if (articles.length >= 5) break;
        try {
          const el$ = $(el);
          // try multiple ways to find title/link/desc/time
          let title = el$.find('.title-news a').attr('title') || el$.find('h3 a').attr('title') || el$.find('a').attr('title') || el$.find('h3').text();
          title = (title || '').trim();

          let href = el$.find('.title-news a').attr('href') || el$.find('h3 a').attr('href') || el$.find('a').attr('href') || '';
          href = (href || '').trim();

          if (!href) continue;
          // normalize link
          if (!href.startsWith('http')) {
            try { href = new URL(href, 'https://vnexpress.net').href; } catch (e) {}
          }

          if (seen.has(href)) continue;
          seen.add(href);

          let description = el$.find('.description a').text() || el$.find('p.description').text() || el$.find('.lead').text() || '';
          description = (description || '').trim();

          let time = el$.find('.time-count').text() || el$.find('span.time').text() || el$.find('time').attr('datetime') || '';
          time = (time || '').trim();

          // Fallback: fetch article page to get meta description/time (best-effort, but avoid many requests)
          if (!description || description.length < 10) {
            // do not fetch more than necessary: only for first 2 items to improve quality
            if (articles.length < 2) {
              try {
                const aresp = await axios.get(href, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });
                const $$ = cheerio.load(aresp.data);
                const metaDesc = $$('meta[name="description"]').attr('content') || $$('meta[property="og:description"]').attr('content') || '';
                description = description || (metaDesc || '').trim();
                time = time || ($$('time').first().attr('datetime') || '').trim();
              } catch (_) {
                // ignore fetch errors for individual article
              }
            }
          }

          if (title && href) {
            articles.push({
              title: title || 'No title',
              link: href,
              description: description || 'No description available',
              time: time || 'Recent'
            });
          }
        } catch (e) {
          // continue on parse errors
          continue;
        }
      }

      if (!articles.length) {
        return api.sendMessage("❌ No news articles found on VNExpress (layout might have changed).", threadID, messageID);
      }

      // Format message
      let msg = "📰 LATEST VNEXPRESS NEWS 📰\n\n";
      articles.slice(0,5).forEach((a, idx) => {
        msg += `📖 Article ${idx + 1}:\n`;
        msg += `⏰ Time: ${a.time}\n`;
        msg += `📋 Title: ${a.title}\n`;
        msg += `📝 Description: ${a.description}\n`;
        msg += `🔗 Link: ${a.link}\n`;
        msg += `──────────────────\n\n`;
      });
      msg += "Stay updated with the latest news! 📡";

      api.sendMessage(msg, threadID, messageID);

    } catch (err) {
      // Provide clear instruction if cheerio missing
      if (err && err.code === 'MISSING_CHEERIO') {
        console.error("vnexpress startup error (cheerio):", err.message);
        return api.sendMessage("❌ Parser dependency missing. Please run: `npm install cheerio` in your project and restart the bot.", threadID, messageID);
      }

      console.error("VNExpress news error:", err && (err.stack || err.message || err));
      try {
        api.sendMessage("❌ An error occurred while fetching VNExpress news. Try again later.", threadID, messageID);
      } catch (_) { /* ignore */ }
    }
  }
};
