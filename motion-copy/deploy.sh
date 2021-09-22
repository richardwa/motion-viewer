#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cp $DIR/stream-copy.service /etc/systemd/system/
cp $DIR/stream-copy.py /usr/bin/
mkdir -p /dev/shm/streams
chown public:public /dev/shm/streams

systemctl enable stream-copy
systemctl restart stream-copy
systemctl status stream-copy
