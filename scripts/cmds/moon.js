// scripts/cmds/moon.js (defensive fixed version)
// Loads cheerio at runtime to avoid module-load crashes if it's missing or ESM-only.

const moment = require("moment-timezone");
const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");
const https = require("https");
const path = require("path");

const agent = new https.Agent({ rejectUnauthorized: false });
const { getStreamFromURL } = global.utils || {};

// Register optional font if available
const pathFont = path.join(__dirname, "assets", "font", "Kanit-SemiBoldItalic.ttf");
try {
  if (fs.existsSync(pathFont)) {
    Canvas.registerFont(pathFont, { family: "Kanit SemiBold" });
  } else {
    console.warn("Font not found at", pathFont);
  }
} catch (e) {
  console.warn("Error registering font:", e && e.message);
}

module.exports = {
  config: {
    name: "moon",
    version: "1.4",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    description: {
      vi: "xem ảnh mặt trăng vào đêm bạn chọn (dd/mm/yyyy)",
      en: "view moon image on the night you choose (dd/mm/yyyy)"
    },
    category: "image",
    guide: {
      vi: "  {pn} <ngày/tháng/năm>\n   {pn} <ngày/tháng/năm> <caption>",
      en: "  {pn} <day/month/year>\n   {pn} <day/month/year> <caption>"
    }
  },

  langs: {
    vi: {
      invalidDateFormat: "Vui lòng nhập ngày/tháng/năm hợp lệ theo định dạng DD/MM/YYYY",
      error: "Đã xảy ra lỗi không thể lấy ảnh mặt trăng của ngày %1",
      invalidDate: "Ngày %1 không hợp lệ",
      caption: "- Ảnh mặt trăng vào đêm %1"
    },
    en: {
      invalidDateFormat: "Please enter a valid date in DD/MM/YYYY format",
      error: "An error occurred while getting the moon image of %1",
      invalidDate: "%1 is not a valid date",
      caption: "- Moon image on %1"
    }
  },

  onStart: async function ({ args, message, getLang }) {
    // Load cheerio at runtime (safe load)
    let cheerio;
    try {
      cheerio = require("cheerio");
    } catch (reqErr) {
      try {
        const mod = await import("cheerio");
        cheerio = mod && (mod.default || mod);
      } catch (impErr) {
        console.error("Cheerio not available:", reqErr && reqErr.message, impErr && impErr.message);
        try { await message.reply("❌ Parser dependency missing: run `npm install cheerio` in project root."); } catch (_) {}
        return;
      }
    }

    // Validate input date
    const date = checkDate(args && args[0]);
    if (!date) return message.reply(getLang("invalidDateFormat"));

    const linkCrawl = `https://lunaf.com/lunar-calendar/${date}`;
    let html;
    try {
      html = await axios.get(linkCrawl, { httpsAgent: agent, timeout: 30000 });
    } catch (err) {
      console.error("Error fetching lunar page:", err && err.message);
      return message.reply(getLang("error", args[0]));
    }

    let $;
    try {
      $ = cheerio.load(html.data);
    } catch (e) {
      console.error("Error parsing lunar HTML:", e && e.message);
      return message.reply(getLang("error", args[0]));
    }

    // Extract image src safely
    const href = $("figure img").attr("data-ezsrcset") || $("figure img").attr("src") || "";
    if (!href) {
      console.error("Moon href not found on page:", linkCrawl);
      return message.reply(getLang("error", args[0]));
    }

    const match = href.match(/phase-(\d+)\.png/);
    if (!match) {
      console.error("Could not extract phase number from href:", href);
      return message.reply(getLang("error", args[0]));
    }
    const number = parseInt(match[1], 10);
    if (isNaN(number) || number < 0 || number >= moonImages.length) {
      console.error("Invalid moon phase number:", number);
      return message.reply(getLang("error", args[0]));
    }

    const imgSrc = moonImages[number];
    if (!imgSrc) {
      console.error("No image URL in moonImages for index:", number);
      return message.reply(getLang("error", args[0]));
    }

    // Fetch the moon image bytes (used for canvas)
    let imgBuffer = null;
    try {
      const resp = await axios.get(imgSrc, { responseType: "arraybuffer", timeout: 30000, httpsAgent: agent });
      imgBuffer = Buffer.from(resp.data);
    } catch (err) {
      console.error("Error fetching moon image:", err && err.message);
      return message.reply(getLang("error", args[0]));
    }

    // Build message text
    let messageText = getLang("caption", args[0]);
    try {
      const h3 = $("h3").first();
      if (h3 && h3.text) messageText += `\n- ${h3.text().trim()}`;
      const phSmall = $("#phimg > small").first();
      if (phSmall && phSmall.text) messageText += `\n- ${phSmall.text().trim()}`;
      messageText += `\n- ${linkCrawl}`;
      messageText += `\n- https://lunaf.com/img/moon/h-phase-${number}.png`;
    } catch (e) {
      console.warn("Error building caption details:", e && e.message);
    }

    // If extra caption supplied, create canvas image
    if (args && args.length > 1) {
      try {
        const canvas = Canvas.createCanvas(1080, 2400);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1080, 2400);

        const moonImg = await Canvas.loadImage(imgBuffer);
        centerImage(ctx, moonImg, 1080 / 2, 2400 / 2, 970, 970);

        try { ctx.font = '60px "Kanit SemiBold"'; } catch (_) { ctx.font = "60px sans-serif"; }

        const captionText = args.slice(1).join(" ");
        const wrapText = getLines(ctx, captionText, 594);
        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        const yStartText = 2095;
        let heightText = yStartText - Math.floor(wrapText.length / 2) * 75;
        for (const line of wrapText) {
          ctx.fillText(line, 750, heightText);
          heightText += 75;
        }

        const tmpDir = path.join(__dirname, "tmp");
        try { await fs.ensureDir(tmpDir); } catch (_) {}
        const pathSave = path.join(tmpDir, `wallMoon_${Date.now()}.png`);
        fs.writeFileSync(pathSave, canvas.toBuffer());

        try {
          await message.reply({ body: messageText, attachment: fs.createReadStream(pathSave) });
        } catch (sendErr) {
          console.warn("Send with attachment failed, sending URL instead:", sendErr && sendErr.message);
          await message.reply(`${messageText}\n\nImage: https://lunaf.com/img/moon/h-phase-${number}.png`);
        } finally {
          try { if (fs.existsSync(pathSave)) fs.unlinkSync(pathSave); } catch (_) {}
        }
      } catch (canvasErr) {
        console.error("Canvas generation error:", canvasErr && canvasErr.message);
        return message.reply(`${messageText}\n\nImage: https://lunaf.com/img/moon/h-phase-${number}.png`);
      }
    } else {
      // No extra caption — send direct stream or URL
      try {
        if (getStreamFromURL && typeof getStreamFromURL === "function") {
          const streamImg = await getStreamFromURL(imgSrc);
          if (streamImg) {
            return message.reply({ body: messageText, attachment: streamImg });
          }
        }
        return message.reply({ body: messageText + `\n\nImage: ${imgSrc}` });
      } catch (err) {
        console.error("Error sending moon image stream:", err && err.message);
        return message.reply(getLang("error", args[0]));
      }
    }
  }
};

// Helpers
function getLines(ctx, text, maxWidth) {
  if (!text) return [];
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0] || "";
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(`${currentLine} ${word}`).width;
    if (width < maxWidth) currentLine += " " + word;
    else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
function centerImage(ctx, img, x, y, sizeX, sizeY) {
  ctx.drawImage(img, x - sizeX / 2, y - sizeY / 2, sizeX, sizeY);
}
function checkDate(date) {
  if (!date) return false;
  const [day0, month0, year0] = (date || "").split("/");
  const day = (day0 || "").length == 1 ? "0" + day0 : day0;
  const month = (month0 || "").length == 1 ? "0" + month0 : month0;
  const year = year0 || "";
  const newDateFormat = `${year}/${month}/${day}`;
  return moment(newDateFormat, "YYYY/MM/DD", true).isValid() ? newDateFormat : false;
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
