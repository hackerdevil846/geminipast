const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "animepic",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "image",
    shortDescription: {
      en: "🎨 𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 (𝑆𝑎𝑓𝑒 𝐹𝑜𝑟 𝑊𝑜𝑟𝑘)"
    },
    longDescription: {
      en: "𝐹𝑒𝑡𝑐ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑏𝑦 𝑡𝑎𝑔 (𝑠𝑎𝑓𝑒 𝑓𝑜𝑟 𝑤𝑜𝑟𝑘)"
    },
    guide: {
      en: "{p}animepic [𝑡𝑎𝑔]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    try {
      const { threadID, messageID } = event;

      // Load anime data from custom path
      const animeDataPath = path.join(__dirname, 'cache', 'anime.json');
      
      if (!fs.existsSync(animeDataPath)) {
        return message.reply("❌ 𝐴𝑛𝑖𝑚𝑒 𝑑𝑎𝑡𝑎 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑏𝑜𝑡 𝑜𝑤𝑛𝑒𝑟.");
      }

      const animeData = JSON.parse(fs.readFileSync(animeDataPath, 'utf8'));

      // If no tag is provided or tag is invalid, show available tags
      if (args.length === 0 || !animeData.hasOwnProperty(args[0])) {
        const list = Object.keys(animeData);
        return message.reply(`🎭 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝐴𝑛𝑖𝑚𝑒 𝑇𝑎𝑔𝑠:\n${list.join(", ")}`);
      }

      // Get the anime image
      const imagePath = await this.getAnime(args[0]);

      // Send the image
      await message.reply({
        attachment: fs.createReadStream(imagePath)
      });

      // Delete the temporary file after sending
      fs.unlinkSync(imagePath);

    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡ℎ𝑒 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒!");
    }
  },

  getAnime: async function (type) {
    try {
      const animeDataPath = path.join(__dirname, 'cache', 'anime.json');
      const animeData = JSON.parse(fs.readFileSync(animeDataPath, 'utf8'));

      if (!animeData[type]) {
        throw new Error(`𝑇𝑎𝑔 "${type}" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑎𝑛𝑖𝑚𝑒 𝑑𝑎𝑡𝑎`);
      }

      const imageUrl = animeData[type];
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      
      const ext = path.extname(imageUrl) || '.jpg';
      const fileName = `anime_${Date.now()}${ext}`;
      const filePath = path.join(__dirname, 'cache', fileName);

      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, response.data);

      return filePath;
    } catch (e) {
      throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒: ${e.message}`);
    }
  },

  onLoad: async function () {
    try {
      const cacheDir = path.join(__dirname, 'cache');
      const animeDataPath = path.join(cacheDir, 'anime.json');

      // Sample anime data - you can replace this with your actual data
      const animeData = 
{
    "neko": "https://nekos.best/api/v2/neko",
    "waifu": "https://nekos.best/api/v2/waifu",
    "husbando": "https://nekos.best/api/v2/husbando",
    "kitsune": "https://nekos.best/api/v2/kitsune",
    "lurk": "https://nekos.best/api/v2/lurk",
    "shoot": "https://nekos.best/api/v2/shoot",
    "sleep": "https://nekos.best/api/v2/sleep",
    "shrug": "https://nekos.best/api/v2/shrug",
    "stare": "https://nekos.best/api/v2/stare",
    "wave": "https://nekos.best/api/v2/wave",
    "poke": "https://nekos.best/api/v2/poke",
    "smile": "https://nekos.best/api/v2/smile",
    "peck": "https://nekos.best/api/v2/peck",
    "wink": "https://nekos.best/api/v2/wink",
    "blush": "https://nekos.best/api/v2/blush",
    "smug": "https://nekos.best/api/v2/smug",
    "tickle": "https://nekos.best/api/v2/tickle",
    "yeet": "https://nekos.best/api/v2/yeet",
    "think": "https://nekos.best/api/v2/think",
    "highfive": "https://nekos.best/api/v2/highfive",
    "feed": "https://nekos.best/api/v2/feed",
    "bite": "https://nekos.best/api/v2/bite",
    "bored": "https://nekos.best/api/v2/bored",
    "nom": "https://nekos.best/api/v2/nom",
    "yawn": "https://nekos.best/api/v2/yawn",
    "facepalm": "https://nekos.best/api/v2/facepalm",
    "cuddle": "https://nekos.best/api/v2/cuddle",
    "kick": "https://nekos.best/api/v2/kick",
    "happy": "https://nekos.best/api/v2/happy",
    "hug": "https://nekos.best/api/v2/hug",
    "baka": "https://nekos.best/api/v2/baka",
    "pat": "https://nekos.best/api/v2/pat",
    "angry": "https://nekos.best/api/v2/angry",
    "run": "https://nekos.best/api/v2/run",
    "nod": "https://nekos.best/api/v2/nod",
    "nope": "https://nekos.best/api/v2/nope",
    "kiss": "https://nekos.best/api/v2/kiss",
    "dance": "https://nekos.best/api/v2/dance",
    "punch": "https://nekos.best/api/v2/punch",
    "handshake": "https://nekos.best/api/v2/handshake",
    "slap": "https://nekos.best/api/v2/slap",
    "cry": "https://nekos.best/api/v2/cry",
    "pout": "https://nekos.best/api/v2/pout",
    "handhold": "https://nekos.best/api/v2/handhold",
    "thumbsup": "https://nekos.best/api/v2/thumbsup",
    "laugh": "https://nekos.best/api/v2/laugh"
};

      await fs.ensureDir(cacheDir);
      await fs.writeFile(animeDataPath, JSON.stringify(animeData, null, 2));

    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑑𝑎𝑡𝑎:", error);
    }
  }
};
