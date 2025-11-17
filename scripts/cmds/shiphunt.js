const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
 fs.mkdirSync(cacheDir);
}

const shipImageUrl = 'https://i.ibb.co/pX8rTWZ/download-27-removebg-preview.png'; 

function formatText(text) {
 // Mathematical italic font mapping
 const fontMap = {
 a: "𝑎", b: "𝑏", c: "𝑐", d: "𝑑", e: "𝑒", f: "𝑓", g: "𝑔", h: "ℎ",
 i: "𝑖", j: "𝑗", k: "𝑘", l: "𝑙", m: "𝑚", n: "𝑛", o: "𝑜", p: "𝑝",
 q: "𝑞", r: "𝑟", s: "𝑠", t: "𝑡", u: "𝑢", v: "𝑣", w: "𝑤", x: "𝑥",
 y: "𝑦", z: "𝑧",
 A: "𝐴", B: "𝐵", C: "𝐶", D: "𝐷", E: "𝐸", F: "𝐹", G: "𝐺", H: "𝐻",
 I: "𝐼", J: "𝐽", K: "𝐾", L: "𝐿", M: "𝑀", N: "𝑁", O: "𝑂", P: "𝑃",
 Q: "𝑄", R: "𝑅", S: "𝑆", T: "𝑇", U: "𝑈", V: "𝑉", W: "𝑊", X: "𝑋",
 Y: "𝑌", Z: "𝑍",
 };
 return text.split('').map(c => fontMap[c] || c).join('');
}

