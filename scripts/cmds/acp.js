const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "accept",
    aliases: ['acp'],
    version: "2.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    countDown: 45,
    role: 2,
    shortDescription: {
      en: "✅ Accept or delete friend requests easily"
    },
    longDescription: {
      en: "🤖 Automatically manage all your pending Facebook friend requests"
    },
    category: "𝐔𝐭𝐢𝐥𝐢𝐭𝐲",
    guide: {
      en: "💡 How to use:\n» {p}acp - View pending requests\n» Then reply with: add/del <number|all>\n📝 Examples:\n  add 1 2 3 - Accept requests 1,2,3\n  del all - Delete all requests\n  add all - Accept all requests"
    },
    dependencies: {
      "moment-timezone": ""
    }
  },

  onReply: async function ({ message, Reply, event, api, commandName }) {
    let cleanupPerformed = false;
    
    // 🔧 Safe unsend function
    const safeUnsend = async (messageID) => {
      try {
        if (messageID) await api.unsendMessage(messageID);
        return true;
      } catch (e) {
        return false;
      }
    };

    // 🧹 Cleanup function
    const cleanup = async (replyData) => {
      if (cleanupPerformed) return;
      cleanupPerformed = true;
      
      try {
        if (replyData?.unsendTimeout) {
          clearTimeout(replyData.unsendTimeout);
        }
        if (replyData?.messageID) {
          await safeUnsend(replyData.messageID);
        }
        if (global.GoatBot?.onReply && replyData?.messageID) {
          global.GoatBot.onReply.delete(replyData.messageID);
        }
      } catch (error) {
        // Silent cleanup
      }
    };

    try {
      // ✅ Validate reply data
      if (!Reply || !Reply.author || !Array.isArray(Reply.listRequest)) {
        await cleanup(Reply);
        return await api.sendMessage("❌ Invalid or expired reply data. Please use the command again.", event.threadID);
      }

      const { author, listRequest, messageID } = Reply;
      
      // 🔐 Check authorization
      if (author !== event.senderID) {
        return await api.sendMessage("❌ You are not authorized to use this reply.", event.threadID);
      }

      // ⏰ Clear existing timeout
      if (Reply.unsendTimeout) {
        clearTimeout(Reply.unsendTimeout);
      }

      const args = event.body.trim().toLowerCase().split(/\s+/);
      
      // 📋 Validate input format
      if (args.length < 2) {
        return await api.sendMessage(
          "❌ Invalid format! Please use:\n" +
          "✅ add <number|all> - Accept requests\n" +
          "❌ del <number|all> - Delete requests\n" +
          "📝 Examples:\n" +
          "  add 1 2 3\n" +
          "  del all\n" +
          "  add all", 
          event.threadID
        );
      }

      const action = args[0];
      const target = args[1];

      if (!["add", "del"].includes(action)) {
        return await api.sendMessage("❌ Invalid action! Use 'add' to accept or 'del' to delete.", event.threadID);
      }

      // 🎯 Prepare API form
      const baseForm = {
        av: api.getCurrentUserID(),
        fb_api_caller_class: "RelayModern",
        variables: {
          input: {
            source: "friends_tab",
            actor_id: api.getCurrentUserID(),
            client_mutation_id: Date.now().toString(36) + Math.random().toString(36).substring(2)
          },
          scale: 3,
          refresh_num: 0
        }
      };

      // 🔧 Set API configuration based on action
      let apiConfig = {};
      if (action === "add") {
        apiConfig = {
          fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
          doc_id: "3147613905362928"
        };
      } else {
        apiConfig = {
          fb_api_req_friendly_name: "FriendingCometFriendRequestDeleteMutation",
          doc_id: "4108254489275063"
        };
      }

      const form = { ...baseForm, ...apiConfig };
      const processingUsers = [];

      // 🔢 Determine target IDs
      let targetIDs = [];
      if (target === "all") {
        targetIDs = listRequest.map((_, idx) => idx + 1);
      } else {
        targetIDs = args.slice(1)
          .map(stt => parseInt(stt))
          .filter(stt => !isNaN(stt) && stt > 0 && stt <= listRequest.length);
      }

      if (targetIDs.length === 0) {
        return await api.sendMessage("❌ No valid numbers provided or numbers out of range.", event.threadID);
      }

      // 👥 Prepare users for processing
      for (const stt of targetIDs) {
        const index = stt - 1;
        const user = listRequest[index];

        if (user?.node?.id && user?.node?.name) {
          processingUsers.push({
            name: user.node.name,
            id: user.node.id,
            index: stt
          });
        }
      }

      if (processingUsers.length === 0) {
        return await api.sendMessage("❌ No valid users to process.", event.threadID);
      }

      // ⏳ Send processing message
      const processingMsg = await api.sendMessage(
        `🔄 Processing ${processingUsers.length} request(s)...\n` +
        `⏰ This may take ${Math.ceil(processingUsers.length * 3)} seconds\n` +
        `📊 Please wait...`, 
        event.threadID
      );

      const success = [];
      const failed = [];

      // 🚀 Process users sequentially
      for (const [idx, user] of processingUsers.entries()) {
        try {
          // 🕒 Add delay to avoid rate limiting
          const delay = 2500 + Math.floor(Math.random() * 1500);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          const userForm = JSON.parse(JSON.stringify(form));
          userForm.variables.input.friend_requester_id = user.id;
          
          const response = await api.httpPost("https://www.facebook.com/api/graphql/", userForm, {
            timeout: 30000
          });

          let data;
          try {
            data = typeof response === 'string' ? JSON.parse(response) : response;
          } catch {
            failed.push(`${user.name} (#${user.index})`);
            continue;
          }

          // ✅ Check for success
          if (data?.errors || data?.error) {
            failed.push(`${user.name} (#${user.index})`);
          } else {
            success.push(`${user.name} (#${user.index})`);
          }

          // 📈 Update progress every 3 users
          if ((idx + 1) % 3 === 0 || idx === processingUsers.length - 1) {
            await safeUnsend(processingMsg.messageID);
            const progressMsg = await api.sendMessage(
              `📊 Progress: ${idx + 1}/${processingUsers.length} users\n` +
              `✅ Success: ${success.length}\n` +
              `❌ Failed: ${failed.length}\n` +
              `⏰ Continuing...`, 
              event.threadID
            );
            processingMsg.messageID = progressMsg.messageID;
          }

        } catch (error) {
          console.error(`Error processing ${user.name}:`, error.message);
          failed.push(`${user.name} (#${user.index})`);
          
          // 🚨 If rate limited, wait longer
          if (error.message?.includes('rate limit')) {
            await new Promise(resolve => setTimeout(resolve, 8000));
          }
        }
      }

      // 🧹 Final cleanup
      await safeUnsend(processingMsg.messageID);
      await safeUnsend(messageID);
      await cleanup(Reply);

      // 📊 Build final result
      const actionText = action === 'add' ? 'accepted' : 'deleted';
      let resultMsg = `🎯 **Processing Complete**\n\n`;
      
      if (success.length > 0) {
        resultMsg += `✅ Successfully ${actionText}: ${success.length} user(s)\n`;
        const displaySuccess = success.slice(0, 8);
        resultMsg += displaySuccess.join(", ");
        if (success.length > 8) resultMsg += `, ... and ${success.length - 8} more`;
        resultMsg += "\n\n";
      }
      
      if (failed.length > 0) {
        resultMsg += `❌ Failed: ${failed.length} user(s)\n`;
        const displayFailed = failed.slice(0, 5);
        resultMsg += displayFailed.join(", ");
        if (failed.length > 5) resultMsg += `, ... and ${failed.length - 5} more`;
      }

      if (success.length === 0 && failed.length === 0) {
        resultMsg = "❌ No users were processed. Please try again.";
      }

      return await api.sendMessage(resultMsg, event.threadID);

    } catch (error) {
      console.error("💥 ACP Reply Error:", error);
      
      let errorMessage = "❌ An error occurred while processing requests.";
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = "❌ Network error. Please check your internet connection.";
      } else if (error.message?.includes('timeout')) {
        errorMessage = "❌ Request timed out. Please try again later.";
      } else if (error.message?.includes('rate limit')) {
        errorMessage = "❌ Rate limit exceeded. Please wait 15-30 minutes before trying again.";
      }
      
      await cleanup(Reply);
      return await api.sendMessage(errorMessage, event.threadID);
    }
  },

  onStart: async function ({ event, api, commandName }) {
    try {
      // 📦 Dependency check
      let momentAvailable = true;
      try {
        require("moment-timezone");
      } catch {
        momentAvailable = false;
      }

      if (!momentAvailable) {
        return await api.sendMessage(
          "❌ Missing dependencies!\n" +
          "💡 Please install moment-timezone:\n" +
          "npm install moment-timezone", 
          event.threadID
        );
      }

      // 📡 Prepare API request
      const form = {
        av: api.getCurrentUserID(),
        fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
        fb_api_caller_class: "RelayModern",
        doc_id: "4499164963466303",
        variables: JSON.stringify({ 
          input: { 
            scale: 3 
          } 
        })
      };

      const response = await api.httpPost("https://www.facebook.com/api/graphql/", form, {
        timeout: 60000
      });
      
      if (!response) {
        return await api.sendMessage("❌ Empty response from Facebook API. Please try again.", event.threadID);
      }

      let data;
      try {
        data = typeof response === 'string' ? JSON.parse(response) : response;
      } catch {
        return await api.sendMessage("❌ Failed to parse Facebook API response.", event.threadID);
      }

      // ✅ Validate API response
      if (!data || typeof data !== 'object') {
        return await api.sendMessage("❌ Invalid API response format.", event.threadID);
      }

      if (data.errors) {
        console.error("Facebook API Errors:", data.errors);
        return await api.sendMessage("❌ Facebook API returned errors. Please try again later.", event.threadID);
      }

      const listRequest = data?.data?.viewer?.friending_possibilities?.edges || [];

      if (!Array.isArray(listRequest) || listRequest.length === 0) {
        return await api.sendMessage(
          "✅ No pending friend requests found!\n" +
          "🎉 Your friend request list is clean.", 
          event.threadID
        );
      }

      // 📝 Build request list message
      let msg = "📨 **Pending Friend Requests**\n\n";
      
      listRequest.forEach((user, i) => {
        if (user?.node) {
          const userName = user.node.name || 'Unknown';
          const userId = user.node.id || 'N/A';
          const userUrl = user.node.url ? user.node.url.replace("www.facebook", "fb") : "N/A";
          
          msg += `${i + 1}. 👤 ${userName}\n`;
          msg += `   🆔 ${userId}\n`;
          msg += `   🔗 ${userUrl}\n`;
          msg += `   ⏰ ${moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}\n\n`;
        }
      });

      msg += "💡 **How to use:**\n";
      msg += "✅ add <number|all> - Accept requests\n";
      msg += "❌ del <number|all> - Delete requests\n\n";
      msg += "📝 **Examples:**\n";
      msg += "  add 1 2 3 - Accept requests 1,2,3\n";
      msg += "  del all - Delete all requests\n";
      msg += "  add all - Accept all requests\n\n";
      msg += `⏰ **Expires in:** ${this.config.countDown} seconds`;

      const sentMessage = await api.sendMessage(msg, event.threadID);

      if (!sentMessage?.messageID) {
        return await api.sendMessage("❌ Failed to send message. Please try again.", event.threadID);
      }

      // 🔄 Initialize reply handler
      if (!global.GoatBot) global.GoatBot = {};
      if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();

      const unsendTimeout = setTimeout(async () => {
        try {
          await api.unsendMessage(sentMessage.messageID);
          if (global.GoatBot.onReply) {
            global.GoatBot.onReply.delete(sentMessage.messageID);
          }
        } catch (error) {
          // Silent cleanup
        }
      }, this.config.countDown * 1000);

      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName,
        messageID: sentMessage.messageID,
        listRequest,
        author: event.senderID,
        unsendTimeout
      });

    } catch (error) {
      console.error("💥 ACP OnStart Error:", error);
      
      let errorMessage = "❌ Error retrieving friend request list.";
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = "❌ Network error. Please check your internet connection.";
      } else if (error.message?.includes('timeout')) {
        errorMessage = "❌ Request timed out. Please try again later.";
      } else if (error.message?.includes('rate limit')) {
        errorMessage = "❌ Rate limit exceeded. Please wait 15-30 minutes.";
      }
      
      await api.sendMessage(errorMessage, event.threadID);
    }
  }
};
