# Multi-stage build for Spring Boot backend - Java 17
FROM maven:3.9.9-amazoncorretto-17 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM amazoncorretto:17

RUN yum update -y && yum install -y curl && yum clean all

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY start.sh start.sh
RUN chmod +x start.sh

# Profile — defaults to fly; overridden at runtime by docker-compose or Fly.io env
ARG SPRING_PROFILES_ACTIVE=fly
ENV SPRING_PROFILES_ACTIVE=$SPRING_PROFILES_ACTIVE
ENV JAVA_OPTS="-Xmx400m -Xms200m -XX:+UseG1GC"

EXPOSE 8080

HEALTHCHECK --interval=60s --timeout=10s --start-period=90s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

CMD ["./start.sh"]
