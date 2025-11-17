const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "crypto",
        aliases: [],
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "finance",
        shortDescription: {
            en: "𝖱𝖾𝖺𝗅-𝗍𝗂𝗆𝖾 𝖼𝗋𝗒𝗉𝗍𝗈𝖼𝗎𝗋𝗋𝖾𝗇𝖼𝗒 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇"
        },
        longDescription: {
            en: "𝖦𝖾𝗍 𝗋𝖾𝖺𝗅-𝗍𝗂𝗆𝖾 𝖼𝗋𝗒𝗉𝗍𝗈𝖼𝗎𝗋𝗋𝖾𝗇𝖼𝗒 𝗉𝗋𝗂𝖼𝖾𝗌 𝖺𝗇𝖽 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇"
        },
        guide: {
            en: "{p}crypto [𝖼𝗈𝗂𝗇 𝗇𝖺𝗆𝖾] 𝗈𝗋 {p}crypto 𝗅𝗂𝗌𝗍"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            // Format currency with proper symbols
            const formatCurrency = (value) => {
                if (!value || isNaN(value)) return "0.00";
                return parseFloat(value).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8
                });
            };

            // Available coins mapping with more cryptocurrencies
            const coinMapping = {
                "bitcoin": { id: "btc-bitcoin", symbol: "BTC" },
                "btc": { id: "btc-bitcoin", symbol: "BTC" },
                "ethereum": { id: "eth-ethereum", symbol: "ETH" },
                "eth": { id: "eth-ethereum", symbol: "ETH" },
                "tether": { id: "usdt-tether", symbol: "USDT" },
                "usdt": { id: "usdt-tether", symbol: "USDT" },
                "binance": { id: "bnb-binance-coin", symbol: "BNB" },
                "bnb": { id: "bnb-binance-coin", symbol: "BNB" },
                "usd coin": { id: "usdc-usd-coin", symbol: "USDC" },
                "usdc": { id: "usdc-usd-coin", symbol: "USDC" },
                "solana": { id: "sol-solana", symbol: "SOL" },
                "sol": { id: "sol-solana", symbol: "SOL" },
                "xrp": { id: "xrp-xrp", symbol: "XRP" },
                "cardano": { id: "ada-cardano", symbol: "ADA" },
                "ada": { id: "ada-cardano", symbol: "ADA" },
                "dogecoin": { id: "doge-dogecoin", symbol: "DOGE" },
                "doge": { id: "doge-dogecoin", symbol: "DOGE" },
                "polkadot": { id: "dot-polkadot", symbol: "DOT" },
                "dot": { id: "dot-polkadot", symbol: "DOT" },
                "shiba inu": { id: "shib-shiba-inu", symbol: "SHIB" },
                "shib": { id: "shib-shiba-inu", symbol: "SHIB" },
                "avalanche": { id: "avax-avalanche", symbol: "AVAX" },
                "avax": { id: "avax-avalanche", symbol: "AVAX" },
                "polygon": { id: "matic-polygon", symbol: "MATIC" },
                "matic": { id: "matic-polygon", symbol: "MATIC" },
                "chainlink": { id: "link-chainlink", symbol: "LINK" },
                "link": { id: "link-chainlink", symbol: "LINK" },
                "litecoin": { id: "ltc-litecoin", symbol: "LTC" },
                "ltc": { id: "ltc-litecoin", symbol: "LTC" },
                "bitcoin cash": { id: "bch-bitcoin-cash", symbol: "BCH" },
                "bch": { id: "bch-bitcoin-cash", symbol: "BCH" },
                "uniswap": { id: "uni-uniswap", symbol: "UNI" },
                "uni": { id: "uni-uniswap", symbol: "UNI" }
            };

            const input = args.join(" ").toLowerCase().trim();
            
            // Show coin list if requested
            if (input === "list") {
                const coins = Object.keys(coinMapping).filter(key => !key.match(/\d/) && key.length > 2);
                const chunkSize = 15;
                let msg = "📋 𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖢𝗋𝗒𝗉𝗍𝗈𝖼𝗎𝗋𝗋𝖾𝗇𝖼𝗂𝖾𝗌:\n\n";
                
                for (let i = 0; i < coins.length; i += chunkSize) {
                    const chunk = coins.slice(i, i + chunkSize);
                    msg += chunk.map(coin => `• ${coin.charAt(0).toUpperCase() + coin.slice(1)}`).join('\n') + '\n\n';
                }
                
                msg += "💡 𝖴𝗌𝖺𝗀𝖾: 𝖼𝗋𝗒𝗉𝗍𝗈 [𝖼𝗈𝗂𝗇 𝗇𝖺𝗆𝖾]\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖼𝗋𝗒𝗉𝗍𝗈 𝖻𝗂𝗍𝖼𝗈𝗂𝗇";
                return message.reply(msg);
            }
            
            if (!input) {
                return message.reply(
                    "🔍 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗒 𝖺 𝖼𝗋𝗒𝗉𝗍𝗈𝖼𝗎𝗋𝗋𝖾𝗇𝖼𝗒.\n\n𝖴𝗌𝖾 '𝖼𝗋𝗒𝗉𝗍𝗈 𝗅𝗂𝗌𝗍' 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗅𝗅 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗂𝗇𝗌.\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖼𝗋𝗒𝗉𝗍𝗈 𝖻𝗂𝗍𝖼𝗈𝗂𝗇"
                );
            }

            const coinInfo = coinMapping[input];
            if (!coinInfo) {
                return message.reply(
                    "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗂𝗇 𝗇𝖺𝗆𝖾. 𝖴𝗌𝖾 '𝖼𝗋𝗒𝗉𝗍𝗈 𝗅𝗂𝗌𝗍' 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗅𝗅 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗂𝗇𝗌."
                );
            }

            // Create cache directory
            const cachePath = path.join(__dirname, 'cache', 'crypto');
            try {
                if (!fs.existsSync(cachePath)) {
                    fs.mkdirSync(cachePath, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError.message);
            }

            const loadingMsg = await message.reply("⏳ 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖼𝗋𝗒𝗉𝗍𝗈 𝖽𝖺𝗍𝖺...");

            try {
                const response = await axios.get(`https://api.coinpaprika.com/v1/ticker/${coinInfo.id}`, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                const coinData = response.data;
                
                if (!coinData || !coinData.name) {
                    await message.unsendMessage(loadingMsg.messageID);
                    return message.reply("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝖽𝖺𝗍𝖺 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝖼𝗈𝗂𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                }

                const logoPath = path.join(cachePath, `${coinInfo.id}_${Date.now()}.png`);
                const logoUrl = `https://static.coinpaprika.com/coin/${coinInfo.id}/logo.png?rev=10557311`;
                
                // Download coin logo with error handling
                let logoDownloaded = false;
                try {
                    const logoResponse = await axios.get(logoUrl, { 
                        responseType: 'arraybuffer',
                        timeout: 15000 
                    });
                    fs.writeFileSync(logoPath, logoResponse.data);
                    logoDownloaded = true;
                } catch (logoError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗅𝗈𝗀𝗈:", logoError.message);
                }
                
                // Format data with emojis
                const priceChangeEmoji = coinData.percent_change_24h >= 0 ? "📈" : "📉";
                const priceChangeColor = coinData.percent_change_24h >= 0 ? "🟢" : "🔴";
                
                // Create beautiful message format
                const msg = 
                    `✨ ─── ${coinData.name} (${coinData.symbol}) ─── ✨\n\n` +
                    `🏆  𝖱𝖺𝗇𝗄: #${coinData.rank || '𝖭/𝖠'}\n` +
                    `💰  𝖯𝗋𝗂𝖼𝖾: $${formatCurrency(coinData.price_usd)}\n` +
                    `₿   𝖡𝖳𝖢 𝖯𝗋𝗂𝖼𝖾: ${formatCurrency(coinData.price_btc)} 𝖡𝖳𝖢\n` +
                    `📊  𝖬𝖺𝗋𝗄𝖾𝗍 𝖢𝖺𝗉: $${formatCurrency(coinData.market_cap_usd)}\n` +
                    `🔄  24𝗁 𝖵𝗈𝗅𝗎𝗆𝖾: $${formatCurrency(coinData.volume_24h_usd)}\n` +
                    `${priceChangeEmoji}  24𝗁 𝖢𝗁𝖺𝗇𝗀𝖾: ${priceChangeColor} ${coinData.percent_change_24h || 0}%\n\n` +
                    `⏰  𝖴𝗉𝖽𝖺𝗍𝖾𝖽: ${new Date().toLocaleString()}`;

                // Unsend loading message
                try {
                    await message.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                // Send response with or without logo
                if (logoDownloaded && fs.existsSync(logoPath)) {
                    await message.reply({
                        body: msg,
                        attachment: fs.createReadStream(logoPath)
                    });
                    
                    // Clean up logo file
                    try {
                        fs.unlinkSync(logoPath);
                    } catch (cleanupError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗅𝗈𝗀𝗈 𝖿𝗂𝗅𝖾:", cleanupError.message);
                    }
                } else {
                    await message.reply(msg);
                }

            } catch (apiError) {
                await message.unsendMessage(loadingMsg.messageID);
                console.error("❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError.message);
                
                let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖼𝗋𝗒𝗉𝗍𝗈 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                } else if (apiError.response?.status === 404) {
                    errorMessage = "❌ 𝖢𝗈𝗂𝗇 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖼𝗈𝗂𝗇 𝗇𝖺𝗆𝖾 𝖺𝗇𝖽 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                }
                
                await message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝖢𝖱𝖸𝖯𝖳𝖮 𝖤𝖱𝖱𝖮𝖱:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('dependencies')) {
                errorMessage = "❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.";
            }
            
            await message.reply(errorMessage);
        }
    },

    onLoad: function() {
        // Create cache directory on load
        try {
            const cachePath = path.join(__dirname, 'cache', 'crypto');
            if (!fs.existsSync(cachePath)) {
                fs.mkdirSync(cachePath, { recursive: true });
                console.log("✅ 𝖢𝗋𝗒𝗉𝗍𝗈 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖼𝗋𝖾𝖺𝗍𝖾𝖽");
            }
        } catch (error) {
            console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", error.message);
        }
    }
};
