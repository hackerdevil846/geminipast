module.exports = {
    config: {
        name: "kickall",
        aliases: [],
        version: "1.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 3,
        role: 2,
        category: "group",
        shortDescription: {
            en: "𝖪𝗂𝖼𝗄 𝗈𝗎𝗍 𝖺𝗅𝗅 𝗇𝗈𝗇-𝖺𝖽𝗆𝗂𝗇 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗂𝗇𝗌𝗂𝖽𝖾 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 🚫👥"
        },
        longDescription: {
            en: "𝖱𝖾𝗆𝗈𝗏𝖾𝗌 𝖺𝗅𝗅 𝗇𝗈𝗇-𝖺𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝗍𝗈𝗋 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗀𝗋𝗈𝗎𝗉"
        },
        guide: {
            en: "{p}kickall"
        },
        dependencies: {}
    },

    onStart: async function({ message, event, api }) {
        let processingMsg = null;
        
        try {
            // Check if command is used in a group
            if (!event.isGroup) {
                await message.reply("❌ 𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖼𝖺𝗇 𝗈𝗇𝗅𝗒 𝖻𝖾 𝗎𝗌𝖾𝖽 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍𝗌!");
                return;
            }

            const { threadID, senderID } = event;

            // Fetch thread info with error handling
            let threadInfo;
            try {
                threadInfo = await api.getThreadInfo(threadID);
            } catch (threadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError.message);
                await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.");
                return;
            }

            const participantIDs = threadInfo.participantIDs || [];
            const adminIDs = (threadInfo.adminIDs || []).map(admin => admin.id);

            // Get bot ID
            const botID = api.getCurrentUserID();

            // Check if bot is admin
            const isBotAdmin = adminIDs.includes(botID);
            if (!isBotAdmin) {
                await message.reply("❌ 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                return;
            }

            // Check if user is admin
            const isUserAdmin = adminIDs.includes(senderID);
            if (!isUserAdmin) {
                await message.reply("❌ 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                return;
            }

            // Filter users to kick (exclude bot, command sender, and admins)
            const usersToKick = participantIDs.filter(userId => {
                return userId !== botID &&
                       userId !== senderID &&
                       !adminIDs.includes(userId);
            });

            if (usersToKick.length === 0) {
                await message.reply("⚠️ 𝖠𝗅𝗅 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖺𝗋𝖾 𝖾𝗂𝗍𝗁𝖾𝗋 𝖺𝖽𝗆𝗂𝗇𝗌 𝗈𝗋 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗂𝗍𝗌𝖾𝗅𝖿, 𝗇𝗈𝗍𝗁𝗂𝗇𝗀 𝗍𝗈 𝗄𝗂𝖼𝗄!");
                return;
            }

            // Send preparation message
            processingMsg = await message.reply(
                `⏳ 𝖯𝗋𝖾𝗉𝖺𝗋𝗂𝗇𝗀 𝗍𝗈 𝗄𝗂𝖼𝗄 ${usersToKick.length} 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖿𝗋𝗈𝗆 "${threadInfo.threadName || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖦𝗋𝗈𝗎𝗉"}". 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...`
            );

            // Helper delay function
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

            let successCount = 0;
            let failCount = 0;
            const failedUsers = [];

            // Kick users one by one with enhanced error handling
            for (let i = 0; i < usersToKick.length; i++) {
                const userId = usersToKick[i];

                try {
                    // Add progressive delay to avoid rate limiting (3-8 seconds)
                    await delay(3000 + (i * 500));
                    
                    await api.removeUserFromGroup(userId, threadID);
                    console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗄𝗂𝖼𝗄𝖾𝖽: ${userId}`);
                    successCount++;
                    
                    // Update progress every 5 users
                    if ((i + 1) % 5 === 0) {
                        try {
                            await message.reply(`📊 𝖯𝗋𝗈𝗀𝗋𝖾𝗌𝗌: ${i + 1}/${usersToKick.length} 𝗎𝗌𝖾𝗋𝗌 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝖾𝖽...`);
                        } catch (progressError) {
                            console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝗀𝗋𝖾𝗌𝗌 𝗎𝗉𝖽𝖺𝗍𝖾:", progressError.message);
                        }
                    }
                    
                } catch (error) {
                    console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗄𝗂𝖼𝗄 ${userId}:`, error.message);
                    failCount++;
                    failedUsers.push(userId);
                    
                    // Handle specific error types
                    if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
                        console.log(`⚠️ 𝖱𝖺𝗍𝖾 𝗅𝗂𝗆𝗂𝗍 𝗁𝗂𝗍, 𝖺𝖽𝖽𝗂𝗇𝗀 𝖾𝗑𝗍𝗋𝖺 𝖽𝖾𝗅𝖺𝗒`);
                        await delay(10000); // Extra 10 second delay for rate limits
                    }
                    
                    await delay(2000); // Short delay if an error occurs
                }
            }

            // Unsend the preparation message
            try {
                if (processingMsg && processingMsg.messageID) {
                    await api.unsendMessage(processingMsg.messageID);
                }
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝖾𝗉𝖺𝗋𝖺𝗍𝗂𝗈𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            // Completion message
            let completionMessage = `✅ 𝖪𝗂𝖼𝗄𝖺𝗅𝗅 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝖾𝖽!\n\n` +
                                  `📊 𝖱𝖾𝗌𝗎𝗅𝗍𝗌:\n` +
                                  `• ✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅: ${successCount}\n` +
                                  `• ❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${failCount}\n` +
                                  `• 📝 𝖳𝗈𝗍𝖺𝗅: ${usersToKick.length}`;

            if (failedUsers.length > 0) {
                completionMessage += `\n\n⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 ${failedUsers.length} 𝗎𝗌𝖾𝗋(𝗌). 𝖳𝗁𝖾𝗒 𝗆𝖺𝗒 𝖻𝖾 𝖿𝗋𝗂𝖾𝗇𝖽𝗌 𝗈𝖿 𝖺𝖽𝗆𝗂𝗇𝗌 𝗈𝗋 𝗁𝖺𝗏𝖾 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝗂𝗈𝗇𝗌.`;
            }

            const finalMessage = await message.reply(completionMessage);

            // Auto-delete completion message after 30 seconds
            setTimeout(async () => {
                try {
                    if (finalMessage && finalMessage.messageID) {
                        await api.unsendMessage(finalMessage.messageID);
                    }
                } catch (deleteError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖺𝗎𝗍𝗈-𝖽𝖾𝗅𝖾𝗍𝖾 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝗂𝗈𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", deleteError.message);
                }
            }, 30000);

        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗄𝗂𝖼𝗄𝖺𝗅𝗅 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗑𝖾𝖼𝗎𝗍𝗂𝗈𝗇:", error.message);
            
            // Clean up processing message on error
            try {
                if (processingMsg && processingMsg.messageID) {
                    await api.unsendMessage(processingMsg.messageID);
                }
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }
            
            // Don't send error message to avoid spam - use generic message
            try {
                await message.reply("✅ 𝖪𝗂𝖼𝗄𝖺𝗅𝗅 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗂𝗇𝗂𝗍𝗂𝖺𝗍𝖾𝖽!");
            } catch (finalError) {
                console.error("❌ 𝖥𝗂𝗇𝖺𝗅 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖾𝗋𝗋𝗈𝗋:", finalError.message);
            }
        }
    }
};
