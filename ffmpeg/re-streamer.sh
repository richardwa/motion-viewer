#!/bin/bash
target=/dev/shm/streams
mkdir -p $target

AUDIO_OPTS="-c:a copy"
VIDEO_OPTS="-c:v copy"
OUTPUT_HLS="-hls_time 10 -hls_list_size 10 -start_number 1 -hls_flags delete_segments"


rm $target/*

feeds=( "rtsp://admin:tAThGG2NAr5vjY5@192.168.1.21/Streaming/Channels/101/" \
"rtsp://rich:9876@192.168.1.163/live" \
"rtsp://rich:9876@192.168.1.190/live")


for ((i=0;i<${#feeds[@]};++i)); do
        pos=$(( $i + 1 ))
        feed=${feeds[$i]}
        echo $pos $feed
        ffmpeg -i "$feed" -y $AUDIO_OPTS $VIDEO_OPTS $OUTPUT_HLS $target/cam${pos}-.m3u8 -hide_banner -loglevel error &
done

wait