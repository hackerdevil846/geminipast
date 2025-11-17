module.exports = {
    config: {
        name: "automention",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗎𝗌𝖾𝗋𝗌"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝗌 𝗎𝗌𝖾𝗋𝗌 𝗂𝗇 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍"
        },
        guide: {
            en: "{p}automention"
        }
    },

    onStart: async function({ message, event, api }) {
        try {
            const { mentions, senderID, messageID } = event;

            // 𝖵𝖺𝗅𝗂𝖽𝖺𝗍𝖾 𝗂𝗇𝗉𝗎𝗍 𝗉𝖺𝗋𝖺𝗆𝖾𝗍𝖾𝗋𝗌
            if (!mentions || typeof mentions !== 'object') {
                return await message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝗌 𝖽𝖺𝗍𝖺.");
            }

            const mentionKeys = Object.keys(mentions);
            const mentionValues = Object.values(mentions);

            if (mentionKeys.length === 0) {
                // 𝖬𝖾𝗇𝗍𝗂𝗈𝗇 𝗍𝗁𝖾 𝗌𝖾𝗇𝖽𝖾𝗋
                try {
                    await message.reply(`👤 𝖸𝗈𝗎𝗋 𝗆𝖾𝗇𝗍𝗂𝗈𝗇: @[${senderID}:0]`);
                } catch (selfMentionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗌𝖾𝗇𝖽𝖾𝗋:", selfMentionError.message);
                    await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇.");
                }
            } else {
                let successCount = 0;
                let failCount = 0;

                // 𝖯𝗋𝗈𝖼𝖾𝗌𝗌 𝖾𝖺𝖼𝗁 𝗆𝖾𝗇𝗍𝗂𝗈𝗇
                for (let i = 0; i < mentionKeys.length; i++) {
                    try {
                        const uid = mentionKeys[i];
                        const name = String(mentionValues[i]).replace('@', '').trim();
                        
                        // 𝖵𝖺𝗅𝗂𝖽𝖺𝗍𝖾 𝖴𝖨𝖣 𝖺𝗇𝖽 𝗇𝖺𝗆𝖾
                        if (!uid || !/^\d+$/.test(uid)) {
                            console.warn(`❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖴𝖨𝖣: ${uid}`);
                            failCount++;
                            continue;
                        }

                        if (!name || name.length === 0) {
                            console.warn(`❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗇𝖺𝗆𝖾 𝖿𝗈𝗋 𝖴𝖨𝖣: ${uid}`);
                            failCount++;
                            continue;
                        }

                        // 𝖲𝖾𝗇𝖽 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾
                        await message.reply(`📍 𝖬𝖾𝗇𝗍𝗂𝗈𝗇𝗂𝗇𝗀: ${name}\n➺ @[${uid}:0]`);
                        successCount++;

                        // 𝖠𝖽𝖽 𝖺 𝗌𝗆𝖺𝗅𝗅 𝖽𝖾𝗅𝖺𝗒 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗋𝖺𝗍𝖾 𝗅𝗂𝗆𝗂𝗍𝗂𝗇𝗀
                        if (i < mentionKeys.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }

                    } catch (mentionError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗎𝗌𝖾𝗋 ${mentionKeys[i]}:`, mentionError.message);
                        failCount++;
                    }
                }

                // 𝖲𝖾𝗇𝖽 𝗌𝗎𝗆𝗆𝖺𝗋𝗒 𝗋𝖾𝗉𝗈𝗋𝗍
                if (mentionKeys.length > 1) {
                    const summaryMessage = 
                        `📊 𝖬𝖾𝗇𝗍𝗂𝗈𝗇 𝖱𝖾𝗉𝗈𝗋𝗍:\n\n` +
                        `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅: ${successCount}\n` +
                        `❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${failCount}`;
                    
                    try {
                        await message.reply(summaryMessage);
                    } catch (summaryError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗌𝗎𝗆𝗆𝖺𝗋𝗒:", summaryError.message);
                    }
                }
            }

        } catch (error) {
            console.error("💥 𝖠𝗎𝗍𝗈𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝗌.";
            
            if (error.message && error.message.includes('rate limit')) {
                errorMessage = "❌ 𝖱𝖺𝗍𝖾 𝗅𝗂𝗆𝗂𝗍 𝖾𝗑𝖼𝖾𝖾𝖽𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            } else if (error.message && error.message.includes('permission')) {
                errorMessage = "❌ 𝖨𝗇𝗌𝗎𝖿𝖿𝗂𝖼𝗂𝖾𝗇𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌.";
            }
            
            try {
                await message.reply(errorMessage);
            } catch (finalError) {
                console.error("💥 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", finalError.message);
            }
        }
    }
};
