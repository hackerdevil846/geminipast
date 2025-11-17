const fs = require("fs-extra");
const child_process = require("child_process");
const path = require("path");

module.exports = {
  config: {
    name: "cmdbackup",
    aliases: [],
    version: "1.0.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
      en: "𝖡𝗈𝗍 𝗆𝗈𝖽𝗎𝗅𝖾 𝗆𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 𝖺𝗇𝖽 𝖿𝗎𝗅𝗅 𝖼𝗈𝗇𝗍𝗋𝗈𝗅"
    },
    longDescription: {
      en: "𝖬𝖺𝗇𝖺𝗀𝖾 𝖻𝗈𝗍 𝗆𝗈𝖽𝗎𝗅𝖾𝗌 (𝗅𝗈𝖺𝖽/𝗎𝗇𝗅𝗈𝖺𝖽/𝗂𝗇𝖿𝗈)"
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
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("fs-extra");
        require("child_process");
        require("path");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖼𝗁𝗂𝗅𝖽_𝗉𝗋𝗈𝖼𝖾𝗌𝗌, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
      }

      const { threadID, senderID } = event;
      const permission = global.config && global.config.GOD ? global.config.GOD : [];

      if (!Array.isArray(permission) || !permission.includes(senderID)) {
        return message.reply("⚠️ 𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽!");
      }

      if (!args[0]) {
        return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽! 𝖴𝗌𝖺𝗀𝖾: {p}cmdbackup [𝗅𝗈𝖺𝖽/𝗎𝗇𝗅𝗈𝖺𝖽/𝗅𝗈𝖺𝖽𝖠𝗅𝗅/𝗎𝗇𝗅𝗈𝖺𝖽𝖠𝗅𝗅/𝗂𝗇𝖿𝗈/𝖼𝗈𝗎𝗇𝗍] [𝗆𝗈𝖽𝗎𝗅𝖾 𝗇𝖺𝗆𝖾]");
      }

      let moduleList = args.slice(1);

      switch (args[0]) {
        case "count": {
          const commandCount = global.client.commands ? global.client.commands.size : 0;
          return message.reply(`ℹ️ 𝖢𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 ${commandCount} 𝖼𝗈𝗆𝗆𝖺𝗇𝖽(𝗌)`);
        }
        case "load": {
          if (!moduleList || moduleList.length === 0) {
            return message.reply("❌ 𝖬𝗈𝖽𝗎𝗅𝖾 𝗇𝖺𝗆𝖾 𝖼𝖺𝗇𝗇𝗈𝗍 𝖻𝖾 𝖾𝗆𝗉𝗍𝗒!");
          }
          return this.loadCommand({ moduleList, threadID, api, message });
        }
        case "unload": {
          if (!moduleList || moduleList.length === 0) {
            return message.reply("❌ 𝖬𝗈𝖽𝗎𝗅𝖾 𝗇𝖺𝗆𝖾 𝖼𝖺𝗇𝗇𝗈𝗍 𝖻𝖾 𝖾𝗆𝗉𝗍𝗒!");
          }
          return this.unloadModule({ moduleList, threadID, api, message });
        }
        case "loadAll": {
          try {
            moduleList = fs.readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js$/g, ""));
            return this.loadCommand({ moduleList, threadID, api, message });
          } catch (dirError) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
            return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
          }
        }
        case "unloadAll": {
          try {
            moduleList = fs.readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example') && !file.includes("command"));
            moduleList = moduleList.map(item => item.replace(/\.js$/g, ""));
            return this.unloadModule({ moduleList, threadID, api, message });
          } catch (dirError) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
            return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
          }
        }
        case "info": {
          const targetName = moduleList.join("").trim() || "";
          const command = global.client.commands.get(targetName);
          if (!command) {
            return message.reply("❌ 𝖳𝗁𝖾 𝗆𝗈𝖽𝗎𝗅𝖾 𝗒𝗈𝗎 𝖾𝗇𝗍𝖾𝗋𝖾𝖽 𝖽𝗈𝖾𝗌 𝗇𝗈𝗍 𝖾𝗑𝗂𝗌𝗍!");
          }

          const { name, version, role, credits, countDown, dependencies } = command.config;
          const permissionLevel =
            role == 0 ? "𝖱𝖾𝗀𝗎𝗅𝖺𝗋 𝗎𝗌𝖾𝗋" :
            role == 1 ? "𝖠𝖽𝗆𝗂𝗇" :
            "𝖡𝗈𝗍 𝗈𝗉𝖾𝗋𝖺𝗍𝗈𝗋";

          const infoMsg = 
            `=== ${String(name).toUpperCase()} ===\n` +
            `- 𝖢𝗈𝖽𝖾𝖽 𝖻𝗒: ${credits}\n` +
            `- 𝖵𝖾𝗋𝗌𝗂𝗈𝗇: ${version}\n` +
            `- 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖫𝖾𝗏𝖾𝗅: ${permissionLevel}\n` +
            `- 𝖢𝗈𝗈𝗅𝖽𝗈𝗐𝗇: ${countDown} 𝗌𝖾𝖼𝗈𝗇𝖽(𝗌)\n` +
            `- 𝖯𝖺𝖼𝗄𝖺𝗀𝖾𝗌 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽: ${Object.keys(dependencies || {}).length ? Object.keys(dependencies || {}).join(", ") : "𝖭𝗈𝗇𝖾"}`;

          return message.reply(infoMsg);
        }
        default: {
          return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽! 𝖴𝗌𝖺𝗀𝖾: {p}cmdbackup [𝗅𝗈𝖺𝖽/𝗎𝗇𝗅𝗈𝖺𝖽/𝗅𝗈𝖺𝖽𝖠𝗅𝗅/𝗎𝗇𝗅𝗈𝖺𝖽𝖠𝗅𝗅/𝗂𝗇𝖿𝗈/𝖼𝗈𝗎𝗇𝗍] [𝗆𝗈𝖽𝗎𝗅𝖾 𝗇𝖺𝗆𝖾]");
        }
      }
    } catch (error) {
      console.error("💥 𝖢𝗆𝖽𝖻𝖺𝖼𝗄𝗎𝗉 𝖤𝗋𝗋𝗈𝗋:", error);
      message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
    }
  },

  loadCommand: function ({ moduleList, threadID, api, message }) {
    const { execSync } = child_process;
    const { writeFileSync, readFileSync, unlinkSync } = fs;
    const { join } = path;
    const { configPath, mainPath } = global.client;

    const errorList = [];

    try {
      delete require.cache[require.resolve(configPath)];
    } catch (e) { }

    let configValue;
    try {
      configValue = require(configPath);
    } catch (e) {
      return message.reply('❌ 𝖢𝗈𝗇𝖿𝗂𝗀 𝖿𝗂𝗅𝖾 𝗅𝗈𝖺𝖽 𝗉𝗋𝗈𝖻𝗅𝖾𝗆: ' + e.message);
    }

    // Create backup config
    try {
      writeFileSync(configPath + '.temp', JSON.stringify(configValue, null, 4), 'utf8');
    } catch (backupError) {
      console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗈𝗇𝖿𝗂𝗀 𝖻𝖺𝖼𝗄𝗎𝗉:", backupError);
    }

    for (const nameModule of moduleList) {
      try {
        const dirModule = __dirname + '/' + nameModule + '.js';

        // Check if module file exists
        if (!fs.existsSync(dirModule)) {
          throw new Error('𝖬𝗈𝖽𝗎𝗅𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽');
        }

        try { 
          delete require.cache[require.resolve(dirModule)]; 
        } catch (e) { }

        const command = require(dirModule);

        if (global.client && global.client.commands && global.client.commands.has(nameModule))
          global.client.commands.delete(nameModule);

        if (!command.config || !command.onStart || !command.config.category) 
          throw new Error('𝖬𝗈𝖽𝗎𝗅𝖾 𝗆𝖺𝗅𝖿𝗈𝗋𝗆𝖾𝖽!');

        if (Array.isArray(global.client.eventRegistered))
          global.client.eventRegistered = global.client.eventRegistered.filter(info => info != command.config.name);

        // Handle dependencies
        if (command.config.dependencies && typeof command.config.dependencies === 'object') {
          const listPackage = JSON.parse(readFileSync('./package.json')).dependencies || {};
          const listbuiltinModules = require('module').builtinModules || [];

          for (const packageName in command.config.dependencies) {
            let loadSuccess = false;
            let lastError = null;
            const moduleDir = join(global.client.mainPath, 'nodemodules', 'node_modules', packageName);

            try {
              if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName))
                global.nodemodule[packageName] = require(packageName);
              else
                global.nodemodule[packageName] = require(moduleDir);
              loadSuccess = true;
            } catch (err) {
              console.log('⚠️ 𝖯𝖺𝖼𝗄𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽: ' + packageName + ' — 𝗂𝗇𝗌𝗍𝖺𝗅𝗅𝗂𝗇𝗀 𝖿𝗈𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 ' + command.config.name + '...');
              const insPack = { stdio: 'inherit', env: process.env, shell: true, cwd: join(global.client.mainPath, 'nodemodules') };
              try {
                execSync('npm --package-lock false --save install ' + packageName + (command.config.dependencies[packageName] == '*' || command.config.dependencies[packageName] == '' ? '' : '@' + command.config.dependencies[packageName]), insPack);
              } catch (e) {
                lastError = e;
              }

              for (let tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                try {
                  require.cache = {};
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
              throw new Error('𝖴𝗇𝖺𝖻𝗅𝖾 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗉𝖺𝖼𝗄𝖺𝗀𝖾 ' + packageName + ' 𝖿𝗈𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 ' + command.config.name + ', 𝖾𝗋𝗋𝗈𝗋: ' + (lastError ? lastError.message : '𝗎𝗇𝗄𝗇𝗈𝗐𝗇'));
            }
          }

          console.log('✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗂𝗇𝗌𝗍𝖺𝗅𝗅𝖾𝖽/𝗅𝗈𝖺𝖽𝖾𝖽 𝗉𝖺𝖼𝗄𝖺𝗀𝖾𝗌 𝖿𝗈𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 ' + command.config.name + '!');
        }

        // Handle environment config
        if (command.config.envConfig && typeof command.config.envConfig === 'object') {
          try {
            global.configModule = global.configModule || {};
            for (const [key, value] of Object.entries(command.config.envConfig)) {
              if (typeof global.configModule[command.config.name] === 'undefined')
                global.configModule[command.config.name] = {};
              if (typeof configValue[command.config.name] === 'undefined')
                configValue[command.config.name] = {};

              if (typeof configValue[command.config.name][key] !== 'undefined')
                global.configModule[command.config.name][key] = configValue[command.config.name][key];
              else
                global.configModule[command.config.name][key] = value || '';

              if (typeof configValue[command.config.name][key] === 'undefined')
                configValue[command.config.name][key] = value || '';
            }
            console.log('🔧 𝖫𝗈𝖺𝖽𝖾𝖽 𝖼𝗈𝗇𝖿𝗂𝗀 𝖿𝗈𝗋 ' + command.config.name);
          } catch (error) {
            throw new Error('𝖴𝗇𝖺𝖻𝗅𝖾 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖼𝗈𝗇𝖿𝗂𝗀 𝗆𝗈𝖽𝗎𝗅𝖾, 𝖾𝗋𝗋𝗈𝗋: ' + JSON.stringify(error));
          }
        }

        // Handle onLoad
        if (command.onLoad) {
          try {
            const onLoads = { configValue };
            command.onLoad(onLoads);
          } catch (error) {
            throw new Error('𝖴𝗇𝖺𝖻𝗅𝖾 𝗍𝗈 𝗈𝗇𝖫𝗈𝖺𝖽 𝗆𝗈𝖽𝗎𝗅𝖾, 𝖾𝗋𝗋𝗈𝗋: ' + JSON.stringify(error));
          }
        }

        // Handle events
        if (command.handleEvent) {
          global.client.eventRegistered = global.client.eventRegistered || [];
          if (!global.client.eventRegistered.includes(command.config.name))
            global.client.eventRegistered.push(command.config.name);
        }

        // Handle disabled commands
        try {
          if ((global.config && Array.isArray(global.config.commandDisabled) && global.config.commandDisabled.includes(nameModule + '.js')) ||
            (configValue && Array.isArray(configValue.commandDisabled) && configValue.commandDisabled.includes(nameModule + '.js'))) {
            if (Array.isArray(configValue.commandDisabled) && configValue.commandDisabled.includes(nameModule + '.js')) {
              configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + '.js'), 1);
            }
            if (global.config && Array.isArray(global.config.commandDisabled) && global.config.commandDisabled.includes(nameModule + '.js')) {
              global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + '.js'), 1);
            }
          }
        } catch (e) {
        }

        global.client.commands = global.client.commands || new Map();
        global.client.commands.set(command.config.name, command);
        console.log('✅ 𝖫𝗈𝖺𝖽𝖾𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 ' + command.config.name + '!');
      } catch (error) {
        errorList.push('- ' + nameModule + ' 𝗋𝖾𝖺𝗌𝗈𝗇: ' + (error && error.message ? error.message : String(error)));
      }
    }

    if (errorList.length !== 0) {
      message.reply('❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝗅𝗈𝖺𝖽 𝗉𝗋𝗈𝖻𝗅𝖾𝗆:\n' + errorList.join('\n'));
    }

    message.reply(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗅𝗈𝖺𝖽𝖾𝖽 ${moduleList.length - errorList.length} 𝖼𝗈𝗆𝗆𝖺𝗇𝖽(𝗌) 🎉`);

    // Save config
    try {
      writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    } catch (e) {
      message.reply('⚠️ 𝖢𝗈𝗇𝖿𝗂𝗀 𝗌𝖺𝗏𝖾 𝗉𝗋𝗈𝖻𝗅𝖾𝗆: ' + e.message);
    }

    // Cleanup backup
    try { 
      unlinkSync(configPath + '.temp'); 
    } catch (e) { }
  },

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
      return message.reply('❌ 𝖢𝗈𝗇𝖿𝗂𝗀 𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋: ' + e.message);
    }

    // Create backup
    try {
      writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');
    } catch (backupError) {
      console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗈𝗇𝖿𝗂𝗀 𝖻𝖺𝖼𝗄𝗎𝗉:", backupError);
    }

    for (const nameModule of moduleList) {
      try {
        if (global.client && global.client.commands && global.client.commands.has(nameModule))
          global.client.commands.delete(nameModule);

        if (Array.isArray(global.client.eventRegistered))
          global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);

        if (!Array.isArray(configValue.commandDisabled)) configValue.commandDisabled = [];
        if (!Array.isArray(global.config.commandDisabled)) global.config.commandDisabled = [];

        if (!configValue.commandDisabled.includes(`${nameModule}.js`)) configValue.commandDisabled.push(`${nameModule}.js`);
        if (!global.config.commandDisabled.includes(`${nameModule}.js`)) global.config.commandDisabled.push(`${nameModule}.js`);

        console.log(`🗑️ 𝖴𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 ${nameModule}!`);
      } catch (e) {
        console.log(`⚠️ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 ${nameModule}: ${e.message}`);
      }
    }

    // Save config
    try {
      writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    } catch (e) {
      message.reply('⚠️ 𝖢𝗈𝗇𝖿𝗂𝗀 𝗌𝖺𝗏𝖾 𝗉𝗋𝗈𝖻𝗅𝖾𝗆: ' + e.message);
    }

    // Cleanup backup
    try { 
      unlinkSync(configPath + ".temp"); 
    } catch (e) { }

    message.reply(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗎𝗇𝗅𝗈𝖺𝖽𝖾𝖽 ${moduleList.length} 𝖼𝗈𝗆𝗆𝖺𝗇𝖽(𝗌) 🧾`);
  }
};
