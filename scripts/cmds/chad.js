const jimp = require("jimp");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "chad",
        aliases: ["gigachad", "chadmeme"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "😎 𝐶𝑟𝑒𝑎𝑡𝑒 𝐺𝑖𝑔𝑎 𝐶ℎ𝑎𝑑 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
        },
        longDescription: {
            en: "🖼️ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝐶ℎ𝑎𝑑 𝑚𝑒𝑚𝑒 𝑢𝑠𝑖𝑛𝑔 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟𝑠' 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
        },
        guide: {
            en: "{p}chad [@𝑡𝑎𝑔]"
        },
        dependencies: {
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            const mention = Object.keys(event.mentions);
            if (mention.length === 0) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝐶ℎ𝑎𝑑 𝑚𝑒𝑚𝑒!");
            }

            const one = mention.length === 1 ? event.senderID : mention[1];
            const two = mention[0];

            const imagePath = await createChadImage(one, two);
            
            await message.reply({
                body: "😎 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝐶ℎ𝑎𝑑 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛!",
                attachment: fs.createReadStream(imagePath)
            });

            // Clean up
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

        } catch (error) {
            console.error("𝐶ℎ𝑎𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            // Don't send error message to avoid spam
        }
    }
};

async function createChadImage(one, two) {
    try {
        const [avone, avtwo, template] = await Promise.all([
            jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
            jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
            jimp.read("https://i.postimg.cc/5y4vNVG9/desktop-wallpaper-giga-chad-ideas-chad-memes-muscle-men-thumbnail.jpg")
        ]);

        // Create circular avatars
        avone.circle();
        avtwo.circle();

        // Resize template
        template.resize(1080, 1350);
        
        // Composite images onto template
        template.composite(avone.resize(360, 360), 180, 380);
        template.composite(avtwo.resize(300, 300), 475, 180);

        const imagePath = "chad.png";
        await template.writeAsync(imagePath);
        return imagePath;

    } catch (error) {
        console.error("𝐼𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝐶ℎ𝑎𝑑 𝑖𝑚𝑎𝑔𝑒");
    }
}
