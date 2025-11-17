const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "obamatweet",
    aliases: [],
    version: "1.1.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 10,
    role: 0,
    category: "image",
    shortDescription: {
      en: "🇺🇸 𝖢𝗋𝖾𝖺𝗍𝖾 𝗉𝗋𝖾𝗌𝗂𝖽𝖾𝗇𝗍𝗂𝖺𝗅 𝖮𝖻𝖺𝗆𝖺-𝗌𝗍𝗒𝗅𝖾 𝗍𝗐𝖾𝖾𝗍 𝗂𝗆𝖺𝗀𝖾𝗌"
    },
    longDescription: {
      en: "🇺🇸 𝖢𝗋𝖾𝖺𝗍𝖾 𝗉𝗋𝖾𝗌𝗂𝖽𝖾𝗇𝗍𝗂𝖺𝗅 𝖮𝖻𝖺𝗆𝖺-𝗌𝗍𝗒𝗅𝖾 𝗍𝗐𝖾𝖾𝗍 𝗂𝗆𝖺𝗀𝖾𝗌 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝖼𝗎𝗌𝗍𝗈𝗆 𝗍𝖾𝗑𝗍"
    },
    guide: {
      en: "{p}obamatweet [𝗍𝖾𝗑𝗍]"
    },
    dependencies: {
      "axios": "",
      "jimp": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("axios");
        require("jimp");
        require("fs-extra");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝗃𝗂𝗆𝗉, 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
      }

      if (args.length === 0) {
        return message.reply(
          "🇺🇸 𝖮𝖻𝖺𝗆𝖺 𝖳𝗐𝖾𝖾𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗋𝖾𝖺𝖽𝗒! 𝖳𝗒𝗉𝖾 '{p}obamatweet [𝗍𝖾𝗑𝗍]' 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗒𝗈𝗎𝗋 𝗉𝗋𝖾𝗌𝗂𝖽𝖾𝗇𝗍𝗂𝖺𝗅 𝗍𝗐𝖾𝖾𝗍"
        );
      }

      const text = args.join(" ").trim();
      if (!text) {
        return message.reply(
          "✍️ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗍𝖾𝗑𝗍 𝖿𝗈𝗋 𝖮𝖻𝖺𝗆𝖺'𝗌 𝗍𝗐𝖾𝖾𝗍\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}obamatweet 𝖸𝖾𝗌 𝗐𝖾 𝖼𝖺𝗇! 𝖢𝗁𝖺𝗇𝗀𝖾 𝗂𝗌 𝖼𝗈𝗆𝗂𝗇𝗀."
        );
      }

      // Text length validation
      if (text.length > 280) {
        return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 280 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
      }

      const processingMsg = await message.reply(
        "🔄 𝖯𝗋𝖾𝗌𝗂𝖽𝖾𝗇𝗍 𝖮𝖻𝖺𝗆𝖺 𝗂𝗌 𝖼𝗈𝗆𝗉𝗈𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗍𝗐𝖾𝖾𝗍..."
      );

      const cacheDir = path.join(__dirname, 'cache');
      try {
        await fs.ensureDir(cacheDir);
      } catch (dirError) {
        await message.unsend(processingMsg.messageID);
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
      }
      
      // Generate unique filenames
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      
      // Download template
      const templateUrl = 'https://i.imgur.com/6fOxdex.png';
      const templatePath = path.join(cacheDir, `obama_template_${timestamp}_${randomSuffix}.png`);
      
      try {
        const { data } = await axios.get(templateUrl, { 
          responseType: 'arraybuffer',
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        await fs.writeFile(templatePath, Buffer.from(data, 'binary'));
      } catch (error) {
        await message.unsend(processingMsg.messageID);
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
      }
      
      try {
        // Load template image
        const image = await jimp.read(templatePath);
        
        // Load font
        let font;
        try {
          font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        } catch (fontError) {
          font = jimp.FONT_SANS_32_BLACK;
        }

        // Enhanced text wrapping function
        function wrapText(text, maxWidth) {
          const words = text.split(' ');
          const lines = [];
          let currentLine = '';

          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const width = jimp.measureText(font, testLine);
            
            if (width <= maxWidth) {
              currentLine = testLine;
            } else {
              if (currentLine) {
                lines.push(currentLine);
              }
              currentLine = word;
            }
          }
          
          if (currentLine) {
            lines.push(currentLine);
          }
          return lines;
        }

        // Add text to image with proper positioning
        const maxWidth = 1160;
        const lines = wrapText(text, maxWidth);
        const startY = 165;
        const lineHeight = 40;
        
        // Check if text fits in available space
        const maxLines = 6;
        if (lines.length > maxLines) {
          await fs.unlink(templatePath);
          await message.unsend(processingMsg.messageID);
          return message.reply(`❌ 𝖳𝖾𝗑𝗍 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗁𝗈𝗋𝗍𝖾𝗇 𝗒𝗈𝗎𝗋 𝗍𝖾𝗑𝗍. 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 ${maxLines} 𝗅𝗂𝗇𝖾𝗌 𝖺𝗅𝗅𝗈𝗐𝖾𝖽.`);
        }

        // Draw text lines
        lines.forEach((line, index) => {
          const yPos = startY + (index * lineHeight);
          image.print(font, 60, yPos, line);
        });

        // Save the modified image
        const outputPath = path.join(cacheDir, `obama_output_${timestamp}_${randomSuffix}.png`);
        await image.writeAsync(outputPath);
        
        // Verify output file exists and has content
        const stats = await fs.stat(outputPath);
        if (stats.size < 1000) {
          throw new Error("𝖮𝗎𝗍𝗉𝗎𝗍 𝖿𝗂𝗅𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗌𝗆𝖺𝗅𝗅");
        }
        
        // Send result
        await message.reply({
          body: "🇺🇸 𝖯𝗋𝖾𝗌𝗂𝖽𝖾𝗇𝗍𝗂𝖺𝗅 𝖳𝗐𝖾𝖾𝗍:",
          attachment: fs.createReadStream(outputPath)
        });
        
        // Cleanup
        await fs.unlink(templatePath);
        await fs.unlink(outputPath);
        await message.unsend(processingMsg.messageID);

      } catch (imageError) {
        console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", imageError);
        
        // Cleanup files
        try {
          if (await fs.pathExists(templatePath)) {
            await fs.unlink(templatePath);
          }
        } catch (cleanupError) {}
        
        await message.unsend(processingMsg.messageID);
        await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝗌𝗁𝗈𝗋𝗍𝖾𝗋 𝗍𝖾𝗑𝗍.");
      }

    } catch (error) {
      console.error("💥 𝖮𝖻𝖺𝗆𝖺𝖳𝗐𝖾𝖾𝗍 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
    }
  }
};
