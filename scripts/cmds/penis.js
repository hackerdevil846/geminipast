const { createCanvas } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "penis",
        aliases: ["dick"],
        version: "1.1.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🍆 𝑃𝑒𝑛𝑖𝑠 𝑠𝑖𝑧𝑒 𝑐ℎ𝑒𝑐𝑘𝑒𝑟 𝑔𝑎𝑚𝑒"
        },
        longDescription: {
            en: "𝐹𝑢𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑡𝑜 𝑐ℎ𝑒𝑐𝑘 𝑟𝑎𝑛𝑑𝑜𝑚 𝑝𝑒𝑛𝑖𝑠 𝑠𝑖𝑧𝑒𝑠 𝑤𝑖𝑡ℎ 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑣𝑖𝑠𝑢𝑎𝑙𝑠"
        },
        category: "𝑓𝑢𝑛",
        guide: {
            en: "{p}penis"
        },
        countDown: 5,
        dependencies: {
            "canvas": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            try {
                require("canvas");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            // Generate random penis size
            const size = Math.floor(Math.random() * 15);
            const penisText = `8${'='.repeat(size)}D`;
            
            // Create canvas
            const canvas = createCanvas(600, 300);
            const ctx = canvas.getContext('2d');
            
            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 600, 300);
            gradient.addColorStop(0, '#8a2be2');  // Violet
            gradient.addColorStop(1, '#1e90ff');  // DodgerBlue
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 600, 300);
            
            // Draw title
            ctx.font = 'bold 40px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 5;
            ctx.fillText('🍆 𝑃𝐸𝑁𝐼𝑆 𝑆𝐼𝑍𝐸 𝐶𝐻𝐸𝐶𝐾𝐸𝑅 🍆', 300, 60);
            
            // Draw result box
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(150, 100, 300, 100);
            
            // Draw penis size
            ctx.font = `bold ${60 + size * 2}px Arial`;
            ctx.fillStyle = '#ff69b4';  // HotPink
            ctx.fillText(penisText, 300, 170);
            
            // Draw measurement
            ctx.font = 'italic 25px Arial';
            ctx.fillStyle = '#00ff7f';  // SpringGreen
            ctx.fillText(`📏 𝑆𝑖𝑧𝑒: ${size + 1} 𝑐𝑚`, 300, 230);
            
            // Draw footer
            ctx.font = '20px Arial';
            ctx.fillStyle = '#ffff00';  // Yellow
            ctx.fillText('𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐵𝑜𝑡 𝑆𝑦𝑠𝑡𝑒𝑚 • 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑', 300, 280);
            
            // Save image
            const imagePath = path.join(__dirname, 'cache', `penis_${Date.now()}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(imagePath, buffer);
            
            const messages = [
                "✨ 𝑇𝑜𝑑𝑎𝑦'𝑠 𝑝𝑒𝑛𝑖𝑠 𝑠𝑖𝑧𝑒 𝑟𝑒𝑣𝑒𝑎𝑙! ✨",
                "💖 𝐷𝑎𝑖𝑙𝑦 𝑝𝑒𝑛𝑖𝑠 𝑖𝑛𝑠𝑝𝑒𝑐𝑡𝑖𝑜𝑛 💖",
                "🍆 𝑃𝑒𝑛𝑖𝑠 𝑜𝑓 𝑡ℎ𝑒 𝑑𝑎𝑦 𝑎𝑤𝑎𝑟𝑑! 🍆",
                "🔥 𝐻𝑂𝑇 𝑃𝐸𝑁𝐼𝑆 𝑁𝐸𝑊𝑆! 🔥"
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            await message.reply({
                body: `${randomMessage}\n━━━━━━━━━━━━━━━\n${penisText}\n📏 𝑆𝑖𝑧𝑒: ${size + 1} 𝑐𝑚\n\n"${getFunComment(size)}" 😏`,
                attachment: fs.createReadStream(imagePath)
            });

            // Clean up
            fs.unlinkSync(imagePath);
            
        } catch (error) {
            console.error("𝑃𝑒𝑛𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            // Fallback to text if canvas fails
            const size = Math.floor(Math.random() * 15);
            const penisText = `8${'='.repeat(size)}D`;
            await message.reply(
                `🎯 𝐸𝑅𝑅𝑂𝑅: 𝐹𝑎𝑖𝑙𝑒𝑑! 𝐻𝑒𝑟𝑒'𝑠 𝑡𝑒𝑥𝑡 𝑣𝑒𝑟𝑠𝑖𝑜𝑛:\n\n` +
                `🍆 𝑇𝑜𝑑𝑎𝑦'𝑠 𝑝𝑒𝑛𝑖𝑠: ${penisText}\n` +
                `📏 𝑆𝑖𝑧𝑒: ${size + 1} 𝑐𝑚\n` +
                `💬 "${getFunComment(size)}" 😏`
            );
        }
    }
};

function getFunComment(size) {
    const comments = [
        "𝑇𝑖𝑛𝑦 𝑏𝑢𝑡 𝑚𝑖𝑔ℎ𝑡𝑦!",
        "𝐴𝑣𝑒𝑟𝑎𝑔𝑒 𝑘𝑖𝑛𝑔 👑",
        "𝑅𝑒𝑠𝑝𝑒𝑐𝑡𝑎𝑏𝑙𝑒 𝑠𝑖𝑧𝑒!",
        "𝐵𝑖𝑔 𝑃𝑃 𝑒𝑛𝑒𝑟𝑔𝑦!",
        "𝐴𝑏𝑠𝑜𝑙𝑢𝑡𝑒 𝑢𝑛𝑖𝑡!",
        "𝐺𝑜𝑑𝑧𝑖𝑙𝑙𝑎 𝑠𝑖𝑧𝑒!",
        "𝐶𝑜𝑙𝑜𝑠𝑠𝑎𝑙 𝑐ℎ𝑎𝑚𝑝𝑖𝑜𝑛!",
        "𝑀𝑖𝑐𝑟𝑜𝑠𝑐𝑜𝑝𝑖𝑐 𝑚𝑎𝑟𝑣𝑒𝑙",
        "𝑃𝑜𝑐𝑘𝑒𝑡-𝑠𝑖𝑧𝑒𝑑 𝑝𝑙𝑒𝑎𝑠𝑢𝑟𝑒",
        "𝐹𝑢𝑛-𝑠𝑖𝑧𝑒𝑑 𝑓𝑟𝑖𝑒𝑛𝑑",
        "𝐺𝑟𝑜𝑤𝑒𝑟 𝑛𝑜𝑡 𝑠ℎ𝑜𝑤𝑒𝑟!",
        "𝑇𝑒𝑚𝑝𝑒𝑟𝑎𝑡𝑢𝑟𝑒 𝑐𝑜𝑚𝑝𝑒𝑛𝑠𝑎𝑡𝑜𝑟",
        "𝑃𝑒𝑟𝑓𝑒𝑐𝑡 ℎ𝑎𝑛𝑑𝑓𝑢𝑙!",
        "𝐿𝑒𝑔𝑒𝑛𝑑𝑎𝑟𝑦 𝑙𝑒𝑛𝑔𝑡ℎ!",
        "𝑀𝑦𝑡ℎ𝑖𝑐𝑎𝑙 𝑚𝑒𝑎𝑠𝑢𝑟𝑒𝑚𝑒𝑛𝑡𝑠!"
    ];
    
    return size < 3 ? comments[0] :
           size < 5 ? comments[1] :
           size < 8 ? comments[2] :
           size < 10 ? comments[3] :
           comments[4 + Math.floor(Math.random() * 11)];
}
