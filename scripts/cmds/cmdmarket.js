const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');

// Function to apply mathematical italic font to text
function formatText(text) {
  const fontMap = {
    a: "𝑎", b: "𝑏", c: "𝑐", d: "𝑑", e: "𝑒", f: "𝑓", g: "𝑔", h: "ℎ",
    i: "𝑖", j: "𝑗", k: "𝑘", l: "𝑙", m: "𝑚", n: "𝑛", o: "𝑜", p: "𝑝",
    q: "𝑞", r: "𝑟", s: "𝑠", t: "𝑡", u: "𝑢", v: "𝑣", w: "𝑤", x: "𝑥",
    y: "𝑦", z: "𝑧",
    A: "𝐴", B: "𝐵", C: "𝐶", D: "𝐷", E: "𝐸", F: "𝐹", G: "𝐺", H: "𝐻",
    I: "𝐼", J: "𝐽", K: "𝐾", L: "𝐿", M: "𝑀", N: "𝑁", O: "𝑂", P: "𝑃",
    Q: "𝑄", R: "𝑅", S: "𝑆", T: "𝑇", U: "𝑈", V: "𝑉", W: "𝑊", X: "𝑋",
    Y: "𝑌", Z: "𝑍"
  };
  return text.split('').map(char => fontMap[char] || char).join('');
}

