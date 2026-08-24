FROM docker.m.daocloud.io/library/eclipse-temurin:21-jdk
# NOTE: base image via daocloud mirror (CN registry access); upstream uses docker.io directly.

RUN apt-get update && apt-get install -y \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY console/target/higress-console.jar /app
COPY start.sh /app

ARG TARGETARCH
COPY tools/mcp/${TARGETARCH}/main /app/tools/mcp/
COPY tools/mcp/openapiToMcpserver.sh /app/tools/mcp/
RUN chmod +x /app/tools/mcp/openapiToMcpserver.sh \
    && chmod +x /app/tools/mcp/main

EXPOSE 8080
CMD ["/app/start.sh"]