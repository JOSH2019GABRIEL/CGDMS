# Build stage: Java backend (includes frontend build inside jar)
FROM maven:3.8.4-openjdk-17 AS backend-builder
WORKDIR /app

# Copy pom.xml and download dependencies first (for caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime image
FROM openjdk:17-jdk-alpine
WORKDIR /app

# Copy built jar from builder
COPY --from=backend-builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run application with prod profile
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]



## Production Dockerfile for Render deployment with external PostgreSQL
#FROM openjdk:17-jdk-alpine
#
## Install curl for health checks
#RUN apk add --no-cache curl
#
## Create application directory
#WORKDIR /app
#
## Create non-root user for security
#RUN addgroup -g 1001 -S appgroup && \
#    adduser -S appuser -u 1001 -G appgroup
#
## Copy the JAR file from target folder
#COPY target/CGDMS-0.0.1-SNAPSHOT.jar app.jar
#
## Change ownership to non-root user
#RUN chown -R appuser:appgroup /app
#
## Switch to non-root user
#USER appuser
#
## Expose port 8080 (Render will map this to public port)
#EXPOSE 8080
#
## Health check for Render monitoring
#HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
#    CMD curl -f http://localhost:8080/api/v1/actuator/health || exit 1
#
## Set JVM options optimized for containerized environment
#ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom -Dspring.profiles.active=prod"
#
## Run the JAR file with optimized JVM settings
##ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
#ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
