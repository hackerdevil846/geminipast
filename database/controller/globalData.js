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

module.exports = async function (databaseType, globalModel, fakeGraphql) {
	let Global = [];
	const pathGlobalData = path.join(__dirname, "..", "data/globalData.json");

	try {
		switch (databaseType) {
			case "mongodb":
				Global = (await globalModel.find({}).lean()).map(item => _.omit(item, ["_id", "__v"]));
				break;
			case "sqlite":
				Global = (await globalModel.findAll()).map(item => item.get({ plain: true }));
				break;
			case "json":
				if (!existsSync(pathGlobalData)) writeJsonSync(pathGlobalData, [], optionsWriteJSON);
				Global = readJSONSync(pathGlobalData);
				break;
		}
	} catch (err) {
		console.error("CRITICAL GLOBAL DATA ERROR:", err);
		Global = [];
	}

	// FIX: Renamed to avoid conflict with controller object
	global.db.allGlobalData = Global;

	async function save(key, data, mode, path) {
		try {
			let index = _.findIndex(global.db.allGlobalData, { key });
			if (index === -1 && mode === "update") {
				await create(key, {});
				index = _.findIndex(global.db.allGlobalData, { key });
			}

			switch (mode) {
				case "create":
					if (databaseType === "mongodb" || databaseType === "sqlite") {
						let dataCreated = await globalModel.create({ key, data });
						dataCreated = databaseType === "mongodb" ? _.omit(dataCreated._doc, ["_id", "__v"]) : dataCreated.get({ plain: true });
						global.db.allGlobalData.push(dataCreated);
						return _.cloneDeep(dataCreated);
					} else if (databaseType === "json") {
						const newData = { key, data };
						global.db.allGlobalData.push(newData);
						writeJsonSync(pathGlobalData, global.db.allGlobalData, optionsWriteJSON);
						return _.cloneDeep(newData);
					}
					break;
				case "update":
					if (index === -1) return null;
					const oldData = global.db.allGlobalData[index];
					const dataWillChange = {};

					if (path && (typeof path === "string" || Array.isArray(path))) {
						const rootKey = Array.isArray(path) ? path[0] : path.split(".")[0];
						// dataWillChange[rootKey] = oldData.data[rootKey]; 
					}

					const finalData = _.cloneDeep(oldData.data);
					if (path) _.set(finalData, path, data);
					else Object.assign(finalData, data);

					if (databaseType === "mongodb") {
						let dataUpdated = await globalModel.findOneAndUpdate({ key }, { data: finalData }, { returnDocument: 'after' });
						dataUpdated = _.omit(dataUpdated._doc, ["_id", "__v"]);
						global.db.allGlobalData[index] = dataUpdated;
						return _.cloneDeep(dataUpdated);
					} else if (databaseType === "sqlite") {
						const item = await globalModel.findOne({ where: { key } });
						const dataUpdated = (await item.update({ data: finalData })).get({ plain: true });
						global.db.allGlobalData[index] = dataUpdated;
						return _.cloneDeep(dataUpdated);
					} else {
						global.db.allGlobalData[index].data = finalData;
						writeJsonSync(pathGlobalData, global.db.allGlobalData, optionsWriteJSON);
						return _.cloneDeep(global.db.allGlobalData[index]);
					}
					break;
				case "remove":
					if (index != -1) {
						global.db.allGlobalData.splice(index, 1);
						if (databaseType === "mongodb") await globalModel.deleteOne({ key });
						else if (databaseType === "sqlite") await globalModel.destroy({ where: { key } });
						else writeJsonSync(pathGlobalData, global.db.allGlobalData, optionsWriteJSON);
					}
					break;
			}
			return null;
		} catch (err) { throw err; }
	}

	async function create(key, data) {
		return new Promise((resolve, reject) => {
			taskQueue.push(async () => {
				try {
					if (global.db.allGlobalData.some(i => i.key == key)) {
						return resolve(_.cloneDeep(global.db.allGlobalData.find(i => i.key == key)));
					}
					const result = await save(key, data, "create");
					resolve(result);
				} catch (e) { reject(e); }
			});
		});
	}

	async function get(key, path, defaultValue, query) {
		return new Promise((resolve, reject) => {
			taskQueue.push(async () => {
				try {
					let data = global.db.allGlobalData.find(i => i.key == key);
					if (!data) data = await create(key, {});
					
					if (query) data = fakeGraphql(query, data);
					
					if (path) {
						const result = _.get(data.data, path, defaultValue);
						return resolve(_.cloneDeep(result));
					}
					return resolve(_.cloneDeep(data.data));
				} catch (e) { reject(e); }
			});
		});
	}

	async function set(key, updateData, path, query) {
		return new Promise((resolve, reject) => {
			taskQueue.push(async () => {
				try {
					const result = await save(key, updateData, "update", path);
					if (query) return resolve(_.cloneDeep(fakeGraphql(query, result)));
					return resolve(_.cloneDeep(result));
				} catch (e) { reject(e); }
			});
		});
	}

	async function remove(key) {
		return new Promise((resolve, reject) => {
			taskQueue.push(async () => {
				try {
					await save(key, null, "remove");
					resolve(true);
				} catch (e) { reject(e); }
			});
		});
	}

	return {
		create, get, set, remove
	};
};
