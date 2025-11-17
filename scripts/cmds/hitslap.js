const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "hitslap",
    aliases: [],
    version: "1.0.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐒𝐥𝐚𝐩 𝐬𝐨𝐦𝐞𝐨𝐧𝐞 𝐲𝐨𝐮 𝐭𝐚𝐠"
    },
    longDescription: {
      en: "𝐒𝐥𝐚𝐩𝐬 𝐭𝐡𝐞 𝐩𝐞𝐫𝐬𝐨𝐧 𝐲𝐨𝐮 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐰𝐢𝐭𝐡 𝐚 𝐆𝐈𝐅"
    },
    category: "fun",
    guide: {
      en: "{p}hitslap [tag]"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Check if someone is mentioned
      if (Object.keys(event.mentions).length === 0) {
        return api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝟏 𝐩𝐞𝐫𝐬𝐨𝐧 𝐭𝐨 𝐬𝐥𝐚𝐩", event.threadID, event.messageID);
      }
      
      const mention = Object.keys(event.mentions)[0];
      const tag = event.mentions[mention].replace("@", "");
      
      const gifLinks = [    
        "https://i.postimg.cc/9QLrR9G4/12334wrwd534wrdf-3.gif",
        "https://i.postimg.cc/pTFT6138/12334wrwd534wrdf-8.gif", 
        "https://i.postimg.cc/L5VHddDq/slap-anime.gif",
        "https://i.postimg.cc/K8jmWHMz/VW0cOyL.gif",
      ];
      
      const randomLink = gifLinks[Math.floor(Math.random() * gifLinks.length)];
      const cacheDir = __dirname + "/cache";
      const gifPath = __dirname + "/cache/slap.gif";
      
      // Create cache directory if it doesn't exist
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      console.log(`𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐆𝐈𝐅 𝐟𝐫𝐨𝐦: ${randomLink}`);
      
      // Download GIF using axios
      const response = await axios({
        method: 'GET',
        url: randomLink,
        responseType: 'stream'
      });
      
      // Save GIF to file
      const writer = fs.createWriteStream(gifPath);
      response.data.pipe(writer);
      
      writer.on('finish', () => {
        api.sendMessage({
          body: `𝐒𝐥𝐚𝐩𝐩𝐞𝐝 ${tag}! 😏`,
          mentions: [{ tag: tag, id: mention }],
          attachment: fs.createReadStream(gifPath)
        }, event.threadID, (err) => {
          // Clean up file after sending
          try {
            if (fs.existsSync(gifPath)) {
              fs.unlinkSync(gifPath);
            }
          } catch (cleanupError) {
            console.error("𝐂𝐥𝐞𝐚𝐧𝐮𝐩 𝐞𝐫𝐫𝐨𝐫:", cleanupError);
          }
          
          if (err) {
            console.error("𝐒𝐞𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", err);
          }
        });
      });
      
      writer.on('error', (error) => {
        console.error("𝐖𝐫𝐢𝐭𝐞 𝐞𝐫𝐫𝐨𝐫:", error);
        api.sendMessage("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐬𝐚𝐯𝐞 𝐆𝐈𝐅", event.threadID, event.messageID);
      });
        
    } catch (error) {
      console.error("𝐌𝐚𝐢𝐧 𝐞𝐫𝐫𝐨𝐫:", error);
      api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐬𝐥𝐚𝐩 𝐜𝐨𝐦𝐦𝐚𝐧𝐝", event.threadID, event.messageID);
    }
  }
};
