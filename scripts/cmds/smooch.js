module.exports = {
    config: {
        name: "smooch",
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "love",
        shortDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑎 𝑘𝑖𝑠𝑠 𝑤𝑖𝑡ℎ 𝑎𝑢𝑡𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑘𝑖𝑠𝑠 𝑤𝑖𝑡ℎ 𝑒𝑚𝑜𝑗𝑖 𝑠𝑦𝑠𝑡𝑒𝑚 𝑎𝑛𝑑 𝑎𝑢𝑡𝑜 𝑑𝑒𝑡𝑒𝑐𝑡𝑖𝑜𝑛"
        },
        guide: {
            en: "{𝑝}𝑠𝑚𝑜𝑜𝑐ℎ @𝑡𝑎𝑔"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ event, message, usersData, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            const fs = require("fs-extra");
            const axios = require("axios");
            const path = require("path");
            
            const { mentions, senderID } = event;
            const mention = Object.keys(mentions);
            
            // 🎯 Auto-detect if no one is tagged
            if (!mention[0]) {
                // Check if user is replying to someone
                if (event.messageReply) {
                    const repliedUserID = event.messageReply.senderID;
                    const repliedUserInfo = await usersData.get(repliedUserID);
                    const repliedUserName = repliedUserInfo.name || "𝑡ℎ𝑒𝑚";
                    
                    return await this.sendKiss(message, repliedUserID, repliedUserName, senderID);
                }
                
                // Check message content for names/mentions
                const messageText = event.body?.toLowerCase() || "";
                const loveKeywords = ["love", "kiss", "smooch", "muah", "romantic", "crush"];
                
                if (loveKeywords.some(keyword => messageText.includes(keyword))) {
                    return message.reply("💋 𝑊𝑎𝑛𝑡 𝑎 𝑘𝑖𝑠𝑠? 𝑇𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑠𝑝𝑒𝑐𝑖𝑎𝑙! 𝑈𝑠𝑒: {𝑝}𝑠𝑚𝑜𝑜𝑐ℎ @𝑡𝑎𝑔");
                }
                
                return message.reply("💋 𝑇𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑚𝑜𝑜𝑐ℎ! 𝑈𝑠𝑒: {𝑝}𝑠𝑚𝑜𝑜𝑐ℎ @𝑡𝑎𝑔");
            }

            const userId = mention[0];
            const tag = mentions[userId].replace("@", "");
            
            await this.sendKiss(message, userId, tag, senderID);
            
        } catch (error) {
            console.error("𝑆𝑚𝑜𝑜𝑐ℎ 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑚𝑜𝑜𝑐ℎ! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
    },

    // 🎯 Auto-response system
    onChat: async function ({ event, message, usersData }) {
        try {
            const messageText = event.body?.toLowerCase() || "";
            const senderID = event.senderID;
            
            // 🎭 Kiss-related triggers
            const kissTriggers = [
                { keywords: ["kiss me", "smooch me", "kiss you"], response: "💋 𝑀𝑊𝐴𝐻! 𝑆𝑒𝑛𝑑𝑖𝑛𝑔 𝑦𝑜𝑢 𝑎 𝑘𝑖𝑠𝑠!" },
                { keywords: ["love you", "luv u", "i love you"], response: "❤️ 𝑆𝑒𝑛𝑑𝑖𝑛𝑔 𝑙𝑜𝑣𝑒 𝑎𝑛𝑑 𝑘𝑖𝑠𝑠𝑒𝑠 𝑏𝑎𝑐𝑘! 𝑈𝑠𝑒 {𝑝}𝑠𝑚𝑜𝑜𝑐ℎ @𝑚𝑒" },
                { keywords: ["muah", "mwah", "xoxo"], response: "💋 𝑀𝑊𝐴𝐻 𝑏𝑎𝑐𝑘! 𝑊𝑎𝑛𝑡 𝑚𝑜𝑟𝑒 𝑘𝑖𝑠𝑠𝑒𝑠? 𝑈𝑠𝑒 {𝑝}𝑠𝑚𝑜𝑜𝑐ℎ" },
                { keywords: ["romantic", "crush on you"], response: "😊 𝑇ℎ𝑎𝑡'𝑠 𝑠𝑜 𝑠𝑤𝑒𝑒𝑡! 𝑈𝑠𝑒 {𝑝}𝑠𝑚𝑜𝑜𝑐ℎ 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑎 𝑘𝑖𝑠𝑠!" }
            ];

            // Check for triggers
            for (const trigger of kissTriggers) {
                if (trigger.keywords.some(keyword => messageText.includes(keyword))) {
                    // 30% chance to auto-respond with kiss
                    if (Math.random() < 0.3) {
                        await this.sendKiss(message, senderID, "𝑦𝑜𝑢", senderID);
                        return;
                    } else {
                        await message.reply(trigger.response);
                        return;
                    }
                }
            }

            // 🎭 Special cases
            if (messageText.includes("good night") || messageText.includes("goodnight")) {
                if (Math.random() < 0.2) { // 20% chance
                    await message.reply("💤 𝑁𝑖𝑔ℎ𝑡 𝑛𝑖𝑔ℎ𝑡! 𝑆𝑙𝑒𝑒𝑝 𝑡𝑖𝑔ℎ𝑡 𝑤𝑖𝑡ℎ 𝑠𝑤𝑒𝑒𝑡 𝑑𝑟𝑒𝑎𝑚𝑠! 💋");
                }
            }

            if (messageText.includes("good morning") || messageText.includes("gm")) {
                if (Math.random() < 0.2) { // 20% chance
                    await message.reply("🌞 𝐺𝑜𝑜𝑑 𝑚𝑜𝑟𝑛𝑖𝑛𝑔! 𝐻𝑒𝑟𝑒'𝑠 𝑎 𝑘𝑖𝑠𝑠 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑦𝑜𝑢𝑟 𝑑𝑎𝑦! 💋");
                }
            }

        } catch (error) {
            console.error("𝐴𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
        }
    },

    // 🎯 Main kiss sending function
    sendKiss: async function (message, targetUserId, targetUserName, senderID) {
        try {
            const fs = require("fs-extra");
            const axios = require("axios");
            const path = require("path");

            // 🎭 Emoji system - different kiss types
            const kissEmojis = [
                "💋", "😘", "❤️", "😚", "😙", "🥰", "🤗", "👄", "💋❤️", "😘✨",
                "💋🥰", "❤️😘", "💋💫", "😘🌟", "💋✨", "❤️✨", "🥰💋"
            ];
            
            // 🎭 Kiss messages based on relationship
            const kissMessages = [
                `${targetUserName}, 𝑀𝑊𝐴𝐻! ${this.getRandomEmoji(kissEmojis)}`,
                `${targetUserName}, 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑦𝑜𝑢 𝑎 𝑘𝑖𝑠𝑠! ${this.getRandomEmoji(kissEmojis)}`,
                `${targetUserName}, 𝑙𝑜𝑣𝑒 𝑎𝑛𝑑 𝑘𝑖𝑠𝑠𝑒𝑠! ${this.getRandomEmoji(kissEmojis)}`,
                `${targetUserName}, 𝑚𝑢𝑎ℎ 𝑚𝑢𝑎ℎ! ${this.getRandomEmoji(kissEmojis)}`,
                `${targetUserName}, 𝑥𝑜𝑥𝑜! ${this.getRandomEmoji(kissEmojis)}`,
                `${targetUserName}, 𝑠𝑚𝑜𝑜𝑐ℎ 𝑠𝑚𝑜𝑜𝑐ℎ! ${this.getRandomEmoji(kissEmojis)}`,
                `${targetUserName}, 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑙𝑜𝑣𝑒! ${this.getRandomEmoji(kissEmojis)}`,
                `${targetUserName}, 𝑘𝑖𝑠𝑠𝑒𝑠 𝑓𝑜𝑟 𝑦𝑜𝑢! ${this.getRandomEmoji(kissEmojis)}`
            ];

            // Create cache directory
            const cacheDir = path.resolve(__dirname, '../scripts/cmds/cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            // Get random kiss image from API
            const apiResponse = await axios.get('https://nekos.life/api/v2/img/kiss');
            const picData = apiResponse.data;
            const getURL = picData.url;
            const ext = getURL.substring(getURL.lastIndexOf(".") + 1);
            const imagePath = path.resolve(cacheDir, `smooch_${Date.now()}.${ext}`);
            
            // Download the image
            const imageResponse = await axios.get(getURL, {
                responseType: 'arraybuffer'
            });
            
            fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));
            
            // Send the kiss
            await message.reply({
                body: this.getRandomMessage(kissMessages),
                mentions: [{
                    tag: targetUserName,
                    id: targetUserId
                }],
                attachment: fs.createReadStream(imagePath)
            });
            
            // Clean up after 5 seconds
            setTimeout(() => {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }, 5000);
            
        } catch (error) {
            console.error("𝑆𝑒𝑛𝑑 𝐾𝑖𝑠𝑠 𝑒𝑟𝑟𝑜𝑟:", error);
            throw error;
        }
    },

    // 🎯 Utility functions
    getRandomEmoji: function (emojiArray) {
        return emojiArray[Math.floor(Math.random() * emojiArray.length)];
    },

    getRandomMessage: function (messageArray) {
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }
};
