const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "config",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "𝖢𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖾 𝖻𝗈𝗍 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌"
        },
        longDescription: {
            en: "𝖬𝖺𝗇𝖺𝗀𝖾 𝖻𝗈𝗍 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇 𝖺𝗇𝖽 𝖺𝖽𝗆𝗂𝗇 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌"
        },
        guide: {
            en: "{p}config"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "moment-timezone": ""
        }
    },

    // 𝖪𝖾𝖾𝗉 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝗉𝖺𝗍𝗁 𝖺𝗌 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝖾𝖽 (𝖽𝗈 𝖭𝖮𝖳 𝖼𝗁𝖺𝗇𝗀𝖾)
    appStatePath: path.join(__dirname, "../../appstate.json"),

    onStart: async function({ message, event, api }) {
        try {
            // 𝖣𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒 𝖼𝗁𝖾𝖼𝗄
            let dependenciesAvailable = true;
            try {
                require("moment-timezone");
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾, 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const { threadID, senderID } = event;

            // 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖼𝗁𝖾𝖼𝗄 - 𝗄𝖾𝗉𝗍 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝖺𝗅𝗅𝗈𝗐𝖾𝖽𝖴𝖨𝖣
            const allowedUID = "61571630409265";
            if (senderID !== allowedUID) {
                return message.reply("❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖽𝖾𝗇𝗂𝖾𝖽. 𝖮𝗇𝗅𝗒 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖼 𝗎𝗌𝖾𝗋𝗌 𝖼𝖺𝗇 𝖺𝖼𝖼𝖾𝗌𝗌 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
            }

            const menuMessage = "⚙️ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖫𝗂𝗌𝗍 ⚙️"
                + "\n[𝟬𝟭] 𝖤𝖽𝗂𝗍 𝖻𝗈𝗍 𝖻𝗂𝗈"
                + "\n[𝟬𝟮] 𝖤𝖽𝗂𝗍 𝖻𝗈𝗍 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾𝗌"
                + "\n[𝟬𝟯] 𝖵𝗂𝖾𝗐 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌"
                + "\n[𝟬𝟰] 𝖵𝗂𝖾𝗐 𝗎𝗇𝗋𝖾𝖺𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌"
                + "\n[𝟬𝟱] 𝖵𝗂𝖾𝗐 𝗌𝗉𝖺𝗆 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌"
                + "\n[𝟬𝟲] 𝖢𝗁𝖺𝗇𝗀𝖾 𝖻𝗈𝗍 𝖺𝗏𝖺𝗍𝖺𝗋"
                + "\n[𝟬𝟳] 𝖳𝗎𝗋𝗇 𝗈𝗇/𝗈𝖿𝖿 𝖻𝗈𝗍 𝖺𝗏𝖺𝗍𝖺𝗋 𝗌𝗁𝗂𝖾𝗅𝖽"
                + "\n[𝟬𝟴] 𝖡𝗅𝗈𝖼𝗄 𝗎𝗌𝖾𝗋𝗌 (𝗆𝖾𝗌𝗌𝖾𝗇𝗀𝖾𝗋)"
                + "\n[𝟬𝟵] 𝖴𝗇𝖻𝗅𝗈𝖼𝗄 𝗎𝗌𝖾𝗋𝗌 (𝗆𝖾𝗌𝗌𝖾𝗇𝗀𝖾𝗋)"
                + "\n[𝟭𝟬] 𝖢𝗋𝖾𝖺𝗍𝖾 𝗉𝗈𝗌𝗍"
                + "\n[𝟭𝟭] 𝖣𝖾𝗅𝖾𝗍𝖾 𝗉𝗈𝗌𝗍"
                + "\n[𝟭𝟮] 𝖢𝗈𝗆𝗆𝖾𝗇𝗍 𝗈𝗇 𝗉𝗈𝗌𝗍 (𝗎𝗌𝖾𝗋)"
                + "\n[𝟭𝟯] 𝖢𝗈𝗆𝗆𝖾𝗇𝗍 𝗈𝗇 𝗉𝗈𝗌𝗍 (𝗀𝗋𝗈𝗎𝗉)"
                + "\n[𝟭𝟰] 𝖱𝖾𝖺𝖼𝗍 𝗍𝗈 𝗉𝗈𝗌𝗍"
                + "\n[𝟭𝟱] 𝖲𝖾𝗇𝖽 𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍"
                + "\n[𝟭𝟲] 𝖠𝖼𝖼𝖾𝗉𝗍 𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍"
                + "\n[𝟭𝟳] 𝖣𝖾𝖼𝗅𝗂𝗇𝖾 𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍"
                + "\n[𝟭𝟴] 𝖱𝖾𝗆𝗈𝗏𝖾 𝖿𝗋𝗂𝖾𝗇𝖽𝗌"
                + "\n[𝟭𝟵] 𝖲𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖻𝗒 𝖨𝖣"
                + "\n[𝟮𝟬] 𝖢𝗋𝖾𝖺𝗍𝖾 𝗇𝗈𝗍𝖾"
                + "\n[𝟮𝟭] 𝖫𝗈𝗀 𝗈𝗎𝗍"
                + "\n══════════════════════"
                + `\n» 𝖡𝗈𝗍 𝖨𝖣: ${api.getCurrentUserID()}`
                + `\n» 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗇𝗎𝗆𝖻𝖾𝗋 𝗍𝗈 𝗌𝖾𝗅𝖾𝖼𝗍`
                + "\n══════════════════════";

            const msg = await message.reply(menuMessage);
            
            global.client.handleReply.push({
                name: this.config.name,
                messageID: msg.messageID,
                author: senderID,
                type: "menu"
            });

        } catch (error) {
            console.error("💥 𝖢𝗈𝗇𝖿𝗂𝗀 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            // 𝖣𝗈𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆
        }
    },

    onReply: async function({ event, message, Reply, api }) {
        try {
            // 𝖣𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒 𝖼𝗁𝖾𝖼𝗄
            let dependenciesAvailable = true;
            try {
                require("moment-timezone");
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾, 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const { senderID, body } = event;
            
            if (Reply.author !== senderID) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝖾𝗍 𝗍𝗁𝖾 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝗎𝗌𝖾𝗋 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾.");
            }
            
            // 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖼𝗁𝖾𝖼𝗄
            const allowedUID = "61571630409265";
            if (senderID !== allowedUID) {
                return message.reply("❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖽𝖾𝗇𝗂𝖾𝖽. 𝖮𝗇𝗅𝗒 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖼 𝗎𝗌𝖾𝗋𝗌 𝖼𝖺𝗇 𝖺𝖼𝖼𝖾𝗌𝗌 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
            }

            const args = body.split(" ");

            // --- 𝖬𝖤𝖭𝖴 𝖺𝖼𝗍𝗂𝗈𝗇𝗌 ---
            if (Reply.type == 'menu') {
                if (["01", "1"].includes(args[0])) {
                    await message.reply("📝 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖻𝗂𝗈 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝗈𝗋 '𝖽𝖾𝗅𝖾𝗍𝖾' 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝖻𝗂𝗈");
                    
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: event.messageID,
                        author: senderID,
                        type: "changeBio"
                    });
                }
                else if (["02", "2"].includes(args[0])) {
                    await message.reply("📝 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝗈𝗋 '𝖽𝖾𝗅𝖾𝗍𝖾' 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾");
                    
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: event.messageID,
                        author: senderID,
                        type: "changeNickname"
                    });
                }
                else if (["03", "3"].includes(args[0])) {
                    try {
                        const messagePending = await api.getThreadList(500, null, ["PENDING"]);
                        const msg = (messagePending || []).reduce((a, b) => a + `» ${b.name} | ${b.threadID} | 𝖬𝖾𝗌𝗌𝖺𝗀𝖾: ${b.snippet}\n`, "");
                        await message.reply(`📭 𝖡𝗈𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗐𝖺𝗂𝗍𝗂𝗇𝗀 𝗅𝗂𝗌𝗍:\n\n${msg || "𝖭𝗈 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌"}`);
                    } catch (error) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌:", error);
                        await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌");
                    }
                }
                else if (["04", "4"].includes(args[0])) {
                    try {
                        const messagePending = await api.getThreadList(500, null, ["unread"]);
                        const msg = (messagePending || []).reduce((a, b) => a + `» ${b.name} | ${b.threadID} | 𝖬𝖾𝗌𝗌𝖺𝗀𝖾: ${b.snippet}\n`, "");
                        await message.reply(`📨 𝖡𝗈𝗍 𝗎𝗇𝗋𝖾𝖺𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌:\n\n${msg || "𝖭𝗈 𝗎𝗇𝗋𝖾𝖺𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌"}`);
                    } catch (error) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗇𝗋𝖾𝖺𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌:", error);
                        await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗇𝗋𝖾𝖺𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌");
                    }
                }
                else if (["05", "5"].includes(args[0])) {
                    try {
                        const messagePending = await api.getThreadList(500, null, ["OTHER"]);
                        const msg = (messagePending || []).reduce((a, b) => a + `» ${b.name} | ${b.threadID} | 𝖬𝖾𝗌𝗌𝖺𝗀𝖾: ${b.snippet}\n`, "");
                        await message.reply(`⚠️ 𝖡𝗈𝗍 𝗌𝗉𝖺𝗆 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌:\n\n${msg || "𝖭𝗈 𝗌𝗉𝖺𝗆 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌"}`);
                    } catch (error) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗌𝗉𝖺𝗆 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌:", error);
                        await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗌𝗉𝖺𝗆 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌");
                    }
                }
                else if (["06", "6"].includes(args[0])) {
                    await message.reply("🖼️ 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖺 𝗉𝗁𝗈𝗍𝗈 𝗈𝗋 𝗂𝗆𝖺𝗀𝖾 𝗅𝗂𝗇𝗄 𝗍𝗈 𝖼𝗁𝖺𝗇𝗀𝖾 𝖻𝗈𝗍 𝖺𝗏𝖺𝗍𝖺𝗋");
                    
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: event.messageID,
                        author: senderID,
                        type: "changeAvatar"
                    });
                }
                else if (["07", "7"].includes(args[0])) {
                    if (!args[1] || !["on", "off"].includes(args[1])) {
                        return message.reply('🔒 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝖾𝗅𝖾𝖼𝗍 𝗈𝗇/𝗈𝖿𝖿');
                    }
                    
                    try {
                        await api.changeAvatarProtection(args[1] == 'on');
                        await message.reply(`🛡️ 𝖠𝗏𝖺𝗍𝖺𝗋 𝗌𝗁𝗂𝖾𝗅𝖽 ${args[1] == 'on' ? '𝖾𝗇𝖺𝖻𝗅𝖾𝖽' : '𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽'}`);
                    } catch (error) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗁𝖺𝗇𝗀𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝗌𝗁𝗂𝖾𝗅𝖽:", error);
                        await message.reply("❌ 𝖤𝗋𝗋𝗈𝗋, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇");
                    }
                }
                else if (["08", "8"].includes(args[0])) {
                    await message.reply("🔒 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖨𝖣𝗌 𝗍𝗈 𝖻𝗅𝗈𝖼𝗄 (𝗌𝗉𝖺𝖼𝖾 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽)");
                    
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: event.messageID,
                        author: senderID,
                        type: "blockUser"
                    });
                }
                else if (["09", "9"].includes(args[0])) {
                    await message.reply("🔓 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖨𝖣𝗌 𝗍𝗈 𝗎𝗇𝖻𝗅𝗈𝖼𝗄 (𝗌𝗉𝖺𝖼𝖾 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽)");
                    
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: event.messageID,
                        author: senderID,
                        type: "unBlockUser"
                    });
                }
                else if (["10"].includes(args[0])) {
                    await message.reply("📝 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗉𝗈𝗌𝗍 𝖼𝗈𝗇𝗍𝖾𝗇𝗍");
                    
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: event.messageID,
                        author: senderID,
                        type: "createPost"
                    });
                }
                else if (["21"].includes(args[0])) {
                    try {
                        await api.logout();
                        await message.reply('👋 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗅𝗈𝗀𝗀𝖾𝖽 𝗈𝗎𝗍');
                    } catch (error) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝗀𝗀𝗂𝗇𝗀 𝗈𝗎𝗍:", error);
                        await message.reply('❌ 𝖤𝗋𝗋𝗈𝗋 𝗅𝗈𝗀𝗀𝗂𝗇𝗀 𝗈𝗎𝗍');
                    }
                }
                else {
                    await message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗉𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝗈𝗈𝗌𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋.");
                }
            }

            // --- 𝖢𝗁𝖺𝗇𝗀𝖾𝖡𝗂𝗈 ---
            else if (Reply.type == 'changeBio') {
                const bio = body.toLowerCase() == 'delete' ? '' : body;
                try {
                    await api.changeBio(bio, false);
                    await message.reply(`✅ ${!bio ? "𝖡𝗂𝗈 𝖽𝖾𝗅𝖾𝗍𝖾𝖽" : `𝖡𝗂𝗈 𝗎𝗉𝖽𝖺𝗍𝖾𝖽: ${bio}`}`);
                } catch (error) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗁𝖺𝗇𝗀𝗂𝗇𝗀 𝖻𝗂𝗈:", error);
                    await message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗁𝖺𝗇𝗀𝗂𝗇𝗀 𝖻𝗂𝗈");
                }
            }

            // --- 𝖡𝗅𝗈𝖼𝗄𝖴𝗌𝖾𝗋 ---
            else if (Reply.type == 'blockUser') {
                if (!body) {
                    return message.reply("🔒 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖨𝖣𝗌 𝗍𝗈 𝖻𝗅𝗈𝖼𝗄");
                }
                
                const uids = body.replace(/\s+/g, " ").split(" ").filter(uid => uid.trim() !== "");
                const success = [];
                const failed = [];
                
                for (const uid of uids) {
                    try {
                        await api.changeBlockedStatus(uid, true);
                        success.push(uid);
                    } catch (err) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖻𝗅𝗈𝖼𝗄 ${uid}:`, err.message);
                        failed.push(uid);
                    }
                }
                
                await message.reply(`✅ 𝖡𝗅𝗈𝖼𝗄𝖾𝖽 ${success.length} 𝗎𝗌𝖾𝗋𝗌${failed.length > 0 ? `\n❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${failed.join(" ")}` : ""}`);
            }

            // --- 𝖴𝗇𝖡𝗅𝗈𝖼𝗄𝖴𝗌𝖾𝗋 ---
            else if (Reply.type == 'unBlockUser') {
                if (!body) {
                    return message.reply("🔓 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖨𝖣𝗌 𝗍𝗈 𝗎𝗇𝖻𝗅𝗈𝖼𝗄");
                }
                
                const uids = body.replace(/\s+/g, " ").split(" ").filter(uid => uid.trim() !== "");
                const success = [];
                const failed = [];
                
                for (const uid of uids) {
                    try {
                        await api.changeBlockedStatus(uid, false);
                        success.push(uid);
                    } catch (err) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗇𝖻𝗅𝗈𝖼𝗄 ${uid}:`, err.message);
                        failed.push(uid);
                    }
                }
                
                await message.reply(`✅ 𝖴𝗇𝖻𝗅𝗈𝖼𝗄𝖾𝖽 ${success.length} 𝗎𝗌𝖾𝗋𝗌${failed.length > 0 ? `\n❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${failed.join(" ")}` : ""}`);
            }

            // --- 𝖢𝗋𝖾𝖺𝗍𝖾𝖯𝗈𝗌𝗍 ---
            else if (Reply.type == 'createPost') {
                if (!body) {
                    return message.reply("📝 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗉𝗈𝗌𝗍 𝖼𝗈𝗇𝗍𝖾𝗇𝗍");
                }

                try {
                    await api.createPost(body);
                    await message.reply(`✅ 𝖯𝗈𝗌𝗍 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒`);
                } catch (error) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗉𝗈𝗌𝗍:", error);
                    await message.reply(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗉𝗈𝗌𝗍`);
                }
            }

            // --- 𝖢𝗁𝖺𝗇𝗀𝖾𝖠𝗏𝖺𝗍𝖺𝗋 ---
            else if (Reply.type == 'changeAvatar') {
                let imgUrl;
                
                if (body && body.match(/^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g)) {
                    imgUrl = body;
                } else if (event.attachments && event.attachments[0] && event.attachments[0].type == "photo") {
                    imgUrl = event.attachments[0].url;
                } else {
                    return message.reply(`❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝗅𝗂𝗇𝗄 𝗈𝗋 𝖺𝗍𝗍𝖺𝖼𝗁𝗆𝖾𝗇𝗍`);
                }

                try {
                    const imgStream = await global.utils.getStreamFromURL(imgUrl);
                    await api.changeAvatar(imgStream);
                    await message.reply(`🖼️ 𝖠𝗏𝖺𝗍𝖺𝗋 𝗎𝗉𝖽𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒`);
                } catch (error) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋:", error);
                    await message.reply(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋`);
                }
            }

        } catch (error) {
            console.error("💥 𝖢𝗈𝗇𝖿𝗂𝗀 𝗋𝖾𝗉𝗅𝗒 𝖾𝗋𝗋𝗈𝗋:", error);
            // 𝖣𝗈𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆
        }
    }
};
