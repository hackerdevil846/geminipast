const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

const API_CONFIG_URL = "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json";

const getApiUrl = async () => {
    try {
        const response = await axios.get(API_CONFIG_URL);
        const albumUrl = response.data.album;
        if (!albumUrl) {
            throw new Error("Album API URL not found in the JSON data.");
        }
        return albumUrl;
    } catch (error) {
        console.error("API URL Error:", error);
        throw new Error("Failed to fetch API URL");
    }
};

module.exports = {
    config: {
        name: "album",
        aliases: ["albums", "mediaalbum"],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "media",
        shortDescription: {
            en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑎𝑛𝑑 𝑣𝑖𝑒𝑤 𝑣𝑖𝑑𝑒𝑜/𝑝ℎ𝑜𝑡𝑜 𝑎𝑙𝑏𝑢𝑚𝑠"
        },
        longDescription: {
            en: "𝐵𝑟𝑜𝑤𝑠𝑒 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑚𝑒𝑑𝑖𝑎 𝑓𝑟𝑜𝑚 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑒𝑠"
        },
        guide: {
            en: "{p}album\n{p}album [𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ api, event, args, message }) {
        try {
            const { threadID, messageID, senderID } = event;

            const albumOptionsPage1 = [
                "funny", "islamic", "sad", "anime", "cartoon",
                "love", "horny", "couple", "flower", "marvel"
            ];
            const albumOptionsPage2 = [
                "aesthetic", "sigma", "lyrics", "cat", "18plus",
                "freefire", "football", "girl", "friends", "cricket"
            ];

            const toBold = (text) => text.replace(/[a-z]/g, (c) => String.fromCodePoint(0x1d41a + c.charCodeAt(0) - 97));
            const toBoldNumber = (num) => String(num).replace(/[0-9]/g, (c) => String.fromCodePoint(0x1d7ec + parseInt(c)));

            const formatOptions = (options, startIndex = 1) =>
                options.map((opt, i) => `✨ | ${toBoldNumber(i + startIndex)}. ${toBold(opt)}`).join("\n");

            if (args[0] === "2") {
                const message2 =
                    "💫 𝐶ℎ𝑜𝑜𝑠𝑒 𝑎𝑛 𝑎𝑙𝑏𝑢𝑚 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦 𝐵𝑎𝑏𝑦 💫\n" +
                    "✺━━━━━━━◈◉◈━━━━━━━✺\n" +
                    formatOptions(albumOptionsPage2, 11) +
                    "\n✺━━━━━━━◈◉◈━━━━━━━✺\n🎯 | 𝑃𝑎𝑔𝑒 [2/2]\n✺━━━━━━━◈◉◈━━━━━━━✺";

                await message.reply(message2);
                return;
            }

            if (!args[0] || args[0].toLowerCase() === "list") {
                await api.setMessageReaction("☢️", messageID, () => {}, true);

                const messageText =
                    "💫 𝐶ℎ𝑜𝑜𝑠𝑒 𝑎𝑛 𝑎𝑙𝑏𝑢𝑚 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦 𝐵𝑎𝑏𝑦 💫\n" +
                    "✺━━━━━━━◈◉◈━━━━━━━✺\n" +
                    formatOptions(albumOptionsPage1) +
                    `\n✺━━━━━━━◈◉◈━━━━━━━✺\n🎯 | 𝑃𝑎𝑔𝑒 [1/2]\nℹ | 𝑇𝑦𝑝𝑒: ${global.config.PREFIX}album 2 - 𝑛𝑒𝑥𝑡 𝑝𝑎𝑔𝑒\n✺━━━━━━━◈◉◈━━━━━━━✺`;

                await message.reply(messageText);
                return;
            }

            const validCategories = [
                "cartoon", "marvel", "lofi", "sad", "islamic", "funny",
                "horny", "anime", "love", "baby", "lyrics", "sigma",
                "aesthetic", "cat", "flower", "freefire", "sex", "girl",
                "football", "friend", "cricket", "couple", "18plus", "freefire"
            ];

            const command = args[0].toLowerCase();

            if (!validCategories.includes(command)) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦! 𝑇𝑦𝑝𝑒 '/album' 𝑡𝑜 𝑠𝑒𝑒 𝑙𝑖𝑠𝑡.");
            }

            return message.reply(`📁 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦: 𝑎𝑙𝑏𝑢𝑚 - ${command}...`);

        } catch (error) {
            console.error("Album onStart Error:", error);
            // Don't send error message to avoid spam
        }
    },

    onReply: async function ({ event, message, Reply }) {
        try {
            const adminID = "61571630409265";
            const replyNum = parseInt(event.body);
            
            if (isNaN(replyNum)) {
                return;
            }

            const categories = [
                "funny", "islamic", "sad", "anime", "cartoon",
                "love", "horny", "couple", "flower", "marvel",
                "aesthetic", "sigma", "lyrics", "cat", "18plus",
                "freefire", "football", "girl", "friend", "cricket"
            ];

            if (replyNum < 1 || replyNum > categories.length) {
                return;
            }

            const selectedCategory = categories[replyNum - 1];

            if (
                (selectedCategory === "horny" || selectedCategory === "18plus") &&
                event.senderID !== adminID
            ) {
                return message.reply("🚫 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑛𝑜𝑡 𝑎𝑢𝑡ℎ𝑜𝑟𝑖𝑧𝑒𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦.");
            }

            const captions = {
                funny: "🤣 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐹𝑢𝑛𝑛𝑦 𝑣𝑖𝑑𝑒𝑜",
                islamic: "😇 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜",
                sad: "🥺 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝑆𝑎𝑑 𝑣𝑖𝑑𝑒𝑜",
                anime: "😘 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐴𝑛𝑖𝑚𝑒 𝑣𝑖𝑑𝑒𝑜",
                cartoon: "😇 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐶𝑎𝑟𝑡𝑜𝑜𝑛 𝑣𝑖𝑑𝑒𝑜",
                love: "😇 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐿𝑜𝑣𝑒 𝑣𝑖𝑑𝑒𝑜",
                horny: "🥵 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐻𝑜𝑟𝑛𝑦 𝑣𝑖𝑑𝑒𝑜",
                couple: "❤️ > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐶𝑜𝑢𝑝𝑙𝑒 𝑣𝑖𝑑𝑒𝑜",
                flower: "🌸 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐹𝑙𝑜𝑤𝑒𝑟 𝑣𝑖𝑑𝑒𝑜",
                marvel: "🎯 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝑀𝑎𝑟𝑣𝑒𝑙 𝑣𝑖𝑑𝑒𝑜",
                aesthetic: "🎀 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐴𝑒𝑠𝑡ℎ𝑒𝑡𝑖𝑐 𝑣𝑖𝑑𝑒𝑜",
                sigma: "🐤 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝑆𝑖𝑔𝑚𝑎 𝑣𝑖𝑑𝑒𝑜",
                lyrics: "🥰 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐿𝑦𝑟𝑖𝑐𝑠 𝑣𝑖𝑑𝑒𝑜",
                cat: "🐱 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐶𝑎𝑡 𝑣𝑖𝑑𝑒𝑜",
                "18plus": "🔞 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 18+ 𝑣𝑖𝑑𝑒𝑜",
                freefire: "🎮 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐹𝑟𝑒𝑒𝑓𝑖𝑟𝑒 𝑣𝑖𝑑𝑒𝑜",
                football: "⚽ > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐹𝑜𝑜𝑡𝑏𝑎𝑙𝑙 𝑣𝑖𝑑𝑒𝑜",
                girl: "👧 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐺𝑖𝑟𝑙 𝑣𝑖𝑑𝑒𝑜",
                friend: "👫 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐹𝑟𝑖𝑒𝑛𝑑𝑠 𝑣𝑖𝑑𝑒𝑜",
                cricket: "🏏 > 𝑁𝑎𝑤 𝐵𝑎𝑏𝑦 𝐶𝑟𝑖𝑐𝑘𝑒𝑡 𝑣𝑖𝑑𝑒𝑜"
            };

            const BASE_API_URL = await getApiUrl();
            const res = await axios.get(`${BASE_API_URL}/album?type=${selectedCategory}`);
            const mediaUrl = res.data.data;

            if (!mediaUrl) {
                return;
            }

            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const filename = path.basename(mediaUrl).split("?")[0];
            const filePath = path.join(cacheDir, `${Date.now()}_${filename}`);
            
            const response = await axios({
                method: 'get',
                url: mediaUrl,
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            await message.reply({
                body: captions[selectedCategory] || `🎬 𝑁𝑜𝑤 𝐵𝑎𝑏𝑦 ${selectedCategory} 𝑐𝑜𝑛𝑡𝑒𝑛𝑡`,
                attachment: fs.createReadStream(filePath)
            });

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

        } catch (err) {
            console.error("Album onReply Error:", err.message);
            // Don't send error message to avoid spam
        }
    }
};
