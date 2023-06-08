# Use a base image with Node.js pre-installed
FROM node:bullseye-slim

# Install FFmpeg dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg motion \ 
    && rm -rf /var/lib/apt/lists/*

COPY conf /etc/motion
WORKDIR /app

COPY package*.json ./
COPY build ./build

RUN npm ci --omit=dev && npm cache clean --force

# Expose the specified port
EXPOSE 8080

COPY entrypoint.sh ./

RUN useradd --no-create-home --shell /bin/bash motion
USER motion
CMD ["/bin/bash","entrypoint.sh"]