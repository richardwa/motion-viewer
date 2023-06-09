#!/bin/bash

for file in /app/captures/doorbell/*.mp4; do
  thumbnail="${file}.jpg"  # Output thumbnail filename

  if [[ -f "$file" && ! -f "$thumbnail" ]]; then

    ffmpeg -i "$file" -vf "scale=320:-1" -ss 00:00:05 -vframes 1 "$thumbnail"

    echo "Generated thumbnail for $file"
  fi
done