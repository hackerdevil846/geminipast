const {Data} = require('./constant');
const {State, Party} = require('./enum');
const Role = require('./role');
const World = require('./world');
const {gameConfig, dataSetup, symbols, guide, vietsub} = require('./helper');
const StateManager = require('./State');

// 𝐅𝐈𝐗: 𝐀𝐝𝐝 𝐩𝐫𝐨𝐩𝐞𝐫 𝐜𝐡𝐞𝐜𝐤 𝐟𝐨𝐫 𝐠𝐥𝐨𝐛𝐚𝐥.𝐜𝐥𝐢𝐞𝐧𝐭.𝐚𝐩𝐢
const sendMessage = global.client?.api?.sendMessage || function(message, threadID) {
    console.log(`[𝐒𝐄𝐍𝐃 𝐌𝐄𝐒𝐒𝐀𝐆𝐄]: ${message} 𝐭𝐨 ${threadID}`);
    return Promise.resolve();
};

const prefix = global.config?.PREFIX || '!';
const Game = require('./Game');
const gameManager = require('./GameManager');

const shuffle = arr => {
    // 𝐁𝐨𝐠𝐨-𝐬𝐨𝐫𝐭 𝐚𝐥𝐠𝐨𝐫𝐢𝐭𝐡𝐦
    let count = arr.length,
        temp,
        index;

    while (count > 0) {
        index = Math.floor(Math.random() * count);
        count--;
        temp = arr[count];
        arr[count] = arr[index];
        arr[index] = temp;
    }

    return arr;
};

const asyncWait = async time => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

