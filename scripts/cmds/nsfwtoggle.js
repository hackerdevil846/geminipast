module.exports = {
  config: {
    name: "nsfwtoggle",
    aliases: ["nsfwswitch", "adultmode"],
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 1,
    category: "⚙️ 𝑺𝒚𝒔𝒕𝒆𝒎",
    shortDescription: {
      en: "🔞 𝑵𝑺𝑭𝑾 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒕𝒐𝒈𝒈𝒍𝒆 𝒇𝒐𝒓 𝒈𝒓𝒐𝒖𝒑𝒔"
    },
    longDescription: {
      en: "🔞 𝑬𝒏𝒂𝒃𝒍𝒆 𝒐𝒓 𝒅𝒊𝒔𝒂𝒃𝒍𝒆 𝑵𝑺𝑭𝑾 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒊𝒏 𝒚𝒐𝒖𝒓 𝒈𝒓𝒐𝒖𝒑"
    },
    guide: {
      en: "{𝑝}nsfwtoggle [𝑜𝑛/𝑜𝑓𝑓]"
    }
  },

  onStart: async function({ 
    message, 
    event, 
    args, 
    threadsData, 
    getLang 
  }) {
    try {
      const { threadID, messageID } = event;
      let type;

      // Get current thread data
      const threadData = await threadsData.get(threadID);
      const data = threadData.data || {};

      if (args[0]?.toLowerCase() === "on") {
        // Enable NSFW
        data.NSFW = true;
        global.data.threadAllowNSFW = global.data.threadAllowNSFW || [];
        if (!global.data.threadAllowNSFW.includes(threadID)) {
          global.data.threadAllowNSFW.push(parseInt(threadID));
        }
        type = "on";
      } else if (args[0]?.toLowerCase() === "off") {
        // Disable NSFW
        data.NSFW = false;
        global.data.threadAllowNSFW = global.data.threadAllowNSFW.filter(item => item != threadID);
        type = "off";
      } else {
        // Toggle based on current state
        if (!data.hasOwnProperty("NSFW") || data.NSFW === false) {
          data.NSFW = true;
          global.data.threadAllowNSFW = global.data.threadAllowNSFW || [];
          if (!global.data.threadAllowNSFW.includes(threadID)) {
            global.data.threadAllowNSFW.push(parseInt(threadID));
          }
          type = "on";
        } else {
          data.NSFW = false;
          global.data.threadAllowNSFW = global.data.threadAllowNSFW.filter(item => item != threadID);
          type = "off";
        }
      }
      
      // Save the updated data
      await threadsData.set(threadID, { data });
      
      // Send appropriate message
      if (type === "on") {
        await message.reply("✅ | 𝑵𝑺𝑭𝑾 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒆𝒏𝒂𝒃𝒍𝒆𝒅!\n━━━━━━━━━━━━━━\n🔞 𝑵𝒐𝒘 𝒂𝒄𝒕𝒊𝒗𝒆 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑");
      } else {
        await message.reply("⛔ | 𝑵𝑺𝑭𝑾 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒅𝒊𝒔𝒂𝒃𝒍𝒆𝒅!\n━━━━━━━━━━━━━━\n🚫 𝑹𝒆𝒔𝒕𝒓𝒊𝒄𝒕𝒆𝒅 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑");
      }
      
    } catch (error) { 
      console.error("𝑵𝑺𝑭𝑾 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ | 𝑬𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅!\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓");
    }
  },

  langs: {
    en: {
      returnSuccessEnable: "✅ | 𝑵𝑺𝑭𝑾 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒆𝒏𝒂𝒃𝒍𝒆𝒅!\n━━━━━━━━━━━━━━\n🔞 𝑵𝒐𝒘 𝒂𝒄𝒕𝒊𝒗𝒆 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑",
      returnSuccessDisable: "⛔ | 𝑵𝑺𝑭𝑾 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒅𝒊𝒔𝒂𝒃𝒍𝒆𝒅!\n━━━━━━━━━━━━━━\n🚫 𝑹𝒆𝒔𝒕𝒓𝒊𝒄𝒕𝒆𝒅 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑",
      error: "❌ | 𝑬𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅!\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓"
    }
  }
};
