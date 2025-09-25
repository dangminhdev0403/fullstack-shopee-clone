FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy file JAR đã build sẵn
COPY target/shopee-0.0.1-SNAPSHOT.jar app.jar

ENV TZ=Asia/Ho_Chi_Minh


# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
