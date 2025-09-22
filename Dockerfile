# Build stage: Java backend only (using pre-built frontend)
FROM maven:3.8.4-openjdk-17 AS backend-builder
WORKDIR /app

# Set Maven options for better memory management
ENV MAVEN_OPTS="-Xmx2048m -XX:MaxMetaspaceSize=512m"

# Copy pom.xml and download dependencies first (for caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy Java source only (excluding webapp to skip frontend build)
COPY src/main/java ./src/main/java
COPY src/main/resources ./src/main/resources

# Copy pre-built frontend assets from target/classes/static
COPY target/classes/static ./src/main/resources/static

# Build only the backend (skip frontend maven plugin)
RUN mvn clean package -DskipTests -Dmaven.test.skip=true -Dfrontend.skip=true

# Runtime image optimized for Render
FROM openjdk:17-jdk-alpine
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copy built jar from builder
COPY --from=backend-builder /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port (Render will map PORT environment variable)
EXPOSE 8080

# Health check for Render monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Set JVM options optimized for containerized environment
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Run application with prod profile and optimized JVM settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --spring.profiles.active=prod"]



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
