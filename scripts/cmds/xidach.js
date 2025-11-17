'use strict';
const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "xidach",
    aliases: [],
    version: "1.2.3-superfix",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝗕𝗹𝗮𝗰𝗸𝗷𝗮𝗰𝗸 𝗰𝗮𝗿𝗱 𝗴𝗮𝗺𝗲"
    },
    longDescription: {
      en: "𝗣𝗹𝗮𝘆 𝗫𝗶̀ 𝗗𝗮́𝗰𝗵 (𝗕𝗹𝗮𝗰𝗸𝗷𝗮𝗰𝗸) 𝘄𝗶𝘁𝗵 𝗳𝗿𝗶𝗲𝗻𝗱𝘀"
    },
    category: "𝗴𝗮𝗺𝗲",
    guide: {
      en: "{p}xidach [create/join/leave/start]\ncreate 𝗺𝗼𝗻𝗲𝘆_𝗯𝗲𝘁 (𝗺𝗶𝗻 50$)\njoin 𝗺𝗼𝗻𝗲𝘆_𝗯𝗲𝘁 (𝗺𝗶𝗻 50$)\nleave (𝗹𝗲𝗮𝘃𝗲 𝗴𝗮𝗺𝗲)\nstart (𝘀𝘁𝗮𝗿𝘁 𝗴𝗮𝗺𝗲)"
    },
    dependencies: {
      "fs": "",
      "axios": ""
    },
    envConfig: {
      "maxPlayers": 5,
      "normalWinBonus": 1,
      "superWinBonus": 2,
      "epicWinBonus": 4
    }
  },

  langs: {
    "en": {
      "missingInput": "[ 𝗫𝗜𝗗𝗔𝗖𝗛 ] 𝗕𝗲𝘁 𝗮𝗺𝗼𝘂𝗻𝘁 𝗰𝗮𝗻𝗻𝗼𝘁 𝗯𝗲 𝗲𝗺𝗽𝘁𝘆 𝗼𝗿 𝗻𝗲𝗴𝗮𝘁𝗶𝘃𝗲",
      "moneyBetNotEnough": "[ 𝗫𝗜𝗗𝗔𝗖𝗛 ] 𝗕𝗲𝘁 𝗮𝗺𝗼𝘂𝗻𝘁 𝗶𝘀 𝗴𝗿𝗲𝗮𝘁𝗲𝗿 𝘁𝗵𝗮𝗻 𝘆𝗼𝘂𝗿 𝗯𝗮𝗹𝗮𝗻𝗰𝗲!",
      "limitBet": "[ 𝗫𝗜𝗗𝗔𝗖𝗛 ] 𝗕𝗲𝘁 𝗺𝘂𝘀𝘁 𝗯𝗲 𝗮𝘁 𝗹𝗲𝗮𝘀𝘁 50$!",
      "noGame": "[ 𝗫𝗜𝗗𝗔𝗖𝗛 ] 𝗡𝗼 𝗴𝗮𝗺𝗲 𝗶𝘀 𝗿𝘂𝗻𝗻𝗶𝗻𝗴 𝗶𝗻 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽!",
      "xidachRules": "[ 𝗫𝗜𝗗𝗔𝗖𝗛 ]\n𝗡𝗢𝗧𝗘:\n𝗕𝗹𝗮𝗰𝗸𝗷𝗮𝗰𝗸: 𝗔 + 𝗝/𝗤/𝗞\n𝗗𝗼𝘂𝗯𝗹𝗲 𝗔𝗰𝗲𝘀: 𝟮𝗔\n\n𝗥𝘂𝗹𝗲𝘀:\n𝟭𝟲-𝟮𝟭 𝗽𝗼𝗶𝗻𝘁𝘀:\n𝗣𝗹𝗮𝘆𝗲𝗿 > 𝗗𝗲𝗮𝗹𝗲𝗿: 𝘄𝗶𝗻 𝘅𝟭\n𝗣𝗹𝗮𝘆𝗲𝗿 < 𝗗𝗲𝗮𝗹𝗲𝗿: 𝗹𝗼𝘀𝗲\n\n𝗗𝗼𝘂𝗯𝗹𝗲 𝗔𝗰𝗲𝘀 > 𝗕𝗹𝗮𝗰𝗸𝗷𝗮𝗰𝗸:\n𝗣𝗹𝗮𝘆𝗲𝗿 𝗵𝗮𝘀 𝗗𝗔, 𝗗𝗲𝗮𝗹𝗲𝗿 𝗵𝗮𝘀 𝗻𝗼𝘁𝗵𝗶𝗻𝗴 → 𝘅𝟰\n𝗣𝗹𝗮𝘆𝗲𝗿 𝗵𝗮𝘀 𝗗𝗔, 𝗗𝗲𝗮𝗹𝗲𝗿 𝗵𝗮𝘀 𝗕𝗝 → 𝘅𝟮\n𝗣𝗹𝗮𝘆𝗲𝗿 𝗵𝗮𝘀 𝗕𝗝, 𝗗𝗲𝗮𝗹𝗲𝗿 𝗵𝗮𝘀 𝗗𝗔 → 𝗟𝗼𝘀𝗲\n\n𝗠𝗮𝗴𝗶𝗰 𝟱: 𝟱 𝗰𝗮𝗿𝗱𝘀 𝘂𝗻𝗱𝗲𝗿 𝟮𝟭. 𝗔𝘂𝘁𝗼 𝘄𝗶𝗻. 𝗕𝗼𝘁𝗵 𝗠𝟱 → 𝗹𝗼𝘄𝗲𝗿 𝗽𝗼𝗶𝗻𝘁𝘀 𝘄𝗶𝗻𝘀.\n\n𝗢𝘃𝗲𝗿 𝟮𝟭: 𝗕𝗼𝘁𝗵 𝗼𝘃𝗲𝗿 → 𝗹𝗼𝘄𝗲𝗿 𝗽𝗼𝗶𝗻𝘁𝘀 𝘄𝗶𝗻𝘀.\n\n𝗨𝘀𝗮𝗴𝗲:\n{p}xidach create 𝗯𝗲𝘁_𝗮𝗺𝗼𝘂𝗻𝘁\n{p}xidach join 𝗯𝗲𝘁_𝗮𝗺𝗼𝘂𝗻𝘁\n{p}xidach leave\n{p}xidach start",
      "magic_five": "𝗠𝗮𝗴𝗶𝗰 𝟱",
      "blackJack": "𝗕𝗹𝗮𝗰𝗸𝗷𝗮𝗰𝗸",
      "double_aces": "𝗗𝗼𝘂𝗯𝗹𝗲 𝗔𝗰𝗲𝘀",
      "points": " 𝗽𝗼𝗶𝗻𝘁𝘀",
      "final": "[ 𝗚𝗔𝗠𝗘 𝗥𝗘𝗦𝗨𝗟𝗧𝗦 ]\n──────────────────\n→ 𝗕𝗼𝘁: %1",
      "get_or_ready": "[ %1 ]\n𝗥𝗲𝗺𝗮𝗶𝗻𝗶𝗻𝗴 𝗰𝗮𝗿𝗱𝘀: %2\n%3, 𝗰𝗵𝗼𝗼𝘀𝗲 𝗴𝗲𝘁 𝗼𝗿 𝗿𝗲𝗮𝗱𝘆.",
      "out_of_time": "%1, 𝘁𝗶𝗺𝗲𝗼𝘂𝘁 (𝟮𝟬𝘀).",
      "yourCards": "𝗬𝗼𝘂𝗿 𝗰𝗮𝗿𝗱𝘀: %1",
      "cards_limit": "𝗠𝗮𝘅 𝟱 𝗰𝗮𝗿𝗱𝘀 𝗿𝗲𝗮𝗰𝗵𝗲𝗱.",
      "points_limit": "𝟮𝟭+ 𝗽𝗼𝗶𝗻𝘁𝘀 𝗿𝗲𝗮𝗰𝗵𝗲𝗱.",
      "getSuccess": "𝗥𝗲𝗺𝗮𝗶𝗻𝗶𝗻𝗴 𝗰𝗮𝗿𝗱𝘀: %1\n𝗦𝘂𝗰𝗰𝗲𝘀𝘀! 𝗖𝗵𝗼𝗼𝘀𝗲 𝗿𝗲𝗮𝗱𝘆 𝗼𝗿 𝗴𝗲𝘁!",
      "ready": "𝗬𝗼𝘂 𝗰𝗵𝗼𝘀𝗲 𝘁𝗼 𝘀𝘁𝗮𝘆!",
      "alreadyHave": "𝗚𝗮𝗺𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗿𝘂𝗻𝗻𝗶𝗻𝗴 𝗶𝗻 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽!",
      "openSuccess": "𝗚𝗮𝗺𝗲 𝗰𝗿𝗲𝗮𝘁𝗲𝗱! (𝟮/%1)\n𝗝𝗼𝗶𝗻 𝘄𝗶𝘁𝗵:\n{p}xidach join 𝗯𝗲𝘁",
      "alreadyJoined": "𝗬𝗼𝘂 𝗮𝗿𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗶𝗻 𝘁𝗵𝗲 𝗴𝗮𝗺𝗲",
      "out_of_room": "𝗥𝗼𝗼𝗺 𝗶𝘀 𝗳𝘂𝗹𝗹...",
      "alreadyStarted_1": "𝗚𝗮𝗺𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝘀𝘁𝗮𝗿𝘁𝗲𝗱, 𝗰𝗮𝗻'𝘁 𝗷𝗼𝗶𝗻!",
      "joinSuccess": "𝗝𝗼𝗶𝗻𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆! (%1/%2)",
      "author_left_before_start": "𝗛𝗼𝘀𝘁 𝗹𝗲𝗳𝘁, 𝗴𝗮𝗺𝗲 𝗰𝗮𝗻𝗰𝗲𝗹𝗹𝗲𝗱!\n𝗕𝗲𝘁𝘀 𝗿𝗲𝗳𝘂𝗻𝗱𝗲𝗱!",
      "outSuccess": "𝗟𝗲𝗳𝘁 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆! (%1/%2)",
      "not_yet_started": "𝗚𝗮𝗺𝗲 𝗻𝗼𝘁 𝘀𝘁𝗮𝗿𝘁𝗲𝗱, 𝗯𝗲𝘁 𝗿𝗲𝗳𝘂𝗻𝗱𝗲𝗱!",
      "only_bot_left": "𝗢𝗻𝗹𝘆 𝗯𝗼𝘁 𝗹𝗲𝗳𝘁, 𝗴𝗮𝗺𝗲 𝗰𝗮𝗻𝗰𝗲𝗹𝗹𝗲𝗱!",
      "not_author": "𝗬𝗼𝘂 𝗮𝗿𝗲 𝗻𝗼𝘁 𝘁𝗵𝗲 𝗵𝗼𝘀𝘁",
      "alreadyStarted_2": "𝗚𝗮𝗺𝗲 𝗶𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗿𝘂𝗻𝗻𝗶𝗻𝗴!",
      "testInbox": "𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗶𝗻𝗯𝗼𝘅 𝘀𝘁𝗮𝘁𝘂𝘀...",
      "checkInbox_noti": "→ 𝗕𝗼𝘁 𝘄𝗶𝗹𝗹 𝘀𝗲𝗻𝗱 𝗰𝗮𝗿𝗱𝘀 𝘃𝗶𝗮 𝗶𝗻𝗯𝗼𝘅, 𝗽𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗲𝗰𝗸 𝗶𝗻𝗯𝗼𝘅/𝘀𝗽𝗮𝗺",
      "cannotInbox": "%1, 𝗰𝗮𝗻'𝘁 𝗶𝗻𝗯𝗼𝘅 𝘆𝗼𝘂, 𝗽𝗹𝗲𝗮𝘀𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗯𝗼𝘁 𝗳𝗶𝗿𝘀𝘁",
      "explaining": "𝗪𝗵𝗲𝗻 𝘆𝗼𝘂𝗿 𝘁𝘂𝗿𝗻, 𝘁𝘆𝗽𝗲:\n𝗴𝗲𝘁 (𝗱𝗿𝗮𝘄 𝗰𝗮𝗿𝗱, 𝗺𝗮𝘅 𝟯 𝘁𝗶𝗺𝗲𝘀)\n𝗿𝗲𝗮𝗱𝘆 (𝘀𝘁𝗮𝘆, 𝗻𝗼 𝗺𝗼𝗿𝗲 𝗰𝗮𝗿𝗱𝘀)",
      "start_after_5s": "𝗣𝗿𝗲𝗽𝗮𝗿𝗶𝗻𝗴...",
      "started": "𝗚𝗔𝗠𝗘 𝗦𝗧𝗔𝗥𝗧𝗘𝗗!"
    }
  },

  cards: {
    31: "3_of_spades.png",
    32: "3_of_clubs.png",
    33: "3_of_diamonds.png",
    34: "3_of_hearts.png",
    41: "4_of_spades.png",
    42: "4_of_clubs.png",
    43: "4_of_diamonds.png",
    44: "4_of_hearts.png",
    51: "5_of_spades.png",
    52: "5_of_clubs.png",
    53: "5_of_diamonds.png",
    54: "5_of_hearts.png",
    61: "6_of_spades.png",
    62: "6_of_clubs.png",
    63: "6_of_diamonds.png",
    64: "6_of_hearts.png",
    71: "7_of_spades.png",
    72: "7_of_clubs.png",
    73: "7_of_diamonds.png",
    74: "7_of_hearts.png",
    81: "8_of_spades.png",
    82: "8_of_clubs.png",
    83: "8_of_diamonds.png",
    84: "8_of_hearts.png",
    91: "9_of_spades.png",
    92: "9_of_clubs.png",
    93: "9_of_diamonds.png",
    94: "9_of_hearts.png",
    101: "10_of_spades.png",
    102: "10_of_clubs.png",
    103: "10_of_diamonds.png",
    104: "10_of_hearts.png",
    111: "jack_of_spades2.png",
    112: "jack_of_clubs2.png",
    113: "jack_of_diamonds2.png",
    114: "jack_of_hearts2.png",
    121: "queen_of_spades2.png",
    122: "queen_of_clubs2.png",
    123: "queen_of_diamonds2.png",
    124: "queen_of_hearts2.png",
    131: "king_of_spades2.png",
    132: "king_of_clubs2.png",
    133: "king_of_diamonds2.png",
    134: "king_of_hearts2.png",
    11: "ace_of_spades.png",
    12: "ace_of_clubs.png",
    13: "ace_of_diamonds.png",
    14: "ace_of_hearts.png",
    21: "2_of_spades.png",
    22: "2_of_clubs.png",
    23: "2_of_diamonds.png",
    24: "2_of_hearts.png",
  },

  onLoad: async function () {
    let path = __dirname + '/poker/';
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    await axios.get("https://raw.githubusercontent.com/Chinhle2224455/base64_poker/main/data.json").then(async (res) => {
      for (let e in res.data) {
        if (fs.existsSync(path + e)) continue;
        await fs.writeFileSync(path + e, res.data[e], 'base64');
      }
    });
    if (!global.client.xidach_otm) global.client.xidach_otm = {};
    console.log("https://www.facebook.com/profile.php?id=1193456508");
  },

  onStart: async function ({ api, event, args, message, usersData, currenciesData }) {
    try {
      // Check dependencies
      if (!fs.existsSync) throw new Error("𝗳𝘀 𝗺𝗼𝗱𝘂𝗹𝗲 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱");
      if (!axios) throw new Error("𝗮𝘅𝗶𝗼𝘀 𝗺𝗼𝗱𝘂𝗹𝗲 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱");

      if (!global.client.xidach_otm) global.client.xidach_otm = {};
      const { threadID, messageID, senderID } = event;
      
      // Define delay function at the top level
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      
      const getText = (key, ...values) => {
        let text = this.langs.en[key];
        if (values.length > 0) {
          values.forEach((value, index) => {
            text = text.replace(`%${index + 1}`, value);
          });
        }
        return text;
      };

      const countC = (array) => {
        let total = 0;
        array.forEach(e => {
          let num = 0;
          if (e >= 101) num = 10;
          else num = Math.floor((e / 10) % 10);
          total += num;
        });
        return total;
      };

      const nextUser = async (object) => {
        if (!global.client.xidach_otm[threadID]) return;
        global.client.xidach_otm[threadID].curUser++;
        if (global.client.xidach_otm[threadID].curUser == global.client.xidach_otm[threadID].data.length - 1) return endS(object);
        
        let curU = global.client.xidach_otm[threadID].curUser;
        let curUserD = global.client.xidach_otm[threadID].data[curU];
        let name = (await api.getUserInfo(curUserD.id))[curUserD.id]?.name || "Player";
        let oldL = curUserD.cards.length;
        
        api.sendMessage({
          body: getText("get_or_ready", new Date().toLocaleString("en-US", {timeZone: 'Asia/Dhaka'}), global.client.xidach_otm[threadID].cards.length, name),
          mentions: [{ tag: name, id: curUserD.id }]
        }, threadID);
        
        setTimeout(async () => {
          if (!global.client.xidach_otm[threadID]) return;
          let newCurUserD = global.client.xidach_otm[threadID].data[curU];
          if (oldL == newCurUserD.cards.length && !newCurUserD.ready) {
            api.sendMessage({
              body: getText("out_of_time", name),
              mentions: [{ tag: name, id: curUserD.id }]
            }, threadID);
            await delay(300);
            return nextUser(object);
          }
        }, 20000);
      };

      const endS = async (object) => {
        var botCards = object.data[object.players - 1].cards;
        var getBotPoint = countC(botCards);
        var botRank = (getBotPoint < 16) ? 0 : (getBotPoint <= 21) ? 2 : 1;
        if (getBotPoint == 2 && Math.floor((botCards[0] / 10) % 10) == 1) botRank = 5;
        if (getBotPoint == 11 && (botCards[0] >= 111 && Math.floor((botCards[1] / 10) % 10) == 1) || (botCards[1] >= 111 && Math.floor((botCards[0] / 10) % 10) == 1)) botRank = 4;
        
        let getCardIndex = Math.floor(Math.random() * object.cards.length);
        if (botRank == 0) {
          while (botCards.length < 5 && getBotPoint < 21) {
            object.data[object.players - 1].cards.push(object.cards[getCardIndex]);
            object.cards.splice(getCardIndex, 1);
            botCards = object.data[object.players - 1].cards;
            getBotPoint = countC(botCards);
          }
          if (getBotPoint <= 21) botRank = 2;
          else botRank = 1;
        }
        
        if (botRank == 2) {
          if (botCards.length == 5) botRank = 3;
          while (getBotPoint < 16) {
            object.data[object.players - 1].cards.push(object.cards[getCardIndex]);
            object.cards.splice(getCardIndex, 1);
            botCards = object.data[object.players - 1].cards;
            getBotPoint = countC(botCards);
          }
          if (getBotPoint < 18) {
            let rand = Math.random();
            if (rand <= 0.2) {
              object.data[object.players - 1].cards.push(object.cards[getCardIndex]);
              object.cards.splice(getCardIndex, 1);
              botCards = object.data[object.players - 1].cards;
              getBotPoint = countC(botCards);
            }
          }
          if (getBotPoint > 21) botRank = 1;
        }
        
        var msg = getText("final", (botRank == 3) ? getText("magic_five") : (botRank == 4) ? getText("blackJack") : (botRank == 5) ? getText("double_aces") : (getBotPoint + getText("points")));
        var rank = 0, playerPoints = 0;
        var result = "";
        
        for (let i = 0; i < object.players - 1; i++) {
          let playerD = object.data[i];
          playerPoints = countC(playerD.cards);
          rank = (playerPoints < 16) ? 0 : (playerPoints <= 21) ? 2 : 1;
          if (playerPoints == 2 && Math.floor((playerD.cards[0] / 10) % 10) == 1) rank = 5;
          if (playerPoints == 11 && (playerD.cards[0] >= 111 && Math.floor((playerD.cards[1] / 10) % 10) == 1) || (playerD.cards[1] >= 111 && Math.floor((playerD.cards[0] / 10) % 10) == 1)) rank = 4;
          if (rank == 2 && playerD.cards.length == 5) rank = 3;
          
          let bonus = (rank == 3) ? object.bonus.superWinBonus : (rank >= 4) ? object.bonus.epicWinBonus : 1;
          result = (botRank > rank) ? `𝗟𝗼𝘀𝗲 (-${playerD.bet}$)` : `𝗪𝗶𝗻 (+${playerD.bet + "$ x" + bonus})`;
          
          if (botRank == rank) {
            result = (playerPoints == getBotPoint || rank >= 4) ? "𝗗𝗿𝗮𝘄" : (rank == 1) ? (playerPoints < getBotPoint) ? `𝗪𝗶𝗻 (+${playerD.bet}$)` : `𝗟𝗼𝘀𝗲 (-${playerD.bet}$)` : (rank == 2) ? (playerPoints > getBotPoint) ? `𝗪𝗶𝗻 (+${playerD.bet}$)` : `𝗟𝗼𝘀𝗲 (-${playerD.bet}$)` : (rank == 3) ? (playerPoints < getBotPoint) ? `𝗪𝗶𝗻 (+${playerD.bet + " x" + object.bonus.superWinBonus}$)` : `𝗟𝗼𝘀𝗲 (-${playerD.bet}$)` : '';
          }
          
          if (result == "𝗗𝗿𝗮𝘄") await currenciesData.increaseMoney(playerD.id, playerD.bet);
          else if (result.slice(0,3) != "𝗟𝗼𝘀") await currenciesData.increaseMoney(playerD.id, playerD.bet * (bonus + 1));
          
          let name = (await api.getUserInfo(playerD.id))[playerD.id]?.name || "Player";
          msg += `\n + ${name}: ${(rank == 3) ? getText("magic_five") : (rank == 4) ? getText("blackJack") : (rank == 5) ? getText("double_aces") : (playerPoints + getText("points"))} | ` + result;
        }
        
        api.sendMessage(msg, threadID, () => delete global.client.xidach_otm[threadID]);
      };

      // Main command logic
      const moneyUser = (await currenciesData.get(senderID)).money;
      const prefix = "/";
      let moneyBet = 0;

      switch (args[0]) {
        case 'create':
          moneyBet = parseInt(args[1]);
          if (isNaN(moneyBet) || moneyBet <= 0) return message.reply(getText("missingInput"));
          if (moneyBet > moneyUser) return message.reply(getText("moneyBetNotEnough"));
          if (moneyBet < 50) return message.reply(getText("limitBet"));
          if (threadID in global.client.xidach_otm) return message.reply(getText("alreadyHave"));
          
          await currenciesData.decreaseMoney(senderID, moneyBet);
          global.client.xidach_otm[threadID] = {
            players: 2,
            status: "pending",
            data: [{ id: senderID, bet: moneyBet, cards: [], type: "author" }],
            bonus: this.config.envConfig,
            cards: [],
            curUser: -1
          };
          
          return message.reply(getText("openSuccess", this.config.envConfig.maxPlayers, prefix + this.config.name));

        case "join":
          if (!(threadID in global.client.xidach_otm)) return message.reply(getText("noGame"));
          if (global.client.xidach_otm[threadID].data.find(p => p.id == senderID)) return message.reply(getText("alreadyJoined"));
          if (global.client.xidach_otm[threadID].players == this.config.envConfig.maxPlayers) return message.reply(getText("out_of_room"));
          if (global.client.xidach_otm[threadID].status == "started") return message.reply(getText("alreadyStarted_1"));
          
          moneyBet = parseInt(args[1]);
          if (isNaN(moneyBet) || moneyBet <= 0) return message.reply(getText("missingInput"));
          if (moneyBet > moneyUser) return message.reply(getText("moneyBetNotEnough"));
          if (moneyBet < 50) return message.reply(getText("limitBet"));
          
          await currenciesData.decreaseMoney(senderID, moneyBet);
          global.client.xidach_otm[threadID].players++;
          global.client.xidach_otm[threadID].data.push({ id: senderID, bet: moneyBet, cards: [], type: "player" });
          
          return message.reply(getText("joinSuccess", global.client.xidach_otm[threadID].players, this.config.envConfig.maxPlayers));

        case "leave":
          if (!(threadID in global.client.xidach_otm)) return message.reply(getText("noGame"));
          
          if (global.client.xidach_otm[threadID].data.find(p => p.id == senderID)?.type == "author" && global.client.xidach_otm[threadID].status == "pending") {
            global.client.xidach_otm[threadID].data.forEach(async (p) => {
              if (p.id != api.getCurrentUserID()) await currenciesData.increaseMoney(p.id, p.bet);
            });
            delete global.client.xidach_otm[threadID];
            return message.reply(getText("author_left_before_start"));
          }
          
          global.client.xidach_otm[threadID].players -= 1;
          if (global.client.xidach_otm[threadID].status == "pending") {
            const player = global.client.xidach_otm[threadID].data.find(p => p.id == senderID);
            if (player) await currenciesData.increaseMoney(senderID, player.bet);
          }
          
          global.client.xidach_otm[threadID].data = global.client.xidach_otm[threadID].data.filter(p => p.id != senderID);
          
          if (global.client.xidach_otm[threadID].players == 1) {
            delete global.client.xidach_otm[threadID];
            return message.reply(getText("only_bot_left"));
          }
          
          return message.reply(getText("outSuccess", global.client.xidach_otm[threadID].players, this.config.envConfig.maxPlayers));

        case "start":
          if (!(threadID in global.client.xidach_otm)) return message.reply(getText("noGame"));
          if (global.client.xidach_otm[threadID].data.find(p => p.id == senderID)?.type != "author") return message.reply(getText("not_author"));
          if (global.client.xidach_otm[threadID].status == "started") return message.reply(getText("alreadyStarted_2"));
          
          global.client.xidach_otm[threadID].status = "started";
          global.client.xidach_otm[threadID].data.push({ id: api.getCurrentUserID(), cards: [], type: "BOSS" });
          
          var cardKeys = Object.keys(this.cards);
          for (let i = cardKeys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardKeys[i], cardKeys[j]] = [cardKeys[j], cardKeys[i]];
          }
          
          await message.reply(getText("testInbox"));
          for (let i = 0; i < global.client.xidach_otm[threadID].data.length; i++) {
            let p = global.client.xidach_otm[threadID].data[i];
            if (p.id == api.getCurrentUserID()) continue;
            try {
              await api.sendMessage("𝘁𝗲𝘀𝘁𝗶𝗻𝗴...", p.id);
            } catch (err) {
              let curName = (await api.getUserInfo(p.id))[p.id]?.name || "Player";
              await api.sendMessage({
                body: getText("cannotInbox", curName),
                mentions: [{ tag: curName, id: p.id }]
              }, threadID);
            }
            await delay(2000);
          }
          
          await message.reply(getText("checkInbox_noti"));
          for (let i = 0; i < global.client.xidach_otm[threadID].data.length; i++) {
            try {
              let p = global.client.xidach_otm[threadID].data[i];
              let one = cardKeys.shift();
              let two = cardKeys.shift();
              global.client.xidach_otm[threadID].data[i].cards.push(one, two);
              
              if (p.id == api.getCurrentUserID()) continue;
              
              const atms = [
                fs.createReadStream(__dirname + `/poker/${this.cards[one]}`),
                fs.createReadStream(__dirname + `/poker/${this.cards[two]}`)
              ];
              
              await api.sendMessage({
                body: getText("yourCards", countC(global.client.xidach_otm[threadID].data[i].cards)),
                attachment: atms
              }, p.id);
              await delay(300);
            } catch (e) {
              console.error("𝗖𝗮𝗿𝗱 𝗲𝗿𝗿𝗼𝗿:", e);
            }
          }
          
          await message.reply(getText("explaining"));
          await delay(1000);
          await message.reply(getText("start_after_5s"));
          await delay(5000);
          await message.reply(getText("started"));
          await delay(300);
          
          global.client.xidach_otm[threadID].cards = cardKeys;
          global.client.xidach_otm[threadID].curUser = -1;
          return nextUser(global.client.xidach_otm[threadID]);

        default:
          return message.reply(getText("xidachRules"));
      }

    } catch (error) {
      console.error("𝗫𝗶𝗱𝗮𝗰𝗵 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗲𝗿𝗿𝗼𝗿:", error);
      return message.reply("❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.");
    }
  },

  onChat: async function ({ event, api, getText, usersData, currenciesData }) {
    if (event.senderID == api.getCurrentUserID()) return;
    
    // Define delay function for onChat
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(300);
    
    if (!event.body) return;
    
    const { threadID, senderID, body } = event;
    const getTextLocal = (key, ...values) => {
      let text = this.langs.en[key];
      if (values.length > 0) {
        values.forEach((value, index) => {
          text = text.replace(`%${index + 1}`, value);
        });
      }
      return text;
    };

    if (global.client.xidach_otm[threadID]?.curUser >= 0) {
      let curU = global.client.xidach_otm[threadID].curUser;
      if (global.client.xidach_otm[threadID].data[curU]?.id != senderID) return;
      
      const bodyLower = body.toLowerCase();
      const countC = (array) => {
        let total = 0;
        array.forEach(e => {
          let num = 0;
          if (e >= 101) num = 10;
          else num = Math.floor((e / 10) % 10);
          total += num;
        });
        return total;
      };

      if (bodyLower == "get") {
        global.client.xidach_otm[threadID].data[curU].cards.push(global.client.xidach_otm[threadID].cards.pop());
        
        const atms = global.client.xidach_otm[threadID].data[curU].cards.map(c => 
          fs.createReadStream(__dirname + `/poker/${this.cards[c]}`)
        );
        
        api.sendMessage({
          body: getTextLocal("yourCards", countC(global.client.xidach_otm[threadID].data[curU].cards)),
          attachment: atms
        }, senderID);
        
        if (global.client.xidach_otm[threadID].data[curU].cards.length == 5) {
          api.sendMessage(getTextLocal("cards_limit"), threadID);
          await delay(1000);
          return nextUser(global.client.xidach_otm[threadID]);
        }
        
        if (countC(global.client.xidach_otm[threadID].data[curU].cards) >= 21) {
          api.sendMessage(getTextLocal("points_limit"), threadID);
          await delay(1000);
          return nextUser(global.client.xidach_otm[threadID]);
        }
        
        api.sendMessage(getTextLocal("getSuccess", global.client.xidach_otm[threadID].cards.length), threadID);
      }
      
      if (bodyLower == "ready") {
        api.sendMessage(getTextLocal("ready"), threadID);
        global.client.xidach_otm[threadID].data[curU].ready = true;
        await delay(300);
        return nextUser(global.client.xidach_otm[threadID]);
      }
    }
  }
};
