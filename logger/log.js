const { colors } = require('../func/colors.js');
const moment = require("moment-timezone");
const util = require("util"); // Added for safe object inspection
const characters = '';

// Use config timezone or default to Asia/Dhaka (Bangladesh)
const getTimeZone = () => (global.GoatBot && global.GoatBot.config && global.GoatBot.config.timeZone) ? global.GoatBot.config.timeZone : 'Asia/Dhaka';

const getCurrentTime = () => colors.gray(moment().tz(getTimeZone()).format("HH:mm:ss DD/MM/YYYY"));

function logError(prefix, message, ...args) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
	console.log(`${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)}`, message);
	
	// Enhanced Error Logging (Prevents crashes on circular JSON)
	for (let err of args) {
		if (typeof err === "object" && err !== null) {
			if (err.stack) {
				console.log(`${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)}`, err.stack);
			} else {
				// util.inspect is safer than JSON.stringify for errors
				console.log(`${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)}`, util.inspect(err, { showHidden: false, depth: null, colors: true }));
			}
		} else {
			console.log(`${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)}`, err);
		}
	}
}

module.exports = {
	err: logError,
	error: logError,
	warn: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "WARN";
		}
		console.log(`${getCurrentTime()} ${colors.yellowBright(`${characters} ${prefix}:`)}`, message);
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "INFO";
		}
		console.log(`${getCurrentTime()} ${colors.greenBright(`${characters} ${prefix}:`)}`, message);
	},
	success: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "SUCCESS";
		}
		console.log(`${getCurrentTime()} ${colors.cyanBright(`${characters} ${prefix}:`)}`, message);
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "MASTER";
		}
		console.log(`${getCurrentTime()} ${colors.hex("#eb6734", `${characters} ${prefix}:`)}`, message);
	},
	dev: (...args) => {
		if (["development", "production"].includes(process.env.NODE_ENV) == false) return;
		try {
			throw new Error();
		}
		catch (err) {
			const at = err.stack.split('\n')[2];
			let position = at.slice(at.indexOf(process.cwd()) + process.cwd().length + 1);
			position.endsWith(')') ? position = position.slice(0, -1) : null;
			console.log(`\x1b[36m${position} =>\x1b[0m`, ...args);
		}
	}
};