module.exports = {
  config: {
    name: "cmdmarket",
    aliases: ["cmdmart", "commandstore"],
    version: "12.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: formatText("Command Marketplace")
    },
    longDescription: {
      en: formatText("Browse, search, upload, and manage commands in the marketplace")
    },
    guide: {
      en: "{p}cmdmarket\n{p}cmdmarket <show|page|search|trending|stats|like|upload> [options]"
    },
    countDown: 0,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, args }) {
    const GoatMart = "https://goatmart.vercel.app";

    const sendBeautifulMessage = (content) => {
      const header = formatText("╭───『 𝐶𝑚𝑑𝑀𝑎𝑟𝑘𝑒𝑡 』───╮\n");
      const footer = formatText("\n╰─────────────╯");
      return message.reply(header + content + footer);
    };

    try {
      if (!args[0]) {
        return sendBeautifulMessage(
          formatText(
            "\n" +
            `╭─❯ ${event.body} 𝑠ℎ𝑜𝑤 <𝐼𝐷>\n├ 𝐺𝑒𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑐𝑜𝑑𝑒\n╰ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑠ℎ𝑜𝑤 1\n\n` +
            `╭─❯ ${event.body} 𝑝𝑎𝑔𝑒 <𝑛𝑢𝑚𝑏𝑒𝑟>\n├ 𝐵𝑟𝑜𝑤𝑠𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠\n╰ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑝𝑎𝑔𝑒 1\n\n` +
            `╭─❯ ${event.body} 𝑠𝑒𝑎𝑟𝑐ℎ <𝑞𝑢𝑒𝑟𝑦>\n├ 𝑆𝑒𝑎𝑟𝑐ℎ 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠\n╰ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑠𝑒𝑎𝑟𝑐ℎ 𝑚𝑢𝑠𝑖𝑐\n\n` +
            `╭─❯ ${event.body} 𝑡𝑟𝑒𝑛𝑑𝑖𝑛𝑔\n├ 𝑉𝑖𝑒𝑤 𝑡𝑟𝑒𝑛𝑑𝑖𝑛𝑔\n╰ 𝑀𝑜𝑠𝑡 𝑝𝑜𝑝𝑢𝑙𝑎𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠\n\n` +
            `╭─❯ ${event.body} 𝑠𝑡𝑎𝑡𝑠\n├ 𝑉𝑖𝑒𝑤 𝑠𝑡𝑎𝑡𝑖𝑠𝑡𝑖𝑐𝑠\n╰ 𝑀𝑎𝑟𝑘𝑒𝑡𝑝𝑙𝑎𝑐𝑒 𝑖𝑛𝑠𝑖𝑔ℎ𝑡𝑠\n\n` +
            `╭─❯ ${event.body} 𝑙𝑖𝑘𝑒 <𝐼𝐷>\n├ 𝐿𝑖𝑘𝑒 𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑\n╰ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑙𝑖𝑘𝑒 1\n\n` +
            `╭─❯ ${event.body} 𝑢𝑝𝑙𝑜𝑎𝑑 <𝑛𝑎𝑚𝑒>\n├ 𝑈𝑝𝑙𝑜𝑎𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑\n╰ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑢𝑝𝑙𝑜𝑎𝑑 𝑐𝑚𝑑𝑚𝑎𝑟𝑘𝑒𝑡\n\n` +
            "𝑇𝑖𝑝: 𝑈𝑠𝑒 'ℎ𝑒𝑙𝑝 𝑐𝑚𝑑𝑚𝑎𝑟𝑘𝑒𝑡' 𝑓𝑜𝑟 𝑑𝑒𝑡𝑎𝑖𝑙𝑠"
          )
        );
      }

      const command = args[0].toLowerCase();

      switch (command) {
        case "show": {
          const itemID = parseInt(args[1]);
          if (isNaN(itemID)) return sendBeautifulMessage(formatText("\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑡𝑒𝑚 𝐼𝐷."));

          const response = await axios.get(`${GoatMart}/api/item/${itemID}`);
          const item = response.data;

          return sendBeautifulMessage(
            formatText(
              "\n" +
              `╭─❯ 𝑁𝑎𝑚𝑒\n╰ ${item.itemName}\n\n` +
              `╭─❯ 𝐼𝐷\n╰ ${item.itemID}\n\n` +
              `╭─❯ 𝑇𝑦𝑝𝑒\n╰ ${item.type || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛'}\n\n` +
              `╭─❯ 𝐴𝑢𝑡ℎ𝑜𝑟\n╰ ${item.authorName}\n\n` +
              `╭─❯ 𝑅𝑎𝑤 𝐿𝑖𝑛𝑘\n╰ ${item.rawLink}\n\n` +
              `╭─❯ 𝐴𝑑𝑑𝑒𝑑\n╰ ${new Date(item.createdAt).toLocaleString()}\n\n` +
              `╭─❯ 𝑉𝑖𝑒𝑤𝑠\n╰ ${item.views}\n\n` +
              `╭─❯ 𝐿𝑖𝑘𝑒𝑠\n╰ ${item.likes}`
            )
          );
        }

        case "page": {
          const page = parseInt(args[1]) || 1;
          const { data: { items, total } } = await axios.get(`${GoatMart}/api/items?page=${page}&limit=5`);
          const totalPages = Math.ceil(total / 5);

          if (page <= 0 || page > totalPages) {
            return sendBeautifulMessage(formatText("\n𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟."));
          }

          const itemsList = items.map((item, index) =>
            formatText(
              `╭─❯ ${index + 1}. ${item.itemName}\n` +
              `├ 𝐼𝐷: ${item.itemID}\n` +
              `├ 𝑇𝑦𝑝𝑒: ${item.type}\n` +
              `├ 𝐷𝑒𝑠𝑐: ${item.description}\n` +
              `╰ 𝐴𝑢𝑡ℎ𝑜𝑟: ${item.authorName}\n`
            )
          ).join("\n");

          return sendBeautifulMessage(formatText(`\n𝑃𝑎𝑔𝑒 ${page}/${totalPages}\n\n${itemsList}`));
        }

        case "search": {
          const query = args.slice(1).join(" ");
          if (!query) return sendBeautifulMessage(formatText("\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦."));

          const { data } = await axios.get(`${GoatMart}/api/items?search=${encodeURIComponent(query)}`);
          const results = data.items;

          if (!results.length) return sendBeautifulMessage(formatText("\n𝑁𝑜 𝑚𝑎𝑡𝑐ℎ𝑖𝑛𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑜𝑢𝑛𝑑."));

          const searchList = results.slice(0, 5).map((item, index) =>
            formatText(
              `╭─❯ ${index + 1}. ${item.itemName}\n` +
              `├ 𝐼𝐷: ${item.itemID}\n` +
              `├ 𝑇𝑦𝑝𝑒: ${item.type}\n` +
              `╰ 𝐴𝑢𝑡ℎ𝑜𝑟: ${item.authorName}\n`
            )
          ).join("\n");

          return sendBeautifulMessage(formatText(`\n𝑄𝑢𝑒𝑟𝑦: "${query}"\n\n${searchList}`));
        }

        case "trending": {
          const { data } = await axios.get(`${GoatMart}/api/trending`);
          const trendingList = data.slice(0, 5).map((item, index) =>
            formatText(
              `╭─❯ ${index + 1}. ${item.itemName}\n` +
              `├ 𝐿𝑖𝑘𝑒𝑠: ${item.likes}\n` +
              `╰ 𝑉𝑖𝑒𝑤𝑠: ${item.views}\n`
            )
          ).join("\n");

          return sendBeautifulMessage(formatText(`\n${trendingList}`));
        }

        case "stats": {
          const { data: stats } = await axios.get(`${GoatMart}/api/stats`);
          const { hosting, totalCommands, totalLikes, dailyActiveUsers, popularTags, topAuthors, topViewed } = stats;

          const uptimeStr = `${hosting?.uptime?.years}y ${hosting?.uptime?.months}m ${hosting?.uptime?.days}d ${hosting?.uptime?.hours}h ${hosting?.uptime?.minutes}m ${hosting?.uptime?.seconds}s`;

          const tagList = popularTags.map((tag, i) =>
            formatText(`#${i + 1}. ${tag._id || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛'} (${tag.count})`)
          ).join('\n');

          const authorList = topAuthors.map((a, i) =>
            formatText(`#${i + 1}. ${a._id || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛'} (${a.count})`)
          ).join('\n');

          const viewedList = topViewed.map((v, i) =>
            formatText(`#${i + 1}. ${v.itemName} (𝐼𝐷: ${v.itemID})\n𝑉𝑖𝑒𝑤𝑠: ${v.views}`)
          ).join('\n\n');

          return sendBeautifulMessage(
            formatText(
              `\n╭─❯ 𝑇𝑜𝑡𝑎𝑙 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠\n╰ ${totalCommands}\n\n` +
              `╭─❯ 𝑇𝑜𝑡𝑎𝑙 𝐿𝑖𝑘𝑒𝑠\n╰ ${totalLikes}\n\n` +
              `╭─❯ 𝐷𝑎𝑖𝑙𝑦 𝑈𝑠𝑒𝑟𝑠\n╰ ${dailyActiveUsers}\n\n` +
              `𝑇𝑜𝑝 𝐴𝑢𝑡ℎ𝑜𝑟𝑠:\n${authorList}\n\n` +
              `𝑇𝑜𝑝 𝑉𝑖𝑒𝑤𝑒𝑑:\n${viewedList}\n\n` +
              `𝑃𝑜𝑝𝑢𝑙𝑎𝑟 𝑇𝑎𝑔𝑠:\n${tagList}\n\n` +
              `𝐻𝑜𝑠𝑡𝑖𝑛𝑔 𝐼𝑛𝑓𝑜:\n\n` +
              `╭─❯ 𝑈𝑝𝑡𝑖𝑚𝑒\n╰ ${uptimeStr}\n\n` +
              `╭─❯ 𝑆𝑦𝑠𝑡𝑒𝑚\n` +
              `├ ${hosting.system.platform} (${hosting.system.arch})\n` +
              `├ 𝑁𝑜𝑑𝑒 ${hosting.system.nodeVersion}\n` +
              `├ 𝑃𝐼𝐷: ${hosting.system.pid}\n` +
              `╰ 𝐶𝑃𝑈 𝐶𝑜𝑟𝑒𝑠: ${hosting.system.cpuCores}`
            )
          );
        }

        case "like": {
          const likeItemId = parseInt(args[1]);
          if (isNaN(likeItemId)) return sendBeautifulMessage(formatText("\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑡𝑒𝑚 𝐼𝐷."));

          const { data } = await axios.post(`${GoatMart}/api/items/${likeItemId}/like`);
          if (data.success) {
            return sendBeautifulMessage(
              formatText(
                `\n╭─❯ 𝑆𝑡𝑎𝑡𝑢𝑠\n╰ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑙𝑖𝑘𝑒𝑑!\n\n╭─❯ 𝑇𝑜𝑡𝑎𝑙 𝐿𝑖𝑘𝑒𝑠\n╰ ${data.likes}`
              )
            );
          } else {
            return sendBeautifulMessage(formatText("\n𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑖𝑘𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑."));
          }
        }

        case "upload": {
          const commandName = args[1];
          if (!commandName) return sendBeautifulMessage(formatText("\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑎𝑚𝑒."));

          const commandPath = path.join(process.cwd(), 'scripts', 'cmds', `${commandName}.js`);
          if (!fs.existsSync(commandPath)) return sendBeautifulMessage(formatText(`\n𝐹𝑖𝑙𝑒 '${commandName}.𝑗𝑠' 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.`));

          try {
            const code = fs.readFileSync(commandPath, 'utf8');
            let commandFile;
            try {
              commandFile = require(commandPath);
            } catch (err) {
              return sendBeautifulMessage(formatText("\n𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒 𝑓𝑜𝑟𝑚𝑎𝑡."));
            }

            const uploadData = {
              itemName: commandFile.config?.name || commandName,
              description: commandFile.config?.longDescription?.en || commandFile.config?.shortDescription?.en || "𝑁𝑜 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛",
              type: "𝐺𝑜𝑎𝑡𝐵𝑜𝑡",
              code,
              authorName: commandFile.config?.author || event.senderID || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"
            };

            const response = await axios.post(`${GoatMart}/v1/paste`, uploadData);

            if (response.data.success) {
              const { item, itemID, link } = response.data;
              return sendBeautifulMessage(
                formatText(
                  "\n" +
                  `╭─❯ 𝑆𝑡𝑎𝑡𝑢𝑠\n╰ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑢𝑝𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n` +
                  `╭─❯ 𝑁𝑎𝑚𝑒\n╰ ${uploadData.itemName}\n\n` +
                  `╭─❯ 𝐼𝐷\n╰ ${itemID}\n\n` +
                  `╭─❯ 𝐴𝑢𝑡ℎ𝑜𝑟\n╰ ${uploadData.authorName}\n\n` +
                  `╭─❯ 𝑃𝑟𝑒𝑣𝑖𝑒𝑤 𝑈𝑟𝑙\n╰ ${GoatMart}/view.html?id=${itemID}\n\n` +
                  `╭─❯ 𝑅𝑎𝑤 𝑈𝑟𝑙\n╰ ${link}`
                )
              );
            }

            return sendBeautifulMessage(formatText("\n𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑢𝑝𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑."));
          } catch (error) {
            console.error("Upload error:", error);
            return sendBeautifulMessage(formatText("\n𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑎𝑑 𝑜𝑟 𝑢𝑝𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒."));
          }
        }

        default:
          return sendBeautifulMessage(formatText("\n𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑢𝑏𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑈𝑠𝑒 'ℎ𝑒𝑙𝑝 𝑐𝑚𝑑𝑚𝑎𝑟𝑘𝑒𝑡' 𝑓𝑜𝑟 𝑜𝑝𝑡𝑖𝑜𝑛𝑠."));
      }

    } catch (err) {
      console.error("CmdMarket Error:", err);
      return sendBeautifulMessage(formatText("\n𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑."));
    }
  }
};
