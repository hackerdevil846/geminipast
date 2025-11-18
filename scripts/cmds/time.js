const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "time",
    version: "2.0.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    credits: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    role: 0,
    countDown: 5,
    category: "info",
    shortDescription: {
      en: "🕒 𝐃𝐢𝐬𝐩𝐥𝐚𝐲 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐭𝐢𝐦𝐞 𝐚𝐧𝐝 𝐝𝐚𝐭𝐞 𝐰𝐢𝐭𝐡 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞 𝐬𝐮𝐩𝐩𝐨𝐫𝐭"
    },
    longDescription: {
      en: "🕒 𝐃𝐢𝐬𝐩𝐥𝐚𝐲 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐭𝐢𝐦𝐞 𝐚𝐧𝐝 𝐝𝐚𝐭𝐞 𝐰𝐢𝐭𝐡 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞 𝐬𝐮𝐩𝐩𝐨𝐫𝐭 𝐟𝐨𝐫 𝐩𝐨𝐩𝐮𝐥𝐚𝐫 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞𝐬."
    },
    guide: {
      en: "{pn} [𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞]\n𝐄𝐱𝐚𝐦𝐩𝐥𝐞: {pn} 𝐀𝐬𝐢𝐚/𝐃𝐡𝐚𝐤𝐚\n{pn} 𝐀𝐬𝐢𝐚/𝐌𝐚𝐧𝐢𝐥𝐚\n{pn} 𝐀𝐦𝐞𝐫𝐢𝐜𝐚/𝐍𝐞𝐰_𝐘𝐨𝐫𝐤"
    },
    dependencies: {
      "moment-timezone": ""
    }
  },

  onStart: async function ({ message, args, api, event }) {
    await handleTime({ message, args, api, event });
  },

  run: async function ({ api, event, args, message }) {
    await handleTime({ message, args, api, event });
  }
};

