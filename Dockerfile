FROM node:18-alpine AS builder

COPY . .

RUN set -eux; \
    yarn install; \
    yarn build; \
    mkdir build; \
    mv dist bin node_modules build/

FROM node:18-alpine
LABEL org.opencontainers.image.vendor="matchory"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Moritz Friedrich <moritz@matchory.com>"
LABEL org.opencontainers.image.source="https://github.com/matchory/hetzner-cloud-prometheus-sd"
LABEL org.opencontainers.image.documentation="https://github.com/matchory/hetzner-cloud-prometheus-sd#readme"
LABEL org.opencontainers.image.title="Hetzner Cloud Service Discovery for Prometheus"
LABEL org.opencontainers.image.description="A simple web server exposing Hetzner cloud instances for consumption by the Prometheus HTTP service discovery."

WORKDIR /app
COPY --from=builder ./build .
ENTRYPOINT ["./bin/hetzner-sd.mjs"]
