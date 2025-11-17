module.exports = {
    config: {
        name: "log",
        aliases: [],
        version: "1.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 3,
        role: 0,
        category: "system",
        shortDescription: {
            en: "𝖲𝗒𝗌𝗍𝖾𝗆 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝗏𝗂𝖾𝗐𝖾𝗋"
        },
        longDescription: {
            en: "𝖣𝗂𝗌𝗉𝗅𝖺𝗒𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗌𝗒𝗌𝗍𝖾𝗆 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝖺𝗇𝖽 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇"
        },
        guide: {
            en: "{p}log"
        },
        dependencies: {}
    },

    onStart: async function({ message, event, threadsData }) {
        try {
            const { threadID } = event;

            // Get thread data with error handling
            let dataThread;
            try {
                dataThread = await threadsData.get(threadID);
            } catch (dataError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺:", dataError);
                dataThread = {};
            }

            const data = (dataThread && dataThread.data) ? dataThread.data : {};

            // Default settings with fallbacks
            const settingsRaw = {
                log: data.log ?? 'true',
                rankup: data.rankup ?? 'false',
                resend: data.resend ?? 'false',
                tagadmin: data.tagadmin ?? 'true',
                guard: data.guard ?? 'false',
                antiout: data.antiout ?? 'false',
                antijoin: data.antijoin ?? 'false'
            };

            // Convert to friendly status text with dark stylish font
            const toStatus = (v) => {
                if (v === true || v === 'true' || String(v).toLowerCase() === 'true') return '✅ 𝖤𝗇𝖺𝖻𝗅𝖾𝖽';
                if (v === false || v === 'false' || String(v).toLowerCase() === 'false') return '❌ 𝖣𝗂𝗌𝖺𝖻𝗅𝖾𝖽';
                return `📄 ${String(v)}`;
            };

            const messageText = `
🧾 𝖲𝗒𝗌𝗍𝖾𝗆 𝖲𝖾𝗍𝗍𝗂𝗇𝗀𝗌

📝 𝖫𝗈𝗀: ${toStatus(settingsRaw.log)}
⬆️ 𝖱𝖺𝗇𝗄𝗎𝗉: ${toStatus(settingsRaw.rankup)}
🔁 𝖱𝖾𝗌𝖾𝗇𝖽: ${toStatus(settingsRaw.resend)}
👨‍💼 𝖳𝖺𝗀 𝖠𝖽𝗆𝗂𝗇: ${toStatus(settingsRaw.tagadmin)}
🛡️ 𝖠𝗇𝗍𝗂𝗋𝗈𝖻𝖻𝖾𝗋𝗒: ${toStatus(settingsRaw.guard)}
🚪 𝖠𝗇𝗍𝗂𝗈𝗎𝗍: ${toStatus(settingsRaw.antiout)}
👥 𝖠𝗇𝗍𝗂𝗃𝗈𝗂𝗇: ${toStatus(settingsRaw.antijoin)}

© 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽
            `.trim();

            await message.reply(messageText);

        } catch (error) {
            console.error('💥 𝖫𝗈𝗀 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:', error);
            
            // Send a simple error message without revealing details
            try {
                await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗌𝗒𝗌𝗍𝖾𝗆 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            } catch (replyError) {
                // Silent fail if reply also fails
                console.error("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", replyError);
            }
        }
    }
};
