# Use Java 21 JDK
FROM eclipse-temurin:21-jdk-jammy

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Copy source code
COPY src ./src

# Make mvnw executable
RUN chmod +x mvnw

# Build the JAR inside Docker (skip tests for faster build)
RUN ./mvnw clean package -DskipTests

# Copy the built JAR to a standard location
RUN cp target/*.jar app.jar

# Set Spring Boot port and context path
ENV PORT=8080
ENV SPRING_APPLICATION_NAME=weather-app

# Expose the port
EXPOSE 8080

# Run the Spring Boot JAR
ENTRYPOINT ["sh", "-c", "java -jar app.jar"]
