# Multi-stage build for Spring Boot backend
FROM maven:3.9.9-amazoncorretto-17 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM amazoncorretto:17

# Install curl for health checks
RUN yum update -y && yum install -y curl && yum clean all

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Environment variables with defaults
ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080
ENV JWT_SECRET=default-secret-change-in-production
ENV CORS_ALLOWED_ORIGINS=http://localhost:3000,https://community-support-system.vercel.app

EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} -jar app.jar"]