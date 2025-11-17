const axios = require('axios');
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "covid",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖵𝗂𝖾𝗐 𝖢𝖮𝖵𝖨𝖣-19 𝗌𝗍𝖺𝗍𝗂𝗌𝗍𝗂𝖼𝗌"
        },
        longDescription: {
            en: "𝖦𝖾𝗍 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝖢𝖮𝖵𝖨𝖣-19 𝗌𝗍𝖺𝗍𝗂𝗌𝗍𝗂𝖼𝗌 𝖿𝗈𝗋 𝖺𝗇𝗒 𝖼𝗈𝗎𝗇𝗍𝗋𝗒"
        },
        guide: {
            en: "{p}covid [𝖼𝗈𝗎𝗇𝗍𝗋𝗒 𝗇𝖺𝗆𝖾]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const country = args.join(" ");
            if (!country) {
                return message.reply(`🌍 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝖼𝗈𝗎𝗇𝗍𝗋𝗒 𝗇𝖺𝗆𝖾`);
            }

            console.log(`🔍 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖢𝖮𝖵𝖨𝖣 𝖽𝖺𝗍𝖺 𝖿𝗈𝗋: ${country}`);

            const response = await axios.get(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const data = response.data;
            
            if (!data.country) {
                return message.reply(`❌ 𝖢𝗈𝗎𝗇𝗍𝗋𝗒 "${country}" 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝖺 𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗎𝗇𝗍𝗋𝗒 𝗇𝖺𝗆𝖾.`);
            }

            // Create cache directory
            const cachePath = path.join(__dirname, "cache", "covid_flags");
            try {
                if (!fs.existsSync(cachePath)) {
                    fs.mkdirSync(cachePath, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }
            
            const flagPath = path.join(cachePath, `${data.countryInfo.iso3 || Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`);
            const flagUrl = data.countryInfo.flag;
            
            // Download flag with error handling
            try {
                const flagResponse = await axios.get(flagUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                fs.writeFileSync(flagPath, flagResponse.data);
                console.log(`✅ 𝖥𝗅𝖺𝗀 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽: ${flagPath}`);
            } catch (flagError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗅𝖺𝗀:", flagError.message);
                // Continue without flag
            }
            
            const formatNumber = num => {
                if (!num && num !== 0) return '0';
                return num.toLocaleString();
            };
            
            const messageText = `🟢 𝖢𝖮𝖵𝖨𝖣-19 𝖲𝗍𝖺𝗍𝗂𝗌𝗍𝗂𝖼𝗌 🟢

🌎 𝖢𝗈𝗎𝗇𝗍𝗋𝗒: ${data.country}
🌐 𝖢𝗈𝗇𝗍𝗂𝗇𝖾𝗇𝗍: ${data.continent || '𝖭/𝖠'}
👥 𝖯𝗈𝗉𝗎𝗅𝖺𝗍𝗂𝗈𝗇: ${formatNumber(data.population)}

📊 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝖲𝗍𝖺𝗍𝗎𝗌:
🦠 𝖳𝗈𝗍𝖺𝗅 𝖢𝖺𝗌𝖾𝗌: ${formatNumber(data.cases)}
⚠️ 𝖳𝗈𝖽𝖺𝗒'𝗌 𝖢𝖺𝗌𝖾𝗌: ${formatNumber(data.todayCases)}
☠️ 𝖳𝗈𝗍𝖺𝗅 𝖣𝖾𝖺𝗍𝗁𝗌: ${formatNumber(data.deaths)}
💀 𝖳𝗈𝖽𝖺𝗒'𝗌 𝖣𝖾𝖺𝗍𝗁𝗌: ${formatNumber(data.todayDeaths)}
❤️ 𝖱𝖾𝖼𝗈𝗏𝖾𝗋𝖾𝖽: ${formatNumber(data.recovered)}
🏥 𝖠𝖼𝗍𝗂𝗏𝖾 𝖢𝖺𝗌𝖾𝗌: ${formatNumber(data.active)}
🆘 𝖢𝗋𝗂𝗍𝗂𝖼𝖺𝗅: ${formatNumber(data.critical)}
🧪 𝖳𝖾𝗌𝗍𝗌: ${formatNumber(data.tests)}

📅 𝖫𝖺𝗌𝗍 𝖴𝗉𝖽𝖺𝗍𝖾𝖽: ${new Date(data.updated).toLocaleString()}`;

            // Send message with or without flag
            if (fs.existsSync(flagPath)) {
                await message.reply({
                    body: messageText,
                    attachment: fs.createReadStream(flagPath)
                });
                
                // Clean up flag file
                try {
                    fs.unlinkSync(flagPath);
                    console.log(`🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝖿𝗅𝖺𝗀 𝖿𝗂𝗅𝖾: ${flagPath}`);
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 𝖿𝗅𝖺𝗀 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }
            } else {
                await message.reply({
                    body: messageText
                });
            }

        } catch (error) {
            console.error('💥 [𝖢𝖮𝖵𝖨𝖣 𝖤𝖱𝖱𝖮𝖱]', error);
            
            let errorMessage = "🚫 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖢𝖮𝖵𝖨𝖣 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.response && error.response.status === 404) {
                errorMessage = `❌ 𝖢𝗈𝗎𝗇𝗍𝗋𝗒 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗎𝗇𝗍𝗋𝗒 𝗇𝖺𝗆𝖾.`;
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
