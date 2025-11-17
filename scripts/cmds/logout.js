module.exports = {
    config: {
        name: "logout",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 0,
        role: 2,
        category: "system",
        shortDescription: {
            en: "𝖡𝗈𝗍 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝗅𝗈𝗀𝗈𝗎𝗍 𝗌𝗒𝗌𝗍𝖾𝗆"
        },
        longDescription: {
            en: "𝖫𝗈𝗀𝗌 𝗈𝗎𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝖿𝗋𝗈𝗆 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄"
        },
        guide: {
            en: "{p}logout"
        },
        envConfig: {
            logoutTimeout: 1500
        }
    },

    onStart: async function({ message, event, envConfig, api, threadsData }) {
        try {
            // Check if user has admin role (role: 2)
            const { senderID } = event;
            
            // Additional security check - only bot owner should be able to logout
            // You can add specific user ID validation here if needed
            // Example: if (senderID !== 'YOUR_FB_USER_ID') return;
            
            console.log(`🔐 𝖫𝗈𝗀𝗈𝗎𝗍 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝖾𝖽 𝖻𝗒 𝗎𝗌𝖾𝗋: ${senderID}`);
            
            // Send initial response
            const loadingMsg = await message.reply("🔒 𝖡𝗈𝗍 𝗂𝗌 𝗅𝗈𝗀𝗀𝗂𝗇𝗀 𝗈𝗎𝗍...\n\n🔄 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝗆𝗈𝗆𝖾𝗇𝗍𝗂𝗅𝗒...");
            
            // Save current state before logout if needed
            try {
                // You can add any pre-logout cleanup here
                console.log("📝 𝖯𝖾𝗋𝖿𝗈𝗋𝗆𝗂𝗇𝗀 𝗉𝗋𝖾-𝗅𝗈𝗀𝗈𝗎𝗍 𝖼𝗅𝖾𝖺𝗇𝗎𝗉...");
                
                // Example: Save current session state or important data
                if (global.data && global.data.threadData) {
                    console.log("💾 𝖲𝖺𝗏𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺 𝗌𝗍𝖺𝗍𝖾...");
                }
                
            } catch (cleanupError) {
                console.warn("⚠️ 𝖯𝗋𝖾-𝗅𝗈𝗀𝗈𝗎𝗍 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError);
                // Continue with logout despite cleanup errors
            }

            // Set timeout for logout with error handling
            const logoutTimeout = envConfig.logoutTimeout || 1500;
            
            setTimeout(async () => {
                try {
                    console.log("🚪 𝖠𝗍𝗍𝖾𝗆𝗉𝗍𝗂𝗇𝗀 𝗍𝗈 𝗅𝗈𝗀𝗈𝗎𝗍...");
                    
                    // Perform logout
                    await api.logout();
                    
                    console.log('✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗅𝗈𝗀𝗀𝖾𝖽 𝗈𝗎𝗍');
                    
                    // Update loading message if possible (though API may be disconnected)
                    try {
                        await message.unsend(loadingMsg.messageID);
                    } catch (unsendError) {
                        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                    
                } catch (logoutError) {
                    console.error('❌ 𝖫𝗈𝗀𝗈𝗎𝗍 𝖾𝗋𝗋𝗈𝗋:', logoutError);
                    
                    // Try to send error message if logout failed
                    try {
                        await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝗀𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝗆𝖺𝗇𝗎𝖺𝗅𝗅𝗒.");
                    } catch (messageError) {
                        console.error("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", messageError);
                    }
                }
            }, logoutTimeout);

        } catch (error) {
            console.error('💥 𝖫𝗈𝗀𝗈𝗎𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:', error);
            
            // Send error message only if API is still available
            try {
                await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝖽𝗎𝗋𝗂𝗇𝗀 𝗅𝗈𝗀𝗈𝗎𝗍 𝗉𝗋𝗈𝖼𝖾𝗌𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            } catch (messageError) {
                // Silent fail if we can't send messages
            }
        }
    },
    
    // Optional: Add event handlers for graceful shutdown
    onShutdown: async function() {
        try {
            console.log("🔒 𝖯𝗋𝖾𝗉𝖺𝗋𝗂𝗇𝗀 𝖿𝗈𝗋 𝗌𝗁𝗎𝗍𝖽𝗈𝗐𝗇...");
            // Perform any cleanup before bot stops
        } catch (error) {
            console.error("𝖲𝗁𝗎𝗍𝖽𝗈𝗐𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
