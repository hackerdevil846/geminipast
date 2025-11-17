// 𝔸𝕝𝕥𝕖𝕣𝕟𝕒𝕥𝕚𝕧𝕖 𝕥𝕠 𝕦𝕟𝕚𝕢𝕚𝕕 𝕦𝕤𝕚𝕟𝕘 𝕟𝕒𝕥𝕚𝕧𝕖 𝕞𝕖𝕥𝕙𝕠𝕕𝕤
const uniqid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

module.exports = class Schema {
    constructor() {
        this.id = uniqid();
        this.createAt = Date.now();
    }

    upTime() {
        return Date.now() - this.createAt;
    }
};
