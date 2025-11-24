const path = require("path");

const dirConfig = path.join(process.cwd(), process.env.NODE_ENV === 'development' ? 'config.dev.json' : 'config.json');
const dirConfigCommands = path.join(process.cwd(), process.env.NODE_ENV === 'development' ? 'configCommands.dev.json' : 'configCommands.json');

global.GoatBot = {
    config: require(dirConfig),
    configCommands: require(dirConfigCommands)
};

// Ensure utils is required from the root directory
global.utils = require(path.join(process.cwd(), "utils.js"));

global.client = {
    database: {
        creatingThreadData: [],
        creatingUserData: [],
        creatingDashBoardData: []
    }
};
global.db = {
    allThreadData: [],
    allUserData: [],
    globalData: []
};

module.exports = async function () {
    const controllerPath = path.join(process.cwd(), "database", "controller", "index.js");
    const controller = await require(controllerPath)(null);
    
    const { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData } = controller;
    return {
        threadModel,
        userModel,
        dashBoardModel,
        globalModel,
        threadsData,
        usersData,
        dashBoardData,
        globalData
    };
};
