const fs = require("fs-extra");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "tictactoe",
    aliases: ["ttt", "xoxo"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "game",
    shortDescription: {
      en: "🎮 𝑃𝑙𝑎𝑦 𝑇𝑖𝑐 𝑇𝑎𝑐 𝑇𝑜𝑒 𝑤𝑖𝑡ℎ 𝐴𝐼"
    },
    longDescription: {
      en: "𝐶𝑙𝑎𝑠𝑠𝑖𝑐 𝑇𝑖𝑐 𝑇𝑎𝑐 𝑇𝑜𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑖𝑛𝑡𝑒𝑙𝑙𝑖𝑔𝑒𝑛𝑡 𝐴𝐼 𝑜𝑝𝑝𝑜𝑛𝑒𝑛𝑡"
    },
    guide: {
      en: "{p}tictactoe [𝑥/𝑜/𝑑𝑒𝑙𝑒𝑡𝑒/𝑐𝑜𝑛𝑡𝑖𝑛𝑢𝑒]"
    },
    countDown: 5,
    dependencies: {
      "canvas": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      
      if (!global.tttGames) global.tttGames = new Map();
      let data = global.tttGames.get(threadID) || { gameOn: false, player: "𝒄𝒉𝒊𝒄𝒌𝒆𝒏 🐔" };
      
      if (args.length === 0) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑥 𝑜𝑟 𝑜 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑔𝑎𝑚𝑒");
      }

      const sub = args[0].toLowerCase();

      if (sub === "delete") {
        global.tttGames.delete(threadID);
        return message.reply("✅ 𝐺𝑎𝑚𝑒 𝑏𝑜𝑎𝑟𝑑 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!");
      }

      if (sub === "continue") {
        if (!data.gameOn) {
          return message.reply("❌ 𝑁𝑜 𝑎𝑐𝑡𝑖𝑣𝑒 𝑔𝑎𝑚𝑒 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑡𝑎𝑟𝑡 𝑎 𝑛𝑒𝑤 𝑔𝑎𝑚𝑒 𝑓𝑖𝑟𝑠𝑡");
        }
        
        return message.reply({
          body: "🎯 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑐𝑒𝑙𝑙 𝑛𝑢𝑚𝑏𝑒𝑟 (1-9) 𝑡𝑜 𝑚𝑎𝑘𝑒 𝑦𝑜𝑢𝑟 𝑚𝑜𝑣𝑒",
          attachment: await displayBoard(data)
        });
      }

      if (!data.gameOn) {
        if (sub !== "x" && sub !== "o") {
          return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑥 𝑜𝑟 𝑜 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑔𝑎𝑚𝑒");
        }

        const newData = startBoard({ isX: sub === "x", data: {} });
        
        if (sub === "x") {
          AIStart(newData);
          return message.reply({
            body: "🤖 𝐴𝐼 𝑠𝑡𝑎𝑟𝑡𝑠 𝑓𝑖𝑟𝑠𝑡!\n🎯 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑐𝑒𝑙𝑙 𝑛𝑢𝑚𝑏𝑒𝑟 (1-9)",
            attachment: await displayBoard(newData)
          });
        } else {
          return message.reply({
            body: "🎮 𝑌𝑜𝑢 𝑠𝑡𝑎𝑟𝑡 𝑓𝑖𝑟𝑠𝑡!\n🎯 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑐𝑒𝑙𝑙 𝑛𝑢𝑚𝑏𝑒𝑟 (1-9)",
            attachment: await displayBoard(newData)
          });
        }
      } else {
        return message.reply("✅ 𝐴 𝑔𝑎𝑚𝑒 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑟𝑢𝑛𝑛𝑖𝑛𝑔. 𝑈𝑠𝑒 '𝑐𝑜𝑛𝑡𝑖𝑛𝑢𝑒' 𝑡𝑜 𝑟𝑒𝑠𝑢𝑚𝑒 𝑜𝑟 '𝑑𝑒𝑙𝑒𝑡𝑒' 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑");
      }

    } catch (error) {
      console.error("TicTacToe Error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟");
    }
  },

  onReply: async function ({ api, event, message, Reply }) {
    try {
      const { threadID, messageID, senderID, body } = event;
      
      if (!global.tttGames || !global.tttGames.has(threadID)) {
        return message.reply("❌ 𝑁𝑜 𝑎𝑐𝑡𝑖𝑣𝑒 𝑔𝑎𝑚𝑒 𝑓𝑜𝑢𝑛𝑑");
      }

      const data = global.tttGames.get(threadID);
      const number = parseInt(body);

      if (isNaN(number) || number < 1 || number > 9) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 9");
      }

      const row = number < 4 ? 0 : number < 7 ? 1 : 2;
      const col = (number - 1) % 3;

      const result = makeMove(row, col, data);
      
      if (result && typeof result === "string") {
        return message.reply(result);
      }

      let gameResult = "𝒄𝒉𝒊𝒄𝒌𝒆𝒏 🐔";
      
      if (checkGameOver(data)) {
        const gayban = ["𝒄𝒉𝒊𝒄𝒌𝒆𝒏 🐔", "𝒉𝒂𝒕 🐔", "𝑾𝒉𝒂𝒕 𝒂𝒈𝒆 🐔", "𝒂 𝒃𝒊𝒕 𝒊𝒎𝒎𝒂𝒕𝒖𝒓𝒆 🐔", "𝒄𝒉𝒊𝒄𝒌𝒆𝒏 𝒗𝒄𝒍 🐔", "𝒆𝒂𝒔𝒚 𝒈𝒂𝒎𝒆 🐔"];
        
        if (checkAIWon(data)) {
          gameResult = `🤖 𝐴𝐼 𝑤𝑖𝑛𝑠! ${gayban[Math.floor(Math.random() * gayban.length)]}`;
        } else if (checkPlayerWon(data)) {
          gameResult = "🎉 𝑌𝑜𝑢 𝑤𝑖𝑛!";
        } else {
          gameResult = "🤝 𝐼𝑡'𝑠 𝑎 𝑑𝑟𝑎𝑤!";
        }
        global.tttGames.delete(threadID);
      }

      await message.reply({
        body: gameResult,
        attachment: await displayBoard(data)
      });

    } catch (error) {
      console.error("Reply Error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑚𝑜𝑣𝑒");
    }
  }
};

