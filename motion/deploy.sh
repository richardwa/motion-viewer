#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

root=/home/public/motion

sudo mkdir -p $root/camera1
sudo mkdir -p $root/camera2
sudo chown -R motion:public $root

echo "start_motion_daemon=yes" | sudo tee /etc/default/motion
sudo cp $DIR/*.conf /etc/motion/

sudo systemctl restart motion
systemctl --no-pager status motion

tail -f /home/public/motion/motion.log