async function handleTime({ message, args, api, event }) {
  try {
    const validTimezones = [
      "Asia/Dhaka",
      "Asia/Manila", 
      "America/New_York",
      "Europe/London",
      "Asia/Tokyo",
      "Australia/Sydney",
      "Europe/Paris",
      "Asia/Dubai",
      "Asia/Kolkata",
      "Asia/Shenzhen",
      "Europe/Amsterdam",
      "Asia/Kuala_Lumpur",
      "America/Los_Angeles",
      "Africa/Lagos",
      "Asia/Seoul",
      "Europe/Berlin"
    ];

    const reply = (text) => {
      if (message && typeof message.reply === "function") return message.reply(text);
      if (api && event) return api.sendMessage(text, event.threadID, event.messageID);
    };

    // 𝐍𝐨 𝐚𝐫𝐠𝐮𝐦𝐞𝐧𝐭𝐬: 𝐬𝐡𝐨𝐰 𝐚𝐥𝐥 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞𝐬
    if (!args || args.length === 0) {
      const timezoneList = validTimezones.map(tz => `• ${tz}`).join("\n");
      return reply(
        "🕒 𝐓𝐈𝐌𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃\n\n" +
        "𝐃𝐢𝐬𝐩𝐥𝐚𝐲 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐭𝐢𝐦𝐞 𝐟𝐨𝐫 𝐚𝐧𝐲 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞\n\n" +
        "𝐔𝐬𝐚𝐠𝐞: 𝐭𝐢𝐦𝐞 [𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞]\n" +
        "𝐄𝐱𝐚𝐦𝐩𝐥𝐞: 𝐭𝐢𝐦𝐞 𝐀𝐬𝐢𝐚/𝐃𝐡𝐚𝐤𝐚\n\n" +
        `📋 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞𝐬:\n${timezoneList}\n\n` +
        "💡 𝐓𝐢𝐩: 𝐔𝐬𝐞 𝐭𝐡𝐞 𝐞𝐱𝐚𝐜𝐭 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞 𝐧𝐚𝐦𝐞 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐥𝐢𝐬𝐭"
      );
    }

    // 𝐒𝐩𝐞𝐜𝐢𝐚𝐥 𝐜𝐚𝐬𝐞: 𝐬𝐡𝐨𝐰 𝐚𝐥𝐥 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞𝐬 𝐚𝐭 𝐨𝐧𝐜𝐞
    if (args[0].toLowerCase() === "all") {
      let allTimes = "🕒 𝐂𝐔𝐑𝐑𝐄𝐍𝐓 𝐓𝐈𝐌𝐄𝐒 𝐀𝐂𝐑𝐎𝐒𝐒 𝐓𝐇𝐄 𝐖𝐎𝐑𝐋𝐃\n\n";
      
      for (const timezone of validTimezones) {
        const now = moment().tz(timezone);
        const formattedTime = now.format("h:mm:ss A");
        const formattedDate = now.format("MMM D, YYYY");
        const locationName = timezone.split("/").pop().replace(/_/g, " ");
        
        allTimes += `🌍 ${locationName}\n`;
        allTimes += `⏰ ${formattedTime} | 📅 ${formattedDate}\n`;
        allTimes += `📍 ${timezone}\n\n`;
      }
      
      allTimes += "⏰ 𝐁𝐨𝐭 𝐒𝐞𝐫𝐯𝐞𝐫 𝐓𝐢𝐦𝐞: " + moment().format("h:mm:ss A");
      
      return reply(allTimes);
    }

    // 𝐕𝐚𝐥𝐢𝐝𝐚𝐭𝐞 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞
    const timezone = String(args[0]).trim();
    if (!moment.tz.zone(timezone)) {
      const suggestions = validTimezones.filter(tz =>
        tz.toLowerCase().includes(timezone.toLowerCase())
      );
      
      if (suggestions.length > 0) {
        return reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞. 𝐃𝐢𝐝 𝐲𝐨𝐮 𝐦𝐞𝐚𝐧:\n${suggestions.map(s => `• ${s}`).join("\n")}`);
      }
      return reply('❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞. 𝐔𝐬𝐞 "𝐭𝐢𝐦𝐞" 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐚𝐫𝐠𝐮𝐦𝐞𝐧𝐭𝐬 𝐭𝐨 𝐬𝐞𝐞 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐭𝐢𝐦𝐞𝐳𝐨𝐧𝐞𝐬.');
    }

    // 𝐁𝐮𝐢𝐥𝐝 𝐭𝐢𝐦𝐞 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧
    const now = moment().tz(timezone);
    const formattedTime = now.format("h:mm:ss A");
    const formattedDate = now.format("dddd, MMMM D, YYYY");
    const utcOffset = now.format("Z");
    const dayOfYear = now.dayOfYear();
    const weekOfYear = now.week();
    const isDST = now.isDST() ? " (𝐃𝐒𝐓)" : "";
    const locationName = timezone.split("/").pop().replace(/_/g, " ");
    const daySuffix = getDaySuffix(now.date());
    const season = getSeason(now.month() + 1);
    const quarter = getQuarter(now.month() + 1);

    const out =
      `🕒 𝐓𝐈𝐌𝐄 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍: ${locationName}\n\n` +
      `⏰ 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐓𝐢𝐦𝐞: ${formattedTime}\n` +
      `📅 𝐃𝐚𝐭𝐞: ${formattedDate}\n` +
      `🌐 𝐓𝐢𝐦𝐞𝐳𝐨𝐧𝐞: ${timezone}\n` +
      `⏱️ 𝐔𝐓𝐂 𝐎𝐟𝐟𝐬𝐞𝐭: 𝐔𝐓𝐂${utcOffset}${isDST}\n\n` +
      `📊 𝐃𝐚𝐭𝐞 𝐃𝐞𝐭𝐚𝐢𝐥𝐬:\n` +
      `• 𝐃𝐚𝐲 𝐨𝐟 𝐘𝐞𝐚𝐫: ${dayOfYear}${daySuffix}\n` +
      `• 𝐖𝐞𝐞𝐤 𝐨𝐟 𝐘𝐞𝐚𝐫: ${weekOfYear}\n` +
      `• 𝐐𝐮𝐚𝐫𝐭𝐞𝐫: ${quarter}\n` +
      `• 𝐒𝐞𝐚𝐬𝐨𝐧: ${season}\n\n` +
      `⏳ 𝐔𝐧𝐢𝐱 𝐓𝐢𝐦𝐞𝐬𝐭𝐚𝐦𝐩: ${moment().unix()}\n` +
      `🔄 𝐁𝐨𝐭 𝐒𝐞𝐫𝐯𝐞𝐫 𝐓𝐢𝐦𝐞: ${moment().format("h:mm:ss A")}`;

    return reply(out);
  } catch (error) {
    console.error("❌ 𝐓𝐢𝐦𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", error);
    const errorMsg = "❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐟𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐭𝐢𝐦𝐞 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";
    
    if (message && typeof message.reply === "function") {
      return message.reply(errorMsg);
    }
    if (api && event) {
      return api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
}

// 𝐇𝐞𝐥𝐩𝐞𝐫 𝐟𝐮𝐧𝐜𝐭𝐢𝐨𝐧𝐬
function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function getSeason(month) {
  if (month >= 3 && month <= 5) return "Spring";
  if (month >= 6 && month <= 8) return "Summer";
  if (month >= 9 && month <= 11) return "Autumn";
  return "Winter";
}

function getQuarter(month) {
  if (month <= 3) return "Q1";
  if (month <= 6) return "Q2";
  if (month <= 9) return "Q3";
  return "Q4";
}
