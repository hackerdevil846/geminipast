/**
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "noprefix",
        aliases: ["autoresponse"],
        version: "1.0.3",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💬 𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑡𝑟𝑖𝑔𝑔𝑒𝑟 𝑤𝑜𝑟𝑑𝑠"
        },
        longDescription: {
            en: "𝑅𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑡𝑜 𝑐𝑒𝑟𝑡𝑎𝑖𝑛 𝑡𝑟𝑖𝑔𝑔𝑒𝑟 𝑤𝑜𝑟𝑑𝑠 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑛𝑒𝑒𝑑𝑖𝑛𝑔 𝑝𝑟𝑒𝑓𝑖𝑥"
        },
        category: "𝑛𝑜𝑝𝑟𝑒𝑓𝑖𝑥",
        guide: {
            en: "𝑇𝑟𝑖𝑔𝑔𝑒𝑟 𝑤𝑜𝑟𝑑𝑠: 𝑓𝑢𝑐𝑘, 𝑝𝑎𝑘 𝑦𝑢, 𝑝𝑎𝑘𝑢, 𝑒𝑡𝑐."
        },
        countDown: 5,
        dependencies: {
            "fs-extra": ""
        }
    },

    onLoad: function () {
        try {
            // Dependency check
            require("fs-extra");
            
            // Create directory if it doesn't exist during bot startup
            const gifDir = path.join(__dirname, 'noprefix');
            if (!fs.existsSync(gifDir)) {
                fs.mkdirSync(gifDir, { recursive: true });
                console.log('📁 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑛𝑜𝑝𝑟𝑒𝑓𝑖𝑥 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦');
            }
        } catch (e) {
            console.log('❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦');
        }
    },

    onChat: async function ({ message, event, api }) {
        try {
            const { threadID, messageID, body, senderID } = event;

            if (!body || senderID === api.getCurrentUserID()) return;

            const triggers = [
                "fuck", "pak yu", "pak you", "pakyu", "pak u", "fyoutoo",
                "f u", "fuck you", "f*ck", "paku", "pack you", "fak you",
                "fock", "fack", "fak", "fuk", "fock you", "fack you"
            ];

            const messageText = body.toLowerCase().trim();
            const isTriggered = triggers.some(trigger =>
                messageText.includes(trigger.toLowerCase())
            );

            if (isTriggered) {
                const gifPath = path.join(__dirname, 'noprefix', 'fuck.gif');
                const responseMessage = `💢 𝑉𝑎𝑖𝑦𝑎 𝑜𝑟 𝐴𝑝𝑝𝑖 😏
𝐴𝑝𝑛𝑎𝑟𝑒 𝑎𝑘𝑡𝑜 𝑙𝑜𝑗𝑗𝑎 𝑘𝑜𝑟𝑒𝑛...
𝐴𝑚𝑎𝑘𝑒 𝑒𝑖𝑟𝑜𝑘𝑜𝑚 𝑤𝑜𝑟𝑑 𝑔𝑜𝑙𝑎 𝑏𝑜𝑙𝑏𝑒𝑛 𝑛𝑎ℎ 𝑝𝑙𝑒𝑎𝑠𝑒... 😏`;

                if (fs.existsSync(gifPath)) {
                    await message.reply({
                        body: responseMessage,
                        attachment: fs.createReadStream(gifPath)
                    });
                } else {
                    await message.reply(responseMessage);
                    console.warn(`⚠️ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝐺𝐼𝐹 𝑎𝑡: ${gifPath}`);
                }
            }
        } catch (error) {
            console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑛𝑜𝑝𝑟𝑒𝑓𝑖𝑥 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
            await message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑖𝑛𝑑 𝑦𝑜𝑢𝑟 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒! 😏");
        }
    },

    onStart: async function ({ message }) {
        try {
            await message.reply("✅ 𝑁𝑜𝑝𝑟𝑒𝑓𝑖𝑥 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑠 𝑎𝑐𝑡𝑖𝑣𝑒!");
        } catch (error) {
            console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑛𝑜𝑝𝑟𝑒𝑓𝑖𝑥 𝑠𝑡𝑎𝑟𝑡:", error);
        }
    }
};
*/
