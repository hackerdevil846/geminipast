const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "checktt",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖨𝗇𝗍𝖾𝗋𝖺𝖼𝗍𝗂𝗏𝖾 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖼𝗈𝗎𝗇𝗍𝖾𝗋 & 𝗋𝖺𝗇𝗄 𝖼𝗁𝖾𝖼𝗄𝖾𝗋"
        },
        longDescription: {
            en: "𝖳𝗋𝖺𝖼𝗄𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖼𝗈𝗎𝗇𝗍𝗌 𝖺𝗇𝖽 𝗋𝖺𝗇𝗄𝗌 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋𝗌 𝗂𝗇 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍"
        },
        guide: {
            en: "{p}checktt [𝖺𝗅𝗅/𝗋𝖺𝗇𝗄/@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onLoad: () => {
        try {
            const directoryPath = __dirname + '/count-by-thread/';
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
                console.log(`✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒: ${directoryPath}`);
            }
        } catch (error) {
            console.error("💥 𝖢𝗁𝖾𝖼𝗄𝗍𝗍 𝖮𝗇𝖫𝗈𝖺𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onChat: async function ({ event, api }) {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs-extra");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) return;

            const directoryPath = __dirname + '/count-by-thread/';
            const { threadID, senderID } = event;

            if (!global.data.allThreadID || !global.data.allThreadID.includes(threadID)) return;

            const threadPath = directoryPath + threadID + ".json";
            
            try {
                // Ensure directory exists
                if (!fs.existsSync(directoryPath)) {
                    fs.mkdirSync(directoryPath, { recursive: true });
                }

                let threadData = {};
                if (fs.existsSync(threadPath)) {
                    try {
                        const fileContent = fs.readFileSync(threadPath, 'utf8');
                        threadData = JSON.parse(fileContent) || {};
                    } catch (parseError) {
                        console.error(`❌ 𝖯𝖺𝗋𝗌𝖾 𝖾𝗋𝗋𝗈𝗋 𝖿𝗈𝗋 ${threadPath}:`, parseError);
                        threadData = {};
                    }
                }

                if (typeof threadData !== 'object') threadData = {};
                if (!threadData[senderID]) threadData[senderID] = 0;
                threadData[senderID]++;
                
                fs.writeFileSync(threadPath, JSON.stringify(threadData, null, 4));

            } catch (fileError) {
                console.error(`❌ 𝖥𝗂𝗅𝖾 𝗈𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋 𝖿𝗈𝗋 ${threadPath}:`, fileError);
            }

        } catch (error) {
            console.error("💥 𝖢𝗁𝖾𝖼𝗄𝗍𝗍 𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function ({ api, event, args, message }) {
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

            const directoryPath = __dirname + '/count-by-thread/';
            const { threadID, senderID, mentions } = event;

            const rankNames = {
                "Copper I": "🟫 𝖢𝗈𝗉𝗉𝖾𝗋 𝖨",
                "Copper II": "🟫 𝖢𝗈𝗉𝗉𝖾𝗋 𝖨𝖨",
                "Copper III": "🟫 𝖢𝗈𝗉𝗉𝖾𝗋 𝖨𝖨𝖨",
                "Silver I": "⚪ 𝖲𝗂𝗅𝗏𝖾𝗋 𝖨",
                "Silver II": "⚪ 𝖲𝗂𝗅𝗏𝖾𝗋 𝖨𝖨",
                "Silver III": "⚪ 𝖲𝗂𝗅𝗏𝖾𝗋 𝖨𝖨𝖨",
                "Gold I": "🟡 𝖦𝗈𝗅𝖽 𝖨",
                "Gold II": "🟡 𝖦𝗈𝗅𝖽 𝖨𝖨",
                "Gold III": "🟡 𝖦𝗈𝗅𝖽 𝖨𝖨𝖨",
                "Gold IV": "🟡 𝖦𝗈𝗅𝖽 𝖨𝖵",
                "Platinum I": "🔵 𝖯𝗅𝖺𝗍𝗂𝗇𝗎𝗆 𝖨",
                "Platinum II": "🔵 𝖯𝗅𝖺𝗍𝗂𝗇𝗎𝗆 𝖨𝖨",
                "Platinum III": "🔵 𝖯𝗅𝖺𝗍𝗂𝗇𝗎𝗆 𝖨𝖨𝖨",
                "Platinum IV": "🔵 𝖯𝗅𝖺𝗍𝗂𝗇𝗎𝗆 𝖨𝖵",
                "Diamond I": "💎 𝖣𝗂𝖺𝗆𝗈𝗇𝖽 𝖨",
                "Diamond II": "💎 𝖣𝗂𝖺𝗆𝗈𝗇𝖽 𝖨𝖨",
                "Diamond III": "💎 𝖣𝗂𝖺𝗆𝗈𝗇𝖽 𝖨𝖨𝖨",
                "Diamond IV": "💎 𝖣𝗂𝖺𝗆𝗈𝗇𝖽 𝖨𝖵",
                "Diamond V": "💎 𝖣𝗂𝖺𝗆𝗈𝗇𝖽 𝖵",
                "Elite I": "🏅 𝖤𝗅𝗂𝗍𝖾 𝖨",
                "Elite II": "🏅 𝖤𝗅𝗂𝗍𝖾 𝖨𝖨",
                "Elite III": "🏅 𝖤𝗅𝗂𝗍𝖾 𝖨𝖨𝖨",
                "Elite IV": "🏅 𝖤𝗅𝗂𝗍𝖾 𝖨𝖵",
                "Elite V": "🏅 𝖤𝗅𝗂𝗍𝖾 𝖵",
                "Master": "🏆 𝖬𝖺𝗌𝗍𝖾𝗋",
                "War Generals": "⚔️ 𝖶𝖺𝗋 𝖦𝖾𝗇𝖾𝗋𝖺𝗅𝗌"
            };

            const getRankName = count => {
                return count > 50000 ? rankNames["War Generals"]
                    : count > 9000 ? rankNames["Master"]
                    : count > 8000 ? rankNames["Elite V"]
                    : count > 6100 ? rankNames["Elite IV"]
                    : count > 5900 ? rankNames["Elite III"]
                    : count > 5700 ? rankNames["Elite II"]
                    : count > 5200 ? rankNames["Elite I"]
                    : count > 5000 ? rankNames["Diamond V"]
                    : count > 4800 ? rankNames["Diamond IV"]
                    : count > 4500 ? rankNames["Diamond III"]
                    : count > 4000 ? rankNames["Diamond II"]
                    : count > 3800 ? rankNames["Diamond I"]
                    : count > 3500 ? rankNames["Platinum IV"]
                    : count > 3200 ? rankNames["Platinum III"]
                    : count > 3000 ? rankNames["Platinum II"]
                    : count > 2900 ? rankNames["Platinum I"]
                    : count > 2500 ? rankNames["Gold IV"]
                    : count > 2300 ? rankNames["Gold III"]
                    : count > 2000 ? rankNames["Gold II"]
                    : count > 1500 ? rankNames["Gold I"]
                    : count > 1200 ? rankNames["Silver III"]
                    : count > 1000 ? rankNames["Silver II"]
                    : count > 900 ? rankNames["Silver I"]
                    : count > 500 ? rankNames["Copper III"]
                    : count > 100 ? rankNames["Copper II"]
                    : rankNames["Copper I"];
            };

            const threadPath = directoryPath + threadID + ".json";
            let threadData = {};

            try {
                if (fs.existsSync(threadPath)) {
                    const fileContent = fs.readFileSync(threadPath, 'utf8');
                    threadData = JSON.parse(fileContent) || {};
                } else {
                    fs.writeFileSync(threadPath, JSON.stringify({}, null, 4));
                }
            } catch (fileError) {
                console.error(`❌ 𝖥𝗂𝗅𝖾 𝗈𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:`, fileError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖽𝖺𝗍𝖺.");
            }

            if (!threadData[senderID]) threadData[senderID] = 1;

            const query = args[0] ? args[0].toLowerCase() : "";

            if (query === "all") {
                try {
                    const allThread = await api.getThreadInfo(threadID);
                    if (allThread && allThread.participantIDs) {
                        for (const id of allThread.participantIDs) {
                            if (!threadData[id]) threadData[id] = 0;
                        }
                    }
                } catch (error) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", error);
                }
            }

            const storage = [];
            const processedUsers = new Set();

            for (const id in threadData) {
                if (processedUsers.has(id)) continue;
                processedUsers.add(id);

                try {
                    const userInfo = await api.getUserInfo(id);
                    const name = userInfo[id]?.name || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                    storage.push({ id, name, count: threadData[id] });
                } catch (error) {
                    console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗇𝖺𝗆𝖾 𝖿𝗈𝗋 ${id}:`, error);
                    storage.push({ id, name: "𝖴𝗇𝗄𝗇𝗈𝗐𝗇", count: threadData[id] });
                }
            }

            storage.sort((a, b) => b.count - a.count || (a.name || "").localeCompare(b.name || ""));

            let msg = "";
            if (query === "all") {
                msg += "📊=== 𝖢𝖧𝖤𝖢𝖪𝖳𝖳 𝖫𝖤𝖠𝖣𝖤𝖱𝖡𝖮𝖠𝖱𝖣 ===📊\n\n";
                let rank = 1;
                let displayedCount = 0;
                for (const user of storage) {
                    if (displayedCount < 50 && user.count > 0) {
                        msg += `🏅 ${rank++}. ${user.name} - 💌 ${user.count} 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌\n`;
                        displayedCount++;
                    }
                }
                if (storage.length > displayedCount) {
                    msg += `\n...𝖺𝗇𝖽 ${storage.length - displayedCount} 𝗆𝗈𝗋𝖾 𝗎𝗌𝖾𝗋𝗌`;
                }
                if (displayedCount === 0) {
                    msg += "📝 𝖭𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗌𝗍𝖺𝗍𝗂𝗌𝗍𝗂𝖼𝗌 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗒𝖾𝗍.";
                }
            } else if (query === "rank") {
                msg += "🏅=== 𝖱𝖠𝖭𝖪 𝖫𝖨𝖲𝖳 ===🏅\n\n" + Object.values(rankNames).join("\n");
            } else {
                let userID = senderID;
                if (Object.keys(mentions).length > 0) userID = Object.keys(mentions)[0];

                const userIndex = storage.findIndex(e => e.id == userID);
                const user = storage[userIndex] || { id: userID, name: "𝖴𝗇𝗄𝗇𝗈𝗐𝗇", count: 0 };

                msg += `💠 ${userID == senderID ? "𝖸𝗈𝗎𝗋 𝖲𝗍𝖺𝗍𝗌" : (user.name + "'𝗌 𝖲𝗍𝖺𝗍𝗌")}\n\n`;
                msg += `📌 𝖱𝖺𝗇𝗄: ${userIndex >= 0 ? userIndex + 1 : "𝖭/𝖠"}\n`;
                msg += `💌 𝖬𝖾𝗌𝗌𝖺𝗀𝖾𝗌: ${user.count}\n`;
                msg += `🔰 𝖱𝖺𝗇𝗄 𝖳𝗂𝗍𝗅𝖾: ${getRankName(user.count)}`;
            }

            await message.reply(msg);

        } catch (error) {
            console.error("💥 𝖢𝗁𝖾𝖼𝗄𝗍𝗍 𝖮𝗇𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖼𝗁𝖾𝖼𝗄𝗍𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.";
            
            if (error.message.includes('JSON')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺 𝖿𝗂𝗅𝖾 𝖼𝗈𝗋𝗋𝗎𝗉𝗍𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖢𝗁𝖾𝖼𝗄 𝖿𝗂𝗅𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
