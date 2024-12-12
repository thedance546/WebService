FROM openjdk:17-jdk

# JAR 파일 경로를 ARG로 설정
ARG JAR_FILE=build/libs/*.jar

# JAR 파일과 application.yaml 파일을 컨테이너로 복사
COPY ${JAR_FILE} app.jar
COPY src/main/resources/application.yaml /app/resources/application.yaml

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app.jar"]
