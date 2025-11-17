const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "locknick",
        aliases: [],
        version: "2.3.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 2,
        category: "group",
        shortDescription: {
            en: "🔒 𝖫𝗈𝖼𝗄/𝗎𝗇𝗅𝗈𝖼𝗄 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌' 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾𝗌"
        },
        longDescription: {
            en: "𝖫𝗈𝖼𝗄 𝗈𝗋 𝗎𝗇𝗅𝗈𝖼𝗄 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌' 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾𝗌 𝗍𝗈 𝗉𝗋𝖾𝗏𝖾𝗇𝗍 𝖼𝗁𝖺𝗇𝗀𝖾𝗌"
        },
        guide: {
            en: "{p}locknick [𝗈𝗇/𝗈𝖿𝖿]"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function ({ api, event, args, message }) {
        try {
            // Dependency check
            let fsAvailable = true;
            let pathAvailable = true;
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                fsAvailable = false;
                pathAvailable = false;
            }

            if (!fsAvailable || !pathAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const OWNER_UID = "61571630409265";
            const NICKNAME_LOCK_FILE = path.join(__dirname, "../data/locked_nicknames.json");
            const { threadID, senderID } = event;

            // Enhanced data loading with error handling
            const loadData = () => {
                try {
                    if (!fs.existsSync(NICKNAME_LOCK_FILE)) {
                        console.log("📁 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗇𝖾𝗐 𝗅𝗈𝖼𝗄 𝖿𝗂𝗅𝖾");
                        return {};
                    }
                    
                    const fileContent = fs.readFileSync(NICKNAME_LOCK_FILE, "utf8");
                    if (!fileContent.trim()) {
                        console.log("📄 𝖥𝗂𝗅𝖾 𝖾𝗆𝗉𝗍𝗒, 𝗋𝖾𝗍𝗎𝗋𝗇𝗂𝗇𝗀 𝖾𝗆𝗉𝗍𝗒 𝗈𝖻𝗃𝖾𝖼𝗍");
                        return {};
                    }
                    
                    const data = JSON.parse(fileContent);
                    return typeof data === 'object' ? data : {};
                } catch (error) {
                    console.error("❌ 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", error);
                    return {};
                }
            };

            // Enhanced data saving with error handling
            const saveData = (data) => {
                try {
                    // Ensure directory exists
                    const dirPath = path.dirname(NICKNAME_LOCK_FILE);
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath, { recursive: true });
                    }
                    
                    // Validate data
                    if (typeof data !== 'object') {
                        throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖽𝖺𝗍𝖺 𝗍𝗒𝗉𝖾");
                    }
                    
                    fs.writeFileSync(NICKNAME_LOCK_FILE, JSON.stringify(data, null, 4));
                    console.log("💾 𝖣𝖺𝗍𝖺 𝗌𝖺𝗏𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                    return true;
                } catch (error) {
                    console.error("❌ 𝖲𝖺𝗏𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", error);
                    return false;
                }
            };

            // Permission check
            if (senderID !== OWNER_UID) {
                return message.reply("⛔️ 𝖮𝗇𝗅𝗒 𝖻𝗈𝗍 𝗈𝗐𝗇𝖾𝗋 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽!");
            }

            // Validate arguments
            if (!args[0]) {
                return message.reply(
                    "🔧 𝖴𝗌𝖺𝗀𝖾: {p}locknick [𝗈𝗇/𝗈𝖿𝖿]\n\n" +
                    "✦ 𝗈𝗇: 𝖫𝗈𝖼𝗄 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾𝗌\n" +
                    "✦ 𝗈𝖿𝖿: 𝖴𝗇𝗅𝗈𝖼𝗄 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾𝗌"
                );
            }

            const action = args[0].toLowerCase().trim();
            
            if (action !== 'on' && action !== 'off') {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗉𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 '𝗈𝗇' 𝗈𝗋 '𝗈𝖿𝖿'");
            }

            const lockedData = loadData();

            switch (action) {
                case "on":
                    if (lockedData[threadID]) {
                        return message.reply("🔐 𝖠𝗅𝗋𝖾𝖺𝖽𝗒 𝗅𝗈𝖼𝗄𝖾𝖽 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉!");
                    }

                    try {
                        console.log(`🔍 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈 𝖿𝗈𝗋 ${threadID}`);
                        const threadInfo = await api.getThreadInfo(threadID);
                        const botID = api.getCurrentUserID();
                        const nicknamesMap = {};
                        
                        let lockedCount = 0;
                        threadInfo.userInfo.forEach(user => {
                            if (user.id !== botID) {
                                nicknamesMap[user.id] = user.nickname || "";
                                lockedCount++;
                            }
                        });

                        lockedData[threadID] = {
                            nicknames: nicknamesMap,
                            timestamp: Date.now(),
                            memberCount: lockedCount
                        };
                        
                        if (saveData(lockedData)) {
                            console.log(`✅ 𝖫𝗈𝖼𝗄𝖾𝖽 ${lockedCount} 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾𝗌 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 ${threadID}`);
                            message.reply(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗅𝗈𝖼𝗄𝖾𝖽 ${lockedCount} 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾𝗌!`);
                        } else {
                            message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗅𝗈𝖼𝗄 𝖽𝖺𝗍𝖺!");
                        }
                    } catch (error) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈:", error);
                        message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇!");
                    }
                    break;

                case "off":
                    if (!lockedData[threadID]) {
                        return message.reply("🔓 𝖭𝗈 𝗅𝗈𝖼𝗄𝖾𝖽 𝖽𝖺𝗍𝖺 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉!");
                    }

                    const memberCount = lockedData[threadID].memberCount || 0;
                    delete lockedData[threadID];
                    
                    if (saveData(lockedData)) {
                        console.log(`🔓 𝖴𝗇𝗅𝗈𝖼𝗄𝖾𝖽 ${memberCount} 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾𝗌 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 ${threadID}`);
                        message.reply(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗎𝗇𝗅𝗈𝖼𝗄𝖾𝖽 ${memberCount} 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾𝗌!`);
                    } else {
                        message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗎𝗇𝗅𝗈𝖼𝗄 𝖽𝖺𝗍𝖺!");
                    }
                    break;
            }

        } catch (error) {
            console.error("💥 𝖫𝗈𝖼𝗄𝗇𝗂𝖼𝗄 𝖤𝗋𝗋𝗈𝗋:", error);
            // Silent fail to avoid spam
        }
    },

    onEvent: async function({ event, api }) {
        try {
            // Only process nickname change events
            if (event.logMessageType !== "log:user-nickname") {
                return;
            }

            const { threadID, logMessageData } = event;
            const NICKNAME_LOCK_FILE = path.join(__dirname, "../data/locked_nicknames.json");

            // Load locked data
            let lockedData = {};
            try {
                if (fs.existsSync(NICKNAME_LOCK_FILE)) {
                    const fileContent = fs.readFileSync(NICKNAME_LOCK_FILE, "utf8");
                    lockedData = JSON.parse(fileContent);
                }
            } catch (error) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗅𝗈𝖼𝗄𝖾𝖽 𝖽𝖺𝗍𝖺:", error);
                return;
            }

            const threadData = lockedData[threadID];
            if (!threadData || !threadData.nicknames) {
                return;
            }

            const { participant_id, nickname } = logMessageData;
            const originalNickname = threadData.nicknames[participant_id];

            // If user has a locked nickname and changed it, revert it
            if (originalNickname !== undefined && nickname !== originalNickname) {
                try {
                    console.log(`🔄 𝖱𝖾𝗏𝖾𝗋𝗍𝗂𝗇𝗀 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${participant_id}`);
                    
                    await api.changeNickname(
                        originalNickname || "", // Empty string removes nickname
                        threadID,
                        participant_id
                    );
                    
                    console.log(`✅ 𝖭𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝗋𝖾𝗏𝖾𝗋𝗍𝖾𝖽 𝗍𝗈: "${originalNickname}"`);
                    
                    // Send warning message
                    await api.sendMessage(
                        `⚠️ 𝖭𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝖫𝗈𝖼𝗄 𝖲𝗒𝗌𝗍𝖾𝗆\n\n` +
                        `𝖸𝗈𝗎𝗋 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗋𝖾𝗏𝖾𝗋𝗍𝖾𝖽 𝗍𝗈 𝗍𝗁𝖾 𝗅𝗈𝖼𝗄𝖾𝖽 𝗏𝖺𝗅𝗎𝖾.\n` +
                        `🔒 𝖭𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝗅𝗈𝖼𝗄 𝗂𝗌 𝖺𝖼𝗍𝗂𝗏𝖾 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉.`,
                        threadID
                    );
                    
                } catch (revertError) {
                    console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗏𝖾𝗋𝗍 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾:`, revertError);
                }
            }
        } catch (error) {
            console.error("💥 𝖫𝗈𝖼𝗄𝗇𝗂𝖼𝗄 𝖾𝗏𝖾𝗇𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
