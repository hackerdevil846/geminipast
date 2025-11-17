const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
    config: {
        name: "pat",
        aliases: ["headpat", "pats"],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💖 𝑃𝑎𝑡 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑜𝑛 𝑡ℎ𝑒 ℎ𝑒𝑎𝑑"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑 𝑎 𝑐𝑢𝑡𝑒 ℎ𝑒𝑎𝑑 𝑝𝑎𝑡 𝑔𝑒𝑠𝑡𝑢𝑟𝑒 𝑡𝑜 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟"
        },
        category: "𝑎𝑛𝑖𝑚𝑒",
        guide: {
            en: "{p}pat [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "canvas": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("canvas");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const targetID = Object.keys(event.mentions)[0];
            if (!targetID) return message.reply("🌸 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑝𝑎𝑡! 😢");

            const targetUser = await usersData.get(targetID);
            const senderUser = await usersData.get(event.senderID);
            const targetName = targetUser.name;
            const senderName = senderUser.name;

            // Create canvas-based image
            const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;
            const avatarImg = await loadImage(avatarUrl);
            
            const canvas = createCanvas(600, 400);
            const ctx = canvas.getContext("2d");
            
            // Draw background gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#FFECF6');
            gradient.addColorStop(1, '#FFD1DC');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw decorative elements
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let i = 0; i < 15; i++) {
                const radius = Math.random() * 20 + 5;
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Draw user avatar with circular frame
            ctx.save();
            ctx.beginPath();
            ctx.arc(150, 200, 80, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatarImg, 70, 120, 160, 160);
            ctx.restore();
            
            // Draw avatar border
            ctx.strokeStyle = '#E91E63';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(150, 200, 85, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw pat hand (simplified)
            ctx.fillStyle = '#FFB6C1';
            ctx.beginPath();
            ctx.arc(400, 150, 60, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw fingers
            ctx.fillStyle = '#FFB6C1';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(450 + i * 20, 120, 15, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Add text
            ctx.font = "bold 30px Arial";
            ctx.fillStyle = "#E91E63";
            ctx.textAlign = "center";
            ctx.fillText(`${targetName} 𝑔𝑜𝑡 𝑝𝑎𝑡𝑡𝑒𝑑! 💖`, 300, 50);
            
            ctx.font = "20px Arial";
            ctx.fillStyle = "#9C27B0";
            ctx.fillText("𝐴𝑟𝑒 𝑎𝑟𝑒 𝑏ℎ𝑎𝑙𝑜 𝑎𝑐ℎ𝑜! 🌸", 300, 350);
            
            // Save image
            const imagePath = path.join(__dirname, 'cache', `pat_${event.senderID}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(imagePath, buffer);
            
            await message.reply({
                body: `💕 | ${targetName}, 𝑦𝑜𝑢 𝑔𝑜𝑡 𝑎 𝑝𝑎𝑡! 😊\n╭─────────────────╯\n│   ✨ 𝑃𝑎𝑡𝑡𝑒𝑑 𝑏𝑦: ${senderName}   │\n╰─────────────────╯`,
                attachment: fs.createReadStream(imagePath),
                mentions: [{
                    tag: targetName,
                    id: targetID
                }]
            });

            // Clean up
            fs.unlinkSync(imagePath);
            
        } catch (error) {
            console.error("𝑃𝑎𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("🌸 | 𝑆𝑜𝑟𝑟𝑦, 𝑐𝑜𝑢𝑙𝑑𝑛'𝑡 𝑠𝑒𝑛𝑑 𝑡ℎ𝑒 𝑝𝑎𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟! 😢");
        }
    }
};