module.exports = class MasoiGame extends Game {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                name: '𝐖𝐞𝐫𝐞𝐰𝐨𝐥𝐟 𝐆𝐚𝐦𝐞'
            }
        });
        
        // 𝐅𝐈𝐗: 𝐀𝐝𝐝 𝐩𝐫𝐨𝐩𝐞𝐫 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐞𝐜𝐤 𝐰𝐢𝐭𝐡 𝐞𝐫𝐫𝐨𝐫 𝐡𝐚𝐧𝐝𝐥𝐢𝐧𝐠
        if (!this.isGroup) {
            if (sendMessage) {
                sendMessage('❌ 𝐓𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐨𝐧𝐥𝐲 𝐰𝐨𝐫𝐤𝐬 𝐢𝐧 𝐠𝐫𝐨𝐮𝐩𝐬!', this.threadID);
            }
            return;
        }

        if(options.param && options.param[0] == 'info') {
            let indexVillage = Number(options.param[1]) - 1;
            if(!options.param[1]) return sendMessage(`𝐂𝐨𝐦𝐦𝐚𝐧𝐝: ${prefix}masoi info [𝐕𝐢𝐥𝐥𝐚𝐠𝐞 𝐂𝐨𝐝𝐞]`, this.threadID);
            if (!gameConfig.setups || !gameConfig.setups[indexVillage]) return sendMessage(`𝐕𝐢𝐥𝐥𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐜𝐨𝐝𝐞 ${indexVillage + 1} 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝!`, this.threadID);    
            let msg = '𝐕𝐢𝐥𝐥𝐚𝐠𝐞 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫𝐬 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧:\n';
            for(let i in gameConfig.setups[indexVillage].roles) {
                if(gameConfig.setups[indexVillage].roles[i] == 0) continue;
                msg += `${vietsub(i)}: ${gameConfig.setups[indexVillage].roles[i]} 𝐩𝐥𝐚𝐲𝐞𝐫𝐬\n`;
            }
            return sendMessage(msg, this.threadID);
        }

        const indexVillage = Number(options.param[0]) - 1;
        if (!options.param[0] || isNaN(indexVillage)) {
            let body = `📖 𝐂𝐫𝐞𝐚𝐭𝐞 𝐆𝐮𝐢𝐝𝐞: ${prefix}masoi [𝐕𝐢𝐥𝐥𝐚𝐠𝐞 𝐂𝐨𝐝𝐞]\n` +
            '𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐯𝐢𝐥𝐥𝐚𝐠𝐞 𝐜𝐨𝐝𝐞𝐬: \n' +
            gameConfig.setups.map((setup, index) => {
                const {name, roles} = dataSetup(setup);
                return `${symbols[index + 1]}. ${name} (${roles.length} 𝐩𝐥𝐚𝐲𝐞𝐫𝐬)\n`;
            }).join('');
            body += `𝐕𝐢𝐞𝐰 𝐝𝐞𝐭𝐚𝐢𝐥𝐞𝐝 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫𝐬 𝐢𝐧 𝐯𝐢𝐥𝐥𝐚𝐠𝐞: ${prefix}masoi info [𝐕𝐢𝐥𝐥𝐚𝐠𝐞 𝐂𝐨𝐝𝐞]`;
            return sendMessage(body.replace(/,/g, ""), this.threadID);
        }

        if (!gameConfig.setups || !gameConfig.setups[indexVillage]) {
            return sendMessage(`𝐕𝐢𝐥𝐥𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐜𝐨𝐝𝐞 ${indexVillage + 1} 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝!`, this.threadID);
        }
        
        this.setup = dataSetup(gameConfig.setups[indexVillage]);
        this.state = new StateManager([State.SETUP, State.PLAY]);
        this.world = new World.Normal({
            game: this
        });

        this.sendMessage(
                '[====🐺 𝐖𝐄𝐑𝐄𝐖𝐎𝐋𝐅 𝐆𝐀𝐌𝐄 🐺====]\n' +
                `🛡 𝐕𝐢𝐥𝐥𝐚𝐠𝐞: ${this.setup.name}\n` +
                `💎 𝐏𝐥𝐚𝐲𝐞𝐫𝐬: ${this.setup.roles.length}\n` +
                `💬 𝐓𝐲𝐩𝐞 "${gameConfig.ready}" 𝐭𝐨 𝐣𝐨𝐢𝐧 𝐠𝐚𝐦𝐞 \n` +
                `• 𝐓𝐨 𝐞𝐧𝐝 𝐠𝐚𝐦𝐞 𝐭𝐲𝐩𝐞 "𝐞𝐧𝐝!"\n• 𝐓𝐨 𝐥𝐞𝐚𝐯𝐞 𝐠𝐚𝐦𝐞 𝐭𝐲𝐩𝐞 "𝐨𝐮𝐭!"\n` +
                `🔴 𝐑𝐞𝐚𝐝𝐲 𝐩𝐥𝐚𝐲𝐞𝐫𝐬: 1/${this.setup.roles.length}`
        );
    }

    async clean() {
        await super.clean();
        if (this.world && this.world.isEnd) return;
        if (this.world) {
            this.world.endGame();
            for (const player of this.world.items) {
                if (player && player.resolve) {
                    player.resolve([null, null]);
                }
            }
        }
    }

    async onMessage(message, reply) {
        await super.onMessage(message, reply);
        if (message.body.toLowerCase() == 'end!') {
            if (message.senderID == this.masterID) {
                await global.gameManager.clean(this.threadID);
                if (this.state && this.state.getCurrent() == State.SETUP)
                    await reply('🛠 𝐆𝐚𝐦𝐞 𝐞𝐧𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!');
            } else {
                await reply('⚠️ 𝐎𝐧𝐥𝐲 𝐠𝐚𝐦𝐞 𝐜𝐫𝐞𝐚𝐭𝐨𝐫 𝐜𝐚𝐧 𝐞𝐧𝐝 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞!');
            }
        }
        if (message.body.toLowerCase() == 'out!') {
            if(!this.participants || !this.participants.includes(message.senderID)) 
                return await this.sendMessage(`⚠️ 𝐘𝐨𝐮 𝐡𝐚𝐯𝐞𝐧'𝐭 𝐣𝐨𝐢𝐧𝐞𝐝 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞 𝐲𝐞𝐭!\n • 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐠𝐚𝐦𝐞 𝐬𝐭𝐚𝐭𝐮𝐬: ${this.participants ? this.participants.length : 0}/${this.setup ? this.setup.roles.length : 0}!`);
            if(message.senderID == this.masterID) 
                return await this.sendMessage(`⚠️ 𝐘𝐨𝐮 𝐚𝐫𝐞 𝐭𝐡𝐞 𝐫𝐨𝐨𝐦 𝐨𝐰𝐧𝐞𝐫 𝐚𝐧𝐝 𝐜𝐚𝐧𝐧𝐨𝐭 𝐥𝐞𝐚𝐯𝐞!`);
            const index = this.participants.findIndex(i => i == message.senderID);
            this.participants.splice(index, 1);
            await this.sendMessage(`✈️ 𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐥𝐞𝐟𝐭 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!\n • 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐠𝐚𝐦𝐞 𝐬𝐭𝐚𝐭𝐮𝐬: ${this.participants.length}/${this.setup.roles.length}!`);
        }
        
        if (!this.state) return;
        const curState = this.state.getCurrent();
        switch (curState) {
            case State.SETUP:
                await this.stateSetup(message, reply);
                break;
            case State.PLAY:
                if (this.participants && this.participants.includes(message.senderID))
                    await this.statePlay(message, reply);
                break;
        }
    }

    async stateSetup(message) {
        if (!this.setup || !this.participants) return;
        
        if(message.body.toLowerCase() == gameConfig.ready && this.participants.includes(message.senderID)) {
            await this.sendMessage(`⚠️ 𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐣𝐨𝐢𝐧𝐞𝐝 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞!\n • 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐠𝐚𝐦𝐞 𝐬𝐭𝐚𝐭𝐮𝐬: ${this.participants.length}/${this.setup.roles.length}!`);
        }
        if (message.body.toLowerCase() == gameConfig.ready && this.participants.length < this.setup.roles.length && !this.participants.includes(message.senderID)) {
            this.participants.push(message.senderID);
            if (this.participants.length == this.setup.roles.length) {
                this.state.next();
                shuffle(this.setup.roles);
                for (let i = 0; i < this.participants.length; i++) {
                    const participantID = this.participants[i];
                    // 𝐅𝐈𝐗: 𝐀𝐝𝐝 𝐜𝐡𝐞𝐜𝐤 𝐟𝐨𝐫 𝐠𝐥𝐨𝐛𝐚𝐥.𝐔𝐬𝐞𝐫𝐬
                    let name = `𝐏𝐥𝐚𝐲𝐞𝐫 ${i + 1}`;
                    if (global.Users && global.Users.getData) {
                        try {
                            const userData = await global.Users.getData(participantID);
                            name = userData.name || name;
                        } catch (error) {
                            console.error('𝐄𝐫𝐫𝐨𝐫 𝐠𝐞𝐭𝐭𝐢𝐧𝐠 𝐮𝐬𝐞𝐫 𝐝𝐚𝐭𝐚:', error);
                        }
                    }
                    const player = this.world.add(
                        new Role[this.setup.roles[i]]({
                            index: this.world.items.length,
                            world: this.world,
                            name: name,
                            threadID: participantID
                        })
                    );
                    this.sendMessage(guide(player), player.threadID);
                }
                const werewolfParty = this.world.items.filter(
                    e => e.party == Party.WEREWOLF
                );
                const nameMap = werewolfParty.map(e => e.name);
                for (const player of werewolfParty) {
                    if (nameMap.length > 1)
                        await player.sendMessage(
                            `𝐘𝐨𝐮𝐫 𝐭𝐞𝐚𝐦𝐦𝐚𝐭𝐞𝐬: ${nameMap
                                .filter(name => name != player.name)
                                .join(
                                    ', '
                                )}\n 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐭𝐡𝐞𝐦 𝐟𝐨𝐫 𝐛𝐞𝐭𝐭𝐞𝐫 𝐭𝐞𝐚𝐦𝐰𝐨𝐫𝐤!`
                        );
                }
                let balanceScore = 0;
                for (const role of this.setup.roles) {
                    balanceScore += Data[role].score;
                }
                this.sendMessage(
                    this.timing({
                        message:
                            `⚖ 𝐁𝐚𝐥𝐚𝐧𝐜𝐞 𝐒𝐜𝐨𝐫𝐞: ${balanceScore}\n` +
                            '📖 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬 (𝐧𝐨 𝐩𝐫𝐞𝐟𝐢𝐱 𝐧𝐞𝐞𝐝𝐞𝐝):\n===𝐆𝐑𝐎𝐔𝐏===\n1."𝐡𝐞𝐥𝐩": 𝐕𝐢𝐞𝐰 𝐲𝐨𝐮𝐫 𝐫𝐨𝐥𝐞!\n2."𝐬𝐭𝐚𝐭𝐮𝐬": 𝐂𝐡𝐞𝐜𝐤 𝐥𝐢𝐯𝐞 𝐩𝐥𝐚𝐲𝐞𝐫𝐬\n===𝐏𝐑𝐈𝐕𝐀𝐓𝐄===\n1."𝐩𝐚𝐬𝐬": 𝐒𝐤𝐢𝐩 𝐭𝐮𝐫𝐧\n' +
                            '\n𝐑𝐞𝐯𝐢𝐞𝐰 𝐲𝐨𝐮𝐫 𝐫𝐨𝐥𝐞 𝐝𝐞𝐭𝐚𝐢𝐥𝐬, 𝐠𝐚𝐦𝐞 𝐬𝐭𝐚𝐫𝐭𝐬 𝐬𝐨𝐨𝐧',
                        time: gameConfig.timeout.DELAY_STARTGAME,
                        left: false
                    })
                );
                await asyncWait(gameConfig.timeout.DELAY_STARTGAME);
                this.world.startLoop();
            } else {
                await this.sendMessage(`⌛️ 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐬𝐭𝐚𝐭𝐮𝐬: ${this.participants.length}/${this.setup.roles.length}!`);
            }
        }
    }

    async statePlay(message, reply) {
        if (message.body.toLowerCase() != 'end!') {
            const player = this.world.find({threadID: message.senderID});
            if (!player) return;
            
            switch (message.body.toLowerCase()) {
                case 'help':
                    await this.sendMessage(guide(player), message.senderID);
                    break;
                case 'status':
                    await this.sendStatus(message.threadID);
                    break;
            }
            if (!message.isGroup && player.onMessage) {
                player.onMessage(message, reply);
            }
        }
    }

    async sendMessage(message, threadID = this.threadID) {
        await sendMessage(message, threadID);
    }

    timing({message = '', time = 0, left = true} = {}) {
        if (time < 0) time = 0;
        const hh = Math.floor(time / 1000 / 60 / 60);
        const mm = Math.floor((time - hh * 60 * 60 * 1000) / 1000 / 60);
        const ss = Math.ceil((time - hh * 60 * 60 * 1000 - mm * 60 * 1000) / 1000);
        let text = `${ss}𝐬`;
        if (mm > 0) text = `${mm}𝐦 ${text}`;
        if (hh > 0) text = `${hh}𝐡 ${text}`;
        return left ? `[${text}] ${message}` : `${message} [${text}]`;
    }

    listPlayer(filter = {}) {
        if (!this.world || !this.world.items) return '';
        
        let text = '';
        for (let index = 0; index < this.world.getLength(); index++) {
            const player = this.world.items[index];
            if (!player) continue;

            let pass = true;
            for (const key in filter) {
                if (player[key] !== filter[key]) {
                    pass = false;
                    break;
                }
            }

            if (pass)
                text += `${symbols[index + 1]} ${player.name} ${
                    player.died ? ' - 𝐝𝐞𝐚𝐝' : ''
                }\n`;
        }
        return text;
    }

    async sendStatus(threadID = this.threadID) {
        await this.sendMessage(
            `🛠 𝐆𝐚𝐦𝐞 𝐒𝐭𝐚𝐭𝐮𝐬:\n${this.listPlayer({died: false})}`,
            threadID
        );
    }
};