module.exports = {
 config: {
 name: "shiphunt",
 aliases: ["sh"],
 version: "1.0",
 author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
 role: 0,
 shortDescription: formatText("Play the classic ship hunting game!"),
 longDescription: formatText("Try to find all three ships hidden in the 9-grid board with 6 guesses!"),
 category: "game",
 guide: {
 en: "{𝑝}𝑠ℎ - 𝑆𝑡𝑎𝑟𝑡 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒 𝑎𝑛𝑑 𝑓𝑖𝑛𝑑 𝑎𝑙𝑙 𝑡ℎ𝑒 𝑠ℎ𝑖𝑝𝑠!"
 }
 },

 onStart: async function ({ api, message, event, usersData, args }) {
 try {
 const senderID = event.senderID;
 const userData = await usersData.get(senderID);

 const betAmount = 500;
 if (userData.money < betAmount) {
 return message.reply(formatText("❌ 𝑌𝑜𝑢 𝑛𝑒𝑒𝑑 500 𝑐𝑜𝑖𝑛𝑠 𝑡𝑜 𝑝𝑙𝑎𝑦! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑜𝑝 𝑢𝑝~"));
 }

 const board = Array(9).fill(false);
 const shipPositions = generateShipPositions(3);
 shipPositions.forEach(pos => board[pos] = true);

 const initialImage = await createBoardImage(board, []);
 const imagePath = await saveImageToCache(initialImage);
 const sentMessage = await message.reply({ 
 body: formatText("🎉 𝐿𝑒𝑡'𝑠 𝑠𝑡𝑎𝑟𝑡! 𝐹𝑖𝑛𝑑 𝑎𝑙𝑙 3 𝑠ℎ𝑖𝑝𝑠 𝑖𝑛 9 𝑏𝑜𝑥𝑒𝑠! 𝑌𝑜𝑢'𝑣𝑒 6 𝑔𝑢𝑒𝑠𝑠𝑒𝑠!"),
 attachment: fs.createReadStream(imagePath)
 });

 global.GoatBot.onReply.set(sentMessage.messageID, {
 commandName: "shiphunt",
 uid: senderID,
 board,
 guesses: [],
 remainingGuesses: 6,
 shipCount: 3,
 imagePath,
 betAmount
 });

 } catch (error) {
 console.error("Error in command:", error);
 message.reply(formatText("💔 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛~ ❌"));
 }
 },

 onReply: async function ({ api, message, event, usersData, args }) {
 const replyData = global.GoatBot.onReply.get(event.messageReply.messageID);
 if (!replyData || replyData.uid !== event.senderID) return;

 const { commandName, uid, board, guesses, remainingGuesses, shipCount, imagePath, betAmount } = replyData;
 if (commandName !== "shiphunt") return;

 const userData = await usersData.get(uid);

 const guess = parseInt(args[0]);
 if (isNaN(guess) || guess < 1 || guess > 9 || guesses.includes(guess)) {
 return message.reply(formatText("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑎𝑛𝑑 𝑢𝑛𝑢𝑠𝑒𝑑 𝑔𝑢𝑒𝑠𝑠 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 9~"));
 }

 const newGuesses = [...guesses, guess];
 const newRemainingGuesses = remainingGuesses - 1;
 const hit = board[guess - 1];
 const newShipCount = hit ? shipCount - 1 : shipCount;

 if (hit) {
 await message.reply(formatText("💥 𝑌𝑜𝑢'𝑣𝑒 ℎ𝑖𝑡 𝑎 𝑠ℎ𝑖𝑝!"));
 } else {
 await message.reply(formatText("🌊 𝑀𝑖𝑠𝑠𝑒𝑑!"));
 }

 if (newShipCount === 0) {
 await usersData.set(uid, { money: userData.money + 10000 });
 global.GoatBot.onReply.delete(event.messageReply.messageID);
 return message.reply(formatText("🎊 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠! 𝑌𝑜𝑢 𝑓𝑜𝑢𝑛𝑑 𝑎𝑙𝑙 𝑠ℎ𝑖𝑝𝑠 𝑎𝑛𝑑 𝑤𝑜𝑛 10,000 𝑐𝑜𝑖𝑛𝑠!"));
 }

 if (newRemainingGuesses === 0 && newShipCount > 0) {
 await usersData.set(uid, { money: userData.money - betAmount });
 global.GoatBot.onReply.delete(event.messageReply.messageID);
 return message.reply(formatText("💔 𝐺𝑎𝑚𝑒 𝑜𝑣𝑒𝑟! 𝑌𝑜𝑢 𝑟𝑢𝑛 𝑜𝑢𝑡 𝑜𝑓 𝑔𝑢𝑒𝑠𝑠𝑒𝑠. 𝑃𝑎𝑦 𝑢𝑝 𝑡𝑜 500 𝑐𝑜𝑖𝑛𝑠... 𝐵𝑒𝑡𝑡𝑒𝑟 𝑙𝑢𝑐𝑘 𝑛𝑒𝑥𝑡 𝑡𝑖𝑚𝑒! ❌"));
 }

 const updatedImage = await createBoardImage(board, newGuesses);
 const updatedImagePath = await saveImageToCache(updatedImage);
 const sentMessage = await message.reply({ attachment: fs.createReadStream(updatedImagePath) });

 global.GoatBot.onReply.set(sentMessage.messageID, {
 commandName: "shiphunt",
 uid,
 board,
 guesses: newGuesses,
 remainingGuesses: newRemainingGuesses,
 shipCount: newShipCount,
 imagePath: updatedImagePath,
 betAmount
 });
 }
};

function generateShipPositions(shipCount) {
 const positions = [];
 while (positions.length < shipCount) {
 const randomPos = Math.floor(Math.random() * 9);
 if (!positions.includes(randomPos)) positions.push(randomPos);
 }
 return positions;
}

async function createBoardImage(board, guesses) {
 const canvas = createCanvas(300, 300);
 const ctx = canvas.getContext('2d');

 ctx.fillStyle = '#87CEEB';
 ctx.fillRect(0, 0, canvas.width, canvas.height);

 const gridSize = 100;
 const shipImage = await loadImage(shipImageUrl);

 board.forEach((isShip, index) => {
 const x = (index % 3) * gridSize;
 const y = Math.floor(index / 3) * gridSize;
 ctx.strokeStyle = '#fff0f5';
 ctx.lineWidth = 3;
 ctx.strokeRect(x, y, gridSize, gridSize);

 if (guesses.includes(index + 1)) {
 ctx.fillStyle = isShip ? '#ff6961' : '#c0c0c0';
 ctx.fillRect(x, y, gridSize, gridSize);
 if (isShip) ctx.drawImage(shipImage, x + 10, y + 10, gridSize - 20, gridSize - 20);
 }
 });

 return canvas.toBuffer();
}

async function saveImageToCache(imageBuffer) {
 const imagePath = path.join(cacheDir, `shiphunt_${Date.now()}.png`);
 await fs.promises.writeFile(imagePath, imageBuffer);
 return imagePath;
}
