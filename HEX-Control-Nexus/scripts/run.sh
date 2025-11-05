#!/bin/bash

# HEX Control Nexus - Termux Runner Script
# This script runs the automation system in a loop suitable for Termux

# Print banner
cat scripts/banner.txt
echo
echo "HEX Control Nexus - Multi-Language Automation Hub"
echo "================================================"
echo

# Check if running on Termux
if [ -n "$TERMUX_VERSION" ]; then
    echo "Running on Termux (Android)"
else
    echo "Running on Linux/Unix system"
fi

# Create logs directory if it doesn't exist
mkdir -p logs/screenshots

# Function to handle shutdown gracefully
shutdown() {
    echo
    echo "Received shutdown signal..."
    echo "Stopping HEX Control Nexus..."
    exit 0
}

# Trap SIGINT and SIGTERM
trap shutdown SIGINT SIGTERM

# Main loop
echo "Starting HEX Control Nexus automation loop..."
echo "Press Ctrl+C to stop"

while true; do
    echo
    echo "=== HEX Control Nexus Automation Cycle ==="
    echo "$(date): Running automation tasks..."
    
    # Run Python automation core
    echo "Running Python automation core..."
    python3 backend/python_core/automation.py --once
    
    # Check if Java service should be started
    if [ -f "backend/java_service/pom.xml" ]; then
        echo "Java service available (start with: mvn spring-boot:run)"
    fi
    
    # Check if Node service should be started
    if [ -f "backend/node_webhooks/package.json" ]; then
        echo "Node.js webhook service available (start with: npm start)"
    fi
    
    # Wait before next cycle
    echo
    echo "Waiting 60 seconds before next cycle..."
    sleep 60
done