# architecture
* motion is only for monitoring doorbell cam. 
    - its output is used are the motion clips that are captured 
    - we are not using motion's re-broadcast

* motion-copy is used to repackage rtsp stream to m3u streams.
    - this is a very light proccess and we are not re-encoding anything
    - the output streams goto /dev/shm so that we do not wear out our SSD

* web site will combine everything together into front end.  
    - check personal/apache for more details on the proxying and serving of m3u files.

