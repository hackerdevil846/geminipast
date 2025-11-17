const fs = require('fs');
const ytdl = require('@distube/ytdl-core');
const axios = require('axios');
const moment = require("moment-timezone");

async function downloadMusicFromYoutube(link, path) {
  var timestart = Date.now();
  if(!link) return '𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑙𝑖𝑛𝑘'
  var resolveFunc = function () { };
  var rejectFunc = function () { };
  var returnPromise = new Promise(function (resolve, reject) {
    resolveFunc = resolve;
    rejectFunc = reject;
  });
    ytdl(link, {
            filter: format =>
                format.quality == 'tiny' && format.audioBitrate == 48 && format.hasAudio == true
        }).pipe(fs.createWriteStream(path))
        .on("close", async () => {
            var data = await ytdl.getInfo(link)
            var result = {
                title: data.videoDetails.title,
                dur: Number(data.videoDetails.lengthSeconds),
                sub: data.videoDetails.author.subscriber_count,
                viewCount: data.videoDetails.viewCount,
                likes: data.videoDetails.likes,
                author: data.videoDetails.author.name,
                timestart: timestart
            }
            resolveFunc(result)
        })
  return returnPromise
}

module.exports = {
  config: {
    name: "ytmusic",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑚𝑢𝑠𝑖𝑐 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒"
    },
    longDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑚𝑢𝑠𝑖𝑐 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑏𝑦 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ"
    },
    guide: {
      en: "{p}ytmusic [𝑠𝑒𝑎𝑟𝑐ℎ𝑄𝑢𝑒𝑟𝑦]"
    },
    countDown: 0,
    dependencies: {
      "fs": "",
      "@distube/ytdl-core": "",
      "axios": "",
      "moment-timezone": "",
      "youtube-search-api": "",
      "fs-extra": ""
    }
  },

  convertHMS: function(value) {
    const sec = parseInt(value, 10); 
    let hours   = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60); 
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return (hours != '00' ? hours +':': '') + minutes+':'+seconds;
  },

  onStart: async function({ api, event, args, usersData }) {
    const name = await usersData.getName(event.senderID);
    
    if (args.length == 0 || !args) {
      return api.sendMessage(`${name}, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦! 🎵`, event.threadID, event.messageID);
    }

    const keywordSearch = args.join(" ");
    const path = `${__dirname}/cache/ytmusic-${event.senderID}.mp3`;
    
    if (fs.existsSync(path)) { 
        fs.unlinkSync(path);
    }

    if (args.join(" ").indexOf("https://") == 0) { 
        try {
            return api.sendMessage({ 
                body: `𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑚𝑢𝑠𝑖𝑐...`}, event.threadID, () => fs.unlinkSync(path), 
            event.messageID);       
        } catch (e) { 
            return console.log(e);
        }
    } else {
        try {
            const link = [];
            let msg = "";
            let num = 0;
            const Youtube = require('youtube-search-api');
            const data = (await Youtube.GetListByKeyword(keywordSearch, false, 6)).items;
            
            for (let value of data) {
                link.push(value.id);
                num += 1;
                msg += (`${num} - ${value.title}\n🌐 𝐶ℎ𝑎𝑛𝑛𝑒𝑙: ${value.channelTitle}\n⏰ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${value.length.simpleText}\n\n`);
            }
            
            const body = `[ 𝑌𝑂𝑈𝑇𝑈𝐵𝐸 𝑀𝑈𝑆𝐼𝐶 𝑆𝐸𝐴𝑅𝐶𝐻 ]\n━━━━━━━━━━━━━━━━━━\n${msg}➝ 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑚𝑢𝑠𝑖𝑐`;
            
            return api.sendMessage({
                body: body
            }, event.threadID, (error, info) => global.client.handleReply.push({
                type: 'reply',
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                link
            }), event.messageID);
        } catch(e) {
            return api.sendMessage('𝐸𝑟𝑟𝑜𝑟: ' + e, event.threadID, event.messageID);
        }
    }
  },

  handleReply: async function({ api, event, handleReply, usersData }) {
    const { createReadStream, unlinkSync, statSync } = require("fs-extra");
    const path = `${__dirname}/cache/ytmusic-${event.senderID}.mp3`;
    const hmm = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
    const name = await usersData.getName(event.senderID);

    try {
        const data = await downloadMusicFromYoutube('https://www.youtube.com/watch?v=' + handleReply.link[event.body - 1], path);
        
        if (statSync(path).size > 26214400) {
            return api.sendMessage('𝑀𝑢𝑠𝑖𝑐 𝑓𝑖𝑙𝑒 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑠𝑜𝑛𝑔 🎵', event.threadID, () => unlinkSync(path), event.messageID);
        }
        
        api.unsendMessage(handleReply.messageID);
        
        return api.sendMessage({ 
            body: `[ 𝑌𝑂𝑈𝑇𝑈𝐵𝐸 𝑀𝑈𝑆𝐼𝐶 ]\n━━━━━━━━━━━━━━━━━━\n🎧 𝑇𝑖𝑡𝑙𝑒: ${data.title}\n⏰ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${this.convertHMS(data.dur)}\n🌐 𝐶ℎ𝑎𝑛𝑛𝑒𝑙: ${data.author}\n👥 𝑆𝑢𝑏𝑠𝑐𝑟𝑖𝑏𝑒𝑟𝑠: ${data.sub}\n👁️ 𝑉𝑖𝑒𝑤𝑠: ${data.viewCount}\n👍 𝐿𝑖𝑘𝑒𝑠: ${data.likes}\n👤 𝑈𝑠𝑒𝑟: ${name}\n⌛ 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡𝑖𝑚𝑒: ${Math.floor((Date.now()- data.timestart)/1000)} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠\n━━━━━━━━━━━━━━━━━━`,
            attachment: createReadStream(path)
        }, event.threadID, () => unlinkSync(path), event.messageID);
    } catch (e) { 
        return console.log(e);
    }
  }
};
