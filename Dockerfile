## Build stage: Java backend (includes frontend build inside jar)
#FROM maven:3.8.4-openjdk-17 AS backend-builder
#WORKDIR /app
#
## Copy pom.xml and download dependencies first (for caching)
#COPY pom.xml .
#RUN mvn dependency:go-offline
#
## Copy source and build
#COPY src ./src
#RUN mvn clean package -DskipTests
#
## Runtime image
#FROM openjdk:17-jdk-alpine
#WORKDIR /app
#
## Copy built jar from builder
#COPY --from=backend-builder /app/target/*.jar app.jar
#
## Expose port
#EXPOSE 9191
#
## Run application
#ENTRYPOINT ["java", "-jar", "app.jar"]

# Dockerfile with PostgreSQL and Java 17 to run JAR file
FROM ubuntu:22.04

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

# Set working directory
WORKDIR /app

# Copy the JAR file from target folder
COPY target/CGDMS-0.0.1-SNAPSHOT.jar app.jar

# Create supervisor configuration to manage both services
RUN mkdir -p /var/log/supervisor
RUN echo '[supervisord]\n\
nodaemon=true\n\
user=root\n\
\n\
[program:postgresql]\n\
command=/usr/lib/postgresql/14/bin/postgres -D /var/lib/postgresql/14/main -c config_file=/etc/postgresql/14/main/postgresql.conf\n\
user=postgres\n\
autorestart=true\n\
stdout_logfile=/var/log/supervisor/postgresql.log\n\
stderr_logfile=/var/log/supervisor/postgresql.log\n\
\n\
[program:spring-app]\n\
command=java -jar /app/app.jar\n\
directory=/app\n\
user=root\n\
autorestart=true\n\
stdout_logfile=/var/log/supervisor/spring-app.log\n\
stderr_logfile=/var/log/supervisor/spring-app.log\n\
environment=SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/cmgdms",SPRING_DATASOURCE_USERNAME="postgres",SPRING_DATASOURCE_PASSWORD="admin"' > /etc/supervisor/conf.d/supervisord.conf

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
    CMD curl -f http://localhost:9191/api/v1/actuator/health || exit 1

# Start supervisor to manage both PostgreSQL and Spring Boot
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]