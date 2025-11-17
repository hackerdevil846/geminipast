module.exports = {
    config: {
        name: "autoadder",
        aliases: [],
        version: "1.1.0",
        author: "Asif Mahmud",
        countDown: 2,
        role: 0,
        category: "group",
        shortDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖺𝖽𝖽 𝗎𝗌𝖾𝗋𝗌 𝗍𝗈 𝗀𝗋𝗈𝗎𝗉 𝗐𝗁𝖾𝗇 𝖴𝖨𝖣 𝗈𝗋 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗅𝗂𝗇𝗄 𝗂𝗌 𝗌𝖾𝗇𝗍"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖺𝖽𝖽𝗌 𝗎𝗌𝖾𝗋𝗌 𝗍𝗈 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 𝗐𝗁𝖾𝗇 𝖺 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖴𝖨𝖣 𝗈𝗋 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗅𝗂𝗇𝗄 𝗂𝗌 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝗂𝗇 𝖼𝗁𝖺𝗍"
        },
        guide: {
            en: "{p}autoadder\n𝖲𝖾𝗇𝖽 𝖺𝗇𝗒 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖴𝖨𝖣 𝗈𝗋 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗅𝗂𝗇𝗄 𝗂𝗇 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉"
        }
    },

    onStart: async function({ message }) {
        try {
            await message.reply("🤖 𝖠𝗎𝗍𝗈 𝖠𝖽𝖽𝖾𝗋 𝗂𝗌 𝖺𝖼𝗍𝗂𝗏𝖾! 𝖨 𝗐𝗂𝗅𝗅 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖺𝖽𝖽 𝗎𝗌𝖾𝗋𝗌 𝗐𝗁𝖾𝗇 𝗒𝗈𝗎 𝗌𝖾𝗇𝖽 𝖺 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖴𝖨𝖣 𝗈𝗋 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗅𝗂𝗇𝗄.");
        } catch (error) {
            console.error("💥 𝖠𝗎𝗍𝗈𝖺𝖽𝖽𝖾𝗋 𝗌𝗍𝖺𝗋𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onChat: async function({ event, api, message }) {
        try {
            const { threadID, body, senderID } = event;
            
            // 𝖯𝗋𝖾𝗏𝖾𝗇𝗍 𝖻𝗈𝗍 𝖿𝗋𝗈𝗆 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗂𝗇𝗀 𝗍𝗈 𝗂𝗍𝗌𝖾𝗅𝖿
            if (senderID === api.getCurrentUserID()) return;
            
            if (!body || typeof body !== 'string') return;

            // 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗅𝗂𝗇𝗄 𝗋𝖾𝗀𝖾𝗑 𝗉𝖺𝗍𝗍𝖾𝗋𝗇𝗌
            const fbLinkRegex = [
                /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/(?:profile\.php\?id=)?|fb\.me\/|fb\.com\/)?([0-9]{9,})/gi,
                /facebook\.com\/([a-zA-Z0-9.]+)/gi,
                /(?:m\.|mobile\.)?facebook\.com\/([a-zA-Z0-9.]+)/gi,
                /fb\.com\/([a-zA-Z0-9.]+)/gi,
                /fb\.me\/([a-zA-Z0-9.]+)/gi
            ];

            let foundUIDs = [];
            
            // 𝖢𝗁𝖾𝖼𝗄 𝖺𝗅𝗅 𝗋𝖾𝗀𝖾𝗑 𝗉𝖺𝗍𝗍𝖾𝗋𝗇𝗌
            for (const regex of fbLinkRegex) {
                const matches = [...body.matchAll(regex)];
                for (const match of matches) {
                    const potentialUID = match[1];
                    // 𝖵𝖺𝗅𝗂𝖽𝖺𝗍𝖾 𝖴𝖨𝖣 (𝗇𝗎𝗆𝖾𝗋𝗂𝖼 𝖺𝗇𝖽 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 9 𝖽𝗂𝗀𝗂𝗍𝗌)
                    if (/^\d{9,}$/.test(potentialUID)) {
                        foundUIDs.push(potentialUID);
                    }
                }
            }

            // 𝖱𝖾𝗆𝗈𝗏𝖾 𝖽𝗎𝗉𝗅𝗂𝖼𝖺𝗍𝖾𝗌
            foundUIDs = [...new Set(foundUIDs)];

            if (foundUIDs.length === 0) return;

            // 𝖢𝗁𝖾𝖼𝗄 𝗂𝖿 𝖻𝗈𝗍 𝗂𝗌 𝖺𝖽𝗆𝗂𝗇 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉
            let isBotAdmin = false;
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const botID = api.getCurrentUserID();
                isBotAdmin = threadInfo.adminIDs?.some(admin => admin.id === botID) || false;
            } catch (threadError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError.message);
                return;
            }

            if (!isBotAdmin) {
                await message.reply("❌ 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗍𝗈 𝖺𝖽𝖽 𝗎𝗌𝖾𝗋𝗌.");
                return;
            }

            let successCount = 0;
            let failCount = 0;
            let approvalCount = 0;

            // 𝖯𝗋𝗈𝖼𝖾𝗌𝗌 𝖾𝖺𝖼𝗁 𝖴𝖨𝖣
            for (const uid of foundUIDs) {
                try {
                    // 𝖠𝖽𝖽 𝖺 𝗌𝗆𝖺𝗅𝗅 𝖽𝖾𝗅𝖺𝗒 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗋𝖺𝗍𝖾 𝗅𝗂𝗆𝗂𝗍𝗂𝗇𝗀
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    await api.addUserToGroup(uid, threadID);
                    successCount++;
                    console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖺𝖽𝖽𝖾𝖽 𝗎𝗌𝖾𝗋: ${uid}`);
                    
                } catch (error) {
                    console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖽𝖽 ${uid}:`, error.message);
                    
                    if (error.message && error.message.includes("approval")) {
                        approvalCount++;
                        await message.reply(`⚠️ 𝖠𝖽𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍 𝗌𝖾𝗇𝗍 𝖿𝗈𝗋 𝖴𝖨𝖣: ${uid}. 𝖶𝖺𝗂𝗍𝗂𝗇𝗀 𝖿𝗈𝗋 𝖺𝖽𝗆𝗂𝗇 𝖺𝗉𝗉𝗋𝗈𝗏𝖺𝗅.`);
                    } else if (error.message && error.message.includes("not friends")) {
                        await message.reply(`❌ 𝖢𝖺𝗇𝗇𝗈𝗍 𝖺𝖽𝖽 ${uid}: 𝖴𝗌𝖾𝗋 𝗂𝗌 𝗇𝗈𝗍 𝖿𝗋𝗂𝖾𝗇𝖽𝗌 𝗐𝗂𝗍𝗁 𝖻𝗈𝗍.`);
                        failCount++;
                    } else if (error.message && error.message.includes("block")) {
                        await message.reply(`❌ 𝖢𝖺𝗇𝗇𝗈𝗍 𝖺𝖽𝖽 ${uid}: 𝖴𝗌𝖾𝗋 𝗁𝖺𝗌 𝖻𝗅𝗈𝖼𝗄𝖾𝖽 𝖻𝗈𝗍.`);
                        failCount++;
                    } else if (error.message && error.message.includes("already")) {
                        await message.reply(`ℹ️ 𝖴𝗌𝖾𝗋 ${uid} 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗂𝗇 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉.`);
                        // 𝖢𝗈𝗎𝗇𝗍 𝖺𝗌 𝗌𝗎𝖼𝖼𝖾𝗌𝗌 𝗌𝗂𝗇𝖼𝖾 𝗎𝗌𝖾𝗋 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉
                        successCount++;
                    } else {
                        await message.reply(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖽𝖽 ${uid}: ${error.message || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖾𝗋𝗋𝗈𝗋"}`);
                        failCount++;
                    }
                }
            }

            // 𝖲𝖾𝗇𝖽 𝗌𝗎𝗆𝗆𝖺𝗋𝗒 𝗋𝖾𝗉𝗈𝗋𝗍
            if (successCount > 0 || approvalCount > 0 || failCount > 0) {
                const summaryMessage = 
                    `📊 𝖠𝗎𝗍𝗈 𝖠𝖽𝖽𝖾𝗋 𝖱𝖾𝗉𝗈𝗋𝗍:\n\n` +
                    `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖺𝖽𝖽𝖾𝖽: ${successCount}\n` +
                    `⚠️ 𝖯𝖾𝗇𝖽𝗂𝗇𝗀 𝖺𝗉𝗉𝗋𝗈𝗏𝖺𝗅: ${approvalCount}\n` +
                    `❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${failCount}`;
                
                await message.reply(summaryMessage);
            }

        } catch (error) {
            console.error("💥 𝖠𝗎𝗍𝗈𝖺𝖽𝖽𝖾𝗋 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
            // 𝖣𝗈𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆
        }
    }
};
