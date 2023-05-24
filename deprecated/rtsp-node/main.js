const http = require("http");
const { RestreamVideo } = require("./restreamer");

const restreamers = {};
const streamConfig = [
  null, // start at 1
  "rtsp://admin:tAThGG2NAr5vjY5@192.168.2.21/Streaming/Channels/101/",
  "rtsp://rich:9876@192.168.2.163/live",
  "rtsp://rich:9876@192.168.2.190/live",
];

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.end(`
    <!DOCTYPE html>
    <html>
    <body>
        <h1>Video Player</h1>
        <video id="videoPlayer" autoplay muted controls src="/video_feed/1"></video>
    </body>
    </html>
    `);
  } else if (req.url.startsWith("/video_feed")) {
    const streamNumber = parseInt(req.url.substring("/video_feed/".length));
    if (!streamConfig[streamNumber]) {
      res.end("no config for stream #" + streamNumber);
    }

    let restreamer;
    if (restreamers[streamNumber]) {
      restreamer = restreamers[streamNumber];
    } else {
      restreamer = new RestreamVideo(streamConfig[streamNumber]);
      restreamers[streamNumber] = restreamer;
    }

    res.setHeader("Content-Type", "video/x-matroska");
    restreamer.register(res);
    req.on("close", () => {
      const remaining = restreamer.unregister(res);
      if (remaining === 0) {
        delete restreamers[streamNumber];
      }
    });
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
