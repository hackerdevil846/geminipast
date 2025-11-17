const Schema = require('./Schema');

module.exports = class Game extends Schema {
    constructor(options) {
        super();
        const {
            name = '𝐔𝐧𝐝𝐞𝐟𝐢𝐧𝐞𝐝 𝐆𝐚𝐦𝐞',
            masterID, // 𝐮𝐧𝐢𝐪𝐮𝐞
            threadID, // 𝐮𝐧𝐢𝐪𝐮𝐞
            param = '',
            isGroup = false,
            participants = [masterID]
        } = options;
        this.name = name;
        this.masterID = masterID; // 𝐆𝐚𝐦𝐞 𝐜𝐫𝐞𝐚𝐭𝐨𝐫 𝐈𝐃
        this.threadID = threadID; // 𝐆𝐫𝐨𝐮𝐩 𝐈𝐃 𝐟𝐨𝐫 𝐠𝐚𝐦𝐞 𝐢𝐧𝐭𝐞𝐫𝐚𝐜𝐭𝐢𝐨𝐧
        this.participants = participants;
        this.param = param;
        this.isGroup = isGroup;
    }

    async onMessage() {}

    async clean() {}

    addParticipant(id, duplicateCheck = true) {
        if (duplicateCheck && this.participants.includes(id)) return false;
        this.participants.push(id);
        return true;
    }
};
