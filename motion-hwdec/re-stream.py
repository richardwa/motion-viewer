#!/usr/bin/env python3
import multiprocessing
import time
import os
import sys, signal

cmd = "mpv --hwdec=vaapi-copy --hwdec-image-format=yuv420p {} --of=v4l2 --o=/dev/video{} -no-audio --quiet"
# cmd = "sleep 10"

class Process(multiprocessing.Process):
    def __init__(self, id, url):
        super(Process, self).__init__()
        self.id = id
        self.url = url
        self.daemon = True

    def run(self):
        while True:
          print("start {}: {}".format(self.id, self.url))
          os.system(cmd.format(self.url, self.id))
          print("stop  {}: {}".format(self.id, self.url))
          time.sleep(10)


feeds= [
  "rtsp://admin:tAThGG2NAr5vjY5@192.168.1.21/Streaming/Channels/102/",
  "rtsp://rich:9876@192.168.1.163/live",
  "rtsp://rich:9876@192.168.1.190/live"
]

if __name__ == '__main__':
  ps = []

  def signal_handler(signal, frame):
    print("signal handle")
    for p in ps:
      p.kill()

    time.sleep(5)
    sys.exit(0)

  signal.signal(signal.SIGINT, signal_handler)

  for i,feed in enumerate(feeds):
    p = Process(i+1, feed)
    p.start()
    ps.append(p)

  while True:
    time.sleep(5)

