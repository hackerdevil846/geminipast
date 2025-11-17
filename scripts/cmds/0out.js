module.exports = {
  config: {
    name: "out",
    aliases: ["leave", "exit"],
    version: "1.0.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Bot leaves the group"
    },
    longDescription: {
      en: "Makes the bot leave the current group or a specified group by ID or name"
    },
    category: "admin",
    guide: {
      en: "{p}out [group_ID/group_name] or just {p}out"
    }
  },

  onStart: async function({ message, args, event, api }) {
    try {
      // যদি শুধু "out" লিখে (বর্তমান গ্রুপ থেকে বের হবে)
      if (args.length === 0) {
        await message.reply("🥲 আমি তোমাদের সুখ দেবার জন্য এসেছিলাম...\n😞 কিন্তু তোমরা আমার যোগ্য না...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        return;
      }

      const input = args.join(" ").trim();
      
      // গ্রুপ আইডি দিয়ে বের হওয়া (যদি সংখ্যা হয়)
      if (!isNaN(input)) {
        await message.reply(`🔹 বটটি ${input} আইডির গ্রুপ থেকে বের হচ্ছে...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await api.removeUserFromGroup(api.getCurrentUserID(), input);
        return;
      }

      // গ্রুপ নাম দিয়ে খুঁজে বের করা
      await message.reply("🔍 গ্রুপ খুঁজছি...");
      
      try {
        const groupList = await api.getThreadList(100, null, ['INBOX']);
        const foundGroups = groupList.filter(thread => 
          thread.isGroup && 
          thread.threadName && 
          thread.threadName.toLowerCase().includes(input.toLowerCase())
        );

        if (foundGroups.length === 0) {
          await message.reply("❌ এই নামে কোনো গ্রুপ খুঁজে পাওয়া যায়নি!");
          return;
        }

        if (foundGroups.length === 1) {
          const group = foundGroups[0];
          await message.reply(`🚫 বটটি "${group.threadName}" গ্রুপ থেকে বের হচ্ছে...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          await api.removeUserFromGroup(api.getCurrentUserID(), group.threadID);
          return;
        }

        // একাধিক গ্রুপ পাওয়া গেলে
        if (foundGroups.length > 1) {
          let msg = `📁 ${foundGroups.length}টি গ্রুপ পাওয়া গেছে:\n\n`;
          
          foundGroups.slice(0, 5).forEach((group, index) => {
            msg += `${index + 1}. ${group.threadName}\n`;
            msg += `   আইডি: ${group.threadID}\n\n`;
          });

          msg += `👉 দয়া করে সঠিক গ্রুপ আইডি ব্যবহার করুন: /out [group_id]`;
          
          await message.reply(msg);
          return;
        }

      } catch (searchError) {
        await message.reply("❌ গ্রুপ খুঁজতে সমস্যা হয়েছে! দয়া করে গ্রুপ আইডি ব্যবহার করুন।");
        return;
      }

    } catch (error) {
      console.error("Error in out command:", error);
      await message.reply("❌ সমস্যা হয়েছে: " + error.message);
    }
  }
};
