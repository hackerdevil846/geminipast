const axios = require('axios');

module.exports = {
  config: {
    name: "lyricsv2",
    aliases: ["songlyrics2", "lyricv2"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "music",
    shortDescription: {
      en: "🎵 𝐺𝑒𝑡 𝑙𝑦𝑟𝑖𝑐𝑠 𝑜𝑓 𝑎 𝑠𝑜𝑛𝑔 (𝑉2)"
    },
    longDescription: {
      en: "𝐹𝑒𝑡𝑐ℎ 𝑙𝑦𝑟𝑖𝑐𝑠 𝑓𝑜𝑟 𝑎𝑛𝑦 𝑠𝑜𝑛𝑔 𝑢𝑠𝑖𝑛𝑔 𝑎𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝐴𝑃𝐼 (𝑉𝑒𝑟𝑠𝑖𝑜𝑛 2)"
    },
    guide: {
      en: "{p}lyricsv2 [𝑠𝑜𝑛𝑔 𝑛𝑎𝑚𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const songName = args.join(" ");
      
      if (!songName) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑡ℎ𝑒 𝑛𝑎𝑚𝑒 𝑜𝑓 𝑡ℎ𝑒 𝑠𝑜𝑛𝑔 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑓𝑖𝑛𝑑 𝑙𝑦𝑟𝑖𝑐𝑠 𝑓𝑜𝑟.");
      }

      // Using a different API endpoint for V2 to avoid conflict
       const res = await axios.get(`https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`);
      const data = res.data;

      if (data.lyrics) {
        const lyrics = data.lyrics;
        
        // Extract title and artist from the song name or use the API response
        const title = songName;
        const artist = data.artist || "Unknown Artist";

        const reply = `🎵 𝑇𝑖𝑡𝑙𝑒: ${title} \n🎤 𝐴𝑟𝑡𝑖𝑠𝑡: ${artist}\n\n📝 𝐿𝑦𝑟𝑖𝑐𝑠: \n${lyrics}`;

        await message.reply(reply);
      } else {
        await message.reply("❌ 𝐿𝑦𝑟𝑖𝑐𝑠 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑎𝑡 𝑠𝑜𝑛𝑔.");
      }
    } catch (error) {
      console.error('𝐿𝑦𝑟𝑖𝑐𝑠 𝑉2 𝑒𝑟𝑟𝑜𝑟:', error);
      
      if (error.response?.status === 404) {
        await message.reply("❌ 𝑆𝑜𝑛𝑔 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑠𝑜𝑛𝑔 𝑛𝑎𝑚𝑒 𝑎𝑛𝑑 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
      } else {
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑙𝑦𝑟𝑖𝑐𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }
    }
  }
};
