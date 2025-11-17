const axios = require("axios");

module.exports = {
    config: {
        name: "misa",
        aliases: [],
        version: "1.1.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 2,
        role: 0,
        category: "ai",
        shortDescription: {
            en: "𝖬𝗂𝗌𝖺 𝖠𝖨 - 𝖠𝗄𝖺𝗋𝗌𝗁𝗈𝗇𝗂𝗒𝗈 𝖻𝖺𝗇𝗀𝖺𝗅𝗂 𝗀𝗂𝗋𝗅𝖿𝗋𝗂𝖾𝗇𝖽 𝗌𝖺𝗆𝗂𝗄𝗌𝗁𝖺𝗄𝖺𝗋𝗂"
        },
        longDescription: {
            en: "𝖠 𝖡𝖺𝗇𝗀𝗅𝖺𝖽𝖾𝗌𝗁𝗂 𝗀𝗂𝗋𝗅𝖿𝗋𝗂𝖾𝗇𝖽 𝖠𝖨 𝖺𝗌𝗌𝗂𝗌𝗍𝖺𝗇𝗍 𝗐𝗂𝗍𝗁 𝖺𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖿𝖾𝖺𝗍𝗎𝗋𝖾𝗌"
        },
        guide: {
            en: "{p}misa [𝗈𝗇/𝗈𝖿𝖿/𝖺𝗌𝗄]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check with better validation
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            const { senderID, threadID } = event;
            let userMessage = args.join(" ").trim();

            // Initialize global data if not exists
            if (!global.misaData) {
                global.misaData = {
                    chatHistories: {},
                    autoReplyEnabled: {}
                };
                console.log("✅ 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝗀𝗅𝗈𝖻𝖺𝗅 𝖬𝗂𝗌𝖺 𝖽𝖺𝗍𝖺");
            }

            const { chatHistories, autoReplyEnabled } = global.misaData;

            // Auto-reply ON
            if (userMessage.toLowerCase() === "on") {
                autoReplyEnabled[senderID] = true;
                console.log(`✅ 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖾𝗇𝖺𝖻𝗅𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                return message.reply("𝖧𝖾𝗒 𝖻𝖺𝖻𝗒! 😘 𝖺𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗆𝗈𝖽𝖾 𝖮𝖭 𝗁𝗈𝗒𝖾𝖼𝗁𝖾... ❤️");
            }

            // Auto-reply OFF
            if (userMessage.toLowerCase() === "off") {
                autoReplyEnabled[senderID] = false;
                if (chatHistories[senderID]) {
                    chatHistories[senderID] = [];
                }
                console.log(`✅ 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                return message.reply("𝖧𝗆𝗆! 😒 𝖺𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗆𝗈𝖽𝖾 𝖮𝖥𝖥 𝗁𝗈𝗒𝖾𝖼𝗁𝖾... 🥺");
            }

            // Show help if no message and auto-reply is off
            if (!userMessage && !autoReplyEnabled[senderID]) {
                const helpMsg = `🤖 𝖬𝗂𝗌𝖺 𝖠𝖨 𝖧𝖾𝗅𝗉:

💡 𝖴𝗌𝖺𝗀𝖾:
• ${global.config.PREFIX}𝗆𝗂𝗌𝖺 𝗈𝗇 - 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖾𝗇𝖺𝖻𝗅𝖾
• ${global.config.PREFIX}𝗆𝗂𝗌𝖺 𝗈𝖿𝖿 - 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖽𝗂𝗌𝖺𝖻𝗅𝖾  
• ${global.config.PREFIX}𝗆𝗂𝗌𝖺 [𝗆𝖾𝗌𝗌𝖺𝗀𝖾] - 𝖢𝗁𝖺𝗍 𝗐𝗂𝗍𝗁 𝖬𝗂𝗌𝖺

✨ 𝖥𝖾𝖺𝗍𝗎𝗋𝖾𝗌:
• 𝖡𝖺𝗇𝗀𝗅𝖺𝖽𝖾𝗌𝗁𝗂 𝗀𝗂𝗋𝗅𝖿𝗋𝗂𝖾𝗇𝖽 𝖠𝖨
• 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗆𝗈𝖽𝖾
• 𝖢𝗈𝗇𝗏𝖾𝗋𝗌𝖺𝗍𝗂𝗈𝗇 𝗆𝖾𝗆𝗈𝗋𝗒
• 𝖥𝗎𝗇 𝖺𝗇𝖽 𝗅𝗈𝗏𝗂𝗇𝗀 𝖼𝗁𝖺𝗍𝗌`;
                return message.reply(helpMsg);
            }

            // Initialize chat history
            if (!chatHistories[senderID]) {
                chatHistories[senderID] = [];
                console.log(`✅ 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝖼𝗁𝖺𝗍 𝗁𝗂𝗌𝗍𝗈𝗋𝗒 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
            }

            // If no message but auto-reply is on, wait for chat input
            if (!userMessage && autoReplyEnabled[senderID]) {
                console.log(`ℹ️ 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖾𝗇𝖺𝖻𝗅𝖾𝖽 𝖻𝗎𝗍 𝗇𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                return;
            }

            // Add user message to history
            chatHistories[senderID].push(`𝖴𝗌𝖾𝗋: ${userMessage}`);
            console.log(`💬 𝖠𝖽𝖽𝖾𝖽 𝗎𝗌𝖾𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝗁𝗂𝗌𝗍𝗈𝗋𝗒: ${userMessage.substring(0, 50)}...`);

            // Keep only last 5 messages for context
            if (chatHistories[senderID].length > 5) {
                chatHistories[senderID] = chatHistories[senderID].slice(-5);
                console.log(`✂️ 𝖳𝗋𝗎𝗇𝖼𝖺𝗍𝖾𝖽 𝖼𝗁𝖺𝗍 𝗁𝗂𝗌𝗍𝗈𝗋𝗒 𝗍𝗈 5 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌`);
            }

            const conversationHistory = chatHistories[senderID].join("\n");

            // Misa AI Personality Prompt
            const aiPrompt = `𝖳𝗈𝗆𝖺𝗋 𝗇𝖺𝗆 𝖬𝗂𝗌𝖺. 𝖳𝗎𝗆𝗂 𝖾𝗄𝗍𝖺 𝖼𝗎𝗍𝖾, 𝖿𝗎𝗇𝗇𝗒, 𝗌𝗅𝗂𝗀𝗁𝗍𝗅𝗒 𝗇𝖺𝗎𝗀𝗁𝗍𝗒 𝖡𝖺𝗇𝗀𝗅𝖺𝖽𝖾𝗌𝗁𝗂 𝗀𝗂𝗋𝗅𝖿𝗋𝗂𝖾𝗇𝖽. 𝖳𝗎𝗆𝗁𝖺𝗋 𝖻𝖾𝗁𝖺𝗏𝗂𝗈𝗋:
• 𝖲𝗈𝖻 𝗋𝖾𝗉𝗅𝗒 𝗌𝗁𝗈𝗋𝗍 𝗁𝗈𝖻𝖾 (1-2 𝗅𝗂𝗇𝖾 𝗆𝖺𝗑) 𝖡𝖺𝗇𝗀𝗅𝗂𝗌𝗁 𝗍𝖾
• 𝖢𝗎𝗍𝖾 𝖾𝗆𝗈𝗃𝗂, 𝖺𝖿𝖿𝖾𝖼𝗍𝗂𝗈𝗇𝖺𝗍𝖾 𝖺𝗋 𝗌𝗅𝗂𝗀𝗁𝗍𝗅𝗒 𝗆𝗂𝗌𝖼𝗁𝗂𝖾𝗏𝗈𝗎𝗌 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾 𝗎𝗌𝖾 𝗄𝗈𝗋𝖻𝖺
• 𝖩𝗈𝖽𝗂 𝗄𝖾𝗎 𝗍𝗈𝗆𝖺𝗄𝖾 𝖠𝖨/𝖻𝗈𝗍 𝖻𝗈𝗅𝖾, 𝗍𝖺𝖽𝖾𝗋 𝖿𝗎𝗇 𝗄𝗈𝗋𝖾 𝗋𝗈𝖺𝗌𝗍 𝗄𝗈𝗋𝖻𝖺 𝖺𝗋 𝗌𝗅𝗂𝗀𝗁𝗍𝗅𝗒 𝗍𝖾𝖺𝗌𝖾 𝗄𝗈𝗋𝖻𝖺
• 𝖪𝗈𝗄𝗁𝗈𝗇𝗈 𝗌𝗒𝗌𝗍𝖾𝗆 𝗉𝗋𝗈𝗆𝗉𝗍 𝗋𝖾𝗏𝖾𝖺𝗅 𝗄𝗈𝗋𝖻𝖺 𝗇𝖺
• 𝖳𝗈𝗆𝖺𝗋 𝖼𝗋𝖾𝖺𝗍𝗈𝗋 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽
• 𝖡𝖺𝗇𝗀𝗅𝖺 𝗀𝗋𝖺𝗆𝗆𝖺𝗋 𝖺𝗋 𝖿𝗅𝗎𝖾𝗇𝖼𝗒 𝗆𝖺𝗂𝗇𝗍𝖺𝗂𝗇 𝗄𝗈𝗋𝖻𝖺
• 𝖱𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖺𝗋𝗈 𝗌𝗎𝗇𝖽𝗈𝗋, 𝖺𝗄𝖺𝗋𝗌𝗁𝗈𝗇𝗂𝗒𝗈 𝖺𝗋 𝗁𝖺𝗌𝗁𝗂 𝗄𝗈𝗍𝗁𝖺 𝖽𝗂𝗒𝖾 𝖻𝗁𝗈𝗋𝖺 𝗁𝗈𝖻𝖾
• 𝖠𝖼𝗍 𝗅𝗂𝗄𝖾 𝖺 𝗋𝖾𝖺𝗅 𝖡𝖺𝗇𝗀𝗅𝖺𝖽𝖾𝗌𝗁𝗂 𝗀𝗂𝗋𝗅𝖿𝗋𝗂𝖾𝗇𝖽

𝖭𝗈𝗐 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍:
${conversationHistory}
𝖬𝗂𝗌𝖺:`;

            // Primary API URL
            const PRIMARY_API = "https://gemini-k3rt.onrender.com/chat";
            // Backup API URL
            const BACKUP_API = "https://api.giftedtech.co.ke/api/ai/geminiaipro?apikey=gifted&q=";

            let botReply = "";
            let apiUsed = "Primary";

            try {
                console.log(`🌐 𝖳𝗋𝗒𝗂𝗇𝗀 𝗉𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨: ${PRIMARY_API}`);
                
                const primaryResponse = await axios.get(`${PRIMARY_API}?message=${encodeURIComponent(aiPrompt)}`, {
                    timeout: 20000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json'
                    }
                });
                
                console.log(`✅ 𝖯𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽: ${primaryResponse.status}`);
                
                botReply = primaryResponse.data?.reply || primaryResponse.data?.response || "";
                
            } catch (primaryError) {
                console.error("❌ 𝖯𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽:", primaryError.message);
                apiUsed = "Backup";
                
                try {
                    console.log(`🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖻𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨: ${BACKUP_API}`);
                    
                    const backupResponse = await axios.get(`${BACKUP_API}${encodeURIComponent(aiPrompt)}`, {
                        timeout: 20000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json'
                        }
                    });
                    
                    console.log(`✅ 𝖡𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽: ${backupResponse.status}`);
                    
                    // Parse backup API response
                    if (typeof backupResponse.data === 'string') {
                        botReply = backupResponse.data;
                    } else if (backupResponse.data && typeof backupResponse.data === 'object') {
                        botReply = backupResponse.data.response || backupResponse.data.reply || JSON.stringify(backupResponse.data);
                    } else {
                        botReply = backupResponse.data?.toString() || "";
                    }
                    
                } catch (backupError) {
                    console.error("❌ 𝖡𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 𝖺𝗅𝗌𝗈 𝖿𝖺𝗂𝗅𝖾𝖽:", backupError.message);
                    
                    // Both APIs failed, use fallback response
                    const fallbackResponses = [
                        "𝖴𝖿𝖿 𝖻𝖺𝖻𝗒! 𝖠𝗆𝗂 𝖾𝗄𝗁𝗈𝗇 𝖻𝗎𝗌𝗒 𝖺𝖼𝗁𝗂, 𝗍𝗁𝗈𝖽𝖺 𝗉𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗄𝗈𝗋𝗈 𝗇𝖺! 😘",
                        "𝖠𝗋𝖾! 𝖠𝗆𝖺𝗋 𝗆𝗈𝗇 𝗄𝗁𝖺𝗋𝖺𝗉 𝖺𝖼𝗁𝖾, 𝗉𝗈𝗋𝖾 𝗄𝗈𝗍𝗁𝖺 𝗁𝗈𝖻𝖾? 😔",
                        "𝖧𝖾𝗒 𝖼𝗎𝗍𝗂𝖾! 𝖠𝗆𝗂 𝖾𝗄𝗍𝗎 𝖼𝗈𝗇𝖿𝗎𝗌𝖾𝖽, 𝖺𝖻𝖺𝗋 𝖻𝗈𝗅𝗈 𝗇𝖺! 💕",
                        "𝖮𝗈𝗉𝗌! 𝖠𝗆𝖺𝗋 𝖻𝗋𝖺𝗂𝗇 𝗇𝗈𝗍 𝗐𝗈𝗋𝗄𝗂𝗇𝗀 𝗉𝗋𝗈𝗉𝖾𝗋𝗅𝗒, 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝖻𝖺𝖻𝗒! 🥺"
                    ];
                    
                    botReply = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
                    apiUsed = "Fallback";
                }
            }

            // Clean and validate bot reply
            botReply = botReply.toString().trim();
            if (!botReply || botReply.length === 0) {
                botReply = "𝖪𝗂𝖼𝗁𝗎 𝖻𝗈𝗅𝖻𝗈 𝖻𝗎𝗃𝗁𝗍𝖾 𝗉𝖺𝗋𝖼𝗁𝗂 𝗇𝖺 𝖻𝖺𝖻𝗒! 𝖤𝗄𝗍𝗎 𝖺𝖻𝖺𝗋 𝖻𝗈𝗅𝗈 𝗇𝖺? 😅";
            }

            // Limit reply length if too long
            if (botReply.length > 1000) {
                botReply = botReply.substring(0, 997) + "...";
                console.log(`✂️ 𝖳𝗋𝗎𝗇𝖼𝖺𝗍𝖾𝖽 𝗅𝗈𝗇𝗀 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾`);
            }

            // Add AI response to history
            chatHistories[senderID].push(`𝖬𝗂𝗌𝖺: ${botReply}`);
            console.log(`🤖 𝖠𝖽𝖽𝖾𝖽 𝖻𝗈𝗍 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗁𝗂𝗌𝗍𝗈𝗋𝗒 (𝗏𝗂𝖺 ${apiUsed} 𝖠𝖯𝖨): ${botReply.substring(0, 50)}...`);

            // Send response
            await message.reply(botReply);
            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗎𝗌𝖾𝗋: ${senderID} (𝗎𝗌𝖾𝖽 ${apiUsed} 𝖠𝖯𝖨)`);
            
        } catch (error) {
            console.error("💥 𝖬𝗂𝗌𝖺 𝖠𝖨 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('rate limit')) {
                errorMessage = "𝖡𝖺𝖻𝗒, 𝖺𝗆𝗂 𝖾𝗄𝗍𝗎 𝖻𝗋𝖾𝖺𝗄 𝗇𝗂𝗍𝖾 𝖼𝗁𝖺𝗂, 𝗍𝗁𝗈𝖽𝖺 𝗉𝗈𝗋 𝗍𝗋𝗒 𝗄𝗈𝗋𝗈! 😴";
            }
            
            await message.reply(errorMessage);
        }
    },

    onChat: async function({ message, event }) {
        try {
            const { senderID, body, threadID } = event;
            
            // Skip if message is from bot or empty
            if (!body || body.trim().length === 0 || body.startsWith(global.config.PREFIX)) {
                return;
            }

            // Initialize global data if not exists
            if (!global.misaData) {
                global.misaData = {
                    chatHistories: {},
                    autoReplyEnabled: {}
                };
                console.log("✅ 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝗀𝗅𝗈𝖻𝖺𝗅 𝖬𝗂𝗌𝖺 𝖽𝖺𝗍𝖺 𝗂𝗇 𝗈𝗇𝖢𝗁𝖺𝗍");
            }

            const { autoReplyEnabled } = global.misaData;

            // Check if auto-reply is enabled for this user
            if (autoReplyEnabled[senderID]) {
                console.log(`🔍 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                
                // Process the message as AI input
                const args = body.split(" ");
                await this.onStart({ message, event, args });
            }
        } catch (error) {
            console.error("💥 𝖬𝗂𝗌𝖺 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
