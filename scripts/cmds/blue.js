const axios = require('axios');

module.exports = {
    config: {
        name: "blue",
        author: "Cliff Fixed by Asif",
        version: "2.1",
        cooldowns: 5,
        role: 0,
        shortDescription: {
            en: "AI cmd powered by blue"
        },
        category: "ai",
        guide: {
            en: "blue [your content]"
        }
    },

    onStart: async function ({ api, event, args }) {
        const content = args.join(" ");

        if (!content) {
            return api.sendMessage("Please provide your question with blue 🔵", event.threadID, event.messageID);
        }

        api.sendMessage("Blue AI is typing...", event.threadID, event.messageID);

        // Encode the content correctly to avoid URL errors
        const apiUrl = `https://bluerepoapislasttry.onrender.com/hercai?content=${encodeURIComponent(content)}`;

        try {
            const response = await axios.get(apiUrl);
            
            // Check if valid reply exists
            if (response.data && response.data.reply) {
                const reply = response.data.reply;
                return api.sendMessage(reply, event.threadID, event.messageID);
            } else {
                console.log("Blue AI: Empty response received.");
            }
            
        } catch (error) {
            // Error handling is now SILENT in chat (Console only)
            // This prevents the "An error occurred" message from showing up if the API is just slow
            console.error("Blue AI Error:", error.message);
        }
    }
};
