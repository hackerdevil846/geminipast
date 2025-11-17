const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "googlesrch",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🔍 𝑆𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑜𝑛 𝐺𝑜𝑜𝑔𝑙𝑒"
    },
    longDescription: {
      en: "𝐹𝑖𝑛𝑑 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑜𝑛 𝐺𝑜𝑜𝑔𝑙𝑒 𝑤𝑖𝑡ℎ 𝑡𝑒𝑥𝑡 𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑠𝑒𝑎𝑟𝑐ℎ"
    },
    guide: {
      en: "{p}googlesrch [𝑞𝑢𝑒𝑟𝑦] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒"
    },
    countDown: 5
  },

  onStart: async function({ message, event, args }) {
    try {
      let searchQuery = "";
      
      // Improved regex for image URLs
      const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp)(?:\?.*)?)/i;
      
      // Check if replying to a message with image attachment
      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const attachment = event.messageReply.attachments[0];
        if (attachment.type === "photo" || attachment.type === "image" || imageRegex.test(attachment.url)) {
          searchQuery = attachment.url;
        }
      }
      
      // If no image reply, use text arguments
      if (!searchQuery) {
        if (args.length === 0) {
          return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒.\n\n📝 Usage:\n• googlesrch cats\n• Reply to image + googlesrch");
        }
        searchQuery = args.join(" ");
      }

      // Encode the search query for URL
      const encodedQuery = encodeURIComponent(searchQuery);
      
      if (imageRegex.test(searchQuery)) {
        // Image search (reverse image search)
        const imageSearchUrl = `https://www.google.com/searchbyimage?&image_url=${encodedQuery}`;
        await message.reply(`🖼️ 🔍 𝑰𝒎𝒂𝒈𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕:\n\n${imageSearchUrl}`);
      } else {
        // Text search
        const textSearchUrl = `https://www.google.com/search?q=${encodedQuery}`;
        await message.reply(`📝 🔍 𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕 𝒇𝒐𝒓: "${searchQuery}"\n\n${textSearchUrl}`);
      }

    } catch (error) {
      console.error("𝐺𝑜𝑜𝑔𝑙𝑒 𝑆𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑞𝑢𝑒𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
