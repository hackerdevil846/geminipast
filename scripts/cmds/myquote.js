const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "myquote",
    aliases: ["quote", "quotemaker"],
    version: "2.0",
    role: 0,
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    shortDescription: {
      en: "✨ 𝐶𝑟𝑒𝑎𝑡𝑒 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑞𝑢𝑜𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑞𝑢𝑜𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡 𝑎𝑛𝑑 𝑎𝑢𝑡ℎ𝑜𝑟 𝑛𝑎𝑚𝑒"
    },
    category: "𝑓𝑢𝑛",
    guide: {
      en: "{p}myquote [𝑞𝑢𝑜𝑡𝑒 𝑡𝑒𝑥𝑡] = [𝑎𝑢𝑡ℎ𝑜𝑟 𝑛𝑎𝑚𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "canvas": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      // Dependency check
      try {
        require("axios");
        require("canvas");
        require("fs-extra");
      } catch (e) {
        return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
      }

      if (!args.length) {
        return message.reply("📝 𝑈𝑠𝑎𝑔𝑒:\n𝘮𝘺𝘲𝘶𝘰𝘵𝘦 [𝘲𝘶𝘰𝘵𝘦 𝘵𝘦𝘹𝘵] = [𝘢𝘶𝘵𝘩𝘰𝘳 𝘯𝘢𝘮𝘵]\n\n✨ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n𝘮𝘺𝘲𝘶𝘰𝘵𝘦 𝐿𝑖𝑓𝑒 𝑖𝑠 𝑎 𝑗𝑜𝑢𝑟𝑛𝑒𝑦 = 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑");
      }

      const input = args.join(' ').split('=');
      if (input.length < 2) {
        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡!\n\n✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒:\n𝘮𝘺𝘲𝘶𝘰𝘵𝘦 [𝘲𝘶𝘰𝘵𝘦] = [𝘢𝘶𝘵𝘩𝘰𝘳 𝘯𝘢𝘮𝘦]\n\n🌠 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n𝘮𝘺𝘲𝘶𝘰𝘵𝘦 𝐷𝑟𝑒𝑎𝑚 𝑏𝑖𝑔 = 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑");
      }

      const quoteText = input.slice(0, -1).join('=').trim();
      const authorName = input[input.length - 1].trim();

      if (!quoteText || !authorName) {
        return message.reply("⚠️ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑎𝑡𝑎!\n\n✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑏𝑜𝑡ℎ 𝑞𝑢𝑜𝑡𝑒 𝑎𝑛𝑑 𝑎𝑢𝑡ℎ𝑜𝑟 𝑛𝑎𝑚𝑒\n\n🌠 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n𝘮𝘺𝘲𝘶𝘰𝘵𝘦 𝑇ℎ𝑒 𝑝𝑎𝑠𝑡 𝑖𝑠 𝑎 𝑙𝑒𝑠𝑠𝑜𝑛 = 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑");
      }

      const bgList = [
        'https://i.postimg.cc/G3WNFpch/7b6eb20bccd6d9d97027e0e0650e350e.jpg',
        'https://i.postimg.cc/kMQNHMQ5/87ee51adca4b4c74b5d97089d67159d0.jpg',
        'https://i.postimg.cc/Kj01yWc0/a974ffafa41e455bcaea2299119dadfc.jpg',
        'https://i.postimg.cc/3Jy8RNt8/8fad3805fb3efb7bcff8548ff4221578.jpg',
        'https://i.postimg.cc/d0QtJBXX/cc96260ae6a0ff546a6dd1bb768cdec8.jpg',
        'https://i.postimg.cc/cCypL1CH/20264bf8afa0f50fa5438a7c54e8ea66.jpg',
        'https://i.postimg.cc/zfH2Hm9R/bdf07420724bebac14e6265d3c7af289.jpg',
        'https://i.postimg.cc/zBcftgxQ/9b54a151021d03ef1f0c66c7990bd932.jpg',
        'https://i.postimg.cc/qMXN0zqN/744f898fa054f4fe858586ae8d75fca1.jpg',
        'https://i.postimg.cc/jdKj8tct/dbe1d5f1fe60b51f693f801da1e0b41a.jpg',
        'https://i.postimg.cc/SsCyrvzn/165a712429c6fd2a87be9ee62a184591.jpg',
        'https://i.postimg.cc/26RYV7Xr/a5777f6a212c2479b7186c3c2587239b.jpg',
        'https://i.postimg.cc/R0f55nC8/0862e19e74bd77275d1742009f3262fd.jpg',
        'https://i.postimg.cc/ry9d2DKK/423cab6ce6fc5f88a7c87ff1d0c44710.jpg',
        'https://i.postimg.cc/yx688TkW/835c7646bac895ed6f7c962b12198b3c.jpg',
        'https://i.postimg.cc/4dWTBRxN/1e021ed3df7a2bc0a32414a2147ee309.jpg',
        'https://i.postimg.cc/c1zpHmKj/e24bb1e4acc51c932fbc2516afcef1b3.jpg',
        'https://i.postimg.cc/yNQHTzd6/b37aff20822079e780e40fb34b91677b.jpg',
        'https://i.postimg.cc/WbGcHZ3H/1b211280d90596a82922286f4c366627.jpg',
        'https://i.postimg.cc/v8nJ4nWZ/eb4604a0b7be1fdced9dad68768e49b0.jpg',
        'https://i.postimg.cc/NjjCk2rT/d51aaf23c403c750e78a35e82223d231.jpg',
        'https://i.postimg.cc/y6hfqymc/1876eb8d0229790e8622ed0de62b81f3.jpg',
        'https://i.postimg.cc/zvqFD4CW/1bd3f019ea943eddfb5a182eccf3e39c.jpg',
        'https://i.postimg.cc/RVsL9sN6/5987cdfd694568f4969ff7e8ad8c8775.jpg',
        'https://i.postimg.cc/C1gjJ96t/693249283f6705a6b8fd8e8ac27200de.jpg',
        'https://i.postimg.cc/Cxnk0w3X/7a597e7e1d64fcd1b000f6c113eecc44.jpg',
        'https://i.postimg.cc/DZ6b60GJ/be0128c8deb8c4c1247fb3cb297ad711.jpg',
        'https://i.postimg.cc/QxHWgXdC/249a75b4d80692e13e8f7d02e1ae7156.jpg',
        'https://i.postimg.cc/qMMQTgHj/11c38f041c5da1b64ab58525ca00f49c.jpg',
        'https://i.postimg.cc/fRVKVFLd/1836ebe991181c6af5f961f98584527f.jpg',
        'https://i.postimg.cc/4dQbCR8D/a7a385de8e59d1d031c6d0297016bc03.jpg',
        'https://i.postimg.cc/8C8hjzx8/e8ea19d5f3f4f3949402ff854d6b574c.jpg',
        'https://i.postimg.cc/Pr9DRqXL/2fb90fae9160be272365e3faaa475968.jpg',
        'https://i.postimg.cc/Dzdb0dqs/49e024d7d35c6f291b44acc089682976.jpg',
        'https://i.postimg.cc/Qtf9k8Yd/5f33dedbdddb3209ebc6d6429b17fe30.jpg',
        'https://i.postimg.cc/8knf7Cry/46c5b06a29c71e0b60a63bd188dfa10f.jpg',
        'https://i.postimg.cc/tgyYKZLg/6d009cd86d8afc920c78a1c0d019cdb0.jpg',
        'https://i.postimg.cc/xjWHsCTX/a5e241a8aef037a79ff64a031253d0a8.jpg',
        'https://i.postimg.cc/tCW68jY2/169e2ed4e09bbc94f7ac0ba3be2d0ad7.jpg',
        'https://i.postimg.cc/JzQk453X/be21b223a65c71bcd7fea98edb632697.jpg'
      ];

      const bgURL = bgList[Math.floor(Math.random() * bgList.length)];
      const response = await axios.get(bgURL, { responseType: 'arraybuffer' });
      const bgImg = Buffer.from(response.data, 'binary');
      
      const bgImage = await loadImage(bgImg);
      const canvas = createCanvas(bgImage.width, bgImage.height);
      const ctx = canvas.getContext('2d');
      
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      ctx.font = 'bold 32px "Arial"';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 8;
      ctx.textAlign = 'center';
      
      const maxWidth = canvas.width * 0.8;
      const lineHeight = 42;
      const margin = 50;
      let lines = [];
      let currentLine = '';

      quoteText.split(' ').forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const { width } = ctx.measureText(testLine);
        
        if (width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);
      
      const textY = canvas.height / 2 - (lines.length * lineHeight) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, textY + (i * lineHeight));
      });
      
      ctx.font = 'italic 28px "Georgia"';
      ctx.fillText(`— ${authorName}`, canvas.width / 2, textY + lines.length * lineHeight + 40);
      
      const outputPath = `${__dirname}/cache/quote_${event.senderID}.jpg`;
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createJPEGStream({ quality: 0.95 });
      
      stream.pipe(out);
      
      await new Promise((resolve, reject) => {
        out.on('finish', resolve);
        out.on('error', reject);
      });
      
      await message.reply({
        body: "✨ 𝑄𝑢𝑜𝑡𝑒 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
        attachment: fs.createReadStream(outputPath)
      });
      
      // Clean up
      fs.unlinkSync(outputPath);
      
    } catch (error) {
      console.error(error);
      await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑞𝑢𝑜𝑡𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
