const { log } = require('./logger/log.js');
const { colors } = require('./func/colors.js');

module.exports = async function () {
	console.log(colors.bold.red("==================================================="));
	log.warn("UPDATER", "Auto-Update has been DISABLED in this Super Modified version.");
	log.warn("UPDATER", "Updating will revert the bot to the old legacy version and break the Playwright Login system.");
	log.info("UPDATER", "Please update manually if needed, but keep the 'fb-chat-api' and 'login' folders intact.");
	console.log(colors.bold.red("==================================================="));
};
