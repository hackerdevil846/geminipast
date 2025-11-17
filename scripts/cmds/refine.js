const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "refine",
    aliases: [],
    version: "1.5.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "image",
    shortDescription: {
      en: "✨ 𝐸𝑛ℎ𝑎𝑛𝑐𝑒 𝑎𝑛𝑑 𝑡𝑟𝑎𝑛𝑠𝑓𝑜𝑟𝑚 𝑖𝑚𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝐴𝐼 𝑡𝑒𝑐ℎ𝑛𝑜𝑙𝑜𝑔𝑦"
    },
    longDescription: {
      en: "𝐸𝑛ℎ𝑎𝑛𝑐𝑒 𝑎𝑛𝑑 𝑡𝑟𝑎𝑛𝑠𝑓𝑜𝑟𝑚 𝑖𝑚𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝐴𝐼 𝑡𝑒𝑐ℎ𝑛𝑜𝑙𝑜𝑔𝑦 𝑤𝑖𝑡ℎ 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑐𝑟𝑒𝑎𝑡𝑖𝑣𝑒 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑚𝑒𝑛𝑡𝑠"
    },
    guide: {
      en: "{p}refine [𝑝𝑟𝑜𝑚𝑝𝑡]\n𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑚𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡"
    },
    dependencies: {
      "axios": "",
      "form-data": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const { threadID, messageID } = event;
      const imageAttachment = event.messageReply?.attachments?.[0] || event.attachments?.[0];

      if (!imageAttachment || !['photo', 'image'].includes(imageAttachment.type)) {
        return message.reply(
          "🖼️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑠𝑒𝑛𝑑 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑\n\n" +
          "✨ 𝑈𝑠𝑎𝑔𝑒 𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:\n" +
          "• 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒: 𝑟𝑒𝑓𝑖𝑛𝑒 𝑝𝑟𝑜𝑓𝑒𝑠𝑠𝑖𝑜𝑛𝑎𝑙 ℎ𝑒𝑎𝑑𝑠ℎ𝑜𝑡\n" +
          "• 𝑆𝑒𝑛𝑑 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒: 𝑟𝑒𝑓𝑖𝑛𝑒 𝑎𝑛𝑖𝑚𝑒 𝑠𝑡𝑦𝑙𝑒 [𝑎𝑡𝑡𝑎𝑐ℎ 𝑖𝑚𝑎𝑔𝑒]"
        );
      }

      const userPrompt = args.join(" ") || "𝐸𝑛ℎ𝑎𝑛𝑐𝑒 𝑡ℎ𝑖𝑠 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑐𝑟𝑒𝑎𝑡𝑖𝑣𝑒 𝑑𝑒𝑡𝑎𝑖𝑙𝑠";
      const processingMsg = await message.reply(
        `✨ 𝑅𝑒𝑓𝑖𝑛𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒...\n━━━━━━━━━━━━━━\n` +
        `🔮 𝑃𝑟𝑜𝑚𝑝𝑡: "${userPrompt}"\n` +
        `⏳ 𝐸𝑠𝑡𝑖𝑚𝑎𝑡𝑒𝑑: 15-60 𝑠𝑒𝑐𝑜𝑛𝑑𝑠`
      );

      const result = await processImage(imageAttachment.url, userPrompt);
      
      if (result.success && result.type === 'image') {
        api.unsendMessage(processingMsg.messageID);
        
        await message.reply({
          body: `✨ 𝑅𝑒𝑓𝑖𝑛𝑒𝑚𝑒𝑛𝑡 𝐶𝑜𝑚𝑝𝑙𝑒𝑡𝑒!\n━━━━━━━━━━━━━━\n` + 
                `🔮 𝑃𝑟𝑜𝑚𝑝𝑡: "${userPrompt}"\n\n` +
                `💡 𝑇𝑖𝑝𝑠 𝑓𝑜𝑟 𝑏𝑒𝑡𝑡𝑒𝑟 𝑟𝑒𝑠𝑢𝑙𝑡𝑠:\n` +
                "• 𝐵𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑎𝑏𝑜𝑢𝑡 𝑑𝑒𝑠𝑖𝑟𝑒𝑑 𝑐ℎ𝑎𝑛𝑔𝑒𝑠\n" +
                "• 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑎𝑟𝑡 𝑠𝑡𝑦𝑙𝑒𝑠 (𝑎𝑛𝑖𝑚𝑒, 𝑜𝑖𝑙 𝑝𝑎𝑖𝑛𝑡𝑖𝑛𝑔)\n" +
                "• 𝐷𝑒𝑠𝑐𝑟𝑖𝑏𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑/𝑓𝑜𝑟𝑒𝑔𝑟𝑜𝑢𝑛𝑑 𝑒𝑙𝑒𝑚𝑒𝑛𝑡𝑠",
          attachment: fs.createReadStream(result.path)
        });

        // Cleanup
        if (fs.existsSync(result.path)) {
          fs.unlinkSync(result.path);
        }
      } else {
        const errorBody = `❌ 𝑅𝑒𝑓𝑖𝑛𝑒𝑚𝑒𝑛𝑡 𝐹𝑎𝑖𝑙𝑒𝑑\n━━━━━━━━━━━━━━\n` + 
                        `🔧 𝑅𝑒𝑎𝑠𝑜𝑛: ${result.message || '𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟'}\n\n` +
                        `🛠️ 𝑆𝑜𝑙𝑢𝑡𝑖𝑜𝑛𝑠:\n` +
                        "• 𝑇𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡\n" +
                        "• 𝑈𝑠𝑒 ℎ𝑖𝑔ℎ𝑒𝑟 𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑖𝑚𝑎𝑔𝑒𝑠\n" +
                        "• 𝑊𝑎𝑖𝑡 𝑏𝑒𝑓𝑜𝑟𝑒 𝑟𝑒𝑡𝑟𝑦𝑖𝑛𝑔";
                        
        message.reply(errorBody);
        api.unsendMessage(processingMsg.messageID);
      }
    } catch (error) {
      console.error("𝑅𝑒𝑓𝑖𝑛𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("⚠️ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟");
    }
  }
};

