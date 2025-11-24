const { colors } = require('../func/colors.js');
const moment = require("moment-timezone");
const characters = '';

// Use config timezone or default to Asia/Dhaka
const getTimeZone = () => (global.GoatBot && global.GoatBot.config && global.GoatBot.config.timeZone) ? global.GoatBot.config.timeZone : 'Asia/Dhaka';

const getCurrentTime = () => colors.gray(moment().tz(getTimeZone()).format('HH:mm:ss DD/MM/YYYY'));

function logError(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
	process.stderr.write(`\r${`${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)} ${message}`}`);
}

module.exports = {
	err: logError,
	error: logError,
	warn: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "WARN";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.yellowBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "INFO";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.greenBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	success: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "SUCCESS";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.cyanBright(`${characters} ${prefix}:`)} ${message}`}`);
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "MASTER";
		}
		process.stderr.write(`\r${`${getCurrentTime()} ${colors.hex("#eb6734", `${characters} ${prefix}:`)} ${message}`}`);
	}
};
