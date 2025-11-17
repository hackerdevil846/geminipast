const axios = require("axios");

module.exports = {
    config: {
        name: "fatherjoke",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝖣𝖺𝖽 𝗃𝗈𝗄𝖾"
        },
        longDescription: {
            en: "𝖱𝖺𝗇𝖽𝗈𝗆 𝖽𝖺𝖽 𝗃𝗈𝗄𝖾"
        },
        category: "𝖿𝗎𝗇",
        guide: {
            en: "{p}fatherjoke"
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

            // List of backup dad joke APIs
            const jokeApis = [
                {
                    name: "𝗂𝖼𝖺𝗇𝗁𝖺𝗓𝖽𝖺𝖽𝗃𝗈𝗄𝖾",
                    url: "https://icanhazdadjoke.com/",
                    handler: (data) => data.joke
                },
                {
                    name: "𝖽𝖺𝖽𝗃𝗈𝗄𝖾𝗌𝖺𝗉𝗂",
                    url: "https://dad-jokes.p.rapidapi.com/random/joke",
                    handler: (data) => data.body?.[0]?.setup && data.body?.[0]?.punchline ? 
                        `${data.body[0].setup} - ${data.body[0].punchline}` : null,
                    headers: {
                        "X-RapidAPI-Key": "your-rapidapi-key-here", // Note: This would need a valid key
                        "X-RapidAPI-Host": "dad-jokes.p.rapidapi.com"
                    }
                },
                {
                    name: "𝗃𝗈𝗄𝖾𝖺𝗉𝗂",
                    url: "https://official-joke-api.appspot.com/random_joke",
                    handler: (data) => data.setup && data.punchline ? 
                        `${data.setup} - ${data.punchline}` : null
                }
            ];

            // Hardcoded fallback dad jokes
            const fallbackJokes = [
                "𝖶𝗁𝗒 𝖽𝗂𝖽 𝗍𝗁𝖾 𝗌𝖼𝖺𝗋𝖾𝖼𝗋𝗈𝗐 𝗐𝗂𝗇 𝖺𝗇 𝖺𝗐𝖺𝗋𝖽? 𝖡𝖾𝖼𝖺𝗎𝗌𝖾 𝗁𝖾 𝗐𝖺𝗌 𝖮𝗎𝗍𝗌𝗍𝖺𝗇𝖽𝗂𝗇𝗀 𝗂𝗇 𝗁𝗂𝗌 𝖿𝗂𝖾𝗅𝖽!",
                "𝖨 𝗎𝗌𝖾𝖽 𝗍𝗈 𝗉𝗅𝖺𝗒 𝗉𝗂𝖺𝗇𝗈 𝖻𝗒 𝖾𝖺𝗋, 𝖻𝗎𝗍 𝗇𝗈𝗐 𝗂 𝗎𝗌𝖾 𝗋𝖾𝗌𝗈𝗋𝗍𝗌 𝖺𝗇𝖽 𝗁𝗈𝗍𝖾𝗅𝗌.",
                "𝖶𝗁𝖺𝗍 𝖽𝗈 𝗒𝗈𝗎 𝖼𝖺𝗅𝗅 𝖺 𝖿𝖺𝗄𝖾 𝗇𝗈𝗈𝖽𝗅𝖾? 𝖠𝗇 𝖨𝗆𝗉𝖺𝗌𝗍𝖺!",
                "𝖶𝗁𝗒 𝖽𝗂𝖽 𝗍𝗁𝖾 𝗆𝖺𝗍𝗁 𝗉𝗋𝗈𝖿𝖾𝗌𝗌𝗈𝗋 𝗌𝗍𝗋𝗎𝗀𝗀𝗅𝖾 𝗐𝗂𝗍𝗁 𝖾𝗑𝗉𝗈𝗇𝖾𝗇𝗍𝗌? 𝖧𝖾 𝗃𝗎𝗌𝗍 𝖽𝗂𝖽𝗇'𝗍 𝗎𝗇𝖽𝖾𝗋𝗌𝗍𝖺𝗇𝖽 𝗍𝗁𝖾𝗂𝗋 𝗉𝗈𝗐𝖾𝗋!",
                "𝖨 𝗐𝗈𝗎𝗅𝖽 𝗍𝖾𝗅𝗅 𝗒𝗈𝗎 𝖺 𝖼𝗁𝖾𝗆𝗂𝗌𝗍𝗋𝗒 𝗃𝗈𝗄𝖾 𝖻𝗎𝗍 𝖨 𝗄𝗇𝗈𝗐 𝖨 𝗐𝗈𝗎𝗅𝖽𝗇'𝗍 𝗀𝖾𝗍 𝖺 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇.",
                "𝖶𝗁𝗒 𝖽𝗂𝖽 𝗍𝗁𝖾 𝗌𝗍𝗎𝖽𝖾𝗇𝗍 𝖾𝖺𝗍 𝗁𝗂𝗌 𝗁𝗈𝗆𝖾𝗐𝗈𝗋𝗄? 𝖡𝖾𝖼𝖺𝗎𝗌𝖾 𝗁𝗂𝗌 𝗍𝖾𝖺𝖼𝗁𝖾𝗋 𝗌𝖺𝗂𝖽 𝗂𝗍 𝗐𝖺𝗌 𝖺 𝗉𝗂𝖾𝖼𝖾 𝗈𝖿 𝖼𝖺𝗄𝖾!",
                "𝖧𝗈𝗐 𝖽𝗈𝖾𝗌 𝖺 𝗉𝖾𝗇𝗀𝗎𝗂𝗇 𝖻𝗎𝗂𝗅𝖽 𝗂𝗍𝗌 𝗁𝗈𝗎𝗌𝖾? 𝖨𝗀𝗅𝗈𝗈𝗌 𝗂𝗍 𝗍𝗈𝗀𝖾𝗍𝗁𝖾𝗋!",
                "𝖶𝗁𝗒 𝖽𝗂𝖽 𝗍𝗁𝖾 𝗀𝗈𝗅𝖽𝖿𝗂𝗌𝗁 𝗀𝖾𝗍 𝖺 𝗍𝗋𝗈𝗉𝗁𝗒? 𝖡𝖾𝖼𝖺𝗎𝗌𝖾 𝗁𝖾 𝖼𝗈𝗎𝗅𝖽 𝗌𝖼𝗁𝗈𝗈𝗅 𝗈𝗍𝗁𝖾𝗋 𝖿𝗂𝗌𝗁!",
                "𝖨 𝗎𝗌𝖾𝖽 𝗍𝗈 𝖻𝖾 𝖺 𝖻𝖺𝗄𝖾𝗋, 𝖻𝗎𝗍 𝗂 𝗀𝗈𝗍 𝗋𝗂𝖽 𝗈𝖿 𝗆𝗒 𝖽𝗈𝗎𝗀𝗁. 𝖨𝗍 𝗐𝖺𝗌 𝗄𝗇𝖾𝖺𝖽𝖾𝖽.",
                "𝖶𝗁𝖺𝗍'𝗌 𝖺 𝗀𝗁𝗈𝗌𝗍'𝗌 𝖿𝖺𝗏𝗈𝗋𝗂𝗍𝖾 𝖿𝗋𝗎𝗂𝗍? 𝖡𝗈𝗈-𝖻𝖾𝗋𝗋𝗂𝖾𝗌!"
            ];

            let joke = null;
            let lastError = null;

            // Try each API endpoint
            for (const api of jokeApis) {
                try {
                    console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 ${api.name} 𝖠𝖯𝖨...`);
                    
                    const response = await axios.get(api.url, {
                        headers: {
                            "Accept": "application/json",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            ...api.headers
                        },
                        timeout: 15000
                    });

                    if (response.data) {
                        joke = api.handler(response.data);
                        if (joke) {
                            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝖿𝗋𝗈𝗆 ${api.name} 𝖠𝖯𝖨`);
                            break;
                        } else {
                            throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗃𝗈𝗄𝖾 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽");
                        }
                    } else {
                        throw new Error("𝖭𝗈 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨");
                    }
                    
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`❌ ${api.name} 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽:`, apiError.message);
                    continue;
                }
            }

            // If no API worked, use fallback jokes
            if (!joke) {
                console.log("🔄 𝖭𝗈 𝖠𝖯𝖨𝗌 𝗐𝗈𝗋𝗄𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗃𝗈𝗄𝖾𝗌");
                const randomIndex = Math.floor(Math.random() * fallbackJokes.length);
                joke = fallbackJokes[randomIndex];
            }

            // Send the joke
            await message.reply(`👨‍🦳 𝖣𝖺𝖽 𝖩𝗈𝗄𝖾:\n"${joke}"`);

        } catch (error) {
            console.error("💥 𝖥𝖺𝗍𝗁𝖾𝗋𝖩𝗈𝗄𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Don't send error message to avoid spam, just log it
        }
    }
};
