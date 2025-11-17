module.exports = {
    config: {
        name: "sorrylove",
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 1,
        category: "relationship",
        shortDescription: {
            en: "𝐴𝑝𝑜𝑙𝑜𝑔𝑖𝑧𝑒 𝑡𝑜 𝑦𝑜𝑢𝑟 𝑙𝑜𝑣𝑒𝑑 𝑜𝑛𝑒 𝑤𝑖𝑡ℎ 𝑠𝑝𝑒𝑐𝑖𝑎𝑙 𝑒𝑓𝑓𝑒𝑐𝑡𝑠"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑎𝑝𝑜𝑙𝑜𝑔𝑦 𝑤𝑖𝑡ℎ 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑠, 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠, 𝑎𝑛𝑑 𝑎 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑔𝑖𝑓 𝑤𝑖𝑡ℎ 𝑏𝑜𝑡ℎ 𝑝𝑎𝑟𝑡𝑛𝑒𝑟𝑠' 𝑝ℎ𝑜𝑡𝑜𝑠"
        },
        guide: {
            en: "💑 𝐇𝐨𝐰 𝐭𝐨 𝐮𝐬𝐞 𝐒𝐨𝐫𝐫𝐲𝐋𝐨𝐯𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝:\n\n"
                + "1️⃣ 𝐓𝐫𝐢𝐠𝐠𝐞𝐫 𝐩𝐡𝐫𝐚𝐬𝐞𝐬:\n"
                + "   • 'sorry my love'\n"
                + "   • 'sorry darling'\n" 
                + "   • 'sorry honey'\n"
                + "   • 'sorry sweetheart'\n"
                + "   • 'forgive me'\n"
                + "   • 'i'm sorry'\n\n"
                + "2️⃣ 𝐓𝐚𝐠 𝐲𝐨𝐮𝐫 𝐩𝐚𝐫𝐭𝐧𝐞𝐫: @theirname\n\n"
                + "3️⃣ 𝐖𝐡𝐚𝐭 𝐡𝐚𝐩𝐩𝐞𝐧𝐬:\n"
                + "   • 🤵 Your nickname becomes '[Partner]'s Love ❤️'\n"
                + "   • 👰 Their nickname becomes '[Your]'s Love ❤️'\n"
                + "   • 💬 5 romantic apology messages sent sequentially\n"
                + "   • 🎁 Beautiful GIF with both your photos\n"
                + "   • 🏷️ Both of you are tagged in the final message\n\n"
                + "📝 𝐄𝐱𝐚𝐦𝐩𝐥𝐞: 'sorry my love @John'"
        }
    },

    onStart: async function() {},

    onChat: async function({ event, message, usersData }) {
        try {
            const fs = require("fs-extra");
            const axios = require("axios");
            const { body, senderID } = event;
            
            if (!body) return;
            
            const lowerBody = body.toLowerCase();
            const hasKeyword = 
                lowerBody.includes("sorry my love") ||
                lowerBody.includes("sorry darling") || 
                lowerBody.includes("sorry honey") ||
                lowerBody.includes("sorry sweetheart") ||
                lowerBody.includes("forgive me") ||
                lowerBody.includes("i'm sorry");

            if (!hasKeyword) return;

            const mention = Object.keys(event.mentions)[0];
            if (!mention) {
                return message.reply("❓ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑡ℎ𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑎𝑝𝑜𝑙𝑜𝑔𝑖𝑧𝑒 𝑡𝑜. 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: '𝑠𝑜𝑟𝑟𝑦 𝑚𝑦 𝑙𝑜𝑣𝑒 @𝑀𝑎𝑟𝑦'");
            }

            const emoji = ["♥️","❤️","💛","💚","💙","💜","🖤","💖","💝","💓","💘","💍","🎁","💋","💎","💠","🌈","🌍","🌕","☀️","💑","💞","💗"];
            const random_emoji = emoji[Math.floor(Math.random() * emoji.length)];

            const love = ((await axios.get("http://ntkhang.xtgem.com/bikini.json")).data).love;
            const linklove = love[Math.floor(Math.random() * love.length)];
            
            const getlove = (await axios.get(linklove, {responseType: "arraybuffer"})).data;
            fs.writeFileSync(__dirname + "/cache/love.gif", Buffer.from(getlove, "utf-8"));
            
            const Avatar = (await axios.get(`https://graph.facebook.com/${mention}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));
            
            const Avatar2 = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));
            
            const imglove = [
                fs.createReadStream(__dirname + "/cache/love.gif"),
                fs.createReadStream(__dirname + "/cache/avt.png"),
                fs.createReadStream(__dirname + "/cache/avt2.png")
            ];

            const dt = await usersData.get(senderID);
            const data = await usersData.get(mention);
            const name_1 = dt.name || "Lover";
            const name_2 = data.name || "Beloved";

            // Change nicknames
            await global.api.changeNickname(`${name_2}'s Love ${random_emoji}`, event.threadID, parseInt(senderID));
            await global.api.changeNickname(`${name_1}'s Love ${random_emoji}`, event.threadID, parseInt(mention));
            
            const arraytag = [
                {id: senderID, tag: name_1},
                {id: mention, tag: name_2}
            ];

            // Send apology messages with delays
            await message.reply("💕 𝐼 𝐿𝑜𝑣𝑒 𝑌𝑜𝑢 ❤️");
            
            setTimeout(async () => {
                await message.reply("😔 𝐼'𝑚 𝑆𝑜𝑟𝑟𝑦 𝑀𝑦 𝐿𝑜𝑣𝑒 🥺");
            }, 2500);
            
            setTimeout(async () => {
                await message.reply("🥺 𝑃𝑙𝑒𝑎𝑠𝑒 𝐷𝑜𝑛'𝑡 𝐵𝑒 𝑀𝑎𝑑 𝐴𝑡 𝑀𝑒 𝐴𝑛𝑦𝑚𝑜𝑟𝑒 🥺🥺");
            }, 5000);
            
            setTimeout(async () => {
                await message.reply("🤞 𝐼 𝑝𝑟𝑜𝑚𝑖𝑠𝑒 𝐼 𝑤𝑜𝑛'𝑡 𝑑𝑜 𝑖𝑡 𝑎𝑔𝑎𝑖𝑛 :(");
            }, 7500);
            
            setTimeout(async () => {
                await message.reply("😭 𝑃𝑙𝑒𝑎𝑠𝑒 𝐹𝑜𝑟𝑔𝑖𝑣𝑒 𝑀𝑒 𝑀𝑦 𝐿𝑜𝑣𝑒 🥺😭");
            }, 10000);
            
            setTimeout(async () => {
                await message.reply({
                    body: `💑 ${name_1} 𝑙𝑜𝑣𝑒𝑠 ${name_2} 💓\n\n✨ 𝑇ℎ𝑖𝑠 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑎𝑠 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦 𝑆𝑜𝑟𝑟𝑦𝐿𝑜𝑣𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑`,
                    mentions: arraytag,
                    attachment: imglove
                });
                
                // Clean up files after sending
                setTimeout(() => {
                    try {
                        if (fs.existsSync(__dirname + "/cache/love.gif")) fs.unlinkSync(__dirname + "/cache/love.gif");
                        if (fs.existsSync(__dirname + "/cache/avt.png")) fs.unlinkSync(__dirname + "/cache/avt.png");
                        if (fs.existsSync(__dirname + "/cache/avt2.png")) fs.unlinkSync(__dirname + "/cache/avt2.png");
                    } catch (cleanupError) {
                        console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
                    }
                }, 30000);
                
            }, 12500);

        } catch (error) {
            console.error("𝐴𝑝𝑜𝑙𝑜𝑔𝑦 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑎𝑝𝑜𝑙𝑜𝑔𝑦! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
