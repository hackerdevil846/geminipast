const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');

module.exports = {
  config: {
    name: "quizgame",
    aliases: ["qz"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "games",
    shortDescription: {
      en: "🎯 𝑃𝑙𝑎𝑦 𝑎 𝑞𝑢𝑖𝑧 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛𝑠"
    },
    longDescription: {
      en: "𝑇𝑒𝑠𝑡 𝑦𝑜𝑢𝑟 𝑘𝑛𝑜𝑤𝑙𝑒𝑑𝑔𝑒 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑞𝑢𝑖𝑧 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛𝑠 𝑓𝑟𝑜𝑚 𝐽𝑆𝑂𝑁 𝑓𝑖𝑙𝑒𝑠"
    },
    guide: {
      en: "{p}quizgame"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, message, usersData }) {
    try {
      const quizDataPath = path.join(__dirname, 'json');
      
      if (!fs.existsSync(quizDataPath)) {
        return message.reply("❌ 𝑄𝑢𝑖𝑧 𝑑𝑎𝑡𝑎 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛.");
      }

      const allFiles = fs.readdirSync(quizDataPath).filter(file => file.endsWith('.json'));
      
      if (allFiles.length === 0) {
        return message.reply("❌ 𝑁𝑜 𝑞𝑢𝑖𝑧 𝑑𝑎𝑡𝑎 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛.");
      }

      const randomFile = allFiles[crypto.randomInt(allFiles.length)];
      const filePath = path.join(quizDataPath, randomFile);

      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (!Array.isArray(data) || data.length === 0) {
        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑞𝑢𝑖𝑧 𝑑𝑎𝑡𝑎 𝑓𝑜𝑟𝑚𝑎𝑡.");
      }

      const randomQuestion = data[crypto.randomInt(data.length)];
      
      if (!randomQuestion || !randomQuestion.question || !randomQuestion.answer) {
        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛 𝑓𝑜𝑟𝑚𝑎𝑡.");
      }

      // Format question with stylish font
      const questionText = `╭──✦ ${randomQuestion.question}\n├‣ 𝗔) ${randomQuestion.A || 'Option A'}\n├‣ 𝗕) ${randomQuestion.B || 'Option B'}\n├‣ 𝗖) ${randomQuestion.C || 'Option C'}\n├‣ 𝗗) ${randomQuestion.D || 'Option D'}\n╰──────────────────‣\n𝚁𝚎𝚙𝚕𝚢 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝚊𝚗𝚜𝚠𝚎𝚛.`;

      // Send message and set reply listener
      message.reply(questionText, (err, info) => {
        if (err) return console.error(err);
        
        // Store quiz data for reply handling
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          correctAnswer: randomQuestion.answer.toUpperCase(),
          question: randomQuestion.question,
          attempts: 0,
          maxAttempts: 2
        });

        // Auto remove after 5 minutes (300 seconds)
        setTimeout(() => {
          if (global.GoatBot.onReply.has(info.messageID)) {
            api.unsendMessage(info.messageID);
            global.GoatBot.onReply.delete(info.messageID);
          }
        }, 300000);
      });

    } catch (error) {
      console.error('𝑄𝑢𝑖𝑧 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡ℎ𝑒 𝑞𝑢𝑖𝑧 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛.");
    }
  },

  onReply: async function ({ api, event, Reply, message, usersData }) {
    const { author, correctAnswer, messageID, attempts, maxAttempts } = Reply;

    // Check if reply is from the same user
    if (event.senderID !== author) {
      return message.reply("❌ 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚙𝚕𝚊𝚢𝚎𝚛 𝚘𝚏 𝚝𝚑𝚒𝚜 𝚚𝚞𝚒𝚣!");
    }

    const userAnswer = event.body.trim().toUpperCase();
    
    // Validate answer format
    if (!['A', 'B', 'C', 'D'].includes(userAnswer)) {
      return message.reply("❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 𝙰, 𝙱, 𝙲, 𝚘𝚛 𝙳 𝚘𝚗𝚕𝚢!");
    }

    // Check if answer is correct
    if (userAnswer === correctAnswer) {
      // Remove reply listener
      global.GoatBot.onReply.delete(messageID);
      
      // Give rewards
      const rewardCoins = 300;
      const rewardExp = 100;
      const userName = await usersData.getName(event.senderID);
      
      await usersData.set(event.senderID, {
        money: (await usersData.get(event.senderID)).money + rewardCoins,
        exp: (await usersData.get(event.senderID)).exp + rewardExp,
      });

      const winMessage = `🎉 𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜, ${userName}! 𝚈𝚘𝚞 𝚐𝚘𝚝 𝚒𝚝 𝚛𝚒𝚐𝚑𝚝! 🏆\n\n` +
                        `✅ 𝙲𝚘𝚛𝚛𝚎𝚌𝚝 𝙰𝚗𝚜𝚠𝚎𝚛: ${correctAnswer}\n` +
                        `💰 𝚁𝚎𝚠𝚊𝚛𝚍: ${rewardCoins} 𝚌𝚘𝚒𝚗𝚜\n` +
                        `⭐ 𝙴𝚡𝚙: ${rewardExp} 𝚙𝚘𝚒𝚗𝚝𝚜\n\n` +
                        `𝙺𝚎𝚎𝚙 𝚙𝚕𝚊𝚢𝚒𝚗𝚐 𝚊𝚗𝚍 𝚝𝚎𝚜𝚝 𝚢𝚘𝚞𝚛 𝚔𝚗𝚘𝚠𝚕𝚎𝚍𝚐𝚎! 🚀`;
      
      message.reply(winMessage);
      api.unsendMessage(messageID);
      
    } else {
      // Wrong answer - check attempts
      const remainingAttempts = maxAttempts - attempts - 1;
      
      if (remainingAttempts <= 0) {
        // No attempts left
        global.GoatBot.onReply.delete(messageID);
        
        const loseMessage = `❌ 𝙶𝚊𝚖𝚎 𝙾𝚟𝚎𝚛! 𝚈𝚘𝚞'𝚟𝚎 𝚞𝚜𝚎𝚍 𝚊𝚕𝚕 𝚊𝚝𝚝𝚎𝚖𝚙𝚝𝚜.\n\n` +
                           `📝 𝙲𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛 𝚠𝚊𝚜: ${correctAnswer}\n` +
                           `💡 𝙱𝚎𝚝𝚝𝚎𝚛 𝚕𝚞𝚌𝚔 𝚗𝚎𝚡𝚝 𝚝𝚒𝚖𝚎!`;
        
        message.reply(loseMessage);
        api.unsendMessage(messageID);
        
      } else {
        // Update attempts and notify user
        Reply.attempts += 1;
        global.GoatBot.onReply.set(messageID, Reply);
        
        message.reply(`❌ 𝚆𝚛𝚘𝚗𝚐 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 ${remainingAttempts} 𝚊𝚝𝚝𝚎𝚖𝚙𝚝(𝚜) 𝚕𝚎𝚏𝚝. 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗!`);
      }
    }
  }
};
