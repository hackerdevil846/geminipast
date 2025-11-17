module.exports = {
    config: {
        name: "history",
        aliases: ["historical"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 8,
        role: 0,
        category: "info",
        shortDescription: {
            en: "Search and know about Bangladeshi history"
        },
        longDescription: {
            en: "Get short and reliable info about Bangladeshi historical events"
        },
        guide: {
            en: "{p}history [query]"
        }
    },

    onStart: async function({ message, args }) {
        try {
            const query = args.join(" ").trim().toLowerCase();

            if (!query) {
                return message.reply("🔍 Please provide a historical topic to search!\n\n📝 Example: history bangladesh\n📝 Example: history liberation war");
            }

            // Bangladeshi history database
            const historyData = {
                "bangladesh": `🇧🇩 BANGLADESH HISTORY OVERVIEW

🏛️ ANCIENT PERIOD:
The region now known as Bangladesh was historically part of Bengal. Key civilizations included:
• Maurya Dynasty (4th century BCE)
• Gupta Empire (4th-6th century CE)
• Pala Empire (9th-12th century CE)
• Mughal Rule (13th century CE)

🇬🇧 COLONIAL PERIOD:
• British East India Company control after Battle of Plassey (1757)
• Part of Bengal Presidency (1757-1947)
• Bengal Partition (1905) into East/West provinces

🇵🇰 PAKISTAN ERA:
• Partition of British India (1947)
• East Bengal became East Pakistan
• Religious division between East/West Bengal

✨ MODERN BANGLADESH:
• Bangladesh Liberation War (1971)
• Transition from military rule to democracy
• Economic growth in agriculture and manufacturing

━━━━━━━━━━━━━━━
📜 Source: Verified Historical Records
⭐ Credit: Asif Mahmud`,

                "liberation war": `🎖️ BANGLADESH LIBERATION WAR 1971

📅 Timeline:
• March 7, 1971: Sheikh Mujibur Rahman's historic speech
• March 25, 1971: Operation Searchlight begins
• April 10, 1971: Provisional Government formed
• December 16, 1971: Victory Day

⚔️ Key Events:
• Mass uprising against Pakistani rule
• Formation of Mukti Bahini (Freedom Fighters)
• Support from India
• 9-month armed struggle

🏆 Result:
• Bangladesh gains independence
• 3 million martyrs
• 200,000-400,000 women victims

━━━━━━━━━━━━━━━
📜 Historical Records
⭐ Credit: Asif Mahmud`,

                "language movement": `📚 BENGALI LANGUAGE MOVEMENT 1952

📅 Key Events:
• 1948: Urdu declared sole national language of Pakistan
• 1952: Student protests in Dhaka
• February 21, 1952: Martyrs' Day
• 1956: Bengali recognized as state language

🎯 Significance:
• First movement for Bengali rights
• Foundation for independence movement
• UNESCO declared February 21 as International Mother Language Day

━━━━━━━━━━━━━━━
📜 Historical Records
⭐ Credit: Asif Mahmud`,

                "sheikh mujib": `👑 BANGABANDHU SHEIKH MUJIBUR RAHMAN

📅 Life: 1920-1975
• Founding Father of Bangladesh
• Leader of Awami League
• Delivered historic 7th March Speech
• First President of Bangladesh
• Assassinated in 1975

🏆 Legacy:
• Father of the Nation
• Architect of independence
• Symbol of Bengali nationalism

━━━━━━━━━━━━━━━
📜 Historical Records
⭐ Credit: Asif Mahmud`
            };

            // Find matching topic
            let foundTopic = null;
            for (const [topic, content] of Object.entries(historyData)) {
                if (query.includes(topic)) {
                    foundTopic = content;
                    break;
                }
            }

            if (foundTopic) {
                await message.reply(foundTopic);
            } else {
                const availableTopics = Object.keys(historyData).join(", ");
                await message.reply(`❌ No specific information found for "${query}".\n\n📚 Available topics: ${availableTopics}\n\n💡 Try: history bangladesh`);
            }

        } catch (error) {
            console.error("History Command Error:", error);
            await message.reply("❌ An error occurred while fetching historical information. Please try again.");
        }
    }
};
