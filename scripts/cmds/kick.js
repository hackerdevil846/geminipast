const fs = require("fs-extra");

/**
 * 𝐇𝐞𝐥𝐩𝐞𝐫 𝐅𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐭𝐨 𝐂𝐨𝐧𝐯𝐞𝐫𝐭 𝐓𝐞𝐱𝐭 𝐭𝐨 𝐁𝐨𝐥𝐝 𝐒𝐚𝐧𝐬-𝐬𝐞𝐫𝐢𝐟
 */
const toBold = (str) => {
    return str.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code + 120211); // A-Z
        if (code >= 97 && code <= 122) return String.fromCodePoint(code + 120205); // a-z
        if (code >= 48 && code <= 57) return String.fromCodePoint(code + 120764); // 0-9
        return char;
    });
};

module.exports = {
    config: {
        name: "kick",
        aliases: [],
        version: "2.0.0", // Upgraded version
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 1, // Admin Only
        category: "𝖦𝗋𝗈𝗎𝗉",
        shortDescription: {
            en: "𝐊𝐢𝐜𝐤 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩"
        },
        longDescription: {
            en: "𝐊𝐢𝐜𝐤 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐛𝐲 𝐭𝐚𝐠𝐠𝐢𝐧𝐠 𝐭𝐡𝐞𝐦 𝐨𝐫 𝐫𝐞𝐩𝐥𝐲𝐢𝐧𝐠 𝐭𝐨 𝐭𝐡𝐞𝐢𝐫 𝐦𝐞𝐬𝐬𝐚𝐠𝐞."
        },
        guide: {
            en: "{p}kick [@𝐭𝐚𝐠 | 𝐫𝐞𝐩𝐥𝐲]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, api, args }) {
        const { threadID, senderID, messageReply } = event;
        const botID = api.getCurrentUserID();

        try {
            // --- 𝟏. 𝐆𝐞𝐭 𝐓𝐡𝐫𝐞𝐚𝐝 & 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐈𝐧𝐟𝐨 ---
            let threadInfo;
            try {
                threadInfo = await api.getThreadInfo(threadID);
            } catch (err) {
                return message.reply(toBold("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐠𝐫𝐨𝐮𝐩 𝐝𝐚𝐭𝐚."));
            }

            if (!threadInfo) return message.reply(toBold("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐓𝐡𝐫𝐞𝐚𝐝."));

            const adminIDs = threadInfo.adminIDs.map(a => a.id);
            const isBotAdmin = adminIDs.includes(botID);
            const isSenderAdmin = adminIDs.includes(senderID);

            // --- 𝟐. 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐂𝐡𝐞𝐜𝐤𝐬 ---
            if (!isBotAdmin) {
                return message.reply(toBold("🛡️ 𝐁𝐨𝐭 𝐦𝐮𝐬𝐭 𝐛𝐞 𝐚𝐧 𝐀𝐝𝐦𝐢𝐧 𝐭𝐨 𝐤𝐢𝐜𝐤 𝐩𝐞𝐨𝐩𝐥𝐞!"));
            }

            if (!isSenderAdmin) {
                // Double check: Config role handles command access, but this checks group admin status
                return message.reply(toBold("⚠️ 𝐘𝐨𝐮 𝐦𝐮𝐬𝐭 𝐛𝐞 𝐚 𝐆𝐫𝐨𝐮𝐩 𝐀𝐝𝐦𝐢𝐧 𝐭𝐨 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬!"));
            }

            // --- 𝟑. 𝐈𝐝𝐞𝐧𝐭𝐢𝐟𝐲 𝐓𝐚𝐫𝐠𝐞𝐭𝐬 ---
            let targets = [];

            // A. Check Mentions/Tags
            if (Object.keys(event.mentions).length > 0) {
                targets = Object.keys(event.mentions);
            }
            // B. Check Reply
            else if (messageReply) {
                targets.push(messageReply.senderID);
            }
            // C. No target found
            else {
                return message.reply(toBold("📍 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝐬𝐨𝐦𝐞𝐨𝐧𝐞 𝐨𝐫 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐨 𝐤𝐢𝐜𝐤."));
            }

            // --- 𝟒. 𝐅𝐢𝐥𝐭𝐞𝐫 & 𝐏𝐫𝐨𝐜𝐞𝐬𝐬 𝐓𝐚𝐫𝐠𝐞𝐭𝐬 ---
            // Remove duplicates
            targets = [...new Set(targets)];

            let successCount = 0;
            let failCount = 0;
            let protectedCount = 0;

            // Notify processing if multiple targets
            if (targets.length > 1) {
                message.reply(toBold(`🔄 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 ${targets.length} 𝐮𝐬𝐞𝐫𝐬...`));
            }

            for (const targetID of targets) {
                // Safety 1: Don't kick Bot itself
                if (targetID === botID) {
                    message.reply(toBold("🤖 𝐈 𝐜𝐚𝐧𝐧𝐨𝐭 𝐤𝐢𝐜𝐤 𝐦𝐲𝐬𝐞𝐥𝐟!"));
                    protectedCount++;
                    continue;
                }

                // Safety 2: Don't kick the Sender (Anti-Suicide)
                if (targetID === senderID) {
                    message.reply(toBold("🚫 𝐘𝐨𝐮 𝐜𝐚𝐧𝐧𝐨𝐭 𝐤𝐢𝐜𝐤 𝐲𝐨𝐮𝐫𝐬𝐞𝐥𝐟!"));
                    protectedCount++;
                    continue;
                }

                // Safety 3: Don't kick other Admins
                if (adminIDs.includes(targetID)) {
                    protectedCount++;
                    continue;
                }

                try {
                    // Delay to prevent spam blocks (1 second)
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    await api.removeUserFromGroup(targetID, threadID);
                    successCount++;
                    
                } catch (e) {
                    console.error(`Kick Error ${targetID}:`, e);
                    failCount++;
                }
            }

            // --- 𝟓. 𝐅𝐢𝐧𝐚𝐥 𝐑𝐞𝐩𝐨𝐫𝐭 ---
            let msg = "";
            if (successCount > 0) {
                msg += toBold(`✅ 𝐊𝐢𝐜𝐤𝐞𝐝: ${successCount}\n`);
            }
            if (protectedCount > 0) {
                msg += toBold(`🛡️ 𝐒𝐤𝐢𝐩𝐩𝐞𝐝 (𝐀𝐝𝐦𝐢𝐧𝐬/𝐁𝐨𝐭): ${protectedCount}\n`);
            }
            if (failCount > 0) {
                msg += toBold(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝: ${failCount}\n`);
            }

            if (successCount === 0 && protectedCount === 0 && failCount === 0) {
                msg = toBold("❌ 𝐍𝐨 𝐚𝐜𝐭𝐢𝐨𝐧 𝐭𝐚𝐤𝐞𝐧.");
            }

            return message.reply(msg);

        } catch (error) {
            console.error("Critical Kick Error:", error);
            return message.reply(toBold("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠."));
        }
    }
};
