# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy toàn bộ code vào
COPY . .

# Build ra file JAR (bỏ qua test để nhanh hơn)
RUN mvn clean package -DskipTests

# Stage 2: Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# SỬA LỖI TẠI ĐÂY: Sử dụng dấu * để tự động lấy file JAR trong thư mục target
# Cách này giúp tránh lỗi gõ sai tên file hoặc sai version (0.0.1-SNAPSHOT)
COPY --from=build /app/target/*.jar app.jar

# Kiểm tra xem file đã được copy vào chưa (Dòng này để debug)
RUN ls -l /app

EXPOSE 8080

# Chạy ứng dụng bằng tên file đã được đổi thành app.jar cho ngắn gọn
ENTRYPOINT ["java", "-jar", "app.jar"]
