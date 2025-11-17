const { getTime } = global.utils;

module.exports = {
	config: {
		name: "thread",
		aliases: [],
		version: "2.1.0",
		author: "Asif Mahmud",
		countDown: 5,
		role: 2,
		category: "system",
		shortDescription: {
			en: "🛠️ Advanced thread management system"
		},
		longDescription: {
			en: "Comprehensive thread management with search, ban, unban, and info features"
		},
		guide: {
			en: "{p}thread [find/search] <name> - Search threads\n{p}thread [ban] [threadID] <reason> - Ban thread\n{p}thread [unban] [threadID] - Unban thread\n{p}thread [info] [threadID] - Get thread info\n{p}thread help - Show help"
		}
	},

	langs: {
		en: {
			noPermission: "❌ You don't have permission to use this feature",
			found: "🔍 Found %1 thread(s) matching: \"%2\"\n%3",
			notFound: "❌ No threads found matching: \"%1\"",
			hasBanned: "🚫 Thread [%1 | %2] is already banned\n» Reason: %3\n» Date: %4",
			banned: "🚫 Successfully banned thread [%1 | %2]\n» Reason: %3\n» Date: %4",
			notBanned: "✅ Thread [%1 | %2] is not banned",
			unbanned: "✅ Successfully unbanned thread [%1 | %2]",
			missingReason: "❌ Please provide a ban reason",
			invalidThreadID: "❌ Invalid thread ID",
			threadNotFound: "❌ Thread not found in database",
			info: "📊 Thread Information:\n\n» 🆔 ID: %1\n» 📛 Name: %2\n» 📅 Created: %3\n» 👥 Members: %4 total\n» 👨 Male: %5 members\n» 👩 Female: %6 members\n» 💬 Messages: %7%8",
			usage: "📝 Thread Management System\n\nUsage:\n• {p}thread find <name> - Search threads by name\n• {p}thread ban [threadID] <reason> - Ban thread with reason\n• {p}thread unban [threadID] - Unban thread\n• {p}thread info [threadID] - Get thread information\n• {p}thread help - Show this help\n\nExamples:\n• {p}thread find gaming group\n• {p}thread ban 1234567890 Spamming bot\n• {p}thread unban 1234567890\n• {p}thread info 1234567890"
		}
	},

	onStart: async function ({ args, threadsData, message, role, event, getLang, commandName }) {
		try {
			const action = args[0]?.toLowerCase();

			// Show help if no action specified or help requested
			if (!action || action === 'help' || action === '-h') {
				return message.reply(getLang("usage").replace(/{p}/g, commandName));
			}

			// Permission check for all actions except info
			if (action !== 'info' && role < 2) {
				return message.reply(getLang("noPermission"));
			}

			switch (action) {
				case "find":
				case "search":
				case "-f":
				case "-s": {
					if (args.length < 2) {
						return message.reply("❌ Please provide search keyword\nExample: {p}thread find gaming group".replace(/{p}/g, commandName));
					}

					const keyword = args.slice(1).join(" ").trim();
					if (!keyword || keyword.length < 2) {
						return message.reply("❌ Search keyword must be at least 2 characters long");
					}

					const allThreads = await threadsData.getAll();
					const matchingThreads = allThreads.filter(thread => {
						if (!thread.threadID || thread.threadID.length < 10 || !thread.threadName) {
							return false;
						}
						return thread.threadName.toLowerCase().includes(keyword.toLowerCase());
					});

					if (matchingThreads.length === 0) {
						return message.reply(getLang("notFound", keyword));
					}

					const resultText = matchingThreads
						.slice(0, 15) // Limit to 15 results for better readability
						.map((thread, index) => 
							`${index + 1}. ${thread.threadName || 'Unnamed Thread'} - ${thread.threadID}`
						)
						.join('\n');

					const moreText = matchingThreads.length > 15 ? 
						`\n\n... and ${matchingThreads.length - 15} more results` : '';

					return message.reply(getLang("found", matchingThreads.length, keyword, resultText + moreText));
				}

				case "ban":
				case "-b": {
					let threadID, reason;

					// Check if second argument is a valid thread ID
					if (args[1] && !isNaN(args[1]) && args[1].length >= 10) {
						threadID = args[1];
						reason = args.slice(2).join(" ").trim();
					} else {
						// Use current thread if no valid thread ID provided
						threadID = event.threadID;
						reason = args.slice(1).join(" ").trim();
					}

					if (!threadID || threadID.length < 10) {
						return message.reply(getLang("invalidThreadID"));
					}

					if (!reason) {
						return message.reply(getLang("missingReason"));
					}

					if (reason.length < 3) {
						return message.reply("❌ Ban reason must be at least 3 characters long");
					}

					// Validate thread exists
					let threadData;
					try {
						threadData = await threadsData.get(threadID);
					} catch (error) {
						return message.reply(getLang("threadNotFound"));
					}

					if (!threadData) {
						return message.reply(getLang("threadNotFound"));
					}

					const threadName = threadData.threadName || 'Unnamed Thread';
					
					// Check if already banned
					if (threadData.banned && threadData.banned.status === true) {
						return message.reply(getLang("hasBanned", 
							threadID, 
							threadName, 
							threadData.banned.reason || 'No reason provided',
							threadData.banned.date || 'Unknown date'
						));
					}

					// Ban the thread
					const banTime = getTime("DD/MM/YYYY HH:mm:ss");
					await threadsData.set(threadID, {
						banned: {
							status: true,
							reason: reason,
							date: banTime,
							bannedBy: event.senderID
						}
					});

					return message.reply(getLang("banned", threadID, threadName, reason, banTime));
				}

				case "unban":
				case "-u": {
					let threadID;

					// Check if thread ID provided
					if (args[1] && !isNaN(args[1]) && args[1].length >= 10) {
						threadID = args[1];
					} else {
						threadID = event.threadID;
					}

					if (!threadID || threadID.length < 10) {
						return message.reply(getLang("invalidThreadID"));
					}

					// Validate thread exists
					let threadData;
					try {
						threadData = await threadsData.get(threadID);
					} catch (error) {
						return message.reply(getLang("threadNotFound"));
					}

					if (!threadData) {
						return message.reply(getLang("threadNotFound"));
					}

					const threadName = threadData.threadName || 'Unnamed Thread';
					
					// Check if actually banned
					if (!threadData.banned || threadData.banned.status !== true) {
						return message.reply(getLang("notBanned", threadID, threadName));
					}

					// Unban the thread
					await threadsData.set(threadID, {
						banned: {
							status: false,
							reason: null,
							date: null,
							bannedBy: null
						}
					});

					return message.reply(getLang("unbanned", threadID, threadName));
				}

				case "info":
				case "-i": {
					let threadID;

					// Check if thread ID provided
					if (args[1] && !isNaN(args[1]) && args[1].length >= 10) {
						threadID = args[1];
					} else {
						threadID = event.threadID;
					}

					if (!threadID || threadID.length < 10) {
						return message.reply(getLang("invalidThreadID"));
					}

					// Get thread data
					let threadData;
					try {
						threadData = await threadsData.get(threadID);
					} catch (error) {
						return message.reply(getLang("threadNotFound"));
					}

					if (!threadData) {
						return message.reply(getLang("threadNotFound"));
					}

					const threadName = threadData.threadName || 'Unnamed Thread';
					const createdDate = threadData.createdAt ? 
						getTime(threadData.createdAt, "DD/MM/YYYY HH:mm:ss") : 
						'Unknown';
					
					// Calculate member statistics
					const members = threadData.members || {};
					const activeMembers = Object.values(members).filter(member => member && member.inGroup === true);
					const totalMembers = activeMembers.length;
					const maleMembers = activeMembers.filter(member => member.gender === "MALE").length;
					const femaleMembers = activeMembers.filter(member => member.gender === "FEMALE").length;
					const totalMessages = activeMembers.reduce((sum, member) => sum + (member.count || 0), 0);

					// Ban info if applicable
					let banInfo = "";
					if (threadData.banned && threadData.banned.status === true) {
						banInfo = `\n\n🚫 BANNED:\n» Reason: ${threadData.banned.reason || 'No reason provided'}\n» Date: ${threadData.banned.date || 'Unknown date'}`;
					}

					const infoMessage = getLang("info", 
						threadID,
						threadName,
						createdDate,
						totalMembers,
						maleMembers,
						femaleMembers,
						totalMessages.toLocaleString(),
						banInfo
					);

					return message.reply(infoMessage);
				}

				default: {
					return message.reply(getLang("usage").replace(/{p}/g, commandName));
				}
			}
		} catch (error) {
			console.error("Thread Command Error:", error);
			return message.reply("❌ An unexpected error occurred. Please try again later.");
		}
	}
};
