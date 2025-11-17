module.exports = {
  config: {
    name: "war",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 2,
    category: "group",
    shortDescription: {
      en: "⚔️ War simulation in group chat"
    },
    longDescription: {
      en: "⚔️ War simulation with timed messages in group chat"
    },
    guide: {
      en: "{p}war @mention"
    },
    dependencies: {
      "fs-extra": "",
      "axios": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!api || !event) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing.", event.threadID);
      }

      const { threadID, mentions } = event;

      // guard: require at least one mention to avoid runtime errors
      if (!mentions || Object.keys(mentions).length === 0) {
        return api.sendMessage("⚠️ | Please tag someone to start the war.", threadID);
      }

      const mentionId = Object.keys(mentions)[0];
      const name = mentions[mentionId];

      // helper to send message
      const send = (message) => api.sendMessage(message, threadID);

      // original sequence preserved (timings and messages kept exactly)
      send("Listen to your father, kids !");
      setTimeout(() => { send({ body: "F*ck your mother" }); }, 3000);
      setTimeout(() => { send({ body: "You little brats come out to listen to your father curse" }); }, 5000);
      setTimeout(() => { send({ body: "Quick show the dogs" }); }, 7000);
      setTimeout(() => { send({ body: "Show your father's soul" }); }, 9000);
      setTimeout(() => { send({ body: "Do you guys like war so much?" }); }, 12000);
      setTimeout(() => { send({ body: "Damn you guys too" }); }, 15000);
      setTimeout(() => { send({ body: "Give your father the age of war" }); }, 17000);
      setTimeout(() => { send({ body: "Hurry up and curse each other with me" }); }, 20000);
      setTimeout(() => { send({ body: "Are the bad boys wrinkling their noses up to wage war on your father?" }); }, 23000);
      setTimeout(() => { send({ body: "I fuck your mother" }); }, 25000);
      setTimeout(() => { send({ body: "Delicious then yawn your mother up" }); }, 28500);
      setTimeout(() => { send({ body: "Your father shot you to death by rapping" }); }, 31000);
      setTimeout(() => { send({ body: "Please age eat me ?" }); }, 36000);
      setTimeout(() => { send({ body: "If it's delicious, eat your dad" }); }, 39000);
      setTimeout(() => { send({ body: "Before that, please give me a break for 1 minute" }); }, 40000);
      setTimeout(() => { send({ body: "Please allow me to start" }); }, 65000);
      setTimeout(() => { send({ body: "First of all, I would like to fuck you from top to bottom" }); }, 70000);
      setTimeout(() => { send({ body: "I fuck from cunt hole to pussy cleavage" }); }, 75000);
      setTimeout(() => { send({ body: "The cunt is as big as a buffalo's cunt masturbating a sewer pipe" }); }, 80000);
      setTimeout(() => { send({ body: "I'm sure 2 guys like me aren't enough to fill your ass hole" }); }, 85000);
      setTimeout(() => { send("I'm tired and don't curse anymore"); }, 90000);
      setTimeout(() => { send({ body: "Come on boss update the lyric, let's continue the war" }); }, 95000);
      setTimeout(() => { send({ body: "Thank you for listening to me war" }); }, 100000);
      setTimeout(() => { send({ body: "Goodbye and see you in the next program" }); }, 105000);
      setTimeout(() => { send({ body: "Good bye 🥺" }); }, 115000);

    } catch (err) {
      console.error("War Command Error:", err);
      try { 
        api.sendMessage("❌ | An error occurred while running the war command.", event.threadID); 
      } catch (e) {}
    }
  }
};
