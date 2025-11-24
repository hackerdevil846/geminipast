const { readdirSync, readFileSync, writeFileSync, existsSync } = require("fs-extra");
const path = require("path");
const exec = (cmd, options) => new Promise((resolve, reject) => {
    require("child_process").exec(cmd, options, (err, stdout, stderr) => {
        if (err) return reject(err);
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

function createLine(content) {
    const width = process.stdout.columns || 50;
    if (!content) return Array(width).fill("─").join("");
    content = ` ${content.trim()} `;
    const left = Math.floor((width - content.length) / 2);
    const line = Array(Math.max(0, left)).fill("─").join("");
    return line + content + line;
}

module.exports = async function (api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData) {
    try {
        const aliasesData = await globalData.get('setalias', 'data', []);
        if (aliasesData && Array.isArray(aliasesData)) {
            for (const data of aliasesData) {
                const { aliases, commandName } = data;
                if (aliases && Array.isArray(aliases)) {
                    for (const alias of aliases) {
                        if (GoatBot.aliases.has(alias)) {
                            // Silent warning for cleaner startup
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
            const title = folderModules == "cmds" ? "COMMANDS LOADER" : "EVENTS LOADER";
            console.log(colors.hex("#f5ab00")(createLine(title)));

            if (folderModules == "cmds") {
                text = "command";
                typeEnvCommand = "envCommands";
                setMap = "commands";
            } else {
                text = "event";
                typeEnvCommand = "envEvents";
                setMap = "eventCommands";
            }

            const fullPathModules = path.normalize(process.cwd() + `/scripts/${folderModules}`);
            
            if (!existsSync(fullPathModules)) {
                log.warn('LOADER', `Directory ${fullPathModules} not found. Skipping...`);
                continue;
            }

            const Files = readdirSync(fullPathModules).filter(file =>
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
                            .filter(p => !p.startsWith("/") && !p.startsWith("./") && !p.startsWith("../"));
                        
                        for (let packageName of allPackage) {
                            packageName = packageName.startsWith('@') ? packageName.split('/').slice(0, 2).join('/') : packageName.split('/')[0];

                            if (!packageAlready.includes(packageName)) {
                                packageAlready.push(packageName);
                                const modulePath = `${process.cwd()}/node_modules/${packageName}`;
                                
                                if (!existsSync(modulePath)) {
                                    const waiting = setInterval(() => {
                                        process.stderr.write('\r\x1b[K');
                                        process.stderr.write(`${spinner[count++ % spinner.length]} Installing ${colors.yellow(packageName)} for ${file}...`);
                                    }, 80);
                                    
                                    try {
                                        await exec(`npm install ${packageName} --no-save`, { cwd: process.cwd() });
                                        clearInterval(waiting);
                                        process.stderr.write('\r\x1b[K');
                                        log.info('PACKAGE', `Installed ${packageName} successfully`);
                                    } catch (err) {
                                        clearInterval(waiting);
                                        process.stderr.write('\r\x1b[K');
                                        log.warn('PACKAGE', `Failed to install ${packageName}: ${err.message}`);
                                    }
                                }
                            }
                        }
                    }

                    // —————————————— LOAD SCRIPT —————————————— //
                    if (!global.temp.contentScripts) global.temp.contentScripts = { cmds: {}, events: {} };
                    if (!global.temp.contentScripts[folderModules]) global.temp.contentScripts[folderModules] = {};
                    global.temp.contentScripts[folderModules][file] = contentFile;

                    delete require.cache[require.resolve(pathCommand)];
                    const command = require(pathCommand);
                    command.location = pathCommand;
                    const configCommand = command.config;

                    if (!configCommand) throw new Error(`Config missing in ${file}`);
                    if (!configCommand.category && folderModules === "cmds") throw new Error(`Category missing in ${file}`);
                    if (!configCommand.name) throw new Error(`Name missing in ${file}`);
                    if (!command.onStart && folderModules === "cmds") throw new Error(`onStart missing in ${file}`);

                    const commandName = configCommand.name;
                    if (GoatBot[setMap].has(commandName)) {
                        throw new Error(`Duplicate command name: ${commandName}`);
                    }

                    // —————————————— ENV CONFIG —————————————— //
                    const { envGlobal, envConfig } = configCommand;
                    
                    // Handle Env Global
                    if (envGlobal && typeof envGlobal === "object") {
                        for (const i in envGlobal) {
                            if (!configCommands.envGlobal[i]) configCommands.envGlobal[i] = envGlobal[i];
                        }
                    }

                    // Handle Env Config
                    if (envConfig && typeof envConfig === "object") {
                        if (!configCommands[typeEnvCommand]) configCommands[typeEnvCommand] = {};
                        if (!configCommands[typeEnvCommand][commandName]) configCommands[typeEnvCommand][commandName] = {};
                        
                        for (const [key, value] of Object.entries(envConfig)) {
                            if (configCommands[typeEnvCommand][commandName][key] === undefined) {
                                configCommands[typeEnvCommand][commandName][key] = value;
                            }
                        }
                    }

                    // —————————————— REGISTER HANDLERS —————————————— //
                    if (command.onChat && !GoatBot.onChat.includes(commandName)) GoatBot.onChat.push(commandName);
                    if (command.onFirstChat && !GoatBot.onFirstChat.find(i => i.commandName === commandName)) {
                        GoatBot.onFirstChat.push({ commandName, threadIDsChattedFirstTime: [] });
                    }
                    if (command.onEvent && !GoatBot.onEvent.includes(commandName)) GoatBot.onEvent.push(commandName);
                    if (command.onAnyEvent && !GoatBot.onAnyEvent.includes(commandName)) GoatBot.onAnyEvent.push(commandName);

                    // —————————————— ALIASES —————————————— //
                    const aliases = configCommand.aliases || [];
                    if (Array.isArray(aliases)) {
                        aliases.forEach(alias => {
                            if (!GoatBot.aliases.has(alias)) GoatBot.aliases.set(alias, commandName);
                        });
                    }

                    // —————————————— SAVE TO MAP —————————————— //
                    GoatBot[setMap].set(commandName.toLowerCase(), command);
                    commandLoadSuccess++;

                    // Execute onLoad if present
                    if (command.onLoad && typeof command.onLoad === "function") {
                        try {
                            await command.onLoad({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData });
                        } catch (e) {
                            log.warn('ONLOAD', `Error in ${commandName} onLoad: ${e.message}`);
                        }
                    }

                } catch (error) {
                    commandError.push({ name: file, error });
                }
                
                // Update status bar
                process.stderr.write('\r\x1b[K');
                loading.info('LOADED', `${colors.green(`${commandLoadSuccess}`)}${commandError.length ? ` | Errors: ${colors.red(`${commandError.length}`)}` : ''}`);
            }

            console.log("\n");
            
            if (commandError.length > 0) {
                log.err("LOADER", `Failed to load ${commandError.length} ${text}s`);
                commandError.forEach(item => {
                    console.log(` ${colors.red('✖')} ${item.name}: ${item.error.message}`);
                });
            }
        }

        return true;
    } catch (error) {
        log.err("LOADER", `Critical System Error: ${error.message}`);
        throw error;
    }
};
