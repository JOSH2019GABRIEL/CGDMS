# Build Java backend
FROM maven:3.8.4-openjdk-17 AS backend-builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Build React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /webapp
COPY src/main/webapp/package*.json ./
RUN npm install
COPY src/main/webapp/ ./
RUN npm run build

# Final runtime image
FROM openjdk:17-jdk-alpine
WORKDIR /app

# Copy backend jar
COPY --from=backend-builder /app/target/*.jar app.jar

# Copy frontend build (Spring Boot will serve static files)
COPY --from=frontend-builder /webapp/build ./src/main/resources/static/

# Expose port
EXPOSE 9191

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]