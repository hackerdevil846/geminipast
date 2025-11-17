const axios = require('axios');
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "taixiu",
    aliases: ["dice", "dicegame"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Dice game with multiple betting options"
    },
    longDescription: {
      en: "Tai Xiu (Sic Bo) dice game with various betting types"
    },
    category: "game",
    guide: {
      en: "{p}taixiu [big/small/triple/double/total/number] [amount] [optional: specific number/total]"
    }
  },

  onStart: async function({ api, event, args, Users, Currencies }) {
    try {
      // Check for dependencies
      if (!axios) throw new Error("Missing axios dependency");
      if (!moment) throw new Error("Missing moment dependency");
      
      const format_day = moment.tz("Asia/Dhaka").format("DD/MM/YYYY - HH:mm:ss");
      const { increaseMoney, decreaseMoney } = Currencies;
      const { threadID, messageID, senderID } = event;
      const name = await Users.getNameUser(senderID);
      const money = (await Currencies.getData(senderID)).money;
      
      // Game configuration
      const notificationEnabled = true;
      const winMultiplier = 2.53;
      const tripleMultiplier = 10;
      const doubleMultiplier = 5;
      const rollDelay = 2;
      const doubleMatchMultiplier = 2;
      const tripleMatchMultiplier = 3;
      const singleMatchMultiplier = 1;
      
      // Helper functions
      function formatNumber(int) {
        const str = int.toString();
        return str.replace(/(.)(?=(\d{3})+$)/g, '$1,');
      }
      
      function getDiceImage(number) {
        const images = {
          1: "https://imgur.com/qn9PXUX.jpg",
          2: "https://imgur.com/hbQISCE.jpg",
          3: "https://imgur.com/gyskBsm.jpg",
          4: "https://imgur.com/vHMWTc2.jpg",
          5: "https://imgur.com/HvA4KVd.jpg",
          6: "https://imgur.com/JVuky8r.jpg"
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
        return api.sendMessage("❌ Please specify your bet: big/small/triple/double/total/number", threadID, messageID);
      }
      
      const bet = parseInt((args[1] === "allin" ? money : args[1]));
      const input = args[0].toLowerCase();
      const specificValue = parseInt(args[2]);
      
      if (!bet || isNaN(bet)) return api.sendMessage("❌ Please enter a valid bet amount", threadID, messageID);
      if (bet < 1000) return api.sendMessage("❌ Minimum bet is 1,000$", threadID, messageID);
      if (bet > money) return api.sendMessage("❌ You don't have enough money to place this bet", threadID, messageID);
      
      // Determine choice
      let choice;
      if (input === "big" || input === "large") choice = 'big';
      else if (input === "small" || input === "little") choice = 'small';
      else if (input === 'triple' || input === 'three') choice = 'triple';
      else if (input === 'double' || input === 'pair') choice = 'double';
      else if (input === 'total' || input === 'sum') choice = 'total';
      else if (input === 'number' || input === 'num') choice = 'number';
      else return api.sendMessage('❌ Invalid choice. Please choose: big/small/triple/double/total/number', threadID, messageID);
      
      if (choice === 'total' && (specificValue < 4 || specificValue > 17)) {
        return api.sendMessage("❌ Total bet must be between 4 and 17", threadID, messageID);
      }
      
      if (choice === 'number' && (specificValue < 1 || specificValue > 6)) {
        return api.sendMessage("❌ Number bet must be between 1 and 6", threadID, messageID);
      }
      
      if ((choice === 'total' || choice === 'number') && !specificValue) {
        return api.sendMessage(`❌ Please specify a ${choice === 'total' ? 'total value' : 'number'} to bet on`, threadID, messageID);
      }
      
      // Roll dice
      const dice = [];
      const diceImages = [];
      
      for (let i = 1; i < 4; i++) {
        const roll = Math.floor(Math.random() * 6 + 1);
        dice.push(roll);
        const diceImage = (await axios.get(encodeURI(getDiceImage(roll)), { responseType: 'stream' })).data;
        diceImages.push(diceImage);
        api.sendMessage(`🎲 Roll ${i}: ${roll}`, threadID, messageID);
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
          winAmount = bet * doubleMatchMultiplier;
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
      else if (choice === 'double') {
        if (dice[0] === dice[1] || dice[1] === dice[2] || dice[0] === dice[2]) {
          resultText = "double match";
          outcome = 'win';
          winAmount = bet * doubleMultiplier;
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
      if (outcome === 'lose') {
        decreaseMoney(senderID, winAmount);
      } else if (outcome === 'win') {
        increaseMoney(senderID, winAmount);
      }
      
      // Send result
      const message = `====== DICE GAME ======` +
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
        `\n====== DICE GAME ======`;
      
      api.sendMessage({ body: message, attachment: diceImages }, threadID, messageID);
      
      if (notificationEnabled) {
        const notificationMsg = `🎰 Dice Game Notification (${format_day})\n` +
          `You ${outcome === 'win' ? 'won' : 'lost'} ${formatNumber(Math.floor(winAmount))}$\n` +
          `New balance: ${formatNumber(newBalance)}$\n` +
          `Thank you for playing! 🎲`;
        api.sendMessage({ body: notificationMsg }, senderID);
      }
      
    } catch (error) {
      console.error("Dice game error:", error);
      api.sendMessage("❌ An error occurred while processing the game", event.threadID, event.messageID);
    }
  }
};
