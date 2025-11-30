const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "approve",
        aliases: [],
        version: "2.1.0", // Ultra Modified Version
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        countDown: 5,
        role: 2, // Admin/Owner only
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        shortDescription: {
            en: "✅ 𝐌𝐚𝐧𝐚𝐠𝐞 𝐆𝐫𝐨𝐮𝐩 𝐀𝐩𝐩𝐫𝐨𝐯𝐚𝐥𝐬"
        },
        longDescription: {
            en: "Approve groups, view pending requests, and manage access control with Atomic UI. Includes Auto-Notification."
        },
        guide: {
            en: "{p}approve [list/pending/del/id]\n{p}approve <id> (to approve)\n{p}approve (inside a group to approve it)"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // --- 1. Setup & Paths ---
            const { threadID } = event;
            const cacheDir = path.join(__dirname, "cache");
            const approvedPath = path.join(cacheDir, "approvedThreads.json");
            const pendingPath = path.join(cacheDir, "pendingThreads.json");

            // Ensure directory and files exist
            await fs.ensureDir(cacheDir);
            if (!fs.existsSync(approvedPath)) await fs.writeJson(approvedPath, []);
            if (!fs.existsSync(pendingPath)) await fs.writeJson(pendingPath, []);

            // Read Data (Async for performance)
            let approved = await fs.readJson(approvedPath);
            let pending = await fs.readJson(pendingPath);

            // --- 2. Arguments Handling ---
            const cmd = args[0] ? args[0].toLowerCase() : "";
            const param = args[1];

            // --- 3. Help Menu ---
            if (cmd === "help" || cmd === "h") {
                return message.reply(
                    `╭──────『 𝐀𝐏𝐏𝐑𝐎𝐕𝐄 』──────╮\n` +
                    `│\n` +
                    `│ 🔰 𝐔𝐬𝐚𝐠𝐞:\n` +
                    `│ • {p}app list [page]\n` +
                    `│ • {p}app pending [page]\n` +
                    `│ • {p}app del <id>\n` +
                    `│ • {p}app <id> (Approve ID)\n` +
                    `│ • {p}app (Approve current)\n` +
                    `│\n` +
                    `│ 📌 𝐒𝐭𝐚𝐭𝐬:\n` +
                    `│ • Active: ${approved.length}\n` +
                    `│ • Pending: ${pending.length}\n` +
                    `│\n` +
                    `╰──────────────────────────╯`
                );
            }

            // --- 4. LIST COMMAND (With Real Names & Pagination) ---
            if (cmd === "list" || cmd === "l") {
                if (approved.length === 0) return message.reply("❌ 𝐄𝐦𝐩𝐭𝐲: No approved groups found.");

                const page = parseInt(param || args[1]) || 1;
                const limit = 10;
                const totalPages = Math.ceil(approved.length / limit);
                
                if (page < 1 || page > totalPages) return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐏𝐚𝐠𝐞. Total pages: ${totalPages}`);

                const start = (page - 1) * limit;
                const end = start + limit;
                const list = approved.slice(start, end);

                let msg = `╭──『 𝐀𝐏𝐏𝐑𝐎𝐕𝐄𝐃 [${page}/${totalPages}] 』──╮\n│\n`;
                
                // Fetch Names Logic
                for (let i = 0; i < list.length; i++) {
                    const tid = list[i];
                    let name = "Unknown Group";
                    try {
                        const tInfo = await api.getThreadInfo(tid);
                        name = tInfo.threadName || "Unnamed";
                    } catch (e) {
                        name = "Bot Kicked/Error";
                    }

                    msg += `│ ${start + i + 1}. ${name.substring(0, 20)}\n`;
                    msg += `│ 🆔 ${tid}\n│\n`;
                }
                msg += `╰──────────────────────────╯`;
                return message.reply(msg);
            }

            // --- 5. PENDING COMMAND (With Pagination) ---
            if (cmd === "pending" || cmd === "p") {
                if (pending.length === 0) return message.reply("✅ 𝐂𝐥𝐞𝐚𝐧: No pending requests.");

                const page = parseInt(param || args[1]) || 1;
                const limit = 10;
                const totalPages = Math.ceil(pending.length / limit);
                
                if (page < 1 || page > totalPages) return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐏𝐚𝐠𝐞. Total pages: ${totalPages}`);

                const start = (page - 1) * limit;
                const list = pending.slice(start, start + limit);

                let msg = `╭──『 𝐏𝐄𝐍𝐃𝐈𝐍𝐆 [${page}/${totalPages}] 』──╮\n│\n`;
                for (let i = 0; i < list.length; i++) {
                    const tid = list[i];
                    msg += `│ ${start + i + 1}. ID: ${tid}\n`;
                }
                msg += `│\n╰──────────────────────────╯`;
                return message.reply(msg);
            }

            // --- 6. DELETE COMMAND ---
            if (cmd === "del" || cmd === "remove" || cmd === "d") {
                const targetID = param || threadID; // Default to current thread if no ID given
                
                if (!approved.includes(targetID)) {
                    return message.reply("❌ 𝐄𝐫𝐫𝐨𝐫: This group is not in the approved list.");
                }

                const newApproved = approved.filter(id => id !== targetID);
                await fs.writeJson(approvedPath, newApproved, { spaces: 2 });

                return message.reply(`🗑️ 𝐑𝐞𝐦𝐨𝐯𝐞𝐝: Group ${targetID} has been removed from approved list.`);
            }

            // --- 7. APPROVE COMMAND ---
            // If the command is not list/pending/del, treat it as an ID to approve
            let targetID = cmd;
            
            // Check if cmd is empty (User typed just "approve") -> Approve Current Group
            if (!targetID || targetID === "") {
                targetID = threadID;
            }

            // Validate ID (Must be numeric)
            if (isNaN(targetID)) {
                return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐈𝐃. Use: ${global.config.PREFIX}approve <threadID>`);
            }

            // Check duplicate
            if (approved.includes(targetID)) {
                return message.reply("⚠️ 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐀𝐩𝐩𝐫𝐨𝐯𝐞𝐝: This group is already in the database.");
            }

            // Add to Approved List
            approved.push(targetID);
            await fs.writeJson(approvedPath, approved, { spaces: 2 });

            // Remove from Pending if exists
            if (pending.includes(targetID)) {
                const newPending = pending.filter(id => id !== targetID);
                await fs.writeJson(pendingPath, newPending, { spaces: 2 });
            }

            // Success Message to Admin
            await message.reply(
                `✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐀𝐩𝐩𝐫𝐨𝐯𝐞𝐝!\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `🆔 𝐓𝐈𝐃: ${targetID}\n` +
                `📂 𝐓𝐨𝐭𝐚𝐥 𝐀𝐩𝐩𝐫𝐨𝐯𝐞𝐝: ${approved.length}`
            );

            // --- 8. Auto Notification to the Group ---
            api.sendMessage(
                `╭──────『 𝐀𝐏𝐏𝐑𝐎𝐕𝐄𝐃 』──────╮\n` +
                `│\n` +
                `│ ✅ 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬!\n` +
                `│ This group has been approved\n` +
                `│ by the administrator.\n` +
                `│\n` +
                `│ 🤖 𝐁𝐨𝐭 is now fully active.\n` +
                `│\n` +
                `╰──────────────────────────╯`, 
                targetID
            ).catch((e) => {
                console.log(`Could not send notification to ${targetID} (Bot might not be in group)`);
            });

        } catch (error) {
            console.error("Approve Error:", error);
            message.reply("❌ 𝐂𝐫𝐢𝐭𝐢𝐜𝐚𝐥 𝐄𝐫𝐫𝐨𝐫: " + error.message);
        }
    }
};
