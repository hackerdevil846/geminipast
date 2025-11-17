const fs = require("fs-extra");
const path = require("path");

// Store antiout settings globally
const antioutSettings = new Map();

module.exports = {
    config: {
        name: "antiout",
        aliases: [],
        version: "6.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "Smart antiout with persistent settings"
        },
        longDescription: {
            en: "Prevents users from leaving the group with persistent settings that survive bot restarts."
        },
        category: "group",
        guide: {
            en: "{p}antiout [on | off]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    // 🟢 When bot starts, load previous settings (don't force enable)
    onLoad: async function({ threadsData }) {
        try {
            console.log("🔄 Loading previous antiout settings...");
            
            const allThreads = await threadsData.getAll();
            let loadedCount = 0;
            let enabledCount = 0;

            for (const thread of allThreads) {
                try {
                    if (thread && thread.id) {
                        // Load previous setting instead of forcing to true
                        const previousSetting = await threadsData.get(thread.id, "settings.antiout");
                        
                        // If no previous setting exists, default to true (enable)
                        const finalSetting = previousSetting !== undefined ? previousSetting : true;
                        
                        antioutSettings.set(thread.id, finalSetting);
                        
                        if (finalSetting) {
                            enabledCount++;
                            console.log(`✅ Antiout enabled for group: ${thread.id} (previous setting)`);
                        } else {
                            console.log(`❌ Antiout disabled for group: ${thread.id} (previous setting)`);
                        }
                        loadedCount++;
                    }
                } catch (error) {
                    console.error(`❌ Failed to load antiout setting for thread ${thread?.id}:`, error.message);
                }
            }
            console.log(`📊 Antiout settings loaded: ${loadedCount} groups, ${enabledCount} enabled`);
        } catch (error) {
            console.error("❌ Error loading antiout settings:", error);
        }
    },

    onStart: async function({ message, event, args, threadsData, api }) {
        try {
            const { threadID } = event;

            // Manual control option
            if (args[0]) {
                const action = args[0].toLowerCase().trim();
                
                if (action === 'off') {
                    await threadsData.set(threadID, false, "settings.antiout");
                    antioutSettings.set(threadID, false);
                    return message.reply("❌ Antiout has been disabled for this group. This setting will persist after bot restart.");
                }
                else if (action === 'on') {
                    await threadsData.set(threadID, true, "settings.antiout");
                    antioutSettings.set(threadID, true);
                    return message.reply("✅ Antiout has been enabled for this group. This setting will persist after bot restart.");
                }
            }

            // Get current status
            const isEnabled = antioutSettings.has(threadID) ? antioutSettings.get(threadID) : true;
            const status = isEnabled ? "✅ Enabled" : "❌ Disabled";
            
            return message.reply(
                `🔒 Antiout Status: ${status}\n\n` +
                "Usage:\n" +
                "• {p}antiout on - Enable anti-leave (persistent)\n" +
                "• {p}antiout off - Disable anti-leave (persistent)\n" +
                "\nNote: Settings are saved and will remain after bot restart."
            );

        } catch (error) {
            console.error("💥 Antiout command error:", error);
            await message.reply("❌ An error occurred. Please try again later.");
        }
    },

    // ⚡ Main event listener
    onEvent: async function({ api, event, threadsData }) {
        try {
            // Only run when someone leaves group
            if (event.logMessageType !== "log:unsubscribe") return;

            const { threadID, logMessageData } = event;
            if (!logMessageData || !logMessageData.leftParticipantFbId) return;

            const userId = logMessageData.leftParticipantFbId;
            const botID = api.getCurrentUserID();

            // Skip if bot itself left
            if (userId === botID) return;

            // Check if antiout is enabled for this thread
            let antioutEnabled = antioutSettings.get(threadID);
            if (antioutEnabled === undefined) {
                // If not in cache, load from database
                antioutEnabled = await threadsData.get(threadID, "settings.antiout");
                // If no setting exists, default to true
                if (antioutEnabled === undefined) antioutEnabled = true;
                antioutSettings.set(threadID, antioutEnabled);
            }
            
            // If antiout is disabled, don't proceed
            if (!antioutEnabled) {
                console.log(`⏩ Antiout disabled for group ${threadID}, skipping...`);
                return;
            }

            // Get user name
            let userName = "এই আবাল";
            try {
                const userInfo = await api.getUserInfo(userId);
                userName = userInfo[userId]?.name || "এই আবাল";
            } catch (e) {
                console.warn("⚠️ Couldn't fetch user name:", e.message);
            }

            console.log(`🚫 User ${userName} left group ${threadID}, attempting to add back...`);

            // Small delay before processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Always try to add back regardless of permissions
            try {
                // Try to add user back directly
                await api.addUserToGroup(userId, threadID);
                console.log(`✅ Successfully added back ${userName} to group ${threadID}`);

                // Send success message
                await api.sendMessage(
                    `শোন, ${userName} এই গ্রুপ হইলো গ্যাং! 🔥\n` +
                    `এখান থেকে যাইতে হইলে এডমিনের ক্লিয়ারেন্স লাগে!\n` +
                    `তুই পারমিশন ছাড়া লিভ নিছোস – তোকে আবার মাফিয়া স্টাইলে এড দিলাম। 🔫`,
                    threadID
                );

            } catch (addError) {
                console.log(`❌ Failed to add ${userName}: ${addError.message}`);
                
                // Get thread info to understand why it failed
                try {
                    const threadInfo = await api.getThreadInfo(threadID);
                    const isBotAdmin = threadInfo.adminIDs?.some(a => a.id === botID);
                    
                    if (isBotAdmin) {
                        // Bot is admin but still failed - send error message
                        await api.sendMessage(
                            `সরি বস ${userName} এই আবালরে এড করতে পারলাম না😞`,
                            threadID
                        );
                    }
                    // If bot is not admin, stay silent (no message)
                    
                } catch (infoError) {
                    console.log("⚠️ Could not get thread info:", infoError.message);
                    // Stay silent if we can't get thread info
                }
            }

        } catch (error) {
            console.error("💥 Antiout event handler error:", error);
        }
    },

    // 🔄 Auto-enable antiout when bot joins new group (default behavior)
    handleBotJoin: async function({ threadID, threadsData }) {
        try {
            // Set to true by default for new groups
            await threadsData.set(threadID, true, "settings.antiout");
            antioutSettings.set(threadID, true);
            console.log(`✅ Antiout auto-enabled for new group: ${threadID}`);
        } catch (error) {
            console.error("❌ Error auto-enabling antiout for new group:", error);
        }
    }
};