async function processImage(imageUrl, prompt) {
  try {
    const API_KEY = 'd7843d40-7604-11f0-bf3f-4f562e7a2c44';
    const requestData = {
      url: imageUrl,
      enhancements: ["denoise", "deblur", "light"],
      width: 2000
    };

    const response = await axios.post('https://deep-image.ai/rest_api/process_result', {
      parameters: JSON.stringify(requestData)
    }, {
      headers: { 'x-api-key': API_KEY },
      timeout: 90000
    });

    if (response.data?.url) {
      const imageResponse = await axios.get(response.data.url, {
        responseType: 'stream',
        timeout: 30000
      });

      const cacheDir = path.join(__dirname, 'cache', 'refine');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const outputPath = path.join(cacheDir, `refined_${Date.now()}.png`);
      const writer = fs.createWriteStream(outputPath);
      imageResponse.data.pipe(writer);
      
      return new Promise((resolve) => {
        writer.on('finish', () => resolve({
          success: true,
          type: 'image',
          path: outputPath
        }));
        writer.on('error', () => resolve({
          success: false,
          message: '𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑖𝑚𝑎𝑔𝑒'
        }));
      });
    } else {
      throw new Error('𝑁𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿');
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || error.message
    };
  }
}

// Cache cleaning function
function cleanRefineCache() {
  try {
    const cacheDir = path.join(__dirname, 'cache', 'refine');
    if (!fs.existsSync(cacheDir)) return;

    const files = fs.readdirSync(cacheDir);
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(cacheDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > 3600000) { 
        fs.unlinkSync(filePath);
      }
    });
  } catch (cleanError) {
    console.error('𝑅𝑒𝑓𝑖𝑛𝑒 𝑐𝑎𝑐ℎ𝑒 𝑐𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:', cleanError);
  }
}

// Set up periodic cache cleaning
setInterval(cleanRefineCache, 3600000);
