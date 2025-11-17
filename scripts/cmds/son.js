module.exports = {
  config: {
    name: "son",
    aliases: ["insult"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🤖 𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑖𝑛𝑠𝑢𝑙𝑡 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑤ℎ𝑒𝑛 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟 𝑟𝑒𝑝𝑙𝑖𝑒𝑠"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑤𝑖𝑡ℎ 𝑖𝑛𝑠𝑢𝑙𝑡𝑠 𝑤ℎ𝑒𝑛 𝑎 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟 𝑠𝑒𝑛𝑑𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
    },
    guide: {
      en: "{p}son @𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    countDown: 3
  },

  onStart: async function ({ api, event, message, args }) {
    try {
      const mention = Object.keys(event.mentions)[0];
      if (!mention) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑎 𝑢𝑠𝑒𝑟!");
      }

      // Prevent self-mention
      if (mention === event.senderID) {
        return message.reply("❌ 𝐶𝑎𝑛'𝑡 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓!");
      }

      // Prevent bot mention
      if (mention === api.getCurrentUserID()) {
        return message.reply("❌ 𝐶𝑎𝑛'𝑡 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑡!");
      }

      let userInfo;
      try {
        userInfo = await api.getUserInfo(mention);
        if (!userInfo || !userInfo[mention]) {
          return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛!");
        }
      } catch (error) {
        console.error("Error getting user info:", error);
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛!");
      }

      let genderText;
      switch (userInfo[mention].gender) {
        case 1:
          genderText = "girl";
          break;
        case 2:
          genderText = "boy";
          break;
        default:
          genderText = "person";
      }

      const insults = [
        `খাংকির ${genderText}, তোর মার ভোদা তে গাধার মাল ফালাবো! 😈`,
        `তোর মা কে চুদে চুদে পল্টি মারবো, গাধার ${genderText}! 😡`,
        `বাড়ির পাশে মাল ফেলে দিয়ে তোর মা কে চুদতে চাই! 🔥`,
        `তোর মার গুদে ফুল ট্যাবলেট পুশ করে, গাধার ${genderText}! 😛`,
        `তোর বোনের মুখে মাল ফালানোর কথা ভাবি, মাগী ${genderText}!`,
        `তোর মার ভোদায় TNT ঢুকাইয়া ব্লাস্ট করবো! 💥`,
        `তোর মা কে চুদে তারে গর্ভবতী বানাই দিমু, তুই হবি বাচ্চা! 👶`,
        `তোর মার গুদে লঞ্চ চলাই, তুই হবি নাবিক! 🛳️`,
        `তোর গার্লফ্রেন্ডরে চুদে তোর প্রেম শেষ করে দিমু! 💔`,
        `তোর মায়েরে চুদে WiFi কানেকশন নেবো, তুই হবি router! 📶`,
        `তোর বোনের পাছায় চকলেট মাখাই, চাটতেছি! 🍫`,
        `তোর মার ভোদায় মাছ চাষ করতেছি, জাল তুই দিস! 🐟`,
        `তোর মার দুধে দই বানাই, চাটতেছি বাটি সহ! 🥛`,
        `তোর হিজড়া জাতের ${genderText} রে আমি দুইবার চুদি একবার পেছনে! 🌀`,
        `তোর মার গুদে হেলিকপ্টার নামাই, ঘুরপাক খাচ্ছে! 🚁`,
        `তোর মা তো আমার পেটের নিচে হাউমাউ করছে, কি তোর খবর? 🤠`,
        `তোর মার মুখে মাল ফেলে পেইন্টিং করতেছি, তুই রঙ তুলির নাম রাখ! 🎨`,
        `তোর পোলামানুস্ক ${genderText}, তোর গুদে আঙ্গুল দিয়া বাজি জ্বালাই! 🧨`,
        `তোর মার গুদে সাপ ঢুকাই দিছি, হ্যাঁসিল করবি কেমনে? 🐍`,
        `তোর বোনরে টিভিতে লাইভে চুদি, তুই হবি ক্যামেরাম্যান! 📸`,
        `তোর মার পাছায় হাতুড়ি দিয়া ঠোক্কর মারতেছি, তুই হাত ধইরা ধরিস! 🔨`,
        `তোর গালির ভাষা শেষ, আমার চোদনের ভাষা শুরু! 💯`,
        `তোর মায়ের ভোদায় ফ্যান লাগাইছি, ঠান্ডা হইয়া গেছে! 🌀`,
        `তোর বাপের সামনে তোর মা'রে চুদি, বাপ তালি বাজায়! 👏`,
        `তোর বোনের গালে চুমু দেই, তুই হিংসে করিস! 😏`,
        `তোর মার পাছায় পেট্রোল ঢেলে আগুন লাগাই, তুই দৌড়াস! 🏃‍♂️🔥`,
        `তোর হিজড়া ${genderText} দেহে বেলুন ফাটাই, আওয়াজে তুই ভয় পাইস! 🎈`,
        `তোর মার গুদে চিপস খাই, তুই ডিপ আনিস! 🍟`,
        `তোর মায়ের দুধে চা বানাই, তুই চিনি দিস! 🍵`,
        `তোর বোনরে ফেসবুকে ব্লক দিছি, কারণ চুদা খেতে চায়! 🚫`,
        `তোর মার ভোদায় পিঁপড়া ঢুকাই, কামড় খেয়ে নাচে! 🐜`,
        `তোর গার্লফ্রেন্ডরে আমার বিছানায় রাখছি, তুই দরজায় পাহারা দিস! 🚪`
      ];

      // Initialize global variables if not exists
      if (!global.sonResponses) global.sonResponses = {};
      if (!global.sonActiveThreads) global.sonActiveThreads = new Set();
      
      // Store user data
      global.sonResponses[mention] = { 
        index: 0, 
        threadID: event.threadID,
        startTime: Date.now(),
        insultCount: 0
      };
      
      // Add thread to active threads
      global.sonActiveThreads.add(event.threadID);

      // Send initial message
      await message.reply(`😆 𝐻𝑒𝑦 ${event.mentions[mention]}! 𝐻𝑜𝑤 𝑎𝑟𝑒 𝑦𝑜𝑢 𝑑𝑜𝑖𝑛𝑔..?`);

      // Add message listener only once
      if (!global.sonListener) {
        global.sonListener = true;
        
        const messageHandler = async (msg) => {
          try {
            if (msg.type !== "message" || !msg.senderID || !msg.body || !msg.threadID) {
              return;
            }

            // Check if thread is active for son command
            if (!global.sonActiveThreads.has(msg.threadID)) {
              return;
            }

            // Check if user is in sonResponses and in correct thread
            const userData = global.sonResponses[msg.senderID];
            if (!userData || userData.threadID !== msg.threadID) {
              return;
            }

            // Limit to 30 minutes and 50 insults max
            const timeDiff = Date.now() - userData.startTime;
            if (timeDiff > 30 * 60 * 1000 || userData.insultCount >= 50) {
              delete global.sonResponses[msg.senderID];
              if (Object.keys(global.sonResponses).length === 0) {
                global.sonActiveThreads.delete(msg.threadID);
              }
              return;
            }

            const idx = userData.index;
            await api.sendMessage({
              body: insults[idx % insults.length],
              mentions: [{
                tag: msg.senderID,
                id: msg.senderID
              }]
            }, msg.threadID, msg.messageID);
            
            userData.index++;
            userData.insultCount++;

          } catch (error) {
            console.error("Error in son message handler:", error);
          }
        };

        // Add listener
        api.listenMqtt(messageHandler);
        
        // Store handler for potential cleanup
        global.sonMessageHandler = messageHandler;
      }

      // Auto cleanup after 30 minutes
      setTimeout(() => {
        if (global.sonResponses[mention]) {
          delete global.sonResponses[mention];
        }
        // Remove thread from active threads if no more users
        const hasOtherUsers = Object.values(global.sonResponses).some(
          data => data.threadID === event.threadID
        );
        if (!hasOtherUsers) {
          global.sonActiveThreads.delete(event.threadID);
        }
      }, 30 * 60 * 1000);

    } catch (error) {
      console.error("❌ Command execution error:", error);
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!");
    }
  },

  // Cleanup function when bot stops
  onStop: function() {
    if (global.sonMessageHandler) {
      // Remove listener if possible
      global.sonMessageHandler = null;
    }
    global.sonResponses = {};
    global.sonActiveThreads = new Set();
    global.sonListener = false;
  }
};
