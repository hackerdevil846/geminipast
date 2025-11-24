<h1 align="center">Facebook Messenger Bot</h1>

<p align="center">
  <img src="https://files.catbox.moe/e7bozl.jpg" alt="Facebook Messenger Bot Screenshot" width="500">
</p>

<p align="center">
  A modular, fast and customizable Facebook Messenger chatbot based on Node.js. Run it 24/7 on Render or GitHub with ease.
</p>

---
## 👑 Author Info

- 👤 Name: Asif Mahmud (Jāmāi)
- 🎂 Age: 18+
- 🌍 From: Chandpur, Bangladesh
- 🏠 Living: Dania, Dhaka 1236
- 📘 Facebook: [Asif Mahmud](https://www.facebook.com/share/15yVioQQyq/)
- 📱 WhatsApp: [+8801586400590](wa.me/+8801586400590)
- 📧 Email: mrsmokey232@gmail.com
- 💻 GitHub: [devilhacker523](https://github.com/devilhacker523)
- 🧠 “Every scar tells a story. Mine scream that I refused to back down.” — Asif

---

## ⚙️ Features

- 📩 Auto-reply, command handler, event system
- 📤 Media upload/download support
- 🎮 Games, tools, anime, APIs
- 🧩 Modular command system (GoatBot-style)
- ☁️ Deploy on **Render** or **GitHub Actions**

---

## 🚀 Deploy to Render (24/7 Bot Hosting)

### 🪜 Steps:

1. ✅ Fork this repo on GitHub
2. 🌐 Go to [https://render.com](https://render.com)
3. ➕ Create a **Web Service**
4. Select your GitHub repo
5. Configure like this:

   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Runtime:** Node 18+

7. ✅ Deploy & your bot will run 24/7 on Messenger

---

## 🔄 Run with GitHub Actions

> Great for testing; not recommended for long 24/7 use.

### 📁 .github/workflows/goatbot.yml

```yaml

name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm install
    - run: npm start
    - run: npm test

```

➡️ Go to **Actions > GoatBot Messenger > Run Workflow** to start.

---

## 💻 Local Installation (Optional)

```bash
git clone https://github.com/devilhacker523/ATOMIC
cd ATOMIC
npm install
node index.js
```

---

## 📺 Setup Video

🎥 Watch the full deploy tutorial on YouTube:  
**Link:** [sorry I don't have yt channel](dont have )

_(Replace `YOUR_VIDEO_ID` with your real video link)_

---

## ⚠️ Warning

- Never push `appstate.json` or `.env` with passwords in public
- Create an **App Password** from Facebook if normal login fails
- Use responsibly — this is for **educational purposes** only

---

## ⭐ Show Support

If this project helped you:
- 🌟 Star the repo
- 🗣️ Share with friends
- 📩 Join the GoatBot community

---
