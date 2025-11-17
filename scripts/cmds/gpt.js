const axios = require('axios');

if (!global.temp) global.temp = {};
if (!global.temp.openAIUsing) global.temp.openAIUsing = {};
if (!global.temp.openAIHistory) global.temp.openAIHistory = {};

const { openAIUsing, openAIHistory } = global.temp;

module.exports = {
  config: {
    name: "gpt",
    aliases: [],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "ai",
    shortDescription: {
      en: "🤖 𝐴𝐼 𝑎𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐴𝐼 𝑎𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡 𝑤𝑖𝑡ℎ 𝑡𝑒𝑥𝑡 𝑎𝑛𝑑 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑝𝑎𝑏𝑖𝑙𝑖𝑡𝑖𝑒𝑠"
    },
    guide: {
      en: "{p}gpt [𝑝𝑟𝑜𝑚𝑝𝑡] 𝑜𝑟 {p}gpt 𝑑𝑟𝑎𝑤 [𝑝𝑟𝑜𝑚𝑝𝑡] 𝑜𝑟 {p}gpt 𝑐𝑙𝑒𝑎𝑟"
    }
  },

  langs: {
    en: {
      invalidContentDraw: "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛 𝑓𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛.",
      yourAreUsing: "⏳ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑎𝑛 𝑜𝑛𝑔𝑜𝑖𝑛𝑔 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡.",
      processingRequest: "⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒...",
      invalidContent: "💬 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒.",
      error: "❌ 𝐸𝑟𝑟𝑜𝑟: %1",
      clearHistory: "✅ 𝐶𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛 ℎ𝑖𝑠𝑡𝑜𝑟𝑦 𝑐𝑙𝑒𝑎𝑟𝑒𝑑.",
      noApiKey: "ℹ️ 𝑈𝑠𝑖𝑛𝑔 𝑓𝑟𝑒𝑒 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠.",
      attribution: "📸 𝐼𝑚𝑎𝑔𝑒 𝑓𝑟𝑜𝑚 𝑈𝑛𝑠𝑝𝑙𝑎𝑠ℎ",
      imageError: "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
      apiError: "❌ 𝐴𝐼 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑖𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
    }
  },

  onStart: async function ({ api, event, args, message, getText }) {
    const maxStorageMessage = 4;
    const unsplashAccessKey = "H1P1t9KPzHUPWQIQ-RxHg6e8kaKdLAhYR0LRsy5Sp-tk";

    try {
      const { threadID, messageID, senderID } = event;

      if (!args[0]) {
        return message.reply(getText('invalidContent'));
      }

      switch (args[0].toLowerCase()) {
        case 'img':
        case 'image':
        case 'draw': {
          if (!args[1]) return message.reply(getText('invalidContentDraw'));
          if (openAIUsing[senderID]) return message.reply(getText("yourAreUsing"));

          openAIUsing[senderID] = true;

          try {
            const processingMsg = await message.reply(getText('processingRequest'));
            const images = await this.generateFreeImage(args.slice(1).join(' '), unsplashAccessKey);

            if (!images || images.length === 0) {
              throw new Error(getText('imageError'));
            }

            await message.reply({
              body: "🎨 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑖𝑚𝑎𝑔𝑒:\n" + getText('attribution'),
              attachment: images
            });

            if (processingMsg && processingMsg.messageID) {
              await api.unsendMessage(processingMsg.messageID);
            }
          } catch (err) {
            console.error("Image generation error:", err);
            await message.reply(getText('error', err.message || getText('imageError')));
          } finally {
            delete openAIUsing[senderID];
          }
          break;
        }

        case 'clear': {
          openAIHistory[senderID] = [];
          await message.reply(getText('clearHistory'));
          break;
        }

        default: {
          if (openAIUsing[senderID]) return message.reply(getText("yourAreUsing"));

          await message.reply(getText('noApiKey'));
          openAIUsing[senderID] = true;

          try {
            if (!openAIHistory[senderID]) {
              openAIHistory[senderID] = [];
            }

            if (openAIHistory[senderID].length >= maxStorageMessage) {
              openAIHistory[senderID].shift();
            }

            const prompt = args.join(' ');
            const response = await this.askGpt(prompt);
            
            if (!response || !response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
              throw new Error(getText('apiError'));
            }

            const text = response.data.choices[0].message.content;

            if (!text || text.trim() === '') {
              throw new Error(getText('apiError'));
            }

            openAIHistory[senderID].push({
              role: 'user',
              content: prompt
            });

            openAIHistory[senderID].push({
              role: 'assistant',
              content: text
            });

            await message.reply(text, (err, info) => {
              if (!err && info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                  commandName: this.config.name,
                  author: event.senderID,
                  messageID: info.messageID
                });
              }
            });
          } catch (err) {
            console.error("GPT chat error:", err);
            await message.reply(getText('error', err.message || getText('apiError')));
          } finally {
            delete openAIUsing[senderID];
          }
        }
      }
    } catch (error) {
      console.error("GPT Main Error:", error);
      await message.reply(getText('error', error.message || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟"));
    }
  },

  onReply: async function ({ Reply, message, event, args, getLang }) {
    const { author, messageID } = Reply;
    if (author != event.senderID) return;

    const maxStorageMessage = 4;
    
    if (openAIUsing[event.senderID]) 
      return message.reply(getLang("yourAreUsing"));

    openAIUsing[event.senderID] = true;

    try {
      if (!openAIHistory[event.senderID]) {
        openAIHistory[event.senderID] = [];
      }

      if (openAIHistory[event.senderID].length >= maxStorageMessage) {
        openAIHistory[event.senderID].shift();
      }

      openAIHistory[event.senderID].push({
        role: 'user',
        content: args.join(' ')
      });

      const response = await this.askGpt(args.join(' '));
      
      if (!response || !response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
        throw new Error(getLang('apiError'));
      }

      const text = response.data.choices[0].message.content;

      if (!text || text.trim() === '') {
        throw new Error(getLang('apiError'));
      }

      openAIHistory[event.senderID].push({
        role: 'assistant',
        content: text
      });

      await message.reply(text, (err, info) => {
        if (!err && info && info.messageID) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: event.senderID,
            messageID: info.messageID
          });
        }
      });
    } catch (err) {
      console.error("GPT Reply Error:", err);
      await message.reply(getLang('error', err.message || getLang('apiError')));
    } finally {
      delete openAIUsing[event.senderID];
    }
  },

  askGpt: async function (prompt) {
    try {
      const response = await axios.get(`https://gemini-api.replit.app/gemini?prompt=${encodeURIComponent(prompt)}`, {
        timeout: 30000
      });
      
      if (response.data && response.data.answer) {
        return { 
          data: { 
            choices: [{ 
              message: { 
                content: response.data.answer 
              } 
            }] 
          } 
        };
      }
      throw new Error("Invalid response from Gemini API");
    } catch (error) {
      console.error("Gemini API error:", error);
      try {
        const response = await axios.get(`https://api.kenaisq.rocks/api/gpt4?q=${encodeURIComponent(prompt)}`, {
          timeout: 30000
        });
        
        if (response.data && response.data.response) {
          return { 
            data: { 
              choices: [{ 
                message: { 
                  content: response.data.response 
                } 
              }] 
            } 
          };
        }
        throw new Error("Invalid response from GPT4 API");
      } catch (error2) {
        console.error("GPT4 API error:", error2);
        throw new Error("𝑆𝑒𝑟𝑣𝑖𝑐𝑒𝑠 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒");
      }
    }
  },

  generateFreeImage: async function (prompt, unsplashAccessKey) {
    try {
      const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
        responseType: 'stream',
        timeout: 30000
      });
      
      if (response.status === 200) {
        response.data.path = `${Date.now()}.png`;
        return [response.data];
      }
      throw new Error("Pollinations API failed");
    } catch (error) {
      console.error("Pollinations API error:", error);
      try {
        const unsplashResponse = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=1&client_id=${unsplashAccessKey}`, {
          timeout: 30000
        });
        
        if (unsplashResponse.data.results && unsplashResponse.data.results.length > 0) {
          const imageUrl = unsplashResponse.data.results[0].urls.regular;
          const image = await axios.get(imageUrl, { 
            responseType: 'stream',
            timeout: 30000
          });
          image.data.path = `${Date.now()}.jpg`;
          return [image.data];
        } else {
          throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑");
        }
      } catch (unsplashError) {
        console.error("Unsplash API error:", unsplashError);
        throw new Error("𝐼𝑚𝑎𝑔𝑒 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒");
      }
    }
  }
};
