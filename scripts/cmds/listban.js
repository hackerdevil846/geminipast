module.exports = {
    config: {
        name: "listban",
        aliases: [],
        version: "1.0.3",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "𝖡𝖺𝗇/𝖴𝗇𝖻𝖺𝗇 𝗆𝗈𝖽𝗎𝗅𝖾 𝖿𝗈𝗋 𝖺𝖽𝗆𝗂𝗇𝗌"
        },
        longDescription: {
            en: "𝖬𝖺𝗇𝖺𝗀𝖾 𝖻𝖺𝗇𝗇𝖾𝖽 𝗎𝗌𝖾𝗋𝗌 𝖺𝗇𝖽 𝗀𝗋𝗈𝗎𝗉𝗌"
        },
        guide: {
            en: "{p}listban [𝗍𝗁𝗋𝖾𝖺𝖽/𝗎𝗌𝖾𝗋]"
        },
        dependencies: {
            "fs-extra": "",
            "axios": ""
        }
    },

    languages: {
        "en": {
            "no_banned_groups": "𝖢𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗍𝗁𝖾𝗋𝖾 𝖺𝗋𝖾 𝗇𝗈 𝖻𝖺𝗇𝗇𝖾𝖽 𝗀𝗋𝗈𝗎𝗉𝗌! ✅",
            "no_banned_users": "𝖢𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗍𝗁𝖾𝗋𝖾 𝖺𝗋𝖾 𝗇𝗈 𝖻𝖺𝗇𝗇𝖾𝖽 𝗎𝗌𝖾𝗋𝗌! ✅",
            "invalid_order": "𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗋𝖽𝖾𝗋 𝗇𝗎𝗆𝖻𝖾𝗋! ⚠️",
            "only_initiator": "𝖮𝗇𝗅𝗒 𝗍𝗁𝖾 𝗂𝗇𝗂𝗍𝗂𝖺𝗍𝗈𝗋 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽! ⚠️",
            "error_processing": "𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀! ⚠️"
        }
    },

    onLoad: function () {
        try {
            if (!global.client) global.client = {};
            if (!global.client.handleReply) global.client.handleReply = [];
            console.log("✅ 𝖫𝗂𝗌𝗍𝖻𝖺𝗇 𝗆𝗈𝖽𝗎𝗅𝖾 𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗅𝗂𝗌𝗍𝖻𝖺𝗇:", error);
        }
    },

    onStart: async function ({ message, event, args, Users, Threads }) {
        try {
            // Dependency check
            let fsAvailable = true;
            let axiosAvailable = true;
            try {
                require("fs-extra");
                require("axios");
            } catch (e) {
                fsAvailable = false;
                axiosAvailable = false;
            }

            if (!fsAvailable || !axiosAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝖺𝗑𝗂𝗈𝗌.");
            }

            const { threadID, senderID } = event;
            let listBanned = [];
            let i = 1;

            // Validate global data exists
            if (!global.data) {
                global.data = {};
            }
            if (!global.data.threadBanned) {
                global.data.threadBanned = new Map();
            }
            if (!global.data.userBanned) {
                global.data.userBanned = new Map();
            }
            if (!global.data.userName) {
                global.data.userName = new Map();
            }

            switch ((args[0] || "").toLowerCase()) {
                case "thread":
                case "t":
                case "-t": {
                    const threadBanned = Array.from(global.data.threadBanned.keys());

                    if (threadBanned.length === 0) {
                        return message.reply(this.languages.en.no_banned_groups);
                    }

                    for (const singleThread of threadBanned) {
                        try {
                            const dataThread = (await Threads.getData(singleThread)) || {};
                            const threadInfo = dataThread.threadInfo || {};
                            const nameT = threadInfo.threadName || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖦𝗋𝗈𝗎𝗉";

                            listBanned.push(`${i++}. ${nameT}\n🍂 𝖳𝖨𝖣: ${singleThread}`);
                        } catch (threadError) {
                            console.error(`𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺 ${singleThread}:`, threadError);
                            listBanned.push(`${i++}. 𝖤𝗋𝗋𝗈𝗋 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝖦𝗋𝗈𝗎𝗉\n🍂 𝖳𝖨𝖣: ${singleThread}`);
                        }
                    }

                    const msg = await message.reply({
                        body: `📋 𝖢𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 ${listBanned.length} 𝖻𝖺𝗇𝗇𝖾𝖽 𝗀𝗋𝗈𝗎𝗉𝗌:\n\n${listBanned.join("\n\n")}\n\n📝 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗈𝗋𝖽𝖾𝗋 𝗇𝗎𝗆𝖻𝖾𝗋 𝗍𝗈 𝗎𝗇𝖻𝖺𝗇`,
                        attachment: null
                    });

                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: msg.messageID,
                        author: event.senderID,
                        type: "unbanthread",
                        listBanned
                    });
                    break;
                }

                case "user":
                case "u":
                case "-u": {
                    const userBanned = Array.from(global.data.userBanned.keys());

                    if (userBanned.length === 0) {
                        return message.reply(this.languages.en.no_banned_users);
                    }

                    for (const singleUser of userBanned) {
                        try {
                            let name = global.data.userName.get(singleUser);
                            if (!name) {
                                name = await Users.getNameUser(singleUser) || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
                                global.data.userName.set(singleUser, name);
                            }
                            listBanned.push(`${i++}. ${name}\n🍁 𝖴𝖨𝖣: ${singleUser}`);
                        } catch (userError) {
                            console.error(`𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺 ${singleUser}:`, userError);
                            listBanned.push(`${i++}. 𝖤𝗋𝗋𝗈𝗋 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝖴𝗌𝖾𝗋\n🍁 𝖴𝖨𝖣: ${singleUser}`);
                        }
                    }

                    const msg = await message.reply({
                        body: `📋 𝖢𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 ${listBanned.length} 𝖻𝖺𝗇𝗇𝖾𝖽 𝗎𝗌𝖾𝗋𝗌:\n\n${listBanned.join("\n\n")}\n\n📝 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗈𝗋𝖽𝖾𝗋 𝗇𝗎𝗆𝖻𝖾𝗋 𝗍𝗈 𝗎𝗇𝖻𝖺𝗇`,
                        attachment: null
                    });

                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: msg.messageID,
                        author: event.senderID,
                        type: "unbanuser",
                        listBanned
                    });
                    break;
                }

                default: {
                    const helpMessage = `» 𝖡𝖺𝗇 𝖬𝗈𝖽𝗎𝗅𝖾 «\n\n🔹 𝖴𝗌𝖺𝗀𝖾: ${global.config.PREFIX || "!"}listban [option]\n\n🔸 𝖮𝗉𝗍𝗂𝗈𝗇𝗌:\n  • 𝗍𝗁𝗋𝖾𝖺𝖽 / 𝗍 - 𝖲𝗁𝗈𝗐 𝖻𝖺𝗇𝗇𝖾𝖽 𝗀𝗋𝗈𝗎𝗉𝗌\n  • 𝗎𝗌𝖾𝗋 / 𝗎   - 𝖲𝗁𝗈𝗐 𝖻𝖺𝗇𝗇𝖾𝖽 𝗎𝗌𝖾𝗋𝗌\n\n📝 𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺 𝗅𝗂𝗌𝗍𝖾𝖽 𝗂𝗍𝖾𝗆 𝗐𝗂𝗍𝗁 𝗂𝗍𝗌 𝗈𝗋𝖽𝖾𝗋 𝗇𝗎𝗆𝖻𝖾𝗋 𝗍𝗈 𝗎𝗇𝖻𝖺𝗇`;
                    return message.reply(helpMessage);
                }
            }
        } catch (error) {
            console.error("💥 𝖫𝗂𝗌𝗍𝖻𝖺𝗇 𝗌𝗍𝖺𝗋𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
            return message.reply(this.languages.en.error_processing);
        }
    },

    onReply: async function ({ event, message, Reply, Users, Threads }) {
        try {
            const { senderID, body } = event;

            // Validate reply data
            if (!Reply || !Reply.author || !Reply.listBanned || !Reply.type) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗋𝖾𝗉𝗅𝗒 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            if (parseInt(senderID) !== parseInt(Reply.author)) {
                return message.reply(this.languages.en.only_initiator);
            }

            const orderNumber = parseInt(body.trim());
            if (isNaN(orderNumber) || orderNumber < 1 || orderNumber > Reply.listBanned.length) {
                return message.reply(this.languages.en.invalid_order);
            }

            const selectedItem = Reply.listBanned[orderNumber - 1];
            const idMatch = selectedItem.match(/(\d{4,})/);
            if (!idMatch) {
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖾𝗑𝗍𝗋𝖺𝖼𝗍 𝖨𝖣! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            const targetID = idMatch[1];
            let userName = "𝖠𝖽𝗆𝗂𝗇";
            let targetName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";

            try {
                userName = await Users.getNameUser(senderID) || "𝖠𝖽𝗆𝗂𝗇";
            } catch (nameError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾:", nameError);
            }

            switch (Reply.type) {
                case "unbanthread": {
                    try {
                        // Get thread info
                        let threadInfo;
                        try {
                            threadInfo = await Threads.getInfo(targetID);
                            targetName = (threadInfo && threadInfo.threadName) ? threadInfo.threadName : "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖦𝗋𝗈𝗎𝗉";
                        } catch (infoError) {
                            console.warn(`𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈 ${targetID}:`, infoError);
                            targetName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖦𝗋𝗈𝗎𝗉";
                        }

                        // Update thread data
                        const threadDataObj = (await Threads.getData(targetID)) || {};
                        const threadData = threadDataObj.data || {};
                        threadData.banned = false;
                        threadData.reason = null;
                        threadData.dateAdded = null;

                        await Threads.setData(targetID, { data: threadData });
                        
                        // Remove from banned list
                        if (global.data && global.data.threadBanned) {
                            global.data.threadBanned.delete(targetID);
                        }

                        // Try to send notification to the group
                        try {
                            await message.reply({
                                body: `» 𝖭𝗈𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 «\n\n${userName} 𝗎𝗇𝖻𝖺𝗇𝗇𝖾𝖽 𝗍𝗁𝗂𝗌 𝖻𝗈𝗍 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉\n\n- 𝖳𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 '${targetName}' 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗎𝗇𝖻𝖺𝗇𝗇𝖾𝖽`,
                                attachment: null
                            }, targetID);
                        } catch (notifyError) {
                            console.warn(`𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗇𝖽 𝗇𝗈𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝗍𝗈 𝗀𝗋𝗈𝗎𝗉 ${targetID}:`, notifyError);
                        }

                        return message.reply(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌\n\n${userName} 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗎𝗇𝖻𝖺𝗇𝗇𝖾𝖽 𝗀𝗋𝗈𝗎𝗉:\n→ ${targetName}`);

                    } catch (threadError) {
                        console.error(`𝖤𝗋𝗋𝗈𝗋 𝗎𝗇𝖻𝖺𝗇𝗇𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 ${targetID}:`, threadError);
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗇𝖻𝖺𝗇 𝗀𝗋𝗈𝗎𝗉. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                    }
                }

                case "unbanuser": {
                    try {
                        // Get user info
                        try {
                            targetName = await Users.getNameUser(targetID) || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
                        } catch (nameError) {
                            console.warn(`𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾 ${targetID}:`, nameError);
                            targetName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
                        }

                        // Update user data
                        const userDataObj = (await Users.getData(targetID)) || {};
                        const userData = userDataObj.data || {};
                        userData.banned = false;
                        userData.reason = null;
                        userData.dateAdded = null;

                        await Users.setData(targetID, { data: userData });
                        
                        // Remove from banned list
                        if (global.data && global.data.userBanned) {
                            global.data.userBanned.delete(targetID);
                        }
                        if (global.data && global.data.userName) {
                            global.data.userName.delete(targetID);
                        }

                        // Try to send notification to the user
                        try {
                            await message.reply({
                                body: `» 𝖭𝗈𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 «\n\n${userName} 𝗎𝗇𝖻𝖺𝗇𝗇𝖾𝖽 𝗒𝗈𝗎 𝖿𝗋𝗈𝗆 𝖺𝖽𝗆𝗂𝗇\n\n- 𝖸𝗈𝗎'𝗏𝖾 𝖻𝖾𝖾𝗇 𝗎𝗇𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝖻𝗈𝗍`,
                                attachment: null
                            }, targetID);
                        } catch (notifyError) {
                            console.warn(`𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗇𝖽 𝗇𝗈𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝗍𝗈 𝗎𝗌𝖾𝗋 ${targetID}:`, notifyError);
                        }

                        return message.reply(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌\n\n${userName} 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗎𝗇𝖻𝖺𝗇𝗇𝖾𝖽 𝗎𝗌𝖾𝗋:\n→ ${targetName}`);

                    } catch (userError) {
                        console.error(`𝖤𝗋𝗋𝗈𝗋 𝗎𝗇𝖻𝖺𝗇𝗇𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 ${targetID}:`, userError);
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗇𝖻𝖺𝗇 𝗎𝗌𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                    }
                }

                default:
                    return message.reply(this.languages.en.error_processing);
            }
        } catch (error) {
            console.error("💥 𝖫𝗂𝗌𝗍𝖻𝖺𝗇 𝗋𝖾𝗉𝗅𝗒 𝖾𝗋𝗋𝗈𝗋:", error);
            return message.reply(this.languages.en.error_processing);
        }
    }
};
