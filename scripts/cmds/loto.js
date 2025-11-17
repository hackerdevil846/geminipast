const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "loto",
        aliases: [],
        version: "1.0.4",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "𝖯𝗅𝖺𝗒 𝗅𝗈𝗍𝗍𝗈 𝗀𝖺𝗆𝖾"
        },
        longDescription: {
            en: "𝖠 𝖿𝗎𝗇 𝗅𝗈𝗍𝗍𝗈 𝗀𝖺𝗆𝖾 𝗐𝗂𝗍𝗁 𝖿𝗋𝗂𝖾𝗇𝖽𝗌"
        },
        guide: {
            en: "{p}loto [𝖼𝗋𝖾𝖺𝗍𝖾/𝗃𝗈𝗂𝗇/𝗌𝗍𝖺𝗋𝗍]"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "path": ""
        },
        envConfig: {
            maxPlayers: 10,
            getDelay: 8
        }
    },

    loto: {
        "loto_pink.jpg": [
            [15, 30, 49, 60, 74],
            [7, 26, 33, 52, 69],
            [22, 41, 55, 71, 88],
            [11, 37, 64, 76, 90],
            [18, 38, 50, 78, 84],
            [3, 29, 43, 59, 61],
            [10, 48, 63, 75, 81],
            [1, 21, 35, 62, 77],
            [9, 16, 40, 54, 70]
        ],
        "loto_blue.jpg": [
            [25, 52, 60, 77, 83],
            [1, 30, 44, 51, 70],
            [11, 21, 47, 56, 62],
            [2, 33, 59, 68, 73],
            [23, 39, 42, 75, 80],
            [14, 26, 66, 79, 88],
            [19, 20, 37, 55, 81],
            [8, 13, 57, 61, 87],
            [28, 34, 58, 76, 82]
        ],
        "loto_cyan.jpg": [
            [11, 33, 69, 78, 85],
            [2, 14, 21, 35, 76],
            [8, 19, 41, 50, 84],
            [9, 15, 37, 44, 87],
            [6, 26, 65, 77, 82],
            [1, 18, 30, 59, 66],
            [10, 38, 47, 51, 80],
            [5, 13, 29, 52, 79],
            [3, 20, 54, 70, 88]
        ],
        "loto_green.jpg": [
            [6, 19, 27, 56, 63],
            [7, 30, 45, 69, 77],
            [1, 17, 47, 58, 81],
            [20, 37, 49, 53, 78],
            [5, 12, 28, 65, 71],
            [15, 22, 31, 57, 90],
            [3, 25, 35, 50, 64],
            [9, 33, 51, 60, 76],
            [36, 41, 55, 62, 85]
        ],
        "loto_orange.jpg": [
            [3, 10, 22, 58, 75],
            [26, 33, 60, 78, 86],
            [17, 27, 62, 71, 80],
            [15, 32, 47, 50, 69],
            [2, 30, 42, 77, 83],
            [11, 34, 67, 73, 81],
            [6, 14, 49, 66, 70],
            [29, 37, 44, 51, 85],
            [16, 23, 39, 54, 90]
        ],
        "loto_red.jpg": [
            [12, 41, 56, 72, 83],
            [9, 33, 40, 60, 86],
            [7, 15, 45, 51, 78],
            [18, 44, 53, 65, 90],
            [1, 21, 48, 54, 77],
            [6, 30, 59, 71, 87],
            [14, 25, 32, 47, 66],
            [5, 27, 55, 69, 73],
            [2, 10, 39, 52, 63]
        ],
        "loto_lawn.jpg": [
            [2, 15, 39, 46, 66],
            [7, 12, 53, 76, 88],
            [8, 34, 41, 70, 83],
            [33, 47, 59, 64, 86],
            [22, 30, 51, 69, 87],
            [5, 21, 49, 75, 80],
            [17, 28, 40, 55, 67],
            [9, 16, 43, 79, 84],
            [10, 44, 56, 60, 71]
        ],
        "loto_yellow.jpg": [
            [8, 19, 26, 57, 60],
            [6, 10, 39, 44, 81],
            [1, 20, 37, 75, 83],
            [7, 13, 56, 65, 88],
            [4, 28, 49, 51, 66],
            [22, 30, 43, 79, 80],
            [2, 29, 34, 59, 63],
            [5, 17, 46, 73, 89],
            [3, 15, 32, 40, 54]
        ],
        "loto_purple.jpg": [
            [9, 14, 59, 60, 89],
            [6, 22, 36, 47, 79],
            [4, 27, 51, 66, 74],
            [7, 21, 42, 55, 81],
            [5, 11, 39, 52, 88],
            [1, 17, 44, 68, 75],
            [20, 56, 63, 73, 87],
            [3, 19, 26, 58, 76],
            [10, 24, 33, 67, 85]
        ],
        "loto_teal.jpg": [
            [4, 31, 46, 66, 75],
            [8, 12, 35, 53, 89],
            [1, 25, 40, 50, 65],
            [14, 47, 52, 61, 71],
            [9, 19, 34, 55, 81],
            [3, 22, 49, 72, 82],
            [11, 33, 57, 69, 87],
            [2, 24, 39, 44, 78],
            [5, 29, 51, 67, 80]
        ]
    },

    onLoad: async function() {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌");
                return;
            }

            const lotoPath = path.resolve(__dirname, './loto/');
            try {
                if (!fs.existsSync(lotoPath)) {
                    fs.mkdirSync(lotoPath, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗅𝗈𝗍𝗈 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return;
            }

            try {
                const response = await axios.get("https://raw.githubusercontent.com/RFS-ADRENO/lotoData/main/data.json", {
                    timeout: 30000
                });
                const imageData = response.data;

                for (const fileName in imageData) {
                    const filePath = path.resolve(lotoPath, fileName);
                    if (!fs.existsSync(filePath)) {
                        try {
                            const buffer = Buffer.from(imageData[fileName], 'base64');
                            fs.writeFileSync(filePath, buffer);
                            console.log(`✅ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 ${fileName}`);
                        } catch (fileError) {
                            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾 ${fileName}:`, fileError);
                        }
                    }
                }
            } catch (downloadError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗅𝗈𝗍𝗈 𝖽𝖺𝗍𝖺:", downloadError);
            }

            if (!global.client.loto) {
                global.client.loto = {};
            }
        } catch (error) {
            console.error("💥 𝖫𝗈𝗍𝗈 𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ message, event, usersData, args, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const { threadID, senderID } = event;
            
            // Get user money with error handling
            let userMoney = 0;
            try {
                const userData = await usersData.get(senderID);
                userMoney = userData.money || 0;
            } catch (moneyError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝗆𝗈𝗇𝖾𝗒:", moneyError);
                return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺.");
            }

            if (!global.client.loto) {
                global.client.loto = {};
            }

            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

            const messages = {
                missingInput: "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖻𝖾𝗍 𝖺𝗆𝗈𝗎𝗇𝗍!",
                moneyBetNotEnough: "❌ 𝖸𝗈𝗎 𝗇𝖾𝖾𝖽 $%1 𝗍𝗈 𝗉𝗅𝖺𝗒!",
                limitBet: "❌ 𝖬𝗂𝗇𝗂𝗆𝗎𝗆 𝖻𝖾𝗍 𝗂𝗌 $50!",
                noGame: "❌ 𝖭𝗈 𝖺𝖼𝗍𝗂𝗏𝖾 𝗀𝖺𝗆𝖾 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉!",
                alreadyHave: "❌ 𝖦𝖺𝗆𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖾𝗑𝗂𝗌𝗍𝗌!",
                openSuccess: "✅ 𝖦𝖺𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽! (%1/%2)\n\n𝖩𝗈𝗂𝗇 𝗐𝗂𝗍𝗁:\n{p}loto 𝗃𝗈𝗂𝗇",
                alreadyJoined: "❌ 𝖸𝗈𝗎'𝗋𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗂𝗇!",
                out_of_room: "❌ 𝖱𝗈𝗈𝗆 𝗂𝗌 𝖿𝗎𝗅𝗅!",
                alreadyStarted_1: "❌ 𝖦𝖺𝗆𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗌𝗍𝖺𝗋𝗍𝖾𝖽!",
                joinSuccess: "✅ 𝖩𝗈𝗂𝗇𝖾𝖽! (%1/%2)",
                playersNotEnough: "❌ 𝖭𝖾𝖾𝖽 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 2 𝗉𝗅𝖺𝗒𝖾𝗋𝗌!",
                not_author: "❌ 𝖸𝗈𝗎'𝗋𝖾 𝗇𝗈𝗍 𝗍𝗁𝖾 𝖼𝗋𝖾𝖺𝗍𝗈𝗋!",
                alreadyStarted_2: "❌ 𝖦𝖺𝗆𝖾 𝗂𝗌 𝗋𝗎𝗇𝗇𝗂𝗇𝗀!",
                checkInbox_noti: "📨 𝖢𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝖻𝗈𝗑 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝖼𝖺𝗋𝖽!",
                cannotInbox: "❌ 𝖢𝖺𝗇'𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 %1!",
                notJoined: "❌ 𝖸𝗈𝗎'𝗋𝖾 𝗇𝗈𝗍 𝗂𝗇 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾!",
                getReady: "🎮 𝖦𝖺𝗆𝖾 𝗌𝗍𝖺𝗋𝗍𝗌!\n𝖭𝗎𝗆𝖻𝖾𝗋𝗌 𝖾𝗏𝖾𝗋𝗒 8𝗌!",
                gotNum: "🔢 𝖭𝗎𝗆𝖻𝖾𝗋: %1",
                BINGO: "🎉 𝖡𝖨𝖭𝖦𝖮! %1 𝗐𝗈𝗇 $%2!",
                notReady: "❌ 𝖢𝖺𝗇'𝗍 𝗌𝗍𝖺𝗋𝗍 𝗀𝖺𝗆𝖾!",
                info: "🎰 𝖫𝖮𝖳𝖳𝖮 𝖦𝖠𝖬𝖤\n\n- 𝖥𝗎𝗇 𝗅𝗈𝗍𝗍𝗈 𝗀𝖺𝗆𝖾\n- 𝖡𝖾𝗍 𝗆𝗈𝗇𝖾𝗒 𝗍𝗈 𝗉𝗅𝖺𝗒\n- 𝖶𝗂𝗇 𝖻𝗒 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝗂𝗇𝗀 𝖺 𝗋𝗈𝗐\n\n𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌:\n• {p}loto 𝖼𝗋𝖾𝖺𝗍𝖾 [𝖻𝖾𝗍]\n• {p}loto 𝗃𝗈𝗂𝗇\n• {p}loto 𝗌𝗍𝖺𝗋𝗍"
            };

            switch (args[0]) {
                case 'create': {
                    const moneyBet = parseInt(args[1]);
                    if (isNaN(moneyBet) || moneyBet <= 0) return message.reply(messages.missingInput);
                    if (moneyBet < 50) return message.reply(messages.limitBet);
                    if (moneyBet > userMoney) return message.reply(messages.moneyBetNotEnough.replace("%1", moneyBet));
                    if (threadID in global.client.loto) return message.reply(messages.alreadyHave);

                    global.client.loto[threadID] = {
                        author: senderID,
                        data: { [senderID]: [] },
                        status: "pending",
                        maximumBet: moneyBet
                    };

                    try {
                        await usersData.decreaseMoney(senderID, moneyBet);
                    } catch (moneyError) {
                        console.error("𝖤𝗋𝗋𝗈𝗋 𝖽𝖾𝖼𝗋𝖾𝖺𝗌𝗂𝗇𝗀 𝗆𝗈𝗇𝖾𝗒:", moneyError);
                        delete global.client.loto[threadID];
                        return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗉𝖺𝗒𝗆𝖾𝗇𝗍.");
                    }

                    return message.reply(messages.openSuccess
                        .replace("%1", "1")
                        .replace("%2", "10"));
                }

                case 'join': {
                    if (!(threadID in global.client.loto)) return message.reply(messages.noGame);
                    if (senderID in global.client.loto[threadID].data) return message.reply(messages.alreadyJoined);
                    if (Object.keys(global.client.loto[threadID].data).length >= 10) return message.reply(messages.out_of_room);
                    if (global.client.loto[threadID].status === "started") return message.reply(messages.alreadyStarted_1);
                    if (global.client.loto[threadID].maximumBet > userMoney) return message.reply(messages.moneyBetNotEnough.replace("%1", global.client.loto[threadID].maximumBet));

                    global.client.loto[threadID].data[senderID] = [];
                    
                    try {
                        await usersData.decreaseMoney(senderID, global.client.loto[threadID].maximumBet);
                    } catch (moneyError) {
                        console.error("𝖤𝗋𝗋𝗈𝗋 𝖽𝖾𝖼𝗋𝖾𝖺𝗌𝗂𝗇𝗀 𝗆𝗈𝗇𝖾𝗒:", moneyError);
                        delete global.client.loto[threadID].data[senderID];
                        return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗉𝖺𝗒𝗆𝖾𝗇𝗍.");
                    }

                    return message.reply(messages.joinSuccess
                        .replace("%1", Object.keys(global.client.loto[threadID].data).length.toString())
                        .replace("%2", "10"));
                }

                case 'start': {
                    if (!(threadID in global.client.loto)) return message.reply(messages.noGame);
                    if (Object.keys(global.client.loto[threadID].data).length < 2) return message.reply(messages.playersNotEnough);
                    if (!(senderID in global.client.loto[threadID].data)) return message.reply(messages.notJoined);
                    if (global.client.loto[threadID].author !== senderID) return message.reply(messages.not_author);
                    if (global.client.loto[threadID].status === "started") return message.reply(messages.alreadyStarted_2);

                    global.client.loto[threadID].status = "started";
                    const lotoKeys = Object.keys(this.loto);
                    
                    // Shuffle keys
                    for (let i = lotoKeys.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [lotoKeys[i], lotoKeys[j]] = [lotoKeys[j], lotoKeys[i]];
                    }

                    // Send cards to players
                    await message.reply(messages.checkInbox_noti);
                    const failedPlayers = [];
                    
                    for (const playerId of Object.keys(global.client.loto[threadID].data)) {
                        try {
                            const randomIndex = Math.floor(Math.random() * lotoKeys.length);
                            const cardFile = lotoKeys[randomIndex];
                            global.client.loto[threadID].data[playerId] = cardFile;
                            
                            const cardPath = path.resolve(__dirname, './loto/', cardFile);
                            if (fs.existsSync(cardPath)) {
                                await message.reply({
                                    body: "🎴 𝖸𝗈𝗎𝗋 𝖼𝖺𝗋𝖽:",
                                    attachment: fs.createReadStream(cardPath)
                                }, playerId);
                            } else {
                                failedPlayers.push(playerId);
                            }
                            await delay(500);
                        } catch (error) {
                            console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝖼𝖺𝗋𝖽 𝗍𝗈 ${playerId}:`, error);
                            failedPlayers.push(playerId);
                        }
                    }

                    // Handle failed players
                    if (failedPlayers.length > 0) {
                        console.log(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝖼𝖺𝗋𝖽𝗌 𝗍𝗈: ${failedPlayers.join(', ')}`);
                        // Refund failed players
                        for (const playerId of failedPlayers) {
                            try {
                                await usersData.increaseMoney(playerId, global.client.loto[threadID].maximumBet);
                                delete global.client.loto[threadID].data[playerId];
                            } catch (refundError) {
                                console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖿𝗎𝗇𝖽 ${playerId}:`, refundError);
                            }
                        }
                    }

                    // Start number drawing
                    const allNumbers = Array.from({length: 90}, (_, i) => i + 1);
                    const calledNumbers = [];
                    
                    const drawNumber = async () => {
                        if (!global.client.loto[threadID]) {
                            console.log("❌ 𝖦𝖺𝗆𝖾 𝗇𝗈 𝗅𝗈𝗇𝗀𝖾𝗋 𝖾𝗑𝗂𝗌𝗍𝗌");
                            return;
                        }
                        
                        if (allNumbers.length === 0) {
                            console.log("❌ 𝖭𝗈 𝗆𝗈𝗋𝖾 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗅𝖾𝖿𝗍");
                            // Refund all players if no winner
                            for (const playerId of Object.keys(global.client.loto[threadID].data)) {
                                try {
                                    await usersData.increaseMoney(playerId, global.client.loto[threadID].maximumBet);
                                } catch (refundError) {
                                    console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖿𝗎𝗇𝖽 ${playerId}:`, refundError);
                                }
                            }
                            delete global.client.loto[threadID];
                            return;
                        }

                        const randomIndex = Math.floor(Math.random() * allNumbers.length);
                        const drawnNumber = allNumbers.splice(randomIndex, 1)[0];
                        calledNumbers.push(drawnNumber);
                        
                        await message.reply(messages.gotNum.replace("%1", drawnNumber));
                        
                        // Check for winners
                        for (const [playerId, cardFile] of Object.entries(global.client.loto[threadID].data)) {
                            const cardNumbers = this.loto[cardFile];
                            for (const row of cardNumbers) {
                                if (row.every(num => calledNumbers.includes(num))) {
                                    try {
                                        const playerName = await usersData.getName(playerId);
                                        const reward = global.client.loto[threadID].maximumBet * 
                                                      (Object.keys(global.client.loto[threadID].data).length - 1);
                                        
                                        await usersData.increaseMoney(playerId, reward + global.client.loto[threadID].maximumBet);
                                        await message.reply(messages.BINGO
                                            .replace("%1", playerName)
                                            .replace("%2", reward.toString()));
                                        
                                        delete global.client.loto[threadID];
                                        return;
                                    } catch (winError) {
                                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗐𝗂𝗇:", winError);
                                    }
                                }
                            }
                        }
                        
                        // Continue drawing if no winner yet
                        if (allNumbers.length > 0 && global.client.loto[threadID]) {
                            setTimeout(drawNumber, 8000);
                        } else {
                            // Game ended without winner
                            delete global.client.loto[threadID];
                        }
                    };
                    
                    setTimeout(drawNumber, 8000);
                    break;
                }

                default: {
                    return message.reply(messages.info);
                }
            }
        } catch (error) {
            console.error("💥 𝖫𝗈𝗍𝗈 𝖾𝗋𝗋𝗈𝗋:", error);
            message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗂𝗇 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾");
        }
    }
};
