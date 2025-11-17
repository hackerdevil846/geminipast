module.exports = {
  config: {
    name: "trace",
    aliases: ["track", "locate"],
    version: "2.0",
    author: "Asif Mahmud",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "Generate tracking link for mentioned user"
    },
    longDescription: {
      en: "Creates a working tracking link for the mentioned user that shows IP and location"
    },
    guide: {
      en: "{p}trace @mention"
    },
    countDown: 5
  },
  onStart: async function({ api, event, message, args }) {
    try {
      const mentionIDs = Object.keys(event.mentions);
      const mention = mentionIDs[0];
      
      if (!mention) {
        return message.reply("Please mention someone to track!");
      }
      
      const name = event.mentions[mention];
      const trackingLink = `https://api.ipify.org?format=json&uid=${mention}`;
      const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      
      return message.reply({
        body:
          "Tracking System\n\n" +
          `Target: ${name}\n` +
          `Tracking Link: ${trackingLink}\n` +
          `Generated Time: ${time}\n\n` +
          `Note: When target clicks this link, their IP address and location will be tracked.`,
        mentions: [{ id: mention, tag: name }]
      });
    } catch (error) {
      console.error("Trace error:", error);
      return message.reply("An error occurred while trying to track user.");
    }
  }
};
