const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "lyrics",
        aliases: [],
        version: "3.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "media",
        shortDescription: {
            en: "Get song lyrics with Genius API"
        },
        longDescription: {
            en: "Fetch high-quality lyrics for any song using Genius.com"
        },
        guide: {
            en: "{p}lyrics [song name] or {p}lyrics [song name] - [artist name]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            const songName = args.join(" ").trim();
            
            if (!songName) {
                return message.reply("🎵 Please enter a song name!\nExample: .lyrics Bohemian Rhapsody\nOr: .lyrics Shape of You - Ed Sheeran");
            }

            if (songName.length > 100) {
                return message.reply("❌ Song name too long! Please keep it under 100 characters.");
            }

            if (songName.length < 2) {
                return message.reply("❌ Please enter a valid song name.");
            }

            const processingMsg = await message.reply(`🔍 Searching lyrics for "${songName}"... ⏳`);

            // Genius API configuration with your actual token
            const GENIUS_ACCESS_TOKEN = "C0a404JWu4Y1eOHInF9ZerSMlPorTCgtDZ0bRyYOkoCPlWcXQQONU2tmgt1vaiar";
            const GENIUS_API_URL = "https://api.genius.com";

            // Step 1: Search for the song using Genius API
            let searchResponse;
            try {
                searchResponse = await axios.get(`${GENIUS_API_URL}/search`, {
                    headers: {
                        'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    params: {
                        q: songName
                    },
                    timeout: 15000
                });
            } catch (searchError) {
                console.error("Genius search error:", searchError);
                await message.unsendMessage(processingMsg.messageID);
                
                if (searchError.response?.status === 401) {
                    return message.reply("❌ Invalid Genius API token. Please contact bot owner.");
                } else if (searchError.response?.status === 404) {
                    // Try fallback APIs if Genius fails
                    return await tryFallbackAPIs(message, songName, processingMsg);
                } else if (searchError.code === 'ECONNREFUSED' || searchError.code === 'ETIMEDOUT') {
                    return await tryFallbackAPIs(message, songName, processingMsg);
                } else {
                    return await tryFallbackAPIs(message, songName, processingMsg);
                }
            }

            const searchResults = searchResponse.data.response.hits;

            if (!searchResults || searchResults.length === 0) {
                await message.unsendMessage(processingMsg.messageID);
                return await tryFallbackAPIs(message, songName, processingMsg);
            }

            // Get the first result
            const firstResult = searchResults[0].result;
            const songTitle = firstResult.title;
            const artistName = firstResult.primary_artist.name;
            const songUrl = firstResult.url;
            const thumbnail = firstResult.song_art_image_url;

            // Step 2: Fetch lyrics using Genius scraper
            await message.unsendMessage(processingMsg.messageID);
            const lyricsMsg = await message.reply(`✅ Found: "${songTitle}" by ${artistName}\n📥 Fetching lyrics...`);

            let lyrics;
            try {
                lyrics = await scrapeGeniusLyrics(songUrl);
            } catch (scrapeError) {
                console.error("Scraping error:", scrapeError);
                lyrics = null;
            }

            if (!lyrics) {
                await message.unsendMessage(lyricsMsg.messageID);
                return message.reply({
                    body: `✅ Found: "${songTitle}" by ${artistName}\n❌ Couldn't fetch full lyrics automatically.\n\n🔗 View full lyrics on Genius: ${songUrl}`,
                    attachment: await global.utils.getStreamFromURL(thumbnail)
                });
            }

            // Format and send the lyrics
            const header = "━━━━━━━━━━━━━━━━━━\n🎶 𝗟𝗬𝗥𝗜𝗖𝗦 𝗙𝗜𝗡𝗗𝗘𝗥\n━━━━━━━━━━━━━━━━━━";
            const songInfo = `🎼 𝗧𝗶𝘁𝗹𝗲: ${songTitle}\n👤 𝗔𝗿𝘁𝗶𝘀𝘁: ${artistName}\n🔗 𝗦𝗼𝘂𝗿𝗰𝗲: Genius.com`;
            const footer = "━━━━━━━━━━━━━━━━━━\n© 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 (via Genius API)\n━━━━━━━━━━━━━━━━━━";

            // Clean and format lyrics
            let cleanedLyrics = cleanLyrics(lyrics);

            // Truncate if too long for Facebook
            if (cleanedLyrics.length > 3500) {
                cleanedLyrics = cleanedLyrics.substring(0, 3500) + '\n\n... (𝗹𝘆𝗿𝗶𝗰𝘀 𝘁𝗿𝘂𝗻𝗰𝗮𝘁𝗲𝗱 - 𝗳𝘂𝗹𝗹 𝗹𝘆𝗿𝗶𝗰𝘀 𝗮𝘁: ' + songUrl + ')';
            }

            const finalBody = `${header}\n${songInfo}\n\n📝 𝗟𝘆𝗿𝗶𝗰𝘀:\n\n${cleanedLyrics}\n${footer}`;

            await message.unsendMessage(lyricsMsg.messageID);
            
            // Send with thumbnail if available
            if (thumbnail) {
                return message.reply({
                    body: finalBody,
                    attachment: await global.utils.getStreamFromURL(thumbnail)
                });
            } else {
                return message.reply(finalBody);
            }

        } catch (error) {
            console.error("💥 Main lyrics error:", error);
            
            // Try fallback as last resort
            try {
                await tryFallbackAPIs(message, args.join(" ").trim());
            } catch (finalError) {
                let errorMessage = "❌ An unexpected error occurred. Please try again later.";
                
                if (error.code === 'ECONNREFUSED') {
                    errorMessage = "❌ Network error. Please check your internet connection.";
                } else if (error.code === 'ETIMEDOUT') {
                    errorMessage = "❌ Request timed out. Please try again.";
                }
                
                return message.reply(errorMessage);
            }
        }
    }
};

