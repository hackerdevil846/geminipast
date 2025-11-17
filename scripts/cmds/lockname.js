const OWNER_UID = "61571630409265";

module.exports = {
    config: {
        name: "lockname",
        aliases: [],
        version: "1.0.1",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 3,
        role: 2,
        category: "group",
        shortDescription: {
            en: "🔒 𝖦𝗋𝗈𝗎𝗉 𝖭𝖺𝗆𝖾 𝖫𝗈𝖼𝗄 𝖲𝗒𝗌𝗍𝖾𝗆"
        },
        longDescription: {
            en: "𝖫𝗈𝖼𝗄 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗍𝗈 𝗉𝗋𝖾𝗏𝖾𝗇𝗍 𝗎𝗇𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝖼𝗁𝖺𝗇𝗀𝖾𝗌"
        },
        guide: {
            en: "{p}lockname [𝗅𝗈𝖼𝗄/𝗎𝗇𝗅𝗈𝖼𝗄/𝗋𝖾𝗌𝖾𝗍] [𝗇𝖺𝗆𝖾]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    lockedGroups: new Map(),

    onLoad: function() {
        console.log('🔒 𝖫𝗈𝖼𝗄𝗇𝖺𝗆𝖾 𝖬𝗈𝖽𝗎𝗅𝖾 𝖫𝗈𝖺𝖽𝖾𝖽 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒');
    },

    handleEvent: async function({ event, api }) {
        try {
            if (event.type === "event" && event.logMessageType === "log:thread-name") {
                const { threadID, logMessageData } = event;
                
                if (this.lockedGroups.has(threadID)) {
                    const lockedName = this.lockedGroups.get(threadID);
                    
                    // Check if the new name is different from locked name
                    if (logMessageData.name !== lockedName) {
                        console.log(`🛡️ 𝖣𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝗇𝖺𝗆𝖾 𝖼𝗁𝖺𝗇𝗀𝖾 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 ${threadID}, 𝗋𝖾𝗌𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗈 𝗅𝗈𝖼𝗄𝖾𝖽 𝗇𝖺𝗆𝖾...`);
                        
                        try {
                            await api.setTitle(lockedName, threadID);
                            console.log(`✅ 𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗋𝖾𝗌𝖾𝗍 𝗍𝗈: ${lockedName}`);
                            
                            await api.sendMessage(
                                `⚠️ 𝖭𝖺𝗆𝖾 𝖠𝗎𝗍𝗈-𝖱𝖾𝗌𝖾𝗍!\n𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝖾𝗍 𝗍𝗈: ${lockedName}`,
                                threadID
                            );
                        } catch (resetError) {
                            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗌𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾:`, resetError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("💥 𝖤𝗏𝖾𝗇𝗍 𝖧𝖺𝗇𝖽𝗅𝖾𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ api, event, args, message }) {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs-extra");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const { threadID, senderID } = event;
            
            // Owner validation
            if (senderID !== OWNER_UID) {
                return message.reply("⛔ 𝖠𝖼𝖼𝖾𝗌𝗌 𝖣𝖾𝗇𝗂𝖾𝖽!\n𝖮𝗇𝗅𝗒 𝖻𝗈𝗍 𝗈𝗐𝗇𝖾𝗋 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽!");
            }

            const action = args[0]?.toLowerCase();
            const name = args.slice(1).join(" ");

            if (!action) {
                return message.reply(
                    "🔧 𝖴𝗌𝖺𝗀𝖾 𝖦𝗎𝗂𝖽𝖾:\n\n" +
                    "• lockname 𝗅𝗈𝖼𝗄 [𝗇𝖺𝗆𝖾]\n" +
                    "• lockname 𝗎𝗇𝗅𝗈𝖼𝗄\n" +
                    "• lockname 𝗋𝖾𝗌𝖾𝗍"
                );
            }

            // Validate thread is a group
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                if (!threadInfo.isGroup) {
                    return message.reply("❌ 𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖼𝖺𝗇 𝗈𝗇𝗅𝗒 𝖻𝖾 𝗎𝗌𝖾𝖽 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉𝗌!");
                }
            } catch (threadError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.");
            }

            switch (action) {
                case "lock":
                    if (!name || name.trim().length === 0) {
                        return message.reply("📛 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗍𝗈 𝗅𝗈𝖼𝗄!");
                    }

                    if (name.length > 200) {
                        return message.reply("❌ 𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 200 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 𝖺𝗅𝗅𝗈𝗐𝖾𝖽.");
                    }

                    try {
                        // Set the group name first
                        await api.setTitle(name.trim(), threadID);
                        
                        // Store in locked groups map
                        this.lockedGroups.set(threadID, name.trim());
                        
                        console.log(`✅ 𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗅𝗈𝖼𝗄𝖾𝖽 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}: ${name.trim()}`);
                        
                        await message.reply(
                            `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖫𝗈𝖼𝗄𝖾𝖽\n𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗅𝗈𝖼𝗄𝖾𝖽 𝖺𝗌: ${name.trim()}`
                        );
                    } catch (setError) {
                        console.error("𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗍𝗍𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾:", setError);
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                    }
                    break;

                case "unlock":
                    if (!this.lockedGroups.has(threadID)) {
                        return message.reply("🔓 𝖠𝗅𝗋𝖾𝖺𝖽𝗒 𝖴𝗇𝗅𝗈𝖼𝗄𝖾𝖽!\n𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗂𝗌 𝗇𝗈𝗍 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗅𝗈𝖼𝗄𝖾𝖽.");
                    }
                    
                    const previousName = this.lockedGroups.get(threadID);
                    this.lockedGroups.delete(threadID);
                    
                    console.log(`🔓 𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗎𝗇𝗅𝗈𝖼𝗄𝖾𝖽 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
                    
                    await message.reply(
                        "✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖴𝗇𝗅𝗈𝖼𝗄𝖾𝖽\n𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗅𝗈𝖼𝗄 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗋𝖾𝗆𝗈𝗏𝖾𝖽."
                    );
                    break;

                case "reset":
                    if (!this.lockedGroups.has(threadID)) {
                        return message.reply("⚠️ 𝖭𝗈 𝖫𝗈𝖼𝗄 𝖥𝗈𝗎𝗇𝖽!\n𝖭𝗈 𝗅𝗈𝖼𝗄𝖾𝖽 𝗇𝖺𝗆𝖾 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉.");
                    }
                    
                    const lockedName = this.lockedGroups.get(threadID);
                    
                    try {
                        await api.setTitle(lockedName, threadID);
                        console.log(`🔁 𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗋𝖾𝗌𝖾𝗍 𝗍𝗈 𝗅𝗈𝖼𝗄𝖾𝖽 𝗇𝖺𝗆𝖾: ${lockedName}`);
                        
                        await message.reply(
                            `🔁 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖱𝖾𝗌𝖾𝗍\n𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝗋𝖾𝗌𝖾𝗍 𝗍𝗈: ${lockedName}`
                        );
                    } catch (resetError) {
                        console.error("𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝗌𝖾𝗍𝗍𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾:", resetError);
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗌𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                    }
                    break;

                default:
                    await message.reply(
                        "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖠𝖼𝗍𝗂𝗈𝗇!\n𝖴𝗌𝖾: lockname [𝗅𝗈𝖼𝗄/𝗎𝗇𝗅𝗈𝖼𝗄/𝗋𝖾𝗌𝖾𝗍]"
                    );
            }
        } catch (error) {
            console.error("💥 𝖫𝗈𝖼𝗄𝗇𝖺𝗆𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            } else if (error.message.includes('title')) {
                errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾. 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
