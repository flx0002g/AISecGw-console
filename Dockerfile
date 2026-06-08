# Multi-stage build for WntASG Console
# Stage 1: Build backend (includes frontend build via frontend-maven-plugin)
FROM docker.m.daocloud.io/library/eclipse-temurin:21-jdk AS builder

WORKDIR /build

# Copy maven wrapper and pom files first for better caching
COPY backend/mvnw .
COPY backend/.mvn .mvn/
COPY backend/pom.xml .
COPY backend/sdk/pom.xml sdk/pom.xml
COPY backend/console/pom.xml console/pom.xml

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -Dmaven.test.skip=true -Dpmd.skip=true -Dcheckstyle.skip=true -Dgpg.sign.skip=true -Denforcer.skip=true -Dlombok.delombok.skip=true -Dmaven.javadoc.skip=true -Dmaven.source.skip=true 2>&1 || true

# Copy all source code
COPY backend/ .
COPY frontend/ ../frontend/

# Build the project (skip git-commit-id plugin since no .git in Docker context)
RUN ./mvnw clean package -Dmaven.test.skip=true -Dpmd.skip=true -Dcheckstyle.skip=true -Dgpg.sign.skip=true -Denforcer.skip=true -Dlombok.delombok.skip=true -Dmaven.javadoc.skip=true -Dmaven.source.skip=true -Dapp.build.dev=false

# Stage 2: Runtime image
FROM docker.m.daocloud.io/library/eclipse-temurin:21-jre

LABEL maintainer="WntASG Team"
LABEL description="WntASG Console - Security Gateway Management"
LABEL version="0.0.1-SNAPSHOT"
LABEL product="WntASG"

WORKDIR /app

COPY --from=builder /build/console/target/higress-console.jar /app/higress-console.jar
COPY backend/start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV JAVA_OPTS="-Xms512m -Xmx2g"
ENV SERVER_PORT=8080

EXPOSE 8080

ENTRYPOINT ["/app/start.sh"]
