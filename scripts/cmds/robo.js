const https = require("https");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "robo",
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝑅𝑜𝑏𝑜 𝑎𝑣𝑎𝑡𝑎𝑟"
        },
        longDescription: {
            en: "𝐴𝑣𝑎𝑡𝑎𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑓𝑟𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        category: "𝑓𝑢𝑛",
        guide: {
            en: "{p}robo [𝑡𝑒𝑥𝑡]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const text = args.join(" ") || "𝑔𝑢𝑒𝑠𝑡";
            const url = `https://robohash.org/${encodeURIComponent(text)}`;
            const file = path.join(__dirname, "cache/robo.jpg");
            
            // Ensure cache directory exists
            await fs.ensureDir(path.dirname(file));
            
            const f = fs.createWriteStream(file);

            https.get(url, (r) => {
                r.pipe(f);
                f.on("finish", () => {
                    message.reply({
                        body: "🤖 𝒀𝒐𝒖𝒓 𝑹𝒐𝒃𝒐 𝑨𝒗𝒂𝒕𝒂𝒓:",
                        attachment: fs.createReadStream(file)
                    });
                    
                    // Clean up after sending
                    setTimeout(() => {
                        try {
                            fs.unlinkSync(file);
                        } catch (e) {}
                    }, 5000);
                });
            }).on("error", (error) => {
                console.error("𝑅𝑜𝑏𝑜 𝑒𝑟𝑟𝑜𝑟:", error);
                message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑟𝑜𝑏𝑜 𝑎𝑣𝑎𝑡𝑎𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
            });

        } catch (error) {
            console.error("𝑅𝑜𝑏𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
    }
};
