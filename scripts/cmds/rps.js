module.exports = {
    config: {
        name: "rps",
        aliases: ["rockpaperscissors", "game"],
        version: "2.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑓𝑢𝑛",
        shortDescription: {
            en: "𝑅𝑜𝑐𝑘-𝑝𝑎𝑝𝑒𝑟-𝑠𝑐𝑖𝑠𝑠𝑜𝑟𝑠 𝑔𝑎𝑚𝑒 (𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑠 𝑡𝑒𝑥𝑡 & 𝑒𝑚𝑜𝑗𝑖)"
        },
        longDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑟𝑜𝑐𝑘-𝑝𝑎𝑝𝑒𝑟-𝑠𝑐𝑖𝑠𝑠𝑜𝑟𝑠 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑢𝑠𝑖𝑛𝑔 𝑡𝑒𝑥𝑡 𝑜𝑟 𝑒𝑚𝑜𝑗𝑖"
        },
        guide: {
            en: "{p}rps [𝑟𝑜𝑐𝑘|𝑝𝑎𝑝𝑒𝑟|𝑠𝑐𝑖𝑠𝑠𝑜𝑟𝑠] 𝑜𝑟 [✊|✋|✌️]"
        },
        countDown: 5,
        dependencies: {}
    },

    onStart: async function({ message, event, args }) {
        try {
            const textChoices = ["rock", "paper", "scissors"];
            const emojiChoices = ["✊", "✋", "✌️"];

            const fullMap = {
                "rock": "✊",
                "paper": "✋",
                "scissors": "✌️",
                "✊": "rock",
                "✋": "paper",
                "✌️": "scissors"
            };

            const userInput = args[0]?.toLowerCase();
            if (!userInput || (!textChoices.includes(userInput) && !emojiChoices.includes(userInput))) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒: 𝑟𝑜𝑐𝑘, 𝑝𝑎𝑝𝑒𝑟, 𝑠𝑐𝑖𝑠𝑠𝑜𝑟𝑠 𝑜𝑟 ✊, ✋, ✌️");
            }

            const userChoice = fullMap[userInput];
            const botChoice = textChoices[Math.floor(Math.random() * 3)];

            const userEmoji = fullMap[userChoice];
            const botEmoji = fullMap[botChoice];

            let result;
            if (userChoice === botChoice) {
                result = "⚖️ 𝐼𝑡'𝑠 𝑎 𝑡𝑖𝑒!";
            } else if (
                (userChoice === "rock" && botChoice === "scissors") ||
                (userChoice === "paper" && botChoice === "rock") ||
                (userChoice === "scissors" && botChoice === "paper")
            ) {
                result = "🎉 𝑌𝑜𝑢 𝑤𝑖𝑛! 𝐵𝑒𝑠ℎ 𝑏ℎ𝑎𝑙𝑜 𝑘ℎ𝑒𝑙𝑠𝑖!";
            } else {
                result = "😎 𝐼 𝑤𝑖𝑛! 𝑁𝑒𝑥𝑡 𝑏𝑎𝑟 𝑡𝑟𝑦 𝑘𝑜𝑟𝑜!";
            }

            const replyMessage = 
`🫵 𝑌𝑜𝑢 𝑐ℎ𝑜𝑠𝑒: ${userEmoji} (${userChoice})
🤖 𝐼 𝑐ℎ𝑜𝑠𝑒: ${botEmoji} (${botChoice})

✨ 𝑅𝑒𝑠𝑢𝑙𝑡: ${result}`;

            await message.reply(replyMessage);

        } catch (error) {
            console.error("𝑅𝑃𝑆 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
    }
};
