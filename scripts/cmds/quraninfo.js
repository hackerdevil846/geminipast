const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "quraninfo",
        aliases: ["qsinfo", "surahdetails", "qurandetails"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑖𝑠𝑙𝑎𝑚",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝑄𝑢𝑟𝑎𝑛 𝑠𝑢𝑟𝑎ℎ 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑟𝑒𝑐𝑖𝑡𝑎𝑡𝑖𝑜𝑛"
        },
        longDescription: {
            en: "𝐹𝑒𝑡𝑐ℎ 𝑄𝑢𝑟𝑎𝑛 𝑠𝑢𝑟𝑎ℎ 𝑑𝑒𝑡𝑎𝑖𝑙𝑠, 𝑣𝑒𝑟𝑠𝑒𝑠 𝑎𝑛𝑑 𝑎𝑢𝑑𝑖𝑜 𝑟𝑒𝑐𝑖𝑡𝑎𝑡𝑖𝑜𝑛𝑠"
        },
        guide: {
            en: "{p}quraninfo [𝑠𝑢𝑟𝑎ℎ_𝑛𝑢𝑚𝑏𝑒𝑟]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            const surahNumber = parseInt(args[0]);
            
            if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
                return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑠𝑢𝑟𝑎ℎ 𝑛𝑢𝑚𝑏𝑒𝑟 (1-114)\n💡 𝑈𝑠𝑎𝑔𝑒: {p}quraninfo [𝑠𝑢𝑟𝑎ℎ_𝑛𝑢𝑚𝑏𝑒𝑟]");
            }

            let surahData = null;

            try {
                // Try to fetch from API first
                const response = await axios.get(`https://quranapi.pages.dev/api/${surahNumber}.json`, {
                    timeout: 10000
                });
                surahData = response.data;
            } catch (apiError) {
                console.log("𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑏𝑎𝑐𝑘𝑢𝑝 𝑑𝑎𝑡𝑎...");
                
                // Use backup data from local file
                try {
                    const backupPath = path.join(__dirname, 'data', 'quran.json');
                    
                    if (fs.existsSync(backupPath)) {
                        const backupData = fs.readJsonSync(backupPath);
                        
                        // Find surah by number in the array
                        surahData = backupData.find(surah => surah.surah_number === surahNumber);
                    }
                    
                    if (!surahData) {
                        return message.reply("❌ 𝑆𝑢𝑟𝑎ℎ 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑏𝑎𝑐𝑘𝑢𝑝 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                    }
                } catch (backupError) {
                    console.error("𝐵𝑎𝑐𝑘𝑢𝑝 𝑑𝑎𝑡𝑎 𝑒𝑟𝑟𝑜𝑟:", backupError);
                    return message.reply("❌ 𝐵𝑜𝑡ℎ 𝐴𝑃𝐼 𝑎𝑛𝑑 𝑏𝑎𝑐𝑘𝑢𝑝 𝑑𝑎𝑡𝑎 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                }
            }

            if (!surahData) {
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑠𝑢𝑟𝑎ℎ 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }

            let messageBody = `📖 *${surahData.name} (${surahData.name_translations?.en || ''})*\n`;
            messageBody += `🔢 𝑆𝑢𝑟𝑎ℎ 𝑁𝑢𝑚𝑏𝑒𝑟: ${surahData.surah_number}\n`;
            messageBody += `📋 𝑇𝑜𝑡𝑎𝑙 𝑉𝑒𝑟𝑠𝑒𝑠: ${surahData.all_ayat}\n`;
            messageBody += `📍 𝑅𝑒𝑣𝑒𝑙𝑎𝑡𝑖𝑜𝑛 𝑃𝑙𝑎𝑐𝑒: ${surahData.place}\n`;
            messageBody += `📚 𝑇𝑦𝑝𝑒: ${surahData.type}\n\n`;

            // Add audio information if available
            if (surahData.audio) {
                messageBody += "🎧 𝐴𝑢𝑑𝑖𝑜 𝑅𝑒𝑐𝑖𝑡𝑎𝑡𝑖𝑜𝑛 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒\n";
                messageBody += `💡 𝑈𝑠𝑒: {p}surahaudio ${surahNumber}`;
            }

            await message.reply(messageBody);

        } catch (error) {
            console.error("𝑄𝑢𝑟𝑎𝑛𝐼𝑛𝑓𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑠𝑢𝑟𝑎ℎ 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
