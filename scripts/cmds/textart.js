const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Create cache directory if it doesn't exist
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

module.exports = {
    config: {
        name: "textart",
        aliases: ["textdesign", "textpro"],
        version: "1.1",
        author: "Asif Mahmud", // Recommended standard font
        countDown: 10,
        role: 0,
        shortDescription: "Create text art designs",
        longDescription: "Generate various text art designs using multiple APIs",
        category: "logo", // Recommended standard font
        guide: "{pn} list [page] or {pn} [style] [text]"
    },

    onStart: async function ({ api, event, args }) {
        let { messageID, threadID } = event; // Removed senderID as it's not used

        // Handle list command
        if (args.length >= 1 && args[0].toLowerCase() === "list") {
            let page = parseInt(args[1]) || 1;
            return this.handleList(api, threadID, messageID, page);
        }

        // Validate command format
        if (args.length < 2) {
            return api.sendMessage(
                `╔════ஜ۩۞۩ஜ════╗\n\nInvalid command format! Use:\n• textart list [page]\n• textart [style] [text]\n\n╚════ஜ۩۞۩ஜ════╝`, // Standard font
                threadID,
                messageID
            );
        }

        let type = args[0].toLowerCase();
        let text = args.slice(1).join(" ");
        
        // Validate text length
        if (text.length > 50) {
            return api.sendMessage(
                `╔════ஜ۩۞۩ஜ════╗\n\nText is too long! Maximum 50 characters allowed.\n\n╚════ஜ۩۞۩ஜ════╝`, // Standard font
                threadID,
                messageID
            );
        }

        try {
            api.sendMessage("Generating your text art, please wait...", threadID, messageID); // Added a loading message
            await this.generateTextArt(api, event, type, text);
        } catch (error) {
            console.error('TextArt Error:', error);
            let errorMessage = "An error occurred while generating the text art. Please try again later.";
            if (error.message.includes("timeout")) {
                errorMessage = "The text art API timed out. Please try again or choose a different style.";
            } else if (error.message.includes("404") || error.message.includes("400")) {
                errorMessage = "There was an issue with the text art API or the style. Please check your style name and try again.";
            }
            return api.sendMessage(
                `╔════ஜ۩۞۩ஜ════╗\n\n${errorMessage}\n\n╚════ஜ۩۞۩ஜ════╝`, // Standard font
                threadID,
                messageID
            );
        }
    },

    handleList: function (api, threadID, messageID, page) {
        const lists = {
            1: `╔════ஜ۩۞۩ஜ════╗\n\nTEXT ART LIST - PAGE 1:\n\n❍ aglitch ❍ business ❍ blood\n❍ blackpink ❍ broken ❍ christmas\n❍ captainamerica ❍ carbon ❍ circuit\n❍ choror ❍ christmas ❍ discovery\n❍ devil ❍ dropwater ❍ fiction\n❍ fire ❍ glass ❍ greenhorror\n❍ imglitch ❍ layered ❍ light\n❍ magma ❍ metallic ❍ neon\n❍ skeleton ❍ sketch ❍ stone\n❍ love ❍ transformers ❍ wall\n\nPAGE 1/3\n\n╚════ஜ۩۞۩ஜ════╝`, // Standard font

            2: `╔════ஜ۩۞۩ஜ════╗\n\nTEXT ART LIST - PAGE 2:\n\n❍ naruto ❍ dragonfireavater\n❍ pubgavater ❍ nightstars ❍ sunlight\n❍ cloud ❍ pig ❍ caper\n❍ writestatus ❍ horror ❍ teamlogo\n❍ queen ❍ beach ❍ fbc3\n❍ tatto ❍ shirt3 ❍ oceansea\n❍ shirt4 ❍ shirt5 ❍ shirt6\n❍ lovemsg ❍ chstm ❍ christmas2\n❍ icetext ❍ butterfly ❍ coffe\n\nPAGE 2/3\n\n╚════ஜ۩۞۩ஜ════╝`, // Corrected "oceasea" to "oceansea", standard font

            3: `╔════ஜ۩۞۩ஜ════╗\n\nTEXT ART LIST - PAGE 3:\n\n❍ smoke\n\nPAGE 3/3\n\n╚════ஜ۩۞۩ஜ════╝` // Standard font
        };

        if (lists[page]) {
            return api.sendMessage(lists[page], threadID, messageID);
        } else {
            return api.sendMessage(
                `╔════ஜ۩۞۩ஜ════╗\n\nInvalid page number! Please use "list 1", "list 2" or "list 3".\n\n╚════ஜ۩۞۩ஜ════╝`, // Standard font
                threadID,
                messageID
            );
        }
    },

    generateTextArt: async function (api, event, type, text) {
        const { threadID, messageID } = event;
        
        const styleConfigs = {
            "glass": {
                apiUrl: `https://rest-api-001.faheem001.repl.co/api/textpro?number=4&text=${encodeURIComponent(text)}`,
                message: "Here's the GLASS text art:" // Standard font
            },
            "business": {
                apiUrl: `https://rest-api-001.faheem001.repl.co/api/textpro?number=5&text=${encodeURIComponent(text)}`,
                message: "Here's the BUSINESS text art:" // Standard font
            },
            "wall": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/embossed?text=${encodeURIComponent(text)}`,
                message: "Here's the WALL text art:" // Standard font
            },
            "aglitch": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/aglitch?text=${encodeURIComponent(text)}&text2=${encodeURIComponent(text)}`,
                message: "Here's the AGLITCH text art:" // Standard font
            },
            "berry": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/berry?text=${encodeURIComponent(text)}`,
                message: "Here's the BERRY text art:" // Standard font
            },
            "blackpink": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/blackpink?text=${encodeURIComponent(text)}`,
                message: "Here's the BLACKPINK text art:" // Standard font
            },
            "blood": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/blood?text=${encodeURIComponent(text)}`,
                message: "Here's the BLOOD text art:" // Standard font
            },
            "broken": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/broken?text=${encodeURIComponent(text)}`,
                message: "Here's the BROKEN text art:" // Standard font
            },
            "smoke": {
                apiUrl: `https://api.lolhuman.xyz/api/photooxy1/smoke?apikey=0a637f457396bf3dcc21243b&text=${encodeURIComponent(text)}`,
                message: "Here's the SMOKE text art:" // Standard font
            },
            "captainamerica": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/captainamerica?text=${encodeURIComponent(text)}&text2=${encodeURIComponent(text)}`,
                message: "Here's the CAPTAINAMERICA text art:" // Standard font
            },
            "carbon": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/carbon?text=${encodeURIComponent(text)}`,
                message: "Here's the CARBON text art:" // Standard font
            },
            "choror": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/choror?text=${encodeURIComponent(text)}&text2=${encodeURIComponent(text)}`,
                message: "Here's the CHOROR text art:" // Standard font
            },
            "christmas": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/christmas?text=${encodeURIComponent(text)}`,
                message: "Here's the CHRISTMAS text art:" // Standard font
            },
            "circuit": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/circuit?text=${encodeURIComponent(text)}`,
                message: "Here's the CIRCUIT text art:" // Standard font
            },
            "devil": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/devil?text=${encodeURIComponent(text)}`,
                message: "Here's the DEVIL text art:" // Standard font
            },
            "discovery": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/discovery?text=${encodeURIComponent(text)}`,
                message: "Here's the DISCOVERY text art:" // Standard font
            },
            "dropwater": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/dropwater?text=${encodeURIComponent(text)}`,
                message: "Here's the DROPWATER text art:" // Standard font
            },
            "fiction": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/fiction?text=${encodeURIComponent(text)}`,
                message: "Here's the FICTION text art:" // Standard font
            },
            "fire": {
                apiUrl: `https://chards-bot-api.richardretadao1.repl.co/api/photooxy/flaming?text=${encodeURIComponent(text)}`,
                message: "Here's the FIRE text art:" // Standard font
            },
            "galaxy": {
                apiUrl: `https://rest-api-001.faheem001.repl.co/api/textpro?number=173&text=${encodeURIComponent(text)}`,
                message: "Here's the GALAXY text art:" // Standard font
            },
            "greenhorror": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/greenhorror?text=${encodeURIComponent(text)}`,
                message: "Here's the GREENHORROR text art:" // Standard font
            },
            "imglitch": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/imglitch?text=${encodeURIComponent(text)}`,
                message: "Here's the IMGLITCH text art:" // Standard font
            },
            "layered": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/layered?text=${encodeURIComponent(text)}&text2=${encodeURIComponent(text)}`,
                message: "Here's the LAYERED text art:" // Standard font
            },
            "light": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/light?text=${encodeURIComponent(text)}`,
                message: "Here's the LIGHT text art:" // Standard font
            },
            "magma": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/magma?text=${encodeURIComponent(text)}`,
                message: "Here's the MAGMA text art:" // Standard font
            },
            "metallic": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/metallic?text=${encodeURIComponent(text)}`,
                message: "Here's the METALLIC text art:" // Standard font
            },
            "neon": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/neon?text=${encodeURIComponent(text)}`,
                message: "Here's the NEON text art:" // Standard font
            },
            "skeleton": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/skeleton?text=${encodeURIComponent(text)}`,
                message: "Here's the SKELETON text art:" // Standard font
            },
            "sketch": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/sketch?text=${encodeURIComponent(text)}`,
                message: "Here's the SKETCH text art:" // Standard font
            },
            "stone": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/stone?text=${encodeURIComponent(text)}`,
                message: "Here's the STONE text art:" // Standard font
            },
            "transformer": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/textpro/transformer?text=${encodeURIComponent(text)}`,
                message: "Here's the TRANSFORMER text art:" // Standard font
            },
            "love": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/lovetext?text=${encodeURIComponent(text)}`,
                message: "Here's the LOVE text art:" // Standard font
            },
            "naruto": {
                apiUrl: `https://rest-api-2.faheem007.repl.co/api/photooxy/naruto?text=${encodeURIComponent(text)}`,
                message: "Here's the NARUTO text art:" // Standard font
            },
            "dragonfireavater": { // Assuming this is correct from list, but "avatar" is the usual spelling
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/dragonfire?text=${encodeURIComponent(text)}`,
                message: "Here's the DRAGONFIRE AVATAR text art:" // Standard font
            },
            "pubgavater": { // Assuming this is correct from list, but "avatar" is the usual spelling
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/pubgavatar?text=${encodeURIComponent(text)}`,
                message: "Here's the PUBG AVATAR text art:" // Standard font
            },
            "nightstars": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/nightstars?text=${encodeURIComponent(text)}`,
                message: "Here's the NIGHT STARS text art:" // Standard font
            },
            "sunlight": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/sunlight?text=${encodeURIComponent(text)}`,
                message: "Here's the SUNLIGHT text art:" // Standard font
            },
            "cloud": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/cloud?text=${encodeURIComponent(text)}`,
                message: "Here's the CLOUD text art:" // Standard font
            },
            "pig": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/pig?text=${encodeURIComponent(text)}`,
                message: "Here's the PIG text art:" // Standard font
            },
            "caper": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/caper?text=${encodeURIComponent(text)}`,
                message: "Here's the CAPER text art:" // Standard font
            },
            "writestatus": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/writestatus?text=${encodeURIComponent(text)}&text2=${encodeURIComponent("Your Quotes In Herm")}`,
                message: "Here's the WRITESTATUS text art:" // Standard font
            },
            "horror": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/horror?text=${encodeURIComponent(text)}`,
                message: "Here's the HORROR text art:" // Standard font
            },
            "teamlogo": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/teamlogo?text=${encodeURIComponent(text)}`,
                message: "Here's the TEAMLOGO text art:" // Standard font
            },
            "queen": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/queen?text=${encodeURIComponent(text)}`,
                message: "Here's the QUEEN text art:" // Standard font
            },
            "beach": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/beach?text=${encodeURIComponent(text)}`,
                message: "Here's the BEACH text art:" // Standard font
            },
            "fbc3": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/facebookcover3?text=${encodeURIComponent(text)}`,
                message: "Here's the FBC3 text art:" // Standard font
            },
            "tatto": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/tatto?text=${encodeURIComponent(text)}`,
                message: "Here's the TATTOO text art:" // Standard font (corrected spelling in message)
            },
            "shirt3": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt3?text=${encodeURIComponent(text)}&text2=20`,
                message: "Here's the SHIRT3 text art:" // Standard font
            },
            "oceansea": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/photooxy/oceansea?text=${encodeURIComponent(text)}`,
                message: "Here's the OCEAN SEA text art:" // Standard font
            },
            "shirt4": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt4?text=${encodeURIComponent(text)}&text2=20`,
                message: "Here's the SHIRT4 text art:" // Standard font
            },
            "shirt5": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt5?text=${encodeURIComponent(text)}&text2=20`,
                message: "Here's the SHIRT5 text art:" // Standard font
            },
            "shirt6": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/shirt6?text=${encodeURIComponent(text)}&text2=20`,
                message: "Here's the SHIRT6 text art:" // Standard font
            },
            "lovemsg": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/photooxy/lovemessage?text=${encodeURIComponent(text)}`,
                message: "Here's the LOVE MESSAGE text art:" // Standard font
            },
            "chstm": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/Chirstmasvideo?text=${encodeURIComponent(text)}&type=video/mp4`,
                message: "Here's the CHRISTMAS VIDEO text art:" // Standard font
            },
            "christmas2": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/Christmas2?text=${encodeURIComponent(text)}`,
                message: "Here's the CHRISTMAS 2 text art:" // Standard font
            },
            "icetext": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/icetext?url=https://i.imgur.com/BTPUTRQ.jpg&text=${encodeURIComponent(text)}`,
                message: "Here's the ICE TEXT text art:" // Standard font
            },
            "butterfly": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/photooxy/butterfly?text=${encodeURIComponent(text)}`,
                message: "Here's the BUTTERFLY 🦋 text art:" // Standard font
            },
            "coffe": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/photooxy/coffecup?text=${encodeURIComponent(text)}`,
                message: "Here's the COFFEE text art:" // Standard font
            },
            "intro2": {
                apiUrl: `https://faheem-vip-010.faheem001.repl.co/api/ephoto/intro2?text=${encodeURIComponent(text)}&type=video/mp4`,
                message: "Here's the INTRO 2 text art:" // Standard font
            }
        };

        const config = styleConfigs[type];
        if (!config) {
            return api.sendMessage(
                `╔════ஜ۩۞۩ஜ════╗\n\nInvalid text art style! Use "list 1" to see available styles.\n\n╚════ஜ۩۞۩ஜ════╝`, // Standard font
                threadID,
                messageID
            );
        }

        const pathFile = path.join(cacheDir, `${type}_${threadID}_${messageID}.png`);

        try {
            const response = await axios.get(config.apiUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000 // 30 seconds timeout
            });

            if (!response.data || response.data.length === 0) { // Check for empty data
                throw new Error('No image data received from API');
            }

            fs.writeFileSync(pathFile, Buffer.from(response.data, 'binary'));

            await api.sendMessage({
                body: config.message,
                attachment: fs.createReadStream(pathFile)
            }, threadID, messageID);

            // Clean up file after sending
            setTimeout(() => {
                if (fs.existsSync(pathFile)) {
                    fs.unlinkSync(pathFile);
                }
            }, 5000); // Delete after 5 seconds

        } catch (error) {
            // Clean up on error
            if (fs.existsSync(pathFile)) {
                fs.unlinkSync(pathFile);
            }
            throw error; // Re-throw to be caught by the onStart try/catch
        }
    }
};
