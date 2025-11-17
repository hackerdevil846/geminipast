const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "subnautica",
    version: "2.0.0",
    role: 0,
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    shortDescription: {
      en: "𝑺𝒖𝒃𝒏𝒂𝒖𝒕𝒊𝒄𝒂 𝒇𝒊𝒔𝒉𝒊𝒏𝒈 𝒈𝒂𝒎𝒆"
    },
    longDescription: {
      en: "𝑺𝒖𝒃𝒏𝒂𝒖𝒕𝒊𝒄𝒂 𝒇𝒊𝒔𝒉𝒊𝒏𝒈 𝒈𝒂𝒎𝒆 𝒘𝒉𝒆𝒓𝒆 𝒚𝒐𝒖 𝒄𝒂𝒏 𝒄𝒂𝒕𝒄𝒉 𝒗𝒂𝒓𝒊𝒐𝒖𝒔 𝒇𝒊𝒔𝒉 𝒂𝒏𝒅 𝒆𝒙𝒑𝒍𝒐𝒓𝒆 𝒖𝒏𝒅𝒆𝒓𝒘𝒂𝒕𝒆𝒓 𝒘𝒐𝒓𝒍𝒅𝒔"
    },
    category: "game",
    guide: {
      en: "help"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ api, event, args, usersData, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      const { readFileSync, writeFileSync, existsSync, createReadStream } = fs;
      
      const checkPath = function (type, senderID) {
        const pathItem = path.join(__dirname, 'cache', 'cauca', 'item.json');
        const pathUser = path.join(__dirname, 'cache', 'cauca', 'datauser', `${senderID}.json`);
        if (type == 1) return pathItem;
        if (type == 3) return pathUser;
      };

      const subnauticaImage = async function() {
        var images = [];
        let download = (await axios.get('https://i.imgur.com/2VPuOVI.png', { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + '/cache/cauca/cache/subnauticapage.png', Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + '/cache/cauca/cache/subnauticapage.png'));
        return images;
      };

      const getFishImage = async function(link) {
        var images = [];
        let download = (await axios.get(link, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + '/cache/cauca/cache/subnautica.png', Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + '/cache/cauca/cache/subnautica.png'));
        return images;
      };

      const getFishType = function () {
        var rate = Math.floor(Math.random() * 100) + 1;
        if (rate <= 4) return false;
        if (rate > 4 && rate <= 34) return 'Common';
        if (rate > 34 && rate <= 59) return 'Uncommon';
        if (rate > 59 && rate <= 79) return 'Rare';
        if (rate > 79 && rate <= 94) return 'Epic';
        if (rate > 94 && rate <= 99) return 'Legendary';
        if (rate > 99 && rate <= 100) return 'Mythical';
      };

      const dataFish = async function (a, b) {
        const data = (await axios.get('https://raw.githubusercontent.com/duongcongnam/subnautica/main/subnautica.json')).data;
        var loc = data.find(i => i.location == a);
        var are = loc.area.find(i => i.name == b);
        return are.creature;
      };

      const dir = __dirname + '/cache/cauca/';
      const dirCache = __dirname + '/cache/cauca/cache/';
      const dirData = __dirname + '/cache/cauca/datauser/';
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (!fs.existsSync(dirData)) fs.mkdirSync(dirData, { recursive: true });
      if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache, { recursive: true });

      if (!fs.existsSync(dir + "data.json")) {
        const response = await axios.get("https://raw.githubusercontent.com/phamvandien1/abc/main/data.json", { responseType: 'arraybuffer' });
        fs.writeFileSync(dir + "data.json", Buffer.from(response.data));
      }

      if (!fs.existsSync(dir + "item.json")) {
        const response = await axios.get("https://raw.githubusercontent.com/phamvandien1/abc/main/item.json", { responseType: 'arraybuffer' });
        fs.writeFileSync(dir + "item.json", Buffer.from(response.data));
      }

      const pathData = path.join(__dirname, 'cache', 'cauca', 'datauser', `${senderID}.json`);
      
      switch (args[0]) {
        case 'register':
        case '-r': {
          const nDate = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Dhaka' });
          if (!existsSync(pathData)) {
            var obj = {};
            const userData = await usersData.get(senderID);
            obj.name = userData.name;
            obj.ID = senderID;
            obj.mainROD = null;
            obj.GPS = {};
            obj.GPS.locate = null;
            obj.GPS.area = null;
            obj.fishBag = [];
            obj.item = [];
            obj.timeRegister = nDate;
            obj.fishBag.push({
              ID: 0,
              name: 'Challenge Fish',
              category: 'Legendary',
              size: 999999,
              sell: 0
            });
            writeFileSync(pathData, JSON.stringify(obj, null, 4));
            var msg = {body: "[ Subnautica Fishing Game ]\n──────────────────\n✅ Registered successfully\n🏬 /subnautica shop/-s: To buy fishing equipment!", attachment: await subnauticaImage()};
            return message.reply(msg);
          } else return message.reply({body: "[ Subnautica Fishing Game ]\n──────────────────\n⚡ You have already registered!", attachment: await subnauticaImage()});
        }
        case 'shop':
        case '-s': {
          if (!existsSync(pathData)) {
            return message.reply({body: "[ Subnautica Fishing Game ]\n──────────────────\n🦈 You haven't registered an account\n⚡ /subnautica register/-r: To register for the game!", attachment: await subnauticaImage()});
          }
          return message.reply({body: "[ Subnautica Shop ]\n──────────────────\n1 » 💰 Buy items\n2 » 💵 Sell caught items\n3 » ⚡ Upgrade/Repair items\n──────────────────\n💬 Reply to this message with your choice!", attachment: await subnauticaImage()}, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "shop"
            });
          });
        }
        case 'bag':
        case '-b': {
          if (!existsSync(pathData)) {
            return message.reply({body: "[ Subnautica Fishing Game ]\n──────────────────\n🦈 You haven't registered an account\n⚡ /subnautica register/-r: To register for the game!", attachment: await subnauticaImage()});
          }
          var data = JSON.parse(readFileSync(checkPath(3, senderID)));

          return message.reply({body: `[ Subnautica Inventory ]\n──────────────────\n1 » 🦈 Fish caught: ${data.fishBag.length} fish\n2 » 🎣 Fishing rods owned: ${data.item.length} rods\n──────────────────\n💬 Please reply to view items!`, attachment: await subnauticaImage()}, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "choosebag"
            });
          });
        }
        case 'custom':
        case '-c': {
          if (!existsSync(pathData)) {
            return message.reply({body: "[ Subnautica Fishing Game ]\n──────────────────\n🦈 You haven't registered an account\n⚡ /subnautica register/-r: To register for the game!", attachment: await subnauticaImage()});
          }
          if (args[1] == 'rod') {
            var data = JSON.parse(readFileSync(checkPath(3, senderID)));
            var listItem = '[ Subnautica Select Fishing Rod ]\n──────────────────\n',
                number = 1;
            for (let i of data.item) {
              listItem += `${number++} » 🎣 Rod name: ${i.name}\n⏱️ Cooldown: ${i.countdown}s\n⚡ Durability: ${i.durability}\n──────────────────\n`;
            }
            listItem += '💬 Please reply to select your main fishing rod!';
            return message.reply(listItem, (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "rodMain",
                data: data,
                item: data.item
              });
            });
          }
          if (args[1] == 'locate') {
            return message.reply({body: "[ Select Fishing Location ]\n──────────────────\n1 » The Crater\n\n2 » Sector Zero", attachment: await subnauticaImage()}, (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "location"
              });
            });
          }
        }
        case 'help': {
          return message.reply({body: "[ Subnautica Game Help ]\n──────────────────\n🦈 /subnautica register/-r: Register for the game\n🏬 /subnautica shop/-s: Fishing shop\n🌊 /subnautica custom/-c rod/custom locate: Select fishing area\n🎒 /subnautica bag/-b: View inventory", attachment: await subnauticaImage()});
        }
        default: {
          async function checkTime(cooldown, dataTime) {
            if (cooldown - (Date.now() - dataTime) > 0) {
              var time = cooldown - (Date.now() - dataTime),
                  minutes = Math.floor(time / 60000),
                  seconds = ((time % 60000) / 1000).toFixed(0);
              return message.reply(`⏰ Please buy a higher level rod to fish consecutively in a short time!\n⌚ Remaining wait time: ${minutes}:${seconds}`);
            }
          }
          if (!existsSync(pathData)) {
            return message.reply({body: "[ Subnautica Fishing Game ]\n──────────────────\n⚡ /subnautica help: To see how to play!", attachment: await subnauticaImage()});
          }
          var data = JSON.parse(readFileSync(checkPath(3, senderID)));
          if (data.item.length == 0) return message.reply(`⚡ You don't have a fishing rod, please go to the shop to buy one!`);
          if (data.mainROD == null) return message.reply('⚡ You haven\'t selected a fishing rod to fish with\n❗ Please enter "/subnautica custom rod" to select a fishing rod!');
          if (data.GPS.locate == null || data.GPS.area == null) return message.reply('⚡ You haven\'t selected a fishing location\n❗ Please enter "/subnautica custom locate" to select a fishing location!');
          var rod = data.mainROD;
          var location = data.GPS.locate;
          var area = data.GPS.area;
          var type = getFishType();
          var findRod = data.item.find(i => i.name == rod);
          if (findRod.durability <= 0) return message.reply('⚡ The fishing rod is broken, you need to repair it or select a new one!');
          await checkTime(findRod.countdown * 1000, findRod.countdownData);
          findRod.countdownData = Date.now();
          findRod.durability = findRod.durability - 10;
          writeFileSync(checkPath(3, senderID), JSON.stringify(data, null, 2));
          if (type == false) return message.reply('❎ You missed and didn\'t catch any fish!');
          var fil = (await dataFish(location, area)).filter(i => i.category == type);
          if (fil.length == 0) return message.reply('❎ You missed and didn\'t catch any fish!');
          var getData = fil[Math.floor(Math.random() * fil.length)];
          var IDF = data.fishBag[parseInt(data.fishBag.length - 1)].ID + 1;
          data.fishBag.push({
            ID: IDF,
            name: getData.name,
            category: getData.category,
            size: getData.size,
            sell: getData.sell,
            image: getData.image
          });
          writeFileSync(checkPath(3, senderID), JSON.stringify(data, null, 2));
          var msg = {body: `[ Subnautica Fishing Game ]\n──────────────────\n🎣 You caught a fish\n🦈 Fish name: ${getData.name}\n💵 Price: ${getData.sell}$\n📖 Fish type: ${getData.category}\n📏 Size: ${getData.size}cm`, attachment: await getFishImage(getData.image)};
          return message.reply(msg);
        }
      }
    } catch (error) {
      console.error(error);
      message.reply("❌ An error occurred while processing the command!");
    }
  },

  handleReply: async function ({ event, api, handleReply, usersData, message }) {
    try {
      const { body, threadID, messageID, senderID } = event;
      const { readFileSync, writeFileSync, existsSync } = fs;
      
      const checkPath = function (type, senderID) {
        const pathItem = path.join(__dirname, 'cache', 'cauca', 'item.json');
        const pathUser = path.join(__dirname, 'cache', 'cauca', 'datauser', `${senderID}.json`);
        if (type == 1) return pathItem;
        if (type == 3) return pathUser;
      };

      const getFishImage = async function(link) {
        var images = [];
        let download = (await axios.get(link, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + '/cache/cauca/cache/subnautica.png', Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + '/cache/cauca/cache/subnautica.png'));
        return images;
      };

      async function checkMoney(senderID, maxMoney) {
        var i, w;
        i = (await usersData.getData(senderID)) || {};
        w = i.money || 0;
        if (w < parseInt(maxMoney)) return message.reply('⚡ You don\'t have enough money for this transaction!');
      }

      async function checkDur(a, b, c) {
        var data = JSON.parse(readFileSync(checkPath(1, senderID)));
        var find = data.find(i => i.name == a);
        if (c == 'rate') return (b / find.durability) * 100;
        if (c == 'reset') return find.durability;
        return `${b}/${find.durability} (${((b/find.durability)*100).toFixed(0)}%)`;
      }

      switch (handleReply.type) {
        case 'shop': {
          if (body == 1) {
            api.unsendMessage(handleReply.messageID);
            var pathItem = JSON.parse(readFileSync(checkPath(1, senderID)));
            var listItem = '[ Fishing Rod Shop ]\n──────────────────\n',
                number = 1;
            for (let i of pathItem) {
              listItem += `${number++} » 🎣 Name: ${i.name}\n💵 Price: ${i.price}$\n⏱️ Cooldown: ${i.countdown}\n⚡ Durability: ${i.durability}\n──────────────────\n`;
            }
            return message.reply(listItem + '💬 Reply to this message to choose your fishing rod, Each fishing reduces 10% durability!', (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "buyfishingrod"
              });
            });
          }
          if (body == 2) {
            api.unsendMessage(handleReply.messageID);
            var data = JSON.parse(readFileSync(checkPath(3, senderID))).fishBag;
            if (data.length == 0) return message.reply('⚡ Your bag is empty!');
            var Common = data.filter(i => i.category == 'Common');
            var Uncommon = data.filter(i => i.category == 'Uncommon');
            var Rare = data.filter(i => i.category == 'Rare');
            var Epic = data.filter(i => i.category == 'Epic');
            var Legendary = data.filter(i => i.category == 'Legendary');
            var Mythical = data.filter(i => i.category == 'Mythical');
            var listCategory = [Common, Uncommon, Rare, Epic, Legendary, Mythical];
            return message.reply(`[ Subnautica Sell Fish ]\n──────────────────\n1 » Fish: Common\n🛍️ Quantity: ${Common.length}\n\n2 » Fish: Uncommon\n🛍️ Quantity: ${Uncommon.length}\n\n3 » Fish: Rare\n🛍️ Quantity: ${Rare.length}\n\n4 » Fish: Epic\n🛍️ Quantity: ${Epic.length}\n\n5 » Fish: Legendary\n🛍️ Quantity: ${Legendary.length}\n\n6 » Fish: Mythical\n🛍️ Quantity: ${Mythical.length}\n──────────────────\n💬 Reply to choose which fish to sell!`, (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "chooseFish",
                listCategory
              });
            });
          }
          if (body == 3) {
            api.unsendMessage(handleReply.messageID);
            var data = JSON.parse(readFileSync(checkPath(3, senderID))).item;
            var msg = `[ Current Fishing Rods ]\n──────────────────\n`,
                number = 1;
            for (let i of data) {
              msg += `${number++} » 🎣 Rod name: ${i.name}\n⚡ Durability: ${await checkDur(i.name, i.durability, 0)}\n──────────────────\n`;
            }
            return message.reply(msg + '💬 Please reply with the item you want to repair, repair cost is 1/3 of the item price!', (error, info) => {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "fixfishingrod",
                list: data
              });
            });
          } else return message.reply('⚡ Invalid selection!');
        }
        case 'choosebag': {
          api.unsendMessage(handleReply.messageID);
          var data = JSON.parse(readFileSync(checkPath(3, senderID)));
          if (body == 1) {
            if (data.fishBag.length == 0) return message.reply('⚡ Your bag has no fish!');
            var listFish = `[ Fish Caught ]\n──────────────────\n`,
                number = 1;
            for (let i of data.fishBag) {
              listFish += `${number++} » 🦈 Fish name: ${i.name}\n❗ Length: ${i.size}cm - ${i.category}\n💵 Price: ${i.sell}$\n──────────────────\n`;
            }
            return message.reply(listFish);
          }
          if (body == 2) {
            api.unsendMessage(handleReply.messageID);
            if (data.item.length == 0) return message.reply('⚡ Your bag has no items!');
            var listItemm = `[ Current Fishing Rods ]\n──────────────────\n`,
                number = 1;
            for (let i of data.item) {
              listItemm += `${number++} » 🎣 Rod name: ${i.name}\n💵 Price: ${i.price}$\n⚡ Durability: ${i.durability}\n⏱️ Cooldown: ${i.countdown}s\n──────────────────\n`;
            }
            return message.reply(listItemm);
          } else return message.reply('⚡ Invalid selection!');
        }
        case 'rodMain': {
          var data = handleReply.data;
          var item = handleReply.item;
          if (parseInt(body) > item.length || parseInt(body) <= 0) return message.reply('⚡ Invalid selection!');
          api.unsendMessage(handleReply.messageID);
          data.mainROD = item[parseInt(body) - 1].name;
          writeFileSync(checkPath(3, senderID), JSON.stringify(data, null, 2));
          return message.reply(`[ Select Main Rod Success ]\n──────────────────\n📌 Set fishing rod: ${item[parseInt(body) - 1].name} as main rod successfully!`);
        }
        case 'location': {
          const data = JSON.parse(readFileSync(path.join(__dirname, 'cache', 'cauca', 'data.json')));
          if (body != 1 && body != 2) return message.reply("⚡ Invalid selection!");
          api.unsendMessage(handleReply.messageID);
          var listLoca = '[ Select Fishing Location ]\n──────────────────\n',
              number = 1;
          for (let i of data[parseInt(body) - 1].area) {
            listLoca += `${number++} » 🌊 Name: ${i.name}\n──────────────────\n`;
          };
          var userData = JSON.parse(readFileSync(checkPath(3, senderID)));
          userData.GPS.locate = data[parseInt(body) - 1].location;
          writeFileSync(checkPath(3, senderID), JSON.stringify(userData, null, 2));
          if(body == 1) var images = 'https://i.imgur.com/SJewp15.png';
          if(body == 2) var images = 'https://i.imgur.com/FtB2vWi.png';
          return message.reply({body: listLoca + '⚡ Please select the location you want to fish!', attachment: await getFishImage(images)}, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "chooseArea",
              area: data[parseInt(body) - 1]
            });
          });
        }
        case 'chooseArea': {
          var area = handleReply.area;
          var pathh = JSON.parse(readFileSync(checkPath(3, senderID)));
          var pathhh = checkPath(3, senderID);
          if (parseInt(body) > area.area.length || parseInt(body) <= 0) return message.reply('⚡ Invalid selection!');
          api.unsendMessage(handleReply.messageID);
          pathh.GPS.area = area.area[parseInt(body) - 1].name;
          writeFileSync(pathhh, JSON.stringify(pathh, null, 2));
          return message.reply(`[ Subnautica Fishing Game ]\n──────────────────\n✅ Moved to area: ${area.location} - ${area.area[parseInt(body) - 1].name} successfully!`);
        }
        case 'fixfishingrod': {
          if (parseInt(body) > handleReply.list.length || parseInt(body) <= 0) return message.reply('⚡ Invalid selection!');
          var rod = handleReply.list[parseInt(body) - 1];
          if (await checkDur(rod.name, rod.durability, 'rate') > 75) return message.reply('⚡ Can only repair rods with durability below 75%!');
          api.unsendMessage(handleReply.messageID);
          await checkMoney(senderID, parseInt((rod.price * (1 / 3)).toFixed(0)));
          await usersData.decreaseMoney(senderID, parseInt((rod.price * (1 / 3)).toFixed(0)));
          rod.durability = await checkDur(rod.name, rod.durability, 'reset');
          writeFileSync(checkPath(3, senderID), JSON.stringify(JSON.parse(readFileSync(checkPath(3, senderID))), null, 2));
          return message.reply(`[ Repair Successful ]\n──────────────────\n🎣 Fishing rod: ${rod.name}\n💵 Repair cost: ${parseInt((rod.price*(1/3)).toFixed(0))}$`);
        }
        case 'buyfishingrod': {
          var pathItem = JSON.parse(readFileSync(checkPath(1, senderID)));
          if (parseInt(body) > pathItem.length || parseInt(body) <= 0) return message.reply('⚡ Invalid selection!');
          var data = pathItem[parseInt(body) - 1];
          var checkM = await checkMoney(senderID, data.price);
          var userData = JSON.parse(readFileSync(checkPath(3, senderID)));
          if (userData.item.some(i => i.name == data.name)) return message.reply('⚡ You already own this item!');
          userData.item.push({
            name: data.name,
            price: data.price,
            durability: data.durability,
            countdown: data.countdown,
            countdownData: null,
            image: data.image
          });
          writeFileSync(checkPath(3, senderID), JSON.stringify(userData, null, 2));
          api.unsendMessage(handleReply.messageID);
          await usersData.decreaseMoney(senderID, data.price);
          var msg = { body: `[ Subnautica Fishing Game ]\n──────────────────\n✅ Successfully purchased fishing rod\n🎣 Rod name: ${data.name}\n💵 Purchase price: ${data.price}$\n⚡ Durability: ${data.durability}\n⏱️ Cooldown: ${data.countdown}`, attachment: await getFishImage(data.image)};
          return message.reply(msg);
        }
        case 'chooseFish': {
          if (parseInt(body) > handleReply.listCategory.length || parseInt(body) <= 0) return message.reply('⚡ Invalid selection!');
          api.unsendMessage(handleReply.messageID);
          if (handleReply.listCategory[parseInt(body) - 1].length == 0) return message.reply('⚡ You don\'t have any fish!');
          var fish = "[ Subnautica Sell Fish ]\n──────────────────\n",
              number = 1;
          for (let i of handleReply.listCategory[parseInt(body) - 1]) {
            fish += `${number++} » 🦈 Fish name: ${i.name} - ${i.size}cm\n❗ Type: ${i.category}\n💵 Price: ${i.sell}$\n──────────────────\n`;
          }
          return message.reply(fish + "💬 Reply with the number to sell (can reply multiple numbers) or reply 'all' to sell all fish!", (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "sell",
              list: handleReply.listCategory[parseInt(body) - 1]
            });
          });
        }
        case 'sell': {
          if ((parseInt(body) > handleReply.list.length || parseInt(body) <= 0) && body.toLowerCase() != 'all') return message.reply('⚡ Invalid selection!');
          api.unsendMessage(handleReply.messageID);
          var userData = JSON.parse(readFileSync(checkPath(3, senderID)));
          var bag = userData.fishBag;
          var coins = 0;
          if (body.toLowerCase() == 'all') {
            for (let i of handleReply.list) {
              await usersData.increaseMoney(senderID, parseInt(i.sell));
              coins += parseInt(i.sell);
              var index = userData.fishBag.findIndex(item => item.ID == i.ID);
              bag.splice(index, 1);
              writeFileSync(checkPath(3, senderID), JSON.stringify(userData, null, 2));
            }
            return message.reply(`✅ Successfully sold: ${handleReply.list.length} fish and earned: ${coins}$`);
          }
          else {
            var msg = 'Code_By_D-Jukie ' + body;
            var chooses = msg.split(" ").map(n => parseInt(n));
            chooses.shift();
            var text = `[ Sell Fish Successful ]\n──────────────────\n`,
                number = 1;
            for (let i of chooses) {
              const index = userData.fishBag.findIndex(item => item.ID == handleReply.list[i - 1].ID);
              text += `${number++} » 🦈 Fish name: ${bag[index].name}\n💵 Price: ${bag[index].sell}$\n──────────────────\n`;
              coins += parseInt(bag[index].sell);
              await usersData.increaseMoney(senderID, parseInt(bag[index].sell));
              bag.splice(index, 1);
              writeFileSync(checkPath(3, senderID), JSON.stringify(userData, null, 2));
            }
            return message.reply(text + `\n💵 Earned: ${coins}$`);
          }
        }
        default: {
          api.unsendMessage(handleReply.messageID);
          return message.reply('⚡ Invalid selection!');
        }
      }
    } catch (error) {
      console.error(error);
      message.reply("❌ An error occurred while processing the reply!");
    }
  }
};
