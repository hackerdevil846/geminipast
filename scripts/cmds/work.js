const axios = require('axios');
const fs = require("fs-extra");

// Job list with international English
let jobs = {
    '🎣': {
        name: 'Fishing',
        img: 'https://i.imgur.com/DoB5Cw8.gif',
        done: [
            ['{name} caught a lanternfish and sold it for {money}$', 'https://i.imgur.com/BXng765.jpeg'],
            ['{name} caught a shark and sold it for {money}$', 'https://i.imgur.com/dyLyvOA.jpeg'],
            ['{name} caught a mantis shrimp and sold it for {money}$', 'https://i.imgur.com/YJiCTWH.jpeg'],
            ['{name} caught a tuna and sold it for {money}$', 'https://i.imgur.com/eshOIiJ.jpeg'],
            ['{name} caught a shark and sold it for {money}$', 'https://i.imgur.com/dyLyvOA.jpeg'],
            ['{name} caught a mackerel and sold it for {money}$', 'https://i.imgur.com/YAS5iGM.jpeg'],
            ['{name} caught a koi fish and sold it for {money}$', 'https://i.imgur.com/BXwB4xZ.png'],
            ['{name} caught a catfish and sold it for {money}$', 'https://i.imgur.com/IE6LQU3.png'],
            ['{name} caught a lobster and sold it for {money}$', 'https://i.imgur.com/XbSWNha.png'],
            ['{name} caught a swordfish and sold it for {money}$', 'https://i.imgur.com/nLndbMc.png'],
            ['{name} caught a parrotfish and sold it for {money}$', 'https://i.imgur.com/7H5XwLb.png'],
            ['{name} caught a clownfish and sold it for {money}$', 'https://i.imgur.com/cLvJZlM.png'],
            ['{name} caught a coelacanth and sold it for {money}$', 'https://i.imgur.com/jw5bqu7.png'],
            ['{name} caught a carp and sold it for {money}$', 'https://i.imgur.com/7hVzeDJ.png'],
            ['{name} caught a great white shark and sold it for {money}$', 'https://i.imgur.com/TuMhGBS.png'],
            ['{name} caught a hammerhead shark and sold it for {money}$', 'https://i.imgur.com/JDVZ3J7.jpeg'],
            ['{name} caught a salmon and sold it for {money}$', 'https://i.imgur.com/wKijFF0.png'],
            ['{name} caught an emperor dinosaur fish and sold it for {money}$', 'https://i.imgur.com/w42NHef.png'],
            ['{name} caught a red snapper and sold it for {money}$', 'https://i.imgur.com/UjdnHhE.png'],
            ['{name} caught a wide-mouth fish and sold it for {money}$', 'https://i.imgur.com/Cw0qh57.png'],
            ['{name} caught a betta fish and sold it for {money}$', 'https://i.imgur.com/d33003f.png'],
            ['{name} caught a tilapia and sold it for {money}$', 'https://i.imgur.com/sqBRoDe.png'],
            ['{name} caught an ocean tuna and sold it for {money}$', 'https://i.imgur.com/A1qXwXV.png'],
            ['{name} caught a whale shark and sold it for {money}$', 'https://i.imgur.com/K7Qy4mI.png'],
            ['{name} caught a yellow perch and sold it for {money}$', 'https://i.imgur.com/S9Qqr3D.png'],
            ['{name} caught a spotted blind fish and sold it for {money}$', 'https://i.imgur.com/A5XeYbS.png'],
        ]
    },
    '🏹': {
        name: 'Hunting',
        img: 'https://i.imgur.com/jc2j4ps.gif',
        done: [
            ['{name} hunted a snake and sold it for {money}$', 'https://i.imgur.com/Q7vv6mG.jpg'],
            ['{name} hunted a Komodo dragon and sold it for {money}$', 'https://i.imgur.com/Y8mfwPN.jpeg'],
            ['{name} hunted a kingfisher and sold it for {money}$', 'https://i.imgur.com/XAM9Ne6.jpeg'],
            ['{name} hunted a brown bear and sold it for {money}$', 'https://i.imgur.com/A3OxqoB.jpeg'],
            ['{name} hunted an Anaconda and sold it for {money}$', 'https://i.imgur.com/4z6kr8V.jpeg'],
            ['{name} hunted a deer and sold it for {money}$', 'https://i.imgur.com/lHQKacE.jpg'],
            ['{name} hunted a wild boar and sold it for {money}$', 'https://i.imgur.com/eQQUR3s.jpg'],
            ['{name} hunted a lion and sold it for {money}$', 'https://i.imgur.com/ThGSaPn.jpg'],
        ]
    },
    '⛏️': { 
        name: 'Mining', 
        img: 'https://i.imgur.com/zBWwXzN.gif', 
        done: [ 
            ['{name} mined a diamond and sold it for {money}$', 'https://i.imgur.com/9cHq8nN.png'],
            ['{name} mined gold and sold it for {money}$', 'https://i.imgur.com/HB0Bmqo.jpg'],
            ['{name} mined iron ore and sold it for {money}$', 'https://i.imgur.com/wD0VEZ8.png'],
            ['{name} mined an emerald and sold it for {money}$', 'https://i.imgur.com/NyYurEd.jpg'],
            ['{name} mined an amethyst and sold it for {money}$', 'https://i.imgur.com/8kc5m2L.jpg'],
            ['{name} mined coal and sold it for {money}$', 'https://i.imgur.com/CY3lCqx.jpg'],
            ['{name} mined a rare ruby and sold it for {money}$', 'https://i.imgur.com/OoP1Smk.jpg'],
        ]
    },
    '🐦': {
        name: 'Bird Hunting',
        img: 'https://i.imgur.com/4DctekU.gif',
        done: [
            ['{name} hunted a black bird and sold it for {money}$', 'https://i.imgur.com/IPeNm8n.jpeg'],
            ['{name} hunted an eagle and sold it for {money}$', 'https://i.imgur.com/EklUNah.jpeg'],
            ['{name} hunted a swallow and sold it for {money}$', 'https://i.imgur.com/kUhS155.jpeg'],
            ['{name} hunted a warbler and sold it for {money}$', 'https://i.imgur.com/DErkrnd.jpeg'],
            ['{name} hunted a long-tailed bird and sold it for {money}$', 'https://i.imgur.com/PMaurmG.jpeg'],
            ['{name} hunted a nightingale and sold it for {money}$', 'https://i.imgur.com/muJCa5P.jpeg'],
            ['{name} hunted a parrot and sold it for {money}$', 'https://i.imgur.com/2nN01CY.jpeg'],
            ['{name} hunted a songbird and sold it for {money}$', 'https://i.imgur.com/88Cq2Hf.jpeg'],
            ['{name} hunted a bulbul and sold it for {money}$', 'https://i.imgur.com/9R8BrMF.jpeg'],
            ['{name} hunted a sparrow and sold it for {money}$', 'https://i.imgur.com/yZcWTT6.jpeg'],
            ['{name} hunted an oriole and sold it for {money}$', 'https://i.imgur.com/bk9a6e4.jpeg'],
            ['{name} hunted a wagtail and sold it for {money}$', 'https://i.imgur.com/SxhsgX2.jpeg'],
            ['{name} hunted a dove and sold it for {money}$', 'https://i.imgur.com/ZdFZQ1N.jpeg'],
            ['{name} hunted a budgie and sold it for {money}$', 'https://i.imgur.com/FG61Y7R.jpeg'],
            ['{name} hunted a lark and sold it for {money}$', 'https://i.imgur.com/XZSGXkL.jpeg'],
        ],
    },
};

