const { existsSync, writeJsonSync, readJSONSync } = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");
const axios = require("axios");
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

const { creatingUserData } = global.client.database;

module.exports = async function (databaseType, userModel, api, fakeGraphql) {
	let Users = [];
	const pathUsersData = path.join(__dirname, "..", "data/usersData.json");

	try {
		switch (databaseType) {
			case "mongodb":
				Users = (await userModel.find({}).lean()).map(user => _.omit(user, ["_id", "__v"]));
				break;
			case "sqlite":
				Users = (await userModel.findAll()).map(user => user.get({ plain: true }));
				break;
			case "json":
				if (!existsSync(pathUsersData)) writeJsonSync(pathUsersData, [], optionsWriteJSON);
				Users = readJSONSync(pathUsersData);
				break;
		}
	} catch (err) {
		console.error("CRITICAL DATABASE ERROR:", err);
		Users = [];
	}
	global.db.allUserData = Users;

	async function save(userID, userData, mode, path) {
		try {
			let index = _.findIndex(global.db.allUserData, { userID });
			if (index === -1 && mode === "update") {
				try {
					await create_(userID);
					index = _.findIndex(global.db.allUserData, { userID });
				} catch (err) { /* Silent fail */ }
			}

			switch (mode) {
				case "create":
					if (databaseType === "mongodb" || databaseType === "sqlite") {
						let dataCreated = await userModel.create(userData);
						dataCreated = databaseType === "mongodb" ? _.omit(dataCreated._doc, ["_id", "__v"]) : dataCreated.get({ plain: true });
						global.db.allUserData.push(dataCreated);
						return _.cloneDeep(dataCreated);
					} else if (databaseType === "json") {
						userData.createdAt = moment.tz().format();
						userData.updatedAt = moment.tz().format();
						global.db.allUserData.push(userData);
						writeJsonSync(pathUsersData, global.db.allUserData, optionsWriteJSON);
						return _.cloneDeep(userData);
					}
					break;
				case "update":
					if (index === -1) return null;
					const oldUserData = global.db.allUserData[index];
					const dataWillChange = {};

					if (Array.isArray(path) && Array.isArray(userData)) {
						path.forEach((p, index) => {
							const key = p.split(".")[0];
							dataWillChange[key] = oldUserData[key];
							_.set(dataWillChange, p, userData[index]);
						});
					} else if (path && (typeof path === "string" || Array.isArray(path))) {
						const key = Array.isArray(path) ? path[0] : path.split(".")[0];
						dataWillChange[key] = oldUserData[key];
						_.set(dataWillChange, path, userData);
					} else {
						for (const key in userData) dataWillChange[key] = userData[key];
					}

					if (databaseType === "mongodb") {
						let dataUpdated = await userModel.findOneAndUpdate({ userID }, dataWillChange, { returnDocument: 'after' });
						dataUpdated = _.omit(dataUpdated._doc, ["_id", "__v"]);
						global.db.allUserData[index] = dataUpdated;
						return _.cloneDeep(dataUpdated);
					} else if (databaseType === "sqlite") {
						const user = await userModel.findOne({ where: { userID } });
						const dataUpdated = (await user.update(dataWillChange)).get({ plain: true });
						global.db.allUserData[index] = dataUpdated;
						return _.cloneDeep(dataUpdated);
					} else {
						dataWillChange.updatedAt = moment.tz().format();
						global.db.allUserData[index] = { ...oldUserData, ...dataWillChange };
						writeJsonSync(pathUsersData, global.db.allUserData, optionsWriteJSON);
						return _.cloneDeep(global.db.allUserData[index]);
					}
					break;
				case "remove":
					if (index != -1) {
						global.db.allUserData.splice(index, 1);
						if (databaseType === "mongodb") await userModel.deleteOne({ userID });
						else if (databaseType === "sqlite") await userModel.destroy({ where: { userID } });
						else writeJsonSync(pathUsersData, global.db.allUserData, optionsWriteJSON);
					}
					break;
			}
			return null;
		} catch (err) { throw err; }
	}

	function getNameInDB(userID) {
		const userData = global.db.allUserData.find(u => u.userID == userID);
		return userData ? userData.name : "Facebook User";
	}

	async function getName(userID, checkData = true) {
		if (checkData) {
			const inDB = getNameInDB(userID);
			if (inDB !== "Facebook User") return inDB;
		}
		try {
			const user = await axios.post(`https://www.facebook.com/api/graphql/?q=${`node(${userID}){name}`}`);
			return user.data[userID].name || "Facebook User";
		} catch (error) {
			return "Facebook User";
		}
	}

	async function getAvatarUrl(userID) {
		return `https://graph.facebook.com/${userID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	}

	async function create_(userID, userInfo) {
		const findInCreatingData = creatingUserData.find(u => u.userID == userID);
		if (findInCreatingData) return findInCreatingData.promise;

		const queue = new Promise(async function (resolve_, reject_) {
			try {
				if (global.db.allUserData.some(u => u.userID == userID)) {
					return resolve_(_.cloneDeep(global.db.allUserData.find(u => u.userID == userID)));
				}

				// SAFE API FETCH
				try {
					if (!userInfo) {
						const info = await api.getUserInfo(userID);
						userInfo = info[userID];
					}
				} catch (e) {
					// Fallback
					userInfo = { name: "Facebook User", gender: "male", vanity: "" };
				}

				if (!userInfo) userInfo = { name: "Facebook User", gender: "male", vanity: "" };

				let userData = {
					userID,
					name: userInfo.name,
					gender: userInfo.gender,
					vanity: userInfo.vanity,
					exp: 0,
					money: 0,
					banned: {},
					settings: {},
					data: {}
				};
				userData = await save(userID, userData, "create");
				resolve_(_.cloneDeep(userData));
			} catch (err) {
				reject_(err);
			}
			creatingUserData.splice(creatingUserData.findIndex(u => u.userID == userID), 1);
		});
		creatingUserData.push({ userID, promise: queue });
		return queue;
	}

	async function create(userID, userInfo) {
		return new Promise((resolve, reject) => taskQueue.push(() => create_(userID, userInfo).then(resolve).catch(reject)));
	}

	async function refreshInfo(userID, updateInfoUser) {
		return new Promise((resolve, reject) => taskQueue.push(async () => {
			try {
				const infoUser = await get_(userID);
				try {
					if (!updateInfoUser) {
						const info = await api.getUserInfo(userID);
						updateInfoUser = info[userID];
					}
				} catch(e) {
					return resolve(_.cloneDeep(infoUser));
				}

				if (!updateInfoUser) return resolve(_.cloneDeep(infoUser));

				const userData = await save(userID, {
					...infoUser,
					name: updateInfoUser.name,
					vanity: updateInfoUser.vanity,
					gender: updateInfoUser.gender
				}, "update");
				resolve(_.cloneDeep(userData));
			} catch (err) { reject(err); }
		}));
	}

	// Generic Get/Set functions remain mostly same but wrapped in taskQueue
    function getAll(path, defaultValue, query) {
		return new Promise((resolve, reject) => {
			taskQueue.push(function () {
				try {
					let dataReturn = _.cloneDeep(global.db.allUserData);
					if (query) dataReturn = dataReturn.map(uData => fakeGraphql(query, uData));
					if (path) {
						if (typeof path === "string") return resolve(dataReturn.map(uData => _.get(uData, path, defaultValue)));
						else return resolve(dataReturn.map(uData => _.times(path.length, i => _.get(uData, path[i], defaultValue[i]))));
					}
					return resolve(dataReturn);
				} catch (err) { reject(err); }
			});
		});
	}

	async function get_(userID, path, defaultValue, query) {
		let userData;
		const index = global.db.allUserData.findIndex(u => u.userID == userID);
		if (index === -1) userData = await create_(userID);
		else userData = global.db.allUserData[index];

		if (query) userData = fakeGraphql(query, userData);
		if (path) {
			if (typeof path === "string") return _.cloneDeep(_.get(userData, path, defaultValue));
			else return _.cloneDeep(_.times(path.length, i => _.get(userData, path[i], defaultValue[i])));
		}
		return _.cloneDeep(userData);
	}

	async function get(userID, path, defaultValue, query) {
		return new Promise((resolve, reject) => taskQueue.push(() => get_(userID, path, defaultValue, query).then(resolve).catch(reject)));
	}

	async function set(userID, updateData, path, query) {
		return new Promise((resolve, reject) => taskQueue.push(async () => {
			try {
				const userData = await save(userID, updateData, "update", path);
				if (query) return resolve(_.cloneDeep(fakeGraphql(query, userData)));
				return resolve(_.cloneDeep(userData));
			} catch (err) { reject(err); }
		}));
	}

    // Money functions are standard updates, logic preserved
    async function getMoney(userID) {
        return get(userID, "money", 0);
    }

    async function addMoney(userID, money) {
        return new Promise((resolve, reject) => taskQueue.push(async () => {
            try {
                const current = await get_(userID, "money", 0);
                const res = await save(userID, current + parseInt(money), "update", "money");
                resolve(res);
            } catch(e) { reject(e); }
        }));
    }

    async function subtractMoney(userID, money) {
        return new Promise((resolve, reject) => taskQueue.push(async () => {
            try {
                const current = await get_(userID, "money", 0);
                const res = await save(userID, current - parseInt(money), "update", "money");
                resolve(res);
            } catch(e) { reject(e); }
        }));
    }

    async function deleteKey(userID, path) {
         return new Promise((resolve, reject) => taskQueue.push(async () => {
            try {
                const parent = path.split(".").slice(0, -1).join(".");
                const parentData = await get_(userID, parent);
                _.unset(parentData, path.split(".").pop());
                const setData = await save(userID, parentData, "update", parent);
                resolve(_.cloneDeep(setData));
            } catch(e) { reject(e); }
         }));
    }

	async function remove(userID) {
		return new Promise((resolve, reject) => taskQueue.push(async () => {
			try {
				await save(userID, { userID }, "remove");
				return resolve(true);
			} catch (err) { reject(err); }
		}));
	}

	return {
		existsSync: (userID) => global.db.allUserData.some(u => u.userID == userID),
		getName, getNameInDB, getAvatarUrl, create, refreshInfo, getAll, get, set, deleteKey, getMoney, addMoney, subtractMoney, remove
	};
};
