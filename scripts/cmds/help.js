const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const { commands } = global.GoatBot;
const ITEMS_PER_PAGE = 10;

// GIF URLs for random selection
const gifURLs = [
    "https://i.imgur.com/ejqdK51.gif",
    "https://i.imgur.com/ltIztKe.gif",
    "https://i.imgur.com/5oqrQ0i.gif",
    "https://i.imgur.com/qf2aZH8.gif",
    "https://i.imgur.com/3QzYyye.gif",
    "https://i.imgur.com/ffxzucB.gif",
    "https://i.imgur.com/3QSsSzA.gif",
    "https://i.imgur.com/Ih819LH.gif"
];

// Backup image URLs
const backupImages = [
    "https://i.imgur.com/XetbfAe.jpg", 
    "https://i.imgur.com/4dwdpG9.jpg", 
    "https://i.imgur.com/9My3K5w.jpg", 
    "https://i.imgur.com/vK67ofl.jpg", 
    "https://i.imgur.com/fGwlsFL.jpg",
    "https://i.imgur.com/a3JShJK.jpeg"
];

// Helper function to download GIF
function downloadGif(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                fs.unlink(dest, () => {});
                return reject(new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 '${url}' (${res.statusCode})`));
            }
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
        }).on("error", (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

module.exports = {
    config: {
        name: "help",
        aliases: ["h"],
        version: "1.4",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "info",
        shortDescription: {
            en: "𝖣𝗂𝗌𝗉𝗅𝖺𝗒𝗌 𝖺𝗅𝗅 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌"
        },
        longDescription: {
            en: "𝖲𝗁𝗈𝗐𝗌 𝖺𝗅𝗅 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝗐𝗂𝗍𝗁 𝖽𝖾𝗍𝖺𝗂𝗅𝗌 𝖺𝗇𝖽 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂𝖾𝗌"
        },
        guide: {
            en: "{p}help\n{p}help [𝗉𝖺𝗀𝖾]\n{p}help -[𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗒]\n{p}help [𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗇𝖺𝗆𝖾]"
        },
        dependencies: {
            "fs-extra": "",
            "path": "",
            "https": ""
        }
    },

    onChat: async function ({ event, message }) {
        try {
            const text = (message.body || "").trim();
            if (!text) return;

            const parts = text.toLowerCase().split(/\s+/);
            const cmd = parts.shift();
            const args = parts;

            if (cmd !== "help" && cmd !== "h") return;

            return this.onStart({ message, args, event, role: 0 });
        } catch (error) {
            console.error("💥 𝖧𝖾𝗅𝗉 𝖼𝗁𝖺𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function ({ message, args, event, role }) {
        try {
            // Dependency check
            let fsAvailable = true;
            let pathAvailable = true;
            let httpsAvailable = true;
            
            try {
                require("fs-extra");
                require("path");
                require("https");
            } catch (e) {
                fsAvailable = false;
                pathAvailable = false;
                httpsAvailable = false;
            }

            if (!fsAvailable || !pathAvailable || !httpsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗉𝖺𝗍𝗁, 𝖺𝗇𝖽 𝗁𝗍𝗍𝗉𝗌.");
            }

            const top = "╭━ 🎯 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲 ━╮";
            const mid = "┃";
            const sep = "┃━━━━━━━━━━━━━━━━━";
            const bottom = "╰━━━━━━━━━━━━━━━━━";

            const arg = args[0]?.toLowerCase();

            // Group commands by normalized category
            const categories = {};
            for (const [name, cmd] of commands.entries()) {
                if (cmd.config?.role <= role) {
                    // Normalize category: trim + uppercase
                    const cat = (cmd.config.category || "𝖴𝗇𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂𝗓𝖾𝖽").trim().toUpperCase();
                    if (!categories[cat]) categories[cat] = [];
                    categories[cat].push(name);
                }
            }

            // Get random attachment
            let attachment = null;
            try {
                // Pick random GIF
                const randomGifURL = gifURLs[Math.floor(Math.random() * gifURLs.length)];
                const gifFolder = path.join(__dirname, "cache");
                if (!fs.existsSync(gifFolder)) {
                    fs.mkdirSync(gifFolder, { recursive: true });
                }
                const gifName = `help_${Date.now()}.gif`;
                const gifPath = path.join(gifFolder, gifName);

                // Download GIF
                await downloadGif(randomGifURL, gifPath);
                
                // Verify file was downloaded successfully
                if (fs.existsSync(gifPath)) {
                    const stats = fs.statSync(gifPath);
                    if (stats.size > 0) {
                        attachment = fs.createReadStream(gifPath);
                    } else {
                        throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖦𝖨𝖥 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                    }
                }
            } catch (gifError) {
                console.error("❌ 𝖦𝖨𝖥 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", gifError.message);
                
                // Fallback to random backup image
                try {
                    const randomImageURL = backupImages[Math.floor(Math.random() * backupImages.length)];
                    attachment = await global.utils.getStreamFromURL(randomImageURL);
                } catch (imageError) {
                    console.error("❌ 𝖡𝖺𝖼𝗄𝗎𝗉 𝗂𝗆𝖺𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:", imageError.message);
                }
            }

            // Pagination handling (page number or no arg)
            if (!arg || /^\d+$/.test(arg)) {
                const page = arg ? Math.max(1, parseInt(arg)) : 1;
                const catNames = Object.keys(categories).sort((a, b) => a.localeCompare(b));
                const totalPages = Math.ceil(catNames.length / ITEMS_PER_PAGE);

                if (page > totalPages) {
                    return message.reply(`❌ 𝖯𝖺𝗀𝖾 ${page} 𝖽𝗈𝖾𝗌 𝗇𝗈𝗍 𝖾𝗑𝗂𝗌𝗍. 𝖳𝗈𝗍𝖺𝗅 𝗉𝖺𝗀𝖾𝗌: ${totalPages}`);
                }

                const startIndex = (page - 1) * ITEMS_PER_PAGE;
                const selectedCats = catNames.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                let body = `${top}\n${mid} 📖 𝖯𝖺𝗀𝖾 ${page}/${totalPages}\n${sep}\n`;
                body += `${mid} 🔑 𝖯𝗋𝖾𝖿𝗂𝗑: ${global.GoatBot.config.prefix}\n`;
                body += `${mid} 📊 𝖳𝗈𝗍𝖺𝗅: ${commands.size} 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌\n${sep}\n`;

                selectedCats.forEach((cat) => {
                    const cmds = categories[cat];
                    body += `${mid} 📂 ${cat} [${cmds.length}]\n`;
                    cmds.forEach((n) => {
                        body += `${mid} ✦ ${n}\n`;
                    });
                    body += `${sep}\n`;
                });

                body += `${bottom}`;

                if (attachment) {
                    return message.reply({ body, attachment });
                } else {
                    return message.reply(body);
                }
            }

            // Category filter by -category
            if (arg.startsWith("-")) {
                const catName = arg.slice(1).toUpperCase();
                const cmdsInCat = [];

                for (const [name, cmd] of commands.entries()) {
                    const cat = (cmd.config.category || "𝖴𝗇𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂𝗓𝖾𝖽").trim().toUpperCase();
                    if (cat === catName && cmd.config.role <= role) {
                        cmdsInCat.push(`${mid} ✦ ${name}`);
                    }
                }

                if (!cmdsInCat.length) {
                    return message.reply(`❌ 𝖭𝗈 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗒 "${catName}"`);
                }

                const categoryBody = `${top}\n${mid} 📁 𝖢𝖠𝖳𝖤𝖦𝖮𝖱𝖸: ${catName}\n${sep}\n` +
                    `${cmdsInCat.join("\n")}\n${bottom}`;

                if (attachment) {
                    return message.reply({ body: categoryBody, attachment });
                } else {
                    return message.reply(categoryBody);
                }
            }

            // Single command details
            const cmdObj = commands.get(arg) || commands.get(global.GoatBot.aliases.get(arg));
            if (!cmdObj || cmdObj.config.role > role) {
                return message.reply(`❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 "${arg}" 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗈𝗋 𝗒𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗌𝗂𝗈𝗇.`);
            }

            const cfg = cmdObj.config;
            const shortDesc = cfg.shortDescription?.en || "𝖭𝗈 𝗌𝗁𝗈𝗋𝗍 𝖽𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇.";
            const longDesc = cfg.longDescription?.en || "𝖭𝗈 𝖽𝖾𝗍𝖺𝗂𝗅𝖾𝖽 𝖽𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇.";
            const usage = cfg.guide?.en || "𝖭𝗈 𝗎𝗌𝖺𝗀𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽.";

            const details =
                `${top}\n` +
                `${mid} 📌 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 𝖣𝖤𝖳𝖠𝖨𝖫𝖲\n${sep}\n` +
                `${mid} 📁 𝖢𝖺𝗍𝖾𝗀𝗈𝗋𝗒: ${cfg.category || "𝖴𝗇𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂𝗓𝖾𝖽"}\n` +
                `${mid} 📄 𝖭𝖺𝗆𝖾: ${cfg.name}\n` +
                `${mid} 📜 𝖲𝗁𝗈𝗋𝗍: ${shortDesc}\n` +
                `${mid} 📖 𝖫𝗈𝗇𝗀:\n${mid} ${longDesc.replace(/\n/g, `\n${mid} `)}\n` +
                `${mid} 🎯 𝖴𝗌𝖺𝗀𝖾: ${usage.replace(/{p}/g, global.GoatBot.config.prefix).replace(/{n}/g, cfg.name)}\n` +
                `${mid} 👤 𝖠𝗎𝗍𝗁𝗈𝗋: ${cfg.author || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇"}\n` +
                bottom;

            if (attachment) {
                return message.reply({ body: details, attachment });
            } else {
                return message.reply(details);
            }

        } catch (error) {
            console.error("💥 𝖧𝖾𝗅𝗉 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗁𝖾𝗅𝗉 𝗆𝖾𝗇𝗎.";
            
            if (error.message.includes('commands')) {
                errorMessage = "❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝗇𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('network') || error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
