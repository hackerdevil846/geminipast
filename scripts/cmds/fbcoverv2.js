const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "fbcoverv2",
    aliases: ["coverv2", "fbcustom"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "image",
    shortDescription: {
      en: "🎭 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑐𝑜𝑣𝑒𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑡𝑜𝑜𝑙"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑐𝑜𝑣𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠 𝑎𝑛𝑑 𝑐𝑜𝑙𝑜𝑟𝑠"
    },
    guide: {
      en: "{p}fbcoverv2\n{p}fbcoverv2 list\n{p}fbcoverv2 find <𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟>\n{p}fbcoverv2 color"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "request": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      
      if (args[0] == "list") {
        const res = await axios.get("https://api.nguyenmanh.name.vn/taoanhdep/list");
        
        let page = parseInt(args[1]) || 1;
        page = page < 1 ? 1 : page;
        const limit = 11;
        const totalCharacters = res.data.listAnime.length;
        const totalPages = Math.ceil(totalCharacters / limit);
        
        let msg = [];
        for (let i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
          if (i >= totalCharacters) break;
          const character = res.data.listAnime[i].name;
          msg += `${i + 0}. ${character}\n`;
        }
  
        msg += `» 𝐴𝑙𝑙 ${totalCharacters} 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠\n» 𝑃𝑎𝑔𝑒𝑠 (${page}/${totalPages})\n» 𝑈𝑠𝑒 {p}fbcoverv2 list <𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟> 𝑡𝑜 𝑠𝑒𝑒 𝑚𝑜𝑟𝑒`;
        
        return message.reply(`●─●𝐸𝑚𝑖𝑙𝑖𝑎●──●\n` + msg + `\n●──●𝐸𝑛𝑑●──●`);
        
      } else if (args[0] == "find") {
        if (!args[1]) {
          return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑠𝑒𝑎𝑟𝑐ℎ");
        }
        
        const char = args.slice(1).join(" ");
        const res = await axios.get(`https://api.nguyenmanh.name.vn/taoanhdep/search?key=${encodeURIComponent(char)}`);
        const id = res.data.ID;
        
        return message.reply(`𝐼𝐷 𝑜𝑓 ${char}: ${id - 1}`);
      } 
        
      else if (args[0] == "color") {
        const colorImageUrl = "https://4.bp.blogspot.com/-_nVsmtO-a8o/VYfZIUJXydI/AAAAAAAACBQ/FHfioHYszpk/w1200-h630-p-k-no-nu/cac-mau-trong-tieng-anh.jpg";
        
        const callback = () => {
          message.reply({
            body: "[ 𝐸𝑛𝑔𝑙𝑖𝑠ℎ 𝑐𝑜𝑙𝑜𝑟 𝑙𝑖𝑠𝑡 ]",
            attachment: fs.createReadStream(__dirname + `/cache/colors.jpg`)
          });
        };
        
        request(encodeURI(colorImageUrl))
          .pipe(fs.createWriteStream(__dirname + `/cache/colors.jpg`))
          .on("close", callback);
          
      } else {
        return message.reply(`» 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝐼𝐷 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒`, (error, info) => {
          if (error) {
            console.error(error);
            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒");
          }
          
          global.client.handleReply.push({
            type: "characters",
            name: this.config.name,
            author: senderID,
            messageID: info.messageID
          });
        });
      }
    } catch (error) {
      console.error(error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
  },

  onReply: async function({ api, event, handleReply, message }) {
    try {
      const { threadID, messageID, senderID, body } = event;
      
      if (handleReply.author != senderID) {
        return message.reply('𝑌𝑜𝑢 𝑑𝑜 𝑛𝑜𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑');
      }

      switch (handleReply.type) {
        case "characters": {
          const id = parseInt(event.body);
          if (isNaN(id)) {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟");
          }
          
          const res = await axios.get(`https://api.nguyenmanh.name.vn/taoanhdep/search/id?id=${id + 1}`);
          const name = res.data.name;
          
          api.unsendMessage(handleReply.messageID);
          
          return message.reply(`» 𝑌𝑜𝑢𝑟 𝑠𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟: ${name}\n» 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑛𝑎𝑚𝑒`, (error, info) => {
            if (error) {
              console.error(error);
              return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒");
            }
            
            global.client.handleReply.push({
              type: 'subname',
              name: this.config.name,
              author: senderID,
              characters: event.body,
              messageID: info.messageID
            });
          });
        }
        
        case "subname": {
          api.unsendMessage(handleReply.messageID);
          
          return message.reply(`» 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑠𝑒𝑐𝑜𝑛𝑑𝑎𝑟𝑦 𝑛𝑎𝑚𝑒`, (error, info) => {
            if (error) {
              console.error(error);
              return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒");
            }
            
            global.client.handleReply.push({
              type: 'color',
              name: this.config.name,
              author: senderID,
              characters: handleReply.characters,
              name_s: event.body,
              messageID: info.messageID
            });
          });
        }
  
        case "color": {
          api.unsendMessage(handleReply.messageID);
          
          return message.reply(`» 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑐𝑜𝑙𝑜𝑟\n» 𝑈𝑠𝑒 "{p}fbcoverv2 color" 𝑡𝑜 𝑠𝑒𝑒 𝑐𝑜𝑙𝑜𝑟 𝑙𝑖𝑠𝑡`, (error, info) => {
            if (error) {
              console.error(error);
              return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒");
            }
            
            global.client.handleReply.push({
              type: 'create',
              name: this.config.name,
              author: senderID,
              characters: handleReply.characters,
              subname: event.body,
              name_s: handleReply.name_s,
              messageID: info.messageID
            });
          });
        }
        
        case "create": {
          const idchar = handleReply.characters;
          const name_ = handleReply.name_s;
          const subname_ = handleReply.subname;
          const color_ = event.body;
          
          api.unsendMessage(handleReply.messageID);
          
          return message.reply(`𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑐𝑜𝑣𝑒𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔... ✨`, async (error, info) => {
            if (error) {
              console.error(error);
              return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒");
            }
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            try {
              const imageStream = await axios.get(`https://api.nguyenmanh.name.vn/fbcover/v2?name=${encodeURIComponent(name_)}&id=${idchar}&subname=${encodeURIComponent(subname_)}&color=${encodeURIComponent(color_)}&apikey=KeyTest`, {
                responseType: "stream"
              });
              
              const msg = {
                body: `𝑁𝑖𝑗𝑒𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑐𝑜𝑣𝑒𝑟 ⚡`,
                attachment: imageStream.data
              };
              
              return message.reply(msg);
            } catch (error) {
              console.error(error);
              return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑜𝑣𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
  }
};
