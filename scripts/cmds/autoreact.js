module.exports = {
    config: {
        name: "autoreact",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud",
        countDown: 0,
        role: 0,
        category: "no-prefix",
        shortDescription: {
            en: "🤖 Bot automatic reaction system"
        },
        longDescription: {
            en: "Automatically reacts to specific keywords in chat with smart detection"
        },
        guide: {
            en: "Just type any keyword and bot will auto-react"
        }
    },

    onChat: async function({ api, event }) {
        try {
            // Prevent bot from reacting to itself
            if (!event.senderID || event.senderID === api.getCurrentUserID()) return;
            
            // Check if message body exists and is string
            if (!event.body || typeof event.body !== 'string' || event.body.trim().length === 0) return;
            
            const messageText = event.body.toLowerCase().trim();
            const { threadID, messageID } = event;

            // Early return if message is too short
            if (messageText.length < 2) return;

            // Reaction mapping with improved detection
            const reactionRules = [
                {
                    keywords: ["atma", "roh", "soul", "spirit", "আত্মা", "রুহ", "সoul"],
                    emoji: "🖤",
                    type: "soul"
                },
                {
                    keywords: ["bhalobasha", "prem", "maya", "ador", "kiss", "chumma", "shona", "jaan", "priyo", 
                              "love", "affection", "darling", "sweetheart", "beloved", "ভালোবাসা", "প্রেম", "মায়া"],
                    emoji: "❤️",
                    type: "love"
                },
                {
                    keywords: ["dukkho", "kanna", "kando", "ashru", "mon kharap", "bedona", "খেদ", "কান্না",
                              "sad", "cry", "tears", "unhappy", "depressed", "pain"],
                    emoji: "😢",
                    type: "sad"
                },
                {
                    keywords: ["bangladesh", "bd", "sonar bangla", "desh", "dhaka", "chattogram", "bangla", 
                              "bengali", "flag", "বাংলাদেশ", "সোনার বাংলা", "ঢাকা"],
                    emoji: "🇧🇩",
                    type: "bangladesh"
                },
                {
                    keywords: ["shokal", "bikal", "sha", "rat", "khabar", "ghum", "সকাল", "বিকাল", "সাঁঝ", "রাত",
                              "good morning", "good afternoon", "good night", "hello", "hi", "hey", 
                              "morning", "evening", "night", "food", "eat", "sleep"],
                    emoji: "❤",
                    type: "greeting"
                },
                {
                    keywords: ["wah", "oshadharon", "roboter", "ওয়াহ", "অসাধারণ",
                              "wow", "amazing", "awesome", "incredible", "fantastic", "great", "surprise", "unbelievable"],
                    emoji: "😮",
                    type: "surprise"
                },
                {
                    keywords: ["haha", "hehe", "lol", "funny", "joke", "comedy", "hasu", "hasi", "হাসি", "হাসু"],
                    emoji: "😂",
                    type: "laughter"
                },
                {
                    keywords: ["rag", "anger", "angry", "frustrated", "mad", "upset", "krodh", "goshol", "রাগ", "ক্রোধ"],
                    emoji: "😠",
                    type: "angry"
                },
                {
                    keywords: ["thanks", "thank you", "dhanyabad", "appreciate", "grateful", "good job", 
                              "well done", "excellent", "ধন্যবাদ", "শুক্রিয়া"],
                    emoji: "👍",
                    type: "thanks"
                },
                {
                    keywords: ["bot", "robot", "ai", "assistant", "বট", "রোবট"],
                    emoji: "🤖",
                    type: "bot"
                },
                {
                    keywords: ["music", "song", "gan", "sangeet", "গান", "সঙ্গীত"],
                    emoji: "🎵",
                    type: "music"
                },
                {
                    keywords: ["game", "khela", "gaming", "খেলা", "গেম"],
                    emoji: "🎮",
                    type: "game"
                },
                {
                    keywords: ["video", "movie", "film", "cinema", "ভিডিও", "সিনেমা"],
                    emoji: "🎬",
                    type: "video"
                },
                {
                    keywords: ["photo", "picture", "chobi", "ছবি", "ফটো"],
                    emoji: "📷",
                    type: "photo"
                },
                {
                    keywords: ["book", "boi", "reading", "কিতাব", "বই"],
                    emoji: "📚",
                    type: "book"
                }
            ];

            // Find matching reaction rule
            let matchedRule = null;
            
            for (const rule of reactionRules) {
                const hasMatch = rule.keywords.some(keyword => {
                    // Exact word match for better accuracy
                    const words = messageText.split(/\s+/);
                    return words.includes(keyword) || 
                           messageText.includes(keyword) ||
                           new RegExp(`\\b${keyword}\\b`, 'i').test(messageText);
                });
                
                if (hasMatch) {
                    matchedRule = rule;
                    break; // Stop at first match
                }
            }

            // If no match found, return
            if (!matchedRule) return;

            // Set reaction with improved error handling
            try {
                await api.setMessageReaction(matchedRule.emoji, messageID, (err) => {
                    if (err) {
                        console.error(`❌ Failed to set ${matchedRule.type} reaction:`, err.message);
                        return;
                    }
                    console.log(`✅ Reacted with ${matchedRule.emoji} to: ${messageText.substring(0, 30)}...`);
                }, true);

            } catch (reactionError) {
                console.error(`❌ Error setting ${matchedRule.type} reaction:`, reactionError.message);
                // Don't throw error to avoid crashing
            }

        } catch (error) {
            // Global error handler - prevent crash
            console.error("💥 Autoreact system error:", error.message);
            // Silent fail - don't send error messages to avoid spam
        }
    },

    onStart: async function({ message }) {
        try {
            console.log("🤖 Autoreact system is now active!");
            // Optional: Send activation message
            // await message.reply("✅ Autoreact system activated! I'll automatically react to your messages.");
        } catch (error) {
            console.error("Autoreact start error:", error.message);
        }
    },

    // Optional: Add onEvent for other event types if needed
    onEvent: async function({ api, event }) {
        try {
            // Handle other events if necessary
            if (event.type === "message" || event.type === "message_reply") {
                // Additional event handling can go here
            }
        } catch (error) {
            console.error("Autoreact event error:", error.message);
        }
    }
};
