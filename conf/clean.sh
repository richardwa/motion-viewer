#!/bin/bash

if [ "$1" == "" ]; then
  echo "provide directory to clean"
fi
if [ "$2" == "" ]; then
  echo "provide new file"
fi

# clean up files older than 30 days
find $1 -mtime +10 -exec rm -f {} \;

# create thumbnail
ffmpeg -i "$2" -vf "scale=320:-1" -ss 00:00:05 -vframes 1 "$2.jpg"