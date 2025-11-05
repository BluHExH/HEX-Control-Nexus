# HEX Control Nexus - Java Service Dockerfile

# Use OpenJDK 11 as base image
FROM openjdk:11-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Build the application
RUN apt-get update && \
    apt-get install -y maven && \
    mvn clean package && \
    apt-get remove -y maven && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* /root/.m2

# Create non-root user
RUN useradd --create-home --shell /bin/bash hexuser
USER hexuser

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/java-service-1.0.0.jar"]