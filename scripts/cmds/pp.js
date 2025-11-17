module.exports = {
  config: {
    name: "profile",
    aliases: ["pp"],
    version: "2.0",
    author: "Dipto & Asif Mahmud",
    countDown: 5,
    role: 0,
    description: "Get user profile picture",
    category: "image",
    guide: {
      en: "{pn} [@tag|userID|reply|facebookURL]"
    }
  },

  onStart: async function ({ event, message, usersData, args }) {
    try {
      // Validate usersData availability
      if (!usersData || typeof usersData.getAvatarUrl !== 'function') {
        return message.reply("❌ System error: Profile data unavailable");
      }

      let targetUID;

      // Determine target user ID
      if (event.type === "message_reply") {
        // Case 1: Reply to a message
        targetUID = event.messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        // Case 2: User mentioned
        targetUID = Object.keys(event.mentions)[0];
      } else if (args[0]) {
        // Case 3: Facebook URL or User ID provided
        const input = args[0].trim();
        
        if (input.includes("facebook.com")) {
          // Extract user ID from Facebook URL
          const match = input.match(/(?:\?id=|\/)(\d+)/);
          targetUID = match ? match[1] : null;
        } else if (/^\d+$/.test(input)) {
          // Direct user ID
          targetUID = input;
        } else {
          return message.reply("❌ Invalid input. Please use:\n• @tag a user\n• Reply to a message\n• Provide a user ID\n• Provide a Facebook profile URL");
        }
      } else {
        // Case 4: No input - get sender's profile
        targetUID = event.senderID;
      }

      // Validate target UID
      if (!targetUID || !/^\d+$/.test(targetUID)) {
        return message.reply("❌ Invalid user ID format");
      }

      // Get avatar URL
      const avatarUrl = await usersData.getAvatarUrl(targetUID);
      
      if (!avatarUrl) {
        return message.reply("❌ Could not retrieve profile picture. User may not exist or profile is private.");
      }

      // Validate URL format
      if (!avatarUrl.startsWith('http')) {
        return message.reply("❌ Invalid profile image URL returned");
      }

      // Get image stream
      const imageStream = await global.utils.getStreamFromURL(avatarUrl);
      
      if (!imageStream) {
        return message.reply("❌ Failed to load profile image");
      }

      // Send the profile picture
      await message.reply({ 
        body: "📸 Profile Picture:", 
        attachment: imageStream 
      });

    } catch (error) {
      console.error("Profile command error:", error);
      
      // User-friendly error message
      await message.reply("❌ Failed to get profile picture. Please try again later.");
    }
  }
};
