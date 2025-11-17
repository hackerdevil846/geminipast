const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "natsuki",
        aliases: ["natsukiquote", "ddlc"],
        version: "1.1.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🎀 𝑁𝑎𝑡𝑠𝑢𝑘𝑖 𝑠𝑎𝑡ℎ𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝑎𝑣𝑎𝑡𝑎𝑟 𝑏𝑎𝑛𝑎𝑜 (𝑐𝑎𝑛𝑣𝑎𝑠 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑑)"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝑁𝑎𝑡𝑠𝑢𝑘𝑖 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡 𝑓𝑟𝑜𝑚 𝐷𝐷𝐿𝐶"
        },
        category: "🎨 𝑖𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛",
        guide: {
            en: "{p}natsuki [𝑡𝑒𝑥𝑡]"
        },
        countDown: 7,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑐𝑎𝑛𝑣𝑎𝑠.");
            }

            if (!args[0]) {
                return message.reply("⚡ 𝐾𝑖𝑐ℎ𝑢 𝑙𝑖𝑘ℎ𝑢𝑛 𝑛𝑎 𝑝𝑙𝑒𝑎𝑠𝑒!");
            }

            const text = args.join(" ");
            const backgrounds = ["bedroom", "class", "closet", "club", "corridor", "house", "kitchen", "residential", "sayori_bedroom"];
            const bodies = ["1b", "1", "2b", "2"];
            const faces = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1t", "2bt", "2bta", "2btb", "2btc", "2btd", "2bte", "2btf", "2btg", "2bth", "2bti", "2t", "2ta", "2tb", "2tc", "2td", "2te", "2tf", "2tg", "2th", "2ti"];
            
            // Step 1: Get base image from API
            const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            const body = bodies[Math.floor(Math.random() * bodies.length)];
            const face = faces[Math.floor(Math.random() * faces.length)];
            
            const apiUrl = `https://nekobot.xyz/api/imagegen?type=ddlc&character=natsuki&background=${bg}&body=${body}&face=${face}&text=${encodeURIComponent(text)}`;
            const response = await axios.get(apiUrl);
            
            if (!response.data.success) {
                return message.reply("❌ 𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟: " + response.data.message);
            }
            
            // Step 2: Enhance with canvas
            const baseImage = await loadImage(response.data.message);
            
            // Create canvas
            const canvas = createCanvas(baseImage.width, baseImage.height + 100);
            const ctx = canvas.getContext('2d');
            
            // Add background
            ctx.fillStyle = '#FFB6C1';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw image
            ctx.drawImage(baseImage, 0, 50, baseImage.width, baseImage.height);
            
            // Add stylish text
            ctx.font = 'bold 30px Arial';
            ctx.fillStyle = '#FF69B4';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            
            // Text with outline
            ctx.strokeText(`🎀 ${text} 🎀`, canvas.width/2, 35);
            ctx.fillText(`🎀 ${text} 🎀`, canvas.width/2, 35);
            
            // Add decorations
            ctx.beginPath();
            ctx.arc(50, 35, 15, 0, Math.PI * 2);
            ctx.arc(canvas.width - 50, 35, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#FF69B4';
            ctx.fill();
            
            // Step 3: Convert to buffer
            const buffer = canvas.toBuffer('image/png');
            
            await message.reply({
                body: `🎀 𝑁𝑎𝑡𝑠𝑢𝑘𝑖 𝑒𝑟 𝑐ℎ𝑜𝑏𝑖 𝑛𝑖𝑦𝑜 𝑛𝑖𝑗𝑒𝑟 𝑗𝑜𝑛𝑛𝑜\n"${text}"`,
                attachment: buffer
            });
            
        } catch (error) {
            console.error("𝑁𝑎𝑡𝑠𝑢𝑘𝑖 𝐶𝑎𝑛𝑣𝑎𝑠 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${error.message}`);
        }
    }
};
