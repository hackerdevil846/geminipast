module.exports = {
    config: {
        name: "mail10p",
        aliases: [],
        version: "1.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 2,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖦𝖾𝗍 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 10-𝗆𝗂𝗇𝗎𝗍𝖾 𝗆𝖺𝗂𝗅"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖺𝗇𝖽 𝗆𝖺𝗇𝖺𝗀𝖾 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖾𝗆𝖺𝗂𝗅 𝖺𝖼𝖼𝗈𝗎𝗇𝗍𝗌 𝗍𝗁𝖺𝗍 𝖾𝗑𝗉𝗂𝗋𝖾 𝖺𝖿𝗍𝖾𝗋 10 𝗆𝗂𝗇𝗎𝗍𝖾𝗌"
        },
        guide: {
            en: "{p}mail10p [𝗇𝖾𝗐/𝗅𝗂𝗌𝗍/𝗆𝗈𝗋𝖾/𝗀𝖾𝗍/𝖼𝗁𝖾𝖼𝗄]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            const axios = require("axios");
            const action = args[0]?.toLowerCase() || "";

            // Show help if no action specified
            if (!action) {
                const helpMessage = 
                    "📧 𝟣𝟢-𝖬𝗂𝗇𝗎𝗍𝖾 𝖬𝖺𝗂𝗅 𝖧𝖾𝗅𝗉\n\n" +
                    "𝗇𝖾𝗐 - 𝖢𝗋𝖾𝖺𝗍𝖾 𝗇𝖾𝗐 𝗆𝖺𝗂𝗅\n" +
                    "𝖼𝗁𝖾𝖼𝗄 - 𝖢𝗁𝖾𝖼𝗄 𝗂𝗇𝖻𝗈𝗑\n" +
                    "𝗀𝖾𝗍 - 𝖦𝖾𝗍 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗆𝖺𝗂𝗅\n" +
                    "𝗅𝗂𝗌𝗍 - 𝖵𝗂𝖾𝗐 𝗆𝖺𝗂𝗅 𝗅𝗂𝗌𝗍\n" +
                    "𝗆𝗈𝗋𝖾 - 𝖠𝖽𝖽 𝗇𝖾𝗐 𝗆𝖺𝗂𝗅\n\n" +
                    "𝖸𝗈𝗎 𝖼𝖺𝗇 𝖼𝗅𝗂𝖼𝗄 𝗈𝗇 𝗍𝗁𝖾 𝗆𝖺𝗂𝗅 𝖴𝖱𝖫 𝖺𝗇𝖽 𝖾𝗇𝗍𝖾𝗋 𝗍𝗁𝖾 𝖬𝖺𝗂𝗅 𝖪𝖾𝗒 𝗍𝗈 𝗏𝗂𝖾𝗐 𝗆𝖺𝗂𝗅 𝖼𝗈𝗇𝗍𝖾𝗇𝗍.";
                
                return message.reply(helpMessage);
            }

            // Handle different actions
            switch (action) {
                case "new":
                    await this.handleNewMail(message, axios);
                    break;
                    
                case "list":
                    await this.handleListDomains(message, axios);
                    break;
                    
                case "more":
                    await this.handleMoreMail(message, axios);
                    break;
                    
                case "get":
                    await this.handleGetMail(message, axios);
                    break;
                    
                case "check":
                    await this.handleCheckMail(message, axios);
                    break;
                    
                default:
                    return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝖼𝗍𝗂𝗈𝗇! 𝖴𝗌𝖾: 𝗇𝖾𝗐, 𝗅𝗂𝗌𝗍, 𝗆𝗈𝗋𝖾, 𝗀𝖾𝗍, 𝗈𝗋 𝖼𝗁𝖾𝖼𝗄");
            }

        } catch (error) {
            console.error("💥 𝖬𝖺𝗂𝗅𝟣𝟢𝗉 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖾𝗑𝖾𝖼𝗎𝗍𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽!";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            } else if (error.response?.status === 404) {
                errorMessage = "❌ 𝖬𝖺𝗂𝗅 𝗌𝖾𝗋𝗏𝗂𝖼𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    },

    // Handle creating new mail
    handleNewMail: async function(message, axios) {
        try {
            const res = await axios.get(`https://10minutemail.net/address.api.php?new=1`, {
                timeout: 15000
            });
            
            if (!res.data) {
                throw new Error("𝖭𝗈 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨");
            }

            const { 
                mail_get_user: user, 
                mail_get_host: host, 
                mail_get_time: time,
                mail_server_time: stime,
                mail_get_key: kmail,
                mail_left_time: ltime,
                mail_list
            } = res.data;

            if (!user || !host) {
                throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖽𝖺𝗍𝖺 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
            }

            const mailInfo = mail_list?.[0] || {};
            
            const responseMessage = 
                "📧 𝖭𝖾𝗐 𝟣𝟢-𝖬𝗂𝗇𝗎𝗍𝖾 𝖬𝖺𝗂𝗅 𝖢𝗋𝖾𝖺𝗍𝖾𝖽\n\n" +
                `» 𝖬𝖺𝗂𝗅 𝗇𝖺𝗆𝖾: ${user}\n` +
                `» 𝖧𝗈𝗌𝗍: ${host}\n` +
                `» 𝖤𝗆𝖺𝗂𝗅: ${user}@${host}.𝖼𝗈𝗆\n` +
                `» 𝖳𝗂𝗆𝖾: ${time || '𝖭/𝖠'}\n` +
                `» 𝖲𝖾𝗋𝗏𝖾𝗋 𝗍𝗂𝗆𝖾: ${stime || '𝖭/𝖠'}\n` +
                `» 𝖪𝖾𝗒: ${kmail || '𝖭/𝖠'}\n` +
                `» 𝖳𝗂𝗆𝖾 𝗅𝖾𝖿𝗍: ${ltime || '𝖭/𝖠'}𝗌\n` +
                `» 𝖬𝖺𝗂𝗅 𝗂𝖽: ${mailInfo.mail_id || '𝖭/𝖠'}\n` +
                `» 𝖲𝗎𝖻𝗃𝖾𝖼𝗍: ${mailInfo.subject || '𝖭𝗈 𝗆𝖺𝗂𝗅𝗌'}\n` +
                `» 𝖣𝖺𝗍𝖾: ${mailInfo.datetime2 || '𝖭/𝖠'}`;

            await message.reply(responseMessage);

        } catch (error) {
            console.error("𝖭𝖾𝗐 𝖬𝖺𝗂𝗅 𝖤𝗋𝗋𝗈𝗋:", error);
            throw error;
        }
    },

    // Handle listing domains
    handleListDomains: async function(message, axios) {
        try {
            const res = await axios.get(`https://www.phamvandienofficial.xyz/mail10p/domain`, {
                timeout: 15000
            });
            
            if (!res.data || !res.data.domain) {
                throw new Error("𝖭𝗈 𝖽𝗈𝗆𝖺𝗂𝗇 𝗅𝗂𝗌𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾");
            }

            await message.reply(`🌐 𝖣𝗈𝗆𝖺𝗂𝗇 𝖫𝗂𝗌𝗍:\n${res.data.domain}`);

        } catch (error) {
            console.error("𝖫𝗂𝗌𝗍 𝖣𝗈𝗆𝖺𝗂𝗇𝗌 𝖤𝗋𝗋𝗈𝗋:", error);
            throw error;
        }
    },

    // Handle more mail
    handleMoreMail: async function(message, axios) {
        try {
            const res = await axios.get(`https://10minutemail.net/address.api.php?more=1`, {
                timeout: 15000
            });
            
            if (!res.data) {
                throw new Error("𝖭𝗈 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨");
            }

            const { 
                mail_get_user: user, 
                mail_get_host: host, 
                mail_get_time: time,
                mail_server_time: stime,
                mail_get_key: kmail,
                mail_left_time: ltime,
                mail_list
            } = res.data;

            const mailInfo = mail_list?.[0] || {};
            
            const responseMessage = 
                "📧 𝖠𝖽𝖽𝗂𝗍𝗂𝗈𝗇𝖺𝗅 𝖬𝖺𝗂𝗅 𝖨𝗇𝖿𝗈\n\n" +
                `» 𝖬𝖺𝗂𝗅 𝗇𝖺𝗆𝖾: ${user}\n` +
                `» 𝖧𝗈𝗌𝗍: ${host}\n` +
                `» 𝖤𝗆𝖺𝗂𝗅: ${user}@${host}.𝖼𝗈𝗆\n` +
                `» 𝖳𝗂𝗆𝖾: ${time || '𝖭/𝖠'}\n` +
                `» 𝖲𝖾𝗋𝗏𝖾𝗋 𝗍𝗂𝗆𝖾: ${stime || '𝖭/𝖠'}\n` +
                `» 𝖪𝖾𝗒: ${kmail || '𝖭/𝖠'}\n` +
                `» 𝖳𝗂𝗆𝖾 𝗅𝖾𝖿𝗍: ${ltime || '𝖭/𝖠'}𝗌\n` +
                `» 𝖬𝖺𝗂𝗅 𝗂𝖽: ${mailInfo.mail_id || '𝖭/𝖠'}\n` +
                `» 𝖲𝗎𝖻𝗃𝖾𝖼𝗍: ${mailInfo.subject || '𝖭𝗈 𝗆𝖺𝗂𝗅𝗌'}\n` +
                `» 𝖣𝖺𝗍𝖾: ${mailInfo.datetime2 || '𝖭/𝖠'}`;

            await message.reply(responseMessage);

        } catch (error) {
            console.error("𝖬𝗈𝗋𝖾 𝖬𝖺𝗂𝗅 𝖤𝗋𝗋𝗈𝗋:", error);
            throw error;
        }
    },

    // Handle get mail
    handleGetMail: async function(message, axios) {
        try {
            const res = await axios.get(`https://10minutemail.net/address.api.php`, {
                timeout: 15000
            });
            
            if (!res.data) {
                throw new Error("𝖭𝗈 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨");
            }

            const data = res.data;
            const mail = data.mail_get_mail || "𝖭/𝖠";
            const id = data.session_id || "𝖭/𝖠";
            const url = data.permalink?.url || "𝖭/𝖠";
            const key_mail = data.permalink?.key || "𝖭/𝖠";

            const responseMessage = 
                "📧 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝖬𝖺𝗂𝗅 𝖨𝗇𝖿𝗈\n\n" +
                `» 𝖤𝗆𝖺𝗂𝗅: ${mail}\n` +
                `» 𝖬𝖺𝗂𝗅 𝖨𝖣: ${id}\n` +
                `» 𝖬𝖺𝗂𝗅 𝖴𝖱𝖫: ${url}\n` +
                `» 𝖬𝖺𝗂𝗅 𝖪𝖾𝗒: ${key_mail}`;

            await message.reply(responseMessage);

        } catch (error) {
            console.error("𝖦𝖾𝗍 𝖬𝖺𝗂𝗅 𝖤𝗋𝗋𝗈𝗋:", error);
            throw error;
        }
    },

    // Handle check mail
    handleCheckMail: async function(message, axios) {
        try {
            const res = await axios.get(`https://10minutemail.net/address.api.php`, {
                timeout: 15000
            });
            
            if (!res.data) {
                throw new Error("𝖭𝗈 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨");
            }

            const data = res.data;
            const mailList = data.mail_list?.[0];
            const email = data.mail_get_mail || "𝖭/𝖠";

            if (!mailList) {
                return message.reply("📭 𝖭𝗈 𝗆𝖺𝗂𝗅𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝗂𝗇𝖻𝗈𝗑");
            }

            const responseMessage = 
                "📧 𝖬𝖺𝗂𝗅 𝖨𝗇𝖻𝗈𝗑\n\n" +
                `» 𝖤𝗆𝖺𝗂𝗅: ${email}\n` +
                `» 𝖬𝖺𝗂𝗅 𝖨𝖣: ${mailList.mail_id || '𝖭/𝖠'}\n` +
                `» 𝖥𝗋𝗈𝗆: ${mailList.from || '𝖭/𝖠'}\n` +
                `» 𝖲𝗎𝖻𝗃𝖾𝖼𝗍: ${mailList.subject || '𝖭/𝖠'}\n` +
                `» 𝖣𝖺𝗍𝖾: ${mailList.datetime2 || '𝖭/𝖠'}`;

            await message.reply(responseMessage);

        } catch (error) {
            console.error("𝖢𝗁𝖾𝖼𝗄 𝖬𝖺𝗂𝗅 𝖤𝗋𝗋𝗈𝗋:", error);
            throw error;
        }
    }
};
