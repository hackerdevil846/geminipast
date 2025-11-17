const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "formula",
        aliases: ["formulas", "mathformula", "physicsformula"],
        version: "2.0.0",
        author: "𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝗠𝗔𝗧𝗛𝗘𝗠𝗔𝗧𝗜𝗖𝗦 𝗔𝗡𝗗 𝗣𝗛𝗬𝗦𝗜𝗖𝗦 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦 𝗖𝗢𝗟𝗟𝗘𝗖𝗧𝗜𝗢𝗡"
        },
        longDescription: {
            en: "𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘 𝗖𝗢𝗟𝗟𝗘𝗖𝗧𝗜𝗢𝗡 𝗢𝗙 𝗠𝗔𝗧𝗛𝗘𝗠𝗔𝗧𝗜𝗖𝗦 𝗔𝗡𝗗 𝗣𝗛𝗬𝗦𝗜𝗖𝗦 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦"
        },
        category: "𝗦𝗧𝗨𝗗𝗬",
        guide: {
            en: "{p}formula 𝗺𝗮𝘁𝗵/𝗽𝗵𝘆𝘀𝗶𝗰𝘀"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ api, event, args }) {
        try {
            if (!args[0]) {
                return api.sendMessage(
                    "𝗣𝗟𝗘𝗔𝗦𝗘 𝗦𝗣𝗘𝗖𝗜𝗙𝗬 𝗪𝗛𝗜𝗖𝗛 𝗦𝗨𝗕𝗝𝗘𝗖𝗧 𝗬𝗢𝗨 𝗪𝗔𝗡𝗧 𝗧𝗢 𝗦𝗘𝗘 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦 𝗙𝗢𝗥:\n" +
                    "➝ {p}formula 𝗺𝗮𝘁𝗵 - 𝗩𝗜𝗘𝗪 𝗠𝗔𝗧𝗛𝗘𝗠𝗔𝗧𝗜𝗖𝗦 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦\n" +
                    "➝ {p}formula 𝗽𝗵𝘆𝘀𝗶𝗰𝘀 - 𝗩𝗜𝗘𝗪 𝗣𝗛𝗬𝗦𝗜𝗖𝗦 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦", 
                    event.threadID, 
                    event.messageID
                );
            }

            const subject = args[0].toLowerCase();
            
            switch(subject) {
                case "math":
                case "mathematics":
                case "maths": {
                    return api.sendMessage(
                        "🔢 === 𝗠𝗔𝗧𝗛𝗘𝗠𝗔𝗧𝗜𝗖𝗦 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦 ===" +
                        "\n» 𝗣𝗟𝗘𝗔𝗦𝗘 𝗖𝗛𝗢𝗢𝗦𝗘 𝗔𝗡 𝗢𝗣𝗧𝗜𝗢𝗡 «" +
                        "\n\n𝟭. 𝗗𝗘𝗥𝗜𝗩𝗔𝗧𝗜𝗩𝗘𝗦" +
                        "\n𝟮. 𝗜𝗡𝗧𝗘𝗚𝗥𝗔𝗟𝗦" +
                        "\n𝟯. 𝗟𝗢𝗚𝗔𝗥𝗜𝗧𝗛𝗠𝗦" +
                        "\n𝟰. 𝗔𝗥𝗘𝗔" +
                        "\n𝟱. 𝗩𝗢𝗟𝗨𝗠𝗘" +
                        "\n𝟲. 𝗧𝗥𝗜𝗚𝗢𝗡𝗢𝗠𝗘𝗧𝗥𝗬" +
                        "\n𝟳. 𝗘𝗫𝗣𝗢𝗡𝗘𝗡𝗧𝗦" +
                        "\n𝟴. 𝗖𝗢𝗢𝗥𝗗𝗜𝗡𝗔𝗧𝗘𝗦" +
                        "\n\n» 𝗥𝗘𝗣𝗟𝗬 𝗧𝗢 𝗧𝗛𝗜𝗦 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗪𝗜𝗧𝗛 𝗬𝗢𝗨𝗥 𝗖𝗛𝗢𝗜𝗖𝗘 «"
                    , event.threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "math"
                        });
                    }, event.messageID);
                }

                case "physics":
                case "phys": {
                    return api.sendMessage(
                        "⚡ === 𝗣𝗛𝗬𝗦𝗜𝗖𝗦 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦 ===" +
                        "\n» 𝗣𝗟𝗘𝗔𝗦𝗘 𝗖𝗛𝗢𝗢𝗦𝗘 𝗔 𝗚𝗥𝗔𝗗𝗘 𝗟𝗘𝗩𝗘𝗟 «" +
                        "\n\n𝟭. 𝗚𝗥𝗔𝗗𝗘 𝟭𝟬" +
                        "\n𝟮. 𝗚𝗥𝗔𝗗𝗘 𝟭𝟭" + 
                        "\n𝟯. 𝗚𝗥𝗔𝗗𝗘 𝟭𝟮" +
                        "\n\n» 𝗥𝗘𝗣𝗟𝗬 𝗧𝗢 𝗧𝗛𝗜𝗦 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗪𝗜𝗧𝗛 𝗬𝗢𝗨𝗥 𝗖𝗛𝗢𝗜𝗖𝗘 «"
                    , event.threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "physics"
                        });
                    }, event.messageID);
                }

                default: {
                    return api.sendMessage(
                        "❌ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗦𝗨𝗕𝗝𝗘𝗖𝗧! 𝗣𝗟𝗘𝗔𝗦𝗘 𝗖𝗛𝗢𝗢𝗦𝗘:\n" +
                        "➝ 𝗺𝗮𝘁𝗵 - 𝗠𝗔𝗧𝗛𝗘𝗠𝗔𝗧𝗜𝗖𝗦 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦\n" +
                        "➝ 𝗽𝗵𝘆𝘀𝗶𝗰𝘀 - 𝗣𝗛𝗬𝗦𝗜𝗖𝗦 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦", 
                        event.threadID, 
                        event.messageID
                    );
                }
            }
        } catch (error) {
            console.error("𝗘𝗥𝗥𝗢𝗥:", error);
            api.sendMessage("❌ 𝗔𝗡 𝗘𝗥𝗥𝗢𝗥 𝗢𝗖𝗖𝗨𝗥𝗥𝗘𝗗 𝗪𝗛𝗜𝗟𝗘 𝗘𝗫𝗘𝗖𝗨𝗧𝗜𝗡𝗚 𝗧𝗛𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗!", event.threadID, event.messageID);
        }
    },

    onReply: async function({ api, event, handleReply }) {
        try {
            let link = "";
            let msg = "";
            let fileName = "";

            switch(handleReply.type) {
                case "math": {
                    const mathFormulas = {
                        "1": { link: "https://i.imgur.com/kQmVXlL.jpg", msg: "𝗗𝗘𝗥𝗜𝗩𝗔𝗧𝗜𝗩𝗘𝗦 𝗔𝗥𝗘 𝗛𝗘𝗥𝗘! 📈" },
                        "2": { link: "https://i.imgur.com/2jyh72H.jpg", msg: "𝗜𝗡𝗧𝗘𝗚𝗥𝗔𝗟𝗦 𝗔𝗥𝗘 𝗛𝗘𝗥𝗘! ∫" },
                        "3": { link: "https://i.imgur.com/WkxOvVZ.jpg", msg: "𝗟𝗢𝗚𝗔𝗥𝗜𝗧𝗛𝗠𝗦 𝗔𝗥𝗘 𝗛𝗘𝗥𝗘! 📊" },
                        "4": { link: "https://i.imgur.com/AODxsFO.jpg", msg: "𝗔𝗥𝗘𝗔 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦 𝗔𝗥𝗘 𝗛𝗘𝗥𝗘! 📐" },
                        "5": { link: "https://i.imgur.com/ubmnDFT.jpg", msg: "𝗩𝗢𝗟𝗨𝗠𝗘 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦 𝗔𝗥𝗘 𝗛𝗘𝗥𝗘! 🧊" },
                        "6": { link: "https://i.imgur.com/Jypelyv.png", msg: "𝗧𝗥𝗜𝗚𝗢𝗡𝗢𝗠𝗘𝗧𝗥𝗬 𝗙𝗢𝗥𝗠𝗨𝗟𝗔𝗦 𝗔𝗥𝗘 𝗛𝗘𝗥𝗘! 🔺" },
                        "7": { link: "https://i.imgur.com/rgXzcRO.jpg", msg: "𝗘𝗫𝗣𝗢𝗡𝗘𝗡𝗧𝗦 𝗔𝗥𝗘 𝗛𝗘𝗥𝗘! ⚡" },
                        "8": { link: "https://i.imgur.com/PTPOLrx.jpg", msg: "𝗖𝗢𝗢𝗥𝗗𝗜𝗡𝗔𝗧𝗘𝗦 𝗔𝗥𝗘 𝗛𝗘𝗥𝗘! 🧭" }
                    };

                    const choice = event.body;
                    const formula = mathFormulas[choice];
                    
                    if (!formula) {
                        return api.sendMessage("❌ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗛𝗢𝗜𝗖𝗘! 𝗣𝗟𝗘𝗔𝗦𝗘 𝗖𝗛𝗢𝗢𝗦𝗘 𝗕𝗘𝗧𝗪𝗘𝗘𝗡 𝟭-𝟴", event.threadID, event.messageID);
                    }

                    link = formula.link;
                    msg = formula.msg;
                    fileName = "math.jpg";
                    break;
                }

                case "physics": {
                    const physicsLevels = {
                        "1": { type: "𝗚𝗥𝗔𝗗𝗘 𝟭𝟬", title: "=== 𝗣𝗛𝗬𝗦𝗜𝗖𝗦 𝗚𝗥𝗔𝗗𝗘 𝟭𝟬 ===" },
                        "2": { type: "𝗚𝗥𝗔𝗗𝗘 𝟭𝟭", title: "=== 𝗣𝗛𝗬𝗦𝗜𝗖𝗦 𝗚𝗥𝗔𝗗𝗘 𝟭𝟭 ===" },
                        "3": { type: "𝗚𝗥𝗔𝗗𝗘 𝟭𝟮", title: "=== 𝗣𝗛𝗬𝗦𝗜𝗖𝗦 𝗚𝗥𝗔𝗗𝗘 𝟭𝟮 ===" }
                    };

                    const choice = event.body;
                    const level = physicsLevels[choice];
                    
                    if (!level) {
                        return api.sendMessage("❌ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗛𝗢𝗜𝗖𝗘! 𝗣𝗟𝗘𝗔𝗦𝗘 𝗖𝗛𝗢𝗢𝗦𝗘 𝗕𝗘𝗧𝗪𝗘𝗘𝗡 𝟭-𝟯", event.threadID, event.messageID);
                    }

                    return api.sendMessage(
                        level.title +
                        "\n» 𝗣𝗟𝗘𝗔𝗦𝗘 𝗖𝗛𝗢𝗢𝗦𝗘 𝗔 𝗖𝗛𝗔𝗣𝗧𝗘𝗥 «" +
                        "\n\n𝟭. 𝗖𝗛𝗔𝗣𝗧𝗘𝗥 𝟭" +
                        "\n𝟮. 𝗖𝗛𝗔𝗣𝗧𝗘𝗥 𝟮" +
                        "\n𝟯. 𝗖𝗛𝗔𝗣𝗧𝗘𝗥 𝟯" +
                        "\n𝟰. 𝗖𝗛𝗔𝗣𝗧𝗘𝗥 𝟰" +
                        "\n𝟱. 𝗖𝗛𝗔𝗣𝗧𝗘𝗥 𝟱" +
                        "\n𝟲. 𝗖𝗛𝗔𝗣𝗧𝗘𝗥 𝟲" +
                        "\n𝟳. 𝗖𝗛𝗔𝗣𝗧𝗘𝗥 𝟳" +
                        "\n\n» 𝗥𝗘𝗣𝗟𝗬 𝗧𝗢 𝗧𝗛𝗜𝗦 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗪𝗜𝗧𝗛 𝗬𝗢𝗨𝗥 𝗖𝗛𝗢𝗜𝗖𝗘 «"
                    , event.threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: level.type
                        });
                    }, event.messageID);
                }

                case "𝗚𝗥𝗔𝗗𝗘 𝟭𝟬": {
                    const formulas = {
                        "1": { link: "https://i.imgur.com/vHFSC50.jpg", msg: "𝗞𝗜𝗡𝗘𝗠𝗔𝗧𝗜𝗖𝗦 𝗢𝗙 𝗣𝗢𝗜𝗡𝗧 𝗠𝗔𝗦𝗦! 🚀" },
                        "2": { link: "https://i.imgur.com/XvLwGoz.jpg", msg: "𝗗𝗬𝗡𝗔𝗠𝗜𝗖𝗦 𝗢𝗙 𝗣𝗢𝗜𝗡𝗧 𝗠𝗔𝗦𝗦! ⚖️" },
                        "3": { link: "", msg: "𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𝗔𝗡𝗗 𝗠𝗢𝗧𝗜𝗢𝗡 𝗢𝗙 𝗥𝗜𝗚𝗜𝗗 𝗕𝗢𝗗𝗜𝗘𝗦! ⚖️" },
                        "4": { link: "", msg: "𝗖𝗢𝗡𝗦𝗘𝗥𝗩𝗔𝗧𝗜𝗢𝗡 𝗟𝗔𝗪𝗦! 🔄" },
                        "5": { link: "", msg: "𝗚𝗔𝗦𝗘𝗦! 💨" },
                        "6": { link: "", msg: "𝗕𝗔𝗦𝗜𝗖𝗦 𝗢𝗙 𝗧𝗛𝗘𝗥𝗠𝗢𝗗𝗬𝗡𝗔𝗠𝗜𝗖𝗦! 🔥" },
                        "7": { link: "", msg: "𝗦𝗢𝗟𝗜𝗗𝗦 𝗔𝗡𝗗 𝗟𝗜𝗤𝗨𝗜𝗗𝗦. 𝗣𝗛𝗔𝗦𝗘 𝗧𝗥𝗔𝗡𝗦𝗜𝗧𝗜𝗢𝗡𝗦! 💧" }
                    };

                    const choice = event.body;
                    const formula = formulas[choice];
                    
                    if (!formula) {
                        return api.sendMessage("❌ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗛𝗢𝗜𝗖𝗘! 𝗣𝗟𝗘𝗔𝗦𝗘 𝗖𝗛𝗢𝗢𝗦𝗘 𝗕𝗘𝗧𝗪𝗘𝗘𝗡 𝟭-𝟳", event.threadID, event.messageID);
                    }

                    link = formula.link;
                    msg = formula.msg;
                    fileName = "physics.jpg";
                    break;
                }

                case "𝗚𝗥𝗔𝗗𝗘 𝟭𝟭": {
                    const formulas = {
                        "1": { link: "https://i.imgur.com/S6lSsum.jpg", msg: "𝗘𝗟𝗘𝗖𝗧𝗥𝗜𝗖 𝗖𝗛𝗔𝗥𝗚𝗘 𝗔𝗡𝗗 𝗘𝗟𝗘𝗖𝗧𝗥𝗜𝗖 𝗙𝗜𝗘𝗟𝗗! ⚡" },
                        "2": { link: "https://i.imgur.com/vgrUOSd.jpg", msg: "𝗗𝗜𝗥𝗘𝗖𝗧 𝗖𝗨𝗥𝗥𝗘𝗡𝗧! 🔌" },
                        "3": { link: "", msg: "𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗜𝗡 𝗗𝗜𝗙𝗙𝗘𝗥𝗘𝗡𝗧 𝗠𝗘𝗗𝗜𝗔! 🔋" },
                        "4": { link: "", msg: "𝗠𝗔𝗚𝗡𝗘𝗧𝗜𝗖 𝗙𝗜𝗘𝗟𝗗! 🧲" },
                        "5": { link: "", msg: "𝗘𝗟𝗘𝗖𝗧𝗥𝗢𝗠𝗔𝗚𝗡𝗘𝗧𝗜𝗖 𝗜𝗡𝗗𝗨𝗖𝗧𝗜𝗢𝗡! 🔁" },
                        "6": { link: "", msg: "𝗟𝗜𝗚𝗛𝗧 𝗥𝗘𝗙𝗥𝗔𝗖𝗧𝗜𝗢𝗡! 🌈" },
                        "7": { link: "", msg: "𝗢𝗣𝗧𝗜𝗖𝗔𝗟 𝗜𝗡𝗦𝗧𝗥𝗨𝗠𝗘𝗡𝗧𝗦 𝗔𝗡𝗗 𝗧𝗛𝗘 𝗘𝗬𝗘! 👁️" }
                    };

                    const choice = event.body;
                    const formula = formulas[choice];
                    
                    if (!formula) {
                        return api.sendMessage("❌ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗛𝗢𝗜𝗖𝗘! 𝗣𝗟𝗘𝗔𝗦𝗘 𝗖𝗛𝗢𝗢𝗦𝗘 𝗕𝗘𝗧𝗪𝗘𝗘𝗡 𝟭-𝟳", event.threadID, event.messageID);
                    }

                    link = formula.link;
                    msg = formula.msg;
                    fileName = "physics.jpg";
                    break;
                }

                case "𝗚𝗥𝗔𝗗𝗘 𝟭𝟮": {
                    const formulas = {
                        "1": { link: "", msg: "𝗠𝗘𝗖𝗛𝗔𝗡𝗜𝗖𝗔𝗟 𝗢𝗦𝗖𝗜𝗟𝗟𝗔𝗧𝗜𝗢𝗡𝗦! 🎯" },
                        "2": { link: "", msg: "𝗠𝗘𝗖𝗛𝗔𝗡𝗜𝗖𝗔𝗟 𝗪𝗔𝗩𝗘𝗦! 🌊" },
                        "3": { link: "", msg: "𝗔𝗟𝗧𝗘𝗥𝗡𝗔𝗧𝗜𝗡𝗚 𝗖𝗨𝗥𝗥𝗘𝗡𝗧! 🔄" },
                        "4": { link: "", msg: "𝗘𝗟𝗘𝗖𝗧𝗥𝗢𝗠𝗔𝗚𝗡𝗘𝗧𝗜𝗖 𝗢𝗦𝗖𝗜𝗟𝗟𝗔𝗧𝗜𝗢𝗡𝗦 𝗔𝗡𝗗 𝗪𝗔𝗩𝗘𝗦! 📡" },
                        "5": { link: "", msg: "𝗟𝗜𝗚𝗛𝗧 𝗪𝗔𝗩𝗘𝗦! 💡" },
                        "6": { link: "", msg: "𝗤𝗨𝗔𝗡𝗧𝗨𝗠 𝗢𝗙 𝗟𝗜𝗚𝗛𝗧! ⚛️" },
                        "7": { link: "", msg: "𝗔𝗧𝗢𝗠𝗜𝗖 𝗡𝗨𝗖𝗟𝗘𝗨𝗦! ⚛️" }
                    };

                    const choice = event.body;
                    const formula = formulas[choice];
                    
                    if (!formula) {
                        return api.sendMessage("❌ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗛𝗢𝗜𝗖𝗘! 𝗣𝗟𝗘𝗔𝗦𝗘 𝗖𝗛𝗢𝗢𝗦𝗘 𝗕𝗘𝗧𝗪𝗘𝗘𝗡 𝟭-𝟳", event.threadID, event.messageID);
                    }

                    link = formula.link;
                    msg = formula.msg;
                    fileName = "physics.jpg";
                    break;
                }
            }

            // Handle image display
            if (link && msg && fileName) {
                if (link === "") {
                    return api.sendMessage(
                        "📝 " + msg + 
                        "\n❌ 𝗪𝗜𝗟𝗟 𝗕𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𝗦𝗢𝗢𝗡!", 
                        event.threadID, 
                        event.messageID
                    );
                }

                const filePath = __dirname + `/cache/${fileName}`;
                
                try {
                    const response = await axios({
                        method: 'GET',
                        url: link,
                        responseType: 'arraybuffer'
                    });

                    await fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
                    
                    await api.sendMessage('🔄 𝗟𝗢𝗔𝗗𝗜𝗡𝗚 𝗗𝗔𝗧𝗔...', event.threadID, event.messageID);
                    
                    await api.sendMessage({
                        body: `📚 ${msg}`,
                        attachment: fs.createReadStream(filePath)
                    }, event.threadID);
                    
                    fs.unlinkSync(filePath);
                    
                } catch (error) {
                    console.error("𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗘𝗥𝗥𝗢𝗥:", error);
                    api.sendMessage("❌ 𝗙𝗔𝗜𝗟𝗘𝗗 𝗧𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗧𝗛𝗘 𝗙𝗢𝗥𝗠𝗨𝗟𝗔 𝗜𝗠𝗔𝗚𝗘!", event.threadID, event.messageID);
                }
            }
        } catch (error) {
            console.error("𝗘𝗥𝗥𝗢𝗥:", error);
            api.sendMessage("❌ 𝗔𝗡 𝗘𝗥𝗥𝗢𝗥 𝗢𝗖𝗖𝗨𝗥𝗥𝗘𝗗 𝗪𝗛𝗜𝗟𝗘 𝗣𝗥𝗢𝗖𝗘𝗦𝗦𝗜𝗡𝗚 𝗬𝗢𝗨𝗥 𝗥𝗘𝗤𝗨𝗘𝗦𝗧!", event.threadID, event.messageID);
        }
    }
};
