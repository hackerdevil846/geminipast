const axios = require('axios');
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "dice",
        aliases: ["sicbo"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "Dice game with multiple betting options"
        },
        longDescription: {
            en: "Sic Bo (Tai Xiu) dice game with various betting types"
        },
        guide: {
            en: "{p}dice [big/small/triple/pair/total/number] [amount] [optional: specific number/total]"
        },
        dependencies: {
            "axios": "",
            "moment-timezone": ""
        }
    },

    onStart: async function ({ event, message, args, usersData }) {
        try {
            // Check for dependencies
            try {
                require("axios");
                require("moment-timezone");
            } catch (e) {
                return message.reply("Missing dependencies: axios and moment-timezone");
            }
            
            const format_day = moment.tz("Asia/Dhaka").format("HH:mm:ss - DD/MM/YYYY");
            const { threadID, senderID } = event;
            const userData = await usersData.get(senderID);
            const money = userData?.money || 0;
            const name = userData?.name || "User";
            
            // Game configuration
            const winMultiplier = 1;
            const tripleMultiplier = 10;
            const pairMultiplier = 5;
            const rollDelay = 2;
            const pairMatchMultiplier = 2;
            const tripleMatchMultiplier = 3;
            const singleMatchMultiplier = 1;
            
            // Gambling quotes
            const quotes = [
                "Gambling is the father of poverty",
                "You play, you win, you play, you lose. You keep playing.",
                "Those who don't play never win",
                "You never know what's worse than the bad luck you have.",
                "The safest way to double your money is to fold it once and put it in your pocket.",
                "Gambling is an inherent principle of human nature.",
                "The best way to throw dice is to throw them away and stop playing.",
                "Eat your betting money but don't bet your eating money",
                "Bet small, when you win you lose more",
                "Gambling costs us the two most precious things in life: time and money",
                "Gambling has winners and losers, few win but many lose."
            ];
            
            // Helper functions
            function formatNumber(int) {
                const str = int.toString();
                return str.replace(/(.)(?=(\d{3})+$)/g, '$1,');
            }
            
            function getDiceImage(number) {
                const images = {
                    1: "https://i.imgur.com/ruaSs1C.png",
                    2: "https://i.imgur.com/AIhuSxL.png",
                    3: "https://i.imgur.com/JB4vTVj.png",
                    4: "https://i.imgur.com/PGgsDAO.png",
                    5: "https://i.imgur.com/RiaMAHX.png",
                    6: "https://i.imgur.com/ys9PwAV.png"
                };
                return images[number];
            }
            
            function getTotalMultiplier(total) {
                const multipliers = {
                    4: 40, 5: 35, 6: 33.33, 7: 25, 8: 20, 9: 16.66,
                    10: 14.28, 11: 12.5, 12: 11.11, 13: 10, 14: 9.09,
                    15: 8.33, 16: 7.69, 17: 7.14
                };
                return multipliers[total] || 1;
            }
            
            // Validate input
            if (!args[0]) {
                return message.reply("❌ Please specify your bet: big/small/triple/pair/total/number");
            }
            
            const bet = parseInt((args[1] === "allin" ? money : args[1]));
            const input = args[0].toLowerCase();
            const specificValue = parseInt(args[2]);
            
            if (!bet || isNaN(bet)) return message.reply("❌ Please enter a valid bet amount");
            if (bet < 20) return message.reply("❌ Minimum bet is 20$");
            if (bet > money) return message.reply("❌ You don't have enough money to place this bet");
            
            // Determine choice
            let choice;
            if (input === "big" || input === "large") choice = 'big';
            else if (input === "small" || input === "little") choice = 'small';
            else if (input === 'triple' || input === 'three') choice = 'triple';
            else if (input === 'pair' || input === 'double') choice = 'pair';
            else if (input === 'total' || input === 'sum') choice = 'total';
            else if (input === 'number' || input === 'num') choice = 'number';
            else return message.reply('❌ Invalid choice. Please choose: big/small/triple/pair/total/number');
            
            if (choice === 'total' && (specificValue < 4 || specificValue > 17)) {
                return message.reply("❌ Total bet must be between 4 and 17");
            }
            
            if (choice === 'number' && (specificValue < 1 || specificValue > 6)) {
                return message.reply("❌ Number bet must be between 1 and 6");
            }
            
            if ((choice === 'total' || choice === 'number') && !specificValue) {
                return message.reply(`❌ Please specify a ${choice === 'total' ? 'total value' : 'number'} to bet on`);
            }
            
            // Roll dice
            const dice = [];
            const diceImages = [];
            
            for (let i = 1; i < 4; i++) {
                const roll = Math.floor(Math.random() * 6 + 1);
                dice.push(roll);
                const diceImage = await global.utils.getStreamFromURL(getDiceImage(roll));
                diceImages.push(diceImage);
                await message.reply(`🎲 Roll ${i}: ${roll}`);
                await new Promise(resolve => setTimeout(resolve, rollDelay * 1000));
            }
            
            const total = dice[0] + dice[1] + dice[2];
            let resultText, outcome, winAmount, newBalance;
            
            // Determine result based on choice
            if (choice === 'number') {
                const matchCount = dice.filter(d => d === specificValue).length;
                if (matchCount === 1) {
                    resultText = `${specificValue}`;
                    outcome = 'win';
                    winAmount = bet * singleMatchMultiplier;
                } else if (matchCount === 2) {
                    resultText = `${specificValue}`;
                    outcome = 'win';
                    winAmount = bet * pairMatchMultiplier;
                } else if (matchCount === 3) {
                    resultText = `${specificValue}`;
                    outcome = 'win';
                    winAmount = bet * tripleMatchMultiplier;
                } else {
                    resultText = `${specificValue}`;
                    outcome = 'lose';
                    winAmount = bet;
                }
                newBalance = outcome === 'win' ? money + winAmount : money - winAmount;
            } 
            else if (choice === 'total') {
                if (total === specificValue) {
                    resultText = "exact total";
                    outcome = 'win';
                    winAmount = bet * parseInt(getTotalMultiplier(specificValue));
                    newBalance = money + winAmount;
                } else {
                    resultText = `${total}`;
                    outcome = 'lose';
                    winAmount = bet;
                    newBalance = money - winAmount;
                }
            }
            else if (choice === 'triple') {
                if (dice[0] === dice[1] && dice[1] === dice[2]) {
                    resultText = "triple match";
                    outcome = 'win';
                    winAmount = bet * tripleMultiplier;
                    newBalance = money + winAmount;
                } else {
                    resultText = (total >= 11 && total <= 18 ? "big" : "small");
                    outcome = 'lose';
                    winAmount = bet;
                    newBalance = money - winAmount;
                }
            }
            else if (choice === 'pair') {
                if (dice[0] === dice[1] || dice[1] === dice[2] || dice[0] === dice[2]) {
                    resultText = "pair match";
                    outcome = 'win';
                    winAmount = bet * pairMultiplier;
                    newBalance = money + winAmount;
                } else {
                    resultText = (total >= 11 && total <= 18 ? "big" : "small");
                    outcome = 'lose';
                    winAmount = bet;
                    newBalance = money - winAmount;
                }
            }
            else if (choice === 'big' || choice === 'small') {
                if (dice[0] === dice[1] && dice[1] === dice[2]) {
                    resultText = "triple match";
                    outcome = 'lose';
                    winAmount = bet;
                    newBalance = money - winAmount;
                } else {
                    resultText = (total >= 11 && total <= 18 ? "big" : "small");
                    if (resultText === choice) {
                        outcome = 'win';
                        winAmount = bet * winMultiplier;
                        newBalance = winAmount + money;
                    } else {
                        outcome = 'lose';
                        winAmount = bet;
                        newBalance = money - winAmount;
                    }
                }
            }
            
            // Update currency
            await usersData.set(senderID, {
                money: newBalance,
                data: userData?.data || {}
            });
            
            // Build result message
            const resultMessage = `====== DICE GAME RESULTS ======` +
                `\n⏰ Time: ${format_day}` +
                `\n👤 Player: ${name}` +
                `\n🎯 Bet: ${choice}${specificValue ? ` (${specificValue})` : ''}` +
                `\n✅ Result: ${resultText}` +
                `\n🎲 Dice 1: ${dice[0]}` +
                `\n🎲 Dice 2: ${dice[1]}` +
                `\n🎲 Dice 3: ${dice[2]}` +
                `\n🧮 Total: ${total}` +
                `\n📊 Outcome: ${(outcome === 'win' ? 'WIN' : 'LOSE')}` +
                `\n💰 Bet Amount: ${formatNumber(bet)}$` +
                `\n💵 ${(outcome === 'win' ? 'Won' : 'Lost')}: ${formatNumber(Math.floor(winAmount))}$` +
                `\n📈 Status: ${(outcome === 'win' ? 'Reward Paid' : 'Amount Deducted')}` +
                `\n💼 New Balance: ${formatNumber(newBalance)}$` +
                `\n──────────────────` +
                `\n💡 Advice: ${quotes[Math.floor(Math.random() * quotes.length)]}` +
                `\n====== GAME COMPLETED ======`;
            
            // Send result
            await message.reply({
                body: resultMessage,
                attachment: diceImages
            });
            
        } catch (error) {
            console.error("Dice game error:", error);
            await message.reply("❌ An error occurred while processing the game");
        }
    }
};
