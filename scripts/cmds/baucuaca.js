module.exports = {
    config: {
        name: "baucuaca",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "🎰 𝖲𝗅𝗈𝗍 𝖬𝖺𝖼𝗁𝗂𝗇𝖾 𝖦𝖺𝗆𝖾"
        },
        longDescription: {
            en: "𝖯𝗅𝖺𝗒 𝗌𝗅𝗈𝗍 𝗆𝖺𝖼𝗁𝗂𝗇𝖾 𝗀𝖺𝗆𝖾 𝗐𝗂𝗍𝗁 𝖻𝖾𝗍𝗍𝗂𝗇𝗀 𝖺𝗇𝖽 𝗐𝗂𝗇 𝖻𝗂𝗀"
        },
        guide: {
            en: "{p}baucuaca [𝖻𝖾𝗍 𝖺𝗆𝗈𝗎𝗇𝗍]"
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            const { threadID, senderID } = event;
            const slotItems = ["🦀", "🐟", "🗳️"];
            
            const formatText = text => {
                const boldItalicMap = {
                    a: '𝖺', b: '𝖻', c: '𝖼', d: '𝖽', e: '𝖾', f: '𝖿', g: '𝗀', h: '𝗁',
                    i: '𝗂', j: '𝗃', k: '𝗄', l: '𝗅', m: '𝗆', n: '𝗇', o: '𝗈', p: '𝗉',
                    q: '𝗊', r: '𝗋', s: '𝗌', t: '𝗍', u: '𝗎', v: '𝗏', w: '𝗐', x: '𝗑',
                    y: '𝗒', z: '𝗓', A: '𝖠', B: '𝖡', C: '𝖢', D: '𝖣', E: '𝖤', F: '𝖥',
                    G: '𝖦', H: '𝖧', I: '𝖨', J: '𝖩', K: '𝖪', L: '𝖫', M: '𝖬', N: '𝖭',
                    O: '𝖮', P: '𝖯', Q: '𝖰', R: '𝖱', S: '𝖲', T: '𝖳', U: '𝖴', V: '𝖵',
                    W: '𝖶', X: '𝖷', Y: '𝖸', Z: '𝖹'
                };
                return text.split('').map(char => boldItalicMap[char] || char).join('');
            };

            // Get user data with error handling
            let userData;
            try {
                userData = await usersData.get(senderID);
            } catch (dataError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", dataError);
                return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            let money = userData?.money || 0;
            
            if (!args[0]) {
                return message.reply(formatText("𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗒𝗈𝗎𝗋 𝖻𝖾𝗍 𝖺𝗆𝗈𝗎𝗇𝗍!"));
            }
            
            let coin = parseInt(args[0]);
            
            if (isNaN(coin)) {
                return message.reply(formatText("𝖸𝗈𝗎𝗋 𝖻𝖾𝗍 𝗆𝗎𝗌𝗍 𝖻𝖾 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋!"));
            }
            
            if (coin <= 0) {
                return message.reply(formatText("𝖸𝗈𝗎𝗋 𝖻𝖾𝗍 𝗆𝗎𝗌𝗍 𝖻𝖾 𝗉𝗈𝗌𝗂𝗍𝗂𝗏𝖾!"));
            }
            
            if (coin > money) {
                return message.reply(formatText(`𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝖾𝗇𝗈𝗎𝗀𝗁 𝗆𝗈𝗇𝖾𝗒! 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝖻𝖺𝗅𝖺𝗇𝖼𝖾: ${money}$`));
            }
            
            if (coin < 50) {
                return message.reply(formatText("𝖬𝗂𝗇𝗂𝗆𝗎𝗆 𝖻𝖾𝗍 𝗂𝗌 𝟧𝟢$!"));
            }

            // Generate random slot results
            let number = Array(3).fill().map(() => Math.floor(Math.random() * slotItems.length));
            
            let winnings = 0;
            let multiplier = 1;
            let resultText = "";

            // Calculate winnings based on slot results
            if (number[0] === number[1] && number[1] === number[2]) {
                winnings = coin * 9;
                multiplier = 9;
                resultText = "✨ 𝖩𝖠𝖢𝖪𝖯𝖮𝖳! ✨";
            } else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
                winnings = coin * 2;
                multiplier = 2;
                resultText = "🎉 𝖶𝖨𝖭𝖭𝖤𝖱! 🎉";
            } else {
                winnings = -coin;
                resultText = "😢 𝖫𝖮𝖲𝖳...";
            }

            const slotResult = 
`╭──🎰───────╮
│ ${slotItems[number[0]]}  |  ${slotItems[number[1]]}  |  ${slotItems[number[2]]} │
╰────────────╯
${formatText(resultText)}`;

            // Update user data with error handling
            try {
                await usersData.set(senderID, {
                    money: money + winnings,
                    data: userData.data || {}
                });
            } catch (saveError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", saveError);
                return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗀𝖺𝗆𝖾 𝗋𝖾𝗌𝗎𝗅𝗍𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            const newBalance = money + winnings;
            
            const resultMessage = winnings > 0 ?
                `${slotResult}\n${formatText(`𝖸𝗈𝗎 𝗐𝗈𝗇 ${winnings}$!`)}\n${formatText(`𝖬𝗎𝗅𝗍𝗂𝗉𝗅𝗂𝖾𝗋: ${multiplier}𝗑`)}\n${formatText(`𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝖻𝖺𝗅𝖺𝗇𝖼𝖾: ${newBalance}$`)}` :
                `${slotResult}\n${formatText(`𝖸𝗈𝗎 𝗅𝗈𝗌𝗍 ${coin}$`)}\n${formatText(`𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝖻𝖺𝗅𝖺𝗇𝖼𝖾: ${newBalance}$`)}`;

            await message.reply(resultMessage);

        } catch (error) {
            console.error("💥 𝖲𝗅𝗈𝗍 𝖬𝖺𝖼𝗁𝗂𝗇𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('usersData')) {
                errorMessage = "❌ 𝖤𝗋𝗋𝗈𝗋 𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
