const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "note",
        aliases: ["notes", "notepad"],
        version: "2.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "📝 𝑃𝑟𝑜𝑡𝑖 𝑔𝑟𝑜𝑢𝑝𝑒𝑟 𝑗𝑜𝑛𝑛𝑜 𝑛𝑜𝑡𝑒 𝑏𝑜𝑠ℎ𝑎𝑛𝑜"
        },
        longDescription: {
            en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑛𝑜𝑡𝑒𝑠 𝑓𝑜𝑟 𝑖𝑚𝑝𝑜𝑟𝑡𝑎𝑛𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟𝑠"
        },
        category: "𝑏𝑜𝑥 𝑐ℎ𝑎𝑡",
        guide: {
            en: "{p}note [𝑎𝑑𝑑/𝑟𝑒𝑚𝑜𝑣𝑒/𝑙𝑖𝑠𝑡] [𝑛𝑜𝑡𝑒]"
        },
        countDown: 5,
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: function() {
        try {
            // Dependency check
            require("fs-extra");
            require("path");
            
            const filePath = path.join(__dirname, "cache", "notes.json");
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, "[]", "utf-8");
            }
        } catch (e) {
            console.log("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑝𝑎𝑡ℎ");
        }
    },

    onStart: async function({ message, event, args, threadsData }) {
        try {
            const { threadID, messageID, senderID } = event;
            const { readFileSync, writeFileSync } = fs;
            const filePath = path.join(__dirname, "cache", "notes.json");
            
            let notesData = JSON.parse(readFileSync(filePath, "utf-8"));
            let threadNotes = notesData.find(t => t.threadID === threadID) || { threadID, notes: [] };
            const action = args[0]?.toLowerCase();
            const content = args.slice(1).join(" ").trim();

            // Check admin permission
            const threadInfo = await threadsData.get(threadID);
            const isAdmin = threadInfo.adminIDs.includes(senderID);

            switch (action) {
                case "add":
                    if (!isAdmin) return message.reply("⚠️ | 𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑑𝑒𝑛𝑖𝑒𝑑! 𝑂𝑛𝑙𝑦 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑚𝑎𝑛𝑎𝑔𝑒 𝑛𝑜𝑡𝑒𝑠.");
                    if (!content) return message.reply("📝 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑛𝑜𝑡𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡!");
                    
                    threadNotes.notes.push({
                        id: Date.now(),
                        content,
                        author: senderID,
                        timestamp: new Date().toISOString()
                    });
                    
                    await message.reply("✅ | 𝑁𝑜𝑡𝑒 𝑎𝑑𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!");
                    break;
                
                case "list":
                case "all":
                    if (threadNotes.notes.length === 0) {
                        return message.reply("📭 | 𝑁𝑜 𝑛𝑜𝑡𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
                    }
                    
                    let noteList = "📋 𝐺𝑅𝑂𝑈𝑃 𝑁𝑂𝑇𝐸𝑆 📋\n\n";
                    threadNotes.notes.forEach((note, index) => {
                        noteList += `⦿ ${index + 1}. ${note.content}\n`;
                    });
                    noteList += `\n» 𝑇𝑜𝑡𝑎𝑙 𝑛𝑜𝑡𝑒𝑠: ${threadNotes.notes.length} «`;
                    await message.reply(noteList);
                    return;
                
                case "rm":
                case "remove":
                case "delete":
                    if (!isAdmin) return message.reply("⚠️ | 𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑑𝑒𝑛𝑖𝑒𝑑! 𝑂𝑛𝑙𝑦 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑚𝑎𝑛𝑎𝑔𝑒 𝑛𝑜𝑡𝑒𝑠.");
                    if (threadNotes.notes.length === 0) {
                        return message.reply("📭 | 𝑁𝑜 𝑛𝑜𝑡𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
                    }
                    
                    if (content === "all") {
                        threadNotes.notes = [];
                        await message.reply("🧹 | 𝐴𝑙𝑙 𝑛𝑜𝑡𝑒𝑠 𝑐𝑙𝑒𝑎𝑟𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!");
                    } else if (!isNaN(content)) {
                        const index = parseInt(content) - 1;
                        if (index >= 0 && index < threadNotes.notes.length) {
                            threadNotes.notes.splice(index, 1);
                            await message.reply(`🗑️ | 𝑁𝑜𝑡𝑒 ${index + 1} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑚𝑜𝑣𝑒𝑑!`);
                        } else {
                            await message.reply("❌ | 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑛𝑜𝑡𝑒 𝑛𝑢𝑚𝑏𝑒𝑟!");
                        }
                    } else {
                        await message.reply("❌ | 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑛𝑜𝑡𝑒 𝑛𝑢𝑚𝑏𝑒𝑟!");
                    }
                    break;
                
                default:
                    const helpText = `📝 𝑁𝑜𝑡𝑒 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑎𝑔𝑒:\n\n» .𝑛𝑜𝑡𝑒 𝑎𝑑𝑑 [𝑡𝑒𝑥𝑡] - 𝐴𝑑𝑑 𝑛𝑒𝑤 𝑛𝑜𝑡𝑒\n» .𝑛𝑜𝑡𝑒 𝑙𝑖𝑠𝑡 - 𝑆ℎ𝑜𝑤 𝑎𝑙𝑙 𝑛𝑜𝑡𝑒𝑠\n» .𝑛𝑜𝑡𝑒 𝑟𝑒𝑚𝑜𝑣𝑒 [𝑛𝑢𝑚𝑏𝑒𝑟] - 𝐷𝑒𝑙𝑒𝑡𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑛𝑜𝑡𝑒\n» .𝑛𝑜𝑡𝑒 𝑟𝑒𝑚𝑜𝑣𝑒 𝑎𝑙𝑙 - 𝐶𝑙𝑒𝑎𝑟 𝑎𝑙𝑙 𝑛𝑜𝑡𝑒𝑠`;
                    await message.reply(helpText);
                    return;
            }
            
            // Update database
            if (!notesData.some(t => t.threadID === threadID)) {
                notesData.push(threadNotes);
            } else {
                notesData = notesData.map(t => 
                    t.threadID === threadID ? threadNotes : t
                );
            }
            
            writeFileSync(filePath, JSON.stringify(notesData, null, 4), "utf-8");
            
        } catch (error) {
            console.error("❌ 𝑁𝑜𝑡𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
        }
    }
};
