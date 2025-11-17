const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "animerelease",
    aliases: [],
    version: "8.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "anime",
    shortDescription: {
      en: "🕒 𝖲𝗁𝖺𝗋𝖾𝗌 𝗍𝗁𝖾 𝗅𝖺𝗍𝖾𝗌𝗍 𝖺𝗇𝗂𝗆𝖾 𝗋𝖾𝗅𝖾𝖺𝗌𝖾𝗌."
    },
    longDescription: {
      en: "🕒 𝖲𝗁𝖺𝗋𝖾𝗌 𝗍𝗁𝖾 𝗅𝖺𝗍𝖾𝗌𝗍 𝖺𝗇𝗂𝗆𝖾 𝗋𝖾𝗅𝖾𝖺𝗌𝖾𝗌 𝖿𝖾𝗍𝖼𝗁𝖾𝖽 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨."
    },
    guide: {
      en: "{𝗉}𝖺𝗇𝗂𝗆𝖾𝗋𝖾𝗅𝖾𝖺𝗌𝖾"
    },
    dependencies: {
      "axios": "",
      "moment-timezone": ""
    }
  },

  onStart: async function({ message, event }) {
    try {
      const Timezone = 'Asia/Dhaka';
      const API_URL = 'https://api.jikan.moe/v4/schedules';

      const response = await axios.get(API_URL, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });

      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
        throw new Error('𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨');
      }

      const animeList = response.data.data;
      const currentTime = moment().tz(Timezone);
      const currentDay = currentTime.format('dddd').toLowerCase();

      let upcomingAnime = [];
      let updatedAnime = [];

      for (const anime of animeList) {
        if (!anime.broadcast || !anime.broadcast.day) continue;

        const animeDay = anime.broadcast.day.toLowerCase();
        const animeTime = anime.broadcast.time || 'Unknown';
        const title = anime.title || anime.title_english || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇';
        const episode = anime.episodes ? `𝖤𝗉𝗂𝗌𝗈𝖽𝖾 ${anime.episodes}` : '𝖮𝗇𝗀𝗈𝗂𝗇𝗀';

        const release = {
          animeTitle: title,
          episode: episode,
          time: this.convertJSTtoDhaka(animeTime, Timezone),
          status: 'upcoming'
        };

        if (animeDay === currentDay) {
          const releaseTime = moment(animeTime, 'HH:mm').tz(Timezone);
          if (releaseTime.isValid() && releaseTime.isBefore(currentTime)) {
            release.status = 'already updated';
            updatedAnime.push(release);
          } else {
            upcomingAnime.push(release);
          }
        } else {
          const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const currentDayIndex = daysOfWeek.indexOf(currentDay);
          const animeDayIndex = daysOfWeek.indexOf(animeDay);
          
          if (animeDayIndex > currentDayIndex && animeDayIndex - currentDayIndex <= 2) {
            upcomingAnime.push(release);
          }
        }
      }

      upcomingAnime.sort((a, b) => {
        const timeA = moment(a.time, 'h:mma');
        const timeB = moment(b.time, 'h:mma');
        return timeA.diff(timeB);
      });

      updatedAnime.sort((a, b) => {
        const timeA = moment(a.time, 'h:mma');
        const timeB = moment(b.time, 'h:mma');
        return timeA.diff(timeB);
      });

      let messageText = `🕒 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝖳𝗂𝗆𝖾 (𝖠𝗌𝗂𝖺/𝖣𝗁𝖺𝗄𝖺): ${currentTime.format('h:mm A')}\n`;
      messageText += `📅 𝖣𝖺𝗒: ${currentTime.format('dddd, MMMM D, YYYY')}\n\n`;

      if (upcomingAnime.length > 0) {
        messageText += '🎬 𝗔𝗡𝗜𝗠𝗘 𝗨𝗣𝗖𝗢𝗠𝗜𝗡𝗚 𝗧𝗛𝗜𝗦 𝗙𝗘𝗪 𝗛𝗢𝗨𝗥𝗦 🎬\n\n';
        
        for (let i = 0; i < Math.min(8, upcomingAnime.length); i++) {
          const anime = upcomingAnime[i];
          messageText += `🎭 𝖠𝗇𝗂𝗆𝖾: ${anime.animeTitle}\n`;
          messageText += `📺 𝖤𝗉𝗂𝗌𝗈𝖽𝖾: ${anime.episode}\n`;
          messageText += `⏰ 𝖳𝗂𝗆𝖾: ${anime.time}\n`;
          messageText += `───────────────\n`;
        }
        
        if (upcomingAnime.length > 8) {
          messageText += `\n📊 ...𝖺𝗇𝖽 ${upcomingAnime.length - 8} 𝗆𝗈𝗋𝖾 𝗎𝗉𝖼𝗈𝗆𝗂𝗇𝗀 𝗋𝖾𝗅𝖾𝖺𝗌𝖾𝗌\n`;
        }
      }

      if (updatedAnime.length > 0) {
        messageText += '\n✅ 𝗔𝗡𝗜𝗠𝗘 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 ✅\n\n';
        
        for (let i = 0; i < Math.min(8, updatedAnime.length); i++) {
          const anime = updatedAnime[i];
          messageText += `🎭 𝖠𝗇𝗂𝗆𝖾: ${anime.animeTitle}\n`;
          messageText += `📺 𝖤𝗉𝗂𝗌𝗈𝖽𝖾: ${anime.episode}\n`;
          messageText += `⏰ 𝖳𝗂𝗆𝖾: ${anime.time}\n`;
          messageText += `───────────────\n`;
        }
        
        if (updatedAnime.length > 8) {
          messageText += `\n📊 ...𝖺𝗇𝖽 ${updatedAnime.length - 8} 𝗆𝗈𝗋𝖾 𝗎𝗉𝖽𝖺𝗍𝖾𝖽 𝗋𝖾𝗅𝖾𝖺𝗌𝖾𝗌\n`;
        }
      }

      if (upcomingAnime.length === 0 && updatedAnime.length === 0) {
        messageText += '📭 𝖭𝗈 𝖺𝗇𝗂𝗆𝖾 𝗋𝖾𝗅𝖾𝖺𝗌𝖾𝗌 𝖿𝗈𝗋 𝗍𝗈𝖽𝖺𝗒.';
      }

      messageText += '\n\n✨ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑';

      if (messageText.length > 2000) {
        messageText = messageText.substring(0, 1997) + '...';
      }

      await message.reply(messageText.trim());

    } catch (error) {
      console.error(`💥 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖺𝗇𝗂𝗆𝖾 𝗋𝖾𝗅𝖾𝖺𝗌𝖾𝗌:`, error.message);
      
      let errorMessage = '❌ 𝖲𝗈𝗆𝖾𝗍𝗁𝗂𝗇𝗀 𝗐𝖾𝗇𝗍 𝗐𝗋𝗈𝗇𝗀 𝗐𝗁𝗂𝗅𝖾 𝗍𝗋𝗒𝗂𝗇𝗀 𝗍𝗈 𝗌𝗁𝖺𝗋𝖾 𝗍𝗁𝖾 𝗅𝖺𝗍𝖾𝗌𝗍 𝖺𝗇𝗂𝗆𝖾 𝗋𝖾𝗅𝖾𝖺𝗌𝖾𝗌.\n\n';
      
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        errorMessage += '𝖱𝖾𝖺𝗌𝗈𝗇: 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍';
      } else if (error.response) {
        errorMessage += `𝖱𝖾𝖺𝗌𝗈𝗇: 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋 (${error.response.status})`;
      } else if (error.request) {
        errorMessage += '𝖱𝖾𝖺𝗌𝗈𝗇: 𝖭𝗈 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗋𝗈𝗆 𝗌𝖾𝗋𝗏𝖾𝗋';
      } else {
        errorMessage += '𝖱𝖾𝖺𝗌𝗈𝗇: 𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖾𝗋𝗋𝗈𝗋';
      }
      
      errorMessage += '\n\n𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.';
      
      await message.reply(errorMessage);
    }
  },

  convertJSTtoDhaka: function(jstTime, timezone) {
    try {
      if (!jstTime || jstTime === 'Unknown') return 'Unknown';
      
      const jstMoment = moment.tz(jstTime, 'HH:mm', 'Asia/Tokyo');
      const dhakaTime = jstMoment.clone().tz(timezone);
      
      return dhakaTime.format('h:mm A');
    } catch (error) {
      return 'Unknown';
    }
  }
};
