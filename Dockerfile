# Multi-stage build with all services in one container
FROM maven:3.8.4-openjdk-17 AS backend-builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Build React frontend
FROM --platform=linux/amd64 node:18-alpine AS frontend-builder
WORKDIR /app

# Copy package files first
COPY src/main/webapp/package*.json ./
RUN npm ci --silent

# Copy all source files
COPY src/main/webapp/ ./

# Debug: List the directory structure to see what's actually copied
RUN echo "=== Webapp structure ===" && \
    find . -type d -name "pages" -exec find {} -type f \; && \
    echo "=== End structure ==="

# Set build environment variables
ENV CI=false
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=production

# Build with error handling
RUN npm run build

# Final runtime image with PostgreSQL, Java, and React
FROM --platform=linux/amd64 ubuntu:22.04

# Install required packages
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    postgresql \
    postgresql-contrib \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set up PostgreSQL
USER postgres
RUN /etc/init.d/postgresql start && \
    psql --command "CREATE USER postgres WITH SUPERUSER PASSWORD 'admin';" && \
    createdb -O postgres cmgdms

# Switch back to root
USER root

# Create application directory
WORKDIR /app

# Copy backend jar
COPY --from=backend-builder /app/target/*.jar app.jar

# Copy frontend build (serve static files through Spring Boot)
COPY --from=frontend-builder /app/build ./src/main/resources/static/

# Create supervisor configuration
RUN mkdir -p /var/log/supervisor
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root

[program:postgresql]
command=/usr/lib/postgresql/14/bin/postgres -D /var/lib/postgresql/14/main -c config_file=/etc/postgresql/14/main/postgresql.conf
user=postgres
autorestart=true
stdout_logfile=/var/log/supervisor/postgresql.log
stderr_logfile=/var/log/supervisor/postgresql.log

[program:java-app]
command=java -jar /app/app.jar
directory=/app
user=root
autorestart=true
stdout_logfile=/var/log/supervisor/java-app.log
stderr_logfile=/var/log/supervisor/java-app.log
environment=SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/cmgdms",SPRING_DATASOURCE_USERNAME="postgres",SPRING_DATASOURCE_PASSWORD="admin",SPRING_JPA_HIBERNATE_DDL_AUTO="update"
EOF

# Configure PostgreSQL
RUN echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/14/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/14/main/postgresql.conf

# Initialize PostgreSQL data directory
USER postgres
RUN /usr/lib/postgresql/14/bin/initdb -D /var/lib/postgresql/14/main

# Switch back to root
USER root

# Expose ports
EXPOSE 9191 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:9191/actuator/health || exit 1

# Start supervisor to manage all services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]