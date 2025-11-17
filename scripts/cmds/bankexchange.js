const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "bankexchange",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "economy",
        shortDescription: {
            en: "𝖡𝖺𝗇𝗄 𝖾𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝗌𝗒𝗌𝗍𝖾𝗆"
        },
        longDescription: {
            en: "𝖤𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 𝗆𝗈𝗇𝖾𝗒 𝖺𝗇𝖽 𝖾𝗑𝗉 𝗉𝗈𝗂𝗇𝗍𝗌"
        },
        guide: {
            en: "{p}bankexchange [𝖼𝗁𝖾𝖼𝗄]"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: function () {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌 𝗂𝗇 𝖻𝖺𝗇𝗄𝖾𝗑𝖼𝗁𝖺𝗇𝗀𝖾");
                return;
            }

            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const billFile = path.join(cacheDir, "bill.json");
            if (!fs.existsSync(billFile)) {
                fs.writeFileSync(billFile, JSON.stringify([]));
            }
        } catch (error) {
            console.error("💥 𝖡𝖺𝗇𝗄𝖾𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝗈𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function ({ event, message, args, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const billFile = path.join(__dirname, "cache", "bill.json");
            
            // Ensure bill file exists
            try {
                if (!fs.existsSync(billFile)) {
                    fs.writeFileSync(billFile, JSON.stringify([]));
                }
            } catch (fileError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖻𝗂𝗅𝗅 𝖿𝗂𝗅𝖾:", fileError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾 𝖻𝖺𝗇𝗄 𝗌𝗒𝗌𝗍𝖾𝗆.");
            }

            let getData = [];
            try {
                getData = JSON.parse(fs.readFileSync(billFile, "utf8"));
            } catch (parseError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝖺𝗋𝗌𝖾 𝖻𝗂𝗅𝗅 𝖿𝗂𝗅𝖾:", parseError);
                getData = [];
            }

            if (!args[0]) {
                const menuMessage = `🏦 𝖡𝖠𝖭𝖪 𝖤𝖷𝖢𝖧𝖠𝖭𝖦𝖤 𝖲𝖸𝖲𝖳𝖤𝖬
━━━━━━━━━━━━━━
𝟭. 𝖤𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝗆𝗈𝗇𝖾𝗒 𝗍𝗈 𝖾𝗑𝗉 💰→⭐
𝟮. 𝖤𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝖾𝗑𝗉 𝗍𝗈 𝗆𝗈𝗇𝖾𝗒 ⭐→💰
𝟯. 𝖴𝗉𝖽𝖺𝗍𝖾 𝗌𝗈𝗈𝗇 ⚒

𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝗇𝗎𝗆𝖻𝖾𝗋 𝗍𝗈 𝖼𝗁𝗈𝗈𝗌𝖾`;

                const msg = await message.reply(menuMessage);
                
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: msg.messageID,
                    author: event.senderID,
                    type: "banking"
                });
                return;
            }

            if (args[0] === "check") {
                if (getData.length === 0) {
                    return message.reply("📭 𝖭𝗈 𝗍𝗋𝖺𝗇𝗌𝖺𝖼𝗍𝗂𝗈𝗇 𝗁𝗂𝗌𝗍𝗈𝗋𝗒 𝖿𝗈𝗎𝗇𝖽");
                }
                
                let workList = "📋 𝖳𝖱𝖠𝖭𝖲𝖠𝖢𝖳𝖨𝖮𝖭 𝖧𝖨𝖲𝖳𝖮𝖱𝖸\n━━━━━━━━━━━━━━\n";
                getData.forEach((item, index) => {
                    workList += `\n${index + 1}. ${item}`;
                });
                return message.reply(workList);
            }
        } catch (error) {
            console.error("💥 𝖡𝖺𝗇𝗄𝖾𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝗈𝗇𝖲𝗍𝖺𝗋𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    onReply: async function ({ event, message, Reply, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            if (Reply.author !== event.senderID) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝖾𝗍 𝗍𝗁𝖾 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝗎𝗌𝖾𝗋 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾.");
            }

            const billFile = path.join(__dirname, "cache", "bill.json");
            
            // Ensure bill file exists
            try {
                if (!fs.existsSync(billFile)) {
                    fs.writeFileSync(billFile, JSON.stringify([]));
                }
            } catch (fileError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖻𝗂𝗅𝗅 𝖿𝗂𝗅𝖾:", fileError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝖻𝖺𝗇𝗄 𝗌𝗒𝗌𝗍𝖾𝗆.");
            }

            let getData = [];
            try {
                getData = JSON.parse(fs.readFileSync(billFile, "utf8"));
            } catch (parseError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝖺𝗋𝗌𝖾 𝖻𝗂𝗅𝗅 𝖿𝗂𝗅𝖾:", parseError);
                getData = [];
            }

            // Get user data with error handling
            let userData;
            try {
                userData = await usersData.get(Reply.author);
            } catch (userError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", userError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺.");
            }

            const exp = userData.exp || 0;
            const money = userData.money || 0;
            const d = new Date();
            const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            const time = `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;

            switch (Reply.type) {
                case "banking": {
                    switch (event.body) {
                        case "1": {
                            const msg = await message.reply(
                                "💵 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝖺𝗆𝗈𝗎𝗇𝗍 𝗈𝖿 𝗆𝗈𝗇𝖾𝗒 𝗍𝗈 𝖾𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝗍𝗈 𝖾𝗑𝗉\n𝖱𝖺𝗍𝖾: 10$ = 1⭐ 𝖾𝗑𝗉"
                            );
                            
                            global.client.handleReply.push({
                                name: this.config.name,
                                messageID: msg.messageID,
                                author: event.senderID,
                                type: "money"
                            });
                            break;
                        }
                        case "2": {
                            const msg = await message.reply(
                                "⭐ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝖺𝗆𝗈𝗎𝗇𝗍 𝗈𝖿 𝖾𝗑𝗉 𝗍𝗈 𝖾𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝗍𝗈 𝗆𝗈𝗇𝖾𝗒\n𝖱𝖺𝗍𝖾: 5⭐ 𝖾𝗑𝗉 = 1$"
                            );
                            
                            global.client.handleReply.push({
                                name: this.config.name,
                                messageID: msg.messageID,
                                author: event.senderID,
                                type: "exp"
                            });
                            break;
                        }
                        default:
                            return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗁𝗈𝗂𝖼𝖾");
                    }
                    break;
                }

                case "exp": {
                    const content = parseInt(event.body);
                    if (isNaN(content) || content <= 0) {
                        return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗉𝗈𝗌𝗂𝗍𝗂𝗏𝖾 𝗇𝗎𝗆𝖻𝖾𝗋");
                    }
                    if (content > exp) {
                        return message.reply(`❌ 𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝖾𝗇𝗈𝗎𝗀𝗁 𝖾𝗑𝗉 𝗉𝗈𝗂𝗇𝗍𝗌. 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾: ${exp}⭐`);
                    }

                    const moneyGain = Math.floor(content / 5);
                    if (moneyGain <= 0) {
                        return message.reply("❌ 𝖤𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝖺𝗆𝗈𝗎𝗇𝗍 𝗍𝗈𝗈 𝗌𝗆𝖺𝗅𝗅. 𝖬𝗂𝗇𝗂𝗆𝗎𝗆: 5⭐ 𝖿𝗈𝗋 1$");
                    }

                    try {
                        await usersData.set(Reply.author, {
                            money: money + moneyGain,
                            exp: exp - content
                        });

                        const msg = `✅ 𝖤𝖷𝖢𝖧𝖠𝖭𝖦𝖤 𝖲𝖴𝖢𝖢𝖤𝖲𝖲𝖥𝖴𝖫!\n⏰ 𝖳𝗂𝗆𝖾: ${time} - ${date}\n📊 𝖣𝖾𝗍𝖺𝗂𝗅𝗌: ${content}⭐ → ${moneyGain}$`;
                        
                        await message.reply(msg);
                        getData.push(msg);
                        
                        // Save transaction with error handling
                        try {
                            fs.writeFileSync(billFile, JSON.stringify(getData));
                            await message.reply("✅ 𝖳𝗋𝖺𝗇𝗌𝖺𝖼𝗍𝗂𝗈𝗇 𝗌𝖺𝗏𝖾𝖽 𝗍𝗈 𝗁𝗂𝗌𝗍𝗈𝗋𝗒");
                        } catch (saveError) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗍𝗋𝖺𝗇𝗌𝖺𝖼𝗍𝗂𝗈𝗇:", saveError);
                            await message.reply("✅ 𝖤𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅 𝖻𝗎𝗍 𝖿𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗁𝗂𝗌𝗍𝗈𝗋𝗒");
                        }
                    } catch (updateError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗉𝖽𝖺𝗍𝖾 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", updateError);
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗉𝖽𝖺𝗍𝖾 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                    }
                    break;
                }

                case "money": {
                    const content = parseInt(event.body);
                    if (isNaN(content) || content <= 0) {
                        return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗉𝗈𝗌𝗂𝗍𝗂𝗏𝖾 𝗇𝗎𝗆𝖻𝖾𝗋");
                    }
                    if (content > money) {
                        return message.reply(`❌ 𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝖾𝗇𝗈𝗎𝗀𝗁 𝗆𝗈𝗇𝖾𝗒. 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾: ${money}$`);
                    }

                    const expGain = Math.floor(content / 10);
                    if (expGain <= 0) {
                        return message.reply("❌ 𝖤𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝖺𝗆𝗈𝗎𝗇𝗍 𝗍𝗈𝗈 𝗌𝗆𝖺𝗅𝗅. 𝖬𝗂𝗇𝗂𝗆𝗎𝗆: 10$ 𝖿𝗈𝗋 1⭐");
                    }

                    try {
                        await usersData.set(Reply.author, {
                            money: money - content,
                            exp: exp + expGain
                        });

                        const msg = `✅ 𝖤𝖷𝖢𝖧𝖠𝖭𝖦𝖤 𝖲𝖴𝖢𝖢𝖤𝖲𝖲𝖥𝖴𝖫!\n⏰ 𝖳𝗂𝗆𝖾: ${time} - ${date}\n📊 𝖣𝖾𝗍𝖺𝗂𝗅𝗌: ${content}$ → ${expGain}⭐`;
                        
                        await message.reply(msg);
                        getData.push(msg);
                        
                        // Save transaction with error handling
                        try {
                            fs.writeFileSync(billFile, JSON.stringify(getData));
                            await message.reply("✅ 𝖳𝗋𝖺𝗇𝗌𝖺𝖼𝗍𝗂𝗈𝗇 𝗌𝖺𝗏𝖾𝖽 𝗍𝗈 𝗁𝗂𝗌𝗍𝗈𝗋𝗒");
                        } catch (saveError) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗍𝗋𝖺𝗇𝗌𝖺𝖼𝗍𝗂𝗈𝗇:", saveError);
                            await message.reply("✅ 𝖤𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅 𝖻𝗎𝗍 𝖿𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗁𝗂𝗌𝗍𝗈𝗋𝗒");
                        }
                    } catch (updateError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗉𝖽𝖺𝗍𝖾 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", updateError);
                        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗉𝖽𝖺𝗍𝖾 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                    }
                    break;
                }
            }
        } catch (error) {
            console.error("💥 𝖡𝖺𝗇𝗄𝖾𝗑𝖼𝗁𝖺𝗇𝗀𝖾 𝗈𝗇𝖱𝖾𝗉𝗅𝗒 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
