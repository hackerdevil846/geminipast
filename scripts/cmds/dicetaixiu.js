const axios = require('axios');
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "dicetaixiu",
    aliases: ["dicebet", "dicegambling"],
    version: "1.0.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "🎲 Dice game with big/small betting"
    },
    longDescription: {
      en: "Tai Xiu dice game with big/small betting options"
    },
    category: "entertainment",
    guide: {
      en: "{p}dicetaixiu [big/small] [amount]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message, event, args, Users, Currencies }) {
    try {
      const { senderID, messageID, threadID } = event;
      const dataMoney = await Currencies.getData(senderID);
      const moneyUser = dataMoney.money;
      
      const quotes = [
        "Gambling is the father of poverty",
        "You play, you win, you play, you lose. You keep playing.",
        "Those who don't play never win",
        "The safest way to double your money is to fold it once and put it in your pocket.",
        "Gambling is an inherent principle of human nature.",
        "Eat your betting money but don't bet your eating money",
        "Gambling costs us the two most precious things in life: time and money"
      ];
      
      const name = await Users.getNameUser(senderID);
      
      const imageUrls = [
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/3",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/4",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/5",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/6",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/7",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/8",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/9",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/10",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/11",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/12",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/13",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/14",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/15",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/16",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/17",
        "https://raw.githubusercontent.com/BuiLeBaoLuanProCoder/masoi/main/18"
      ];

      if (!args[0]) {
        return message.reply("Please specify your bet: big or small...");
      }
      
      const choose = args[0].toLowerCase();
      if (choose !== 'big' && choose !== 'small') {
        return message.reply("Only bet on big or small!");
      }
      
      const money = parseInt(args[1]);
      if (money < 500 || isNaN(money)) {
        return message.reply("Your bet amount is invalid or below 500$!!!");
      }
      
      if (moneyUser < money) {
        return message.reply(`You don't have enough ${money}$ to play\nYour current balance is ${moneyUser}$`);
      }

      try {
        const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        const res = await axios.get(randomUrl);
        const ketqua = res.data.total;
        const result = res.data.result.toLowerCase();
        const images = [];
        
        for (let i in res.data.images) {
          const path = __dirname + `/cache/${i}.png`;
          const imgData = (await axios.get(res.data.images[i], { responseType: "arraybuffer" })).data;
          fs.writeFileSync(path, Buffer.from(imgData, "utf-8"));
          images.push(fs.createReadStream(path));
        }

        if (choose === result) {
          await Currencies.increaseMoney(senderID, parseInt(money * 1));
          message.reply({
            attachment: images,
            body: `====== DICE GAME RESULTS ======\n` +
              `👤 Player: ${name}\n` +
              `✅ Result: ${result}\n` +
              `🎲 Total Dice: ${ketqua}\n` +
              `🎯 Your Choice: ${choose}\n` +
              `💰 You won: ${money * 1}$\n` +
              `📈 Status: Reward Paid\n` +
              `──────────────────\n` +
              `💼 Current Balance: ${moneyUser + money * 1}$\n` +
              `💡 Advice: ${quotes[Math.floor(Math.random() * quotes.length)]}\n` +
              `====== GAME COMPLETED ======`
          });
        } else {
          await Currencies.decreaseMoney(senderID, parseInt(money));
          message.reply({
            attachment: images,
            body: `====== DICE GAME RESULTS ======\n` +
              `👤 Player: ${name}\n` +
              `✅ Result: ${result}\n` +
              `🎲 Total Dice: ${ketqua}\n` +
              `🎯 Your Choice: ${choose}\n` +
              `💔 You lost: ${money * 1}$\n` +
              `📉 Status: Amount Deducted\n` +
              `──────────────────\n` +
              `💼 Current Balance: ${moneyUser - money * 1}$\n` +
              `💡 Advice: ${quotes[Math.floor(Math.random() * quotes.length)]}\n` +
              `====== GAME COMPLETED ======`
          });
        }

        for (let i = 0; i < images.length; i++) {
          try {
            fs.unlinkSync(__dirname + `/cache/${i}.png`);
          } catch (err) {
            console.log("Error deleting cached image:", err);
          }
        }

      } catch (err) {
        console.error("Dice game error:", err);
        return message.reply("An error occurred while processing the game");
      }
      
    } catch (error) {
      console.error("General error:", error);
      message.reply("❌ An error occurred");
    }
  }
};
