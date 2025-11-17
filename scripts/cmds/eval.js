const { removeHomeDir, log } = global.utils;

module.exports = {
    config: {
        name: "eval",
        aliases: [],
        version: "1.6",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "owner",
        shortDescription: {
            en: "𝖳𝖾𝗌𝗍 𝖼𝗈𝖽𝖾 𝗊𝗎𝗂𝖼𝗄𝗅𝗒 𝗐𝗂𝗍𝗁 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝗈𝗎𝗍𝗉𝗎𝗍 📝"
        },
        longDescription: {
            en: "𝖤𝗑𝖾𝖼𝗎𝗍𝖾 𝖺𝗇𝖽 𝗍𝖾𝗌𝗍 𝖩𝖺𝗏𝖺𝖲𝖼𝗋𝗂𝗉𝗍 𝖼𝗈𝖽𝖾 𝗐𝗂𝗍𝗁 𝗇𝗂𝖼𝖾𝗅𝗒 𝖿𝗈𝗋𝗆𝖺𝗍𝗍𝖾𝖽 𝗈𝗎𝗍𝗉𝗎𝗍"
        },
        guide: {
            en: "{p}eval <𝖼𝗈𝖽𝖾_𝗍𝗈_𝗍𝖾𝗌𝗍>"
        },
        dependencies: {
            "moment": ""
        }
    },

    langs: {
        "en": {
            "error": "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖾𝗑𝖾𝖼𝗎𝗍𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝖽𝖾:",
            "success": "✨ 𝖢𝗈𝖽𝖾 𝖾𝗑𝖾𝖼𝗎𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!"
        }
    },

    onStart: async function({ api, event, args, message, getText, threadsData, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("moment");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗆𝗈𝗆𝖾𝗇𝗍.");
            }

            if (args.length === 0) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖼𝗈𝖽𝖾 𝗍𝗈 𝖾𝗑𝖾𝖼𝗎𝗍𝖾.");
            }

            // Security check - only allow bot owner
            const botOwnerID = global.GoatBot.config.adminBot;
            if (event.senderID !== botOwnerID) {
                return message.reply("❌ 𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽. 𝖮𝗇𝗅𝗒 𝖻𝗈𝗍 𝗈𝗐𝗇𝖾𝗋 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
            }

            // Helper for output
            let outputBuffer = [];
            const output = (msg) => {
                const formattedMsg = formatOutput(msg);
                outputBuffer.push(formattedMsg);
            };

            const out = (msg) => {
                output(msg);
            };

            // Format nicely with emojis
            const formatOutput = (msg) => {
                try {
                    if (msg === null) return `🚫 𝗇𝗎𝗅𝗅`;
                    else if (typeof msg === "number") return `🔢 ${msg.toString()}`;
                    else if (typeof msg === "boolean") return `⚡ ${msg.toString()}`;
                    else if (typeof msg === "function") return `🔧 ${msg.toString()}`;
                    else if (msg instanceof Map) {
                        let text = `🗺️ 𝖬𝖺𝗉(${msg.size}) `;
                        text += JSON.stringify(mapToObj(msg), null, 2);
                        return text;
                    }
                    else if (msg instanceof Set) {
                        let text = `🎯 𝖲𝖾𝗍(${msg.size}) `;
                        text += JSON.stringify([...msg], null, 2);
                        return text;
                    }
                    else if (msg instanceof Array) {
                        return `📋 𝖠𝗋𝗋𝖺𝗒[${msg.length}] ${JSON.stringify(msg, null, 2)}`;
                    }
                    else if (msg instanceof Date) {
                        return `📅 𝖣𝖺𝗍𝖾: ${msg.toISOString()}`;
                    }
                    else if (typeof msg === "object") {
                        return `📦 𝖮𝖻𝗃𝖾𝖼𝗍 ${JSON.stringify(msg, null, 2)}`;
                    }
                    else if (typeof msg === "undefined") {
                        return "❓ 𝗎𝗇𝖽𝖾𝖿𝗂𝗇𝖾𝖽";
                    }
                    else if (typeof msg === "string") {
                        // Handle long strings
                        if (msg.length > 1000) {
                            return `📝 𝖲𝗍𝗋𝗂𝗇𝗀[${msg.length}]: ${msg.substring(0, 1000)}...`;
                        }
                        return `📝 ${msg}`;
                    }
                    else {
                        return `📄 ${String(msg)}`;
                    }
                } catch (formatError) {
                    return `❌ 𝖥𝗈𝗋𝗆𝖺𝗍𝗍𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋: ${formatError.message}`;
                }
            };

            // Convert Map to Object
            const mapToObj = (map) => {
                const obj = {};
                map.forEach((v, k) => obj[k] = v);
                return obj;
            };

            // Safe stringify for circular references
            const safeStringify = (obj, space = 2) => {
                const seen = new WeakSet();
                return JSON.stringify(obj, (key, value) => {
                    if (typeof value === "object" && value !== null) {
                        if (seen.has(value)) {
                            return "[[𝖢𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖱𝖾𝖿𝖾𝗋𝖾𝗇𝖼𝖾]]";
                        }
                        seen.add(value);
                    }
                    return value;
                }, space);
            };

            console.log(`🔧 𝖤𝗏𝖺𝗅 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗂𝗌𝗌𝗎𝖾𝖽 𝖻𝗒: ${event.senderID}`);
            console.log(`📝 𝖢𝗈𝖽𝖾: ${args.join(" ")}`);

            // Execute the code with timeout protection
            const codeToExecute = args.join(" ");
            let evalResult;
            let evalError = null;

            try {
                // Create a safe execution context
                const executionContext = {
                    api,
                    event,
                    message,
                    getText,
                    threadsData,
                    usersData,
                    output,
                    out,
                    global,
                    log,
                    removeHomeDir,
                    formatOutput,
                    mapToObj,
                    safeStringify,
                    require,
                    console,
                    setTimeout,
                    setInterval,
                    clearTimeout,
                    clearInterval
                };

                // Execute with timeout
                const asyncFunction = Object.getPrototypeOf(async function(){}).constructor;
                const syncFunction = Object.getPrototypeOf(function(){}).constructor;
                
                if (codeToExecute.includes('await') || codeToExecute.includes('async')) {
                    // Async execution
                    const asyncCode = `
                        return (async () => {
                            try {
                                ${codeToExecute}
                            } catch(err) {
                                throw err;
                            }
                        })();
                    `;
                    const asyncEval = new asyncFunction(...Object.keys(executionContext), asyncCode);
                    evalResult = await Promise.race([
                        asyncEval(...Object.values(executionContext)),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error("𝖤𝗏𝖺𝗅 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍 𝖺𝖿𝗍𝖾𝗋 30𝗌")), 30000)
                        )
                    ]);
                } else {
                    // Sync execution
                    const syncCode = `
                        try {
                            return ${codeToExecute};
                        } catch(err) {
                            throw err;
                        }
                    `;
                    const syncEval = new syncFunction(...Object.keys(executionContext), syncCode);
                    evalResult = await Promise.race([
                        Promise.resolve(syncEval(...Object.values(executionContext))),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error("𝖤𝗏𝖺𝗅 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍 𝖺𝖿𝗍𝖾𝗋 30𝗌")), 30000)
                        )
                    ]);
                }

                // Send output if any
                if (outputBuffer.length > 0) {
                    const outputText = outputBuffer.join('\n━━━━━━━━━━━━━━━━━━━━\n');
                    await message.reply(`📊 𝖮𝗎𝗍𝗉𝗎𝗍:\n${outputText}`);
                }

                // Send result if not undefined
                if (evalResult !== undefined) {
                    const resultText = formatOutput(evalResult);
                    await message.reply(`✨ 𝖱𝖾𝗌𝗎𝗅𝗍:\n${resultText}`);
                } else if (outputBuffer.length === 0) {
                    await message.reply(getText("success"));
                }

            } catch (executionError) {
                evalError = executionError;
                log.err("eval command", executionError);
                
                const errorMessage = executionError.stack ? 
                    removeHomeDir(executionError.stack) : 
                    removeHomeDir(JSON.stringify(executionError, null, 2) || executionError.message);
                
                await message.reply(`❌ 𝖤𝗋𝗋𝗈𝗋:\n${errorMessage}`);
            }

        } catch (error) {
            console.error("💥 𝖤𝗏𝖺𝗅 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply(`❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋: ${error.message}`);
        }
    }
};
