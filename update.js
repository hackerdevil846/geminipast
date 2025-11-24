const { log } = require('./logger/log.js');

// Prevent loading remote updater which would break the bot
log.warn("UPDATER", "Update script disabled to protect Super Modified core files.");
