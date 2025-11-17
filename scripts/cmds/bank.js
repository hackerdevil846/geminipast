const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "bank",
        aliases: ["banking", "economy"],
        version: "2.0",
        author: "Asif Mahmud",
        countDown: 15,
        role: 0,
        category: "economy",
        shortDescription: {
            en: "💰 | Bank system with optional interest"
        },
        longDescription: {
            en: "Complete banking system with deposit, withdraw, transfer, loans and optional interest"
        },
        guide: {
            en: "{p}bank [deposit/withdraw/balance/interest/transfer/richest/loan/payloan/interestSetting] [amount] [userID]"
        }
    },

    onStart: async function ({ message, args, event, usersData, commandName }) {
        try {
            const userMoney = await usersData.get(event.senderID, "money");
            const user = parseInt(event.senderID);
            
            const bankDataPath = path.join(__dirname, 'assets', 'bankData.json');

            const assetsDir = path.join(__dirname, 'assets');
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir, { recursive: true });
            }

            let bankData = {};
            if (fs.existsSync(bankDataPath)) {
                try {
                    const fileContent = fs.readFileSync(bankDataPath, "utf8");
                    bankData = JSON.parse(fileContent);
                } catch (readError) {
                    console.error("Bank data read error:", readError);
                    bankData = {};
                }
            }

            if (!bankData[user]) {
                bankData[user] = { 
                    bank: 0, 
                    lastInterestClaimed: Date.now(),
                    loan: 0,
                    loanPayed: true,
                    interestEnabled: false
                };
            }

            if (bankData[user].loan === undefined) bankData[user].loan = 0;
            if (bankData[user].loanPayed === undefined) bankData[user].loanPayed = true;
            if (bankData[user].interestEnabled === undefined) bankData[user].interestEnabled = false;

            const bankBalance = bankData[user].bank || 0;
            const command = args[0]?.toLowerCase();
            const amount = parseInt(args[1]);
            const recipientUID = parseInt(args[2]);

            const saveBankData = () => {
                try {
                    fs.writeFileSync(bankDataPath, JSON.stringify(bankData, null, 2), "utf8");
                    return true;
                } catch (saveError) {
                    console.error("Bank data save error:", saveError);
                    return false;
                }
            };

            switch (command) {
                case "deposit":
                    if (isNaN(amount) || amount <= 0) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter a valid amount to deposit 🔁\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (bankBalance >= 1e104) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You cannot deposit money when your bank balance is already at $1e104 ✖️\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (userMoney < amount) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You don't have the required amount to deposit ✖️\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    bankData[user].bank += amount;
                    await usersData.set(event.senderID, {
                        money: userMoney - amount
                    });

                    if (!saveBankData()) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Error saving data! Please try again 🥲\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Successfully deposited $${amount} into your bank account ✅\n\n╚════ஜ۩۞۩ஜ═══╝`);

                case "withdraw":
                    const balance = bankData[user].bank || 0;

                    if (isNaN(amount) || amount <= 0) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter the correct amount to withdraw 😪\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (userMoney >= 1e104) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You cannot withdraw money when your balance is already at 1e104 😒\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (amount > balance) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ The requested amount is greater than the available balance in your bank account 🗿\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    bankData[user].bank = balance - amount;
                    await usersData.set(event.senderID, {
                        money: userMoney + amount
                    });

                    if (!saveBankData()) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Error saving data! Please try again 🥲\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Successfully withdrew $${amount} from your bank account ✅\n\n╚════ஜ۩۞۩ஜ═══╝`);

                case "balance":
                    const formattedBankBalance = parseFloat(bankBalance);
                    const interestStatus = bankData[user].interestEnabled ? "✅ Enabled" : "❌ Disabled";
                    
                    if (!isNaN(formattedBankBalance)) {
                        return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Your bank balance is: $${formatNumberWithFullForm(formattedBankBalance)}\n\n❏ Interest System: ${interestStatus}\n\n╚════ஜ۩۞۩ஜ═══╝`);
                    } else {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Error: Your bank balance is not a valid number 🥲\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                case "interest":
                    if (!bankData[user].interestEnabled) {
                        return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Interest system is currently disabled for your account 🔒\n\n👉 To enable interest, use: ${commandName} interestSetting on\n\n╚════ஜ۩۞۩ஜ═══╝`);
                    }

                    const interestRate = 0.001;
                    const lastInterestClaimed = bankData[user].lastInterestClaimed || Date.now();

                    const currentTime = Date.now();
                    const timeDiffInSeconds = (currentTime - lastInterestClaimed) / 1000;

                    if (timeDiffInSeconds < 86400) {
                        const remainingTime = Math.ceil(86400 - timeDiffInSeconds);
                        const remainingHours = Math.floor(remainingTime / 3600);
                        const remainingMinutes = Math.floor((remainingTime % 3600) / 60);

                        return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You can claim interest again in ${remainingHours} hours and ${remainingMinutes} minutes 😉\n\n╚════ஜ۩۞۩ஜ═══╝`);
                    }

                    const interestEarned = bankData[user].bank * (interestRate / 970) * timeDiffInSeconds;

                    if (bankData[user].bank <= 0) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You don't have any money in your bank account to earn interest 💸🥱\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    bankData[user].lastInterestClaimed = currentTime;
                    bankData[user].bank += interestEarned;

                    if (!saveBankData()) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Error saving data! Please try again 🥲\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You have earned interest of $${formatNumberWithFullForm(interestEarned)}\n\nIt has been successfully added to your account balance ✅\n\n╚════ஜ۩۞۩ஜ═══╝`);

                case "interestsetting":
                    const setting = args[1]?.toLowerCase();
                    
                    if (setting === "on" || setting === "enable") {
                        bankData[user].interestEnabled = true;
                        if (!saveBankData()) {
                            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Error saving data! Please try again 🥲\n\n╚════ஜ۩۞۩ஜ═══╝");
                        }
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Interest system has been ENABLED for your account ✅\n\nNow you can earn interest on your bank balance!\n\n╚════ஜ۩۞۩ஜ═══╝");
                    
                    } else if (setting === "off" || setting === "disable") {
                        bankData[user].interestEnabled = false;
                        if (!saveBankData()) {
                            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Error saving data! Please try again 🥲\n\n╚════ஜ۩۞۩ஜ═══╝");
                        }
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Interest system has been DISABLED for your account 🔒\n\nYou will not earn interest on your bank balance.\n\n╚════ஜ۩۞۩ஜ═══╝");
                    
                    } else {
                        const currentStatus = bankData[user].interestEnabled ? "ENABLED ✅" : "DISABLED 🔒";
                        return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Your current interest setting: ${currentStatus}\n\n👉 To change:\n• ${commandName} interestSetting on\n• ${commandName} interestSetting off\n\n╚════ஜ۩۞۩ஜ═══╝`);
                    }

                case "transfer":
                    if (isNaN(amount) || amount <= 0) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter a valid amount to transfer 🔁\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (!recipientUID || !bankData[recipientUID]) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Recipient not found in the bank database. Please check the recipient's ID ✖️\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (recipientUID === user) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You cannot transfer money to yourself 😹\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    const senderBankBalance = parseFloat(bankData[user].bank) || 0;
                    const recipientBankBalance = parseFloat(bankData[recipientUID].bank) || 0;

                    if (recipientBankBalance >= 1e104) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ The recipient's bank balance is already $1e104. You cannot transfer money to them 🗿\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (amount > senderBankBalance) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You don't have enough money in your bank account for this transfer ✖️\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    bankData[user].bank -= amount;
                    bankData[recipientUID].bank += amount;

                    if (!saveBankData()) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Error saving data! Please try again 🥲\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Successfully transferred $${amount} to the recipient with UID: ${recipientUID} ✅\n\n╚════ஜ۩۞۩ஜ═══╝`);

                case "richest":
                    const topUsers = Object.entries(bankData)
                        .filter(([uid, data]) => data.bank > 0)
                        .sort(([, a], [, b]) => b.bank - a.bank)
                        .slice(0, 10);

                    if (topUsers.length === 0) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ No users with bank balance found yet! 🏦\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    const output = (await Promise.all(topUsers.map(async ([userID, userData], index) => {
                        try {
                            const userInfo = await usersData.get(userID);
                            const userName = userInfo?.name || "Unknown User";
                            const formattedBalance = formatNumberWithFullForm(userData.bank);
                            return `[${index + 1}. ${userName} - $${formattedBalance}]`;
                        } catch (userError) {
                            return `[${index + 1}. User ${userID} - $${formatNumberWithFullForm(userData.bank)}]`;
                        }
                    }))).join('\n');

                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Top 10 richest people according to their bank balance 👑🤴:\n" + output + "\n\n╚════ஜ۩۞۩ஜ═══╝");

                case "loan":
                    const maxLoanAmount = 100000000;
                    const userLoan = bankData[user].loan || 0;
                    const loanPayed = bankData[user].loanPayed !== undefined ? bankData[user].loanPayed : true;

                    if (!amount) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter a valid loan amount ✖️\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (amount > maxLoanAmount) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ The maximum loan amount is $100000000 ❗\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (!loanPayed && userLoan > 0) {
                        return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You cannot take a new loan until you pay off your current loan.\n\nYour current loan to pay: $${userLoan} 😑\n\n╚════ஜ۩۞۩ஜ═══╝`);
                    }

                    bankData[user].loan = userLoan + amount;
                    bankData[user].loanPayed = false;
                    bankData[user].bank += amount;

                    if (!saveBankData()) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Error saving data! Please try again 🥲\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You have successfully taken a loan of $${amount}. Please note that loans must be repaid within a certain period 😉\n\n╚════ஜ۩۞۩ஜ═══╝`);

                case "payloan":
                    const loanBalance = bankData[user].loan || 0;

                    if (isNaN(amount) || amount <= 0) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter a valid amount to repay your loan ✖️\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (loanBalance <= 0) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You don't have any pending loan payments\n\n✧⁺⸜(●˙▾˙●)⸝⁺✧ʸᵃʸ\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    if (amount > loanBalance) {
                        return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ The amount required to pay off the loan is greater than your due amount. Please pay the exact amount 😊\nYour total loan: $${loanBalance}\n\n╚════ஜ۩۞۩ஜ═══╝`);
                    }

                    if (amount > userMoney) {
                        return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ You do not have $${amount} in your balance to repay the loan 😢\n\n╚════ஜ۩۞۩ஜ═══╝`);
                    }

                    bankData[user].loan = loanBalance - amount;

                    if (loanBalance - amount === 0) {
                        bankData[user].loanPayed = true;
                    }

                    await usersData.set(event.senderID, {
                        money: userMoney - amount
                    });

                    if (!saveBankData()) {
                        return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Error saving data! Please try again 🥲\n\n╚════ஜ۩۞۩ஜ═══╝");
                    }

                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Successfully repaid $${amount} towards your loan. Your current loan to pay: $${bankData[user].loan} ✅\n\n╚════ஜ۩۞۩ஜ═══╝`);

                default:
                    const userInterestStatus = bankData[user].interestEnabled ? "✅ ENABLED" : "❌ DISABLED";
                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ Available Commands:\n• deposit [amount]\n• withdraw [amount]\n• balance\n• interest\n• transfer [amount] [userID]\n• richest\n• loan [amount]\n• payloan [amount]\n• interestSetting [on/off]\n\n❏ Your Interest Setting: ${userInterestStatus}\n\n╚════ஜ۩۞۩ஜ═══╝`);
            }
        } catch (error) {
            console.error("Bank System Error:", error);
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 BANK 🏦]\n\n❏ An error occurred while processing your request. Please try again later.\n\n╚════ஜ۩۞۩ஜ═══╝");
        }
    }
};

function formatNumberWithFullForm(number) {
    const fullForms = [
        "", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", 
        "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion", 
        "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion", "Sexdecillion", 
        "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion", "Unvigintillion", 
        "Duovigintillion", "Tresvigintillion", "Quattuorvigintillion", "Quinvigintillion", 
        "Sesvigintillion", "Septemvigintillion", "Octovigintillion", "Novemvigintillion", 
        "Trigintillion", "Untrigintillion", "Duotrigintillion", "Googol"
    ];

    let fullFormIndex = 0;
    while (number >= 1000 && fullFormIndex < fullForms.length - 1) {
        number /= 1000;
        fullFormIndex++;
    }

    const formattedNumber = number.toFixed(2);
    return `${formattedNumber} ${fullForms[fullFormIndex]}`;
}
