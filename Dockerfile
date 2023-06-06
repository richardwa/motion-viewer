# Use a base image with Node.js pre-installed
FROM node:bullseye-slim

# Install FFmpeg dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY build ./build

RUN npm ci --omit=dev && npm cache clean --force

# Expose the specified port
EXPOSE 8080

CMD ["node","./build/server/main.js", "8080"]