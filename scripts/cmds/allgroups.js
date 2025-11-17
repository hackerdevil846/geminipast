module.exports = {
  config: {
    name: "allgroups",
    aliases: [],
    version: "2.0.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
      en: "List all groups and manage group actions"
    },
    longDescription: {
      en: "List all groups and allow banning or leaving groups"
    },
    guide: {
      en: "{p}allgroups"
    }
  },

  onStart: async function({ api, event, threadsData }) {
    try {
      var inbox = await api.getThreadList(100, null, ['INBOX']);
      let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);

      var listthread = [];
      for (var groupInfo of list) {
        let data = await api.getThreadInfo(groupInfo.threadID);
        listthread.push({
          id: groupInfo.threadID,
          name: groupInfo.name,
          sotv: data.userInfo.length,
        });
      }

      var listbox = listthread.sort((a, b) => {
        if (a.sotv > b.sotv) return -1;
        if (a.sotv < b.sotv) return 1;
        return 0;
      });

      let msg = 'List of groups you are in:\n\n';
      let i = 1;
      var groupid = [];
      for (var group of listbox) {
        msg += `${i++}. ${group.name}\nGroup ID: ${group.id}\nMembers: ${group.sotv}\n\n`;
        groupid.push(group.id);
      }

      msg += 'Reply with "ban [number]" to ban a group or "out [number]" to leave a group.\n';
      msg += 'Use "all" instead of a number to apply to all groups.\n';
      msg += 'Example: "ban 3" to ban the 3rd group in the list.\n';
      msg += 'Or "out all" to leave all groups.';

      await api.sendMessage(
        msg,
        event.threadID,
        (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            groupid: groupid
          });
        },
        event.messageID
      );

    } catch (error) {
      console.error("Error in allgroups command:", error);
      await api.sendMessage("An error occurred while fetching group information.", event.threadID, event.messageID);
    }
  },

  onReply: async function({ api, event, Reply, threadsData }) {
    try {
      if (parseInt(event.senderID) !== parseInt(Reply.author)) return;

      const commandArgs = event.body.split(" ");
      const action = commandArgs[0].toLowerCase();
      const target = commandArgs[1];

      if (!['ban', 'out'].includes(action)) {
        return api.sendMessage(
          'Please use either "ban [number|all]" or "out [number|all]"',
          event.threadID,
          event.messageID
        );
      }

      if (target === 'all') {
        let successCount = 0;
        let failCount = 0;
        
        for (const idgr of Reply.groupid) {
          try {
            if (action === 'ban') {
              const data = (await threadsData.get(idgr)).data || {};
              data.banned = true;
              await threadsData.set(idgr, { data });
              if (global.data && global.data.threadBanned) {
                global.data.threadBanned.set(parseInt(idgr), 1);
              }
              successCount++;
            } else if (action === 'out') {
              await api.removeUserFromGroup(api.getCurrentUserID(), idgr);
              successCount++;
            }
          } catch (e) {
            console.error(`Error ${action}ing group ${idgr}:`, e);
            failCount++;
          }
        }
        
        return api.sendMessage(
          `Successfully ${action === 'ban' ? 'banned' : 'left'} ${successCount} groups.${failCount > 0 ? ` Failed: ${failCount}` : ''}`,
          event.threadID,
          event.messageID
        );
      }

      const groupNumber = parseInt(target);
      if (isNaN(groupNumber) || groupNumber < 1 || groupNumber > Reply.groupid.length) {
        return api.sendMessage(
          `Please provide a valid group number between 1 and ${Reply.groupid.length}`,
          event.threadID,
          event.messageID
        );
      }

      const idgr = Reply.groupid[groupNumber - 1];

      try {
        if (action === 'ban') {
          const data = (await threadsData.get(idgr)).data || {};
          data.banned = true;
          await threadsData.set(idgr, { data });
          if (global.data && global.data.threadBanned) {
            global.data.threadBanned.set(parseInt(idgr), 1);
          }
          return api.sendMessage(
            `Successfully banned group: ${idgr}`,
            event.threadID,
            event.messageID
          );
        } else if (action === 'out') {
          await api.removeUserFromGroup(api.getCurrentUserID(), idgr);
          const groupData = await threadsData.get(idgr);
          return api.sendMessage(
            `Left group: ${groupData.name || 'Unknown'}\n(Group ID: ${idgr})`,
            event.threadID,
            event.messageID
          );
        }
      } catch (error) {
        console.error(`Error ${action}ing group ${idgr}:`, error);
        return api.sendMessage(
          `Failed to ${action} group ${idgr}: ${error.message}`,
          event.threadID,
          event.messageID
        );
      }
    } catch (error) {
      console.error("Error in allgroups reply handler:", error);
      api.sendMessage(
        "An error occurred while processing your request.",
        event.threadID,
        event.messageID
      );
    }
  }
};
