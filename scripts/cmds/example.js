module.exports.config = {
    name: "nameCommand",
    aliases: ["alias1", "alias2"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑔𝑟𝑜𝑢𝑝",
    shortDescription: {
        en: "✨ 𝐵𝑙𝑎 𝑏𝑙𝑎 𝑏𝑜𝑙𝑏𝑜 𝑒𝑘ℎ𝑎𝑛𝑒 ✨"
    },
    longDescription: {
        en: "✨ 𝐵𝑙𝑎 𝑏𝑙𝑎 𝑏𝑜𝑙𝑏𝑜 𝑒𝑘ℎ𝑎𝑛𝑒 - 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛 ✨"
    },
    guide: {
        en: "{p}nameCommand [🔄 𝑜𝑝𝑡𝑖𝑜𝑛] [📝 𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    },
    envConfig: {
        // 𝐸𝑛𝑣𝑖𝑟𝑜𝑛𝑚𝑒𝑛𝑡 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛𝑠
    }
};

module.exports.languages = {
    "en": {
        "message": "🌟 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑎 𝑠𝑎𝑚𝑝𝑙𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒!"
    }
};

module.exports.onLoad = function() {
    console.log("✅ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
};

module.exports.onStart = async function({ message, args, event, api, usersData, threadsData, global }) {
    try {
        // Check dependencies
        if (typeof require !== 'undefined') {
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }
        }

        const { message: msgText } = this.languages["en"];
        await message.reply({
            body: `🎉 ${msgText}\n📦 𝐴𝑟𝑔𝑢𝑚𝑒𝑛𝑡𝑠: ${args.join(" ")}\n🆔 𝑇ℎ𝑟𝑒𝑎𝑑𝐼𝐷: ${event.threadID}`,
            mentions: [{
                tag: await usersData.getName(event.senderID),
                id: event.senderID
            }]
        });

    } catch (error) {
        console.log("❌ 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("😿 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑!");
    }
};

module.exports.onChat = async function({ event, message }) {
    // 𝐴𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑒𝑥𝑎𝑚𝑝𝑙𝑒
    if (event.body?.toLowerCase().includes("hello bot")) {
        await message.reply("𝐻𝑒𝑙𝑙𝑜! 👋 𝐻𝑜𝑤 𝑐𝑎𝑛 𝐼 ℎ𝑒𝑙𝑝 𝑦𝑜𝑢?");
    }
};

module.exports.onReply = async function({ event, message, handleReply }) {
    // 𝑅𝑒𝑝𝑙𝑦 ℎ𝑎𝑛𝑑𝑙𝑒𝑟
    await message.reply("📩 𝑅𝑒𝑝𝑙𝑦 ℎ𝑎𝑛𝑑𝑙𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!");
};

module.exports.onReaction = async function({ event, message }) {
    // 𝑅𝑒𝑎𝑐𝑡𝑖𝑜𝑛 ℎ𝑎𝑛𝑑𝑙𝑒𝑟
    await message.reply("👍 𝑅𝑒𝑎𝑐𝑡𝑖𝑜𝑛 ℎ𝑎𝑛𝑑𝑙𝑒𝑑!");
};

module.exports.onEvent = async function({ event, message }) {
    // 𝐸𝑣𝑒𝑛𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟
    if (event.logMessageType === "log:subscribe") {
        await message.reply("👋 𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝!");
    }
};
