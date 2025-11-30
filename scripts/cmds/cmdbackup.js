const fs = require("fs-extra");
const child_process = require("child_process");
const path = require("path");

/**
 * 𝐇𝐞𝐥𝐩𝐞𝐫 𝐅𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐟𝐨𝐫 𝐃𝐚𝐫𝐤 𝐒𝐭𝐲𝐥𝐢𝐬𝐡 𝐅𝐨𝐧𝐭
 * 𝐂𝐨𝐧𝐯𝐞𝐫𝐭𝐬 𝐧𝐨𝐫𝐦𝐚𝐥 𝐭𝐞𝐱𝐭 𝐭𝐨 𝐦𝐚𝐭𝐡 𝐬𝐚𝐧𝐬-𝐬𝐞𝐫𝐢𝐟 𝐛𝐨𝐥𝐝
 */
const toDarkStyle = (str) => {
  return str.replace(/[a-zA-Z0-9]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(code + 120211); // A-Z
    if (code >= 97 && code <= 122) return String.fromCodePoint(code + 120205); // a-z
    if (code >= 48 && code <= 57) return String.fromCodePoint(code + 120764); // 0-9
    return char;
  });
};

module.exports = {
  config: {
    name: "cmdbackup",
    aliases: [],
    version: "2.0.0", // Updated version
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽", // Original Author preserved
    countDown: 5,
    role: 0, // Set to 0 as requested
    category: "𝐬𝐲𝐬𝐭𝐞𝐦",
    shortDescription: {
      en: "𝖡𝗈𝗍 𝗆𝗈𝖽𝗎𝗅𝖾 𝗆𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 𝖺𝗇𝖽 𝖿𝗎𝗅𝗅 𝖼𝗈𝗇𝗍𝗋𝗈𝗅"
    },
    longDescription: {
      en: "𝖬𝖺𝗇𝖺𝗀𝖾 𝖻𝗈𝗍 𝗆𝗈𝖽𝗎𝗅𝖾𝗌 (𝗅𝗈𝖺𝖽/𝗎𝗇𝗅𝗈𝖺𝖽/𝗂𝗇𝖿𝗈/𝗂𝗇𝗌𝗍𝖺𝗅𝗅)"
    },
    guide: {
      en: "{p}cmdbackup [𝗅𝗈𝖺𝖽/𝗎𝗇𝗅𝗈𝖺𝖽/𝗅𝗈𝖺𝖽𝖠𝗅𝗅/𝗎𝗇𝗅𝗈𝖺𝖽𝖠𝗅𝗅/𝗂𝗇𝖿𝗈/𝖼𝗈𝗎𝗇𝗍] [𝗆𝗈𝖽𝗎𝗅𝖾 𝗇𝖺𝗆𝖾]"
    },
    dependencies: {
      "fs-extra": "",
      "child_process": "",
      "path": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      // --- Dependency Verification ---
      let dependenciesAvailable = true;
      try {
        require("fs-extra");
        require("child_process");
        require("path");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply(toDarkStyle("Missing dependencies. Please install fs-extra, child_process, and path."));
      }

      const { threadID, senderID } = event;

      // --- Advanced Permission Fix ---
      // Checks both GOD configuration and ADMINBOT configuration
      const GOD = global.config.GOD || [];
      const ADMINS = global.config.ADMINBOT || [];
      const isAuthorized = GOD.includes(senderID) || ADMINS.includes(senderID);

      // If user is not authorized, stop execution immediately
      if (!isAuthorized) {
        return message.reply(toDarkStyle("⚠️ You do not have permission to use this system command!"));
      }

      if (!args[0]) {
        return message.reply(toDarkStyle("❌ Invalid command! Usage: cmdbackup [load/unload/loadAll/unloadAll/info/count] [module name]"));
      }

      let moduleList = args.slice(1);
      const commandAction = args[0].toLowerCase();

      // --- Command Switch Logic ---
      switch (commandAction) {
        case "count": {
          const commandCount = global.client.commands ? global.client.commands.size : 0;
          const eventCount = global.client.events ? global.client.events.size : 0;
          return message.reply(toDarkStyle(`ℹ️ Currently available: ${commandCount} commands and ${eventCount} events.`));
        }

        case "load": {
          if (!moduleList || moduleList.length === 0) {
            return message.reply(toDarkStyle("❌ Module name cannot be empty!"));
          }
          return this.loadCommand({ moduleList, threadID, api, message });
        }

        case "unload": {
          if (!moduleList || moduleList.length === 0) {
            return message.reply(toDarkStyle("❌ Module name cannot be empty!"));
          }
          return this.unloadModule({ moduleList, threadID, api, message });
        }

        case "loadall": {
          try {
            // Filter out system files and example files to prevent errors
            moduleList = fs.readdirSync(__dirname).filter((file) => 
              file.endsWith(".js") && 
              !file.includes('example') && 
              !file.includes('.temp')
            );
            moduleList = moduleList.map(item => item.replace(/\.js$/g, ""));
            return this.loadCommand({ moduleList, threadID, api, message });
          } catch (dirError) {
            console.error(toDarkStyle("❌ Error reading directory:"), dirError);
            return message.reply(toDarkStyle("❌ Failed to read command directory."));
          }
        }

        case "unloadall": {
          try {
            // Safety check: Don't unload the backup command itself easily
            moduleList = fs.readdirSync(__dirname).filter((file) => 
              file.endsWith(".js") && 
              !file.includes('example') && 
              !file.includes("cmdbackup") // Prevent unloading itself
            );
            moduleList = moduleList.map(item => item.replace(/\.js$/g, ""));
            return this.unloadModule({ moduleList, threadID, api, message });
          } catch (dirError) {
            console.error(toDarkStyle("❌ Error reading directory:"), dirError);
            return message.reply(toDarkStyle("❌ Failed to read command directory."));
          }
        }

        case "info": {
          const targetName = moduleList.join("").trim() || "";
          if (!targetName) return message.reply(toDarkStyle("❌ Please specify a module name to view info."));

          const command = global.client.commands.get(targetName);
          if (!command) {
            return message.reply(toDarkStyle(`❌ The module '${targetName}' does not exist!`));
          }

          const { name, version, role, credits, countDown, dependencies } = command.config;
          
          const permissionLevel =
            role == 0 ? "Regular User" :
            role == 1 ? "Admin" :
            role == 2 ? "Bot Operator" : "Unknown";

          const infoMsg = 
            toDarkStyle(`=== ${String(name).toUpperCase()} ===\n`) +
            toDarkStyle(`- Coded by: ${credits}\n`) +
            toDarkStyle(`- Version: ${version}\n`) +
            toDarkStyle(`- Permission: ${permissionLevel}\n`) +
            toDarkStyle(`- Cooldown: ${countDown}s\n`) +
            toDarkStyle(`- Dependencies: ${Object.keys(dependencies || {}).length ? Object.keys(dependencies || {}).join(", ") : "None"}`);

          return message.reply(infoMsg);
        }

        default: {
          return message.reply(toDarkStyle("❌ Invalid action! Usage: load, unload, loadAll, unloadAll, info, count"));
        }
      }
    } catch (error) {
      console.error("💥 CmdBackup Critical Error:", error);
      message.reply(toDarkStyle("❌ An internal error occurred while processing the command. Check console."));
    }
  },

  // -----------------------------------------------------------------------
  // 𝐋𝐨𝐚𝐝 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐨𝐠𝐢𝐜
  // -----------------------------------------------------------------------
  loadCommand: function ({ moduleList, threadID, api, message }) {
    const { execSync } = child_process;
    const { writeFileSync, readFileSync, unlinkSync, existsSync } = fs;
    const { join } = path;
    const { configPath, mainPath } = global.client;

    const errorList = [];
    const successList = [];

    // Clear config cache to ensure fresh data
    try {
      delete require.cache[require.resolve(configPath)];
    } catch (e) { /* Ignore cache clear error */ }

    let configValue;
    try {
      configValue = require(configPath);
    } catch (e) {
      return message.reply(toDarkStyle('❌ Config file load problem: ' + e.message));
    }

    // Create a temporary backup of config
    try {
      writeFileSync(configPath + '.temp', JSON.stringify(configValue, null, 4), 'utf8');
    } catch (backupError) {
      console.error("Backup failed:", backupError);
    }

    for (const nameModule of moduleList) {
      try {
        const dirModule = __dirname + '/' + nameModule + '.js';

        // 1. Verify file existence
        if (!existsSync(dirModule)) {
          throw new Error(`Module file ${nameModule}.js not found`);
        }

        // 2. Clear cache for the specific module
        try { 
          delete require.cache[require.resolve(dirModule)]; 
        } catch (e) { }

        // 3. Require the module
        const command = require(dirModule);

        // 4. Clean up previous instance from global commands
        if (global.client && global.client.commands && global.client.commands.has(nameModule))
          global.client.commands.delete(nameModule);

        // 5. Validate Module Structure
        if (!command.config || !command.onStart || !command.config.category) 
          throw new Error('Module structure is malformed (missing config/onStart)');

        // 6. Clean up Event Registrations
        if (Array.isArray(global.client.eventRegistered))
          global.client.eventRegistered = global.client.eventRegistered.filter(info => info != command.config.name);

        // 7. Auto-Install Dependencies
        if (command.config.dependencies && typeof command.config.dependencies === 'object') {
          const packageJsonPath = './package.json';
          let listPackage = {};
          try {
             listPackage = JSON.parse(readFileSync(packageJsonPath)).dependencies || {};
          } catch(e) { console.log("Warning: Could not read package.json") }
          
          const listbuiltinModules = require('module').builtinModules || [];

          for (const packageName in command.config.dependencies) {
            let loadSuccess = false;
            let lastError = null;
            const moduleDir = join(global.client.mainPath, 'nodemodules', 'node_modules', packageName);

            // Attempt to load
            try {
              if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName))
                global.nodemodule[packageName] = require(packageName);
              else
                global.nodemodule[packageName] = require(moduleDir);
              loadSuccess = true;
            } catch (err) {
              // Not found, attempt installation
              console.log(`⚠️ Package missing: ${packageName} - Installing for ${command.config.name}...`);
              const insPack = { stdio: 'inherit', env: process.env, shell: true, cwd: join(global.client.mainPath, 'nodemodules') };
              try {
                const version = command.config.dependencies[packageName];
                const installCmd = `npm --package-lock false --save install ${packageName}${version === '*' || version === '' ? '' : '@' + version}`;
                execSync(installCmd, insPack);
              } catch (e) {
                lastError = e;
              }

              // Retry loading after install
              for (let tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                try {
                  require.cache = {}; // Clear cache again
                  if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName))
                    global.nodemodule[packageName] = require(packageName);
                  else
                    global.nodemodule[packageName] = require(moduleDir);
                  loadSuccess = true;
                  break;
                } catch (e2) {
                  lastError = e2;
                }
              }
            }

            if (!loadSuccess) {
              throw new Error(`Unable to load package ${packageName}: ${lastError ? lastError.message : 'Unknown error'}`);
            }
          }
          console.log(`✅ Dependencies ready for ${command.config.name}`);
        }

        // 8. Env Config Handling
        if (command.config.envConfig && typeof command.config.envConfig === 'object') {
          try {
            global.configModule = global.configModule || {};
            
            // Ensure structures exist
            if (typeof global.configModule[command.config.name] === 'undefined')
              global.configModule[command.config.name] = {};
            if (typeof configValue[command.config.name] === 'undefined')
              configValue[command.config.name] = {};

            for (const [key, value] of Object.entries(command.config.envConfig)) {
              // Priority: Existing Config > Env Default
              if (typeof configValue[command.config.name][key] !== 'undefined')
                global.configModule[command.config.name][key] = configValue[command.config.name][key];
              else
                global.configModule[command.config.name][key] = value || '';

              // Sync back to configValue if missing
              if (typeof configValue[command.config.name][key] === 'undefined')
                configValue[command.config.name][key] = value || '';
            }
          } catch (error) {
            throw new Error(`EnvConfig Error: ${JSON.stringify(error)}`);
          }
        }

        // 9. Execute onLoad
        if (command.onLoad) {
          try {
            const onLoads = { configValue };
            command.onLoad(onLoads);
          } catch (error) {
            throw new Error(`onLoad Error: ${JSON.stringify(error)}`);
          }
        }

        // 10. Register Events
        if (command.handleEvent) {
          global.client.eventRegistered = global.client.eventRegistered || [];
          if (!global.client.eventRegistered.includes(command.config.name))
            global.client.eventRegistered.push(command.config.name);
        }

        // 11. Remove from Disabled List
        try {
          const removeDisabled = (list, item) => {
            if (Array.isArray(list) && list.includes(item)) {
              list.splice(list.indexOf(item), 1);
            }
          };
          
          if (configValue.commandDisabled) removeDisabled(configValue.commandDisabled, nameModule + '.js');
          if (global.config.commandDisabled) removeDisabled(global.config.commandDisabled, nameModule + '.js');
        } catch (e) { }

        // 12. Final Registration
        global.client.commands = global.client.commands || new Map();
        global.client.commands.set(command.config.name, command);
        
        console.log(`✅ Loaded: ${command.config.name}`);
        successList.push(nameModule);

      } catch (error) {
        console.error(`Error loading ${nameModule}:`, error);
        errorList.push(`- ${nameModule}: ${error && error.message ? error.message : String(error)}`);
      }
    }

    if (errorList.length > 0) {
      message.reply(toDarkStyle('❌ Command Load Errors:\n') + errorList.join('\n'));
    }

    if (successList.length > 0) {
      message.reply(toDarkStyle(`✅ Successfully loaded ${successList.length} command(s) 🎉`));
    }

    // Save Config Changes
    try {
      writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    } catch (e) {
      message.reply(toDarkStyle('⚠️ Config save problem: ' + e.message));
    }

    // Remove backup
    try { 
      unlinkSync(configPath + '.temp'); 
    } catch (e) { }
  },

  // -----------------------------------------------------------------------
  // 𝐔𝐧𝐥𝐨𝐚𝐝 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐨𝐠𝐢𝐜
  // -----------------------------------------------------------------------
  unloadModule: function ({ moduleList, threadID, api, message }) {
    const { writeFileSync, unlinkSync } = fs;
    const { configPath } = global.client;

    try {
      delete require.cache[require.resolve(configPath)];
    } catch (e) { }

    let configValue;
    try {
      configValue = require(configPath);
    } catch (e) {
      return message.reply(toDarkStyle('❌ Config load error: ' + e.message));
    }

    // Backup
    try {
      writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');
    } catch (backupError) {
      console.error("Backup failed:", backupError);
    }

    let unloadedCount = 0;

    for (const nameModule of moduleList) {
      try {
        // Remove from commands map
        if (global.client && global.client.commands && global.client.commands.has(nameModule))
          global.client.commands.delete(nameModule);

        // Remove from event registrations
        if (Array.isArray(global.client.eventRegistered))
          global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);

        // Add to disabled list in config
        if (!Array.isArray(configValue.commandDisabled)) configValue.commandDisabled = [];
        if (!Array.isArray(global.config.commandDisabled)) global.config.commandDisabled = [];

        if (!configValue.commandDisabled.includes(`${nameModule}.js`)) configValue.commandDisabled.push(`${nameModule}.js`);
        if (!global.config.commandDisabled.includes(`${nameModule}.js`)) global.config.commandDisabled.push(`${nameModule}.js`);

        console.log(`🗑️ Unloaded: ${nameModule}`);
        unloadedCount++;
      } catch (e) {
        console.log(`⚠️ Error unloading ${nameModule}: ${e.message}`);
      }
    }

    // Save Config
    try {
      writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    } catch (e) {
      message.reply(toDarkStyle('⚠️ Config save problem: ' + e.message));
    }

    // Remove backup
    try { 
      unlinkSync(configPath + ".temp"); 
    } catch (e) { }

    message.reply(toDarkStyle(`✅ Successfully unloaded ${unloadedCount} command(s) 🧾`));
  }
};
