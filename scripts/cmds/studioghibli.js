const axios = require('axios');

module.exports = {
    config: {
        name: "studioghibli",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "𝑒𝑛𝑡𝑒𝑟𝑡𝑎𝑖𝑛𝑚𝑒𝑛𝑡",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑆𝑡𝑢𝑑𝑖𝑜 𝐺ℎ𝑖𝑏𝑙𝑖 𝑓𝑖𝑙𝑚"
        },
        longDescription: {
            en: "𝐺𝑒𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑆𝑡𝑢𝑑𝑖𝑜 𝐺ℎ𝑖𝑏𝑙𝑖 𝑎𝑛𝑖𝑚𝑎𝑡𝑒𝑑 𝑓𝑖𝑙𝑚𝑠"
        },
        guide: {
            en: "{p}studioghibli\n{p}studioghibli [𝑘𝑒𝑦𝑤𝑜𝑟𝑑]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
            }

            // Show loading message
            await message.reply("🎬 𝐹𝑖𝑛𝑑𝑖𝑛𝑔 𝑎 𝐺ℎ𝑖𝑏𝑙𝑖 𝑓𝑖𝑙𝑚 𝑓𝑜𝑟 𝑦𝑜𝑢...");

            // Fetch Ghibli films with timeout
            const { data: films } = await axios.get('https://ghibliapi.vercel.app/films', {
                timeout: 10000
            });

            // Validate API response
            if (!Array.isArray(films) || films.length === 0) {
                return message.reply("❌ 𝑁𝑜 𝑓𝑖𝑙𝑚𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝐺ℎ𝑖𝑏𝑙𝑖 𝐴𝑃𝐼");
            }

            let selectedFilm;
            
            // Search films if keyword provided
            if (args.length > 0) {
                const keyword = args.join(' ').toLowerCase();
                const matchedFilms = films.filter(film => 
                    film.title?.toLowerCase().includes(keyword) ||
                    film.original_title?.toLowerCase().includes(keyword) ||
                    film.director?.toLowerCase().includes(keyword)
                );
                
                if (matchedFilms.length === 0) {
                    return message.reply(`❌ 𝑁𝑜 𝑓𝑖𝑙𝑚𝑠 𝑓𝑜𝑢𝑛𝑑 𝑚𝑎𝑡𝑐ℎ𝑖𝑛𝑔: "${keyword}"`);
                }
                selectedFilm = matchedFilms[Math.floor(Math.random() * matchedFilms.length)];
            } else {
                // Get random film if no keyword
                selectedFilm = films[Math.floor(Math.random() * films.length)];
            }

            // Validate film data
            if (!selectedFilm || !selectedFilm.title) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑖𝑙𝑚 𝑑𝑎𝑡𝑎 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑");
            }

            // Format the response
            const response = this.formatFilmResponse(selectedFilm);

            // Send result with image attachment if available
            if (selectedFilm.image && selectedFilm.image.startsWith('http')) {
                try {
                    await message.reply({
                        body: response,
                        attachment: await global.utils.getStreamFromURL(selectedFilm.image)
                    });
                } catch (imageError) {
                    console.error("Image load error:", imageError);
                    // Fallback to text-only if image fails
                    await message.reply(response + "\n\n⚠️ 𝐼𝑚𝑎𝑔𝑒 𝑐𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑏𝑒 𝑙𝑜𝑎𝑑𝑒𝑑");
                }
            } else {
                await message.reply(response);
            }

        } catch (error) {
            console.error("𝐺ℎ𝑖𝑏𝑙𝑖 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", error);
            
            if (error.code === 'ECONNABORTED') {
                await message.reply("❌ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            } else if (error.response?.status === 404) {
                await message.reply("❌ 𝐺ℎ𝑖𝑏𝑙𝑖 𝐴𝑃𝐼 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            } else if (error.response?.status >= 500) {
                await message.reply("❌ 𝐺ℎ𝑖𝑏𝑙𝑖 𝐴𝑃𝐼 𝑠𝑒𝑟𝑣𝑒𝑟 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            } else {
                await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝐺ℎ𝑖𝑏𝑙𝑖 𝑓𝑖𝑙𝑚𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
            }
        }
    },

    formatFilmResponse: function(film) {
        return `🎬 ${film.title || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑇𝑖𝑡𝑙𝑒'}

📅 𝑌𝑒𝑎𝑟: ${film.release_date || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛'}
🎥 𝐷𝑖𝑟𝑒𝑐𝑡𝑜𝑟: ${film.director || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛'}
⭐ 𝑅𝑎𝑡𝑖𝑛𝑔: ${film.rt_score || '𝑁/𝐴'}/100

📖 𝑆𝑦𝑛𝑜𝑝𝑠𝑖𝑠: ${film.description || '𝑁𝑜 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒'}

${film.original_title ? `🎭 𝑂𝑟𝑖𝑔𝑖𝑛𝑎𝑙 𝑇𝑖𝑡𝑙𝑒: ${film.original_title}` : ''}`.trim();
    }
};
