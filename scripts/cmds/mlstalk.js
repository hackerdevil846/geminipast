const axios = require("axios");
const { createCanvas } = require("canvas");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "mlstalk",
        aliases: ["mlinfo", "mlplayer"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        category: "𝑔𝑎𝑚𝑒",
        shortDescription: {
            en: "𝑀𝑜𝑏𝑎𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑝𝑙𝑎𝑦𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
        },
        longDescription: {
            en: "𝑀𝑜𝑏𝑎𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑝𝑙𝑎𝑦𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑑𝑒𝑘ℎ𝑎𝑛"
        },
        guide: {
            en: "{p}mlstalk [𝑖𝑑 | 𝑠𝑒𝑟𝑣𝑒𝑟]"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("canvas");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            let text = args.join(" ");
            
            if (!text) {
                return message.reply("𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒏𝒋𝒂 𝒊𝒅 𝒂𝒓 𝒔𝒆𝒓𝒗𝒆𝒓 𝒏𝒂𝒎 𝒅𝒆𝒘𝒂𝒓 𝒅𝒐𝒓𝒌𝒂𝒓 | 𝒖𝒔𝒂𝒈𝒆: 𝒎𝒍𝒔𝒕𝒂𝒍𝒌 12345 | 1234");
            }
            
            const text1 = text.substr(0, text.indexOf("|")).trim();
            const text2 = text.split("|").pop().trim();
            
            if (!text1 || !text2) {
                return message.reply("𝒂𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒏𝒋𝒂 𝒊𝒅 𝒂𝒓 𝒔𝒆𝒓𝒗𝒆𝒓 𝒏𝒂𝒎 𝒕𝒉𝒊𝒌 𝒗𝒂𝒃𝒉𝒆 𝒅𝒆𝒘𝒂 𝒉𝒐𝒚𝒏𝒊 | 𝒖𝒔𝒂𝒈𝒆: 𝒎𝒍𝒔𝒕𝒂𝒍𝒌 12345 | 1234");
            }
            
            const playerId = text1;
            const serverId = text2;
            const playerName = "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑃𝑙𝑎𝑦𝑒𝑟";

            // Create a blank canvas for the player info card
            const canvas = createCanvas(700, 300);
            const ctx = canvas.getContext("2d");

            // Background
            ctx.fillStyle = "#23272A";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Title
            ctx.font = "𝑏𝑜𝑙𝑑 40𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText("🎮 𝑀𝑜𝑏𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑃𝑙𝑎𝑦𝑒𝑟 𝐼𝑛𝑓𝑜 🎮", canvas.width / 2, 60);

            // Player ID and Server ID
            ctx.font = "25𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
            ctx.fillStyle = "#B0B0B0";
            ctx.textAlign = "left";
            ctx.fillText(`𝑃𝑙𝑎𝑦𝑒𝑟 𝐼𝐷: ${playerId}`, 50, 130);
            ctx.fillText(`𝑆𝑒𝑟𝑣𝑒𝑟 𝐼𝐷: ${serverId}`, 50, 170);

            // Player Name (Placeholder)
            ctx.font = "𝑏𝑜𝑙𝑑 30𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
            ctx.fillStyle = "#00BFFF";
            ctx.fillText(`𝑃𝑙𝑎𝑦𝑒𝑟 𝑁𝑎𝑚𝑒: ${playerName}`, 50, 230);

            // Warning message
            ctx.font = "20𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
            ctx.fillStyle = "#FFD700";
            ctx.textAlign = "center";
            ctx.fillText("⚠️ 𝑃𝑙𝑎𝑦𝑒𝑟 𝑑𝑎𝑡𝑎 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑑𝑢𝑒 𝑡𝑜 𝐴𝑃𝐼 𝑙𝑖𝑚𝑖𝑡𝑎𝑡𝑖𝑜𝑛𝑠.", canvas.width / 2, 270);

            const buffer = canvas.toBuffer();
            fs.writeFileSync(__dirname + "/cache/mlstalk_info.png", buffer);

            await message.reply({
                body: `✨ 𝑀𝑜𝑏𝑎𝑖𝑙𝑒 𝐿𝑒𝑔𝑒𝑛𝑑𝑠 𝑝𝑙𝑎𝑦𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑 ✨\n\n🔥 𝐶𝑟𝑒𝑑𝑖𝑡𝑠: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 🔥`,
                attachment: fs.createReadStream(__dirname + "/cache/mlstalk_info.png")
            });

            fs.unlinkSync(__dirname + "/cache/mlstalk_info.png");

        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑝𝑙𝑎𝑦𝑒𝑟 𝑖𝑛𝑓𝑜 𝑐𝑎𝑟𝑑:", error);
            await message.reply("❌ 𝑆𝑜𝑟𝑟𝑦, 𝑎𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑝𝑙𝑎𝑦𝑒𝑟 𝑖𝑛𝑓𝑜 𝑐𝑎𝑟𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
