const axios = require("axios");

module.exports = {
    config: {
        name: "element",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "education",
        shortDescription: {
            en: "𝖦𝖾𝗍 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖺𝖻𝗈𝗎𝗍 𝖺 𝗉𝖾𝗋𝗂𝗈𝖽𝗂𝖼 𝗍𝖺𝖻𝗅𝖾 𝖾𝗅𝖾𝗆𝖾𝗇𝗍"
        },
        longDescription: {
            en: "𝖥𝖾𝗍𝖼𝗁𝖾𝗌 𝖽𝖾𝗍𝖺𝗂𝗅𝖾𝖽 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖺𝖻𝗈𝗎𝗍 𝖺 𝖼𝗁𝖾𝗆𝗂𝖼𝖺𝗅 𝖾𝗅𝖾𝗆𝖾𝗇𝗍 𝖿𝗋𝗈𝗆 𝖯𝗈𝗉𝖼𝖺𝗍 𝖠𝖯𝖨"
        },
        guide: {
            en: "{p}element <𝗇𝖺𝗆𝖾 𝗈𝗋 𝗌𝗒𝗆𝖻𝗈𝗅>\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}element 𝗀𝗈𝗅𝖽\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}element 𝖠𝗎"
        },
        dependencies: {
            "axios": ""
        }
    },

    langs: {
        "en": {
            "missing": "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺𝗇 𝖾𝗅𝖾𝗆𝖾𝗇𝗍 𝗇𝖺𝗆𝖾 𝗈𝗋 𝗌𝗒𝗆𝖻𝗈𝗅!\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}element 𝗀𝗈𝗅𝖽\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}element 𝖠𝗎",
            "notFound": "❌ 𝖭𝗈 𝖾𝗅𝖾𝗆𝖾𝗇𝗍 𝖿𝗈𝗎𝗇𝖽 𝗐𝗂𝗍𝗁 𝗍𝗁𝖺𝗍 𝗇𝖺𝗆𝖾 𝗈𝗋 𝗌𝗒𝗆𝖻𝗈𝗅.\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}element 𝗈𝗑𝗒𝗀𝖾𝗇\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}element 𝖮",
            "apiError": "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖾𝗅𝖾𝗆𝖾𝗇𝗍 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.",
            "networkError": "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.",
            "result": "🧪 𝖤𝗅𝖾𝗆𝖾𝗇𝗍 𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇\n\n🔹 𝖭𝖺𝗆𝖾: %1\n🔹 𝖲𝗒𝗆𝖻𝗈𝗅: %2\n🔹 𝖠𝗍𝗈𝗆𝗂𝖼 𝖭𝗎𝗆𝖻𝖾𝗋: %3\n🔹 𝖠𝗍𝗈𝗆𝗂𝖼 𝖬𝖺𝗌𝗌: %4\n🔹 𝖠𝗉𝗉𝖾𝖺𝗋𝖺𝗇𝖼𝖾: %5\n🔹 𝖢𝖺𝗍𝖾𝗀𝗈𝗋𝗒: %6\n🔹 𝖣𝗂𝗌𝖼𝗈𝗏𝖾𝗋𝖾𝖽 𝖡𝗒: %7\n🔹 𝖯𝗁𝖺𝗌𝖾: %8\n🔹 𝖲𝗎𝗆𝗆𝖺𝗋𝗒: %9"
        }
    },

    onStart: async function({ message, args, getLang }) {
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

            if (!args[0]) {
                return message.reply(getLang("missing"));
            }

            const element = encodeURIComponent(args.join(" ").trim());
            
            // Validate input length
            if (element.length > 50) {
                return message.reply("❌ 𝖤𝗅𝖾𝗆𝖾𝗇𝗍 𝗇𝖺𝗆𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝖾𝗅𝖾𝗆𝖾𝗇𝗍 𝗇𝖺𝗆𝖾 𝗈𝗋 𝗌𝗒𝗆𝖻𝗈𝗅.");
            }

            if (element.length < 1) {
                return message.reply(getLang("missing"));
            }

            console.log(`🔍 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖿𝗈𝗋 𝖾𝗅𝖾𝗆𝖾𝗇𝗍: ${element}`);

            try {
                const res = await axios.get(`https://api.popcat.xyz/v2/periodic-table?element=${element}`, {
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!res.data) {
                    throw new Error("𝖭𝗈 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨");
                }

                const data = res.data;

                // Validate required fields
                if (!data.name || !data.symbol || !data.atomic_number) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖾𝗅𝖾𝗆𝖾𝗇𝗍 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽");
                }

                // Format data with fallbacks
                const appearance = data.appearance || "𝖭/𝖠";
                const discoveredBy = data.discovered_by || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                const atomicMass = data.atomic_mass || "𝖭/𝖠";
                const category = data.category || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                const phase = data.phase || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                const summary = data.summary || "𝖭𝗈 𝗌𝗎𝗆𝗆𝖺𝗋𝗒 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾";

                console.log(`✅ 𝖥𝗈𝗎𝗇𝖽 𝖾𝗅𝖾𝗆𝖾𝗇𝗍: ${data.name} (${data.symbol})`);

                const replyText = getLang(
                    "result", 
                    data.name, 
                    data.symbol, 
                    data.atomic_number, 
                    atomicMass, 
                    appearance, 
                    category, 
                    discoveredBy, 
                    phase, 
                    summary
                );
                
                await message.reply(replyText);
                
            } catch (apiError) {
                console.error("❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError.message);
                
                if (apiError.code === 'ECONNREFUSED' || apiError.code === 'ENETUNREACH') {
                    return message.reply(getLang("networkError"));
                } else if (apiError.response && apiError.response.status === 404) {
                    return message.reply(getLang("notFound"));
                } else if (apiError.code === 'ETIMEDOUT') {
                    return message.reply("❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                } else {
                    return message.reply(getLang("notFound"));
                }
            }
            
        } catch (error) {
            console.error("💥 𝖤𝗅𝖾𝗆𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = getLang("apiError");
            
            if (error.message.includes('dependency')) {
                errorMessage = "❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.";
            } else if (error.message.includes('network')) {
                errorMessage = getLang("networkError");
            }
            
            await message.reply(errorMessage);
        }
    }
};
