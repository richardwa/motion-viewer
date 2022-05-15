# architecture
* motion is only for monitoring doorbell cam. 
    - its output is used are the motion clips that are captured 
    - we are not using motion's re-broadcast

* motion-copy is used to repackage rtsp stream to m3u streams.
    - this is a very light proccess and we are not re-encoding anything
    - the output streams goto /dev/shm so that we do not wear out our SSD

* web site will combine everything together into front end.  
    - check personal/apache for more details on the proxying and serving of m3u files.

# troubleshooting
* check streams using vlc
    - rtsp://admin:tAThGG2NAr5vjY5@192.168.2.21/Streaming/Channels/101/
    - http://pluto/streams2/cam1-.m3u8
    - rtsp://rich:9876@192.168.2.163/live
    - http://pluto/streams2/cam2-.m3u8
    - rtsp://rich:9876@192.168.2.190/live
    - http://pluto/streams2/cam3-.m3u8

* check logs
    - journalctl -u stream-copy --since "1 day ago"
    - journalctl -u motion --since "1 day ago"