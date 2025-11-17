const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "minecraftgame",
    version: "2.0.1",
    role: 0,
    author: "Asif Mahmud",
    category: "game",
    shortDescription: {
      en: "Minecraft mini game for fun"
    },
    longDescription: {
      en: "A mini Minecraft game where you can mine, shop, and manage items"
    },
    guide: {
      en: "minecraftgame [register|shop|bag|custom|help]"
    },
    countDown: 0,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    await this.init();
    const { threadID, messageID, senderID } = event;
    const pathData = this.checkPath(3, senderID);
    
    switch (args[0]) {
      case 'register':
      case '-r': {
        // Using Bangladesh timezone (Asia/Dhaka)
        const nDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
        if (!fs.existsSync(pathData)) {
          let obj = {};
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
            name: 'Bedrock',
            category: 'Legendary',
            size: 999999,
            sell: 0
          });
          fs.writeFileSync(pathData, JSON.stringify(obj, null, 4));
          const msg = { body: "(¯ Minecraft ¯)\n⚔️Register Minecraft successfully⚔️\nIt's time to duel!!!\n📍 Timezone: Asia/Dhaka (Bangladesh)", attachment: await this.subnautica() };
          return api.sendMessage(msg, threadID, messageID);
        } else {
          return api.sendMessage({ body: "==[Minecraft]==\n⚔️You are already in the database⚔️", attachment: await this.subnautica() }, threadID, messageID);
        }
      }

      case 'shop':
      case '-s': {
        if (!fs.existsSync(pathData)) {
          return api.sendMessage({ body: "(¯ Minecraft ¯)\n⚔️You haven't registered a Minecraft account!", attachment: await this.subnautica() }, threadID, messageID);
        }
        return api.sendMessage({ body: "===[Shop Villager🎫]===\n1. ⚒️Buy pickaxe⛏️\n2. ⚖️Sell mined items\n3. Upgrade⚙️Repair items🔩\n\nReply to this message with your choice", attachment: await this.subnautica() }, threadID, (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "shop"
          });
        }, messageID);
      }

      case 'bag':
      case '-b': {
        if (!fs.existsSync(pathData)) {
          return api.sendMessage({ body: "(¯ Minecraft ¯)\n⚔️You haven't registered a Minecraft account!", attachment: await this.subnautica() }, threadID, messageID);
        }
        const data = this.checkPath(4, senderID);
        return api.sendMessage({ body: `(¯ Minecraft ¯)\n\n1. Items (Qty: ${data.fishBag.length})\n2. Pickaxes (Qty: ${data.item.length})\nPlease reply to view items!`, attachment: await this.subnautica() }, threadID, (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "choosebag"
          });
        }, messageID);
      }

      case 'custom':
      case '-c': {
        if (!fs.existsSync(pathData)) {
          return api.sendMessage({ body: "(¯ Minecraft ¯)\n⚔️You haven't registered a Minecraft account!", attachment: await this.subnautica() }, threadID, messageID);
        }
        if (args[1] == 'pickaxel') {
          const data = this.checkPath(4, senderID);
          let listItem = '(¯ Minecraft ¯)\n';
          let number = 1;
          for (let i of data.item) {
            listItem += `${number++}. ${i.name} - Cooldown: ${i.countdown}s - Durability: ${i.durability}\n`;
          }
          listItem += 'Please reply to choose your main pickaxe!';
          return api.sendMessage(listItem, threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "rodMain",
              data: data,
              item: data.item
            });
          }, messageID);
        }
        if (args[1] == 'locate') {
          return api.sendMessage({ body: "==[Minecraft]==\n1. The Earth\n2. Nether World And The End🎭", attachment: await this.subnautica() }, threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "location"
            });
          }, messageID);
        }
        break;
      }

      case 'help': {
        return api.sendMessage({ body: "====[Minecraft]====\n- R: Register\n- CUSTOM: Choose mining area\n- BAG: View inventory\n- SHOP: Shop\n\n=====Asif Mahmud=====", attachment: await this.subnautica() }, threadID, messageID);
      }

      default: {
        async function checkTime(cooldown, dataTime) {
          if (cooldown - (Date.now() - dataTime) > 0) {
            const time = cooldown - (Date.now() - dataTime);
            const minutes = Math.floor(time / 60000);
            const seconds = ((time % 60000) / 1000).toFixed(0);
            return api.sendMessage(`⏰ Please buy a higher tier pickaxe to mine continuously in a short time!\n⏳Remaining wait time: ${minutes}:${seconds}!`, threadID, messageID);
          }
        }

        if (!fs.existsSync(pathData)) {
          return api.sendMessage({ body: "(¯ Minecraft ¯)\n⚔️You haven't registered a Minecraft account!", attachment: await this.subnautica() }, threadID, messageID);
        }
        const data = this.checkPath(4, senderID);
        if (data.item.length == 0) return api.sendMessage(`You don't have a pickaxe, please go to mine shop to buy!`, threadID, messageID);
        if (data.mainROD == null) return api.sendMessage('You haven\'t chosen a pickaxe to mine!\nPlease type `custom pickaxel` to choose a pickaxe!', threadID, messageID);
        if (data.GPS.locate == null || data.GPS.area == null) return api.sendMessage('You haven\'t chosen a location to mine!\nPlease type `custom locate` to choose a mining location!', threadID, messageID);
        const rod = data.mainROD;
        const location = data.GPS.locate;
        const area = data.GPS.area;
        const type = this.getFish();
        const findRod = data.item.find(i => i.name == rod);
        if (findRod.durability <= 0) return api.sendMessage('The pickaxe is broken, you need to repair or choose a new one!', threadID, messageID);
        await checkTime(findRod.countdown * 1000, findRod.countdownData);
        findRod.countdownData = Date.now();
        findRod.durability = findRod.durability - 10;
        fs.writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        if (type == false) return api.sendMessage('Oh, nothing was found', threadID, messageID);
        const fil = (await this.dataFish(location, area)).filter(i => i.category == type);
        if (fil.length == 0) return api.sendMessage('Oh, nothing was found', threadID, messageID);
        const getData = fil[Math.floor(Math.random() * fil.length)];
        const IDF = ((this.checkPath(4, senderID)).fishBag)[parseInt(((this.checkPath(4, senderID)).fishBag).length - 1)].ID + 1;
        (this.checkPath(4, senderID)).fishBag.push({
          ID: IDF,
          name: getData.name,
          category: getData.category,
          size: getData.size,
          sell: getData.sell,
          image: getData.image
        });
        fs.writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        const msg = { body: `(¯ Minecraft ¯)\nCongratulations you mined\nName: ${getData.name} (${getData.sell}$)\nType: ${getData.category}\nSize: ${getData.size}cm`, attachment: await this.image(getData.image) };
        return api.sendMessage(msg, threadID, messageID);
      }
    }
  },

  handleReply: async function ({ event, api, usersData, handleReply }) {
    const { body, threadID, messageID, senderID } = event;
    const pathItem = this.checkPath(2, senderID);

    async function checkMoney(senderID, maxMoney) {
      const userData = await usersData.get(senderID);
      const money = userData.money || 0;
      if (money < parseInt(maxMoney)) {
        api.sendMessage('You do not have enough money to make this transaction!', threadID, messageID);
        return false;
      }
      return true;
    }

    async function checkDur(a, b, c) {
      const data = this.checkPath(2, senderID);
      const find = data.find(i => i.name == a);
      if (c == 'rate') return (b / find.durability) * 100;
      if (c == 'reset') return find.durability;
      return `${b}/${find.durability} (${((b / find.durability) * 100).toFixed(0)}%)`;
    }

    switch (handleReply.type) {
      case 'shop': {
        if (body == 1) {
          api.unsendMessage(handleReply.messageID);
          let listItem = '===[Shop]===\n';
          let number = 1;
          for (let i of pathItem) {
            listItem += `${number++}. ${i.name} (${i.price}$) - Cooldown ${i.countdown}s (Durability: ${i.durability})\n\n`;
          }
          return api.sendMessage(listItem + 'Reply to this message to choose your pickaxe. Each mining reduces 10 durability!', threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "buyfishingrod"
            });
          }, messageID);
        }
        if (body == 2) {
          api.unsendMessage(handleReply.messageID);
          const data = this.checkPath(4, senderID).fishBag;
          if (data.length == 0) return api.sendMessage('Your bag is empty!', threadID, messageID);
          const Common = data.filter(i => i.category == 'Common');
          const Uncommon = data.filter(i => i.category == 'Uncommon');
          const Rare = data.filter(i => i.category == 'Rare');
          const Epic = data.filter(i => i.category == 'Epic');
          const Legendary = data.filter(i => i.category == 'Legendary');
          const Mythical = data.filter(i => i.category == 'Mythical');
          const listCategory = [Common, Uncommon, Rare, Epic, Legendary, Mythical];
          return api.sendMessage(`Choose the type of ore to sell:\n1. Common - ${Common.length}\n2. Uncommon - ${Uncommon.length}\n3. Rare - ${Rare.length}\n4. Epic - ${Epic.length}\n5. Legendary - ${Legendary.length}\n6. Mythical - ${Mythical.length}`, threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "chooseFish",
              listCategory
            });
          }, messageID);
        }
        if (body == 3) {
          api.unsendMessage(handleReply.messageID);
          const data = this.checkPath(4, senderID).item;
          let msg = `===FIX ITEM===\n`;
          let number = 1;
          for (let i of data) {
            msg += `${number++}. ${i.name} - Durability: ${await checkDur.call(this, i.name, i.durability, 0)}\n`;
          }
          return api.sendMessage(msg + 'Please reply to the item you want to repair! Price is 1/3 of the item price', threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "fixfishingrod",
              list: data
            });
          }, messageID);
        } else return api.sendMessage('Invalid selection!', threadID, messageID);
      }

      case 'choosebag': {
        api.unsendMessage(handleReply.messageID);
        const data = this.checkPath(4, senderID);
        if (body == 1) {
          if (data.fishBag.length == 0) return api.sendMessage('There are no ores in your bag!', threadID, messageID);
          let listFish = `===Inventory===\n`;
          let number = 1;
          for (let i of data.fishBag) {
            listFish += `${number++}. ${i.name} (${i.size}cm) - ${i.category} (${i.sell}$)\n`;
          }
          return api.sendMessage(listFish, threadID, messageID);
        }
        if (body == 2) {
          api.unsendMessage(handleReply.messageID);
          if (data.item.length == 0) return api.sendMessage('There are no items in your bag!', threadID, messageID);
          let listItemm = `===Inventory===\n`;
          let number = 1;
          for (let i of data.item) {
            listItemm += `${number++}. ${i.name} (${i.price}$) - Durability: ${i.durability} (${i.countdown}s)\n`;
          }
          return api.sendMessage(listItemm, threadID, messageID);
        } else return api.sendMessage('Invalid selection!', threadID, messageID);
      }

      case 'rodMain': {
        const data = handleReply.data;
        const item = handleReply.item;
        if (parseInt(body) > item.length || parseInt(body) <= 0) return api.sendMessage('Invalid selection!', threadID, messageID);
        api.unsendMessage(handleReply.messageID);
        data.mainROD = item[parseInt(body) - 1].name;
        fs.writeFileSync(this.checkPath(3, senderID), JSON.stringify(data, null, 2));
        return api.sendMessage(`===MAIN WEAPON===\n- Set '${item[parseInt(body) - 1].name}' as main pickaxe successfully!`, threadID, messageID);
      }

      case 'location': {
        const data = require("./mine/data.json");
        if (body != 1 && body != 2) return api.sendMessage("Invalid selection!", threadID, messageID);
        api.unsendMessage(handleReply.messageID);
        let listLoca = '==[Minecraft🎟️]==\n';
        let number = 1;
        for (let i of data[parseInt(body) - 1].area) {
          listLoca += `${number++}. ${i.name}\n`;
        }
        (this.checkPath(4, senderID)).GPS.locate = data[parseInt(body) - 1].location;
        fs.writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        let images = body == 1 ? 'https://i.imgur.com/s6u6HDt.jpg' : 'https://i.imgur.com/CxbxCy9.jpg';
        return api.sendMessage({ body: listLoca + 'Please choose the area you want to mine!', attachment: await this.image(images) }, threadID, (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "chooseArea",
            area: data[parseInt(body) - 1]
          });
        }, messageID);
      }

      case 'chooseArea': {
        const area = handleReply.area;
        const pathh = this.checkPath(4, senderID);
        const pathhh = this.checkPath(3, senderID);
        if (parseInt(body) > area.area.length || parseInt(body) <= 0) return api.sendMessage('Invalid selection!', threadID, messageID);
        api.unsendMessage(handleReply.messageID);
        pathh.GPS.area = area.area[parseInt(body) - 1].name;
        fs.writeFileSync(pathhh, JSON.stringify(pathh, null, 2));
        return api.sendMessage(`==[Minecraft 🎟️]==\nSuccessfully moved to area '${area.location} - ${area.area[parseInt(body) - 1].name}'`, threadID, messageID);
      }

      case 'fixfishingrod': {
        if (parseInt(body) > handleReply.list.length || parseInt(body) <= 0) return api.sendMessage('Invalid selection!', threadID, messageID);
        const rod = handleReply.list[parseInt(body) - 1];
        if (await checkDur.call(this, rod.name, rod.durability, 'rate') > 75) return api.sendMessage('Can only repair pickaxes with durability below 75%', threadID, messageID);
        api.unsendMessage(handleReply.messageID);
        const isValid = await checkMoney(senderID, parseInt((rod.price * (1 / 3)).toFixed(0)));
        if (!isValid) return;
        const userData = await usersData.get(senderID);
        userData.money -= parseInt((rod.price * (1 / 3)).toFixed(0));
        await usersData.set(senderID, userData);
        rod.durability = await checkDur.call(this, rod.name, rod.durability, 'reset');
        fs.writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        return api.sendMessage(`===FIX WEAPON===\n- Successfully repaired ${rod.name} (${parseInt((rod.price * (1 / 3)).toFixed(0))}$)`, threadID, messageID);
      }

      case 'buyfishingrod': {
        if (parseInt(body) > pathItem.length || parseInt(body) <= 0) return api.sendMessage('Invalid selection!', threadID, messageID);
        const data = pathItem[parseInt(body) - 1];
        const isValid = await checkMoney(senderID, data.price);
        if (!isValid) return;
        if ((this.checkPath(4, senderID)).item.some(i => i.name == data.name)) return api.sendMessage('You already own this item!', threadID, messageID);
        (this.checkPath(4, senderID)).item.push({
          name: data.name,
          price: data.price,
          durability: data.durability,
          countdown: data.countdown,
          countdownData: null,
          image: data.image
        });
        fs.writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        api.unsendMessage(handleReply.messageID);
        const userData = await usersData.get(senderID);
        userData.money -= data.price;
        await usersData.set(senderID, userData);
        const msg = { body: `Successfully purchased ${data.name}\nPurchase price: ${data.price}$\nDurability: ${data.durability}\nCooldown: ${data.countdown}s`, attachment: await this.image(data.image) };
        return api.sendMessage(msg, threadID, messageID);
      }

      case 'chooseFish': {
        if (parseInt(body) > handleReply.listCategory.length || parseInt(body) <= 0) return api.sendMessage('Invalid selection!', threadID, messageID);
        api.unsendMessage(handleReply.messageID);
        if (handleReply.listCategory[parseInt(body) - 1].length == 0) return api.sendMessage('No ores found, hmmm!', threadID, messageID);
        let fish = "=====Mine=====\n";
        let number = 1;
        for (let i of handleReply.listCategory[parseInt(body) - 1]) {
          fish += `${number++}. ${i.name} (${i.size}cm) - Type: ${i.category} - ${i.sell}$\n`;
        }
        return api.sendMessage(fish + "Reply with the number to sell (can reply multiple numbers) or reply 'all' to sell all ores!", threadID, (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "sell",
            list: handleReply.listCategory[parseInt(body) - 1]
          });
        }, messageID);
      }

      case 'sell': {
        if ((parseInt(body) > handleReply.list.length || parseInt(body) <= 0) && body.toLowerCase() != 'all') return api.sendMessage('Invalid selection!', threadID, messageID);
        api.unsendMessage(handleReply.messageID);
        const bag = (this.checkPath(4, senderID)).fishBag;
        let coins = 0;
        if (body.toLowerCase() == 'all') {
          for (let i of handleReply.list) {
            const userData = await usersData.get(senderID);
            userData.money += parseInt(i.sell);
            await usersData.set(senderID, userData);
            coins += parseInt(i.sell);
            const index = (this.checkPath(4, senderID)).fishBag.findIndex(item => item.ID == i.ID);
            bag.splice(index, 1);
            fs.writeFileSync(this.checkPath(3, senderID), JSON.stringify((this.checkPath(4, senderID)), null, 2));
          }
          return api.sendMessage(`Successfully sold ${handleReply.list.length} ores and earned ${coins}$`, threadID, messageID);
        } else {
          const chooses = body.split(" ").map(n => parseInt(n));
          let text = `=====SELL=====\n`;
          let number = 1;
          for (let i of chooses) {
            const index = (this.checkPath(4, senderID)).fishBag.findIndex(item => item.ID == handleReply.list[i - 1].ID);
            text += `${number++}. ${bag[index].name} +${bag[index].sell}$\n`;
            coins += parseInt(bag[index].sell);
            const userData = await usersData.get(senderID);
            userData.money += parseInt(bag[index].sell);
            await usersData.set(senderID, userData);
            bag.splice(index, 1);
            fs.writeFileSync(this.checkPath(3, senderID), JSON.stringify((this.checkPath(4, senderID)), null, 2));
          }
          return api.sendMessage(text + `\nEarned ${coins}$`, threadID, messageID);
        }
      }

      default: {
        api.unsendMessage(handleReply.messageID);
        return api.sendMessage('Invalid selection!', threadID, messageID);
      }
    }
  },

  init: async function () {
    const dir = path.join(__dirname, 'mine');
    const dirCache = path.join(__dirname, 'mine', 'cache');
    const dirData = path.join(__dirname, 'mine', 'datauser');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(dirData)) fs.mkdirSync(dirData, { recursive: true });
    if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache, { recursive: true });

    if (!fs.existsSync(path.join(dir, "data.json"))) {
      const data = await axios.get("https://raw.githubusercontent.com/J-JRT/minecraft/mainV2/data.json", { responseType: 'stream' });
      data.data.pipe(fs.createWriteStream(path.join(dir, "data.json")));
    }

    if (!fs.existsSync(path.join(dir, "item.json"))) {
      const item = await axios.get("https://raw.githubusercontent.com/J-JRT/minecraft/mainV2/item.json", { responseType: 'stream' });
      item.data.pipe(fs.createWriteStream(path.join(dir, "item.json")));
    }
  },

  checkPath: function (type, senderID) {
    const pathItem = path.join(__dirname, 'mine', `item.json`);
    const pathUser = path.join(__dirname, 'mine', 'datauser', `${senderID}.json`);
    if (type === 1) return pathItem;
    if (type === 2) return fs.readJsonSync(pathItem);
    if (type === 3) return pathUser;
    if (type === 4) return fs.readJsonSync(pathUser);
  },

  data: async function () {
    const data = (await axios.get("https://raw.githubusercontent.com/J-JRT/minecraft/mainV2/data.json")).data;
    return data;
  },

  dataFish: async function (a, b) {
    const data = await this.data();
    const loc = data.find(i => i.location == a);
    const are = loc.area.find(i => i.name == b);
    return are.creature;
  },

  image: async function (link) {
    const fs = require("fs-extra");
    const axios = require("axios");
    let images = [];
    let download = (await axios.get(link, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/mine/cache/minecraft.png`, Buffer.from(download, "utf-8"));
    images.push(fs.createReadStream(__dirname + `/mine/cache/minecraft.png`));
    return images;
  },

  subnautica: async function () {
    const fs = require("fs-extra");
    const axios = require("axios");
    let images = [];
    let download = (await axios.get('https://i.imgur.com/vnXze66.jpg', { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/mine/cache/minecraft.png`, Buffer.from(download, "utf-8"));
    images.push(fs.createReadStream(__dirname + `/mine/cache/minecraft.png`));
    return images;
  },

  getFish: function () {
    const rate = Math.floor(Math.random() * 100) + 1;
    if (rate <= 4) return false;
    if (rate > 4 && rate <= 34) return 'Common';
    if (rate > 34 && rate <= 59) return 'Uncommon';
    if (rate > 59 && rate <= 79) return 'Rare';
    if (rate > 79 && rate <= 94) return 'Epic';
    if (rate > 94 && rate <= 99) return 'Legendary';
    if (rate > 99 && rate <= 100) return 'Mythical';
  }
};
