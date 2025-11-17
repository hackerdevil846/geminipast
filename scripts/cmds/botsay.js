module.exports = {
    config: {
        name: "botsay",
        aliases: [],
        version: "1.1.1",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖡𝗈𝗍 𝗐𝗂𝗅𝗅 𝗋𝖾𝗉𝖾𝖺𝗍 𝗒𝗈𝗎𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 📣"
        },
        longDescription: {
            en: "𝖡𝗈𝗍 𝗐𝗂𝗅𝗅 𝗋𝖾𝗉𝖾𝖺𝗍 𝗍𝗁𝖾 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗒𝗈𝗎 𝗉𝗋𝗈𝗏𝗂𝖽𝖾"
        },
        guide: {
            en: "{p}botsay [𝗆𝖾𝗌𝗌𝖺𝗀𝖾]"
        }
    },

    onStart: async function({ message, args, event }) {
        try {
            const say = args.join(" ").trim();
            
            if (!say) {
                return message.reply("❗ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗈𝗋 𝗆𝖾 𝗍𝗈 𝗋𝖾𝗉𝖾𝖺𝗍!");
            }

            // Check message length to prevent spam
            if (say.length > 2000) {
                return message.reply("❌ 𝖬𝖾𝗌𝗌𝖺𝗀𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 2000 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            // Check for empty message after trimming
            if (say.length === 0) {
                return message.reply("❗ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾!");
            }

            // Check if message contains only whitespace characters
            if (!say.replace(/\s/g, '').length) {
                return message.reply("❗ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝖺𝖼𝗍𝗎𝖺𝗅 𝖼𝗈𝗇𝗍𝖾𝗇𝗍!");
            }

            return message.reply(`🗨️ ${say}`);
            
        } catch (error) {
            console.error("💥 𝖡𝗈𝗍𝖲𝖺𝗒 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
