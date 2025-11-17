module.exports = {
    config: {
        name: "mentionbot",
        version: "1.0.2",
        role: 0,
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        countDown: 1,
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        shortDescription: {
            en: "⚡️ 𝐁𝐨𝐭 𝐚𝐝𝐦𝐢𝐧 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐝𝐞𝐭𝐞𝐜𝐭𝐢𝐨𝐧 & 𝐚𝐮𝐭𝐨-𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐬𝐲𝐬𝐭𝐞𝐦"
        },
        longDescription: {
            en: "𝐃𝐞𝐭𝐞𝐜𝐭𝐬 𝐰𝐡𝐞𝐧 𝐛𝐨𝐭 𝐚𝐝𝐦𝐢𝐧 𝐢𝐬 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐚𝐧𝐝 𝐬𝐞𝐧𝐝𝐬 𝐫𝐚𝐧𝐝𝐨𝐦 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞𝐬"
        },
        guide: {
            en: ""
        },
        dependencies: {}
    },

    // Rate limiting storage
    lastResponseTime: {},

    onLoad: function() {
        console.log("✅ MentionBot loaded successfully");
    },

    onChat: async function({ event, message, api }) {
        try {
            // ⚡️ CONFIGURATION - Update these IDs as needed
            const botAdmin = "61571630409265";
            const allowedIDs = ["61571630409265"]; // Add more admin IDs here
            
            // 🛡️ VALIDATION LAYER 1: Basic event validation
            if (!event || typeof event !== 'object' || Array.isArray(event)) {
                return;
            }
            
            // 🛡️ VALIDATION LAYER 2: Essential properties check
            if (!event.senderID || !event.threadID || typeof event.body !== 'string') {
                return;
            }
            
            // 🛡️ VALIDATION LAYER 3: Message content check
            const messageBody = event.body.trim();
            if (!messageBody || messageBody.length === 0) {
                return;
            }
            
            // 🛡️ VALIDATION LAYER 4: Skip if sender is bot admin
            if (event.senderID === botAdmin) {
                return;
            }
            
            // 🛡️ RATE LIMITING: Prevent spam (30 seconds cooldown per thread)
            const currentTime = Date.now();
            if (this.lastResponseTime[event.threadID]) {
                const timeDiff = currentTime - this.lastResponseTime[event.threadID];
                if (timeDiff < 30000) { // 30 second cooldown
                    return;
                }
            }
            
            // 🔍 MENTION DETECTION SYSTEM
            let mentionedIDs = [];
            
            // Method 1: Check direct mentions
            if (event.mentions && typeof event.mentions === 'object' && !Array.isArray(event.mentions)) {
                const mentionKeys = Object.keys(event.mentions);
                for (const id of mentionKeys) {
                    if (id && id !== '' && !isNaN(parseInt(id)) && allowedIDs.includes(id)) {
                        mentionedIDs.push(id);
                    }
                }
            }
            
            // Method 2: Check reply mentions
            if (event.messageReply && event.messageReply.mentions && 
                typeof event.messageReply.mentions === 'object' && 
                !Array.isArray(event.messageReply.mentions)) {
                
                const replyMentionKeys = Object.keys(event.messageReply.mentions);
                for (const id of replyMentionKeys) {
                    if (id && id !== '' && !isNaN(parseInt(id)) && allowedIDs.includes(id)) {
                        mentionedIDs.push(id);
                    }
                }
            }
            
            // Method 3: Check message body for @mentions
            const mentionRegex = /@(\d+)/g;
            let match;
            while ((match = mentionRegex.exec(messageBody)) !== null) {
                const mentionedId = match[1];
                if (mentionedId && allowedIDs.includes(mentionedId)) {
                    mentionedIDs.push(mentionedId);
                }
            }
            
            // Remove duplicates
            mentionedIDs = [...new Set(mentionedIDs)];
            
            // 🎯 CHECK IF ANY ALLOWED ID IS MENTIONED
            if (mentionedIDs.length > 0) {
                const responses = [
                    "🙄 𝐀𝐦𝐚𝐤𝐞 𝐝𝐢𝐬𝐭𝐮𝐫𝐛 𝐤𝐨𝐫𝐨𝐧𝐚",
                    "🙈 𝐀𝐦𝐚𝐤𝐞 𝐝𝐚𝐤𝐢𝐬𝐡 𝐧𝐚, 𝐚𝐦𝐢 𝐣𝐚𝐚𝐧𝐮 𝐞𝐫 𝐬𝐚𝐭𝐡𝐞 𝐛𝐮𝐬𝐲",
                    "🫡 𝐁𝐨𝐥𝐥𝐚𝐦 𝐧𝐚 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐤𝐨𝐫𝐢𝐬𝐡 𝐧𝐚, 𝐝𝐮𝐫 𝐚 𝐭𝐡𝐚𝐤𝐨",
                    "😒 𝐊𝐢 𝐡𝐨𝐲𝐞𝐜𝐡𝐞, 𝐤𝐞𝐧𝐨 𝐝𝐚𝐤𝐜𝐡𝐢𝐬𝐡?",
                    "💢 𝐇𝐚𝐲𝐫𝐞, 𝐚𝐦𝐚𝐫 𝐬𝐡𝐚𝐫𝐚𝐦 𝐥𝐚𝐠𝐜𝐡𝐞 𝐞𝐯𝐚𝐛𝐞 𝐝𝐚𝐤𝐢𝐬𝐡 𝐧𝐚",
                    "🤫 𝐂𝐡𝐮𝐩 𝐤𝐨𝐫",
                    "💌 𝐁𝐨𝐥𝐨 𝐧𝐚 𝐣𝐚𝐚𝐧𝐮",
                    "🐣 𝐇𝐚𝐚 𝐣𝐚𝐚𝐧, 𝐝𝐚𝐤𝐜𝐡𝐢𝐬𝐡 𝐤𝐞𝐧𝐨?",
                    "👑 𝐁𝐨𝐥𝐞𝐧 𝐦𝐞𝐫𝐞 𝐬𝐚𝐫𝐤𝐚𝐫",
                    "🚫 𝐃𝐨𝐧'𝐭 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐦𝐲 𝐚𝐝𝐦𝐢𝐧!",
                    "⚠️ 𝐀𝐝𝐦𝐢𝐧 𝐛𝐮𝐬𝐲 𝐚𝐜𝐡𝐞, 𝐩𝐨𝐫𝐞 𝐝𝐚𝐤𝐛𝐞𝐧",
                    "🔇 𝐒𝐡𝐚𝐧𝐭𝐨 𝐭𝐡𝐚𝐤𝐨, 𝐚𝐝𝐦𝐢𝐧 𝐤𝐞 𝐝𝐚𝐤𝐢𝐬𝐡 𝐧𝐚",
                    "📵 𝐀𝐝𝐦𝐢𝐧 𝐞𝐫 𝐬𝐚𝐭𝐡𝐞 𝐤𝐚𝐭𝐡𝐚 𝐡𝐨𝐛𝐞 𝐧𝐚 𝐚𝐣𝐤𝐞",
                    "💤 𝐆𝐡𝐮𝐦𝐚𝐜𝐡𝐞 𝐚𝐝𝐦𝐢𝐧, 𝐩𝐨𝐫𝐞 𝐝𝐚𝐤𝐛𝐞𝐧"
                ];
                
                // Safe random selection
                const randomIndex = Math.floor(Math.random() * responses.length);
                const selectedResponse = responses[randomIndex] || "❌ Don't mention my admin!";
                
                // Update rate limit
                this.lastResponseTime[event.threadID] = currentTime;
                
                // Natural delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // 🛡️ SAFE MESSAGE SENDING
                try {
                    await message.reply({
                        body: `⛔️ ${selectedResponse}`,
                        mentions: [{
                            tag: '@Mention Protection',
                            id: event.senderID
                        }]
                    });
                    
                    console.log(`✅ MentionBot: Responded to admin mention from ${event.senderID} in thread ${event.threadID}`);
                } catch (sendError) {
                    console.error("❌ MentionBot: Failed to send response:", sendError);
                }
            }
            
        } catch (error) {
            console.error("⚠️ 𝐌𝐞𝐧𝐭𝐢𝐨𝐧𝐁𝐨𝐭 𝐂𝐫𝐢𝐭𝐢𝐜𝐚𝐥 𝐄𝐫𝐫𝐨𝐫:", error);
            // Don't throw error to prevent bot crash
        }
    },

    onStart: async function({ message, event }) {
        try {
            if (!message || !event) return;
            
            await message.reply("🤖 MentionBot is active! I'll protect my admin from unnecessary mentions.\n\n⚡️ Features:\n• Admin mention detection\n• Anti-spam protection\n• Multiple mention methods\n• Random responses");
        } catch (error) {
            console.error("⚠️ MentionBot start error:", error);
        }
    },

    onAnyEvent: function({ event }) {
        // Additional safety net for any event
        if (!event || typeof event !== 'object') {
            return;
        }
    }
};
