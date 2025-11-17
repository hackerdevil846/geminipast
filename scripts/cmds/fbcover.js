const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
    config: {
        name: "fbcover",
        aliases: [],
        version: "1.0.9",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 0,
        role: 0,
        category: "image-generator",
        shortDescription: {
            en: "🎨 𝖢𝗎𝗌𝗍𝗈𝗆 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖼𝗈𝗏𝖾𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗈𝗋"
        },
        longDescription: {
            en: "🎨 𝖢𝗎𝗌𝗍𝗈𝗆 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖼𝗈𝗏𝖾𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗈𝗋 𝗐𝗂𝗍𝗁 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗅𝗂𝗓𝖾𝖽 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇"
        },
        guide: {
            en: "{p}fbcover"
        },
        dependencies: {
            "fs-extra": "",
            "request": "",
            "axios": ""
        }
    },

    onStart: async function({ api, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("request");
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗋𝖾𝗊𝗎𝖾𝗌𝗍, 𝖺𝗇𝖽 𝖺𝗑𝗂𝗈𝗌.", event.threadID, event.messageID);
            }

            const { threadID, messageID, senderID } = event;
            
            if (!args[0]) {
                api.sendMessage(`🎨 | 𝖠𝗉𝗇𝗂 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾 𝖼𝗈𝗋𝖾 𝖼𝖺𝗂𝗌𝗈𝗇? 𝖱𝖾𝗉𝗅𝗒 𝖼𝗈𝗋𝖾 𝗇𝗂𝗃𝖾𝗋 𝗃𝗈𝗇𝗇𝗈 𝖧𝖺𝗇`, threadID, (err, info) => {
                    if (err) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                        return;
                    }
                    global.client.handleReply.push({
                        type: "characters",
                        name: this.config.name,
                        author: senderID,
                        messageID: info.messageID
                    });
                }, messageID);
            }
        } catch (error) {
            console.error("💥 𝖥𝖻𝖼𝗈𝗏𝖾𝗋 𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    onReply: async function({ api, event, handleReply }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("request");
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗋𝖾𝗊𝗎𝖾𝗌𝗍, 𝖺𝗇𝖽 𝖺𝗑𝗂𝗈𝗌.", event.threadID, event.messageID);
            }

            const { threadID, messageID, senderID, body } = event;
            
            if (handleReply.author !== senderID) {
                return api.sendMessage("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝖾𝗍 𝗍𝗁𝖾 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝗎𝗌𝖾𝗋 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾.", threadID, messageID);
            }
        
            let userInfo;
            try {
                userInfo = await api.getUserInfo(senderID);
            } catch (userError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", userError);
                return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.", threadID, messageID);
            }

            const nameSender = userInfo[senderID]?.name || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
            const arraytag = [{ id: senderID, tag: nameSender }];
            
            switch (handleReply.type) {
                case "characters": {
                    try {
                        await api.unsendMessage(handleReply.messageID);
                    } catch (unsendError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                    
                    api.sendMessage(`📛 | 𝖱𝖾𝗉𝗅𝗒 𝖼𝗈𝗋𝖾 𝗇𝗂𝗃𝖾𝗋 𝗉𝗋𝗂𝗆𝖺𝗋𝗒 𝗇𝖺𝗆𝖾 𝗅𝗂𝗄𝗁𝖺𝗇`, threadID, (err, info) => {
                        if (err) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                            return;
                        }
                        global.client.handleReply.push({
                            type: "subname",
                            name: "fbcover",
                            author: senderID,
                            characters: body,
                            messageID: info.messageID
                        });
                    }, messageID);
                    break;
                }
                
                case "subname": {
                    try {
                        await api.unsendMessage(handleReply.messageID);
                    } catch (unsendError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                    
                    api.sendMessage(`✅ | 𝖠𝗉𝗇𝗂 𝖾𝗋 𝗉𝗋𝗂𝗆𝖺𝗋𝗒 𝗇𝖺𝗆𝖾: ${body}\n📛 | 𝖱𝖾𝗉𝗅𝗒 𝖼𝗈𝗋𝖾 𝗇𝗂𝗃𝖾𝗋 𝗌𝖾𝖼𝗈𝗇𝖽𝖺𝗋𝗒 𝗇𝖺𝗆𝖾 𝗅𝗂𝗄𝗁𝖺𝗇`, threadID, (err, info) => {
                        if (err) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                            return;
                        }
                        global.client.handleReply.push({
                            type: "number",
                            name: "fbcover",
                            author: senderID,
                            characters: handleReply.characters,
                            name_s: body,
                            messageID: info.messageID
                        });
                    }, messageID);
                    break;
                }
                
                case "number": {
                    try {
                        await api.unsendMessage(handleReply.messageID);
                    } catch (unsendError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                    
                    api.sendMessage(`✅ | 𝖠𝗉𝗇𝗂 𝖾𝗋 𝗌𝖾𝖼𝗈𝗇𝖽𝖺𝗋𝗒 𝗇𝖺𝗆𝖾: ${body}\n📞 | 𝖱𝖾𝗉𝗅𝗒 𝖼𝗈𝗋𝖾 𝗇𝗂𝗃𝖾𝗋 𝗉𝗁𝗈𝗇𝖾 𝗇𝗎𝗆𝖻𝖾𝗋 𝗅𝗂𝗄𝗁𝖺𝗇`, threadID, (err, info) => {
                        if (err) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                            return;
                        }
                        global.client.handleReply.push({
                            type: "address",
                            name: "fbcover",
                            author: senderID,
                            characters: handleReply.characters,
                            subname: body,
                            name_s: handleReply.name_s,
                            messageID: info.messageID
                        });
                    }, messageID);
                    break;
                }
                
                case "address": {
                    try {
                        await api.unsendMessage(handleReply.messageID);
                    } catch (unsendError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                    
                    api.sendMessage(`✅ | 𝖠𝗉𝗇𝗂 𝖾𝗋 𝗉𝗁𝗈𝗇𝖾 𝗇𝗎𝗆𝖻𝖾𝗋: ${body}\n🏠 | 𝖱𝖾𝗉𝗅𝗒 𝖼𝗈𝗋𝖾 𝗇𝗂𝗃𝖾𝗋 𝖺𝖽𝖽𝗋𝖾𝗌𝗌 𝗅𝗂𝗄𝗁𝖺𝗇`, threadID, (err, info) => {
                        if (err) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                            return;
                        }
                        global.client.handleReply.push({
                            type: "email",
                            name: "fbcover",
                            author: senderID,
                            characters: handleReply.characters,
                            subname: handleReply.subname,
                            number: body,
                            name_s: handleReply.name_s,
                            messageID: info.messageID
                        });
                    }, messageID);
                    break;
                }
                
                case "email": {
                    try {
                        await api.unsendMessage(handleReply.messageID);
                    } catch (unsendError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                    
                    api.sendMessage(`✅ | 𝖠𝗉𝗇𝗂 𝖾𝗋 𝖺𝖽𝖽𝗋𝖾𝗌𝗌: ${body}\n📧 | 𝖱𝖾𝗉𝗅𝗒 𝖼𝗈𝗋𝖾 𝗇𝗂𝗃𝖾𝗋 𝖾𝗆𝖺𝗂𝗅 𝗅𝗂𝗄𝗁𝖺𝗇`, threadID, (err, info) => {
                        if (err) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                            return;
                        }
                        global.client.handleReply.push({
                            type: "color",
                            name: "fbcover",
                            author: senderID,
                            characters: handleReply.characters,
                            subname: handleReply.subname,
                            number: handleReply.number,
                            address: body,
                            name_s: handleReply.name_s,
                            messageID: info.messageID
                        });
                    }, messageID);
                    break;
                }
                
                case "color": {
                    try {
                        await api.unsendMessage(handleReply.messageID);
                    } catch (unsendError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                    
                    api.sendMessage(`✅ | 𝖠𝗉𝗇𝗂 𝖾𝗋 𝖾𝗆𝖺𝗂𝗅: ${body}\n🎨 | 𝖱𝖾𝗉𝗅𝗒 𝖼𝗈𝗋𝖾 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝖼𝗈𝗅𝗈𝗋 𝖾𝗋 𝗇𝖺𝗆 𝗅𝗂𝗄𝗁𝖺𝗇 - 𝖩𝗈𝖽𝗂 𝗇𝖺 𝖼𝗁𝖺𝗂𝗅𝖾 "𝗇𝗈" 𝗅𝗂𝗄𝗁𝖺𝗇`, threadID, (err, info) => {
                        if (err) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                            return;
                        }
                        global.client.handleReply.push({
                            type: "create",
                            name: "fbcover",
                            author: senderID,
                            characters: handleReply.characters,
                            subname: handleReply.subname,
                            number: handleReply.number,
                            address: handleReply.address,
                            email: body,
                            name_s: handleReply.name_s,
                            messageID: info.messageID
                        });
                    }, messageID);
                    break;
                }
                
                case "create": {
                    const { characters, name_s, subname, number, address, email } = handleReply;
                    const color = body;
                    const uid = senderID;
                    
                    try {
                        await api.unsendMessage(handleReply.messageID);
                    } catch (unsendError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                    
                    api.sendMessage(`🔄 | 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝗂𝗇𝗀...`, threadID, async (err, info) => {
                        if (err) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                            return;
                        }
                        
                        setTimeout(async () => {
                            try {
                                await api.unsendMessage(info.messageID);
                            } catch (unsendError) {
                                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                            }
                            
                            const cacheDir = path.join(__dirname, "cache");
                            const filePath = path.join(cacheDir, `fbcover_${Date.now()}.png`);
                            
                            try {
                                await fs.ensureDir(cacheDir);
                            } catch (dirError) {
                                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                                return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.", threadID, messageID);
                            }
                            
                            const callback = () => {
                                try {
                                    api.sendMessage({
                                        body: `✨ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽!\n\n👤 𝖲𝖾𝗇𝖽𝖾𝗋 𝖭𝖺𝗆𝖾: ${nameSender}\n📛 𝖭𝖺𝗆𝖾: ${name_s}\n🔖 𝖲𝗎𝖻 𝖭𝖺𝗆𝖾: ${subname}\n🆔 𝖨𝖣: ${uid}\n🎨 𝖢𝗈𝗅𝗈𝗋: ${color}\n🏠 𝖠𝖽𝖽𝗋𝖾𝗌𝗌: ${address}\n📧 𝖤𝗆𝖺𝗂𝗅: ${email}\n📞 𝖯𝗁𝗈𝗇𝖾: ${number}`,
                                        mentions: arraytag,
                                        attachment: fs.createReadStream(filePath)
                                    }, threadID, async () => {
                                        try {
                                            if (await fs.pathExists(filePath)) {
                                                await fs.unlink(filePath);
                                            }
                                        } catch (cleanupError) {
                                            console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                                        }
                                    }, messageID);
                                } catch (sendError) {
                                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗋𝖾𝗌𝗎𝗅𝗍:", sendError);
                                }
                            };
                            
                            const apiUrl = encodeURI(`https://api.phamvandien.xyz/fbcover/v1?name=${name_s}&uid=${uid}&address=${address}&email=${email}&subname=${subname}&sdt=${number}&color=${color}&apikey=KeyTest`);
                            
                            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗋𝗈𝗆: ${apiUrl}`);
                            
                            try {
                                request(apiUrl)
                                    .pipe(fs.createWriteStream(filePath))
                                    .on('close', callback)
                                    .on('error', (err) => {
                                        console.error("❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖤𝗋𝗋𝗈𝗋:", err);
                                        api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖼𝗈𝗏𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", threadID, messageID);
                                    });
                            } catch (requestError) {
                                console.error("❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝖤𝗋𝗋𝗈𝗋:", requestError);
                                api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖼𝗈𝗏𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", threadID, messageID);
                            }
                        }, 1000);
                    }, messageID);
                    break;
                }
            }
        } catch (error) {
            console.error("💥 𝖥𝖻𝖼𝗈𝗏𝖾𝗋 𝖱𝖾𝗉𝗅𝗒 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
