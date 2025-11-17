module.exports = {
	config: {
		name: "autoUpdateThreadInfo",
		version: "1.4",
		author: "Asif Mahmud",
		category: "events"
	},
	onStart: async ({ threadsData, event, api }) => {
		try {
			const types = ["log:subscribe", "log:unsubscribe", "log:thread-admins", "log:thread-name", "log:thread-image", "log:thread-icon", "log:thread-color", "log:user-nickname"];
			if (!types.includes(event.logMessageType))
				return;
			
			const { threadID, logMessageData, logMessageType } = event;
			const threadInfo = await threadsData.get(event.threadID);
			
			// Check if threadInfo exists
			if (!threadInfo) {
				console.log(`Thread info not found for ${threadID}`);
				return;
			}
			
			// eslint-disable-next-line prefer-const
			let { members, adminIDs } = threadInfo;
			
			switch (logMessageType) {
				case "log:subscribe":
					return async function () {
						try {
							const { addedParticipants } = event.logMessageData;
							const threadInfo_Fca = await api.getThreadInfo(threadID);
							threadsData.refreshInfo(threadID, threadInfo_Fca);
							
							for (const user of addedParticipants) {
								let oldData = members.find(member => member.userID === user.userFbId);
								const isOldMember = oldData ? true : false;
								oldData = oldData || {};
								const { userInfo, nicknames } = threadInfo_Fca;
								const newData = {
									userID: user.userFbId,
									name: user.fullName,
									gender: userInfo.find(u => u.id == user.userFbId)?.gender,
									nickname: nicknames[user.userFbId] || null,
									inGroup: true,
									count: oldData.count || 0
								};
								if (!isOldMember)
									members.push(newData);
								else {
									const index = members.findIndex(member => member.userID === user.userFbId);
									members[index] = newData;
								}
							}
							await threadsData.set(threadID, members, "members");
						} catch (error) {
							console.error(`Error in log:subscribe for thread ${threadID}:`, error.message);
						}
					};
				case "log:unsubscribe":
					return async function () {
						try {
							const oldData = members.find(member => member.userID === logMessageData.leftParticipantFbId);
							if (oldData) {
								oldData.inGroup = false;
								await threadsData.set(threadID, members, "members");
							}
						} catch (error) {
							console.error(`Error in log:unsubscribe for thread ${threadID}:`, error.message);
						}
					};
				case "log:thread-admins":
					return async function () {
						try {
							if (logMessageData.ADMIN_EVENT == "add_admin")
								adminIDs.push(logMessageData.TARGET_ID);
							else
								adminIDs = adminIDs.filter(uid => uid != logMessageData.TARGET_ID);
							adminIDs = [...new Set(adminIDs)];
							await threadsData.set(threadID, adminIDs, "adminIDs");
						} catch (error) {
							console.error(`Error in log:thread-admins for thread ${threadID}:`, error.message);
						}
					};
				case "log:thread-name":
					return async function () {
						try {
							const threadName = logMessageData.name;
							await threadsData.set(threadID, threadName, "threadName");
						} catch (error) {
							console.error(`Error in log:thread-name for thread ${threadID}:`, error.message);
						}
					};
				case "log:thread-image":
					return async function () {
						try {
							await threadsData.set(threadID, logMessageData.url, "imageSrc");
						} catch (error) {
							console.error(`Error in log:thread-image for thread ${threadID}:`, error.message);
						}
					};
				case "log:thread-icon":
					return async function () {
						try {
							await threadsData.set(threadID, logMessageData.thread_icon, "emoji");
						} catch (error) {
							console.error(`Error in log:thread-icon for thread ${threadID}:`, error.message);
						}
					};
				case "log:thread-color":
					return async function () {
						try {
							await threadsData.set(threadID, logMessageData.theme_id, "threadThemeID");
						} catch (error) {
							console.error(`Error in log:thread-color for thread ${threadID}:`, error.message);
						}
					};
				case "log:user-nickname":
					return async function () {
						try {
							const { participant_id, nickname } = logMessageData;
							const oldData = members.find(member => member.userID === participant_id);
							if (oldData) {
								oldData.nickname = nickname;
								await threadsData.set(threadID, members, "members");
							}
						} catch (error) {
							console.error(`Error in log:user-nickname for thread ${threadID}:`, error.message);
						}
					};
				default:
					return null;
			}
		} catch (error) {
			console.error("Error in autoUpdateThreadInfo:", error.message);
			// Don't throw error, just log it to prevent crashes
			return null;
		}
	}
};
