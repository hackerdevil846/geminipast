const axios = require("axios");
const google = require("googlethis");

module.exports = {
    config: {
        name: "locresearch",
        aliases: [],
        version: "1.1",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖱𝖾𝗍𝗋𝗂𝖾𝗏𝖺𝗅"
        },
        longDescription: {
            en: "𝖦𝖾𝗍 𝖼𝗈𝗆𝗉𝗋𝖾𝗁𝖾𝗇𝗌𝗂𝗏𝖾 𝗂𝗇𝗌𝗂𝗀𝗁𝗍𝗌 𝖿𝗋𝗈𝗆 𝗅𝗈𝖼.𝗀𝗈𝗏, 𝖶𝗂𝗄𝗂𝗉𝖾𝖽𝗂𝖺, 𝖺𝗇𝖽 𝖦𝗈𝗈𝗀𝗅𝖾"
        },
        category: "𝗌𝗍𝗎𝖽𝗒",
        guide: {
            en: "{p}locresearch <𝗄𝖾𝗒𝗐𝗈𝗋𝖽𝗌>"
        },
        dependencies: {
            "axios": "",
            "googlethis": ""
        }
    },

    onStart: async function({ api, event, args, message }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            let googlethisAvailable = true;
            
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }
            
            try {
                require("googlethis");
            } catch (e) {
                googlethisAvailable = false;
            }

            if (!axiosAvailable || !googlethisAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝗀𝗈𝗈𝗀𝗅𝖾𝗍𝗁𝗂𝗌.");
            }

            let query = args.join(" ").trim();
            const options = {
                page: 0,
                safe: true,
                additional_params: {
                    hl: "en",
                },
                timeout: 30000
            };

            if (!query) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗈𝗋𝗆𝖺𝗍!\n\n𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗒𝗈𝗎𝗋 𝗌𝖾𝖺𝗋𝖼𝗁 𝗄𝖾𝗒𝗐𝗈𝗋𝖽𝗌.");
            }

            // Validate query length
            if (query.length > 200) {
                return message.reply("❌ 𝖰𝗎𝖾𝗋𝗒 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 200 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            const loadingMsg = await message.reply(`🔎 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖿𝗈𝗋 "${query}" 𝗈𝗇 𝗅𝗈𝖼.𝗀𝗈𝗏...`);

            let locResults = "";
            let alternativeResults = "";
            let hasResults = false;

            try {
                // LOC.GOV Search
                console.log(`🔍 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖫𝖮𝖢.𝖦𝖮𝖵 𝖿𝗈𝗋: ${query}`);
                const response = await google.search(`site:loc.gov/ ${query}`, options);

                if (response.results && response.results.length > 0) {
                    hasResults = true;
                    locResults += "📚 𝖫𝖮𝖢.𝖦𝖮𝖵 𝖱𝖤𝖲𝖤𝖠𝖱𝖢𝖧 𝖱𝖤𝖲𝖴𝖫𝖳𝖲:\n\n";
                    
                    for (let i = 0; i < Math.min(3, response.results.length); i++) {
                        try {
                            const result = response.results[i];
                            let title = result.title || "𝖭𝗈 𝖳𝗂𝗍𝗅𝖾";
                            let description = result.description || "𝖭𝗈 𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇 𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾";
                            let link = result.url || "𝖭𝗈 𝖫𝗂𝗇𝗄";
                            
                            // Truncate long descriptions
                            if (description.length > 300) {
                                description = description.substring(0, 300) + "...";
                            }

                            locResults += `📄 𝖱𝖾𝗌𝗈𝗎𝗋𝖼𝖾 ${i + 1}:\n`;
                            locResults += `⦿ 𝖳𝗂𝗍𝗅𝖾: ${title}\n`;
                            locResults += `⦿ 𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇: ${description}\n`;
                            locResults += `⦿ 𝖫𝗂𝗇𝗄: ${link}\n\n`;

                            // Wikipedia integration with error handling
                            try {
                                const wikiResponse = await axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(title)}`, {
                                    timeout: 10000
                                });
                                
                                const pages = wikiResponse.data.query.pages;
                                const pageId = Object.keys(pages)[0];
                                const pageData = pages[pageId];
                                
                                if (pageData && pageData.extract) {
                                    const extract = pageData.extract;
                                    if (extract.length > 50) { // Only add if meaningful content
                                        const shortExtract = extract.length > 200 ? extract.substring(0, 200) + "..." : extract;
                                        locResults += `📖 𝖶𝗂𝗄𝗂𝗉𝖾𝖽𝗂𝖺 𝖨𝗇𝗌𝗂𝗀𝗁𝗍: ${shortExtract}\n\n`;
                                    }
                                }
                            } catch (wikiError) {
                                console.log("❌ 𝖶𝗂𝗄𝗂𝗉𝖾𝖽𝗂𝖺 𝗌𝖾𝖺𝗋𝖼𝗁 𝖿𝖺𝗂𝗅𝖾𝖽:", wikiError.message);
                                // Continue without Wikipedia data
                            }

                        } catch (resultError) {
                            console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝗌𝗎𝗅𝗍 ${i + 1}:`, resultError.message);
                            continue;
                        }
                    }
                }

            } catch (locError) {
                console.error("❌ 𝖫𝖮𝖢.𝖦𝖮𝖵 𝗌𝖾𝖺𝗋𝖼𝗁 𝖾𝗋𝗋𝗈𝗋:", locError.message);
                locResults = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝖫𝖮𝖢.𝖦𝖮𝖵 𝖽𝖺𝗍𝖺𝖻𝖺𝗌𝖾.\n\n";
            }

            // Google Search Fallback
            try {
                console.log(`🔍 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖦𝗈𝗈𝗀𝗅𝖾 𝖿𝗈𝗋: ${query}`);
                const alternativeResponse = await google.search(query, options);
                
                if (alternativeResponse.results && alternativeResponse.results.length > 0) {
                    hasResults = true;
                    alternativeResults += "\n🔎 𝖦𝖮𝖮𝖦𝖫𝖤 𝖲𝖤𝖠𝖱𝖢𝖧 𝖱𝖤𝖲𝖴𝖫𝖳𝖲:\n\n";
                    
                    for (let i = 0; i < Math.min(3, alternativeResponse.results.length); i++) {
                        try {
                            const result = alternativeResponse.results[i];
                            let title = result.title || "𝖭𝗈 𝖳𝗂𝗍𝗅𝖾";
                            let description = result.description || "𝖭𝗈 𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇 𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾";
                            let link = result.url || "𝖭𝗈 𝖫𝗂𝗇𝗄";
                            
                            // Truncate long descriptions
                            if (description.length > 250) {
                                description = description.substring(0, 250) + "...";
                            }

                            alternativeResults += `🌐 𝖱𝖾𝗌𝗎𝗅𝗍 ${i + 1}:\n`;
                            alternativeResults += `⦿ 𝖳𝗂𝗍𝗅𝖾: ${title}\n`;
                            alternativeResults += `⦿ 𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇: ${description}\n`;
                            alternativeResults += `⦿ 𝖫𝗂𝗇𝗄: ${link}\n\n`;

                        } catch (altResultError) {
                            console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖦𝗈𝗈𝗀𝗅𝖾 𝗋𝖾𝗌𝗎𝗅𝗍 ${i + 1}:`, altResultError.message);
                            continue;
                        }
                    }
                }
            } catch (googleError) {
                console.error("❌ 𝖦𝗈𝗈𝗀𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁 𝖾𝗋𝗋𝗈𝗋:", googleError.message);
                alternativeResults += "\n❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝖦𝗈𝗈𝗀𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁.\n";
            }

            // Unsend loading message
            try {
                await message.unsend(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            // Send results
            if (hasResults) {
                // Send LOC results first if available
                if (locResults.length > 10) {
                    await message.reply(locResults);
                }
                
                // Send Google results if available
                if (alternativeResults.length > 10) {
                    await message.reply(alternativeResults);
                }
                
                if (locResults.length <= 10 && alternativeResults.length <= 10) {
                    await message.reply("❌ 𝖭𝗈 𝗋𝖾𝗅𝖾𝗏𝖺𝗇𝗍 𝗋𝖾𝗌𝗎𝗅𝗍𝗌 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝗌𝖾𝖺𝗋𝖼𝗁.");
                }
            } else {
                await message.reply("❌ 𝖭𝗈 𝗋𝖾𝗌𝗎𝗅𝗍𝗌 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝗌𝖾𝖺𝗋𝖼𝗁 𝗊𝗎𝖾𝗋𝗒.");
            }

        } catch (error) {
            console.error("💥 𝖫𝖮𝖢 𝖱𝖾𝗌𝖾𝖺𝗋𝖼𝗁 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Try to send a generic error message
            try {
                await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝖽𝗎𝗋𝗂𝗇𝗀 𝗌𝖾𝖺𝗋𝖼𝗁. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            } catch (finalError) {
                // Silent fail to avoid spam
            }
        }
    }
};
