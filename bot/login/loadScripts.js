const { readdirSync, readFileSync, writeFileSync, existsSync } = require("fs-extra");
const path = require("path");
const exec = (cmd, options) => new Promise((resolve, reject) => {
    require("child_process").exec(cmd, options, (err, stdout, stderr) => {
        if (err) {
            return reject(err);
        }
        resolve(stdout);
    });
});

const { log, loading, getText, colors, removeHomeDir } = global.utils;
const { GoatBot } = global;
const { configCommands } = GoatBot;
const regExpCheckPackage = /require(\s+|)\((\s+|)[`'"]([^`'"]+)[`'"](\s+|)\)/g;
const packageAlready = [];
const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let count = 0;

module.exports = async function (api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, createLine) {
    try {
        /* { CHECK ORIGIN CODE } */

        const aliasesData = await globalData.get('setalias', 'data', []);
        if (aliasesData && Array.isArray(aliasesData)) {
            for (const data of aliasesData) {
                const { aliases, commandName } = data;
                if (aliases && Array.isArray(aliases)) {
                    for (const alias of aliases) {
                        if (GoatBot.aliases.has(alias)) {
                            log.warn('ALIAS', `Alias "${alias}" already exists in command "${commandName}"`);
                        } else {
                            GoatBot.aliases.set(alias, commandName);
                        }
                    }
                }
            }
        }

        const folders = ["cmds", "events"];
        let text, setMap, typeEnvCommand;

        for (const folderModules of folders) {
            const makeColor = folderModules == "cmds" ?
                createLine("ASIF LOAD COMMANDS") :
                createLine("ASIF LOAD COMMANDS EVENT");
            console.log(colors.hex("#f5ab00")(makeColor));

            if (folderModules == "cmds") {
                text = "command";
                typeEnvCommand = "envCommands";
                setMap = "commands";
            } else if (folderModules == "events") {
                text = "event command";
                typeEnvCommand = "envEvents";
                setMap = "eventCommands";
            }

            const fullPathModules = path.normalize(process.cwd() + `/scripts/${folderModules}`);
            
            // Check if directory exists
            if (!existsSync(fullPathModules)) {
                log.warn('LOADER', `Directory ${fullPathModules} does not exist`);
                continue;
            }

            const Files = readdirSync(fullPathModules)
                .filter(file =>
                    file.endsWith(".js") &&
                    !file.endsWith("eg.js") &&
                    (process.env.NODE_ENV == "development" ? true : !file.match(/(dev)\.js$/g)) &&
                    !configCommands[folderModules == "cmds" ? "commandUnload" : "commandEventUnload"]?.includes(file)
                );

            const commandError = [];
            let commandLoadSuccess = 0;

            for (const file of Files) {
                const pathCommand = path.normalize(fullPathModules + "/" + file);
                try {
                    // ————————————————— CHECK PACKAGE ————————————————— //
                    const contentFile = readFileSync(pathCommand, "utf8");
                    let allPackage = contentFile.match(regExpCheckPackage);
                    
                    if (allPackage) {
                        allPackage = allPackage.map(p => p.match(/[`'"]([^`'"]+)[`'"]/)[1])
                            .filter(p => p.indexOf("/") !== 0 && p.indexOf("./") !== 0 && p.indexOf("../") !== 0 && p.indexOf(__dirname) !== 0);
                        
                        for (let packageName of allPackage) {
                            if (packageName.startsWith('@')) {
                                packageName = packageName.split('/').slice(0, 2).join('/');
                            } else {
                                packageName = packageName.split('/')[0];
                            }

                            if (!packageAlready.includes(packageName)) {
                                packageAlready.push(packageName);
                                if (!existsSync(`${process.cwd()}/node_modules/${packageName}`)) {
                                    const waiting = setInterval(() => {
                                        process.stderr.write('\r\x1b[K');
                                        process.stderr.write(`${spinner[count % spinner.length]} Installing package ${colors.yellow(packageName)} for ${text} ${colors.yellow(file)}`);
                                        count++;
                                    }, 80);
                                    
                                    try {
                                        await exec(`npm install ${packageName} --${pathCommand.endsWith('.dev.js') ? 'no-save' : 'save'}`, {
                                            cwd: process.cwd(),
                                            stdio: 'pipe'
                                        });
                                        clearInterval(waiting);
                                        process.stderr.write('\r\x1b[K');
                                        console.log(`${colors.green('✔')} Installed package ${packageName} successfully`);
                                    } catch (err) {
                                        clearInterval(waiting);
                                        process.stderr.write('\r\x1b[K');
                                        console.log(`${colors.red('✖')} Failed to install package ${packageName}`);
                                        log.warn('PACKAGE', `Package ${packageName} installation failed: ${err.message}`);
                                    }
                                }
                            }
                        }
                    }

                    // —————————————— CHECK CONTENT SCRIPT —————————————— //
                    if (!global.temp.contentScripts) {
                        global.temp.contentScripts = { cmds: {}, events: {} };
                    }
                    if (!global.temp.contentScripts[folderModules]) {
                        global.temp.contentScripts[folderModules] = {};
                    }
                    global.temp.contentScripts[folderModules][file] = contentFile;

                    // Clear cache before requiring
                    delete require.cache[require.resolve(pathCommand)];
                    const command = require(pathCommand);
                    command.location = pathCommand;
                    const configCommand = command.config;
                    
                    // ——————————————— CHECK SYNTAXERROR ——————————————— //
                    if (!configCommand) {
                        throw new Error(`config of ${text} is undefined`);
                    }
                    if (!configCommand.category) {
                        throw new Error(`category of ${text} is undefined`);
                    }
                    const commandName = configCommand.name;
                    if (!commandName) {
                        throw new Error(`name of ${text} is undefined`);
                    }
                    if (!command.onStart) {
                        throw new Error(`onStart of ${text} is undefined`);
                    }
                    if (typeof command.onStart !== "function") {
                        throw new Error(`onStart of ${text} must be a function`);
                    }
                    if (GoatBot[setMap].has(commandName)) {
                        throw new Error(`${text} "${commandName}" already exists with file "${removeHomeDir(GoatBot[setMap].get(commandName).location || "")}"`);
                    }

                    const { onFirstChat, onChat, onLoad, onEvent, onAnyEvent } = command;
                    const { envGlobal, envConfig } = configCommand;
                    const { aliases } = configCommand;

                    // ————————————————— CHECK ALIASES —————————————————— //
                    const validAliases = [];
                    if (aliases) {
                        if (!Array.isArray(aliases)) {
                            throw new Error("The value of \"config.aliases\" must be array!");
                        }
                        for (const alias of aliases) {
                            if (aliases.filter(item => item == alias).length > 1) {
                                throw new Error(`alias "${alias}" is duplicated in ${text} "${commandName}"`);
                            }
                            if (GoatBot.aliases.has(alias)) {
                                throw new Error(`alias "${alias}" already exists in ${text} "${GoatBot.aliases.get(alias)}"`);
                            }
                            validAliases.push(alias);
                        }
                        for (const alias of validAliases) {
                            GoatBot.aliases.set(alias, commandName);
                        }
                    }

                    // ——————————————— CHECK ENV GLOBAL ——————————————— //
                    if (envGlobal) {
                        if (typeof envGlobal != "object" || Array.isArray(envGlobal)) {
                            throw new Error("the value of \"envGlobal\" must be object");
                        }
                        for (const i in envGlobal) {
                            if (!configCommands.envGlobal[i]) {
                                configCommands.envGlobal[i] = envGlobal[i];
                            } else {
                                try {
                                    const readCommand = readFileSync(pathCommand, "utf-8").replace(envGlobal[i], configCommands.envGlobal[i]);
                                    writeFileSync(pathCommand, readCommand);
                                } catch (err) {
                                    log.warn('ENV_GLOBAL', `Failed to update envGlobal for ${commandName}: ${err.message}`);
                                }
                            }
                        }
                    }

                    // ———————————————— CHECK CONFIG CMD ——————————————— //
                    if (envConfig) {
                        if (typeof envConfig != "object" || Array.isArray(envConfig)) {
                            throw new Error("The value of \"envConfig\" must be object");
                        }
                        if (!configCommands[typeEnvCommand]) {
                            configCommands[typeEnvCommand] = {};
                        }
                        if (!configCommands[typeEnvCommand][commandName]) {
                            configCommands[typeEnvCommand][commandName] = {};
                        }
                        for (const [key, value] of Object.entries(envConfig)) {
                            if (!configCommands[typeEnvCommand][commandName][key]) {
                                configCommands[typeEnvCommand][commandName][key] = value;
                            } else {
                                try {
                                    const readCommand = readFileSync(pathCommand, "utf-8").replace(value, configCommands[typeEnvCommand][commandName][key]);
                                    writeFileSync(pathCommand, readCommand);
                                } catch (err) {
                                    log.warn('ENV_CONFIG', `Failed to update envConfig for ${commandName}: ${err.message}`);
                                }
                            }
                        }
                    }

                    // ————————————————— CHECK ONLOAD ————————————————— //
                    if (onLoad) {
                        if (typeof onLoad != "function") {
                            throw new Error("The value of \"onLoad\" must be function");
                        }
                        try {
                            await onLoad({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData });
                        } catch (err) {
                            log.warn('ONLOAD', `Error in onLoad for ${commandName}: ${err.message}`);
                        }
                    }

                    // ——————————————— CHECK RUN ANYTIME ——————————————— //
                    if (onChat && !GoatBot.onChat.includes(commandName)) {
                        GoatBot.onChat.push(commandName);
                    }

                    // ——————————————— CHECK ONFIRSTCHAT ——————————————— //
                    if (onFirstChat && !GoatBot.onFirstChat.find(item => item.commandName === commandName)) {
                        GoatBot.onFirstChat.push({ commandName, threadIDsChattedFirstTime: [] });
                    }

                    // ————————————————— CHECK ONEVENT ————————————————— //
                    if (onEvent && !GoatBot.onEvent.includes(commandName)) {
                        GoatBot.onEvent.push(commandName);
                    }

                    // ———————————————— CHECK ONANYEVENT ———————————————— //
                    if (onAnyEvent && !GoatBot.onAnyEvent.includes(commandName)) {
                        GoatBot.onAnyEvent.push(commandName);
                    }

                    // —————————————— IMPORT TO GLOBALGOAT —————————————— //
                    GoatBot[setMap].set(commandName.toLowerCase(), command);
                    commandLoadSuccess++;

                    // Initialize file paths array if not exists
                    if (!global.GoatBot.commandFilesPath) {
                        global.GoatBot.commandFilesPath = [];
                    }
                    if (!global.GoatBot.eventCommandsFilesPath) {
                        global.GoatBot.eventCommandsFilesPath = [];
                    }

                    global.GoatBot[folderModules == "cmds" ? "commandFilesPath" : "eventCommandsFilesPath"].push({
                        filePath: path.normalize(pathCommand),
                        commandName: [commandName, ...validAliases]
                    });

                } catch (error) {
                    commandError.push({
                        name: file,
                        error
                    });
                }
                
                // Update loading status
                process.stderr.write('\r\x1b[K');
                loading.info('ASIF LOADED', `${colors.green(`${commandLoadSuccess}`)}${commandError.length ? `, ${colors.red(`${commandError.length}`)}` : ''}`);
            }

            console.log("\n");
            
            if (commandError.length > 0) {
                log.err("ASIF LOADED", getText('loadScripts', 'loadScriptsError', colors.yellow(text)));
                for (const item of commandError) {
                    console.log(` ${colors.red('✖ ' + item.name)}: ${item.error.message}`);
                    if (process.env.NODE_ENV === 'development') {
                        console.log(item.error.stack);
                    }
                }
            }
        }

        return true;
    } catch (error) {
        log.err("LOADER", `Critical error in loader: ${error.message}`);
        console.error(error);
        throw error;
    }
};
