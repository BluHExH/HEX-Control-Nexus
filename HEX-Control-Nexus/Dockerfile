# HEX Control Nexus - Multi-Stage Dockerfile

# Base Python image
FROM python:3.9-slim as python-base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Python Core Stage
FROM python-base as python-core

# Copy source code
COPY backend/python_core ./backend/python_core
COPY config ./config
COPY scripts ./scripts

# Create necessary directories
RUN mkdir -p logs/screenshots database

# Create non-root user
RUN useradd --create-home --shell /bin/bash hexuser
USER hexuser

# Expose port
EXPOSE 5000

# Command to run Python core
CMD ["python", "backend/python_core/automation.py", "--daemon"]


# Node.js Webhooks Stage
FROM node:16-alpine as node-webhooks

# Install system dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/node_webhooks/package*.json ./backend/node_webhooks/

# Install Node.js dependencies
WORKDIR /app/backend/node_webhooks
RUN npm ci --only=production

# Copy source code
COPY backend/node_webhooks ./backend/node_webhooks

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S hexuser -u 1001
USER hexuser

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Expose port
EXPOSE 3000

# Command to run Node.js webhooks
CMD ["node", "index.js"]


# Web Dashboard Stage
FROM nginx:alpine as web-dashboard

# Copy web dashboard files
COPY web_dashboard /usr/share/nginx/html

# Expose port
EXPOSE 80

# Nginx runs automatically


# Java Service Dockerfile (separate file in backend/java_service)
# This is just for reference - the Java service will have its own Dockerfile