module.exports = {
  config: {
    name: "sendnoti2",
    version: "1.0.2",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 2, // 𝑶𝒏𝒍𝒚 𝑨𝒅𝒎𝒊𝒏𝒔 𝒄𝒂𝒏 𝒖𝒔𝒆 𝒕𝒉𝒊𝒔 𝒄𝒐𝒎𝒎𝒂𝒏𝒅
    category: "⚙️ 𝑺𝒚𝒔𝒕𝒆𝒎",
    shortDescription: {
      en: "✨ 𝑺𝒆𝒏𝒅𝒔 𝒂 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒕𝒐 𝒂𝒍𝒍 𝒈𝒓𝒐𝒖𝒑𝒔 (𝒘𝒊𝒕𝒉 𝒑𝒉𝒐𝒕𝒐/𝒗𝒊𝒅𝒆𝒐 𝒔𝒖𝒑𝒑𝒐𝒓𝒕) ✨"
    },
    longDescription: {
      en: "✨ 𝑴𝒂𝒔𝒔 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒕𝒐𝒐𝒍 𝒇𝒐𝒓 𝒂𝒅𝒎𝒊𝒏𝒔 𝒕𝒐 𝒃𝒓𝒐𝒂𝒅𝒄𝒂𝒔𝒕 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔 𝒂𝒄𝒓𝒐𝒔𝒔 𝒂𝒍𝒍 𝒄𝒐𝒏𝒏𝒆𝒄𝒕𝒆𝒅 𝒕𝒉𝒓𝒆𝒂𝒅𝒔. 𝑺𝒖𝒑𝒑𝒐𝒓𝒕𝒔 𝒕𝒆𝒙𝒕 𝒂𝒏𝒅 𝒎𝒆𝒅𝒊𝒂 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕𝒔. ✨"
    },
    guide: {
      en: "𝑼𝒔𝒂𝒈𝒆: {p}𝒔𝒆𝒏𝒅𝒏𝒐𝒕𝒊 [𝒎𝒆𝒔𝒔𝒂𝒈𝒆]\n 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒑𝒉𝒐𝒕𝒐/𝒗𝒊𝒅𝒆𝒐 𝒕𝒐 𝒊𝒏𝒄𝒍𝒖𝒅𝒆 𝒊𝒕 𝒊𝒏 𝒕𝒉𝒆 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏."
    },
    priority: 0
  },

  onStart: async function({ message, args, event, api, global }) {
    try {
      const fs = require("fs");
      const axios = require("axios");
      const { threadID, messageReply } = event;

      // 𝑪𝒖𝒔𝒕𝒐𝒎 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒉𝒆𝒂𝒅𝒆𝒓
      const header = "🔔 »✦𝑨𝒅𝒎𝒊𝒏 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒆𝒓 𝒕𝒂𝒓𝒂𝒇 𝒕𝒉𝒆𝒌𝒆 𝒆𝒌𝒕𝒊 𝒔𝒂𝒎𝒃𝒂𝒅𝒉𝒂𝒏✦« 🔔\n\n";
      const messageBody = args.join(" ") || "";
      const fullMessage = header + messageBody;

      const allThreads = global.GoatBot.allThreadID || []; // 𝑼𝒔𝒆 𝒈𝒍𝒐𝒃𝒂𝒍.𝑮𝒐𝒂𝒕𝑩𝒐𝒕.𝒂𝒍𝒍𝑻𝒉𝒓𝒆𝒂𝒅𝑰𝑫 𝒇𝒐𝒓 𝑮𝒐𝒂𝒕𝑩𝒐𝒕
      let successCount = 0;
      let failCount = 0;
      let attachmentSend = null;

      // 𝑨𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕 𝒉𝒂𝒏𝒅𝒍𝒊𝒏𝒈
      if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
        const attachment = messageReply.attachments[0];
        const ext = attachment.type === 'photo' ? 'jpg' : attachment.type === 'video' ? 'mp4' : attachment.type === 'AnimatedImage' ? 'gif' : 'png';
        const fileName = `${__dirname}/cache/snoti_attachment.${ext}`;
        
        // 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒕𝒉𝒆 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕 𝒖𝒔𝒊𝒏𝒈 𝒈𝒍𝒐𝒃𝒂𝒍.𝒖𝒕𝒊𝒍𝒔.𝒈𝒆𝒕𝑺𝒕𝒓𝒆𝒂𝒎𝑭𝒓𝒐𝒎𝑼𝑹𝑳
        attachmentSend = await global.utils.getStreamFromURL(attachment.url, fileName);
      }

      // 𝑺𝒆𝒏𝒅 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒐 𝒕𝒉𝒓𝒆𝒂𝒅𝒔
      const sendToThread = async (targetThreadID) => {
        try {
          const messageOptions = {
            body: fullMessage
          };
          if (attachmentSend) {
            messageOptions.attachment = fs.createReadStream(attachmentSend.path); // 𝑼𝒔𝒆 𝒕𝒉𝒆 𝒑𝒂𝒕𝒉 𝒇𝒓𝒐𝒎 𝒕𝒉𝒆 𝒔𝒕𝒓𝒆𝒂𝒎
          }

          await api.sendMessage(messageOptions, targetThreadID);
          successCount++;
        } catch (error) {
          console.error(`❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒕𝒐 𝒕𝒉𝒓𝒆𝒂𝒅 ${targetThreadID}:`, error);
          failCount++;
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // 𝑨𝒅𝒅 𝒂 𝒔𝒎𝒂𝒍𝒍 𝒅𝒆𝒍𝒂𝒚
      };

      // 𝑷𝒓𝒐𝒄𝒆𝒔𝒔 𝒂𝒍𝒍 𝒕𝒉𝒓𝒆𝒂𝒅𝒔
      for (const thread of allThreads) {
        if (isNaN(thread) || thread === threadID) continue; // 𝑺𝒌𝒊𝒑 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒕𝒉𝒓𝒆𝒂𝒅 𝒂𝒏𝒅 𝒊𝒏𝒗𝒂𝒍𝒊𝒅 𝒕𝒉𝒓𝒆𝒂𝒅𝑰𝑫𝒔
        await sendToThread(thread);
      }

      // 𝑺𝒆𝒏𝒅 𝒔𝒖𝒎𝒎𝒂𝒓𝒚
      const successText = `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒏𝒕 𝒕𝒐 ${successCount} 𝒕𝒉𝒓𝒆𝒂𝒅𝒔!`;
      const failText = `❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒕𝒐 ${failCount} 𝒕𝒉𝒓𝒆𝒂𝒅𝒔.`;

      await message.reply(
        `${successText}\n${failCount > 0 ? failText : ""}`
      );

      // 𝑪𝒍𝒆𝒂𝒏 𝒖𝒑 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕 𝒊𝒇 𝒊𝒕 𝒘𝒂𝒔 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒅
      if (attachmentSend && fs.existsSync(attachmentSend.path)) {
        fs.unlinkSync(attachmentSend.path);
      }

    } catch (error) {
      console.error("❌ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒔𝒆𝒏𝒅𝒊𝒏𝒈 𝒕𝒉𝒆 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏: " + error.message);
    }
  }
};
