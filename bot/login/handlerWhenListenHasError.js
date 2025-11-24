const { log, getText } = global.utils;

module.exports = async function ({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, error }) {
	const { config } = global.GoatBot;

	// Filter out minor connection errors to reduce spam
	if (["Connection closed.", "Connection closed by user."].includes(error)) {
		return; // Ignore standard closures
	}

	switch (error) {
		case "Not logged in":
		case "Not logged in.":
		case "Connection refused: Server unavailable":
			log.err("LISTEN ERROR", getText('login', 'notLoggedIn'));
			
			// Trigger Auto-Recovery
			if (config.autoReloginWhenChangeAccount || true) { // Force enabled for stability
				log.warn("AUTO RECOVERY", "Session expired. Attempting to re-login...");
				if (global.GoatBot.reLoginBot) {
					setTimeout(() => global.GoatBot.reLoginBot(), 5000);
				} else {
					process.exit(1); // Let PM2/Watcher restart it
				}
			}
			break;

		default:
			// Log unexpected errors but don't crash
			log.err("LISTEN ERROR", `Unexpected error in MQTT listener: ${error}`);
			if (error.toString().includes("publish")) {
				// Re-establish connection if publish fails
				log.warn("LISTEN ERROR", "Publish failed, restarting listener...");
				if (global.GoatBot.reLoginBot) global.GoatBot.reLoginBot();
			}
			break;
	}
};
