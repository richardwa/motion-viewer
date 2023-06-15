# Motion Viewer
- ~~server: re-mux rtsp streams into mkv/hls suitable for web page consumption~~
- server: serves js bundle and proxies motion re-stream
- client: view stream and motion clips (as saved by motion)
---

## PROD - npm run build
- builds client package
- builds server package
- server will serve static files from client packge when run, keep files in relative to each other
---

## DEV - npm run dev
- vite will run as usual from port 5173
- server will start on port 3000
- vite will proxy all calls starting with /srv to server
---

## Notes


