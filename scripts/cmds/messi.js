module.exports = {
  config: {
    name: "goat",
    aliases: ["messi"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝑆𝑒𝑛𝑑 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑝ℎ𝑜𝑡𝑜 𝑜𝑓 𝑀𝑒𝑠𝑠𝑖"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑏𝑜𝑡ℎ 𝑖𝑚𝑎𝑔𝑒 𝑎𝑛𝑑 𝑈𝑅𝐿 𝑜𝑓 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝐿𝑖𝑜𝑛𝑒𝑙 𝑀𝑒𝑠𝑠𝑖 𝑝ℎ𝑜𝑡𝑜"
    },
    category: "𝑓𝑜𝑜𝑡𝑏𝑎𝑙𝑙",
    guide: {
      en: "{𝑝𝑛}"
    }
  },

  onStart: async function ({ message }) {
    try {
      const fs = require("fs-extra");
      const path = require("path");
      const https = require("https");
      
      const links = [
        "https://i.imgur.com/ahKcoO3.jpg",
        "https://i.imgur.com/Vsf4rM3.jpg",
        "https://i.imgur.com/ximEjww.jpg",
        "https://i.imgur.com/ukYhm0D.jpg",
        "https://i.imgur.com/Poice6v.jpg",
        "https://i.imgur.com/5yMvy5Z.jpg",
        "https://i.imgur.com/ndyprcd.jpg",
        "https://i.imgur.com/Pm2gC6I.jpg",
        "https://i.imgur.com/wxxHuAG.jpg",
        "https://i.imgur.com/GwOCq59.jpg",
        "https://i.imgur.com/oM0jc4i.jpg",
        "https://i.imgur.com/dJ0OUef.jpg",
        "https://i.imgur.com/iurRGPT.jpg",
        "https://i.imgur.com/jogjche.jpg",
        "https://i.imgur.com/TiyhKjG.jpg",
        "https://i.imgur.com/AwlBM23.jpg",
        "https://i.imgur.com/9OLSXZD.jpg",
        "https://i.imgur.com/itscmiy.jpg",
        "https://i.imgur.com/FsnCelU.jpg",
        "https://i.imgur.com/c7BCwDF.jpg",
        "https://i.imgur.com/3cnR6xh.jpg",
        "https://i.imgur.com/TZqepnU.jpg",
        "https://i.imgur.com/kYxEPrD.jpg",
        "https://i.imgur.com/9ZjD5nX.jpg",
        "https://i.imgur.com/YWyI4hP.jpg"
      ];

      const randomLink = links[Math.floor(Math.random() * links.length)];
      const imgName = `goat_${randomLink.split('/').pop()}`;
      const imgPath = path.join(__dirname, "cache", imgName);

      if (!fs.existsSync(imgPath)) {
        await new Promise((resolve, reject) => {
          https.get(randomLink, (res) => {
            const fileStream = fs.createWriteStream(imgPath);
            res.pipe(fileStream);
            fileStream.on("finish", () => {
              fileStream.close();
              resolve();
            });
          }).on("error", (err) => {
            fs.unlinkSync(imgPath);
            reject(err);
          });
        });
      }

      message.reply({
        body: `「 𝑇ℎ𝑒 𝐺𝑂𝐴𝑇 ℎ𝑎𝑠 𝑎𝑟𝑟𝑖𝑣𝑒𝑑 🐐 」\n𝐼𝑚𝑎𝑔𝑒 𝑈𝑅𝐿: ${randomLink}`,
        attachment: fs.createReadStream(imgPath)
      });

    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑀𝑒𝑠𝑠𝑖 𝑖𝑚𝑎𝑔𝑒:", error);
      message.send("𝑆𝑜𝑟𝑟𝑦, 𝑐𝑜𝑢𝑙𝑑𝑛'𝑡 𝑠𝑒𝑛𝑑 𝑡ℎ𝑒 𝑀𝑒𝑠𝑠𝑖 𝑖𝑚𝑎𝑔𝑒 𝑟𝑖𝑔ℎ𝑡 𝑛𝑜𝑤. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!");
    }
  }
};
