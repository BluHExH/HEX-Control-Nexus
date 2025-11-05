![My image](https://github.com/BluHExH/BluHExH/blob/main/IMG_20251105_223434.png)
<!-- Animated HEX Banner -->
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&pause=1000&color=39FF14&center=true&vCenter=true&width=600&lines=Hacker+Hex;Full+Stack+Developer;Cybersecurity+Enthusiast;Open+Source+Contributor" alt="Typing SVG" />

  <!-- Gradient HEX Name -->
<h1 align="center">
  <img src="https://svg-banners.vercel.app/api?type=glitch&text1=H%20E%20X&width=800&height=200" alt="HEX Banner" />




## 🧩 Local Run (Linux / Termux)

```bash
git clone https://github.com/yourname/HEX-Control-Nexus.git
cd HEX-Control-Nexus
python3 backend/python_core/automation.py



##📱 Termux-Friendly Run

pkg update && pkg upgrade -y
pkg install python nodejs git -y
pip install requests beautifulsoup4
npm install express
bash scripts/run.sh




##🧠 Banner (Termux Display)

echo -e "\e[92mH\e[91mE\e[92mX\e[0m Control Nexus"

> দেখতেই বোঝা যাবে এটি তোমার HEX System চলছে ⚡






##⚙️ Configuration Guide

ফাইল: config/config.json

{
  "mode": "development",
  "auto_restart": true,
  "notifications": {
    "email": false,
    "telegram": true
  }
}




##🧾 Key Notes

ডেটাবেজ SQLite (local)

Logs logs/ ফোল্ডারে থাকবে

Webhooks ডিফল্টভাবে 3000 পোর্টে চলে

সব সার্ভিস নিজস্ব config ফাইল পড়ে রান করে





##🧰 CLI Usage

python3 backend/python_core/automation.py --run --verbose




##🚩 Flag Description

Flag	Description

--run	মেইন automation চালাবে
--verbose	ডিটেইল লগ দেখাবে
--reset-db	লোকাল ডেটাবেজ রিসেট করবে
--no-banner	ব্যানার অফ করবে





##⚙️ Components Overview

Component	Language	Function

Python Core	Python	Task automation & scrapers
Node Webhooks	Node.js	API triggers & events
Java Service	Java	Background logic module
Web Dashboard	HTML/JS	Visualization
Config	JSON	Runtime settings





##🔔 Notifications Setup

Telegram

Token যোগ করো config/config.json ফাইলে

Example:


{ "telegram_token": "YOUR_BOT_TOKEN" }

Email (optional)

SMTP support later যোগ করা যাবে




##📊 Monitoring & Metrics

Logs: logs/hex_core.log

Uptime: scripts/monitor.sh

Restart policy: auto_restart: true





##♻️ Persistence & Restart Safety

সব process background-এ চলে

Restart হলে automation আবার resume করবে

Database crash-protected





##🪵 Logging

tail -f logs/hex_core.log




##🧪 Testing

Node Tests

cd backend/node_webhooks
npm test

Python Tests

pytest tests/python_test.py




##🚀 Run All (CI)

bash scripts/run.sh --ci




##🔄 Continuous Integration (GitHub Actions)

.github/workflows/ci.yml

name: HEX CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: bash scripts/run.sh --ci




##🐳 Docker Services (docker-compose.yml)

version: "3.9"
services:
  python_core:
    build: ./backend/python_core
    command: python automation.py
  node_webhooks:
    build: ./backend/node_webhooks
    ports:
      - "3000:3000"

