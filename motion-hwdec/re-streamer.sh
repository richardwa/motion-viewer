#!/bin/bash

feeds=( "rtsp://admin:tAThGG2NAr5vjY5@192.168.1.21/Streaming/Channels/101/" \
"rtsp://rich:9876@192.168.1.163/live" \
"rtsp://rich:9876@192.168.1.190/live")

keepalive(){
        while true; do
        echo $1 $2
        mpv --hwdec=vaapi-copy "$2" --of=v4l2 --o=/dev/video$1 -no-audio 
        sleep 10
        done
}

for ((i=0;i<${#feeds[@]};++i)); do
        pos=$(( $i + 1 ))
        feed=${feeds[$i]}
        keepalive $pos $feed &
done

wait