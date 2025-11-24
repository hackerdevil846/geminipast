const { colors } = require('../func/colors.js');

module.exports = (color, message) => {
    if (colors && typeof colors.hex === 'function') {
        console.log(colors.hex(color, message));
    } else {
        console.log(message); // Fallback if colors func fails
    }
};
