![My image](https://github.com/BluHExH/BluHExH/blob/main/IMG_20251105_223434.png)
<!-- Animated HEX Banner -->
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&pause=1000&color=39FF14&center=true&vCenter=true&width=600&lines=Hacker+Hex;Full+Stack+Developer;Cybersecurity+Enthusiast;Open+Source+Contributor" alt="Typing SVG" />

  <!-- Gradient HEX Name -->
<h1 align="center">
  <img src="https://svg-banners.vercel.app/api?type=glitch&text1=H%20E%20X&width=800&height=200" alt="HEX Banner" />



🤖 HEX Control Nexus — Multi-Language Automation Hub

⚠️ ETHICAL AND LEGAL WARNING:

This project (HEX-Control-Nexus) is an advanced multi-language automation hub. Use responsibly — always check robots.txt and site terms. Do not collect personal/sensitive data.

ব্যবহারের সতর্কতা: এই টুলটি অত্যন্ত শক্তিশালী। দায়িত্বশীলতার সাথে ব্যবহার করুন। সবসময় robots.txt এবং ওয়েবসাইটের শর্তাবলী পরীক্ষা করুন। অনুমতি ছাড়া ব্যক্তিগত বা সংবেদনশীল ডেটা সংগ্রহ করবেন না।

🚀 Quickstart (Docker Recommended)

The fastest way to get the entire system running is using Docker Compose.

Environment

Command

Notes

Docker Start

docker-compose up --build

Builds and runs all services (Python, Java, Node, DB). Use -d for detached mode.

Local Dev Setup

./scripts/setup.sh

Installs Python/Node dependencies and sets up environment.

Local Run (Python)

python3 backend/python_core/automation.py --once --target quotes_static

Runs a single target task defined in config/config.json.

Termux Runner

bash scripts/run.sh

Interactive Termux CLI runner.

📂 Project Overview

HEX-Control-Nexus is designed for robust, scalable, and resilient automation, leveraging the strengths of multiple programming languages.

⚙️ Local Setup and Installation

1. Prerequisites

You need: Git, Python 3.10+, Node.js 18+, Java Development Kit (JDK) 17+, Docker.

2. Initial Setup Script

# Clone the repository and navigate into it
# git clone <your-repo-url> HEX-Control-Nexus
cd HEX-Control-Nexus
./scripts/setup.sh


3. Configuration & Secrets

All sensitive information must be stored in the .env file.

Copy the example and edit:

cp .env.example .env


Edit .env to fill in your secrets (e.g., Telegram tokens).

💻 CLI Usage (Python Core)

The main control point for running tasks is the Python CLI at backend/python_core/automation.py.

# Run a specific target once
python3 backend/python_core/automation.py run --once --target quotes_static

# Run all targets in daemon mode (scheduled loop)
python3 backend/python_core/automation.py run --daemon --all

# Export data from a table
python3 backend/python_core/automation.py export --table quotes_data --format csv --output-file data/quotes_export.csv


🌐 Adding New Targets

Targets are defined in the configuration files:

config/config.json: Web scraping targets.

config/endpoints.yaml: API targets.

config/schedule.yaml: Task scheduling.

🧪 Testing & Quality

To run all unit tests for Python and Node.js:

make test


The CI workflow in .github/workflows/ci.yml enforces quality checks.

💻 Termux Runner Notes

Run the interactive Termux script: bash scripts/run.sh
The custom ASCII banner can be viewed with: cat scripts/banner.txt
