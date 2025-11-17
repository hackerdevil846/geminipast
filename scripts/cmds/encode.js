const axios = require("axios");

module.exports = {
    config: {
        name: "encode",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 0,
        shortDescription: {
            en: "𝖤𝗇𝖼𝗈𝖽𝖾 𝗍𝖾𝗑𝗍 𝗎𝗌𝗂𝗇𝗀 𝖯𝗈𝗉𝖢𝖺𝗍 𝖠𝖯𝖨"
        },
        longDescription: {
            en: "𝖤𝗇𝖼𝗈𝖽𝖾𝗌 𝗍𝗁𝖾 𝗀𝗂𝗏𝖾𝗇 𝗍𝖾𝗑𝗍 𝖺𝗇𝖽 𝗋𝖾𝗍𝗎𝗋𝗇𝗌 𝗍𝗁𝖾 𝖾𝗇𝖼𝗈𝖽𝖾𝖽 𝗋𝖾𝗌𝗎𝗅𝗍"
        },
        category: "𝗎𝗍𝗂𝗅𝗂𝗍𝗒",
        guide: {
            en: "{p}encode <𝗍𝖾𝗑𝗍>\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}encode 𝗁𝖾𝗅𝗅𝗈\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}encode 𝖧𝖾𝗅𝗅𝗈 𝖶𝗈𝗋𝗅𝖽\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}encode 123𝖺𝖻𝖼"
        },
        dependencies: {
            "axios": ""
        }
    },

    langs: {
        "en": {
            "missing": "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗍𝖾𝗑𝗍 𝗍𝗈 𝖾𝗇𝖼𝗈𝖽𝖾.\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}encode 𝗁𝖾𝗅𝗅𝗈\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}encode 𝖧𝖾𝗅𝗅𝗈 𝖶𝗈𝗋𝗅𝖽",
            "error": "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖾𝗇𝖼𝗈𝖽𝖾 𝗍𝖾𝗑𝗍.",
            "invalid": "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗍𝖾𝗑𝗍 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽.",
            "timeout": "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.",
            "network": "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇."
        }
    },

    onStart: async function ({ message, args, getLang, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            if (!args.length) {
                return message.reply(getLang("missing"));
            }

            const text = args.join(" ").trim();
            
            // Validate input
            if (!text || text.length === 0) {
                return message.reply(getLang("invalid"));
            }

            // Check text length to prevent abuse
            if (text.length > 1000) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 1000 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            const encodedText = encodeURIComponent(text);
            console.log(`🔐 𝖠𝗍𝗍𝖾𝗆𝗉𝗍𝗂𝗇𝗀 𝗍𝗈 𝖾𝗇𝖼𝗈𝖽𝖾: ${text.substring(0, 50)}...`);

            // List of backup APIs in case PopCat fails
            const apiEndpoints = [
                {
                    name: "𝗉𝗈𝗉𝖼𝖺𝗍",
                    url: `https://api.popcat.xyz/v2/encode?text=${encodedText}`,
                    parser: (data) => data.result
                },
                {
                    name: "𝖻𝖺𝗌𝖾𝟨𝟦",
                    url: `https://api.base64encode.org/encode?text=${encodedText}`,
                    parser: (data) => data.encoded
                },
                {
                    name: "𝖼𝗈𝗇𝗏𝖾𝗋𝗍𝖺𝗉𝗂",
                    url: `https://api.convertapi.com/encode?text=${encodedText}`,
                    parser: (data) => data.result
                }
            ];

            let encodedResult = null;
            let lastError = null;

            // Try each API endpoint
            for (const endpoint of apiEndpoints) {
                try {
                    console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 ${endpoint.name} 𝖠𝖯𝖨...`);
                    
                    const response = await axios.get(endpoint.url, {
                        timeout: 15000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json'
                        }
                    });

                    if (response.data) {
                        encodedResult = endpoint.parser(response.data);
                        if (encodedResult) {
                            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖾𝗇𝖼𝗈𝖽𝖾𝖽 𝗎𝗌𝗂𝗇𝗀 ${endpoint.name} 𝖠𝖯𝖨`);
                            break;
                        }
                    }
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`❌ ${endpoint.name} 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽:`, apiError.message);
                    continue;
                }
            }

            if (!encodedResult) {
                // Fallback: Use basic encoding if all APIs fail
                console.log("🔄 𝖴𝗌𝗂𝗇𝗀 𝖻𝖺𝗌𝗂𝖼 𝖾𝗇𝖼𝗈𝖽𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄");
                encodedResult = Buffer.from(text).toString('base64');
            }

            // Format the response
            const responseMessage = 
                "🔐 𝖤𝗇𝖼𝗈𝖽𝖾𝖽 𝖳𝖾𝗑𝗍:\n" +
                "━━━━━━━━━━━━━━━━━━\n" +
                `${encodedResult}\n` +
                "━━━━━━━━━━━━━━━━━━\n" +
                `📝 𝖮𝗋𝗂𝗀𝗂𝗇𝖺𝗅: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`;

            await message.reply(responseMessage);

        } catch (error) {
            console.error("💥 𝖤𝗇𝖼𝗈𝖽𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = getLang("error");
            
            if (error.code === 'ECONNREFUSED' || error.code === 'ENETUNREACH') {
                errorMessage = getLang("network");
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = getLang("timeout");
            } else if (error.response) {
                errorMessage = `❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋: ${error.response.status}`;
            }
            
            await message.reply(errorMessage);
        }
    }
};
