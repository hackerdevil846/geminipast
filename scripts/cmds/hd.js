const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "hd",
    aliases: [],
    version: "3.6",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "media",
    shortDescription: {
      en: "✨ 𝐸𝑛ℎ𝑎𝑛𝑐𝑒 𝑖𝑚𝑎𝑔𝑒 𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑡𝑜 𝑈𝑙𝑡𝑟𝑎 𝐻𝐷"
    },
    longDescription: {
      en: "𝐸𝑛ℎ𝑎𝑛𝑐𝑒𝑠 𝑖𝑚𝑎𝑔𝑒 𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑢𝑠𝑖𝑛𝑔 𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑡𝑒𝑐ℎ𝑛𝑜𝑙𝑜𝑔𝑦"
    },
    guide: {
      en: "{p}hd [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒]"
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const { threadID, messageID, messageReply } = event;
      const cacheDir = path.join(__dirname, 'cache', 'hd-images');
      const imagePath = path.join(cacheDir, `enhanced_${Date.now()}.jpg`);
      
      // Create cache directory if needed
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Validate message reply
      if (!messageReply || !messageReply.attachments || !messageReply.attachments[0] || 
          !['photo', 'sticker'].includes(messageReply.attachments[0].type)) {
        return message.reply({
          body: "🖼️  𝐻𝐷 𝐼𝑀𝐴𝐺𝐸 𝐸𝑁𝐻𝐴𝑁𝐶𝐸𝑀𝐸𝑁𝑇\n" +
                "━━━━━━━━━━━━━━━━━━\n" +
                "📝  𝐻𝑜𝑤 𝑡𝑜 𝑢𝑠𝑒:\n" +
                "❶ 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 'ℎ𝑑'\n" +
                "❷ 𝑊𝑎𝑖𝑡 𝑓𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔\n" +
                "❸ 𝑅𝑒𝑐𝑒𝑖𝑣𝑒 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝐻𝐷 𝑣𝑒𝑟𝑠𝑖𝑜𝑛\n\n" +
                "✨  𝑁𝑜𝑡𝑒: 𝑊𝑜𝑟𝑘𝑠 𝑏𝑒𝑠𝑡 𝑤𝑖𝑡ℎ 𝑐𝑙𝑒𝑎𝑟 𝑖𝑚𝑎𝑔𝑒𝑠\n" +
                "⏳  𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑇𝑖𝑚𝑒: 10-30 𝑠𝑒𝑐𝑜𝑛𝑑𝑠"
        });
      }

      const attachment = messageReply.attachments[0];
      const photoUrl = attachment.url;
      
      // Check file size if available
      const MAX_FILE_SIZE = 25; // 25MB
      if (attachment.size && attachment.size > MAX_FILE_SIZE * 1024 * 1024) {
        return message.reply(
          `❌  𝐹𝑖𝑙𝑒 𝑇𝑜𝑜 𝐿𝑎𝑟𝑔𝑒\n\n` +
          `𝑇ℎ𝑒 𝑖𝑚𝑎𝑔𝑒 𝑒𝑥𝑐𝑒𝑒𝑑𝑠 𝑡ℎ𝑒 𝑚𝑎𝑥𝑖𝑚𝑢𝑚 𝑠𝑖𝑧𝑒 𝑜𝑓 ${MAX_FILE_SIZE}𝑀𝐵.\n` +
          `𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑎 𝑠𝑚𝑎𝑙𝑙𝑒𝑟 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑟 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑚𝑒𝑛𝑡.`
        );
      }

      // Send processing message
      const processingMsg = await message.reply({
        body: "🔮  𝐸𝑁𝐻𝐴𝑁𝐶𝐼𝑁𝐺 𝐼𝑀𝐴𝐺𝐸\n" +
              "━━━━━━━━━━━━━━━━━━\n" +
              "⏳ 𝑆𝑡𝑎𝑡𝑢𝑠: 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔...\n" +
              "✨ 𝑈𝑠𝑖𝑛𝑔: 𝐴𝐼 𝐸𝑛ℎ𝑎𝑛𝑐𝑒𝑚𝑒𝑛𝑡 𝑇𝑒𝑐ℎ𝑛𝑜𝑙𝑜𝑔𝑦\n" +
              "🕒 𝐸𝑠𝑡𝑖𝑚𝑎𝑡𝑒𝑑: 10-30 𝑠𝑒𝑐𝑜𝑛𝑑𝑠\n\n" +
              "𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 𝑤ℎ𝑖𝑙𝑒 𝑤𝑒 𝑒𝑛ℎ𝑎𝑛𝑐𝑒 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒...",
      });

      // Add reaction to indicate processing
      try {
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
      } catch (reactionError) {
        console.error("Reaction error:", reactionError);
      }
      
      try {
        // Enhance image using API - fixed URL encoding
        const encodedUrl = encodeURIComponent(photoUrl);
        const enhanceResponse = await axios.get(
          `https://code-merge-api-hazeyy01.replit.app/api/try/remini?url=${encodedUrl}`,
          { 
            timeout: 60000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }
        );
        
        if (!enhanceResponse.data || !enhanceResponse.data.image_data) {
          throw new Error("𝐴𝑃𝐼 𝑑𝑖𝑑𝑛'𝑡 𝑟𝑒𝑡𝑢𝑟𝑛 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑑𝑎𝑡𝑎");
        }

        // Download the enhanced image
        const imageResponse = await axios.get(enhanceResponse.data.image_data, {
          responseType: 'arraybuffer',
          timeout: 60000
        });

        // Check if image data is valid
        if (!imageResponse.data || imageResponse.data.length === 0) {
          throw new Error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦");
        }

        // Save the image
        await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));
        
        // Verify file was saved
        if (!fs.existsSync(imagePath)) {
          throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝑖𝑚𝑎𝑔𝑒");
        }

        const fileStats = fs.statSync(imagePath);
        if (fileStats.size === 0) {
          throw new Error("𝑆𝑎𝑣𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦");
        }
        
        // Update reaction to completed
        try {
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        } catch (reactionError) {
          console.error("Reaction error:", reactionError);
        }
        
        // Send the enhanced image
        await message.reply({
          body: "✅  𝐸𝑁𝐻𝐴𝑁𝐶𝐸𝑀𝐸𝑁𝑇 𝑆𝑈𝐶𝐶𝐸𝑆𝑆𝐹𝑈𝐿\n" +
                "━━━━━━━━━━━━━━━━━━\n" +
                "✨ 𝐼𝑚𝑎𝑔𝑒 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑒𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝑡𝑜 𝑈𝑙𝑡𝑟𝑎 𝐻𝐷!\n" +
                "📊 𝑄𝑢𝑎𝑙𝑖𝑡𝑦: 4𝐾 𝑅𝑒𝑠𝑜𝑙𝑢𝑡𝑖𝑜𝑛\n" +
                "🎯 𝐸𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝑤𝑖𝑡ℎ 𝐴𝐼 𝑇𝑒𝑐ℎ𝑛𝑜𝑙𝑜𝑔𝑦",
          attachment: fs.createReadStream(imagePath)
        });

        // Clean up processing message
        try {
          if (processingMsg && processingMsg.messageID) {
            await api.unsendMessage(processingMsg.messageID);
          }
        } catch (unsendError) {
          console.error("Unsend error:", unsendError);
        }

        // Clean up after sending
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (cleanupErr) {
          console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupErr);
        }
        
      } catch (error) {
        console.error("𝐻𝐷 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        
        // Update reaction to error
        try {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
        } catch (reactionError) {
          console.error("Reaction error:", reactionError);
        }
        
        let errorMessage = "❌  𝐸𝑁𝐻𝐴𝑁𝐶𝐸𝑀𝐸𝑁𝑇 𝐹𝐴𝐼𝐿𝐸𝐷\n" +
          "━━━━━━━━━━━━━━━━━━\n";
        
        if (error.response) {
          errorMessage += `🔧 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟 (𝑆𝑡𝑎𝑡𝑢𝑠: ${error.response.status})\n`;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage += "⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.\n";
        } else if (error.message.includes('image_data')) {
          errorMessage += "🔌 𝐸𝑛ℎ𝑎𝑛𝑐𝑒𝑚𝑒𝑛𝑡 𝐴𝑃𝐼 𝑖𝑠 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑖𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒\n";
        } else if (error.message.includes('ENOTFOUND')) {
          errorMessage += "🌐 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.\n";
        } else {
          errorMessage += `📛 𝐸𝑟𝑟𝑜𝑟: ${error.message}\n`;
        }
        
        errorMessage += "\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑖𝑚𝑎𝑔𝑒.";
        
        // Clean up processing message
        try {
          if (processingMsg && processingMsg.messageID) {
            await api.unsendMessage(processingMsg.messageID);
          }
        } catch (unsendError) {
          console.error("Unsend error:", unsendError);
        }
        
        // Clean up if file exists
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (cleanupErr) {
            console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupErr);
          }
        }
        
        await message.reply(errorMessage);
      }

    } catch (error) {
      console.error("𝐻𝐷 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐼𝑛𝑖𝑡𝑖𝑎𝑙 𝐸𝑟𝑟𝑜𝑟:", error);
      return message.reply(
        "❌  𝐼𝑁𝐼𝑇𝐼𝐴𝐿𝐼𝑍𝐴𝑇𝐼𝑂𝑁 𝐸𝑅𝑅𝑂𝑅\n\n" +
        "𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.\n" +
        "𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
      );
    }
  }
};
