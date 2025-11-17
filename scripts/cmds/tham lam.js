module.exports = {
    config: {
        name: "tham lam",
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝑇ℎ𝑎𝑚 𝑙𝑎𝑚 𝑎𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒"
        },
        longDescription: {
            en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 '𝑡ℎ𝑎𝑚 𝑙𝑎𝑚' 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑣𝑖𝑑𝑒𝑜"
        },
        guide: {
            en: ""
        }
    },

    onStart: async function() {},
    
    onChat: async function({ event, message }) {
        const fs = require("fs-extra");
        
        // Check if message contains "tham lam" (case insensitive)
        if (event.body && event.body.toLowerCase().includes("tham lam")) {
            try {
                const videoPath = __dirname + "/noprefix/thamlam.mp4";
                
                // Check if video file exists
                if (fs.existsSync(videoPath)) {
                    const msg = await message.reply({
                        body: "𝑌𝑒𝑠! 𝑠𝑜 𝑣𝑒𝑟𝑦 𝑔𝑟𝑒𝑒𝑑𝑦 👀",
                        attachment: fs.createReadStream(videoPath)
                    });
                    
                    // Auto-unsend after 10 seconds
                    setTimeout(async () => {
                        try {
                            await message.unsend(msg.messageID);
                        } catch (e) {
                            console.log("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", e);
                        }
                    }, 10000);
                    
                } else {
                    await message.reply("❌ 𝑉𝑖𝑑𝑒𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑!");
                }
            } catch (error) {
                console.error("𝐸𝑟𝑟𝑜𝑟:", error);
                await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑣𝑖𝑑𝑒𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
            }
        }
    }
};
