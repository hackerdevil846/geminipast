const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "ASIF",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			welcomeMessage: "Thank you for inviting me to the group!\nBot prefix: %1\nTo view the list of commands, please enter: %1help",
			multiple1: "you",
			multiple2: "you guys",
			defaultWelcomeMessage: `‎‎‎‎‎‎‎‎‎‎‎‎‎‎🔻 ༒ 𝑊𝐸𝐿𝐿𝐶𝑂𝑀𝐸✨
             ❥𝑁𝑒𝑤 𝐹𝑟𝑖𝑒𝑛𝑑❤
╔══•ೋೋ•══╗ 
🌻আসসালামু আলাইকুম 🌻

{boxName}

গ্রুপের এর পক্ষ থেকে জানাই আন্তরিক অভিনন্দন ও বুক ভরা ভালবাসা 🥰🥰🥳🥳🥳🥳🌼 🥀🥀࿇⃝⃝❄➤⃟  ♥⃪⃝   
                 আমাদের গ্ৰুপের
 পক্ষ থেকে আপনাকে জানাই হাজার ও লাল গোলাপ 🌹 শুভেচ্ছা 
             ভালোবাসা অভিরাম_🥀

༄❉͜͡𖣔🤍💓💙🤎💘🤍💓💙💘🤍💓💙💘🤍💓💙💘•★♡⸙

  💕🍃🌹🍃💕			ⵗⵗ̥̥̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ ⵗ̥̥̥̥̥̥̥̥̥̥̥ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̊̊
💕.•°\`°•.¸.•°\`°•.💕	
💕(  𝙒𝙀𝙇𝘾𝙊𝙈   ) 💕
💕•.¸   💗   ¸.• 💕
     💕° •.¸¸.•° 💕  			ⵗⵗ̥̥̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ ⵗ̥̥̥̥̥̥̥̥̥̥̥ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̊̊
           💕💕 
             💕  💕
┌────♣─────┐
   {userNameTag}  
└────♣─────┘
         🌹🍃🌹🍃
      𝙒𝙀𝙇𝘾𝙊𝙈𝙀 
　　   ┊┊┊┊┊      
　  　 ┊┊┊┊💚  
　　   ┊┊┊💚    
　　   ┊┊💚         
　　   ┊💚          
　　  💚`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType === "log:subscribe") {
			const hours = getTime("HH");
			const { threadID } = event;
			const { nickNameBot } = global.GoatBot.config;
			const prefix = global.utils.getPrefix(threadID);
			const dataAddedParticipants = event.logMessageData.addedParticipants;
			
			// If new member is bot
			if (dataAddedParticipants.some((item) => item.userFbId === api.getCurrentUserID())) {
				if (nickNameBot) {
					api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
				}
				return message.send(getLang("welcomeMessage", prefix));
			}
			
			// If new member:
			if (!global.temp.welcomeEvent[threadID]) {
				global.temp.welcomeEvent[threadID] = {
					joinTimeout: null,
					dataAddedParticipants: []
				};
			}

			// Push new member to array
			global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
			
			// If timeout is set, clear it
			clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

			// Set new timeout
			global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
				const threadData = await threadsData.get(threadID);
				if (threadData.settings.sendWelcomeMessage === false) {
					return;
				}
				
				const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
				const dataBanned = threadData.data.banned_ban || [];
				const threadName = threadData.threadName;
				const userName = [];
				const mentions = [];
				let multiple = false;

				if (dataAddedParticipants.length > 1) {
					multiple = true;
				}

				for (const user of dataAddedParticipants) {
					if (dataBanned.some((item) => item.id === user.userFbId)) {
						continue;
					}
					userName.push(user.fullName);
					mentions.push({
						tag: user.fullName,
						id: user.userFbId
					});
				}

				if (userName.length === 0) return;
				
				let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
				const form = {
					mentions: welcomeMessage.includes("{userNameTag}") ? mentions : null
				};

				welcomeMessage = welcomeMessage
					.replace(/\{userName\}/g, userName.join(", "))
					.replace(/\{userNameTag\}/g, userName.join(", "))
					.replace(/\{boxName\}/g, threadName)
					.replace(/\{threadName\}/g, threadName)
					.replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
					.replace(/\{session\}/g, 
						hours <= 10 ? getLang("session1") :
						hours <= 12 ? getLang("session2") :
						hours <= 18 ? getLang("session3") : getLang("session4")
					);

				form.body = welcomeMessage;

				if (threadData.data.welcomeAttachment) {
					const files = threadData.data.welcomeAttachment;
					const attachments = files.reduce((acc, file) => {
						acc.push(drive.getFile(file, "stream"));
						return acc;
					}, []);
					
					const attachmentResults = await Promise.allSettled(attachments);
					form.attachment = attachmentResults
						.filter(({ status }) => status === "fulfilled")
						.map(({ value }) => value);
				}
				
				await message.send(form);
				delete global.temp.welcomeEvent[threadID];
			}, 1500);
		}
	}
};
