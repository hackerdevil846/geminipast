const https = require('https');

module.exports = {
  config: {
    name: "animesearch",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "𝑚𝑒𝑑𝑖𝑎",
    shortDescription: {
      en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑖𝑚𝑒 𝑖𝑛𝑓𝑜"
    },
    longDescription: {
      en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑖𝑚𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑢𝑠𝑖𝑛𝑔 𝐴𝑛𝑖𝑚𝑒𝐷𝐵 𝐴𝑃𝐼"
    },
    guide: {
      en: "{p}animesearch [anime name]"
    },
    priority: 0
  },

  onStart: async function({ message, args, event }) {
    const searchTerm = args.join(" ") || "Fullmetal";

    try {
      const animeData = await fetchAnimeData(searchTerm);

      if (!animeData.data || !Array.isArray(animeData.data) || animeData.data.length === 0) {
        return await message.reply(`❌ 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟: ${searchTerm}`);
      }

      let resultMsg = `✨ 𝐴𝑛𝑖𝑚𝑒 𝑆𝑒𝑎𝑟𝑐ℎ 𝑅𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑟: *"${searchTerm}"* ✨\n\n`;

      animeData.data.forEach((anime, index) => {
        resultMsg += `🔹 ${index + 1}. ${anime.title || anime.name || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑇𝑖𝑡𝑙𝑒'}\n`;
        if (anime.synopsis) {
          resultMsg += `   📖 ${anime.synopsis.substring(0, 100)}...\n`;
        }
        if (anime.type) {
          resultMsg += `   🎬 𝑇𝑦𝑝𝑒: ${anime.type}\n`;
        }
        if (anime.episodes) {
          resultMsg += `   🎞 𝐸𝑝𝑖𝑠𝑜𝑑𝑒𝑠: ${anime.episodes}\n`;
        }
        if (anime.status) {
          resultMsg += `   📌 𝑆𝑡𝑎𝑡𝑢𝑠: ${anime.status}\n`;
        }
        resultMsg += "\n";
      });

      await message.reply(resultMsg);

    } catch (error) {
      console.error("𝐴𝑛𝑖𝑚𝑒𝑆𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply(`⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑑𝑎𝑡𝑎: ${error.message}`);
    }
  }
};

// =======================
// 𝐻𝑒𝑙𝑝𝑒𝑟 𝐹𝑢𝑛𝑐𝑡𝑖𝑜𝑛
// =======================
async function fetchAnimeData(searchTerm = "Fullmetal") {
  const options = {
    method: 'GET',
    hostname: 'anime-db.p.rapidapi.com',
    port: 443,
    path: `/anime?page=1&size=10&search=${encodeURIComponent(searchTerm)}&genres=Fantasy%2CDrama&sortBy=ranking&sortOrder=asc`,
    headers: {
      'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
      'x-rapidapi-host': 'anime-db.p.rapidapi.com'
    },
    timeout: 10000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`𝐴𝑃𝐼 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑓𝑎𝑖𝑙𝑒𝑑 𝑤𝑖𝑡ℎ 𝑠𝑡𝑎𝑡𝑢𝑠 𝑐𝑜𝑑𝑒: ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        try {
          const data = JSON.parse(body);
          resolve(data);
        } catch {
          reject(new Error('𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑎𝑟𝑠𝑒 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑎𝑠 𝐽𝑆𝑂𝑁'));
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡 𝑎𝑓𝑡𝑒𝑟 10 𝑠𝑒𝑐𝑜𝑛𝑑𝑠'));
    });

    req.end();
  });
}
