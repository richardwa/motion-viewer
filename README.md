# Motion Viewer
server: re-mux rtsp streams into mkv/hls suitable for web page consumption
client: view stream and motion clips (as saved by motion)

# prod build
npm run build

builds client package
builds server package
server will serve static files from client packge when run, keep files in relative to each other

## to actually depoy server

unzip dist/{app}.zip to folder accessible by service runner
use os service/process management to start, pass port number to startup cmd
node ./server/server.js {port}

# dev env

npm run dev

vite will run as usual from port 5173
server will start on port 300
vite will proxy all calls starting with /srv to server
 