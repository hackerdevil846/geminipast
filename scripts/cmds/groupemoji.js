module.exports = {
    config: {
        name: "groupemoji",
        aliases: ["setemoji", "changeemoji"],
        version: "1.0.1", 
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 1,
        category: "𝗴𝗿𝗼𝘂𝗽",
        shortDescription: {
            en: "𝖢𝗁𝖺𝗇𝗀𝖾 𝗀𝗋𝗈𝗎𝗉 𝖾𝗆𝗈𝗃𝗂"
        },
        longDescription: {
            en: "𝖢𝗁𝖺𝗇𝗀𝖾 𝗍𝗁𝖾 𝖾𝗆𝗈𝗃𝗂 𝗈𝖿 𝗍𝗁𝖾 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍"
        },
        guide: {
            en: "{p}groupemoji [𝖾𝗆𝗈𝗃𝗂]"
        }
    },

    onStart: async function({ message, args, event, api }) {
        try {
            const { threadID, senderID, isGroup } = event;
            
            // Check if it's a group chat
            if (!isGroup) {
                return message.reply("❌ 𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖼𝖺𝗇 𝗈𝗇𝗅𝗒 𝖻𝖾 𝗎𝗌𝖾𝖽 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍𝗌!");
            }

            const emoji = args.join(" ").trim();
            
            // Check if user provided an emoji
            if (!emoji) {
                return message.reply(
                    "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺𝗇 𝖾𝗆𝗈𝗃𝗂!\n\n" +
                    "💡 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝗀𝗋𝗈𝗎𝗉𝖾𝗆𝗈𝗃𝗂 😎\n" +
                    "💡 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝗀𝗋𝗈𝗎𝗉𝖾𝗆𝗈𝗃𝗂 🎉"
                );
            }

            // Validate emoji format (basic check)
            const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
            const validEmojis = emoji.match(emojiRegex);
            
            if (!validEmojis || validEmojis.length === 0) {
                return message.reply(
                    "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝖾𝗆𝗈𝗃𝗂!\n\n" +
                    "💡 𝖤𝗑𝖺𝗆𝗉𝗅𝖾𝗌: 😊, 🎯, ❤️, 🌟, 🔥"
                );
            }

            // Use only the first valid emoji
            const selectedEmoji = validEmojis[0];

            // Get thread info with error handling
            let threadInfo;
            try {
                threadInfo = await api.getThreadInfo(threadID);
            } catch (threadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // Check if thread info is valid
            if (!threadInfo || !threadInfo.participants) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Check user permissions (role 1 = admin)
            let isUserAdmin = false;
            try {
                // Check if user is in admin list
                if (threadInfo.adminIDs && Array.isArray(threadInfo.adminIDs)) {
                    isUserAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID);
                }
                
                // Alternative check using participants data
                if (!isUserAdmin && threadInfo.participants) {
                    const userParticipant = threadInfo.participants.find(p => p.id === senderID);
                    if (userParticipant) {
                        isUserAdmin = userParticipant.isAdmin || false;
                    }
                }
            } catch (permissionError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗁𝖾𝖼𝗄𝗂𝗇𝗀 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌:", permissionError);
                // Continue without permission check as fallback
            }

            if (!isUserAdmin) {
                return message.reply("❌ 𝖸𝗈𝗎 𝗇𝖾𝖾𝖽 𝗍𝗈 𝖻𝖾 𝖺𝗇 𝖺𝖽𝗆𝗂𝗇 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 𝖾𝗆𝗈𝗃𝗂!");
            }

            // Check bot permissions
            const botID = api.getCurrentUserID();
            let isBotAdmin = false;
            try {
                if (threadInfo.adminIDs && Array.isArray(threadInfo.adminIDs)) {
                    isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
                }
            } catch (botPermissionError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗁𝖾𝖼𝗄𝗂𝗇𝗀 𝖻𝗈𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌:", botPermissionError);
            }

            if (!isBotAdmin) {
                return message.reply("❌ 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝗀𝗋𝗈𝗎𝗉 𝖾𝗆𝗈𝗃𝗂!");
            }

            // Try to change the emoji with rate limiting protection
            try {
                console.log(`🔄 𝖠𝗍𝗍𝖾𝗆𝗉𝗍𝗂𝗇𝗀 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝖾𝗆𝗈𝗃𝗂 𝗍𝗈: ${selectedEmoji}`);
                
                await api.changeThreadEmoji(selectedEmoji, threadID);
                
                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖼𝗁𝖺𝗇𝗀𝖾𝖽 𝖾𝗆𝗈𝗃𝗂 𝗍𝗈: ${selectedEmoji}`);
                
                return message.reply(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖼𝗁𝖺𝗇𝗀𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝖾𝗆𝗈𝗃𝗂 𝗍𝗈: ${selectedEmoji}\n\n🔄 𝖳𝗁𝖾 𝖼𝗁𝖺𝗇𝗀𝖾 𝗌𝗁𝗈𝗎𝗅𝖽 𝖺𝗉𝗉𝖾𝖺𝗋 𝗌𝗁𝗈𝗋𝗍𝗅𝗒.`);
                
            } catch (changeError) {
                console.error("❌ 𝖤𝗆𝗈𝗃𝗂 𝖼𝗁𝖺𝗇𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:", changeError);
                
                let userErrorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝗀𝗋𝗈𝗎𝗉 𝖾𝗆𝗈𝗃𝗂. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                
                if (changeError.message.includes("permission") || changeError.message.includes("not admin")) {
                    userErrorMessage = "❌ 𝖨𝗇𝗌𝗎𝖿𝖿𝗂𝖼𝗂𝖾𝗇𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌. 𝖬𝖺𝗄𝖾 𝗌𝗎𝗋𝖾 𝖻𝗈𝗍 𝖺𝗇𝖽 𝗎𝗌𝖾𝗋 𝖺𝗋𝖾 𝖺𝖽𝗆𝗂𝗇𝗌.";
                } else if (changeError.message.includes("invalid") || changeError.message.includes("emoji")) {
                    userErrorMessage = "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖾𝗆𝗈𝗃𝗂 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝖾𝗆𝗈𝗃𝗂.";
                } else if (changeError.message.includes("rate limit") || changeError.message.includes("429")) {
                    userErrorMessage = "❌ 𝖱𝖺𝗍𝖾 𝗅𝗂𝗆𝗂𝗍 𝖾𝗑𝖼𝖾𝖾𝖽𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖺 𝖿𝖾𝗐 𝗆𝗂𝗇𝗎𝗍𝖾𝗌 𝖻𝖾𝖿𝗈𝗋𝖾 𝗍𝗋𝗒𝗂𝗇𝗀 𝖺𝗀𝖺𝗂𝗇.";
                } else if (changeError.message.includes("timeout")) {
                    userErrorMessage = "⏰ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                }
                
                return message.reply(userErrorMessage);
            }
            
        } catch (error) {
            console.error("💥 𝖦𝗋𝗈𝗎𝗉 𝖤𝗆𝗈𝗃𝗂 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes("threadID")) {
                errorMessage = "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝗂𝗇 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗀𝗋𝗈𝗎𝗉.";
            } else if (error.message.includes("network") || error.message.includes("ECONN")) {
                errorMessage = "🌐 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇 𝖺𝗇𝖽 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes("429") || error.message.includes("rate limit")) {
                errorMessage = "❌ 𝖳𝗈𝗈 𝗆𝖺𝗇𝗒 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖺 𝗐𝗁𝗂𝗅𝖾 𝖻𝖾𝖿𝗈𝗋𝖾 𝗍𝗋𝗒𝗂𝗇𝗀 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            return message.reply(errorMessage);
        }
    }
};
