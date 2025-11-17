const axios = require('axios');

module.exports = {
  config: {
    name: "animeimg",
    aliases: [],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🎨 𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 𝑓𝑒𝑡𝑐ℎ𝑒𝑑 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝐴𝑃𝐼"
    },
    guide: {
      en: "{p}animeimg"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ message }) {
    const fetchAnimeImage = async (attempt = 1) => {
      try {
        // Main API
        const url = 'https://pic.re/image';
        const response = await axios.get(url, { timeout: 10000 });

        if (response.status === 200 && response.headers['content-type'].startsWith('image/')) {
          const imageURL = response.request.res.responseUrl;
          const imageStream = await global.utils.getStreamFromURL(imageURL);

          if (imageStream) {
            await message.reply({
              body: "𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒:",
              attachment: imageStream
            });
            return true;
          } else throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑡𝘩𝑒 𝑖𝑚𝑎𝑔𝑒 𝑓𝑟𝑜𝑚 𝑡𝘩𝑒 𝑈𝑅𝐿");
        } else throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑑𝑎𝑡𝑎 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝐴𝑃𝐼");
      } catch (err) {
        console.error(`Attempt ${attempt} - 𝐴𝑛𝑖𝑚𝑒 𝐼𝑚𝑎𝑔𝑒 𝐸𝑟𝑟𝑜𝑟:`, err.message);

        // Retry up to 3 times
        if (attempt < 3) return fetchAnimeImage(attempt + 1);

        // Fallback API (RapidAPI)
        try {
          const options = {
            method: 'GET',
            url: 'https://any-anime.p.rapidapi.com/v1/anime/gif/1',
            headers: {
              'x-rapidapi-key': '95fa971fcamsh48ecc4f14a74debp1ee5e9jsnefed6cee582d',
              'x-rapidapi-host': 'any-anime.p.rapidapi.com'
            },
            timeout: 10000
          };

          const fallbackResp = await axios.request(options);

          // this API returns GIF, URL is fallbackResp.data.url or fallbackResp.data.images[0] depending on provider
          const gifURL = fallbackResp.data.url || fallbackResp.data?.[0]?.url || fallbackResp.data?.images?.[0];

          if (gifURL) {
            const fallbackStream = await global.utils.getStreamFromURL(gifURL);
            if (fallbackStream) {
              await message.reply({
                body: "𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒-𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 (𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝐴𝑃𝐼):",
                attachment: fallbackStream
              });
              return true;
            }
          }
        } catch (fallbackErr) {
          console.error("Fallback API error:", fallbackErr.message);
        }

        // All failed
        await message.reply("❌ 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }
    };

    // Start fetching
    await fetchAnimeImage();
  }
};
