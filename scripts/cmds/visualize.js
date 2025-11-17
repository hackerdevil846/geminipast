const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
 config: {
 name: "visualize",
 aliases: ["vision", "imggen"],
 author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
 version: "1.1",
 cooldowns: 20,
 role: 0,
 shortDescription: "Generate an image based on a prompt.",
 longDescription: "Generates an image using the provided prompt.",
 category: "𝗔𝗜 & 𝗚𝗣𝗧",
 guide: "{p}visualize <prompt>",
 },

 onStart: async function ({ message, args, api, event, usersData }) {
 const prompt = args.join(" ");
 const cost = 5;

 if (!prompt) {
 return api.sendMessage("🦆 | 𝑃𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡!\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: +𝑣𝑖𝑠𝑢𝑎𝑙𝑖𝑧𝑒 𝐴 𝑟𝑜𝑏𝑜𝑡 𝑖𝑛 𝑇𝑜𝑘𝑦𝑜", event.threadID);
 }

 const userData = await usersData.get(event.senderID);
 const current = userData.money || 0;

 if (current < cost) {
 return message.reply(`❌ | 𝑌𝑜𝑢 𝑛𝑒𝑒𝑑 𝑎𝑡 𝑙𝑒𝑎𝑠𝑡 ${cost} 𝑐𝑜𝑖𝑛𝑠.\n💰 𝑌𝑜𝑢𝑟 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${current}`);
 }

 await usersData.set(event.senderID, { money: current - cost });

 message.reply("🌸 𝑇ℎ𝑖𝑠 𝑐𝑜𝑠𝑡 5 𝑐𝑜𝑖𝑛𝑠~\n🎨 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒...");

 try {
 const url = `https://hopelessmahi.onrender.com/api/image?prompt=${encodeURIComponent(prompt)}`;

 const response = await axios.get(url);
 const contentType = response.headers["content-type"];

 const folder = path.join(__dirname, "cache");
 if (!fs.existsSync(folder)) fs.mkdirSync(folder);

 const filePath = path.join(folder, `${Date.now()}_gen.png`);

 if (contentType.includes("application/json")) {
 const data = response.data;
 let imageUrl = "";

 if (typeof data === "string") {
 try {
 const parsed = JSON.parse(data);
 if (parsed.url) imageUrl = parsed.url;
 else if (parsed.image) imageUrl = parsed.image;
 else throw new Error("No image url found");
 } catch {
 throw new Error("Invalid JSON response");
 }
 } else if (typeof data === "object") {
 if (data.url) imageUrl = data.url;
 else if (data.image) imageUrl = data.image;
 else throw new Error("No image url found");
 }

 if (!imageUrl) throw new Error("No image URL or data found in API response");

 if (imageUrl.startsWith("data:image")) {
 const base64Data = imageUrl.split(",")[1];
 fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
 } else {
 const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
 fs.writeFileSync(filePath, Buffer.from(imgRes.data, "binary"));
 }
 } else if (contentType.startsWith("image/")) {
 const imgRes = await axios.get(url, { responseType: "arraybuffer" });
 fs.writeFileSync(filePath, Buffer.from(imgRes.data, "binary"));
 } else {
 throw new Error(`Unexpected content-type: ${contentType}`);
 }

 await message.reply({
 body: `🖼️ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒~\n🎨 𝑃𝑟𝑜𝑚𝑝𝑡: "${prompt}"`,
 attachment: fs.createReadStream(filePath),
 });
 } catch (err) {
 console.error("visualize error:", err.response?.data || err.message || err);
 message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒.");
 }
 },
};
