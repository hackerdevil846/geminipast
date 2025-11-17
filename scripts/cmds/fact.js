module.exports = {
    config: {
        name: "fact",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖱𝖺𝗇𝖽𝗈𝗆 𝖿𝖺𝖼𝗍𝗌"
        },
        longDescription: {
            en: "𝖦𝖾𝗍 𝗋𝖺𝗇𝖽𝗈𝗆 𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍𝗂𝗇𝗀 𝖿𝖺𝖼𝗍𝗌"
        },
        guide: {
            en: "{p}fact"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
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

            const axios = require("axios");
            
            // List of fact APIs as fallbacks
            const factAPIs = [
                {
                    url: 'https://api.popcat.xyz/fact',
                    handler: (data) => data.fact
                },
                {
                    url: 'https://uselessfacts.jsph.pl/random.json?language=en',
                    handler: (data) => data.text
                },
                {
                    url: 'https://asli-fun-fact-api.herokuapp.com/',
                    handler: (data) => data.data.fact
                }
            ];

            let fact = null;
            let lastError = null;

            // Try each API until we get a valid fact
            for (const api of factAPIs) {
                try {
                    console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 𝖿𝖺𝖼𝗍 𝖠𝖯𝖨: ${api.url}`);
                    
                    const response = await axios.get(api.url, {
                        timeout: 15000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json'
                        }
                    });

                    if (response.data) {
                        fact = api.handler(response.data);
                        
                        // Validate the fact
                        if (fact && typeof fact === 'string' && fact.trim().length > 10) {
                            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝗈𝗍 𝖿𝖺𝖼𝗍 𝖿𝗋𝗈𝗆: ${api.url}`);
                            break;
                        } else {
                            throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝖺𝖼𝗍 𝖽𝖺𝗍𝖺");
                        }
                    } else {
                        throw new Error("𝖭𝗈 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽");
                    }
                    
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`❌ 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽: ${api.url} - ${apiError.message}`);
                    continue;
                }
            }

            if (!fact) {
                // Use hardcoded facts as final fallback
                const fallbackFacts = [
                    "𝖧𝗎𝗆𝖺𝗇𝗌 𝖺𝗋𝖾 𝗍𝗁𝖾 𝗈𝗇𝗅𝗒 𝖺𝗇𝗂𝗆𝖺𝗅𝗌 𝗍𝗁𝖺𝗍 𝖾𝗇𝗃𝗈𝗒 𝗌𝗉𝗂𝖼𝗒 𝖿𝗈𝗈𝖽.",
                    "𝖠 𝗌𝗇𝗈𝗐𝖿𝗅𝖺𝗄𝖾 𝗍𝖺𝗄𝖾𝗌 𝖺𝗇 𝖺𝗏𝖾𝗋𝖺𝗀𝖾 𝗈𝖿 𝟣 𝗁𝗈𝗎𝗋 𝗍𝗈 𝖿𝖺𝗅𝗅 𝖿𝗋𝗈𝗆 𝖺 𝖼𝗅𝗈𝗎𝖽 𝗍𝗈 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗇𝖽.",
                    "𝖳𝗁𝖾𝗋𝖾 𝖺𝗋𝖾 𝖺𝗋𝗈𝗎𝗇𝖽 𝟪.𝟩 𝗆𝗂𝗅𝗅𝗂𝗈𝗇 𝗅𝗂𝗏𝗂𝗇𝗀 𝗌𝗉𝖾𝖼𝗂𝖾𝗌 𝗂𝗇 𝗍𝗁𝖾 𝗐𝗈𝗋𝗅𝖽.",
                    "𝖠 𝗌𝗂𝗇𝗀𝗅𝖾 𝖻𝗅𝗈𝗈𝖽 𝖼𝖾𝗅𝗅 𝗍𝖺𝗄𝖾𝗌 𝖺𝗋𝗈𝗎𝗇𝖽 𝟨𝟢 𝗌𝖾𝖼𝗈𝗇𝖽𝗌 𝗍𝗈 𝗍𝗋𝖺𝗏𝖾𝗅 𝗍𝗁𝗋𝗈𝗎𝗀𝗁 𝗍𝗁𝖾 𝗁𝗎𝗆𝖺𝗇 𝖻𝗈𝖽𝗒.",
                    "𝖳𝗁𝖾 𝗌𝗁𝗈𝗋𝗍𝖾𝗌𝗍 𝗐𝖺𝗋 𝗂𝗇 𝗁𝗂𝗌𝗍𝗈𝗋𝗒 𝗅𝖺𝗌𝗍𝖾𝖽 𝗈𝗇𝗅𝗒 𝟥𝟪 𝗆𝗂𝗇𝗎𝗍𝖾𝗌.",
                    "𝖧𝗈𝗇𝖾𝗒 𝗇𝖾𝗏𝖾𝗋 𝗌𝗉𝗈𝗂𝗅𝗌. 𝖠𝗋𝖼𝗁𝖺𝖾𝗈𝗅𝗈𝗀𝗂𝗌𝗍𝗌 𝗁𝖺𝗏𝖾 𝖿𝗈𝗎𝗇𝖽 𝖾𝖽𝗂𝖻𝗅𝖾 𝗁𝗈𝗇𝖾𝗒 𝗂𝗇 𝖺𝗇𝖼𝗂𝖾𝗇𝗍 𝖤𝗀𝗒𝗉𝗍𝗂𝖺𝗇 𝗍𝗈𝗆𝖻𝗌.",
                    "𝖳𝗁𝖾 𝖻𝗋𝖺𝗂𝗇 𝗈𝖿 𝖺𝗇 𝗈𝖼𝗍𝗈𝗉𝗎𝗌 𝗂𝗌 𝗌𝗁𝖺𝗉𝖾𝖽 𝗅𝗂𝗄𝖾 𝖺 𝖽𝗈𝗇𝗎𝗍.",
                    "𝖠 𝗀𝗋𝗈𝗎𝗉 𝗈𝖿 𝗉𝖺𝗇𝖽𝖺𝗌 𝗂𝗌 𝖼𝖺𝗅𝗅𝖾𝖽 𝖺𝗇 𝖾𝗆𝖻𝖺𝗋𝗋𝖺𝗌𝗌𝗆𝖾𝗇𝗍.",
                    "𝖳𝗁𝖾𝗋𝖾 𝖺𝗋𝖾 𝖺𝗉𝗉𝗋𝗈𝗑𝗂𝗆𝖺𝗍𝖾𝗅𝗒 𝟥 𝖻𝗂𝗅𝗅𝗂𝗈𝗇 𝗍𝗋𝖾𝖾𝗌 𝗈𝗇 𝖤𝖺𝗋𝗍𝗁 𝖿𝗈𝗋 𝖾𝗏𝖾𝗋𝗒 𝗉𝖾𝗋𝗌𝗈𝗇.",
                    "𝖠 𝗌𝗇𝖺𝗂𝗅 𝖼𝖺𝗇 𝗌𝗅𝖾𝖾𝗉 𝖿𝗈𝗋 𝟥 𝗒𝖾𝖺𝗋𝗌."
                ];
                
                fact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
                console.log("🔄 𝖴𝗌𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖿𝖺𝖼𝗍");
            }

            // Format and send the fact
            const formattedFact = `🔮 | 𝖱𝖺𝗇𝖽𝗈𝗆 𝖥𝖺𝖼𝗍 𝖥𝗈𝗋 𝖸𝗈𝗎\n\n✨ | 𝖥𝖺𝖼𝗍: ${fact}\n\n💫 | 𝖢𝗋𝖾𝖺𝗍𝗈𝗋: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;
            
            await message.reply(formattedFact);
            
        } catch (error) {
            console.error("💥 𝖥𝖺𝖼𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Don't send error message to avoid spam, just log it
        }
    }
};
