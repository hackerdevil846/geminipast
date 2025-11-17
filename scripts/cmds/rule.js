const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "rule",
        aliases: ["r", "নিয়ম"],
        version: "1.0.1",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑔𝑟𝑜𝑢𝑝",
        shortDescription: {
            en: "𝐺𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑠𝑦𝑠𝑡𝑒𝑚"
        },
        longDescription: {
            en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑟𝑢𝑙𝑒𝑠 𝑤𝑖𝑡ℎ 𝑎𝑑𝑑, 𝑙𝑖𝑠𝑡, 𝑎𝑛𝑑 𝑟𝑒𝑚𝑜𝑣𝑒 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛𝑎𝑙𝑖𝑡𝑦"
        },
        guide: {
            en: "{p}rule [𝑎𝑑𝑑/𝑙𝑖𝑠𝑡/𝑟𝑒𝑚𝑜𝑣𝑒/𝑎𝑙𝑙] [𝑡𝑒𝑥𝑡/𝐼𝐷]"
        },
        countDown: 5,
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: function() {
        try {
            const cacheDir = path.join(__dirname, "cache");
            const pathData = path.join(cacheDir, "rules.json");
            fs.ensureDirSync(cacheDir);
            if (!fs.existsSync(pathData)) fs.writeFileSync(pathData, "[]", "utf-8");
        } catch (err) {
            console.error("𝑅𝑢𝑙𝑒 𝑚𝑜𝑑𝑢𝑙𝑒 𝑜𝑛𝐿𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
        }
    },

    onStart: async function({ message, event, args, usersData, threadsData }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ");
            }

            const { threadID, messageID, senderID } = event;
            const cachePath = path.join(__dirname, "cache", "rules.json");
            let dataJson = [];

            // Load data safely
            try {
                const raw = fs.readFileSync(cachePath, "utf-8");
                dataJson = JSON.parse(raw || "[]");
                if (!Array.isArray(dataJson)) dataJson = [];
            } catch (err) {
                dataJson = [];
            }

            // Find or prepare thread record
            const threadIndex = dataJson.findIndex(item => item.threadID == threadID);
            const thisThread = threadIndex !== -1 ? dataJson[threadIndex] : { threadID, listRule: [] };

            // Content after the command verb
            const content = (args.slice(1)).join(" ").trim();

            // Check admin permissions
            const threadData = await threadsData.get(threadID);
            const isAdmin = threadData.adminIDs.includes(senderID);
            const userData = await usersData.get(senderID);
            const isBotAdmin = userData.role > 0;

            // Helper to save file
            const saveAndRespond = async (msg) => {
                try {
                    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
                    fs.writeFileSync(cachePath, JSON.stringify(dataJson, null, 4), "utf-8");
                } catch (err) {
                    console.error("𝑅𝑢𝑙𝑒 𝑚𝑜𝑑𝑢𝑙𝑒 𝑠𝑎𝑣𝑒 𝑒𝑟𝑟𝑜𝑟:", err);
                }
                await message.reply(msg);
            };

            // Main switch
            switch ((args[0] || "").toLowerCase()) {

                case "add": {
                    if (!isAdmin && !isBotAdmin) {
                        return message.reply("🚫 [𝑵𝒊𝒚𝒐𝒎] 𝑨𝒑𝒏𝒂𝒓 𝒂𝒓𝒐 𝒏𝒊𝒚𝒐𝒎 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒑𝒐𝒓𝒂 𝒌𝒉𝒐𝒎𝒐𝒕𝒂 𝒏𝒆𝒊!");
                    }
                    if (!content) {
                        return message.reply("⚠️ [𝑵𝒊𝒚𝒐𝒎] 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒔𝒉𝒐𝒏 𝒑𝒖𝒓𝒐𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒏𝒊!");
                    }

                    if (content.indexOf("\n") !== -1) {
                        const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                        for (const line of lines) thisThread.listRule.push(line);
                    } else {
                        thisThread.listRule.push(content);
                    }

                    return saveAndRespond("✅ [𝑵𝒊𝒚𝒐𝒎] 𝑵𝒐𝒕𝒖𝒏 𝒏𝒊𝒚𝒐𝒎 𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐! 📥");
                }

                case "list":
                case "all": {
                    if (!thisThread.listRule || thisThread.listRule.length === 0) {
                        return message.reply("ℹ️ [𝑵𝒊𝒚𝒐𝒎] 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒖𝒑𝒆𝒓 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊 𝒅𝒆𝒌𝒉𝒂𝒏𝒐𝒓 𝒋𝒐𝒏𝒏𝒐! 📭");
                    }

                    let msg = "=== 📜 𝐺𝑟𝑜𝑢𝑝 𝑅𝑢𝑙𝑒𝑠 ===\n\n";
                    thisThread.listRule.forEach((r, i) => {
                        msg += `${i + 1}/ ${r}\n`;
                    });
                    msg += `\n📌 𝑇𝑖𝑝: 𝐴𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑎𝑑𝑑/𝑟𝑒𝑚𝑜𝑣𝑒 𝑟𝑢𝑙𝑒𝑠 𝑢𝑠𝑖𝑛𝑔: ${this.config.name} 𝑎𝑑𝑑/𝑟𝑒𝑚𝑜𝑣𝑒 <𝑡𝑒𝑥𝑡|𝐼𝐷>`;
                    return message.reply(msg);
                }

                case "rm":
                case "remove":
                case "delete": {
                    if (!isAdmin && !isBotAdmin) {
                        return message.reply("🚫 [𝑵𝒊𝒚𝒐𝒎] 𝑵𝒊𝒚𝒐𝒎 𝒎𝒆𝒕𝒆 𝒑𝒆𝒕𝒆 𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒎𝒐𝒕𝒂 𝒏𝒆𝒊!");
                    }

                    if (content.toLowerCase() === "all") {
                        if (!thisThread.listRule || thisThread.listRule.length === 0) {
                            return message.reply("ℹ️ [𝑵𝒊𝒚𝒐𝒎] 𝑴𝒆𝒕𝒆 𝒅𝒆𝒐𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊!");
                        }

                        thisThread.listRule = [];
                        return saveAndRespond("🗑️ [𝑵𝒊𝒚𝒐𝒎] 𝑺𝒐𝒃 𝒏𝒊𝒚𝒐𝒎 𝒎𝒆𝒕𝒆 𝒅𝒆𝒐𝒂 𝒉𝒐𝒍𝒐! ✅");
                    }

                    const idx = parseInt(content);
                    if (!isNaN(idx) && idx > 0) {
                        if (!thisThread.listRule || thisThread.listRule.length === 0) {
                            return message.reply("ℹ️ [𝑵𝒊𝒚𝒐𝒎] 𝑴𝒆𝒕𝒆 𝒅𝒆𝒐𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊!");
                        }
                        if (idx > thisThread.listRule.length) {
                            return message.reply("⚠️ [𝑵𝒊𝒚𝒐𝒎] ভুল নম্বর!");
                        }

                        const removed = thisThread.listRule.splice(idx - 1, 1);
                        return saveAndRespond(`✅ [𝑵𝒊𝒚𝒐𝒎] ${idx} নম্বর নিয়ম মুছে ফেলা হইছে! ✂️\n\nমুছুন: ${removed[0]}`);
                    }

                    return message.reply("⚠️ [𝑵𝒊𝒚𝒐𝒎] সঠিক সিনট্যাক্স ব্যবহার করুন: rule add/list/remove <text|ID>");
                }

                default: {
                    if (thisThread.listRule && thisThread.listRule.length !== 0) {
                        let msg = "=== 📜 𝐺𝑟𝑜𝑢𝑝 𝑅𝑢𝑙𝑒𝑠 ===\n\n";
                        thisThread.listRule.forEach((r, i) => msg += `${i + 1}/ ${r}\n`);
                        msg += `\n✨ 𝑈𝑠𝑒: ${this.config.name} 𝑎𝑑𝑑/𝑙𝑖𝑠𝑡/𝑟𝑒𝑚𝑜𝑣𝑒`;
                        return message.reply(msg);
                    } else {
                        return message.reply("ℹ️ [𝑵𝒊𝒚𝒐𝒎] 𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒖𝒑𝒆𝒓 𝒌𝒐𝒏𝒐 𝒏𝒊𝒚𝒐𝒎 𝒏𝒆𝒊!");
                    }
                }
            }

        } catch (error) {
            console.error("𝑅𝑢𝑙𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
