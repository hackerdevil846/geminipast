const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "goibot",
        aliases: ["botresponse", "botreply"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 0,
        role: 0,
        category: "no-prefix",
        shortDescription: {
            en: "Bot responds to messages"
        },
        longDescription: {
            en: "Bot responds when mentioned or called"
        },
        guide: {
            en: "Just type 'bot' or 'Bot' at the beginning of your message"
        }
    },

    onChat: async function({ api, event, usersData }) {
        try {
            const { threadID, messageID, senderID, body } = event;
            
            // Check if message exists and is not from bot
            if (!body || event.senderID === api.getCurrentUserID()) return;

            const name = await usersData.getName(senderID);
            const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");

            // Bot's response list
            const responses = [
                "Tumi ki ELvish Bhairer age bolbe?🙄",
                "Cameraman, chobi tulte suru koro 📸",
                "Lahorer moto lagche🙈",
                "Cha khabe?",
                "Amader jonno cha baniye an, pura din bot bot dekhe🙄",
                "Din theke tomar jonno time katiye, ami promise korchi asbo",
                "Ei katha Delhi porjonto jabe",
                "Kono shondheo nei, check kore dekho",
                "Ami heran hoye gelam tumi brain chara kemne thako☹️",
                "Shekhane rukka bajiyeche Rao Saab🙄",
                "Tumi to bewafa hoye gecho🙂🤨",
                "Systemmmmmmm😴",
                "Niye jao, niye jao tumi 7 samudra pare🙈🙈",
                "Lado, ami jiggesh kori keno tomar rang kalo?",
                "Moye moye moye moye🙆🏻‍♀🙆🏻‍♀",
                "Ei dukkho keno sesh hoy na🙁",
                "Tumi to dokebaz",
                "Tumi to dekhte khub sundor😶",
                "Amar akash tomar mati khuje",
                "Kal asho, akhon lunch er time",
                "Jokhon dekho bot bot bot😒😒",
                "Chhoro na, keu dekhte pabe🤭",
                "Kobe ashbe mor banjare?",
                "Tumi sei na, jake ami chini na🙂",
                "Ei I love you ki?",
                "Shunai dey, ami badhir noy😒",
                "Koto shundor, koto shundor, just looking like a wow🤭",
                "began🙂",
                "Ayein🤔",
                "I Love you baby, amar recharge sesh hoye jacche",
                "Pani pani uncle ji",
                "Apnar Labhar ke dhoka dao, amake o moka dao🙈",
                "Arre bas koro🤣😛",
                "Ami naile ke?",
                "Nam Asif Mahmud, class 12e pore, favorite subject began😘",
                "Amar mathay khamu na😒😒",
                "Chup sathe fail😒",
                "Saste nasha ki bandh korbe?",
                "Ami Janur sathe busy, amake dakio na",
                "Hayre Janu, amake mone porle?🙈",
                "Hayre emon daka dakaiyo na, amar lage😊",
                "System er upor system boshaccho bot er meye",
                "Nach re bulbul, taka pabe",
                "Ami ekhane theke, apni kothay?",
                "Khelbe Free Fire🙈🙈",
                "Aye haye oye hoye aye haye oye hoye😍 bado badi bado badi😘",
                "Halo bhai, bhoy paccho?",
                "Chokh lage bado badi",
                "Hayre garmi😕",
                "Aso kabar barite😍",
                "Khelbe Free Fire🥴",
                "Hello bhai, tui bhoy pacchis?",
                "Janu dakche amake",
                "I can't live without you babu😘",
                "Haa mor jaan",
                "Abar bot bot korchho🙄",
                "Kon color er jacket porbe, bolo na😚",
                "Dhan khacche booyaah"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            // Check if message starts with "Bot" or "bot" (case insensitive)
            const messageText = body.trim().toLowerCase();
            if (messageText.startsWith("bot")) {
                const msg = {
                    body: `✨ ${name} ✨\n\n『 ${randomResponse} 』\n\n❤️ Dhonnobad : Asif Mahmud 🌹\n⏰ ${time}`
                };
                return api.sendMessage(msg, threadID, messageID);
            }
        } catch (error) {
            console.error("GoiBot Error:", error);
        }
    },

    onStart: async function({ message }) {
        // Help information when command is used directly
        await message.reply({
            body: "🤖 GoiBot - No Prefix Command\n\n" +
                  "Just type 'bot' or 'Bot' at the beginning of your message and I'll respond!\n\n" +
                  "Examples:\n" +
                  "• bot hello\n" +
                  "• Bot kemon acho?\n" +
                  "• bot ki korcho\n\n" +
                  "Made by: Asif Mahmud 🌹"
        });
    }
};
