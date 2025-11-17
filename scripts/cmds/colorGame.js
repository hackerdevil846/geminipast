module.exports = {
    config: {
        name: "colorGame",
        aliases: [],
        version: "1.0.2",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 0,
        role: 0,
        category: "game",
        shortDescription: {
            en: "🎨 𝖢𝗈𝗅𝗈𝗋 𝖻𝖾𝗍𝗍𝗂𝗇𝗀 𝗀𝖺𝗆𝖾"
        },
        longDescription: {
            en: "𝖡𝖾𝗍 𝗆𝗈𝗇𝖾𝗒 𝗈𝗇 𝖼𝗈𝗅𝗈𝗋𝗌 𝗍𝗈 𝗐𝗂𝗇 𝗉𝗋𝗂𝗓𝖾𝗌"
        },
        guide: {
            en: "{p}colorGame [𝖼𝗈𝗅𝗈𝗋] - 𝖢𝗁𝗈𝗈𝗌𝖾 𝖿𝗋𝗈𝗆: 𝖻𝗅𝗎𝖾, 𝗋𝖾𝖽, 𝗀𝗋𝖾𝖾𝗇, 𝗒𝖾𝗅𝗅𝗈𝗐, 𝗏𝗂𝗈𝗅𝖾𝗍, 𝖻𝗅𝖺𝖼𝗄"
        }
    },

    onStart: async function({ message, args, usersData, event }) {
        try {
            const { senderID } = event;

            // Validate user data
            let userData;
            try {
                userData = await usersData.get(senderID);
            } catch (dataError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", dataError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            if (!userData || typeof userData.money === 'undefined') {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            const moneyUser = userData.money;

            if (moneyUser < 100000) {
                return message.reply("❌ 𝖭𝗈𝗍 𝖾𝗇𝗈𝗎𝗀𝗁 𝗆𝗈𝗇𝖾𝗒! 𝖸𝗈𝗎 𝗇𝖾𝖾𝖽 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 100000$");
            }

            // Validate arguments
            if (!args[0]) {
                return message.reply(
                    "🎨 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖻𝖾𝗍! 𝖢𝗁𝗈𝗈𝗌𝖾 𝖿𝗋𝗈𝗆:\n\n" +
                    "💙 𝖻𝗅𝗎𝖾 [180]\n" +
                    "❤️ 𝗋𝖾𝖽 [200]\n" +
                    "💚 𝗀𝗋𝖾𝖾𝗇 [70]\n" +
                    "💛 𝗒𝖾𝗅𝗅𝗈𝗐 [50]\n" +
                    "💜 𝗏𝗂𝗈𝗅𝖾𝗍 [150]\n" +
                    "🖤 𝖻𝗅𝖺𝖼𝗄 [100]"
                );
            }

            const colorArg = args[0].toLowerCase().trim();
            let colorCode;

            // Color mapping with validation
            if (colorArg === "e" || colorArg === "blue") colorCode = 0;
            else if (colorArg === "r" || colorArg === "red") colorCode = 1;
            else if (colorArg === "g" || colorArg === "green") colorCode = 2;
            else if (colorArg === "y" || colorArg === "yellow") colorCode = 3;
            else if (colorArg === "v" || colorArg === "violet") colorCode = 4;
            else if (colorArg === "b" || colorArg === "black") colorCode = 5;
            else {
                return message.reply(
                    "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗅𝗈𝗋! 𝖢𝗁𝗈𝗈𝗌𝖾 𝖿𝗋𝗈𝗆:\n\n" +
                    "💙 𝖻𝗅𝗎𝖾 (𝖾)\n" +
                    "❤️ 𝗋𝖾𝖽 (𝗋)\n" +
                    "💚 𝗀𝗋𝖾𝖾𝗇 (𝗀)\n" +
                    "💛 𝗒𝖾𝗅𝗅𝗈𝗐 (𝗒)\n" +
                    "💜 𝗏𝗂𝗈𝗅𝖾𝗍 (𝗏)\n" +
                    "🖤 𝖻𝗅𝖺𝖼𝗄 (𝖻)"
                );
            }

            // Color determination logic
            const check = (num) => {
                if (num === 0) return '💙';
                if (num % 2 === 0 && num % 6 !== 0 && num % 10 !== 0) return '❤️';
                if (num % 3 === 0 && num % 6 !== 0) return '💚';
                if (num % 5 === 0 && num % 10 !== 0) return '💛';
                if (num % 10 === 0) return '💜';
                return '🖤';
            };

            // Generate random number with better distribution
            const random = Math.floor(Math.random() * 50);
            const resultColor = check(random);

            console.log(`🎰 𝖦𝖺𝗆𝖾 𝗋𝖾𝗌𝗎𝗅𝗍 - 𝖴𝗌𝖾𝗋: ${senderID}, 𝖢𝗁𝗈𝗌𝖾: ${colorCode}, 𝖱𝖾𝗌𝗎𝗅𝗍: ${resultColor}, 𝖱𝖺𝗇𝖽𝗈𝗆: ${random}`);

            // Process game result
            try {
                if (colorCode === 0 && resultColor === '💙') {
                    const newBalance = moneyUser + 180000;
                    await usersData.set(senderID, { money: newBalance });
                    await message.reply(`🎉 𝖸𝗈𝗎 𝖼𝗁𝗈𝗌𝖾 𝖻𝗅𝗎𝖾 💙, 𝗒𝗈𝗎 𝗐𝗈𝗇 𝖺𝗇𝖽 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 +180000$\n💰 𝖸𝗈𝗎𝗋 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗆𝗈𝗇𝖾𝗒: ${newBalance}$`);
                } 
                else if (colorCode === 1 && resultColor === '❤️') {
                    const newBalance = moneyUser + 200000;
                    await usersData.set(senderID, { money: newBalance });
                    await message.reply(`🎉 𝖸𝗈𝗎 𝖼𝗁𝗈𝗌𝖾 𝗋𝖾𝖽 ❤️, 𝗒𝗈𝗎 𝗐𝗈𝗇 𝖺𝗇𝖽 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 +200000$\n💰 𝖸𝗈𝗎𝗋 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗆𝗈𝗇𝖾𝗒: ${newBalance}$`);
                } 
                else if (colorCode === 2 && resultColor === '💚') {
                    const newBalance = moneyUser + 700000;
                    await usersData.set(senderID, { money: newBalance });
                    await message.reply(`🎉 𝖸𝗈𝗎 𝖼𝗁𝗈𝗌𝖾 𝗀𝗋𝖾𝖾𝗇 💚, 𝗒𝗈𝗎 𝗐𝗈𝗇 𝖺𝗇𝖽 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 +700000$\n💰 𝖸𝗈𝗎𝗋 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗆𝗈𝗇𝖾𝗒: ${newBalance}$`);
                } 
                else if (colorCode === 3 && resultColor === '💛') {
                    const newBalance = moneyUser + 500000;
                    await usersData.set(senderID, { money: newBalance });
                    await message.reply(`🎉 𝖸𝗈𝗎 𝖼𝗁𝗈𝗌𝖾 𝗒𝖾𝗅𝗅𝗈𝗐 💛, 𝗒𝗈𝗎 𝗐𝗈𝗇 𝖺𝗇𝖽 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 +500000$\n💰 𝖸𝗈𝗎𝗋 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗆𝗈𝗇𝖾𝗒: ${newBalance}$`);
                } 
                else if (colorCode === 4 && resultColor === '💜') {
                    const newBalance = moneyUser + 1500000;
                    await usersData.set(senderID, { money: newBalance });
                    await message.reply(`🎉 𝖸𝗈𝗎 𝖼𝗁𝗈𝗌𝖾 𝗏𝗂𝗈𝗅𝖾𝗍 💜, 𝗒𝗈𝗎 𝗐𝗈𝗇 𝖺𝗇𝖽 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 +1500000$\n💰 𝖸𝗈𝗎𝗋 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗆𝗈𝗇𝖾𝗒: ${newBalance}$`);
                } 
                else if (colorCode === 5 && resultColor === '🖤') {
                    const newBalance = moneyUser + 100000;
                    await usersData.set(senderID, { money: newBalance });
                    await message.reply(`🎉 𝖸𝗈𝗎 𝖼𝗁𝗈𝗌𝖾 𝖻𝗅𝖺𝖼𝗄 🖤, 𝗒𝗈𝗎 𝗐𝗈𝗇 𝖺𝗇𝖽 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 +100000$\n💰 𝖸𝗈𝗎𝗋 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗆𝗈𝗇𝖾𝗒: ${newBalance}$`);
                } 
                else {
                    const newBalance = moneyUser - 100000;
                    
                    // Prevent negative balance
                    if (newBalance < 0) {
                        await usersData.set(senderID, { money: 0 });
                        await message.reply(`🎰 𝖢𝗈𝗅𝗈𝗋 ${resultColor}\n❌ 𝖸𝗈𝗎 𝗅𝗈𝗌𝗍 𝖺𝗇𝖽 𝗅𝗈𝗌𝗍 100000$\n💰 𝖸𝗈𝗎𝗋 𝗋𝖾𝗆𝖺𝗂𝗇𝗂𝗇𝗀 𝗆𝗈𝗇𝖾𝗒: 0$`);
                    } else {
                        await usersData.set(senderID, { money: newBalance });
                        await message.reply(`🎰 𝖢𝗈𝗅𝗈𝗋 ${resultColor}\n❌ 𝖸𝗈𝗎 𝗅𝗈𝗌𝗍 𝖺𝗇𝖽 𝗅𝗈𝗌𝗍 100000$\n💰 𝖸𝗈𝗎𝗋 𝗋𝖾𝗆𝖺𝗂𝗇𝗂𝗇𝗀 𝗆𝗈𝗇𝖾𝗒: ${newBalance}$`);
                    }
                }
            } catch (saveError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", saveError);
                await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗀𝖺𝗆𝖾 𝗋𝖾𝗌𝗎𝗅𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖢𝗈𝗅𝗈𝗋 𝖦𝖺𝗆𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.";
            
            if (error.message.includes('usersData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            } else if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
