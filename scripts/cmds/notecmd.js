const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "notecmd",
    version: "0.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 3,
    category: "admin",
    shortDescription: {
      en: "𝐸𝑑𝑖𝑡 𝑎𝑑𝑚𝑖𝑛 𝑐𝑜𝑑𝑒 𝑚𝑑𝑙 𝑐𝑜𝑛𝑡𝑒𝑛𝑡"
    },
    longDescription: {
      en: "𝑀𝑜𝑑𝑖𝑓𝑦 𝑎𝑑𝑚𝑖𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑐𝑜𝑑𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡"
    },
    guide: {
      en: "{p}notecmd [𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒] [𝑢𝑟𝑙]"
    },
    countDown: 3,
    dependencies: {
      "axios": "",
      "fs": "",
      "uuid": ""
    }
  },

  onStart: async function({ message, event, args }) {
    const name = this.config.name;
    const url = event?.messageReply?.args?.[0] || args[1];
    let path = `${__dirname}/${args[0]}`;
    
    const send = msg => message.reply(msg);

    try {
      if (/^https:\/\//.test(url)) {
        return send(`🔗 𝐹𝑖𝑙𝑒: ${path}\n\n𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 𝑟𝑒𝑝𝑙𝑎𝑐𝑒𝑚𝑒𝑛𝑡 𝑜𝑓 𝑓𝑖𝑙𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡`).then(res => {
          const reactionData = {
            ...res,
            name,
            path,
            event,
            url,
            action: 'confirm_replace_content',
          };
          global.client.handleReaction.push(reactionData);
        });
      } else {
        if (!fs.existsSync(path)) return send(`❎ 𝐹𝑖𝑙𝑒 𝑝𝑎𝑡ℎ 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡 𝑓𝑜𝑟 𝑒𝑥𝑝𝑜𝑟𝑡`);
        
        const uuid = require('uuid').v4();
        const url_raw = new URL(`https://note.subhatde.id.vn/note/${uuid}`);
        const url_redirect = new URL(`https://note.subhatde.id.vn/note/${require('uuid').v4()}`);
        
        await axios.put(url_raw.href, fs.readFileSync(path, 'utf8'));
        url_redirect.searchParams.append('raw', uuid);
        await axios.put(url_redirect.href);
        url_redirect.searchParams.append('raw', 'true');
        
        return send(`📝 𝑅𝑎𝑤: ${url_redirect.href}\n\n✏️ 𝐸𝑑𝑖𝑡: ${url_raw.href}\n────────────────\n• 𝐹𝑖𝑙𝑒: ${path}\n\n📌 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑢𝑝𝑙𝑜𝑎𝑑 𝑐𝑜𝑑𝑒`).then(res => {
          const reactionData = {
            ...res,
            name,
            path,
            event,
            url: url_redirect.href,
            action: 'confirm_replace_content',
          };
          global.client.handleReaction.push(reactionData);
        });
      }
    } catch (e) {
      console.error(e);
      send(e.toString());
    }
  },

  handleReaction: async function({ handleReaction, event, api }) {
    const _ = handleReaction;
    const send = msg => api.sendMessage(msg, event.threadID);

    try {
      if (event.userID !== _.event.senderID) return;

      switch (_.action) {
        case 'confirm_replace_content': {
          const content = (await axios.get(_.url, {
            responseType: 'text',
          })).data;

          fs.writeFileSync(_.path, content);
          send(`✅ 𝐶𝑜𝑑𝑒 𝑢𝑝𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦\n\n🔗 𝐹𝑖𝑙𝑒: ${_.path}`);
          break;
        }
        default:
          break;
      }
    } catch (e) {
      console.error(e);
      send(e.toString());
    }
  }
};
