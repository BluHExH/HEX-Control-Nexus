# HEX Control Nexus - Makefile

# Variables
PYTHON := python3
PIP := pip3
NODE := npm
MVN := mvn

# Default target
.PHONY: help
help:
	@echo "HEX Control Nexus - Makefile Commands"
	@echo "======================================"
	@echo "setup          - Install all dependencies"
	@echo "test           - Run all tests"
	@echo "test-python    - Run Python tests"
	@echo "test-node      - Run Node.js tests"
	@echo "lint           - Run code linters"
	@echo "lint-python    - Run Python linters"
	@echo "lint-node      - Run Node.js linters"
	@echo "clean          - Clean build artifacts"
	@echo "docker-build   - Build Docker images"
	@echo "docker-run     - Run services with Docker Compose"
	@echo "docker-stop    - Stop Docker services"
	@echo "run            - Run the system locally"
	@echo "banner         - Print ASCII banner"

# Setup dependencies
.PHONY: setup
setup:
	@echo "Setting up HEX Control Nexus..."
	./scripts/setup.sh

# Run all tests
.PHONY: test
test: test-python test-node

# Run Python tests
.PHONY: test-python
test-python:
	@echo "Running Python tests..."
	$(PYTHON) -m pytest tests/test_web_scraper.py -v
	$(PYTHON) -m pytest tests/test_api_automation.py -v

# Run Node.js tests
.PHONY: test-node
test-node:
	@echo "Running Node.js tests..."
	cd backend/node_webhooks && $(NODE) test

# Run all linters
.PHONY: lint
lint: lint-python lint-node

# Run Python linters
.PHONY: lint-python
lint-python:
	@echo "Running Python linters..."
	$(PIP) install flake8 black isort mypy
	flake8 backend/python_core
	black --check backend/python_core
	isort --check-only backend/python_core
	mypy backend/python_core

# Run Node.js linters
.PHONY: lint-node
lint-node:
	@echo "Running Node.js linters..."
	cd backend/node_webhooks && npx eslint .

# Clean build artifacts
.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	rm -rf logs/*.log
	rm -rf logs/screenshots/*
	rm -rf database/*.db
	rm -rf backend/java_service/target/
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -type d -exec rm -rf {} +

# Build Docker images
.PHONY: docker-build
docker-build:
	@echo "Building Docker images..."
	docker-compose build

# Run services with Docker Compose
.PHONY: docker-run
docker-run:
	@echo "Starting services with Docker Compose..."
	docker-compose up -d

# Stop Docker services
.PHONY: docker-stop
docker-stop:
	@echo "Stopping Docker services..."
	docker-compose down

# Run the system locally
.PHONY: run
run:
	@echo "Running HEX Control Nexus..."
	./scripts/run.sh

# Print ASCII banner
.PHONY: banner
banner:
	cat scripts/banner.txt && echo -e "\e[92mH\e[91mE\e[92mX\e[0m"