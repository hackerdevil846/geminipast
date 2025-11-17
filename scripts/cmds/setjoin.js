const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "setjoin",
        aliases: ["setwelcome", "joinconfig"],
        version: "1.1.0",
        role: 1,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑐𝑜𝑛𝑓𝑖𝑔",
        shortDescription: {
            en: "𝑆𝑒𝑡 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑟 𝐺𝐼𝐹 𝑓𝑜𝑟 𝑛𝑒𝑤 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
        },
        longDescription: {
            en: "𝐶𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑒 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑜𝑟 𝐺𝐼𝐹𝑠 𝑓𝑜𝑟 𝑛𝑒𝑤 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑗𝑜𝑖𝑛𝑖𝑛𝑔 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝"
        },
        guide: {
            en: "{p}setjoin [𝑡𝑒𝑥𝑡/𝑔𝑖𝑓] [𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑟 𝑢𝑟𝑙]"
        },
        countDown: 10,
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: function() {
        try {
            const cachePath = path.join(__dirname, "..", "events", "cache", "joinGif");
            if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
        } catch (error) {
            console.error("𝑆𝑒𝑡𝑗𝑜𝑖𝑛 𝑜𝑛𝐿𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        }
    },

    onStart: async function({ message, event, args, threadsData }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ");
            }

            const { threadID } = event;
            const msg = args.slice(1).join(" ");
            const data = (await threadsData.get(threadID)) || {};
            data.data = data.data || {};

            if (!args[0]) {
                return message.reply(
                    "❌ 𝑈𝑠𝑎𝑔𝑒:\n" +
                    "𝑠𝑒𝑡𝑗𝑜𝑖𝑛 𝑡𝑒𝑥𝑡 [𝑚𝑒𝑠𝑠𝑎𝑔𝑒]\n" +
                    "𝑠𝑒𝑡𝑗𝑜𝑖𝑛 𝑔𝑖𝑓 [𝑢𝑟𝑙]\n" +
                    "𝑠𝑒𝑡𝑗𝑜𝑖𝑛 𝑔𝑖𝑓 𝑟𝑒𝑚𝑜𝑣𝑒"
                );
            }

            switch (args[0].toLowerCase()) {
                case "text": {
                    if (!msg) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡ℎ𝑒 𝑡𝑒𝑥𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒!");
                    data.data.customJoin = msg;
                    await threadsData.set(threadID, data);

                    const preview = msg
                        .replace(/\{name}/g, "[𝑀𝑒𝑚𝑏𝑒𝑟 𝑁𝑎𝑚𝑒]")
                        .replace(/\{type}/g, "[𝑌𝑜𝑢/𝑌𝑜𝑢𝑟]")
                        .replace(/\{soThanhVien}/g, "[𝑀𝑒𝑚𝑏𝑒𝑟 𝐶𝑜𝑢𝑛𝑡]")
                        .replace(/\{threadName}/g, "[𝐺𝑟𝑜𝑢𝑝 𝑁𝑎𝑚𝑒]");

                    return message.reply(`✅ 𝑌𝑜𝑢𝑟 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑠𝑎𝑣𝑒𝑑! 𝑃𝑟𝑒𝑣𝑖𝑒𝑤 𝑏𝑒𝑙𝑜𝑤:\n\n${preview}`);
                }
                case "gif": {
                    const pathGif = path.join(__dirname, "..", "events", "cache", "joinGif", `${threadID}.gif`);

                    if (msg.toLowerCase() === "remove") {
                        if (!fs.existsSync(pathGif)) return message.reply("❌ 𝑌𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 ℎ𝑎𝑠 𝑛𝑜𝑡 𝑠𝑒𝑡 𝑎 𝑗𝑜𝑖𝑛 𝐺𝐼𝐹 𝑦𝑒𝑡");
                        fs.unlinkSync(pathGif);
                        return message.reply("✅ 𝐺𝑟𝑜𝑢𝑝 𝐺𝐼𝐹 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!");
                    }

                    if (!msg) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝐺𝐼𝐹 𝑈𝑅𝐿!");
                    if (!msg.match(/\.gif$/i)) return message.reply("❌ 𝑇ℎ𝑒 𝑈𝑅𝐿 𝑦𝑜𝑢 𝑒𝑛𝑡𝑒𝑟𝑒𝑑 𝑖𝑠 𝑖𝑛𝑣𝑎𝑙𝑖𝑑!");

                    try {
                        await global.utils.downloadFile(msg, pathGif);
                        return message.reply({
                            body: "✅ 𝐺𝐼𝐹 𝑠𝑎𝑣𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦, 𝑝𝑟𝑒𝑣𝑖𝑒𝑤:",
                            attachment: fs.createReadStream(pathGif)
                        });
                    } catch (e) {
                        console.error("𝐺𝐼𝐹 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", e);
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒, 𝑈𝑅𝐿 𝑚𝑎𝑦 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡 𝑜𝑟 𝑛𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟!");
                    }
                }
                default: {
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛! 𝑈𝑠𝑒 '𝑡𝑒𝑥𝑡' 𝑜𝑟 '𝑔𝑖𝑓'.");
                }
            }
        } catch (e) {
            console.error("𝑆𝑒𝑡𝑗𝑜𝑖𝑛 𝑒𝑟𝑟𝑜𝑟:", e);
            return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
        }
    }
};
