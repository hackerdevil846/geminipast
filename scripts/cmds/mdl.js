// scripts/cmds/mdl.js
// Fixed: no crash if cheerio not found, safer requires, clearer errors.

module.exports = {
  config: {
    name: "mdl",
    aliases: ["devdownload", "codeget"],
    version: "1.0.1",
    role: 2,
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    category: "admin",
    shortDescription: { en: "💻 Apply or fetch code from buildtooldev / pastebin" },
    longDescription: {
      en: "Download and apply code from various sources including Pastebin, Buildtool, and Google Drive."
    },
    guide: { en: "{p}mdl [filename] (reply with link)" },
    countDown: 0,
    dependencies: {
      axios: "",
      "fs-extra": "",
      request: "",
      cheerio: "",
      "pastebin-api": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    let axios, fs, request, cheerio, PasteClient;
    try {
      axios = require("axios");
      fs = require("fs-extra");
      request = require("request");
      try {
        cheerio = require("cheerio");
      } catch (err) {
        // Try dynamic import fallback (ESM builds)
        const mod = await import("cheerio");
        cheerio = mod.default || mod;
      }
      ({ PasteClient } = require("pastebin-api"));
    } catch (e) {
      console.error("Missing dependency:", e && e.message);
      return message.reply("❌ Missing dependencies. Run: npm install axios fs-extra request cheerio pastebin-api");
    }

    try {
      const permission = ["61571630409265"];
      if (!permission.includes(event.senderID)) {
        return message.reply("⛔ You are not authorized to use this admin command.");
      }

      const { type, messageReply } = event;
      const name = args[0];
      const text = type === "message_reply" ? messageReply.body : null;

      if (!text && !name) {
        return message.reply("💡 Please reply to a message containing a link or provide a filename.");
      }

      // --- Upload local file to Pastebin ---
      if (!text && name) {
        const filePath = `${__dirname}/${name}.js`;
        if (!fs.existsSync(filePath)) {
          return message.reply(`❌ Command "${name}" does not exist.`);
        }

        try {
          const data = fs.readFileSync(filePath, "utf8");
          const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
          const url = await client.createPaste({
            code: data,
            expireDate: "N",
            format: "javascript",
            name: args[1] || "noname",
            publicity: 1
          });
          const id = url.split("/")[3];
          const rawLink = "https://pastebin.com/raw/" + id;
          return message.reply(`📋 Pastebin created: ${rawLink}`);
        } catch (err) {
          console.error("Pastebin upload error:", err);
          return message.reply("❌ Failed to create Pastebin paste.");
        }
      }

      // --- Parse link from text ---
      const urlR = /(https?:\/\/[^\s]+)/g;
      const url = text.match(urlR);
      if (!url) return message.reply("❌ Invalid URL provided.");
      const link = url[0];

      // --- Pastebin handler ---
      if (link.includes("pastebin")) {
        try {
          const raw = link.includes("/raw/")
            ? link
            : link.replace("pastebin.com/", "pastebin.com/raw/");
          const res = await axios.get(raw);
          const data = res.data;
          const filePath = `${__dirname}/${args[0]}.js`;
          fs.writeFileSync(filePath, data, "utf8");
          return message.reply(
            `✅ Applied code to ${args[0]}.js\n💡 Use: ${global.config.PREFIX}load ${args[0]}`
          );
        } catch (err) {
          console.error("Pastebin fetch error:", err);
          return message.reply("❌ Failed to fetch Pastebin content.");
        }
      }

      // --- Buildtool / tinyurl handler ---
      if (link.includes("buildtool") || link.includes("tinyurl.com")) {
        return new Promise((resolve) => {
          request({ method: "GET", url: link, timeout: 30000 }, (error, response, body) => {
            if (error) {
              console.error("Buildtool fetch error:", error);
              return message.reply("❌ Failed to fetch buildtool link.");
            }
            try {
              const $ = cheerio.load(body);
              const codeBlock = $(".language-js").first();
              const code = codeBlock.text().trim();
              if (!code) return message.reply("❌ Could not extract code block.");
              const filePath = `${__dirname}/${args[0]}.js`;
              fs.writeFile(filePath, code, "utf8", (err) => {
                if (err) {
                  console.error("Write file error:", err);
                  return message.reply("❌ Error writing file.");
                }
                return message.reply(
                  `✅ Added code to "${args[0]}.js"\n💡 Use: ${global.config.PREFIX}load ${args[0]}`
                );
              });
            } catch (err2) {
              console.error("Parse error:", err2);
              return message.reply("❌ Error parsing buildtool page.");
            }
          });
        });
      }

      // --- Google Drive handler ---
      if (link.includes("drive.google")) {
        return message.reply("🔧 Google Drive support is under development.");
      }

      // --- Unknown domain ---
      return message.reply("❌ Unsupported link type.");

    } catch (err) {
      console.error("mdl.js error:", err && (err.stack || err.message || err));
      return message.reply("❌ Unexpected error executing mdl command.");
    }
  }
};
