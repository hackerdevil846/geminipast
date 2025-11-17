const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "wolfram",
    version: "1.0.1",
    role: 0,
    author: "Asif Mahmud",
    category: "utility",
    shortDescription: {
      en: "Advanced calculator with Wolfram Alpha"
    },
    longDescription: {
      en: "Perform complex mathematical calculations using Wolfram Alpha API including integrals, graphs, and vector operations"
    },
    guide: {
      en: "wolfram [equation] or wolfram -p [integral] or wolfram -g [graph equation] or wolfram -v [vector]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    },
    envConfig: {
      "WOLFRAM": "T8J8YV-H265UQ762K"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const { threadID, messageID } = event;
      const out = (msg) => api.sendMessage(msg, threadID, messageID);
      const key = this.config.envConfig.WOLFRAM;
      let content = (event.type == 'message_reply') ? event.messageReply.body : args.join(" ");
      
      if (!content) return out("Please enter a mathematical expression");

      if (content.indexOf("-p") === 0) {
        try {
          content = "primitive " + content.slice(3, content.length);
          const { data } = await axios.get(`http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`);
          
          if (content.includes("from") && content.includes("to")) {
            const value = data.queryresult.pods.find(e => e.id == "Input").subpods[0].plaintext;
            if (value.includes("≈")) {
              const a = value.split("≈"), b = a[0].split(" = ")[1], c = a[1];
              return out(`Fractional: ${b}\nDecimal: ${c}`);
            }
            else return out(value.split(" = ")[1]);
          }
          else {
            return out((data.queryresult.pods.find(e => e.id == "IndefiniteIntegral").subpods[0].plaintext.split(" = ")[1]).replace("+ constant", ""));
          }
        }
        catch (e) {
          out(`Error: ${e.message}`);
        }
      }
      else if (content.indexOf("-g") === 0) {
        try {
          content = "plot " + content.slice(3, content.length);
          const { data } = await axios.get(`http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`);
          const src = (data.queryresult.pods.some(e => e.id == "Plot")) ? 
            data.queryresult.pods.find(e => e.id == "Plot").subpods[0].img.src : 
            data.queryresult.pods.find(e => e.id == "ImplicitPlot").subpods[0].img.src;
          
          const img = (await axios.get(src, { responseType: 'stream' })).data;
          img.pipe(fs.createWriteStream("./graph.png")).on("close", () => 
            api.sendMessage({ attachment: fs.createReadStream("./graph.png") }, threadID, () => 
              fs.unlinkSync("./graph.png"), messageID));
        }
        catch (e) {
          out(`Error: ${e.message}`);
        }
      }
      else if (content.indexOf("-v") === 0) {
        try {
          content = "vector " + content.slice(3, content.length).replace(/\(/g, "<").replace(/\)/g, ">");
          const { data } = await axios.get(`http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`);
          const src = data.queryresult.pods.find(e => e.id == "VectorPlot").subpods[0].img.src;
          const vector_length = data.queryresult.pods.find(e => e.id == "VectorLength").subpods[0].plaintext;
          let result = "";
          
          if (data.queryresult.pods.some(e => e.id == "Result")) {
            result = data.queryresult.pods.find(e => e.id == "Result").subpods[0].plaintext;
          }
          
          const img = (await axios.get(src, { responseType: 'stream' })).data;
          img.pipe(fs.createWriteStream("./graph.png")).on("close", () => 
            api.sendMessage({ 
              body: result ? `${result}\nVector Length: ${vector_length}` : `Vector Length: ${vector_length}`, 
              attachment: fs.createReadStream("./graph.png") 
            }, threadID, () => fs.unlinkSync("./graph.png"), messageID));
        }
        catch (e) {
          out(`Error: ${e.message}`);
        }
      }
      else {
        try {
          const { data } = await axios.get(`http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`);
          const text = [];
          
          if (data.queryresult.pods.some(e => e.id == "Solution")) {
            const value = data.queryresult.pods.find(e => e.id == "Solution");
            for (let e of value.subpods) text.push(e.plaintext);
            return out(text.join("\n"));
          }
          else if (data.queryresult.pods.some(e => e.id == "ComplexSolution")) {
            const value = data.queryresult.pods.find(e => e.id == "ComplexSolution");
            for (let e of value.subpods) text.push(e.plaintext);
            return out(text.join("\n"));
          }
          else if (data.queryresult.pods.some(e => e.id == "Result")) {
            return out(data.queryresult.pods.find(e => e.id == "Result").subpods[0].plaintext);
          }
          else {
            return out("No result found for the given expression");
          }
        }
        catch (e) {
          out(`Error: ${e.message}`);
        }
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while processing your request", event.threadID, event.messageID);
    }
  }
};
