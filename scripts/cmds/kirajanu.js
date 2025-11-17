const axios = require("axios");

module.exports = {
    config: {
        name: "kirajanu",
        aliases: [],
        version: "4.3.10",
        role: 0,
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        category: "ai",
        shortDescription: {
            en: "🤖 𝖠𝖨-𝗉𝗈𝗐𝖾𝗋𝖾𝖽 𝖼𝗁𝖺𝗍𝖻𝗈𝗍 𝗎𝗌𝗂𝗇𝗀 𝖣𝖾𝖾𝗉𝖲𝖾𝖾𝗄 𝖠𝖯𝖨"
        },
        longDescription: {
            en: "🤖 𝖠𝖽𝗏𝖺𝗇𝖼𝖾𝖽 𝖠𝖨 𝖼𝗁𝖺𝗍𝖻𝗈𝗍 𝗉𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 𝖣𝖾𝖾𝗉𝖲𝖾𝖾𝗄 𝖠𝖯𝖨"
        },
        guide: {
            en: "{p}kirajanu [𝗈𝗇 | 𝗈𝖿𝖿 | 𝗒𝗈𝗎𝗋_𝗆𝖾𝗌𝗌𝖺𝗀𝖾]"
        },
        countDown: 5,
        dependencies: {
            "axios": ""
        }
    },

    onLoad: function() {
        try {
            if (!global.kirajanu) {
                global.kirajanu = new Map();
            }
            console.log("🤖 𝖪𝗂𝗋𝖺𝗃𝖺𝗇𝗎 𝖠𝖨 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽");
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖫𝗈𝖺𝖽:", error);
        }
    },

    onStart: async function({ message, event, args, api }) {
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

            const { threadID } = event;
            const DEEPSEEK_API_KEY = "sk-0c82a4df00704663a260cb3c71a4f718";

            if (!args[0]) {
                return message.reply(
                    "💡 𝖴𝗌𝖺𝗀𝖾: 𝗄𝗂𝗋𝖺𝗃𝖺𝗇𝗎 [𝗈𝗇/𝗈𝖿𝖿/𝗒𝗈𝗎𝗋_𝗆𝖾𝗌𝗌𝖺𝗀𝖾]\n\n" +
                    "• 𝗈𝗇 - 𝖤𝗇𝖺𝖻𝗅𝖾 𝖠𝖨 𝖼𝗁𝖺𝗍\n" +
                    "• 𝗈𝖿𝖿 - 𝖣𝗂𝗌𝖺𝖻𝗅𝖾 𝖠𝖨 𝖼𝗁𝖺𝗍\n" +
                    "• 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 - 𝖠𝗌𝗄 𝗍𝗁𝖾 𝖠𝖨 𝖺 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇"
                );
            }

            const action = args[0].toLowerCase().trim();

            switch (action) {
                case "on":
                    if (global.kirajanu.has(threadID)) {
                        return message.reply("ℹ️ 𝖠𝖨 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖺𝖼𝗍𝗂𝗏𝖾 𝗂𝗇 𝗍𝗁𝗂𝗌 𝖼𝗁𝖺𝗍");
                    }
                    global.kirajanu.set(threadID, true);
                    return message.reply("🧠 𝖠𝖨 𝖢𝗁𝖺𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗍𝗎𝗋𝗇𝖾𝖽 𝖮𝖭 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝖼𝗈𝗇𝗏𝖾𝗋𝗌𝖺𝗍𝗂𝗈𝗇");

                case "off":
                    if (!global.kirajanu.has(threadID)) {
                        return message.reply("ℹ️ 𝖠𝖨 𝗂𝗌 𝗇𝗈𝗍 𝖺𝖼𝗍𝗂𝗏𝖾 𝗂𝗇 𝗍𝗁𝗂𝗌 𝖼𝗁𝖺𝗍");
                    }
                    global.kirajanu.delete(threadID);
                    return message.reply("⭕ 𝖠𝖨 𝖢𝗁𝖺𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗍𝗎𝗋𝗇𝖾𝖽 𝖮𝖥𝖥 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝖼𝗈𝗇𝗏𝖾𝗋𝗌𝖺𝗍𝗂𝗈𝗇");

                default:
                    try {
                        const prompt = args.join(" ").trim();
                        
                        // Validate prompt
                        if (prompt.length < 1) {
                            return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇 𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾");
                        }

                        if (prompt.length > 4000) {
                            return message.reply("❌ 𝖬𝖾𝗌𝗌𝖺𝗀𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 4000 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌");
                        }

                        const loadingMsg = await message.reply("⏳ 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍...");

                        let aiResponse = null;
                        let lastError = null;

                        // Try DeepSeek API first
                        try {
                            console.log("🔗 𝖳𝗋𝗒𝗂𝗇𝗀 𝖣𝖾𝖾𝗉𝖲𝖾𝖾𝗄 𝖠𝖯𝖨...");
                            
                            const response = await axios.post(
                                "https://api.deepseek.com/chat/completions",
                                {
                                    model: "deepseek-chat",
                                    messages: [{ role: "user", content: prompt }],
                                    temperature: 0.7,
                                    max_tokens: 2000,
                                    stream: false
                                },
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                                    },
                                    timeout: 45000
                                }
                            );

                            if (response.data?.choices?.[0]?.message?.content) {
                                aiResponse = response.data.choices[0].message.content.trim();
                                console.log("✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝗈𝗍 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗋𝗈𝗆 𝖣𝖾𝖾𝗉𝖲𝖾𝖾𝗄");
                            } else {
                                throw new Error("𝖭𝗈 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖽𝖺𝗍𝖺 𝖿𝗋𝗈𝗆 𝖣𝖾𝖾𝗉𝖲𝖾𝖾𝗄");
                            }
                        } catch (deepseekError) {
                            lastError = deepseekError;
                            console.error("❌ 𝖣𝖾𝖾𝗉𝖲𝖾𝖾𝗄 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", deepseekError.message);
                        }

                        // If DeepSeek failed, try giftedtech API
                        if (!aiResponse) {
                            try {
                                console.log("🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝗀𝗂𝖿𝗍𝖾𝖽𝗍𝖾𝖼𝗁 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄...");
                                
                                const fallbackResponse = await axios.get(
                                    `https://api.giftedtech.co.ke/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(prompt)}`,
                                    { 
                                        timeout: 30000,
                                        headers: {
                                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                                        }
                                    }
                                );

                                if (fallbackResponse.data && fallbackResponse.data.response) {
                                    aiResponse = fallbackResponse.data.response.toString().trim();
                                    console.log("✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝗈𝗍 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗋𝗈𝗆 𝗀𝗂𝖿𝗍𝖾𝖽𝗍𝖾𝖼𝗁");
                                } else {
                                    throw new Error("𝖭𝗈 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖽𝖺𝗍𝖺 𝖿𝗋𝗈𝗆 𝗀𝗂𝖿𝗍𝖾𝖽𝗍𝖾𝖼𝗁");
                                }
                            } catch (fallbackError) {
                                lastError = fallbackError;
                                console.error("❌ 𝖦𝗂𝖿𝗍𝖾𝖽𝗍𝖾𝖼𝗁 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", fallbackError.message);
                            }
                        }

                        // Unsend loading message
                        try {
                            await message.unsend(loadingMsg.messageID);
                        } catch (unsendError) {
                            console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                        }

                        if (aiResponse) {
                            // Ensure response is not too long
                            if (aiResponse.length > 2000) {
                                aiResponse = aiResponse.substring(0, 1997) + "...";
                            }
                            return await message.reply(`🤖 ${aiResponse}`);
                        } else {
                            throw new Error(`𝖠𝗅𝗅 𝖠𝖯𝖨𝗌 𝖿𝖺𝗂𝗅𝖾𝖽: ${lastError?.message || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖾𝗋𝗋𝗈𝗋"}`);
                        }

                    } catch (error) {
                        console.error("💥 𝖠𝖨 𝖱𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
                        await message.reply("❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋: 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋");
                    }
            }
        } catch (error) {
            console.error("💥 𝖪𝗂𝗋𝖺𝗃𝖺𝗇𝗎 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    },

    onChat: async function({ message, event, api }) {
        try {
            const { threadID, senderID, body } = event;
            const DEEPSEEK_API_KEY = "sk-0c82a4df00704663a260cb3c71a4f718";

            // Check if AI is enabled for this thread and message is valid
            if (global.kirajanu.has(threadID) && 
                senderID !== api.getCurrentUserID() && 
                body && body.trim().length > 0) {
                
                const prompt = body.trim();
                
                // Ignore very short messages or commands
                if (prompt.length < 2 || prompt.startsWith('!') || prompt.startsWith('/') || prompt.startsWith('.')) {
                    return;
                }

                // Ignore if message is too long
                if (prompt.length > 1000) {
                    return;
                }

                try {
                    let aiResponse = null;

                    // Try DeepSeek API first
                    try {
                        const response = await axios.post(
                            "https://api.deepseek.com/chat/completions",
                            {
                                model: "deepseek-chat",
                                messages: [{ role: "user", content: prompt }],
                                temperature: 0.7,
                                max_tokens: 1000,
                                stream: false
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                                },
                                timeout: 30000
                            }
                        );

                        if (response.data?.choices?.[0]?.message?.content) {
                            aiResponse = response.data.choices[0].message.content.trim();
                        }
                    } catch (deepseekError) {
                        console.error("❌ 𝖣𝖾𝖾𝗉𝖲𝖾𝖾𝗄 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋 (𝗈𝗇𝖢𝗁𝖺𝗍):", deepseekError.message);
                    }

                    // If DeepSeek failed, try giftedtech API
                    if (!aiResponse) {
                        try {
                            const fallbackResponse = await axios.get(
                                `https://api.giftedtech.co.ke/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(prompt)}`,
                                { 
                                    timeout: 20000,
                                    headers: {
                                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                                    }
                                }
                            );

                            if (fallbackResponse.data && fallbackResponse.data.response) {
                                aiResponse = fallbackResponse.data.response.toString().trim();
                            }
                        } catch (fallbackError) {
                            console.error("❌ 𝖦𝗂𝖿𝗍𝖾𝖽𝗍𝖾𝖼𝗁 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋 (𝗈𝗇𝖢𝗁𝖺𝗍):", fallbackError.message);
                        }
                    }

                    if (aiResponse) {
                        // Ensure response is not too long
                        if (aiResponse.length > 1500) {
                            aiResponse = aiResponse.substring(0, 1497) + "...";
                        }
                        await message.reply(`🤖 ${aiResponse}`);
                    }
                } catch (error) {
                    console.error("💥 𝖠𝖨 𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
                    // Don't send error message for auto-chat to avoid spam
                }
            }
        } catch (error) {
            console.error("💥 𝖪𝗂𝗋𝖺𝗃𝖺𝗇𝗎 𝗈𝗇𝖢𝗁𝖺𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
