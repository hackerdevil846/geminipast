const { createCanvas } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "rdi",
        aliases: [],
        version: "0.0.2",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "𝖲𝗅𝗈𝗍 𝖬𝖺𝖼𝗁𝗂𝗇𝖾 𝖦𝖺𝗆𝖾"
        },
        longDescription: {
            en: "𝖯𝗅𝖺𝗒 𝗌𝗅𝗈𝗍 𝗆𝖺𝖼𝗁𝗂𝗇𝖾 𝗀𝖺𝗆𝖾 𝗐𝗂𝗍𝗁 𝖻𝖾𝗍𝗍𝗂𝗇𝗀"
        },
        guide: {
            en: "{p}rdi [𝖻𝖾𝗍 𝖺𝗆𝗈𝗎𝗇𝗍]"
        },
        dependencies: {
            "canvas": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ event, args, message, usersData }) {
        try {
            // Dependency check
            let canvasAvailable = true;
            let fsAvailable = true;
            try {
                require("canvas");
                require("fs-extra");
            } catch (e) {
                canvasAvailable = false;
                fsAvailable = false;
            }

            if (!canvasAvailable || !fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const { senderID } = event;
            const minBet = 100;
            const slotItems = ["🚀","⏳","👓","🔦","💡","🕯️","🥽","🎲","🔥","🔔","🏺","🍆","🐣"];
            
            // Get user money
            let userData;
            try {
                userData = await usersData.get(senderID);
            } catch (dataError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", dataError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            let money = userData.money || 0;
            let coin = args[0];

            // Input validations
            if (!coin) return message.reply("❌ 𝖸𝗈𝗎 𝖽𝗂𝖽𝗇'𝗍 𝖾𝗇𝗍𝖾𝗋 𝖺 𝖻𝖾𝗍 𝖺𝗆𝗈𝗎𝗇𝗍!");
            if (isNaN(coin) || coin < 0) return message.reply("❌ 𝖸𝗈𝗎𝗋 𝖻𝖾𝗍 𝖺𝗆𝗈𝗎𝗇𝗍 𝗂𝗌 𝗇𝗈𝗍 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋!");
            
            coin = parseInt(coin);
            if (coin < minBet) return message.reply(`❌ 𝖸𝗈𝗎𝗋 𝖻𝖾𝗍 𝖺𝗆𝗈𝗎𝗇𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗐. 𝖬𝗂𝗇𝗂𝗆𝗎𝗆 𝖻𝖾𝗍 𝗂𝗌 ${minBet} 𝗍𝖺𝗄𝖺!`);
            if (coin > money) return message.reply("❌ 𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝖾𝗇𝗈𝗎𝗀𝗁 𝗆𝗈𝗇𝖾𝗒!");

            // Roll slot numbers
            let number = [];
            for (let i = 0; i < 3; i++) {
                number[i] = Math.floor(Math.random() * slotItems.length);
            }

            let winType = 0; // 0=lose, 1=small win, 2=jackpot
            let winnings = 0;
            
            if (number[0] === number[1] && number[1] === number[2]) {
                winType = 2;
                winnings = coin * 9;
                try {
                    await usersData.increaseMoney(senderID, winnings);
                } catch (winError) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝗂𝗇𝖼𝗋𝖾𝖺𝗌𝗂𝗇𝗀 𝗆𝗈𝗇𝖾𝗒:", winError);
                    return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖻𝖺𝗅𝖺𝗇𝖼𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }
            } else if (number[0] === number[1] || number[1] === number[2] || number[0] === number[2]) {
                winType = 1;
                winnings = coin * 2;
                try {
                    await usersData.increaseMoney(senderID, winnings);
                } catch (winError) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝗂𝗇𝖼𝗋𝖾𝖺𝗌𝗂𝗇𝗀 𝗆𝗈𝗇𝖾𝗒:", winError);
                    return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖻𝖺𝗅𝖺𝗇𝖼𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }
            } else {
                winType = 0;
                try {
                    await usersData.decreaseMoney(senderID, coin);
                } catch (loseError) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝖽𝖾𝖼𝗋𝖾𝖺𝗌𝗂𝗇𝗀 𝗆𝗈𝗇𝖾𝗒:", loseError);
                    return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖻𝖺𝗅𝖺𝗇𝖼𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }
                winnings = coin;
            }

            // Prepare slot display
            const slotResult = `${slotItems[number[0]]} │ ${slotItems[number[1]]} │ ${slotItems[number[2]]}`;
            let msg;
            if (winType === 2) {
                msg = `🎰 𝖲𝗅𝗈𝗍 𝖬𝖺𝖼𝗁𝗂𝗇𝖾\n${slotResult}\n\n🎉 𝖩𝖺𝖼𝗄𝗉𝗈𝗍! 💰 𝖸𝗈𝗎 𝗐𝗂𝗇 ${winnings} 𝗍𝖺𝗄𝖺!`;
            } else if (winType === 1) {
                msg = `🎰 𝖲𝗅𝗈𝗍 𝖬𝖺𝖼𝗁𝗂𝗇𝖾\n${slotResult}\n\n✨ 𝖸𝗈𝗎 𝗐𝗂𝗇! 💰 𝖸𝗈𝗎 𝗀𝖾𝗍 ${winnings} 𝗍𝖺𝗄𝖺!`;
            } else {
                msg = `🎰 𝖲𝗅𝗈𝗍 𝖬𝖺𝖼𝗁𝗂𝗇𝖾\n${slotResult}\n\n😢 𝖸𝗈𝗎 𝗅𝗈𝗌𝗍! 𝖸𝗈𝗎 𝗅𝗈𝗌𝗍 ${winnings} 𝗍𝖺𝗄𝖺!`;
            }

            // Canvas image generation
            try {
                const canvasWidth = 550, canvasHeight = 250;
                const canvas = createCanvas(canvasWidth, canvasHeight);
                const ctx = canvas.getContext('2d');
                
                // Background gradient
                const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
                gradient.addColorStop(0, "#1a1f25");
                gradient.addColorStop(1, "#2d3748");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                
                // Slot banner with border
                ctx.fillStyle = "#ffcb05";
                ctx.fillRect(50, 20, canvasWidth - 100, 50);
                ctx.fillStyle = "#1a1f25";
                ctx.font = "bold 32px Arial";
                ctx.textAlign = "center";
                ctx.fillText("🎰 𝖲𝗅𝗈𝗍 𝖬𝖺𝖼𝗁𝗂𝗇𝖾", canvasWidth/2, 55);
                
                // Slot machine frame
                ctx.fillStyle = "#4a5568";
                ctx.fillRect(30, 90, canvasWidth - 60, 100);
                ctx.fillStyle = "#2d3748";
                ctx.fillRect(40, 100, canvasWidth - 80, 80);
                
                // Slot symbols with glow effect
                ctx.font = "bold 60px Arial";
                ctx.shadowColor = winType ? "#55e460" : "#de2e2e";
                ctx.shadowBlur = 15;
                
                ctx.fillStyle = "#ffffff";
                ctx.fillText(slotItems[number[0]], 150, 155);
                ctx.fillText(slotItems[number[1]], 275, 155);
                ctx.fillText(slotItems[number[2]], 400, 155);
                
                ctx.shadowBlur = 0; // Reset shadow
                
                // Win/Lose message
                ctx.font = "bold 24px Arial";
                ctx.fillStyle = winType === 2 ? "#ffcb05" : (winType === 1 ? "#55e460" : "#de2e2e");
                
                let resultText;
                if (winType === 2) {
                    resultText = `🎉 𝖩𝖺𝖼𝗄𝗉𝗈𝗍! 💰 +${winnings} 𝗍𝖺𝗄𝖺!`;
                } else if (winType === 1) {
                    resultText = `✨ 𝖸𝗈𝗎 𝗐𝗂𝗇! 💰 +${winnings} 𝗍𝖺𝗄𝖺!`;
                } else {
                    resultText = `😢 𝖸𝗈𝗎 𝗅𝗈𝗌𝗍! -${winnings} 𝗍𝖺𝗄𝖺!`;
                }
                
                ctx.fillText(resultText, canvasWidth/2, 210);
                
                // Create cache directory if it doesn't exist
                const cacheDir = path.join(__dirname, "cache");
                try {
                    await fs.ensureDir(cacheDir);
                } catch (dirError) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋:", dirError);
                    return message.reply(msg);
                }
                
                const imagePath = path.join(cacheDir, `slot_${senderID}_${Date.now()}.png`);
                const buffer = canvas.toBuffer('image/png');
                await fs.writeFile(imagePath, buffer);
                
                await message.reply({ 
                    body: msg, 
                    attachment: fs.createReadStream(imagePath) 
                });
                
                // Cleanup file
                try {
                    await fs.unlink(imagePath);
                } catch (cleanupError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾:", cleanupError);
                }
                
            } catch (canvasError) {
                console.error("💥 𝖢𝖺𝗇𝗏𝖺𝗌 𝖾𝗋𝗋𝗈𝗋:", canvasError);
                // Fallback to text-only message
                await message.reply(msg);
            }
            
        } catch (error) {
            console.error("💥 𝖲𝗅𝗈𝗍 𝖬𝖺𝖼𝗁𝗂𝗇𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('usersData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('money')) {
                errorMessage = "❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝖻𝖺𝗅𝖺𝗇𝖼𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
