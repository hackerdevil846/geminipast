const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "groupstats",
    aliases: [],
    version: "1.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "📊 𝐺𝑟𝑜𝑢𝑝 𝑠𝑡𝑎𝑡𝑖𝑠𝑡𝑖𝑐𝑠 𝑎𝑛𝑑 𝑎𝑛𝑎𝑙𝑦𝑡𝑖𝑐𝑠"
    },
    longDescription: {
      en: "📊 𝐷𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑠𝑡𝑎𝑡𝑖𝑠𝑡𝑖𝑐𝑠 𝑤𝑖𝑡ℎ 𝑎𝑑𝑚𝑖𝑛𝑠, 𝑎𝑐𝑡𝑖𝑣𝑒 𝑚𝑒𝑚𝑏𝑒𝑟𝑠, 𝑡𝑜𝑝 𝑠𝑒𝑛𝑑𝑒𝑟𝑠"
    },
    guide: {
      en: "{p}groupstats"
    },
    countDown: 5
  },

  onStart: async function({ api, event, usersData, message }) {
    try {
      const { threadID } = event;

      // Get thread information
      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs;
      const adminIDs = threadInfo.adminIDs ? threadInfo.adminIDs.map(a => a.id) : [];
      
      // Filter out bot ID
      const botID = api.getCurrentUserID();
      const filteredParticipants = participantIDs.filter(id => id !== botID);

      // Get message history for analytics
      let messages;
      try {
        messages = await api.getThreadHistory(threadID, 100, null);
      } catch (historyError) {
        messages = [];
      }

      // Count messages per user
      const senderCountMap = {};
      if (messages && messages.length > 0) {
        messages.forEach(msg => {
          if (filteredParticipants.includes(msg.senderID)) {
            senderCountMap[msg.senderID] = (senderCountMap[msg.senderID] || 0) + 1;
          }
        });
      }

      const activeUserIDs = Object.keys(senderCountMap);
      const numActiveUsers = activeUserIDs.length;

      // Get top senders with names
      const topSenders = [];
      const sortedSenders = Object.entries(senderCountMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      for (const [uid, count] of sortedSenders) {
        try {
          const userInfo = await api.getUserInfo(uid);
          const userName = userInfo[uid]?.name || `User ${uid}`;
          topSenders.push(`🏆 ${userName}: ${count} messages`);
        } catch {
          topSenders.push(`🏆 User ${uid}: ${count} messages`);
        }
      }

      // Get admin names
      const adminNames = [];
      for (const adminID of adminIDs) {
        try {
          const userInfo = await api.getUserInfo(adminID);
          const userName = userInfo[adminID]?.name || `User ${adminID}`;
          adminNames.push(`👑 ${userName}`);
        } catch {
          adminNames.push(`👑 User ${adminID}`);
        }
      }

      // Calculate statistics
      const numAdmins = adminIDs.length;
      const numMembers = filteredParticipants.length;
      const activePercentage = Math.round((numActiveUsers / numMembers) * 100);

      // Get group creation time if available
      let groupAge = "Unknown";
      if (threadInfo.threadMetadata && threadInfo.threadMetadata.createdTime) {
        const createdTime = new Date(threadInfo.threadMetadata.createdTime);
        const now = new Date();
        const diffTime = Math.abs(now - createdTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        groupAge = `${diffDays} days`;
      }

      // Create beautiful text-based report
      let statsMessage = `╔═══════════════════════════╗\n`;
      statsMessage += `║        📊 GROUP STATS       ║\n`;
      statsMessage += `╠═══════════════════════════╣\n`;
      statsMessage += `║ 🏷️  Name: ${threadInfo.threadName || 'Unknown'}\n`;
      statsMessage += `║ 👥 Total Members: ${numMembers}\n`;
      statsMessage += `║ 👑 Admins: ${numAdmins}\n`;
      statsMessage += `║ 🟢 Active Users: ${numActiveUsers} (${activePercentage}%)\n`;
      
      if (groupAge !== "Unknown") {
        statsMessage += `║ 📅 Group Age: ${groupAge}\n`;
      }
      
      statsMessage += `╠═══════════════════════════╣\n`;
      
      if (topSenders.length > 0) {
        statsMessage += `║        🏆 TOP SENDERS       ║\n`;
        statsMessage += `╠═══════════════════════════╣\n`;
        topSenders.forEach((sender, index) => {
          if (index < 3) { // Show only top 3
            statsMessage += `║ ${sender}\n`;
          }
        });
        statsMessage += `╠═══════════════════════════╣\n`;
      }

      if (adminNames.length > 0) {
        statsMessage += `║          👑 ADMINS          ║\n`;
        statsMessage += `╠═══════════════════════════╣\n`;
        adminNames.forEach((admin, index) => {
          if (index < 5) { // Show max 5 admins
            statsMessage += `║ ${admin}\n`;
          }
        });
      }
      
      statsMessage += `╚═══════════════════════════╝\n\n`;
      statsMessage += `📈 Based on last 100 messages`;

      // Try to get group image
      let attachment = null;
      if (threadInfo.imageSrc) {
        try {
          const cacheDir = __dirname + "/cache";
          if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
          }

          const imagePath = __dirname + `/cache/group_avatar_${threadID}.jpg`;
          const response = await axios.get(threadInfo.imageSrc, { 
            responseType: "arraybuffer",
            timeout: 15000
          });
          
          fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
          attachment = fs.createReadStream(imagePath);

          // Schedule cleanup
          setTimeout(() => {
            try {
              if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
              }
            } catch (cleanupError) {
              console.error("Cleanup error:", cleanupError);
            }
          }, 10000);

        } catch (imageError) {
          console.error("Group image download failed:", imageError);
          // Continue without image
        }
      }

      // Send the statistics
      if (attachment) {
        await message.reply({
          body: statsMessage,
          attachment: attachment
        });
      } else {
        await message.reply(statsMessage);
      }

    } catch (error) {
      console.error("Group Stats Error:", error);
      
      let errorMessage = "❌ Failed to get group statistics.";
      
      if (error.message.includes("threadInfo")) {
        errorMessage = "❌ Cannot access group information.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "❌ Request timeout. Please try again.";
      }
      
      await message.reply(errorMessage);
    }
  }
};
