module.exports = {
    config: {
        name: "busy",
        aliases: [],
        version: "1.6",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖳𝗎𝗋𝗇 𝗈𝗇/𝗈𝖿𝖿 𝖽𝗈 𝗇𝗈𝗍 𝖽𝗂𝗌𝗍𝗎𝗋𝖻 𝗆𝗈𝖽𝖾"
        },
        longDescription: {
            en: "𝖳𝗎𝗋𝗇 𝗈𝗇/𝗈𝖿𝖿 𝖽𝗈 𝗇𝗈𝗍 𝖽𝗂𝗌𝗍𝗎𝗋𝖻 (𝖻𝗎𝗌𝗒) 𝗆𝗈𝖽𝖾. 𝖶𝗁𝖾𝗇 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝖺𝗀𝗌 𝗒𝗈𝗎, 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗐𝗂𝗅𝗅 𝗂𝗇𝖿𝗈𝗋𝗆 𝗍𝗁𝖾𝗆 𝗒𝗈𝗎'𝗋𝖾 𝖻𝗎𝗌𝗒."
        },
        guide: {
            en: "{p}busy\n{p}busy [𝗋𝖾𝖺𝗌𝗈𝗇]\n{p}busy 𝗈𝖿𝖿"
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            const { senderID } = event;

            // Validate usersData availability
            if (!usersData) {
                return message.reply("❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.");
            }

            if (args.length && args[0].toLowerCase() === "off") {
                try {
                    await usersData.set(senderID, {
                        data: { busy: false }
                    });
                    console.log(`✅ 𝖡𝗎𝗌𝗒 𝗆𝗈𝖽𝖾 𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${senderID}`);
                    return message.reply("✅ | 𝖣𝗈 𝗇𝗈𝗍 𝖽𝗂𝗌𝗍𝗎𝗋𝖻 𝗆𝗈𝖽𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗍𝗎𝗋𝗇𝖾𝖽 𝗈𝖿𝖿.");
                } catch (setError) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗂𝗌𝖺𝖻𝗅𝗂𝗇𝗀 𝖻𝗎𝗌𝗒 𝗆𝗈𝖽𝖾:", setError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗍𝗎𝗋𝗇 𝗈𝖿𝖿 𝖻𝗎𝗌𝗒 𝗆𝗈𝖽𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }
            }

            const reason = args.length ? args.join(" ").trim() : "";
            
            // Validate reason length
            if (reason.length > 200) {
                return message.reply("❌ 𝖱𝖾𝖺𝗌𝗈𝗇 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 200 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }
            
            try {
                await usersData.set(senderID, {
                    data: { 
                        busy: true,
                        busyReason: reason || "𝖡𝗎𝗌𝗒" 
                    }
                });
                console.log(`✅ 𝖡𝗎𝗌𝗒 𝗆𝗈𝖽𝖾 𝖾𝗇𝖺𝖻𝗅𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${senderID} 𝗐𝗂𝗍𝗁 𝗋𝖾𝖺𝗌𝗈𝗇: ${reason || "𝖡𝗎𝗌𝗒"}`);
                
                const responseMessage = reason 
                    ? `✅ | 𝖣𝗈 𝗇𝗈𝗍 𝖽𝗂𝗌𝗍𝗎𝗋𝖻 𝗆𝗈𝖽𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗍𝗎𝗋𝗇𝖾𝖽 𝗈𝗇 𝗐𝗂𝗍𝗁 𝗋𝖾𝖺𝗌𝗈𝗇: ${reason}`
                    : "✅ | 𝖣𝗈 𝗇𝗈𝗍 𝖽𝗂𝗌𝗍𝗎𝗋𝖻 𝗆𝗈𝖽𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗍𝗎𝗋𝗇𝖾𝖽 𝗈𝗇.";

                return message.reply(responseMessage);
            } catch (setError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖾𝗇𝖺𝖻𝗅𝗂𝗇𝗀 𝖻𝗎𝗌𝗒 𝗆𝗈𝖽𝖾:", setError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗍𝗎𝗋𝗇 𝗈𝗇 𝖻𝗎𝗌𝗒 𝗆𝗈𝖽𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

        } catch (error) {
            console.error("💥 𝖡𝗎𝗌𝗒 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            return message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    },

    onChat: async function({ event, message, usersData }) {
        try {
            const { threadID, senderID, mentions } = event;

            // Validate required parameters
            if (!mentions || Object.keys(mentions).length === 0) {
                return;
            }

            // Don't process if bot mentioned itself
            const botID = global?.api?.getCurrentUserID?.();
            if (botID && mentions[botID]) {
                return;
            }

            // Process each mentioned user
            for (const userID of Object.keys(mentions)) {
                try {
                    // Skip if user mentioned themselves
                    if (userID === senderID) {
                        continue;
                    }

                    const userData = await usersData.get(userID);
                    
                    if (userData && userData.data && userData.data.busy) {
                        const userName = mentions[userID] || "𝖴𝗌𝖾𝗋";
                        const reason = userData.data.busyReason || "𝖡𝗎𝗌𝗒";
                        
                        const busyMessage = `⚠️ | ${userName} 𝗂𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝖻𝗎𝗌𝗒. 𝖱𝖾𝖺𝗌𝗈𝗇: ${reason}`;
                        
                        await message.reply(busyMessage);
                        console.log(`ℹ️ 𝖭𝗈𝗍𝗂𝖿𝗂𝖾𝖽 𝗍𝗁𝖺𝗍 ${userName} 𝗂𝗌 𝖻𝗎𝗌𝗒: ${reason}`);
                        
                        // Only notify for the first busy user found
                        break;
                    }
                } catch (userError) {
                    console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 ${userID}:`, userError.message);
                    continue;
                }
            }
        } catch (error) {
            console.error("💥 𝖡𝗎𝗌𝗒 𝗆𝗈𝖽𝖾 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
