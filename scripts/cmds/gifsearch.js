const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "gifsearch",
    aliases: ["findgif", "giphysearch"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
      en: "🔍 𝑆𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠 𝑢𝑠𝑖𝑛𝑔 𝐺𝐼𝑃𝐻𝑌 𝐴𝑃𝐼"
    },
    longDescription: {
      en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑠𝑒𝑛𝑑 𝐺𝐼𝐹𝑠 𝑓𝑟𝑜𝑚 𝐺𝐼𝑃𝐻𝑌 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑦𝑜𝑢𝑟 𝑞𝑢𝑒𝑟𝑦"
    },
    guide: {
      en: "{p}gifsearch <𝑞𝑢𝑒𝑟𝑦>"
    }
  },

  onStart: async function ({ message, event, args }) {
    const { threadID, messageID } = event;
    
    if (!args.length) {
      return message.reply('❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠.');
    }

    const query = args.join(' ');
    const apiKey = 'QHv1qVaxy4LS3AmaNuUYNT9zr40ReFBI'; // Your GIPHY API key

    try {
      const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
          q: query,
          api_key: apiKey,
          limit: 5,
          rating: 'g'
        }
      });

      if (response.data.data && response.data.data.length > 0) {
        const gifResults = response.data.data;
        const gifAttachments = [];
        const tempFiles = [];

        for (let i = 0; i < Math.min(gifResults.length, 5); i++) {
          const gifData = gifResults[i];
          const gifURL = gifData.images.original.url;
          const timestamp = Date.now();
          const gifPath = path.join(__dirname, 'cache', `giphy_${timestamp}_${i}.gif`);
          
          // Create cache directory if it doesn't exist
          const cacheDir = path.join(__dirname, 'cache');
          if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
          }

          try {
            const gifResponse = await axios.get(gifURL, { 
              responseType: 'arraybuffer',
              timeout: 30000
            });
            
            await fs.writeFile(gifPath, Buffer.from(gifResponse.data, 'binary'));
            gifAttachments.push(fs.createReadStream(gifPath));
            tempFiles.push(gifPath);
          } catch (downloadError) {
            console.error(`Failed to download GIF ${i}:`, downloadError);
            continue; // Skip this GIF and continue with others
          }
        }

        if (gifAttachments.length > 0) {
          await message.reply({ 
            body: `✅ 𝐹𝑜𝑢𝑛𝑑 ${gifAttachments.length} 𝐺𝐼𝐹𝑠 𝑓𝑜𝑟 "${query}"`,
            attachment: gifAttachments,
            messageID: messageID
          });

          // Clean up cache files after sending
          setTimeout(() => {
            tempFiles.forEach(filePath => {
              if (fs.existsSync(filePath)) {
                try {
                  fs.unlinkSync(filePath);
                } catch (cleanupError) {
                  console.error('Cleanup error:', cleanupError);
                }
              }
            });
          }, 10000);

        } else {
          await message.reply('❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑦 𝐺𝐼𝐹𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.');
        }

      } else {
        await message.reply(`❌ 𝑁𝑜 𝐺𝐼𝐹𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 "${query}". 𝑇𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑟𝑚.`);
      }
    } catch (error) {
      console.error('𝐺𝐼𝐹 𝑆𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:', error);
      
      if (error.response) {
        await message.reply('❌ 𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.');
      } else if (error.request) {
        await message.reply('❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.');
      } else {
        await message.reply('❌ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑.');
      }
    }
  }
};
