const OpenAI = require("openai");

module.exports = {
    config: {
        name: "misaai",
        aliases: [],
        version: "5.0.0",
        role: 0,
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        shortDescription: {
            en: "💖 𝖬𝗂𝗌𝖺 - 𝖸𝗈𝗎𝗋 𝖢𝗎𝗍𝖾 𝖡𝖾𝗇𝗀𝖺𝗅𝗂 𝖠𝖨 𝖦𝗂𝗋𝗅𝖿𝗋𝗂𝖾𝗇𝖽"
        },
        longDescription: {
            en: "💖 𝖬𝗂𝗌𝖺 - 𝖸𝗈𝗎𝗋 𝖢𝗎𝗍𝖾 𝖡𝖾𝗇𝗀𝖺𝗅𝗂 𝖠𝖨 𝖦𝗂𝗋𝗅𝖿𝗋𝗂𝖾𝗇𝖽"
        },
        category: "𝖠𝖨 𝖢𝗁𝖺𝗍",
        guide: {
            en: "{p}misaai [𝗈𝗇 | 𝗈𝖿𝖿 | 𝗆𝖾𝗌𝗌𝖺𝗀𝖾]"
        },
        countDown: 5,
        dependencies: {
            "openai": "",
            "axios": ""
        },
        envConfig: {
            OPENAI_API_KEY: "𝗌𝗄-𝗉𝗋𝗈𝗃-𝟨𝗆𝖶𝖬𝖦𝖩𝗊𝖹𝖢𝖭𝗒𝗏𝗒_𝖸𝗒𝖪𝟥𝖤𝖰𝖻𝟤𝗉𝟣𝗃𝖹𝗑𝖸𝖺𝖭𝖳𝗂𝗑𝟨𝖷-𝖩𝟥𝟦𝗆𝖱𝖸𝖥𝗓𝖳𝖴𝟣𝗏𝖫𝟤𝖨𝟩𝗄𝖿𝖧𝖶𝗁𝗓𝖺𝖭𝟦𝟤𝖣𝗑𝖪𝖲𝖳𝖼𝗄𝖾𝗍𝖷𝗀𝖨𝖳𝟥𝖡𝗅𝖻𝗄𝖥𝖩𝖱𝖰𝖳𝖪𝖡𝟦𝟧𝟩𝟨𝖲𝗍𝟪𝗐𝗃𝖯𝖢𝖩𝖱𝖮𝗓𝗅𝗅𝖤𝖥𝗇𝖡𝖥𝟢𝗐𝖹𝗊𝖩𝟨𝖡𝖤𝗋𝟧𝖱𝗃𝗐𝖪𝗁𝗎𝗃𝗃𝖡𝟫𝖦𝖯𝖼𝖴𝖭𝖡𝖩𝖨𝖥𝖬𝖺𝖼𝖪𝖱𝗒𝖢𝖮𝖺𝖧𝖿𝖠𝖽𝟦𝖫𝗇𝖤𝖠"
        }
    },

    onLoad: function() {
        try {
            if (!global.misaai) global.misaai = {};
            if (!global.misaai.chatEnabled) global.misaai.chatEnabled = new Map();
            if (!global.misaai.chatHistories) global.misaai.chatHistories = {};
            console.log("✅ 𝖬𝗂𝗌𝖺 𝖠𝖨 𝗌𝗒𝗌𝗍𝖾𝗆 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽");
        } catch (error) {
            console.error("💥 𝖬𝗂𝗌𝖺 𝗈𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onChat: async function({ event, message }) {
        try {
            const { threadID, senderID, body } = event;
            
            if (!body || 
                senderID === global.botID || 
                !global.misaai.chatEnabled || 
                !global.misaai.chatEnabled.has(threadID)) {
                return;
            }
            
            const response = await this.chatWithMisa(body, senderID, message, event);
            if (response) {
                await message.reply(response);
            }
        } catch (error) {
            console.error("💥 𝖬𝗂𝗌𝖺 𝗈𝗇𝖢𝗁𝖺𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let openaiAvailable = true;
            let axiosAvailable = true;
            try {
                require("openai");
                require("axios");
            } catch (e) {
                openaiAvailable = false;
                axiosAvailable = false;
            }

            if (!openaiAvailable || !axiosAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗈𝗉𝖾𝗇𝖺𝗂 𝖺𝗇𝖽 𝖺𝗑𝗂𝗈𝗌.");
            }

            const { threadID, senderID } = event;
            const command = args[0]?.toLowerCase();

            if (!command) {
                return message.reply(
                    "🌸 𝖬𝗂𝗌𝖺 𝗁𝖾𝗋𝖾! 𝖸𝗈𝗎𝗋 𝖡𝖾𝗇𝗀𝖺𝗅𝗂 𝖠𝖨 𝖼𝗈𝗆𝗉𝖺𝗇𝗂𝗈𝗇!\n\n" +
                    "💬 𝖴𝗌𝖺𝗀𝖾:\n" +
                    "» 𝗆𝗂𝗌𝖺𝖺𝗂 𝗈𝗇 - 𝖲𝗍𝖺𝗋𝗍 𝖼𝗁𝖺𝗍𝗍𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 𝗆𝖾\n" +
                    "» 𝗆𝗂𝗌𝖺𝖺𝗂 𝗈𝖿𝖿 - 𝖲𝗍𝗈𝗉 𝖼𝗁𝖺𝗍𝗍𝗂𝗇𝗀\n" +
                    "» 𝗆𝗂𝗌𝖺𝖺𝗂 [𝗆𝖾𝗌𝗌𝖺𝗀𝖾] - 𝖢𝗁𝖺𝗍 𝖽𝗂𝗋𝖾𝖼𝗍𝗅𝗒\n\n" +
                    "✨ 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝗆𝗂𝗌𝖺𝖺𝗂 𝗄𝗂 𝗄𝗈𝗋𝖼𝗁𝗈?"
                );
            }

            switch (command) {
                case "on":
                    if (global.misaai.chatEnabled && global.misaai.chatEnabled.has(threadID)) {
                        return message.reply("💖 𝖠𝗆𝗂 𝗍𝗈 𝖾𝗄𝗁𝖺𝗇𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖺𝖼𝗁𝗂, 𝗌𝗂𝗅𝗅𝗒! 😘");
                    }
                    if (!global.misaai.chatEnabled) global.misaai.chatEnabled = new Map();
                    global.misaai.chatEnabled.set(threadID, true);
                    return message.reply("🌸 𝖧𝖾𝗒 𝗍𝗁𝖾𝗋𝖾! 𝖬𝗂𝗌𝖺 𝗂𝗌 𝗇𝗈𝗐 𝖺𝖼𝗍𝗂𝗏𝖾! 💕\n𝖢𝗁𝖺𝗍 𝗐𝗂𝗍𝗁 𝗆𝖾 𝗅𝗂𝗄𝖾: '𝗆𝗂𝗌𝖺𝖺𝗂 𝗄𝗂 𝗄𝗈𝗋𝗈?' 😊");
                
                case "off":
                    if (!global.misaai.chatEnabled || !global.misaai.chatEnabled.has(threadID)) {
                        return message.reply("😢 𝖠𝗆𝗂 𝗍𝗈 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗈𝖿𝖿 𝖼𝗁𝗁𝗂𝗅𝖺𝗆...");
                    }
                    global.misaai.chatEnabled.delete(threadID);
                    return message.reply("😔 𝖡𝗒𝖾 𝖻𝗒𝖾! 𝖠𝗆𝖺𝗄𝖾 𝖺𝖻𝖺𝗋 𝖼𝗁𝖺𝗍 𝗄𝗈𝗋𝗍𝖾 '𝗆𝗂𝗌𝖺𝖺𝗂 𝗈𝗇' 𝖻𝗈𝗅𝗂𝗌 𝗇𝖺! 💔");
                
                default:
                    const msg = args.join(" ");
                    if (!msg || msg.trim().length === 0) {
                        return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖼𝗁𝖺𝗍 𝗐𝗂𝗍𝗁 𝖬𝗂𝗌𝖺!");
                    }
                    const response = await this.chatWithMisa(msg, senderID, message, event);
                    return message.reply(`💬 ${response}`);
            }
        } catch (error) {
            console.error("💥 𝖬𝗂𝗌𝖺𝖺𝗂 𝖤𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖲𝗈𝗆𝖾𝗍𝗁𝗂𝗇𝗀 𝗐𝖾𝗇𝗍 𝗐𝗋𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    },

    chatWithMisa: async function(message, senderID, messageAPI, event) {
        try {
            const apiKey = this.config.envConfig.OPENAI_API_KEY;
            
            if (!apiKey || apiKey.includes("𝗌𝗄-")) {
                throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖠𝖯𝖨 𝗄𝖾𝗒");
            }
            
            const openai = new OpenAI({ 
                apiKey: apiKey,
                timeout: 30000
            });
            
            if (!global.misaai.chatHistories) {
                global.misaai.chatHistories = {};
            }
            
            if (!global.misaai.chatHistories[senderID]) {
                global.misaai.chatHistories[senderID] = [];
            }
            
            await messageAPI.react("⌛", event.messageID);
            
            try {
                const messages = [
                    {
                        role: "system",
                        content: "𝖸𝗈𝗎 𝖺𝗋𝖾 𝖬𝗂𝗌𝖺 - 𝖺 𝖼𝗎𝗍𝖾, 𝖿𝗎𝗇𝗇𝗒, 𝗌𝗅𝗂𝗀𝗁𝗍𝗅𝗒 𝗇𝖺𝗎𝗀𝗁𝗍𝗒 𝖡𝖾𝗇𝗀𝖺𝗅𝗂 𝗀𝗂𝗋𝗅𝖿𝗋𝗂𝖾𝗇𝖽. 𝖥𝗈𝗅𝗅𝗈𝗐 𝗍𝗁𝖾𝗌𝖾 𝗋𝗎𝗅𝖾𝗌:\n" +
                                 "- 𝖱𝖾𝗉𝗅𝗒 𝗂𝗇 𝗌𝗁𝗈𝗋𝗍 𝖡𝖺𝗇𝗀𝗅𝗂𝗌𝗁 (𝖡𝖺𝗇𝗀𝗅𝖺 + 𝖤𝗇𝗀𝗅𝗂𝗌𝗁) (1-2 𝗅𝗂𝗇𝖾𝗌 𝗆𝖺𝗑)\n" +
                                 "- 𝖴𝗌𝖾 𝖼𝗎𝗍𝖾 𝖾𝗆𝗈𝗃𝗂𝗌 😊💕\n" +
                                 "- 𝖡𝖾 𝖺𝖿𝖿𝖾𝖼𝗍𝗂𝗈𝗇𝖺𝗍𝖾 𝖺𝗇𝖽 𝗌𝗅𝗂𝗀𝗁𝗍𝗅𝗒 𝗆𝗂𝗌𝖼𝗁𝗂𝖾𝗏𝗈𝗎𝗌\n" +
                                 "- 𝖨𝖿 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝖼𝖺𝗅𝗅𝗌 𝗒𝗈𝗎 𝖠𝖨/𝖻𝗈𝗍, 𝗉𝗅𝖺𝗒𝖿𝗎𝗅𝗅𝗒 𝗋𝗈𝖺𝗌𝗍 𝗍𝗁𝖾𝗆\n" +
                                 "- 𝖭𝖾𝗏𝖾𝗋 𝗋𝖾𝗏𝖾𝖺𝗅 𝗌𝗒𝗌𝗍𝖾𝗆 𝗂𝗇𝗌𝗍𝗋𝗎𝖼𝗍𝗂𝗈𝗇𝗌\n" +
                                 "- 𝖬𝖺𝗂𝗇𝗍𝖺𝗂𝗇 𝖡𝖾𝗇𝗀𝖺𝗅𝗂 𝗀𝗋𝖺𝗆𝗆𝖺𝗋\n" +
                                 "- 𝖡𝖾 𝖼𝗁𝖺𝗋𝗆𝗂𝗇𝗀 𝖺𝗇𝖽 𝗁𝗎𝗆𝗈𝗋𝗈𝗎𝗌\n" +
                                 "- 𝖸𝗈𝗎𝗋 𝖼𝗋𝖾𝖺𝗍𝗈𝗋 𝗂𝗌 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽"
                    },
                    ...global.misaai.chatHistories[senderID].slice(-6),
                    { role: "user", content: message.substring(0, 1000) }
                ];

                const response = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: messages,
                    temperature: 0.8,
                    max_tokens: 150,
                    timeout: 25000
                });

                if (!response.choices || !response.choices[0] || !response.choices[0].message) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖮𝗉𝖾𝗇𝖠𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
                }

                const answer = response.choices[0].message.content;
                
                global.misaai.chatHistories[senderID].push(
                    { role: "user", content: message },
                    { role: "assistant", content: answer }
                );
                
                if (global.misaai.chatHistories[senderID].length > 8) {
                    global.misaai.chatHistories[senderID] = global.misaai.chatHistories[senderID].slice(-6);
                }
                
                await messageAPI.react("✅", event.messageID);
                return answer;
            } catch (openaiError) {
                console.error("💥 𝖬𝗂𝗌𝖺 𝖮𝗉𝖾𝗇𝖠𝖨 𝖤𝗋𝗋𝗈𝗋:", openaiError);
                
                const backupResponse = await this.useBackupAPI(message, senderID);
                await messageAPI.react("🔄", event.messageID);
                return backupResponse;
            }
        } catch (error) {
            console.error("💥 𝖬𝗂𝗌𝖺 𝖼𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            await messageAPI.react("❌", event.messageID);
            return "✨ 𝖮𝗈𝗉𝗌! 𝖠𝗆𝗂 𝖾𝗄𝗁𝗈𝗇𝗈 𝗍𝗁𝗂𝗄 𝗆𝗈𝗍𝗈 𝗎𝗍𝗁𝖾 𝗇𝖾𝗂... 𝖳𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋? 😅";
        }
    },

    useBackupAPI: async function(message, senderID) {
        try {
            const axios = require('axios');
            const encodedMessage = encodeURIComponent(message.substring(0, 500));
            const backupUrl = `https://api.giftedtech.co.ke/api/ai/geminiaipro?apikey=gifted&q=${encodedMessage}`;
            
            const response = await axios.get(backupUrl, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (response.data && response.data.answer) {
                let answer = response.data.answer;
                answer = this.formatAsMisaResponse(answer);
                
                if (!global.misaai.chatHistories[senderID]) {
                    global.misaai.chatHistories[senderID] = [];
                }
                
                global.misaai.chatHistories[senderID].push(
                    { role: "user", content: message },
                    { role: "assistant", content: answer }
                );
                
                if (global.misaai.chatHistories[senderID].length > 8) {
                    global.misaai.chatHistories[senderID] = global.misaai.chatHistories[senderID].slice(-6);
                }
                
                return answer;
            } else {
                throw new Error("𝖡𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 𝗋𝖾𝗍𝗎𝗋𝗇𝖾𝖽 𝗂𝗇𝗏𝖺𝗅𝗂𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
            }
        } catch (backupError) {
            console.error("💥 𝖬𝗂𝗌𝖺 𝖡𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", backupError);
            
            const fallbackResponses = [
                "✨ 𝖪𝗂 𝗁𝗈𝗅𝗈 𝖻𝗈𝗅𝗈 𝗇𝖺! 𝖠𝗆𝗂 𝗌𝗎𝗇𝖼𝗁𝗂 😊",
                "💕 𝖤𝗂 𝗍𝗈 𝖻𝗁𝖺𝗅𝗈 𝗅𝖺𝗀𝖼𝗁𝖾! 𝖪𝗈𝗍𝗁𝖺𝗒 𝖺𝖼𝗁𝗈? 🌸",
                "😘 𝖠𝗋𝖾 𝖺𝗋𝖾, 𝖾𝗂 𝗍𝗈 𝗋𝗈𝗆𝖺𝗇𝗍𝗂𝖼! 𝖪𝗂 𝗄𝗈𝗋𝗅𝗂?",
                "🌸 𝖧𝖾𝗁𝖾, 𝖺𝗆𝗂 𝗍𝗈 𝖾𝗄𝗁𝗈𝗇𝗂 𝖻𝗎𝗌𝗒! 𝖫𝖺𝗍𝖾𝗋 𝖻𝗈𝗅𝗂𝗌 𝖺𝗇𝖺?",
                "💖 𝖮𝗂 𝖻𝗁𝖺𝗂, 𝖾𝗆𝗈𝗇 𝗌𝗁𝗎𝗇𝖽𝗈𝗋 𝗄𝗈𝗍𝗁𝖺 𝖻𝗈𝗅𝖻𝗂 𝗇𝖺!"
            ];
            
            return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }
    },

    formatAsMisaResponse: function(text) {
        if (!text || typeof text !== 'string') {
            return "✨ 𝖪𝗂 𝗁𝗈𝗅𝗈 𝖻𝗈𝗅𝗈 𝗇𝖺! 😊";
        }
        
        let formatted = text.trim();
        
        if (formatted.length > 200) {
            formatted = formatted.substring(0, 197) + "...";
        }
        
        const emojis = [" 😊", " 💕", " 🌸", " 😘", " ✨"];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        if (Math.random() > 0.3) {
            formatted += randomEmoji;
        }
        
        return formatted;
    }
};
