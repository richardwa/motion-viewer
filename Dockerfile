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

RUN id -u motion2 >/dev/null 2>&1 || \ 
    (groupadd --gid 1001 motion2 && \
    useradd --uid 1001 --gid 1001 --no-create-home --shell /bin/bash motion2)
USER motion2
CMD ["/bin/bash","entrypoint.sh"]