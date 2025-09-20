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



# Build stage: Java backend with frontend debugging
FROM maven:3.8.4-openjdk-17 AS backend-builder
WORKDIR /app

# Copy pom.xml and download dependencies first (for caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source
COPY src ./src

# Debug: Show webapp structure before build
RUN echo "=== Webapp structure ===" && \
    find src/main/webapp/src -name "*.js" -o -name "*.jsx" | head -20 && \
    echo "=== Pages directory ===" && \
    ls -la src/main/webapp/src/pages/ || echo "Pages dir not found" && \
    echo "=== Home directory ===" && \
    ls -la src/main/webapp/src/pages/Home/ || echo "Home dir not found" && \
    echo "=== Components directory ===" && \
    ls -la src/main/webapp/src/components/ || echo "Components dir not found"

# Try manual npm build first to isolate the error
RUN cd src/main/webapp && \
    npm install && \
    npm run build && \
    echo "Frontend build successful" || echo "Frontend build failed"

# Build with Maven
RUN mvn clean package -DskipTests -X

# Runtime image
FROM openjdk:17-jdk-alpine
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built jar from builder
COPY --from=backend-builder /app/target/*.jar app.jar

# Expose port
EXPOSE 9191

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9191/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]