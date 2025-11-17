const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "islamick",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 2,
        role: 0,
        category: "islam",
        shortDescription: {
            en: "𝑅𝐴𝑁𝐷𝑂𝑀 𝑖𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑖𝑠𝑙𝑎𝑚𝑖𝑐 𝑠𝑡𝑎𝑡𝑢𝑠 𝑣𝑖𝑑𝑒𝑜𝑠"
        },
        guide: {
            en: "{p}islamick"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "request": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            const link = [
                "https://i.imgur.com/FbnZI40.mp4",
                "https://i.imgur.com/8k6OOZg.mp4",
                "https://i.imgur.com/lgQghHX.mp4",
                "https://i.imgur.com/D7HZFSg.mp4",
                "https://i.imgur.com/vUe9Zlv.mp4",
                "https://i.imgur.com/oxFuJYw.mp4",
                "https://i.imgur.com/OKKlDBN.mp4",
                "https://i.imgur.com/6wWebFc.mp4",
                "https://i.imgur.com/K2LTmaA.mp4",
                "https://i.imgur.com/i9vKvTd.mp4",
                "https://i.imgur.com/Y6uBzxx.mp4",
                "https://i.imgur.com/ULtFVPQ.mp4",
                "https://i.imgur.com/wX8WJh3.mp4",
                "https://i.imgur.com/6A42EIx.mp4",
                "https://i.imgur.com/ozRevxt.mp4",
                "https://i.imgur.com/Gd49ZSo.mp4",
                "https://i.imgur.com/xu6lBXk.mp4",
                "https://i.imgur.com/sDNohv4.mp4",
                "https://i.imgur.com/JBu2Ie3.mp4",
                "https://i.imgur.com/UaY42rq.mp4",
                "https://i.imgur.com/NFxf731.mp4",
                "https://i.imgur.com/vv1HsMC.mp4",
                "https://i.imgur.com/Y8MPzLv.mp4",
                "https://i.imgur.com/9M1v1qK.mp4",
                "https://i.imgur.com/EgUy7v0.mp4",
                "https://i.imgur.com/IjDqg2G.mp4",
                "https://i.imgur.com/51NYqmO.mp4",
                "https://i.imgur.com/XjfJHh9.mp4",
                "https://i.imgur.com/XHrkPt4.mp4",
                "https://i.imgur.com/mqEYRdy.mp4",
                "https://i.imgur.com/NaVsFmQ.mp4",
                "https://i.imgur.com/31XSmVj.mp4",
                "https://i.imgur.com/PPamCPI.mp4",
                "https://i.imgur.com/i6Iy7iN.mp4",
            ];

            const randomLink = link[Math.floor(Math.random() * link.length)];
            
            const videoResponse = await axios.get(randomLink, {
                responseType: 'stream'
            });

            await message.reply({
                body: `╭──────•◈•───────╮\n\n🌻মানুষ হারাম ছাড়েনা অথচ সুখ শান্তি খুঁজে বেড়ায় আরাম \nমানুষ কেন বুঝতে চায় না\n সে যে খোদার গোলাম🥺। \n\nআল্লাহ আমাদের সবাইকে হারাম থেকে দূরে থাকার তৌফিক দান করুক 😭❤️‍🩹।\n\n𝗠𝗔𝗗𝗘 𝗕𝗬: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n╰──────•◈•───────╯`,
                attachment: videoResponse.data
            });

        } catch (error) {
            console.error("𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜 𝑒𝑟𝑟𝑜𝑟:", error);
            // Don't send error message to avoid spam
        }
    }
};
