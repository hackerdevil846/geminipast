module.exports = {
  config: {
    name: "top",
    aliases: [],
    version: "2.0.0",
    author: "Asif Mahmud",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🏆 Server top charts - Money, Levels, Groups"
    },
    longDescription: {
      en: "Shows top users and groups based on money, experience levels, and group activity"
    },
    guide: {
      en: "{p}top [money/level/thread] [number]"
    },
    countDown: 10
  },

  onStart: async function({ api, event, args, message, usersData, threadsData }) {
    try {
      const { threadID } = event;

      // Validate number input
      const numberInput = args[1] ? parseInt(args[1]) : 10;
      if (isNaN(numberInput) || numberInput <= 0 || numberInput > 50) {
        return message.reply("❌ Please enter a valid number between 1 and 50");
      }

      const option = Math.min(numberInput, 50); // Maximum 50 results

      // Advanced level calculation formula
      const expToLevel = (exp) => {
        if (exp < 0) return 0;
        return Math.floor((Math.sqrt(1 + (4 * exp) / 3) + 1) / 2);
      };

      // Money formatting function
      const formatMoney = (amount) => {
        if (amount >= 1e15) return (amount / 1e15).toFixed(2) + "Q";
        if (amount >= 1e12) return (amount / 1e12).toFixed(2) + "T";
        if (amount >= 1e9) return (amount / 1e9).toFixed(2) + "B";
        if (amount >= 1e6) return (amount / 1e6).toFixed(2) + "M";
        if (amount >= 1e3) return (amount / 1e3).toFixed(2) + "K";
        return amount.toString();
      };

      const action = args[0]?.toLowerCase();

      switch (action) {
        case "money":
        case "rich":
        case "cash": {
          try {
            const allUsers = await usersData.getAll();
            const usersWithMoney = allUsers
              .filter(user => user && user.money !== undefined && user.money !== null)
              .sort((a, b) => (b.money || 0) - (a.money || 0))
              .slice(0, option);

            if (usersWithMoney.length === 0) {
              return message.reply("💸 No users with money data found!");
            }

            let moneyMsg = "╔══════════════════════════════╗\n";
            moneyMsg +=     "║          💰 TOP RICHEST 💰         ║\n";
            moneyMsg +=     "╚══════════════════════════════╝\n\n";

            for (let i = 0; i < usersWithMoney.length; i++) {
              try {
                const user = usersWithMoney[i];
                const userInfo = await api.getUserInfo(user.id);
                const userName = userInfo[user.id]?.name || "Unknown User";
                const money = user.money || 0;
                const formattedMoney = formatMoney(money);
                
                const rankEmoji = i === 0 ? "👑" : i === 1 ? "💎" : i === 2 ? "⭐" : "🔸";
                
                moneyMsg += `${rankEmoji} 【${i + 1}】 ${userName}\n`;
                moneyMsg += `   ╰─ 💵 $${formattedMoney}\n\n`;
              } catch (userError) {
                moneyMsg += `🔸 【${i + 1}】 Unknown User\n`;
                moneyMsg += `   ╰─ 💵 $${formatMoney(usersWithMoney[i].money || 0)}\n\n`;
              }
            }

            moneyMsg += "💡 Money isn't everything, but it's a good start!";
            await message.reply(moneyMsg);

          } catch (error) {
            console.error("Money leaderboard error:", error);
            await message.reply("❌ Failed to retrieve money data. Please try again.");
          }
          break;
        }

        case "level":
        case "exp":
        case "user": {
          try {
            const allUsers = await usersData.getAll();
            const usersWithExp = allUsers
              .filter(user => user && user.exp !== undefined && user.exp !== null)
              .sort((a, b) => (b.exp || 0) - (a.exp || 0))
              .slice(0, option);

            if (usersWithExp.length === 0) {
              return message.reply("📊 No users with experience data found!");
            }

            let levelMsg = "╔══════════════════════════════╗\n";
            levelMsg +=     "║         🏆 TOP LEVELS 🏆         ║\n";
            levelMsg +=     "╚══════════════════════════════╝\n\n";

            for (let i = 0; i < usersWithExp.length; i++) {
              try {
                const user = usersWithExp[i];
                const userInfo = await api.getUserInfo(user.id);
                const userName = userInfo[user.id]?.name || "Unknown User";
                const exp = user.exp || 0;
                const level = expToLevel(exp);
                
                // Progress bar calculation
                const progressBarLength = 12;
                const currentLevelExp = level * (level - 1) * 3 / 2;
                const nextLevelExp = level * (level + 1) * 3 / 2;
                const progress = Math.min(1, (exp - currentLevelExp) / (nextLevelExp - currentLevelExp));
                const filledBars = Math.floor(progress * progressBarLength);
                const emptyBars = progressBarLength - filledBars;
                
                const progressBar = '█'.repeat(filledBars) + '░'.repeat(emptyBars);
                const rankEmoji = i === 0 ? "👑" : i === 1 ? "💎" : i === 2 ? "⭐" : "🔹";

                levelMsg += `${rankEmoji} 【${i + 1}】 ${userName}\n`;
                levelMsg += `   ╭─ Level: ${level} ✨\n`;
                levelMsg += `   ╰─ Exp: ${exp} [${progressBar}]\n\n`;
              } catch (userError) {
                const exp = usersWithExp[i].exp || 0;
                const level = expToLevel(exp);
                levelMsg += `🔹 【${i + 1}】 Unknown User\n`;
                levelMsg += `   ╰─ Level: ${level} ✨\n\n`;
              }
            }

            levelMsg += "🌟 Keep chatting to level up!";
            await message.reply(levelMsg);

          } catch (error) {
            console.error("Level leaderboard error:", error);
            await message.reply("❌ Failed to retrieve user data. Please try again.");
          }
          break;
        }

        case "thread":
        case "group":
        case "groups": {
          try {
            const threadList = await api.getThreadList(100, null, ["INBOX"]);
            const groupThreads = threadList
              .filter(thread => thread.isGroup && thread.threadID !== event.threadID)
              .sort((a, b) => (b.messageCount || 0) - (a.messageCount || 0))
              .slice(0, option);

            if (groupThreads.length === 0) {
              return message.reply("💬 No active groups found!");
            }

            let threadMsg = "╔══════════════════════════════════╗\n";
            threadMsg +=     "║        📊 TOP ACTIVE GROUPS 📊       ║\n";
            threadMsg +=     "╚══════════════════════════════════╝\n\n";

            for (let i = 0; i < groupThreads.length; i++) {
              const thread = groupThreads[i];
              const threadName = thread.name || "Unnamed Group";
              const messageCount = thread.messageCount || 0;
              const participantCount = thread.participantIDs?.length || 0;
              
              const rankEmoji = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔸";

              threadMsg += `${rankEmoji} 【${i + 1}】 ${threadName}\n`;
              threadMsg += `   ╭─ 💬 Messages: ${messageCount.toLocaleString()}\n`;
              threadMsg += `   ╰─ 👥 Members: ${participantCount}\n\n`;
            }

            threadMsg += "💡 These are the most active groups!";
            await message.reply(threadMsg);

          } catch (error) {
            console.error("Thread leaderboard error:", error);
            await message.reply("❌ Failed to retrieve group data. Please try again.");
          }
          break;
        }

        default: {
          const helpMsg = "╔══════════════════════════════╗\n";
          helpMsg +=     "║        📖 TOP COMMAND HELP 📖       ║\n";
          helpMsg +=     "╚══════════════════════════════╝\n\n";
          helpMsg +=     "✨ Available Options:\n\n";
          helpMsg +=     "▸ top money [number] - Top richest users\n";
          helpMsg +=     "   ↳ Example: top money 10\n\n";
          helpMsg +=     "▸ top level [number] - Top users by level\n";
          helpMsg +=     "   ↳ Example: top level 5\n\n";
          helpMsg +=     "▸ top thread [number] - Most active groups\n";
          helpMsg +=     "   ↳ Example: top thread 8\n\n";
          helpMsg +=     "💡 Default: 10 results (max: 50)\n";
          helpMsg +=     "🌟 Use different categories to see various rankings!";
          
          await message.reply(helpMsg);
          break;
        }
      }

    } catch (error) {
      console.error("Top command main error:", error);
      await message.reply("❌ An error occurred while processing the command. Please try again.");
    }
  }
};
