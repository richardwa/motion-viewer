#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# running as root is required.
export root=/home/motion

mkdir -p $root/camera1
mkdir -p $root/camera2
mkdir -p $root/camera3

cat $DIR/motion_clean.sh | envsubst > /usr/local/bin/motion_clean.sh
chmod 755 /usr/local/bin/motion_clean.sh

cat $DIR/motion.conf | envsubst > /etc/motion/motion.conf 

echo "start_motion_daemon=yes" > /etc/default/motion
cd $DIR
mkdir -p /etc/motion/cameras
for f in cameras/*
do
	echo "Processing $f"
  cat $f | envsubst > /etc/motion/$f 
done
chown -R motion:motion $root
systemctl restart motion
systemctl --no-pager status motion
tail -f /home/motion/motion.log
