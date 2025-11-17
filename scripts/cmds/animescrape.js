const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

module.exports = {
  config: {
    name: "animescrape",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "anime",
    shortDescription: {
      en: "𝑺𝒄𝒓𝒂𝒑𝒆 𝒂𝒏𝒊𝒎𝒆 𝒕𝒐𝒓𝒓𝒆𝒏𝒕 𝒍𝒊𝒏𝒌𝒔"
    },
    longDescription: {
      en: "𝑺𝒄𝒓𝒂𝒑𝒆𝒔 𝒂𝒏𝒊𝒎𝒆 𝒕𝒐𝒓𝒓𝒆𝒏𝒕 𝒍𝒊𝒏𝒌𝒔 𝒇𝒓𝒐𝒎 𝒏𝒚𝒂𝒂.𝒔𝒊"
    },
    guide: {
      en: "{p}animescrape [𝒂𝒏𝒊𝒎𝒆 𝒕𝒊𝒕𝒍𝒆]"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, args }) {
    try {
      if (!args[0]) {
        return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂𝒏 𝒂𝒏𝒊𝒎𝒆 𝒕𝒊𝒕𝒍𝒆!");
      }

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, "torrent-links.txt");
      const text = args.join(" ");
      const url = `https://nyaa.si/?f=0&c=1_2&q=${encodeURIComponent(text)}`;

      // Show processing message
      await message.reply("🔍 𝑺𝒄𝒓𝒂𝒑𝒊𝒏𝒈 𝒂𝒏𝒊𝒎𝒆 𝒕𝒐𝒓𝒓𝒆𝒏𝒕 𝒍𝒊𝒏𝒌𝒔...");

      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(data);
      const results = [];
      
      $(".table-responsive table tbody tr").each((idx, el) => {
        if (idx < 5) {
          const name = $(el).find("td a").first().text().trim();
          const torrentLink = $(el).find("a[href$='.torrent']").attr("href");
          const size = $(el).find("td.text-center").eq(1).text().trim();
          
          if (name && torrentLink) {
            results.push({ 
              name, 
              torrentLink: `https://nyaa.si${torrentLink}`,
              size: size || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏"
            });
          }
        }
      });

      if (results.length === 0) {
        return message.reply("❌ 𝑵𝒐 𝒓𝒆𝒔𝒖𝒍𝒕𝒔 𝒇𝒐𝒖𝒏𝒅 𝒇𝒐𝒓: " + text);
      }

      let fileContent = "🎌 𝑨𝒏𝒊𝒎𝒆 𝑻𝒐𝒓𝒓𝒆𝒏𝒕 𝑳𝒊𝒏𝒌𝒔 🎌\n\n";
      fileContent += `𝑺𝒆𝒂𝒓𝒄𝒉 𝑻𝒆𝒓𝒎: ${text}\n`;
      fileContent += `𝑻𝒐𝒕𝒂𝒍 𝑹𝒆𝒔𝒖𝒍𝒕𝒔: ${results.length}\n\n`;
      fileContent += "═" .repeat(40) + "\n\n";

      results.forEach((item, index) => {
        fileContent += `📺 𝑻𝒊𝒕𝒍𝒆 ${index + 1}: ${item.name}\n`;
        fileContent += `💾 𝑺𝒊𝒛𝒆: ${item.size}\n`;
        fileContent += `🔗 𝑻𝒐𝒓𝒓𝒆𝒏𝒕: ${item.torrentLink}\n\n`;
        fileContent += "─" .repeat(40) + "\n\n";
      });

      fileContent += `📝 𝑵𝒐𝒕𝒆: 𝑻𝒉𝒊𝒔 𝒅𝒂𝒕𝒂 𝒘𝒂𝒔 𝒔𝒄𝒓𝒂𝒑𝒆𝒅 𝒇𝒓𝒐𝒎 𝒏𝒚𝒂𝒂.𝒔𝒊\n`;
      fileContent += `⏰ 𝑫𝒂𝒕𝒆: ${new Date().toLocaleString()}`;

      fs.writeFileSync(filePath, fileContent);

      await message.reply({
        body: `✅ 𝑺𝒄𝒓𝒂𝒑𝒊𝒏𝒈 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍!\n\n` +
              `𝑭𝒐𝒖𝒏𝒅 ${results.length} 𝒕𝒐𝒓𝒓𝒆𝒏𝒕 𝒍𝒊𝒏𝒌𝒔 𝒇𝒐𝒓 "${text}"\n` +
              `𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒕𝒉𝒆 𝒂𝒕𝒕𝒂𝒄𝒉𝒆𝒅 𝒇𝒊𝒍𝒆 𝒇𝒐𝒓 𝒄𝒐𝒎𝒑𝒍𝒆𝒕𝒆 𝒅𝒆𝒕𝒂𝒊𝒍𝒔.`,
        attachment: fs.createReadStream(filePath)
      });

      // Clean up
      fs.unlinkSync(filePath);

    } catch (error) {
      console.error("Animescrape error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒔𝒄𝒓𝒂𝒑𝒊𝒏𝒈. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
