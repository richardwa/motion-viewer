#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

rm /home/motion/index.*
rm /home/motion/favicon.*

cp -r $DIR/dist/* /home/motion/
ls -al /home/motion

