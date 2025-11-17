const fs = require("fs-extra");
const stringSimilarity = require('string-similarity');

module.exports = {
    config: {
        name: "sendfile",
        aliases: [],
        version: "1.0.0",
        role: 2,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑎𝑑𝑚𝑖𝑛",
        shortDescription: {
            en: "𝐹𝑎𝑖𝑙 𝑝𝑎𝑡ℎ𝑎𝑛𝑜𝑟 𝑗𝑜𝑛𝑛𝑜 𝑎𝑑𝑚𝑖𝑛 𝑘𝑚𝑑"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒𝑠 𝑡𝑜 𝑢𝑠𝑒𝑟𝑠 𝑜𝑟 𝑔𝑟𝑜𝑢𝑝𝑠 𝑤𝑖𝑡ℎ 𝑓𝑢𝑧𝑧𝑦 𝑚𝑎𝑡𝑐ℎ𝑖𝑛𝑔"
        },
        guide: {
            en: "{p}sendfile [𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒.𝑗𝑠]"
        },
        countDown: 0,
        dependencies: {
            "fs-extra": "",
            "string-similarity": ""
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("string-similarity");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑎𝑛𝑑 𝑠𝑡𝑟𝑖𝑛𝑔-𝑠𝑖𝑚𝑖𝑙𝑎𝑟𝑖𝑡𝑦");
            }

            const file = args.join(" ");

            if (!file) {
                return message.reply("🔴 | 𝐹𝑎𝑖𝑙𝑒𝑟 𝑁𝑎𝑚 𝑘ℎ𝑎𝑙𝑖 𝑟𝑎𝑘ℎ𝑎 𝑗𝑎𝑏𝑒 𝑛𝑎!");
            }

            if (!file.endsWith('.js')) {
                return message.reply("🔴 | 𝐹𝑎𝑖𝑙𝑒𝑟 𝐸𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛 (.𝑗𝑠) ℎ𝑜𝑡𝑒 ℎ𝑜𝑏𝑒!");
            }

            if (event.type === "message_reply") {
                const uid = event.messageReply.senderID;
                const userData = await usersData.get(uid);
                const name = userData.name || "𝑈𝑠𝑒𝑟";
                
                if (!fs.existsSync(__dirname + "/" + file)) {
                    return this.handleFileNotFound(message, event, file, 'user', uid, name);
                }
                
                return this.sendFileToUser(message, event, file, uid, name);
            } 
            else {
                if (!fs.existsSync(__dirname + "/" + file)) {
                    return this.handleFileNotFound(message, event, file, 'thread');
                }
                
                return this.sendFileToThread(message, event, file);
            }

        } catch (error) {
            console.error("𝑆𝑒𝑛𝑑𝑓𝑖𝑙𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    },

    handleFileNotFound: function(message, event, file, type, uid = null, name = null) {
        const allJsFiles = fs.readdirSync(__dirname).filter(f => f.endsWith(".js"));
        const fileNames = allJsFiles.map(f => f.replace('.js', ''));
        const matches = stringSimilarity.findBestMatch(file, fileNames);

        if (matches.bestMatch.rating < 0.5) {
            return message.reply(`🔍 | "${file}" 𝑁𝑎𝑚𝑒𝑟 𝐹𝑎𝑖𝑙 𝑝𝑎𝑤𝑎 𝑗𝑎𝑐𝑐ℎ𝑒 𝑛𝑎!`);
        }

        const closestMatch = matches.bestMatch.target;
        const messageText = `🔍 | "${file}" 𝑁𝑎𝑚𝑒𝑟 𝐹𝑎𝑖𝑙 𝑝𝑎𝑤𝑎 𝑗𝑎𝑐𝑐ℎ𝑒 𝑛𝑎!\n✨ | 𝐶𝑙𝑜𝑠𝑒𝑠𝑡 𝑀𝑎𝑡𝑐ℎ: ${closestMatch}.𝑗𝑠\n` + 
                           `🔰 | 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑠𝑒𝑛𝑑 ${type === 'user' ? `𝑡𝑜 ${name}` : '𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝'}`;

        return message.reply(messageText).then((info) => {
            global.client.handleReaction.push({
                type,
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID,
                file: closestMatch,
                uid: uid,
                namee: name
            });
        });
    },

    sendFileToUser: async function(message, event, file, uid, name) {
        const txtFile = file.replace('.js', '.txt');
        const sourcePath = __dirname + '/' + file;
        const tempPath = __dirname + '/' + txtFile;

        if (!fs.existsSync(sourcePath)) {
            return message.reply(`🔴 | 𝐹𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡 ${sourcePath}`);
        }

        fs.copyFileSync(sourcePath, tempPath);

        await message.reply({
            body: `📩 | ${file} 𝐹𝑎𝑖𝑙𝑡𝑖 𝑡𝑜𝑚𝑎𝑟 𝑘𝑎𝑐ℎ𝑒 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 ℎ𝑜𝑙𝑐𝑐ℎ𝑒!`,
            attachment: fs.createReadStream(tempPath)
        }, uid).then(() => {
            message.reply(`✅ | ${name} 𝑒𝑟 𝑘𝑎𝑐ℎ𝑒 ${file} 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 ℎ𝑜𝑙𝑒𝑐𝑐ℎ𝑒!`);
        }).catch((err) => {
            message.reply(`❌ | 𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑓𝑖𝑙𝑒 𝑡𝑜 ${name}: ${err.message}`);
        }).finally(() => {
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        });
    },

    sendFileToThread: function(message, event, file) {
        const txtFile = file.replace('.js', '.txt');
        const sourcePath = __dirname + '/' + file;
        const tempPath = __dirname + '/' + txtFile;

        if (!fs.existsSync(sourcePath)) {
            return message.reply(`🔴 | 𝐹𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡 ${sourcePath}`);
        }

        fs.copyFileSync(sourcePath, tempPath);

        message.reply({
            body: `📩 | ${file} 𝐹𝑎𝑖𝑙𝑡𝑖 𝑒𝑖 𝑔𝑟𝑢𝑝𝑒 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 ℎ𝑜𝑙𝑐𝑐ℎ𝑒!`,
            attachment: fs.createReadStream(tempPath)
        }).then(() => {
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }).catch((err) => {
            message.reply(`❌ | 𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑓𝑖𝑙𝑒 𝑡𝑜 𝑡ℎ𝑟𝑒𝑎𝑑: ${err.message}`);
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        });
    },

    handleReaction: async function({ message, event, handleReaction, usersData }) {
        const { file, author, type, uid, namee } = handleReaction;

        if (event.userID !== author) return;
        
        try {
            await message.unsendMessage(handleReaction.messageID);
        } catch (e) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑢𝑛𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", e);
        }

        const filePath = __dirname + '/' + file + '.js';
        const txtFilePath = filePath.replace('.js', '.txt');

        if (!fs.existsSync(filePath)) {
            return message.reply(`🔴 | 𝐹𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡 ${filePath}`);
        }

        fs.copyFileSync(filePath, txtFilePath);

        switch (type) {
            case "user":
                await message.reply({
                    body: `📩 | ${file}.𝑗𝑠 𝐹𝑎𝑖𝑙𝑡𝑖 𝑡𝑜𝑚𝑎𝑟 𝑘𝑎𝑐ℎ𝑒 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 ℎ𝑜𝑙𝑐𝑐ℎ𝑒!`,
                    attachment: fs.createReadStream(txtFilePath)
                }, uid).then(() => {
                    message.reply(`✅ | ${namee} 𝑒𝑟 𝑘𝑎𝑐ℎ𝑒 𝑓𝑎𝑖𝑙 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 ℎ𝑜𝑙𝑒𝑐𝑐ℎ𝑒!`);
                }).catch((err) => {
                    message.reply(`❌ | 𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑓𝑖𝑙𝑒 𝑡𝑜 ${namee}: ${err.message}`);
                }).finally(() => {
                    if (fs.existsSync(txtFilePath)) {
                        fs.unlinkSync(txtFilePath);
                    }
                });
                break;

            case "thread":
                await message.reply({
                    body: `📩 | ${file}.𝑗𝑠 𝐹𝑎𝑖𝑙𝑡𝑖 𝑒𝑖 𝑔𝑟𝑢𝑝𝑒 𝑝𝑎𝑡ℎ𝑎𝑛𝑜 ℎ𝑜𝑙𝑐𝑐ℎ𝑒!`,
                    attachment: fs.createReadStream(txtFilePath)
                }).then(() => {
                    if (fs.existsSync(txtFilePath)) {
                        fs.unlinkSync(txtFilePath);
                    }
                }).catch((err) => {
                    message.reply(`❌ | 𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑓𝑖𝑙𝑒 𝑡𝑜 𝑡ℎ𝑟𝑒𝑎𝑑: ${err.message}`);
                    if (fs.existsSync(txtFilePath)) {
                        fs.unlinkSync(txtFilePath);
                    }
                });
                break;
        }
    }
};
