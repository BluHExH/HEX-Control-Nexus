#!/bin/bash

# HEX Control Nexus Setup Script

echo "Setting up HEX Control Nexus..."

# Create necessary directories
mkdir -p logs/screenshots database

# Print banner
cat scripts/banner.txt

# Setup Python environment
echo "Setting up Python environment..."
if command -v python3 &> /dev/null; then
    python3 -m pip install --upgrade pip
    python3 -m pip install -r requirements.txt
    echo "Python dependencies installed successfully"
else
    echo "Python 3 not found. Please install Python 3 and try again."
    exit 1
fi

# Setup Node.js environment
echo "Setting up Node.js environment..."
if command -v npm &> /dev/null; then
    cd backend/node_webhooks
    npm install
    cd ../..
    echo "Node.js dependencies installed successfully"
else
    echo "npm not found. Please install Node.js and npm and try again."
    exit 1
fi

# Initialize database
echo "Initializing database..."
touch database/hex_data.db
echo "Database initialized"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file from example. Please update with your credentials."
fi

echo -e "\n\033[1;32mSetup completed successfully!\033[0m"
echo -e "\033[1;36mNext steps:\033[0m"
echo "1. Update .env with your credentials"
echo "2. Run './scripts/run.sh' to start all services"
echo "3. Access dashboard at http://localhost:8000"