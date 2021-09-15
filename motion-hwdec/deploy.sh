#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

rsync -av $DIR/etc/ /etc
rsync -av $DIR/re-stream.py /home/decoder/

systemctl start re-stream
systemctl enable re-stream
