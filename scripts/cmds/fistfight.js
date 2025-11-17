module.exports = {
    config: {
        name: "fistfight",
        aliases: ["punch", "fight"],
        version: "1.0.0",
        author: "𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝐏𝐔𝐍𝐂𝐇 𝐒𝐎𝐌𝐄𝐎𝐍𝐄 𝐈𝐍 𝐀 𝐅𝐈𝐒𝐓𝐅𝐈𝐆𝐇𝐓"
        },
        longDescription: {
            en: "𝐒𝐄𝐍𝐃 𝐀 𝐏𝐔𝐍𝐂𝐇 𝐀𝐍𝐈𝐌𝐀𝐓𝐈𝐎𝐍 𝐓𝐎 𝐀 𝐓𝐀𝐆𝐆𝐄𝐃 𝐔𝐒𝐄𝐑"
        },
        guide: {
            en: "{p}𝐟𝐢𝐬𝐭𝐟𝐢𝐠𝐡𝐭 [𝐭𝐚𝐠]"
        },
        dependencies: {
            "request": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ api, event, message }) {
        try {
            const request = global.nodemodule["request"];
            const fs = global.nodemodule["fs-extra"];
        } catch (e) {
            return message.reply("❌ | 𝐌𝐈𝐒𝐒𝐈𝐍𝐆 𝐃𝐄𝐏𝐄𝐍𝐃𝐄𝐍𝐂𝐈𝐄𝐒: 𝐑𝐄𝐐𝐔𝐄𝐒𝐓 𝐀𝐍𝐃 𝐅𝐒-𝐄𝐗𝐓𝐑𝐀");
        }

        const request = global.nodemodule["request"];
        const fs = global.nodemodule["fs-extra"];

        var link = [    
            "https://i.postimg.cc/SNX8pD8Z/13126.gif",
            "https://i.postimg.cc/TYZb2gJT/1467506881-1016b5fd386cf30488508cf6f0a2bee5.gif",
            "https://i.postimg.cc/fyV3DR33/anime-punch.gif",
            "https://i.postimg.cc/P5sLnhdx/onehit-30-5-2016-3.gif",
        ];

        var mention = Object.keys(event.mentions);
        if (!mention[0]) return message.reply("𝐏𝐋𝐄𝐀𝐒𝐄 𝐓𝐀𝐆 𝟏 𝐏𝐄𝐑𝐒𝐎𝐍");

        let tag = event.mentions[mention[0]].replace("@", "");
        
        var callback = () => api.sendMessage({
            body: `${tag}` + ` 𝐓𝐀𝐊𝐄 𝐓𝐇𝐈𝐒 𝐏𝐔𝐍𝐂𝐇 𝐑𝐈𝐆𝐇𝐓 𝐈𝐍 𝐘𝐎𝐔𝐑 𝐅𝐀𝐂𝐄! 𝐒𝐓𝐎𝐏 𝐓𝐀𝐋𝐊𝐈𝐍𝐆 𝐍𝐎𝐍𝐒𝐄𝐍𝐒𝐄! 👿`,
            mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
            attachment: fs.createReadStream(__dirname + "/cache/puch.gif")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/puch.gif"));  

        return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/puch.gif")).on("close", () => callback());
    }
};
