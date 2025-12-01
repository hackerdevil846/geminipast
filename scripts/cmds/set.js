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
        name: "set",
        version: "2.1.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽", // Modified & Fixed
        shortDescription: {
            en: "𝐌𝐚𝐧𝐚𝐠𝐞 𝐔𝐬𝐞𝐫 𝐃𝐚𝐭𝐚 (𝐌𝐨𝐧𝐞𝐲/𝐄𝐗𝐏)"
        },
        longDescription: {
            en: "𝐒𝐞𝐭 𝐦𝐨𝐧𝐞𝐲, 𝐞𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞 𝐩𝐨𝐢𝐧𝐭𝐬, 𝐨𝐫 𝐧𝐚𝐦𝐞 𝐟𝐨𝐫 𝐚𝐧𝐲 𝐮𝐬𝐞𝐫 (𝐀𝐝𝐦𝐢𝐧 𝐎𝐧𝐥𝐲)."
        },
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        guide: {
            en: "{p}set money [amount] <@tag/reply>\n{p}set exp [amount] <@tag/reply>\n{p}set name [new name] <@tag/reply>"
        },
        role: 2 // Admin/Bot Owner
    },

    onStart: async function ({ api, event, args, Users, Currencies }) {
        const { threadID, senderID, messageReply, mentions } = event;

        try {
            // --- 𝟏. 𝐀𝐝𝐯𝐚𝐧𝐜𝐞𝐝 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐂𝐡𝐞𝐜𝐤 ---
            // Checks both GOD (Owner) and ADMINBOT lists from config.json
            const GOD = global.config.GOD || [];
            const ADMINS = global.config.ADMINBOT || [];
            
            if (!GOD.includes(senderID) && !ADMINS.includes(senderID)) {
                return api.sendMessage(toBold("⛔ 𝐀𝐜𝐜𝐞𝐬𝐬 𝐃𝐞𝐧𝐢𝐞𝐝: 𝐘𝐨𝐮 𝐚𝐫𝐞 𝐧𝐨𝐭 𝐚𝐧 𝐀𝐝𝐦𝐢𝐧!"), threadID);
            }

            // --- 𝟐. 𝐈𝐝𝐞𝐧𝐭𝐢𝐟𝐲 𝐓𝐚𝐫𝐠𝐞𝐭 ---
            let targetID = senderID; // Default to self
            
            if (messageReply) {
                targetID = messageReply.senderID;
            } else if (Object.keys(mentions).length > 0) {
                targetID = Object.keys(mentions)[0];
            }

            // Get target name safely
            let targetName = await Users.getNameUser(targetID);

            // --- 𝟑. 𝐏𝐚𝐫𝐬𝐞 𝐈𝐧𝐩𝐮𝐭 ---
            const type = args[0]?.toLowerCase();
            const value = args[1]; // For money/exp amount
            
            // Special handling for 'name' which might have spaces
            const nameValue = args.slice(1).join(" "); 
            
            // Remove mention text from args if present to clean up value parsing
            const cleanValue = value ? value.replace(/<@!?[0-9]+>/g, "").trim() : "0";

            if (!type) {
                return api.sendMessage(toBold(
                    "⚠️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐔𝐬𝐚𝐠𝐞!\n\n" +
                    "🔹 set money [amount]\n" +
                    "🔹 set exp [amount]\n" +
                    "🔹 set name [text]"
                ), threadID);
            }

            // --- 𝟒. 𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐀𝐜𝐭𝐢𝐨𝐧𝐬 ---
            switch (type) {
                case "money":
                case "balance": {
                    const amount = parseInt(cleanValue);
                    if (isNaN(amount)) return api.sendMessage(toBold("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫."), threadID);

                    // Using Currencies is safer than usersData
                    await Currencies.setData(targetID, { money: amount });
                    
                    return api.sendMessage(toBold(`💰 𝐒𝐞𝐭 𝐌𝐨𝐧𝐞𝐲: ${amount}\n👤 𝐔𝐬𝐞𝐫: ${targetName}`), threadID);
                }

                case "exp":
                case "xp":
                case "level": {
                    const amount = parseInt(cleanValue);
                    if (isNaN(amount)) return api.sendMessage(toBold("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫."), threadID);

                    await Currencies.setData(targetID, { exp: amount });
                    
                    return api.sendMessage(toBold(`🌟 𝐒𝐞𝐭 𝐄𝐗𝐏: ${amount}\n👤 𝐔𝐬𝐞𝐫: ${targetName}`), threadID);
                }

                case "name": {
                    if (!nameValue) return api.sendMessage(toBold("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐧𝐚𝐦𝐞."), threadID);

                    // Change nickname in the group
                    await api.changeNickname(nameValue, threadID, targetID);
                    
                    // Update database
                    await Users.setData(targetID, { name: nameValue });

                    return api.sendMessage(toBold(`🏷️ 𝐍𝐚𝐦𝐞 𝐂𝐡𝐚𝐧𝐠𝐞𝐝: ${nameValue}\n👤 𝐔𝐬𝐞𝐫: ${targetName}`), threadID);
                }

                default: {
                    return api.sendMessage(toBold("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐓𝐲𝐩𝐞! 𝐔𝐬𝐞: 𝐦𝐨𝐧𝐞𝐲, 𝐞𝐱𝐩, 𝐨𝐫 𝐧𝐚𝐦𝐞."), threadID);
                }
            }

        } catch (error) {
            console.error("Set Command Error:", error);
            return api.sendMessage(toBold("⚠️ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐮𝐩𝐝𝐚𝐭𝐢𝐧𝐠 𝐝𝐚𝐭𝐚."), threadID);
        }
    }
};
