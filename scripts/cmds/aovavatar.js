const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
    config: {
        name: "aovavatar",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖠𝖮𝖵-𝗌𝗍𝗒𝗅𝖾 𝖺𝗏𝖺𝗍𝖺𝗋 𝖼𝖺𝗋𝖽𝗌"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖼𝗎𝗌𝗍𝗈𝗆𝗂𝗓𝖺𝖻𝗅𝖾 𝖠𝗋𝖾𝗇𝖺 𝗈𝖿 𝖵𝖺𝗅𝗈𝗋 𝗌𝗍𝗒𝗅𝖾 𝖺𝗏𝖺𝗍𝖺𝗋 𝖼𝖺𝗋𝖽𝗌 𝗐𝗂𝗍𝗁 𝗆𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝗈𝗉𝗍𝗂𝗈𝗇𝗌"
        },
        guide: {
            en: "{p}aovavatar [𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗂𝗆𝖺𝗀𝖾]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝖼𝖺𝗇𝗏𝖺𝗌.");
            }

            let imageUrl = args.join(" ");

            if (!imageUrl && event.type == 'message_reply') {
                if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) {
                    return message.reply('𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾');
                }
                if (event.messageReply.attachments.length > 1) {
                    return message.reply('𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗈𝗇𝗅𝗒 𝗈𝗇𝖾 𝗂𝗆𝖺𝗀𝖾!');
                }
                if (event.messageReply.attachments[0].type != 'photo') {
                    return message.reply('𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾 𝗈𝗇𝗅𝗒');
                }

                imageUrl = event.messageReply.attachments[0].url;
            } else if (!imageUrl) {
                imageUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            } else {
                if (imageUrl.indexOf('http') == -1) {
                    imageUrl = 'https://' + imageUrl;
                }
            }
            
            return message.reply('🌸 𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖺𝗇𝖽 𝖾𝗇𝗍𝖾𝗋 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝗇𝖺𝗆𝖾 🌸').then((info) => {
                global.client.handleReply.push({
                    step: 1,
                    name: this.config.name,
                    messageID: info.messageID,
                    image: imageUrl,
                    author: event.senderID
                });
            });

        } catch (error) {
            console.error("💥 𝖠𝖮𝖵 𝖠𝗏𝖺𝗍𝖺𝗋 𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    onReply: async function({ message, event, Reply }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝖼𝖺𝗇𝗏𝖺𝗌.");
            }

            const u = ["https://imgur.com/WoD5OoQ.png", "https://imgur.com/x0QrTlQ.png", "https://i.imgur.com/PPzdY41.png"];
            const f = ["https://imgur.com/28aiYVA.png", "https://imgur.com/vCO8LPL.png", "https://imgur.com/OGxx1I4.png", "https://imgur.com/S9igFa6.png"];
            const g = ["https://imgur.com/R1Nc9Lz.png", "https://imgur.com/yd0svOU.png", "https://imgur.com/0MXw7eG.png", "https://imgur.com/HYeoGia.png", "https://imgur.com/KlLrw0y.png", "https://imgur.com/B42txfi.png", "https://imgur.com/JkunRCG.png", "https://imgur.com/yHueKan.png", "https://imgur.com/z2RpozR.png"];
            const h = ["https://imgur.com/WspyTeK.png", "https://imgur.com/2sGb8UV.png", "https://imgur.com/YvuMkJ0.png", "https://imgur.com/NF8nB3U.png", "https://imgur.com/388n5TF.png", "https://imgur.com/WcWC8z8.png", "https://imgur.com/2sCe8GO.png", "https://imgur.com/eDYbG9F.png", "https://imgur.com/4n8FlLJ.png", "https://imgur.com/rGV8aYs.png"];
            const s = ["https://imgur.com/Dkco1Xz.png", "https://imgur.com/Tmpw6me.png", "https://imgur.com/C2HKEHu.png", "https://imgur.com/BAEKMdK.png", "https://imgur.com/LIH4YYl.png", "https://imgur.com/vWE3V9T.png", "https://imgur.com/nJ2qpiY.png", "https://imgur.com/duis8N4.png", "https://imgur.com/i3QC0eV.png", "https://imgur.com/V7ji4IG.png", "https://imgur.com/lAXMleJ.png", "https://imgur.com/jYBBTuf.png", "https://imgur.com/s0oBwea.png", "https://imgur.com/nwJbpwR.png", "https://imgur.com/jwVRzrk.png", "https://imgur.com/tr5JHav.png", "https://imgur.com/pSxLPtt.png", "https://imgur.com/hsZ8GHY.png", "https://imgur.com/Jb8lxQn.png", "https://imgur.com/SLr5fGm.png", "https://imgur.com/RqjgA57.png"];
            const w = ["https://imgur.com/ky7Iu2t.png", "https://imgur.com/1zZcchN.png", "https://imgur.com/EidGfcr.png", "https://imgur.com/Kmt9Hiz.png", "https://imgur.com/wYimMMU.png", "https://imgur.com/kKBLKIg.png", "https://imgur.com/BSoFwWi.png", "https://imgur.com/0eOJSp7.png", "https://imgur.com/UlUnVdU.png", "https://imgur.com/PQRrAOt.png", "https://imgur.com/GhUBZnz.png"];

            let pathImg = __dirname + `/cache/avatar_${Date.now()}_1.png`;
            let pathAva = __dirname + `/cache/avatar_${Date.now()}_2.png`;
            let pathBS = __dirname + `/cache/avatar_${Date.now()}_3.png`;
            let pathtop = __dirname + `/cache/avatar_${Date.now()}_4.png`;
            let paththaku = __dirname + `/cache/avatar_${Date.now()}_5.png`;
            let pathtph = __dirname + `/cache/avatar_${Date.now()}_6.png`;
            let pathx = __dirname + `/cache/avatar_${Date.now()}_7.png`;

            if (event.senderID != Reply.author) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝖾𝗍 𝗍𝗁𝖾 𝗎𝗌𝖾𝗋 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝗁𝖾 𝗂𝗆𝖺𝗀𝖾");
            }

            if (Reply.step == 1) {
                message.unsendMessage(Reply.messageID);
                const attachments = [];
                for (let e = 0; e < u.length; e++) {
                    try {
                        const t = (await axios.get(`${u[e]}`, { responseType: "stream", timeout: 30000 })).data;
                        attachments.push(t);
                    } catch (imgError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 ${u[e]}:`, imgError.message);
                    }
                }
                
                const msg = {
                    body: `𝖸𝗈𝗎 𝗌𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝗇𝖺𝗆𝖾: ${event.body}, 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖺𝗇𝖽 𝖼𝗁𝗈𝗈𝗌𝖾 𝗋𝖺𝗇𝗄 𝖿𝗋𝖺𝗆𝖾\n🔥 𝖨𝗆𝖺𝗀𝖾 1: "𝖬𝖺𝗌𝗍𝖾𝗋"\n🌈 𝖨𝗆𝖺𝗀𝖾 2: "𝖶𝖺𝗋𝗋𝗂𝗈𝗋"\n⚜️ 𝖨𝗆𝖺𝗀𝖾 3: "𝖢𝗁𝖺𝗅𝗅𝖾𝗇𝗀𝖾𝗋"`,
                    attachment: attachments
                };
                
                return message.reply(msg).then((info) => {
                    global.client.handleReply.push({
                        step: 2,
                        name: "aovavatar",
                        messageID: info.messageID,
                        image: Reply.image,
                        name: event.body,
                        author: event.senderID
                    });
                });
            }
            else if (Reply.step == 2) {
                if (isNaN(event.body)) return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 (1, 2, 𝗈𝗋 3)");
                message.unsendMessage(Reply.messageID);
                const attachments = [];
                for (let e = 0; e < f.length; e++) {
                    try {
                        const t = (await axios.get(`${f[e]}`, { responseType: "stream", timeout: 30000 })).data;
                        attachments.push(t);
                    } catch (imgError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 ${f[e]}:`, imgError.message);
                    }
                }
                
                const frameName = event.body == 1 ? "𝖬𝖺𝗌𝗍𝖾𝗋" : event.body == "2" ? "𝖶𝖺𝗋𝗋𝗂𝗈𝗋" : "𝖢𝗁𝖺𝗅𝗅𝖾𝗇𝗀𝖾𝗋";
                const msg = {
                    body: `𝖸𝗈𝗎 𝗌𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝖿𝗋𝖺𝗆𝖾: ${frameName}, 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖼𝗁𝗈𝗈𝗌𝖾 𝗉𝖺𝗋𝗍𝗇𝖾𝗋`,
                    attachment: attachments
                };
                
                return message.reply(msg).then((info) => {
                    global.client.handleReply.push({
                        step: 3,
                        name: "aovavatar",
                        messageID: info.messageID,
                        image: Reply.image,
                        name: Reply.name,
                        frame: event.body,
                        author: event.senderID
                    });
                });
            }
            else if (Reply.step == 3) {
                if (isNaN(event.body)) return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 (1-4)");
                message.unsendMessage(Reply.messageID);
                const attachments = [];
                for (let e = 0; e < g.length; e++) {
                    try {
                        const t = (await axios.get(`${g[e]}`, { responseType: "stream", timeout: 30000 })).data;
                        attachments.push(t);
                    } catch (imgError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 ${g[e]}:`, imgError.message);
                    }
                }
                
                const partnerName = event.body == 1 ? "𝖡𝗋𝗈𝗍𝗁𝖾𝗋" : event.body == "2" ? "𝖥𝗋𝗂𝖾𝗇𝖽" : event.body == "3" ? "𝖢𝗈𝗎𝗉𝗅𝖾" : event.body == 4 ? "𝖲𝗂𝗌𝗍𝖾𝗋" : "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                const msg = {
                    body: `𝖸𝗈𝗎 𝗌𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝗉𝖺𝗋𝗍𝗇𝖾𝗋: ${partnerName}, 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖼𝗁𝗈𝗈𝗌𝖾 𝗉𝗋𝗈𝖿𝗂𝖼𝗂𝖾𝗇𝖼𝗒`,
                    attachment: attachments
                };
                
                return message.reply(msg).then((info) => {
                    global.client.handleReply.push({
                        step: 4,
                        name: "aovavatar",
                        messageID: info.messageID,
                        image: Reply.image,
                        name: Reply.name,
                        frame: Reply.frame,
                        partner: event.body,
                        author: event.senderID
                    });
                });
            }
            else if (Reply.step == 4) {
                if (isNaN(event.body)) return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 (1-9)");
                message.unsendMessage(Reply.messageID);
                const attachments = [];
                for (let e = 0; e < h.length; e++) {
                    try {
                        const t = (await axios.get(`${h[e]}`, { responseType: "stream", timeout: 30000 })).data;
                        attachments.push(t);
                    } catch (imgError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 ${h[e]}:`, imgError.message);
                    }
                }
                
                const proficiencyName = event.body == 1 ? "𝖦𝗋𝖺𝖽𝖾 𝖣" : event.body == "2" ? "𝖦𝗋𝖺𝖽𝖾 𝖢" : event.body == "3" ? "𝖦𝗋𝖺𝖽𝖾 𝖡" : event.body == "4" ? "𝖦𝗋𝖺𝖽𝖾 𝖠" : event.body == "5" ? "𝖦𝗋𝖺𝖽𝖾 𝖲" : event.body == "6" ? "𝖳𝗈𝗉 𝖱𝖾𝗀𝗂𝗈𝗇" : event.body == "7" ? "𝖳𝗈𝗉 𝖠𝗋𝖾𝖺" : event.body == "8" ? "𝖳𝗈𝗉 𝖵𝗂𝖾𝗍𝗇𝖺𝗆" : "𝖳𝗈𝗉 1";
                const msg = {
                    body: `𝖸𝗈𝗎 𝗌𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝗉𝗋𝗈𝖿𝗂𝖼𝗂𝖾𝗇𝖼𝗒: ${proficiencyName}, 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖼𝗁𝗈𝗈𝗌𝖾 𝗌𝗎𝗉𝗉𝗈𝗋𝗍 𝗌𝗉𝖾𝗅𝗅`,
                    attachment: attachments
                };
                
                return message.reply(msg).then((info) => {
                    global.client.handleReply.push({
                        step: 5,
                        name: "aovavatar",
                        messageID: info.messageID,
                        image: Reply.image,
                        name: Reply.name,
                        frame: Reply.frame,
                        partner: Reply.partner,
                        proficiency: event.body,
                        author: event.senderID
                    });
                });
            }
            else if (Reply.step == 5) {
                if (isNaN(event.body)) return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 (1-11)");
                message.unsendMessage(Reply.messageID);
                const attachments = [];
                for (let e = 0; e < s.length; e++) {
                    try {
                        const t = (await axios.get(`${s[e]}`, { responseType: "stream", timeout: 30000 })).data;
                        attachments.push(t);
                    } catch (imgError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 ${s[e]}:`, imgError.message);
                    }
                }
                
                const supportName = event.body == 1 ? "𝖡𝗎𝗋𝗌𝗍" : event.body == 2 ? "𝖳𝗈𝗐𝖾𝗋 𝖣𝗂𝗌𝖺𝖻𝗅𝖾" : event.body == 3 ? "𝖱𝖾𝗌𝖼𝗎𝖾" : event.body == 4 ? "𝖱𝗈𝖺𝗋" : event.body == 5 ? "𝖲𝗍𝗎𝗇" : event.body == 6 ? "𝖶𝖾𝖺𝗄𝖾𝗇" : event.body == 7 ? "𝖯𝗎𝗋𝗂𝖿𝗒" : event.body == 8 ? "𝖥𝗅𝖺𝗌𝗁" : event.body == 9 ? "𝖲𝗉𝗋𝗂𝗇𝗍" : "𝖯𝗎𝗇𝗂𝗌𝗁";
                const msg = {
                    body: `𝖸𝗈𝗎 𝗌𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝗌𝗎𝗉𝗉𝗈𝗋𝗍 𝗌𝗉𝖾𝗅𝗅: ${supportName}, 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖼𝗁𝗈𝗈𝗌𝖾 𝗌𝗄𝗂𝗇 𝗍𝗂𝖾𝗋`,
                    attachment: attachments
                };
                
                return message.reply(msg).then((info) => {
                    global.client.handleReply.push({
                        step: 6,
                        name: "aovavatar",
                        messageID: info.messageID,
                        image: Reply.image,
                        name: Reply.name,
                        frame: Reply.frame,
                        partner: Reply.partner,
                        proficiency: Reply.proficiency,
                        support: event.body,
                        author: event.senderID
                    });
                });
            }
            else if (Reply.step == 6) {
                if (isNaN(event.body)) return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 (1-11)");
                message.unsendMessage(Reply.messageID);
                const attachments = [];
                for (let e = 0; e < w.length; e++) {
                    try {
                        const t = (await axios.get(`${w[e]}`, { responseType: "stream", timeout: 30000 })).data;
                        attachments.push(t);
                    } catch (imgError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 ${w[e]}:`, imgError.message);
                    }
                }
                
                const msg = {
                    body: `𝖸𝗈𝗎 𝗌𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝗌𝗄𝗂𝗇 𝗍𝗂𝖾𝗋: ${event.body}, 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖼𝗁𝗈𝗈𝗌𝖾 𝖻𝖺𝖽𝗀𝖾`,
                    attachment: attachments
                };
                
                return message.reply(msg).then((info) => {
                    global.client.handleReply.push({
                        step: 7,
                        name: "aovavatar",
                        messageID: info.messageID,
                        image: Reply.image,
                        name: Reply.name,
                        frame: Reply.frame,
                        partner: Reply.partner,
                        proficiency: Reply.proficiency,
                        support: Reply.support,
                        skinTier: event.body,
                        author: event.senderID
                    });
                });
            }
            else if (Reply.step == 7) {
                message.unsendMessage(Reply.messageID);
                return message.reply("𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖺𝗇𝖽 𝖾𝗇𝗍𝖾𝗋 𝗁𝖾𝗋𝗈 𝗇𝖺𝗆𝖾").then((info) => {
                    global.client.handleReply.push({
                        step: 8,
                        name: "aovavatar",
                        messageID: info.messageID,
                        image: Reply.image,
                        name: Reply.name,
                        frame: Reply.frame,
                        partner: Reply.partner,
                        proficiency: Reply.proficiency,
                        support: Reply.support,
                        skinTier: Reply.skinTier,
                        badge: event.body,
                        author: event.senderID
                    });
                });
            }
            else if (Reply.step == 8) {
                message.unsendMessage(Reply.messageID);
                return message.reply("𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖺𝗇𝖽 𝖾𝗇𝗍𝖾𝗋 𝗌𝗄𝗂𝗇 𝗇𝖺𝗆𝖾").then((info) => {
                    global.client.handleReply.push({
                        step: 9,
                        name: "aovavatar",
                        messageID: info.messageID,
                        image: Reply.image,
                        name: Reply.name,
                        frame: Reply.frame,
                        partner: Reply.partner,
                        proficiency: Reply.proficiency,
                        support: Reply.support,
                        skinTier: Reply.skinTier,
                        badge: Reply.badge,
                        heroName: event.body,
                        author: event.senderID,
                    });
                });
            }
            else if (Reply.step == 9) {
                const name = Reply.name;
                const frame = Reply.frame;
                const partner = Reply.partner;
                const proficiency = Reply.proficiency;
                const support = Reply.support;
                
                message.unsendMessage(Reply.messageID);
                
                try {
                    // Download all required images with error handling
                    const downloadPromises = [
                        axios.get(encodeURI(`${u[Reply.frame - 1]}`), { responseType: "arraybuffer", timeout: 30000 }),
                        axios.get(encodeURI(`${Reply.image}`), { responseType: "arraybuffer", timeout: 30000 }),
                        axios.get(encodeURI(`${s[Reply.skinTier - 1]}`), { responseType: "arraybuffer", timeout: 30000 }),
                        axios.get(encodeURI(`${h[Reply.support - 1]}`), { responseType: "arraybuffer", timeout: 30000 }),
                        axios.get(encodeURI(`${g[Reply.proficiency - 1]}`), { responseType: "arraybuffer", timeout: 30000 }),
                        axios.get(encodeURI(`${w[Reply.badge - 1]}`), { responseType: "arraybuffer", timeout: 30000 }),
                        axios.get(encodeURI(`${f[Reply.partner - 1]}`), { responseType: "arraybuffer", timeout: 30000 })
                    ];

                    const [background, avatar, skinTierImg, supportImg, proficiencyImg, badgeImg, partnerImg] = await Promise.all(downloadPromises);

                    // Save images to cache
                    fs.writeFileSync(pathImg, Buffer.from(background.data, "utf-8"));
                    fs.writeFileSync(pathAva, Buffer.from(avatar.data, "utf-8"));
                    fs.writeFileSync(pathx, Buffer.from(skinTierImg.data, "utf-8"));
                    fs.writeFileSync(pathBS, Buffer.from(supportImg.data, "utf-8"));
                    fs.writeFileSync(pathtop, Buffer.from(proficiencyImg.data, "utf-8"));
                    fs.writeFileSync(paththaku, Buffer.from(badgeImg.data, "utf-8"));
                    fs.writeFileSync(pathtph, Buffer.from(partnerImg.data, "utf-8"));

                    // Load images for canvas
                    const [a, az, a2, a3, a4, a5, a6] = await Promise.all([
                        loadImage(pathImg),
                        loadImage(pathtop),
                        loadImage(pathBS),
                        loadImage(pathx),
                        loadImage(pathtph),
                        loadImage(paththaku),
                        loadImage(pathAva)
                    ]);

                    // Create canvas
                    let canvas = createCanvas(a.width, a.height);
                    let ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Register font
                    try {
                        registerFont(__dirname + `/cache/ArialUnicodeMS.ttf`, { family: "Arial" });
                    } catch (e) {
                        console.log("𝖥𝗈𝗇𝗍 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍 𝖿𝗈𝗇𝗍");
                    }

                    // Draw images
                    ctx.drawImage(a6, 0, 0, 720, 890);
                    ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
                    
                    const btw = 128;
                    ctx.drawImage(a2, canvas.width / 2 - btw / 2, 905, btw, btw);
                    ctx.drawImage(az, 15, 10, az.width, az.height);
                    ctx.drawImage(a4, 108, 930, 90 * 27 / 24, 90);
                    ctx.drawImage(a5, 473, 897, 143, 143);
                    
                    ctx.save();
                    const a3scale = 2;
                    ctx.drawImage(a3, canvas.width / 2 - a3.width * a3scale / 2, 510, a3.width * a3scale, a3.height * a3scale);
                    ctx.restore();

                    // Draw text
                    ctx.save();
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#f7ecb4";
                    ctx.font = "50px Arial";
                    ctx.fillText(Reply.name, canvas.width / 2, 857);
                    ctx.restore();

                    ctx.save();
                    ctx.textAlign = "center";
                    ctx.shadowColor = "black";
                    ctx.fillStyle = "#5d9af6";
                    ctx.font = "50px Arial";
                    ctx.lineWidth = 10;
                    ctx.lineJoin = "round";
                    ctx.strokeText(Reply.heroName, canvas.width / 2, 770);
                    ctx.fillText(Reply.heroName, canvas.width / 2, 770);
                    ctx.restore();

                    ctx.save();
                    ctx.textAlign = "center";
                    ctx.shadowColor = "black";
                    ctx.fillStyle = "#f7ecb4";
                    ctx.font = "50px Arial";
                    ctx.lineWidth = 10;
                    ctx.lineJoin = "round";
                    ctx.strokeText(event.body, canvas.width / 2, 700);
                    ctx.fillText(event.body, canvas.width / 2, 700);
                    ctx.restore();

                    // Save final image
                    const imageBuffer = canvas.toBuffer();
                    fs.writeFileSync(pathImg, imageBuffer);

                    // Format names for output
                    const frameName = frame == 1 ? "𝖬𝖺𝗌𝗍𝖾𝗋" : frame == "2" ? "𝖶𝖺𝗋𝗋𝗂𝗈𝗋" : "𝖢𝗁𝖺𝗅𝗅𝖾𝗇𝗀𝖾𝗋";
                    const partnerName = partner == 1 ? "𝖡𝗋𝗈𝗍𝗁𝖾𝗋" : partner == "2" ? "𝖥𝗋𝗂𝖾𝗇𝖽" : partner == "3" ? "𝖢𝗈𝗎𝗉𝗅𝖾" : partner == "4" ? "𝖲𝗂𝗌𝗍𝖾𝗋" : "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
                    const proficiencyName = proficiency == 1 ? "𝖦𝗋𝖺𝖽𝖾 𝖣" : proficiency == "2" ? "𝖦𝗋𝖺𝖽𝖾 𝖢" : proficiency == "3" ? "𝖦𝗋𝖺𝖽𝖾 𝖡" : proficiency == "4" ? "𝖦𝗋𝖺𝖽𝖾 𝖠" : proficiency == "5" ? "𝖦𝗋𝖺𝖽𝖾 𝖲" : proficiency == "6" ? "𝖳𝗈𝗉 𝖱𝖾𝗀𝗂𝗈𝗇" : proficiency == "7" ? "𝖳𝗈𝗉 𝖠𝗋𝖾𝖺" : proficiency == "8" ? "𝖳𝗈𝗉 𝖵𝗂𝖾𝗍𝗇𝖺𝗆" : "𝖳𝗈𝗉 1";
                    const supportName = support == 1 ? "𝖡𝗎𝗋𝗌𝗍" : support == "2" ? "𝖳𝗈𝗐𝖾𝗋 𝖣𝗂𝗌𝖺𝖻𝗅𝖾" : support == "3" ? "𝖱𝖾𝗌𝖼𝗎𝖾" : support == "4" ? "𝖱𝗈𝖺𝗋" : support == "5" ? "𝖲𝗍𝗎𝗇" : support == "6" ? "𝖶𝖾𝖺𝗄𝖾𝗇" : support == "7" ? "𝖯𝗎𝗋𝗂𝖿𝗒" : support == "8" ? "𝖥𝗅𝖺𝗌𝗁" : support == "9" ? "𝖲𝗉𝗋𝗂𝗇𝗍" : "𝖯𝗎𝗇𝗂𝗌𝗁";

                    // Send final result
                    return message.reply({
                        body: `✅ 𝖠𝗏𝖺𝗍𝖺𝗋 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!\n\n⚜️ 𝖨𝗇𝗀𝖺𝗆𝖾: ${name}\n🛡 𝖥𝗋𝖺𝗆𝖾: ${frameName}\n💕 𝖯𝖺𝗋𝗍𝗇𝖾𝗋: ${partnerName}\n🔥 𝖯𝗋𝗈𝖿𝗂𝖼𝗂𝖾𝗇𝖼𝗒: ${proficiencyName}\n👑 𝖲𝗎𝗉𝗉𝗈𝗋𝗍: ${supportName}`,
                        attachment: fs.createReadStream(pathImg)
                    }).then(() => {
                        // Cleanup cache files
                        const filesToDelete = [pathImg, pathAva, pathBS, pathtop, paththaku, pathx, pathtph];
                        filesToDelete.forEach(file => {
                            try {
                                if (fs.existsSync(file)) fs.unlinkSync(file);
                            } catch (cleanupError) {
                                console.warn(`𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖽𝖾𝗅𝖾𝗍𝖾 ${file}:`, cleanupError.message);
                            }
                        });
                    });

                } catch (processingError) {
                    console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", processingError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }
            }
        } catch (e) {
            console.error("💥 𝖠𝖮𝖵 𝖠𝗏𝖺𝗍𝖺𝗋 𝖤𝗋𝗋𝗈𝗋:", e);
            // Don't send error message to avoid spam
        }
    }
};
