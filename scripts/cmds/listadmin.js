module.exports = {
    config: {
        name: "listadmin",
        aliases: ["admins", "adminlist"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "group",
        shortDescription: {
            en: "Group administrators list"
        },
        longDescription: {
            en: "Shows all administrators in the current group with their roles"
        },
        guide: {
            en: "{p}listadmin"
        }
    },

    onStart: async function({ message, event, api }) {
        try {
            const { threadID } = event;

            // Get thread information
            const threadInfo = await api.getThreadInfo(threadID);
            
            if (!threadInfo.adminIDs || threadInfo.adminIDs.length === 0) {
                return message.reply("❌ No administrators found in this group.");
            }

            const adminIDs = threadInfo.adminIDs;
            const adminList = [];
            
            // Process admins in batches to avoid rate limits
            const batchSize = 10;
            for (let i = 0; i < adminIDs.length; i += batchSize) {
                const batch = adminIDs.slice(i, i + batchSize);
                const batchPromises = batch.map(async (admin) => {
                    try {
                        const userInfo = await api.getUserInfo(admin.id);
                        if (userInfo[admin.id]) {
                            return {
                                name: userInfo[admin.id].name || `User (${admin.id})`,
                                role: admin.role || 'admin',
                                id: admin.id
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching user ${admin.id}:`, error);
                        return {
                            name: `Unknown User (${admin.id})`,
                            role: admin.role || 'admin',
                            id: admin.id
                        };
                    }
                });

                const batchResults = await Promise.allSettled(batchPromises);
                batchResults.forEach(result => {
                    if (result.status === 'fulfilled' && result.value) {
                        adminList.push(result.value);
                    }
                });

                // Small delay between batches to avoid rate limiting
                if (i + batchSize < adminIDs.length) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            // Sort admins alphabetically by name
            adminList.sort((a, b) => a.name.localeCompare(b.name));

            // Check if message is too long and split if necessary
            let listMessage = `👑 Group Administrators List (${adminList.length})\n\n`;
            
            adminList.forEach((admin, index) => {
                const roleEmoji = admin.role === 'superadmin' ? '👑' : '🛡️';
                listMessage += `${index + 1}. ${roleEmoji} ${admin.name}\n`;
            });

            listMessage += `\n📊 Total: ${adminList.length} administrator${adminList.length !== 1 ? 's' : ''}`;

            // Add thread name if available
            if (threadInfo.threadName) {
                listMessage = `📌 Group: ${threadInfo.threadName}\n${listMessage}`;
            }

            // Check message length (Facebook limit is ~2000 characters)
            if (listMessage.length > 1900) {
                // Split into multiple messages
                const lines = listMessage.split('\n');
                let currentMessage = '';
                let messageCount = 1;
                
                for (const line of lines) {
                    if ((currentMessage + line + '\n').length > 1900) {
                        await message.reply(`📋 Administrators List - Part ${messageCount}\n\n${currentMessage}`);
                        currentMessage = line + '\n';
                        messageCount++;
                    } else {
                        currentMessage += line + '\n';
                    }
                }
                
                if (currentMessage.trim()) {
                    await message.reply(`📋 Administrators List - Part ${messageCount}\n\n${currentMessage}`);
                }
            } else {
                await message.reply(listMessage);
            }

        } catch (error) {
            console.error("ListAdmin Error:", error);
            
            let errorMessage = "❌ An error occurred while fetching the admin list. Please try again later.";
            
            if (error.message.includes("ThreadInfo")) {
                errorMessage = "❌ Unable to get group information. Please make sure the bot has proper permissions.";
            } else if (error.message.includes("rate limit")) {
                errorMessage = "❌ Rate limit exceeded. Please try again in a few minutes.";
            } else if (error.message.includes("Not in thread")) {
                errorMessage = "❌ Bot is not in this group or group not found.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
