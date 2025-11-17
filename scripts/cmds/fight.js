const TIMEOUT_SECONDS = 120;
const ongoingFights = new Map();
const gameInstances = new Map();

module.exports = {
  config: {
    name: "fight",
    aliases: ["duel", "conflict"],
    version: "1.1",
    author: "𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "⚔️ 𝐅𝐈𝐆𝐇𝐓 𝐖𝐈𝐓𝐇 𝐅𝐑𝐈𝐄𝐍𝐃𝐒"
    },
    longDescription: {
      en: "💥 𝐂𝐇𝐀𝐋𝐋𝐄𝐍𝐆𝐄 𝐘𝐎𝐔𝐑 𝐅𝐑𝐈𝐄𝐍𝐃 𝐓𝐎 𝐀𝐍 𝐄𝐏𝐈𝐂 𝐁𝐀𝐓𝐓𝐋𝐄"
    },
    category: "𝐆𝐀𝐌𝐄",
    guide: {
      en: "{p}𝐟𝐢𝐠𝐡𝐭 @𝐦𝐞𝐧𝐭𝐢𝐨𝐧"
    }
  },

  onStart: async function ({ event, message, usersData }) {
    try {
      const threadID = event.threadID;
      if (ongoingFights.has(threadID)) {
        return message.reply("⚔️ | 𝐀𝐋𝐑𝐄𝐀𝐃𝐘 𝐀 𝐅𝐈𝐆𝐇𝐓 𝐎𝐍𝐆𝐎𝐈𝐍𝐆 𝐈𝐍 𝐓𝐇𝐈𝐒 𝐆𝐑𝐎𝐔𝐏!");
      }

      const mention = Object.keys(event.mentions);
      if (mention.length !== 1) {
        return message.reply("❓ | 𝐌𝐄𝐍𝐓𝐈𝐎𝐍 𝐎𝐍𝐄 𝐏𝐄𝐑𝐒𝐎𝐍 𝐓𝐎 𝐅𝐈𝐆𝐇𝐓 𝐖𝐈𝐓𝐇!");
      }

      const challengerID = event.senderID;
      const opponentID = mention[0];
      
      if (challengerID === opponentID) {
        return message.reply("⚠️ | 𝐘𝐎𝐔 𝐂𝐀𝐍𝐍𝐎𝐓 𝐅𝐈𝐆𝐇𝐓 𝐘𝐎𝐔𝐑𝐒𝐄𝐋𝐅!");
      }

      const challenger = await usersData.getName(challengerID);
      const opponent = await usersData.getName(opponentID);

      const fight = {
        participants: [
          { id: challengerID, name: challenger, hp: 100 },
          { id: opponentID, name: opponent, hp: 100 }
        ],
        currentPlayer: Math.random() < 0.5 ? challengerID : opponentID,
        threadID
      };

      const gameInstance = {
        fight,
        lastAttack: null,
        lastPlayer: null,
        timeoutID: null,
        turnMessageSent: false
      };

      gameInstances.set(threadID, gameInstance);
      startFight(message, fight);
      startTimeout(threadID, message);

    } catch (error) {
      console.error("𝐅𝐈𝐆𝐇𝐓 𝐎𝐍𝐒𝐓𝐀𝐑𝐓 𝐄𝐑𝐑𝐎𝐑:", error);
      message.reply("❌ 𝐀𝐍 𝐄𝐑𝐑𝐎𝐑 𝐎𝐂𝐂𝐔𝐑𝐑𝐄𝐃 𝐖𝐇𝐈𝐋𝐄 𝐒𝐓𝐀𝐑𝐓𝐈𝐍𝐆 𝐓𝐇𝐄 𝐅𝐈𝐆𝐇𝐓.");
    }
  },

  onChat: async function ({ event, message, usersData }) {
    try {
      const threadID = event.threadID;
      const gameInstance = gameInstances.get(threadID);
      if (!gameInstance) return;

      const currentPlayerID = gameInstance.fight.currentPlayer;
      const currentPlayer = gameInstance.fight.participants.find(p => p.id === currentPlayerID);
      const attack = event.body.trim().toLowerCase();

      if (event.senderID !== currentPlayerID) {
        if (!gameInstance.turnMessageSent) {
          gameInstance.turnMessageSent = true;
          return message.reply(`⏳ | 𝐈𝐓'𝐒 ${currentPlayer.name}'𝐒 𝐓𝐔𝐑𝐍!`);
        }
        return;
      }

      const opponent = gameInstance.fight.participants.find(p => p.id !== currentPlayerID);

      if (attack === "forfeit") {
        message.reply(`🏃 | ${currentPlayer.name} 𝐅𝐎𝐑𝐅𝐄𝐈𝐓𝐄𝐃! ${opponent.name} 𝐖𝐈𝐍𝐒! 🏆`);
        return endFight(threadID);
      }

      if (["kick", "punch", "slap"].includes(attack)) {
        const damage = Math.random() < 0.1 ? 0 : Math.floor(Math.random() * 20 + 10);
        opponent.hp -= damage;

        const attackEmojis = {
          kick: "🦶",
          punch: "👊",
          slap: "✋"
        };

        await message.reply(
          `${attackEmojis[attack]} | ${currentPlayer.name} 𝐔𝐒𝐄𝐒 ${attack.toUpperCase()} 𝐎𝐍 ${opponent.name}\n` +
          `💥 𝐃𝐀𝐌𝐀𝐆𝐄: ${damage} 𝐇𝐏\n` +
          `❤️ ${opponent.name}: ${opponent.hp} 𝐇𝐏 | ${currentPlayer.name}: ${currentPlayer.hp} 𝐇𝐏`
        );

        if (opponent.hp <= 0) {
          await message.reply(
            `🏁 | ${opponent.name} 𝐈𝐒 𝐃𝐄𝐅𝐄𝐀𝐓𝐄𝐃! ${currentPlayer.name} 𝐖𝐈𝐍𝐒 𝐓𝐇𝐄 𝐁𝐀𝐓𝐓𝐋𝐄! 🎉`
          );
          return endFight(threadID);
        }

        gameInstance.fight.currentPlayer = opponent.id;
        gameInstance.lastAttack = attack;
        gameInstance.lastPlayer = currentPlayer;
        gameInstance.turnMessageSent = false;

        message.reply(`🎯 | 𝐍𝐎𝐖 𝐈𝐓'𝐒 ${opponent.name}'𝐒 𝐓𝐔𝐑𝐍!`);
      } else {
        message.reply("❌ | 𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐀𝐓𝐓𝐀𝐂𝐊! 𝐔𝐒𝐄 '𝐊𝐈𝐂𝐊', '𝐏𝐔𝐍𝐂𝐇', '𝐒𝐋𝐀𝐏', 𝐎𝐑 '𝐅𝐎𝐑𝐅𝐄𝐈𝐓'");
      }
    } catch (error) {
      console.error("𝐅𝐈𝐆𝐇𝐓 𝐎𝐍𝐂𝐇𝐀𝐓 𝐄𝐑𝐑𝐎𝐑:", error);
      message.reply("❌ 𝐀𝐍 𝐄𝐑𝐑𝐎𝐑 𝐎𝐂𝐂𝐔𝐑𝐑𝐄𝐃 𝐃𝐔𝐑𝐈𝐍𝐆 𝐓𝐇𝐄 𝐅𝐈𝐆𝐇𝐓.");
    }
  }
};

