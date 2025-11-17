module.exports = {
 config: {
 name: "leave",
 author: "xnil modify by Asif",
 role: 2, 
 shortDescription: "Make the bot leave the group",
 category: "admin",
 guide: "{pn}"
 },

 onStart: async function ({ api, event }) {
 const threadID = event.threadID;

 // Check if it's a group chat
 const threadInfo = await api.getThreadInfo(threadID);
 if (!threadInfo.isGroup) {
 return api.sendMessage("❌ This command can only be used in group chats.", threadID);
 }

 const groupName = threadInfo.threadName || "this group";
 
 await api.sendMessage(`😢 𝗕𝗼𝘁 𝗶𝘀 𝗹𝗲𝗮𝘃𝗶𝗻𝗴 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽:\n"${groupName}"\n\n𝗚𝗼𝗼𝗱𝗯𝘆𝗲 𝗲𝘃𝗲𝗿𝘆𝗼𝗻𝗲! 𝗦𝗮𝘆𝗼𝗻𝗮𝗿𝗮~ ✨`, threadID, () => {
 api.removeUserFromGroup(api.getCurrentUserID(), threadID);
 });
 }
};
