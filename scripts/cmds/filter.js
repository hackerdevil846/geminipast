'use strict';

module.exports = {
    config: {
        name: "filter",
        aliases: ["fbclean", "cleanfb"],
        version: "2.1.0",
        author: "𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱",
        countDown: 300,
        role: 1,
        category: "group",
        shortDescription: {
            en: "🚫 FILTER FACEBOOK USERS FROM GROUP"
        },
        longDescription: {
            en: "REMOVE FACEBOOK USERS FROM GROUP WITH DETAILED REPORTING"
        },
        guide: {
            en: "{p}filter [all/list]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ api, event, args }) {
        try {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const userInfo = threadInfo.userInfo;
            const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
            const isBotAdmin = adminIDs.some(id => id === api.getCurrentUserID());
            
            if (args[0] === "list" || args[0] === "view") {
                const facebookUsers = userInfo.filter(user => user.gender === undefined);
                
                if (facebookUsers.length === 0) {
                    return api.sendMessage("🌟 | NO FACEBOOK USERS FOUND IN THIS GROUP!", event.threadID);
                }
                
                let message = `📋 | FOUND ${facebookUsers.length} FACEBOOK USERS:\n\n`;
                facebookUsers.forEach((user, index) => {
                    message += `${index + 1}. ${user.name || 'UNKNOWN USER'} (${user.id})\n`;
                });
                
                message += "\n💡 | USE 'FILTER ALL' TO REMOVE ALL THESE USERS";
                return api.sendMessage(message, event.threadID);
            }
            
            if (args[0] === "all") {
                const facebookUsers = userInfo.filter(user => user.gender === undefined);
                
                if (facebookUsers.length === 0) {
                    return api.sendMessage("🌟 | NO FACEBOOK USERS FOUND TO FILTER!", event.threadID);
                }
                
                if (!isBotAdmin) {
                    return api.sendMessage("❌ | I NEED ADMIN PERMISSIONS TO FILTER USERS!", event.threadID);
                }
                
                api.sendMessage(
                    `⚠️ | WARNING: THIS WILL REMOVE ${facebookUsers.length} FACEBOOK USERS!\n` +
                    "REACT WITH 👍 TO CONFIRM OR 👎 TO CANCEL WITHIN 30 SECONDS.",
                    event.threadID,
                    (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            users: facebookUsers,
                            type: "confirmation"
                        });
                        
                        setTimeout(() => {
                            const index = global.client.handleReply.findIndex(item => item.messageID === info.messageID);
                            if (index !== -1) {
                                global.client.handleReply.splice(index, 1);
                                api.sendMessage("⏰ | FILTER CONFIRMATION TIMED OUT.", event.threadID);
                            }
                        }, 30000);
                    }
                );
                
                return;
            }
            
            const facebookUsers = userInfo.filter(user => user.gender === undefined);
            
            if (facebookUsers.length === 0) {
                return api.sendMessage("✨ | THIS GROUP IS CLEAN! NO FACEBOOK USERS DETECTED.", event.threadID);
            }
            
            if (!isBotAdmin) {
                return api.sendMessage("🔒 | I NEED ADMIN PERMISSIONS TO FILTER USERS!", event.threadID);
            }
            
            let successCount = 0;
            let failCount = 0;
            const failedUsers = [];
            
            api.sendMessage(
                `🔍 | FOUND ${facebookUsers.length} FACEBOOK USER(S)...\n` +
                "🔄 | STARTING FILTRATION PROCESS...\n\n" +
                "⏳ | THIS MAY TAKE A WHILE DEPENDING ON THE NUMBER OF USERS.",
                event.threadID
            );
            
            for (let i = 0; i < facebookUsers.length; i++) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    await api.removeUserFromGroup(facebookUsers[i].id, event.threadID);
                    successCount++;
                    
                    if ((i + 1) % 5 === 0 || i === facebookUsers.length - 1) {
                        api.sendMessage(
                            `📊 | PROGRESS: ${i + 1}/${facebookUsers.length} USERS PROCESSED\n` +
                            `✅ | SUCCESS: ${successCount}\n` +
                            `❌ | FAILED: ${failCount}`,
                            event.threadID
                        );
                    }
                } catch (error) {
                    failCount++;
                    failedUsers.push(facebookUsers[i].name || facebookUsers[i].id);
                }
            }
            
            let resultMessage = 
                `🎉 | FILTRATION COMPLETE!\n\n` +
                `✅ | SUCCESSFULLY REMOVED: ${successCount} USER(S)\n` +
                `❌ | FAILED TO REMOVE: ${failCount} USER(S)`;
            
            if (failCount > 0) {
                resultMessage += `\n📋 | FAILED USERS: ${failedUsers.join(', ')}`;
            }
            
            resultMessage += `\n\n🏆 | MADE BY ASIF MAHMUD`;
            
            api.sendMessage(resultMessage, event.threadID);
            
        } catch (error) {
            console.error("FILTER COMMAND ERROR:", error);
            api.sendMessage(
                "⚠️ | AN ERROR OCCURRED WHILE PROCESSING THE COMMAND. PLEASE TRY AGAIN LATER.",
                event.threadID
            );
        }
    },

    onReply: async function({ api, event, handleReply }) {
        try {
            if (handleReply.type === "confirmation") {
                if (event.body === "👍") {
                    const { users } = handleReply;
                    let successCount = 0;
                    let failCount = 0;
                    
                    api.sendMessage("🔄 | STARTING MASS FILTRATION...", event.threadID);
                    
                    for (let i = 0; i < users.length; i++) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            await api.removeUserFromGroup(users[i].id, event.threadID);
                            successCount++;
                        } catch (error) {
                            failCount++;
                        }
                    }
                    
                    let resultMessage = 
                        `🎉 | MASS FILTRATION COMPLETE!\n\n` +
                        `✅ | SUCCESSFULLY REMOVED: ${successCount} USER(S)\n` +
                        `❌ | FAILED TO REMOVE: ${failCount} USER(S)\n\n` +
                        `🏆 | MADE BY ASIF MAHMUD`;
                    
                    api.sendMessage(resultMessage, event.threadID);
                    
                    const index = global.client.handleReply.findIndex(item => item.messageID === handleReply.messageID);
                    if (index !== -1) {
                        global.client.handleReply.splice(index, 1);
                    }
                    
                } else if (event.body === "👎") {
                    api.sendMessage("❌ | FILTRATION CANCELLED BY USER.", event.threadID);
                    
                    const index = global.client.handleReply.findIndex(item => item.messageID === handleReply.messageID);
                    if (index !== -1) {
                        global.client.handleReply.splice(index, 1);
                    }
                }
            }
        } catch (error) {
            console.error("HANDLE REPLY ERROR:", error);
            api.sendMessage("⚠️ | AN ERROR OCCURRED WHILE PROCESSING YOUR RESPONSE.", event.threadID);
        }
    }
};
