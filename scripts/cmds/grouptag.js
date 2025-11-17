module.exports = {
	config: {
		name: "grouptag",
		aliases: ["grtag"],
		version: "2.0",
		author: "NTKhang & 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
		countDown: 5,
		role: 0,
		description: {
			en: "Tag members by group"
		},
		category: "info",
		guide: {
			en: "   {pn} add <groupTagName> <@tags>: add new group tag or add members to existing group tag"
				+ "\n   Example:"
				+ "\n    {pn} add TEAM1 @tag1 @tag2"
				+ "\n\n   {pn} del <groupTagName> <@tags>: remove members from group tag"
				+ "\n   Example:"
				+ "\n    {pn} del TEAM1 @tag1 @tag2"
				+ "\n\n   {pn} remove <groupTagName>: remove entire group tag"
				+ "\n   Example:"
				+ "\n    {pn} remove TEAM1"
				+ "\n\n   {pn} tag <groupTagName>: tag all members in group"
				+ "\n\n   {pn} rename <groupTagName> | <newGroupTagName>: rename group tag"
				+ "\n\n   {pn} list | all: view all group tags"
				+ "\n\n   {pn} info <groupTagName>: view group tag info"
		}
	},

	langs: {
		en: {
			noGroupTagName: "❌ Please enter group tag name",
			noMention: "❌ Please tag members to add to group tag",
			addedSuccess: "✅ Added members to group \"%1\":\n%2",
			addedSuccess2: "✅ Created group \"%1\" with members:\n%2",
			existedInGroupTag: "⚠️ These members already exist in \"%2\":\n%1",
			notExistedInGroupTag: "❌ These members not found in \"%2\":\n%1",
			noExistedGroupTag: "❌ Group \"%1\" doesn't exist",
			noExistedGroupTag2: "❌ No group tags created yet",
			noMentionDel: "❌ Please tag members to remove from \"%1\"",
			deletedSuccess: "✅ Removed from \"%2\":\n%1",
			deletedSuccess2: "✅ Deleted group \"%1\"",
			tagged: "🔔 Tagging group \"%1\":\n%2",
			noGroupTagName2: "❌ Format: rename OLDNAME | NEWNAME",
			renamedSuccess: "✅ Renamed \"%1\" to \"%2\"",
			infoGroupTag: "📑 Group: %1\n👥 Members: %2\n📋 List:\n%3",
			dataError: "❌ Data error, please try again",
			emptyGroup: "⚠️ Group \"%1\" is now empty and was auto-removed"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang }) {
		const { threadID, mentions } = event;
		
		// Clean mentions
		const cleanedMentions = {};
		for (const uid in mentions) {
			if (uid) {
				cleanedMentions[uid] = mentions[uid].replace("@", "").trim();
			}
		}

		// Get group tags data safely
		let groupTags;
		try {
			groupTags = await threadsData.get(threadID, "data.groupTags") || [];
			if (!Array.isArray(groupTags)) {
				groupTags = [];
			}
		} catch (error) {
			console.error("GroupTag data error:", error);
			groupTags = [];
		}

		const command = (args[0] || "tag").toLowerCase();

		switch (command) {
			case "add": {
				if (args.length < 2) {
					return message.reply(getLang("noGroupTagName"));
				}

				const mentionsID = Object.keys(cleanedMentions);
				if (mentionsID.length === 0) {
					return message.reply(getLang("noMention"));
				}

				// Extract group name from message
				const content = args.slice(1).join(" ");
				let groupTagName = content;
				
				// Find group name before first mention
				for (const uid of mentionsID) {
					const mentionText = cleanedMentions[uid];
					const mentionIndex = content.indexOf(mentionText);
					if (mentionIndex > -1) {
						groupTagName = content.substring(0, mentionIndex).trim();
						break;
					}
				}

				if (!groupTagName) {
					return message.reply(getLang("noGroupTagName"));
				}

				// Find existing group
				const existingGroup = groupTags.find(g => g.name.toLowerCase() === groupTagName.toLowerCase());
				
				if (existingGroup) {
					const added = [];
					const existed = [];
					
					for (const uid in cleanedMentions) {
						if (existingGroup.users[uid]) {
							existed.push(cleanedMentions[uid]);
						} else {
							existingGroup.users[uid] = cleanedMentions[uid];
							added.push(cleanedMentions[uid]);
						}
					}

					await threadsData.set(threadID, groupTags, "data.groupTags");

					let msg = "";
					if (added.length > 0) {
						msg += getLang("addedSuccess", groupTagName, added.join("\n")) + "\n";
					}
					if (existed.length > 0) {
						msg += getLang("existedInGroupTag", existed.join("\n"), groupTagName);
					}
					return message.reply(msg);
				} 
				else {
					// Create new group
					groupTags.push({
						name: groupTagName,
						users: { ...cleanedMentions }
					});
					await threadsData.set(threadID, groupTags, "data.groupTags");
					return message.reply(getLang("addedSuccess2", groupTagName, Object.values(cleanedMentions).join("\n")));
				}
			}

			case "list":
			case "all": {
				if (groupTags.length === 0) {
					return message.reply(getLang("noExistedGroupTag2"));
				}

				// Show specific group info if name provided
				if (args[1]) {
					const groupName = args.slice(1).join(" ");
					const group = groupTags.find(g => g.name.toLowerCase() === groupName.toLowerCase());
					if (!group) {
						return message.reply(getLang("noExistedGroupTag", groupName));
					}
					return showInfoGroupTag(message, group, getLang);
				}

				// Show all groups
				const list = groupTags.map(group => 
					`\n\n📌 ${group.name} (${Object.keys(group.users).length} members):\n ${Object.values(group.users).join("\n ")}`
				).join("");
				
				return message.reply(`📋 Your Group Tags:${list}`);
			}

			case "info": {
				if (args.length < 2) {
					return message.reply(getLang("noGroupTagName"));
				}
				
				const groupName = args.slice(1).join(" ");
				const group = groupTags.find(g => g.name.toLowerCase() === groupName.toLowerCase());
				if (!group) {
					return message.reply(getLang("noExistedGroupTag", groupName));
				}
				return showInfoGroupTag(message, group, getLang);
			}

			case "del": {
				if (args.length < 2) {
					return message.reply(getLang("noGroupTagName"));
				}

				const mentionsID = Object.keys(cleanedMentions);
				if (mentionsID.length === 0) {
					const groupName = args.slice(1).join(" ");
					return message.reply(getLang("noMentionDel", groupName));
				}

				// Extract group name
				const content = args.slice(1).join(" ");
				let groupTagName = content;
				
				for (const uid of mentionsID) {
					const mentionText = cleanedMentions[uid];
					const mentionIndex = content.indexOf(mentionText);
					if (mentionIndex > -1) {
						groupTagName = content.substring(0, mentionIndex).trim();
						break;
					}
				}

				if (!groupTagName) {
					return message.reply(getLang("noGroupTagName"));
				}

				const group = groupTags.find(g => g.name.toLowerCase() === groupTagName.toLowerCase());
				if (!group) {
					return message.reply(getLang("noExistedGroupTag", groupTagName));
				}

				const removed = [];
				const notFound = [];
				
				for (const uid in cleanedMentions) {
					if (group.users[uid]) {
						delete group.users[uid];
						removed.push(cleanedMentions[uid]);
					} else {
						notFound.push(cleanedMentions[uid]);
					}
				}

				// Auto-remove empty group
				if (Object.keys(group.users).length === 0) {
					const index = groupTags.indexOf(group);
					groupTags.splice(index, 1);
					await threadsData.set(threadID, groupTags, "data.groupTags");
					return message.reply(getLang("deletedSuccess", removed.join("\n"), groupTagName) + 
						`\n${getLang("emptyGroup", groupTagName)}`);
				}

				await threadsData.set(threadID, groupTags, "data.groupTags");

				let msg = "";
				if (removed.length > 0) {
					msg += getLang("deletedSuccess", removed.join("\n"), groupTagName) + "\n";
				}
				if (notFound.length > 0) {
					msg += getLang("notExistedInGroupTag", notFound.join("\n"), groupTagName);
				}
				return message.reply(msg);
			}

			case "remove":
			case "rm": {
				if (args.length < 2) {
					return message.reply(getLang("noGroupTagName"));
				}

				const groupName = args.slice(1).join(" ").trim();
				const index = groupTags.findIndex(g => g.name.toLowerCase() === groupName.toLowerCase());
				
				if (index === -1) {
					return message.reply(getLang("noExistedGroupTag", groupName));
				}

				groupTags.splice(index, 1);
				await threadsData.set(threadID, groupTags, "data.groupTags");
				return message.reply(getLang("deletedSuccess2", groupName));
			}

			case "rename": {
				if (args.length < 2) {
					return message.reply(getLang("noGroupTagName2"));
				}

				const content = args.slice(1).join(" ");
				const parts = content.split("|").map(p => p.trim());
				
				if (parts.length < 2 || !parts[0] || !parts[1]) {
					return message.reply(getLang("noGroupTagName2"));
				}

				const [oldName, newName] = parts;
				const group = groupTags.find(g => g.name.toLowerCase() === oldName.toLowerCase());
				
				if (!group) {
					return message.reply(getLang("noExistedGroupTag", oldName));
				}

				// Check if new name already exists
				if (groupTags.some(g => g.name.toLowerCase() === newName.toLowerCase() && g !== group)) {
					return message.reply("❌ Group name already exists");
				}

				group.name = newName;
				await threadsData.set(threadID, groupTags, "data.groupTags");
				return message.reply(getLang("renamedSuccess", oldName, newName));
			}

			case "tag":
			default: {
				const startIndex = command === "tag" ? 1 : 0;
				const groupName = args.slice(startIndex).join(" ").trim();
				
				if (!groupName) {
					return message.reply(getLang("noGroupTagName"));
				}

				const group = groupTags.find(g => g.name.toLowerCase() === groupName.toLowerCase());
				if (!group) {
					return message.reply(getLang("noExistedGroupTag", groupName));
				}

				const mentionsList = [];
				let memberList = "";
				
				for (const uid in group.users) {
					const name = group.users[uid];
					mentionsList.push({
						id: uid,
						tag: name
					});
					memberList += `• ${name}\n`;
				}

				return message.reply({
					body: getLang("tagged", group.name, memberList),
					mentions: mentionsList
				});
			}
		}
	}
};

function showInfoGroupTag(message, groupTag, getLang) {
	const members = Object.values(groupTag.users).map(name => `• ${name}`).join("\n");
	return message.reply(getLang("infoGroupTag", groupTag.name, Object.keys(groupTag.users).length, members));
}
