const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
    config: {
        name: "osu",
        aliases: ["osustats", "osuinfo"],
        version: "1.1.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🎮 𝐺𝑒𝑡 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑜𝑠𝑢! 𝑝𝑙𝑎𝑦𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
        },
        longDescription: {
            en: "𝐹𝑒𝑡𝑐ℎ 𝑎𝑛𝑑 𝑑𝑖𝑠𝑝𝑙𝑎𝑦 𝑜𝑠𝑢! 𝑝𝑙𝑎𝑦𝑒𝑟 𝑠𝑡𝑎𝑡𝑖𝑠𝑡𝑖𝑐𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑐𝑎𝑛𝑣𝑎𝑠 𝑑𝑒𝑠𝑖𝑔𝑛"
        },
        category: "𝑔𝑎𝑚𝑒",
        guide: {
            en: "{p}osu [𝑢𝑠𝑒𝑟𝑛𝑎𝑚𝑒]"
        },
        countDown: 10,
        dependencies: {
            "axios": "",
            "canvas": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("canvas");
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            if (!args[0]) {
                return message.reply("⚡ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎𝑛 𝑜𝑠𝑢! 𝑢𝑠𝑒𝑟𝑛𝑎𝑚𝑒!");
            }

            const username = encodeURIComponent(args.join(" "));
            const sigUrl = `http://lemmmy.pw/osusig/sig.php?colour=hex8866ee&uname=${username}&pp=1&countryrank&rankedscore&onlineindicator=undefined&xpbar&xpbarhex`;
            
            // Download signature image
            const sigPath = path.join(__dirname, "cache", `${event.senderID}-osu.png`);
            const response = await axios({ url: sigUrl, method: 'GET', responseType: 'stream' });
            const writer = fs.createWriteStream(sigPath);
            response.data.pipe(writer);
            
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Create stylish canvas
            const canvas = createCanvas(700, 350);
            const ctx = canvas.getContext('2d');
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#2c3e50');
            gradient.addColorStop(1, '#4ca1af');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add decorative elements
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            for (let i = 0; i < 20; i++) {
                const radius = Math.random() * 30 + 10;
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Load signature
            const signature = await loadImage(sigPath);
            ctx.drawImage(signature, 50, 150, 600, 150);
            
            // Add stylish text
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 36px 'Arial'";
            ctx.textAlign = "center";
            ctx.fillText("🎮 𝑜𝑠𝑢! 𝑃𝑙𝑎𝑦𝑒𝑟 𝑆𝑡𝑎𝑡𝑠", canvas.width / 2, 60);
            
            ctx.font = "28px 'Arial'";
            ctx.fillStyle = "#ff66aa";
            ctx.fillText(`${args.join(" ")}`, canvas.width / 2, 110);
            
            // Add decorations
            ctx.beginPath();
            ctx.strokeStyle = "#ff66aa";
            ctx.lineWidth = 3;
            ctx.moveTo(150, 125);
            ctx.lineTo(550, 125);
            ctx.stroke();
            
            // Save final image
            const finalPath = path.join(__dirname, "cache", `${event.senderID}-osu-final.png`);
            const out = fs.createWriteStream(finalPath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            
            await new Promise((resolve, reject) => {
                out.on('finish', resolve);
                out.on('error', reject);
            });

            // Send result
            await message.reply({
                body: `🌟 𝑂𝑆𝑈! 𝑃𝐿𝐴𝑌𝐸𝑅 𝐼𝑁𝐹𝑂 🌟\n🎮 𝑈𝑠𝑒𝑟𝑛𝑎𝑚𝑒: ${args.join(" ")}\n🔗 𝑃𝑟𝑜𝑓𝑖𝑙𝑒: https://osu.ppy.sh/users/${username}`,
                attachment: fs.createReadStream(finalPath)
            });

            // Clean up
            fs.unlinkSync(sigPath);
            fs.unlinkSync(finalPath);
            
        } catch (error) {
            console.error("𝑂𝑆𝑈 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟: 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑢𝑠𝑒𝑟𝑛𝑎𝑚𝑒 𝑎𝑛𝑑 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!");
        }
    }
};
