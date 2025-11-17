const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "pay",
    aliases: [],
    version: "2.0.0",
    author: "Asif Mahmud",
    countDown: 15,
    role: 0,
    category: "💰 Economy",
    shortDescription: {
      en: "💰 Transfer money with stylish receipts"
    },
    longDescription: {
      en: "💰 Transfer money to other users with beautiful receipt images"
    },
    guide: {
      en: "{p}pay [@tag] [amount]"
    },
    dependencies: {
      "canvas": "",
      "moment-timezone": "",
      "fs-extra": ""
    },
    envConfig: {
      taxRate: 0.15
    }
  },

  langs: {
    en: {
      "missingTag": "💸 | Please tag the recipient",
      "overTagLength": "⚠️ | Only one recipient allowed",
      "userNotExist": "❌ | Recipient not found in system",
      "invalidInput": "⚠️ | Invalid amount entered",
      "payerNotExist": "❌ | Sender not found, please try again",
      "notEnoughMoney": "⚠️ | Insufficient balance",
      "paySuccess": "💸 | Successfully transferred %1$ (15% tax deducted) to: %2",
      "error": "❌ | Transfer failed, please try again"
    }
  },

  onStart: async function({ api, event, args, usersData, getLang }) {
    let receiptPath = null;
    
    try {
      // Enhanced dependency check with fallbacks
      let canvasAvailable = true;
      let momentAvailable = true;
      
      try {
        require("canvas");
        require("moment-timezone");
        require("fs-extra");
      } catch (e) {
        canvasAvailable = false;
        console.error("❌ Missing dependencies:", e.message);
      }

      const { threadID, messageID, senderID } = event;
      const { taxRate } = this.config.envConfig;
      let targetID, amount;
      
      // Enhanced argument processing
      if (!args[0]) {
        return api.sendMessage(this.styledMessage(getLang("missingTag"), "error"), threadID, messageID);
      }
      
      if (Object.keys(event.mentions).length > 1) {
        return api.sendMessage(this.styledMessage(getLang("overTagLength"), "warning"), threadID, messageID);
      }
      
      // Get target user with better validation
      if (Object.keys(event.mentions).length === 1) {
        targetID = Object.keys(event.mentions)[0];
        const mentionIndex = args.findIndex(arg => arg.includes(event.mentions[targetID]));
        amount = args[mentionIndex + 1];
      } else {
        targetID = args[0];
        amount = args[1];
      }

      // Validate target ID
      if (!targetID || isNaN(targetID)) {
        return api.sendMessage(this.styledMessage(getLang("userNotExist"), "error"), threadID, messageID);
      }

      // Validate amount
      amount = parseFloat(amount);
      if (isNaN(amount) || amount < 1 || !Number.isInteger(amount)) {
        return api.sendMessage(this.styledMessage(getLang("invalidInput"), "warning"), threadID, messageID);
      }

      // Enhanced currency operations with better error handling
      let payerData, allUsers;
      
      try {
        // Check if usersData is available
        if (!usersData || typeof usersData.get !== 'function') {
          throw new Error("usersData system not available");
        }
        
        allUsers = await usersData.getAll();
        payerData = await usersData.get(senderID);
        
        if (!payerData || typeof payerData.money === 'undefined') {
          return api.sendMessage(this.styledMessage(getLang("payerNotExist"), "error"), threadID, messageID);
        }
        
        // Check if recipient exists
        const recipientExists = allUsers.some(user => user.ID === targetID);
        if (!recipientExists) {
          return api.sendMessage(this.styledMessage(getLang("userNotExist"), "error"), threadID, messageID);
        }
        
      } catch (dbError) {
        console.error("❌ Database error:", dbError);
        return api.sendMessage(this.styledMessage("❌ Payment system temporarily unavailable", "error"), threadID, messageID);
      }

      // Check balance
      if (payerData.money < amount) {
        return api.sendMessage(this.styledMessage(getLang("notEnoughMoney"), "warning"), threadID, messageID);
      }
      
      const taxAmount = Math.floor(amount * taxRate);
      const netAmount = amount - taxAmount;
      
      // Perform transaction with timeout protection
      try {
        await Promise.race([
          usersData.decreaseMoney(senderID, parseInt(amount)),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Transaction timeout')), 10000))
        ]);
        
        await Promise.race([
          usersData.increaseMoney(targetID, netAmount),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Transaction timeout')), 10000))
        ]);
        
      } catch (txError) {
        console.error("❌ Transaction error:", txError);
        return api.sendMessage(this.styledMessage("❌ Transaction failed due to timeout", "error"), threadID, messageID);
      }
      
      // Get user info with timeout protection
      let senderInfo, receiverInfo;
      try {
        [senderInfo, receiverInfo] = await Promise.all([
          this.getUserInfoWithTimeout(api, senderID),
          this.getUserInfoWithTimeout(api, targetID)
        ]);
      } catch (userInfoError) {
        console.error("❌ User info error:", userInfoError);
        senderInfo = { [senderID]: { name: "User" } };
        receiverInfo = { [targetID]: { name: "Recipient" } };
      }
      
      const senderName = senderInfo[senderID]?.name || "User";
      const receiverName = receiverInfo[targetID]?.name || "Recipient";
      
      // Generate receipt if canvas is available
      if (canvasAvailable) {
        try {
          receiptPath = await this.generateReceipt(api, senderID, targetID, amount, taxRate, netAmount);
        } catch (receiptError) {
          console.error("❌ Receipt generation failed:", receiptError);
          receiptPath = null;
        }
      }
      
      // Success message with beautiful styling
      const successMsg = this.styledMessage(
        `💸 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋 𝐓𝐑𝐀𝐍𝐒𝐅𝐄𝐑\n━━━━━━━━━━━━━━━━━━\n` +
        `💰 𝐀𝐦𝐨𝐮𝐧𝐭: $${amount}\n` +
        `📊 𝐓𝐚𝐱 (15%): $${taxAmount}\n` +
        `🎯 𝐍𝐞𝐭 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝: $${netAmount}\n` +
        `👤 𝐑𝐞𝐜𝐢𝐩𝐢𝐞𝐧𝐭: ${receiverName}\n` +
        `⏰ 𝐓𝐢𝐦𝐞: ${moment().tz("Asia/Dhaka").format('h:mm:ss A')}\n━━━━━━━━━━━━━━━━━━\n` +
        `✅ 𝐓𝐫𝐚𝐧𝐬𝐚𝐜𝐭𝐢𝐨𝐧 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞𝐝`,
        "success"
      );
      
      // Send result
      if (receiptPath && fs.existsSync(receiptPath)) {
        await api.sendMessage({
          body: successMsg,
          attachment: fs.createReadStream(receiptPath)
        }, threadID, messageID);
      } else {
        await api.sendMessage(successMsg, threadID, messageID);
      }
      
    } catch (error) {
      console.error("💥 Pay Command Error:", error);
      try {
        await api.sendMessage(
          this.styledMessage("❌ Payment failed. Please try again later.", "error"), 
          event.threadID, 
          event.messageID
        );
      } catch (finalError) {
        console.error("💥 Final error handling failed:", finalError);
      }
    } finally {
      // Cleanup receipt file
      if (receiptPath && fs.existsSync(receiptPath)) {
        try {
          fs.unlinkSync(receiptPath);
        } catch (cleanupError) {
          console.log("ℹ️ Could not clean up receipt file");
        }
      }
    }
  },

  // Enhanced user info fetch with timeout
  getUserInfoWithTimeout: async function(api, userID) {
    return Promise.race([
      api.getUserInfo(userID),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('User info timeout')), 8000)
      )
    ]);
  },

  // CSS-like styled message generator
  styledMessage: function(text, type = "info") {
    const styles = {
      success: {
        header: "✅ 𝐒𝐔𝐂𝐂𝐄𝐒𝐒",
        border: "━━━━━━━━━━━━━━━━━━",
        color: "#27ae60"
      },
      error: {
        header: "❌ 𝐄𝐑𝐑𝐎𝐑",
        border: "━━━━━━━━━━━━━━━━━━",
        color: "#e74c3c"
      },
      warning: {
        header: "⚠️ 𝐖𝐀𝐑𝐍𝐈𝐍𝐆",
        border: "━━━━━━━━━━━━━━━━━━",
        color: "#f39c12"
      },
      info: {
        header: "💡 𝐈𝐍𝐅𝐎",
        border: "━━━━━━━━━━━━━━━━━━",
        color: "#3498db"
      }
    };

    const style = styles[type] || styles.info;
    
    return `\n${style.header}\n${style.border}\n${text}\n${style.border}\n`;
  },

  generateReceipt: async function(api, senderID, receiverID, amount, tax, net) {
    try {
      const width = 800;
      const height = 500;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      // CSS-like gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Header with CSS-like shadow
      ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.fillRect(0, 0, width, 100);
      ctx.shadowBlur = 0;
      
      // Title with bold sans-serif font
      ctx.font = 'bold 38px "Arial", sans-serif';
      ctx.fillStyle = '#f1c40f';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText('💰 𝐏𝐀𝐘𝐌𝐄𝐍𝐓 𝐑𝐄𝐂𝐄𝐈𝐏𝐓', width/2, 65);
      ctx.shadowBlur = 0;
      
      // Main content box with CSS-like border radius
      this.drawRoundedRect(ctx, 40, 120, width-80, height-180, 15);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();
      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Transaction details with bold styling
      ctx.font = 'bold 22px "Arial", sans-serif';
      ctx.fillStyle = '#ecf0f1';
      ctx.textAlign = 'left';
      
      const taxAmount = Math.floor(amount * tax);
      const transactionId = Date.now().toString(36).toUpperCase();
      
      // Get user names with fallback
      let senderName = "User", receiverName = "Recipient";
      try {
        const [senderInfo, receiverInfo] = await Promise.all([
          this.getUserInfoWithTimeout(api, senderID),
          this.getUserInfoWithTimeout(api, receiverID)
        ]);
        senderName = senderInfo[senderID]?.name || "User";
        receiverName = receiverInfo[receiverID]?.name || "Recipient";
      } catch (e) {
        console.log("ℹ️ Using fallback names for receipt");
      }
      
      const details = [
        { icon: '📅', text: `𝐃𝐚𝐭𝐞: ${moment().tz("Asia/Dhaka").format('MMMM Do YYYY, h:mm:ss a')}` },
        { icon: '💳', text: `𝐒𝐞𝐧𝐝𝐞𝐫: ${senderName}` },
        { icon: '👤', text: `𝐑𝐞𝐜𝐢𝐩𝐢𝐞𝐧𝐭: ${receiverName}` },
        { icon: '💵', text: `𝐀𝐦𝐨𝐮𝐧𝐭: $${amount}` },
        { icon: '📊', text: `𝐓𝐚𝐱: $${taxAmount} (${tax * 100}%)` },
        { icon: '🎯', text: `𝐍𝐞𝐭 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝: $${net}` },
        { icon: '🆔', text: `𝐓𝐫𝐚𝐧𝐬𝐚𝐜𝐭𝐢𝐨𝐧 𝐈𝐃: #${transactionId}` }
      ];
      
      const startY = 160;
      const lineHeight = 40;
      
      details.forEach((detail, index) => {
        ctx.fillStyle = '#f1c40f';
        ctx.fillText(detail.icon, 60, startY + (index * lineHeight));
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText(detail.text, 100, startY + (index * lineHeight));
      });
      
      // Footer
      const footerGradient = ctx.createLinearGradient(0, height-50, width, height);
      footerGradient.addColorStop(0, 'rgba(26, 26, 46, 0.8)');
      footerGradient.addColorStop(1, 'rgba(15, 52, 96, 1)');
      ctx.fillStyle = footerGradient;
      ctx.fillRect(0, height-50, width, 50);
      
      // Copyright text
      ctx.font = 'italic 16px "Arial", sans-serif';
      ctx.fillStyle = '#bdc3c7';
      ctx.textAlign = 'center';
      ctx.fillText('© Asif Mahmud Economy System • Secure Transactions', width/2, height-20);
      
      // Save image
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const receiptPath = path.join(cacheDir, `pay_receipt_${Date.now()}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(receiptPath, buffer);
      
      return receiptPath;
    } catch (e) {
      console.error('❌ Receipt generation error:', e);
      return null;
    }
  },

  // Helper function for rounded rectangles
  drawRoundedRect: function(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
};
