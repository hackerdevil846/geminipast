const axios = require('axios');

module.exports = {
  config: {
    name: "monsterhunt",
    version: "2.5.0",
    role: 0,
    author: "Asif Mahmud",
    category: "game",
    shortDescription: {
      en: "Monster hunting game"
    },
    longDescription: {
      en: "A monster hunting RPG game with character creation, battles, and item management"
    },
    guide: {
      en: "monsterhunt [create|info|shop|bag|fix|match|location|status]"
    },
    countDown: 0
  },

  onLoad: function() {
    try {
      global.monster = require("./monster/index.js");
      global.configMonster = require("./monster/config.json");
    }
    catch(e) {
      console.log("Monster module load error:", e);
    }
  },

  onStart: async function({ api, event, args, usersData }) {
    try {
      switch(args[0]) {
        case "create":
          return await global.monster.createCharecter({ usersData, api, event });
        case "info":
          return await global.monster.getCharacter({ api, event });
        case "status":
          return await global.monster.getServer({ api, event });
        case "shop":
          return await api.sendMessage("《 A S T E R A 》\n\n1. Buy weapons🗡\n2. Buy food🍗\n3. Sell monsters💵\n\n✨Reply with number to choose✨", event.threadID, (err, info) => {
            global.client.handleReply.push({
              name: 'monsterhunt',
              messageID: info.messageID,
              author: event.senderID,
              type: "listItem"
            });
          }, event.messageID);
        case "bag":
          return await global.monster.myItem({ api, event });
        case "fix":
          try {
            const stream = (await axios.get(global.configMonster.fix, { responseType: 'stream' })).data;
            return api.sendMessage({ 
              body: `Note: Can only repair durability of equipped weapon!\nMaximum durability 10,000/weapon`, 
              attachment: stream 
            }, event.threadID, (err, info) => {
              global.client.handleReply.push({
                name: 'monsterhunt',
                messageID: info.messageID,
                author: event.senderID,
                type: "increaseDurability"
              });
            }, event.messageID);
          } catch (error) {
            return api.sendMessage("Error loading fix image", event.threadID, event.messageID);
          }
        case "match":
        case "fight":
        case "pvp":
          return global.monster.match({ api, event });
        case "location":
          return await global.monster.listLocation({ api, event });
        default:
          try {
            const stream = (await axios.get(global.configMonster.monster, { responseType: 'stream' })).data;
            return api.sendMessage({
              body: "《 M O N S T E R   H U N T E R 》\n Available tags:\n1. Create: create character\n2. Info: view character stats\n3. Shop: open shop\n4. Bag: open inventory to equip and use items\n5. Fix: repair equipment\n6. Match/pvp/fight: hunt monsters\n7. Location: choose hunting ground\n8. Status: server info\n\n Use /monsterhunt + [tag] to play",
              attachment: stream
            }, event.threadID, event.messageID);
          } catch (error) {
            return api.sendMessage("《 M O N S T E R   H U N T E R 》\n Available tags:\n1. Create: create character\n2. Info: view character stats\n3. Shop: open shop\n4. Bag: open inventory to equip and use items\n5. Fix: repair equipment\n6. Match/pvp/fight: hunt monsters\n7. Location: choose hunting ground\n8. Status: server info\n\n Use /monsterhunt + [tag] to play", event.threadID, event.messageID);
          }
      }
    }
    catch(e) {
      console.log("Monster command error:", e);
      api.sendMessage("An error occurred while processing the command.", event.threadID, event.messageID);
    }
  },

  handleReply: async function({ api, event, usersData, handleReply }) {
    try {
      if(handleReply.author != event.senderID) return;
      
      switch(handleReply.type) {
        case "listItem":
          return await global.monster.getItems({ api, event, type: event.body });
        case "buyItem":
          return await global.monster.buyItem({ api, event, idItem: event.body, usersData, handleReply });
        case "setItem":
          return await global.monster.setItem({ api, event, idItem: event.body, handleReply });
        case "increaseDurability":
          return await global.monster.increaseDurability({ api, event, usersData, handleReply });
        case "match":
          return await global.monster.match({ api, event, id: event.body });
        case "setLocationID":
          return await global.monster.setLocationID({ api, event, id: event.body, handleReply });
        default:
          return;
      }
    }
    catch(e) {
      console.log("Monster reply handler error:", e);
      api.sendMessage("An error occurred while processing your response.", event.threadID, event.messageID);
    }
  }
};
