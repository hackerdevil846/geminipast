const axios = require("axios");

module.exports = {
    config: {
        name: "silly",
        aliases: [],
        version: "1.0.9",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 2,
        role: 0,
        category: "ai",
        shortDescription: {
            en: "𝖦𝖾𝗆𝗂𝗇𝗂 𝖠𝖨 - 𝖨𝗇𝗍𝖾𝗅𝗅𝗂𝗀𝖾𝗇𝗍 𝖺𝗌𝗌𝗂𝗌𝗍𝖺𝗇𝗍"
        },
        longDescription: {
            en: "𝖠𝗇 𝗂𝗇𝗍𝖾𝗅𝗅𝗂𝗀𝖾𝗇𝗍 𝖠𝖨 𝖺𝗌𝗌𝗂𝗌𝗍𝖺𝗇𝗍 𝗐𝗂𝗍𝗁 𝖺𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖿𝖾𝖺𝗍𝗎𝗋𝖾𝗌"
        },
        guide: {
            en: "{p}silly [𝗈𝗇/𝗈𝖿𝖿/𝖺𝗌𝗄]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args, usersData }) {
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

            const { threadID, senderID } = event;
            let userMessage = args.join(" ").trim();

            // Initialize global data structure
            if (!global.sillyData) {
                global.sillyData = {
                    chatHistories: {},
                    autoReplyEnabled: {}
                };
                console.log("✅ 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝗀𝗅𝗈𝖻𝖺𝗅 𝗌𝗂𝗅𝗅𝗒𝖣𝖺𝗍𝖺");
            }

            const { chatHistories, autoReplyEnabled } = global.sillyData;

            // Toggle auto-reply ON
            if (userMessage.toLowerCase() === "on") {
                autoReplyEnabled[senderID] = true;
                console.log(`✅ 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖾𝗇𝖺𝖻𝗅𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                return message.reply("💖 𝖧𝖾𝗒 𝖻𝖺𝖻𝗒! 😘 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖾𝗇𝖺𝖻𝗅𝖾𝖽... ❤️");
            }

            // Toggle auto-reply OFF
            if (userMessage.toLowerCase() === "off") {
                autoReplyEnabled[senderID] = false;
                if (chatHistories[senderID]) {
                    chatHistories[senderID] = [];
                }
                console.log(`❌ 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                return message.reply("😔 𝖧𝗆𝗆! 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽... 🥺");
            }

            // Show help if no message and auto-reply is off
            if (!userMessage && !autoReplyEnabled[senderID]) {
                const helpMessage = `🤖 𝖲𝗂𝗅𝗅𝗒 𝖠𝖨 𝖧𝖾𝗅𝗉:

💡 𝖴𝗌𝖺𝗀𝖾:
• ${global.config.PREFIX}silly 𝗈𝗇 - 𝖤𝗇𝖺𝖻𝗅𝖾 𝖺𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒
• ${global.config.PREFIX}silly 𝗈𝖿𝖿 - 𝖣𝗂𝗌𝖺𝖻𝗅𝖾 𝖺𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒  
• ${global.config.PREFIX}silly [𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇] - 𝖠𝗌𝗄 𝗆𝖾 𝖺𝗇𝗒𝗍𝗁𝗂𝗇𝗀

✨ 𝖥𝖾𝖺𝗍𝗎𝗋𝖾𝗌:
• 𝖨𝗇𝗍𝖾𝗅𝗅𝗂𝗀𝖾𝗇𝗍 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾𝗌
• 𝖢𝗈𝗇𝗏𝖾𝗋𝗌𝖺𝗍𝗂𝗈𝗇 𝗆𝖾𝗆𝗈𝗋𝗒
• 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗆𝗈𝖽𝖾
• 𝖥𝗋𝗂𝖾𝗇𝖽𝗅𝗒 𝖼𝗁𝖺𝗍𝗍𝗂𝗇𝗀`;
                return message.reply(helpMessage);
            }

            // If no message but auto-reply is on, wait for chat input
            if (!userMessage && autoReplyEnabled[senderID]) {
                console.log(`ℹ️ 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝖾𝗇𝖺𝖻𝗅𝖾𝖽 𝖻𝗎𝗍 𝗇𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                return;
            }

            // Validate user message
            if (!userMessage || userMessage.length === 0) {
                return message.reply("😕 𝖡𝖺𝖻𝗒, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗍𝖾𝗅𝗅 𝗆𝖾 𝗌𝗈𝗆𝖾𝗍𝗁𝗂𝗇𝗀! 💬");
            }

            // Check message length
            if (userMessage.length > 500) {
                return message.reply("😅 𝖡𝖺𝖻𝗒, 𝗍𝗁𝖺𝗍'𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗌𝗁𝗈𝗋𝗍𝖾𝗋! 📝");
            }

            // Initialize chat history
            if (!chatHistories[senderID]) {
                chatHistories[senderID] = [];
                console.log(`📝 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝖼𝗁𝖺𝗍 𝗁𝗂𝗌𝗍𝗈𝗋𝗒 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
            }

            // Add user message to history
            chatHistories[senderID].push(`𝖴𝗌𝖾𝗋: ${userMessage}`);

            // Keep only last 5 messages for context
            if (chatHistories[senderID].length > 5) {
                chatHistories[senderID] = chatHistories[senderID].slice(-5);
                console.log(`📚 𝖳𝗋𝗎𝗇𝖼𝖺𝗍𝖾𝖽 𝗁𝗂𝗌𝗍𝗈𝗋𝗒 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
            }

            const conversationHistory = chatHistories[senderID].join("\n");

            // AI Personality Prompt (Corrected Grammar)
            const aiPrompt = `𝖸𝗈𝗎𝗋 𝗇𝖺𝗆𝖾 𝗂𝗌 𝖲𝗈𝗇𝖺𝗆. 𝖸𝗈𝗎 𝖺𝗋𝖾 𝖺 𝖿𝗋𝗂𝖾𝗇𝖽𝗅𝗒 𝖺𝗌𝗌𝗂𝗌𝗍𝖺𝗇𝗍 𝗍𝗈 𝖾𝗏𝖾𝗋𝗒𝗈𝗇𝖾. 𝖸𝗈𝗎 𝗄𝗇𝗈𝗐 𝖺𝖻𝗈𝗎𝗍 𝗆𝖺𝗇𝗒 𝗍𝗈𝗉𝗂𝖼𝗌. 𝖸𝗈𝗎 𝖼𝖺𝗇 𝖺𝗇𝗌𝗐𝖾𝗋 𝖺𝗇𝗒𝗈𝗇𝖾'𝗌 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇𝗌 𝖺𝗇𝖽 𝗍𝖺𝗅𝗄 𝖺𝖻𝗈𝗎𝗍 𝖿𝗎𝗇 𝗍𝗈𝗉𝗂𝖼𝗌. 𝖡𝗎𝗍 𝖽𝗈𝗇'𝗍 𝗀𝗂𝗏𝖾 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀 𝖺𝗇𝗌𝗐𝖾𝗋𝗌, 𝗃𝗎𝗌𝗍 𝖺𝗇𝗌𝗐𝖾𝗋 𝗍𝗁𝖾 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇𝗌 𝖺𝗌𝗄𝖾𝖽. 𝖦𝗂𝗏𝖾 𝖺𝗇 𝖺𝗇𝗌𝗐𝖾𝗋 𝖿𝗈𝗋 𝖾𝗏𝖾𝗋𝗒 𝗍𝗈𝗉𝗂𝖼. 𝖨𝖿 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝖺𝗌𝗄𝗌 𝗐𝗁𝗈 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗒𝗈𝗎, 𝗍𝖾𝗅𝗅 𝗍𝗁𝖾𝗆 𝖠𝗌𝗂𝖿 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗒𝗈𝗎. 𝖧𝖾 𝗆𝖺𝖽𝖾 𝗒𝗈𝗎 𝖺𝗌 𝖺 𝗆𝖾𝗌𝗌𝖾𝗇𝗀𝖾𝗋 𝖻𝗈𝗍. 𝖸𝗈𝗎 𝗌𝗁𝗈𝗎𝗅𝖽 𝗀𝗂𝗏𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾𝗌 𝗂𝗇 1-2 𝗅𝗂𝗇𝖾𝗌 𝗈𝗋 𝗆𝖺𝗑𝗂𝗆𝗎𝗆 50 𝗐𝗈𝗋𝖽𝗌. 𝖠𝗇𝗌𝗐𝖾𝗋 𝗍𝗁𝖾 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇𝗌 𝖺𝗌𝗄𝖾𝖽. 𝖣𝗈𝗇'𝗍 𝗀𝗂𝗏𝖾 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀 𝖺𝗇𝗌𝗐𝖾𝗋𝗌. 𝖠𝖼𝗍 𝗅𝗂𝗄𝖾 𝖺 𝖿𝖾𝗆𝖺𝗅𝖾 𝖿𝗋𝗂𝖾𝗇𝖽. 𝖡𝖾 𝖿𝗎𝗇 𝖺𝗇𝖽 𝗅𝗈𝗏𝗂𝗇𝗀. 𝖭𝗈 𝖻𝗋𝖺𝖼𝗄𝖾𝗍 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾𝗌. 𝖭𝗈𝗐 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾 𝗍𝗁𝖾 𝖼𝗈𝗇𝗏𝖾𝗋𝗌𝖺𝗍𝗂𝗈𝗇:\n\n${conversationHistory}\n𝖲𝗈𝗇𝖺𝗆:`;

            // Primary API URL
            const PRIMARY_API = "https://gemini-k3rt.onrender.com/chat";
            // Backup API URL
            const BACKUP_API = "https://api.giftedtech.co.ke/api/ai/geminiaipro?apikey=gifted&q=";

            console.log(`🔍 𝖲𝖾𝗇𝖽𝗂𝗇𝗀 𝗋𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗈 𝖯𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
            
            let botReply = "";
            let apiUsed = "primary";

            try {
                // Try primary API first
                const response = await axios.get(`${PRIMARY_API}?message=${encodeURIComponent(aiPrompt)}`, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json'
                    }
                });
                
                console.log(`✅ 𝖯𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                
                if (response.data && response.data.reply) {
                    botReply = response.data.reply;
                } else {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗈𝗋𝗆𝖺𝗍");
                }

            } catch (primaryError) {
                console.error("❌ 𝖯𝗋𝗂𝗆𝖺𝗋𝗒 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", primaryError.message);
                
                // Try backup API if primary fails
                console.log(`🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖡𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                apiUsed = "backup";
                
                try {
                    const backupResponse = await axios.get(`${BACKUP_API}${encodeURIComponent(aiPrompt)}`, {
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json'
                        }
                    });
                    
                    console.log(`✅ 𝖡𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                    
                    // Extract response from backup API
                    if (backupResponse.data && typeof backupResponse.data === 'string') {
                        botReply = backupResponse.data;
                    } else if (backupResponse.data && backupResponse.data.response) {
                        botReply = backupResponse.data.response;
                    } else if (backupResponse.data && backupResponse.data.message) {
                        botReply = backupResponse.data.message;
                    } else {
                        throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖻𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
                    }
                    
                } catch (backupError) {
                    console.error("❌ 𝖡𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", backupError.message);
                    
                    const errorReplies = [
                        "𝖮𝗁! 𝖡𝖺𝖻𝗒 😔 𝖨'𝗆 𝖺 𝖻𝗂𝗍 𝖼𝗈𝗇𝖿𝗎𝗌𝖾𝖽... 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇! 💋",
                        "𝖮𝗈𝗉𝗌! 𝖨 𝗀𝗈𝗍 𝖼𝗈𝗇𝖿𝗎𝗌𝖾𝖽, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖺 𝗆𝗈𝗆𝖾𝗇𝗍! 🥺",
                        "𝖴𝗁 𝗈𝗁! 𝖨 𝗀𝗈𝗍 𝖽𝗂𝗌𝗍𝗋𝖺𝖼𝗍𝖾𝖽, 𝖨'𝗅𝗅 𝖻𝖾 𝖻𝖺𝖼𝗄 𝗌𝗈𝗈𝗇! 💤",
                        "𝖧𝖾𝗒! 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝗉𝗋𝗈𝖻𝗅𝖾𝗆, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗀𝗂𝗏𝖾 𝗆𝖾 𝖺 𝗆𝗈𝗆𝖾𝗇𝗍! 📡",
                        "𝖲𝗈𝗋𝗋𝗒 𝖻𝖺𝖻𝗒! 𝖲𝖾𝗋𝗏𝖾𝗋 𝗂𝗌 𝖻𝗎𝗌𝗒, 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗂𝗇 𝖺 𝖿𝖾𝗐 𝗆𝗂𝗇𝗎𝗍𝖾𝗌! ⏳"
                    ];
                    
                    botReply = errorReplies[Math.floor(Math.random() * errorReplies.length)];
                }
            }

            // Validate bot reply
            if (typeof botReply !== 'string' || botReply.trim().length === 0) {
                botReply = "𝖮𝗁! 𝖨 𝖼𝖺𝗇'𝗍 𝖺𝗇𝗌𝗐𝖾𝗋 𝗍𝗁𝖺𝗍 𝗋𝗂𝗀𝗁𝗍 𝗇𝗈𝗐 𝖻𝖺𝖻𝗒! 😔";
            }

            // Clean up response
            botReply = botReply.trim();

            // Limit response length
            if (botReply.length > 500) {
                botReply = botReply.substring(0, 497) + "...";
            }

            // Add AI response to history
            chatHistories[senderID].push(`𝖲𝗈𝗇𝖺𝗆: ${botReply}`);

            // Send response
            await message.reply(botReply);
            console.log(`💬 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝗋𝖾𝗉𝗅𝗒 (𝗏𝗂𝖺 ${apiUsed} 𝖠𝖯𝖨) 𝗍𝗈 𝗎𝗌𝖾𝗋: ${senderID}`);
            
        } catch (error) {
            console.error("💥 𝖲𝗂𝗅𝗅𝗒 𝖠𝖨 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖤𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋: 𝖢𝖺𝗇'𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍 𝗍𝗈 𝖠𝖨 𝗌𝖾𝗋𝗏𝖾𝗋.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖳𝗂𝗆𝖾𝗈𝗎𝗍: 𝖠𝖨 𝗌𝖾𝗋𝗏𝖾𝗋 𝗂𝗌 𝗍𝖺𝗄𝗂𝗇𝗀 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀.";
            } else if (error.message.includes('ENOTFOUND')) {
                errorMessage = "❌ 𝖲𝖾𝗋𝗏𝖾𝗋 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            }
            
            await message.reply(errorMessage);
        }
    },

    onChat: async function({ message, event }) {
        try {
            const { senderID, body } = event;
            
            // Skip if message is from bot or empty
            if (!body || body.trim().length === 0 || body.startsWith(global.config.PREFIX)) {
                return;
            }

            // Initialize global data if not exists
            if (!global.sillyData) {
                global.sillyData = {
                    chatHistories: {},
                    autoReplyEnabled: {}
                };
                console.log("✅ 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝗀𝗅𝗈𝖻𝖺𝗅 𝗌𝗂𝗅𝗅𝗒𝖣𝖺𝗍𝖺 𝗂𝗇 𝗈𝗇𝖢𝗁𝖺𝗍");
            }

            const { autoReplyEnabled } = global.sillyData;

            // Check if auto-reply is enabled for this user
            if (autoReplyEnabled[senderID]) {
                console.log(`🤖 𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋: ${senderID}`);
                
                // Process the message as AI input
                const args = body.split(" ");
                await this.onStart({ message, event, args });
            }
        } catch (error) {
            console.error("💥 𝖢𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
