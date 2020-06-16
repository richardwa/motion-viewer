#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# pass in logfile name
LOG=$1

# log timestamp
date +"%Y-%m %T"

# Generate code at http://www.barcode-generator.org/
# qrcode, data: A

# get reference image
# curl -s http://localhost/streams/2/current |  convert jpeg:- -crop 150x150+220+310 -colorspace gray +dither -colors 2 -normalize reference.jpg


# diff with reference
DIFF=$(curl -s http://localhost/streams/2/current |\
    convert jpeg:- -crop 150x150+220+310 -colorspace gray +dither -colors 2 -normalize "$DIR/reference.jpg"  \
        -compose difference -composite -colorspace gray -format '%[fx:mean*100]' info:)

DIFF_INT=$(printf "%.0f" $DIFF)
echo diff: $DIFF_INT

if [ $DIFF_INT -lt 10 ]; then
    echo "STATUS:closed" 
else
    echo "STATUS:open"
    NUM_CLOSED=$(tac $LOG | grep "STATUS:" | head -n 5 | wc -l)

    # to avoid false notice, only send notice if there were no success in last N runs
    if [ "$NUM_CLOSED" == "0" ]; then
        echo "send notice"
        #$DIR/notify.sh
    fi
fi

# make sure status is on second to last line
echo ""
