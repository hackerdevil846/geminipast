const axios = require("axios");

module.exports = {
    config: {
        name: "nsfwcontent2",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        category: "𝐚𝐝𝐮𝐥𝐭",
        shortDescription: {
            en: "𝐆𝐞𝐭 𝐫𝐚𝐧𝐝𝐨𝐦 𝐍𝐒𝐅𝐖 𝐜𝐨𝐧𝐭𝐞𝐧𝐭"
        },
        longDescription: {
            en: "𝐆𝐞𝐭 𝐫𝐚𝐧𝐝𝐨𝐦 𝐍𝐒𝐅𝐖 𝐜𝐨𝐧𝐭𝐞𝐧𝐭 𝐰𝐢𝐭𝐡 𝐦𝐮𝐥𝐭𝐢𝐩𝐥𝐞 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐞𝐬"
        },
        guide: {
            en: "{p}nsfwcontent2 [𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲]"
        },
        countDown: 5
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return message.reply("❌ 𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲: 𝐚𝐱𝐢𝐨𝐬");
            }

            // Available categories
            const categories = {
                'neko': 'https://api.waifu.pics/nsfw/neko',
                'waifu': 'https://api.waifu.pics/nsfw/waifu',
                'blowjob': 'https://api.waifu.pics/nsfw/blowjob',
                'hentai': 'https://nekobot.xyz/api/image?type=hentai',
                'anal': 'https://nekobot.xyz/api/image?type=anal',
                'pgif': 'https://nekobot.xyz/api/image?type=pgif'
            };

            let category = args[0] || 'random';
            
            if (category === 'random') {
                const keys = Object.keys(categories);
                category = keys[Math.floor(Math.random() * keys.length)];
            }

            if (!categories[category]) {
                const availableCategories = Object.keys(categories).join(', ');
                return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲! 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞: ${availableCategories}`);
            }

            await message.reply(`🔞 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 ${category} 𝐜𝐨𝐧𝐭𝐞𝐧𝐭...`);

            const response = await axios.get(categories[category]);
            
            // Handle different API response structures
            let imageUrl;
            if (response.data.url) {
                imageUrl = response.data.url;
            } else if (response.data.message) {
                imageUrl = response.data.message;
            } else {
                throw new Error("❌ 𝐍𝐨 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐮𝐧𝐝");
            }

            if (!imageUrl) throw new Error("❌ 𝐍𝐨 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐮𝐧𝐝");

            await message.reply({
                body: `🥵 ${category.toUpperCase()} 𝐍𝐒𝐅𝐖 𝐂𝐨𝐧𝐭𝐞𝐧𝐭\n━━━━━━━━━━━━━━\n✨ 𝐂𝐫𝐞𝐝𝐢𝐭: 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝`,
                attachment: await global.utils.getStreamFromURL(imageUrl)
            });

        } catch (error) {
            console.error("𝐍𝐒𝐅𝐖 𝐄𝐫𝐫𝐨𝐫:", error);
            await message.reply("❌ 𝐄𝐫𝐫𝐨𝐫 𝐟𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐜𝐨𝐧𝐭𝐞𝐧𝐭: " + error.message);
        }
    }
};
