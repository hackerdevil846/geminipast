const axios = require("axios");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "dicegame",
        aliases: ["multidice", "taixiu"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "Multiplayer dice game with betting"
        },
        longDescription: {
            en: "Tai Xiu (Sic Bo) multiplayer dice game with various betting options"
        },
        guide: {
            en: "{p}dicegame [create/leave/roll/info/end]\n{p}dicegame [big/small] [amount]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "moment-timezone": ""
        }
    },

    onStart: async function({ message, event, args, usersData, threadsData }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("moment-timezone");
            } catch (e) {
                return message.reply("❌ Missing dependencies: axios, fs-extra, and moment-timezone");
            }

            // Initialize game data if not exists
            if (!global.client.taixiu_ca) global.client.taixiu_ca = {};

            const { senderID, threadID } = event;
            const moneyUser = (await usersData.get(senderID)).money;
            
            // Helper functions
            const formatNumber = (number) => number.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            // Dice images
            const dice_images = [
                "https://i.imgur.com/ruaSs1C.png",
                "https://i.imgur.com/AIhuSxL.png",
                "https://i.imgur.com/JB4vTVj.png",
                "https://i.imgur.com/PGgsDAO.png",
                "https://i.imgur.com/RiaMAHX.png",
                "https://i.imgur.com/ys9PwAV.png"
            ];

            // Show help if no arguments
            if (args.length === 0) {
                const helpMessage = `🎲 MULTIPLAYER DICE GAME 🎲
────────────────
${global.config.PREFIX}${this.config.name} create → Create a game room
${global.config.PREFIX}${this.config.name} leave → Leave the game
${global.config.PREFIX}${this.config.name} roll → Roll the dice (host only)
${global.config.PREFIX}${this.config.name} info → Show game info
${global.config.PREFIX}${this.config.name} end → End the game (host only)
${global.config.PREFIX}${this.config.name} [big/small] [amount] → Place a bet`;
                
                return message.reply({
                    body: helpMessage,
                    attachment: await global.utils.getStreamFromURL("https://i.imgur.com/i2woeoT.jpeg")
                });
            }

            // Handle different commands
            switch (args[0].toLowerCase()) {
                case "create": {
                    if (threadID in global.client.taixiu_ca && global.client.taixiu_ca[threadID].play) {
                        return message.reply("❌ A game is already in progress in this group!");
                    }
                    
                    global.client.taixiu_ca[threadID] = {
                        players: 0,
                        data: {},
                        play: true,
                        status: "pending",
                        author: senderID,
                    };
                    
                    message.reply("✅ Game room created successfully! Players can now place bets using: big/small [amount]");
                    startGameTimer(threadID, usersData, message);
                    break;
                }

                case "leave": {
                    if (!global.client.taixiu_ca[threadID]) {
                        return message.reply("❌ No game is currently running in this group!");
                    }
                    
                    if (!global.client.taixiu_ca[threadID].data[senderID]) {
                        return message.reply("❌ You haven't joined this game!");
                    }
                    
                    // Return bet money to player
                    global.client.taixiu_ca[threadID].data[senderID].forEach(async (bet) => {
                        await usersData.set(senderID, {
                            money: (await usersData.get(senderID)).money + bet.amount
                        });
                    });
                    
                    global.client.taixiu_ca[threadID].players--;
                    delete global.client.taixiu_ca[threadID].data[senderID];
                    
                    message.reply("✅ You have left the game and received your bet back!");
                    break;
                }

                case "roll": {
                    if (!global.client.taixiu_ca[threadID]) {
                        return message.reply("❌ No game is currently running in this group!");
                    }
                    
                    if (global.client.taixiu_ca[threadID].author !== senderID) {
                        return message.reply("❌ Only the game host can roll the dice!");
                    }
                    
                    if (global.client.taixiu_ca[threadID].players === 0) {
                        return message.reply("❌ No players have placed bets yet!");
                    }

                    // Roll the dice
                    await message.reply("🎲 Rolling dice...");
                    
                    setTimeout(async () => {
                        const dice1 = Math.ceil(Math.random() * 6);
                        const dice2 = Math.ceil(Math.random() * 6);
                        const dice3 = Math.ceil(Math.random() * 6);
                        const total = dice1 + dice2 + dice3;
                        
                        // Calculate results
                        const isTriple = dice1 === dice2 && dice2 === dice3;
                        const isBig = total >= 11 && total <= 18;
                        
                        let resultsMessage = `====== DICE GAME RESULTS ======
🎲 Dice: ${dice1}, ${dice2}, ${dice3}
🧮 Total: ${total}
📊 Result: ${isTriple ? "TRIPLE" : (isBig ? "BIG" : "SMALL")}

`;
                        
                        const bigWinners = [];
                        const smallWinners = [];
                        const bigLosers = [];
                        const smallLosers = [];
                        
                        // Process each player's bets
                        for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
                            const userData = await usersData.get(playerId);
                            const playerName = userData.name || "Player";
                            
                            for (const bet of bets) {
                                let result, amount;
                                
                                if (isTriple) {
                                    // Everyone loses on triple
                                    result = "LOSE";
                                    amount = -bet.amount;
                                    if (bet.type === "big") bigLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                                    else smallLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                                } else {
                                    const won = (bet.type === "big" && isBig) || (bet.type === "small" && !isBig);
                                    
                                    if (won) {
                                        result = "WIN";
                                        amount = bet.amount * 1.95; // 1.95x payout
                                        await usersData.set(playerId, {
                                            money: userData.money + amount
                                        });
                                        
                                        if (bet.type === "big") bigWinners.push(`${playerName}: +${formatNumber(amount)}$`);
                                        else smallWinners.push(`${playerName}: +${formatNumber(amount)}$`);
                                    } else {
                                        result = "LOSE";
                                        amount = -bet.amount;
                                        
                                        if (bet.type === "big") bigLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                                        else smallLosers.push(`${playerName}: -${formatNumber(bet.amount)}$`);
                                    }
                                }
                            }
                        }
                        
                        // Build results message
                        if (bigWinners.length > 0) {
                            resultsMessage += `🎉 BIG BET WINNERS:\n${bigWinners.join("\n")}\n\n`;
                        }
                        
                        if (smallWinners.length > 0) {
                            resultsMessage += `🎉 SMALL BET WINNERS:\n${smallWinners.join("\n")}\n\n`;
                        }
                        
                        if (bigLosers.length > 0) {
                            resultsMessage += `💔 BIG BET LOSERS:\n${bigLosers.join("\n")}\n\n`;
                        }
                        
                        if (smallLosers.length > 0) {
                            resultsMessage += `💔 SMALL BET LOSERS:\n${smallLosers.join("\n")}\n\n`;
                        }
                        
                        resultsMessage += `====== GAME ENDED ======`;
                        
                        // Send results with dice images
                        const diceStreams = await Promise.all([
                            global.utils.getStreamFromURL(dice_images[dice1 - 1]),
                            global.utils.getStreamFromURL(dice_images[dice2 - 1]),
                            global.utils.getStreamFromURL(dice_images[dice3 - 1])
                        ]);
                        
                        message.reply({
                            body: resultsMessage,
                            attachment: diceStreams
                        }).then(() => {
                            // Clean up game data
                            delete global.client.taixiu_ca[threadID];
                        });
                        
                    }, 2000);
                    break;
                }

                case "info": {
                    if (!global.client.taixiu_ca[threadID]) {
                        return message.reply("❌ No game is currently running in this group!");
                    }
                    
                    const hostData = await usersData.get(global.client.taixiu_ca[threadID].author);
                    const hostName = hostData.name || "Host";
                    
                    let infoMessage = `🎲 GAME INFORMATION 🎲

👑 Host: ${hostName}
👥 Players: ${global.client.taixiu_ca[threadID].players}

`;
                    
                    if (global.client.taixiu_ca[threadID].players > 0) {
                        infoMessage += `🎯 Current Bets:\n`;
                        
                        for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
                            const playerData = await usersData.get(playerId);
                            const playerName = playerData.name || "Player";
                            const betSummary = bets.map(bet => `${bet.type} (${formatNumber(bet.amount)}$)`).join(", ");
                            infoMessage += `👤 ${playerName}: ${betSummary}\n`;
                        }
                    } else {
                        infoMessage += `No players have placed bets yet.\nUse "${global.config.PREFIX}dicegame [big/small] [amount]" to place a bet!`;
                    }
                    
                    message.reply(infoMessage);
                    break;
                }

                case "end": {
                    if (!global.client.taixiu_ca[threadID]) {
                        return message.reply("❌ No game is currently running in this group!");
                    }
                    
                    if (global.client.taixiu_ca[threadID].author !== senderID) {
                        return message.reply("❌ Only the game host can end the game!");
                    }
                    
                    // Return all bets
                    for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
                        const userData = await usersData.get(playerId);
                        let totalReturn = 0;
                        
                        for (const bet of bets) {
                            totalReturn += bet.amount;
                        }
                        
                        await usersData.set(playerId, {
                            money: userData.money + totalReturn
                        });
                    }
                    
                    delete global.client.taixiu_ca[threadID];
                    message.reply("✅ Game ended successfully. All bets have been returned!");
                    break;
                }

                default: {
                    // Handle bet placement (big/small)
                    if (["big", "small"].includes(args[0].toLowerCase())) {
                        if (!global.client.taixiu_ca[threadID]) {
                            return message.reply("❌ No game is currently running in this group! Use 'create' to start one.");
                        }
                        
                        const betType = args[0].toLowerCase();
                        const betAmount = args[1] === "all" ? moneyUser : parseInt(args[1]);
                        
                        if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
                            return message.reply("❌ Please enter a valid bet amount!");
                        }
                        
                        if (betAmount > moneyUser) {
                            return message.reply("❌ You don't have enough money to place this bet!");
                        }
                        
                        if (betAmount < 50) {
                            return message.reply("❌ Minimum bet is 50$!");
                        }
                        
                        // Place the bet
                        await usersData.set(senderID, {
                            money: moneyUser - betAmount
                        });
                        
                        if (!global.client.taixiu_ca[threadID].data[senderID]) {
                            global.client.taixiu_ca[threadID].data[senderID] = [];
                            global.client.taixiu_ca[threadID].players++;
                        }
                        
                        global.client.taixiu_ca[threadID].data[senderID].push({
                            type: betType,
                            amount: betAmount
                        });
                        
                        message.reply(`✅ Bet placed successfully! ${formatNumber(betAmount)}$ on ${betType.toUpperCase()}`);
                    } else {
                        message.reply(`❌ Invalid command. Use "${global.config.PREFIX}dicegame create" to start a game or "${global.config.PREFIX}dicegame [big/small] [amount]" to place a bet.`);
                    }
                }
            }
        } catch (error) {
            console.error("Dice game error:", error);
            message.reply("❌ An error occurred while processing the game");
        }
    }
};

// Helper function to start game timer
function startGameTimer(threadID, usersData, message) {
    setTimeout(async () => {
        if (global.client.taixiu_ca[threadID] && global.client.taixiu_ca[threadID].play) {
            let messageText = "⏰ Game timeout! Returning all bets...\n\n";
            
            if (global.client.taixiu_ca[threadID].players > 0) {
                for (const [playerId, bets] of Object.entries(global.client.taixiu_ca[threadID].data)) {
                    const userData = await usersData.get(playerId);
                    const playerName = userData.name || "Player";
                    let totalReturned = 0;
                    
                    for (const bet of bets) {
                        await usersData.set(playerId, {
                            money: userData.money + bet.amount
                        });
                        totalReturned += bet.amount;
                    }
                    
                    messageText += `👤 ${playerName}: ${totalReturned.toLocaleString()}$ returned\n`;
                }
            } else {
                messageText += "No players placed bets.\n";
            }
            
            messageText += "\nGame has been cancelled.";
            message.reply(messageText);
            delete global.client.taixiu_ca[threadID];
        }
    }, 120000); // 2 minute timeout
}
