module.exports = {
  config: {
    name: "mixi",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑀𝑖𝑥𝑖𝐺𝑎𝑚𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑖𝑚𝑎𝑔𝑒𝑠 𝑜𝑓 𝑀𝑖𝑥𝑖𝐺𝑎𝑚𝑖𝑛𝑔"
    },
    guide: {
      en: "{p}mixi"
    }
  },

  onStart: async function({ message }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    
    const link = [
      "https://i.imgur.com/QR4Owl7.jpg",
      "https://i.imgur.com/zWMFqnm.jpg",
      "https://i.imgur.com/cpAFLVF.jpg",
      "https://i.imgur.com/VLx4zqP.jpg",
      "https://i.imgur.com/cnqZRyU.jpg",
      "https://i.imgur.com/lJDc68Q.jpg",
      "https://i.imgur.com/PLF6sCl.jpg",
      "https://i.imgur.com/hiXh1e0.jpg",
      "https://i.imgur.com/7qxtuL9.jpg",
      "https://i.imgur.com/GFCqVxR.jpg",
      "https://i.imgur.com/s4LPMEj.jpg",
      "https://i.imgur.com/fHVcDVJ.jpg",
      "https://i.imgur.com/9TzORzC.jpg",
      "https://i.imgur.com/E9F6Aao.jpg",
      "https://i.imgur.com/heHiMLU.jpg",
      "https://i.imgur.com/KjtvvPf.jpg",
      "https://i.imgur.com/9Kav0ml.jpg",
      "https://i.imgur.com/2m1cwZm.jpg",
      "https://i.imgur.com/pMbI9aF.jpg",
      "https://i.imgur.com/KSLMQub.jpg",
      "https://i.imgur.com/bEZwIzm.jpg",
      "https://i.imgur.com/dOYl5TN.jpg",
      "https://i.imgur.com/nm4SE3p.jpg",
      "https://i.imgur.com/XbiIqB5.jpg",
      "https://i.imgur.com/8n7Hzq1.jpg",
      "https://i.imgur.com/7lcv0c9.jpg",
      "https://i.imgur.com/QR4Owl7.jpg",
      "https://i.imgur.com/2XxUU3Q.jpg",
      "https://i.imgur.com/MUI8rIi.jpg",
      "https://i.imgur.com/K4PY4cz.jpg",
      "https://i.imgur.com/nT1l1WS.jpg",
      "https://i.imgur.com/p1vU1O9.jpg",
      "https://i.imgur.com/FbsNUFH.jpg",
      "https://i.imgur.com/xvVlLC2.jpg",
      "https://i.imgur.com/om6j9Kh.jpg",
      "https://i.imgur.com/B3N2oJZ.jpg",
      "https://i.imgur.com/zmpCF6M.jpg",
      "https://i.imgur.com/kK8FXgI.jpg",
      "https://i.imgur.com/lHEqYBk.jpg",
      "https://i.imgur.com/8YkFWGh.jpg",
      "https://i.imgur.com/QSt3psG.jpg",
      "https://i.imgur.com/8GNFWs5.jpg",
      "https://i.imgur.com/7WHJBJx.jpg",
      "https://i.imgur.com/dt8g351.jpg",
    ];

    try {
      const randomLink = link[Math.floor(Math.random() * link.length)];
      
      // Download the image
      const response = await axios.get(randomLink, { responseType: 'arraybuffer' });
      fs.writeFileSync(__dirname + "/cache/mixi.jpg", Buffer.from(response.data));
      
      await message.reply({
        body: `🖼️ 𝑀𝑖𝑥𝑖𝐺𝑎𝑚𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒\n📊 𝑇𝑜𝑡𝑎𝑙 𝑖𝑚𝑎𝑔𝑒𝑠: ${link.length}`,
        attachment: fs.createReadStream(__dirname + "/cache/mixi.jpg")
      });
      
      // Clean up
      fs.unlinkSync(__dirname + "/cache/mixi.jpg");
      
    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑀𝑖𝑥𝑖 𝑖𝑚𝑎𝑔𝑒");
    }
  }
};
