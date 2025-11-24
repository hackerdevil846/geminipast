const { db, utils, GoatBot } = global;
const { config } = GoatBot;
const { log, getText } = utils;
const { creatingThreadData, creatingUserData } = global.client.database;

module.exports = async function (usersData, threadsData, event) {
	if (!event) return; // Safety check

	const { threadID } = event;
	const senderID = event.senderID || event.author || event.userID;

	// ———————————— CHECK THREAD DATA ———————————— //
	if (threadID && !isNaN(threadID)) {
		try {
			if (global.temp.createThreadDataError && global.temp.createThreadDataError.includes(threadID))
				return;

			// Check if thread already exists in cache to avoid DB calls
			if (global.db.allThreadData.some(t => t.threadID == threadID))
				return;

			const findInCreatingThreadData = creatingThreadData.find(t => t.threadID == threadID);
			if (!findInCreatingThreadData) {
				const threadData = await threadsData.create(threadID);
				// Log only if strictly necessary to reduce spam
				if (config.database && config.database.logNewThread) {
					log.info("DATABASE", `New Thread: ${threadID} | ${threadData.threadName}`);
				}
			}
			else {
				await findInCreatingThreadData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS") {
				if (!global.temp.createThreadDataError) global.temp.createThreadDataError = [];
				global.temp.createThreadDataError.push(threadID);
				// log.warn("DATABASE", `Cannot create thread data: ${threadID}`);
			}
		}
	}

	// ————————————— CHECK USER DATA ————————————— //
	if (senderID && !isNaN(senderID)) {
		try {
			// Check cache first
			if (db.allUserData.some(u => u.userID == senderID))
				return;

			const findInCreatingUserData = creatingUserData.find(u => u.userID == senderID);
			if (!findInCreatingUserData) {
				const userData = await usersData.create(senderID);
				if (config.database && config.database.logNewUser) {
					log.info("DATABASE", `New User: ${senderID} | ${userData.name}`);
				}
			}
			else {
				await findInCreatingUserData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS") {
				// log.warn("DATABASE", `Cannot create user data: ${senderID}`);
			}
		}
	}
};
