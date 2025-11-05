#!/bin/bash

# HEX Control Nexus - Docker Deployment Script

echo "Deploying HEX Control Nexus with Docker..."
echo "========================================="

# Build Docker images
echo "Building Docker images..."
docker-compose build

# Start services
echo "Starting services with docker-compose..."
docker-compose up -d

echo
echo "Deployment completed!"
echo
echo "Services are now running in the background."
echo "Access the dashboard at http://localhost:8000"
echo "Access the Node.js webhook service at http://localhost:3000"
echo "Access the Java service at http://localhost:8080"
echo
echo "To stop services, run: docker-compose down"