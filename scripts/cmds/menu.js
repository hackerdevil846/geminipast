const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "menu2", // Changed from "menu" to avoid conflict
        aliases: [], // Unique aliases
        version: "1.2.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝑉𝑖𝑒𝑤 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑙𝑖𝑠𝑡 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑎 𝑚𝑜𝑑𝑒𝑟𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑙𝑖𝑠𝑡 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒𝑠 𝑎𝑛𝑑 𝑏𝑜𝑡 𝑖𝑛𝑓𝑜"
        },
        guide: {
            en: "{p}𝑚𝑒𝑛𝑢 [𝑐𝑜𝑚𝑚𝑎𝑛𝑑/𝑎𝑙𝑙]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "moment-timezone": "",
            "string-similarity": "",
            "systeminformation": ""
        }
    },

    onStart: async function ({ message, event, args, global }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("moment-timezone");
                require("string-similarity");
                require("systeminformation");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑝𝑎𝑡ℎ, 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒, 𝑠𝑡𝑟𝑖𝑛𝑔-𝑠𝑖𝑚𝑖𝑙𝑎𝑟𝑖𝑡𝑦, 𝑎𝑛𝑑 𝑠𝑦𝑠𝑡𝑒𝑚𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛.");
            }

            const { events, commands } = global.client;
            const { threadID, senderID } = event;
            const config = global.config;
            const time = process.uptime();
            const hours = Math.floor(time / (60 * 60));
            const minutes = Math.floor((time % (60 * 60)) / 60);
            const seconds = Math.floor(time % 60);
            const timeStart = Date.now();
            
            // System information
            let cpuInfo = { manufacturer: "𝑈𝑛𝑘𝑛𝑜𝑤𝑛", brand: "𝑈𝑛𝑘𝑛𝑜𝑤𝑛", speed: "0", physicalCores: 0, cores: 0 };
            let osInfo = { platform: "𝑈𝑛𝑘𝑛𝑜𝑤𝑛" };
            let pidusage = { cpu: 0, memory: 0 };
            
            try {
                const systemInfo = require("systeminformation");
                cpuInfo = await systemInfo.cpu();
                osInfo = await systemInfo.osInfo();
                pidusage = await global.utils.getPidUsage(process.pid);
            } catch (e) {
                console.error("𝑆𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜 𝑒𝑟𝑟𝑜𝑟:", e);
            }
            
            const moment = require("moment-timezone");
            const xuly = Math.floor((Date.now() - global.client.timeStart) / 4444);
            const trinhtrang = xuly < 10 ? "𝑆𝑚𝑜𝑜𝑡ℎ 𝑉𝐼𝑃" : xuly > 10 && xuly < 100 ? "𝑉𝑒𝑟𝑦 𝑆𝑚𝑜𝑜𝑡ℎ" : "𝑆𝑚𝑜𝑜𝑡ℎ";
            
            let thu = moment.tz('Asia/Dhaka').format('dddd');
            const daysMap = {
                'Sunday': '𝑆𝑢𝑛𝑑𝑎𝑦', 'Monday': '𝑀𝑜𝑛𝑑𝑎𝑦', 'Tuesday': '𝑇𝑢𝑒𝑠𝑑𝑎𝑦',
                'Wednesday': '𝑊𝑒𝑑𝑛𝑒𝑠𝑑𝑎𝑦', 'Thursday': '𝑇ℎ𝑢𝑟𝑠𝑑𝑎𝑦', 'Friday': '𝐹𝑟𝑖𝑑𝑎𝑦', 'Saturday': '𝑆𝑎𝑡𝑢𝑟𝑑𝑎𝑦'
            };
            thu = daysMap[thu] || thu;
            
            const timeNow = moment.tz("Asia/Dhaka").format("𝐻𝐻:𝑚𝑚:𝑠𝑠 - 𝐷𝐷/𝑀𝑀/𝑌𝑌𝑌𝑌");
            const admin = config.ADMINBOT || [];
            const NameBot = config.BOTNAME || "𝐵𝑜𝑡";
            const version = config.version || "1.0.0";
            const cmds = global.client.commands;
            
            // Get prefix
            let prefix = config.PREFIX || "!";
            try {
                const threadData = await global.threadsData.get(threadID);
                if (threadData && threadData.PREFIX) {
                    prefix = threadData.PREFIX;
                }
            } catch (e) {
                console.error("𝑇ℎ𝑟𝑒𝑎𝑑 𝑑𝑎𝑡𝑎 𝑒𝑟𝑟𝑜𝑟:", e);
            }

            // Random icons
            function getRandomIcons(count) {
                const allIcons = [
                    '🦄','🌸','🥑','💎','🚀','🔮','🌈','🐳','🍀','🍉','🎧','🎲','🧩','🌻','🍕','🧸','🥨','🎂','🎉','🦋','🌺','🍭','🍦','🌵','🐱‍👤',
                    '👑','🧠','🍓','🎮','⚡','🎨','🦖','🐼','🦊','🦚','🍔','🥕','🍣','🍩','🍿','🍫','🍤','🍩','🍪','🥟','🍦','🍟','🧁','🍰','🥜'
                ];
                const arr = [];
                for (let i = 0; i < count; i++) arr.push(allIcons[Math.floor(Math.random() * allIcons.length)]);
                return arr;
            }

            // Download image
            async function downloadImage(url) {
                try {
                    const ext = path.extname(url.split("?")[0]).split(".").pop() || "jpg";
                    const cacheDir = path.join(__dirname, 'cache');
                    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
                    const filePath = path.join(cacheDir, `menu_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);
                    const response = await axios({ method: 'GET', url, responseType: 'arraybuffer', timeout: 15000 });
                    fs.writeFileSync(filePath, response.data);
                    return filePath;
                } catch (error) {
                    console.error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
                    return null;
                }
            }

            // Byte to MB converter
            function byte2mb(bytes) {
                const units = ['𝐵𝑦𝑡𝑒𝑠', '𝐾𝐵', '𝑀𝐵', '𝐺𝐵', '𝑇𝐵', '𝑃𝐵', '𝐸𝐵', '𝑍𝐵', '𝑌𝐵'];
                let l = 0, n = parseInt(bytes, 10) || 0;
                while (n >= 1024 && ++l) n = n / 1024;
                return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
            }

            let type = !args[0] ? "" : args[0].toLowerCase();
            let imgPath, attachment;

            // Download menu image
            try {
                imgPath = await downloadImage("https://i.imgur.com/wJQKoTa.jpeg");
                if (imgPath) {
                    attachment = fs.createReadStream(imgPath);
                }
            } catch (error) {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑:", error);
            }

            if (type == "all") {
                let msg = "";
                let i = 0;
                for (const cmd of cmds.values()) {
                    msg += `🌸 ${++i} | /${cmd.config.name}: ${cmd.config.shortDescription?.en || "𝑁𝑜 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛"}\n\n`;
                }
                await message.reply({ body: msg, attachment });
                if (imgPath) setTimeout(() => fs.existsSync(imgPath) && fs.unlinkSync(imgPath), 60000);
                return;
            }

            if (type) {
                const array = [];
                for (const cmd of cmds.values()) array.push(cmd.config.name.toString());
                
                if (!array.find(n => n == args[0].toLowerCase())) {
                    const stringSimilarity = require('string-similarity');
                    const commandName = args.shift().toLowerCase() || "";
                    const allCommandName = Array.from(cmds.keys());
                    const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
                    
                    let similarCmd = "";
                    if (checker.bestMatch.rating >= 0.5) {
                        similarCmd = checker.bestMatch.target;
                    }
                    
                    const msg = `⚡ 𝑁𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑜𝑢𝑛𝑑: ${type}\n📌 𝑆𝑖𝑚𝑖𝑙𝑎𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑: ${similarCmd || "𝑁𝑜𝑛𝑒"}`;
                    await message.reply({ body: msg, attachment });
                    if (imgPath) setTimeout(() => fs.existsSync(imgPath) && fs.unlinkSync(imgPath), 60000);
                    return;
                }
                
                const cmd = cmds.get(type).config;
                const msg = `✏️ 𝑁𝑎𝑚𝑒: ${cmd.name}\n🚫 𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛: ${TextPr(cmd.role || 0)}\n📝 𝐷𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛: ${cmd.shortDescription?.en || "𝑁𝑜 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛"}\n📍 𝑈𝑠𝑎𝑔𝑒: ${cmd.guide?.en || "𝑁𝑜 𝑢𝑠𝑎𝑔𝑒"}\n🌸 𝐶𝑎𝑡𝑒𝑔𝑜𝑟𝑦: ${cmd.category || "𝑈𝑛𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑧𝑒𝑑"}\n⏱️ 𝐶𝑜𝑜𝑙𝑑𝑜𝑤𝑛: ${cmd.countDown || 5}s`;
                await message.reply({ body: msg, attachment });
                if (imgPath) setTimeout(() => fs.existsSync(imgPath) && fs.unlinkSync(imgPath), 60000);
                return;
            }

            // Main menu display
            function CmdCategory() {
                const array = [];
                for (const cmd of cmds.values()) {
                    const { category, role, name: nameModule } = cmd.config;
                    const categoryName = category || "𝑈𝑛𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑧𝑒𝑑";
                    const perm = role !== undefined ? role : 0;
                    
                    if (!array.find(i => i.cmdCategory == categoryName)) {
                        array.push({
                            cmdCategory: categoryName,
                            permission: perm,
                            nameModule: [nameModule]
                        });
                    } else {
                        const find = array.find(i => i.cmdCategory == categoryName);
                        find.nameModule.push(nameModule);
                    }
                }
                return array;
            }

            const array = CmdCategory();
            array.sort(S("nameModule"));
            const icons = getRandomIcons(array.length);
            
            let msg = `[ 𝐵𝑂𝑇 𝑀𝐸𝑁𝑈 ]\n`;
            let idx = 0;
            let totalCommands = 0;
            
            for (const cmd of array) {
                msg += `${icons[idx++]} ${cmd.cmdCategory}: ${cmd.nameModule.length} 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠\n🔎 𝐼𝑛𝑐𝑙𝑢𝑑𝑒𝑠: ${cmd.nameModule.join(", ")}\n\n`;
                totalCommands += cmd.nameModule.length;
            }
            
            msg += `🔥 𝑇𝑜𝑡𝑎𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠: ${totalCommands} | 💧 𝑇𝑜𝑡𝑎𝑙 𝑒𝑣𝑒𝑛𝑡𝑠: ${events?.size || 0}\n${prefix}𝑚𝑒𝑛𝑢 𝑎𝑙𝑙 𝑡𝑜 𝑣𝑖𝑒𝑤 𝑎𝑙𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠\n${prefix}𝑚𝑒𝑛𝑢 + 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑣𝑖𝑒𝑤 𝑢𝑠𝑎𝑔𝑒\n📅 𝑇𝑜𝑑𝑎𝑦: ${thu}\n⏰ 𝑇𝑖𝑚𝑒: ${timeNow}\n𝑅𝑒𝑎𝑐𝑡 𝑤𝑖𝑡ℎ ❤️ 𝑡𝑜 𝑣𝑖𝑒𝑤 𝑏𝑜𝑡 𝑖𝑛𝑓𝑜`;

            const sentMessage = await message.reply({ body: msg, attachment });
            
            // Store reaction data
            global.client.handleReaction = global.client.handleReaction || [];
            global.client.handleReaction.push({
                name: this.config.name,
                messageID: sentMessage.messageID,
                author: senderID,
                meta: { NameBot, version, admin, trinhtrang, prefix, commands, events, timeNow, thu, ...cpuInfo, OSPlatform: osInfo.platform, pidusage, timeStart, hours, minutes, seconds }
            });

            if (imgPath) setTimeout(() => fs.existsSync(imgPath) && fs.unlinkSync(imgPath), 60000);

        } catch (error) {
            console.error("𝑀𝑒𝑛𝑢 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑑𝑖𝑠𝑝𝑙𝑎𝑦𝑖𝑛𝑔 𝑚𝑒𝑛𝑢! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
    },

    onReaction: async function ({ message, event, global }) {
        try {
            const { messageID, userID } = event;
            const handleReaction = global.client.handleReaction?.find(r => r.messageID === messageID);
            
            if (!handleReaction || userID !== handleReaction.author || event.reaction !== "❤") {
                return;
            }

            await message.unsend(messageID);
            
            const { NameBot, version, admin, trinhtrang, prefix, commands, events, timeNow, thu, manufacturer, brand, speed, physicalCores, cores, OSPlatform, pidusage, timeStart, hours, minutes, seconds } = handleReaction.meta || {};

            // Download image again for bot info
            let imgPath, attachment;
            try {
                imgPath = await downloadImage("https://i.imgur.com/wJQKoTa.jpeg");
                if (imgPath) {
                    attachment = fs.createReadStream(imgPath);
                }
            } catch (error) {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑:", error);
            }

            function byte2mb(bytes) {
                const units = ['𝐵𝑦𝑡𝑒𝑠', '𝐾𝐵', '𝑀𝐵', '𝐺𝐵', '𝑇𝐵', '𝑃𝐵', '𝐸𝐵', '𝑍𝐵', '𝑌𝐵'];
                let l = 0, n = parseInt(bytes, 10) || 0;
                while (n >= 1024 && ++l) n = n / 1024;
                return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
            }

            async function downloadImage(url) {
                try {
                    const ext = path.extname(url.split("?")[0]).split(".").pop() || "jpg";
                    const cacheDir = path.join(__dirname, 'cache');
                    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
                    const filePath = path.join(cacheDir, `menu_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);
                    const response = await axios({ method: 'GET', url, responseType: 'arraybuffer', timeout: 15000 });
                    fs.writeFileSync(filePath, response.data);
                    return filePath;
                } catch (error) {
                    console.error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
                    return null;
                }
            }

            const msg = `🤖 𝐵𝑜𝑡 𝑁𝑎𝑚𝑒: ${NameBot}\n📝 𝑉𝑒𝑟𝑠𝑖𝑜𝑛: ${version}\n👨‍💻 𝑇𝑜𝑡𝑎𝑙 𝑎𝑑𝑚𝑖𝑛𝑠: ${admin?.length || 0}\n💻 𝑂𝑝𝑒𝑟𝑎𝑡𝑜𝑟: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n🌐 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘: ℎ𝑡𝑡𝑝𝑠://𝑤𝑤𝑤.𝑓𝑎𝑐𝑒𝑏𝑜𝑜𝑘.𝑐𝑜𝑚\n\n⏳ 𝐵𝑜𝑡 𝑢𝑝𝑡𝑖𝑚𝑒: ${hours}ℎ ${minutes}𝑚 ${seconds}𝑠\n📌 𝑆𝑡𝑎𝑡𝑢𝑠: ${trinhtrang}\n✏️ 𝑃𝑟𝑒𝑓𝑖𝑥: ${prefix}\n🎒 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠: ${commands?.size || 0}\n📑 𝐸𝑣𝑒𝑛𝑡𝑠: ${events?.size || 0}\n🗂️ 𝑇𝑜𝑡𝑎𝑙: ${(commands?.size || 0) + (events?.size || 0)}\n🔰 𝐺𝑟𝑜𝑢𝑝𝑠: ${global.data.allThreadID?.length || 0}\n👥 𝑈𝑠𝑒𝑟𝑠: ${global.data.allUserID?.length || 0}\n\n🧬 𝐶𝑃𝑈: ${manufacturer} ${brand}\n⚙️ 𝑆𝑝𝑒𝑒𝑑: ${speed}𝐺𝐻𝑧\n⚔️ 𝐶𝑜𝑟𝑒𝑠: ${physicalCores}\n🏹 𝑇ℎ𝑟𝑒𝑎𝑑𝑠: ${cores}\n🛡️ 𝑂𝑆: ${OSPlatform}\n🧪 𝐶𝑃𝑈 𝑈𝑠𝑎𝑔𝑒: ${pidusage?.cpu?.toFixed(1) || 0}%\n🧫 𝑅𝐴𝑀: ${byte2mb(pidusage?.memory || 0)}\n🛠️ 𝐿𝑎𝑡𝑒𝑛𝑐𝑦: ${Date.now() - (timeStart || Date.now())}𝑚𝑠\n[ ${timeNow} - ${thu} ]`;

            await message.reply({ body: msg, attachment });
            
            if (imgPath) setTimeout(() => fs.existsSync(imgPath) && fs.unlinkSync(imgPath), 60000);

        } catch (error) {
            console.error("𝑅𝑒𝑎𝑐𝑡𝑖𝑜𝑛 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
        }
    }
};

function S(k) {
    return function (a, b) {
        let i = 0;
        if (a[k].length > b[k].length) i = 1;
        else if (a[k].length < b[k].length) i = -1;
        return i * -1;
    }
}

function TextPr(permission) {
    return permission == 0 ? "𝑀𝑒𝑚𝑏𝑒𝑟"
        : permission == 1 ? "𝑀𝑜𝑑𝑒𝑟𝑎𝑡𝑜𝑟"
        : permission == 2 ? "𝐴𝑑𝑚𝑖𝑛"
        : "𝑆𝑢𝑝𝑒𝑟 𝑈𝑠𝑒𝑟";
}
