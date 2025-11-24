const cron = require('node-cron');
const { log, getText } = global.utils;

module.exports = async function ({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getText }) {
	const { config } = global.GoatBot;

	// —————————————— CRON JOBS —————————————— //
	
	// Auto Refresh fb_dtsg every 4 hours to keep session alive
	cron.schedule('0 */4 * * *', async () => {
		try {
			// Safe check before calling getFreshDtsg
			if (api && typeof api.getFreshDtsg === "function") {
				const dtsg = await api.getFreshDtsg();
				if (dtsg) {
					// log.info("SYSTEM", getText('custom', 'refreshedFb_dtsg'));
				}
			}
		} catch (e) {
			log.warn("SYSTEM", getText('custom', 'refreshedFb_dtsgError') + ": " + e.message);
		}
	});

	// Auto Restart Bot (Configurable)
	if (config.autoRestart && config.autoRestart.status) {
		const { time, timeZone } = config.autoRestart;
		try {
			cron.schedule(`0 ${time.minute} ${time.hour} * * *`, () => {
				log.info("AUTO RESTART", `Restarting bot as per schedule...`);
				process.exit(1);
			}, {
				timezone: timeZone || "Asia/Dhaka"
			});
		} catch (e) {
			log.err("CRON ERROR", "Invalid cron schedule for auto restart");
		}
	}

	// ————————————— CUSTOM LOGIC HERE ————————————— //
	// You can add your own custom code below this line
	// Example: Send a message when bot starts
	/*
	if (config.adminBot && config.adminBot.length > 0) {
		api.sendMessage("🚀 Bot successfully started/restarted!", config.adminBot[0]).catch(() => {});
	}
	*/
};