// Game Logic Functions
let AIMove;

function startBoard({ isX }) {
  const data = {
    board: Array(3).fill().map(() => Array(3).fill(0)),
    isX: isX,
    gameOn: true,
    gameOver: false
  };
  return data;
}

async function displayBoard(data) {
  const path = __dirname + "/cache/ttt.png";
  const canvas = createCanvas(1200, 1200);
  const ctx = canvas.getContext("2d");
  
  // Ensure cache directory exists
  try {
    if (!fs.existsSync(__dirname + "/cache")) {
      fs.mkdirSync(__dirname + "/cache", { recursive: true });
    }
  } catch (e) {}

  try {
    const background = await loadImage("https://i.postimg.cc/nhDWmj1h/background.png");
    const quanO = await loadImage("https://i.postimg.cc/rFP6xCLXQ/O.png");
    const quanX = await loadImage("https://i.postimg.cc/HLbFqcJh/X.png");

    ctx.drawImage(background, 0, 0, 1200, 1200);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellValue = data.board[i][j];
        const x = 54 + 366 * j;
        const y = 54 + 366 * i;
        
        if (cellValue === 1) {
          ctx.drawImage(data.isX ? quanO : quanX, x, y, 360, 360);
        } else if (cellValue === 2) {
          ctx.drawImage(data.isX ? quanX : quanO, x, y, 360, 360);
        }
      }
    }

    fs.writeFileSync(path, canvas.toBuffer("image/png"));
    return fs.createReadStream(path);
  } catch (error) {
    console.error("Display Board Error:", error);
    throw error;
  }
}

function checkAIWon(data) {
  const b = data.board;
  // Check diagonals
  if (b[0][0] === 1 && b[1][1] === 1 && b[2][2] === 1) return true;
  if (b[0][2] === 1 && b[1][1] === 1 && b[2][0] === 1) return true;
  
  // Check rows and columns
  for (let i = 0; i < 3; i++) {
    if (b[i][0] === 1 && b[i][1] === 1 && b[i][2] === 1) return true;
    if (b[0][i] === 1 && b[1][i] === 1 && b[2][i] === 1) return true;
  }
  return false;
}

function checkPlayerWon(data) {
  const b = data.board;
  // Check diagonals
  if (b[0][0] === 2 && b[1][1] === 2 && b[2][2] === 2) return true;
  if (b[0][2] === 2 && b[1][1] === 2 && b[2][0] === 2) return true;
  
  // Check rows and columns
  for (let i = 0; i < 3; i++) {
    if (b[i][0] === 2 && b[i][1] === 2 && b[i][2] === 2) return true;
    if (b[0][i] === 2 && b[1][i] === 2 && b[2][i] === 2) return true;
  }
  return false;
}

function getAvailable(data) {
  const available = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (data.board[i][j] === 0) available.push([i, j]);
    }
  }
  return available;
}

function placeMove(point, player, data) {
  data.board[point[0]][point[1]] = player;
}

function solveAIMove(depth, turn, data) {
  if (checkAIWon(data)) return 1;
  if (checkPlayerWon(data)) return -1;
  
  const available = getAvailable(data);
  if (available.length === 0) return 0;

  let max = -Infinity;
  let min = Infinity;

  for (const point of available) {
    placeMove(point, turn, data);
    
    if (turn === 1) {
      const score = solveAIMove(depth + 1, 2, data);
      max = Math.max(score, max);
      
      if (depth === 0) {
        if (score >= 0) AIMove = point;
        if (score === 1) break;
        if (score < 0 && available.indexOf(point) === available.length - 1) {
          AIMove = point;
        }
      }
    } else {
      const score = solveAIMove(depth + 1, 1, data);
      min = Math.min(score, min);
      if (min === -1) break;
    }
    
    placeMove(point, 0, data);
  }

  return turn === 1 ? max : min;
}

function makeMove(x, y, data) {
  const available = getAvailable(data);
  const playerMove = [x, y];
  
  const isValidMove = available.some(move => 
    move[0] === playerMove[0] && move[1] === playerMove[1]
  );

  if (!isValidMove) {
    return "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑚𝑜𝑣𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑎𝑛 𝑒𝑚𝑝𝑡𝑦 𝑐𝑒𝑙𝑙";
  }

  placeMove(playerMove, 2, data);

  if (checkPlayerWon(data) || getAvailable(data).length === 0) {
    return;
  }

  solveAIMove(0, 1, data);
  if (AIMove) {
    placeMove(AIMove, 1, data);
  }
}

function checkGameOver(data) {
  return getAvailable(data).length === 0 || checkAIWon(data) || checkPlayerWon(data);
}

function AIStart(data) {
  const available = getAvailable(data);
  if (available.length > 0) {
    const randomMove = available[Math.floor(Math.random() * available.length)];
    placeMove(randomMove, 1, data);
  }
}