module.exports = {
    config: {
        name: 'work',
        aliases: ['job'],
        version: '1.0.0',
        author: '𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑',
        countDown: 5,
        role: 0,
        shortDescription: {
            en: 'Earn money by working'
        },
        longDescription: {
            en: 'Choose different jobs to earn money with various activities'
        },
        category: 'economy',
        guide: {
            en: '{p}work - View available jobs\nReact with an emoji or reply with job number to work'
        }
    },

    onStart: async function({ api, event, Users }) {
        try {
            // Check for dependencies
            if (!axios) throw new Error("Missing axios dependency");
            if (!fs) throw new Error("Missing fs-extra dependency");
            
            const jobList = Object.entries(jobs).map(([emoji, job], index) => 
                `[${index + 1} / ${emoji}] ${job.name}`
            ).join('\n');
            
            const message = `💼 AVAILABLE JOBS 💼\n\n${jobList}\n\n→ React with an emoji or reply with job number to work\n→ 5 minutes cooldown between jobs`;
            
            api.sendMessage(message, event.threadID, (err, res) => {
                if (res) {
                    res.name = this.config.name;
                    res.event = event;
                    global.client.handleReaction.push(res);
                    global.client.handleReply.push(res);
                }
            }, event.messageID);
        } catch (error) {
            console.error("Work command error:", error);
            api.sendMessage("❌ An error occurred", event.threadID, event.messageID);
        }
    },

    handleReaction: async function({ api, event, Users, Currencies, handleReaction }) {
        try {
            const uid = event.userID;
            const user = await Users.getData(uid);
            
            if (!user || uid !== handleReaction.event.senderID) return;
            
            if (user.data && user.data.work && user.data.work >= Date.now()) {
                const remaining = user.data.work - Date.now();
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                return api.sendMessage(`⏰ Please wait: ${minutes}m ${seconds}s before working again`, event.threadID);
            }
            
            const job = jobs[event.reaction];
            if (!job) return api.sendMessage("❌ Job not found in the list", event.threadID);
            
            // Set cooldown
            if (!user.data) user.data = {};
            user.data.work = Date.now() + (1000 * 60 * 5);
            await Users.setData(uid, user);
            
            // Show working message
            const workingMsg = await api.sendMessage({
                body: `⏳ Working as ${job.name}...`,
                attachment: job.img ? await getStreamFromURL(job.img) : []
            }, event.threadID);
            
            // Simulate work time
            await new Promise(resolve => setTimeout(resolve, 3500));
            
            // Get random result
            const result = job.done[Math.floor(Math.random() * job.done.length)];
            const earnings = Math.floor(Math.random() * 80000) + 20000;
            
            const resultMessage = {
                body: result[0]
                    .replace(/{name}/g, user.name)
                    .replace(/{money}/g, earnings.toLocaleString()),
                attachment: result[1] ? await getStreamFromURL(result[1]) : []
            };
            
            // Send result and delete working message
            api.sendMessage(resultMessage, event.threadID, () => {
                api.unsendMessage(workingMsg.messageID);
            });
            
            // Add money to user
            await Currencies.increaseMoney(uid, earnings);
            
        } catch (error) {
            console.error("Work reaction error:", error);
            api.sendMessage("❌ An error occurred during work", event.threadID);
        }
    },

    handleReply: async function({ api, event, Users, Currencies, handleReply }) {
        try {
            const uid = event.senderID;
            const user = await Users.getData(uid);
            
            if (!user || uid !== handleReply.event.senderID) return;
            
            if (user.data && user.data.work && user.data.work >= Date.now()) {
                const remaining = user.data.work - Date.now();
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                return api.sendMessage(`⏰ Please wait: ${minutes}m ${seconds}s before working again`, event.threadID);
            }
            
            const jobIndex = parseInt(event.body) - 1;
            const job = Object.values(jobs)[jobIndex];
            
            if (!job) return api.sendMessage("❌ Invalid job number", event.threadID);
            
            // Set cooldown
            if (!user.data) user.data = {};
            user.data.work = Date.now() + (1000 * 60 * 5);
            await Users.setData(uid, user);
            
            // Show working message
            const workingMsg = await api.sendMessage({
                body: `⏳ Working as ${job.name}...`,
                attachment: job.img ? await getStreamFromURL(job.img) : []
            }, event.threadID);
            
            // Simulate work time
            await new Promise(resolve => setTimeout(resolve, 3500));
            
            // Get random result
            const result = job.done[Math.floor(Math.random() * job.done.length)];
            const earnings = Math.floor(Math.random() * 80000) + 20000;
            
            const resultMessage = {
                body: result[0]
                    .replace(/{name}/g, user.name)
                    .replace(/{money}/g, earnings.toLocaleString()),
                attachment: result[1] ? await getStreamFromURL(result[1]) : []
            };
            
            // Send result and delete working message
            api.sendMessage(resultMessage, event.threadID, () => {
                api.unsendMessage(workingMsg.messageID);
            });
            
            // Add money to user
            await Currencies.increaseMoney(uid, earnings);
            
        } catch (error) {
            console.error("Work reply error:", error);
            api.sendMessage("❌ An error occurred during work", event.threadID);
        }
    }
};

// Helper function to get stream from URL
async function getStreamFromURL(url) {
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        return response.data;
    } catch (error) {
        console.error("Error getting stream from URL:", error);
        return null;
    }
}

// Helper function to format time
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
}
