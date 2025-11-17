const axios = require("axios");

module.exports = {
    config: {
        name: "riddle",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 30,
        role: 0,
        category: "game",
        shortDescription: {
            en: "🎭 𝖱𝗂𝖽𝖽𝗅𝖾 𝗀𝖺𝗆𝖾 𝗐𝗂𝗍𝗁 30𝗌 𝗍𝗂𝗆𝖾𝗋"
        },
        longDescription: {
            en: "𝖯𝗅𝖺𝗒 𝗋𝗂𝖽𝖽𝗅𝖾 𝗀𝖺𝗆𝖾 𝗐𝗂𝗍𝗁 30 𝗌𝖾𝖼𝗈𝗇𝖽𝗌 𝗍𝗈 𝗍𝗁𝗂𝗇𝗄 𝖻𝖾𝖿𝗈𝗋𝖾 𝗋𝖾𝗏𝖾𝖺𝗅𝗂𝗇𝗀 𝗍𝗁𝖾 𝖺𝗇𝗌𝗐𝖾𝗋"
        },
        guide: {
            en: "{p}riddle"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
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

            const riddles = [
                {
                    question: "I can fly without wings, who am I?",
                    reponse: "The weather"
                },
                {
                    question: "I'm always hungry, the more I eat, the fatter I become. Who am I ?",
                    reponse: "A black hole"
                },
                {
                    question: "I'm strong when I'm down, but I'm weak when I'm up. Who am I ?",
                    reponse: "The number 6"
                },
                {
                    question: "I can be short or long, hard or soft, I can be used by anyone, from young children to experienced musicians. Who am I ?",
                    reponse: "A pencil"
                },
                {
                    question: "I am the beginning of the end, the end of every place. I am the beginning of eternity, the end of time and space. Who am I ?",
                    reponse: "The letter 'e'"
                },
                {
                    question: "I am white when I am dirty and black when I am clean. Who am I ?",
                    reponse: "A slate"
                },
                {
                    question: "I'm liquid, but if you take water away from me, I become solid. Who am I ?",
                    reponse: "Tea"
                },
                {
                    question: "I fly without wings, I cry without eyes. Wherever I am, death always accompanies me. Who am I ?",
                    reponse: "The wind"
                },
                {
                    question: "I have towns, but no houses. I have mountains, but no trees. I have water, but no fish. Who am I ?",
                    reponse: "A map"
                },
                {
                    question: "I can be read, but you can't write about me. You always give to me, but rarely keep me. Who am I ?",
                    reponse: "A borrowed book"
                },
                {
                    question: "I come twice in a week, once in a year, but never in a day. Who am I ?",
                    reponse: "The letter 'E'"
                },
                {
                    question: "I'm hard to grasp, but you will hold me in your hand when you find me. Who am I ?",
                    reponse: "Your breath"
                },
                {
                    question: "The hotter I am, the colder I become. Who am I ?",
                    reponse: "coffe"
                },
                {
                    question: "I am the stuff of dreams. I cover broken ideas. I change souls into wings. Who am I ?",
                    reponse: "A book"
                },
                {
                    question: "I am white when I am dirty and black when I am clean. Who am I?",
                    reponse: "A slate"
                },
                {
                    question: "I can fly without having wings. I can cry without having eyes. Who am I ?",
                    reponse: "A cloud"
                },
                {
                    question: "I start at night and finish in the morning. Who am I ?",
                    reponse: "The letter 'N'"
                },
                {
                    question: "I can be read, but you can't write about me. You always give to me, but rarely keep me. Who am I ?",
                    reponse: "A borrowed book"
                },
                {
                    question: "I feed on everything around me, the air, the earth and even the trees. Who am I ?",
                    reponse: "a fire"
                },
                {
                    question: "I am white when I am dirty and black when I am clean. Who am I ?",
                    reponse: "A slate"
                },
                {
                    question: "I'm liquid, but if you take water away from me, I become solid. Who am I ?",
                    reponse: "tea"
                },
                {
                    question: "I am the beginning of the end and the end of every place. I am the beginning of eternity, the end of time and space. Who am I ?",
                    reponse: "the letter'E'"
                },
                {
                    question: "I'm hard to grasp, but you will hold me in your hand when you find me. Who am I ?",
                    reponse: "Your breath"
                }
            ];

            // Select random riddle
            const randomIndex = Math.floor(Math.random() * riddles.length);
            const randomRiddle = riddles[randomIndex];

            console.log(`🎭 𝖲𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝗋𝗂𝖽𝖽𝗅𝖾 ${randomIndex + 1}: ${randomRiddle.question}`);

            // Send the riddle question
            await message.reply(`🎭 𝖱𝗂𝖽𝖽𝗅𝖾:\n\n${randomRiddle.question}\n\n⏰ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 30 𝗌𝖾𝖼𝗈𝗇𝖽𝗌 𝗍𝗈 𝗍𝗁𝗂𝗇𝗄!`);

            // Wait 30 seconds before revealing answer
            setTimeout(async () => {
                try {
                    await message.reply(`💡 𝖳𝗁𝖾 𝖺𝗇𝗌𝗐𝖾𝗋 𝗐𝖺𝗌:\n\n${randomRiddle.reponse}`);
                    console.log(`✅ 𝖱𝖾𝗏𝖾𝖺𝗅𝖾𝖽 𝖺𝗇𝗌𝗐𝖾𝗋: ${randomRiddle.reponse}`);
                } catch (replyError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝖺𝗇𝗌𝗐𝖾𝗋:", replyError.message);
                }
            }, 30000);

        } catch (error) {
            console.error("💥 𝖱𝗂𝖽𝖽𝗅𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗌𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗉 𝗍𝗁𝖾 𝗋𝗂𝖽𝖽𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            
            if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖳𝗂𝗆𝖾𝗈𝗎𝗍 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
