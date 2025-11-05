# HEX Control Nexus 🔗

## Multi-Language Automation Hub

```
██╗  ██╗███████╗██╗  ██╗    ███████╗███╗   ██╗██╗  ██╗███████╗
██║  ██║██╔════╝╚██╗██╔╝    ██╔════╝████╗  ██║██║ ██╔╝██╔════╝
███████║█████╗   ╚███╔╝     █████╗  ██╔██╗ ██║█████╔╝ █████╗  
██╔══██║██╔══╝   ██╔██╗     ██╔══╝  ██║╚██╗██║██╔═██╗ ██╔══╝  
██║  ██║███████╗██╔╝ ██╗    ███████╗██║ ╚████║██║  ██╗███████╗
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝

HEX Control Nexus — Multi-Language Automation Hub
```

> **Ethics Reminder**: Use responsibly. Always check `robots.txt` and website terms. Do not collect personal or sensitive data without permission.

---

## 📋 Project Overview

**HEX Control Nexus** is an advanced multi-language automation hub designed for web scraping, API automation, browser automation, and webhook management. Built with a focus on ethical use and compliance, this system integrates Python, Java, and Node.js components to provide a comprehensive automation solution.

### 🔧 Key Features

- **Web Scraping**: Static (requests/BeautifulSoup) and dynamic (Puppeteer) scraping with robots.txt compliance
- **API Automation**: Async HTTP client with retry logic and circuit breaker pattern
- **Browser Automation**: Puppeteer tasks with screenshot capabilities
- **Webhooks**: Node.js webhook listener with job queue management
- **Scheduler**: CLI interface with daemon mode and configurable targets
- **Notifications**: Telegram, email, Slack/Discord support
- **Monitoring**: Structured JSON logging, real-time dashboard, health/metrics endpoints
- **Security**: Environment-based secrets management, graceful shutdown, retry policies

---

## 🚀 Quick Start

### Docker Deployment (Recommended)

```bash
docker-compose up --build
```

### Local Development

```bash
./scripts/setup.sh && python3 backend/python_core/automation.py --once --target demo
```

### Termux Environment

```bash
bash scripts/run.sh
```

---

## 📁 Project Structure

```
HEX-Control-Nexus/
├── backend/
│   ├── python_core/
│   ├── java_service/
│   └── node_webhooks/
├── web_dashboard/
├── config/
├── database/
├── scripts/
├── tests/
├── Dockerfile
└── docker-compose.yml
```

---

## 🛠️ Language → Component Mapping

- **Python** (`backend/python_core`): Core automation, scrapers, notifier, SQLite access
- **Java** (`backend/java_service`): Spring Boot microservice with REST endpoints
- **Node.js** (`backend/node_webhooks`): Webhook listener, Puppeteer browser tasks
- **HTML/CSS/JS** (`web_dashboard`): Frontend dashboard with WebSocket for real-time logs
- **JSON/YAML** (`config`): All target definitions, selectors, endpoints, schedules
- **Bash** (`scripts`): Setup, run, and deployment scripts
- **SQLite** (`database`): Local storage for logs, job state, scraped data
- **Docker** (`Dockerfile`/`docker-compose.yml`): Containerization for all services

---

## 📖 Documentation

### Configuration

The system is configured through JSON and YAML files in the `config/` directory:

- `config.json`: Main configuration with scraping targets
- `endpoints.yaml`: API endpoints and scheduling
- `schedule.yaml`: Task scheduling configuration

### CLI Usage

```bash
python backend/python_core/automation.py [OPTIONS]

Options:
  --target TEXT     Run specific target
  --config TEXT     Config file path
  --once            Run once and exit
  --daemon          Run in daemon mode
  --dry-run         Dry run without actually scraping
  --export TEXT     Export format (csv, jsonl, sqlite)
```

### Environment Variables

Copy `.env.example` to `.env` and configure your credentials:

```bash
cp .env.example .env
# Edit .env with your credentials
```

---

## 🔒 Legal & Compliance

This system includes built-in compliance features:

- **robots.txt checking** by default (override with `--force`)
- **Data privacy considerations** and personal data handling guidelines
- **Terms of service compliance** framework
- **Acceptable use policies** documented in `LEGAL.md`

---

## 🧪 Testing

Run all tests:

```bash
make test
```

Or run specific test suites:

```bash
make test-python
make test-node
```

---

## 📦 Deployment Options

1. **Docker** (recommended): `docker-compose up --build`
2. **Local development**: `./scripts/setup.sh && python3 backend/python_core/automation.py --once --target demo`
3. **Termux environment**: `bash scripts/run.sh`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped develop this automation hub
- Inspired by ethical web scraping and automation best practices

---

*Use responsibly. Always check robots.txt and website terms. Do not collect personal or sensitive data without permission.*