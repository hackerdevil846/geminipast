const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "mix",
        aliases: ["emojimix", "combineemoji"],
        version: "1.0.2",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑖𝑚𝑎𝑔𝑒",
        shortDescription: {
            en: "✨ 𝐶𝑜𝑚𝑏𝑖𝑛𝑒 𝑡𝑤𝑜 𝑒𝑚𝑜𝑗𝑖𝑠 𝑖𝑛𝑡𝑜 𝑎 𝑠𝑖𝑛𝑔𝑙𝑒 𝑖𝑚𝑎𝑔𝑒"
        },
        longDescription: {
            en: "𝐶𝑜𝑚𝑏𝑖𝑛𝑒 𝑡𝑤𝑜 𝑒𝑚𝑜𝑗𝑖𝑠 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑠𝑒𝑑 𝑒𝑚𝑜𝑗𝑖 𝑖𝑚𝑎𝑔𝑒"
        },
        guide: {
            en: "{p}mix [𝑒𝑚𝑜𝑗𝑖1] [𝑒𝑚𝑜𝑗𝑖2]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            if (!args[0] || !args[1]) {
                return message.reply(
                    `🌸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 2 𝑒𝑚𝑜𝑗𝑖𝑠 𝑡𝑜 𝑐𝑜𝑚𝑏𝑖𝑛𝑒!\n━━━━━━━━━━━━━━━━━━\n💡 𝑈𝑠𝑎𝑔𝑒: ${global.config.PREFIX}${this.config.name} ${this.config.guide.en}\n📌 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config.PREFIX}mix 😂 🥰`
                );
            }

            const emoji1 = encodeURIComponent(args[0]);
            const emoji2 = encodeURIComponent(args[1]);
            const savePath = __dirname + `/cache/mix_${emoji1}_${emoji2}.png`;

            const primaryApiUrl = `https://www.api.vyturex.com/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`;
            const backupApiUrl = `https://emojik.vercel.app/s/${emoji1}_${emoji2}?size=128`;

            try {
                // Try primary API first
                const response = await axios.get(primaryApiUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 10000
                });
                
                await fs.writeFile(savePath, Buffer.from(response.data));
                
                await message.reply({
                    body: `✨ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐𝑜𝑚𝑏𝑖𝑛𝑒𝑑:\n━━━━━━━━━━━━━━━━━━\n${args[0]} + ${args[1]} = 🎉`,
                    attachment: fs.createReadStream(savePath)
                });

                // Clean up
                if (fs.existsSync(savePath)) {
                    fs.unlinkSync(savePath);
                }

            } catch (primaryError) {
                console.log("𝑃𝑟𝑖𝑚𝑎𝑟𝑦 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑡𝑟𝑦𝑖𝑛𝑔 𝑏𝑎𝑐𝑘𝑢𝑝...");
                
                try {
                    // Try backup API
                    const backupResponse = await axios.get(backupApiUrl, { 
                        responseType: 'arraybuffer',
                        timeout: 10000
                    });
                    
                    await fs.writeFile(savePath, Buffer.from(backupResponse.data));
                    
                    await message.reply({
                        body: `✨ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐𝑜𝑚𝑏𝑖𝑛𝑒𝑑:\n━━━━━━━━━━━━━━━━━━\n${args[0]} + ${args[1]} = 🎉`,
                        attachment: fs.createReadStream(savePath)
                    });

                    // Clean up
                    if (fs.existsSync(savePath)) {
                        fs.unlinkSync(savePath);
                    }

                } catch (backupError) {
                    console.error("𝐵𝑜𝑡ℎ 𝐴𝑃𝐼𝑠 𝑓𝑎𝑖𝑙𝑒𝑑:", backupError);
                    
                    await message.reply(
                        `❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑜𝑚𝑏𝑖𝑛𝑒 "${args[0]}" 𝑎𝑛𝑑 "${args[1]}"!\n━━━━━━━━━━━━━━━━━━\n💠 𝑇𝑟𝑦 𝑢𝑠𝑖𝑛𝑔 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑒𝑚𝑜𝑗𝑖𝑠 𝑜𝑟 𝑐ℎ𝑒𝑐𝑘 𝑎𝑝𝑖 𝑠𝑡𝑎𝑡𝑢𝑠!`
                    );
                    
                    if (fs.existsSync(savePath)) {
                        fs.unlinkSync(savePath);
                    }
                }
            }

        } catch (error) {
            console.error("𝑀𝑖𝑥 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply(
                "⚠️ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!"
            );
        }
    }
};
