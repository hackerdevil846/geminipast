const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "game",
        aliases: ["wordguess", "picturegame"],
        version: "1.2.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "entertainment",
        shortDescription: {
            en: "🎮 𝐺𝑢𝑒𝑠𝑠 𝑡ℎ𝑒 𝑤𝑜𝑟𝑑 𝑜𝑟 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 𝑔𝑎𝑚𝑒"
        },
        longDescription: {
            en: "𝐹𝑢𝑛 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑙𝑒𝑡𝑡𝑒𝑟𝑠 𝑎𝑛𝑑 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
        },
        guide: {
            en: "{p}game [1/2]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "canvas": "",
            "fs-extra": "",
            "path": ""
        }
    },

    langs: {
        en: {
            chooseMode: "✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑒𝑙𝑒𝑐𝑡 𝑎 𝑔𝑎𝑚𝑒 𝑚𝑜𝑑𝑒:\n\n1️⃣ » 𝐺𝑢𝑒𝑠𝑠 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 𝑓𝑟𝑜𝑚 𝑙𝑒𝑡𝑡𝑒𝑟𝑠\n2️⃣ » 𝐺𝑢𝑒𝑠𝑠 𝑤𝑜𝑟𝑑 𝑓𝑟𝑜𝑚 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠",
            invalidOption: "⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑒𝑙𝑒𝑐𝑡 1️⃣ 𝑜𝑟 2️⃣",
            searching: "🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔: \"%1\"",
            noVideos: "❌ 𝑁𝑜 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦!",
            gamePrompt: "🔍 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟!\n✨ 𝐶𝑙𝑢𝑒: %1",
            wrongAnswer: "❌ 𝑊𝑟𝑜𝑛𝑔 𝑎𝑛𝑠𝑤𝑒𝑟! 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛! 🔄",
            correctAnswer: "🎉 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 %1! 🎉\n✅ 𝐶𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟: %2\n💰 𝑅𝑒𝑤𝑎𝑟𝑑: %3$",
            gameFailed: "❌ 𝐺𝑎𝑚𝑒 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑎𝑖𝑙𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟. ⏳",
            missingDeps: "❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ."
        }
    },

    createClueImage: async function(imagePath, clueText, outputPath) {
        try {
            const image = await loadImage(imagePath);
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext("2d");

            ctx.drawImage(image, 0, 0);

            ctx.font = "bold 48px Arial";
            ctx.fillStyle = "#FFD700";
            ctx.strokeStyle = "#8B0000";
            ctx.lineWidth = 5;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            const textX = canvas.width / 2;
            const textY = canvas.height - 30;

            ctx.strokeText(clueText, textX, textY);
            ctx.fillText(clueText, textX, textY);

            const buffer = canvas.toBuffer("image/png");
            await fs.writeFile(outputPath, buffer);

            return true;
        } catch (error) {
            console.error("Image processing error:", error);
            return false;
        }
    },

    onReply: async function({ message, event, handleReply, usersData }) {
        const { tukhoa, type } = handleReply;
        const coinsup = 200;

        if (event.senderID !== handleReply.author) return;

        switch (type) {
            case "choosee":
                if (["1", "2"].includes(event.body)) {
                    message.unsend(handleReply.messageID);
                    return this.onStart({ 
                        message, 
                        event, 
                        args: [event.body], 
                        usersData 
                    });
                }
                return message.reply(this.langs.en.invalidOption);

            case "doanvan":
            case "doanhinh":
                if (event.body.toLowerCase() === tukhoa.toLowerCase()) {
                    const userData = await usersData.get(event.senderID);
                    await usersData.set(event.senderID, {
                        money: (userData.money || 0) + coinsup,
                        data: userData.data
                    });
                    
                    const userInfo = await global.utils.getUserInfo(event.senderID);
                    const userName = userInfo[event.senderID]?.name || "User";
                    
                    message.unsend(handleReply.messageID);
                    return message.reply(
                        this.langs.en.correctAnswer
                            .replace("%1", userName)
                            .replace("%2", tukhoa)
                            .replace("%3", coinsup)
                    );
                }
                return message.reply(this.langs.en.wrongAnswer);
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            const { threadID, senderID } = event;

            try {
                require("axios");
                require("canvas");
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply(this.langs.en.missingDeps);
            }

            if (!args[0]) {
                return message.reply(this.langs.en.chooseMode, (err, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "choosee"
                    });
                });
            }

            if (args[0] === "1") {
                try {
                    const res = await axios.get(`https://raw.githubusercontent.com/J-JRT/Judas-Bot-dep/main/data/data.json`);
                    const games = res.data.tukhoa;
                    const gameData = games[Math.floor(Math.random() * games.length)];

                    const imageResponse = await axios.get(gameData.link1, { responseType: "arraybuffer" });
                    const cachePath = path.join(__dirname, `cache/game_${Date.now()}.png`);
                    await fs.ensureDir(path.dirname(cachePath));
                    await fs.writeFile(cachePath, imageResponse.data);

                    await this.createClueImage(cachePath, `🔤 𝐶𝑙𝑢𝑒: ${gameData.sokitu}`, cachePath);

                    return message.reply({
                        body: this.langs.en.gamePrompt.replace("%1", gameData.sokitu),
                        attachment: fs.createReadStream(cachePath)
                    }, (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            tukhoa: gameData.tukhoa,
                            type: "doanvan"
                        });
                        fs.unlinkSync(cachePath);
                    });

                } catch (error) {
                    console.error("Game mode 1 error:", error);
                    return message.reply(this.langs.en.gameFailed);
                }
            }

            if (args[0] === "2") {
                try {
                    const res = await axios.get(`https://raw.githubusercontent.com/J-JRT/Judas-Bot-dep/main/data/anh.json`);
                    const games = res.data.doanhinh;
                    const gameData = games[Math.floor(Math.random() * games.length)];

                    const imageTasks = [
                        axios.get(gameData.link1, { responseType: "arraybuffer" }),
                        axios.get(gameData.link2, { responseType: "arraybuffer" })
                    ];

                    const images = await Promise.all(imageTasks);
                    const cachePaths = images.map((_, i) => path.join(__dirname, `cache/game_${Date.now()}_${i}.png`));

                    await Promise.all(images.map((img, i) => {
                        fs.ensureDir(path.dirname(cachePaths[i]));
                        return fs.writeFile(cachePaths[i], img.data);
                    }));
                    
                    await Promise.all(cachePaths.map(p => this.createClueImage(p, `🖼️ 𝐶𝑙𝑢𝑒: ${gameData.sokitu}`, p)));

                    return message.reply({
                        body: this.langs.en.gamePrompt.replace("%1", gameData.sokitu),
                        attachment: cachePaths.map(p => fs.createReadStream(p))
                    }, (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            tukhoa: gameData.tukhoa,
                            type: "doanhinh"
                        });
                        cachePaths.forEach(p => fs.unlinkSync(p));
                    });

                } catch (error) {
                    console.error("Game mode 2 error:", error);
                    return message.reply(this.langs.en.gameFailed);
                }
            }

            return message.reply(this.langs.en.invalidOption);

        } catch (error) {
            console.error("Game command error:", error);
            return message.reply(this.langs.en.gameFailed);
        }
    }
};
