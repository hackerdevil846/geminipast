// scripts/cmds/moonphase.js
// Defensive version — cheerio loaded at runtime to avoid module-load crashes.

const moment = require("moment-timezone");
const axios = require("axios");
const https = require("https");
const path = require("path");

const agent = new https.Agent({ rejectUnauthorized: false });

module.exports = {
  config: {
    name: "moonphase",
    version: "1.0.1",
    role: 0,
    author: "Asif Mahmud (fixed)",
    category: "utility",
    shortDescription: { en: "View moon image on your birthday" },
    longDescription: { en: "See what the moon looked like on your birth date with details" },
    guide: { en: "moonphase [DD/MM/YYYY] or follow interactive prompts" },
    countDown: 5,
    dependencies: {
      "moment-timezone": "",
      axios: "",
      cheerio: ""
    }
  },

  onStart: async function ({ message, event }) {
    try {
      // Ask for day and register handleReply
      const info = await message.reply("Reply to this message and enter the day of your birth");
      // push to global handler (common pattern)
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID || info.messageId || info.message_id,
        author: event.senderID,
        type: "replyDay",
        date: {}
      });
    } catch (err) {
      console.error("moonphase onStart error:", err && (err.stack || err.message || err));
      try { await message.reply("An error occurred, please try again later."); } catch (_) {}
    }
  },

  handleReply: async function ({ event, handleReply, message }) {
    // Load cheerio at runtime to avoid module load-time crash if it's missing or ESM-only
    let cheerio;
    try {
      cheerio = require("cheerio");
    } catch (reqErr) {
      try {
        const mod = await import("cheerio");
        cheerio = mod && (mod.default || mod);
      } catch (impErr) {
        console.error("Cheerio not available:", reqErr && reqErr.message, impErr && impErr.message);
        try { await message.reply("Parser dependency missing. Please run `npm install cheerio` in the project."); } catch (_) {}
        return;
      }
    }

    try {
      if (handleReply.author !== event.senderID) return;

      const type = handleReply.type;

      if (type === "replyDay") {
        const day = parseInt(event.body, 10);
        if (!Number.isInteger(day) || day < 1 || day > 31) {
          return message.reply("The day you entered is invalid. Please enter a number between 1 and 31.");
        }
        handleReply.date.day = day;
        const info = await message.reply("Reply to this message and enter the month");
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID || info.messageId || info.message_id,
          author: event.senderID,
          type: "replyMonth",
          date: handleReply.date
        });
      } else if (type === "replyMonth") {
        const month = parseInt(event.body, 10);
        if (!Number.isInteger(month) || month < 1 || month > 12) {
          return message.reply("The month you entered is invalid. Please enter a number between 1 and 12.");
        }
        handleReply.date.month = month;
        const info = await message.reply("Reply to this message and enter the year");
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID || info.messageId || info.message_id,
          author: event.senderID,
          type: "done",
          date: handleReply.date
        });
      } else if (type === "done") {
        const year = parseInt(event.body, 10);
        if (!Number.isInteger(year) || year < 1000 || year > 9999) {
          return message.reply("Please enter a valid year (e.g., 1990).");
        }

        const day = handleReply.date.day;
        const month = handleReply.date.month;
        const dateStr = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

        if (!moment(dateStr, "DD/MM/YYYY", true).isValid()) {
          return message.reply("Please enter a valid date in DD/MM/YYYY format.");
        }

        // Build lunar page URL consistent with lunaf.com pattern
        const linkCrawl = `https://lunaf.com/lunar-calendar/${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/`;

        try {
          const resp = await axios.get(linkCrawl, { httpsAgent: agent, timeout: 30000 });
          if (!resp || !resp.data) {
            console.error("Empty response from lunaf:", linkCrawl);
            return message.reply(`Could not retrieve moon image for date ${dateStr}`);
          }

          const $ = cheerio.load(resp.data);

          // Try multiple selectors safely
          let href = $("figure.mimg img").attr("src") || $("figure img").attr("data-ezsrcset") || $("figure img").attr("src") || "";
          href = (href || "").trim();
          if (!href) {
            console.error("Moon image href not found on page:", linkCrawl);
            return message.reply(`Could not retrieve moon image for date ${dateStr}`);
          }

          // Determine an index for selecting fallback moon images if needed
          // Attempt to extract a number from href; if not, fallback to 0
          let moonIndex = 0;
          const numMatch = href.match(/(\d+)/);
          if (numMatch) {
            const n = parseInt(numMatch[1], 10);
            if (!Number.isNaN(n)) moonIndex = n;
          }

          const moonImages = [
            'https://i.ibb.co/9shyYH1/moon-0.png','https://i.ibb.co/vBXLL37/moon-1.png','https://i.ibb.co/0QCKK9D/moon-2.png',
            'https://i.ibb.co/Dp62X2j/moon-3.png','https://i.ibb.co/xFKCtfd/moon-4.png','https://i.ibb.co/m4L533L/moon-5.png',
            'https://i.ibb.co/VmshdMN/moon-6.png','https://i.ibb.co/4N7R2B2/moon-7.png','https://i.ibb.co/C2k4YB8/moon-8.png',
            'https://i.ibb.co/F62wHxP/moon-9.png','https://i.ibb.co/Gv6R1mk/moon-10.png','https://i.ibb.co/0ZYY7Kk/moon-11.png',
            'https://i.ibb.co/KqXC5F5/moon-12.png','https://i.ibb.co/BGtLpRJ/moon-13.png','https://i.ibb.co/jDn7pPx/moon-14.png',
            'https://i.ibb.co/kykn60t/moon-15.png','https://i.ibb.co/qD4LFLs/moon-16.png','https://i.ibb.co/qJm9gcQ/moon-17.png',
            'https://i.ibb.co/yYFYZx9/moon-18.png','https://i.ibb.co/8bc7vpZ/moon-19.png','https://i.ibb.co/jHG7DKs/moon-20.png',
            'https://i.ibb.co/5WD18Rn/moon-21.png','https://i.ibb.co/3Y06yHM/moon-22.png','https://i.ibb.co/4T8Zdfy/moon-23.png',
            'https://i.ibb.co/n1CJyP4/moon-24.png','https://i.ibb.co/zFwJRqz/moon-25.png','https://i.ibb.co/gVBmMCW/moon-26.png',
            'https://i.ibb.co/hRY89Hn/moon-27.png','https://i.ibb.co/7C13s7Z/moon-28.png','https://i.ibb.co/2hDTwB4/moon-29.png',
            'https://i.ibb.co/Rgj9vpj/moon-30.png','https://i.ibb.co/s5z0w9R/moon-31.png'
          ];

          // bound index into moonImages
          if (moonIndex < 0 || moonIndex >= moonImages.length) moonIndex = 0;
          const imgSrc = moonImages[moonIndex] || moonImages[0];

          // Build message
          let msg = `- Moon image on the night of ${dateStr}`;
          try {
            const h3text = $('h3').first().text().trim();
            if (h3text) msg += `\n- ${h3text}`;
          } catch (_) {}
          try {
            const small = $("#phimg > small").first().text().trim();
            if (small) msg += `\n- ${small}`;
          } catch (_) {}
          msg += `\n- ${linkCrawl}`;
          msg += `\n- ${imgSrc}`;

          // Send the image. Prefer global.utils.getStreamFromURL if available, else send URL text
          try {
            if (global && global.utils && typeof global.utils.getStreamFromURL === "function") {
              const stream = await global.utils.getStreamFromURL(imgSrc);
              if (stream) {
                return message.reply({ body: msg, attachment: stream });
              }
            }
            // fallback: send URL in the message (many chat clients will render it)
            return message.reply({ body: `${msg}\n\nImage: ${imgSrc}` });
          } catch (sendErr) {
            console.error("Error sending moon image:", sendErr && (sendErr.stack || sendErr.message || sendErr));
            return message.reply(`An error occurred while retrieving the moon image for date ${dateStr}`);
          }

        } catch (err) {
          console.error("Error fetching/parsing lunaf page:", err && (err.stack || err.message || err));
          return message.reply(`An error occurred while retrieving the moon image for date ${dateStr}`);
        }
      }
    } catch (err) {
      console.error("moonphase handleReply error:", err && (err.stack || err.message || err));
      try { await message.reply("An error occurred, please try again later."); } catch (_) {}
    }
  }
};
