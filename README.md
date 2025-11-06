![My image](https://github.com/BluHExH/BluHExH/blob/main/IMG_20251105_223434.png)
<!-- Animated HEX Banner -->
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&pause=1000&color=39FF14&center=true&vCenter=true&width=600&lines=Hacker+Hex;Full+Stack+Developer;Cybersecurity+Enthusiast;Open+Source+Contributor" alt="Typing SVG" />

  <!-- Gradient HEX Name -->
<h1 align="center">
  <img src="https://svg-banners.vercel.app/api?type=glitch&text1=H%20E%20X&width=800&height=200" alt="HEX Banner" />




## 🧩 Local Run (Linux / Termux)

```bash
git clone https://github.com/BluHExH/HEX-Control-Nexus.git
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




##👨‍💻 Developer Notes

Python ≥ 3.10

Node ≥ 18

Java ≥ 11

Recommended editor: VS Code

Test everything locally before committing


##⚖️ Legal & Ethical Usage

> 🔒 Educational Purpose Only
এই প্রজেক্ট কেবলমাত্র শিক্ষা, গবেষণা ও নেটওয়ার্ক অটোমেশন শেখার জন্য।
অবৈধ কাজে ব্যবহার করলে দায় তোমার নিজের।




##🌐 Web Dashboard Example

bash scripts/run.sh --dashboard

> এতে ড্যাশবোর্ড লোকাল সার্ভারে চালু হবে
URL: http://localhost:8080




##📜 License

MIT License
Developed by Hacker Hex ☠️🔪
© 2025 HEX-Control-Nexus 



##🏗️ Build & Setup

কাজ	কমান্ড

📦 প্রজেক্ট বানাও	bash build.sh (অথবা) build hex-control-nexus
🧰 ডিপেনডেন্সি ইনস্টল (Termux/Local)	bash scripts/setup.sh
🐳 Docker setup + build	docker-compose up --build
🔄 Rebuild Docker containers	docker-compose down && docker-compose up --build -d





##🧠 Automation Runner (Python Core)

কাজ	কমান্ড

🎯 নির্দিষ্ট টার্গেট চালাও	python3 backend/python_core/cli.py --target quotes_static --once
⚙️ কনফিগ থেকে চালাও	python3 backend/python_core/cli.py --config config/config.json
🔁 ব্যাকগ্রাউন্ডে রান (Termux Loop)	bash scripts/run.sh
🧪 Dry run (test mode)	python3 backend/python_core/cli.py --target demo --dry-run
🕐 Daemon mode	python3 backend/python_core/cli.py --daemon



##🌍 Web Scraping

কাজ	কমান্ড

🧱 Static scrape (HTML)	python3 backend/python_core/scraper.py --mode static
⚡ Dynamic scrape (Puppeteer)	node backend/node_webhooks/puppeteer_tasks.js
📂 Output CSV/JSON/DB	config অনুযায়ী auto-save হয়
🤖 robots.txt bypass (force)	python3 backend/python_core/scraper.py --force (⚠️ risky)



---

🔁 API Automation

কাজ	কমান্ড

🔗 Run API job	python3 backend/python_core/api_client.py --run
🧩 Java API orchestrator চালাও	mvn spring-boot:run -f backend/java_service/pom.xml
⚡ Async fetch + store	python3 backend/python_core/automation.py --target api_demo



---

🤖 Browser Tasks (Puppeteer)

কাজ	কমান্ড

🚀 Puppeteer run	node backend/node_webhooks/puppeteer_tasks.js
🖼️ Error screenshot folder	logs/screenshots/
🌐 Remote WebDriver fallback	.env এ URL set করে --remote flag দাও



##

📩 Webhook Triggers

কাজ	কমান্ড

🌐 Node Webhook সার্ভার চালাও	node backend/node_webhooks/index.js
🔔 Webhook hit করে task চালাও	curl -X POST http://localhost:3000/webhook -d '{"target":"quotes_static"}'



##

🕐 Scheduling

কাজ	কমান্ড

⏰ Cron job example	0 * * * * bash scripts/run.sh
🔁 Loop run Termux	bash scripts/run.sh
💾 Job resume on restart	Auto handled by SQLite



##

🔔 Notifications

কাজ	কমান্ড

📢 Telegram	.env এ token + chat_id set করো, তারপর run → python3 backend/python_core/notifier.py
✉️ Email	SMTP_SERVER, SMTP_PASS .env-এ add করো
💬 Discord/Slack webhook	node backend/node_webhooks/index.js থেকে ট্রিগার হবে



---

📊 Monitoring & Logs

কাজ	কমান্ড

🔍 Real-time log দেখো	tail -f logs/app.log
💡 Metrics endpoint	http://localhost:8000/metrics
❤️ Health check	http://localhost:8000/health



---

🧠 Testing & CI

কাজ	কমান্ড

🧪 Python test	pytest tests/test_web_scraper.py
⚙️ Node test	npm test --prefix backend/node_webhooks
🚀 Run all test	make test
🔄 GitHub CI auto-run	.github/workflows/ci.yml auto executes tests



##

🐳 Docker Services

সার্ভিস	কাজ

python-core	Web scraping, API automation
java-service	API orchestrator
node-service	Webhooks, Puppeteer tasks
sqlite-db	Storage
selenium (optional)	Browser automation support



##

🧩 Developer Tools

কাজ	কমান্ড

🧼 Code format	black . && isort .
🔍 Type check	mypy backend/python_core
🚀 Lint	flake8 এবং eslint
🧰 Install all tools	pip install -r requirements.txt && npm install




##⚖️ Legal & Ethical Use

> ⚠️ Always check robots.txt before scraping.
❌ Never collect personal/sensitive data.
🧾 See LEGAL.md for full terms.




##

💻 Quick Start Summary

# 🐳 Docker Run
docker-compose up --build

# 🧠 Local Dev
bash scripts/setup.sh && python3 backend/python_core/automation.py --once --target demo

# 📱 Termux Run
bash scripts/run.sh

