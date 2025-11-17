const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "time",
    version: "1.2.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    countDown: 5,
    category: "info",
    shortDescription: "Display current time and date with timezone support",
    longDescription: "Display current time and date with timezone support for popular timezones.",
    guide: {
      en: "{pn} [timezone]\nExample: {pn} Asia/Manila"
    },
    dependencies: {
      "moment-timezone": ""
    }
  },

  // Goat Bot entrypoint
  onStart: async function ({ message, args, api, event }) {
    await handleTime({ message, args, api, event });
  },

  // Compatibility with environments that still use `run`
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

    // No arguments: show usage and available timezones
    if (!args || args.length === 0) {
      const timezoneList = validTimezones.map(tz => `• ${tz}`).join("\n");
      return reply(
        "🕒 TIME COMMAND\n\n" +
        "Display current time for any timezone\n\n" +
        "Usage: time [timezone]\n" +
        "Example: time Asia/Manila\n\n" +
        `Available timezones:\n${timezoneList}\n\n` +
        "💡 Tip: Use the exact timezone name from the list"
      );
    }

    // Validate timezone
    const timezone = String(args[0]).trim();
    if (!moment.tz.zone(timezone)) {
      const suggestions = validTimezones.filter(tz =>
        tz.toLowerCase().includes(timezone.toLowerCase())
      );
      if (suggestions.length > 0) {
        return reply(`⚠️ Invalid timezone. Did you mean:\n${suggestions.join("\n")}`);
      }
      return reply('❌ Invalid timezone. Use "time" without arguments to see available timezones.');
    }

    // Build time information
    const now = moment().tz(timezone);
    const formattedTime = now.format("h:mm:ss A");
    const formattedDate = now.format("dddd, MMMM D, YYYY");
    const utcOffset = now.format("Z");
    const dayOfYear = now.dayOfYear();
    const weekOfYear = now.week();
    const isDST = now.isDST() ? " (DST)" : "";
    const locationName = timezone.split("/").pop().replace(/_/g, " ");

    const out =
      `🕒 TIME INFORMATION: ${locationName}\n\n` +
      `⏰ Current Time: ${formattedTime}\n` +
      `📅 Date: ${formattedDate}\n` +
      `🌐 Timezone: ${timezone}\n` +
      `⏱️ UTC Offset: UTC${utcOffset}${isDST}\n\n` +
      `📆 Day of Year: ${dayOfYear}\n` +
      `🗓️ Week of Year: ${weekOfYear}\n\n` +
      `⏳ Current Unix Timestamp: ${moment().unix()}`;

    return reply(out);
  } catch (error) {
    console.error("Time command error:", error);
    if (message && typeof message.reply === "function") {
      return message.reply("❌ An error occurred while fetching time information. Please try again later.");
    }
    if (api && event) {
      return api.sendMessage(
        "❌ An error occurred while fetching time information. Please try again later.",
        event.threadID,
        event.messageID
      );
    }
  }
}
