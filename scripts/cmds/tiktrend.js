const axios = require('axios');

async function getFeedList(region = 'np') {
  const url = 'https://tikwm.com/api/feed/list';
  const data = {
    count: 1,
    hd: 1,
    region: region || 'np'
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.code !== 0) {
      throw new Error('API request failed with message: ' + response.data.msg);
    }

    const topData = response.data.data[0];
    const formattedData = {
      region: topData.region,
      title: topData.title,
      duration: topData.duration,
      play: topData.play,
      play_count: topData.play_count,
      digg_count: topData.digg_count,
      comment_count: topData.comment_count,
      share_count: topData.share_count,
      download_count: topData.download_count,
      author: {
        id: topData.author.id,
        unique_id: topData.author.unique_id,
        nickname: topData.author.nickname
      }
    };

    return formattedData;
  } catch (error) {
    console.error('Error making the POST request:', error);
    throw error;
  }
}

module.exports = {
  config: {
    name: 'tiktrend',
    aliases: ['tttrend', 'tiktokvideo'],
    version: '1.2.0',
    author: '𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑',
    role: 0,
    category: 'media',
    shortDescription: {
      en: '📈 𝐹𝑒𝑡𝑐ℎ 𝑡𝑟𝑒𝑛𝑑𝑖𝑛𝑔 𝑇𝑖𝑘𝑇𝑜𝑘 𝑣𝑖𝑑𝑒𝑜𝑠'
    },
    longDescription: {
      en: '𝐺𝑒𝑡 𝑡𝑟𝑒𝑛𝑑𝑖𝑛𝑔 𝑇𝑖𝑘𝑇𝑜𝑘 𝑣𝑖𝑑𝑒𝑜𝑠 𝑏𝑦 𝑟𝑒𝑔𝑖𝑜𝑛'
    },
    guide: {
      en: '{p}tiktrend [𝑟𝑒𝑔𝑖𝑜𝑛] (𝐷𝑒𝑓𝑎𝑢𝑙𝑡: 𝑁𝑃)'
    },
    countDown: 5,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const region = args[0] || 'np';
      const processingMsg = await message.reply("⏳ | 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑇𝑟𝑒𝑛𝑑𝑖𝑛𝑔 𝑇𝑖𝑘𝑇𝑜𝑘 𝑉𝑖𝑑𝑒𝑜...");

      const videoData = await getFeedList(region);

      const caption = `
🌟 𝑇𝑟𝑒𝑛𝑑𝑖𝑛𝑔 𝑇𝑖𝑘𝑇𝑜𝑘 𝑉𝑖𝑑𝑒𝑜 🌟
🎬 𝑇𝑖𝑡𝑙𝑒: ${videoData.title}
🌍 𝑅𝑒𝑔𝑖𝑜𝑛: ${videoData.region}
⏱ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${videoData.duration} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠
▶️ 𝑃𝑙𝑎𝑦 𝐶𝑜𝑢𝑛𝑡: ${videoData.play_count}
👍 𝐿𝑖𝑘𝑒𝑠: ${videoData.digg_count}
💬 𝐶𝑜𝑚𝑚𝑒𝑛𝑡𝑠: ${videoData.comment_count}
🔗 𝑆ℎ𝑎𝑟𝑒𝑠: ${videoData.share_count}
📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑠: ${videoData.download_count}
👤 𝐴𝑢𝑡ℎ𝑜𝑟: ${videoData.author.nickname} (@${videoData.author.unique_id})`;

      await message.reply({
        body: caption,
        attachment: await global.utils.getStreamFromURL(videoData.play)
      });

      await api.unsendMessage(processingMsg.messageID);

    } catch (error) {
      console.error('𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑡𝑖𝑘𝑡𝑟𝑒𝑛𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:', error);
      await message.reply('❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑇𝑖𝑘𝑇𝑜𝑘 𝑡𝑟𝑒𝑛𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜. 𝑀𝑎𝑦𝑏𝑒 𝑟𝑒𝑔𝑖𝑜𝑛 𝑐𝑜𝑑𝑒 𝑖𝑠 𝑖𝑛𝑐𝑜𝑟𝑟𝑒𝑐𝑡.');
    }
  }
};
