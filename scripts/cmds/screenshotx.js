const fs = require("fs-extra");
const path = require("path");
const url = require("url");
const axios = require("axios"); // Added axios for downloadFile if not global.utils

module.exports = {
  config: {
    name: "screenshotx", // Changed name from 'screenshot' to 'screenshotx' as requested for a different name
    aliases: ["ss", "captureweb"], // 𝐀𝐝𝐝𝐞𝐝 𝐚𝐥𝐢𝐚𝐬𝐞𝐬
    version: "1.0.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝", // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    role: 0, // 𝐂𝐨𝐧𝐯𝐞𝐫𝐭𝐞𝐝 𝐟𝐫𝐨𝐦 𝐡𝐚𝐬𝐏𝐞𝐫𝐦𝐬𝐬𝐢𝐨𝐧: 0
    category: "𝐦𝐞𝐝𝐢𝐚", // 𝐂𝐡𝐚𝐧𝐠𝐞𝐝 𝐟𝐫𝐨𝐦 "𝐀𝐧𝐲" 𝐭𝐨 "𝐦𝐞𝐝𝐢𝐚"
    countDown: 5, // 𝐂𝐨𝐧𝐯𝐞𝐫𝐭𝐞𝐝 𝐟𝐫𝐨𝐦 𝐜𝐨𝐨𝐥𝐝𝐨𝐰𝐧𝐬: 5
    shortDescription: {
      en: "📸 𝐓𝐚𝐤𝐞 𝐚 𝐟𝐮𝐥𝐥-𝐩𝐚𝐠𝐞 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭 𝐨𝐟 𝐚 𝐰𝐞𝐛𝐬𝐢𝐭𝐞 (𝐍𝐒𝐅𝐖 𝐩𝐚𝐠𝐞𝐬 𝐚𝐫𝐞 𝐛𝐥𝐨𝐜𝐤𝐞𝐝)." // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    },
    longDescription: {
      en: "𝐓𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐜𝐚𝐩𝐭𝐮𝐫𝐞𝐬 𝐚 𝐟𝐮𝐥𝐥-𝐩𝐚𝐠𝐞 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭 𝐨𝐟 𝐚 𝐠𝐢𝐯𝐞𝐧 𝐔𝐑𝐋 𝐚𝐧𝐝 𝐬𝐞𝐧𝐝𝐬 𝐢𝐭. 𝐈𝐭 𝐢𝐧𝐜𝐥𝐮𝐝𝐞𝐬 𝐚 𝐛𝐥𝐨𝐜𝐤𝐥𝐢𝐬𝐭 𝐟𝐨𝐫 𝐍𝐒𝐅𝐖 𝐬𝐢𝐭𝐞𝐬." // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    },
    guide: {
      en: "{p}screenshotx [url]\n𝐄𝐱𝐚𝐦𝐩𝐥𝐞: {p}screenshotx https://example.com\n\n✳️ 𝐓𝐢𝐩: 𝐔𝐬𝐢𝐧𝐠 𝐡𝐭𝐭𝐩/𝐡𝐭𝐭𝐩𝐬 𝐢𝐧 𝐭𝐡𝐞 𝐔𝐑𝐋 𝐠𝐢𝐯𝐞𝐬 𝐛𝐞𝐭𝐭𝐞𝐫 𝐨𝐮𝐭𝐩𝐮𝐭." // 𝐂𝐨𝐧𝐯𝐞𝐫𝐭𝐞𝐝 𝐟𝐫𝐨𝐦 𝐮𝐬𝐚𝐠𝐞𝐬 𝐚𝐧𝐝 𝐮𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    },
    dependencies: {
      "fs-extra": "",
      "path": "",
      "url": "",
      "axios": "" // 𝐀𝐝𝐝𝐞𝐝 𝐚𝐱𝐢𝐨𝐬 𝐚𝐬 𝐚 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲
    }
  },

  onLoad: async function () { // 𝐂𝐨𝐫𝐫𝐞𝐜𝐭 𝐌𝐢𝐫𝐚𝐢 𝐬𝐭𝐫𝐮𝐜𝐭𝐮𝐫𝐞 𝐟𝐨𝐫 𝐨𝐧𝐋𝐨𝐚𝐝
    const fs = require("fs-extra");
    const { resolve } = require("path");

    try {
      // 𝐄𝐧𝐬𝐮𝐫𝐞 𝐜𝐚𝐜𝐡𝐞 𝐝𝐢𝐫 𝐞𝐱𝐢𝐬𝐭𝐬
      const cacheDir = resolve(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      // 𝐏𝐚𝐭𝐡 𝐭𝐨 𝐩𝐨𝐫𝐧 𝐥𝐢𝐬𝐭 𝐢𝐧 𝐜𝐚𝐜𝐡𝐞
      const pornListPath = resolve(cacheDir, "pornlist.txt");

      // 𝐈𝐟 𝐩𝐨𝐫𝐧𝐥𝐢𝐬𝐭 𝐧𝐨𝐭 𝐩𝐫𝐞𝐬𝐞𝐧𝐭, 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐢𝐭 (𝐤𝐞𝐞𝐩𝐬 𝐬𝐚𝐦𝐞 𝐫𝐞𝐦𝐨𝐭𝐞 𝐥𝐢𝐧𝐤 𝐚𝐬 𝐫𝐞𝐪𝐮𝐞𝐬𝐭𝐞𝐝)
      if (!fs.existsSync(pornListPath)) {
        // 𝐔𝐬𝐢𝐧𝐠 𝐚𝐱𝐢𝐨𝐬 𝐟𝐨𝐫 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐚𝐬 𝐠𝐥𝐨𝐛𝐚𝐥.𝐮𝐭𝐢𝐥𝐬.𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐅𝐢𝐥𝐞 𝐦𝐢𝐠𝐡𝐭 𝐧𝐨𝐭 𝐛𝐞 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐨𝐧 𝐨𝐧𝐋𝐨𝐚𝐝 𝐨𝐫 𝐦𝐢𝐠𝐡𝐭 𝐛𝐞 𝐧𝐚𝐦𝐞𝐝 𝐝𝐢𝐟𝐟𝐞𝐫𝐞𝐧𝐭𝐥𝐲 𝐢𝐧 𝐬𝐨𝐦𝐞 𝐛𝐨𝐭 𝐯𝐞𝐫𝐬𝐢𝐨𝐧𝐬.
        // 𝐓𝐡𝐢𝐬 𝐚𝐬𝐬𝐮𝐦𝐞𝐬 𝐚𝐱𝐢𝐨𝐬 𝐢𝐬 𝐢𝐧𝐬𝐭𝐚𝐥𝐥𝐞𝐝.
        const response = await axios.get(
          "https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt",
          { responseType: 'arraybuffer' }
        );
        fs.writeFileSync(pornListPath, Buffer.from(response.data, 'utf-8'));
      }
    }
    catch (err) {
      // 𝐃𝐨 𝐧𝐨𝐭 𝐜𝐫𝐚𝐬𝐡 𝐛𝐨𝐭 𝐨𝐧 𝐥𝐨𝐚𝐝 𝐟𝐚𝐢𝐥𝐮𝐫𝐞; 𝐣𝐮𝐬𝐭 𝐥𝐨𝐠
      console.error("❗[𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭:𝐨𝐧𝐋𝐨𝐚𝐝] 𝐞𝐫𝐫𝐨𝐫:", err); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    }
  },

  onStart: async function ({ api, event, args, global }) { // 𝐏𝐚𝐫𝐚𝐦𝐞𝐭𝐞𝐫𝐬 𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐞𝐝 𝐭𝐨 𝐦𝐚𝐭𝐜𝐡 𝐭𝐡𝐞 𝐌𝐢𝐫𝐚𝐢 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐚𝐧𝐝 𝐲𝐨𝐮𝐫 𝐨𝐫𝐢𝐠𝐢𝐧𝐚𝐥 𝐜𝐨𝐝𝐞'𝐬 𝐧𝐞𝐞𝐝𝐬
    // 𝐃𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 𝐜𝐡𝐞𝐜𝐤
    const { dependencies } = this.config;
    for (const dep in dependencies) {
      try {
        require.resolve(dep);
      } catch (e) {
        console.error(`𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲: ${dep}. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐢𝐧𝐬𝐭𝐚𝐥𝐥 𝐢𝐭.`);
        return api.sendMessage(`❌ 𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲: ${dep}. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐢𝐧𝐬𝐭𝐚𝐥𝐥 𝐢𝐭 𝐭𝐨 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.`, event.threadID, event.messageID); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
      }
    }

    const fs = require("fs-extra");
    const path = require("path");
    const url = require("url");
    // 𝐍𝐨 𝐧𝐞𝐞𝐝 𝐭𝐨 𝐝𝐞𝐬𝐭𝐫𝐮𝐜𝐭𝐮𝐫𝐞 𝐭𝐡𝐞𝐬𝐞 𝐟𝐫𝐨𝐦 𝐟𝐬 𝐢𝐟 𝐲𝐨𝐮'𝐫𝐞 𝐮𝐬𝐢𝐧𝐠 𝐟𝐬-𝐞𝐱𝐭𝐫𝐚'𝐬 𝐯𝐞𝐫𝐬𝐢𝐨𝐧 𝐨𝐫 𝐟𝐬 𝐝𝐢𝐫𝐞𝐜𝐭𝐥𝐲
    const { readFileSync, createReadStream, unlinkSync } = fs; 


    // 𝐏𝐫𝐞𝐩𝐚𝐫𝐞 𝐜𝐚𝐜𝐡𝐞 𝐚𝐧𝐝 𝐩𝐨𝐫𝐧𝐥𝐢𝐬𝐭 𝐥𝐨𝐚𝐝𝐢𝐧𝐠
    try {
      const cacheDir = path.resolve(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const pornListFile = path.resolve(cacheDir, "pornlist.txt");

      if (!global.moduleData) global.moduleData = {};
      // 𝐋𝐨𝐚𝐝 𝐩𝐨𝐫𝐧 𝐥𝐢𝐬𝐭 𝐢𝐧𝐭𝐨 𝐦𝐞𝐦𝐨𝐫𝐲 𝐨𝐧𝐜𝐞
      if (!global.moduleData.pornList) {
        const raw = readFileSync(pornListFile, "utf-8");
        global.moduleData.pornList = raw
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'))
          .map(site => site.replace(/^(0\.0\.0\.0\s*)/, ''))
          .map(site => site.replace(/\/.*$/, '')); // 𝐫𝐞𝐦𝐨𝐯𝐞 𝐚𝐧𝐲 𝐭𝐫𝐚𝐢𝐥𝐢𝐧𝐠 𝐩𝐚𝐭𝐡𝐬 𝐢𝐧 𝐥𝐢𝐬𝐭 𝐞𝐧𝐭𝐫𝐢𝐞𝐬
      }
    }
    catch (err) {
      // 𝐈𝐟 𝐩𝐨𝐫𝐧𝐥𝐢𝐬𝐭 𝐦𝐢𝐬𝐬𝐢𝐧𝐠 𝐨𝐫 𝐮𝐧𝐫𝐞𝐚𝐝𝐚𝐛𝐥𝐞, 𝐥𝐨𝐠 𝐛𝐮𝐭 𝐜𝐨𝐧𝐭𝐢𝐧𝐮𝐞 (𝐰𝐞'𝐥𝐥 𝐚𝐥𝐥𝐨𝐰 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭)
      console.warn("⚠️ [𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐱] 𝐜𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐥𝐨𝐚𝐝 𝐩𝐨𝐫𝐧𝐥𝐢𝐬𝐭:", err && err.message ? err.message : err); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
      global.moduleData = global.moduleData || {};
      global.moduleData.pornList = global.moduleData.pornList || [];
    }

    // 𝐕𝐚𝐥𝐢𝐝𝐚𝐭𝐞 𝐚𝐫𝐠𝐮𝐦𝐞𝐧𝐭
    if (!args || !args[0]) {
      return api.sendMessage(
        "❌ 𝐔𝐑𝐋 𝐝𝐞𝐲𝐚 𝐡𝐨𝐲𝐧𝐢.\n\n𝐔𝐬𝐚𝐠𝐞: 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐱 [𝐮𝐫𝐥]\n𝐄𝐱𝐚𝐦𝐩𝐥𝐞: 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐱 𝐡𝐭𝐭𝐩𝐬://𝐞𝐱𝐚𝐦𝐩𝐥𝐞.𝐜𝐨𝐦\n\n✳️ 𝐓𝐢𝐩: 𝐔𝐑𝐋 𝐞 𝐡𝐭𝐭𝐩/𝐡𝐭𝐭𝐩𝐬 𝐝𝐢𝐲𝐞 𝐝𝐢𝐥𝐞 𝐛𝐡𝐚𝐥𝐨 𝐨𝐮𝐭𝐩𝐮𝐭 𝐩𝐚𝐛𝐞𝐧.", // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
        event.threadID,
        event.messageID
      );
    }

    // 𝐍𝐨𝐫𝐦𝐚𝐥𝐢𝐳𝐞 𝐢𝐧𝐩𝐮𝐭 𝐔𝐑𝐋 𝐟𝐨𝐫 𝐩𝐚𝐫𝐬𝐢𝐧𝐠 (𝐝𝐨 𝐍𝐎𝐓 𝐜𝐡𝐚𝐧𝐠𝐞 𝐭𝐡𝐞 𝐨𝐫𝐢𝐠𝐢𝐧𝐚𝐥 𝐭𝐚𝐫𝐠𝐞𝐭 𝐥𝐢𝐧𝐤 𝐮𝐬𝐞𝐝 𝐟𝐨𝐫 𝐭𝐡𝐮𝐦𝐛𝐧𝐚𝐢𝐥 𝐬𝐞𝐫𝐯𝐢𝐜𝐞)
    let input = args[0].trim();

    // 𝐈𝐟 𝐮𝐬𝐞𝐫 𝐩𝐫𝐨𝐯𝐢𝐝𝐞𝐝 𝐨𝐧𝐥𝐲 𝐝𝐨𝐦𝐚𝐢𝐧 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐩𝐫𝐨𝐭𝐨𝐜𝐨𝐥, 𝐩𝐫𝐞𝐩𝐞𝐧𝐝 𝐡𝐭𝐭𝐩:// 𝐟𝐨𝐫 𝐩𝐚𝐫𝐬𝐢𝐧𝐠 (𝐰𝐞 𝐰𝐨𝐧'𝐭 𝐜𝐡𝐚𝐧𝐠𝐞 𝐭𝐡𝐞 𝐚𝐜𝐭𝐮𝐚𝐥 𝐢𝐦𝐚𝐠𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐨𝐫 𝐮𝐫𝐥)
    if (!/^[a-zA-Z]+:\/\//.test(input)) input = "http://" + input;

    let parsed;
    try {
      parsed = url.parse(input);
    }
    catch (err) {
      return api.sendMessage("❌ 𝐔𝐑𝐋 𝐩𝐚𝐫𝐬𝐞 𝐤𝐨𝐫𝐭𝐞 𝐩𝐚𝐫𝐢 𝐧𝐚𝐢. 𝐓𝐡𝐢𝐤 𝐟𝐨𝐫𝐦𝐚𝐭 𝐝𝐚𝐨 (𝐞.𝐠. 𝐡𝐭𝐭𝐩𝐬://𝐞𝐱𝐚𝐦𝐩𝐥𝐞.𝐜𝐨𝐦).", event.threadID, event.messageID); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    }

    // 𝐈𝐟 𝐡𝐨𝐬𝐭 𝐢𝐬 𝐦𝐢𝐬𝐬𝐢𝐧𝐠 𝐚𝐟𝐭𝐞𝐫 𝐩𝐚𝐫𝐬𝐞, 𝐫𝐞𝐭𝐮𝐫𝐧 𝐞𝐫𝐫𝐨𝐫
    if (!parsed.host) {
      return api.sendMessage("❌ 𝐔𝐑𝐋 𝐭𝐞 𝐡𝐨𝐬𝐭 𝐩𝐚𝐢 𝐧𝐚𝐢. 𝐓𝐡𝐢𝐤 𝐟𝐨𝐫𝐦𝐚𝐭 𝐝𝐚𝐨 (𝐞.𝐠. 𝐡𝐭𝐭𝐩𝐬://𝐞𝐱𝐚𝐦𝐩𝐥𝐞.𝐜𝐨𝐦).", event.threadID, event.messageID); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    }

    // 𝐂𝐡𝐞𝐜𝐤 𝐩𝐨𝐫𝐧𝐥𝐢𝐬𝐭 (𝐛𝐥𝐨𝐜𝐤 𝐍𝐒𝐅𝐖 𝐝𝐨𝐦𝐚𝐢𝐧𝐬)
    try {
      const host = parsed.host.replace(/^www\./, "").toLowerCase();
      const pornList = global.moduleData.pornList || [];

      const isPorn = pornList.some(pornURL => {
        const normalizedPorn = String(pornURL).replace(/^www\./, "").toLowerCase();
        // 𝐞𝐱𝐚𝐜𝐭 𝐦𝐚𝐭𝐜𝐡 𝐨𝐫 𝐬𝐮𝐛𝐝𝐨𝐦𝐚𝐢𝐧 𝐦𝐚𝐭𝐜𝐡
        return host === normalizedPorn || host.endsWith(`.${normalizedPorn}`);
      });

      if (isPorn) {
        return api.sendMessage("🚫 𝐄𝐢 𝐰𝐞𝐛𝐬𝐢𝐭𝐞-𝐭𝐚 𝐍𝐒𝐅𝐖 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲-𝐭𝐞 𝐩𝐚𝐨𝐚 𝐠𝐞𝐜𝐡𝐞 — 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭 𝐧𝐢𝐭𝐞 𝐩𝐚𝐫𝐛𝐨𝐧𝐚.", event.threadID, event.messageID); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
      }
    }
    catch (err) {
      // 𝐈𝐟 𝐩𝐨𝐫𝐧 𝐜𝐡𝐞𝐜𝐤 𝐟𝐚𝐢𝐥𝐬 𝐟𝐨𝐫 𝐚𝐧𝐲 𝐫𝐞𝐚𝐬𝐨𝐧, 𝐥𝐨𝐠 𝐚𝐧𝐝 𝐜𝐨𝐧𝐭𝐢𝐧𝐮𝐞 (𝐟𝐚𝐢𝐥 𝐨𝐩𝐞𝐧)
      console.warn("⚠️ [𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐱] 𝐩𝐨𝐫𝐧𝐥𝐢𝐬𝐭 𝐜𝐡𝐞𝐜𝐤 𝐟𝐚𝐢𝐥𝐞𝐝:", err && err.message ? err.message : err); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
    }

    // 𝐁𝐮𝐢𝐥𝐝 𝐭𝐡𝐮𝐦.𝐢𝐨 𝐔𝐑𝐋 (𝐤𝐞𝐞𝐩𝐬 𝐭𝐡𝐞 𝐞𝐱𝐚𝐜𝐭 𝐬𝐚𝐦𝐞 𝐬𝐞𝐫𝐯𝐢𝐜𝐞/𝐩𝐚𝐭𝐡 𝐚𝐬 𝐫𝐞𝐪𝐮𝐞𝐬𝐭𝐞𝐝)
    // 𝐖𝐞 𝐩𝐚𝐬𝐬 𝐭𝐡𝐞 𝐨𝐫𝐢𝐠𝐢𝐧𝐚𝐥 𝐮𝐬𝐞𝐫-𝐬𝐮𝐩𝐩𝐥𝐢𝐞𝐝 𝐬𝐭𝐫𝐢𝐧𝐠 (𝐚𝐫𝐠𝐬[0]) 𝐢𝐧𝐭𝐨 𝐭𝐡𝐞 𝐭𝐡𝐮𝐦.𝐢𝐨 𝐜𝐚𝐥𝐥 𝐬𝐨 𝐰𝐞 𝐝𝐨𝐧'𝐭 𝐦𝐮𝐭𝐚𝐭𝐞 𝐮𝐬𝐞𝐫'𝐬 𝐥𝐢𝐧𝐤.
    const targetForThumb = args[0].trim();
    const outPath = path.resolve(__dirname, "cache", `${event.threadID}-${event.senderID}s.png`); // 𝐃𝐎 𝐍𝐎𝐓 𝐂𝐇𝐀𝐍𝐆𝐄 𝐏𝐀𝐓𝐇
    const thumUrl = `https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${targetForThumb}`; // 𝐃𝐎 𝐍𝐎𝐓 𝐂𝐇𝐀𝐍𝐆𝐄 𝐋𝐈𝐍𝐊

    // 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭 𝐚𝐧𝐝 𝐬𝐞𝐧𝐝
    try {
      // 𝐔𝐬𝐞 𝐠𝐥𝐨𝐛𝐚𝐥.𝐮𝐭𝐢𝐥𝐬.𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐅𝐢𝐥𝐞 𝐢𝐟 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞, 𝐨𝐭𝐡𝐞𝐫𝐰𝐢𝐬𝐞 𝐟𝐚𝐥𝐥𝐛𝐚𝐜𝐤 𝐭𝐨 𝐚𝐱𝐢𝐨𝐬
      if (global.utils && typeof global.utils.downloadFile === 'function') {
        await global.utils.downloadFile(thumUrl, outPath);
      } else {
        // 𝐅𝐚𝐥𝐥𝐛𝐚𝐜𝐤 𝐢𝐟 𝐠𝐥𝐨𝐛𝐚𝐥.𝐮𝐭𝐢𝐥𝐬.𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐅𝐢𝐥𝐞 𝐢𝐬 𝐧𝐨𝐭 𝐝𝐞𝐟𝐢𝐧𝐞𝐝 (𝐫𝐞𝐪𝐮𝐢𝐫𝐞𝐬 𝐚𝐱𝐢𝐨𝐬 𝐭𝐨 𝐛𝐞 𝐢𝐧𝐬𝐭𝐚𝐥𝐥𝐞𝐝)
        const response = await axios.get(thumUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(outPath, Buffer.from(response.data, 'utf-8'));
      }

      // 𝐒𝐞𝐧𝐝 𝐚 𝐟𝐫𝐢𝐞𝐧𝐝𝐥𝐲 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐞𝐦𝐨𝐣𝐢 + 𝐚𝐭𝐭𝐚𝐜𝐡𝐦𝐞𝐧𝐭
      return api.sendMessage(
        {
          body: `✅ 𝐒𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭 𝐫𝐞𝐚𝐝𝐲! — ${targetForThumb}\n📎 𝐒𝐞𝐧𝐭 𝐛𝐲: 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝\n\n✨ 𝐄𝐧𝐣𝐨𝐲!`, // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
          attachment: createReadStream(outPath)
        },
        event.threadID,
        (err) => {
          // 𝐜𝐥𝐞𝐚𝐧𝐮𝐩 𝐟𝐢𝐥𝐞 𝐫𝐞𝐠𝐚𝐫𝐝𝐥𝐞𝐬𝐬 𝐨𝐟 𝐬𝐞𝐧𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬
          try { unlinkSync(outPath); } catch (e) { /* 𝐢𝐠𝐧𝐨𝐫𝐞 */ }
          if (err) {
            console.error("❗[𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐱] 𝐬𝐞𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", err); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
          }
        },
        event.messageID
      );
    }
    catch (err) {
      // 𝐈𝐟 𝐚𝐧𝐲 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐬, 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐡𝐞𝐥𝐩𝐟𝐮𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 (𝐤𝐞𝐞𝐩𝐬 𝐬𝐚𝐦𝐞 𝐠𝐮𝐢𝐝𝐚𝐧𝐜𝐞 𝐚𝐬 𝐨𝐫𝐢𝐠𝐢𝐧𝐚𝐥 𝐛𝐮𝐭 𝐩𝐫𝐞𝐭𝐭𝐢𝐞𝐫)
      console.error("❗[𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐱] 𝐞𝐫𝐫𝐨𝐫:", err && err.stack ? err.stack : err); // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
      return api.sendMessage(
        "❌ 𝐒𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭 𝐧𝐢𝐭𝐞 𝐩𝐫𝐨𝐛𝐥𝐞𝐦 𝐡𝐨𝐢𝐬𝐞. 𝐏𝐫𝐨𝐛𝐚𝐛𝐥𝐞 𝐤𝐚𝐫𝐨𝐧: 𝐢𝐧𝐯𝐚𝐥𝐢𝐝 𝐔𝐑𝐋 𝐛𝐚 𝐭𝐡𝐮𝐦.𝐢𝐨 𝐬𝐞𝐫𝐯𝐢𝐜𝐞 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐝𝐢𝐛𝐞 𝐧𝐚.\n\n𝐓𝐫𝐲: `𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐱 𝐡𝐭𝐭𝐩𝐬://𝐞𝐱𝐚𝐦𝐩𝐥𝐞.𝐜𝐨𝐦`", // 𝐔𝐬𝐞𝐝 𝐁𝐨𝐥𝐝 𝐌𝐚𝐭𝐡𝐞𝐦𝐚𝐭𝐢𝐜𝐚𝐥 𝐟𝐨𝐧𝐭
        event.threadID,
        event.messageID
      );
    }
  }
};
