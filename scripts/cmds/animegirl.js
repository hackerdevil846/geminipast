const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "animegirl",
    aliases: [],
    version: "5.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "🎀 𝐹𝑒𝑡𝑐ℎ𝑒𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠 𝑓𝑟𝑜𝑚 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑒𝑠"
    },
    guide: {
      en: "{p}animegirl [𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦]\n\n𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝐶𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑒𝑠:\n• 𝑤𝑎𝑖𝑓𝑢 (𝑑𝑒𝑓𝑎𝑢𝑙𝑡)\n• 𝑛𝑒𝑘𝑜\n• 𝑠ℎ𝑖𝑛𝑜𝑏𝑢\n• 𝑚𝑒𝑔𝑢𝑚𝑖𝑛"
    },
    countDown: 3,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, args }) {
    try {
      const availableCategories = ["waifu", "neko", "shinobu", "megumin"];
      const category = args[0] ? args[0].toLowerCase() : 'waifu';
      
      if (!availableCategories.includes(category)) {
        return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦!\n\n𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒: ${availableCategories.join(', ')}`);
      }

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const imagePath = path.join(cacheDir, `anime_${Date.now()}.jpg`);

      // Primary API
      try {
        const response = await axios.get(`https://nekos.best/api/v2/${category}`);
        const result = response.data.results[0];
        const caption = `🎀 𝑅𝑎𝑛𝑑𝑜𝑚 ${result.anime_name || this.capitalize(category)} 𝑃𝑖𝑐𝑡𝑢𝑟𝑒 🎀\n\n𝐴𝑟𝑡𝑖𝑠𝑡: ${result.artist_name}\n🔗 𝑆𝑜𝑢𝑟𝑐𝑒: ${result.source_url}`;
        
        // Download image
        const imageResponse = await axios.get(result.url, {
          responseType: 'arraybuffer'
        });
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
        
        await message.reply({
          body: caption,
          attachment: fs.createReadStream(imagePath)
        });
        
        fs.unlinkSync(imagePath);
        return;
        
      } catch (error) {
        console.error(`𝑃𝑟𝑖𝑚𝑎𝑟𝑦 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑 𝑓𝑜𝑟 ${category}:`, error.message);
      }

      // Secondary API
      try {
        if (category === 'waifu' || category === 'neko') {
          const response = await axios.get(`https://api.waifu.pics/sfw/${category}`);
          const caption = `🎀 𝑅𝑎𝑛𝑑𝑜𝑚 ${this.capitalize(category)} 𝑃𝑖𝑐𝑡𝑢𝑟𝑒 🎀\n\n(𝐵𝑎𝑐𝑘𝑢𝑝 𝐴𝑃𝐼)`;
          
          const imageResponse = await axios.get(response.data.url, {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
          
          await message.reply({
            body: caption,
            attachment: fs.createReadStream(imagePath)
          });
          
          fs.unlinkSync(imagePath);
          return;
        }
      } catch (error) {
        console.error(`𝑆𝑒𝑐𝑜𝑛𝑑𝑎𝑟𝑦 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑 𝑓𝑜𝑟 ${category}:`, error.message);
      }

      // Static backup APIs (SFW only)
      const backupApis = [
            "https://nekos.best/api/v2/happy",
            "https://nekos.best/api/v2/dance",
            "https://api.otakugifs.xyz/gif?reaction=kiss",
            "https://api.otakugifs.xyz/gif/allreactions",
            "https://nekos.best/api/v2/cry",
            "https://nekos.best/api/v2/bite",
            "https://nekos.best/api/v2/blush",
            "https://nekos.best/api/v2/cuddle",
            "https://nekos.best/api/v2/dance",
            "https://nekos.best/api/v2/facepalm",
            "https://nekos.best/api/v2/handhold",
            "https://nekos.best/api/v2/hug",
            "https://nekos.best/api/v2/kiss",
            "https://nekos.best/api/v2/laugh",
            "https://nekos.best/api/v2/nom",
            "https://nekos.best/api/v2/pat",
            "https://nekos.best/api/v2/poke",
            "https://nekos.best/api/v2/pout",
            "https://nekos.best/api/v2/punch",
            "https://nekos.best/api/v2/run",
            "https://nekos.best/api/v2/shrug",
            "https://nekos.best/api/v2/slap",
            "https://nekos.best/api/v2/sleep",
            "https://nekos.best/api/v2/smile",
            "https://nekos.best/api/v2/smug",
            "https://nekos.best/api/v2/stare",
            "https://nekos.best/api/v2/thumbsup",
            "https://nekos.best/api/v2/tickle",
            "https://nekos.best/api/v2/wave",
            "https://nekos.best/api/v2/wink",
            "https://nekos.best/api/v2/yawn",
            "https://api.waifu.pics/sfw/happy",
            "https://api.waifu.pics/sfw/wink",
            "https://api.waifu.pics/sfw/wave",
            "https://api.waifu.pics/sfw/smug",
            "https://api.waifu.pics/sfw/smile",
            "https://api.waifu.pics/sfw/slap",
            "https://api.waifu.pics/sfw/poke",
            "https://api.waifu.pics/sfw/pat",
            "https://api.waifu.pics/sfw/nom",
            "https://api.waifu.pics/sfw/lick",
            "https://api.waifu.pics/sfw/kiss",
            "https://api.waifu.pics/sfw/hug",
            "https://api.waifu.pics/sfw/happy",
            "https://api.waifu.pics/sfw/handhold",
            "https://api.waifu.pics/sfw/dance",
            "https://api.waifu.pics/sfw/cuddle",
            "https://api.waifu.pics/sfw/cry",
            "https://api.waifu.pics/sfw/blush",
            "https://api.waifu.pics/sfw/bite",
            "https://nekos.life/api/v2/img/neko",
            "https://nekobot.xyz/api/image?type=neko",
            // SFW APIs only
            "https://nekos.moe/api/v1/random/image?tags=neko"
        ];

      try {
        const randomApi = backupApis[Math.floor(Math.random() * backupApis.length)];
        const caption = `🎀 𝑅𝑎𝑛𝑑𝑜𝑚 𝐴𝑛𝑖𝑚𝑒 𝑃𝑖𝑐𝑡𝑢𝑟𝑒 🎀\n\n(𝑈𝑠𝑖𝑛𝑔 𝑏𝑎𝑐𝑘𝑢𝑝 𝐴𝑃𝐼)`;
        
        let imageUrl;
        
        if (randomApi.includes('nekos.best') || randomApi.includes('nekos.life')) {
          const response = await axios.get(randomApi);
          imageUrl = response.data.url || response.data.message;
        } else if (randomApi.includes('waifu.pics')) {
          const response = await axios.get(randomApi);
          imageUrl = response.data.url;
        } else if (randomApi.includes('otakugifs.xyz')) {
          const response = await axios.get(randomApi);
          imageUrl = response.data.url;
        } else if (randomApi.includes('nekobot.xyz')) {
          const response = await axios.get(randomApi);
          imageUrl = response.data.message;
        }

        if (imageUrl) {
          const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
          });
          fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
          
          await message.reply({
            body: caption,
            attachment: fs.createReadStream(imagePath)
          });
          
          fs.unlinkSync(imagePath);
        } else {
          throw new Error("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑒𝑥𝑡𝑟𝑎𝑐𝑡 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑓𝑟𝑜𝑚 𝑏𝑎𝑐𝑘𝑢𝑝 𝐴𝑃𝐼");
        }
        
      } catch (finalError) {
        console.error("𝐴𝑙𝑙 𝑏𝑎𝑐𝑘𝑢𝑝 𝑠𝑦𝑠𝑡𝑒𝑚𝑠 𝑓𝑎𝑖𝑙𝑒𝑑:", finalError);
        await message.reply("❌ 𝐼'𝑚 𝑠𝑜𝑟𝑟𝑦, 𝑏𝑢𝑡 𝑎𝑙𝑙 𝑖𝑚𝑎𝑔𝑒 𝑠𝑜𝑢𝑟𝑐𝑒𝑠 𝑎𝑟𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }

    } catch (error) {
      console.error("𝐴𝑛𝑖𝑚𝑒𝑔𝑖𝑟𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};

module.exports.capitalize = function(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
