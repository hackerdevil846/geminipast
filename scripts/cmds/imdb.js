const axios = require("axios");

module.exports = {
  config: {
    name: "imdb",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "search",
    shortDescription: {
      en: "🎬 𝖲𝖾𝖺𝗋𝖼𝗁 𝗆𝗈𝗏𝗂𝖾𝗌 𝖺𝗇𝖽 𝗌𝗁𝗈𝗐𝗌 𝗈𝗇 𝖨𝖬𝖣𝖻"
    },
    longDescription: {
      en: "𝖦𝖾𝗍 𝖽𝖾𝗍𝖺𝗂𝗅𝖾𝖽 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖺𝖻𝗈𝗎𝗍 𝗆𝗈𝗏𝗂𝖾𝗌 𝖺𝗇𝖽 𝖳𝖵 𝗌𝗁𝗈𝗐𝗌 𝖿𝗋𝗈𝗆 𝖨𝖬𝖣𝖻"
    },
    guide: {
      en: "{p}imdb [𝗆𝗈𝗏𝗂𝖾 𝗇𝖺𝗆𝖾]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      // Dependency check
      let axiosAvailable = true;
      try {
        require("axios");
      } catch (e) {
        axiosAvailable = false;
      }

      if (!axiosAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
      }

      if (!args[0]) {
        return message.reply("🎬 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗆𝗈𝗏𝗂𝖾 𝗈𝗋 𝗌𝗁𝗈𝗐 𝗇𝖺𝗆𝖾 𝗍𝗈 𝗌𝖾𝖺𝗋𝖼𝗁.");
      }

      const movieName = args.join(" ").trim();
      
      if (movieName.length < 2) {
        return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗆𝗈𝗏𝗂𝖾 𝗇𝖺𝗆𝖾 (𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 2 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌).");
      }

      const loadingMsg = await message.reply("🔍 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖨𝖬𝖣𝖻...");

      try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(movieName)}&plot=full`, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const imdbData = response.data;

        if (imdbData.Response === "False") {
          await message.unsend(loadingMsg.messageID);
          return message.reply("❌ 𝖬𝗈𝗏𝗂𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝗇𝖺𝗆𝖾 𝖺𝗇𝖽 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }

        // Format the movie information with your exact banner style
        let imdbInfo = "⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n";
        imdbInfo += " ``` 𝕀𝕄𝔻𝔹 𝕊𝔼𝔸ℝℂℍ```\n";
        imdbInfo += "⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n";
        imdbInfo += "🎬 𝖳𝗂𝗍𝗅𝖾: " + (imdbData.Title || "𝖭/𝖠") + "\n";
        imdbInfo += "📅 𝖸𝖾𝖺𝗋: " + (imdbData.Year || "𝖭/𝖠") + "\n";
        imdbInfo += "⭐ 𝖱𝖺𝗍𝗂𝗇𝗀: " + (imdbData.Rated || "𝖭/𝖠") + "\n";
        imdbInfo += "📆 𝖱𝖾𝗅𝖾𝖺𝗌𝖾: " + (imdbData.Released || "𝖭/𝖠") + "\n";
        imdbInfo += "⏳ 𝖱𝗎𝗇𝗍𝗂𝗆𝖾: " + (imdbData.Runtime || "𝖭/𝖠") + "\n";
        imdbInfo += "🌀 𝖦𝖾𝗇𝗋𝖾: " + (imdbData.Genre || "𝖭/𝖠") + "\n";
        imdbInfo += "👨🏻‍💻 𝖣𝗂𝗋𝖾𝖼𝗍𝗈𝗋: " + (imdbData.Director || "𝖭/𝖠") + "\n";
        imdbInfo += "✍ 𝖶𝗋𝗂𝗍𝖾𝗋𝗌: " + (imdbData.Writer || "𝖭/𝖠") + "\n";
        imdbInfo += "👨 𝖠𝖼𝗍𝗈𝗋𝗌: " + (imdbData.Actors || "𝖭/𝖠") + "\n";
        imdbInfo += "📃 𝖲𝗒𝗇𝗈𝗉𝗌𝗂𝗌: " + (imdbData.Plot || "𝖭/𝖠") + "\n";
        imdbInfo += "🌐 𝖫𝖺𝗇𝗀𝗎𝖺𝗀𝖾: " + (imdbData.Language || "𝖭/𝖠") + "\n";
        imdbInfo += "🌍 𝖢𝗈𝗎𝗇𝗍𝗋𝗒: " + (imdbData.Country || "𝖭/𝖠") + "\n";
        imdbInfo += "🎖️ 𝖠𝗐𝖺𝗋𝖽𝗌: " + (imdbData.Awards || "𝖭/𝖠") + "\n";
        imdbInfo += "📦 𝖡𝗈𝗑𝖮𝖿𝖿𝗂𝖼𝖾: " + (imdbData.BoxOffice || "𝖭/𝖠") + "\n";
        imdbInfo += "🏙️ 𝖯𝗋𝗈𝖽𝗎𝖼𝗍𝗂𝗈𝗇: " + (imdbData.Production || "𝖭/𝖠") + "\n";
        imdbInfo += "🌟 𝖨𝖬𝖣𝖻 𝖲𝖼𝗈𝗋𝖾: " + (imdbData.imdbRating || "𝖭/𝖠") + "\n";
        imdbInfo += "❎ 𝖨𝖬𝖣𝖻 𝖵𝗈𝗍𝖾𝗌: " + (imdbData.imdbVotes || "𝖭/𝖠") + "\n\n";
        imdbInfo += "🔍 𝖲𝖾𝖺𝗋𝖼𝗁: " + movieName;

        let imageStream = null;
        if (imdbData.Poster && imdbData.Poster !== "N/A") {
          try {
            imageStream = await global.utils.getStreamFromURL(imdbData.Poster);
          } catch (imageError) {
            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗉𝗈𝗌𝗍𝖾𝗋:", imageError.message);
          }
        }

        // Unsend loading message
        try {
          await message.unsend(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
        }

        if (imageStream) {
          await message.reply({
            body: imdbInfo,
            attachment: imageStream
          });
        } else {
          await message.reply(imdbInfo);
        }

      } catch (apiError) {
        await message.unsend(loadingMsg.messageID);
        console.error("❌ 𝖨𝖬𝖣𝖻 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
        
        let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖨𝖬𝖣𝖻. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
        
        if (apiError.code === 'ECONNREFUSED') {
          errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
        } else if (apiError.code === 'ETIMEDOUT') {
          errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
        }
        
        await message.reply(errorMessage);
      }

    } catch (error) {
      console.error("💥 𝖨𝖬𝖣𝖻 𝖲𝖾𝖺𝗋𝖼𝗁 𝖤𝗋𝗋𝗈𝗋:", error);
      
      let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖨𝖬𝖣𝖻. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
      
      if (error.message.includes('getStreamFromURL')) {
        errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
      }
      
      await message.reply(errorMessage);
    }
  }
};
