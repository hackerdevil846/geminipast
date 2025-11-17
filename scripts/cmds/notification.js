const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "1.8",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "Gửi thông báo từ admin đến all box",
			en: "Send notification from admin to all box"
		},
		category: "owner",
		guide: {
			en: "{pn} <message>"
		},
		envConfig: {
			delayPerGroup: 500
		}
	},

	langs: {
		vi: {
			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả các nhóm",
			notification: "Thông báo từ admin bot đến tất cả nhóm chat (không phản hồi tin nhắn này)",
			sendingNotification: "Bắt đầu gửi thông báo từ admin bot đến %1 nhóm chat",
			sentNotification: "✅ Đã gửi thông báo đến %1 nhóm thành công",
			errorSendingNotification: "Có lỗi xảy ra khi gửi đến %1 nhóm:\n%2"
		},
		en: {
			missingMessage: "Please enter the message you want to send to all groups",
			notification: "📢 Notification from admin bot to all chat groups\n⚠️ Please do not reply to this message\n────────────────",
			sendingNotification: "🔄 Starting to send notification to %1 chat groups...",
			sentNotification: "✅ Successfully sent notification to %1 groups",
			errorSendingNotification: "❌ Error occurred while sending to %1 groups:\n%2",
			noGroupsFound: "❌ No active groups found to send notification"
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
		try {
			const { delayPerGroup } = envCommands[commandName];
			
			if (!args[0]) {
				return message.reply(getLang("missingMessage"));
			}

			// Prepare message with attachments
			const formSend = {
				body: `${getLang("notification")}\n${args.join(" ")}`,
				attachment: await getStreamsFromAttachment(
					[
						...event.attachments,
						...(event.messageReply?.attachments || [])
					].filter(item => item && ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
				)
			};

			// Get all threads where bot is present
			let allThreads;
			try {
				allThreads = await threadsData.getAll();
			} catch (error) {
				console.error("Error getting threads data:", error);
				return message.reply("❌ Failed to retrieve groups data");
			}

			// Filter active groups where bot is member
			const allThreadID = allThreads.filter(t => {
				if (!t || !t.isGroup) return false;
				if (!t.members) return false;
				
				const botMember = t.members.find(m => m && m.userID == api.getCurrentUserID());
				return botMember && botMember.inGroup === true;
			});

			if (allThreadID.length === 0) {
				return message.reply(getLang("noGroupsFound"));
			}

			await message.reply(getLang("sendingNotification", allThreadID.length));

			let sendSucces = 0;
			const sendError = [];
			const wattingSend = [];

			// Send messages with better error handling
			for (const thread of allThreadID) {
				const tid = thread.threadID;
				if (!tid) continue;

				try {
					wattingSend.push({
						threadID: tid,
						pending: api.sendMessage(formSend, tid)
					});
					
					// Delay between sends to avoid rate limiting
					if (delayPerGroup > 0) {
						await new Promise(resolve => setTimeout(resolve, delayPerGroup));
					}
				}
				catch (e) {
					console.error(`Failed to queue message for thread ${tid}:`, e.message);
					sendError.push({
						threadIDs: [tid],
						errorDescription: `Initial queue failed: ${e.message}`
					});
				}
			}

			// Process all sent messages
			for (const sended of wattingSend) {
				try {
					await sended.pending;
					sendSucces++;
					
					// Small delay between processing results
					await new Promise(resolve => setTimeout(resolve, 100));
				}
				catch (e) {
					const errorDescription = e.message || "Unknown error";
					
					// Check if this error already exists
					const existingError = sendError.find(item => item.errorDescription === errorDescription);
					if (existingError) {
						existingError.threadIDs.push(sended.threadID);
					} else {
						sendError.push({
							threadIDs: [sended.threadID],
							errorDescription: errorDescription
						});
					}
				}
			}

			// Prepare result message
			let msg = "";
			if (sendSucces > 0) {
				msg += getLang("sentNotification", sendSucces) + "\n";
			}
			
			if (sendError.length > 0) {
				const totalErrorGroups = sendError.reduce((a, b) => a + b.threadIDs.length, 0);
				const errorDetails = sendError.map(error => 
					`\n - ${error.errorDescription}\n   Affected groups: ${error.threadIDs.length}`
				).join("");
				
				msg += getLang("errorSendingNotification", totalErrorGroups, errorDetails);
			}

			// Send final result
			await message.reply(msg || "No results to report");

		} catch (error) {
			console.error("Notification command error:", error);
			await message.reply("❌ An unexpected error occurred while processing notification command");
		}
	}
};
