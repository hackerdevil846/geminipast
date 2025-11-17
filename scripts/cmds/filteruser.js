function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
	config: {
		name: "filteruser",
		version: "1.6",
		author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
		countDown: 5,
		role: 1,
		description: {
			en: "𝖿𝗂𝗅𝗍𝖾𝗋 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖻𝗒 𝗇𝗎𝗆𝖻𝖾𝗋 𝗈𝖿 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌 𝗈𝗋 𝗅𝗈𝖼𝗄𝖾𝖽 𝖺𝖼𝖼𝗈𝗎𝗇𝗍𝗌"
		},
		category: "𝗴𝗿𝗼𝘂𝗽 𝗺𝗮𝗻𝗮𝗴𝗲𝗺𝗲𝗻𝘁",
		guide: {
			en: "   {pn} [<𝗇𝗎𝗆𝖻𝖾𝗋 𝗈𝖿 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌> | 𝖽𝗂𝖾]\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾:\n   {pn} 10 - 𝖱𝖾𝗆𝗈𝗏𝖾 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗅𝖾𝗌𝗌 𝗍𝗁𝖺𝗇 10 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌\n   {pn} 𝖽𝗂𝖾 - 𝖱𝖾𝗆𝗈𝗏𝖾 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗅𝗈𝖼𝗄𝖾𝖽 𝖺𝖼𝖼𝗈𝗎𝗇𝗍𝗌"
		},
		dependencies: {
			"fs-extra": ""
		}
	},

	langs: {
		en: {
			needAdmin: "⚠️ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝖽𝖽 𝗍𝗁𝖾 𝖻𝗈𝗍 𝖺𝗌 𝖺 𝗀𝗋𝗈𝗎𝗉 𝖺𝖽𝗆𝗂𝗇 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽",
			confirm: "⚠️ 𝖠𝗋𝖾 𝗒𝗈𝗎 𝗌𝗎𝗋𝖾 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗅𝖾𝗌𝗌 𝗍𝗁𝖺𝗇 %1 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌?\n\n𝗥𝗲𝗮𝗰𝘁 𝘁𝗼 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺",
			kickByBlock: "✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗋𝖾𝗆𝗈𝗏𝖾𝖽 %1 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗅𝗈𝖼𝗄𝖾𝖽 𝖺𝖼𝖼𝗈𝗎𝗇𝗍𝗌",
			kickByMsg: "✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗋𝖾𝗆𝗈𝗏𝖾𝖽 %1 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗅𝖾𝗌𝗌 𝗍𝗁𝖺𝗇 %2 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌",
			kickError: "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝖺𝗇𝖽 𝖼𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗋𝖾𝗆𝗈𝗏𝖾 %1 𝗆𝖾𝗆𝖻𝖾𝗋𝗌:\n%2",
			noBlock: "✅ 𝖳𝗁𝖾𝗋𝖾 𝖺𝗋𝖾 𝗇𝗈 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗅𝗈𝖼𝗄𝖾𝖽 𝖺𝖼𝖼𝗈𝗎𝗇𝗍𝗌",
			noMsg: "✅ 𝖳𝗁𝖾𝗋𝖾 𝖺𝗋𝖾 𝗇𝗈 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗅𝖾𝗌𝗌 𝗍𝗁𝖺𝗇 %1 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌",
			invalidNumber: "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋 𝗈𝖿 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌",
			noPermission: "❌ 𝖸𝗈𝗎 𝖽𝗈 𝗇𝗈𝗍 𝗁𝖺𝗏𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽",
			processing: "⏳ 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀... 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍"
		}
	},

	onStart: async function ({ api, args, threadsData, message, event, commandName, getLang }) {
		try {
			// Dependency check
			let fsAvailable = true;
			try {
				require("fs-extra");
			} catch (e) {
				fsAvailable = false;
			}

			if (!fsAvailable) {
				return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
			}

			// Check if user is admin
			const threadData = await threadsData.get(event.threadID);
			const userID = event.senderID;
			
			if (!threadData.adminIDs || !threadData.adminIDs.some(admin => admin.id === userID)) {
				return message.reply(getLang("noPermission"));
			}

			// Check if bot is admin
			const botID = api.getCurrentUserID();
			if (!threadData.adminIDs.some(admin => admin.id === botID)) {
				return message.reply(getLang("needAdmin"));
			}

			// Validate arguments
			if (args.length === 0) {
				return message.SyntaxError();
			}

			if (!isNaN(args[0])) {
				const messageCount = Number(args[0]);
				
				if (messageCount < 0) {
					return message.reply(getLang("invalidNumber"));
				}

				if (messageCount === 0) {
					return message.reply("❌ 𝖢𝖺𝗇𝗇𝗈𝗍 𝗌𝖾𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖼𝗈𝗎𝗇𝗍 𝗍𝗈 𝗓𝖾𝗋𝗈");
				}

				const confirmMessage = await message.reply(getLang("confirm", messageCount));
				
				// Store reaction data with enhanced error handling
				try {
					if (global.GoatBot && global.GoatBot.onReaction) {
						global.GoatBot.onReaction.set(confirmMessage.messageID, {
							author: event.senderID,
							messageID: confirmMessage.messageID,
							minimum: messageCount,
							commandName: commandName,
							timestamp: Date.now()
						});
					} else {
						console.error("❌ 𝖦𝗅𝗈𝖻𝖺𝗅 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
						return message.reply("❌ 𝖲𝗒𝗌𝗍𝖾𝗆 𝖾𝗋𝗋𝗈𝗋: 𝖱𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝗇𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾");
					}
				} catch (reactionError) {
					console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗉 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError);
					return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗎𝗉 𝖼𝗈𝗇𝖿𝗂𝗋𝗆𝖺𝗍𝗂𝗈𝗇");
				}

			} else if (args[0].toLowerCase() === "die") {
				const processingMsg = await message.reply(getLang("processing"));
				
				try {
					const threadInfo = await api.getThreadInfo(event.threadID);
					const membersBlocked = threadInfo.userInfo.filter(user => {
						// Filter users who are not regular users (blocked/deactivated accounts)
						return user.type !== "User" || user.isDeactivated;
					});
					
					const errors = [];
					const success = [];
					
					// Process each blocked member
					for (const user of membersBlocked) {
						try {
							// Skip if user is admin
							if (threadInfo.adminIDs.some(admin => admin.id === user.id)) {
								continue;
							}
							
							await api.removeUserFromGroup(user.id, event.threadID);
							success.push(user.id);
							console.log(`✅ 𝖱𝖾𝗆𝗈𝗏𝖾𝖽 𝗎𝗌𝖾𝗋 ${user.id}`);
						} catch (e) {
							const userName = user.name || user.id;
							errors.push(userName);
							console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 ${userName}:`, e.message);
						}
						await sleep(1000); // Increased delay for safety
					}

					let resultMessage = "";
					if (success.length > 0) {
						resultMessage += getLang("kickByBlock", success.length) + "\n";
					}
					if (errors.length > 0) {
						resultMessage += getLang("kickError", errors.length, errors.slice(0, 10).join("\n")) + "\n";
						if (errors.length > 10) {
							resultMessage += `... 𝖺𝗇𝖽 ${errors.length - 10} 𝗆𝗈𝗋𝖾\n`;
						}
					}
					if (resultMessage === "") {
						resultMessage = getLang("noBlock");
					}

					await api.unsendMessage(processingMsg.messageID);
					await message.reply(resultMessage);

				} catch (threadError) {
					console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
					await api.unsendMessage(processingMsg.messageID);
					return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇");
				}

			} else {
				return message.SyntaxError();
			}

		} catch (error) {
			console.error("💥 𝖥𝗂𝗅𝗍𝖾𝗋𝗎𝗌𝖾𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
			await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
		}
	},

	onReaction: async function ({ api, Reaction, event, threadsData, message, getLang }) {
		try {
			// Validate reaction data
			if (!Reaction || event.userID !== Reaction.author) {
				return;
			}

			const { minimum = 1, messageID } = Reaction;
			
			if (minimum < 1) {
				return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖼𝗈𝗎𝗇𝗍");
			}

			const processingMsg = await message.reply(getLang("processing"));
			
			try {
				const threadData = await threadsData.get(event.threadID);
				const botID = api.getCurrentUserID();
				
				// Filter members with message count less than minimum
				const membersCountLess = threadData.members.filter(member =>
					member.count < minimum &&
					member.inGroup === true &&
					member.userID !== botID &&
					!threadData.adminIDs.some(admin => admin.id === member.userID)
				);

				const errors = [];
				const success = [];
				
				// Process each member
				for (const member of membersCountLess) {
					try {
						await api.removeUserFromGroup(member.userID, event.threadID);
						success.push(member.userID);
						console.log(`✅ 𝖱𝖾𝗆𝗈𝗏𝖾𝖽 𝗎𝗌𝖾𝗋 ${member.userID} (${member.count} 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌)`);
					} catch (e) {
						const userName = member.name || member.userID;
						errors.push(userName);
						console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 ${userName}:`, e.message);
					}
					await sleep(1000); // Increased delay for safety
				}

				let resultMessage = "";
				if (success.length > 0) {
					resultMessage += getLang("kickByMsg", success.length, minimum) + "\n";
				}
				if (errors.length > 0) {
					resultMessage += getLang("kickError", errors.length, errors.slice(0, 10).join("\n")) + "\n";
					if (errors.length > 10) {
						resultMessage += `... 𝖺𝗇𝖽 ${errors.length - 10} 𝗆𝗈𝗋𝖾\n`;
					}
				}
				if (resultMessage === "") {
					resultMessage = getLang("noMsg", minimum);
				}

				// Clean up reaction data
				try {
					if (global.GoatBot && global.GoatBot.onReaction) {
						global.GoatBot.onReaction.delete(messageID);
					}
				} catch (cleanupError) {
					console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝗐𝖺𝗋𝗇𝗂𝗇𝗀:", cleanupError.message);
				}

				await api.unsendMessage(processingMsg.messageID);
				await message.reply(resultMessage);

			} catch (filterError) {
				console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖿𝗂𝗅𝗍𝖾𝗋𝗂𝗇𝗀 𝗆𝖾𝗆𝖻𝖾𝗋𝗌:", filterError);
				await api.unsendMessage(processingMsg.messageID);
				await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝗂𝗅𝗍𝖾𝗋 𝗆𝖾𝗆𝖻𝖾𝗋𝗌");
			}

		} catch (error) {
			console.error("💥 𝖥𝗂𝗅𝗍𝖾𝗋𝗎𝗌𝖾𝗋 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
			await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇.");
		}
	}
};
