module.exports = {
    config: {
        name: "greet",
        aliases: [],
        version: "1.1",
        role: 0,
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        shortDescription: {
            en: "👋 𝖦𝗋𝖾𝖾𝗍𝗂𝗇𝗀 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗐𝗂𝗍𝗁 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗅𝗂𝗓𝖾𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾𝗌"
        },
        longDescription: {
            en: "𝖲𝖾𝗇𝖽𝗌 𝖺 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗅𝗂𝗓𝖾𝖽 𝗀𝗋𝖾𝖾𝗍𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇"
        },
        category: "𝗎𝗍𝗂𝗅𝗂𝗍𝗒",
        guide: {
            en: "{p}greet [𝗇𝖺𝗆𝖾]"
        },
        countDown: 5,
        dependencies: {}
    },

    onStart: async function({ message, event, args, api }) {
        try {
            const { senderID, threadID } = event;
            
            // Input validation and sanitization
            const userName = args.length > 0 ? args.join(" ").trim() : null;
            
            // Validate name length to prevent spam
            if (userName && userName.length > 100) {
                return message.reply("❌ 𝖭𝖺𝗆𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 100 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }
            
            // Validate name content to prevent malicious input
            if (userName && /[<>{}[\]]/.test(userName)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 𝗂𝗇 𝗇𝖺𝗆𝖾! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗈𝗇𝗅𝗒 𝗍𝖾𝗑𝗍.");
            }
            
            try {
                // Get user info for personalized greeting
                let userInfo;
                try {
                    const userData = await api.getUserInfo(senderID);
                    userInfo = userData[senderID];
                } catch (userError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖿𝖾𝗍𝖼𝗁 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", userError.message);
                    userInfo = null;
                }
                
                const userDisplayName = userInfo?.name || "𝖴𝗌𝖾𝗋";
                
                if (userName) {
                    // Personalized greeting with name
                    const greetingMessage = 
                        `✨ 𝗛𝗲𝗹𝗹𝗼 ${userName}! ✨\n\n` +
                        `👤 𝖸𝗈𝗎𝗋 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖨𝖣: ${senderID}\n` +
                        `📝 𝖱𝖾𝗀𝗂𝗌𝗍𝖾𝗋𝖾𝖽 𝖭𝖺𝗆𝖾: ${userDisplayName}\n` +
                        `💫 𝖦𝗋𝖾𝖾𝗍𝗂𝗇𝗀 𝗌𝖾𝗇𝗍 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;
                    
                    await message.reply(greetingMessage);
                } else {
                    // General greeting
                    const greetingMessage = 
                        `🌍 𝗛𝗲𝗹𝗹𝗼 𝗪𝗼𝗿𝗹𝗱! 🌍\n\n` +
                        `👤 𝖸𝗈𝗎𝗋 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖨𝖣: ${senderID}\n` +
                        `📝 𝖱𝖾𝗀𝗂𝗌𝗍𝖾𝗋𝖾𝖽 𝖭𝖺𝗆𝖾: ${userDisplayName}\n` +
                        `✨ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;
                    
                    await message.reply(greetingMessage);
                }
                
                console.log(`✅ 𝖦𝗋𝖾𝖾𝗍𝗂𝗇𝗀 𝗌𝖾𝗇𝗍 𝗍𝗈 𝗎𝗌𝖾𝗋 ${senderID} 𝗂𝗇 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
                
            } catch (apiError) {
                console.error("𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
                
                // Fallback greeting without user info
                if (userName) {
                    await message.reply(`✨ 𝗛𝗲𝗹𝗹𝗼 ${userName}! ✨\n\n👤 𝖸𝗈𝗎𝗋 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖨𝖣: ${senderID}\n💫 𝖦𝗋𝖾𝖾𝗍𝗂𝗇𝗀 𝗌𝖾𝗇𝗍 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`);
                } else {
                    await message.reply(`🌍 𝗛𝗲𝗹𝗹𝗼 𝗪𝗼𝗿𝗹𝗱! 🌍\n\n👤 𝖸𝗈𝗎𝗋 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖨𝖣: ${senderID}\n✨ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`);
                }
            }
            
        } catch (error) {
            console.error("💥 𝖦𝗋𝖾𝖾𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            // Final fallback - simple error-resistant greeting
            try {
                const { senderID } = event;
                await message.reply(`👋 𝖧𝖾𝗅𝗅𝗈! 𝖸𝗈𝗎𝗋 𝖨𝖣: ${senderID}\n✨ 𝖡𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`);
            } catch (finalError) {
                console.error("💥 𝖥𝗂𝗇𝖺𝗅 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖾𝗋𝗋𝗈𝗋:", finalError);
                // Silent fail to avoid spam
            }
        }
    }
};