function startFight(message, fight) {
  ongoingFights.set(fight.threadID, fight);
  const [p1, p2] = fight.participants;
  const starter = fight.participants.find(p => p.id === fight.currentPlayer);
  message.reply(
    `⚔️ | ${p1.name} 𝐂𝐇𝐀𝐋𝐋𝐄𝐍𝐆𝐄𝐃 ${p2.name} 𝐓𝐎 𝐀 𝐅𝐈𝐆𝐇𝐓!\n` +
    `❤️ 𝐁𝐎𝐓𝐇 𝐇𝐀𝐕𝐄 𝟏𝟎𝟎 𝐇𝐏\n` +
    `🎲 ${starter.name} 𝐆𝐎𝐄𝐒 𝐅𝐈𝐑𝐒𝐓!\n` +
    `📝 𝐀𝐕𝐀𝐈𝐋𝐀𝐁𝐋𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒: 𝐊𝐈𝐂𝐊, 𝐏𝐔𝐍𝐂𝐇, 𝐒𝐋𝐀𝐏, 𝐅𝐎𝐑𝐅𝐄𝐈𝐓`
  );
}

function startTimeout(threadID, message) {
  const timeoutID = setTimeout(() => {
    const gameInstance = gameInstances.get(threadID);
    if (!gameInstance) return;

    const { participants } = gameInstance.fight;
    const winner = participants[0].hp > participants[1].hp ? participants[0] : participants[1];
    const loser = participants[0].hp > participants[1].hp ? participants[1] : participants[0];

    message.reply(
      `⏰ | 𝐓𝐈𝐌𝐄'𝐒 𝐔𝐏! ${winner.name} 𝐖𝐈𝐍𝐒 𝐖𝐈𝐓𝐇 ${winner.hp} 𝐇𝐏! 🏆\n` +
      `💔 ${loser.name} 𝐋𝐎𝐒𝐓 𝐖𝐈𝐓𝐇 ${loser.hp} 𝐇𝐏`
    );
    endFight(threadID);
  }, TIMEOUT_SECONDS * 1000);

  gameInstances.get(threadID).timeoutID = timeoutID;
}

function endFight(threadID) {
  const gameInstance = gameInstances.get(threadID);
  if (gameInstance?.timeoutID) {
    clearTimeout(gameInstance.timeoutID);
  }
  gameInstances.delete(threadID);
  ongoingFights.delete(threadID);
}
