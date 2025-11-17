module.exports = {
    config: {
        name: "goiadmin",
        version: "1.0.0",
        role: 0,
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 1,
        category: "system",
        shortDescription: {
            en: "🦋 𝖬𝖺𝗅𝗂𝗄 𝗄𝖾 𝗍𝖺𝗀 𝗄𝗈𝗋𝗅𝖾 𝖻𝗈𝗍 𝖺𝗎𝗍𝗈 𝗋𝖾𝗉𝗅𝗒 𝖽𝗂𝖻𝖾 🌺"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗐𝗁𝖾𝗇 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝗌 𝗍𝗁𝖾 𝖺𝖽𝗆𝗂𝗇"
        },
        guide: {
            en: ""
        },
        envConfig: {
            adminUID: "61571630409265"
        }
    },

    onChat: async function({ event, message, envConfig }) {
        try {
            const { senderID, mentions, body } = event;
            
            // Check if envConfig exists
            if (!envConfig) {
                console.error("❌ 𝖾𝗇𝗏𝖢𝗈𝗇𝖿𝗂𝗀 𝗂𝗌 𝗎𝗇𝖽𝖾𝖿𝗂𝗇𝖾𝖽");
                return;
            }
            
            const admin = envConfig.adminUID;
            
            // Validate admin UID
            if (!admin || typeof admin !== 'string' || admin.length < 5) {
                console.error("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝖽𝗆𝗂𝗇 𝖴𝖨𝖣 𝗂𝗇 𝖾𝗇𝗏𝖢𝗈𝗇𝖿𝗂𝗀");
                return;
            }
            
            // Check if message contains mentions and admin is mentioned
            if (!mentions || typeof mentions !== 'object') {
                return;
            }
            
            const adminMentioned = Object.keys(mentions).some(id => id === admin);
            
            if (!adminMentioned) {
                return;
            }
            
            // Don't respond if admin is mentioning themselves
            if (senderID === admin) {
                return;
            }
            
            // Don't respond if it's a system message or empty message
            if (!body || body.trim().length === 0) {
                return;
            }
            
            // Rate limiting - prevent spam responses
            const now = Date.now();
            const lastResponse = global.goiadminLastResponse || 0;
            const timeDiff = now - lastResponse;
            
            if (timeDiff < 5000) { // 5 second cooldown
                console.log("🕒 𝖱𝖺𝗍𝖾 𝗅𝗂𝗆𝗂𝗍𝗂𝗇𝗀: 𝗌𝗄𝗂𝗉𝗉𝗂𝗇𝗀 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
                return;
            }
            
            // Update last response time
            global.goiadminLastResponse = now;
            
            const responses = [
                "🌷 𝖬𝖺𝗅𝗂𝗄 𝖻𝗂𝗌𝗒 𝖺𝖼𝗁𝖾, 𝖺𝗆𝖺𝗄𝖾 𝖻𝗈𝗅𝗎𝗇 𝗄𝗂 𝖻𝗈𝗅𝗍𝖾 𝖼𝖺𝗈? 🤔",
                "🌸 𝖪𝗂𝖾 𝗁𝗈𝗅𝗈? 𝖬𝖺𝗅𝗂𝗄 𝗄𝖾 𝗄𝖾𝗇 𝖽𝖺𝗄𝖺𝗍𝖾 𝖼𝖺𝗈? 😊",
                "🌹 𝖴𝗇𝖺𝗋 𝖻𝗂𝗌𝗒 𝗍𝗁𝖺𝗄𝗍𝖾 𝗉𝖺𝗋𝖾𝗇, 𝗉𝗈𝗋𝖾 𝖽𝖺𝗄𝖺𝖻𝖾𝗇 😌",
                "💐 𝖬𝖺𝗅𝗂𝗄 𝖾𝗄𝗁𝗈𝗇 𝗍𝗁𝖾𝗄𝖾 𝗇𝖾𝗂, 𝗉𝗈𝗋𝖾 𝖽𝖾𝗄𝗁𝗂 ⏳",
                "🌺 𝖠𝗉𝗇𝗂 𝗄𝗈𝗍𝗁𝖺 𝖻𝗈𝗅𝗎𝗇, 𝗆𝖺𝗅𝗂𝗄 𝗄𝖾 𝗃𝗂𝗀𝖺𝗒 𝖽𝖺𝗄𝗁𝖺𝖻𝗈! 😇",
                "🌼 𝖬𝖺𝗅𝗂𝗄 𝖾𝗄𝗁𝗈𝗇 𝖺𝗇𝗌𝗍𝗁𝖺, 𝗉𝗈𝗋𝖾 𝖺𝗌𝖻𝖾𝗇 📱",
                "🌻 𝖴𝗇𝗂 𝖽𝖺𝗄𝖺𝗇𝗈𝗋 𝗍𝗁𝖺𝗄𝖾, 𝖺𝗆𝗂 𝖺𝖼𝗁𝗂 𝖺𝗂𝗌𝗈 𝖻𝗈𝗅𝗈 😊",
                "🏵️ 𝖬𝖺𝗅𝗂𝗄 𝖾𝗋 𝗄𝖺𝗃 𝖺𝖼𝗁𝖾, 𝗉𝗈𝗋𝖾 𝖽𝖺𝗄𝖺𝗇𝗈 𝗁𝗈𝗒 😌"
            ];
            
            const randomIndex = Math.floor(Math.random() * responses.length);
            const response = responses[randomIndex];
            
            console.log(`🦋 𝖱𝖾𝗌𝗉𝗈𝗇𝖽𝗂𝗇𝗀 𝗍𝗈 𝖺𝖽𝗆𝗂𝗇 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝖻𝗒 𝗎𝗌𝖾𝗋 ${senderID}`);
            
            await message.reply({
                body: `╔════ஜ۩۞۩ஜ═══╗\n\n${response}\n\n╚════ஜ۩۞۩ஜ═══╝`,
                mentions: [{
                    tag: "@Asif",
                    id: admin
                }]
            });
            
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗀𝗈𝗂𝖺𝖽𝗆𝗂𝗇:", error);
            // Silent fail to avoid spam
        }
    },

    onStart: async function({ message, envConfig }) {
        try {
            // Check if envConfig exists
            if (!envConfig) {
                return message.reply("❌ 𝖾𝗇𝗏𝖢𝗈𝗇𝖿𝗂𝗀 𝗂𝗌 𝗎𝗇𝖽𝖾𝖿𝗂𝗇𝖾𝖽");
            }
            
            const admin = envConfig.adminUID;
            
            // Validate admin UID exists
            if (!admin) {
                return message.reply("❌ 𝖠𝖽𝗆𝗂𝗇 𝖴𝖨𝖣 𝗇𝗈𝗍 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖾𝖽 𝗂𝗇 𝖾𝗇𝗏𝖢𝗈𝗇𝖿𝗂𝗀");
            }
            
            await message.reply("🦋 𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗐𝗁𝖾𝗇 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝗌 𝗍𝗁𝖾 𝖺𝖽𝗆𝗂𝗇 🌺\n\n𝖠𝖽𝗆𝗂𝗇 𝖴𝖨𝖣: " + admin);
            
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗀𝗈𝗂𝖺𝖽𝗆𝗂𝗇 𝗈𝗇𝖲𝗍𝖺𝗋𝗍:", error);
            await message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗀𝗈𝗂𝖺𝖽𝗆𝗂𝗇 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇");
        }
    }
};
