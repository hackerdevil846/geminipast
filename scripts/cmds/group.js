const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
    config: {
        name: "group",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 1,
        role: 0,
        category: "box",
        shortDescription: {
            en: "𝖦𝗋𝗈𝗎𝗉 𝗆𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌"
        },
        longDescription: {
            en: "𝖦𝗋𝗈𝗎𝗉 𝗆𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖿𝗈𝗋 𝗇𝖺𝗆𝖾, 𝖾𝗆𝗈𝗃𝗂, 𝖺𝖽𝗆𝗂𝗇, 𝗂𝗆𝖺𝗀𝖾, 𝗂𝗇𝖿𝗈"
        },
        guide: {
            en: "{p}group [𝗇𝖺𝗆𝖾/𝖾𝗆𝗈𝗃𝗂/𝖺𝖽𝗆𝗂𝗇/𝗂𝗆𝖺𝗀𝖾/𝗂𝗇𝖿𝗈]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onLoad: async function () {
        try {
            const dir = __dirname + "/cache";
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        } catch (error) {
            console.error("💥 𝖢𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function ({ api, event, args, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            if (!args[0]) {
                const helpMsg =
`╭───• 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 •───╮
│
├─❏ 𝗻𝗮𝗺𝗲 ➺  𝖦𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝖼𝗁𝖺𝗇𝗀𝖾
├─❏ 𝗲𝗺𝗼𝗷𝗂 ➺  𝖦𝗋𝗈𝗎𝗉 𝖾𝗆𝗈𝗃𝗂 𝗎𝗉𝖽𝖺𝗍𝖾
├─❏ 𝗶𝗺𝗮𝗴𝗲 ➺  𝖦𝗋𝗈𝗎𝗉 𝗂𝗆𝖺𝗀𝖾 𝗌𝖾𝗍
├─❏ 𝗮𝗱𝗺𝗂𝗇 ➺  𝖠𝖽𝗆𝗂𝗇 𝗆𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍
├─❏ 𝗶𝗻𝗳𝗼 ➺  𝖦𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇
│
╰─────────────⧕☬⧕──────────╯`;
                return message.reply(helpMsg);
            }

            const action = args[0].toLowerCase();

            if (action === "name") {
                const newName = args.slice(1).join(" ") || (event.messageReply && event.messageReply.body);
                if (!newName) return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗇𝖺𝗆𝖾");
                
                try {
                    await api.setTitle(newName, event.threadID);
                    return message.reply(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖼𝗁𝖺𝗇𝗀𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾:\n"${newName}"`);
                } catch (error) {
                    console.error("💥 𝖭𝖺𝗆𝖾 𝖼𝗁𝖺𝗇𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾");
                }
            }

            else if (action === "emoji") {
                const emoji = args[1] || (event.messageReply && event.messageReply.body);
                if (!emoji) return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺𝗇 𝖾𝗆𝗈𝗃𝗂");
                
                try {
                    await api.changeThreadEmoji(emoji, event.threadID);
                    return message.reply(`✅ 𝖤𝗆𝗈𝗃𝗂 𝗎𝗉𝖽𝖺𝗍𝖾𝖽: ${emoji}`);
                } catch (error) {
                    console.error("💥 𝖤𝗆𝗈𝗃𝗂 𝖼𝗁𝖺𝗇𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗉𝖽𝖺𝗍𝖾 𝖾𝗆𝗈𝗃𝗂");
                }
            }

            else if (action === "admin") {
                try {
                    const threadInfo = await api.getThreadInfo(event.threadID);
                    const adminIDs = threadInfo.adminIDs || [];
                    const botID = api.getCurrentUserID();
                    const isBotAdmin = adminIDs.some(ad => ad.id == botID);
                    const isUserAdmin = adminIDs.some(ad => ad.id == event.senderID);

                    let targetID;
                    const mentions = event.mentions || {};
                    if (Object.keys(mentions).length > 0) {
                        targetID = Object.keys(mentions)[0];
                    } else if (event.messageReply) {
                        targetID = event.messageReply.senderID;
                    } else if (args[1]) {
                        targetID = args[1];
                    }

                    if (!targetID) return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗈𝗋 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺 𝗎𝗌𝖾𝗋");
                    if (!isUserAdmin) return message.reply("❌ 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖺𝗇 𝖺𝖽𝗆𝗂𝗇");
                    if (!isBotAdmin) return message.reply("❌ 𝖡𝗈𝗍 𝗂𝗌 𝗇𝗈𝗍 𝖺𝗇 𝖺𝖽𝗆𝗂𝗇");

                    const isTargetAdmin = adminIDs.some(ad => ad.id == targetID);
                    
                    await api.changeAdminStatus(event.threadID, targetID, !isTargetAdmin);
                    
                    const userInfo = await api.getUserInfo(targetID);
                    const name = (userInfo && userInfo[targetID] && userInfo[targetID].name) ? userInfo[targetID].name : "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                    const actionText = isTargetAdmin ? "𝖱𝖾𝗆𝗈𝗏𝖾𝖽 𝖺𝖽𝗆𝗂𝗇:" : "𝖠𝖽𝖽𝖾𝖽 𝖺𝗌 𝖺𝖽𝗆𝗂𝗇:";
                    
                    return message.reply(`✅ ${actionText}\n╭─• ${name}\n╰─• @${targetID}`);
                    
                } catch (error) {
                    console.error("💥 𝖠𝖽𝗆𝗂𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗉𝖽𝖺𝗍𝖾 𝖺𝖽𝗆𝗂𝗇 𝗌𝗍𝖺𝗍𝗎𝗌");
                }
            }

            else if (action === "image") {
                if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
                    return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾");
                }

                const imageUrl = event.messageReply.attachments[0].url;
                const cachePath = __dirname + `/cache/grpimg_${Date.now()}.png`;

                try {
                    const { data } = await axios.get(imageUrl, { 
                        responseType: 'arraybuffer',
                        timeout: 30000 
                    });
                    
                    await fs.writeFile(cachePath, Buffer.from(data, 'binary'));
                    
                    await api.changeGroupImage(fs.createReadStream(cachePath), event.threadID);
                    
                    // Cleanup
                    try {
                        if (fs.existsSync(cachePath)) {
                            fs.unlinkSync(cachePath);
                        }
                    } catch (cleanupError) {
                        console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
                    }
                    
                    return message.reply("✅ 𝖦𝗋𝗈𝗎𝗉 𝗂𝗆𝖺𝗀𝖾 𝗎𝗉𝖽𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                    
                } catch (error) {
                    console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝖼𝗁𝖺𝗇𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
                    
                    // Cleanup on error
                    try {
                        if (fs.existsSync(cachePath)) {
                            fs.unlinkSync(cachePath);
                        }
                    } catch (cleanupError) {
                        console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
                    }
                    
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝗀𝗋𝗈𝗎𝗉 𝗂𝗆𝖺𝗀𝖾");
                }
            }

            else if (action === "info") {
                try {
                    const threadInfo = await api.getThreadInfo(event.threadID);
                    const threadName = threadInfo.threadName || "𝖭/𝖠";
                    const participantIDs = threadInfo.participantIDs || [];
                    const adminIDs = threadInfo.adminIDs || [];
                    const imageSrc = threadInfo.imageSrc || "";
                    const emoji = threadInfo.emoji || "𝖭/𝖠";
                    const approvalMode = threadInfo.approvalMode || false;
                    const messageCount = threadInfo.messageCount || 0;

                    let genderCount = { male: 0, female: 0 };
                    if (threadInfo.userInfo) {
                        for (const uid in threadInfo.userInfo) {
                            const user = threadInfo.userInfo[uid];
                            if (user && user.gender) {
                                if (user.gender === "MALE") genderCount.male++;
                                else if (user.gender === "FEMALE") genderCount.female++;
                            }
                        }
                    }

                    let adminList = "╭───• 𝖠𝖣𝖬𝖨𝖭𝖲 •───╮\n";
                    for (const admin of adminIDs) {
                        const name = (threadInfo.userInfo && threadInfo.userInfo[admin.id] && threadInfo.userInfo[admin.id].name) ? threadInfo.userInfo[admin.id].name : "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                        adminList += `├─• ${name}\n`;
                    }
                    adminList += "╰────────────────╯";

                    const approvalStatus = approvalMode ? "✅ 𝖤𝗇𝖺𝖻𝗅𝖾𝖽" : "❌ 𝖣𝗂𝗌𝖺𝖻𝗅𝖾𝖽";

                    const msg =
`╭───• 𝖦𝖱𝖮𝖴𝖯 𝖨𝖭𝖥𝖮 •───╮
├─• 𝖭𝖺𝗆𝖾: ${threadName}
├─• 𝖨𝖣: ${event.threadID}
├─• 𝖤𝗆𝗈𝗃𝗂: ${emoji}
├─• 𝖬𝖾𝗆𝖻𝖾𝗋𝗌: ${participantIDs.length}
├─• 𝖬𝖺𝗅𝖾: ${genderCount.male}
├─• 𝖥𝖾𝗆𝖺𝗅𝖾: ${genderCount.female}
├─• 𝖠𝗉𝗉𝗋𝗈𝗏𝖺𝗅 𝖬𝗈𝖽𝖾: ${approvalStatus}
├─• 𝖬𝖾𝗌𝗌𝖺𝗀𝖾𝗌: ${messageCount}
${adminList}`;

                    if (imageSrc) {
                        try {
                            const imageStream = await global.utils.getStreamFromURL(imageSrc);
                            await message.reply({
                                body: msg,
                                attachment: imageStream
                            });
                        } catch (imageError) {
                            console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗀𝗋𝗈𝗎𝗉 𝗂𝗆𝖺𝗀𝖾:", imageError.message);
                            await message.reply(msg);
                        }
                    } else {
                        await message.reply(msg);
                    }
                } catch (error) {
                    console.error("💥 𝖨𝗇𝖿𝗈 𝖾𝗋𝗋𝗈𝗋:", error);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇");
                }
            }

            else {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗉𝗍𝗂𝗈𝗇. 𝖴𝗌𝖾: 𝗇𝖺𝗆𝖾 | 𝖾𝗆𝗈𝗃𝗂 | 𝖺𝖽𝗆𝗂𝗇 | 𝗂𝗆𝖺𝗀𝖾 | 𝗂𝗇𝖿𝗈");
            }
        } catch (error) {
            console.error("💥 𝖦𝗋𝗈𝗎𝗉 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋: 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇");
        }
    }
};
