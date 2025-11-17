const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "giveaway",
        aliases: ["gift", "gaway"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "economy",
        shortDescription: {
            en: "Advanced giveaway management system"
        },
        longDescription: {
            en: "Advanced giveaway management system with reaction support"
        },
        guide: {
            en: "{p}giveaway [create/details/join/roll/end] [IDGiveaway]"
        }
    },

    onLoad: function() {
        try {
            const giveawayPath = path.join(__dirname, "/cache/giveaways.json");
            const dirPath = path.dirname(giveawayPath);
            
            // Ensure directory exists
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            // Initialize file if it doesn't exist
            if (!fs.existsSync(giveawayPath)) {
                fs.writeFileSync(giveawayPath, JSON.stringify({}), "utf-8");
            }
            
            // Load existing data
            const data = JSON.parse(fs.readFileSync(giveawayPath, "utf-8"));
            global.data.GiveAway = new Map(Object.entries(data));
        } catch (error) {
            console.error("Giveaway onLoad error:", error);
            global.data.GiveAway = new Map();
        }
    },

    handleReaction: async function({ api, event, handleReaction, usersData }) {
        try {
            const giveawayID = handleReaction.ID;
            const data = global.data.GiveAway.get(giveawayID);
            
            if (!data || data.status !== "open") return;

            const { userID, reaction } = event;
            
            // Skip if bot reacts
            if (userID === api.getCurrentUserID()) return;

            const userData = await usersData.get(userID);
            const userName = userData.name || "User";

            if (!reaction) {
                // User removed reaction (left giveaway)
                data.joined = data.joined.filter(id => id !== userID);
                api.sendMessage(`❌ ${userName} left the giveaway (ID: #${giveawayID})`, event.threadID);
            } else {
                // User added reaction (joined giveaway)
                if (!data.joined.includes(userID)) {
                    data.joined.push(userID);
                    api.sendMessage(`✅ ${userName} joined the giveaway (ID: #${giveawayID})`, event.threadID);
                }
            }

            // Save updated data
            global.data.GiveAway.set(giveawayID, data);
            const giveawayPath = path.join(__dirname, "/cache/giveaways.json");
            fs.writeFileSync(
                giveawayPath, 
                JSON.stringify(Object.fromEntries(global.data.GiveAway), null, 2)
            );
        } catch (error) {
            console.error("Giveaway reaction error:", error);
        }
    },

    onStart: async function({ message, event, args, usersData, api }) {
        const { threadID, senderID } = event;
        const giveawayPath = path.join(__dirname, "/cache/giveaways.json");

        const saveData = () => {
            try {
                fs.writeFileSync(giveawayPath, JSON.stringify(Object.fromEntries(global.data.GiveAway), null, 2));
            } catch (error) {
                console.error("Save data error:", error);
            }
        };

        // Initialize if not exists
        if (!global.data.GiveAway) {
            global.data.GiveAway = new Map();
        }

        if (!args[0]) {
            return message.reply({
                body: `🎉 GIVEAWAY SYSTEM 🎉\n\n` +
                    `📌 create [reward] - Create new giveaway\n` +
                    `📌 details [id] - Show giveaway details\n` +
                    `📌 join [id] - Join a giveaway\n` +
                    `📌 roll [id] - Roll winner\n` +
                    `📌 end [id] - End giveaway\n\n` +
                    `🔮 Example: giveaway create $5 PayPal\n` +
                    `🔮 Example: giveaway join 12345`
            });
        }

        const action = args[0].toLowerCase();

        switch (action) {
            case "create": {
                const reward = args.slice(1).join(" ");
                if (!reward) return message.reply("❌ Please specify the giveaway reward!");

                const giveawayID = Math.floor(10000 + Math.random() * 90000).toString();
                const userData = await usersData.get(senderID);
                const userName = userData.name || "User";

                const messageSent = await message.reply({
                    body: `🎉====== GIVEAWAY ======🎉\n` +
                        `👤 Creator: ${userName}\n` +
                        `🎁 Reward: ${reward}\n` +
                        `🆔 ID: #${giveawayID}\n` +
                        `📊 Status: 🟢 OPEN\n` +
                        `👥 Participants: 0\n\n` +
                        `💬 React to this message to join!`,
                    mentions: [{
                        tag: userName,
                        id: senderID
                    }]
                });

                const giveawayData = {
                    ID: giveawayID,
                    author: userName,
                    authorID: senderID,
                    messageID: messageSent.messageID,
                    threadID: threadID,
                    reward: reward,
                    joined: [],
                    status: "open",
                    createdAt: Date.now()
                };

                global.data.GiveAway.set(giveawayID, giveawayData);
                saveData();

                // Register reaction handler
                if (!global.client.handleReaction) {
                    global.client.handleReaction = [];
                }

                global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: messageSent.messageID,
                    author: senderID,
                    ID: giveawayID
                });

                return;
            }

            case "details": {
                if (!args[1]) return message.reply("❌ Please provide giveaway ID!");
                
                const giveawayID = args[1].replace("#", "");
                const data = global.data.GiveAway.get(giveawayID);
                
                if (!data) return message.reply("❌ Giveaway not found!");

                return message.reply({
                    body: `📊====== Giveaway Details ======📊\n` +
                        `👤 Creator: ${data.author}\n` +
                        `🎁 Reward: ${data.reward}\n` +
                        `🆔 ID: #${data.ID}\n` +
                        `👥 Participants: ${data.joined.length}\n` +
                        `📅 Created: ${new Date(data.createdAt).toLocaleString()}\n` +
                        `📌 Status: ${data.status === "open" ? "🟢 OPEN" : "🔴 CLOSED"}`
                });
            }

            case "join": {
                if (!args[1]) return message.reply("❌ Please provide giveaway ID!");
                
                const giveawayID = args[1].replace("#", "");
                const data = global.data.GiveAway.get(giveawayID);
                
                if (!data) return message.reply("❌ Giveaway not found!");
                if (data.status !== "open") return message.reply("❌ This giveaway has ended!");
                if (data.joined.includes(senderID)) return message.reply("❌ You've already joined this giveaway!");

                data.joined.push(senderID);
                global.data.GiveAway.set(giveawayID, data);
                saveData();

                const userData = await usersData.get(senderID);
                return message.reply(`✅ ${userData.name} joined giveaway #${giveawayID} successfully!`);
            }

            case "roll": {
                if (!args[1]) return message.reply("❌ Please provide giveaway ID!");
                
                const giveawayID = args[1].replace("#", "");
                const data = global.data.GiveAway.get(giveawayID);
                
                if (!data) return message.reply("❌ Giveaway not found!");
                if (data.authorID !== senderID) return message.reply("❌ Only the giveaway creator can perform this action!");
                if (data.joined.length === 0) return message.reply("❌ No participants in this giveaway!");

                const winnerID = data.joined[Math.floor(Math.random() * data.joined.length)];
                const userData = await usersData.get(winnerID);

                return message.reply({
                    body: `🎉====== WINNER ANNOUNCEMENT ======🎉\n` +
                        `🏆 Congratulations ${userData.name}!\n` +
                        `🎁 You won: ${data.reward}\n` +
                        `🆔 Giveaway ID: #${data.ID}\n` +
                        `👤 Hosted by: ${data.author}\n\n` +
                        `📩 Please contact ${data.author} to claim your prize!`,
                    mentions: [{
                        tag: userData.name,
                        id: winnerID
                    }]
                });
            }

            case "end": {
                if (!args[1]) return message.reply("❌ Please provide giveaway ID!");
                
                const giveawayID = args[1].replace("#", "");
                const data = global.data.GiveAway.get(giveawayID);
                
                if (!data) return message.reply("❌ Giveaway not found!");
                if (data.authorID !== senderID) return message.reply("❌ Only the giveaway creator can perform this action!");

                data.status = "ended";
                global.data.GiveAway.set(giveawayID, data);
                saveData();

                try {
                    await api.unsend(data.messageID);
                } catch (error) {
                    console.error("Failed to unsend message:", error);
                }

                return message.reply(`🔚 Giveaway #${data.ID} has been ended by ${data.author}!`);
            }

            default: {
                return message.reply("❌ Invalid command! Use 'giveaway' without arguments to see help.");
            }
        }
    }
};
