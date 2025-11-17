const axios = require("axios");

module.exports = {
  config: {
    name: "quiz",
    aliases: ["question"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🇧🇩 𝑸𝒖𝒊𝒛 𝒌𝒉𝒆𝒍𝒂𝒓 𝒋𝒐𝒏𝒏𝒐"
    },
    longDescription: {
      en: "🇧🇩 𝑸𝒖𝒊𝒛 𝒌𝒉𝒆𝒍𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 (𝑬𝒏𝒈𝒍𝒊𝒔𝒉) - 𝑻𝒓𝒖𝒆/𝑭𝒂𝒍𝒔𝒆 𝒒𝒖𝒆𝒔𝒕𝒊𝒐𝒏𝒔"
    },
    guide: {
      en: "{p}quiz [easy/medium/hard]"
    },
    dependencies: {
      "axios": ""
    }
  },

  handleReaction: function({ api, event, handleReaction }) {
    if (event.userID !== handleReaction.author) return; // Only the quiz author can react

    let response = "";
    if (event.reaction === "👍") response = "True";
    else if (event.reaction === "😢") response = "False";

    if (response === handleReaction.answer) {
      api.sendMessage("𝑨𝒃𝒂𝒓, 𝒕𝒖𝒎𝒊 𝒕𝒉𝒊𝒌 𝒖𝒕𝒕𝒐𝒓 𝒅𝒊𝒍𝒆! 😄", event.threadID);
    } else {
      api.sendMessage("𝑯𝒂𝒚 𝒓𝒆, 𝒕𝒖𝒎𝒊 𝒗𝒖𝒍 𝒖𝒕𝒕𝒐𝒓 𝒅𝒊𝒍𝒆 😢", event.threadID);
    }

    // Remove the reaction handler
    const indexOfHandle = global.client.handleReaction.findIndex(e => e.messageID === handleReaction.messageID);
    if (indexOfHandle !== -1) {
      global.client.handleReaction.splice(indexOfHandle, 1);
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!axios) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install axios.", event.threadID, event.messageID);
      }

      let difficulties = ["easy", "medium", "hard"];
      let difficulty = args[0];
      if (!difficulties.includes(difficulty)) {
        difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      }

      let quizData = await fetchOpenTDBQuestion(difficulty);
      if (!quizData) {
        quizData = await fetchTheTriviaAPIQuestion(difficulty);
      }

      if (!quizData) {
        return api.sendMessage("𝑺𝒆𝒓𝒗𝒆𝒓 𝒃𝒖𝒔𝒚 𝒕𝒉𝒂𝒌𝒂𝒓 𝒑𝒓𝒐𝒔𝒏𝒐 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂 😔", event.threadID, event.messageID);
      }

      const question = quizData.question;
      const correctAnswer = quizData.correctAnswer;

      const message = `𝑻𝒐𝒎𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒑𝒓𝒐𝒔𝒏𝒐:\n━━━━━━━━━━━━\n「 ${question} 」\n━━━━━━━━━━━━\n\n👍: 𝑻𝒉𝒊𝒌\t\t😢: 𝑽𝒖𝒍\n\n𝑫𝒊𝒇𝒇𝒊𝒄𝒖𝒍𝒕𝒚: ${difficulty.toUpperCase()}`;

      return api.sendMessage(message, event.threadID, async (err, info) => {
        if (!global.client.handleReaction) {
          global.client.handleReaction = [];
        }
        
        global.client.handleReaction.push({
          name: "quiz",
          messageID: info.messageID,
          author: event.senderID,
          answer: correctAnswer
        });

        await new Promise(resolve => setTimeout(resolve, 20000)); // Wait 20 seconds for reactions

        const indexOfHandle = global.client.handleReaction.findIndex(e => e.messageID === info.messageID);
        if (indexOfHandle !== -1) {
          const banglaAnswer = correctAnswer === "True" ? "𝑻𝒉𝒊𝒌" : "𝑽𝒖𝒍";
          api.sendMessage(`𝑺𝒐𝒎𝒐𝒚 𝒔𝒆𝒔𝒉! 𝑻𝒉𝒊𝒌 𝒖𝒕𝒕𝒐𝒓 𝒉𝒐𝒍𝒐: ${banglaAnswer}`, event.threadID, info.messageID);
          global.client.handleReaction.splice(indexOfHandle, 1);
        }
      });

    } catch (error) {
      console.error("Quiz Command Error:", error);
      api.sendMessage("❌ | Error in quiz command. Please try again later.", event.threadID, event.messageID);
    }
  }
};

async function fetchOpenTDBQuestion(difficulty) {
  try {
    let fetch = await axios.get(`https://opentdb.com/api.php?amount=1&encode=url3986&type=boolean&difficulty=${difficulty}`);
    if (fetch.data && fetch.data.results && fetch.data.results.length > 0) {
      return {
        question: decodeURIComponent(fetch.data.results[0].question),
        correctAnswer: fetch.data.results[0].correct_answer
      };
    }
  } catch (error) {
    console.error("Error fetching from OpenTDB:", error);
  }
  return null;
}

async function fetchTheTriviaAPIQuestion(difficulty) {
  try {
    let fetch = await axios.get(`https://the-trivia-api.com/api/questions?limit=1&difficulty=${difficulty}&type=boolean`);
    if (fetch.data && fetch.data.length > 0) {
      return {
        question: fetch.data[0].question.text,
        correctAnswer: String(fetch.data[0].correctAnswer) // Convert boolean to string 'True' or 'False'
      };
    }
  } catch (error) {
    console.error("Error fetching from The Trivia API:", error);
  }
  return null;
}
