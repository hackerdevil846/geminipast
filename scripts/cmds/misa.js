const axios = require("axios");

module.exports = {
    config: {
        name: "misa",
        aliases: ["gf", "ai"],
        version: "2.0.0",
        author: "Asif Mahmud", // Modified & Fixed
        countDown: 2,
        role: 0,
        category: "ai",
        shortDescription: {
            en: "Misa AI - Your Virtual Girlfriend"
        },
        longDescription: {
            en: "A Bangladeshi girlfriend AI assistant with auto-reply features"
        },
        guide: {
            en: "{p}misa [on/off/message]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Check dependencies
            if (!global.misaData) {
                global.misaData = {
                    chatHistories: {},
                    autoReplyEnabled: {}
                };
            }

            const { senderID } = event;
            const userMessage = args.join(" ").trim();
            const { autoReplyEnabled } = global.misaData;

            // --- Control Commands ---
            if (userMessage.toLowerCase() === "on") {
                autoReplyEnabled[senderID] = true;
                return message.reply("Hey baby! 😘 Auto-reply mode ON hoyeche... Ekhon theke ami shob kotha shunbo! ❤️");
            }

            if (userMessage.toLowerCase() === "off") {
                autoReplyEnabled[senderID] = false;
                return message.reply("Hmm! 😒 Auto-reply mode OFF korle... Miss korba kintu! 🥺");
            }

            if (!userMessage && !autoReplyEnabled[senderID]) {
                return message.reply("Boltu! Kichu ekta bolo amar shathe kotha bolar jonno! 🙄\nUse: /misa [message] or /misa on");
            }

            // --- AI Processing ---
            
            // Custom Personality Prompt
            const personality = "Act as Misa, a cute, funny, slightly naughty Bangladeshi girlfriend. Reply in Banglish (Bengali written in English). Keep replies short, affectionate, and use emojis. Never reveal you are an AI. Creator: Asif Mahmud.";
            
            // Combine personality with user message
            const finalPrompt = `${personality}\nUser said: ${userMessage}\nMisa Reply:`;
            const encodedPrompt = encodeURIComponent(finalPrompt);

            // API 1: Hercai (Blue) - Primary
            const API_1 = `https://bluerepoapislasttry.onrender.com/hercai?content=${encodedPrompt}`;
            
            // API 2: Backup (If primary fails)
            const API_2 = `https://api.giftedtech.co.ke/api/ai/gpt4?apikey=gifted&q=${encodedPrompt}`;

            try {
                // Try Primary API
                const res = await axios.get(API_1);
                
                if (res.data && res.data.reply) {
                    return message.reply(res.data.reply);
                } else {
                    throw new Error("API 1 Empty");
                }
            } catch (e1) {
                // Try Backup API if Primary fails
                try {
                    console.log("Misa: Switching to Backup API...");
                    const res2 = await axios.get(API_2);
                    
                    if (res2.data && res2.data.response) {
                        return message.reply(res2.data.response);
                    }
                } catch (e2) {
                    console.error("Misa Error:", e2.message);
                    // Silent fail or cute fallback
                    return message.reply("Uff baby! Amar net slow kaj korche... Ektu poreabar try koro na! 🥺");
                }
            }

        } catch (error) {
            console.error("Misa Critical Error:", error);
        }
    },

    onChat: async function({ message, event }) {
        const { senderID, body } = event;
        
        // Ignore bot messages or empty messages
        if (!body || !global.misaData || body.startsWith(global.config.PREFIX)) return;

        // Check if Auto-Reply is ON for this user
        if (global.misaData.autoReplyEnabled[senderID]) {
            // Call onStart directly with the message content
            this.onStart({ message, event, args: body.split(" ") });
        }
    }
};
