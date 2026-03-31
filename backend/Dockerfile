FROM docker.m.daocloud.io/library/eclipse-temurin:21-jdk

LABEL maintainer="WntASG Team"
LABEL description="WntASG Console - Security Gateway Management"
LABEL version="0.0.1-SNAPSHOT"
LABEL product="WntASG"

WORKDIR /app

COPY console/target/higress-console.jar /app/higress-console.jar
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV JAVA_OPTS="-Xms512m -Xmx2g"
ENV SERVER_PORT=8080

EXPOSE 8080

ENTRYPOINT ["/app/start.sh"]
