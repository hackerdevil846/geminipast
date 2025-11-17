const axios = require("axios");

const baseApiUrl = async () => {
  try {
    const base = await axios.get(
      `https://raw.githubusercontent.com/ARYAN-AROHI-STORE/A4YA9-A40H1/refs/heads/main/APIRUL.json`,
      { timeout: 10000 }
    );
    return base.data.api;
  } catch (error) {
    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖻𝖺𝗌𝖾 𝖠𝖯𝖨 𝖴𝖱𝖫:", error.message);
    return "https://api-dien.sangnguyen206.repl.co";
  }
};

// Mathematical Bold Font Mapping
function transformText(input) {
  const fontMap = {
    " ": " ", "!": "!", "?": "?", ".": ".", ",": ",", ":": ":", ";": ";",
    "a": "𝖺", "b": "𝖻", "c": "𝖼", "d": "𝖽", "e": "𝖾", "f": "𝖿", "g": "𝗀", "h": "𝗁", "i": "𝗂",
    "j": "𝗃", "k": "𝗄", "l": "𝗅", "m": "𝗆", "n": "𝗇", "o": "𝗈", "p": "𝗉", "q": "𝗊", "r": "𝗋",
    "s": "𝗌", "t": "𝗍", "u": "𝗎", "v": "𝗏", "w": "𝗐", "x": "𝗑", "y": "𝗒", "z": "𝗓",
    "A": "𝖠", "B": "𝖡", "C": "𝖢", "D": "𝖣", "E": "𝖤", "F": "𝖥", "G": "𝖦", "H": "𝖧", "I": "𝖨",
    "J": "𝖩", "K": "𝖪", "L": "𝖫", "M": "𝖬", "N": "𝖭", "O": "𝖮", "P": "𝖯", "Q": "𝖰", "R": "𝖱",
    "S": "𝖲", "T": "𝖳", "U": "𝖴", "V": "𝖵", "W": "𝖶", "X": "𝖷", "Y": "𝖸", "Z": "𝖹",
    "0": "𝟢", "1": "𝟣", "2": "𝟤", "3": "𝟥", "4": "𝟦", "5": "𝟧", "6": "𝟨", "7": "𝟩", "8": "𝟪", "9": "𝟫"
  };
  return input.split("").map(c => fontMap[c] || c).join("");
}

