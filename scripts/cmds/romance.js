module.exports = {
    config: {
        name: "romance",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑓𝑢𝑛",
        shortDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑘𝑖𝑠𝑠 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑠𝑜𝑚𝑒𝑜𝑛𝑒"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑎𝑛𝑖𝑚𝑒 𝑘𝑖𝑠𝑠 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑎 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟"
        },
        guide: {
            en: "{p}romance [@𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒]"
        },
        countDown: 5,
        dependencies: {
            "request": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("request");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            const request = require("request");
            const fs = require("fs-extra");

            if (!args.join(" ")) {
                return message.reply("❌ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒𝑛'𝑡 𝑒𝑛𝑡𝑒𝑟𝑒𝑑 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒");
            }

            if (!event.mentions || Object.keys(event.mentions).length === 0) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑡ℎ𝑒 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜");
            }

            return request('https://nekos.life/api/v2/img/kiss', (err, response, body) => {
                if (err) {
                    console.error("𝑅𝑜𝑚𝑎𝑛𝑐𝑒 𝑒𝑟𝑟𝑜𝑟:", err);
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                }

                try {
                    let picData = JSON.parse(body);
                    var mention = Object.keys(event.mentions)[0];
                    let getURL = picData.url;
                    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                    let tag = event.mentions[mention].replace("@", "");
                    
                    let callback = function() {
                        message.reply({
                            body: tag + ", 𝐼 𝑙𝑜𝑣𝑒 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ ❤️",
                            mentions: [{
                                tag: tag,
                                id: Object.keys(event.mentions)[0]
                            }],
                            attachment: fs.createReadStream(__dirname + `/cache/anime.${ext}`)
                        }).then(() => {
                            fs.unlinkSync(__dirname + `/cache/anime.${ext}`);
                        }).catch(error => {
                            console.error("𝑆𝑒𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
                        });
                    };
                    
                    request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/anime.${ext}`)).on("close", callback);
                    
                } catch (parseError) {
                    console.error("𝑃𝑎𝑟𝑠𝑒 𝑒𝑟𝑟𝑜𝑟:", parseError);
                    message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑎𝑟𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
                }
            });

        } catch (error) {
            console.error("𝑅𝑜𝑚𝑎𝑛𝑐𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
