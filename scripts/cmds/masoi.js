const GameManager = require('./masoi/GameManager');

// 𝐈𝐧𝐢𝐭𝐢𝐚𝐥𝐢𝐳𝐞 𝐠𝐚𝐦𝐞 𝐦𝐚𝐧𝐚𝐠𝐞𝐫 𝐨𝐧 𝐥𝐨𝐚𝐝
try {
    if (!global.gameManager) {
        const loader = () => {
            const exportData = {};
            exportData['masoi'] = require('./masoi/index');
            return exportData;
        };
        
        const gameManager = new GameManager(loader());
        global.gameManager = gameManager;
        console.log('✅ 𝐆𝐚𝐦𝐞𝐌𝐚𝐧𝐚𝐠𝐞𝐫 𝐢𝐧𝐢𝐭𝐢𝐚𝐥𝐢𝐳𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲');
    }
} catch (e) {
    console.error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐢𝐧𝐢𝐭𝐢𝐚𝐥𝐢𝐳𝐞 𝐆𝐚𝐦𝐞𝐌𝐚𝐧𝐚𝐠𝐞𝐫:", e);
}

module.exports = {
    config: {
        name: "masoi",
        aliases: [],
        version: "1.0.0",
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        countDown: 0,
        role: 0,
        category: "𝐆𝐚𝐦𝐞",
        shortDescription: {
            en: "𝐀 𝐰𝐞𝐫𝐞𝐰𝐨𝐥𝐟 𝐠𝐚𝐦𝐞 𝐨𝐧 𝐌𝐢𝐫𝐚𝐢"
        },
        longDescription: {
            en: "𝐏𝐥𝐚𝐲 𝐚 𝐰𝐞𝐫𝐞𝐰𝐨𝐥𝐟 𝐠𝐚𝐦𝐞 𝐰𝐢𝐭𝐡 𝐟𝐫𝐢𝐞𝐧𝐝𝐬"
        },
        guide: {
            en: "{p}masoi [𝐨𝐩𝐭𝐢𝐨𝐧𝐬]"
        }
    },

    onStart: async function ({ usersData, event, args, message, getLang }) {
        try {
            // 𝐂𝐡𝐞𝐜𝐤 𝐢𝐟 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐢𝐞𝐬 𝐚𝐫𝐞 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞
            try {
                require.resolve('./masoi/GameManager');
            } catch (e) {
                return message.reply("❌ 𝐆𝐚𝐦𝐞𝐌𝐚𝐧𝐚𝐠𝐞𝐫 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝");
            }
            
            try {
                require.resolve('./masoi/index');
            } catch (e) {
                return message.reply("❌ 𝐖𝐞𝐫𝐞𝐰𝐨𝐥𝐟 𝐠𝐚𝐦𝐞 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝");
            }

            global.Users = usersData;
            
            if (!global.gameManager) {
                return message.reply("❌ 𝐆𝐚𝐦𝐞𝐌𝐚𝐧𝐚𝐠𝐞𝐫 𝐧𝐨𝐭 𝐢𝐧𝐢𝐭𝐢𝐚𝐥𝐢𝐳𝐞𝐝");
            }

            await global.gameManager.run(this.config.name, {
                masterID: event.senderID,
                threadID: event.threadID,
                param: args,
                isGroup: event.isGroup
            });

        } catch (error) {
            console.error("𝐄𝐫𝐫𝐨𝐫 𝐢𝐧 𝐰𝐞𝐫𝐞𝐰𝐨𝐥𝐟 𝐜𝐨𝐦𝐦𝐚𝐧𝐝:", error);
            message.reply("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐬𝐭𝐚𝐫𝐭𝐢𝐧𝐠 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞");
        }
    },

    onChat: async function ({ event, message }) {
        try {
            if (!global.gameManager || !global.gameManager.items) {
                return;
            }

            // 𝐅𝐢𝐧𝐝 𝐖𝐞𝐫𝐞𝐰𝐨𝐥𝐟 𝐠𝐚𝐦𝐞 𝐛𝐲 𝐭𝐡𝐫𝐞𝐚𝐝 𝐈𝐃
            const werewolfGame = global.gameManager.items.find(i => i.threadID === event.threadID);
            if (!werewolfGame) {
                return;
            }

            // 𝐂𝐡𝐞𝐜𝐤 𝐢𝐟 𝐮𝐬𝐞𝐫 𝐢𝐬 𝐩𝐚𝐫𝐭𝐢𝐜𝐢𝐩𝐚𝐧𝐭 𝐨𝐫 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐢𝐬 𝐢𝐧 𝐠𝐚𝐦𝐞 𝐭𝐡𝐫𝐞𝐚𝐝
            if ((werewolfGame.participants && werewolfGame.participants.includes(event.senderID)) || 
                werewolfGame.threadID === event.threadID) {
                
                const replyFunction = (msg) => {
                    message.reply(msg);
                };
                
                await werewolfGame.onMessage(event, replyFunction);
            }
        } catch (error) {
            console.error("𝐄𝐫𝐫𝐨𝐫 𝐢𝐧 𝐰𝐞𝐫𝐞𝐰𝐨𝐥𝐟 𝐜𝐡𝐚𝐭 𝐡𝐚𝐧𝐝𝐥𝐞𝐫:", error);
        }
    }
};
