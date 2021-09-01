#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# running as root is required.

export user=public
root=/home/$user/motion

mkdir -p $root/camera1
mkdir -p $root/camera2
mkdir -p $root/camera3
chown -R motion:$user $root

cat $DIR/clean.sh | envsubst > /usr/local/bin/clean.sh
cat $DIR/motion.conf | envsubst > /etc/motion/motion.conf 

echo "start_motion_daemon=yes" > /etc/default/motion
cd $DIR
for f in *.conf
do
	echo "Processing $f"
  cat $f | envsubst > /etc/motion/$f 
done

systemctl restart motion
systemctl --no-pager status motion
journalctl -u motion -f
