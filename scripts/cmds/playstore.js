const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");
const path = require("path");

module.exports = {
    config: {
        name: "playstore",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 0,
        category: "user",
        shortDescription: {
            en: "📱 𝖯𝗅𝖺𝗒𝗌𝗍𝗈𝗋𝖾 𝗌𝗍𝗒𝗅𝖾 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈 𝖼𝖺𝗋𝖽"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝗌 𝖺 𝖯𝗅𝖺𝗒𝖲𝗍𝗈𝗋𝖾-𝗌𝗍𝗒𝗅𝖾 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖼𝖺𝗋𝖽"
        },
        guide: {
            en: "{p}playstore [𝗆𝖾𝗇𝗍𝗂𝗈𝗇/𝗋𝖾𝗉𝗅𝗒/𝗇𝗈𝗇𝖾]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": ""
        }
    },

    onStart: async function({ api, event, args, Users, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝖼𝖺𝗇𝗏𝖺𝗌.");
            }

            const cacheDir = path.join(__dirname, "cache");
            await fs.ensureDir(cacheDir);

            const pathImg = path.join(cacheDir, `playstore_${Date.now()}.png`);
            const pathAvt = path.join(cacheDir, `avatar_${Date.now()}.png`);

            // ✅ Target user (mention / reply / self)
            let id;
            try {
                id = Object.keys(event.mentions)[0] || (event.type === "message_reply" ? event.messageReply.senderID : event.senderID);
            } catch (e) {
                id = event.senderID;
            }

            let name;
            try {
                name = await Users.getNameUser(id);
                if (!name || name.trim() === "") {
                    name = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
                }
            } catch (e) {
                name = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
            }

            // ✅ Background
            const backgrounds = [
                "https://i.imgur.com/KDKgqvq.png"
            ];
            const rd = backgrounds[Math.floor(Math.random() * backgrounds.length)];

            console.log(`🎯 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖯𝗅𝖺𝗒𝖲𝗍𝗈𝗋𝖾 𝖼𝖺𝗋𝖽 𝖿𝗈𝗋: ${name} (${id})`);

            try {
                // ✅ Get Avatar
                console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋...`);
                const getAvatar = await axios.get(
                    `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: "arraybuffer",
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    }
                );
                await fs.writeFile(pathAvt, Buffer.from(getAvatar.data, "utf-8"));

                // ✅ Get Background
                console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽...`);
                const getBackground = await axios.get(rd, {
                    responseType: "arraybuffer",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                await fs.writeFile(pathImg, Buffer.from(getBackground.data, "utf-8"));

                // ✅ Load images
                console.log(`🎨 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾𝗌...`);
                const [baseImage, userAvatar] = await Promise.all([
                    loadImage(pathImg),
                    loadImage(pathAvt)
                ]);

                let canvas = createCanvas(baseImage.width, baseImage.height);
                let ctx = canvas.getContext("2d");

                // 🔹 Draw background
                ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

                // 🔹 Username text
                ctx.font = "𝖻𝗈𝗅𝖽 36𝗌𝖺𝗇𝗌-𝗌𝖾𝗋𝗂𝖿";
                ctx.fillStyle = "#202124";
                ctx.textAlign = "left";

                const displayText = `👤 𝖴𝗌𝖾𝗋: ${name}`;
                const lines = await this.wrapText(ctx, displayText, 1160);
                ctx.fillText(lines.join('\n'), 200, 150);

                // 🔹 User avatar circle
                ctx.save();
                ctx.beginPath();
                ctx.arc(100, 177, 35, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(userAvatar, 65, 142, 70, 70);
                ctx.restore();

                // 🔹 Play Store icon
                ctx.font = "𝖻𝗈𝗅𝖽 28𝗌𝖺𝗇𝗌-𝗌𝖾𝗋𝗂𝖿";
                ctx.fillStyle = "#4285F4";
                ctx.fillText("▶️", 50, 50);

                // 🔹 Profile visited
                ctx.font = "18𝗌𝖺𝗇𝗌-𝗌𝖾𝗋𝗂𝖿";
                ctx.fillStyle = "#5F6368";
                ctx.fillText("📂 𝖯𝗋𝗈𝖿𝗂𝗅𝖾 𝖵𝗂𝗌𝗂𝗍𝖾𝖽", 200, 190);

                // 🔹 View Profile button
                ctx.fillStyle = "#1A73E8";
                ctx.fillRect(200, 220, 180, 45);
                ctx.font = "𝖻𝗈𝗅𝖽 18𝗌𝖺𝗇𝗌-𝗌𝖾𝗋𝗂𝖿";
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText("🔎 𝖵𝗂𝖾𝗐 𝖯𝗋𝗈𝖿𝗂𝗅𝖾", 220, 250);

                // ✅ Finalize
                console.log(`💾 𝖲𝖺𝗏𝗂𝗇𝗀 𝖿𝗂𝗇𝖺𝗅 𝗂𝗆𝖺𝗀𝖾...`);
                const imageBuffer = canvas.toBuffer();
                await fs.writeFile(pathImg, imageBuffer);

                // ✅ Send message
                await message.reply({
                    body: `📱 𝖯𝗅𝖺𝗒𝗌𝗍𝗈𝗋𝖾 𝖲𝗍𝗒𝗅𝖾 𝖴𝗌𝖾𝗋 𝖢𝖺𝗋𝖽\n━━━━━━━━━━━━━━━━\n👤 𝖴𝗌𝖾𝗋: ${name}\n🆔 𝖨𝖣: ${id}`,
                    attachment: fs.createReadStream(pathImg),
                });

                console.log(`✅ 𝖯𝗅𝖺𝗒𝖲𝗍𝗈𝗋𝖾 𝖼𝖺𝗋𝖽 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒`);

            } catch (imageError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", imageError);
                
                // Fallback: send text-only info
                await message.reply({
                    body: `📱 𝖯𝗅𝖺𝗒𝗌𝗍𝗈𝗋𝖾 𝖲𝗍𝗒𝗅𝖾 𝖴𝗌𝖾𝗋 𝖢𝖺𝗋𝖽\n━━━━━━━━━━━━━━━━\n👤 𝖴𝗌𝖾𝗋: ${name}\n🆔 𝖨𝖣: ${id}\n\n❌ 𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽, 𝖻𝗎𝗍 𝗁𝖾𝗋𝖾'𝗌 𝗍𝗁𝖾 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈!`
                });
            }

            // ✅ Cleanup files
            try {
                const filesToDelete = [pathImg, pathAvt];
                for (const file of filesToDelete) {
                    if (await fs.pathExists(file)) {
                        await fs.unlink(file);
                    }
                }
                console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌");
            } catch (cleanupError) {
                console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖺𝗅𝗅 𝖿𝗂𝗅𝖾𝗌:", cleanupError.message);
            }

        } catch (err) {
            console.error("💥 𝖯𝗅𝖺𝗒𝗌𝗍𝗈𝗋𝖾 𝖤𝗋𝗋𝗈𝗋:", err);
            // Don't send error message to avoid spam
        }
    },

    // 🔹 Text wrap function
    wrapText: async function(ctx, name, maxWidth) {
        try {
            if (ctx.measureText(name).width < maxWidth) return [name];
            if (ctx.measureText('W').width > maxWidth) return null;
            const words = name.split(' ');
            const lines = [];
            let line = '';
            
            while (words.length > 0) {
                let split = false;
                while (ctx.measureText(words[0]).width >= maxWidth) {
                    const temp = words[0];
                    words[0] = temp.slice(0, -1);
                    if (split) {
                        words[1] = `${temp.slice(-1)}${words[1]}`;
                    } else {
                        split = true;
                        words.splice(1, 0, temp.slice(-1));
                    }
                }
                
                if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
                    line += `${words.shift()} `;
                } else {
                    lines.push(line.trim());
                    line = '';
                }
                
                if (words.length === 0) {
                    lines.push(line.trim());
                }
            }
            return lines;
        } catch (error) {
            console.error("❌ 𝖳𝖾𝗑𝗍 𝗐𝗋𝖺𝗉𝗉𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", error);
            return [name]; // Return original text as fallback
        }
    }
};
