const axios = require('axios');

module.exports = {
    config: {
        name: "gsearch",
        aliases: [],
        version: "2.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Perform Google text searches or reverse image searches"
        },
        longDescription: {
            en: "Perform Google text searches or reverse image searches"
        },
        guide: {
            en: "{p}gsearch [query] or reply to image"
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            if ((!args || args.length === 0) && !event.messageReply) {
                const guideText = 
`🔍 GOOGLE SEARCH COMMAND

📖 USAGE GUIDE:

• Text Search:
  ${this.config.name} <your query>
  Example: ${this.config.name} how to bake a cake

• Image Search (Reverse):
  Reply to an image with: ${this.config.name}
  Example: [reply to image] ${this.config.name}

• Version: ${this.config.version}
• Author: ${this.config.author}`;

                return message.reply(guideText);
            }

            if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
                const attachment = event.messageReply.attachments[0];
                const imageTypes = ["photo", "animated_image", "image", "sticker"];

                if (attachment && attachment.type && imageTypes.includes(attachment.type)) {
                    const imageUrl = encodeURIComponent(attachment.url);
                    const searchURL = `https://www.google.com/searchbyimage?&image_url=${imageUrl}`;

                    const resultText = 
`🖼️ REVERSE IMAGE SEARCH

🔍 Search Results:
🔗 ${searchURL}

📌 Click the link above to view reverse image search results`;

                    return message.reply(resultText);
                }
            }

            const searchQuery = args.join(" ").trim();
            if (!searchQuery) {
                return message.reply(
`⚠️ INVALID REQUEST

Please provide search text or reply to an image

ℹ️ Type "${this.config.name}" without arguments for usage guide`
                );
            }

            const searchURL = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

            const resultMsg = 
`🔍 TEXT SEARCH RESULTS

📋 Query: "${searchQuery}"

🔗 Search URL: ${searchURL}

📌 Click the link above to view search results`;

            return message.reply(resultMsg);

        } catch (error) {
            console.error("Search Command Error:", error);
            
            const errorMsg = 
`❌ SEARCH FAILED!

🔧 Error: ${error && error.message ? error.message : "Unknown error"}

ℹ️ Please try again later or check your input`;

            return message.reply(errorMsg);
        }
    }
};
