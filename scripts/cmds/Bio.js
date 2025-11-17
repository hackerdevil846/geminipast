module.exports = {
  config: {
    name: "bio",
    aliases: ["changebio", "setbio", "botbio"],
    version: "1.0.1",
    author: "Asif Mahmud",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
      en: "Bot's bio changer"
    },
    longDescription: {
      en: "Allows admins to change the bot's profile bio"
    },
    guide: {
      en: "{p}bio [new bio text]"
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const newBio = args.join(" ");

      if (!newBio) {
        return message.reply("❗ Please enter the new bio text.");
      }

      // Change bot's bio
      await api.changeBio(newBio);
      
      return message.reply(`✅ Bot's bio successfully changed to:\n${newBio}`);

    } catch (err) {
      console.error("Unexpected error in bio command:", err);
      // Don't send error message to avoid spam
    }
  }
};
