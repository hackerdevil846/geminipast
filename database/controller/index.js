const { graphQlQueryToJson } = require("graphql-query-to-json");
const ora = require("ora");
const { log, getText } = global.utils;
const { config } = global.GoatBot;
const databaseType = config.database.type;

function fakeGraphql(query, data, obj = {}) {
	if (typeof query != "string" && typeof query != "object")
		throw new Error(`The "query" argument must be of type string or object, got ${typeof query}`);
	if (query == "{}" || !data)
		return data;
	if (typeof query == "string")
		query = graphQlQueryToJson(query).query;
	const keys = query ? Object.keys(query) : [];
	for (const key of keys) {
		if (typeof query[key] === 'object') {
			if (!Array.isArray(data[key]))
				obj[key] = data.hasOwnProperty(key) ? fakeGraphql(query[key], data[key] || {}, obj[key]) : null;
			else
				obj[key] = data.hasOwnProperty(key) ? data[key].map(item => fakeGraphql(query[key], item, {})) : null;
		}
		else
			obj[key] = data.hasOwnProperty(key) ? data[key] : null;
	}
	return obj;
}

module.exports = async function (api) {
	var threadModel, userModel, dashBoardModel, globalModel, sequelize = null;
	
	// Unified Spinner logic
	const startSpinner = (text) => {
		const spin = ora({
			text: text,
			spinner: { interval: 80, frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] }
		});
		spin.start();
		return spin;
	};

	try {
		switch (databaseType) {
			case "mongodb": {
				const spin = startSpinner(getText('indexController', 'connectingMongoDB'));
				try {
					var { threadModel, userModel, dashBoardModel, globalModel } = await require("../connectDB/connectMongoDB.js")(config.database.uriMongodb);
					spin.stop();
					log.info("MONGODB", getText("indexController", "connectMongoDBSuccess"));
				} catch (err) {
					spin.stop();
					log.err("MONGODB", getText("indexController", "connectMongoDBError"), err);
					process.exit(1);
				}
				break;
			}
			case "sqlite": {
				const spin = startSpinner(getText('indexController', 'connectingMySQL'));
				try {
					var { threadModel, userModel, dashBoardModel, globalModel, sequelize } = await require("../connectDB/connectSqlite.js")();
					spin.stop();
					log.info("SQLITE", getText("indexController", "connectMySQLSuccess"));
				} catch (err) {
					spin.stop();
					log.err("SQLITE", getText("indexController", "connectMySQLError"), err);
					process.exit(1);
				}
				break;
			}
			case "json":
				log.info("DATABASE", "Using JSON Database (Not Recommended for large scale)");
				break;
			default:
				log.warn("DATABASE", `Database type "${databaseType}" not supported/configured properly.`);
				break;
		}

		const threadsData = await require("./threadsData.js")(databaseType, threadModel, api, fakeGraphql);
		const usersData = await require("./usersData.js")(databaseType, userModel, api, fakeGraphql);
		const dashBoardData = await require("./dashBoardData.js")(databaseType, dashBoardModel, fakeGraphql);
		const globalData = await require("./globalData.js")(databaseType, globalModel, fakeGraphql);

		global.db = {
			...global.db,
			threadModel,
			userModel,
			dashBoardModel,
			globalModel,
			threadsData,
			usersData,
			dashBoardData,
			globalData,
			sequelize
		};

		return {
			threadModel, userModel, dashBoardModel, globalModel,
			threadsData, usersData, dashBoardData, globalData,
			sequelize, databaseType
		};

	} catch (err) {
		log.err("DATABASE", "Critical Error initializing database controllers:", err);
		process.exit(1);
	}
};
