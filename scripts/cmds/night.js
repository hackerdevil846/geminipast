const fs = require("fs-extra");
const moment = require("moment-timezone");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "night",
        aliases: ["ratri", "shubharatri"], // Changed "goodnight" to "shubharatri"
        version: "1.0.2",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "✨ 𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝐺𝑜𝑜𝑑 𝑁𝑖𝑔ℎ𝑡 𝑊𝑖𝑠ℎ𝑒𝑟 ✨"
        },
        longDescription: {
            en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑔𝑜𝑜𝑑 𝑛𝑖𝑔ℎ𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑞𝑢𝑜𝑡𝑒𝑠"
        },
        category: "𝑎𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒",
        guide: {
            en: "𝑁𝑜 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑢𝑠𝑒 𝑚𝑎𝑛𝑢𝑎𝑙𝑙𝑦. 𝐼𝑡 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑔𝑜𝑜𝑑 𝑛𝑖𝑔ℎ𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
        },
        countDown: 3,
        dependencies: {
            "moment-timezone": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            try {
                require("moment-timezone");
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            // Download good night image if not exists
            const imagePath = path.join(__dirname, "cache", "night.jpg");
            if (!fs.existsSync(imagePath)) {
                const response = await axios.get("https://i.imgur.com/9N7y9yJ.jpg", { 
                    responseType: "stream" 
                });
                const writer = fs.createWriteStream(imagePath);
                response.data.pipe(writer);
                
                await new Promise((resolve, reject) => {
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });
                
                await message.reply("🌙 𝑁𝑖𝑔ℎ𝑡 𝑖𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!");
            }
        } catch (error) {
            console.log("𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑛𝑖𝑔ℎ𝑡 𝑖𝑚𝑎𝑔𝑒:", error);
        }
    },

    onChat: async function({ message, event, global }) {
        try {
            const { threadID, messageID, body } = event;
            const triggers = [
                "Good night", "good night", "Gud night", "Gud nini",
                "Shuvo ratri", "shuvo ratri", "Shubho ratri", "shubho ratri",
                "Ratri shuvo", "ratri shuvo", "Bhalo ratri", "bhalo ratri",
                "শুভ রাত্রি", "শুভ রাত", "গুড নাইট", "গুড নাইট"
            ];
            
            // Check if any trigger exists in the message
            const triggerFound = triggers.some(trigger => 
                body && body.toLowerCase().includes(trigger.toLowerCase())
            );
            
            if (triggerFound) {
                const now = moment().tz("Asia/Dhaka");
                const hour = now.hour();
                
                // Only respond between 6PM to 5AM
                if (hour >= 18 || hour < 5) {
                    const imagePath = path.join(__dirname, "cache", "night.jpg");
                    const msg = {
                        body: `🌙✨ 𝑆ℎ𝑢𝑣𝑜 𝑟𝑎𝑡𝑟𝑖 ${getRandomEmoji()} 𝐵𝑖𝑑𝑎 𝑛𝑒𝑖 💫\n\n"${getRandomQuote()}"`,
                        attachment: fs.existsSync(imagePath) ? fs.createReadStream(imagePath) : null
                    };
                    
                    await message.reply(msg);
                }
            }
        } catch (error) {
            console.error("𝑁𝑖𝑔ℎ𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        }
    }
};

// Helper functions
function getRandomEmoji() {
    const emojis = ["💤", "🌌", "🌠", "🛌", "🪔", "🌉", "🌃", "😴", "✨"];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function getRandomQuote() {
    const quotes = [
        "ঘুমন্ত রাতের স্বপ্নগুলো তোমার জন্য হোক সুখময়",
        "চাঁদ-তারা যেন তোমার জন্য রূপকথা বুনে",
        "সারাদিনের ক্লান্তি যেন রাতের বেলায় দূর হয়",
        "প্রতিটি রাত তোমার জীবনে বয়ে আনুক শান্তির পরশ",
        "স্বপ্নিল রাতের পরশে ঘুম হোক শান্তির",
        "রাতের আঁধারে ডানা মেলুক সুখের স্বপ্ন",
        "তোমার প্রতিটি রাত হোক শুভ আর সুন্দর",
        "নিশীথের তারা যেন তোমার জন্য আশীর্বাদ বয়ে আনে"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
}
