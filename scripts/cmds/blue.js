const axios = require('axios');

/**
 * 𝐇𝐞𝐥𝐩𝐞𝐫 𝐅𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐭𝐨 𝐂𝐨𝐧𝐯𝐞𝐫𝐭 𝐓𝐞𝐱𝐭 𝐭𝐨 𝐁𝐨𝐥𝐝 𝐒𝐚𝐧𝐬-𝐬𝐞𝐫𝐢𝐟
 */
const toBold = (str) => {
    return str.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code + 120211); // A-Z
        if (code >= 97 && code <= 122) return String.fromCodePoint(code + 120205); // a-z
        if (code >= 48 && code <= 57) return String.fromCodePoint(code + 120764); // 0-9
        return char;
    });
};

module.exports = {
    config: {
        name: "blue",
        aliases: [],
        version: "2.1.0", // Updated
        author: "Cliff & Asif",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝐀𝐈 𝐂𝐡𝐚𝐭 𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐁𝐥𝐮𝐞"
        },
        category: "𝐚𝐢",
        guide: {
            en: "{p}blue [𝐪𝐮𝐞𝐬𝐭𝐢𝐨𝐧]"
        }
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID, senderID } = event;
        const content = args.join(" ");

        if (!content) {
            return api.sendMessage(toBold("❓ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐪𝐮𝐞𝐬𝐭𝐢𝐨𝐧."), threadID, messageID);
        }

        // Send a loading message first
        const loadingMsg = await api.sendMessage(toBold("⏳ 𝐁𝐥𝐮𝐞 𝐀𝐈 𝐢𝐬 𝐭𝐡𝐢𝐧𝐤𝐢𝐧𝐠..."), threadID);

        try {
            const apiUrl = `https://bluerepoapislasttry.onrender.com/hercai?content=${encodeURIComponent(content)}`;
            
            // Set a timeout of 60 seconds (Render can be slow)
            const response = await axios.get(apiUrl, { timeout: 60000 });
            const reply = response.data.reply;

            if (reply) {
                // Convert reply to Bold Font
                const styledReply = toBold(reply);
                
                // Send the answer
                await api.sendMessage(styledReply, threadID, messageID);
                
                // Unsend the loading message
                api.unsendMessage(loadingMsg.messageID);
            } else {
                throw new Error("No reply found in API");
            }

        } catch (error) {
            // Unsend loading message even if error
            api.unsendMessage(loadingMsg.messageID);
            
            console.error("Blue AI Error:", error.message);
            
            // Send error message nicely
            api.sendMessage(toBold("❌ 𝐒𝐞𝐫𝐯𝐞𝐫 𝐢𝐬 𝐛𝐮𝐬𝐲 𝐨𝐫 𝐨𝐟𝐟𝐥𝐢𝐧𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧."), threadID, messageID);
        }
    }
};
