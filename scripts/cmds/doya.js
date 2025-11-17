const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
    config: {
        name: "doya",
        aliases: ["dua", "islamicprayer"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "islam",
        shortDescription: {
            en: "Islamic prayer collection"
        },
        longDescription: {
            en: "Collection of Islamic prayers and duas"
        },
        guide: {
            en: "{p}doya [prayer number]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, args, event }) {
        const { threadID, messageID } = event;
        
        const doyaContent = [
            {
                title: "📖 Iman with death prayer",
                body: "✨ O our Lord, forgive our sins, remove all evil from us, and grant us the company of the righteous.",
                image: "https://i.imgur.com/aESlOKd.jpeg"
            },
            {
                title: "🌺 Prayer for good spouse",
                body: "📜 Rabbana hablana min azwajina wa zurriyatina qurrata ayunin waajalna lilmuttaqina imama.\n\n💫 Meaning: 'O our Lord! Grant us comfort in our spouses and children, and make us leaders of the righteous.'",
                image: "https://i.imgur.com/3Bmg4Nd.jpeg"
            },
            {
                title: "❤️ Prayer before intimacy",
                body: "📜 Bismillahi Allahumma jannibnash shaytana wa jannibish shaytana ma razaktana.\n\n💫 Meaning: 'In the name of Allah. O Allah! Protect us from Shaytan.'",
                image: "https://i.imgur.com/TUm1LQW.jpeg"
            },
            {
                title: "🕋 Prayer for protection from punishment",
                body: "📜 Allahumma qinni azabaka yawma tabathu ibadaka\n\n💫 Meaning: 'O Allah! Protect me from Your punishment on the day You raise Your servants.'",
                image: "https://i.imgur.com/wp7hM0m.jpeg"
            },
            {
                title: "🌙 Prayer for forgiveness and mercy",
                body: "📜 Rabbana amanna faghfirlana warhamna waanta khairur rahimin.\n\n💫 Meaning: 'O our Lord! We have believed, so forgive us and have mercy on us, and You are the Best of the merciful.'",
                image: "https://i.imgur.com/pFvUmsm.jpeg"
            },
            {
                title: "👨‍👩‍👧‍👦 Prayer for righteous children",
                body: "📜 Rabbi hab li min ladunka zurriyyatan tayyibatan innaka samiud duai.\n\n💫 Meaning: 'My Lord! Grant me from Yourself a good offspring. You are the Hearer of supplication.'",
                image: "https://i.imgur.com/LH2qVcm.jpeg"
            },
            {
                title: "🕌 Grave visit procedure",
                body: "✨ Grave visit procedure:\n\n• 1x Surah Al-Fatiha\n• 1x Surah An-Nas\n• 1x Surah Al-Falaq\n• 3x Surah Al-Ikhlas\n• 1x Surah Al-Kafirun\n• 2x Surah At-Takathur\n• 11x Durud Sharif\n• 11x Astaghfirullah\n\n💫 Always face west while praying",
                image: "https://i.imgur.com/28Et6s2.jpeg"
            },
            {
                title: "📿 General prayer",
                body: "📜 Allahumma inni asaluka th-thabata fil amri wal azimata ala r-rushdi.\n\n💫 Meaning: 'O Allah! I ask You for steadfastness in decisions and determination in righteousness.'",
                image: "https://i.imgur.com/NIjfdfz.jpeg"
            }
        ];

        if (args[0] && !isNaN(args[0])) {
            const choice = parseInt(args[0]);
            if (choice < 1 || choice > doyaContent.length) {
                return message.reply(`⚠️ Invalid selection! Please write a number between 1-${doyaContent.length}.`);
            }
            
            const doya = doyaContent[choice - 1];
            try {
                const imageStream = await global.utils.getStreamFromURL(doya.image);
                return message.reply({
                    body: `${doya.title}\n\n${doya.body}`,
                    attachment: imageStream
                });
            } catch (error) {
                console.error("Error sending prayer:", error);
                return message.reply("⚠️ Could not send prayer, please try again later");
            }
        }
        
        let menuMessage = "📖 Islamic Prayer Collection:\n\n";
        doyaContent.forEach((doya, index) => {
            menuMessage += `${index + 1}. ${doya.title}\n`;
        });
        
        menuMessage += "\n💫 Write your preferred prayer number (1-8)";
        message.reply(menuMessage);
    }
};
