#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

rm /home/public/motion/src.*
cp -r $DIR/site/* /home/public/motion/
ls -al /home/public/motion
