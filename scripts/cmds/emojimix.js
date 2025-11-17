const axios = require("axios");

module.exports = {
    config: {
        name: "emojimix",
        aliases: [],
        version: "1.4",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖬𝗂𝗑 2 𝖾𝗆𝗈𝗃𝗂 𝗍𝗈𝗀𝖾𝗍𝗁𝖾𝗋 🎭"
        },
        longDescription: {
            en: "𝖢𝗈𝗆𝖻𝗂𝗇𝖾 𝗍𝗐𝗈 𝖾𝗆𝗈𝗃𝗂𝗌 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗎𝗇𝗂𝗊𝗎𝖾 𝖿𝗎𝗌𝗂𝗈𝗇 𝗂𝗆𝖺𝗀𝖾 🎨"
        },
        guide: {
            en: "{p}emojimix <𝖾𝗆𝗈𝗃𝗂𝟣> <𝖾𝗆𝗈𝗃𝗂𝟤>\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}emojimix 🤣 🥰"
        },
        dependencies: {
            "axios": ""
        }
    },

    langs: {
        "en": {
            "error": "❌ 𝖲𝗈𝗋𝗋𝗒, 𝖾𝗆𝗈𝗃𝗂 %1 𝖺𝗇𝖽 %2 𝖼𝖺𝗇'𝗍 𝖻𝖾 𝗆𝗂𝗑𝖾𝖽",
            "success": "✅ 𝖤𝗆𝗈𝗃𝗂 %1 𝖺𝗇𝖽 %2 𝗆𝗂𝗑𝖾𝖽 𝗂𝗇𝗍𝗈 %3 𝗂𝗆𝖺𝗀𝖾𝗌",
            "goat_error": "🐐 𝖮𝗁 𝗇𝗈! 𝖤𝗆𝗈𝗃𝗂𝗌 %1 𝖺𝗇𝖽 %2 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗅𝖾 💔 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗈𝗇𝖾𝗌!",
            "goat_success": "🎉 𝖲𝗎𝖼𝖼𝖾𝗌𝗌! 𝖤𝗆𝗈𝗃𝗂𝗌 %1 𝖺𝗇𝖽 %2 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅𝗅𝗒 𝗆𝗂𝗑𝖾𝖽 🎨 𝖸𝗈𝗎'𝗏𝖾 𝗀𝗈𝗍 %3 𝖺𝗆𝖺𝗓𝗂𝗇𝗀 𝗇𝖾𝗐 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇𝗌!"
        }
    },

    onStart: async function ({ message, event, args, getText }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            const emoji1 = args[0];
            const emoji2 = args[1];
            const attachments = [];

            if (!emoji1 || !emoji2) {
                return message.reply(
                    `⚠️ 𝖴𝗌𝖺𝗀𝖾: ${this.config.guide.en.replace(/{p}/g, global.config.PREFIX || "{p}")}`
                );
            }

            // Validate emojis
            if (!this.isValidEmoji(emoji1) || !this.isValidEmoji(emoji2)) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗏𝖺𝗅𝗂𝖽 𝖾𝗆𝗈𝗃𝗂𝗌 𝗈𝗇𝗅𝗒!");
            }

            console.log(`🎭 𝖠𝗍𝗍𝖾𝗆𝗉𝗍𝗂𝗇𝗀 𝗍𝗈 𝗆𝗂𝗑 𝖾𝗆𝗈𝗃𝗂𝗌: ${emoji1} + ${emoji2}`);

            const [img1, img2] = await Promise.all([
                this.generateEmojimix(emoji1, emoji2),
                this.generateEmojimix(emoji2, emoji1)
            ]);

            // Try to create streams for valid images
            if (img1) {
                try {
                    const stream1 = await global.utils.getStreamFromURL(img1);
                    if (stream1) attachments.push(stream1);
                } catch (streamError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖿𝗈𝗋 𝗂𝗆𝖺𝗀𝖾 1:", streamError.message);
                }
            }

            if (img2) {
                try {
                    const stream2 = await global.utils.getStreamFromURL(img2);
                    if (stream2) attachments.push(stream2);
                } catch (streamError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖿𝗈𝗋 𝗂𝗆𝖺𝗀𝖾 2:", streamError.message);
                }
            }

            if (attachments.length === 0) {
                console.log(`❌ 𝖭𝗈 𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾𝗌 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖿𝗈𝗋 ${emoji1} + ${emoji2}`);
                return message.reply(
                    getText("goat_error", emoji1, emoji2)
                );
            }

            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 ${attachments.length} 𝗂𝗆𝖺𝗀𝖾𝗌`);

            return message.reply({
                body: getText("goat_success", emoji1, emoji2, attachments.length),
                attachment: attachments
            });

        } catch (error) {
            console.error("💥 𝖤𝗆𝗈𝗃𝗂𝖬𝗂𝗑 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗆𝗂𝗑𝗂𝗇𝗀 𝖾𝗆𝗈𝗃𝗂𝗌.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            } else if (error.message.includes('getStreamFromURL')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝖾𝗆𝗈𝗃𝗂𝗌.";
            }
            
            return message.reply(errorMessage);
        }
    },

    generateEmojimix: async function(emoji1, emoji2) {
        try {
            const url = `https://emojik.vercel.app/s/${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}?size=128`;
            
            console.log(`🔗 𝖱𝖾𝗊𝗎𝖾𝗌𝗍𝗂𝗇𝗀: ${url}`);

            const response = await axios.get(url, {
                responseType: "arraybuffer",
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/png,image/*'
                },
                validateStatus: function (status) {
                    return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
                }
            });

            if (response.status === 200) {
                // Check if response actually contains image data
                const contentType = response.headers['content-type'];
                if (contentType && contentType.includes('image')) {
                    console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗂𝗆𝖺𝗀𝖾: ${emoji1} + ${emoji2}`);
                    return url;
                } else {
                    console.warn(`⚠️ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗍𝗒𝗉𝖾: ${contentType}`);
                    return null;
                }
            } else {
                console.warn(`⚠️ 𝖭𝗈𝗇-200 𝗌𝗍𝖺𝗍𝗎𝗌 𝖼𝗈𝖽𝖾: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 ${emoji1} + ${emoji2}:`, error.message);
            return null;
        }
    },

    // Helper function to validate emojis
    isValidEmoji: function(character) {
        if (!character || character.length === 0) return false;
        
        // Basic emoji validation - check if it contains emoji characters
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
        return emojiRegex.test(character);
    }
};
