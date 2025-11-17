const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "weeb",
    aliases: [],
    version: "1.0.0",
    author: "𝗔𝗦𝗜𝗙 𝗠𝗔𝗛𝗠𝗨𝗗",
    countDown: 5,
    role: 0,
    category: "anime",
    shortDescription: {
      en: "🎌 Get various anime-style images"
    },
    longDescription: {
      en: "Get waifu, neko, shinobu, megumin, cosplay, and couple profile pictures"
    },
    guide: {
      en: "{p}weeb [waifu|neko|shinobu|megumin|cosplay|couplepp]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, args }) {
    const commands = {
      waifu: {
        url: 'https://api.waifu.pics/sfw/waifu',
        count: 5,
        message: "🌸 Here are your waifu images!"
      },
      neko: {
        url: 'https://api.waifu.pics/sfw/neko', 
        count: 5,
        message: "😺 Here are your neko images!"
      },
      shinobu: {
        url: 'https://api.waifu.pics/sfw/shinobu',
        count: 5,
        message: "🦋 Here are your Shinobu images!"
      },
      megumin: {
        url: 'https://api.waifu.pics/sfw/megumin',
        count: 5,
        message: "💥 Here are your Megumin images!"
      },
      cosplay: {
        url: 'https://fantox-cosplay-api.onrender.com/',
        count: 5,
        message: "🎭 Here are your cosplay images!"
      },
      couplepp: {
        url: 'https://smiling-hosiery-bear.cyclic.app/weeb/couplepp',
        count: 2,
        message: "💞 She/he don't love you :)"
      }
    };

    if (!args[0]) {
      const availableCommands = Object.keys(commands).join(', ');
      return message.reply(
        `🎌 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗪𝗘𝗘𝗕 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n\n` +
        `• ${availableCommands}\n\n` +
        `💡 𝗨𝗦𝗔𝗚𝗘: {p}weeb [command]\n` +
        `📝 𝗘𝗫𝗔𝗠𝗣𝗟𝗘: {p}weeb waifu`
      );
    }

    const command = args[0].toLowerCase();
    
    if (!commands[command]) {
      return message.reply(
        `❌ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗\n\n` +
        `Available commands: ${Object.keys(commands).join(', ')}`
      );
    }

    const config = commands[command];

    try {
      if (command === 'couplepp') {
        await message.reply(config.message);
        const result = await axios.get(config.url);
        
        await message.reply({
          body: "👨 𝗙𝗢𝗥 𝗠𝗔𝗡",
          attachment: await global.utils.getStreamFromURL(result.data.male)
        });
        
        await message.reply({
          body: "👩 𝗙𝗢𝗥 𝗪𝗢𝗠𝗔𝗡", 
          attachment: await global.utils.getStreamFromURL(result.data.female)
        });
        
      } else if (command === 'cosplay') {
        for (let i = 0; i < config.count; i++) {
          try {
            const response = await axios.get(config.url, { responseType: 'arraybuffer', timeout: 10000 });
            const imagePath = `./cosplay_${Date.now()}_${i}.jpg`;
            await fs.writeFile(imagePath, response.data);
            
            await message.reply({
              body: i === 0 ? config.message : `🎭 Cosplay image ${i + 1}`,
              attachment: fs.createReadStream(imagePath)
            });
            
            // Clean up file after sending
            setTimeout(async () => {
              try {
                if (await fs.pathExists(imagePath)) {
                  await fs.unlink(imagePath);
                }
              } catch (cleanupError) {
                console.log("Cleanup error:", cleanupError);
              }
            }, 3000);
            
          } catch (imageError) {
            console.error(`Error fetching cosplay image ${i + 1}:`, imageError);
            continue; // Continue with next image even if one fails
          }
        }
        
      } else {
        for (let i = 0; i < config.count; i++) {
          try {
            const response = await axios.get(config.url, { timeout: 10000 });
            const imageUrl = response.data.url;
            
            await message.reply({
              body: i === 0 ? config.message : `${config.message.split('!')[0]} ${i + 1}!`,
              attachment: await global.utils.getStreamFromURL(imageUrl)
            });
            
            // Add small delay between images to avoid rate limiting
            if (i < config.count - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (imageError) {
            console.error(`Error fetching ${command} image ${i + 1}:`, imageError);
            continue; // Continue with next image even if one fails
          }
        }
      }
      
    } catch (error) {
      console.error(`Weeb Command Error (${command}):`, error);
      await message.reply(`❌ 𝗘𝗥𝗥𝗢𝗥\n\nFailed to fetch ${command} images. Please try again later.`);
    }
  }
};
