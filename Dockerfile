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
EXPOSE 9191

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
