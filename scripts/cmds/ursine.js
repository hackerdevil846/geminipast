const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "ursine",
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Random bear animal photo"
    },
    longDescription: {
      en: "Sends a randomly generated bear picture"
    },
    category: "fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://placebear.com/600/600";
    const filePath = path.join(__dirname, "cache/bear.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🐻 𝗥𝗮𝗻𝗱𝗼𝗺 𝗨𝗿𝘀𝗶𝗻𝗲 𝗜𝗺𝗮𝗴𝗲",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗯𝗲𝗮𝗿 𝗽𝗵𝗼𝘁𝗼.");
    });
  }
};
