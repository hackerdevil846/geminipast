module.exports = {
    config: {
        name: "tempemail",
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "utility",
        shortDescription: {
            en: "10-𝑚𝑖𝑛𝑢𝑡𝑒 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑒𝑚𝑎𝑖𝑙"
        },
        longDescription: {
            en: "𝐺𝑒𝑡 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 10-𝑚𝑖𝑛𝑢𝑡𝑒 𝑒𝑚𝑎𝑖𝑙 𝑎𝑑𝑑𝑟𝑒𝑠𝑠𝑒𝑠 𝑓𝑜𝑟 𝑞𝑢𝑖𝑐𝑘 𝑡𝑒𝑠𝑡𝑖𝑛𝑔"
        },
        guide: {
            en: "{𝑝}𝑡𝑒𝑚𝑝𝑒𝑚𝑎𝑖𝑙 [𝑛𝑒𝑤|𝑙𝑖𝑠𝑡|𝑚𝑜𝑟𝑒|𝑔𝑒𝑡|𝑐ℎ𝑒𝑐𝑘]"
        }
    },

    onStart: async function ({ event, message, args }) {
        try {
            const axios = require('axios');
            
            if (args[0] == "new") {
                const res = await axios.get(`https://10minutemail.net/address.api.php?new=1`);
                var user = res.data.mail_get_user;
                var host = res.data.mail_get_host;
                var time = res.data.mail_get_time;
                var stime = res.data.mail_server_time;
                var kmail = res.data.mail_get_key;
                var ltime = res.data.mail_left_time;
                var mid = res.data.mail_list[0].mail_id;
                var sub = res.data.mail_list[0].subject;
                var date = res.data.mail_list[0].datetime2;
                
                return message.reply(`» 𝑀𝑎𝑖𝑙 𝑛𝑎𝑚𝑒: ${user}\n» 𝐻𝑜𝑠𝑡: ${host}\n» 𝐸𝑚𝑎𝑖𝑙: ${user}@${host} (.)𝑐𝑜𝑚\n» 𝑇𝑖𝑚𝑒: ${time}\n» 𝑆𝑒𝑟𝑣𝑒𝑟 𝑡𝑖𝑚𝑒: ${stime}\n» 𝐾𝑒𝑦: ${kmail}\n» 𝑇𝑖𝑚𝑒 𝑙𝑒𝑓𝑡: ${ltime}𝑠\n» 𝑀𝑎𝑖𝑙 𝐼𝐷: ${mid}\n» 𝑆𝑢𝑏𝑗𝑒𝑐𝑡: ${sub}\n» 𝐷𝑎𝑡𝑒: ${date}`);
            }
            else if (args[0] == "list") {
                const res = await axios.get(`https://www.phamvandienofficial.xyz/mail10p/domain`);
                var list = res.data.domain;
                return message.reply(`𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑑𝑜𝑚𝑎𝑖𝑛𝑠: \n${list}`);
            }
            else if (args[0] == "more") {
                const res = await axios.get(`https://10minutemail.net/address.api.php?more=1`);
                var user = res.data.mail_get_user;
                var host = res.data.mail_get_host;
                var time = res.data.mail_get_time;
                var stime = res.data.mail_server_time;
                var kmail = res.data.mail_get_key;
                var ltime = res.data.mail_left_time;
                var mid = res.data.mail_list[0].mail_id;
                var sub = res.data.mail_list[0].subject;
                var date = res.data.mail_list[0].datetime2;
                
                return message.reply(`» 𝑀𝑎𝑖𝑙 𝑛𝑎𝑚𝑒: ${user}\n» 𝐻𝑜𝑠𝑡: ${host}\n» 𝐸𝑚𝑎𝑖𝑙: ${user}@${host} (.)𝑐𝑜𝑚\n» 𝑇𝑖𝑚𝑒: ${time}\n» 𝑆𝑒𝑟𝑣𝑒𝑟 𝑡𝑖𝑚𝑒: ${stime}\n» 𝐾𝑒𝑦: ${kmail}\n» 𝑇𝑖𝑚𝑒 𝑙𝑒𝑓𝑡: ${ltime}𝑠\n» 𝑀𝑎𝑖𝑙 𝐼𝐷: ${mid}\n» 𝑆𝑢𝑏𝑗𝑒𝑐𝑡: ${sub}\n» 𝐷𝑎𝑡𝑒: ${date}`);
            }
            else if (args[0] == "get") {
                var get = await axios.get(`https://10minutemail.net/address.api.php`);
                var data = get.data;
                var mail = data.mail_get_mail;
                var id = data.session_id;
                var url = data.permalink.url;
                var key_mail = data.permalink.key;
                let urlMail = url.replace(/\./g,' . ');
                let maill = mail.replace(/\./g,' . ');
                
                return message.reply(`» 𝐸𝑚𝑎𝑖𝑙: ${maill}\n» 𝑀𝑎𝑖𝑙 𝐼𝐷: ${id}\n» 𝑈𝑅𝐿: ${urlMail}\n» 𝐴𝑐𝑐𝑒𝑠𝑠 𝑘𝑒𝑦: ${key_mail}`);
            }
            else if (args[0] == "check") {
                var get = await axios.get(`https://10minutemail.net/address.api.php`);
                var data = get.data.mail_list[0];
                var email = get.data.mail_get_mail;
                var id = data.mail_id;
                var from = data.from;
                var subject = data.subject;
                var time = data.datetime2;
                let formMail = from.replace(/\./g,' . ');
                let maill = email.replace(/\./g,' . ');
                
                return message.reply(`» 𝐸𝑚𝑎𝑖𝑙: ${maill}\n» 𝑀𝑎𝑖𝑙 𝐼𝐷: ${id}\n» 𝑆𝑒𝑛𝑑𝑒𝑟: ${formMail}\n» 𝑆𝑢𝑏𝑗𝑒𝑐𝑡: ${subject}\n» 𝑇𝑖𝑚𝑒: ${time}`);
            }
            else {
                return message.reply(`𝑁𝐸𝑊 - 𝐶𝑟𝑒𝑎𝑡𝑒 𝑛𝑒𝑤 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑒𝑚𝑎𝑖𝑙 \n
𝐶𝐻𝐸𝐶𝐾 - 𝐶ℎ𝑒𝑐𝑘 𝑖𝑛𝑏𝑜𝑥 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 \n
𝐺𝐸𝑇 - 𝐺𝑒𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑒𝑚𝑎𝑖𝑙 𝑑𝑒𝑡𝑎𝑖𝑙𝑠 \n
𝐿𝐼𝑆𝑇 - 𝑉𝑖𝑒𝑤 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑑𝑜𝑚𝑎𝑖𝑛𝑠 \n
𝑀𝑂𝑅𝐸 - 𝐺𝑒𝑡 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑒𝑚𝑎𝑖𝑙 \n
-------------------------\n\n
𝑌𝑜𝑢 𝑐𝑎𝑛 𝑐𝑙𝑖𝑐𝑘 𝑜𝑛 𝑡ℎ𝑒 𝑒𝑚𝑎𝑖𝑙 𝑈𝑅𝐿 𝑎𝑛𝑑 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑎𝑐𝑐𝑒𝑠𝑠 𝑘𝑒𝑦 𝑡𝑜 𝑣𝑖𝑒𝑤 𝑒𝑚𝑎𝑖𝑙 𝑐𝑜𝑛𝑡𝑒𝑛𝑡.`);
            }
            
        } catch (error) {
            console.error("𝑇𝑒𝑚𝑝 𝑒𝑚𝑎𝑖𝑙 𝑒𝑟𝑟𝑜𝑟:", error);
            return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑎𝑐𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑚𝑎𝑖𝑙 𝑠𝑒𝑟𝑣𝑖𝑐𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
