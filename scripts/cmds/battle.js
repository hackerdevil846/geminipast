const TIMEOUT_SECONDS = 120;
const ongoingFights = new Map();
const gameInstances = new Map();

module.exports = {
    config: {
        name: "battle",
        aliases: [],
        version: "1.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        shortDescription: {
            en: "⚔️ 𝐹𝑖𝑔ℎ𝑡 𝑤𝑖𝑡ℎ 𝑓𝑟𝑖𝑒𝑛𝑑𝑠"
        },
        longDescription: {
            en: "💥 𝐶ℎ𝑎𝑙𝑙𝑒𝑛𝑔𝑒 𝑦𝑜𝑢𝑟 𝑓𝑟𝑖𝑒𝑛𝑑 𝑡𝑜 𝑎𝑛 𝑒𝑝𝑖𝑐 𝑏𝑎𝑡𝑡𝑙𝑒"
        },
        category: "𝑔𝑎𝑚𝑒",
        guide: {
            en: "{p}𝑏𝑎𝑡𝑡𝑙𝑒 @𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
        }
    },

    onStart: async function ({ event, message, usersData }) {
        const threadID = event.threadID;
        if (ongoingFights.has(threadID)) {
            return message.reply("⚔️ | 𝐴𝑙𝑟𝑒𝑎𝑑𝑦 𝑎 𝑏𝑎𝑡𝑡𝑙𝑒 𝑜𝑛𝑔𝑜𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
        }

        const mention = Object.keys(event.mentions);
        if (mention.length !== 1) {
            return message.reply("❓ | 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑛𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑡𝑜 𝑏𝑎𝑡𝑡𝑙𝑒 𝑤𝑖𝑡ℎ!");
        }

        const challengerID = event.senderID;
        const opponentID = mention[0];
        
        if (challengerID === opponentID) {
            return message.reply("⚠️ | 𝑌𝑜𝑢 𝑐𝑎𝑛𝑛𝑜𝑡 𝑏𝑎𝑡𝑡𝑙𝑒 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓!");
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
    },

    onChat: async function ({ event, message, usersData }) {
        const threadID = event.threadID;
        const gameInstance = gameInstances.get(threadID);
        if (!gameInstance) return;

        const currentPlayerID = gameInstance.fight.currentPlayer;
        const currentPlayer = gameInstance.fight.participants.find(p => p.id === currentPlayerID);
        const attack = event.body.trim().toLowerCase();

        if (event.senderID !== currentPlayerID) {
            if (!gameInstance.turnMessageSent) {
                gameInstance.turnMessageSent = true;
                return message.reply(`⏳ | 𝐼𝑡'𝑠 ${currentPlayer.name}'𝑠 𝑡𝑢𝑟𝑛!`);
            }
            return;
        }

        const opponent = gameInstance.fight.participants.find(p => p.id !== currentPlayerID);

        if (attack === "forfeit") {
            message.reply(`🏃 | ${currentPlayer.name} 𝑓𝑜𝑟𝑓𝑒𝑖𝑡𝑒𝑑! ${opponent.name} 𝑤𝑖𝑛𝑠! 🏆`);
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
                `${attackEmojis[attack]} | ${currentPlayer.name} 𝑢𝑠𝑒𝑠 ${attack} 𝑜𝑛 ${opponent.name}\n` +
                `💥 𝐷𝑎𝑚𝑎𝑔𝑒: ${damage} 𝐻𝑃\n` +
                `❤️ ${opponent.name}: ${opponent.hp} 𝐻𝑃 | ${currentPlayer.name}: ${currentPlayer.hp} 𝐻𝑃`
            );

            if (opponent.hp <= 0) {
                await message.reply(
                    `🏁 | ${opponent.name} 𝑖𝑠 𝑑𝑒𝑓𝑒𝑎𝑡𝑒𝑑! ${currentPlayer.name} 𝑤𝑖𝑛𝑠 𝑡ℎ𝑒 𝑏𝑎𝑡𝑡𝑙𝑒! 🎉`
                );
                return endFight(threadID);
            }

            gameInstance.fight.currentPlayer = opponent.id;
            gameInstance.lastAttack = attack;
            gameInstance.lastPlayer = currentPlayer;
            gameInstance.turnMessageSent = false;

            message.reply(`🎯 | 𝑁𝑜𝑤 𝑖𝑡'𝑠 ${opponent.name}'𝑠 𝑡𝑢𝑟𝑛!`);
        } else {
            message.reply("❌ | 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑡𝑡𝑎𝑐𝑘! 𝑈𝑠𝑒 '𝑘𝑖𝑐𝑘', '𝑝𝑢𝑛𝑐ℎ', '𝑠𝑙𝑎𝑝', 𝑜𝑟 '𝑓𝑜𝑟𝑓𝑒𝑖𝑡'");
        }
    }
};

function startFight(message, fight) {
    ongoingFights.set(fight.threadID, fight);
    const [p1, p2] = fight.participants;
    const starter = fight.participants.find(p => p.id === fight.currentPlayer);
    message.reply(
        `⚔️ | ${p1.name} 𝑐ℎ𝑎𝑙𝑙𝑒𝑛𝑔𝑒𝑑 ${p2.name} 𝑡𝑜 𝑎 𝑏𝑎𝑡𝑡𝑙𝑒!\n` +
        `❤️ 𝐵𝑜𝑡ℎ ℎ𝑎𝑣𝑒 100 𝐻𝑃\n` +
        `🎲 ${starter.name} 𝑔𝑜𝑒𝑠 𝑓𝑖𝑟𝑠𝑡!\n` +
        `📝 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠: 𝑘𝑖𝑐𝑘, 𝑝𝑢𝑛𝑐ℎ, 𝑠𝑙𝑎𝑝, 𝑓𝑜𝑟𝑓𝑒𝑖𝑡`
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
            `⏰ | 𝑇𝑖𝑚𝑒'𝑠 𝑢𝑝! ${winner.name} 𝑤𝑖𝑛𝑠 𝑤𝑖𝑡ℎ ${winner.hp} 𝐻𝑃! 🏆\n` +
            `💔 ${loser.name} 𝑙𝑜𝑠𝑡 𝑤𝑖𝑡ℎ ${loser.hp} 𝐻𝑃`
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
