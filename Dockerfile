FROM node:bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg motion \ 
    && rm -rf /var/lib/apt/lists/*

ENV LIBVA_DRIVER_NAME=i965
ENV LIBVA_DRIVERS_PATH=/usr/lib/x86_64-linux-gnu/dri

COPY conf /etc/motion
WORKDIR /app

COPY package*.json ./
COPY build ./build

RUN npm ci --omit=dev && npm cache clean --force

EXPOSE 8080

COPY entrypoint.sh ./

RUN useradd --uid 1001 --no-create-home --shell /bin/bash motion2
USER motion2
CMD ["/bin/bash","entrypoint.sh"]