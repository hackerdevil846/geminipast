const chalk = require('chalk');
const path = require('path');
const { log, createOraDots, getText } = global.utils;

module.exports = async function (api, createLine) {
	// ———————————————————— LOAD DATA ———————————————————— //
	console.log(chalk.hex("#f5ab00")(createLine("DATABASE")));
	
	const controllerPath = path.join(process.cwd(), 'database', 'controller', 'index.js');
	const controller = await require(controllerPath)(api); 
	
	const { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, sequelize } = controller;
	
	log.info('DATABASE', getText('loadData', 'loadThreadDataSuccess', global.db.allThreadData.filter(t => t.threadID.toString().length > 15).length));
	log.info('DATABASE', getText('loadData', 'loadUserDataSuccess', global.db.allUserData.length));

	if (api && global.GoatBot.config.database.autoSyncWhenStart == true) {
		console.log(chalk.hex("#f5ab00")(createLine("AUTO SYNC")));
		const spin = createOraDots(getText('loadData', 'refreshingThreadData'));
		
		try {
			// Temporarily silence logs during sync
			const originalLogLevel = global.GoatBot.config.optionsFca.logLevel;
			api.setOptions({ logLevel: 'silent' });
			
			spin._start();
			const threadDataWillSet = [];
			const allThreadData = [...global.db.allThreadData];
			
			// Fetch threads safely
			let allThreadInfo = [];
			try {
				allThreadInfo = await api.getThreadList(50, null, ['INBOX']); // Limit to 50 to be safe
			} catch (e) {
				// If fetch fails, just proceed with local data
				// log.warn("DATABASE", "Could not fetch thread list from Facebook, using local data.");
			}

			if (allThreadInfo && allThreadInfo.length > 0) {
				for (const threadInfo of allThreadInfo) {
					if (threadInfo.isGroup && !allThreadData.some(thread => thread.threadID === threadInfo.threadID))
						threadDataWillSet.push(await threadsData.create(threadInfo.threadID, threadInfo));
					else {
						const threadRefreshed = await threadsData.refreshInfo(threadInfo.threadID, threadInfo);
						const index = allThreadData.findIndex(thread => thread.threadID === threadInfo.threadID);
						if (index !== -1) allThreadData.splice(index, 1);
						threadDataWillSet.push(threadRefreshed);
					}
					global.db.receivedTheFirstMessage[threadInfo.threadID] = true;
				}

				// Handle threads not in recent list
				const allThreadDataDontHaveBot = allThreadData.filter(thread => !allThreadInfo.some(thread1 => thread.threadID === thread1.threadID));
				const botID = api.getCurrentUserID();
				
				for (const thread of allThreadDataDontHaveBot) {
					try {
						const findMe = thread.members.find(m => m.userID == botID);
						if (findMe) {
							findMe.inGroup = false;
							await threadsData.set(thread.threadID, { members: thread.members });
						}
					} catch (e) { /* ignore update errors */ }
				}

				global.db.allThreadData = [
					...threadDataWillSet,
					...allThreadDataDontHaveBot
				];
				
				spin._stop();
				log.info('DATABASE', getText('loadData', 'refreshThreadDataSuccess', global.db.allThreadData.length));
			} else {
				spin._stop();
				log.info('DATABASE', "Skipped Auto Sync (No new data or API error)");
			}

		}
		catch (err) {
			spin._stop();
			log.warn('DATABASE', getText('loadData', 'refreshThreadDataError') + ": " + err.message);
		}
		finally {
			// Restore log level
			api.setOptions({
				logLevel: global.GoatBot.config.optionsFca.logLevel
			});
		}
	}

	return {
		threadModel: threadModel || null,
		userModel: userModel || null,
		dashBoardModel: dashBoardModel || null,
		globalModel: globalModel || null,
		threadsData,
		usersData,
		dashBoardData,
		globalData,
		sequelize
	};
};
