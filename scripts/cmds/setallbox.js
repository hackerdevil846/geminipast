const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "setallbox",
        aliases: [],
        version: "1.1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑔𝑟𝑜𝑢𝑝 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠"
        },
        longDescription: {
            en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑙𝑖𝑘𝑒 𝑒𝑚𝑜𝑗𝑖, 𝑛𝑎𝑚𝑒, 𝑎𝑣𝑎𝑡𝑎𝑟, 𝑐𝑜𝑙𝑜𝑟, 𝑒𝑡𝑐."
        },
        guide: {
            en: "{p}setallbox [𝑒𝑚𝑜𝑗𝑖/𝐵𝑛𝑎𝑚𝑒/𝑟𝑐𝑜𝑙𝑜𝑟/𝑛𝑎𝑚𝑒/𝑎𝑣𝑡/𝑝𝑜𝑙𝑙] [𝑎𝑟𝑔𝑠]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args, api, threadsData }) {
        try {
            // Dependency check with better validation
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            // Validate event and thread
            if (!event || !event.threadID) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑒𝑣𝑒𝑛𝑡 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
            }

            const { threadID } = event;

            if (!args[0]) {
                const helpMessage = `🎭 𝑆𝑒𝑡𝑎𝑙𝑙𝑏𝑜𝑥 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠 🎭

🔹 ${global.config.PREFIX}setallbox 𝑒𝑚𝑜𝑗𝑖 [𝑒𝑚𝑜𝑗𝑖] - 𝐶ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑒𝑚𝑜𝑗𝑖
🔹 ${global.config.PREFIX}setallbox 𝐵𝑛𝑎𝑚𝑒 [𝑛𝑎𝑚𝑒] - 𝐶ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒
🔹 ${global.config.PREFIX}setallbox 𝑟𝑐𝑜𝑙𝑜𝑟 - 𝑅𝑎𝑛𝑑𝑜𝑚 𝑔𝑟𝑜𝑢𝑝 𝑐𝑜𝑙𝑜𝑟
🔹 ${global.config.PREFIX}setallbox 𝑛𝑎𝑚𝑒 [𝑛𝑎𝑚𝑒] - 𝐶ℎ𝑎𝑛𝑔𝑒 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒
🔹 ${global.config.PREFIX}setallbox 𝑎𝑣𝑡 - 𝐶ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟 (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒)
🔹 ${global.config.PREFIX}setallbox 𝑝𝑜𝑙𝑙 <𝑡𝑖𝑡𝑙𝑒> => <𝑜𝑝𝑡1> | <𝑜𝑝𝑡2> - 𝐶𝑟𝑒𝑎𝑡𝑒 𝑝𝑜𝑙𝑙

💡 𝑁𝑜𝑡𝑒: 𝑆𝑜𝑚𝑒 𝑓𝑒𝑎𝑡𝑢𝑟𝑒𝑠 𝑚𝑎𝑦 𝑟𝑒𝑞𝑢𝑖𝑟𝑒 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠`;
                return message.reply(helpMessage);
            }

            const command = args[0].toLowerCase();

            switch (command) {
                case "emoji": {
                    try {
                        let emojiToSet;
                        if (!args[1]) {
                            const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🥰", "😍", "🤩", "😎", "🥳"];
                            emojiToSet = emojis[Math.floor(Math.random() * emojis.length)];
                        } else {
                            emojiToSet = args[1];
                        }

                        // Validate emoji
                        if (emojiToSet.length > 10) {
                            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑒𝑚𝑜𝑗𝑖. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑒𝑚𝑜𝑗𝑖.");
                        }

                        await api.changeThreadEmoji(emojiToSet, threadID);
                        return message.reply(`✅ 𝐸𝑚𝑜𝑗𝑖 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜: ${emojiToSet}`);
                    } catch (error) {
                        console.error("𝐸𝑚𝑜𝑗𝑖 𝑒𝑟𝑟𝑜𝑟:", error);
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑒𝑚𝑜𝑗𝑖. 𝑀𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝐼 ℎ𝑎𝑣𝑒 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛.");
                    }
                }

                case "bname": {
                    try {
                        const newName = args.slice(1).join(" ").trim();
                        if (!newName) {
                            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 𝑛𝑒𝑤 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒");
                        }

                        if (newName.length > 200) {
                            return message.reply("❌ 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔. 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 200 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠.");
                        }

                        await api.setTitle(newName, threadID);
                        return message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜: ${newName}`);
                    } catch (error) {
                        console.error("𝑁𝑎𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒. 𝑀𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝐼 ℎ𝑎𝑣𝑒 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛.");
                    }
                }

                case "rcolor": {
                    try {
                        const colors = [
                            '196241301102133', '169463077092846', '2442142322678320',
                            '234137870477637', '980963458735625', '175615189761153',
                            '2136751179887052', '2058653964378557', '2129984390566328',
                            '174636906462322', '1928399724138152', '417639218648241'
                        ];
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        await api.changeThreadColor(randomColor, threadID);
                        return message.reply("✅ 𝐺𝑟𝑜𝑢𝑝 𝑐𝑜𝑙𝑜𝑟 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 🎨");
                    } catch (error) {
                        console.error("𝐶𝑜𝑙𝑜𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑐𝑜𝑙𝑜𝑟. 𝑀𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝐼 ℎ𝑎𝑣𝑒 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛.");
                    }
                }

                case "name": {
                    try {
                        const name = args.slice(1).join(" ").trim();
                        if (!name) {
                            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 𝑛𝑒𝑤 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒");
                        }

                        if (name.length > 50) {
                            return message.reply("❌ 𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔. 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 50 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠.");
                        }

                        // For Mirai/tBot, use threadsData to change nickname
                        if (threadsData && typeof threadsData.get === 'function') {
                            const threadData = await threadsData.get(threadID);
                            if (threadData) {
                                threadData.nicknames = threadData.nicknames || {};
                                threadData.nicknames[event.senderID] = name;
                                await threadsData.set(threadID, threadData);
                                return message.reply(`✅ 𝑌𝑜𝑢𝑟 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜: ${name}`);
                            }
                        }
                        
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒. 𝑇ℎ𝑟𝑒𝑎𝑑 𝑑𝑎𝑡𝑎 𝑠𝑦𝑠𝑡𝑒𝑚 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒.");
                    } catch (error) {
                        console.error("𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒.");
                    }
                }

                case "avt": {
                    try {
                        if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
                            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒");
                        }

                        const attachment = event.messageReply.attachments[0];
                        if (!attachment.type || !attachment.type.includes("image")) {
                            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑓𝑖𝑙𝑒");
                        }

                        const imgURL = attachment.url;
                        if (!imgURL || !imgURL.startsWith('http')) {
                            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿");
                        }

                        // Create cache directory
                        const cacheDir = path.join(__dirname, 'cache');
                        if (!fs.existsSync(cacheDir)) {
                            fs.mkdirSync(cacheDir, { recursive: true });
                        }
                        
                        const imagePath = path.join(cacheDir, `avt_${threadID}_${Date.now()}.jpg`);
                        
                        // Download image with timeout
                        const response = await axios.get(imgURL, {
                            responseType: 'arraybuffer',
                            timeout: 30000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });
                        
                        if (!response.data || response.data.length === 0) {
                            throw new Error("𝐸𝑚𝑝𝑡𝑦 𝑖𝑚𝑎𝑔𝑒 𝑑𝑎𝑡𝑎");
                        }

                        await fs.writeFile(imagePath, Buffer.from(response.data));
                        
                        // Verify file was written
                        const stats = await fs.stat(imagePath);
                        if (stats.size === 0) {
                            throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑖𝑚𝑎𝑔𝑒");
                        }

                        // Change group image
                        await api.changeGroupImage(fs.createReadStream(imagePath), threadID);
                        
                        // Clean up
                        await fs.unlink(imagePath);
                        
                        return message.reply("✅ 𝐺𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 📸");
                    } catch (error) {
                        console.error("𝐴𝑣𝑎𝑡𝑎𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
                        
                        // Clean up any temporary files
                        try {
                            const cacheDir = path.join(__dirname, 'cache');
                            const files = await fs.readdir(cacheDir);
                            for (const file of files) {
                                if (file.startsWith(`avt_${threadID}_`)) {
                                    await fs.unlink(path.join(cacheDir, file));
                                }
                            }
                        } catch (cleanupError) {}
                        
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑣𝑎𝑡𝑎𝑟. 𝑀𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝐼 ℎ𝑎𝑣𝑒 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛.");
                    }
                }

                case "poll": {
                    try {
                        const content = args.slice(1).join(" ").trim();
                        const separatorIndex = content.indexOf(" => ");
                        
                        if (separatorIndex === -1) {
                            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡! 𝑈𝑠𝑒: 𝑝𝑜𝑙𝑙 <𝑡𝑖𝑡𝑙𝑒> => <𝑜𝑝𝑡𝑖𝑜𝑛1> | <𝑜𝑝𝑡𝑖𝑜𝑛2>");
                        }
                        
                        const title = content.substring(0, separatorIndex).trim();
                        const options = content.substring(separatorIndex + 4).split("|").map(opt => opt.trim()).filter(opt => opt.length > 0);
                        
                        if (!title || title.length === 0) {
                            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑝𝑜𝑙𝑙 𝑡𝑖𝑡𝑙𝑒");
                        }
                        
                        if (options.length < 2) {
                            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑜𝑙𝑙 𝑓𝑜𝑟𝑚𝑎𝑡! 𝑀𝑖𝑛𝑖𝑚𝑢𝑚 2 𝑜𝑝𝑡𝑖𝑜𝑛𝑠 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑");
                        }

                        if (options.length > 10) {
                            return message.reply("❌ 𝑇𝑜𝑜 𝑚𝑎𝑛𝑦 𝑜𝑝𝑡𝑖𝑜𝑛𝑠! 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 10 𝑜𝑝𝑡𝑖𝑜𝑛𝑠 𝑎𝑙𝑙𝑜𝑤𝑒𝑑");
                        }
                        
                        // Create poll using Facebook API
                        await api.createPoll(title, threadID, options);
                        return message.reply(`✅ 𝑃𝑜𝑙𝑙 𝑐𝑟𝑒𝑎𝑡𝑒𝑑: "${title}"`);
                    } catch (error) {
                        console.error("𝑃𝑜𝑙𝑙 𝑒𝑟𝑟𝑜𝑟:", error);
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑜𝑙𝑙. 𝑀𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝐼 ℎ𝑎𝑣𝑒 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛.");
                    }
                }

                default: {
                    return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛. 𝑈𝑠𝑒 '${global.config.PREFIX}setallbox' 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑎𝑟𝑔𝑢𝑚𝑒𝑛𝑡𝑠 𝑓𝑜𝑟 ℎ𝑒𝑙𝑝.`);
                }
            }

        } catch (error) {
            console.error("💥 𝑆𝑒𝑡𝑎𝑙𝑙𝑏𝑜𝑥 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
