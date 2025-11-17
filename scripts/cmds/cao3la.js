const fs = require('fs');
const path = require('path');

// Mathematical Bold Italic text conversion
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports = {
    config: {
        name: "cao3la",
        aliases: [],
        version: "1.0.4",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "𝖡𝖺𝗂 𝖢𝖺𝗈 - 𝖵𝗂𝖾𝗍𝗇𝖺𝗆𝖾𝗌𝖾 𝖼𝖺𝗋𝖽 𝗀𝖺𝗆𝖾 𝖿𝗈𝗋 𝗀𝗋𝗈𝗎𝗉𝗌"
        },
        longDescription: {
            en: "𝖠 𝗍𝗋𝖺𝖽𝗂𝗍𝗂𝗈𝗇𝖺𝗅 𝖵𝗂𝖾𝗍𝗇𝖺𝗆𝖾𝗌𝖾 𝖼𝖺𝗋𝖽 𝗀𝖺𝗆𝖾 𝗐𝗁𝖾𝗋𝖾 𝗉𝗅𝖺𝗒𝖾𝗋𝗌 𝖼𝗈𝗆𝗉𝖾𝗍𝖾 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝖾 𝗁𝗂𝗀𝗁𝖾𝗌𝗍 𝗌𝖼𝗈𝗋𝖾 𝖻𝗒 𝖽𝗋𝖺𝗐𝗂𝗇𝗀 𝖼𝖺𝗋𝖽𝗌"
        },
        guide: {
            en: "{p}cao3la [𝖼𝗋𝖾𝖺𝗍𝖾/𝗃𝗈𝗂𝗇/𝗂𝗇𝖿𝗈/𝗅𝖾𝖺𝗏𝖾/𝗌𝗍𝖺𝗋𝗍]"
        },
        dependencies: {
            "fs": "",
            "path": ""
        },
        envConfig: {
            "maxPlayers": 10,
            "minPlayers": 2,
            "maxCardValue": 9,
            "minCardValue": 1,
            "cardChangeLimit": 2,
            "winningScore": 9,
            "autoEndGame": true,
            "timeout": 300000,
            "language": "en"
        }
    },

    onStart: async function ({ event, message, args, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const { senderID, threadID } = event;
            const config = this.config.envConfig;
            const prefix = global.config.PREFIX;
            
            // Initialize game data if not exists
            if (!global.baicaoData) global.baicaoData = new Map();
            
            let values = global.baicaoData.get(threadID) || {};

            switch (args[0]) {
                case "create":
                case "-c": {
                    if (global.baicaoData.has(threadID)) {
                        return message.reply(toBI("🚫 𝖠 𝗀𝖺𝗆𝖾 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗋𝗎𝗇𝗇𝗂𝗇𝗀 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉"));
                    }
                    global.baicaoData.set(threadID, { 
                        "author": senderID, 
                        "start": 0, 
                        "chiabai": 0, 
                        "ready": 0, 
                        player: [{ 
                            "id": senderID, 
                            "card1": 0, 
                            "card2": 0, 
                            "card3": 0, 
                            "doibai": config.cardChangeLimit, 
                            "ready": false,
                            "tong": 0
                        }] 
                    });
                    return message.reply(toBI("🎮 𝖦𝖺𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽! 𝖯𝗅𝖺𝗒𝖾𝗋𝗌 𝖼𝖺𝗇 𝗃𝗈𝗂𝗇 𝗐𝗂𝗍𝗁 '" + prefix + this.config.name + " 𝗃𝗈𝗂𝗇'"));
                }
                
                case "join":
                case "-j": {
                    if (!global.baicaoData.has(threadID)) {
                        return message.reply(toBI("❌ 𝖭𝗈 𝗀𝖺𝗆𝖾 𝗋𝗎𝗇𝗇𝗂𝗇𝗀. 𝖢𝗋𝖾𝖺𝗍𝖾 𝗈𝗇𝖾 𝗐𝗂𝗍𝗁 '" + prefix + this.config.name + " 𝖼𝗋𝖾𝖺𝗍𝖾'"));
                    }
                    if (values.start == 1) {
                        return message.reply(toBI("✅ 𝖦𝖺𝗆𝖾 𝗁𝖺𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗌𝗍𝖺𝗋𝗍𝖾𝖽"));
                    }
                    if (values.player.find(item => item.id == senderID)) {
                        return message.reply(toBI("ℹ️ 𝖸𝗈𝗎'𝗏𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗃𝗈𝗂𝗇𝖾𝖽 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾"));
                    }
                    if (values.player.length >= config.maxPlayers) {
                        return message.reply(toBI(`🚫 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 𝗉𝗅𝖺𝗒𝖾𝗋𝗌 𝗋𝖾𝖺𝖼𝗁𝖾𝖽 (${config.maxPlayers})`));
                    }
                    values.player.push({ 
                        "id": senderID, 
                        "card1": 0, 
                        "card2": 0, 
                        "card3": 0, 
                        "tong": 0, 
                        "doibai": config.cardChangeLimit, 
                        "ready": false 
                    });
                    global.baicaoData.set(threadID, values);
                    return message.reply(toBI("✅ 𝖸𝗈𝗎'𝗏𝖾 𝗃𝗈𝗂𝗇𝖾𝖽 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾!"));
                }

                case "leave":
                case "-l": {
                    if (!global.baicaoData.has(threadID)) {
                        return message.reply(toBI("❌ 𝖭𝗈 𝗀𝖺𝗆𝖾 𝗋𝗎𝗇𝗇𝗂𝗇𝗀. 𝖢𝗋𝖾𝖺𝗍𝖾 𝗈𝗇𝖾 𝗐𝗂𝗍𝗁 '" + prefix + this.config.name + " 𝖼𝗋𝖾𝖺𝗍𝖾'"));
                    }
                    if (!values.player.some(item => item.id == senderID)) {
                        return message.reply(toBI("❌ 𝖸𝗈𝗎'𝗋𝖾 𝗇𝗈𝗍 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝖺𝗆𝖾"));
                    }
                    if (values.start == 1) {
                        return message.reply(toBI("✅ 𝖦𝖺𝗆𝖾 𝗁𝖺𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗌𝗍𝖺𝗋𝗍𝖾𝖽"));
                    }
                    if (values.author == senderID) {
                        global.baicaoData.delete(threadID);
                        return message.reply(toBI("👋 𝖦𝖺𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝗈𝗋 𝗅𝖾𝖿𝗍. 𝖦𝖺𝗆𝖾 𝖾𝗇𝖽𝖾𝖽!"));
                    } else {
                        values.player.splice(values.player.findIndex(item => item.id === senderID), 1);
                        global.baicaoData.set(threadID, values);
                        return message.reply(toBI("👋 𝖸𝗈𝗎'𝗏𝖾 𝗅𝖾𝖿𝗍 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾"));
                    }
                }

                case "start":
                case "-s": {
                    if (!global.baicaoData.has(threadID)) {
                        return message.reply(toBI("❌ 𝖭𝗈 𝗀𝖺𝗆𝖾 𝗋𝗎𝗇𝗇𝗂𝗇𝗀. 𝖢𝗋𝖾𝖺𝗍𝖾 𝗈𝗇𝖾 𝗐𝗂𝗍𝗁 '" + prefix + this.config.name + " 𝖼𝗋𝖾𝖺𝗍𝖾'"));
                    }
                    if (values.author !== senderID) {
                        return message.reply(toBI("⛔ 𝖮𝗇𝗅𝗒 𝗀𝖺𝗆𝖾 𝖼𝗋𝖾𝖺𝗍𝗈𝗋 𝖼𝖺𝗇 𝗌𝗍𝖺𝗋𝗍"));
                    }
                    if (values.player.length < config.minPlayers) {
                        return message.reply(toBI("👥 𝖭𝗈𝗍 𝖾𝗇𝗈𝗎𝗀𝗁 𝗉𝗅𝖺𝗒𝖾𝗋𝗌 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍 (𝗆𝗂𝗇: " + config.minPlayers + ")"));
                    }
                    if (values.start == 1) {
                        return message.reply(toBI("✅ 𝖦𝖺𝗆𝖾 𝗁𝖺𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗌𝗍𝖺𝗋𝗍𝖾𝖽"));
                    }
                    values.start = 1;
                    global.baicaoData.set(threadID, values);
                    return message.reply(toBI("🎯 𝖦𝖺𝗆𝖾 𝗌𝗍𝖺𝗋𝗍𝖾𝖽! 𝖴𝗌𝖾 '𝖼𝗁𝗂𝖺 𝖻𝖺𝗂' 𝗍𝗈 𝖽𝖾𝖺𝗅 𝖼𝖺𝗋𝖽𝗌"));
                }

                case "info":
                case "-i": {
                    if (!global.baicaoData.has(threadID)) {
                        return message.reply(toBI("❌ 𝖭𝗈 𝗀𝖺𝗆𝖾 𝗋𝗎𝗇𝗇𝗂𝗇𝗀. 𝖢𝗋𝖾𝖺𝗍𝖾 𝗈𝗇𝖾 𝗐𝗂𝗍𝗁 '" + prefix + this.config.name + " 𝖼𝗋𝖾𝖺𝗍𝖾'"));
                    }
                    const playerNames = [];
                    for (const player of values.player) {
                        try {
                            const name = await usersData.getName(player.id);
                            playerNames.push(name);
                        } catch (nameError) {
                            console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗇𝖺𝗆𝖾 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋:", player.id);
                            playerNames.push("𝖴𝗇𝗄𝗇𝗈𝗐𝗇");
                        }
                    }
                    
                    const creatorName = await usersData.getName(values.author);
                    const infoText = toBI("=== 🎴 𝖡𝖺𝗂 𝖢𝖺𝗈 𝖦𝖺𝗆𝖾 ===\n- 👑 𝖢𝗋𝖾𝖺𝗍𝗈𝗋: " + creatorName + "\n- 👥 𝖯𝗅𝖺𝗒𝖾𝗋𝗌 (" + values.player.length + "): " + playerNames.join(", "));
                    return message.reply(infoText);
                }

                default: {
                    const helpText = `🎴 𝖡𝖺𝗂 𝖢𝖺𝗈 𝖦𝖺𝗆𝖾 𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌:

🛠️ 𝖲𝖾𝗍𝗎𝗉 𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌:
${prefix}${this.config.name} 𝖼𝗋𝖾𝖺𝗍𝖾/-𝖼 - 𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝗇𝖾𝗐 𝗀𝖺𝗆𝖾
${prefix}${this.config.name} 𝗃𝗈𝗂𝗇/-𝗃 - 𝖩𝗈𝗂𝗇 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗀𝖺𝗆𝖾
${prefix}${this.config.name} 𝗅𝖾𝖺𝗏𝖾/-𝗅 - 𝖫𝖾𝖺𝗏𝖾 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾
${prefix}${this.config.name} 𝗌𝗍𝖺𝗋𝗍/-𝗌 - 𝖲𝗍𝖺𝗋𝗍 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾
${prefix}${this.config.name} 𝗂𝗇𝖿𝗈/-𝗂 - 𝖲𝗁𝗈𝗐 𝗀𝖺𝗆𝖾 𝗂𝗇𝖿𝗈

🎮 𝖦𝖺𝗆𝖾 𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌:
𝖼𝗁𝗂𝖺 𝖻𝖺𝗂 - 𝖣𝖾𝖺𝗅 𝖼𝖺𝗋𝖽𝗌 𝗍𝗈 𝖺𝗅𝗅 𝗉𝗅𝖺𝗒𝖾𝗋𝗌
𝖽𝗈𝗂 𝖻𝖺𝗂 - 𝖢𝗁𝖺𝗇𝗀𝖾 𝗒𝗈𝗎𝗋 𝖼𝖺𝗋𝖽𝗌 (𝗅𝗂𝗆𝗂𝗍: ${config.cardChangeLimit})
𝗋𝖾𝖺𝖽𝗒 - 𝖬𝖺𝗋𝗄 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿 𝖺𝗌 𝗋𝖾𝖺𝖽𝗒
𝗇𝗈𝗇𝗋𝖾𝖺𝖽𝗒 - 𝖲𝗁𝗈𝗐 𝗉𝗅𝖺𝗒𝖾𝗋𝗌 𝗐𝗁𝗈 𝖺𝗋𝖾𝗇'𝗍 𝗋𝖾𝖺𝖽𝗒

📝 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;
                    return message.reply(toBI(helpText));
                }
            }
        } catch (error) {
            console.error("💥 𝖡𝖺𝗂 𝖢𝖺𝗈 𝖤𝗋𝗋𝗈𝗋:", error);
            message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗂𝗇 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
        }
    },

    onChat: async function({ event, message, usersData, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            const { senderID, threadID, body } = event;
            const config = this.config.envConfig;
            
            if (!body || !global.baicaoData || !global.baicaoData.has(threadID)) return;
            
            let values = global.baicaoData.get(threadID);
            if (values.start != 1) return;

            if (body.toLowerCase().includes("chia bai")) {
                if (values.chiabai == 1) return;
                for(let i = 0; i < values.player.length; i++) {
                    const player = values.player[i];
                    const card1 = Math.floor(Math.random() * config.maxCardValue) + config.minCardValue;
                    const card2 = Math.floor(Math.random() * config.maxCardValue) + config.minCardValue;
                    const card3 = Math.floor(Math.random() * config.maxCardValue) + config.minCardValue;
                    let tong = card1 + card2 + card3;
                    if (tong >= config.winningScore) tong = tong % 10;
                    
                    player.card1 = card1;
                    player.card2 = card2;
                    player.card3 = card3;
                    player.tong = tong;
                    
                    try {
                        await api.sendMessage(toBI("🃏 𝖸𝗈𝗎𝗋 𝖼𝖺𝗋𝖽𝗌: " + card1 + " | " + card2 + " | " + card3 + " \n\n📊 𝖸𝗈𝗎𝗋 𝗍𝗈𝗍𝖺𝗅: " + tong), player.id);
                    } catch (error) {
                        await message.reply(toBI("❌ 𝖢𝖺𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖼𝖺𝗋𝖽𝗌 𝗍𝗈 𝗎𝗌𝖾𝗋: " + player.id));
                    }
                }
                values.chiabai = 1;
                global.baicaoData.set(threadID, values);
                return message.reply(toBI("🃏 𝖢𝖺𝗋𝖽𝗌 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖽𝖾𝖺𝗅𝗍! 𝖯𝗅𝖺𝗒𝖾𝗋𝗌 𝖼𝖺𝗇 𝗇𝗈𝗐 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾𝗂𝗋 𝖼𝖺𝗋𝖽𝗌"));
            }

            if (body.toLowerCase().includes("doi bai")) {
                if (values.chiabai != 1) return;
                let player = values.player.find(item => item.id == senderID);
                if (!player) return;
                if (player.doibai == 0) return message.reply(toBI("🚫 𝖸𝗈𝗎'𝗏𝖾 𝗎𝗌𝖾𝖽 𝖺𝗅𝗅 𝗒𝗈𝗎𝗋 𝖼𝖺𝗋𝖽 𝖼𝗁𝖺𝗇𝗀𝖾𝗌"));
                if (player.ready) return message.reply(toBI("✅ 𝖸𝗈𝗎'𝗋𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗋𝖾𝖺𝖽𝗒, 𝖼𝖺𝗇'𝗍 𝖼𝗁𝖺𝗇𝗀𝖾 𝖼𝖺𝗋𝖽𝗌!"));
                
                const cards = ["card1", "card2", "card3"];
                const randomCard = cards[Math.floor(Math.random() * cards.length)];
                player[randomCard] = Math.floor(Math.random() * config.maxCardValue) + config.minCardValue;
                player.tong = player.card1 + player.card2 + player.card3;
                if (player.tong >= config.winningScore) player.tong = player.tong % 10;
                player.doibai -= 1;
                global.baicaoData.set(threadID, values);
                
                try {
                    await api.sendMessage(toBI("🃏 𝖸𝗈𝗎𝗋 𝗇𝖾𝗐 𝖼𝖺𝗋𝖽𝗌: " + player.card1 + " | " + player.card2 + " | " + player.card3 + " \n\n📊 𝖸𝗈𝗎𝗋 𝗍𝗈𝗍𝖺𝗅: " + player.tong), player.id);
                } catch (error) {
                    await message.reply(toBI("❌ 𝖢𝖺𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖼𝖺𝗋𝖽𝗌 𝗍𝗈 𝗎𝗌𝖾𝗋: " + player.id));
                }
            }

            if (body.toLowerCase().includes("ready")) {
                if (values.chiabai != 1) return;
                let player = values.player.find(item => item.id == senderID);
                if (!player) return;
                if (player.ready) return;
                
                const name = await usersData.getName(senderID);
                values.ready += 1;
                player.ready = true;
                
                if (values.player.length == values.ready) {
                    const sortedPlayers = [...values.player].sort((a, b) => b.tong - a.tong);
                    let ranking = [];
                    let num = 1;

                    for (const info of sortedPlayers) {
                        try {
                            const playerName = await usersData.getName(info.id);
                            ranking.push(toBI(num++ + ". " + playerName + " - 🃏 " + info.card1 + " | " + info.card2 + " | " + info.card3 + " => 📊 " + info.tong + " 𝗉𝗈𝗂𝗇𝗍𝗌"));
                        } catch (nameError) {
                            ranking.push(toBI(num++ + ". 𝖴𝗇𝗄𝗇𝗈𝗐𝗇 - 🃏 " + info.card1 + " | " + info.card2 + " | " + info.card3 + " => 📊 " + info.tong + " 𝗉𝗈𝗂𝗇𝗍𝗌"));
                        }
                    }

                    global.baicaoData.delete(threadID);
                    return message.reply(toBI("🎉 𝖥𝖨𝖭𝖠𝖫 𝖱𝖤𝖲𝖴𝖫𝖳𝖲 🎉\n\n" + ranking.join("\n")));
                } else {
                    return message.reply(toBI("✅ 𝖯𝗅𝖺𝗒𝖾𝗋: " + name + " 𝗂𝗌 𝗋𝖾𝖺𝖽𝗒, 𝗐𝖺𝗂𝗍𝗂𝗇𝗀 𝖿𝗈𝗋: " + (values.player.length - values.ready) + " 𝗉𝗅𝖺𝗒𝖾𝗋𝗌"));
                }
            }
            
            if (body.toLowerCase().includes("nonready")) {
                const notReadyPlayers = values.player.filter(item => !item.ready);
                let playerNames = [];

                for (const player of notReadyPlayers) {
                    try {
                        const name = await usersData.getName(player.id);
                        playerNames.push(name);
                    } catch (nameError) {
                        playerNames.push("𝖴𝗇𝗄𝗇𝗈𝗐𝗇");
                    }
                }
                if (playerNames.length > 0) {
                    return message.reply(toBI("⏰ 𝖯𝗅𝖺𝗒𝖾𝗋𝗌 𝗇𝗈𝗍 𝗋𝖾𝖺𝖽𝗒: " + playerNames.join(", ")));
                }
            }
        } catch (error) {
            console.error("💥 𝖡𝖺𝗂 𝖢𝖺𝗈 𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗂𝗇 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾");
        }
    }
};
