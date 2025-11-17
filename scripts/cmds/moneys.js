const fs = require('fs');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const moment = require('moment-timezone');

module.exports = {
    config: {
        name: "moneys",
        aliases: ["wealth", "cashdisplay"],
        version: "2.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💰 𝑆𝑡𝑦𝑙𝑖𝑠ℎ 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑐ℎ𝑒𝑐𝑘𝑒𝑟 𝑤𝑖𝑡ℎ 𝑣𝑖𝑠𝑢𝑎𝑙 𝑐𝑎𝑟𝑑𝑠"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑎 𝑙𝑢𝑥𝑢𝑟𝑦 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑣𝑖𝑠𝑢𝑎𝑙 𝑒𝑙𝑒𝑚𝑒𝑛𝑡𝑠"
        },
        category: "𝑒𝑐𝑜𝑛𝑜𝑚𝑦",
        guide: {
            en: "{p}moneys [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
        },
        countDown: 10,
        dependencies: {
            "canvas": "",
            "axios": "",
            "moment-timezone": ""
        }
    },

    onLoad: async function () {
        console.log("✅ 𝑀𝑜𝑛𝑒𝑦𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!");
    },

    onStart: async function({ message, event, args, usersData, currenciesData }) {
        try {
            // Dependency check
            try {
                require("canvas");
                require("axios");
                require("moment-timezone");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒.");
            }

            const { threadID, messageID, senderID, mentions } = event;
            const timezone = "𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎";

            let targetID, targetName;
            const isSelf = !args[0] || Object.keys(mentions).length === 0;

            if (isSelf) {
                targetID = senderID;
                const userData = await usersData.get(targetID);
                targetName = userData.name || "𝑈𝑠𝑒𝑟";
            } else if (Object.keys(mentions).length === 1) {
                targetID = Object.keys(mentions)[0];
                targetName = mentions[targetID];
            } else {
                return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑜𝑛𝑙𝑦 𝑜𝑛𝑒 𝑢𝑠𝑒𝑟 𝑜𝑟 𝑙𝑒𝑎𝑣𝑒 𝑏𝑙𝑎𝑛𝑘 𝑡𝑜 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑜𝑤𝑛 𝑏𝑎𝑙𝑎𝑛𝑐𝑒.");
            }

            const moneyData = await currenciesData.get(targetID);
            const balance = moneyData.money || 0;

            async function generateBalanceCard(userInfo, balance, timezone) {
                const canvas = createCanvas(900, 450);
                const ctx = canvas.getContext('2d');

                // Premium gradient background with multiple colors
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#0c0c0c');
                gradient.addColorStop(0.3, '#142850');
                gradient.addColorStop(0.6, '#27496d');
                gradient.addColorStop(1, '#0c7b93');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Add luxury pattern overlay
                ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
                for (let i = 0; i < 100; i++) {
                    const size = Math.random() * 15 + 5;
                    ctx.beginPath();
                    ctx.arc(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        size,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }

                // Add decorative geometric shapes
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
                ctx.lineWidth = 2;
                
                // Diamond shapes
                for (let i = 0; i < 8; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const size = Math.random() * 25 + 15;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y - size);
                    ctx.lineTo(x + size, y);
                    ctx.lineTo(x, y + size);
                    ctx.lineTo(x - size, y);
                    ctx.closePath();
                    ctx.stroke();
                }

                // User avatar with gold border
                try {
                    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                    const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
                    const avatar = await loadImage(Buffer.from(response.data, 'binary'));

                    // Draw gold border circle
                    ctx.beginPath();
                    ctx.arc(150, 225, 85, 0, Math.PI * 2);
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 5;
                    ctx.stroke();
                    
                    // Draw avatar
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(150, 225, 80, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatar, 70, 145, 160, 160);
                    ctx.restore();
                } catch (e) {
                    console.error("𝐴𝑣𝑎𝑡𝑎𝑟 𝑒𝑟𝑟𝑜𝑟:", e);
                }

                // Luxury divider line
                ctx.beginPath();
                ctx.moveTo(250, 180);
                ctx.lineTo(650, 180);
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.stroke();

                // User name with shadow effect
                ctx.font = 'bold 42px "Segoe UI"';
                ctx.fillStyle = '#FFFFFF';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillText(userInfo.name, 450, 130);

                // Balance label
                ctx.font = '28px "Segoe UI"';
                ctx.fillStyle = '#CCCCCC';
                ctx.fillText('𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝐵𝑎𝑙𝑎𝑛𝑐𝑒', 450, 250);

                // Balance amount with luxurious gold color
                ctx.font = 'bold 72px "Segoe UI"';
                ctx.fillStyle = '#FFD700';
                ctx.fillText(`$${balance.toLocaleString()}`, 450, 310);

                // Decorative money bag icon
                ctx.font = 'bold 80px "Segoe UI"';
                ctx.fillText('💰', 750, 230);

                // Footer with date and decorative elements
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.font = 'italic 18px "Segoe UI"';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fillText(
                    `𝐶ℎ𝑒𝑐𝑘𝑒𝑑 𝑜𝑛 ${moment().tz(timezone).format('𝑌𝑌𝑌𝑌-𝑀𝑀-𝐷𝐷 ℎℎ:𝑚𝑚:𝑠𝑠 𝐴')}`,
                    450,
                    420
                );

                // Add decorative corner elements
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                
                // Top-left corner
                ctx.beginPath();
                ctx.moveTo(20, 20);
                ctx.lineTo(50, 20);
                ctx.moveTo(20, 20);
                ctx.lineTo(20, 50);
                ctx.stroke();
                
                // Top-right corner
                ctx.beginPath();
                ctx.moveTo(880, 20);
                ctx.lineTo(850, 20);
                ctx.moveTo(880, 20);
                ctx.lineTo(880, 50);
                ctx.stroke();
                
                // Bottom-left corner
                ctx.beginPath();
                ctx.moveTo(20, 430);
                ctx.lineTo(50, 430);
                ctx.moveTo(20, 430);
                ctx.lineTo(20, 400);
                ctx.stroke();
                
                // Bottom-right corner
                ctx.beginPath();
                ctx.moveTo(880, 430);
                ctx.lineTo(850, 430);
                ctx.moveTo(880, 430);
                ctx.lineTo(880, 400);
                ctx.stroke();

                return canvas.toBuffer('image/png');
            }

            try {
                const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

                const card = await generateBalanceCard({
                    name: targetName,
                    avatar: avatarUrl
                }, balance, timezone);

                return message.reply({
                    body: `💎 𝗟𝗨𝗫𝗨𝗥𝗬 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𝗖𝗔𝗥𝗗\n\n👤 𝑈𝑠𝑒𝑟: ${targetName}\n💰 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: $${balance.toLocaleString()}\n\n✨ 𝐶ℎ𝑒𝑐𝑘𝑒𝑑 𝑎𝑡: ${moment().tz(timezone).format('ℎℎ:𝑚𝑚:𝑠𝑠 𝐴')}`,
                    attachment: card
                });

            } catch (cardError) {
                console.error("𝐶𝑎𝑟𝑑 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", cardError);
                return message.reply(
                    `💎 𝗟𝗨𝗫𝗨𝗥𝗬 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𝗖𝗔𝗥𝗗\n\n👤 𝑈𝑠𝑒𝑟: ${targetName}\n💰 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: $${balance.toLocaleString()}\n\n✨ 𝐶ℎ𝑒𝑐𝑘𝑒𝑑 𝑎𝑡: ${moment().tz(timezone).format('ℎℎ:𝑚𝑚:𝑠𝑠 𝐴')}`
                );
            }

        } catch (error) {
            console.error('𝑀𝑜𝑛𝑒𝑦𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
            return message.reply(
                "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
            );
        }
    }
};
