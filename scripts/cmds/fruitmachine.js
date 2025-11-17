const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { URL } = require("url");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "fruitmachine",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: {
      en: "🎰 Fruit slot machine game"
    },
    longDescription: {
      en: "Play fruit slot machine game with betting"
    },
    guide: {
      en: "{p}fruitmachine [fruit_name] [bet_amount]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "moment-timezone": ""
    }
  },

  // ---------- helpers ----------
  __wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
  },

  // Robust download with retry/backoff and Retry-After handling.
  // Returns the actual saved file path on success.
  async __downloadWithRetry(url, destBasePath, options = {}) {
    const maxRetries = Number.isInteger(options.maxRetries) ? options.maxRetries : 5;
    const timeout = Number.isInteger(options.timeout) ? options.timeout : 15000;
    const userAgent = options.userAgent || "chat-ai-he-he/fruitmachine (+https://github.com/hackerdevil846/chat-ai-he-he)";

    // ensure directory exists
    await fs.ensureDir(path.dirname(destBasePath));

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await axios.get(url, {
          responseType: "stream",
          timeout,
          headers: {
            "User-Agent": userAgent,
            Accept: "*/*"
          },
          // do not throw on non-2xx here; we'll handle below
          validateStatus: null
        });

        const status = res.status || 0;
        if (status === 429) {
          // Respect Retry-After header if present
          const ra = res.headers && res.headers["retry-after"] ? parseInt(res.headers["retry-after"], 10) : NaN;
          const waitSeconds = Number.isFinite(ra) && ra > 0 ? ra : Math.min(2 ** attempt, 30);
          console.warn(`[fruitmachine] 429 rate-limited from ${url}. retrying after ${waitSeconds}s (attempt ${attempt + 1}/${maxRetries})`);
          await this.__wait(waitSeconds * 1000);
          continue;
        }
        if (status >= 400) {
          // non-retriable client errors (4xx except 429) -> break
          if (status >= 400 && status < 500) {
            throw new Error(`HTTP ${status} for ${url}`);
          }
          // server errors -> retry with backoff
          throw new Error(`HTTP ${status} for ${url}`);
        }

        // choose file extension from URL path or content-type header
        let ext = path.extname(new URL(url).pathname || "").toLowerCase();
        if (!ext) {
          const ct = (res.headers["content-type"] || "").toLowerCase();
          if (ct.includes("gif")) ext = ".gif";
          else if (ct.includes("png")) ext = ".png";
          else if (ct.includes("jpeg") || ct.includes("jpg")) ext = ".jpg";
          else ext = ".jpg"; // fallback
        }

        // final target path includes extension
        const finalPath = destBasePath.endsWith(ext) ? destBasePath : destBasePath + ext;
        const tmpPath = finalPath + ".tmp";

        // write stream safely to temp then rename
        const writer = fs.createWriteStream(tmpPath);
        await new Promise((resolve, reject) => {
          res.data.pipe(writer);
          let finished = false;
          writer.on("finish", () => {
            finished = true;
            resolve();
          });
          writer.on("error", (err) => {
            if (!finished) reject(err);
          });
          res.data.on("error", (err) => {
            if (!finished) reject(err);
          });
        });

        await fs.move(tmpPath, finalPath, { overwrite: true });
        return finalPath;
      } catch (err) {
        const isLastAttempt = attempt === maxRetries - 1;
        // If it's a network or transient error, backoff and retry.
        const backoff = Math.min(1000 * 2 ** attempt, 15000);
        console.warn(`[fruitmachine] download attempt ${attempt + 1}/${maxRetries} failed for ${url}: ${err && (err.message || err)}${isLastAttempt ? " — giving up" : ` — retrying in ${backoff}ms`}`);
        if (isLastAttempt) throw err;
        await this.__wait(backoff);
      }
    }
    // shouldn't reach here
    throw new Error("download failed after retries");
  },

  // ---------- onLoad ----------
  onLoad: async function () {
    const imageUrls = {
      nho: "https://i.imgur.com/tmKK6Yj.jpg",
      dua: "https://i.imgur.com/mBTKhUW.jpg",
      dao: "https://i.imgur.com/2qgYuDr.jpg",
      tao: "https://i.imgur.com/tXG56lV.jpg",
      dau: "https://i.imgur.com/PLQkfy3.jpg",
      bay: "https://i.imgur.com/1UBI1nc.jpg",
      slot: "https://i.imgur.com/QP7xZz4.gif"
    };

    const cacheDir = path.join(__dirname, "cache");
    try {
      await fs.ensureDir(cacheDir);
    } catch (e) {
      console.error("[fruitmachine] failed to ensure cache dir:", e);
      return;
    }

    // Download sequentially (to avoid hammering remote host)
    for (const [key, url] of Object.entries(imageUrls)) {
      const baseDest = path.join(cacheDir, key); // extension appended by downloader
      try {
        // Skip download if an existing file (gif/png/jpg) exists
        const existingCandidates = [baseDest + ".gif", baseDest + ".jpg", baseDest + ".png"];
        const exists = existingCandidates.some((p) => fs.existsSync(p));
        if (exists) {
          console.info(`[fruitmachine] cache hit for ${key}, skipping download.`);
          continue;
        }

        // Attempt download with retries and backoff; will throw on final failure
        const saved = await this.__downloadWithRetry(url, baseDest, { maxRetries: 5, timeout: 15000 });
        console.info(`[fruitmachine] saved ${key} -> ${saved}`);
      } catch (err) {
        // Log error but do not throw: onLoad must not crash the process.
        console.error(`Failed to download ${key} image:`, err && (err.message || err));
        // Optional: if you bundle fallbacks in repo/assets, copy them here:
        // const fallback = path.join(__dirname, '..', 'assets', `${key}-fallback.gif`);
        // if (await fs.pathExists(fallback)) await fs.copy(fallback, path.join(cacheDir, key + path.extname(fallback)));
      }
      // small delay between downloads to be polite and reduce rate-limit risk
      await this.__wait(300);
    }
  },

  // ---------- onStart ----------
  onStart: async function ({ message, event, args, usersData }) {
    try {
      const slotItems = ["nho", "dua", "dao", "tao", "dau", "bay"];
      const userId = event && event.senderID;
      const userData = (await usersData.get(userId)) || {};
      const userMoney = typeof userData.money === "number" ? userData.money : 0;

      if (!args || !args[0] || !args[1]) {
        return message.reply("Use: {p}fruitmachine [grape/melon/peach/apple/strawberry/seven] [bet_amount]");
      }

      const fruitChoice = String(args[0]).toLowerCase();
      const betAmount = parseInt(args[1], 10);
      if (Number.isNaN(betAmount) || betAmount <= 0) {
        return message.reply("Bet amount must be a positive number");
      }
      if (betAmount > userMoney) {
        return message.reply("You don't have enough money to bet that amount");
      }
      if (betAmount < 10000) {
        return message.reply("Minimum bet is 10000");
      }

      const fruitIcons = {
        nho: "🍇",
        dua: "🍉",
        dao: "🍑",
        tao: "🍎",
        dau: "🍓",
        bay: "➐"
      };

      if (!fruitIcons[fruitChoice]) {
        return message.reply("Invalid fruit choice. Available: grape, melon, peach, apple, strawberry, seven");
      }

      // generate results
      const results = [];
      for (let i = 0; i < 3; i++) {
        results[i] = slotItems[Math.floor(Math.random() * slotItems.length)];
      }

      const resultIcons = results.map((fruit) => fruitIcons[fruit] || "❓");

      // prepare attachments from cache if available
      const cacheDir = path.join(__dirname, "cache");
      const resultImages = [];
      for (const fruit of results) {
        const candidates = [path.join(cacheDir, `${fruit}.gif`), path.join(cacheDir, `${fruit}.jpg`), path.join(cacheDir, `${fruit}.png`)];
        let chosen = null;
        for (const c of candidates) {
          if (await fs.pathExists(c)) {
            chosen = c;
            break;
          }
        }
        if (chosen) resultImages.push(fs.createReadStream(chosen));
      }

      // slot animation (spinner) path
      let slotAnimPath = null;
      const slotGif = path.join(cacheDir, "slot.gif");
      const slotJpg = path.join(cacheDir, "slot.jpg");
      if (await fs.pathExists(slotGif)) slotAnimPath = slotGif;
      else if (await fs.pathExists(slotJpg)) slotAnimPath = slotJpg;

      // send spinning message (with animation if available)
      const spinPayload = { body: "Spinning..." };
      if (slotAnimPath) spinPayload.attachment = fs.createReadStream(slotAnimPath);
      await message.reply(spinPayload);

      // simulate spin time
      await this.__wait(5000);

      // compute win/loss
      const matchCount = results.filter((r) => r === fruitChoice).length;
      let winAmount = 0;
      let resultMessage = "";

      if (matchCount > 0) {
        winAmount = betAmount * matchCount;
        await usersData.set(userId, {
          money: userMoney + winAmount,
          data: userData.data || {}
        });
        resultMessage = `[ FRUIT MACHINE ]\n━━━━━━━━━━━━━━━━━━\n${resultIcons.join(" | ")}\n\nYou got ${matchCount} ${fruitIcons[fruitChoice]}\nYou won: ${winAmount}\nNew balance: ${userMoney + winAmount}`;
      } else {
        await usersData.set(userId, {
          money: userMoney - betAmount,
          data: userData.data || {}
        });
        resultMessage = `[ FRUIT MACHINE ]\n━━━━━━━━━━━━━━━━━━\n${resultIcons.join(" | ")}\n\nNo ${fruitIcons[fruitChoice]} found\nYou lost: ${betAmount}\nNew balance: ${userMoney - betAmount}`;
      }

      // reply with results and any available images
      const replyPayload = { body: resultMessage };
      if (resultImages.length > 0) replyPayload.attachment = resultImages;
      await message.reply(replyPayload);
    } catch (error) {
      console.error("Fruit Machine Error:", error && (error.stack || error.message || error));
      try {
        await message.reply("❌ An error occurred while playing the fruit machine. Please try again later.");
      } catch (e) {
        console.error("[fruitmachine] failed to send error reply:", e);
      }
    }
  }
};
