module.exports = {
	config: {
		name: "setalias",
		version: "1.8",
		author: "NTKhang & 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
		countDown: 5,
		role: 0,
		description: {
			en: "𝐴𝑑𝑑 𝑎𝑛 𝑎𝑙𝑖𝑎𝑠 𝑓𝑜𝑟 𝑎𝑛𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝"
		},
		category: "config",
		guide: {
			en: "╭─━━━━━━━━━━━━─╮\n" +
				"│    𝐀𝐋𝐈𝐀𝐒 𝐆𝐔𝐈𝐃𝐄    │\n" +
				"╰─━━━━━━━━━━━━─╯\n" +
				"🔹 {pn} 𝑎𝑑𝑑 <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑>\n" +
				"   ↳ 𝐴𝑑𝑑 𝑔𝑟𝑜𝑢𝑝 𝑎𝑙𝑖𝑎𝑠\n\n" +
				"🔹 {pn} 𝑎𝑑𝑑 <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑> -𝑔\n" +
				"   ↳ 𝐴𝑑𝑑 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠 (𝑎𝑑𝑚𝑖𝑛 𝑜𝑛𝑙𝑦)\n\n" +
				"🔹 {pn} [𝑟𝑒𝑚𝑜𝑣𝑒 | 𝑟𝑚] <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑>\n" +
				"   ↳ 𝑅𝑒𝑚𝑜𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑙𝑖𝑎𝑠\n\n" +
				"🔹 {pn} [𝑟𝑒𝑚𝑜𝑣𝑒 | 𝑟𝑚] <𝑎𝑙𝑖𝑎𝑠> <𝑐𝑜𝑚𝑚𝑎𝑛𝑑> -𝑔\n" +
				"   ↳ 𝑅𝑒𝑚𝑜𝑣𝑒 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠 (𝑎𝑑𝑚𝑖𝑛 𝑜𝑛𝑙𝑦)\n\n" +
				"🔹 {pn} 𝑙𝑖𝑠𝑡\n" +
				"   ↳ 𝐿𝑖𝑠𝑡 𝑔𝑟𝑜𝑢𝑝 𝑎𝑙𝑖𝑎𝑠𝑒𝑠\n\n" +
				"🔹 {pn} 𝑙𝑖𝑠𝑡 -𝑔\n" +
				"   ↳ 𝐿𝑖𝑠𝑡 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠𝑒𝑠\n\n" +
				"╭─━━━━━━━━━━─╮\n" +
				"│   𝐄𝐗𝐀𝐌𝐏𝐋𝐄𝐒   │\n" +
				"╰─━━━━━━━━━━─╯\n" +
				"✨ {pn} 𝑎𝑑𝑑 𝑐𝑡𝑟𝑘 𝑐𝑢𝑠𝑡𝑜𝑚𝑟𝑎𝑛𝑘𝑐𝑎𝑟𝑑\n" +
				"✨ {pn} 𝑟𝑚 𝑐𝑡𝑟𝑘 𝑐𝑢𝑠𝑡𝑜𝑚𝑟𝑎𝑛𝑘𝑐𝑎𝑟𝑑\n" +
				"✨ {pn} 𝑙𝑖𝑠𝑡"
		}
	},

	langs: {
		en: {
			commandNotExist: "❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 \"%1\" 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡",
			aliasExist: "❌ 𝐴𝑙𝑖𝑎𝑠 \"%1\" 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%2\" 𝑖𝑛 𝑡ℎ𝑒 𝑠𝑦𝑠𝑡𝑒𝑚",
			addAliasSuccess: "✅ 𝐴𝑑𝑑𝑒𝑑 𝑎𝑙𝑖𝑎𝑠 \"%1\" 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%2\" 𝑖𝑛 𝑡ℎ𝑒 𝑠𝑦𝑠𝑡𝑒𝑚",
			noPermissionAdd: "❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑎𝑑𝑑 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠𝑒𝑠",
			aliasIsCommand: "❌ 𝐴𝑙𝑖𝑎𝑠 \"%1\" 𝑐𝑜𝑛𝑓𝑙𝑖𝑐𝑡𝑠 𝑤𝑖𝑡ℎ 𝑒𝑥𝑖𝑠𝑡𝑖𝑛𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑",
			aliasExistInGroup: "❌ 𝐴𝑙𝑖𝑎𝑠 \"%1\" 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%2\" 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝",
			addAliasToGroupSuccess: "✨ 𝐴𝑙𝑖𝑎𝑠 \"%1\" 𝑎𝑑𝑑𝑒𝑑 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%2\" 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝",
			aliasNotExist: "❌ 𝐴𝑙𝑖𝑎𝑠 \"%1\" 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡 𝑓𝑜𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%2\"",
			removeAliasSuccess: "🗑️ 𝐴𝑙𝑖𝑎𝑠 \"%1\" 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%2\" 𝑖𝑛 𝑡ℎ𝑒 𝑠𝑦𝑠𝑡𝑒𝑚",
			noPermissionDelete: "❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠𝑒𝑠",
			noAliasInGroup: "❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 \"%1\" ℎ𝑎𝑠 𝑛𝑜 𝑎𝑙𝑖𝑎𝑠𝑒𝑠 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝",
			removeAliasInGroupSuccess: "🗑️ 𝐴𝑙𝑖𝑎𝑠 \"%1\" 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%2\" 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝",
			aliasList: "╭─━━━━━━━━━━━━━─╮\n" +
					   "│  𝐆𝐋𝐎𝐁𝐀𝐋 𝐀𝐋𝐈𝐀𝐒𝐄𝐒  │\n" +
					   "╰─━━━━━━━━━━━━━─╯\n%1",
			noAliasInSystem: "ℹ️ 𝑁𝑜 𝑔𝑙𝑜𝑏𝑎𝑙 𝑎𝑙𝑖𝑎𝑠𝑒𝑠 𝑒𝑥𝑖𝑠𝑡",
			notExistAliasInGroup: "ℹ️ 𝑌𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 ℎ𝑎𝑠 𝑛𝑜 𝑎𝑙𝑖𝑎𝑠𝑒𝑠",
			aliasListInGroup: "╭─━━━━━━━━━━━━━─╮\n" +
							  "│  𝐆𝐑𝐎𝐔𝐏 𝐀𝐋𝐈𝐀𝐒𝐄𝐒  │\n" +
							  "╰─━━━━━━━━━━━━━─╯\n%1"
		}
	},

	onStart: async function ({ message, event, args, threadsData, globalData, role, getLang }) {
		const aliasesData = await threadsData.get(event.threadID, "data.aliases", {});

		switch (args[0]) {
			case "add": {
				if (!args[2])
					return message.SyntaxError();
				const commandName = args[2].toLowerCase();
				if (!global.GoatBot.commands.has(commandName))
					return message.reply(getLang("commandNotExist", commandName));
				const alias = args[1].toLowerCase();

				if (args[3] == '-g') {
					if (role < 2) {
						return message.reply(getLang("noPermissionAdd", alias, commandName));
					}
					
					const globalAliasesData = await globalData.get('setalias', 'data', []);
					const globalAliasesExist = globalAliasesData.find(item => item.aliases.includes(alias));
					if (globalAliasesExist)
						return message.reply(getLang("aliasExist", alias, globalAliasesExist.commandName));
					if (global.GoatBot.aliases.has(alias))
						return message.reply(getLang("aliasExist", alias, global.GoatBot.aliases.get(alias)));
					
					const globalAliasesThisCommand = globalAliasesData.find(aliasData => aliasData.commandName == commandName);
					if (globalAliasesThisCommand)
						globalAliasesThisCommand.aliases.push(alias);
					else
						globalAliasesData.push({
							commandName,
							aliases: [alias]
						});
					
					await globalData.set('setalias', globalAliasesData, 'data');
					global.GoatBot.aliases.set(alias, commandName);
					return message.reply(getLang("addAliasSuccess", alias, commandName));
				}

				if (global.GoatBot.commands.get(alias))
					return message.reply(getLang("aliasIsCommand", alias));
				if (global.GoatBot.aliases.has(alias))
					return message.reply(getLang("aliasExist", alias, global.GoatBot.aliases.get(alias)));
				
				for (const cmdName in aliasesData)
					if (aliasesData[cmdName].includes(alias))
						return message.reply(getLang("aliasExistInGroup", alias, cmdName));

				const oldAlias = aliasesData[commandName] || [];
				oldAlias.push(alias);
				aliasesData[commandName] = oldAlias;
				await threadsData.set(event.threadID, aliasesData, "data.aliases");
				return message.reply(getLang("addAliasToGroupSuccess", alias, commandName));
			}
			
			case "remove":
			case "rm": {
				if (!args[2])
					return message.SyntaxError();
				const commandName = args[2].toLowerCase();
				const alias = args[1].toLowerCase();

				if (!global.GoatBot.commands.has(commandName))
					return message.reply(getLang("commandNotExist", commandName));

				if (args[3] == '-g') {
					if (role < 2) {
						return message.reply(getLang("noPermissionDelete", alias, commandName));
					}
					
					const globalAliasesData = await globalData.get('setalias', 'data', []);
					const globalAliasesThisCommand = globalAliasesData.find(aliasData => aliasData.commandName == commandName);
					if (!globalAliasesThisCommand || !globalAliasesThisCommand.aliases.includes(alias))
						return message.reply(getLang("aliasNotExist", alias, commandName));
					
					globalAliasesThisCommand.aliases.splice(globalAliasesThisCommand.aliases.indexOf(alias), 1);
					await globalData.set('setalias', globalAliasesData, 'data');
					global.GoatBot.aliases.delete(alias);
					return message.reply(getLang("removeAliasSuccess", alias, commandName));
				}

				const oldAlias = aliasesData[commandName];
				if (!oldAlias)
					return message.reply(getLang("noAliasInGroup", commandName));
				
				const index = oldAlias.indexOf(alias);
				if (index === -1)
					return message.reply(getLang("aliasNotExist", alias, commandName));
				
				oldAlias.splice(index, 1);
				await threadsData.set(event.threadID, aliasesData, "data.aliases");
				return message.reply(getLang("removeAliasInGroupSuccess", alias, commandName));
			}
			
			case "list": {
				if (args[1] == '-g') {
					const globalAliasesData = await globalData.get('setalias', 'data', []);
					const globalAliases = globalAliasesData.map(aliasData => ({
						commandName: aliasData.commandName,
						aliases: aliasData.aliases.join(', ')
					}));
					
					return message.reply(
						globalAliases.length ?
							getLang("aliasList", globalAliases.map(alias => `🔹 ${alias.commandName}: ${alias.aliases}`).join('\n')) :
							getLang("noAliasInSystem")
					);
				}

				if (!Object.keys(aliasesData).length)
					return message.reply(getLang("notExistAliasInGroup"));
				
				const list = Object.keys(aliasesData).map(commandName => `🔹 ${commandName}: ${aliasesData[commandName].join(", ")}`);
				return message.reply(getLang("aliasListInGroup", list.join("\n")));
			}
			
			default: {
				return message.SyntaxError();
			}
		}
	}
};
