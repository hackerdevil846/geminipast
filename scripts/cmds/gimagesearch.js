const fs = require('fs');
const request = require('request');

module.exports = {
  config: {
    name: "gimagesearch",
    aliases: ["gis", "googleimg", "imgsearch"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "𝒊𝒏𝒇𝒐",
    countDown: 5,
    shortDescription: {
      en: "𝑮𝒐𝒐𝒈𝒍𝒆 𝒊𝒎𝒂𝒈𝒆 𝒂𝒏𝒅 𝒕𝒆𝒙𝒕 𝒔𝒆𝒂𝒓𝒄𝒉"
    },
    longDescription: {
      en: "𝑮𝒐𝒐𝒈𝒍𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒇𝒐𝒓 𝒕𝒆𝒙𝒕 𝒐𝒓 𝒓𝒆𝒗𝒆𝒓𝒔𝒆 𝒊𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉"
    },
    guide: {
      en: "{p}gimagesearch [𝒕𝒆𝒙𝒕] 𝒐𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒊𝒎𝒂𝒈𝒆"
    }
  },

  onStart: async function({ message, args, event }) {
    try {
      // Check dependencies
      try {
        require.resolve('fs');
        require.resolve('request');
      } catch (e) {
        return await message.reply("❌ 𝑴𝒊𝒔𝒔𝒊𝒏𝒈 𝒓𝒆𝒒𝒖𝒊𝒓𝒆𝒅 𝒅𝒆𝒑𝒆𝒏𝒅𝒆𝒏𝒄𝒊𝒆𝒔");
      }

      let textNeedSearch = "";
      const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;

      // Check if replying to an image
      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const attachment = event.messageReply.attachments[0];
        if (attachment.type === "photo" || attachment.type === "image" || attachment.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          textNeedSearch = attachment.url;
        }
      } 
      
      // If no image reply, use text arguments
      if (!textNeedSearch) {
        if (args.length === 0) {
          return await message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒔𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒕𝒐 𝒔𝒆𝒂𝒓𝒄𝒉 𝒐𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆");
        }
        textNeedSearch = args.join(" ");
      }

      // Check if it's a URL (image search) or text (normal search)
      if (regex.test(textNeedSearch)) {
        // Image search (reverse image search)
        const encodedImageUrl = encodeURIComponent(textNeedSearch);
        const imageSearchUrl = `https://www.google.com/searchbyimage?&image_url=${encodedImageUrl}`;
        
        await message.reply(`🔍 𝑹𝒆𝒗𝒆𝒓𝒔𝒆 𝑰𝒎𝒂𝒈𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕:\n\n${imageSearchUrl}`);
      } else {
        // Text search
        const encodedQuery = encodeURIComponent(textNeedSearch);
        const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
        
        await message.reply(`🔍 𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕 𝒇𝒐𝒓: "${textNeedSearch}"\n\n${searchUrl}`);
      }

    } catch (error) {
      console.error("𝑮𝒐𝒐𝒈𝒍𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒔𝒆𝒂𝒓𝒄𝒉");
    }
  }
};
