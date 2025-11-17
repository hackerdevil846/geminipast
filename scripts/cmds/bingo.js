const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
    config: {
        name: "bingo",
        aliases: [],
        version: "1.0.4",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "🎯 𝖯𝗅𝖺𝗒 𝖻𝗂𝗇𝗀𝗈 𝗀𝖺𝗆𝖾"
        },
        longDescription: {
            en: "𝖬𝗎𝗅𝗍𝗂𝗉𝗅𝖺𝗒𝖾𝗋 𝖻𝗂𝗇𝗀𝗈 𝗀𝖺𝗆𝖾 𝗐𝗂𝗍𝗁 𝖻𝖾𝗍𝗍𝗂𝗇𝗀 𝖺𝗇𝖽 𝗋𝖾𝗐𝖺𝗋𝖽𝗌"
        },
        guide: {
            en: "{p}𝖻𝗂𝗇𝗀𝗈 𝖼𝗋𝖾𝖺𝗍𝖾/𝗃𝗈𝗂𝗇/𝗌𝗍𝖺𝗋𝗍"
        },
        dependencies: {
            "fs-extra": "",
            "axios": ""
        },
        envConfig: {
            maxPlayers: 10,
            getDelay: 8
        }
    },

    onLoad: async function () {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌 𝖿𝗈𝗋 𝖻𝗂𝗇𝗀𝗈 𝗀𝖺𝗆𝖾");
                return;
            }

            const path = __dirname + '/bingo/';
            try {
                if (!fs.existsSync(path)) {
                    await fs.mkdirSync(path, { recursive: true });
                    console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗂𝗇𝗀𝗈 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖻𝗂𝗇𝗀𝗈 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
            }
            
            if (!global.client.bingo) {
                global.client.bingo = {};
                console.log("✅ 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝖻𝗂𝗇𝗀𝗈 𝗀𝖺𝗆𝖾 𝗌𝗍𝗈𝗋𝖺𝗀𝖾");
            }
        } catch (error) {
            console.error("💥 𝖡𝗂𝗇𝗀𝗈 𝗈𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function ({ message, event, args, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝖺𝗑𝗂𝗈𝗌.");
            }

            const { threadID, senderID } = event;
            const { getDelay, maxPlayers } = this.config.envConfig;
            
            if (!global.client.bingo) {
                global.client.bingo = {};
            }
            
            const userData = await usersData.get(senderID);
            const userMoney = userData.money || 0;
            
            if (!args[0]) {
                return message.reply(
                    `🎯 𝖡𝖨𝖭𝖦𝖮 𝖦𝖠𝖬𝖤\n\n𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌:\n• 𝖻𝗂𝗇𝗀𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 [𝖺𝗆𝗈𝗎𝗇𝗍] - 𝖢𝗋𝖾𝖺𝗍𝖾 𝗀𝖺𝗆𝖾 (𝗆𝗂𝗇 50$)\n• 𝖻𝗂𝗇𝗀𝗈 𝗃𝗈𝗂𝗇 - 𝖩𝗈𝗂𝗇 𝗀𝖺𝗆𝖾\n• 𝖻𝗂𝗇𝗀𝗈 𝗌𝗍𝖺𝗋𝗍 - 𝖲𝗍𝖺𝗋𝗍 𝗀𝖺𝗆𝖾\n\n𝖬𝖺𝗑 𝗉𝗅𝖺𝗒𝖾𝗋𝗌: ${maxPlayers}`
                );
            }

            const action = args[0].toLowerCase();
            
            switch (action) {
                case 'create': {
                    const moneyBet = parseInt(args[1]);
                    if (isNaN(moneyBet) || moneyBet <= 0) {
                        return message.reply("❌ 𝖡𝖾𝗍 𝖺𝗆𝗈𝗎𝗇𝗍 𝖼𝖺𝗇𝗇𝗈𝗍 𝖻𝖾 𝖾𝗆𝗉𝗍𝗒 𝗈𝗋 𝗇𝖾𝗀𝖺𝗍𝗂𝗏𝖾");
                    }
                    if (moneyBet < 50) {
                        return message.reply("❌ 𝖬𝗂𝗇𝗂𝗆𝗎𝗆 𝖻𝖾𝗍 𝗂𝗌 50$!");
                    }
                    if (moneyBet > userMoney) {
                        return message.reply(`❌ 𝖸𝗈𝗎 𝗇𝖾𝖾𝖽 ${moneyBet}$ 𝗍𝗈 𝗉𝗅𝖺𝗒!`);
                    }
                    if (global.client.bingo[threadID]) {
                        return message.reply("❌ 𝖦𝖺𝗆𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗂𝗇 𝗉𝗋𝗈𝗀𝗋𝖾𝗌𝗌!");
                    }
                    
                    global.client.bingo[threadID] = {
                        author: senderID,
                        players: { [senderID]: [] },
                        status: "pending",
                        betAmount: moneyBet,
                        createdAt: Date.now()
                    };
                    
                    try {
                        await usersData.set(senderID, {
                            money: userMoney - moneyBet
                        });
                    } catch (moneyError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝖽𝗎𝖼𝗍 𝗆𝗈𝗇𝖾𝗒:", moneyError);
                        delete global.client.bingo[threadID];
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗀𝖺𝗆𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                    }
                    
                    return message.reply(`✅ 𝖦𝖺𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽! (1/${maxPlayers})\n𝖩𝗈𝗂𝗇 𝗐𝗂𝗍𝗁: 𝖻𝗂𝗇𝗀𝗈 𝗃𝗈𝗂𝗇`);
                }

                case 'join': {
                    if (!global.client.bingo[threadID]) {
                        return message.reply("❌ 𝖭𝗈 𝗀𝖺𝗆𝖾 𝗂𝗇 𝗉𝗋𝗈𝗀𝗋𝖾𝗌𝗌!");
                    }
                    
                    // Clean up old games (older than 1 hour)
                    if (Date.now() - global.client.bingo[threadID].createdAt > 3600000) {
                        delete global.client.bingo[threadID];
                        return message.reply("❌ 𝖦𝖺𝗆𝖾 𝗌𝖾𝗌𝗌𝗂𝗈𝗇 𝖾𝗑𝗉𝗂𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗇𝖾𝗐 𝗈𝗇𝖾.");
                    }
                    
                    if (global.client.bingo[threadID].players[senderID]) {
                        return message.reply("❌ 𝖸𝗈𝗎'𝗋𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗂𝗇 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾!");
                    }
                    if (Object.keys(global.client.bingo[threadID].players).length >= maxPlayers) {
                        return message.reply("❌ 𝖱𝗈𝗈𝗆 𝗂𝗌 𝖿𝗎𝗅𝗅!");
                    }
                    if (global.client.bingo[threadID].status === "started") {
                        return message.reply("❌ 𝖦𝖺𝗆𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗌𝗍𝖺𝗋𝗍𝖾𝖽!");
                    }
                    if (global.client.bingo[threadID].betAmount > userMoney) {
                        return message.reply(`❌ 𝖸𝗈𝗎 𝗇𝖾𝖾𝖽 ${global.client.bingo[threadID].betAmount}$ 𝗍𝗈 𝗃𝗈𝗂𝗇!`);
                    }
                    
                    global.client.bingo[threadID].players[senderID] = [];
                    
                    try {
                        await usersData.set(senderID, {
                            money: userMoney - global.client.bingo[threadID].betAmount
                        });
                    } catch (moneyError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝖽𝗎𝖼𝗍 𝗆𝗈𝗇𝖾𝗒:", moneyError);
                        delete global.client.bingo[threadID].players[senderID];
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗃𝗈𝗂𝗇 𝗀𝖺𝗆𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                    }
                    
                    const playerCount = Object.keys(global.client.bingo[threadID].players).length;
                    return message.reply(`✅ 𝖩𝗈𝗂𝗇𝖾𝖽! (${playerCount}/${maxPlayers})`);
                }

                case 'start': {
                    if (!global.client.bingo[threadID]) {
                        return message.reply("❌ 𝖭𝗈 𝗀𝖺𝗆𝖾 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍!");
                    }
                    if (!global.client.bingo[threadID].players[senderID]) {
                        return message.reply("❌ 𝖸𝗈𝗎 𝖺𝗋𝖾𝗇'𝗍 𝗂𝗇 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾!");
                    }
                    if (global.client.bingo[threadID].author !== senderID) {
                        return message.reply("❌ 𝖮𝗇𝗅𝗒 𝗀𝖺𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝗈𝗋 𝖼𝖺𝗇 𝗌𝗍𝖺𝗋𝗍!");
                    }
                    if (global.client.bingo[threadID].status === "started") {
                        return message.reply("❌ 𝖦𝖺𝗆𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗌𝗍𝖺𝗋𝗍𝖾𝖽!");
                    }
                    if (Object.keys(global.client.bingo[threadID].players).length < 2) {
                        return message.reply("❌ 𝖭𝖾𝖾𝖽 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 2 𝗉𝗅𝖺𝗒𝖾𝗋𝗌!");
                    }
                    
                    global.client.bingo[threadID].status = "started";
                    global.client.bingo[threadID].startedAt = Date.now();
                    
                    const calledNumbers = [];
                    const allNumbers = Array.from({length: 90}, (_, i) => i + 1);
                    
                    await message.reply(`✅ 𝖦𝖺𝗆𝖾 𝗌𝗍𝖺𝗋𝗍𝖾𝖽! 𝖭𝗎𝗆𝖻𝖾𝗋𝗌 𝖼𝖺𝗅𝗅𝖾𝖽 𝖾𝗏𝖾𝗋𝗒 ${getDelay}𝗌`);
                    
                    let gameInterval;
                    try {
                        gameInterval = setInterval(async () => {
                            try {
                                if (calledNumbers.length >= 90 || !global.client.bingo[threadID]) {
                                    clearInterval(gameInterval);
                                    if (global.client.bingo[threadID]) {
                                        delete global.client.bingo[threadID];
                                    }
                                    return;
                                }
                                
                                const randomNum = allNumbers.splice(Math.floor(Math.random() * allNumbers.length), 1)[0];
                                calledNumbers.push(randomNum);
                                
                                await message.reply(`🔢 𝖭𝗎𝗆𝖻𝖾𝗋: ${randomNum}`);
                                
                                if (calledNumbers.length >= 5) {
                                    const playerIds = Object.keys(global.client.bingo[threadID].players);
                                    const winnerId = playerIds[Math.floor(Math.random() * playerIds.length)];
                                    const reward = global.client.bingo[threadID].betAmount * (playerIds.length - 1);
                                    
                                    try {
                                        const winnerMoney = (await usersData.get(winnerId)).money || 0;
                                        await usersData.set(winnerId, {
                                            money: winnerMoney + reward + global.client.bingo[threadID].betAmount
                                        });
                                        
                                        await message.reply(`🎉 𝖡𝖨𝖭𝖦𝖮! 𝖯𝗅𝖺𝗒𝖾𝗋 𝗐𝗈𝗇 ${reward}$!`);
                                    } catch (rewardError) {
                                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝗂𝗏𝖾 𝗋𝖾𝗐𝖺𝗋𝖽:", rewardError);
                                        await message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝗂𝗏𝗂𝗇𝗀 𝗋𝖾𝗐𝖺𝗋𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝖺𝖽𝗆𝗂𝗇.");
                                    }
                                    
                                    delete global.client.bingo[threadID];
                                    clearInterval(gameInterval);
                                }
                            } catch (intervalError) {
                                console.error("💥 𝖦𝖺𝗆𝖾 𝗂𝗇𝗍𝖾𝗋𝗏𝖺𝗅 𝖾𝗋𝗋𝗈𝗋:", intervalError);
                                clearInterval(gameInterval);
                                if (global.client.bingo[threadID]) {
                                    delete global.client.bingo[threadID];
                                }
                            }
                        }, getDelay * 1000);
                    } catch (intervalError) {
                        console.error("💥 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍 𝗀𝖺𝗆𝖾 𝗂𝗇𝗍𝖾𝗋𝗏𝖺𝗅:", intervalError);
                        delete global.client.bingo[threadID];
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍 𝗀𝖺𝗆𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                    }
                    
                    break;
                }

                default: {
                    return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽. 𝖴𝗌𝖾: 𝖻𝗂𝗇𝗀𝗈 𝖼𝗋𝖾𝖺𝗍𝖾/𝗃𝗈𝗂𝗇/𝗌𝗍𝖺𝗋𝗍");
                }
            }
            
        } catch (error) {
            console.error("💥 𝖡𝗂𝗇𝗀𝗈 𝗀𝖺𝗆𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
