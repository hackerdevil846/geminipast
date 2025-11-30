const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "account",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud", // Modified by AI
        countDown: 5,
        role: 2, // Only Admin
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        shortDescription: {
            en: "Manage account.txt file (Refresh/Update)"
        },
        longDescription: {
            en: "Refreshes account.txt with current session OR updates it via reply."
        },
        guide: {
            en: "{p}account (to refresh current)\n{p}account (reply to a JSON code to update)"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, api, args }) {
        const { threadID, messageID, senderID } = event;
        
        // 1. Authorized Users Check (Admin Only)
        // Replace with your actual admin UID logic if 'authorizedUsers' is global
        // If your bot has a config.json with admins, use that. 
        // For now assuming authorizedUsers is defined globally or we use a specific list.
        const admins = global.config?.ADMINBOT || global.config?.NDH || []; // Adjust based on your bot structure
        if (!admins.includes(String(senderID)) && !global.config?.ADMINBOT?.includes(senderID)) {
             // Fallback if global.authorizedUsers exists
             if (typeof authorizedUsers !== 'undefined' && !authorizedUsers.includes(String(senderID))) {
                 return message.reply("❌ 𝗬𝗼𝘂 𝗱𝗼 𝗻𝗼𝘁 𝗵𝗮𝘃𝗲 𝗽𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝘁𝗼 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱! 😾");
             }
        }

        try {
            // Define Paths
            // process.cwd() ensures we are at the root folder of the bot
            const filePath = path.join(process.cwd(), 'account.txt');
            const backupPath = path.join(process.cwd(), 'account_backup.json');

            // Helper function to validate JSON
            const isValidCookie = (content) => {
                try {
                    const parsed = JSON.parse(content);
                    return Array.isArray(parsed) && parsed.length > 0 ? parsed : false;
                } catch (e) {
                    return false;
                }
            };

            // =========================================================
            // SCENARIO 1: REPLY TO A MESSAGE (UPDATE COOKIE MANUALLY)
            // =========================================================
            if (event.type === "message_reply" && event.messageReply.body) {
                const newCookieText = event.messageReply.body;
                const validatedData = isValidCookie(newCookieText);

                if (!validatedData) {
                    return message.reply("❌ 𝗧𝗵𝗲 𝗿𝗲𝗽𝗹𝗶𝗲𝗱 𝘁𝗲𝘅𝘁 𝗶𝘀 𝗻𝗼𝘁 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗝𝗦𝗢𝗡/𝗔𝗽𝗽𝗦𝘁𝗮𝘁𝗲 𝗳𝗼𝗿𝗺𝗮𝘁.");
                }

                // Check against existing file to prevent useless replacement
                let isDuplicate = false;
                if (fs.existsSync(filePath)) {
                    const currentFileContent = fs.readFileSync(filePath, 'utf8');
                    // Minimize both strings to compare content, not spacing
                    if (JSON.stringify(JSON.parse(currentFileContent)) === JSON.stringify(validatedData)) {
                        isDuplicate = true;
                    }
                }

                if (isDuplicate) {
                    return message.reply("⚠️ 𝗡𝗼 𝗰𝗵𝗮𝗻𝗴𝗲𝘀 𝗺𝗮𝗱𝗲.\n𝗧𝗵𝗲 𝗻𝗲𝘄 𝗰𝗼𝗼𝗸𝗶𝗲 𝗶𝘀 𝗲𝘅𝗮𝗰𝘁𝗹𝘆 𝘁𝗵𝗲 𝘀𝗮𝗺𝗲 𝗮𝘀 𝘁𝗵𝗲 𝗰𝘂𝗿𝗿𝗲𝗻𝘁 𝗼𝗻𝗲.");
                }

                // Backup Old File
                if (fs.existsSync(filePath)) {
                    fs.copySync(filePath, backupPath);
                }

                // Write New Data
                const formattedJson = JSON.stringify(validatedData, null, 2);
                await fs.writeFile(filePath, formattedJson, 'utf8');

                return message.reply(`✅ 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 (𝗠𝗮𝗻𝘂𝗮𝗹)!\n\n📊 𝗖𝗼𝗼𝗸𝗶𝗲𝘀: ${validatedData.length}\n📂 𝗦𝗼𝘂𝗿𝗰𝗲: 𝗥𝗲𝗽𝗹𝗶𝗲𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲\n💾 𝗦𝗮𝘃𝗲𝗱 𝘁𝗼: account.txt`);
            }

            // =========================================================
            // SCENARIO 2: NORMAL COMMAND (REFRESH FROM SYSTEM)
            // =========================================================
            
            // Get current AppState from the API
            const appState = api.getAppState(); 

            if (!appState || !Array.isArray(appState) || appState.length === 0) {
                throw new Error("System returned invalid AppState");
            }

            const formattedData = JSON.stringify(appState, null, 2);

            // Duplicate Check (System vs File)
            let isSystemDuplicate = false;
            if (fs.existsSync(filePath)) {
                const currentFileContent = fs.readFileSync(filePath, 'utf8');
                try {
                    if (JSON.stringify(JSON.parse(currentFileContent)) === JSON.stringify(appState)) {
                        isSystemDuplicate = true;
                    }
                } catch (e) {
                    // If file is corrupt, we ignore duplicate check and overwrite
                }
            }

            // Optional: You can choose to NOT reply if it's the same, or just notify.
            // Here we verify writing.
            
            // Backup
            if (fs.existsSync(filePath)) {
                await fs.copy(filePath, backupPath);
            }

            // Write File
            await fs.writeFile(filePath, formattedData, 'utf8');
            
            const stats = await fs.stat(filePath);
            const fileSizeInKB = (stats.size / 1024).toFixed(2);

            let msg = `✅ 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗥𝗲𝗳𝗿𝗲𝘀𝗵𝗲𝗱!\n\n`;
            msg += `📊 𝗖𝗼𝗼𝗸𝗶𝗲𝘀: ${appState.length}\n`;
            msg += `💾 𝗦𝗶𝘇𝗲: ${fileSizeInKB} KB\n`;
            
            if (isSystemDuplicate) {
                msg += `⚠️ 𝗡𝗼𝘁𝗲: 𝗖𝗼𝗻𝘁𝗲𝗻𝘁 𝘄𝗮𝘀 𝗶𝗱𝗲𝗻𝘁𝗶𝗰𝗮𝗹, 𝗯𝘂𝘁 𝗳𝗶𝗹𝗲 𝗶𝘀 𝗿𝗲-𝘀𝘆𝗻𝗰𝗲𝗱.`;
            } else {
                msg += `🔄 𝗦𝘁𝗮𝘁𝘂𝘀: 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝘄𝗶𝘁𝗵 𝗻𝗲𝘄 𝘀𝗲𝘀𝘀𝗶𝗼𝗻 𝗱𝗮𝘁𝗮.`;
            }

            return message.reply(msg);

        } catch (error) {
            console.error("Account Command Error:", error);
            return message.reply(`❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝘂𝗽𝗱𝗮𝘁𝗲 𝗮𝗰𝗰𝗼𝘂𝗻𝘁.\n𝗘𝗿𝗿𝗼𝗿: ${error.message}`);
        }
    }
};
