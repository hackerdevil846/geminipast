const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "groupmention",
    aliases: [],
    version: "0.0.5",
    author: "Asif Mahmud",
    countDown: 80,
    role: 1,
    category: "group",
    shortDescription: {
      en: "Group member tagging with stylish header"
    },
    longDescription: {
      en: "Tag all group members with a beautiful custom header"
    },
    guide: {
      en: "{p}groupmention [text]"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Get participant IDs
      const threadInfo = await api.getThreadInfo(event.threadID);
      let all = threadInfo.participantIDs;
      all = all.filter(id => id !== api.getCurrentUserID() && id !== event.senderID);
      
      if (all.length === 0) {
        return api.sendMessage("❌ | No other members to tag in this group.", event.threadID, event.messageID);
      }

      // Create cache directory
      const cacheDir = __dirname + '/cache';
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Your provided header images
      const headerImages = [
        "https://i.imgur.com/uXWLBeC.jpeg",
        "https://i.imgur.com/7Dc9GrN.jpeg",
        "https://i.imgur.com/IaAVMFK.jpeg",
        "https://i.imgur.com/WceNH2z.jpeg",
        "https://i.imgur.com/1XosaEA.jpeg",
        "https://i.imgur.com/M58fVe6.jpeg",
        "https://i.imgur.com/czaXZ3a.jpeg",
        "https://i.imgur.com/xsu6v2I.jpeg",
        "https://i.imgur.com/f17dCCM.jpeg",
        "https://i.imgur.com/opquSuU.jpeg",
        "https://i.imgur.com/U87kL1B.jpeg",
        "https://i.imgur.com/Osa1EEd.jpeg",
        "https://i.imgur.com/38XTSUn.jpeg",
        "https://i.imgur.com/B7mAsZB.jpeg",
        "https://i.imgur.com/2APmfRs.jpeg",
        "https://i.imgur.com/mCUOJ8U.jpeg",
        "https://i.imgur.com/CnN1DxG.jpeg",
        "https://i.imgur.com/onlEme6.jpeg",
        "https://i.imgur.com/OF73muW.jpeg",
        "https://i.imgur.com/UO1sK8I.jpeg",
        "https://i.imgur.com/AlkGMJr.jpeg",
        "https://i.imgur.com/yZy8yvG.jpeg",
        "https://i.imgur.com/wLuwsWH.jpeg",
        "https://i.imgur.com/NoLgneL.jpeg",
        "https://i.imgur.com/wnXPqVv.jpeg",
        "https://i.imgur.com/D4ORkkM.jpeg",
        "https://i.imgur.com/bXZCoXT.jpeg",
        "https://i.imgur.com/ixx7Psr.jpeg",
        "https://i.imgur.com/TWP438b.jpeg",
        "https://i.imgur.com/zEiGsZE.jpeg",
        "https://i.imgur.com/pFbFkvj.jpeg",
        "https://i.imgur.com/U9fPLgz.jpeg",
        "https://i.imgur.com/VjOIoAg.jpeg",
        "https://i.imgur.com/gmYkkFF.jpeg",
        "https://i.imgur.com/4o5MRal.jpeg",
        "https://i.imgur.com/XDGkXfZ.jpeg",
        "https://i.imgur.com/B50Pi6m.jpeg",
        "https://i.imgur.com/BZKVLfn.jpeg",
        "https://i.imgur.com/wSQv7mM.jpeg",
        "https://i.imgur.com/2Ky8mww.jpeg",
        "https://i.imgur.com/4fhxxts.jpeg",
        "https://i.imgur.com/rvFm33m.jpeg",
        "https://i.imgur.com/J2EG5QV.jpeg",
        "https://i.imgur.com/JwkXNeQ.jpeg",
        "https://i.imgur.com/S9AGlH6.jpeg",
        "https://i.imgur.com/L9Jg1pg.jpeg",
        "https://i.imgur.com/urJBEyk.jpeg",
        "https://i.imgur.com/Hpw0D8O.jpeg",
        "https://i.imgur.com/i5hdv5w.jpeg",
        "https://i.imgur.com/O2uymjw.jpeg",
        "https://i.imgur.com/GiSKHaT.jpeg",
        "https://i.imgur.com/dAs2g30.jpeg",
        "https://i.imgur.com/RIhBJhH.jpeg",
        "https://i.imgur.com/pvSpSEb.jpeg",
        "https://i.imgur.com/XUJdz0T.jpeg",
        "https://i.imgur.com/jad2M8w.jpeg",
        "https://i.imgur.com/vbOsMtC.jpeg",
        "https://i.imgur.com/ZTtxhm8.jpeg",
        "https://i.imgur.com/8Qf8hLj.jpeg",
        "https://i.imgur.com/FXGMlHp.jpeg",
        "https://i.imgur.com/jWDw41w.jpeg",
        "https://i.imgur.com/LgvUCju.jpeg",
        "https://i.imgur.com/sdBRGt3.jpeg",
        "https://i.imgur.com/I32E7mo.jpeg",
        "https://i.imgur.com/OBbsiOY.jpeg",
        "https://i.imgur.com/ZlwE7gK.jpeg",
        "https://i.imgur.com/RjTJEia.jpeg",
        "https://i.imgur.com/mihSwWi.jpeg",
        "https://i.imgur.com/XLLJjEM.jpeg",
        "https://i.imgur.com/NkMNc9U.jpeg",
        "https://i.imgur.com/DscSpW9.jpeg",
        "https://i.imgur.com/jA1JB8Z.jpeg",
        "https://i.imgur.com/4744YOK.jpeg",
        "https://i.imgur.com/L7ZmAdP.jpeg",
        "https://i.imgur.com/fnqGUzZ.jpeg",
        "https://i.imgur.com/4r5vG6y.jpeg",
        "https://i.imgur.com/mOZyIBN.jpeg",
        "https://i.imgur.com/5nKPTdH.jpeg",
        "https://i.imgur.com/2DoiyZg.jpeg",
        "https://i.imgur.com/BDvYK5e.jpeg",
        "https://i.imgur.com/JImr4HA.jpeg",
        "https://i.imgur.com/SDYcTdB.jpeg",
        "https://i.imgur.com/GH3rmiF.jpeg",
        "https://i.imgur.com/tUjsJk6.jpeg",
        "https://i.imgur.com/jvjWcZ9.jpeg",
        "https://i.imgur.com/9l5tHki.jpeg",
        "https://i.imgur.com/P4GYTjs.jpeg",
        "https://i.imgur.com/4qXII5h.jpeg",
        "https://i.imgur.com/wix18FM.jpeg",
        "https://i.imgur.com/h6JyuUd.jpeg",
        "https://i.imgur.com/agZEIfN.jpeg",
        "https://i.imgur.com/qQJmQ7X.jpeg",
        "https://i.imgur.com/SJ7tHsd.jpeg",
        "https://i.imgur.com/IWsuHJN.jpeg",
        "https://i.imgur.com/PshaE6A.jpeg",
        "https://i.imgur.com/OvAjaUQ.jpeg",
        "https://i.imgur.com/CW4Id3o.jpeg",
        "https://i.imgur.com/5SWTCJ4.jpeg"
      ];

      const randomHeader = headerImages[Math.floor(Math.random() * headerImages.length)];
      const pathImg = __dirname + '/cache/groupmention_header.jpg';

      try {
        const response = await axios.get(randomHeader, {
          responseType: "arraybuffer",
          timeout: 30000
        });
        fs.writeFileSync(pathImg, Buffer.from(response.data, 'binary'));
      } catch (imageError) {
        console.error("Header image download failed:", imageError);
        // Continue without header image if download fails
      }

      // Prepare message body
      const defaultMsg = "✨ Admin is mentioning everyone ✨";
      const customMsg = args.join(" ");
      const body = customMsg || defaultMsg;
      
      // Generate mentions
      const mentions = [];
      let bodyWithMentions = `📢━━━━━━ GROUP MENTION ━━━━━━📢\n\n${body}\n\n`;
      
      for (let i = 0; i < all.length; i++) {
        mentions.push({
          tag: `@user${i + 1}`,
          id: all[i],
          fromIndex: bodyWithMentions.length
        });
        bodyWithMentions += `@user${i + 1} `;
        
        // Add line breaks for better formatting
        if ((i + 1) % 5 === 0) {
          bodyWithMentions += '\n';
        }
      }

      bodyWithMentions += `\n\n✅ ${all.length} members tagged successfully!`;

      // Prepare message object
      const messageObj = {
        body: bodyWithMentions,
        mentions
      };

      // Add attachment if image was downloaded successfully
      if (fs.existsSync(pathImg)) {
        messageObj.attachment = fs.createReadStream(pathImg);
      }

      // Send message
      await api.sendMessage(messageObj, event.threadID, event.messageID);

      // Clean up
      if (fs.existsSync(pathImg)) {
        setTimeout(() => {
          try {
            fs.unlinkSync(pathImg);
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
          }
        }, 5000);
      }

    } catch (error) {
      console.error("Group Mention Error:", error);
      
      let errorMessage = "❌ | Error while tagging members.";
      
      if (error.message.includes("threadInfo")) {
        errorMessage = "❌ | Failed to get group information.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "❌ | Request timeout. Please try again.";
      }
      
      return api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
