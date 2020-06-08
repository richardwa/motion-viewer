#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

INSTALL_LOCATION=/etc/garage-status
LOG=/var/log/garage-status.log

rm -rf $INSTALL_LOCATION
cp -r "$DIR" $INSTALL_LOCATION

cat <<EOF > /etc/cron.d/garage-status
# check every minute
* * * * * root $INSTALL_LOCATION/check-status.sh $LOG >> $LOG 2>&1
EOF

service cron reload

tail -f $LOG