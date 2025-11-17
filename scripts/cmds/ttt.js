'use strict';

let games = {};
let points = {}; // Point system

function checkWinner(board) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (const [a,b,c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

function displayBoard(board) {
  let out = "";
  for (let i = 0; i < 9; i++) {
    out += board[i] ?? "⬛";
    out += (i + 1) % 3 === 0 ? "\n" : " ";
  }
  return out;
}

function makeBotMove(board) {
  const bot = "⭕";
  const player = "❌";

  // Try winning
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = bot;
      if (checkWinner(board)) return;
      board[i] = null;
    }
  }
  // Block player
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = player;
      if (checkWinner(board)) {
        board[i] = bot;
        return;
      }
      board[i] = null;
    }
  }
  // Else random
  const empty = board.map((v, i) => v === null ? i : -1).filter(v => v !== -1);
  const rand = empty[Math.floor(Math.random() * empty.length)];
  if (rand !== undefined) board[rand] = bot;
}

function resetGame(playerID) {
  games[playerID] = {
    board: Array(9).fill(null)
  };
}

module.exports = {
  config: {
    name: "ttt",
    aliases: ["tictactoe"],
    version: "2.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "game",
    shortDescription: {
      en: "🎮 𝑃𝑙𝑎𝑦 𝑇𝑖𝑐𝑇𝑎𝑐𝑇𝑜𝑒 𝑤𝑖𝑡ℎ 𝑏𝑜𝑡"
    },
    longDescription: {
      en: "𝐶𝑙𝑎𝑠𝑠𝑖𝑐 𝑇𝑖𝑐𝑇𝑎𝑐𝑇𝑜𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝐴𝐼 𝑏𝑜𝑡 𝑎𝑛𝑑 𝑠𝑐𝑜𝑟𝑒 𝑡𝑟𝑎𝑐𝑘𝑖𝑛𝑔"
    },
    guide: {
      en: "{p}ttt [𝑠𝑡𝑜𝑝|𝑒𝑥𝑖𝑡]"
    },
    countDown: 2
  },

  onStart: async function ({ event, args, message }) {
    const id = event.senderID;
    const sub = args[0]?.toLowerCase();

    // Stop logic
    if (sub && ["stop", "exit", "off"].includes(sub)) {
      if (games[id]) {
        delete games[id];
        return message.reply("🛑 𝐺𝑎𝑚𝑒 𝑠𝑡𝑜𝑝𝑝𝑒𝑑. 𝑇𝑦𝑝𝑒 '𝑡𝑡𝑡' 𝑡𝑜 𝑝𝑙𝑎𝑦 𝑎𝑔𝑎𝑖𝑛.");
      } else {
        return message.reply("𝑁𝑜 𝑎𝑐𝑡𝑖𝑣𝑒 𝑔𝑎𝑚𝑒. 𝑇𝑦𝑝𝑒 '𝑡𝑡𝑡' 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑎 𝑛𝑒𝑤 𝑔𝑎𝑚𝑒.");
      }
    }

    // Start new game
    resetGame(id);
    if (!points[id]) points[id] = { win: 0, draw: 0, lose: 0 };

    const msg = `🎮 𝐿𝑒𝑡'𝑠 𝑝𝑙𝑎𝑦 𝑇𝑖𝑐𝑇𝑎𝑐𝑇𝑜𝑒!
𝑌𝑜𝑢 𝑎𝑟𝑒 ❌, 𝐵𝑜𝑡 𝑖𝑠 ⭕
𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑛𝑢𝑚𝑏𝑒𝑟 1-9

📊 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑆𝑐𝑜𝑟𝑒:
✅ 𝑊𝑖𝑛𝑠: ${points[id].win}
🤝 𝐷𝑟𝑎𝑤𝑠: ${points[id].draw}
❌ 𝐿𝑜𝑠𝑠𝑒𝑠: ${points[id].lose}

𝑇𝑜 𝑠𝑡𝑜𝑝 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒: 𝑡𝑦𝑝𝑒 "𝑡𝑡𝑡 𝑠𝑡𝑜𝑝"`;

    await message.reply(msg);
    return message.reply(displayBoard(games[id].board));
  },

  onChat: async function ({ event, message }) {
    const id = event.senderID;
    const text = event.body?.trim();

    // Only process numbers 1-9
    if (!/^[1-9]$/.test(text)) return;

    if (!games[id]) return;

    const pos = parseInt(text, 10);
    if (games[id].board[pos - 1]) {
      return message.reply("❗ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑚𝑜𝑣𝑒. 𝑇𝑟𝑦 𝑎𝑛 𝑒𝑚𝑝𝑡𝑦 𝑐𝑒𝑙𝑙 (1-9).");
    }

    // User move
    games[id].board[pos - 1] = "❌";

    // Check user win
    let winner = checkWinner(games[id].board);
    if (winner) {
      points[id].win++;
      await message.reply(displayBoard(games[id].board));
      delete games[id];
      return message.reply("🎉 𝑌𝑜𝑢 𝑤𝑖𝑛! 🎉");
    }

    // Check draw
    if (isBoardFull(games[id].board)) {
      points[id].draw++;
      await message.reply(displayBoard(games[id].board));
      delete games[id];
      return message.reply("🤝 𝐼𝑡'𝑠 𝑎 𝑑𝑟𝑎𝑤!");
    }

    // Bot move
    makeBotMove(games[id].board);

    winner = checkWinner(games[id].board);
    if (winner) {
      points[id].lose++;
      await message.reply(displayBoard(games[id].board));
      delete games[id];
      return message.reply("😢 𝑌𝑜𝑢 𝑙𝑜𝑠𝑡!");
    }

    if (isBoardFull(games[id].board)) {
      points[id].draw++;
      await message.reply(displayBoard(games[id].board));
      delete games[id];
      return message.reply("🤝 𝐼𝑡'𝑠 𝑎 𝑑𝑟𝑎𝑤!");
    }

    // Continue game
    return message.reply(displayBoard(games[id].board));
  }
};
