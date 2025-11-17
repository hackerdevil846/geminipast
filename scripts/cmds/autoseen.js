const fs = require('fs-extra');
const path = require('path');

// Create cache directory if it doesn't exist
const cacheDir = path.join(__dirname, 'cache');
const pathFile = path.join(cacheDir, 'autoseen.txt');

// Initialize cache system
function initializeCache() {
    try {
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        if (!fs.existsSync(pathFile)) {
            fs.writeFileSync(pathFile, 'false');
        }
    } catch (error) {
        console.error('💥 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾 𝖼𝖺𝖼𝗁𝖾:', error);
    }
}

// Initialize on module load
initializeCache();

module.exports = {
    config: {
        name: "autoseen",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "utility",
        shortDescription: {
            en: "🤖 𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗆𝖺𝗋𝗄 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌 𝖺𝗌 𝗌𝖾𝖾𝗇"
        },
        longDescription: {
            en: "𝖳𝗎𝗋𝗇 𝗈𝗇/𝗈𝖿𝖿 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼 𝗆𝖺𝗋𝗄𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌 𝖺𝗌 𝗌𝖾𝖾𝗇"
        },
        guide: {
            en: "{p}autoseen [𝗈𝗇|𝗈𝖿𝖿]"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, args, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            // Ensure cache is initialized
            initializeCache();

            const [arg] = args;
            
            if (!arg) {
                const currentStatus = await this.getAutoSeenStatus();
                const statusMessage = currentStatus ? '✅ 𝖮𝖭' : '❌ 𝖮𝖥𝖥';
                return message.reply(`🔍 𝖠𝗎𝗍𝗈 𝖲𝖾𝖾𝗇 𝖲𝗍𝖺𝗍𝗎𝗌: ${statusMessage}\n\n💡 𝖴𝗌𝖾: ${global.config.PREFIX}${this.config.name} [𝗈𝗇|𝗈𝖿𝖿]`);
            }

            const action = arg.toLowerCase().trim();
            
            if (action === 'on' || action === '𝗈𝗇') {
                try {
                    fs.writeFileSync(pathFile, 'true');
                    console.log('✅ 𝖠𝗎𝗍𝗈 𝗌𝖾𝖾𝗇 𝗍𝗎𝗋𝗇𝖾𝖽 𝗈𝗇');
                    await message.reply('✅ 𝖠𝗎𝗍𝗈 𝗌𝖾𝖾𝗇 𝗍𝗎𝗋𝗇𝖾𝖽 𝗈𝗇 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒');
                } catch (writeError) {
                    console.error('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾 𝗍𝗈 𝖼𝖺𝖼𝗁𝖾 𝖿𝗂𝗅𝖾:', writeError);
                    await message.reply('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗍𝗎𝗋𝗇 𝗈𝗇 𝖺𝗎𝗍𝗈 𝗌𝖾𝖾𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.');
                }
            } 
            else if (action === 'off' || action === '𝗈𝖿𝖿') {
                try {
                    fs.writeFileSync(pathFile, 'false');
                    console.log('✅ 𝖠𝗎𝗍𝗈 𝗌𝖾𝖾𝗇 𝗍𝗎𝗋𝗇𝖾𝖽 𝗈𝖿𝖿');
                    await message.reply('✅ 𝖠𝗎𝗍𝗈 𝗌𝖾𝖾𝗇 𝗍𝗎𝗋𝗇𝖾𝖽 𝗈𝖿𝖿 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒');
                } catch (writeError) {
                    console.error('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾 𝗍𝗈 𝖼𝖺𝖼𝗁𝖾 𝖿𝗂𝗅𝖾:', writeError);
                    await message.reply('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗍𝗎𝗋𝗇 𝗈𝖿𝖿 𝖺𝗎𝗍𝗈 𝗌𝖾𝖾𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.');
                }
            } 
            else {
                const helpMessage = `❌ 𝖨𝗇𝖼𝗈𝗋𝗋𝖾𝖼𝗍 𝗌𝗒𝗇𝗍𝖺𝗑!\n\n💡 𝖴𝗌𝖾: ${global.config.PREFIX}${this.config.name} [𝗈𝗇|𝗈𝖿𝖿]\n\n🔍 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝗌𝗍𝖺𝗍𝗎𝗌: ${await this.getAutoSeenStatus() ? '✅ 𝖮𝖭' : '❌ 𝖮𝖥𝖥'}`;
                await message.reply(helpMessage);
            }
        } 
        catch (error) {
            console.error('💥 𝖠𝗎𝗍𝗈𝗌𝖾𝖾𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:', error);
            // Don't send error message to avoid spam
        }
    },

    onChat: async function({ api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
                return;
            }

            // Ensure cache is initialized
            initializeCache();

            const content = await this.getAutoSeenStatus();
            if (content === true) {
                try {
                    api.markAsReadAll(() => {});
                } catch (markError) {
                    console.error('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗆𝖺𝗋𝗄 𝖺𝗌 𝗋𝖾𝖺𝖽:', markError);
                }
            }
        } catch (error) {
            console.error('💥 𝖠𝗎𝗍𝗈𝗌𝖾𝖾𝗇 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:', error);
        }
    },

    // Helper function to get auto seen status
    getAutoSeenStatus: async function() {
        try {
            if (!fs.existsSync(pathFile)) {
                fs.writeFileSync(pathFile, 'false');
                return false;
            }
            
            const content = fs.readFileSync(pathFile, 'utf-8').trim();
            return content === 'true';
        } catch (error) {
            console.error('❌ 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖺𝗎𝗍𝗈𝗌𝖾𝖾𝗇 𝗌𝗍𝖺𝗍𝗎𝗌:', error);
            return false;
        }
    }
};
