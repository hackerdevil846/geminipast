const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const userCache = new Map();

function deleteAfterTimeout(filePath, timeout = 10000) {
  setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖽𝖾𝗅𝖾𝗍𝖾 𝖿𝗂𝗅𝖾:", error.message);
    }
  }, timeout);
}

function formatSeconds(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}𝗆 ${s}𝗌`;
}

function toBI(text) {
  const map = {
    'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾',
    'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃',
    'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈',
    'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍',
    'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒',
    'z': '𝗓', 'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣',
    'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨',
    'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭',
    'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲',
    'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷',
    'Y': '𝖸', 'Z': '𝖹', 
    '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦',
    '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫'
  };
  return text.split('').map(char => map[char] || char).join('');
}

module.exports = {
  config: {
    name: "archive",
    aliases: [],
    version: "2.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
      en: "𝖲𝖾𝖺𝗋𝖼𝗁 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗋𝗈𝗆 𝖺𝗋𝖼𝗁𝗂𝗏𝖾.𝗈𝗋𝗀"
    },
    longDescription: {
      en: "𝖲𝖾𝖺𝗋𝖼𝗁 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈𝗌, 𝗆𝗎𝗌𝗂𝖼, 𝖽𝗈𝖼𝗎𝗆𝖾𝗇𝗍𝗌, 𝖠𝖯𝖪𝗌, 𝖺𝗇𝖽 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 𝖺𝗋𝖼𝗁𝗂𝗏𝖾.𝗈𝗋𝗀"
    },
    guide: {
      en: "{p}archive <𝗏𝗂𝖽𝖾𝗈|𝗆𝗎𝗌𝗂𝖼|𝖽𝗈𝖼|𝖺𝗉𝗄|𝗂𝗆𝖺𝗀𝖾> <𝗊𝗎𝖾𝗋𝗒>"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ event, args, message }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("axios");
        require("fs-extra");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply(toBI("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺."));
      }

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const type = args[0]?.toLowerCase();
      const query = args.slice(1).join(" ").trim();
      const validTypes = ["video", "music", "doc", "apk", "image"];

      if (!validTypes.includes(type) || !query) {
        return message.reply(toBI("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖺𝗀𝖾: 𝖺𝗋𝖼𝗁𝗂𝗏𝖾 <𝗏𝗂𝖽𝖾𝗈|𝗆𝗎𝗌𝗂𝖼|𝖽𝗈𝖼|𝖺𝗉𝗄|𝗂𝗆𝖺𝗀𝖾> <𝗊𝗎𝖾𝗋𝗒>"));
      }

      if (query.length < 2) {
        return message.reply(toBI("❌ 𝖰𝗎𝖾𝗋𝗒 𝗍𝗈𝗈 𝗌𝗁𝗈𝗋𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗆𝖾𝖺𝗇𝗂𝗇𝗀𝖿𝗎𝗅 𝗌𝖾𝖺𝗋𝖼𝗁 𝗍𝖾𝗋𝗆."));
      }

      const typeMap = {
        video: "movies",
        music: "audio",
        doc: "texts",
        apk: "software",
        image: "image",
      };

      const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
        query
      )}+AND+mediatype:${typeMap[type]}&fl[]=identifier,title,description,downloads&rows=5&page=1&output=json`;

      const loadingMsg = await message.reply(toBI("🔍 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖺𝗋𝖼𝗁𝗂𝗏𝖾.𝗈𝗋𝗀..."));

      try {
        const res = await axios.get(searchUrl, { timeout: 30000 });
        const items = res.data?.response?.docs;

        if (!items || !items.length) {
          await message.unsendMessage(loadingMsg.messageID);
          return message.reply(toBI("❌ 𝖭𝗈 𝗋𝖾𝗌𝗎𝗅𝗍𝗌 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝗌𝖾𝖺𝗋𝖼𝗁!"));
        }

        userCache.set(event.senderID, { type, results: items, timestamp: Date.now() });

        const list = items.map((item, i) => `${i + 1}. ${item.title || '𝖴𝗇𝗍𝗂𝗍𝗅𝖾𝖽'}`).join("\n");

        await message.unsendMessage(loadingMsg.messageID);
        const msg = await message.reply(
          toBI(`📦 𝖳𝗈𝗉 5 ${type} 𝗋𝖾𝗌𝗎𝗅𝗍𝗌 𝖿𝗈𝗋 "${query}":\n\n${list}\n\n👉 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 1–5 𝗍𝗈 𝗌𝖾𝗅𝖾𝖼𝗍`)
        );

        global.client.handleReply.push({
          name: this.config.name,
          messageID: msg.messageID,
          author: event.senderID,
          type: "select"
        });

      } catch (searchError) {
        await message.unsendMessage(loadingMsg.messageID);
        console.error("𝖠𝗋𝖼𝗁𝗂𝗏𝖾 𝗌𝖾𝖺𝗋𝖼𝗁 𝖾𝗋𝗋𝗈𝗋:", searchError);
        return message.reply(toBI("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖺𝗋𝖼𝗁𝗂𝗏𝖾.𝗈𝗋𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋."));
      }

    } catch (e) {
      console.error("💥 𝖠𝗋𝖼𝗁𝗂𝗏𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", e);
      message.reply(toBI("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖺𝗋𝖼𝗁𝗂𝗏𝖾.𝗈𝗋𝗀"));
    }
  },

  onReply: async function({ event, Reply, message }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("axios");
        require("fs-extra");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply(toBI("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺."));
      }

      if (event.senderID !== Reply.author) {
        return message.reply(toBI("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝖾𝗍 𝗍𝗁𝖾 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝗎𝗌𝖾𝗋 𝗌𝖾𝗅𝖾𝖼𝗍."));
      }

      const choice = event.body.trim();
      if (!/^[1-5]$/.test(choice)) {
        return message.reply(toBI("⚠️ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 1–5"));
      }

      const index = parseInt(choice) - 1;
      const userData = userCache.get(event.senderID);
      
      // Check if data is expired (10 minutes)
      if (!userData || Date.now() - userData.timestamp > 600000) {
        userCache.delete(event.senderID);
        return message.reply(toBI("❌ 𝖲𝖾𝗌𝗌𝗂𝗈𝗇 𝖾𝗑𝗉𝗂𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗍𝖺𝗋𝗍 𝖺 𝗇𝖾𝗐 𝗌𝖾𝖺𝗋𝖼𝗁."));
      }

      const { type, results } = userData;
      if (!results || !results[index]) {
        return message.reply(toBI("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗌𝖾𝗅𝖾𝖼𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇."));
      }

      const item = results[index];
      const metaUrl = `https://archive.org/metadata/${item.identifier}`;

      const loadingMsg = await message.reply(toBI("📥 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗂𝗅𝖾 𝖽𝖺𝗍𝖺..."));

      try {
        const metaRes = await axios.get(metaUrl, { timeout: 30000 });
        const files = metaRes.data?.files;

        if (!files || !Array.isArray(files)) {
          await message.unsendMessage(loadingMsg.messageID);
          return message.reply(toBI("❌ 𝖭𝗈 𝖿𝗂𝗅𝖾𝗌 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗂𝗍𝖾𝗆."));
        }

        let file, fileUrl, duration = 0;

        if (type === "video") {
          file = files.find(f => f.format?.includes("MPEG4") || f.name?.endsWith('.mp4'));
          duration = parseFloat(file?.length || 0);
        } else if (type === "music") {
          file = files.find(f => f.format?.includes("MP3") || f.name?.endsWith('.mp3'));
          duration = parseFloat(file?.length || 0);
        } else if (type === "doc") {
          const docFiles = files.filter(f => /\.(pdf|zip|docx?|epub|txt)$/i.test(f.name));
          if (!docFiles.length) {
            await message.unsendMessage(loadingMsg.messageID);
            return message.reply(toBI("❌ 𝖭𝗈 𝖽𝗈𝖼𝗎𝗆𝖾𝗇𝗍 𝖿𝗂𝗅𝖾𝗌 𝖿𝗈𝗎𝗇𝖽"));
          }
          const links = docFiles.slice(0, 5).map(f => toBI(`📄 ${f.name}\n🔗 𝗁𝗍𝗍𝗉𝗌://𝖺𝗋𝖼𝗁𝗂𝗏𝖾.𝗈𝗋𝗀/𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽/${item.identifier}/${f.name}`));
          await message.unsendMessage(loadingMsg.messageID);
          return message.reply(toBI(`📚 𝖣𝗈𝖼𝗎𝗆𝖾𝗇𝗍𝗌:\n\n${links.join("\n\n")}`));
        } else if (type === "apk") {
          file = files.find(f => /\.apk$/i.test(f.name));
          if (!file) {
            await message.unsendMessage(loadingMsg.messageID);
            return message.reply(toBI("❌ 𝖭𝗈 𝖠𝖯𝖪 𝖿𝗂𝗅𝖾𝗌 𝖿𝗈𝗎𝗇𝖽"));
          }
          fileUrl = `https://archive.org/download/${item.identifier}/${file.name}`;
          await message.unsendMessage(loadingMsg.messageID);
          return message.reply(toBI(`📱 𝖠𝖯𝖪 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽:\n${item.title || '𝖴𝗇𝗍𝗂𝗍𝗅𝖾𝖽'}\n🔗 ${fileUrl}`));
        } else if (type === "image") {
          file = files.find(f => /\.(jpe?g|png|gif|webp)$/i.test(f.name));
          if (!file) {
            await message.unsendMessage(loadingMsg.messageID);
            return message.reply(toBI("❌ 𝖭𝗈 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾𝗌 𝖿𝗈𝗎𝗇𝖽"));
          }
          fileUrl = `https://archive.org/download/${item.identifier}/${file.name}`;
          const ext = file.name.split(".").pop();
          const filePath = path.join(__dirname, "cache", `img_${Date.now()}.${ext}`);
          
          const res = await axios({ 
            url: fileUrl, 
            responseType: "stream",
            timeout: 30000 
          });
          
          const writer = fs.createWriteStream(filePath);
          await new Promise((resolve, reject) => {
            res.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
          });
          
          await message.unsendMessage(loadingMsg.messageID);
          await message.reply({ 
            body: toBI("✅ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽:"),
            attachment: fs.createReadStream(filePath) 
          });
          return deleteAfterTimeout(filePath);
        }

        if (!file) {
          await message.unsendMessage(loadingMsg.messageID);
          return message.reply(toBI("❌ 𝖭𝗈 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗅𝖾 𝖿𝗂𝗅𝖾 𝖿𝗈𝗎𝗇𝖽"));
        }

        fileUrl = `https://archive.org/download/${item.identifier}/${file.name}`;
        const ext = file.name.split(".").pop();
        const fileName = `archive_${Date.now()}.${ext}`;
        const filePath = path.join(__dirname, "cache", fileName);

        if (
          (type === "video" && duration <= 900) ||
          (type === "music" && duration <= 900)
        ) {
          const stream = await axios({ 
            url: fileUrl, 
            responseType: "stream",
            timeout: 60000 
          });
          
          const writer = fs.createWriteStream(filePath);
          await new Promise((resolve, reject) => {
            stream.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
          });

          await message.unsendMessage(loadingMsg.messageID);
          await message.reply({
            body: toBI(`📥 ${item.title || '𝖴𝗇𝗍𝗂𝗍𝗅𝖾𝖽'}\n🕒 ${formatSeconds(duration)}\n✅ 𝖥𝗂𝗅𝖾 𝖺𝗍𝗍𝖺𝖼𝗁𝖾𝖽`),
            attachment: fs.createReadStream(filePath)
          });

          deleteAfterTimeout(filePath);
        } else {
          await message.unsendMessage(loadingMsg.messageID);
          await message.reply(
            toBI(`📦 ${item.title || '𝖴𝗇𝗍𝗂𝗍𝗅𝖾𝖽'}\n🕒 ${formatSeconds(duration)}\n🔗 ${fileUrl}`)
          );
        }

      } catch (metaError) {
        await message.unsendMessage(loadingMsg.messageID);
        console.error("𝖠𝗋𝖼𝗁𝗂𝗏𝖾 𝗆𝖾𝗍𝖺𝖽𝖺𝗍𝖺 𝖾𝗋𝗋𝗈𝗋:", metaError);
        message.reply(toBI("❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗂𝗅𝖾 𝖽𝖺𝗍𝖺"));
      }

    } catch (err) {
      console.error("💥 𝖠𝗋𝖼𝗁𝗂𝗏𝖾 𝗋𝖾𝗉𝗅𝗒 𝖾𝗋𝗋𝗈𝗋:", err);
      message.reply(toBI("❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗂𝗅𝖾 𝖽𝖺𝗍𝖺"));
    }
  }
};