module.exports = {
    config: {
        name: "flaghunt",
        aliases: [],
        version: "3.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 0,
        role: 0,
        shortDescription: {
            en: transformText("🎌 Guess the flag and win rewards!")
        },
        longDescription: {
            en: transformText("🎌 Guess the flag and win rewards!")
        },
        category: "game",
        guide: {
            en: transformText("{p}flaghunt - Reply to the flag image with the country name")
        },
        dependencies: {
            "axios": ""
        }
    },

    onReply: async function ({ event, Reply, usersData, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            if (!Reply || event.type !== "message_reply") return;

            const { country, attempts, messageID } = Reply;
            const maxAttempts = 5;
            
            // Validate reply data
            if (!country || !messageID) {
                return message.reply(transformText("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗀𝖺𝗆𝖾 𝗌𝖾𝗌𝗌𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗍𝖺𝗋𝗍 𝗇𝖾𝗐 𝗀𝖺𝗆𝖾."));
            }

            if (event.senderID !== Reply.author) {
                return message.reply(transformText("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝖾𝗍 𝗍𝗁𝖾 𝗉𝗅𝖺𝗒𝖾𝗋 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾 𝗍𝗁𝖾 𝗀𝖺𝗆𝖾."));
            }

            if (attempts >= maxAttempts) {
                return message.reply(
                    transformText("🚫 𝖮𝗈𝗉𝗌! 𝖸𝗈𝗎'𝗏𝖾 𝗋𝖾𝖺𝖼𝗁𝖾𝖽 𝗍𝗁𝖾 𝗆𝖺𝗑 𝖺𝗍𝗍𝖾𝗆𝗉𝗍𝗌 (5). 𝖳𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋!")
                );
            }

            const reply = event.body?.toLowerCase().trim();
            if (!reply) {
                return message.reply(transformText("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝖼𝗈𝗎𝗇𝗍𝗋𝗒 𝗇𝖺𝗆𝖾."));
            }

            const coinReward = 241;
            const expReward = 121;

            // Get user data with error handling
            let userData;
            try {
                userData = await usersData.get(event.senderID);
            } catch (userError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", userError);
                return message.reply(transformText("❌ 𝖤𝗋𝗋𝗈𝗋 𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺."));
            }

            if (reply === country.toLowerCase()) {
                try {
                    // Try to unsend the flag message
                    try {
                        await message.unsendMessage(messageID);
                    } catch (unsendError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }

                    // Update user data
                    try {
                        await usersData.set(event.senderID, {
                            money: (userData.money || 0) + coinReward,
                            exp: (userData.exp || 0) + expReward,
                            data: userData.data || {},
                        });

                        await message.reply(
                            transformText(`✅ 𝖸𝖺𝗒! 𝖸𝗈𝗎 𝗀𝗈𝗍 𝗂𝗍 𝗋𝗂𝗀𝗁𝗍!\n💰 𝖤𝖺𝗋𝗇𝖾𝖽: ${coinReward} 𝖼𝗈𝗂𝗇𝗌 💎\n✨ 𝖫𝖾𝗏𝖾𝗅 𝗎𝗉: +${expReward} 𝖾𝗑𝗉`)
                        );
                    } catch (rewardError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝗋𝖾𝗐𝖺𝗋𝖽𝗌:", rewardError);
                        await message.reply(
                            transformText(`✅ 𝖸𝖺𝗒! 𝖸𝗈𝗎 𝗀𝗈𝗍 𝗂𝗍 𝗋𝗂𝗀𝗁𝗍! (𝖱𝖾𝗐𝖺𝗋𝖽𝗌 𝗇𝗈𝗍 𝖺𝗉𝗉𝗅𝗂𝖾𝖽 𝖽𝗎𝖾 𝗍𝗈 𝖾𝗋𝗋𝗈𝗋)`)
                        );
                    }
                } catch (err) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝖼𝗈𝗋𝗋𝖾𝖼𝗍 𝖺𝗇𝗌𝗐𝖾𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀:", err.message);
                    await message.reply(transformText("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖺𝗇𝗌𝗐𝖾𝗋."));
                }
            } else {
                Reply.attempts += 1;
                global.client.handleReply.set(messageID, Reply);
                await message.reply(
                    transformText(`❌ 𝖭𝗈𝗉𝖾! 𝖳𝗁𝖺𝗍'𝗌 𝗇𝗈𝗍 𝗂𝗍! 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 ${maxAttempts - Reply.attempts} 𝗍𝗋𝗂𝖾𝗌 𝗅𝖾𝖿𝗍.\n💖 𝖳𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝖻𝖺𝖻𝗒~`)
                );
            }
        } catch (error) {
            console.error("💥 𝖥𝗅𝖺𝗀𝗁𝗎𝗇𝗍 𝗋𝖾𝗉𝗅𝗒 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply(transformText("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇."));
        }
    },

    onStart: async function ({ api, args, event, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            if (!args[0]) {
                const apiUrl = await baseApiUrl();
                console.log(`🔗 𝖴𝗌𝗂𝗇𝗀 𝖠𝖯𝖨 𝖴𝖱𝖫: ${apiUrl}`);

                const response = await axios.get(
                    `${apiUrl}/flagGame?randomFlag=random`,
                    { timeout: 15000 }
                );

                if (!response.data || !response.data.link || !response.data.country) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
                }

                const { link, country } = response.data;

                console.log(`🎌 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖿𝗅𝖺𝗀: ${country}`);

                const msg = await message.reply({
                    body: transformText("🎌 𝖦𝗎𝖾𝗌𝗌 𝗍𝗁𝗂𝗌 𝖿𝗅𝖺𝗀! 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝖼𝗈𝗎𝗇𝗍𝗋𝗒 𝗇𝖺𝗆𝖾 𝗍𝗈 𝗐𝗂𝗇! 💖"),
                    attachment: await global.utils.getStreamFromURL(link)
                });

                global.client.handleReply.set(msg.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: msg.messageID,
                    author: event.senderID,
                    link,
                    country,
                    attempts: 0,
                });
            }
        } catch (error) {
            console.error(`💥 𝖥𝗅𝖺𝗀𝗁𝗎𝗇𝗍 𝖾𝗋𝗋𝗈𝗋: ${error.message}`);
            await message.reply(
                transformText(`❌ 𝖲𝗈𝗋𝗋𝗒, 𝗌𝗈𝗆𝖾𝗍𝗁𝗂𝗇𝗀 𝗐𝖾𝗇𝗍 𝗐𝗋𝗈𝗇𝗀... 💔`)
            );
        }
    }
};
