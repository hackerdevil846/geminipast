const { existsSync, writeJsonSync, readJSONSync } = require("fs-extra");
const path = require("path");
const _ = require("lodash");
const { CustomError, TaskQueue, getType } = global.utils;

const optionsWriteJSON = { spaces: 2, EOL: "\n" };

const taskQueue = new TaskQueue(function (task, callback) {
	if (getType(task) === "AsyncFunction") {
		task().then(result => callback(null, result)).catch(err => callback(err));
	} else {
		try {
			const result = task();
			callback(null, result);
		} catch (err) {
			callback(err);
		}
	}
});

module.exports = async function (databaseType, dashBoardModel, fakeGraphql) {
	let DashBoardData = [];
	const pathDashBoardData = path.join(__dirname, "..", "data/dashBoardData.json");

	try {
		switch (databaseType) {
			case "mongodb":
				DashBoardData = (await dashBoardModel.find({}).lean()).map(item => _.omit(item, ["_id", "__v"]));
				break;
			case "sqlite":
				DashBoardData = (await dashBoardModel.findAll()).map(item => item.get({ plain: true }));
				break;
			case "json":
				if (!existsSync(pathDashBoardData)) writeJsonSync(pathDashBoardData, [], optionsWriteJSON);
				DashBoardData = readJSONSync(pathDashBoardData);
				break;
		}
	} catch (err) {
		console.error("CRITICAL DASHBOARD DATA ERROR:", err);
		DashBoardData = [];
	}

	global.db.dashBoardData = DashBoardData;

	async function save(email, userData, mode) {
		try {
			const index = _.findIndex(global.db.dashBoardData, { email });
			if (index === -1 && mode === "update") {
				throw new CustomError({ name: "USER_NOT_FOUND", message: "User not found in dashboard database" });
			}

			switch (mode) {
				case "create":
					if (databaseType === "mongodb" || databaseType === "sqlite") {
						let dataCreated = await dashBoardModel.create(userData);
						dataCreated = databaseType === "mongodb" ? _.omit(dataCreated._doc, ["_id", "__v"]) : dataCreated.get({ plain: true });
						global.db.dashBoardData.push(dataCreated);
						return _.cloneDeep(dataCreated);
					} else if (databaseType === "json") {
						global.db.dashBoardData.push(userData);
						writeJsonSync(pathDashBoardData, global.db.dashBoardData, optionsWriteJSON);
						return _.cloneDeep(userData);
					}
					break;
				case "update":
					const oldData = global.db.dashBoardData[index];
					const dataWillChange = { ...oldData, ...userData };

					if (databaseType === "mongodb") {
						let dataUpdated = await dashBoardModel.findOneAndUpdate({ email }, userData, { returnDocument: 'after' });
						dataUpdated = _.omit(dataUpdated._doc, ["_id", "__v"]);
						global.db.dashBoardData[index] = dataUpdated;
						return _.cloneDeep(dataUpdated);
					} else if (databaseType === "sqlite") {
						const user = await dashBoardModel.findOne({ where: { email } });
						const dataUpdated = (await user.update(userData)).get({ plain: true });
						global.db.dashBoardData[index] = dataUpdated;
						return _.cloneDeep(dataUpdated);
					} else {
						global.db.dashBoardData[index] = dataWillChange;
						writeJsonSync(pathDashBoardData, global.db.dashBoardData, optionsWriteJSON);
						return _.cloneDeep(dataWillChange);
					}
					break;
				case "remove":
					if (index != -1) {
						global.db.dashBoardData.splice(index, 1);
						if (databaseType === "mongodb") await dashBoardModel.deleteOne({ email });
						else if (databaseType === "sqlite") await dashBoardModel.destroy({ where: { email } });
						else writeJsonSync(pathDashBoardData, global.db.dashBoardData, optionsWriteJSON);
					}
					break;
			}
			return null;
		} catch (err) { throw err; }
	}

	async function create(userData) {
		return new Promise((resolve, reject) => {
			taskQueue.push(async () => {
				try {
					if (global.db.dashBoardData.some(u => u.email == userData.email)) {
						throw new CustomError({ name: "EMAIL_EXISTS", message: "Email already exists" });
					}
					const result = await save(userData.email, userData, "create");
					resolve(result);
				} catch (e) { reject(e); }
			});
		});
	}

	async function get(email) {
		return new Promise((resolve, reject) => {
			taskQueue.push(async () => {
				try {
					const data = global.db.dashBoardData.find(u => u.email == email);
					resolve(data ? _.cloneDeep(data) : null);
				} catch (e) { reject(e); }
			});
		});
	}

	return { create, get, save };
};
