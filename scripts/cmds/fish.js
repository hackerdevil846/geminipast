module.exports = {
    config: {
        name: "fish",
        aliases: ["fishing", "machdhora"],
        version: "1.0.0",
        author: "𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱",
        countDown: 5,
        role: 0,
        category: "𝐄𝐂𝐎𝐍𝐎𝐌𝐘",
        shortDescription: {
            en: "🎣 𝐅𝐈𝐒𝐇 𝐀𝐍𝐃 𝐄𝐀𝐑𝐍 𝐌𝐎𝐍𝐄𝐘"
        },
        longDescription: {
            en: "🎣 𝐂𝐀𝐓𝐂𝐇 𝐅𝐈𝐒𝐇 𝐀𝐍𝐃 𝐒𝐄𝐋𝐋 𝐓𝐇𝐄𝐌 𝐓𝐎 𝐄𝐀𝐑𝐍 𝐌𝐎𝐍𝐄𝐘"
        },
        guide: {
            en: "{p}𝐟𝐢𝐬𝐡"
        },
        envConfig: {
            cooldownTime: 1000000
        }
    },

    onStart: async function({ event, message, usersData }) {
        try {
            const { senderID } = event;
            const cooldown = this.config.envConfig.cooldownTime;
            let userData = await usersData.get(senderID);
            
            let data = userData.data || {};

            if (typeof data !== "undefined" && data.fishTime && cooldown - (Date.now() - data.fishTime) > 0) {
                const time = cooldown - (Date.now() - data.fishTime);
                const minutes = Math.floor(time / 60000);
                const seconds = Math.floor((time % 60000) / 1000);
                
                return message.reply(`⏰ | 𝐘𝐎𝐔 𝐀𝐋𝐑𝐄𝐀𝐃𝐘 𝐅𝐈𝐒𝐇𝐄𝐃 𝐓𝐎𝐃𝐀𝐘!\n🔁 | 𝐖𝐀𝐈𝐓 ${minutes} 𝐌𝐈𝐍𝐔𝐓𝐄𝐒 ${seconds} 𝐒𝐄𝐂𝐎𝐍𝐃𝐒 𝐓𝐎 𝐅𝐈𝐒𝐇 𝐀𝐆𝐀𝐈𝐍`);
            }

            const amount = Math.floor(Math.random() * 1000000);
            const rareFishes = ["🐋 𝐖𝐇𝐀𝐋𝐄", "🦈 𝐒𝐇𝐀𝐑𝐊", "🐠 𝐂𝐎𝐑𝐀𝐋 𝐅𝐈𝐒𝐇", "🦑 𝐎𝐂𝐓𝐎𝐏𝐔𝐒", "🐡 𝐁𝐋𝐎𝐖𝐅𝐈𝐒𝐇"];
            const rareFish = rareFishes[Math.floor(Math.random() * rareFishes.length)];

            await usersData.set(senderID, {
                money: userData.money + amount,
                data: {
                    ...userData.data,
                    fishTime: Date.now()
                }
            });

            return message.reply(`🎣 | 𝐘𝐎𝐔 𝐂𝐀𝐔𝐆𝐇𝐓 𝐀 𝐑𝐀𝐑𝐄 ${rareFish}!\n💰 | 𝐒𝐀𝐋𝐄 𝐏𝐑𝐈𝐂𝐄: $${amount}`);
            
        } catch (error) {
            console.error("𝐅𝐈𝐒𝐇𝐈𝐍𝐆 𝐄𝐑𝐑𝐎𝐑:", error);
            message.reply("❌ 𝐀𝐍 𝐄𝐑𝐑𝐎𝐑 𝐎𝐂𝐂𝐔𝐑𝐑𝐄𝐃 𝐖𝐇𝐈𝐋𝐄 𝐅𝐈𝐒𝐇𝐈𝐍𝐆");
        }
    }
};
