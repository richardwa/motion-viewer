#!/bin/bash
if [ "$1" == "" ]; then
  echo "provide directory to clean"
fi
find $1 /home/public/motion/camera3 -name '*.mkv' -mtime +10 -exec rm -f {} \;