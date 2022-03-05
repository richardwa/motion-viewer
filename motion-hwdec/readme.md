# hardware acceleration notes
* current machine is running braswell intel graphics, this does not have qsv support which is the modern api for video enc/dec
* however mpv player does work (with hw decode) when running in local desktop.  
* mpv --hwdec=vaapi rtsp://rich:9876@192.168.2.190/live (works!)

Since it is using an older api it cannot read the decoded frame back (it can only display on screen). 
* sudo modprobe v4l2loopback
* export LIBVA_DRIVER_NAME=i965
* mpv --hwdec=vaapi rtsp://rich:9876@192.168.2.190/live --of=v4l2 --o=/dev/video0 -no-audio (no hw accerlation)

# test with ffmpeg
ffmpeg -re -i Big_Buck_Bunny_720_10s_1MB.mp4 -f v4l2 /dev/video0  (success, no acceleration)

# success - after installing vdpau-driver-all
mpv --hwdec=vaapi-copy rtsp://rich:9876@192.168.2.190/live --of=v4l2 --o=/dev/video0 -no-audio 
