const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");
const superfetch = require("node-superfetch");

module.exports = {
  config: {
    name: "familyphoto",
    aliases: [],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 1,
    category: "image",
    shortDescription: {
      en: "🎭 𝐶𝑟𝑒𝑎𝑡𝑒 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑓𝑎𝑚𝑖𝑙𝑦 𝑝ℎ𝑜𝑡𝑜𝑠 𝑤𝑖𝑡ℎ 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠' 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑎𝑏𝑙𝑒 𝑓𝑎𝑚𝑖𝑙𝑦 𝑝ℎ𝑜𝑡𝑜𝑠 𝑤𝑖𝑡ℎ 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑎𝑣𝑎𝑡𝑎𝑟𝑠 𝑎𝑛𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑖𝑡𝑙𝑒𝑠"
    },
    guide: {
      en: "{p}familyphoto [𝑠𝑖𝑧𝑒] [#𝑐𝑜𝑙𝑜𝑟] [𝑡𝑖𝑡𝑙𝑒 𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "jimp": "",
      "node-superfetch": ""
    },
    envConfig: {
      maxParticipants: 100,
      defaultBackground: "https://i.ibb.co/QvG4LTw/image.png",
      frameImage: "https://i.ibb.co/H41cdDM/1624768781720.png",
      fontUrl: "https://drive.google.com/uc?id=1q0FPVuJ-Lq7-tvOYH0ILgbjrX1boW7KW&export=download",
      helpImage: "https://i.ibb.co/m9R36Pp/image.png"
    }
  },

  onStart: async function({ api, event, args, threadsData, message }) {
    // Check if Canvas is available, if not use alternative method
    let Canvas;
    try {
      Canvas = require("canvas");
    } catch (error) {
      return message.reply("❌ 𝐶𝑎𝑛𝑣𝑎𝑠 𝑖𝑠 𝑛𝑜𝑡 𝑖𝑛𝑠𝑡𝑎𝑙𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑖𝑡 𝑢𝑠𝑖𝑛𝑔: 𝑛𝑝𝑚 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠");
    }

    try {
      // Check dependencies
      if (!fs.existsSync || !axios || !jimp || !superfetch) {
        throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
      }

      // Check if command is already running
      if (global.client.familyphoto) {
        return message.reply("🔄 𝐴𝑛𝑜𝑡ℎ𝑒𝑟 𝑓𝑎𝑚𝑖𝑙𝑦 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑖𝑠 𝑏𝑒𝑖𝑛𝑔 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...");
      }
      global.client.familyphoto = true;
      
      const timestart = Date.now();
      const { threadID, messageID } = event;
      const TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
      
      // Ensure cache directory exists
      if (!fs.existsSync(__dirname + '/cache')) {
        fs.mkdirSync(__dirname + '/cache', { recursive: true });
      }
      
      // Download font if not exists
      if (!fs.existsSync(__dirname + '/cache/VNCORSI.ttf')) {
        await message.reply("📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑓𝑜𝑛𝑡...");
        try {
          const fontData = await axios.get(this.config.envConfig.fontUrl, { responseType: "arraybuffer", timeout: 30000 });
          fs.writeFileSync(__dirname + "/cache/VNCORSI.ttf", Buffer.from(fontData.data));
        } catch (fontError) {
          global.client.familyphoto = false;
          return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑜𝑛𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
      }
      
      // Show help if no arguments or help requested
      if (!args[0] || isNaN(args[0]) || args[0].toLowerCase() === "help") {
        if (!fs.existsSync(__dirname + "/cache/help_family.png")) {
          try {
            const helpImg = await axios.get(this.config.envConfig.helpImage, { responseType: "arraybuffer", timeout: 30000 });
            fs.writeFileSync(__dirname + "/cache/help_family.png", Buffer.from(helpImg.data));
          } catch (helpError) {
            console.error("Failed to download help image:", helpError);
          }
        }
        global.client.familyphoto = false;
        
        const helpMessage = {
          body: "🎨 𝗙𝗔𝗠𝗜𝗟𝗬 𝗣𝗛𝗢𝗧𝗢 𝗖𝗥𝗘𝗔𝗧𝗢𝗥\n\n" +
                "📝 𝗨𝘀𝗮𝗴𝗲: familyphoto <size> [#color] <title>\n\n" +
                "• 𝗦𝗶𝘇𝗲: Avatar size in pixels (0 for auto-size)\n" +
                "• 𝗖𝗼𝗹𝗼𝗿: Hex color code for title (e.g. #FF0000)\n" +
                "• 𝗧𝗶𝘁𝗹𝗲: Custom title text (optional)\n\n" +
                "📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀:\n" +
                "• familyphoto 200 #FFFFFF My Family\n" +
                "• familyphoto 0 #FFD700 Best Friends Forever"
        };
        
        if (fs.existsSync(__dirname + "/cache/help_family.png")) {
          helpMessage.attachment = fs.createReadStream(__dirname + "/cache/help_family.png");
        }
        
        return message.reply(helpMessage);
      }
      
      // Get thread information
      const threadInfo = await threadsData.get(threadID);
      const adminIDs = threadInfo.adminIDs ? threadInfo.adminIDs.map(admin => admin.id) : [];
      const participantIDs = threadInfo.participantIDs || [];
      
      // Validate participant count
      if (participantIDs.length > this.config.envConfig.maxParticipants) {
        global.client.familyphoto = false;
        return message.reply(`❌ 𝑇ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝 ℎ𝑎𝑠 𝑡𝑜𝑜 𝑚𝑎𝑛𝑦 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 (${participantIDs.length}). 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 𝑎𝑙𝑙𝑜𝑤𝑒𝑑 𝑖𝑠 ${this.config.envConfig.maxParticipants}.`);
      }
      
      if (participantIDs.length === 0) {
        global.client.familyphoto = false;
        return message.reply("❌ 𝑁𝑜 𝑝𝑎𝑟𝑡𝑖𝑐𝑖𝑝𝑎𝑛𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.");
      }
      
      // Load background image with error handling
      let background;
      try {
        const bgResponse = await axios.get(this.config.envConfig.defaultBackground, { responseType: "arraybuffer", timeout: 30000 });
        background = await Canvas.loadImage(Buffer.from(bgResponse.data));
      } catch (bgError) {
        global.client.familyphoto = false;
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }
      
      const xbground = background.width;
      const ybground = background.height;
      
      // Parse arguments
      let size = parseInt(args[0]);
      let mode = "";
      
      // Validate size
      if (isNaN(size) || size < 0) {
        global.client.familyphoto = false;
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑠𝑖𝑧𝑒 (𝑛𝑢𝑚𝑏𝑒𝑟 𝑔𝑟𝑒𝑎𝑡𝑒𝑟 𝑡ℎ𝑎𝑛 𝑜𝑟 𝑒𝑞𝑢𝑎𝑙 𝑡𝑜 0).");
      }
      
      // Auto-size calculation
      if (size === 0) {
        const area = xbground * (ybground - 200);
        const areaPerUser = Math.floor(area / participantIDs.length);
        size = Math.floor(Math.sqrt(areaPerUser));
        mode = " (𝐴𝑢𝑡𝑜-𝑠𝑖𝑧𝑒)";
      }
      
      const spacing = parseInt(size / 15);
      let x = spacing;
      let y = 200;
      let xcrop = Math.min(participantIDs.length * size, xbground);
      let ycrop = 200 + size;
      
      // Parse color and title
      let color = "#FFFFFF";
      let title = threadInfo.threadName || "Family Photo";
      let colorIndex = -1;
      
      // Find color argument
      for (let i = 1; i < args.length; i++) {
        if (args[i].startsWith('#')) {
          color = args[i];
          colorIndex = i;
          break;
        }
      }
      
      // Extract title (everything after color or after size if no color)
      if (colorIndex !== -1 && args.length > colorIndex + 1) {
        title = args.slice(colorIndex + 1).join(" ");
      } else if (colorIndex === -1 && args.length > 1) {
        title = args.slice(1).join(" ");
      }
      
      // Validate size against background
      if (size > Math.min(xbground, ybground)) {
        global.client.familyphoto = false;
        return message.reply(
          `❌ 𝐴𝑣𝑎𝑡𝑎𝑟 𝑠𝑖𝑧𝑒 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑!\n` +
          `📐 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑠𝑖𝑧𝑒: ${xbground}x${ybground} 𝑝𝑖𝑥𝑒𝑙𝑠\n` +
          `📏 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 𝑎𝑙𝑙𝑜𝑤𝑒𝑑 𝑠𝑖𝑧𝑒: ${Math.min(xbground, ybground)} 𝑝𝑖𝑥𝑒𝑙𝑠`
        );
      }
      
      // Send processing message
      const processingMsg = await message.reply(
        `🔄 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝐹𝑎𝑚𝑖𝑙𝑦 𝑃ℎ𝑜𝑡𝑜...\n\n` +
        `👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${participantIDs.length}\n` +
        `📐 𝐴𝑣𝑎𝑡𝑎𝑟 𝑆𝑖𝑧𝑒: ${size}px${mode}\n` +
        `🎨 𝑇𝑖𝑡𝑙𝑒 𝐶𝑜𝑙𝑜𝑟: ${color}\n` +
        `📝 𝑇𝑖𝑡𝑙𝑒: ${title}\n\n` +
        `⏳ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡, 𝑡ℎ𝑖𝑠 𝑚𝑎𝑦 𝑡𝑎𝑘𝑒 𝑎 𝑤ℎ𝑖𝑙𝑒...`
      );
      
      // Create canvas with error handling
      let canvas, ctx;
      try {
        canvas = Canvas.createCanvas(xbground, ybground);
        ctx = canvas.getContext('2d');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      } catch (canvasError) {
        global.client.familyphoto = false;
        await api.unsendMessage(processingMsg.messageID);
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑎𝑛𝑣𝑎𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑚𝑎𝑙𝑙𝑒𝑟 𝑠𝑖𝑧𝑒.");
      }
      
      let processedCount = 0;
      let filteredUsers = 0;
      
      // Load frame image
      let frame;
      try {
        const frameResponse = await axios.get(this.config.envConfig.frameImage, { responseType: "arraybuffer", timeout: 30000 });
        frame = await Canvas.loadImage(Buffer.from(frameResponse.data));
      } catch (frameError) {
        console.error("Failed to load frame image:", frameError);
      }
      
      // Process each participant
      for (const id of participantIDs) {
        try {
          // Fetch avatar with timeout
          const avatar = await superfetch.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=${TOKEN}`).timeout(10000);
          
          if (avatar.url.includes(".gif")) {
            filteredUsers++;
            continue;
          }
          
          // Handle positioning
          if (x + size > xbground) {
            xcrop = x;
            x = spacing;
            y += size + spacing;
            ycrop += size + spacing;
          }
          
          // Check if we exceed background height
          if (y + size > ybground) {
            await message.reply("⚠️ 𝑁𝑜𝑡 𝑎𝑙𝑙 𝑎𝑣𝑎𝑡𝑎𝑟𝑠 𝑐𝑜𝑢𝑙𝑑 𝑓𝑖𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒 𝑑𝑢𝑒 𝑡𝑜 𝑠𝑖𝑧𝑒 𝑐𝑜𝑛𝑠𝑡𝑟𝑎𝑖𝑛𝑡𝑠");
            break;
          }
          
          // Draw avatar
          const avatarImg = await Canvas.loadImage(avatar.body);
          ctx.drawImage(avatarImg, x, y, size, size);
          
          // Add frame for admins if frame is available
          if (frame && adminIDs.includes(id)) {
            ctx.drawImage(frame, x, y, size, size);
          }
          
          processedCount++;
          x += size + spacing;
        } catch (error) {
          filteredUsers++;
          console.error(`𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 ${id}:`, error.message);
        }
      }
      
      // Add title text if we have space
      if (ycrop > 200) {
        try {
          Canvas.registerFont(__dirname + "/cache/VNCORSI.ttf", { family: "VNCORSI" });
          ctx.font = `110px VNCORSI`;
          ctx.fillStyle = color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Add text shadow for better visibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          ctx.fillText(title, xcrop / 2, 133);
          
          // Remove shadow for clean output
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } catch (fontError) {
          console.error("Failed to add text:", fontError);
        }
      }
      
      // Save and crop image
      const outputPath = __dirname + `/cache/family_${threadID}_${Date.now()}.png`;
      try {
        const imageBuffer = canvas.toBuffer();
        const image = await jimp.read(imageBuffer);
        image.crop(0, 0, Math.min(xcrop, xbground), Math.min(ycrop + spacing - 30, ybground));
        await image.writeAsync(outputPath);
      } catch (imageError) {
        global.client.familyphoto = false;
        await api.unsendMessage(processingMsg.messageID);
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
      }
      
      // Calculate processing time
      const processingTime = Math.floor((Date.now() - timestart) / 1000);
      
      // Send result
      await message.reply({
        body: `✅ 𝐹𝐴𝑀𝐼𝐿𝑌 𝑃𝐻𝑂𝑇𝑂 𝐶𝑅𝐸𝐴𝑇𝐸𝐷 𝑆𝑈𝐶𝐶𝐸𝑆𝑆𝐹𝑈𝐿𝐿𝑌!\n\n` +
              `👥 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑒𝑑: ${processedCount} 𝑚𝑒𝑚𝑏𝑒𝑟𝑠\n` +
              `🚫 𝐹𝑖𝑙𝑡𝑒𝑟𝑒𝑑: ${filteredUsers} 𝑚𝑒𝑚𝑏𝑒𝑟𝑠\n` +
              `📐 𝐴𝑣𝑎𝑡𝑎𝑟 𝑆𝑖𝑧𝑒: ${size}px${mode}\n` +
              `🎨 𝑇𝑖𝑡𝑙𝑒 𝐶𝑜𝑙𝑜𝑟: ${color}\n` +
              `⏱️ 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑇𝑖𝑚𝑒: ${processingTime} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠`,
        attachment: fs.createReadStream(outputPath)
      });

      // Clean up
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      
      // Delete processing message
      try {
        await api.unsendMessage(processingMsg.messageID);
      } catch (e) {
        console.error("Failed to unsend message:", e);
      }
      
      global.client.familyphoto = false;
      
    } catch (error) {
      console.error("𝐹𝑎𝑚𝑖𝑙𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      global.client.familyphoto = false;
      
      message.reply(
        `❌ 𝐸𝑅𝑅𝑂𝑅: 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑓𝑎𝑚𝑖𝑙𝑦 𝑝ℎ𝑜𝑡𝑜\n` +
        `📝 𝐷𝑒𝑡𝑎𝑖𝑙𝑠: ${error.message}\n\n` +
        `𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟 𝑜𝑟 𝑢𝑠𝑒 𝑎 𝑠𝑚𝑎𝑙𝑙𝑒𝑟 𝑠𝑖𝑧𝑒.`
      );
    }
  }
};
