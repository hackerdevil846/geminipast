const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, registerFont } = require("canvas");

module.exports = {
    config: {
        name: "chart",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "group",
        shortDescription: {
            en: "𝖳𝗈𝗉 𝟪 𝗀𝗋𝗈𝗎𝗉𝗌 𝗂𝗇𝗍𝖾𝗋𝖺𝖼𝗍𝗂𝗏𝖾 𝖽𝗂𝖺𝗀𝗋𝖺𝗆 𝖼𝗋𝖾𝖺𝗍𝖾"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺𝗇 𝗂𝗇𝗍𝖾𝗋𝖺𝖼𝗍𝗂𝗏𝖾 𝖽𝗈𝗎𝗀𝗁𝗇𝗎𝗍 𝖼𝗁𝖺𝗋𝗍 𝗈𝖿 𝗍𝗈𝗉 𝟪 𝗆𝗈𝗌𝗍 𝖺𝖼𝗍𝗂𝗏𝖾 𝗀𝗋𝗈𝗎𝗉𝗌"
        },
        guide: {
            en: "{p}chart"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "canvas": ""
        }
    },

    onStart: async function({ api, event, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("canvas");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝖼𝖺𝗇𝗏𝖺𝗌.");
            }

            const KMath = (data) => data.reduce((a, b) => a + b, 0);
            
            function toMathBoldItalic(text) {
                const map = {
                    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
                    'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
                    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
                    'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
                    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
                    ' ': ' ', ':': ':', '>': '>', '<': '<', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}', ',': ',', '.': '.', ';': ';', 
                    '!': '!', '?': '?', "'": "'", '"': '"', '-': '-', '_': '_', '=': '=', '+': '+', '*': '*', '/': '/', '\\': '\\', '|': '|', '&': '&', 
                    '^': '^', '%': '%', '$': '$', '#': '#', '@': '@'
                };
                return text.split('').map(char => map[char] || char).join('');
            }

            const loadingMsg = await message.reply("📊 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗋𝗍...");

            const successMessage = toMathBoldItalic("✨ 𝖳𝗈𝗉 𝟪 𝖬𝗈𝗌𝗍 𝖠𝖼𝗍𝗂𝗏𝖾 𝖦𝗋𝗈𝗎𝗉𝗌 𝖢𝗁𝖺𝗋𝗍\n━━━━━━━━━━━━━━━━━━\n✅ 𝖢𝗁𝖺𝗋𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽!");
            const path = __dirname + `/cache/chart_${Date.now()}.png`;
            
            try {
                const inbox = await api.getThreadList(100, null, ['INBOX']);
                const filteredGroups = [...inbox].filter(group => group.isSubscribed && group.isGroup);
                
                if (filteredGroups.length === 0) {
                    await message.unsend(loadingMsg.messageID);
                    return message.reply(toMathBoldItalic("❌ 𝖭𝗈 𝗀𝗋𝗈𝗎𝗉 𝗌𝗎𝖻𝗌𝖼𝗋𝗂𝖻𝖾𝖽 𝗈𝗋 𝖿𝗈𝗎𝗇𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗁𝖺𝗋𝗍"));
                }
                
                const groupData = [];
                for (const group of filteredGroups) {
                    groupData.push({
                        name: group.name || "𝖴𝗇𝗇𝖺𝗆𝖾𝖽 𝖦𝗋𝗈𝗎𝗉",
                        exp: group.messageCount || 0
                    });
                }
                
                groupData.sort((a, b) => b.exp - a.exp);
                const topGroups = groupData.slice(0, 8);
                
                if (topGroups.length === 0) {
                    await message.unsend(loadingMsg.messageID);
                    return message.reply(toMathBoldItalic("❌ 𝖭𝗈 𝗀𝗋𝗈𝗎𝗉 𝖽𝖺𝗍𝖺 𝖿𝗈𝗎𝗇𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗁𝖺𝗋𝗍"));
                }

                // Truncate long group names
                const truncatedLabels = topGroups.map(group => {
                    let name = group.name.replace(/'/g, "\\'");
                    if (name.length > 20) {
                        name = name.substring(0, 17) + '...';
                    }
                    return name;
                });

                const chartUrl = `https://quickchart.io/chart?c={
                    type: 'doughnut',
                    data: {
                        labels: [${truncatedLabels.map(label => `'${label}'`).join(',')}],
                        datasets: [{
                            label: '${toMathBoldItalic('Interaction')}',
                            data: [${topGroups.map(group => group.exp).join(',')}],
                            backgroundColor: [
                                '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9c74f', 
                                '#ffa726', '#7e57c2', '#ef5350', '#29b6f6'
                            ],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: '${toMathBoldItalic('Top 8 Most Active Groups')}',
                                font: { size: 16, weight: 'bold' }
                            },
                            legend: { 
                                position: 'right',
                                labels: { font: { size: 12 } }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return \`\${context.label}: \${context.raw} messages\`;
                                    }
                                }
                            }
                        }
                    }
                }&width=800&height=600&backgroundColor=white`;
                
                console.log(`📊 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝖼𝗁𝖺𝗋𝗍 𝖿𝗈𝗋 ${topGroups.length} 𝗀𝗋𝗈𝗎𝗉𝗌...`);

                const { data: chartBuffer } = await axios.get(chartUrl, {
                    method: 'GET',
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                await fs.writeFileSync(path, Buffer.from(chartBuffer));

                // Verify the file was written successfully
                if (!fs.existsSync(path)) {
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝖼𝗁𝖺𝗋𝗍 𝗂𝗆𝖺𝗀𝖾");
                }

                const stats = await fs.stat(path);
                if (stats.size === 0) {
                    throw new Error("𝖢𝗁𝖺𝗋𝗍 𝗂𝗆𝖺𝗀𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }

                await message.unsend(loadingMsg.messageID);
                
                await message.reply({
                    body: successMessage,
                    attachment: fs.createReadStream(path)
                });

                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖼𝗁𝖺𝗋𝗍 𝗐𝗂𝗍𝗁 ${topGroups.length} 𝗀𝗋𝗈𝗎𝗉𝗌`);

                // Clean up file
                await fs.unlinkSync(path);
                
            } catch (apiError) {
                console.error("❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
                await message.unsend(loadingMsg.messageID);
                throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗀𝗋𝗈𝗎𝗉 𝖽𝖺𝗍𝖺: ${apiError.message}`);
            }
            
        } catch (error) {
            console.error("💥 𝖢𝗁𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Try to unsend loading message
            try {
                await message.unsend(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            let errorMessage = "❌ 𝖢𝗁𝖺𝗋𝗍 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽!\n━━━━━━━━━━━━━━━━━━\n𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('getThreadList')) {
                errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗅𝗂𝗌𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
