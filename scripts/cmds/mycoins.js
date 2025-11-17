const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "mycoins",
        aliases: ["coins", "mymoney"],
        version: "1.1.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💵 𝐶ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑜𝑟 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑏𝑎𝑙𝑎𝑛𝑐𝑒"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦 𝑦𝑜𝑢𝑟 𝑜𝑟 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟'𝑠 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑖𝑚𝑎𝑔𝑒"
        },
        category: "𝑒𝑐𝑜𝑛𝑜𝑚𝑦",
        guide: {
            en: "{p}mycoins [@𝑡𝑎𝑔]"
        },
        countDown: 5,
        dependencies: {
            "canvas": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args, usersData, currenciesData }) {
        try {
            // Dependency check
            try {
                require("canvas");
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            async function createCoinImage(name, money, avatarURL) {
                const canvas = createCanvas(600, 350);
                const ctx = canvas.getContext('2d');
                
                // Background gradient
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#2c3e50');
                gradient.addColorStop(1, '#4ca1af');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Decorative elements
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                for (let i = 0; i < 20; i++) {
                    const radius = Math.random() * 30 + 10;
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // User avatar
                try {
                    const avatar = await loadImage(avatarURL);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(125, 175, 80, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatar, 45, 95, 160, 160);
                    ctx.restore();
                    
                    // Avatar border
                    ctx.strokeStyle = '#f1c40f';
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.arc(125, 175, 85, 0, Math.PI * 2);
                    ctx.stroke();
                } catch (e) {
                    console.error("𝐸𝑟𝑟𝑜𝑟 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑎𝑣𝑎𝑡𝑎𝑟:", e);
                }
                
                // Text styles
                ctx.fillStyle = '#ecf0f1';
                ctx.textAlign = 'center';
                
                // Title
                ctx.font = 'bold 36px "Segoe UI"';
                ctx.fillText('𝐵𝑎𝑙𝑎𝑛𝑐𝑒 𝑆𝑡𝑎𝑡𝑢𝑠', canvas.width / 2 + 50, 100);
                
                // User name
                ctx.font = 'bold 28px "Segoe UI"';
                ctx.fillText(name, canvas.width / 2 + 50, 170);
                
                // Balance text
                ctx.font = '32px "Segoe UI"';
                ctx.fillText('𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝐵𝑎𝑙𝑎𝑛𝑐𝑒:', canvas.width / 2 + 50, 240);
                
                // Balance amount
                ctx.fillStyle = '#f1c40f';
                ctx.font = 'bold 40px "Segoe UI"';
                ctx.fillText(`$${money.toLocaleString()}`, canvas.width / 2 + 50, 300);
                
                // Decorative coins
                ctx.fillStyle = 'rgba(241, 196, 15, 0.6)';
                for (let i = 0; i < 5; i++) {
                    const size = Math.random() * 30 + 20;
                    const x = Math.random() * 400 + 200;
                    const y = Math.random() * 100;
                    ctx.beginPath();
                    ctx.arc(x, y, size/2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = 'rgba(230, 126, 34, 0.8)';
                    ctx.beginPath();
                    ctx.arc(x, y, size/3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'rgba(241, 196, 15, 0.6)';
                }
                
                const imagePath = path.join(__dirname, 'cache', `coin_${Date.now()}.png`);
                fs.writeFileSync(imagePath, canvas.toBuffer());
                return imagePath;
            }
            
            const { senderID, mentions } = event;
            
            if (!args[0]) {
                // Self balance
                const money = (await currenciesData.get(senderID)).money || 0;
                const userInfo = await usersData.get(senderID);
                const avatarURL = userInfo.avatarUrl || 'https://i.imgur.com/8nLFCVP.png';
                const name = userInfo.name || "𝑈𝑠𝑒𝑟";
                
                const imagePath = await createCoinImage(name, money, avatarURL);
                return message.reply({
                    body: `💵 𝑌𝑜𝑢𝑟 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: $${money.toLocaleString()}`,
                    attachment: fs.createReadStream(imagePath)
                }).then(() => {
                    fs.unlinkSync(imagePath);
                });
            }
            
            // Mentioned user
            if (Object.keys(mentions).length !== 1) 
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑜𝑛𝑙𝑦 𝑜𝑛𝑒 𝑢𝑠𝑒𝑟!");
            
            const mentionID = Object.keys(mentions)[0];
            const money = (await currenciesData.get(mentionID)).money || 0;
            const userInfo = await usersData.get(mentionID);
            const avatarURL = userInfo.avatarUrl || 'https://i.imgur.com/8nLFCVP.png';
            const name = mentions[mentionID].replace('@', '');
            
            const imagePath = await createCoinImage(name, money, avatarURL);
            await message.reply({
                body: `💳 ${name}'𝑠 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: $${money.toLocaleString()}`,
                mentions: [{ tag: name, id: mentionID }],
                attachment: fs.createReadStream(imagePath)
            }).then(() => {
                fs.unlinkSync(imagePath);
            });
            
        } catch (error) {
            console.error(error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑐𝑜𝑖𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑");
        }
    }
};
