const axios = require('axios');

module.exports = {
    config: {
        name: "dance",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "anime",
        shortDescription: {
            en: "💃 𝖠𝗇𝗂𝗆𝖾 𝖽𝖺𝗇𝖼𝖾 𝗀𝗂𝖿/𝗏𝗂𝖽𝖾𝗈"
        },
        longDescription: {
            en: "𝖲𝖾𝗇𝖽𝗌 𝖺 𝗋𝖺𝗇𝖽𝗈𝗆 𝖺𝗇𝗂𝗆𝖾 𝖽𝖺𝗇𝖼𝖾 𝗀𝗂𝖿 𝗈𝗋 𝗌𝗁𝗈𝗋𝗍 𝗏𝗂𝖽𝖾𝗈 𝖿𝗋𝗈𝗆 𝗆𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝗌𝗈𝗎𝗋𝖼𝖾𝗌"
        },
        guide: {
            en: "{p}dance"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function ({ message }) {
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

            const fallbackDances = [
                "https://i.waifu.pics/PCTp3I3.gif",
                "https://media.tenor.com/WNVZq-4Z1JAAAAAd/anime-dance-dancer-girl.gif",
                "https://media.tenor.com/2W1xuNxH0QwAAAAC/pocketmine-chika.gif",
                "https://media.tenor.com/3f4nB0ZQ9YQAAAAd/zero-two-dance.gif",
                "https://media.tenor.com/6zFqRw6eBvQAAAAC/anime-dance.gif",
                "https://media.tenor.com/4UJ5y7Zjw4kAAAAd/miku-hatsune-dance.gif",
                "https://media.tenor.com/rJd6rQY0Q5kAAAAC/kakashi-dance.gif",
                "https://media.tenor.com/9fYg1L0X1lUAAAAC/anime-dance.gif",
                "https://media.tenor.com/7Xb3h3j3J3IAAAAC/madoka-magica.gif",
                "https://media.tenor.com/5j7zWzWZw9AAAAAC/dance-anime.gif",
                "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWw0aWQxaWdweW82NHU0Ymg2c2ppMGU3OTU0cnhiZmsxZndjaXlxaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a6pzK009rlCak/giphy.gif",
                "https://tenor.com/bKLpp.gif",
                "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHYxMzNvcHd5OTA1dm5yZmVrZnA3dG50djFoMTJ6cjBxZ2EwaHBmNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FRxHnTUBxQysLAV2eA/giphy.gif",
                "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3enhoMWk0ODRhcGd3aDV2amphOGJhbjExaDZsdGF4OWQ3emtjeTNzZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VP4BM5r8ZdQfrxIZX2/giphy.gif",
                "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3enhoMWk0ODRhcGd3aDV2amphOGJhbjExaDZsdGF4OWQ3emtjeTNzZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/v0kDG3nsYWnbz4mTWN/giphy.gif"
            ];

            let danceUrl = null;
            let source = "𝖶𝖺𝗂𝖿𝗎.𝗉𝗂𝖼𝗌 𝖠𝖯𝖨";

            // Try primary API first
            try {
                console.log("🔗 𝖳𝗋𝗒𝗂𝗇𝗀 𝗉𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨...");
                const apiResponse = await axios.get('https://api.waifu.pics/sfw/dance', {
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                if (apiResponse.data && apiResponse.data.url) {
                    danceUrl = apiResponse.data.url;
                    console.log(`✅ 𝖯𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨 𝗌𝗎𝖼𝖼𝖾𝗌𝗌: ${danceUrl}`);
                } else {
                    throw new Error('𝖭𝗈 𝖴𝖱𝖫 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨');
                }
            } 
            catch (apiError) {
                console.error("❌ 𝖯𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽:", apiError.message);
                
                // Try fallback APIs
                try {
                    console.log("🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨𝗌...");
                    const fallbackApis = [
                        'https://api.waifu.im/random/?selected_tags=dance',
                        'https://nekos.life/api/v2/img/dance',
                        'https://api.catboys.com/dance'
                    ];

                    for (const api of fallbackApis) {
                        try {
                            const response = await axios.get(api, { timeout: 10000 });
                            if (api.includes('waifu.im') && response.data?.images?.[0]?.url) {
                                danceUrl = response.data.images[0].url;
                                source = "𝖶𝖺𝗂𝖿𝗎.𝗂𝗆 𝖠𝖯𝖨";
                                break;
                            } else if (api.includes('nekos.life') && response.data?.url) {
                                danceUrl = response.data.url;
                                source = "𝖭𝖾𝗄𝗈𝗌.𝗅𝗂𝖿𝖾 𝖠𝖯𝖨";
                                break;
                            } else if (api.includes('catboys') && response.data?.url) {
                                danceUrl = response.data.url;
                                source = "𝖢𝖺𝗍𝖻𝗈𝗒𝗌 𝖠𝖯𝖨";
                                break;
                            }
                        } catch (fallbackApiError) {
                            console.error(`❌ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽: ${api}`, fallbackApiError.message);
                            continue;
                        }
                    }
                } catch (fallbackError) {
                    console.error("❌ 𝖠𝗅𝗅 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖠𝖯𝖨𝗌 𝖿𝖺𝗂𝗅𝖾𝖽:", fallbackError.message);
                }
            }

            // If no API worked, use fallback dances
            if (!danceUrl) {
                console.log("🔄 𝖴𝗌𝗂𝗇𝗀 𝗁𝖺𝗋𝖽𝖼𝗈𝖽𝖾𝖽 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄𝗌...");
                const randomIndex = Math.floor(Math.random() * fallbackDances.length);
                danceUrl = fallbackDances[randomIndex];
                source = "𝖧𝖺𝗋𝖽𝖼𝗈𝖽𝖾𝖽 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄";
            }

            // Validate the URL
            if (!danceUrl || typeof danceUrl !== 'string' || !danceUrl.startsWith('http')) {
                console.error("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖽𝖺𝗇𝖼𝖾 𝖴𝖱𝖫:", danceUrl);
                // Use first fallback as emergency
                danceUrl = fallbackDances[0];
                source = "𝖤𝗆𝖾𝗋𝗀𝖾𝗇𝖼𝗒 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄";
            }

            console.log(`🎯 𝖥𝗂𝗇𝖺𝗅 𝖽𝖺𝗇𝖼𝖾 𝖴𝖱𝖫: ${danceUrl}`);
            console.log(`📊 𝖲𝗈𝗎𝗋𝖼𝖾: ${source}`);

            // Get the stream with error handling
            let danceStream;
            try {
                danceStream = await global.utils.getStreamFromURL(danceUrl);
                if (!danceStream) {
                    throw new Error('𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗌𝗍𝗋𝖾𝖺𝗆');
                }
            } catch (streamError) {
                console.error("❌ 𝖲𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError.message);
                // Try emergency fallback
                danceUrl = "https://media.tenor.com/WNVZq-4Z1JAAAAAd/anime-dance-dancer-girl.gif";
                danceStream = await global.utils.getStreamFromURL(danceUrl);
                source = "𝖤𝗆𝖾𝗋𝗀𝖾𝗇𝖼𝗒 𝖲𝗍𝗋𝖾𝖺𝗆";
            }

            const form = {
                body: `✨💃 𝖣𝖠𝖭𝖢𝖤 𝖳𝖨𝖬𝖤! 🕺✨\n\n» 𝖲𝗈𝗎𝗋𝖼𝖾: ${source}\n» 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 «`,
                attachment: danceStream
            };

            await message.reply(form);
            console.log("✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝖽𝖺𝗇𝖼𝖾 𝖦𝖨𝖥");

        } catch (error) {
            console.error("💥 𝖬𝖺𝗂𝗇 𝖣𝖺𝗇𝖼𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Final emergency fallback
            try {
                const emergencyDance = "https://media.tenor.com/WNVZq-4Z1JAAAAAd/anime-dance-dancer-girl.gif";
                const emergencyStream = await global.utils.getStreamFromURL(emergencyDance);
                
                const emergencyForm = {
                    body: `✨💃 𝖣𝖠𝖭𝖢𝖤 𝖳𝖨𝖬𝖤! 🕺✨\n\n» 𝖤𝗆𝖾𝗋𝗀𝖾𝗇𝖼𝗒 𝖦𝖨𝖥 «\n» 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 «`,
                    attachment: emergencyStream
                };

                await message.reply(emergencyForm);
            } catch (finalError) {
                console.error("💥 𝖥𝗂𝗇𝖺𝗅 𝖾𝗆𝖾𝗋𝗀𝖾𝗇𝖼𝗒 𝖿𝖺𝗂𝗅𝖾𝖽:", finalError);
                // Silent fail to avoid spam
            }
        }
    }
};
