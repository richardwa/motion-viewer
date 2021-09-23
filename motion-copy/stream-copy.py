#!/usr/bin/env python3
import multiprocessing
import time
import os
import sys, signal

target= "/dev/shm/streams"
cmd = "".join([
  "ffmpeg -i {} -y -c:a copy -c:v copy ",
  "-hls_time 2 -hls_list_size 10 -start_number 1 -hls_flags delete_segments ",
  target,"/cam{}-.m3u8 -hide_banner -loglevel error"
])

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


feed= {
  1: "rtsp://admin:tAThGG2NAr5vjY5@192.168.1.21/Streaming/Channels/101/",
  2: "rtsp://rich:9876@192.168.1.163/live",
  3: "rtsp://rich:9876@192.168.1.190/live"
}

if __name__ == '__main__':
  ps = []

  def signal_handler(signal, frame):
    print("signal handle")
    for p in ps:
      p.kill()

    time.sleep(5)
    sys.exit(0)

  signal.signal(signal.SIGINT, signal_handler)

  os.system("rm -rf {}/*".format(target))

  for i,url in feed.items():
    p = Process(i, url)
    p.start()
    ps.append(p)

  while True:
    time.sleep(5)

