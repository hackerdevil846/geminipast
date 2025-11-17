const axios = require("axios");

module.exports = {
    config: {
        name: "ckbot",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 4,
        role: 0,
        category: "info",
        shortDescription: {
            en: "𝐵𝑜𝑡 𝑎𝑛𝑑 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
        },
        longDescription: {
            en: "𝑆ℎ𝑜𝑤𝑠 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑢𝑠𝑒𝑟𝑠, 𝑔𝑟𝑜𝑢𝑝𝑠, 𝑎𝑛𝑑 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛"
        },
        guide: {
            en: "{p}ckbot [user|box|admin]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // Helper function to apply stylish font
            const applyStyle = (text) => {
                return text
                    .split('')
                    .map(char => {
                        if (char >= 'A' && char <= 'Z') return String.fromCodePoint(char.charCodeAt(0) + 119937);
                        if (char >= 'a' && char <= 'z') return String.fromCodePoint(char.charCodeAt(0) + 119931);
                        if (char >= '0' && char <= '9') return String.fromCodePoint(char.charCodeAt(0) + 120764);
                        return char;
                    })
                    .join('');
            };

            if (args.length === 0) {
                return message.reply(
                    `${applyStyle('𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑜𝑝𝑡𝑖𝑜𝑛𝑠:')}\n\n` +
                    `${global.config.PREFIX}${this.config.name} ${applyStyle('user')} - 𝑌𝑜𝑢𝑟 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛\n` +
                    `${global.config.PREFIX}${this.config.name} ${applyStyle('user')} @[𝑡𝑎𝑔] - 𝑇𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛\n` +
                    `${global.config.PREFIX}${this.config.name} ${applyStyle('box')} - 𝐺𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛\n` +
                    `${global.config.PREFIX}${this.config.name} ${applyStyle('admin')} - 𝐵𝑜𝑡 𝑎𝑑𝑚𝑖𝑛 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛`
                );
            }

            if (args[0] === "box") {
                const threadID = args[1] || event.threadID;
                
                try {
                    const threadInfo = await api.getThreadInfo(threadID);
                    let maleCount = 0;
                    let femaleCount = 0;

                    for (const user of Object.values(threadInfo.userInfo)) {
                        if (user.gender === "MALE") maleCount++;
                        else if (user.gender === "FEMALE") femaleCount++;
                    }

                    const approvalStatus = threadInfo.approvalMode ? "𝑂𝑛" : "𝑂𝑓𝑓";
                    const emoji = threadInfo.emoji || "𝑁𝑜𝑛𝑒";

                    let infoText = `${applyStyle('𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒')}: ${threadInfo.threadName}\n` +
                                  `${applyStyle('𝑇𝐼𝐷')}: ${threadID}\n` +
                                  `${applyStyle('𝐴𝑝𝑝𝑟𝑜𝑣𝑎𝑙 𝑚𝑜𝑑𝑒')}: ${approvalStatus}\n` +
                                  `${applyStyle('𝐸𝑚𝑜𝑗𝑖')}: ${emoji}\n` +
                                  `${applyStyle('𝑀𝑒𝑚𝑏𝑒𝑟𝑠')}: ${threadInfo.participantIDs.length} 𝑚𝑒𝑚𝑏𝑒𝑟𝑠, ${threadInfo.adminIDs.length} 𝑎𝑑𝑚𝑖𝑛𝑠\n` +
                                  `${applyStyle('𝐺𝑒𝑛𝑑𝑒𝑟 𝑑𝑖𝑠𝑡𝑟𝑖𝑏𝑢𝑡𝑖𝑜𝑛')}: ${maleCount} 𝑚𝑎𝑙𝑒, ${femaleCount} 𝑓𝑒𝑚𝑎𝑙𝑒\n` +
                                  `${applyStyle('𝑇𝑜𝑡𝑎𝑙 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠')}: ${threadInfo.messageCount || 0}`;

                    if (threadInfo.imageSrc) {
                        const imageStream = await global.utils.getStreamFromURL(threadInfo.imageSrc);
                        await message.reply({
                            body: infoText,
                            attachment: imageStream
                        });
                    } else {
                        await message.reply(infoText);
                    }
                } catch (error) {
                    console.error("Box info error:", error);
                    // Don't send error message
                }
            }
            else if (args[0] === "admin") {
                try {
                    const profileImageURL = 'https://graph.facebook.com/61571630409265/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';
                    const imageStream = await global.utils.getStreamFromURL(profileImageURL);

                    await message.reply({
                        body: `${applyStyle('——— 𝐴𝐷𝑀𝐼𝑁 𝐵𝑂𝑇 ———')}\n` +
                              `${applyStyle('❯ 𝑁𝑎𝑚𝑒')}: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 🖤\n` +
                              `${applyStyle('❯ 𝑇ℎ𝑎𝑛𝑘𝑠 𝑓𝑜𝑟 𝑢𝑠𝑖𝑛𝑔')} ${global.config.BOTNAME} ${applyStyle('𝑏𝑜𝑡')}`,
                        attachment: imageStream
                    });
                } catch (error) {
                    console.error("Admin info error:", error);
                    await message.reply(`${applyStyle('——— 𝐴𝐷𝑀𝐼𝑁 𝐵𝑂𝑇 ———')}\n` +
                                      `${applyStyle('❯ 𝑁𝑎𝑚𝑒')}: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 🖤\n` +
                                      `${applyStyle('❯ 𝑇ℎ𝑎𝑛𝑘𝑠 𝑓𝑜𝑟 𝑢𝑠𝑖𝑛𝑔')} ${global.config.BOTNAME} ${applyStyle('𝑏𝑜𝑡')}`);
                }
            }
            else if (args[0] === "user") {
                let userID;
                
                if (!args[1]) {
                    userID = event.senderID;
                } else if (Object.keys(event.mentions).length > 0) {
                    userID = Object.keys(event.mentions)[0];
                } else {
                    userID = args[1];
                }

                try {
                    const userInfo = await api.getUserInfo(userID);
                    const userData = userInfo[userID];
                    
                    if (!userData) {
                        return;
                    }

                    const isFriend = userData.isFriend ? "𝑌𝑒𝑠" : "𝑁𝑜";
                    const username = userData.vanity || "𝑁𝑜𝑛𝑒";
                    const gender = userData.gender === 2 ? "𝑀𝑎𝑙𝑒" : userData.gender === 1 ? "𝐹𝑒𝑚𝑎𝑙𝑒" : "𝑂𝑡ℎ𝑒𝑟";

                    const userText = `${applyStyle('𝑁𝑎𝑚𝑒')}: ${userData.name}\n` +
                                    `${applyStyle('𝑃𝑟𝑜𝑓𝑖𝑙𝑒 𝑈𝑅𝐿')}: ${userData.profileUrl}\n` +
                                    `${applyStyle('𝑈𝑠𝑒𝑟𝑛𝑎𝑚𝑒')}: ${username}\n` +
                                    `${applyStyle('𝑈𝐼𝐷')}: ${userID}\n` +
                                    `${applyStyle('𝐺𝑒𝑛𝑑𝑒𝑟')}: ${gender}\n` +
                                    `${applyStyle('𝐹𝑟𝑖𝑒𝑛𝑑')}? ${isFriend}`;

                    const profileImageURL = `https://graph.facebook.com/${userID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                    const imageStream = await global.utils.getStreamFromURL(profileImageURL);

                    await message.reply({
                        body: userText,
                        attachment: imageStream
                    });
                } catch (error) {
                    console.error("User info error:", error);
                    // Don't send error message
                }
            }
            else {
                await message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛. 𝑈𝑠𝑒: user, box, 𝑜𝑟 admin");
            }

        } catch (error) {
            console.error("Ckbot command error:", error);
            // Don't send error message to avoid spam
        }
    }
};
