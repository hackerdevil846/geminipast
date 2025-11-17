module.exports = {
    config: {
        name: "vnmeme",
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑉𝑖𝑒𝑡𝑛𝑎𝑚𝑒𝑠𝑒 𝑚𝑒𝑚𝑒𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑉𝑖𝑒𝑡𝑛𝑎𝑚𝑒𝑠𝑒 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        guide: {
            en: "{𝑝}𝑣𝑛𝑚𝑒𝑚𝑒"
        }
    },

    onStart: async function ({ event, message }) {
        try {
            const fs = require("fs-extra");
            const axios = require("axios");
            const path = require("path");
            
            const link = [
                "https://i.imgur.com/Jy5bCx2.jpg",
                "https://i.imgur.com/yAtQUQu.jpg",
                "https://i.imgur.com/MdhUHdV.jpg",
                "https://i.imgur.com/KKmkIop.jpg",
                "https://i.imgur.com/Adr4be1.jpg",
                "https://i.imgur.com/s2giVqG.jpg",
                "https://i.imgur.com/OLp3vhz.png",
                "https://i.imgur.com/W2VGWqb.jpg",
                "https://i.imgur.com/EBJcGFf.jpg",
                "https://i.imgur.com/WYchdJG.jpg",
                "https://i.imgur.com/dwVGQD6.jpg",
                "https://i.imgur.com/3MbRb7U.jpg",
                "https://i.imgur.com/cpzJeWp.jpg",
                "https://i.imgur.com/D281oqO.jpg",
                "https://i.imgur.com/JNKZA8P.jpg",
                "https://i.imgur.com/5Nl04oP.jpg",
                "https://i.imgur.com/wMxv9qa.jpg",
                "https://i.imgur.com/UmfVLiD.jpg",
                "https://i.imgur.com/fIpWNOy.jpg",
                "https://i.imgur.com/GtcFh2Y.jpg",
                "https://i.imgur.com/1HFEzu0.jpg",
                "https://i.imgur.com/qSuCJzj.jpg",
                "https://i.imgur.com/AZpbUsz.png",
                "https://i.imgur.com/JtGE76p.jpg",
                "https://i.imgur.com/ZJYI9pQ.jpg",
                "https://i.imgur.com/nC9aCJZ.jpg",
                "https://i.imgur.com/BI9eFuS.jpg",
                "https://i.imgur.com/ZPUguG2.jpg",
                "https://i.imgur.com/IA8Dl6W.jpg",
                "https://i.imgur.com/xYvvgIS.jpg",
                "https://i.imgur.com/P8Cuobo.jpg",
                "https://i.imgur.com/ZB3G2XY.jpg",
                "https://i.imgur.com/X8dyJFy.jpg",
                "https://i.imgur.com/DXbEYs5.jpg",
                "https://i.imgur.com/Kp4oBzH.jpg",
            ];
            
            const randomLink = link[Math.floor(Math.random() * link.length)];
            const imagePath = __dirname + "/cache/vnmeme.jpg";
            
            // Download the image
            const response = await axios.get(randomLink, {
                responseType: 'arraybuffer'
            });
            
            fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
            
            await message.reply({
                body: "𝑉𝑖𝑒𝑡𝑛𝑎𝑚𝑒𝑠𝑒 𝑚𝑒𝑚𝑒𝑠 𝑎𝑟𝑒 𝑠𝑜 𝑓𝑢𝑛𝑛𝑦! 🤣",
                attachment: fs.createReadStream(imagePath)
            });
            
            // Clean up after 5 seconds
            setTimeout(() => {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }, 5000);
            
        } catch (error) {
            console.error("𝑉𝑁𝑀𝑒𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑉𝑖𝑒𝑡𝑛𝑎𝑚𝑒𝑠𝑒 𝑚𝑒𝑚𝑒!");
        }
    }
};
