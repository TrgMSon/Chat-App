# ===== Build stage =====
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom trước để cache dependency
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY . .

# Build project
RUN mvn clean package -DskipTests

# ===== Run stage =====
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy file jar
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
