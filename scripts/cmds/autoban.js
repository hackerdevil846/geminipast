const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "fixspam-ch",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 0,
        role: 0,
        category: "system",
        shortDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖻𝖺𝗇 𝗎𝗌𝖾𝗋𝗌 𝗐𝗁𝗈 𝗎𝗌𝖾 𝖻𝖺𝖽 𝗐𝗈𝗋𝖽𝗌 𝖺𝗀𝖺𝗂𝗇𝗌𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖻𝖺𝗇 𝗎𝗌𝖾𝗋𝗌 𝗐𝗁𝗈 𝗎𝗌𝖾 𝖻𝖺𝖽 𝗐𝗈𝗋𝖽𝗌 𝖺𝗀𝖺𝗂𝗇𝗌𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍"
        },
        guide: {
            en: "𝖭𝗈 𝗉𝗋𝖾𝖿𝗂𝗑 𝗇𝖾𝖾𝖽𝖾𝖽 - 𝗋𝗎𝗇𝗌 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒"
        },
        dependencies: {
            "moment-timezone": ""
        }
    },

    onLoad: function () {
        try {
            // 𝖤𝗇𝗌𝗎𝗋𝖾 𝗀𝗅𝗈𝖻𝖺𝗅.𝖽𝖺𝗍𝖺.𝗎𝗌𝖾𝗋𝖡𝖺𝗇𝗇𝖾𝖽 𝖾𝗑𝗂𝗌𝗍𝗌 𝖺𝗇𝖽 𝗂𝗌 𝖺 𝖬𝖺𝗉
            if (!global.data) global.data = {};
            if (!global.data.userBanned) global.data.userBanned = new Map();

            // 𝖤𝗇𝗌𝗎𝗋𝖾 𝗍𝗁𝖾𝗋𝖾 𝗂𝗌 𝖺𝗇 𝖠𝖣𝖬𝖨𝖭𝖡𝖮𝖳 𝖺𝗋𝗋𝖺𝗒 𝗍𝗈 𝗇𝗈𝗍𝗂𝖿𝗒
            if (!global.config) global.config = {};
            if (!global.config.ADMINBOT) global.config.ADMINBOT = [];

            console.log("✅ 𝖥𝗂𝗑𝗌𝗉𝖺𝗆-𝖼𝗁 𝗌𝗒𝗌𝗍𝖾𝗆 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝖿𝗂𝗑𝗌𝗉𝖺𝗆-𝖼𝗁 𝗈𝗇𝖫𝗈𝖺𝖽:", error);
        }
    },

    onChat: async function ({ event, api, usersData }) {
        try {
            // 𝖣𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒 𝖼𝗁𝖾𝖼𝗄
            let momentAvailable = true;
            try {
                require("moment-timezone");
            } catch (e) {
                momentAvailable = false;
            }

            const threadID = event.threadID;
            const senderID = event.senderID;
            let body = event.body || "";
            if (!body || typeof body !== "string") return;

            // 𝖣𝗈𝗇'𝗍 𝗋𝖾𝖺𝖼𝗍 𝗍𝗈 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝗈𝗐𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌
            try {
                const selfID = api.getCurrentUserID();
                if (selfID && senderID == selfID) return;
            } catch (errSelf) {
                // 𝗂𝗀𝗇𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋𝗌
            }

            const bodyNormalized = body.toLowerCase().trim();

            // 𝖡𝖺𝖽 𝗐𝗈𝗋𝖽𝗌 𝗅𝗂𝗌𝗍
            const badWords = [
                "bot mc", "mc bot", "chutiya bot", "bsdk bot", "bot teri maa ki chut",
                "jhatu bot", "rhaine bobo", "stupid bots", "chicken bot", "bot lund",
                "asif mc", "mc asif", "bsdk asif", "fuck bots",
                "asif chutiya", "asif gandu", "bobo ginoong choru bot",
                "asif bc", "crazy bots", "bc asif", "nikal bsdk bot",
                "bot khùng", "đĩ bot", "bot paylac rồi", "con bot lòn", "cmm bot",
                "clap bot", "bot ncc", "bot oc", "bot óc", "bot óc chó", "cc bot",
                "bot tiki", "lozz bottt", "lol bot", "loz bot", "lồn bot", "bot lồn",
                "bot lon", "bot cac", "bot nhu lon", "bot như cc", "bot như bìu",
                "bot sida", "bot fake", "bảo ngu", "bot shoppee",
                "bad bots", "bot cau"
            ];

            let detectedWord = "";
            for (const rawWord of badWords) {
                if (!rawWord) continue;
                const word = rawWord.toLowerCase().trim();
                if (!word) continue;

                if (bodyNormalized.includes(word)) {
                    detectedWord = rawWord;
                    break;
                }
            }

            if (!detectedWord) return;

            let userName = senderID;
            try {
                const userInfo = await usersData.get(senderID);
                userName = userInfo?.name || senderID;
            } catch (e) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", e.message);
            }

            console.log(`🚫 𝖡𝖺𝖽 𝗐𝗈𝗋𝖽 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽: ${userName} 𝗌𝖺𝗂𝖽 "${detectedWord}"`);

            let time = "";
            try {
                if (momentAvailable) {
                    const moment = require("moment-timezone");
                    time = moment().tz("Asia/Dhaka").format("HH:mm:ss, DD/MM/YYYY");
                } else {
                    time = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
                }
            } catch (errTime) {
                time = new Date().toLocaleString();
            }

            // 𝖡𝖺𝗇 𝗍𝗁𝖾 𝗎𝗌𝖾𝗋
            try {
                const userData = await usersData.get(senderID) || {};
                userData.banned = 1;
                userData.reason = detectedWord;
                userData.dateAdded = time;
                await usersData.set(senderID, userData);

                // 𝖴𝗉𝖽𝖺𝗍𝖾 𝗀𝗅𝗈𝖻𝖺𝗅 𝖻𝖺𝗇 𝗅𝗂𝗌𝗍
                if (!global.data) global.data = {};
                if (!global.data.userBanned) global.data.userBanned = new Map();
                global.data.userBanned.set(senderID, {
                    reason: userData.reason,
                    dateAdded: userData.dateAdded
                });

                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖻𝖺𝗇𝗇𝖾𝖽 𝗎𝗌𝖾𝗋: ${userName} (${senderID})`);
            } catch (errSetData) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺 𝖿𝗈𝗋 𝖻𝖺𝗇:", errSetData);
                return;
            }

            // 𝖲𝖾𝗇𝖽 𝗐𝖺𝗋𝗇𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝗎𝗌𝖾𝗋
            const warningBody = [
                "» 𝖭𝗈𝗍𝗂𝖼𝖾 𝖿𝗋𝗈𝗆 𝖮𝗐𝗇𝖾𝗋 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 «",
                "",
                `${userName}, 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗌𝗒𝗌𝗍𝖾𝗆 𝖿𝗈𝗋 𝗎𝗌𝗂𝗇𝗀 𝗂𝗇𝖺𝗉𝗉𝗋𝗈𝗉𝗋𝗂𝖺𝗍𝖾 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾. 🚫`,
                "",
                `𝖱𝖾𝖺𝗌𝗈𝗇: "${detectedWord}"`,
                `𝖳𝗂𝗆𝖾: ${time}`
            ].join("\n");

            try {
                await api.sendMessage(warningBody, threadID);
            } catch (errSend) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗐𝖺𝗋𝗇𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", errSend);
            }

            // 𝖭𝗈𝗍𝗂𝖿𝗒 𝖺𝖽𝗆𝗂𝗇𝗌
            const adminMsg = [
                "=== 𝖡𝗈𝗍 𝖭𝗈𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 ===",
                "",
                `👤 𝖴𝗌𝖾𝗋: ${userName}`,
                `🆔 𝖴𝖨𝖣: ${senderID}`,
                `💬 𝖬𝖾𝗌𝗌𝖺𝗀𝖾: ${detectedWord}`,
                `⏰ 𝖳𝗂𝗆𝖾: ${time}`,
                "",
                `𝖡𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝗌𝗒𝗌𝗍𝖾𝗆. 🔒`
            ].join("\n");

            try {
                const admins = Array.isArray(global.config.ADMINBOT) ? global.config.ADMINBOT : [];
                if (admins.length === 0) {
                    console.warn("⚠️ 𝖭𝗈 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖾𝖽 𝗂𝗇 𝖠𝖣𝖬𝖨𝖭𝖡𝖮𝖳");
                }

                let adminNotifyCount = 0;
                for (const adminID of admins) {
                    try {
                        await api.sendMessage(adminMsg, adminID);
                        adminNotifyCount++;
                        console.log(`✅ 𝖭𝗈𝗍𝗂𝖿𝗂𝖾𝖽 𝖺𝖽𝗆𝗂𝗇: ${adminID}`);
                    } catch (errAdmin) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗇𝗈𝗍𝗂𝖿𝗒 𝖺𝖽𝗆𝗂𝗇 ${adminID}:`, errAdmin.message);
                    }
                }
                
                if (adminNotifyCount > 0) {
                    console.log(`📢 𝖭𝗈𝗍𝗂𝖿𝗂𝖾𝖽 ${adminNotifyCount} 𝖺𝖽𝗆𝗂𝗇(𝗌) 𝖺𝖻𝗈𝗎𝗍 𝗍𝗁𝖾 𝖻𝖺𝗇`);
                }
            } catch (errNotifyAll) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗐𝗁𝗂𝗅𝖾 𝗇𝗈𝗍𝗂𝖿𝗒𝗂𝗇𝗀 𝖺𝖽𝗆𝗂𝗇𝗌:", errNotifyAll);
            }

        } catch (err) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝖿𝗂𝗑𝗌𝗉𝖺𝗆-𝖼𝗁 𝗈𝗇𝖢𝗁𝖺𝗍:", err);
        }
    },

    onStart: async function ({ event, api, message }) {
        try {
            const msg = [
                "⚠️ 𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝖾𝖽 𝖲𝗒𝗌𝗍𝖾𝗆 𝖢𝗈𝗆𝗆𝖺𝗇𝖽",
                "",
                "𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗋𝗎𝗇𝗌 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗈𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖾𝗏𝖾𝗇𝗍𝗌 — 𝗒𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗇𝖾𝖾𝖽 𝗍𝗈 𝖼𝖺𝗅𝗅 𝗂𝗍 𝗆𝖺𝗇𝗎𝖺𝗅𝗅𝗒.",
                "",
                "𝖶𝗁𝖾𝗇 𝗎𝗌𝖾𝗋𝗌 𝗎𝗌𝖾 𝖻𝖺𝖽 𝗐𝗈𝗋𝖽𝗌 𝖺𝗀𝖺𝗂𝗇𝗌𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍, 𝗍𝗁𝖾𝗒 𝗐𝗂𝗅𝗅 𝖻𝖾 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖻𝖺𝗇𝗇𝖾𝖽. ✅",
                "",
                "𝖨𝖿 𝗒𝗈𝗎 𝖺𝗋𝖾 𝖺𝗇 𝖺𝖽𝗆𝗂𝗇 𝖺𝗇𝖽 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗎𝗉𝖽𝖺𝗍𝖾 𝗍𝗁𝖾 𝖻𝖺𝖽 𝗐𝗈𝗋𝖽𝗌 𝗅𝗂𝗌𝗍 𝗈𝗋 𝗆𝖺𝗇𝖺𝗀𝖾 𝖻𝖺𝗇𝗌, 𝖾𝖽𝗂𝗍 𝗍𝗁𝖾 𝗌𝖼𝗋𝗂𝗉𝗍."
            ].join("\n");

            await message.reply(msg);
        } catch (err) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝖿𝗂𝗑𝗌𝗉𝖺𝗆-𝖼𝗁 𝗈𝗇𝖲𝗍𝖺𝗋𝗍():", err);
        }
    }
};