// Helper function to scrape lyrics from Genius page
async function scrapeGeniusLyrics(url) {
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const html = response.data;
        
        // Try multiple selectors for lyrics
        const selectors = [
            /<div[^>]*data-lyrics-container="true"[^>]*>([\s\S]*?)<\/div>/gi,
            /<div[^>]*class="[^"]*lyrics[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
            /<lyrics-content[^>]*>([\s\S]*?)<\/lyrics-content>/gi
        ];
        
        let lyrics = '';
        
        for (const selector of selectors) {
            const matches = html.match(selector);
            if (matches) {
                lyrics = matches.map(match => 
                    match.replace(/<br\s*\/?>/gi, '\n')
                         .replace(/<[^>]*>/g, '')
                         .replace(/&amp;/g, '&')
                         .replace(/&quot;/g, '"')
                         .replace(/&#39;/g, "'")
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/\n\s*\n/g, '\n\n')
                         .trim()
                ).join('\n\n');
                
                if (lyrics.length > 50) break;
            }
        }
        
        return lyrics || null;
    } catch (error) {
        console.error("Scraping error:", error);
        return null;
    }
}

// Helper function to clean lyrics
function cleanLyrics(lyrics) {
    return lyrics
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove multiple empty lines
        .replace(/^\s+|\s+$/g, '') // Trim spaces
        .replace(/\[.*?\]/g, '\n$&\n') // Add space around [Verse], [Chorus] etc.
        .replace(/(\n){3,}/g, '\n\n'); // Limit consecutive newlines to 2
}

// Fallback function using other APIs
async function tryFallbackAPIs(message, songName, processingMsg = null) {
    if (processingMsg) {
        try {
            await message.unsendMessage(processingMsg.messageID);
        } catch (e) {}
    }
    
    const fallbackMsg = await message.reply(`🔍 Genius didn't work, trying other sources for "${songName}"...`);
    
    const fallbackAPIs = [
        {
            name: "Lyrics.ovh",
            url: `https://api.lyrics.ovh/v1/${encodeURIComponent(songName)}`,
            handler: (data) => ({
                lyrics: data.lyrics,
                title: songName.split('-')[0].trim(),
                artist: songName.includes('-') ? songName.split('-')[1].trim() : 'Unknown Artist'
            })
        },
        {
            name: "PopCat",
            url: `https://api.popcat.xyz/lyrics?song=${encodeURIComponent(songName)}`,
            handler: (data) => ({
                lyrics: data.lyrics,
                title: data.title || songName,
                artist: data.artist || 'Unknown Artist'
            })
        }
    ];

    for (const api of fallbackAPIs) {
        try {
            const response = await axios.get(api.url, { timeout: 10000 });
            if (response.data && response.data.lyrics) {
                const result = api.handler(response.data);
                
                await message.unsendMessage(fallbackMsg.messageID);
                
                const formattedLyrics = `🎵 ${result.title} - ${result.artist}\n\n${result.lyrics}\n\n━━━━━━━━━━━━━━━━━━\n© Via ${api.name} Fallback`;
                
                return message.reply(formattedLyrics);
            }
        } catch (error) {
            console.log(`❌ ${api.name} fallback failed:`, error.message);
            continue;
        }
    }

    await message.unsendMessage(fallbackMsg.messageID);
    return message.reply(`❌ No lyrics found for "${songName}" from any source. Please try:\n• Different song name\n• Include artist name\n• Check spelling`);
}
