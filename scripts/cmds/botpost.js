const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "botpost",
    aliases: ["bpost", "autopost"],
    version: "1.5.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 2,
    category: "system",
    shortDescription: {
      en: "Bot account e notun post korar jonno command"
    },
    longDescription: {
      en: "Bot account e notun post korar jonno command"
    },
    guide: {
      en: "{p}botpost [text] [image]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ event, api, args }) {
    try {
      const { threadID, messageID, senderID } = event;
      const botID = api.getCurrentUserID();
      
      const postData = {
        privacy: "FRIENDS",
        content: "",
        images: []
      };
      
      const options = {
        "1": "🌐 Public",
        "2": "👥 Friends",
        "3": "🔒 Only Me"
      };
      
      const menu = Object.entries(options).map(([key, value]) => `» ${key}. ${value}`).join('\n');
      
      return api.sendMessage(`📝 Post Creation Menu:\n\n${menu}\n\nSelect who can see this post:`, threadID, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          postData,
          type: "privacy",
          botID
        });
      }, messageID);
    } catch (error) {
      console.error("Command Error:", error);
      api.sendMessage("❌ An error occurred. Please try again later.", event.threadID, event.messageID);
    }
  },

  handleReply: async function({ event, api, handleReply }) {
    try {
      const { type, author, postData, botID } = handleReply;
      if (event.senderID !== author) return;
      
      const { threadID, messageID, attachments, body } = event;
      
      switch (type) {
        case "privacy":
          if (!["1", "2", "3"].includes(body)) {
            return api.sendMessage("❌ Invalid selection! Please choose 1, 2 or 3", threadID, messageID);
          }
          
          postData.privacy = body === "1" ? "EVERYONE" : body === "2" ? "FRIENDS" : "SELF";
          api.unsendMessage(handleReply.messageID);
          
          api.sendMessage("✍️ Reply with your post content:\n(Type '0' to skip)", threadID, (e, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: author,
              postData,
              type: "content",
              botID
            });
          }, messageID);
          break;
          
        case "content":
          if (body !== "0") postData.content = body;
          api.unsendMessage(handleReply.messageID);
          
          api.sendMessage("🖼️ Reply with an image for the post:\n(Reply '0' to post without image)", threadID, (e, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: author,
              postData,
              type: "image",
              botID
            });
          }, messageID);
          break;
          
        case "image":
          api.unsendMessage(handleReply.messageID);
          
          if (body !== "0" && attachments.length > 0) {
            try {
              const imageUrls = [];
              for (const attachment of attachments) {
                if (attachment.type === "photo") {
                  imageUrls.push(attachment.url);
                }
              }
              
              if (imageUrls.length > 0) {
                postData.images = await Promise.all(imageUrls.map(async url => {
                  const response = await axios.get(url, { responseType: "arraybuffer" });
                  return Buffer.from(response.data);
                }));
              }
            } catch (e) {
              console.error(e);
            }
          }
          
          try {
            const postResult = await createPost(api, botID, postData);
            api.sendMessage(`✅ Post Successfully Created!\n\n🔗 Post URL: ${postResult.url}\n👁️ Privacy: ${getPrivacyName(postData.privacy)}`, threadID, messageID);
          } catch (error) {
            console.error(error);
            api.sendMessage("❌ Error creating post! Please try again later.", threadID, messageID);
          }
          break;
      }
    } catch (error) {
      console.error("HandleReply Error:", error);
      api.sendMessage("❌ An error occurred. Please try again later.", event.threadID, event.messageID);
    }
  }
};

async function createPost(api, botID, postData) {
  const uuid = getGUID();
  
  const formData = {
    "input": {
      "composer_entry_point": "inline_composer",
      "composer_source_surface": "timeline",
      "idempotence_token": uuid + "_FEED",
      "source": "WWW",
      "attachments": [],
      "audience": {
        "privacy": {
          "allow": [],
          "base_state": postData.privacy,
          "deny": [],
          "tag_expansion_state": "UNSPECIFIED"
        }
      },
      "message": {
        "ranges": [],
        "text": postData.content || ""
      },
      "with_tags_ids": [],
      "inline_activities": [],
      "explicit_place_id": "0",
      "text_format_preset_id": "0",
      "logging": {
        "composer_session_id": uuid
      },
      "tracking": [null],
      "actor_id": botID,
      "client_mutation_id": Math.floor(Math.random() * 17)
    }
  };
  
  // Upload images if any
  if (postData.images.length > 0) {
    for (const imageBuffer of postData.images) {
      const path = "./post_image.jpg";
      fs.writeFileSync(path, imageBuffer);
      
      const uploadForm = {
        file: fs.createReadStream(path)
      };
      
      const uploadRes = await api.httpPostFormData(`https://www.facebook.com/profile/picture/upload/?profile_id=${botID}&photo_source=57&av=${botID}`, uploadForm);
      formData.input.attachments.push({
        "photo": {
          "id": uploadRes.payload.fbid.toString()
        }
      });
      fs.unlinkSync(path);
    }
  }
  
  // Submit post
  const response = await api.httpPost('https://www.facebook.com/api/graphql/', {
    av: botID,
    fb_api_req_friendly_name: "ComposerStoryCreateMutation",
    fb_api_caller_class: "RelayModern",
    doc_id: "7711610262190099",
    variables: JSON.stringify(formData)
  });
  
  const data = JSON.parse(response.replace("for (;;);", ""));
  return {
    id: data.data.story_create.story.legacy_story_hideable_id,
    url: data.data.story_create.story.url
  };
}

function getGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getPrivacyName(privacy) {
  return privacy === "EVERYONE" ? "🌐 Public" : 
         privacy === "FRIENDS" ? "👥 Friends" : 
         "🔒 Only Me";
}
