const { spawn } = require("child_process");

const ffmpegArgs = (url) => [
  "-rtsp_transport",
  "tcp",
  "-i",
  url,
  "-c",
  "copy",
  "-f",
  "matroska",
  "-movflags",
  "frag_keyframe+empty_moov",
  "-reset_timestamps",
  "1",
  "pipe:1",
];

class RestreamVideo {
  constructor(rtsp_url) {
    this.rtsp_url = rtsp_url;
    this.clients = [];
    this.firstSegment = null;
    this._init();
  }

  _init() {
    const ffmpegProcess = spawn("ffmpeg", ffmpegArgs(this.rtsp_url));

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpegProcess.stdout.on("data", (data) => {
      if (this.firstSegment === null) {
        this.firstSegment = data;
      }
      for (const client of this.clients) {
        client.write(data);
      }
    });

    ffmpegProcess.on("close", (code) => {
      console.error(`FFmpeg process exited with code ${code}`);
      this.clients.forEach((client) => {
        client.end();
      });
      this.clients = [];
    });

    this._process = ffmpegProcess;
  }

  _destory() {
    this._process.kill();
  }

  register(res) {
    if (this.firstSegment) {
      res.write(this.firstSegment);
    }
    this.clients.push(res);
  }

  unregister(res) {
    this.clients = this.clients.filter((c) => c !== res);
    if (this.clients.length === 0) {
      this._destory();
    }
    return this.clients.length;
  }
}

exports.RestreamVideo = RestreamVideo;
